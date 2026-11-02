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
 * Learns a récit, forgetting the oldest one first once at the cap (Mémoire + 1, docs/gdd/memoire.md). The Récits of the
 * main story are never forgotten and do not count against the cap (decision of Cyril, 2026-11-02).
 */
export function learnRecit(character: Character, id: string): void {
  if (character.recits.includes(id)) return;
  const cap = characterStats(character).tales;
  character.recits.push(id);
  const ordinary = () => character.recits.filter((r) => !isPrincipal(r));
  while (ordinary().length > cap) character.recits.splice(character.recits.indexOf(ordinary()[0]), 1);
}
