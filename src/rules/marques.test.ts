import { describe, expect, it } from 'vitest';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame } from '../state/gameState';
import { applyEffects, conditionMet, performRoll, rollChance, startNode } from './dialogue';
import { DIALOGUES } from '../data/dialogues';
import { equip, ownedCount } from './inventory';
import { castOutsideCombat, payCast, findPower, resonanceMax } from './magic';
import { ECLATS, effacerMarques, forcingDifficulty, manqueMalus, marquesLabel, payThePrice } from './marques';
import { choose, testCharacter } from './questTestKit';
import { momentOf } from './time';

/** Le prix de la magie (jalon 3, étape 5, docs/gdd/passe-sombre.md) : forcer le cristal laisse des marques. */
const LOW = () => 0; // a 1 on the d20
const HIGH = () => 0.99; // a 20

const gameWith = (crystal = 'cristal-vie') => {
  const state = createNewGame(testCharacter());
  state.character!.inventory.push({ itemId: crystal, count: 1 });
  expect(equip(state.character!, crystal, 'cristal')).toBe(true);
  return state;
};

describe('forcing the crystal', () => {
  it('rolls d20 + Vigueur + Résonance against 10 + 2 by missing PR, only when PR are missing', () => {
    expect([forcingDifficulty(1), forcingDifficulty(2)]).toEqual([12, 14]);
    const c = gameWith().character!;
    expect(payThePrice(c, 0, LOW)).toEqual([]);
    expect(payThePrice(c, 1, HIGH)).toEqual(['Jet de Vigueur : 20 + 1 = 21 contre 12 : le cristal te laisse en paix, cette fois.']);
    expect(c.marques ?? 0).toBe(0);
  });

  it('leaves the three marks one by one, then splits the worn crystal, whose shards stay', () => {
    const c = gameWith().character!;
    expect(payThePrice(c, 2, LOW)).toEqual(['Jet de Vigueur : 1 + 1 = 2 contre 14 : raté.', expect.stringMatching(/^Les veines : /)]);
    expect(payThePrice(c, 1, LOW)[1]).toMatch(/^Le manque : /);
    expect(payThePrice(c, 1, LOW)[1]).toMatch(/^La peau de cristal : /);
    expect(c.marques).toBe(3);
    expect(marquesLabel(c)).toMatch(/Les veines .*Le manque .*La peau de cristal/);
    expect(payThePrice(c, 1, LOW)[1]).toMatch(/Cristal de Vie se fend/);
    expect(c.marques).toBe(3);
    expect(c.equipment.cristal).toBeNull();
    expect(ownedCount(c, 'cristal-vie')).toBe(0);
    expect(ownedCount(c, ECLATS)).toBe(1);
  });

  it('is rolled by every forced cast: in a dialogue or the inventory, and in a fight (payCast)', () => {
    const c = gameWith().character!;
    c.resonance = 0;
    expect(castOutsideCombat(c, 'lueur', false, LOW)).toContainEqual(expect.stringMatching(/^Les veines/));
    c.resonance = 0;
    expect(payCast(c, findPower('guerison')!, LOW)).toMatchObject({ resonance: 0, hp: 6, prix: [expect.any(String), expect.stringMatching(/^Le manque/)] });
    c.resonance = 3;
    expect(payCast(c, findPower('guerison')!, LOW)).toEqual({ resonance: 2, hp: 0, prix: [] });
  });
});

