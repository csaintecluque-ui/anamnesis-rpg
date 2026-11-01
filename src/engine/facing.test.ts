import { describe, expect, it } from 'vitest';
import { facingOf } from './facing';
import { tileToScreen } from './iso';

describe('facingOf', () => {
  const from = { col: 5, row: 5 };
  it('matches the screen direction of every neighbouring step', () => {
    const cases: [number, number, string][] = [
      [1, 0, 'se'],
      [0, 1, 'sw'],
      [-1, 0, 'nw'],
      [0, -1, 'ne'],
      [1, 1, 's'],
      [-1, -1, 'n'],
      [1, -1, 'e'],
      [-1, 1, 'w'],
    ];
    for (const [dc, dr, facing] of cases) expect(facingOf(from, { col: 5 + dc, row: 5 + dr }), `${dc},${dr}`).toBe(facing);
  });

  it('agrees with tileToScreen', () => {
    const a = tileToScreen(from);
    const b = tileToScreen({ col: 6, row: 5 });
    expect(b.x > a.x && b.y > a.y).toBe(true); // down-right: 'se'
  });
});
