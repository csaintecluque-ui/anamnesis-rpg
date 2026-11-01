import type { Tile } from './iso';

/** Screen directions, in the row order of the walk sheets (scripts/assemble-walk.mjs). */
export const FACINGS = ['s', 'se', 'e', 'ne', 'n', 'nw', 'w', 'sw'] as const;
export type Facing = (typeof FACINGS)[number];

/**
 * Direction on screen of a step between two neighbouring tiles. One column right goes down-right on screen, one
 * row down goes down-left (src/engine/iso.ts), so a grid diagonal is a straight screen direction.
 */
export function facingOf(from: Tile, to: Tile): Facing {
  const dx = Math.sign(to.col - from.col - (to.row - from.row));
  const dy = Math.sign(to.col - from.col + (to.row - from.row));
  const table: Record<string, Facing> = {
    '0,1': 's',
    '1,1': 'se',
    '1,0': 'e',
    '1,-1': 'ne',
    '0,-1': 'n',
    '-1,-1': 'nw',
    '-1,0': 'w',
    '-1,1': 'sw',
  };
  return table[`${dx},${dy}`] ?? 's';
}
