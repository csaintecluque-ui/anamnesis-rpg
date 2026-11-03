import type { Tile } from '../engine/iso';
import {
  attackCost,
  canAttack,
  distance,
  endTurn,
  isDefeat,
  isVictory,
  lingeringDamage,
  moveAlong,
  resolveAttack,
  resolveHeal,
  rollInitiative,
  startTurn,
  coverBetween,
  type Combatant,
  type Rng,
  type Zone,
} from './combat';
import { freeFor, nextEnemyAction, pathNextTo, type AiContext } from './combatAi';

/**
 * La simulation des combats (feuille de route, chantier 3 : « aucune tactique ne dépasse les autres de plus de 15
 * points de victoire »). The same rules and the same enemy AI as the combat screen, on a plain arena; the heroes play
 * a fixed tactic. Used by the tests (src/rules/combatSim.test.ts) and to tune the numbers (docs/gdd/combat.md).
 */

/** Where one aims, all fight long (the body when the target already suffers that zone's effect). */
export type Tactic = Zone;
export const TACTICS: Tactic[] = ['corps', 'tete', 'bras', 'jambes'];

export interface SimArena {
  cols: number;
  rows: number;
  /** Obstacles: cell « col,row » → the cover it gives (they block the way). */
  obstacles: Record<string, number>;
}

/** 11 × 9 like the fights on the map, with four obstacles in the middle. */
export const PLAIN_ARENA: SimArena = { cols: 11, rows: 9, obstacles: { '5,2': 2, '5,6': 4, '3,4': 2, '7,4': 2 } };

export function arenaContext(arena: SimArena, combatants: Combatant[]): AiContext {
  const inside = (t: Tile) => t.col >= 0 && t.row >= 0 && t.col < arena.cols && t.row < arena.rows;
  return {
    combatants,
    open: (t) => inside(t) && !(`${t.col},${t.row}` in arena.obstacles),
    coverAt: (t) => arena.obstacles[`${t.col},${t.row}`] ?? 0,
    isEdge: (t) => t.col === 0 || t.row === 0 || t.col === arena.cols - 1 || t.row === arena.rows - 1,
  };
}

/** The heroes' side: strike the weakest enemy in reach at the tactic's zone, else walk to the nearest. */
function heroTurn(hero: Combatant, tactic: Tactic, ctx: AiContext, rng: Rng): void {
  const zoneStatus = { corps: null, tete: 'stunned', bras: 'disarmed', jambes: 'slowed' } as const;
  for (let guard = 0; guard < 20 && hero.actionPoints > 0 && !hero.defeated; guard++) {
    const enemies = ctx.combatants.filter((c) => c.side !== hero.side && !c.defeated);
    if (!enemies.length) return;
    const attack = hero.attacks[0];
    const inReach = enemies.filter((e) => canAttack(hero, attack, e)).sort((a, b) => a.hp - b.hp);
    if (inReach.length) {
      const target = inReach[0];
      const effect = zoneStatus[tactic];
      let zone: Zone = effect && !target.status[effect] ? tactic : 'corps';
      if (!canAttack(hero, attack, target, zone)) zone = 'corps';
      resolveAttack(hero, attack, target, zone, coverBetween(hero.tile, target.tile, ctx.coverAt), rng, ctx.combatants);
      continue;
    }
    if (hero.actionPoints < 1) return;
    const nearest = enemies.sort((a, b) => distance(hero.tile, a.tile) - distance(hero.tile, b.tile))[0];
    const walk = freeFor(hero, ctx);
    const path = pathNextTo(hero.tile, nearest.tile, walk);
    if (!path || !path.length) return;
    // A shooter walks only until in range, and keeps PA for the shot.
    const stop = attack.range > 1 ? path.findIndex((t) => distance(t, nearest.tile) <= attack.range) : -1;
    const steps = stop >= 0 ? path.slice(0, stop + 1) : path;
    const affordable = Math.max(1, Math.min(steps.length, hero.actionPoints - (stop >= 0 ? attackCost(attack) : 0)));
    moveAlong(hero, steps.slice(0, affordable));
  }
}

function enemyTurn(enemy: Combatant, ctx: AiContext, rng: Rng): void {
  for (let guard = 0; guard < 20; guard++) {
    const action = nextEnemyAction(enemy, ctx);
    if (action.kind === 'end') return;
    if (action.kind === 'flee') {
      enemy.fled = true;
      enemy.defeated = true;
      return;
    }
    if (action.kind === 'heal') resolveHeal(enemy, action.target, rng);
    else if (action.kind === 'attack') resolveAttack(enemy, action.attack, action.target, 'corps', action.cover, rng, ctx.combatants);
    else if (moveAlong(enemy, action.path).length === 0) return;
  }
}

export interface FightOutcome {
  won: boolean;
  rounds: number;
  /** Share of the heroes' PV left (0 when lost). */
  hpLeft: number;
}

/** One fight to the end (or 40 rounds: a draw counts as lost). Initiative bonuses by combatant id. */
export function simulateFight(
  heroes: Combatant[],
  enemies: Combatant[],
  tactic: Tactic,
  rng: Rng,
  initiative: Record<string, number> = {},
  arena: SimArena = PLAIN_ARENA,
): FightOutcome {
  const all = [...heroes, ...enemies];
  const ctx = arenaContext(arena, all);
  const order = rollInitiative(all, initiative, rng);
  for (let round = 1; round <= 40; round++) {
    for (const c of order) {
      if (c.defeated) continue;
      lingeringDamage(c, rng);
      if (!c.defeated) {
        startTurn(c);
        if (c.side === 'heroes') heroTurn(c, tactic, ctx, rng);
        else enemyTurn(c, ctx, rng);
        endTurn(c);
      }
      // The hero's death ends it, whatever the companions.
      if (heroes[0].defeated || isDefeat(all)) return { won: false, rounds: round, hpLeft: 0 };
      if (isVictory(all)) return { won: true, rounds: round, hpLeft: heroes.reduce((n, h) => n + h.hp, 0) / heroes.reduce((n, h) => n + h.maxHp, 0) };
    }
  }
  return { won: false, rounds: 40, hpLeft: 0 };
}

/** A seeded random generator (mulberry32), for fights that replay the same. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Victory rate (0 to 1) of a tactic over `runs` fights; `setup` builds fresh fighters for each. */
export function winRate(
  setup: () => { heroes: Combatant[]; enemies: Combatant[]; initiative?: Record<string, number> },
  tactic: Tactic,
  runs: number,
  seed = 1,
): number {
  let wins = 0;
  for (let i = 0; i < runs; i++) {
    const { heroes, enemies, initiative } = setup();
    if (simulateFight(heroes, enemies, tactic, seededRng(seed * 100003 + i), initiative).won) wins++;
  }
  return wins / runs;
}
