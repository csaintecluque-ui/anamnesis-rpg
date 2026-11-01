import locationData from '../data/locations.json';
import type { Character } from '../rules/character';

export interface LocationDef {
  id: string;
  name: string;
  scene: string;
  map: string;
  /** Map object where a new game (or a migrated save) starts. */
  entrance: string;
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
  };
}

export function findLocation(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
