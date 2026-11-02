import factionData from '../data/factions.json';
import npcData from '../data/npcs.json';
import reputationData from '../data/reputation.json';
import { findPlace } from './world';

/**
 * Réputation par ville (docs/gdd/reputation.md) : ce que la ville pense du héros, déduit de ce qu'il y a fait (quêtes
 * terminées, repères d'histoire), sans état à sauvegarder. Elle change les prix de ses marchands, ouvre ou ferme des
 * répliques, et un message s'affiche quand elle change de palier.
 */
export interface ReputationSource {
  quest?: string;
  flag?: string;
  points: number;
}

export const REPUTATION = reputationData as Record<string, ReputationSource[]>;

/**
 * Guildes et factions (docs/gdd/factions.md) : leur opinion se calcule comme celle des villes, avec les mêmes paliers.
 * `membre` : le repère d'adhésion (prix de membre chez les marchands de la guilde).
 */
export interface FactionDef {
  id: string;
  /** With its article: « la Compagnie des Lisières ». */
  name: string;
  membre: string;
}

export const FACTIONS = factionData as FactionDef[];

export function findFaction(id: string): FactionDef | undefined {
  return FACTIONS.find((f) => f.id === id);
}

/** Member's prices at the guild's own stalls (the better of town and guild, never both). */
export const MEMBER_PRICES = -0.15;

/** « à Canopéa », « auprès de la Compagnie des Lisières ». */
export function reputationTarget(id: string): string {
  const faction = findFaction(id);
  return faction ? `auprès de ${faction.name}` : `à ${findPlace(id)?.name ?? id}`;
}

/** How a town or a guild sees the hero: a guild is not « la ville ». */
export function levelLabel(id: string, level: ReputationLevel): string {
  return findFaction(id) && level.id === 'amitie' ? 'on te fait confiance' : level.label;
}

export interface ReputationLevel {
  id: 'mefiance' | 'neutre' | 'estime' | 'amitie';
  /** Lowest score of the level. */
  min: number;
  /** How the town sees the hero, for the player. */
  label: string;
  /** Change of its merchants' prices (−0.1: 10 % cheaper). */
  prices: number;
}

/** From the lowest to the highest. */
export const LEVELS: ReputationLevel[] = [
  { id: 'mefiance', min: -Infinity, label: 'on se méfie de toi', prices: 0.2 },
  { id: 'neutre', min: 0, label: 'on ne te connaît pas encore', prices: 0 },
  { id: 'estime', min: 10, label: 'on t’apprécie', prices: -0.1 },
  { id: 'amitie', min: 25, label: 'la ville te fait confiance', prices: -0.15 },
];

interface StoryState {
  flags: Record<string, true>;
  quests: Record<string, 'active' | 'done'>;
}

export function reputationScore(state: StoryState, place: string): number {
  return (REPUTATION[place] ?? []).reduce((sum, s) => {
    const earned = s.quest ? state.quests[s.quest] === 'done' : !!(s.flag && state.flags[s.flag]);
    return earned ? sum + s.points : sum;
  }, 0);
}

export function levelOf(score: number): ReputationLevel {
  return [...LEVELS].reverse().find((l) => score >= l.min)!;
}

export function reputationLevel(state: StoryState, place: string): ReputationLevel {
  return levelOf(reputationScore(state, place));
}

/** The level a score threshold stands for, as a test tag: « Réputation à Canopéa : on t'apprécie ». */
export function reputationTag(place: string, min: number): string {
  return `Réputation ${reputationTarget(place)} : ${levelLabel(place, levelOf(min))}`;
}

/** The town a merchant belongs to (`place` in npcs.json); none for a wanderer such as the colporteuse. */
export function merchantPlace(npcId?: string): string | undefined {
  return (npcData as { id: string; place?: string }[]).find((n) => n.id === npcId)?.place;
}

/** The guild a merchant belongs to (`faction` in npcs.json). */
export function merchantFaction(npcId?: string): FactionDef | undefined {
  const id = (npcData as { id: string; faction?: string }[]).find((n) => n.id === npcId)?.faction;
  return id ? findFaction(id) : undefined;
}

/**
 * Price change at a merchant's stall from the town's opinion of the hero (0 for a wanderer); a member of the
 * merchant's guild pays member's prices when they are better.
 */
export function reputationPrices(state: StoryState, npcId?: string): number {
  const place = merchantPlace(npcId);
  const town = place ? reputationLevel(state, place).prices : 0;
  const faction = merchantFaction(npcId);
  return faction && state.flags[faction.membre] ? Math.min(town, MEMBER_PRICES) : town;
}

/** A trader's own discount combined with the town's opinion: one share off (negative: a surcharge). */
export function combinedDiscount(discount: number, prices: number): number {
  return 1 - (1 - discount) * (1 + prices);
}

/** Notices for every town whose level changed between two snapshots of the story (« Canopéa : on t'apprécie »). */
export function reputationNotices(before: StoryState, after: StoryState): string[] {
  return Object.keys(REPUTATION).flatMap((place) => {
    const was = reputationLevel(before, place);
    const now = reputationLevel(after, place);
    return was.id === now.id ? [] : [`Réputation ${reputationTarget(place)} : ${levelLabel(place, now)}`];
  });
}
