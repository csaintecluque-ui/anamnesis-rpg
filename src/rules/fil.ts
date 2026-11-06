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
  /**
   * One per continent [canon : sept continents] ; `trouvee` / `prise` : the flags of its fate, once written ; `trace` :
   * the quest that puts the hero on its track (test du 2026-11-06 : a crate is shown once its trace is known).
   */
  caisses: { id: string; continent: string; trouvee?: string; prise?: string; trace: string }[];
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
  /** The crates whose trace is known (test du 2026-11-06, décision de Cyril), in the order of the continents. */
  caisses: { continent: string; etat: CaisseEtat }[];
  /** Whether the hero knows there are seven (the page of the last departure): then the others are counted. */
  sept: boolean;
  /** The crates not traced yet. */
  inconnues: number;
  piste?: { texte: string; cible?: string };
}

/** The flag that tells the hero there were seven crates: the page of the last departure (docs/gdd/fil-directeur.md). */
const SEPT_FLAG = 'page-lue';

export function filPage(state: Pick<GameState, 'quests' | 'flags'>): FilPage {
  const savoirs = FIL.savoirs.filter((s) => holds(state, s)).map((s) => s.texte);
  const piste = FIL.pistes.find((p) => holds(state, p));
  const etat = (c: FilData['caisses'][number]): CaisseEtat =>
    c.trouvee && state.flags[c.trouvee] ? 'trouvee' : c.prise && state.flags[c.prise] ? 'prise' : 'inconnue';
  // On its track: its quest begun, or its fate already written.
  const traced = FIL.caisses.filter((c) => !!state.quests[c.trace] || etat(c) !== 'inconnue');
  return {
    question: holds(state, FIL.question) ? FIL.question.texte : undefined,
    savoirs: savoirs.length ? savoirs : [FIL.avant],
    caisses: traced.map((c) => ({ continent: c.continent, etat: etat(c) })),
    sept: !!state.flags[SEPT_FLAG],
    inconnues: FIL.caisses.length - traced.length,
    piste: piste ? { texte: piste.texte, cible: piste.cible } : undefined,
  };
}
