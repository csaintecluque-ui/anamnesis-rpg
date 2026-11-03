import recitData from '../data/recits.json';
import type { Character } from './character';
import { characterStats } from './character';

export interface RecitDef {
  id: string;
  titre: string;
  texte: string;
  /** A Récit of the main story (one per chapter): never forgotten, and not counted against the cap (decision of Cyril, 2026-11-02). */
  principal?: boolean;
  /** What it speaks of, for the publics of the veillées (src/rules/veillees.ts, THEMES). */
  themes?: string[];
}

export const RECITS = recitData as RecitDef[];

export function findRecit(id: string): RecitDef | undefined {
  return RECITS.find((r) => r.id === id);
}

export function knowsRecit(character: Character | null | undefined, id: string): boolean {
  return character?.recits.includes(id) ?? false;
}

const isPrincipal = (id: string): boolean => findRecit(id)?.principal === true;

/**
 * Learns a récit. Past the cap (Mémoire + 1, docs/gdd/memoire.md), nothing is forgotten by itself any more: the hero
 * chooses which story to let go (`recitOverflow`, OubliScene ; feuille de route, chantier 1). The Récits of the main
 * story are never forgotten and do not count against the cap (decision of Cyril, 2026-11-02).
 */
export function learnRecit(character: Character, id: string): void {
  if (character.recits.includes(id)) return;
  character.recits.push(id);
}

/** The Récits that count against the cap: all but those of the main story. */
export function ordinaryRecits(character: Character): string[] {
  return character.recits.filter((r) => !isPrincipal(r));
}

/** How many ordinary Récits the hero keeps at most; `bonus`: the rank in the order of the Gardiens, one more by rank. */
export function recitCap(character: Character, bonus = 0): number {
  return characterStats(character).tales + bonus;
}

/** How many Récits too many the hero carries: as many to choose and let go. */
export function recitOverflow(character: Character, bonus = 0): number {
  return Math.max(0, ordinaryRecits(character).length - recitCap(character, bonus));
}

/** Lets an ordinary Récit go; a Récit of the main story stays. */
export function forgetRecit(character: Character, id: string): boolean {
  if (isPrincipal(id) || !character.recits.includes(id)) return false;
  character.recits.splice(character.recits.indexOf(id), 1);
  return true;
}
