import contratData from '../data/contrats.json';
import type { MapObject } from '../engine/tiledMap';
import type { Contrat, ContratKind, GameState } from '../state/gameState';
import { applyEffects, type Effect } from './dialogue';
import { findItem, ownedCount } from './inventory';
import { deLieu, seededRng, VOIE_DEPTH } from './voies';
import { gardienNotices, gardienRank } from './factions';
import { distanceBetween, findPlace, knownPlaces, type WorldPlace } from './world';

/**
 * Les contrats des Gardiens (docs/gdd/voies.md, jalon 3, étape 6) : dans chaque relais, un tableau de petites missions
 * renouvelées tous les trois jours. Porter un pli à un autre relais, rapporter un objet du fond d'une voie endormie,
 * chasser les bêtes qui y nichent. Un contrat à la fois ; il se paie au tableau.
 */
export interface Tableau {
  id: string;
  /** The town (world-map place) of the board. */
  ville: string;
  /** Where the board hangs (src/data/locations.json), and on which cell. */
  lieu: string;
  col: number;
  row: number;
  /** « le relais de Gardebois ». */
  nom: string;
  /** Who asks, in the contracts' texts. */
  demandeurs: string[];
}

interface Chasse {
  ennemis: string[];
  titre: string;
  phrase: string;
  fin: string;
}

interface ContratData {
  periode: number;
  tableaux: Tableau[];
  objets: { id: string; un: string; genre: 'f' | 'm' }[];
  chasses: Record<string, Chasse[]>;
}

const DATA = contratData as ContratData;
export const TABLEAUX = DATA.tableaux;
/** Days between two renewals of a board. */
export const CONTRAT_PERIODE = DATA.periode;
export const PLI = 'pli-scelle';

export function findTableau(id: string): Tableau | undefined {
  return TABLEAUX.find((t) => t.id === id);
}

/** The boards of a place, as map objects drawn with the sign's tile (MapScene adds them to the map). */
export function boardObjects(location: string): MapObject[] {
  return TABLEAUX.filter((t) => t.lieu === location).map((t) => ({
    name: 'tableau-contrats',
    type: 'objet',
    col: t.col,
    row: t.row,
    properties: { tuile: 'panneau', contrats: t.id },
  }));
}

export const periodOf = (state: Pick<GameState, 'time'>): number => Math.floor((state.time.day - 1) / CONTRAT_PERIODE);

/** Days before a board is renewed. */
export function daysToRenewal(state: Pick<GameState, 'time'>): number {
  return CONTRAT_PERIODE - ((state.time.day - 1) % CONTRAT_PERIODE);
}

const hash = (text: string): number => [...text].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7);

/** The sleeping lines known on the world map. */
function knownSites(state: Pick<GameState, 'flags' | 'quests'>): WorldPlace[] {
  return knownPlaces(state.flags, state.quests).filter((p) => p.voie);
}

/** What a board offers this period: a letter, a search and a hunt (when they can be done), less those taken. */
export function offers(state: Pick<GameState, 'time' | 'flags' | 'quests' | 'contrats'>, boardId: string): Contrat[] {
  const board = findTableau(boardId);
  if (!board) return [];
  const period = periodOf(state);
  const rng = seededRng(hash(board.id) + period * 7919);
  const pick = <T>(list: readonly T[]): T => list[Math.floor(rng() * list.length)];
  const asker = pick(board.demandeurs);
  const known = new Set(knownPlaces(state.flags, state.quests).map((p) => p.id));
  const id = (kind: ContratKind) => `${board.id}-${period}-${kind}`;
  const out: Contrat[] = [];

  const destinations = TABLEAUX.filter((t) => t.id !== board.id && known.has(t.ville));
  if (destinations.length) {
    const dest = pick(destinations);
    const distance = distanceBetween(findPlace(board.ville)!, findPlace(dest.ville)!);
    out.push({
      id: id('pli'),
      kind: 'pli',
      board: board.id,
      titre: `Un pli pour ${dest.nom}`,
      texte: `${asker} confie aux Gardiens un pli scellé pour ${dest.nom}. On ne l’ouvre pas : on le porte.`,
      cible: dest.id,
      fers: 10 + Math.round(distance / 15),
      xp: 15,
    });
  }

  const sites = knownSites(state);
  if (sites.length) {
    const site = pick(sites);
    const depth = 1 + Math.floor(rng() * VOIE_DEPTH);
    const thing = pick(DATA.objets);
    const danger = site.voie?.danger ?? 1;
    out.push({
      id: id('recherche'),
      kind: 'recherche',
      board: board.id,
      titre: `${findItem(thing.id)?.name ?? thing.id} (${site.name})`,
      texte: `${asker} cherche ${thing.un}, perdu${thing.genre === 'f' ? 'e' : ''} au niveau ${depth} ${deLieu(site.name)}. Rapporte-${thing.genre === 'f' ? 'la' : 'le'} ici.`,
      cible: site.id,
      depth,
      item: thing.id,
      fers: 20 + 15 * depth + 5 * danger,
      xp: 15 + 10 * depth,
    });

    const huntSite = pick(sites);
    const hunt = pick(DATA.chasses[String(huntSite.voie?.danger ?? 1)]);
    out.push({
      id: id('chasse'),
      kind: 'chasse',
      board: board.id,
      titre: `${hunt.titre} (${huntSite.name})`,
      texte: `${hunt.phrase} au premier niveau ${deLieu(huntSite.name)}, et ${/^Une? /.test(asker) ? asker.charAt(0).toLowerCase() + asker.slice(1) : asker} n’ose plus y descendre. ${hunt.fin}`,
      cible: huntSite.id,
      enemies: hunt.ennemis,
      fers: 25 + 10 * (huntSite.voie?.danger ?? 1),
      xp: 25,
    });
  }
  return out.filter((o) => !state.contrats.pris.includes(o.id));
}

