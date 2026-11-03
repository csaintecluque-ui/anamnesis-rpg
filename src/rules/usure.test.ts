import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { WEAR_DULL, WEAR_WORN } from './character';
import { heroAttacks } from './combat';
import { applyEffects, expireFlags, startNode } from './dialogue';
import { addItem, armorBonus } from './inventory';
import { payCast, findPower, resonanceMax } from './magic';
import { choose, testCharacter } from './questTestKit';
import { CAST_WEAR, crystalWear, repair, repairCost, wearEquipment, wearOf } from './usure';

/** Des dépenses qui reviennent (feuille de route, chantier 6 ; docs/gdd/economie.md). */

function armed() {
  const c = testCharacter({}, { melee: 3 });
  addItem(c, 'epee-longue', 1);
  addItem(c, 'armure-cuir', 1);
  c.equipment.mainDroite = 'epee-longue';
  c.equipment.armure = 'armure-cuir';
  return c;
}

describe('the wear of weapons and armour', () => {
  it('dulls after six fights (−1), wears after twelve (−2), and says so', () => {
    const c = armed();
    const hit = heroAttacks(c)[0].toHitBonus;
    const armor = armorBonus(c);
    const notices: string[] = [];
    for (let i = 0; i < WEAR_DULL; i++) notices.push(...wearEquipment(c));
    expect(notices.some((n) => n.startsWith('Épée longue s’émousse'))).toBe(true);
    expect([heroAttacks(c)[0].toHitBonus, armorBonus(c)]).toEqual([hit - 1, armor - 1]);
    for (let i = WEAR_DULL; i < WEAR_WORN + 3; i++) wearEquipment(c);
    expect([wearOf(c, 'epee-longue'), heroAttacks(c)[0].toHitBonus]).toEqual([WEAR_WORN, hit - 2]);
  });

  it('is repaired at a merchant, for a share of the price', () => {
    const c = armed();
    for (let i = 0; i < WEAR_DULL; i++) wearEquipment(c);
    const cost = repairCost(c, 'epee-longue');
    expect(cost).toBeGreaterThan(0);
    c.fers = cost - 1;
    expect(repair(c, 'epee-longue')).toBe(false);
    c.fers = cost;
    expect(repair(c, 'epee-longue')).toBe(true);
    expect([c.fers, wearOf(c, 'epee-longue'), repairCost(c, 'epee-longue')]).toEqual([0, 0, 0]);
  });
});

describe('the wear of the crystal', () => {
  it('takes a Point de Résonance every six casts; the tailleuse tunes it for 20 Fers', () => {
    const state = createNewGame(testCharacter({}, { resonance: 2 }));
    const c = state.character!;
    addItem(c, 'cristal-forge', 1);
    c.equipment.cristal = 'cristal-forge';
    const full = resonanceMax(c);
    const flames = findPower('flammes')!;
    for (let i = 0; i < CAST_WEAR; i++) {
      c.resonance = 10;
      payCast(c, flames, () => 0.99);
    }
    expect([crystalWear(c), resonanceMax(c)]).toEqual([1, full - 1]);
    expect(startNode(DIALOGUES.tailleuse, state)).toBe('usure');
    c.fers = 20;
    choose(state, 'tailleuse', 'usure', 'Le faire réaccorder');
    expect([c.fers, crystalWear(c), resonanceMax(c)]).toEqual([0, 0, full]);
  });
});

describe('a visitor’s pass at Ironheart', () => {
  it('lasts a week, then the funicular asks for another', () => {
    const state = createNewGame(testCharacter());
    state.character!.fers = 10;
    choose(state, 'patrouilleur', 'controle', 'Acheter un laissez-passer');
    expect(state.flags['laissez-passer-ironheart']).toBe(true);
    state.time.day += 6;
    expect(expireFlags(state)).toEqual([]);
    state.time.day += 1;
    expect(expireFlags(state)).toEqual(['laissez-passer-ironheart']);
    expect(state.flags['laissez-passer-ironheart']).toBeUndefined();
    applyEffects(state, [{ setFlag: 'autre' }]);
    expect(expireFlags(state)).toEqual([]);
  });
});
