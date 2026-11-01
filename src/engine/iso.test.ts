import { describe, expect, it } from 'vitest';
import { TILE_HEIGHT, TILE_WIDTH, isInside, screenToTile, tileToScreen } from './iso';

describe('iso projection', () => {
  it('places neighbouring tiles half a tile apart', () => {
    expect(tileToScreen({ col: 0, row: 0 })).toEqual({ x: 0, y: 0 });
    expect(tileToScreen({ col: 1, row: 0 })).toEqual({ x: TILE_WIDTH / 2, y: TILE_HEIGHT / 2 });
    expect(tileToScreen({ col: 0, row: 1 })).toEqual({ x: -TILE_WIDTH / 2, y: TILE_HEIGHT / 2 });
  });

  it('round-trips every tile of a 20×20 map', () => {
    for (let col = 0; col < 20; col++) {
      for (let row = 0; row < 20; row++) {
        expect(screenToTile(tileToScreen({ col, row }))).toEqual({ col, row });
      }
    }
  });

  it('picks the right tile for points near the edges of a diamond', () => {
    const centre = tileToScreen({ col: 3, row: 2 });
    const inset = 2;
    const corners = [
      { x: centre.x, y: centre.y - TILE_HEIGHT / 2 + inset },
      { x: centre.x, y: centre.y + TILE_HEIGHT / 2 - inset },
      { x: centre.x - TILE_WIDTH / 2 + inset * 2, y: centre.y },
      { x: centre.x + TILE_WIDTH / 2 - inset * 2, y: centre.y },
    ];
    for (const p of corners) expect(screenToTile(p)).toEqual({ col: 3, row: 2 });
  });

  it('knows the map bounds', () => {
    expect(isInside({ col: 0, row: 0 }, 10, 10)).toBe(true);
    expect(isInside({ col: 10, row: 0 }, 10, 10)).toBe(false);
    expect(isInside({ col: -1, row: 3 }, 10, 10)).toBe(false);
  });
});
