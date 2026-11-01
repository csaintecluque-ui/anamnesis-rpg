import { describe, expect, it } from 'vitest';
import gardeboisJson from '../data/maps/gardebois.json';
import gareEngloutieJson from '../data/maps/gare-engloutie.json';
import npcData from '../data/npcs.json';
import type { Tile } from './iso';
import { ENEMIES } from '../rules/combat';
import { findPath } from './pathfinding';
import { findObject, isBigAnchor, isWalkable, parseTiledMap, tileKey, type TiledMapJson } from './tiledMap';

const gardebois = parseTiledMap(gardeboisJson as TiledMapJson);
const gareEngloutie = parseTiledMap(gareEngloutieJson as TiledMapJson);

function grid(rows: string[]): (t: Tile) => boolean {
  return ({ col, row }) => row >= 0 && row < rows.length && col >= 0 && col < rows[0].length && rows[row][col] === '.';
}

describe('findPath', () => {
  it('returns an empty path when already on the goal', () => {
    expect(findPath({ col: 1, row: 1 }, { col: 1, row: 1 }, () => true)).toEqual([]);
  });

  it('walks diagonally on open ground and ends on the goal', () => {
    const path = findPath({ col: 0, row: 0 }, { col: 3, row: 3 }, () => true);
    expect(path).toEqual([
      { col: 1, row: 1 },
      { col: 2, row: 2 },
      { col: 3, row: 3 },
    ]);
  });

  it('goes around walls and never cuts a blocked corner', () => {
    const walkable = grid(['....', '.##.', '....']);
    const path = findPath({ col: 0, row: 1 }, { col: 3, row: 1 }, walkable)!;
    expect(path.at(-1)).toEqual({ col: 3, row: 1 });
    let prev = { col: 0, row: 1 };
    for (const step of path) {
      expect(walkable(step)).toBe(true);
      if (step.col !== prev.col && step.row !== prev.row) {
        expect(walkable({ col: step.col, row: prev.row }) && walkable({ col: prev.col, row: step.row })).toBe(true);
      }
      prev = step;
    }
  });

  it('returns null for unreachable or blocked goals', () => {
    const walkable = grid(['.#.', '.#.', '.#.']);
    expect(findPath({ col: 0, row: 0 }, { col: 2, row: 0 }, walkable)).toBeNull();
    expect(findPath({ col: 0, row: 0 }, { col: 1, row: 1 }, walkable)).toBeNull();
  });
});

describe('Gardebois map (Tiled data)', () => {
  const spawn = findObject(gardebois, 'entree')!;
  const exit = findObject(gardebois, 'vers-gare')!;
  const npcTiles = new Set(gardebois.objects.filter((o) => o.type === 'pnj').map(tileKey));
  const walk = (t: Tile) => isWalkable(gardebois, t, npcTiles);

  it('is a 28 × 24 isometric map with entrance, exit and both NPCs', () => {
    expect([gardebois.width, gardebois.height]).toEqual([28, 24]);
    expect(spawn).toBeDefined();
    expect(exit?.properties.cible).toBe('gare-engloutie');
    expect(findObject(gardebois, 'ilyane')).toBeDefined();
    expect(findObject(gardebois, 'tobias')).toBeDefined();
  });

  it('has every NPC placed on the map described in the NPC data', () => {
    for (const npc of gardebois.objects.filter((o) => o.type === 'pnj')) {
      expect(npcData.some((n) => n.id === npc.name)).toBe(true);
    }
  });

  it('lets the player walk from the entrance to the exit', () => {
    expect(walk(spawn)).toBe(true);
    expect(findPath(spawn, exit, walk)).not.toBeNull();
  });

  it('lets the player reach a tile next to each NPC and sign', () => {
    for (const o of gardebois.objects.filter((x) => x.type === 'pnj' || x.type === 'panneau')) {
      const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
      const reachable = around.some((t) => walk(t) && findPath(spawn, t, walk) !== null);
      expect(reachable, `${o.name} should be reachable`).toBe(true);
    }
  });

  it('blocks water but not the bridge', () => {
    expect(isWalkable(gardebois, { col: 20, row: 10 })).toBe(false);
    expect(isWalkable(gardebois, { col: 20, row: 18 })).toBe(true);
  });

  it('keeps the map closed except for its two openings', () => {
    const openings: string[] = [];
    for (let col = 0; col < gardebois.width; col++) {
      for (const row of [0, gardebois.height - 1]) if (isWalkable(gardebois, { col, row })) openings.push(`${col},${row}`);
    }
    for (let row = 0; row < gardebois.height; row++) {
      for (const col of [0, gardebois.width - 1]) if (isWalkable(gardebois, { col, row })) openings.push(`${col},${row}`);
    }
    expect(openings.sort()).toEqual(['0,4', '27,18']);
  });

  it('sends the player to the Gare Engloutie entrance when it names a return point', () => {
    expect(exit?.properties.arrivee).toBe('entree-gare');
    expect(findObject(gareEngloutie, 'entree-gare')).toBeDefined();
  });
});

