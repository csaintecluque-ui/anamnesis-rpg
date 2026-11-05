import rencontreData from '../data/rencontres.json';
import worldData from '../data/world.json';
import type { MapObject } from '../engine/tiledMap';
import type { SkillId } from './attributes';
import type { Rng } from './checks';
import { findEnemy } from './combat';
import { findLocation, type GameState } from '../state/gameState';
import { advance, momentOf, type Moment } from './time';

/** Carte du monde et rencontres aléatoires (docs/gdd/carte-du-monde.md). */

export interface WorldPlace {
  id: string;
  name: string;
  /** Position on the world map, in its own units (`width` × `height`). */
  x: number;
  y: number;
  /** Where one arrives (src/data/locations.json) and on which map object. */
  location: string;
  entrance: string;
  description: string;
  /** Shown from the start; otherwise once the `revealedBy` flag is set, or the `revealedByQuest` quest is done. */
  known?: boolean;
  revealedBy?: string;
  revealedByQuest?: string;
  /** A sleeping line to explore (docs/gdd/voies.md): its danger, 1 to 3. */
  voie?: { danger: number };
  /** A town's inn (src/data/locations.json): where one wakes up after a fall (src/rules/repos.ts). */
  auberge?: string;
  /** A town in the sky (Aetherhaven): reached and left only by airship, for this fare and this many moments. */
  dirigeable?: { fers: number; moments: number };
  /** A town across the sea (Coralia): reached and left only by ship, likewise. */
  navire?: { fers: number; moments: number };
  /** A town across the desert (Marche-Mère): reached and left only with the glassmakers' caravan, likewise. */
  caravane?: { fers: number; moments: number };
  /**
   * A town reached only by train from one station (Khrysos, by the train du Nord from Ironheart ; docs/gdd/chapitre-8.md):
   * the fare and length of the trip, the world-map place it leaves from (`gare`), and the line's name.
   */
  train?: { fers: number; moments: number; gare: string; ligne: string };
  /**
   * A town that walks (Marche-Mère, docs/gdd/chapitre-7.md): it goes round these points, one lap in this many days,
   * and its mark on the world map moves with the days (`walkTheMarches`).
   */
  marche?: { points: [number, number][]; jours: number };
}

export type Moyen = 'dirigeable' | 'navire' | 'caravane' | 'train';

/** How a town beyond the roads is reached: by airship, ship, caravan or train, its fare and its length; nothing for the others. */
export function crossingOf(place: WorldPlace): { moyen: Moyen; fers: number; moments: number } | undefined {
  if (place.dirigeable) return { moyen: 'dirigeable', ...place.dirigeable };
  if (place.navire) return { moyen: 'navire', ...place.navire };
  if (place.caravane) return { moyen: 'caravane', ...place.caravane };
  if (place.train) return { moyen: 'train', fers: place.train.fers, moments: place.train.moments };
  return undefined;
}

/** Where a walking town is on a given day: along its round of points, a lap every `jours` days (day 1 at the first point). */
export function marchePosition(marche: NonNullable<WorldPlace['marche']>, day: number): { x: number; y: number } {
  const { points, jours } = marche;
  const t = ((((day - 1) % jours) + jours) % jours) / jours;
  const legs = points.map((p, i) => [p, points[(i + 1) % points.length]] as const);
  const lengths = legs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  let left = t * lengths.reduce((sum, l) => sum + l, 0);
  for (let i = 0; i < legs.length; i++) {
    if (left <= lengths[i] || i === legs.length - 1) {
      const [a, b] = legs[i];
      const k = lengths[i] ? Math.min(1, left / lengths[i]) : 0;
      return { x: Math.round(a[0] + (b[0] - a[0]) * k), y: Math.round(a[1] + (b[1] - a[1]) * k) };
    }
    left -= lengths[i];
  }
  return { x: points[0][0], y: points[0][1] };
}

/** Moves the walking towns of the world map to where they are today (called before the map is drawn or left). */
export function walkTheMarches(day: number): void {
  for (const place of WORLD.places) if (place.marche) Object.assign(place, marchePosition(place.marche, day));
}

