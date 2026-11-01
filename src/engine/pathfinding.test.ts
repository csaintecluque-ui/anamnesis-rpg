import { describe, expect, it } from 'vitest';
import type { Tile } from './iso';
import { reachable } from './pathfinding';

function grid(rows: string[]): (t: Tile) => boolean {
  return ({ col, row }) => row >= 0 && row < rows.length && col >= 0 && col < rows[0].length && rows[row][col] === '.';
}

describe('reachable', () => {
  it('covers a square of side 2n + 1 on open ground, diagonals costing one step', () => {
    const open = grid(Array(9).fill('.........'));
    const tiles = reachable({ col: 4, row: 4 }, 2, open);
    expect(tiles.size).toBe(5 * 5 - 1);
    expect(tiles.get('6,6')).toHaveLength(2);
  });

  it('goes around walls and never cuts a blocked corner', () => {
    const walls = grid(['...', '.#.', '...']);
    const tiles = reachable({ col: 0, row: 0 }, 2, walls);
    expect(tiles.has('1,1')).toBe(false);
    // (2,2) needs four steps around the wall, too far for two.
    expect(tiles.has('2,2')).toBe(false);
    expect(tiles.get('2,0')).toEqual([{ col: 1, row: 0 }, { col: 2, row: 0 }]);
  });
});
