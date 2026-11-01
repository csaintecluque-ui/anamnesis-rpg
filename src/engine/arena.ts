import type { Tile } from './iso';
import { tileKey, type GameMap } from './tiledMap';

/** A rectangle of the explored map where a fight takes place (docs/gdd/combat.md). Cells are in arena coordinates. */
export interface Arena {
  cols: number;
  rows: number;
  /** Map cell of the arena's (0, 0). */
  offset: Tile;
  /** Frame indices, −1 when empty; row-major, like GameMap. */
  ground: number[];
  obstacles: number[];
  blocked: boolean[];
  cover: number[];
}

/**
 * Cuts a cols × rows window of the map centred on `center` (shifted to stay inside the map). Cells in `clear`
 * (map coordinates) lose their obstacle: e.g. the sleeping golem's tile, since the golem now fights as a combatant.
 */
export function carveArena(map: GameMap, center: Tile, cols: number, rows: number, clear: Tile[] = []): Arena {
  const width = Math.min(cols, map.width);
  const height = Math.min(rows, map.height);
  const offset = {
    col: clamp(center.col - Math.floor(width / 2), 0, map.width - width),
    row: clamp(center.row - Math.floor(height / 2), 0, map.height - height),
  };
  const cleared = new Set(clear.map(tileKey));
  const arena: Arena = { cols: width, rows: height, offset, ground: [], obstacles: [], blocked: [], cover: [] };
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const mapCol = offset.col + col;
      const mapRow = offset.row + row;
      const i = mapRow * map.width + mapCol;
      const isCleared = cleared.has(tileKey({ col: mapCol, row: mapRow }));
      arena.ground.push(map.ground[i]);
      arena.obstacles.push(isCleared ? -1 : map.obstacles[i]);
      arena.blocked.push(isCleared ? map.ground[i] === -1 : map.blocked[i]);
      arena.cover.push(isCleared ? 0 : map.cover[i]);
    }
  }
  return arena;
}

export function toArena(arena: Arena, mapTile: Tile): Tile {
  return { col: mapTile.col - arena.offset.col, row: mapTile.row - arena.offset.row };
}

export function inArena(arena: Arena, { col, row }: Tile): boolean {
  return col >= 0 && row >= 0 && col < arena.cols && row < arena.rows;
}

export function isOpen(arena: Arena, tile: Tile): boolean {
  return inArena(arena, tile) && !arena.blocked[tile.row * arena.cols + tile.col];
}

export function coverAt(arena: Arena, tile: Tile): number {
  return inArena(arena, tile) ? arena.cover[tile.row * arena.cols + tile.col] : 0;
}

/** On the border of the arena: where the hero can flee from (docs/gdd/combat.md). */
export function isEdge(arena: Arena, { col, row }: Tile): boolean {
  return col === 0 || row === 0 || col === arena.cols - 1 || row === arena.rows - 1;
}

/** Open edge cells, farthest from `from` first: where enemies coming out of the surroundings appear. */
export function farEdgeTiles(arena: Arena, from: Tile, taken: Tile[] = []): Tile[] {
  const busy = new Set(taken.map(tileKey));
  const tiles: Tile[] = [];
  for (let row = 0; row < arena.rows; row++) {
    for (let col = 0; col < arena.cols; col++) {
      const tile = { col, row };
      if (isEdge(arena, tile) && isOpen(arena, tile) && !busy.has(tileKey(tile))) tiles.push(tile);
    }
  }
  const far = (t: Tile) => Math.max(Math.abs(t.col - from.col), Math.abs(t.row - from.row));
  return tiles.sort((a, b) => far(b) - far(a) || a.row - b.row || a.col - b.col);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