export interface WorldDef {
  title: string;
  width: number;
  height: number;
  places: WorldPlace[];
  /** Railway lines between places, drawn once both ends are known (the train itself is taken at the stations). */
  rails?: { from: string; to: string; name: string }[];
  /** Far lands drawn at the edge of the map, not reachable yet. */
  /** Once the place `remplacePar` is known, its far land is drawn as a place instead (Sept-Portes). */
  distant: { name: string; x: number; y: number; hint: string; remplacePar?: string }[];
  zones: { id: string; name: string; x0: number; y0: number; x1: number; y1: number }[];
  defaultZone: string;
  travel: {
    pixelsPerSecond: number;
    pixelsPerDay: number;
    /** One encounter check each time this distance is covered… */
    encounterEvery: number;
    /** …succeeding with this probability… */
    encounterChance: number;
    /** …except within this distance of the departure. */
    safeDistance: number;
  };
}

export interface RencontreDef {
  id: string;
  zones: string[];
  weight: number;
  /** Encounter maps (locations) it can take place on, one picked at random. */
  terrains: string[];
  hostile: boolean;
  intro: string;
  enemies?: string[];
  npcs?: { id: string; spawn: string }[];
  objects?: { id: string; type: string; tile: string; spawn: string }[];
  decor?: { tile: string; spawn: string }[];
  /** Hostile encounters can be skirted with a roll (Survie): the d20 against this difficulty. */
  avoid?: { skill: SkillId; difficulty: number };
  /**
   * Story encounter, never drawn at random: met at the first check of a journey while `quest` is active and `flag`
   * is not set; meeting it sets `flag` (« La caravane de midi » : les Loups de Rouille).
   */
  story?: { quest: string; flag: string };
}

/**
 * « Attendre qu'ils passent » (étude du 2026-11-03, H2): a hostile encounter on the road can always be let by, at the
 * cost of a moment of the day; not the one a quest is waiting for (« La caravane de midi »), which asks for a choice.
 */
export const canWaitOut = (r: RencontreDef): boolean => r.hostile && !r.story;

const MOMENT_NAMES: Record<Moment, string> = { matin: 'le matin', midi: 'midi', soir: 'le soir', nuit: 'la nuit' };

/** Lets the encounter go by: a moment of the day passes. Returns what the panel says. */
export function waitOut(state: Pick<GameState, 'time'>): string {
  advance(state.time, 1);
  return `Tu te mets à l’écart, sans un bruit, et tu attends. Ils finissent par s’éloigner. C’est maintenant ${MOMENT_NAMES[momentOf(state.time)]}.`;
}

/** Where the hero stands while an encounter lasts: the world-map position to come back to. */
export interface EncounterState {
  id: string;
  x: number;
  y: number;
  /** The place the hero was heading to, offered again on the way back to the world map. */
  destination: string | null;
}

export const WORLD = worldData as WorldDef;
export const RENCONTRES = rencontreData as RencontreDef[];

/** Map exits and doors with this target open the world map. */
export const WORLD_MAP_TARGET = 'carte-du-monde';
/** Story flags that only live for one encounter (cleared when the next one starts). */
export const ENCOUNTER_FLAG_PREFIX = 'rencontre-';
/** Set when the enemies of the current encounter are beaten. */
export const ENCOUNTER_VICTORY_FLAG = 'rencontre-vaincue';

export function findPlace(id: string): WorldPlace | undefined {
  return WORLD.places.find((p) => p.id === id);
}

export function findRencontre(id: string): RencontreDef | undefined {
  return RENCONTRES.find((r) => r.id === id);
}

export function knownPlaces(flags: Record<string, true>, quests: Record<string, string> = {}): WorldPlace[] {
  return WORLD.places.filter(
    (p) => p.known || (p.revealedBy && flags[p.revealedBy]) || (p.revealedByQuest && quests[p.revealedByQuest] === 'done'),
  );
}

/** The world-map place a location belongs to (a house of Gardebois belongs to Gardebois). */
export function placeOfLocation(locationId: string): WorldPlace | undefined {
  const place = (findLocation(locationId) as { place?: string } | undefined)?.place;
  return place ? findPlace(place) : undefined;
}

export function zoneAt(x: number, y: number): string {
  return WORLD.zones.find((z) => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1)?.id ?? WORLD.defaultZone;
}

