import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { FIGURANTS, figurantsAt, isStanding } from '../rules/figurants';
import { LOCATIONS, findLocation } from '../state/gameState';
import type { Tile } from './iso';
import { findPath } from './pathfinding';
import { isWalkable, parseTiledMap, tileKey } from './tiledMap';

/** Passers-by and townsfolk « de remplissage » (docs/gdd/figurants.md). */
describe('figurants', () => {
  const mapOf = (location: string) => parseTiledMap(MAPS[findLocation(location)!.map]);

  it('live in known places, with a drawable tile, a name and one or two short lines', () => {
    expect(new Set(FIGURANTS.map((f) => f.id)).size).toBe(FIGURANTS.length);
    for (const f of FIGURANTS) {
      expect(findLocation(f.location), f.id).toBeDefined();
      expect(mapOf(f.location).frames[f.tile], f.id).toBeDefined();
      expect(f.name.length, f.id).toBeGreaterThan(0);
      expect(f.lines.length, f.id).toBeGreaterThanOrEqual(1);
      expect(f.lines.length, f.id).toBeLessThanOrEqual(2);
      for (const line of f.lines) expect(line.length, f.id).toBeLessThanOrEqual(130);
    }
  });

  it('walk loops that stay on free ground and connect from one waypoint to the next', () => {
    for (const location of new Set(FIGURANTS.map((f) => f.location))) {
      const map = mapOf(location);
      const people = map.objects.filter((o) => o.type === 'pnj');
      const standing = figurantsAt(location).filter(isStanding).map((f) => ({ col: f.path[0][0], row: f.path[0][1] }));
      const taken = new Set([...people, ...standing].map(tileKey));
      const walk = (t: Tile) => isWalkable(map, t, taken);
      for (const f of figurantsAt(location).filter((x) => !isStanding(x))) {
        const points = f.path.map(([col, row]) => ({ col, row }));
        points.forEach((p, i) => {
          expect(walk(p), `${f.id} ${p.col},${p.row}`).toBe(true);
          expect(findPath(p, points[(i + 1) % points.length], walk), `${f.id} from ${p.col},${p.row}`).not.toBeNull();
        });
      }
    }
  });

  it('stand where nobody needs to pass: off doors, exits and arrivals, nothing hiding them', () => {
    for (const f of FIGURANTS.filter(isStanding)) {
      const map = mapOf(f.location);
      const [col, row] = f.path[0];
      expect(isWalkable(map, { col, row }), f.id).toBe(true);
      const busy = map.objects.filter((o) => ['pnj', 'sortie', 'arrivee', 'porte'].includes(o.type));
      expect(busy.some((o) => o.col === col && o.row === row), f.id).toBe(false);
      expect(map.obstacles[(row + 1) * map.width + col + 1], f.id).toBe(-1);
    }
  });

  it('never start on an arrival point or an exit', () => {
    for (const f of FIGURANTS) {
      const map = mapOf(f.location);
      const [col, row] = f.path[0];
      const spot = map.objects.find((o) => o.col === col && o.row === row && ['sortie', 'arrivee', 'pnj'].includes(o.type));
      expect(spot, f.id).toBeUndefined();
    }
  });

  it('fill Gardebois and the three quarters of Canopéa', () => {
    for (const id of ['gardebois', 'canopee-nacelle', 'canopee-ramures', 'canopee-aieux']) {
      expect(figurantsAt(id).length, id).toBeGreaterThanOrEqual(2);
    }
    expect(LOCATIONS.filter((l) => l.encounter).every((l) => figurantsAt(l.id).length === 0)).toBe(true);
  });
});
