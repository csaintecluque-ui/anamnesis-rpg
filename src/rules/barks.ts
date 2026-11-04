import barkData from '../data/barks.json';
import { figurantLines, type FigurantReaction } from './figurants';

/**
 * Ce que les habitants nommés disent d'eux-mêmes quand le héros passe près d'eux (« comme dans Fallout », Cyril,
 * 2026-11-04 ; docs/gdd/figurants.md) : une ou deux phrases au-dessus de leur tête, sans dialogue ; les mêmes
 * réactions à l'histoire que les passants. Le dialogue complet s'ouvre toujours au clic.
 */
export interface BarkDef {
  /** The NPC's object name on the map (src/data/npcs.json). */
  id: string;
  lines: string[];
  reactions?: FigurantReaction[];
}

export const BARKS = barkData as BarkDef[];

export const findBarks = (id: string): BarkDef | undefined => BARKS.find((b) => b.id === id);

/** What they say now: the story's latest echo in their mouth, or their usual lines. */
export const barkLines = (def: BarkDef, state: Parameters<typeof figurantLines>[1]): string[] => figurantLines(def, state);
