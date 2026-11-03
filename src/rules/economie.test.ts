import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { parseTiledMap } from '../engine/tiledMap';
import { createNewGame } from '../state/gameState';
import { findEnemy } from './combat';
import { findItem } from './inventory';
import { testCharacter } from './questTestKit';
import { REPAIR_DIVISOR } from './usure';
import { VOIE_DEPTH, voieLevel, voiePlan } from './voies';

/**
 * L'économie (feuille de route, chantier 6 : « les Fers gardent de la valeur jusqu'à la fin du chapitre 4 ») : ce
 * qu'une descente dans une voie endormie rapporte, moins ce qu'elle coûte (les réparations de ses combats, une nuit et
 * un repas), selon le nombre de fois qu'on y est déjà descendu. docs/gdd/economie.md.
 */

/** A hero of chapter 3 or 4: épée trempée (70 Fers) and armure de cuir clouté (80 Fers). */
const GEAR_PRICE = 70 + 80;
const NIGHT_AND_MEAL = 8 + 8;

function descent(site: string, visit: number, seeds = 60) {
  let crates = 0;
  let loot = 0;
  let fights = 0;
  for (let seed = 1; seed <= seeds; seed++) {
    for (let depth = 1; depth <= VOIE_DEPTH; depth++) {
      const state = createNewGame(testCharacter());
      state.voie = { site, seed: seed * 7919, depth };
      state.voiesFaites = { [site]: visit };
      const { objects, dialogues } = voieLevel(state, parseTiledMap(MAPS[voiePlan(state.voie)]));
      for (const [id, d] of Object.entries(dialogues)) {
        if (!id.startsWith('voie-coffre')) continue;
        for (const e of d.nodes.ouverte.effects ?? []) {
          if ('giveFers' in e) crates += e.giveFers;
          if ('giveItem' in e) loot += (findItem(e.giveItem)?.price ?? 0) * 0.5 * ('count' in e && e.count ? e.count : 1);
        }
      }
      const groups = new Set(objects.filter((o) => o.type === 'ennemi').map((o) => o.properties.voie));
      fights += groups.size;
      for (const o of objects.filter((o) => o.type === 'ennemi')) {
        for (const b of findEnemy(o.properties.ennemi)?.butin ?? []) {
          loot += b.chance * ((b.fers ? (b.fers[0] + b.fers[1]) / 2 : 0) + (b.item ? (findItem(b.item)?.price ?? 0) * 0.5 * (b.count ?? 1) : 0));
        }
      }
    }
  }
  const upkeep = (fights / seeds) * (GEAR_PRICE / REPAIR_DIVISOR) + NIGHT_AND_MEAL;
  return { crates: crates / seeds, net: (crates + loot) / seeds - upkeep };
}

describe('the sleeping lines pay less and less', () => {
  for (const site of ['halte-fougeres', 'depot-sept']) {
    it(`${site} : the crates of a fourth descent hold under half of the first’s, and its net is far lower`, () => {
      const first = descent(site, 1);
      const fourth = descent(site, 4);
      expect(fourth.crates).toBeLessThan(first.crates * 0.45);
      expect(fourth.net).toBeLessThan(first.net * 0.6);
      expect(fourth.net).toBeGreaterThan(0);
    }, 60000);
  }
});
