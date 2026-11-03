import { TILE_HEIGHT, TILE_WIDTH, tileToScreen, type Tile } from './iso';

/**
 * Walls and houses that hide what matters (docs/gdd/interface.md) : in an isometric view, everything standing on a
 * cell nearer the viewer is drawn over what stands behind it. A wall on the south or east edge of a map then hides the
 * hero, a crate or a person. As in the reference CRPGs, such an obstacle is faded while it hides something to see.
 */

/** A screen rectangle, in game pixels (y grows downwards). */
export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Height of a tile frame (64 × 96, anchored at the bottom of its diamond). */
export const FRAME_HEIGHT = 96;
/** How much a faded obstacle still shows. */
export const FADED_ALPHA = 0.35;

/** Feet of a tile: the bottom of its diamond, where frames are anchored (relative to tile (0, 0)). */
export function feetOf(tile: Tile): { x: number; y: number } {
  const c = tileToScreen(tile);
  return { x: c.x, y: c.y + TILE_HEIGHT / 2 };
}

/**
 * The drawn part of an obstacle frame anchored at (x, y), without its side margins; `drawn`: how high its picture
 * rises above its feet (a wall: almost the whole frame; a counter or a stall: much less).
 */
export function obstacleBox(x: number, y: number, width = TILE_WIDTH, drawn = FRAME_HEIGHT - 6): Box {
  return { left: x - width / 2 + 4, right: x + width / 2 - 4, top: y - drawn, bottom: y - 6 };
}

/**
 * What must stay visible of someone or something standing at (x, y): the middle of a person's body, or of a small
 * object. A counter that only hides a merchant's legs, or a crate's foot, leaves it in sight.
 */
export function bodyBox(x: number, y: number, kind: 'person' | 'thing'): Box {
  const middle = kind === 'person' ? y - 38 : y - 22;
  return { left: x - 12, right: x + 12, top: middle - 4, bottom: middle + 4 };
}

export function overlaps(a: Box, b: Box): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

/** Does an obstacle on `obstacle`, `drawn` pixels high, hide what stands on `target`? Only what is drawn after it can. */
export function hides(obstacle: Tile, target: Tile, kind: 'person' | 'thing' = 'person', drawn = FRAME_HEIGHT - 6): boolean {
  const o = feetOf(obstacle);
  const t = feetOf(target);
  return o.y > t.y && overlaps(obstacleBox(o.x, o.y, TILE_WIDTH, drawn), bodyBox(t.x, t.y, kind));
}
