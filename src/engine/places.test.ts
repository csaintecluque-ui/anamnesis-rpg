import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import npcData from '../data/npcs.json';
import { ENEMIES } from '../rules/combat';
import { RENCONTRES, WORLD, WORLD_MAP_TARGET, encounterObjects, placeOfLocation } from '../rules/world';
import { LOCATIONS, findLocation } from '../state/gameState';
import type { Tile } from './iso';
import { findPath } from './pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from './tiledMap';

/** Every map of the game, by location id (docs/gdd/exploration.md, docs/univers/lieux/villes.md). */
const maps = new Map(LOCATIONS.map((l) => [l.id, parseTiledMap(MAPS[l.map])]));
const mapOf = (id: string): GameMap => maps.get(id)!;

const around = (o: Tile): Tile[] =>
  [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr }))).filter((t) => t.col !== o.col || t.row !== o.row);

function reachableFrom(map: GameMap, start: Tile, extraBlocked: MapObject[] = []): (target: Tile) => boolean {
  const blocked = new Set([...map.objects.filter((o) => o.type === 'pnj'), ...extraBlocked].map(tileKey));
  const walk = (t: Tile) => isWalkable(map, t, blocked);
  return (target) => {
    const cells = isWalkable(map, target) && !blocked.has(tileKey(target)) ? [target] : around(target).filter(walk);
    return cells.some((t) => findPath(start, t, walk) !== null);
  };
}

/** Walkable cells on the border of a map: its openings. */
function openings(map: GameMap): string[] {
  const cells: string[] = [];
  for (let col = 0; col < map.width; col++) for (const row of [0, map.height - 1]) if (isWalkable(map, { col, row })) cells.push(`${col},${row}`);
  for (let row = 1; row < map.height - 1; row++) for (const col of [0, map.width - 1]) if (isWalkable(map, { col, row })) cells.push(`${col},${row}`);
  return cells.sort();
}

describe('links between places', () => {
  it('sends every exit and door to a known place and an arrival point that exists there', () => {
    for (const [id, map] of maps) {
      for (const o of map.objects.filter((x) => x.type === 'sortie' || x.type === 'porte')) {
        const target = o.properties.cible;
        if (target === WORLD_MAP_TARGET) continue;
        expect(findLocation(target), `${id} → ${o.name}`).toBeDefined();
        const arrival = o.properties.arrivee ?? findLocation(target)!.entrance;
        expect(findObject(mapOf(target), arrival), `${id} → ${target}#${arrival}`).toBeDefined();
      }
    }
  });

  it('gives every location its entrance object', () => {
    for (const l of LOCATIONS) expect(findObject(mapOf(l.id), l.entrance), l.id).toBeDefined();
  });

  it('lets one leave every place for the world map, through its exits or those of the places around it', () => {
    for (const l of LOCATIONS.filter((x) => !x.encounter)) expect(placeOfLocation(l.id), l.id).toBeDefined();
  });

  it('locks a door only behind a dialogue that can open it', () => {
    for (const map of maps.values()) {
      // A door marked `toujoursFermee` is closed on purpose (the funicular of the Manufactures-Hautes).
      for (const door of map.objects.filter((o) => o.type === 'porte' && o.properties.verrou && !o.properties.toujoursFermee)) {
        const dialogue = DIALOGUES[door.properties.dialogue];
        expect(dialogue, door.name).toBeDefined();
        const opens = Object.values(dialogue.nodes).some((n) => n.effects?.some((e) => 'setFlag' in e && e.setFlag === door.properties.verrou));
        expect(opens, door.name).toBe(true);
      }
    }
  });
});

describe('Canopéa (docs/univers/lieux/villes.md)', () => {
  const quarters = ['canopee-nacelle', 'canopee-ramures', 'canopee-aieux'];

  it.each(quarters)('%s: every person, sign, door and exit can be reached from the entrance', (id) => {
    const map = mapOf(id);
    const reach = reachableFrom(map, findObject(map, findLocation(id)!.entrance)!);
    for (const o of map.objects.filter((x) => ['pnj', 'panneau', 'porte', 'sortie', 'objet'].includes(x.type))) {
      expect(reach(o), `${id}: ${o.name}`).toBe(true);
    }
  });

  it('keeps every quarter closed but for its long footbridge', () => {
    expect(openings(mapOf('canopee-nacelle'))).toEqual(['25,12']);
    expect(openings(mapOf('canopee-ramures'))).toEqual([]);
    expect(openings(mapOf('canopee-aieux'))).toEqual(['0,10']);
  });

  it('has nothing touching the ground: the leaves below are never walkable', () => {
    for (const id of quarters) {
      const map = mapOf(id);
      const leaves = map.frames.feuillage;
      for (let i = 0; i < map.ground.length; i++) if (map.ground[i] === leaves) expect(map.blocked[i]).toBe(true);
    }
  });

  it('goes down to the forest by the Grande Nacelle, onto the world map', () => {
    expect(findObject(mapOf('canopee-nacelle'), 'grande-nacelle')?.properties.cible).toBe(WORLD_MAP_TARGET);
    expect(placeOfLocation('canopee-nacelle')?.id).toBe('canopee');
  });

  it('has its seven houses, each with someone or something inside', () => {
    const houses = ['auberge', 'comptoir', 'conseil', 'feuillevent', 'atelier', 'grenier', 'relais'].map((h) => `canopee-${h}`);
    for (const id of houses) {
      const map = mapOf(id);
      expect(map.objects.some((o) => o.type === 'pnj' || o.type === 'objet'), id).toBe(true);
      const reach = reachableFrom(map, findObject(map, 'entree')!);
      for (const o of map.objects.filter((x) => x.type === 'pnj' || x.type === 'objet')) expect(reach(o), `${id}: ${o.name}`).toBe(true);
    }
  });

  it('places every NPC of Canopéa with a tile, a dialogue and a name, and nothing in front of them', () => {
    for (const id of LOCATIONS.filter((l) => l.place === 'canopee').map((l) => l.id)) {
      const map = mapOf(id);
      for (const npc of map.objects.filter((o) => o.type === 'pnj')) {
        expect(map.frames[npc.name], npc.name).toBeDefined();
        expect(DIALOGUES[npc.name], npc.name).toBeDefined();
        expect(npcData.some((n) => n.id === npc.name), npc.name).toBe(true);
        expect(map.obstacles[(npc.row + 1) * map.width + npc.col + 1], npc.name).toBe(-1);
      }
    }
  });
});

