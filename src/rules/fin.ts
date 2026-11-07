import type { GameState } from '../state/gameState';
import { addItem, ownedCount, removeItem } from './inventory';

/**
 * La fin du jeu (chapitre 9, « La voie sept » ; docs/gdd/chapitre-9.md, tranché par Claude sur délégation de Cyril le
 * 2026-11-07). Tout se lit sur les repères du jeu : où est chaque pièce de la machine, ce que le héros a fait pour la
 * dame en gris, les listes de noms qu'il connaît, ce qu'Ilyane a perdu. Les dialogues l'interrogent par
 * `{ fin: … }` (conditions) et agissent par `{ finale: … }` (effets).
 */

export const CONTINENTS = ['verdantis', 'ferros', 'terminus', 'zephyria', 'marisol', 'communion', 'glacialis'] as const;
export type Continent = (typeof CONTINENTS)[number];

export const pieceItem = (c: Continent): string => `piece-${c}`;

/**
 * Where a piece of the machine stands at the finale: carried by the hero, entrusted (brought back by Hesper or Ilyane),
 * on the quai sept itself (Verdantis, left under the Faille), taken by the Réveilleurs, or out of reach (the sea, the
 * ice, a halte, the Cendrière, the Fonds Muet).
 */
export type PieceWhere = 'heros' | 'confiee' | 'quai' | 'prise' | 'ailleurs';

/** The ends that leave a piece in someone's keeping, who sends it back for the finale. */
const ENTRUSTED: Partial<Record<Continent, string>> = {
  verdantis: 'fin-sous-la-faille-gardiens',
  ferros: 'fin-caisse-cendriere-archives',
  terminus: 'fin-caisse-sans-main-confiee',
  marisol: 'fin-mer-rend-amiraute',
  communion: 'fin-plus-lieu-longue-ombre',
  glacialis: 'fin-glace-pris-college',
};

/** Who keeps each entrusted piece, for the words of Hesper and the epilogue. */
export const KEEPERS: Record<Continent, string> = {
  verdantis: 'Ilyane',
  ferros: 'Noam, aux Archives',
  terminus: 'Ambroise, au Fonds Muet',
  zephyria: '',
  marisol: 'l’Amirauté',
  communion: 'la Longue-Ombre',
  glacialis: 'le Collège des 9 Miroirs',
};

/** The flag set once an entrusted piece has been handed back (Hesper, Ilyane). */
const returnedFlag = (c: Continent): string => `piece-${c}-rendue`;
/** The flag set once the Réveilleurs' pieces are back in the hero's hands (the quai sept). */
export const TAKEN_BACK_FLAG = 'pieces-reprises';
/** The pieces given to the Réveilleurs (« La voie déchirée »). */
export const GIVEN_FLAG = 'pieces-donnees';

export function pieceWhere(state: Pick<GameState, 'flags' | 'character'>, c: Continent): PieceWhere {
  const f = state.flags;
  if (f[`caisse-${c}-prise`] && !f[TAKEN_BACK_FLAG]) return 'prise';
  if (state.character && ownedCount(state.character, pieceItem(c)) > 0) return 'heros';
  if (f[GIVEN_FLAG]) return 'ailleurs';
  if (f[`caisse-${c}-prise`] && f[TAKEN_BACK_FLAG]) return 'heros';
  const entrusted = ENTRUSTED[c];
  if (entrusted && f[entrusted]) return f[returnedFlag(c)] ? 'heros' : 'confiee';
  if (c === 'verdantis' && f['fin-sous-la-faille-laissee']) return 'quai';
  return 'ailleurs';
}

/** How many pieces the Réveilleurs hold (the caisses taken: 0 to 6, Verdantis is never taken). */
export function piecesPrises(state: Pick<GameState, 'flags'>): number {
  return CONTINENTS.filter((c) => state.flags[`caisse-${c}-prise`]).length;
}

