export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export interface Point {
  x: number;
  y: number;
}

export interface Tile {
  col: number;
  row: number;
}

/** Screen position of a tile's centre, relative to the centre of tile (0, 0). */
export function tileToScreen({ col, row }: Tile): Point {
  return {
    x: (col - row) * (TILE_WIDTH / 2),
    y: (col + row) * (TILE_HEIGHT / 2),
  };
}

/** Inverse of tileToScreen: each diamond maps to a unit square in tile space, so rounding picks the tile. */
export function screenToTile({ x, y }: Point): Tile {
  const u = x / (TILE_WIDTH / 2);
  const v = y / (TILE_HEIGHT / 2);
  return {
    col: Math.round((u + v) / 2),
    row: Math.round((v - u) / 2),
  };
}

export function isInside({ col, row }: Tile, cols: number, rows: number): boolean {
  return col >= 0 && row >= 0 && col < cols && row < rows;
}
