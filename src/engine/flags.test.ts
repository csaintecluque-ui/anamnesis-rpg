import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { parseTiledMap } from './tiledMap';

/**
 * Ce qu'une carte attend (un PNJ qui apparaît, un objet qui disparaît, une porte qui s'ouvre) doit pouvoir arriver
 * (test du 2026-11-06 : Aïo attendait un repère que rien ne posait).
 */

const SOURCES = { ...import.meta.glob('/src/**/*.ts', { query: '?raw', import: 'default', eager: true }), ...import.meta.glob('/src/data/**/*.json', { query: '?raw', import: 'default', eager: true }) } as Record<string, string>;
const WRITTEN = Object.entries(SOURCES)
  .filter(([path]) => !path.includes('/maps/') && !path.includes('.test.'))
  .map(([, text]) => text)
  .join('\n');
/** Flags whose names the code builds (fins, rumours, veillées, guild ranks, places known, Échos). */
const BUILT = /^(fin-|rumeur-|veillee-|membre-|sommet-|connait-|echo-|recit-)/;

describe('the flags a map waits for', () => {
  it('are all set somewhere: by a dialogue, a fight, or the code', () => {
    const missing: string[] = [];
    for (const [id, json] of Object.entries(MAPS)) {
      for (const o of parseTiledMap(json).objects) {
        if (o.properties.toujoursFermee) continue;
        for (const key of ['apparaitSi', 'disparaitSi', 'verrou'] as const) {
          for (const flag of (o.properties[key] ?? '').split(',').map((f) => f.trim()).filter(Boolean)) {
            if (BUILT.test(flag) || WRITTEN.includes(`"${flag}"`) || WRITTEN.includes(`'${flag}'`)) continue;
            missing.push(`${id} : ${o.name} (${key} ${flag})`);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
