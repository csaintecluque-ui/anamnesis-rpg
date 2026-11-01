import rencontreData from '../data/rencontres.json';
import worldData from '../data/world.json';
import type { MapObject } from '../engine/tiledMap';
import type { SkillId } from './attributes';
import type { Rng } from './checks';
import { findEnemy } from './combat';
import { findLocation } from '../state/gameState';

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
  /** Shown from the start; otherwise once the `revealedBy` flag is set. */
  known?: boolean;
  revealedBy?: string;
}

export interface WorldDef {
  title: string;
  width: number;
  height: number;
  places: WorldPlace[];
  /** Far lands drawn at the edge of the map, not reachable yet. */
  distant: { name: string; x: number; y: number; hint: string }[];
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

export function knownPlaces(flags: Record<string, true>): WorldPlace[] {
  return WORLD.places.filter((p) => p.known || (p.revealedBy && flags[p.revealedBy]));
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

export function pickRencontre(zone: string, rng: Rng = Math.random): RencontreDef | null {
  const pool = RENCONTRES.filter((r) => r.zones.includes(zone));
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
