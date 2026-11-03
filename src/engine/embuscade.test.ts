import { describe, expect, it } from 'vitest';
import gareEngloutieJson from '../data/maps/gare-engloutie.json';
import { ENCOUNTERS, findEnemy } from '../rules/combat';
import { findPath } from './pathfinding';
import { findObject, isWalkable, parseTiledMap, type TiledMapJson } from './tiledMap';

/** Le premier combat, sur le sentier de la Gare (étude du 2026-11-03, C5). */
describe('the Rôdeur on the path to the Gare', () => {
  const map = parseTiledMap(gareEngloutieJson as unknown as TiledMapJson);
  const rodeur = findObject(map, 'rodeur-sentier')!;

  it('is a Rôdeur-Épine that ambushes whoever arrives, with its fight and a word of guidance', () => {
    expect(rodeur.type).toBe('ennemi');
    expect(findEnemy(rodeur.properties.ennemi)?.id).toBe('rodeur-epine');
    const encounter = ENCOUNTERS.find((e) => e.id === rodeur.properties.embuscade)!;
    expect(encounter.center).toBe('rodeur-sentier');
    expect(encounter.victoryFlag).toBe(rodeur.properties.disparaitSi);
    expect(encounter.intro).toMatch(/premier combat/);
  });

  it('stands on the path between the way in and the platform, on a cell one can reach', () => {
    const entrance = findObject(map, 'entree-gare')!;
    expect(rodeur.row).toBe(entrance.row);
    expect(isWalkable(map, rodeur, new Set())).toBe(true);
    expect(findPath(entrance, rodeur, (t) => isWalkable(map, t, new Set()))).not.toBeNull();
  });
});