describe('encounter maps (docs/gdd/carte-du-monde.md)', () => {
  const terrains = LOCATIONS.filter((l) => l.encounter).map((l) => l.id);

  it.each(terrains)('%s: from the entrance, both roads out and every spawn point can be reached', (id) => {
    const map = mapOf(id);
    const entrance = findObject(map, 'entree')!;
    const walk = (t: Tile) => isWalkable(map, t);
    for (const o of map.objects.filter((x) => x.type === 'sortie' || x.type === 'apparition')) {
      expect(walk(o), `${id}: ${o.name}`).toBe(true);
      expect(findPath(entrance, o, walk), `${id}: ${o.name}`).not.toBeNull();
    }
    expect(map.objects.filter((o) => o.type === 'sortie').every((o) => o.properties.cible === WORLD_MAP_TARGET)).toBe(true);
  });

  it('lays every encounter on spawn points that exist on all its terrains, apart from one another', () => {
    for (const r of RENCONTRES) {
      for (const terrain of r.terrains) {
        expect(findLocation(terrain)?.encounter, `${r.id} → ${terrain}`).toBe(true);
        const map = mapOf(terrain);
        const objects = encounterObjects(r, map.objects.filter((o) => o.type === 'apparition'));
        expect(new Set(objects.map(tileKey)).size, r.id).toBe(objects.length);
        for (const o of objects) expect(isWalkable(map, o), `${r.id}: ${o.name}`).toBe(true);
      }
    }
  });

  it('only meets known enemies, people with a dialogue, and drawable objects', () => {
    const anyMap = mapOf('rencontre-clairiere');
    for (const r of RENCONTRES) {
      for (const id of r.enemies ?? []) expect(ENEMIES.some((e) => e.id === id), `${r.id}: ${id}`).toBe(true);
      for (const npc of r.npcs ?? []) {
        expect(DIALOGUES[npc.id], npc.id).toBeDefined();
        expect(anyMap.frames[npc.id], npc.id).toBeDefined();
      }
      for (const o of r.objects ?? []) {
        expect(DIALOGUES[o.id], o.id).toBeDefined();
        expect(anyMap.frames[o.tile], o.tile).toBeDefined();
      }
      for (const d of r.decor ?? []) expect(anyMap.frames[d.tile], d.tile).toBeDefined();
      expect(r.hostile, r.id).toBe((r.enemies ?? []).length > 0);
      if (r.hostile) expect(r.avoid, r.id).toBeDefined();
    }
  });

  it('keeps the fight close: the entrance and every enemy fit in an 11 × 9 board', () => {
    for (const id of terrains) {
      const map = mapOf(id);
      const cells = [findObject(map, 'entree')!, ...map.objects.filter((o) => o.name.startsWith('apparition-'))];
      const cols = cells.map((c) => c.col);
      const rows = cells.map((c) => c.row);
      expect(Math.max(...cols) - Math.min(...cols), id).toBeLessThan(11);
      expect(Math.max(...rows) - Math.min(...rows), id).toBeLessThan(9);
    }
  });
});

describe('world map places', () => {
  it('lead to a known location and its arrival point, inside the map', () => {
    for (const place of WORLD.places) {
      expect(findObject(mapOf(place.location), place.entrance), place.id).toBeDefined();
      expect(place.x >= 0 && place.x <= WORLD.width && place.y >= 0 && place.y <= WORLD.height, place.id).toBe(true);
    }
  });

  it('are reached through an exit or a door leading to the world map', () => {
    for (const place of WORLD.places) {
      const own = LOCATIONS.filter((l) => l.place === place.id).map((l) => mapOf(l.id));
      const out = own.some((m) => m.objects.some((o) => o.properties.cible === WORLD_MAP_TARGET));
      expect(out, place.id).toBe(true);
    }
  });
});
