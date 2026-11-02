import locationData from '../data/locations.json';
import type { Character } from '../rules/character';
import { START_TIME, type GameTime } from '../rules/time';

export interface LocationDef {
  id: string;
  name: string;
  scene: string;
  map: string;
  /** Map object where a new game (or a migrated save) starts. */
  entrance: string;
  /** The world-map place it belongs to (src/data/world.json): leaving it opens the world map there. */
  place?: string;
  /** A random encounter's map (docs/gdd/carte-du-monde.md): its content comes from the current encounter. */
  encounter?: boolean;
}

export const LOCATIONS = locationData as LocationDef[];

export interface GameState {
  /** null only for saves migrated from before character creation existed. */
  character: Character | null;
  location: string;
  position: { col: number; row: number };
  /** When set, the map places the player at this named object instead of `position`, then clears it. */
  entrance: string | null;
  playTimeSeconds: number;
  /** Story facts learned or decided (e.g. "laissez-passer"), set by dialogues. */
  flags: Record<string, true>;
  quests: Record<string, QuestStatus>;
  /** The random encounter under way (src/rules/world.ts), null the rest of the time. */
  encounter: { id: string; x: number; y: number; destination: string | null } | null;
  /** The day and the moment of the day (src/rules/time.ts, docs/gdd/temps.md). */
  time: GameTime;
  /** Kinds of enemies met, and how many were beaten (src/rules/bestiary.ts). */
  bestiaire: Record<string, number>;
  /** The companions travelling with the hero, and their PV (src/rules/companions.ts). */
  groupe: { id: string; hp: number }[];
  /** What each companion thinks of the hero's choices (src/rules/companions.ts): too low, they leave. */
  avis: Record<string, number>;
  /** The pull of the Échos relived (src/rules/echos.ts): it weighs on the dice. */
  emprise: number;
}

export type QuestStatus = 'active' | 'done';

export function createNewGame(character: Character | null = null): GameState {
  const start = LOCATIONS[0];
  return {
    character: character ? structuredClone(character) : null,
    location: start.id,
    position: { col: 0, row: 0 },
    entrance: start.entrance,
    playTimeSeconds: 0,
    flags: {},
    quests: {},
    encounter: null,
    time: { ...START_TIME },
    bestiaire: {},
    groupe: [],
    avis: {},
    emprise: 0,
  };
}

export function findLocation(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
