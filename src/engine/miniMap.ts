import { TILE_WIDTH, type Tile } from './iso';
import type { GameMap } from './tiledMap';

/**
 * La mini-carte du lieu (étude du 2026-11-03, A7) : the whole place in a corner, drawn as the map is (a diamond),
 * each cell a small diamond by what it is, with the exits, the people and the hero on it. Pure: the drawing is in
 * src/ui/miniMap.ts.
 */

export type CellKind = 'void' | 'ground' | 'path' | 'water' | 'blocked';

/** Ground tiles one walks along: paths, planks, rails, floors (scripts/tiles-def.mjs). */
const PATH_TILES = new Set(['chemin', 'planches', 'pont', 'rail', 'quai', 'parquet', 'seuil', 'paves', 'paves-cendre', 'dalles', 'sol-cendre']);
/** Ground tiles that are water or a void one cannot cross. */
const WATER_TILES = new Set(['eau', 'faille']);

/** What each cell is, row by row: nothing, ground, a path, water, or blocked by something standing on it. */
export function cellKinds(map: GameMap): CellKind[] {
  const names: Record<number, string> = {};
  for (const [name, id] of Object.entries(map.frames)) names[id] = name;
  return map.ground.map((frame, i) => {
    if (frame < 0) return 'void';
    const name = names[frame] ?? '';
    if (map.obstacles[i] >= 0 && map.blocked[i]) return 'blocked';
    if (WATER_TILES.has(name)) return 'water';
    if (map.blocked[i]) return 'blocked';
    return PATH_TILES.has(name) ? 'path' : 'ground';
  });
}

/** Where the small map lies in its box: `scale` pixels per half cell across, the centre of cell (0, 0) at (x, y). */
export interface MiniLayout {
  scale: number;
  x: number;
  y: number;
}

/** The largest diamond of `width` × `height` cells that fits in the box, centred in it. */
export function miniLayout(width: number, height: number, box: { width: number; height: number }): MiniLayout {
  const span = width + height;
  const scale = Math.min(box.width / span, (2 * box.height) / span);
  // The diamond runs from x = −height·s to width·s around cell (0, 0) (centres ± half a cell), y from 0 to span·s/2.
  const x = (box.width - span * scale) / 2 + height * scale;
  const y = (box.height - (span * scale) / 2) / 2 + scale / 2;
  return { scale, x, y };
}

/** The centre of a cell on the small map. */
export function miniPoint(layout: MiniLayout, { col, row }: Tile): { x: number; y: number } {
  return { x: layout.x + (col - row) * layout.scale, y: layout.y + ((col + row) * layout.scale) / 2 };
}

/** The cell under a point of the small map (it may lie outside the place). */
export function miniTile(layout: MiniLayout, x: number, y: number): Tile {
  const a = (x - layout.x) / layout.scale;
  const b = (2 * (y - layout.y)) / layout.scale;
  return { col: Math.round((a + b) / 2) + 0, row: Math.round((b - a) / 2) + 0 };
}

/** A length of the big map (in its pixels) on the small one: a cell is TILE_WIDTH there, 2 × scale here. */
export function miniLength(layout: MiniLayout, pixels: number): number {
  return (pixels * 2 * layout.scale) / TILE_WIDTH;
}
