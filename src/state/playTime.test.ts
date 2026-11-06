import { describe, expect, it } from 'vitest';
import { IDLE_AFTER_MS, MAX_STEP_MS, playTimeStep } from './playTime';

describe('the play time', () => {
  it('counts the map, and also the dialogues, the combats, the journal and the trade', () => {
    expect(playTimeStep(16, ['Map', 'Hud'], 0)).toBeCloseTo(0.016);
    expect(playTimeStep(16, ['Hud', 'Dialogue'], 2000)).toBeCloseTo(0.016);
    expect(playTimeStep(16, ['Combat'], 2000)).toBeCloseTo(0.016);
    expect(playTimeStep(16, ['WorldMap'], 0)).toBeCloseTo(0.016);
    for (const scene of ['Journal', 'Trade', 'Veillee', 'Atelier', 'LevelUp', 'Death']) expect(playTimeStep(16, ['Hud', scene], 0), scene).toBeGreaterThan(0);
  });

  it('stops on the title, the save slots, the pause menu and the options', () => {
    for (const scene of ['Title', 'Slots', 'Pause', 'Options', 'Boot']) expect(playTimeStep(16, ['Map', 'Hud', scene], 0), scene).toBe(0);
  });

  it('stops after five minutes without a gesture, and never counts a long frame whole', () => {
    expect(playTimeStep(16, ['Dialogue'], IDLE_AFTER_MS - 1)).toBeGreaterThan(0);
    expect(playTimeStep(16, ['Dialogue'], IDLE_AFTER_MS + 1)).toBe(0);
    expect(playTimeStep(60_000, ['Map'], 0)).toBe(MAX_STEP_MS / 1000);
  });
});
