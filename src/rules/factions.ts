import rangData from '../data/rangs.json';
import type { GameState } from '../state/gameState';
import { characterStats } from './character';
import { collectedEchos } from './echos';
import { addItem, findItem } from './inventory';
import { FACTIONS, RANK_PRICES, RANK_THRESHOLDS, factionRank, findFaction, reputationScore, sommetFlag, type FactionDef } from './reputation';

export { factionRank, sommetFlag };

/**
 * Les rangs des factions (docs/gdd/factions.md, jalon 3, étape 7). Les cinq guildes et factions : membre (la quête
 * d'adhésion), deuxième rang (réputation), sommet (réputation, et aucune rivale au sommet : monter haut chez l'une
 * ferme le sommet de l'autre). Les Gardiens de Mémoire, l'ordre du héros : Lanterne, Carnet, Plume. Tout se déduit des
 * repères, des quêtes et des contrats : rien de plus à sauvegarder.
 */
export interface FactionRanks {
  /** Rank names, from the first (member) to the top. */
  rangs: [string, string, string];
  /** Factions whose top closes this one's. */
  rivales: string[];
  /** Given once, when the top is reached. */
  don: { item?: string; fers?: number; xp?: number };
  /** What each rank brings, for the journal. */
  avantages: [string, string, string];
  /** Who leads it, for the journal. */
  chef: string;
}

interface RangData {
  gardiens: {
    rangs: [string, string, string];
    carnet: { recits: number; contrats: number };
    plume: { echos: number; contrats: number; quete: string };
  };
}

const DATA = rangData as unknown as RangData;
export const GARDIENS = DATA.gardiens;

export const ranksOf = (f: FactionDef): FactionRanks => f as unknown as FactionDef & FactionRanks;

type StoryState = Pick<GameState, 'flags' | 'quests'>;

export function rankName(id: string, rank: number): string | null {
  const f = findFaction(id);
  return f && rank > 0 ? ranksOf(f).rangs[rank - 1] : null;
}

/** A rival already at its top closes this faction's. */
export function topClosedBy(state: StoryState, id: string): FactionDef | undefined {
  const f = findFaction(id);
  return f ? ranksOf(f).rivales.map(findFaction).find((r) => r && state.flags[sommetFlag(r.id)]) : undefined;
}

/** A member of a rival cannot join (docs/gdd/factions.md : « sauf de guildes rivales »). */
export function rivalMembership(state: StoryState, id: string): FactionDef | undefined {
  const f = findFaction(id);
  return f ? ranksOf(f).rivales.map(findFaction).find((r) => r && state.flags[r.membre]) : undefined;
}

/** Price change at a faction's own stalls for its member: better with each rank. */
export function memberPrices(state: StoryState, id: string): number {
  const rank = factionRank(state, id);
  return rank > 0 ? RANK_PRICES[rank - 1] : 0;
}

/**
 * After a change of the story: tops reached (their flag set, their gift given), and every rank won, as notices
 * (« Les Travailleurs du Rail : te voici Aiguilleur »). Called by applyEffects with the story before the change.
 */
export function rankNotices(before: StoryState, state: GameState): string[] {
  const notices: string[] = [];
  for (const f of FACTIONS) {
    const r = ranksOf(f);
    const was = factionRank(before, f.id);
    if (state.flags[f.membre] && !state.flags[sommetFlag(f.id)] && reputationScore(state, f.id) >= RANK_THRESHOLDS[1] && !topClosedBy(state, f.id)) {
      state.flags[sommetFlag(f.id)] = true;
      notices.push(...giveGift(state, r.don));
    }
    const now = factionRank(state, f.id);
    if (now > was) notices.unshift(`${capitalize(f.name)} : te voici ${r.rangs[now - 1]}`);
  }
  return notices;
}

function giveGift(state: GameState, don: FactionRanks['don']): string[] {
  const c = state.character;
  if (!c) return [];
  const notices: string[] = [];
  if (don.item) {
    addItem(c, don.item);
    notices.push(`+1 ${findItem(don.item)?.name ?? don.item}`);
  }
  if (don.fers) {
    c.fers += don.fers;
    notices.push(`+${don.fers} Fers`);
  }
  if (don.xp) {
    c.xp += don.xp;
    notices.push(`+${don.xp} points d’expérience`);
  }
  return notices;
}

// --- Les Gardiens de Mémoire --------------------------------------------------------------------

type GardienState = Pick<GameState, 'flags' | 'quests' | 'character' | 'contrats'>;

/** 1 Lanterne (at the start), 2 Carnet, 3 Plume. */
export function gardienRank(state: GardienState): number {
  const recits = state.character?.recits.length ?? 0;
  const contrats = state.contrats.faits;
  const { carnet, plume } = GARDIENS;
  if (recits < carnet.recits || contrats < carnet.contrats) return 1;
  if (collectedEchos(state).length < plume.echos || contrats < plume.contrats || state.quests[plume.quete] !== 'done') return 2;
  return 3;
}

export const gardienRankName = (rank: number): string => GARDIENS.rangs[rank - 1];

/** Each rank beyond Lanterne retains one Récit more (docs/gdd/factions.md). */
export const gardienTalesBonus = (state: GardienState): number => gardienRank(state) - 1;

/** How many Récits the hero retains: Mémoire + 1, gifts, and the rank in the order. */
export function talesCap(state: GardienState): number {
  return state.character ? characterStats(state.character).tales + gardienTalesBonus(state) : 0;
}

/** What the next rank asks, for the journal and the boards (null at the top). */
export function nextGardienRank(state: GardienState): string | null {
  const rank = gardienRank(state);
  const { carnet, plume } = GARDIENS;
  if (rank === 1) {
    return `Carnet : ${carnet.recits} Récits retenus (${state.character?.recits.length ?? 0}) et ${carnet.contrats} contrats remplis (${state.contrats.faits}).`;
  }
  if (rank === 2) {
    const quest = state.quests[plume.quete] === 'done' ? 'fait' : 'à faire';
    return `Plume : ${plume.echos} Échos recueillis (${collectedEchos(state).length}), ${plume.contrats} contrats remplis (${state.contrats.faits}) et le chapitre d’Ironheart (${quest}).`;
  }
  return null;
}

/** « Gardiens de Mémoire : te voici Carnet », when the rank changed. */
export function gardienNotices(before: number, state: GardienState): string[] {
  const now = gardienRank(state);
  return now > before ? [`Gardiens de Mémoire : te voici ${gardienRankName(now)} (un Récit de plus retenu)`] : [];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
