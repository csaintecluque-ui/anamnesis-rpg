import locationData from '../data/locations.json';
import type { Character } from '../rules/character';

export interface LocationDef {
  id: string;
  name: string;
  scene: string;
}

export const LOCATIONS = locationData as LocationDef[];

export interface GameState {
  /** null only for saves migrated from before character creation existed. */
  character: Character | null;
  location: string;
  position: { col: number; row: number };
  playTimeSeconds: number;
}

export function createNewGame(character: Character | null = null): GameState {
  return {
    character: character ? structuredClone(character) : null,
    location: LOCATIONS[0].id,
    position: { col: 0, row: 0 },
    playTimeSeconds: 0,
  };
}

export function findLocation(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
