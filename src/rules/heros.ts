import herosData from '../data/heros.json';
import type { GameState } from '../state/gameState';
import { storyChapter } from './combat';

/**
 * Le héros qui a oublié (piste A « La main lâchée », validée par Cyril le 2026-11-03 ; étude, F1 ;
 * docs/univers/personnages/heros.md). Le jeu ne dit jamais la vérité avant la fin : il rend des fragments, dans
 * l'ordre inverse de l'oubli (la vapeur, la main, la voix qui compte ; le quai viendra à Altavent). Ils reviennent la
 * nuit, à l'auberge, quand l'histoire en est là, ou plus tôt au fond des voies endormies ; la page « Ce qui n'est pas
 * à moi » du Livre des Échos les range toujours dans cet ordre.
 */

interface FragmentDef {
  id: string;
  flag: string;
  /** The story's chapter from which it may come back at night. */
  chapitre: number;
  titre: string;
  /** As the hero writes it, in the journal. */
  texte: string;
  /** The night it comes back, at an inn. */
  reve: string;
}

interface Line {
  flag: string;
  titre: string;
  texte: string;
}
const HEROS = herosData as { page: string; enfant: Line; fragments: FragmentDef[]; manque: string; quai: Line };
export const FRAGMENTS = HEROS.fragments;

export function findFragment(id: string): FragmentDef | undefined {
  return FRAGMENTS.find((f) => f.id === id);
}

/** A night's sleep: the first fragment not yet back whose chapter the story has reached. Sets it; returns the dream. */
export function dreamFragment(state: Pick<GameState, 'flags' | 'quests'>): string | null {
  const chapter = storyChapter(state.quests);
  const due = FRAGMENTS.find((f) => !state.flags[f.flag] && f.chapitre <= chapter);
  if (!due) return null;
  state.flags[due.flag] = true;
  return due.reve;
}

export interface HerosPage {
  titre: string;
  /** In the order of the return; a line not back yet has no text. */
  lignes: { titre: string; texte: string | null }[];
  /** Said under the lines while something is still missing. */
  manque: string | null;
}

/** The page « Ce qui n'est pas à moi », once something has come back; null before. */
export function herosPage(state: Pick<GameState, 'flags'>): HerosPage | null {
  const known = (flag: string) => !!state.flags[flag];
  if (!known(HEROS.enfant.flag) && !known(HEROS.quai.flag) && !FRAGMENTS.some((f) => known(f.flag))) return null;
  return {
    titre: HEROS.page,
    lignes: [
      { titre: HEROS.enfant.titre, texte: known(HEROS.enfant.flag) ? HEROS.enfant.texte : null },
      ...FRAGMENTS.map((f) => ({ titre: f.titre, texte: known(f.flag) ? f.texte : null })),
      // The quai comes back at the end only, in the train to Altavent (chapitre 9): the hero knows, then.
      { titre: HEROS.quai.titre, texte: known(HEROS.quai.flag) ? HEROS.quai.texte : null },
    ],
    // The quai comes back at Altavent only (chapter 5): until then, something is always missing.
    manque: known(HEROS.quai.flag) ? null : HEROS.manque,
  };
}
