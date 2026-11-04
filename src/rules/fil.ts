import filData from '../data/fil.json';
import type { GameState } from '../state/gameState';

/**
 * Le fil (docs/gdd/fil-directeur.md, validé par Cyril le 2026-11-04) : une page du journal qui dit la question que le
 * joueur porte, ce qu'il sait (une ligne de plus à chaque pas), les sept caisses du dernier train, et la piste suivante,
 * marquée aussi sur la carte du monde. Rien à sauvegarder : tout se lit sur les quêtes et les repères.
 */

interface When {
  quest?: string;
  status?: 'active' | 'done';
  flag?: string;
}
type Line = When & { texte: string };

export type CaisseEtat = 'inconnue' | 'trouvee' | 'prise';

interface FilData {
  question: Line;
  avant: string;
  savoirs: Line[];
  /** One per continent [canon : sept continents] ; `trouvee` / `prise` : the flags of its fate, once written. */
  caisses: { id: string; continent: string; trouvee?: string; prise?: string }[];
  /** Most advanced first: the first whose condition holds is the lead. `cible`: a world place id, or a far label. */
  pistes: (Line & { cible?: string })[];
}

export const FIL = filData as FilData;

const holds = (state: Pick<GameState, 'quests' | 'flags'>, w: When): boolean =>
  (!w.quest || state.quests[w.quest] === (w.status ?? 'done')) && (!w.flag || !!state.flags[w.flag]);

export interface FilPage {
  /** The question, once the page of the last departure has been read. */
  question?: string;
  /** What is known, in the order of the story; before anything, where it starts. */
  savoirs: string[];
  caisses: { continent: string; etat: CaisseEtat }[];
  piste?: { texte: string; cible?: string };
}

export function filPage(state: Pick<GameState, 'quests' | 'flags'>): FilPage {
  const savoirs = FIL.savoirs.filter((s) => holds(state, s)).map((s) => s.texte);
  const piste = FIL.pistes.find((p) => holds(state, p));
  return {
    question: holds(state, FIL.question) ? FIL.question.texte : undefined,
    savoirs: savoirs.length ? savoirs : [FIL.avant],
    caisses: FIL.caisses.map((c) => ({
      continent: c.continent,
      etat: c.trouvee && state.flags[c.trouvee] ? 'trouvee' : c.prise && state.flags[c.prise] ? 'prise' : 'inconnue',
    })),
    piste: piste ? { texte: piste.texte, cible: piste.cible } : undefined,
  };
}
