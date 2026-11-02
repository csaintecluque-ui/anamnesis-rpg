import type { GameState } from '../state/gameState';
import { ENEMIES, type EnemyDef } from './combat';

/**
 * Le bestiaire (docs/gdd/combat.md, « Bestiaire ») : every kind of enemy met, and how many were beaten. Its pages
 * quote the canon (« Faune & flore par continent », Notion) where it describes the creature.
 */
export function recordMet(state: GameState, kinds: string[]): void {
  for (const k of kinds) if (!(k in state.bestiaire)) state.bestiaire[k] = 0;
}

export function recordDefeated(state: GameState, kinds: string[]): void {
  for (const k of kinds) state.bestiaire[k] = (state.bestiaire[k] ?? 0) + 1;
}

export interface BestiaryEntry {
  enemy: EnemyDef;
  defeated: number;
}

/** The pages filled so far, in the order of enemies.json. */
export function bestiaryEntries(state: GameState): BestiaryEntry[] {
  return ENEMIES.filter((e) => e.id in state.bestiaire).map((enemy) => ({ enemy, defeated: state.bestiaire[enemy.id] }));
}
