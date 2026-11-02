import type { GameState } from '../state/gameState';
import { characterStats } from './character';
import { QUESTS, type QuestDef } from './dialogue';
import { findRecit, type RecitDef } from './recits';
import { FACTIONS, REPUTATION, findFaction, levelLabel, reputationLevel, reputationScore } from './reputation';
import { findPlace, knownPlaces } from './world';

/** Journal (docs/gdd/interface.md) : quêtes, Récits retenus, réputation, sans rien de plus à sauvegarder. */

export interface JournalQuest extends QuestDef {
  done: boolean;
  /** The latest step reached, while in progress. */
  step?: string;
}

/** Quests in progress first (most recent first), then the finished ones (in the order of the game's data). */
export function journalQuests(state: GameState): JournalQuest[] {
  const started = Object.keys(state.quests);
  const active = started.filter((id) => state.quests[id] === 'active').reverse();
  const done = QUESTS.filter((q) => state.quests[q.id] === 'done').map((q) => q.id);
  return [...active, ...done].flatMap((id) => {
    const quest = QUESTS.find((q) => q.id === id);
    if (!quest) return [];
    const done = state.quests[id] === 'done';
    const step = done ? undefined : [...(quest.etapes ?? [])].reverse().find((e) => state.flags[e.si])?.texte;
    return [{ ...quest, done, step }];
  });
}

/** Récits retained, the most recent last (the first is the next one forgotten), and how many fit. */
export function journalRecits(state: GameState): { recits: RecitDef[]; cap: number } {
  const c = state.character;
  if (!c) return { recits: [], cap: 0 };
  return { recits: c.recits.flatMap((id) => findRecit(id) ?? []), cap: characterStats(c).tales };
}

export interface JournalStanding {
  id: string;
  /** « Canopéa », « La Compagnie des Lisières ». */
  name: string;
  kind: 'ville' | 'guilde';
  label: string;
  member: boolean;
}

/** Every known town, then the guilds the hero has dealt with (a score, or membership). */
export function journalReputation(state: GameState): JournalStanding[] {
  const towns = knownPlaces(state.flags, state.quests)
    .filter((p) => REPUTATION[p.id])
    .map((p): JournalStanding => ({ id: p.id, name: findPlace(p.id)!.name, kind: 'ville', label: levelLabel(p.id, reputationLevel(state, p.id)), member: false }));
  const guilds = FACTIONS.filter((f) => reputationScore(state, f.id) !== 0 || state.flags[f.membre]).map(
    (f): JournalStanding => ({
      id: f.id,
      name: capitalize(findFaction(f.id)!.name),
      kind: 'guilde',
      label: levelLabel(f.id, reputationLevel(state, f.id)),
      member: !!state.flags[f.membre],
    }),
  );
  return [...towns, ...guilds];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
