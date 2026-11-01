import type { Dialogue } from '../../rules/dialogue';
import ilyane from './ilyane.json';
import tobias from './tobias.json';

/** Dialogue files by NPC id (the "pnj" objects of the maps). */
export const DIALOGUES: Record<string, Dialogue> = {
  ilyane: ilyane as Dialogue,
  tobias: tobias as Dialogue,
};
