import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { parseTiledMap } from './tiledMap';
import { cellKinds, miniLayout, miniLength, miniPoint, miniTile } from './miniMap';

describe('la mini-carte du lieu (étude A7)', () => {
  it('tient dans sa boîte, centrée, quelle que soit la forme du lieu', () => {
    for (const [w, h] of [[40, 40], [12, 30], [30, 8]]) {
      const box = { width: 200, height: 110 };
      const layout = miniLayout(w, h, box);
      const corners = [miniPoint(layout, { col: 0, row: 0 }), miniPoint(layout, { col: w - 1, row: 0 }), miniPoint(layout, { col: 0, row: h - 1 }), miniPoint(layout, { col: w - 1, row: h - 1 })];
      const xs = corners.map((p) => p.x);
      const ys = corners.map((p) => p.y);
      // Cell centres, plus half a cell on each side.
      expect(Math.min(...xs) - layout.scale).toBeGreaterThanOrEqual(-0.01);
      expect(Math.max(...xs) + layout.scale).toBeLessThanOrEqual(box.width + 0.01);
      expect(Math.min(...ys) - layout.scale / 2).toBeGreaterThanOrEqual(-0.01);
      expect(Math.max(...ys) + layout.scale / 2).toBeLessThanOrEqual(box.height + 0.01);
    }
  });

  it('retrouve la case sous un point (le clic sur la mini-carte)', () => {
    const layout = miniLayout(40, 36, { width: 200, height: 110 });
    for (const tile of [{ col: 0, row: 0 }, { col: 17, row: 5 }, { col: 39, row: 35 }]) {
      const p = miniPoint(layout, tile);
      expect(miniTile(layout, p.x + 0.2, p.y - 0.2)).toEqual(tile);
    }
  });

  it('met à l’échelle les longueurs de la grande carte (le cadre de la vue)', () => {
    const layout = miniLayout(40, 40, { width: 200, height: 110 });
    expect(miniLength(layout, 64)).toBeCloseTo(2 * layout.scale);
  });

  it('reconnaît à Gardebois le chemin, le pont, l’eau et les arbres', () => {
    const map = parseTiledMap(MAPS.gardebois);
    const kinds = cellKinds(map);
    const at = (col: number, row: number) => kinds[row * map.width + col];
    expect(at(19, 18)).toBe('path');
    expect(at(20, 18)).toBe('path');
    expect(at(20, 19)).toBe('water');
    expect(at(19, 17)).toBe('blocked');
    expect(kinds.filter((k) => k === 'ground').length).toBeGreaterThan(100);
  });
});
