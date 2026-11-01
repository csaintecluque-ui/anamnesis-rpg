import { describe, expect, it } from 'vitest';
import gareEngloutieJson from '../data/maps/gare-engloutie.json';
import { carveArena, coverAt, farEdgeTiles, isEdge, isOpen, toArena } from './arena';
import { findObject, parseTiledMap, type TiledMapJson } from './tiledMap';

const gare = parseTiledMap(gareEngloutieJson as TiledMapJson);
const golem = findObject(gare, 'golem-gare')!;

describe('cover from the tileset', () => {
  it('trees give +4, crates +2, open ground nothing (docs/gdd/combat.md)', () => {
    const at = (name: string) => gare.cover[gare.obstacles.indexOf(gare.frames[name])];
    expect(at('arbre')).toBe(4);
    expect(at('caisses')).toBe(2);
    expect(gare.cover[gare.obstacles.indexOf(-1)]).toBe(0);
  });
});

describe('carveArena', () => {
  const arena = carveArena(gare, golem, 11, 9, [golem]);

  it('cuts an 11 × 9 window around the golem, shifted to stay inside the map', () => {
    expect(arena.cols).toBe(11);
    expect(arena.rows).toBe(9);
    expect(arena.offset.col + arena.cols).toBeLessThanOrEqual(gare.width);
    expect(arena.offset.row + arena.rows).toBeLessThanOrEqual(gare.height);
    const g = toArena(arena, golem);
    expect(g.col).toBeGreaterThanOrEqual(0);
    expect(g.row).toBeGreaterThanOrEqual(0);
  });

  it('copies the map cells and clears the golem’s own obstacle', () => {
    const g = toArena(arena, golem);
    expect(isOpen(arena, g)).toBe(true);
    expect(arena.obstacles[g.row * arena.cols + g.col]).toBe(-1);
    for (let row = 0; row < arena.rows; row++) {
      for (let col = 0; col < arena.cols; col++) {
        if (col === g.col && row === g.row) continue;
        const i = (arena.offset.row + row) * gare.width + arena.offset.col + col;
        expect(arena.blocked[row * arena.cols + col]).toBe(gare.blocked[i]);
        expect(coverAt(arena, { col, row })).toBe(gare.cover[i]);
      }
    }
  });

  it('places enemies on open edge cells, farthest from the hero first', () => {
    const hero = { col: toArena(arena, golem).col - 1, row: toArena(arena, golem).row };
    const spots = farEdgeTiles(arena, hero, [hero]);
    expect(spots.length).toBeGreaterThanOrEqual(2);
    const far = (t: { col: number; row: number }) => Math.max(Math.abs(t.col - hero.col), Math.abs(t.row - hero.row));
    for (const t of spots) expect(isEdge(arena, t) && isOpen(arena, t)).toBe(true);
    expect(far(spots[0])).toBeGreaterThanOrEqual(far(spots[spots.length - 1]));
  });
});
