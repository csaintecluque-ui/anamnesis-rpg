import { describe, expect, it } from 'vitest';
import bigArt from './bigArt.json';
import { MAPS } from './maps';
import { MAP_IDS } from './maps/load';
import { parseTiledMap } from '../engine/tiledMap';

/** Le chargement des cartes ville par ville (test du 2026-11-06) : ce que le démarrage doit savoir sans les cartes. */
describe('the maps, loaded town by town', () => {
  it('the large decor the boot loads is the one the maps draw (bigArt.json, to update when a map adds one)', () => {
    const used = [...new Set(Object.values(MAPS).flatMap((m) => Object.values(parseTiledMap(m).big)))].sort();
    expect(bigArt).toEqual(used);
  });

  it('the loader knows every map the tests know', () => {
    expect([...MAP_IDS].sort()).toEqual(Object.keys(MAPS).sort());
  });
});
