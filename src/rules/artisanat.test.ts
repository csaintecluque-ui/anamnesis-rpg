import { describe, expect, it } from 'vitest';
import { createNewGame, type GameState } from '../state/gameState';
import { ATELIERS, KEEPER_FEE_FACTOR, RECETTES, canMakeOneself, costOf, craft, missing, recettesOf } from './artisanat';
import { findWeapon } from './combat';
import { applyEffects } from './dialogue';
import { armorBonus, equip, findItem, ownedCount } from './inventory';
import { resonanceMax, useResonanceSap } from './magic';
import { testCharacter } from './questTestKit';

/** L'artisanat : la forge d'Hedda, les herbes de Sévane (docs/gdd/artisanat.md, jalon 3, étape 7). */
const game = (): GameState => createNewGame(testCharacter());
const give = (state: GameState, item: string, count = 1) => applyEffects(state, [{ giveItem: item, count }]);
const recette = (id: string) => RECETTES.find((r) => r.id === id)!;

describe('the recipes', () => {
  it('use known materials, make known things, at one of the two workshops', () => {
    for (const r of RECETTES) {
      expect(ATELIERS[r.atelier], r.id).toBeDefined();
      expect(findItem(r.produit.item), r.id).toBeDefined();
      for (const i of r.ingredients) expect(findItem(i.item), `${r.id} : ${i.item}`).toBeDefined();
      expect(r.fers).toBeGreaterThan(0);
    }
    expect(recettesOf('forge').length).toBeGreaterThanOrEqual(4);
    expect(recettesOf('herbes').length).toBeGreaterThanOrEqual(3);
  });

  it('every material of the loot is good for something', () => {
    const used = new Set(RECETTES.flatMap((r) => r.ingredients.map((i) => i.item)));
    for (const m of ['epines-rodeur', 'crocs-rouille', 'fourrure-mousse', 'coeur-ferraille', 'griffes-sylve', 'dards-rouille', 'glande-soudeur']) expect(used, m).toContain(m);
  });

  it('the improved weapons hit harder, the improved armours protect more', () => {
    expect(findWeapon('epee-trempee')!.damage.sides).toBeGreaterThan(findWeapon('epee-longue')!.damage.sides);
    expect(findWeapon('dague-dentelee')!.damage.sides).toBeGreaterThan(findWeapon('dague')!.damage.sides);
    expect(findItem('armure-cuir-cloutee')!.armorBonus).toBeGreaterThan(findItem('armure-cuir')!.armorBonus!);
    expect(findItem('cuirasse-coeur')!.armorBonus).toBeGreaterThan(findItem('cuirasse-rivetee')!.armorBonus!);
  });
});

describe('crafting', () => {
  it('says what is missing, then takes the materials and the Fers, and gives the thing', () => {
    const state = game();
    state.character!.skills.medicine = 3;
    state.character!.fers = 10;
    const r = recette('fiole-seve');
    expect(missing(state, r)).toEqual(['2 Épines de Rôdeur']);
    expect(craft(state, r)).toEqual([]);
    give(state, 'epines-rodeur', 3);
    const fioles = ownedCount(state.character!, 'fiole-seve');
    expect(craft(state, r)).toEqual(['−2 Épines de Rôdeur', `−${r.fers} Fers`, '+1 Fiole de sève']);
    expect([ownedCount(state.character!, 'epines-rodeur'), ownedCount(state.character!, 'fiole-seve'), state.character!.fers]).toEqual([1, fioles + 1, 10 - r.fers]);
  });

  it('asks Artisanat at the forge, Médecine at the herbs; without it, the keeper does the work, for twice the Fers', () => {
    for (const r of RECETTES) {
      expect(r.competence.skill, r.id).toBe(r.atelier === 'forge' ? 'crafting' : 'medicine');
      expect(r.competence.min, r.id).toBeGreaterThanOrEqual(1);
      expect(r.competence.min, r.id).toBeLessThanOrEqual(4);
    }
    const state = game();
    const c = state.character!;
    const r = recette('epee-trempee');
    c.skills.crafting = 0;
    c.attributes.intellect = 3;
    expect([canMakeOneself(state, r), costOf(state, r)]).toEqual([false, KEEPER_FEE_FACTOR * r.fers]);
    c.fers = r.fers;
    give(state, 'epee-longue');
    give(state, 'crocs-rouille', 2);
    expect(missing(state, r)).toEqual([`${r.fers} Fers`]);
    c.skills.crafting = 2;
    c.attributes.intellect = 4;
    expect([canMakeOneself(state, r), costOf(state, r), missing(state, r)]).toEqual([true, r.fers, []]);
    expect(craft(state, r)).toContain(`−${r.fers} Fers`);
    expect(c.fers).toBe(0);
  });

  it('an armour worn when improved is worn again, improved', () => {
    const state = game();
    const c = state.character!;
    c.fers = 100;
    give(state, 'armure-cuir');
    equip(c, 'armure-cuir', 'armure');
    give(state, 'crocs-rouille', 2);
    give(state, 'fourrure-mousse');
    const before = armorBonus(c);
    craft(state, recette('armure-cuir-cloutee'));
    expect([c.equipment.armure, ownedCount(c, 'armure-cuir'), armorBonus(c)]).toEqual(['armure-cuir-cloutee', 0, before + 1]);
  });

  it('the Sève de Résonance gives Points de Résonance back to the worn crystal', () => {
    const state = game();
    const c = state.character!;
    give(state, 'seve-resonance');
    expect(useResonanceSap(c, 'seve-resonance')).toBeNull();
    give(state, 'cristal-vie');
    equip(c, 'cristal-vie', 'cristal');
    c.resonance = 0;
    expect(useResonanceSap(c, 'seve-resonance')).toBe(Math.min(3, resonanceMax(c)));
    expect(ownedCount(c, 'seve-resonance')).toBe(0);
  });
});