/** Every caisse has a fate: the finale can begin (with « Ce que la glace a pris » done). */
export function finaleReady(state: Pick<GameState, 'flags' | 'quests'>): boolean {
  if (state.quests['glace-pris'] !== 'done' || state.quests['sous-la-faille'] !== 'done') return false;
  return CONTINENTS.filter((c) => c !== 'verdantis').every((c) => state.flags[`caisse-${c}-reglee`]);
}

/** What the hero did for the dame en gris (+1 each) and against her (−1 each), from Sept-Portes to Khrysos. */
const FOR_EDDA = ['edda-eau', 'edda-partage', 'edda-tout', 'edda-sauvee-calme', 'fin-memoires-monde-perdu-silence', 'descendu-edda', 'conque-ecoutee'];
const AGAINST_EDDA = ['edda-raccompagnee', 'edda-depouillee', 'edda-marchandee', 'edda-laissee-calme', 'cristal-edda-vole'];
/** She turns against those who pay her at this score. */
export const EDDA_TURNS_AT = 2;

export function eddaScore(state: Pick<GameState, 'flags'>): number {
  return FOR_EDDA.filter((f) => state.flags[f]).length - AGAINST_EDDA.filter((f) => state.flags[f]).length;
}

/** The lists of six names the hero has read (Verdantis's was drowned: only ages). */
const LIST_FLAGS: Partial<Record<Continent, string>> = {
  ferros: 'caisse-ferros-trouvee',
  terminus: 'caisse-terminus-trouvee',
  zephyria: 'caisse-zephyria-trouvee',
  marisol: 'caisse-marisol-trouvee',
  communion: 'caisse-communion-trouvee',
  glacialis: 'caisse-glacialis-vue',
};

export function listsKnown(state: Pick<GameState, 'flags'>): Continent[] {
  return CONTINENTS.filter((c) => {
    const flag = LIST_FLAGS[c];
    return !!flag && !!state.flags[flag];
  });
}

/** The truth told to the Réveilleurs' men needs four lists at least. */
export const LISTS_FOR_TRUTH = 4;

/** Pieces that would be on the frame if the train were called now: all but those out of reach or still theirs. */
export function piecesAtHand(state: Pick<GameState, 'flags' | 'character'>): Continent[] {
  return CONTINENTS.filter((c) => {
    const where = pieceWhere(state, c);
    return where === 'heros' || where === 'quai';
  });
}

/** The flag that records how many pieces the Faille had to replace, when the train was called (fin-manque-0 … 7). */
const missingFlag = (n: number): string => `fin-manque-${n}`;

export function missingAtCall(state: Pick<GameState, 'flags'>): number {
  for (let n = 0; n <= 7; n++) if (state.flags[missingFlag(n)]) return n;
  return 0;
}

/**
 * What the maladie des souvenirs has taken from Ilyane: one step for each caisse the Réveilleurs took (a voie torn
 * open), and one for each piece the Faille replaced at the call. « Le dernier passager » gives everything back.
 */
export function ilyaneLoss(state: Pick<GameState, 'flags'>): number {
  if (state.flags['fin-voie-sept-monte']) return 0;
  const torn = state.flags['fin-voie-sept-dechiree'] ? 4 : 0;
  return piecesPrises(state) + missingAtCall(state) + torn;
}

export type IlyaneState = 'intacte' | 'entamee' | 'perdue';
export function ilyaneState(state: Pick<GameState, 'flags'>): IlyaneState {
  const loss = ilyaneLoss(state);
  return loss <= 2 ? 'intacte' : loss <= 5 ? 'entamee' : 'perdue';
}

// --- Conditions and effects of the dialogues ----------------------------------------------------------------------

export type FinCondition =
  | 'pret'
  | 'edda-alliee'
  | 'listes'
  | 'prises-aucune'
  | 'prises-peu'
  | 'prises-moitie'
  | 'prises-toutes'
  | 'pieces-a-rendre'
  | 'verdantis-confiee'
  | 'combat-2'
  | 'combat-3'
  | 'combat-4'
  | 'complet'
  | 'manque'
  | 'ilyane-intacte'
  | 'ilyane-entamee'
  | 'ilyane-perdue'
  | `liste-${Continent}`
  | 'aucune-liste';