describe('what the marks do', () => {
  it('le manque: −1 to the dice without a crystal at the neck, from the second mark', () => {
    const state = gameWith();
    const c = state.character!;
    const roll = { skill: 'stealth' as const, difficulty: 10 };
    const base = rollChance(state, roll);
    c.marques = 2;
    expect(manqueMalus(c)).toBe(0);
    expect(rollChance(state, roll)).toBe(base);
    c.equipment.cristal = null;
    expect(manqueMalus(c)).toBe(1);
    expect(rollChance(state, roll)).toBeCloseTo(base - 0.05);
    // Discrétion: Agilité +0, rang 3, less the craving.
    expect(performRoll(state, roll, () => 0.5).notice).toMatch(/11 \+ 2 = 13/);
  });

  it('la peau de cristal: one Point de Résonance less, and the PR above it are gone', () => {
    const c = gameWith().character!;
    expect(resonanceMax(c)).toBe(3);
    c.marques = 2;
    payThePrice(c, 1, LOW);
    expect(resonanceMax(c)).toBe(2);
    expect(c.resonance).toBe(2);
  });

  it('a Druide Vert takes them back, and a rank of Résonance with them', () => {
    const c = gameWith().character!;
    expect(effacerMarques(c)).toBe(false);
    c.skills.resonance = 2;
    c.resonance = 5;
    c.marques = 3;
    expect(effacerMarques(c)).toBe(true);
    expect([c.marques, c.skills.resonance, c.resonance, resonanceMax(c)]).toEqual([0, 1, 4, 4]);
    c.skills.resonance = 0;
    c.marques = 1;
    expect(effacerMarques(c)).toBe(true);
    expect(c.skills.resonance).toBe(0);
  });
});

describe('the town sees them', () => {
  it('is a story condition (« marques »), with an optional maximum', () => {
    const state = gameWith();
    expect(conditionMet(state, { marques: 1 })).toBe(false);
    expect(conditionMet(state, { marques: 0, max: 0 })).toBe(true);
    state.character!.marques = 2;
    expect(conditionMet(state, { marques: 1 })).toBe(true);
    expect(conditionMet(state, { marques: 0, max: 1 })).toBe(false);
  });

  it('Vanel sees the veins first, and takes them back (« Reprends-les »)', () => {
    const state = gameWith();
    state.character!.marques = 1;
    state.character!.skills.resonance = 1;
    expect(startNode(DIALOGUES.vanel, state)).toBe('marques');
    applyEffects(state, DIALOGUES.vanel.nodes.marques.effects);
    choose(state, 'vanel', 'marques', 'Reprends-les');
    expect([state.character!.marques, state.character!.skills.resonance]).toEqual([0, 0]);
    expect(startNode(DIALOGUES.vanel, state)).toBe('accueil');
  });

  it('Vanel buries the shards of a split crystal', () => {
    const state = gameWith();
    state.character!.inventory.push({ itemId: ECLATS, count: 1 });
    expect(startNode(DIALOGUES.vanel, state)).toBe('eclats');
    applyEffects(state, DIALOGUES.vanel.nodes.eclats.effects);
    choose(state, 'vanel', 'eclats', 'Les lui donner');
    expect(ownedCount(state.character!, ECLATS)).toBe(0);
  });

  it('at Ironheart, the veins are « rouille de l’âme »: a bribe, a bluff, or a night at the post', () => {
    const state = gameWith('cristal-forge');
    state.character!.marques = 1;
    expect(startNode(DIALOGUES.patrouilleur, state)).toBe('rouille');
    const day = state.time.day;
    choose(state, 'patrouilleur', 'rouille', 'Je n’ai rien à cacher');
    expect(state.flags['rouille-signalee']).toBe(true);
    expect([state.time.day, momentOf(state.time)]).toEqual([day + 1, 'matin']);
    expect(startNode(DIALOGUES.patrouilleur, state)).toBe('liste');

    const other = gameWith('cristal-forge');
    other.character!.marques = 1;
    other.character!.fers = 20;
    choose(other, 'patrouilleur', 'rouille', 'Lui glisser vingt Fers');
    expect([other.character!.fers, other.flags['rouille-ame'], other.flags['rouille-signalee']]).toEqual([0, true, undefined]);
  });

  it('keeps v14 saves valid (no marks), saves the marks, and refuses nonsense', () => {
    const state = gameWith();
    expect(parseSave(serializeSave(createSave(state, new Date('2026-11-02T10:00:00Z')))).ok).toBe(true);
    state.character!.marques = 2;
    const parsed = parseSave(serializeSave(createSave(state, new Date('2026-11-02T10:00:00Z'))));
    expect(parsed.ok && parsed.value.state.character!.marques).toBe(2);
    state.character!.marques = 7;
    expect(parseSave(serializeSave(createSave(state, new Date('2026-11-02T10:00:00Z')))).ok).toBe(false);
  });
});
