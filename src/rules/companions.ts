import companionData from '../data/companions.json';
import type { GameState } from '../state/gameState';
import { ATTACK_AP_COST, freshFighter, type AttackProfile, type Combatant, type Dice, type OnHit } from './combat';
import type { Tile } from '../engine/iso';

/**
 * Les compagnons (docs/gdd/jalon-3.md, étapes 1 et 2) : they travel with the hero and fight at their side, played in
 * turn by the player. Recruiting them comes with step 2; for now the developer tools add them to the party.
 */
export interface CompanionDef {
  id: string;
  name: string;
  tile: string;
  hp: number;
  defense: number;
  actionPoints: number;
  initiativeBonus: number;
  attacks: { label: string; range: number; toHitBonus: number; damage: Dice; onHit?: OnHit }[];
  /** A companion who tends wounds (Liane). */
  soin?: { amount: Dice; range: number };
  description: string;
}

export const COMPANIONS = companionData as CompanionDef[];
/** The hero and two companions at most. */
export const PARTY_MAX = 2;

export function findCompanion(id: string): CompanionDef | undefined {
  return COMPANIONS.find((c) => c.id === id);
}

export function inParty(state: GameState, id: string): boolean {
  return state.groupe.some((m) => m.id === id);
}

/** Joins with full PV; false when unknown, already there, or the party is full. */
export function joinParty(state: GameState, id: string): boolean {
  const def = findCompanion(id);
  if (!def || inParty(state, id) || state.groupe.length >= PARTY_MAX) return false;
  state.groupe.push({ id, hp: def.hp });
  return true;
}

export function leaveParty(state: GameState, id: string): void {
  state.groupe = state.groupe.filter((m) => m.id !== id);
}

/** A night's sleep: every companion's PV back. */
export function restParty(state: GameState): void {
  for (const m of state.groupe) m.hp = findCompanion(m.id)?.hp ?? m.hp;
}

/**
 * Liane sleeps again once she has forgotten Saule (« Ce que Liane veut oublier », feuille de route, chantier 4): her
 * hands are steadier, her care surer. The other ending keeps Saule's Récit.
 */
export const LIANE_RESTED_CARE: Dice = { count: 3, sides: 4 };

export function makeCompanionCombatant(def: CompanionDef, hp: number, tile: Tile, flags: Record<string, boolean> = {}): Combatant {
  const attacks: AttackProfile[] = def.attacks.map((a, i) => ({
    weaponId: `${def.id}-${i}`,
    label: a.label,
    range: a.range,
    toHitBonus: a.toHitBonus,
    damage: a.damage,
    damageBonus: 0,
    apCost: ATTACK_AP_COST,
    onHit: a.onHit,
  }));
  return {
    ...freshFighter(),
    id: `compagnon-${def.id}`,
    name: def.name,
    side: 'heroes',
    hp,
    maxHp: def.hp,
    defense: def.defense,
    actionPoints: def.actionPoints,
    maxActionPoints: def.actionPoints,
    initiative: 0,
    attacks,
    tile,
    status: { stunned: false, disarmed: false, slowed: false, burning: 0, bleeding: 0 },
    defeated: false,
    defeatText: `${def.name} s’effondre.`,
    kind: def.id,
    heal: def.id === 'liane' && def.soin && flags['liane-a-oublie'] ? { ...def.soin, amount: LIANE_RESTED_CARE } : def.soin,
    phase: 0,
  };
}

/** At or below this opinion, a companion leaves the party (and will not come back for now). */
export const AVIS_DEPART = -5;

export function avisOf(state: GameState, id: string): number {
  return state.avis[id] ?? 0;
}

/**
 * A companion who saw a choice thinks of it (only when travelling with the hero): returns the notices, and the
 * companion leaves if the opinion falls to AVIS_DEPART.
 */
export function changeAvis(state: GameState, id: string, delta: number): string[] {
  const def = findCompanion(id);
  if (!def || !inParty(state, id) || delta === 0) return [];
  state.avis[id] = avisOf(state, id) + delta;
  const first = def.name.split(' ')[0];
  const notices = [delta > 0 ? `${first} approuve` : `${first} désapprouve`];
  if (state.avis[id] <= AVIS_DEPART) {
    leaveParty(state, id);
    notices.push(`${first} en a assez, et quitte le groupe`);
  }
  return notices;
}

/** After a fight: each companion keeps its PV; one who fell gets up with 1 PV, hurt but alive. */
export function companionsAfterFight(state: GameState, fighters: Combatant[]): string[] {
  const hurt: string[] = [];
  for (const m of state.groupe) {
    const c = fighters.find((f) => f.id === `compagnon-${m.id}`);
    if (!c) continue;
    m.hp = Math.max(1, c.hp);
    if (c.defeated) hurt.push(c.name);
  }
  return hurt;
}
