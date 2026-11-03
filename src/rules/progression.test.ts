import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import {
  TRAITS,
  characterStats,
  createDraft,
  donDue,
  donsAvailable,
  finalSkills,
  finalizeCharacter,
  takeDon,
  type CharacterDraft,
} from './character';
import { heroAttacks, makeHeroCombatant } from './combat';
import { applyLevelUp, startLevelUp } from './leveling';
import { resonanceMax } from './magic';
import { testCharacter } from './questTestKit';
import { heroDiscount } from './reputation';

/** La progression (feuille de route, chantier 6) : un don tous les trois niveaux, des traits qui ont un prix. */

describe('a feat every three levels', () => {
  it('is owed at levels 3, 6 and 9, among the feats not yet taken', () => {
    const c = testCharacter();
    expect(donDue(c)).toBe(false);
    c.level = 3;
    expect(donDue(c)).toBe(true);
    expect(donsAvailable(c).map((f) => f.id)).not.toContain(c.feat);
    takeDon(c, 'peau-dure');
    expect(donDue(c)).toBe(false);
    expect(donsAvailable(c).map((f) => f.id)).not.toContain('peau-dure');
    c.level = 6;
    expect(donDue(c)).toBe(true);
  });

  it('counts at once: ranks and attributes, Défense, resistance, prices', () => {
    const c = testCharacter({}, { lore: 1 });
    const defense = characterStats(c).defense;
    takeDon(c, 'kael-memory');
    expect(c.skills.lore).toBe(3);
    takeDon(c, 'peau-dure');
    expect(characterStats(c).defense).toBe(defense + 1);
    const before = makeHeroCombatant(c, { col: 0, row: 0 }).resistance;
    takeDon(c, 'sang-froid');
    expect(makeHeroCombatant(c, { col: 0, row: 0 }).resistance).toBe(before + 2);
    takeDon(c, 'marchandeur');
    expect(heroDiscount(c, 'tobias')).toBeCloseTo(0.1);
  });
});

describe('a trait at creation: an edge, and its price', () => {
  const draft = (trait: string | null): CharacterDraft => ({
    ...createDraft(),
    name: 'Aube',
    feat: 'tough',
    allocated: { body: 3, agility: 3, vigor: 3, intellect: 3, presence: 3, perception: 4, memory: 5 },
    originBonus: ['body', 'vigor'],
    skillRanks: { ...createDraft().skillRanks, diplomacy: 3, melee: 3 },
    trait,
  });

  it('four of them, each with a good side and a bad one', () => {
    expect(TRAITS).toHaveLength(4);
    for (const t of TRAITS) expect(t.description).toMatch(/mais|;/);
  });

  it('Main lourde: harder blows, a worse tongue', () => {
    const plain = finalizeCharacter(draft(null));
    const heavy = finalizeCharacter(draft('main-lourde'));
    expect(heroAttacks(heavy)[0].damageBonus).toBe(heroAttacks(plain)[0].damageBonus + 1);
    expect(finalSkills(draft('main-lourde')).diplomacy).toBe(1);
  });

  it('Mémoire trouée: a Récit less, a skill point more each level', () => {
    const plain = finalizeCharacter(draft(null));
    const holed = finalizeCharacter(draft('memoire-trouee'));
    expect(characterStats(holed).tales).toBe(characterStats(plain).tales - 1);
    expect(startLevelUp(holed).pointsLeft).toBe(startLevelUp(plain).pointsLeft + 1);
  });

  it('Rêveur·se: more Résonance, fewer PV; Sang de Ferros: steadier, dearer in Verdantis', () => {
    const plain = finalizeCharacter(draft(null));
    const dreamer = finalizeCharacter(draft('reveur'));
    expect(resonanceMax(dreamer)).toBe(resonanceMax(plain) + 2);
    expect(characterStats(dreamer).maxHp).toBe(characterStats(plain).maxHp - 4);
    const ferros = finalizeCharacter(draft('sang-de-ferros'));
    expect(heroDiscount(ferros, 'sevane')).toBeCloseTo(-0.1);
    expect(heroDiscount(ferros, 'kaelis')).toBe(0);
  });

  it('stays through a level-up and a save', () => {
    const state = createNewGame(finalizeCharacter(draft('reveur')));
    applyLevelUp(state.character!, startLevelUp(state.character!));
    expect(state.character!.trait).toBe('reveur');
  });
});
