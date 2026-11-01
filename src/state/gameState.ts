import locationData from '../data/locations.json';

export interface LocationDef {
  id: string;
  name: string;
  scene: string;
}

export const LOCATIONS = locationData as LocationDef[];

export interface GameState {
  location: string;
  position: { col: number; row: number };
  playTimeSeconds: number;
}

export function createNewGame(): GameState {
  return {
    location: LOCATIONS[0].id,
    position: { col: 0, row: 0 },
    playTimeSeconds: 0,
  };
}

export function findLocation(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
