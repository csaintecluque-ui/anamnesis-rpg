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
  /** A sleeping line's level (docs/gdd/voies.md): its plan and content come from `GameState.voie`. */
  voie?: boolean;
  /** Within the Anneau of the Nexus, at Sept-Portes (docs/univers/lieux/sept-portes.md): no blow can be struck. */
  nexus?: boolean;
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
  /** The sleeping line being explored (src/rules/voies.ts, docs/gdd/voies.md), null the rest of the time. */
  voie: VoieState | null;
  /** The contracts of the Gardiens' boards (src/rules/contrats.ts). */
  contrats: ContratsState;
}

/** A sleeping line under way: its site on the world map, the draw of its levels, and how deep the hero is. */
export interface VoieState {
  site: string;
  seed: number;
  depth: number;
}

export type ContratKind = 'pli' | 'recherche' | 'chasse';

/** A contract taken from a board (docs/gdd/voies.md): everything needed to show it, follow it and pay it. */
export interface Contrat {
  /** Offer id: `<board>-<period>-<kind>`. */
  id: string;
  kind: ContratKind;
  /** The board it was taken from, and where it is paid (a letter: the board it goes to). */
  board: string;
  titre: string;
  texte: string;
  /** A letter: the board it goes to. A search or a hunt: the sleeping line (world-map place). */
  cible: string;
  /** A search: the level where the thing lies, and the thing (src/data/items.json). */
  depth?: number;
  item?: string;
  /** A hunt: the beasts to drive out, on the first level. */
  enemies?: string[];
  fers: number;
  xp: number;
  /** A hunt: the beasts are beaten. */
  fait?: boolean;
}

export interface ContratsState {
  actif: Contrat | null;
  /** Contracts fulfilled, all boards together. */
  faits: number;
  /** Offers already taken (they do not come back on the board). */
  pris: string[];
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
    voie: null,
    contrats: { actif: null, faits: 0, pris: [] },
  };
}

export function findLocation(id: string): LocationDef | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
