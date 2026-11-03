import { describe, expect, it } from 'vitest';
import { hides } from './occlusion';

/** Walls that hide (docs/gdd/interface.md): faded while they stand in front of something to see. */
describe('occlusion', () => {
  it('a wall of the east or south edge hides who stands just behind it', () => {
    // A sleeping line is 18 × 14: its east wall is column 17, its south wall row 13.
    expect(hides({ col: 17, row: 7 }, { col: 16, row: 6 })).toBe(true);
    expect(hides({ col: 17, row: 6 }, { col: 16, row: 6 })).toBe(true);
    expect(hides({ col: 4, row: 13 }, { col: 4, row: 12 })).toBe(true);
    // A crate in the corner, behind both walls.
    expect(hides({ col: 17, row: 12 }, { col: 16, row: 12 }, 'thing')).toBe(true);
    expect(hides({ col: 16, row: 13 }, { col: 16, row: 12 }, 'thing')).toBe(true);
  });

  it('never what stands in front of it, nor what is far enough', () => {
    // The north and west walls are drawn first: nothing in the room is behind them.
    expect(hides({ col: 0, row: 6 }, { col: 1, row: 6 })).toBe(false);
    expect(hides({ col: 6, row: 0 }, { col: 6, row: 1 })).toBe(false);
    expect(hides({ col: 17, row: 7 }, { col: 10, row: 6 })).toBe(false);
    expect(hides({ col: 4, row: 13 }, { col: 4, row: 5 })).toBe(false);
    // Side by side on the same line of sight: not over it.
    expect(hides({ col: 5, row: 7 }, { col: 7, row: 5 })).toBe(false);
  });

  it('not a counter that only hides a merchant’s legs', () => {
    // Boulon behind his counter, at Ironheart: the counter rises about 40 pixels above its feet.
    expect(hides({ col: 6, row: 9 }, { col: 5, row: 9 }, 'person', 40)).toBe(false);
    expect(hides({ col: 6, row: 9 }, { col: 5, row: 9 }, 'person')).toBe(true);
  });
});
