import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings } from './settings';

describe('parseSettings', () => {
  it('falls back to defaults when nothing is stored or the value is unreadable', () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings('{oops')).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid values and clamps the volume to 0–100', () => {
    expect(parseSettings(JSON.stringify({ volume: 40, textSize: 'grande' }))).toEqual({ volume: 40, textSize: 'grande', testMode: false });
    expect(parseSettings(JSON.stringify({ volume: 40, textSize: 'grande', testMode: true })).testMode).toBe(true);
    expect(parseSettings(JSON.stringify({ volume: 250, textSize: 'grande' })).volume).toBe(100);
  });

  it('replaces unknown values field by field', () => {
    expect(parseSettings(JSON.stringify({ volume: 'fort', textSize: 'énorme' }))).toEqual(DEFAULT_SETTINGS);
  });
});