export function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** "moins d'un jour", "environ 2 jours de marche". */
export function travelTimeLabel(distance: number): string {
  const days = Math.round(distance / WORLD.travel.pixelsPerDay);
  if (days < 1) return 'moins d’un jour de marche';
  return days === 1 ? 'environ un jour de marche' : `environ ${days} jours de marche`;
}

/** A place counts as reached within this distance (world units). */
export const AT_PLACE = 12;
/** Set once the first flight is taken: Hesper has paid for it (chapitre 5, docs/gdd/chapitre-5.md). */
export const FIRST_FLIGHT_FLAG = 'premier-vol';
/** Set once the first crossing by ship is taken: Hesper has paid for it too (chapitre 6, docs/gdd/chapitre-6.md). */
export const FIRST_CROSSING_FLAG = 'premiere-traversee';
/** Set once the first journey with the caravan is taken: Hesper has paid for it as well (chapitre 7). */
export const FIRST_CARAVAN_FLAG = 'premiere-caravane';
/** Set once the first ticket of the train du Nord is used: the last one Hesper pays (chapitre 8, the guichets too). */
export const FIRST_TRAIN_FLAG = 'premier-train-nord';
const firstFlag = (moyen: Moyen) => ({ dirigeable: FIRST_FLIGHT_FLAG, navire: FIRST_CROSSING_FLAG, caravane: FIRST_CARAVAN_FLAG, train: FIRST_TRAIN_FLAG })[moyen];
/** Who travels at half price, for each kind of crossing: a guild's members ; on the train, the railwaymen's friends. */
const HALF_PRICE: Record<Moyen, string> = {
  dirigeable: 'membre-compagnie-vire-nuee',
  navire: 'membre-confrerie-brisants',
  caravane: 'membre-matriarches-cristaux',
  train: 'rail-travailleurs',
};

type TravelState = Pick<GameState, 'flags' | 'quests' | 'character'>;

/**
 * A trip to or from a town in the sky is a flight (docs/gdd/chapitre-5.md): the airship of the Confédération calls at
 * every town. The sky town whose airship it is, or nothing for a walk.
 */
export function flightSky(state: TravelState, from: { x: number; y: number }, place: WorldPlace): WorldPlace | undefined {
  // The train du Nord leaves from its station only (trainStation says where to go first).
  if (place.train) return atStation(from, place) ? place : undefined;
  if (crossingOf(place)) return place;
  return knownPlaces(state.flags, state.quests).find((p) => crossingOf(p) && !p.train && distanceBetween(from, p) <= AT_PLACE);
}

const atStation = (from: { x: number; y: number }, place: WorldPlace) => {
  const gare = place.train && findPlace(place.train.gare);
  return !!gare && distanceBetween(from, gare) <= AT_PLACE;
};

/** A town reached only by train, picked away from its station: the station to go to first (Ironheart, for Khrysos). */
export function trainStation(from: { x: number; y: number }, place: WorldPlace): WorldPlace | undefined {
  return place.train && !atStation(from, place) ? findPlace(place.train.gare) : undefined;
}

/**
 * The fare: the first crossing of each kind is paid by Hesper ; a member of the Compagnie Vire-Nuée flies, of the
 * Confrérie des Brisants sails, of the Matriarches de Cristaux rides with the caravan, at half price.
 */
export function flightFare(state: TravelState, sky: WorldPlace): number {
  const crossing = crossingOf(sky);
  if (!crossing || !state.flags[firstFlag(crossing.moyen)]) return 0;
  return state.flags[HALF_PRICE[crossing.moyen]] ? Math.floor(crossing.fers / 2) : crossing.fers;
}

const DAYS = ['', 'un jour', 'deux jours', 'trois jours', 'quatre jours', 'cinq jours'];
/** « un jour en dirigeable », « deux jours en navire », « trois jours en caravane », « un jour en train » : how long a crossing lasts. */
export function flightTimeLabel(sky: WorldPlace): string {
  const crossing = crossingOf(sky);
  const moments = crossing?.moments ?? 4;
  const en = `en ${crossing?.moyen ?? 'dirigeable'}`;
  const days = Math.round(moments / 4);
  return moments >= 4 ? `${DAYS[days] ?? `${days} jours`} ${en}` : `quelques heures ${en}`;
}