export function finCondition(state: GameState, key: FinCondition): boolean {
  const prises = piecesPrises(state);
  switch (key) {
    case 'pret':
      return finaleReady(state);
    case 'edda-alliee':
      return eddaScore(state) >= EDDA_TURNS_AT;
    case 'listes':
      return listsKnown(state).length >= LISTS_FOR_TRUTH;
    case 'aucune-liste':
      return listsKnown(state).length === 0;
    case 'prises-aucune':
      return prises === 0;
    case 'prises-peu':
      return prises >= 1 && prises <= 2;
    case 'prises-moitie':
      return prises >= 3 && prises <= 4;
    case 'prises-toutes':
      return prises >= 5;
    case 'pieces-a-rendre':
      return CONTINENTS.some((c) => c !== 'verdantis' && pieceWhere(state, c) === 'confiee');
    case 'combat-2':
      return prises <= 1;
    case 'combat-3':
      return prises >= 2 && prises <= 4;
    case 'combat-4':
      return prises >= 5;
    case 'verdantis-confiee':
      return pieceWhere(state, 'verdantis') === 'confiee';
    case 'complet':
      return piecesAtHand(state).length === CONTINENTS.length;
    case 'manque':
      return piecesAtHand(state).length < CONTINENTS.length;
    case 'ilyane-intacte':
    case 'ilyane-entamee':
    case 'ilyane-perdue':
      return ilyaneState(state) === key.slice('ilyane-'.length);
    default: {
      const continent = key.slice('liste-'.length) as Continent;
      return listsKnown(state).includes(continent);
    }
  }
}

export type FinAction = 'rendre-verdantis' | 'rendre-pieces' | 'reprendre-pieces' | 'donner-pieces' | 'appeler' | 'jeter';

/** Applies an action of the finale; returns what is told of it (notices). */
export function finAction(state: GameState, action: FinAction): string[] {
  const hero = state.character;
  if (!hero) return [];
  switch (action) {
    case 'rendre-verdantis': {
      if (pieceWhere(state, 'verdantis') !== 'confiee') return [];
      state.flags[returnedFlag('verdantis')] = true;
      addItem(hero, pieceItem('verdantis'));
      return ['Une pièce de la machine (Verdantis)'];
    }
    case 'rendre-pieces': {
      const back = CONTINENTS.filter((c) => c !== 'verdantis' && pieceWhere(state, c) === 'confiee');
      for (const c of back) {
        state.flags[returnedFlag(c)] = true;
        addItem(hero, pieceItem(c));
      }
      return back.length ? [`${back.length === 1 ? 'Une pièce' : `${back.length} pièces`} de la machine`] : [];
    }
    case 'reprendre-pieces': {
      const taken = piecesPrises(state);
      state.flags[TAKEN_BACK_FLAG] = true;
      return taken ? [`${taken === 1 ? 'Une pièce reprise' : `${taken} pièces reprises`} aux Réveilleurs`] : [];
    }
    case 'donner-pieces': {
      for (const c of CONTINENTS) removeItem(hero, pieceItem(c), ownedCount(hero, pieceItem(c)));
      state.flags[GIVEN_FLAG] = true;
      return ['Les pièces de la machine, données'];
    }
    case 'jeter': {
      for (const c of CONTINENTS) removeItem(hero, pieceItem(c), ownedCount(hero, pieceItem(c)));
      return ['La machine, jetée dans la Faille'];
    }
    case 'appeler': {
      const missing = CONTINENTS.length - piecesAtHand(state).length;
      state.flags[missingFlag(missing)] = true;
      for (const c of CONTINENTS) removeItem(hero, pieceItem(c), ownedCount(hero, pieceItem(c)));
      return missing ? [`La Faille a pris ${missing === 1 ? 'une pièce' : `${missing} pièces`} dans les Échos`] : ['Sept pièces : la Faille n’a rien pris'];
    }
  }
}