/** Takes a contract: one at a time. A letter comes with it. */
export function accept(state: GameState, offer: Contrat): string[] {
  if (state.contrats.actif) return [];
  state.contrats.actif = structuredClone(offer);
  state.contrats.pris = [...state.contrats.pris, offer.id].slice(-30);
  const notices = [`Contrat pris : ${offer.titre}`];
  if (offer.kind === 'pli') notices.push(...applyEffects(state, [{ giveItem: PLI }]));
  return notices;
}

/** « au relais de Gardebois », « au mur de la Bielle ». */
export function aLieu(nom: string): string {
  if (nom.startsWith('le ')) return `au ${nom.slice(3)}`;
  if (nom.startsWith('les ')) return `aux ${nom.slice(4)}`;
  return `à ${nom}`;
}

/** Where the contract is paid: a letter at the board it goes to, the others where they were taken. */
export const payBoard = (c: Contrat): string => (c.kind === 'pli' ? c.cible : c.board);

/** What the contract still asks, for the board and the journal. */
export function contractStep(state: Pick<GameState, 'character'>, c: Contrat): string {
  if (!state.character) return '';
  const where = aLieu(findTableau(payBoard(c))?.nom ?? '');
  if (c.kind === 'pli') return ownedCount(state.character!, PLI) ? `Porter le pli ${where}.` : 'Le pli est perdu.';
  if (c.kind === 'recherche') {
    const site = findPlace(c.cible)?.name ?? '';
    return ownedCount(state.character!, c.item!) ? `Rapporter ${findItem(c.item!)?.name.toLowerCase()} ${where}.` : `Descendre au niveau ${c.depth} ${deLieu(site)}.`;
  }
  const site = findPlace(c.cible)?.name ?? '';
  return c.fait ? `Les bêtes sont chassées : retourner ${where}.` : `Descendre au premier niveau ${deLieu(site)}, et chasser les bêtes.`;
}

/** Can the contract under way be paid at this board? */
export function canTurnIn(state: GameState, boardId: string): boolean {
  const c = state.contrats.actif;
  if (!c || !state.character || payBoard(c) !== boardId) return false;
  if (c.kind === 'pli') return ownedCount(state.character, PLI) > 0;
  if (c.kind === 'recherche') return ownedCount(state.character, c.item!) > 0;
  return !!c.fait;
}

/** Pays the contract: Fers and experience; the letter or the thing changes hands. */
export function turnIn(state: GameState, boardId: string): string[] {
  const c = state.contrats.actif;
  if (!c || !canTurnIn(state, boardId)) return [];
  const effects: Effect[] = [];
  if (c.kind === 'pli') effects.push({ takeItem: PLI });
  if (c.kind === 'recherche') effects.push({ takeItem: c.item! });
  effects.push({ giveFers: c.fers }, { giveXp: c.xp });
  const rank = gardienRank(state);
  state.contrats.actif = null;
  const notices = applyEffects(state, effects);
  state.contrats.faits++;
  // A contract more may raise the hero in the order of the Gardiens (docs/gdd/factions.md).
  return [`Contrat rempli : ${c.titre}`, ...notices, ...gardienNotices(rank, state)];
}

/** Gives the contract up: the letter goes back to the board. */
export function abandon(state: GameState): string[] {
  const c = state.contrats.actif;
  if (!c) return [];
  state.contrats.actif = null;
  const back: Effect[] = c.kind === 'pli' ? [{ takeItem: PLI }] : c.kind === 'recherche' ? [{ takeItem: c.item! }] : [];
  return [`Contrat abandonné : ${c.titre}`, ...applyEffects(state, back)];
}