/** Pays the fare (false if the purse is too light). */
export function payFlight(state: TravelState, sky: WorldPlace): boolean {
  const fare = flightFare(state, sky);
  if (!state.character || state.character.fers < fare) return false;
  state.character.fers -= fare;
  state.flags[firstFlag(crossingOf(sky)?.moyen ?? 'dirigeable')] = true;
  return true;
}

/** How many encounter checks happen while the travelled distance goes from `before` to `after`. */
export function encounterChecks(before: number, after: number): number {
  const { encounterEvery, safeDistance } = WORLD.travel;
  const count = (d: number) => (d < safeDistance ? 0 : Math.floor((d - safeDistance) / encounterEvery) + 1);
  return Math.max(0, count(after) - count(before));
}

/** One check: null, or the encounter met, drawn by weight among those of the zone. */
export function rollEncounter(zone: string, rng: Rng = Math.random): RencontreDef | null {
  if (rng() >= WORLD.travel.encounterChance) return null;
  return pickRencontre(zone, rng);
}

/** The story encounter waiting on this road, if any (checked before the random ones). */
export function storyRencontre(
  state: { flags: Record<string, true>; quests: Record<string, 'active' | 'done'> },
  zone: string,
): RencontreDef | null {
  return RENCONTRES.find((r) => r.story && r.zones.includes(zone) && state.quests[r.story.quest] === 'active' && !state.flags[r.story.flag]) ?? null;
}

export function pickRencontre(zone: string, rng: Rng = Math.random): RencontreDef | null {
  const pool = RENCONTRES.filter((r) => r.zones.includes(zone) && !r.story);
  const total = pool.reduce((sum, r) => sum + r.weight, 0);
  let roll = rng() * total;
  for (const r of pool) {
    roll -= r.weight;
    if (roll < 0) return r;
  }
  return pool.at(-1) ?? null;
}

export function pickTerrain(r: RencontreDef, rng: Rng = Math.random): string {
  return r.terrains[Math.floor(rng() * r.terrains.length)] ?? r.terrains[0];
}

/** Experience for beating an encounter's enemies: half of what they are worth, like the fights of Gardebois. */
export function rencontreXp(r: RencontreDef): number {
  const total = (r.enemies ?? []).reduce((sum, id) => sum + (findEnemy(id)?.xp ?? 0), 0);
  return Math.round(total / 2);
}

/** Forgets the flags of the previous encounter (a box opened, a traveller helped), before a new one. */
export function clearEncounterFlags(flags: Record<string, true>): void {
  for (const key of Object.keys(flags)) if (key.startsWith(ENCOUNTER_FLAG_PREFIX)) delete flags[key];
}

/**
 * The map objects an encounter lays on its map's spawn points (objects of type `apparition`): enemies, NPCs,
 * objects with a dialogue, and decor. They are added to the map when it is built (src/scenes/MapScene.ts).
 */
export function encounterObjects(r: RencontreDef, spawns: MapObject[]): MapObject[] {
  const at = (name: string) => {
    const spawn = spawns.find((s) => s.name === name);
    if (!spawn) throw new Error(`Encounter ${r.id}: no spawn point ${name}`);
    return { col: spawn.col, row: spawn.row };
  };
  const objects: MapObject[] = [];
  (r.enemies ?? []).forEach((id, i) =>
    objects.push({
      name: `ennemi-${i + 1}`,
      type: 'ennemi',
      ...at(`apparition-${i + 1}`),
      properties: { ennemi: id, disparaitSi: ENCOUNTER_VICTORY_FLAG, rencontre: r.id },
    }),
  );
  for (const npc of r.npcs ?? []) objects.push({ name: npc.id, type: 'pnj', ...at(npc.spawn), properties: {} });
  for (const o of r.objects ?? []) objects.push({ name: o.id, type: o.type, ...at(o.spawn), properties: { tuile: o.tile } });
  (r.decor ?? []).forEach((d, i) => objects.push({ name: `decor-${i + 1}`, type: 'decor', ...at(d.spawn), properties: { tuile: d.tile } }));
  return objects;
}
