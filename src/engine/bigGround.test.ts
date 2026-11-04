import { describe, expect, it } from 'vitest';
import { BIG_GROUND_ART, keepFront } from './bigGround';

/** A 3 × 6 picture: column 0 empty, column 1 opaque from row 1 to 5, column 2 opaque at rows 0 and 2 only. */
function picture(): Uint8ClampedArray {
  const width = 3;
  const data = new Uint8ClampedArray(width * 6 * 4);
  const set = (x: number, y: number) => (data[(y * width + x) * 4 + 3] = 255);
  for (let y = 1; y <= 5; y++) set(1, y);
  set(2, 0);
  set(2, 2);
  return data;
}
const alpha = (data: Uint8ClampedArray, x: number, y: number) => data[(y * 3 + x) * 4 + 3];

describe('le devant d’un grand décor de sol (la rambarde du pont)', () => {
  it('garde, dans chaque colonne, les pixels au plus `height` au-dessus du plus bas', () => {
    const data = keepFront(picture(), 3, 6, { height: 2, fromX: 0 });
    expect([0, 1, 2, 3, 4, 5].map((y) => alpha(data, 1, y))).toEqual([0, 0, 0, 255, 255, 255]);
    expect([0, 1, 2].map((y) => alpha(data, 2, y))).toEqual([255, 0, 255]);
    expect([0, 1, 2, 3, 4, 5].every((y) => alpha(data, 0, y) === 0)).toBe(true);
  });

  it('ne garde rien avant la colonne `fromX` (l’appui de pierre reste au sol)', () => {
    const data = keepFront(picture(), 3, 6, { height: 2, fromX: 2 });
    expect([0, 1, 2, 3, 4, 5].every((y) => alpha(data, 1, y) === 0)).toBe(true);
    expect(alpha(data, 2, 2)).toBe(255);
  });

  it('le pont est décrit : ses bouts sur les chemins, un tablier en arche, une rambarde d’une douzaine de pixels', () => {
    const { shift, lift, front } = BIG_GROUND_ART.pont;
    // The ends of the deck, (30, 38) and (145, 97) in the picture, on the line of the cells' centres: with the picture's
    // bottom on the front cell's diamond bottom, that line is y = x / 2 + 52 − shift.y + shift.x / 2.
    const line = (x: number) => x / 2 + 52 - shift.y + shift.x / 2;
    expect(Math.abs(line(30) - 38)).toBeLessThanOrEqual(3);
    expect(Math.abs(line(145) - 97)).toBeLessThanOrEqual(3);
    expect(lift).toBeGreaterThan(0);
    expect(lift).toBeLessThan(16);
    expect(front.height).toBeGreaterThanOrEqual(10);
    expect(front.height).toBeLessThan(20);
  });
});
