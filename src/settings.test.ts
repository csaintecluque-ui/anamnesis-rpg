import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseSettings } from './settings';

describe('parseSettings', () => {
  it('falls back to defaults when nothing is stored or the value is unreadable', () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings('{oops')).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid values and clamps the volume to 0–100', () => {
    expect(parseSettings(JSON.stringify({ volume: 40, textSize: 'grande' }))).toEqual({ volume: 40, music: 70, textSize: 'grande', testMode: false, miniMap: true });
    expect(parseSettings(JSON.stringify({ volume: 40, textSize: 'grande', testMode: true })).testMode).toBe(true);
    expect(parseSettings(JSON.stringify({ volume: 250, textSize: 'grande' })).volume).toBe(100);
  });

  it('keeps the music setting apart from the general volume (docs/gdd/son.md)', () => {
    expect(parseSettings(JSON.stringify({ volume: 60, music: 30 })).music).toBe(30);
    expect(parseSettings(JSON.stringify({ volume: 60, music: -5 })).music).toBe(0);
    expect(parseSettings(JSON.stringify({ volume: 60 })).music).toBe(DEFAULT_SETTINGS.music);
  });

  it('replaces unknown values field by field', () => {
    expect(parseSettings(JSON.stringify({ volume: 'fort', textSize: 'énorme' }))).toEqual(DEFAULT_SETTINGS);
  });
});
