import type { Tile } from '../engine/iso';
import { findPath, reachable } from '../engine/pathfinding';
import {
  FLEE_SHARE,
  attackCost,
  canAttack,
  canHeal,
  coverBetween,
  distance,
  hasCapacite,
  type AttackProfile,
  type Combatant,
} from './combat';

/**
 * L'IA ennemie (feuille de route, chantier 3 ; docs/gdd/combat.md, « IA ») : one decision at a time, pure, shared by
 * the combat screen and the simulation (src/rules/combatSim.ts).
 * - Fuite : under a third of its PV, it runs to the edge of the fight and leaves it.
 * - A healer tends an ally fallen under 60 % of its PV.
 * - It finishes the wounded: of the heroes it can strike, the one with the fewest PV.
 * - A shooter (Tir) walks to a cell in range where an obstacle shelters it from its target.
 */

export interface AiContext {
  combatants: Combatant[];
  /** A cell one can stand on (in the arena, no obstacle); occupation is checked here. */
  open: (tile: Tile) => boolean;
  /** Cover the obstacle on that cell gives (0, 2 or 4). */
  coverAt: (tile: Tile) => number;
  /** On the border of the fight: where one leaves it. */
  isEdge: (tile: Tile) => boolean;
}

export type AiAction =
  | { kind: 'heal'; target: Combatant }
  | { kind: 'attack'; target: Combatant; attack: AttackProfile; cover: number }
  | { kind: 'move'; path: Tile[] }
  | { kind: 'flee' }
  | { kind: 'end' };

/** A healer tends an ally under this share of its PV. */
export const HEAL_UNDER = 0.6;

const same = (a: Tile, b: Tile) => a.col === b.col && a.row === b.row;

/** Free to walk on: open, and nobody standing there (but the mover itself). */
export function freeFor(mover: Combatant, ctx: AiContext): (tile: Tile) => boolean {
  return (tile) => ctx.open(tile) && !ctx.combatants.some((c) => c !== mover && !c.defeated && same(c.tile, tile));
}

/** Whether it should run: Fuite, and hurt enough. */
export function wantsToFlee(c: Combatant): boolean {
  return hasCapacite(c, 'fuite') && c.hp <= c.maxHp * FLEE_SHARE;
}

/** The next thing an enemy does this turn; `end` when it is done. */
export function nextEnemyAction(enemy: Combatant, ctx: AiContext): AiAction {
  if (enemy.defeated || enemy.actionPoints <= 0) return { kind: 'end' };
  const walk = freeFor(enemy, ctx);

  if (wantsToFlee(enemy)) {
    if (ctx.isEdge(enemy.tile)) return { kind: 'flee' };
    const paths = [...reachable(enemy.tile, 30, walk).values()].filter((p) => ctx.isEdge(p[p.length - 1]));
    const shortest = paths.sort((a, b) => a.length - b.length)[0];
    if (shortest) return { kind: 'move', path: shortest.slice(0, enemy.actionPoints) };
    // Cornered: it fights on.
  }

  const hurt = ctx.combatants.find((a) => a !== enemy && canHeal(enemy, a) && a.hp <= a.maxHp * HEAL_UNDER);
  if (hurt) return { kind: 'heal', target: hurt };

  const attack = enemy.attacks[0];
  const heroes = ctx.combatants.filter((c) => c.side !== enemy.side && !c.defeated);
  if (!attack || heroes.length === 0) return { kind: 'end' };
  const byWeakness = (a: Combatant, b: Combatant) => a.hp - b.hp || distance(enemy.tile, a.tile) - distance(enemy.tile, b.tile);

  // Finish the wounded: of those within reach, the weakest.
  const inReach = heroes.filter((h) => canAttack(enemy, attack, h)).sort(byWeakness);
  if (inReach.length) {
    const target = inReach[0];
    return { kind: 'attack', target, attack, cover: coverBetween(enemy.tile, target.tile, ctx.coverAt) };
  }
  if (enemy.status.disarmed) return { kind: 'end' };
  // A shooter already in range, short of PA for a shot: it stays where it is.
  if (attack.range > 1 && heroes.some((h) => distance(enemy.tile, h.tile) <= attack.range) && enemy.actionPoints < attackCost(attack)) return { kind: 'end' };

  // Walk: to strike this turn if it can (the weakest it can reach), else towards the nearest.
  const budget = enemy.actionPoints - attackCost(attack);
  const cells = reachable(enemy.tile, Math.max(0, enemy.actionPoints), walk);
  const standFor = (target: Combatant): Tile[] | null => {
    const spots = [...cells.values()].filter((p) => distance(p[p.length - 1], target.tile) <= attack.range);
    if (!spots.length) return null;
    // A shooter prefers cover from its target, then the shortest walk; others, the shortest walk.
    const shelter = (p: Tile[]) => (attack.range > 1 ? coverBetween(target.tile, p[p.length - 1], ctx.coverAt) : 0);
    spots.sort((a, b) => shelter(b) - shelter(a) || a.length - b.length);
    return spots[0];
  };
  if (budget >= 1) {
    for (const target of [...heroes].sort(byWeakness)) {
      const path = standFor(target);
      if (path && path.length <= budget) return { kind: 'move', path };
    }
  }
  const nearest = [...heroes].sort((a, b) => distance(enemy.tile, a.tile) - distance(enemy.tile, b.tile))[0];
  const path = pathNextTo(enemy.tile, nearest.tile, walk) ?? closerTo(enemy.tile, nearest.tile, cells);
  if (!path || path.length === 0) return { kind: 'end' };
  // A shooter stops as soon as it has the target in range.
  const stop = attack.range > 1 ? path.findIndex((t) => distance(t, nearest.tile) <= attack.range) : -1;
  const steps = (stop >= 0 ? path.slice(0, stop + 1) : path).slice(0, enemy.actionPoints);
  return steps.length ? { kind: 'move', path: steps } : { kind: 'end' };
}

/**
 * Every cell next to the target is taken (a hero backed against the trees, the Golem beside him): rather than wait,
 * the enemy comes as close as it can, ready to strike if a place opens (test du 2026-11-06 : les deux Rôdeurs du
 * Golem ne bougeaient plus de tout le combat). Null when no reachable cell is closer than where it stands.
 */
function closerTo(from: Tile, target: Tile, cells: Map<string, Tile[]>): Tile[] | null {
  let best: Tile[] | null = null;
  let bestDistance = distance(from, target);
  for (const p of cells.values()) {
    const end = p[p.length - 1];
    if (!end) continue;
    const d = distance(end, target);
    if (d < bestDistance || (best && d === bestDistance && p.length < best.length)) {
      best = p;
      bestDistance = d;
    }
  }
  return best;
}

/** The shortest path to a cell next to `target` ([] when already there, null when there is none). */
export function pathNextTo(from: Tile, target: Tile, walk: (tile: Tile) => boolean): Tile[] | null {
  let best: Tile[] | null = null;
  for (const dc of [-1, 0, 1]) {
    for (const dr of [-1, 0, 1]) {
      const tile = { col: target.col + dc, row: target.row + dr };
      if ((dc === 0 && dr === 0) || !walk(tile)) continue;
      if (same(tile, from)) return [];
      const p = findPath(from, tile, walk);
      if (p && (!best || p.length < best.length)) best = p;
    }
  }
  return best;
}
