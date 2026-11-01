import recitData from '../data/recits.json';
import type { Character } from './character';
import { characterStats } from './character';

export interface RecitDef {
  id: string;
  titre: string;
  texte: string;
}

export const RECITS = recitData as RecitDef[];

export function findRecit(id: string): RecitDef | undefined {
  return RECITS.find((r) => r.id === id);
}

export function knowsRecit(character: Character | null | undefined, id: string): boolean {
  return character?.recits.includes(id) ?? false;
}

/** Learns a récit, forgetting the oldest one first once at the cap (Mémoire + 1, GDD §4). */
export function learnRecit(character: Character, id: string): void {
  if (character.recits.includes(id)) return;
  const cap = characterStats(character).tales;
  character.recits.push(id);
  while (character.recits.length > cap) character.recits.shift();
}
