import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { parseTiledMap } from '../engine/tiledMap';
import type { GameState } from '../state/gameState';
import { ATTRIBUTES, SKILLS, SKILL_RANK_MAX } from './attributes';
import { CREATION, characterStats, type Character } from './character';
import { ENCOUNTERS } from './combat';
import { QUESTS } from './dialogue';
import { FIGURANTS } from './figurants';
import { addItem } from './inventory';
import { xpForLevel } from './leveling';
import { restoreResonance } from './magic';
import { RECITS } from './recits';
import { REPUTATION } from './reputation';
import { RENCONTRES, WORLD } from './world';

/**
 * Hidden testing tools (docs/gdd/interface.md, « Mode test » and « Mode développeur »): not part of the game's rules.
 * They change the state freely, within what a save can hold.
 */
export const TEST_FERS = 50;
/** Level of the overpowered character: high enough for every test, below any level-up screen. */
export const OVERPOWERED_LEVEL = 10;
export const OVERPOWERED_FERS = 9999;
/** The best of each slot, given and worn; the other crystal is given too, to swap at will. */
const OVERPOWERED_GEAR = { mainDroite: 'marteau-forge', mainGauche: 'arbalete-ferros', armure: 'cuirasse-rivetee', cristal: 'cristal-forge' } as const;
const OVERPOWERED_EXTRA = ['cristal-vie'];
/** Arrows and bolts, so that the crossbow in hand (and a bow) can shoot (docs/gdd/combat.md, « Munitions »). */
const OVERPOWERED_AMMO = { carreaux: 99, fleches: 99 };

export function addTestFers(character: Character): void {
  character.fers += TEST_FERS;
}

/** Every Point de Résonance back (Outils de dev). */
export { restoreResonance as restoreFullResonance } from './magic';

/** Back to full PV; returns how many were restored. */
export function restoreFullHp(character: Character): number {
  const max = characterStats(character).maxHp;
  const restored = Math.max(0, max - character.hp);
  character.hp = max;
  return restored;
}

/**
 * The overpowered character (demande de Cyril, 2026-11-02) : every attribute and skill at its maximum, so that every
 * test of a dialogue is open and every roll succeeds but on a 1 ; level 10, full PV, plenty of Fers, the best gear worn,
 * and every Récit known.
 */
export function makeOverpowered(character: Character): void {
  for (const a of ATTRIBUTES) character.attributes[a.id] = CREATION.maxScore;
  for (const s of SKILLS) character.skills[s.id] = SKILL_RANK_MAX;
  character.level = Math.max(character.level, OVERPOWERED_LEVEL);
  character.xp = Math.max(character.xp, xpForLevel(character.level));
  character.fers = Math.max(character.fers, OVERPOWERED_FERS);
  for (const [slot, itemId] of Object.entries(OVERPOWERED_GEAR) as [keyof typeof OVERPOWERED_GEAR, string][]) {
    if (!character.inventory.some((s) => s.itemId === itemId)) addItem(character, itemId);
    character.equipment[slot] = itemId;
  }
  for (const id of OVERPOWERED_EXTRA) if (!character.inventory.some((s) => s.itemId === id)) addItem(character, id);
  for (const [id, count] of Object.entries(OVERPOWERED_AMMO)) {
    const have = character.inventory.find((s) => s.itemId === id)?.count ?? 0;
    if (have < count) addItem(character, id, count - have);
  }
  for (const r of RECITS) if (!character.recits.includes(r.id)) character.recits.push(r.id);
  character.hp = characterStats(character).maxHp;
  restoreResonance(character);
}

export type QuestState = 'none' | 'active' | 'done';

/** none → active → done → none: the developer cycles a quest through its states. */
export function cycleQuest(state: GameState, id: string): QuestState {
  const now: QuestState = (state.quests[id] as QuestState | undefined) ?? 'none';
  const next: QuestState = now === 'none' ? 'active' : now === 'active' ? 'done' : 'none';
  if (next === 'none') delete state.quests[id];
  else state.quests[id] = next;
  return next;
}

/** The whole world map known at once: every place's flag (src/data/world.json, `revealedBy`). */
export function revealWorld(state: GameState): void {
  for (const p of WORLD.places) if (p.revealedBy) state.flags[p.revealedBy] = true;
}

export function toggleFlag(state: GameState, flag: string): boolean {
  if (state.flags[flag]) delete state.flags[flag];
  else state.flags[flag] = true;
  return !!state.flags[flag];
}

/** Every story flag the game reads or sets, for the developer's list (dialogues, maps, quests, reputation…). */
export function allFlags(): string[] {
  const found = new Set<string>();
  const add = (value: unknown) => {
    if (typeof value === 'string') for (const f of value.split(',')) if (f.trim()) found.add(f.trim());
  };
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') {
      for (const [key, v] of Object.entries(value)) {
        if (key === 'setFlag' || key === 'flag' || key === 'notFlag') add(v);
        else walk(v);
      }
    }
  };
  walk(DIALOGUES);
  walk(FIGURANTS);
  walk(REPUTATION);
  walk(RENCONTRES.map((r) => r.story ?? {}));
  for (const q of QUESTS) for (const e of q.etapes ?? []) add(e.si);
  for (const e of ENCOUNTERS) add(e.victoryFlag);
  for (const json of Object.values(MAPS)) {
    for (const o of parseTiledMap(json).objects) {
      add(o.properties.apparaitSi);
      add(o.properties.disparaitSi);
      add(o.properties.verrou);
    }
  }
  return [...found].sort((a, b) => a.localeCompare(b, 'fr'));
}