describe('La Gare Engloutie map (Tiled data)', () => {
  const spawn = findObject(gareEngloutie, 'entree-gare')!;
  const exit = findObject(gareEngloutie, 'entree-gare')!;
  const npcTiles = new Set(gareEngloutie.objects.filter((o) => o.type === 'pnj').map(tileKey));
  const walk = (t: Tile) => isWalkable(gareEngloutie, t, npcTiles);

  it('is a 24 × 18 isometric map with its entrance, Ingrid, the Écho and the Golem', () => {
    expect([gareEngloutie.width, gareEngloutie.height]).toEqual([24, 18]);
    expect(spawn).toBeDefined();
    expect(exit.properties.cible).toBe('gardebois');
    expect(findObject(gareEngloutie, 'ingrid')).toBeDefined();
    expect(findObject(gareEngloutie, 'echo-dernier-train')).toBeDefined();
    expect(findObject(gareEngloutie, 'golem-gare')).toBeDefined();
  });

  it('has every NPC placed on the map described in the NPC data', () => {
    for (const npc of gareEngloutie.objects.filter((o) => o.type === 'pnj')) {
      expect(npcData.some((n) => n.id === npc.name)).toBe(true);
    }
  });

  it('lets the player walk from the entrance and reach Ingrid, the Écho and the Golem', () => {
    expect(walk(spawn)).toBe(true);
    for (const name of ['ingrid', 'echo-dernier-train', 'golem-gare']) {
      const o = findObject(gareEngloutie, name)!;
      const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
      const reachable = around.some((t) => walk(t) && findPath(spawn, t, walk) !== null);
      expect(reachable, `${name} should be reachable`).toBe(true);
    }
  });

  it('blocks the derailed wagon and the dormant golem', () => {
    expect(isWalkable(gareEngloutie, { col: 14, row: 9 })).toBe(false);
    expect(isWalkable(gareEngloutie, { col: 21, row: 13 })).toBe(false);
  });

  it('keeps the map closed except for its single opening west', () => {
    const openings: string[] = [];
    for (let col = 0; col < gareEngloutie.width; col++) {
      for (const row of [0, gareEngloutie.height - 1]) if (isWalkable(gareEngloutie, { col, row })) openings.push(`${col},${row}`);
    }
    for (let row = 0; row < gareEngloutie.height; row++) {
      for (const col of [0, gareEngloutie.width - 1]) if (isWalkable(gareEngloutie, { col, row })) openings.push(`${col},${row}`);
    }
    expect(openings.sort()).toEqual(['0,9']);
  });
});

describe('character tiles', () => {
  it('gives every map NPC the tile named after it', () => {
    for (const map of [gardebois, gareEngloutie]) {
      for (const npc of map.objects.filter((o) => o.type === 'pnj')) expect(map.frames[npc.name], npc.name).toBeDefined();
    }
  });

  it('gives every enemy an existing tile', () => {
    for (const enemy of ENEMIES) expect(gardebois.frames[enemy.tile], enemy.id).toBeDefined();
  });
});

describe('large decor', () => {
  it('draws the Arbre-Titan once, from the front cell of its 2 × 2 block', () => {
    const titan = gardebois.frames['tronc-titan'];
    expect(gardebois.big[titan]).toBe('tronc-titan');
    const cells = [];
    for (let row = 0; row < gardebois.height; row++) {
      for (let col = 0; col < gardebois.width; col++) if (gardebois.obstacles[row * gardebois.width + col] === titan) cells.push({ col, row });
    }
    expect(cells).toHaveLength(4);
    expect(cells.filter((t) => isBigAnchor(gardebois, t))).toEqual([{ col: 4, row: 8 }]);
  });
});

