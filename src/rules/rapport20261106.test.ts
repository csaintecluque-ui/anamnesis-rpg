import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { createDraft, draftErrors, characterError, MAX_XP, type CharacterDraft } from './character';
import { GOLEM_QUEST_FIGHT } from './combat';
import { startNode, startsCombat } from './dialogue';
import { mapObjectHint } from './hints';
import { buyPrice, findItem, sellPrice } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';

/** Ce que le test du 2026-11-06 a trouvé, et qui ne doit pas revenir. */

describe('le Golem, pendant « Le Dernier Train »', () => {
  it('prévient avant le combat : le survol le dit, et un clic ouvre un avertissement, pas le combat', () => {
    const state = createNewGame(testCharacter());
    state.quests['dernier-train'] = 'active';
    expect(startNode(DIALOGUES['golem-gare'], state)).toBe('quete');
    const option = choose(state, 'golem-gare', 'quete', 'L’attaquer');
    expect(startsCombat(option.effects)).toBe(GOLEM_QUEST_FIGHT);
    expect(optionTexts(state, 'golem-gare', 'quete')).toContain('Reculer, et chercher une autre façon d’arrêter le chantier.');
    expect(mapObjectHint({ name: 'golem', type: 'golem', col: 0, row: 0, properties: {} }, state)).toMatch(/combat difficile/);
  });
});

describe('le troc', () => {
  it('ne rachète jamais un objet autant que le marchand le revend : pas de Fers tirés de rien', () => {
    const armour = findItem('armure-ferraille')!;
    // The best price a trader can make (−40 %) against the best a town pays (70 %).
    const resale = buyPrice(armour, 0.4);
    expect(sellPrice(armour, 0.7, resale)).toBeLessThan(resale);
    expect(sellPrice(armour, 0.5)).toBe(Math.floor(armour.price / 2));
  });
});

describe('les traits', () => {
  it('« Main lourde » demande les rangs de Diplomatie qu’elle coûte', () => {
    const base: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough', trait: 'main-lourde' };
    expect(draftErrors(base).feat.join(' ')).toMatch(/Main lourde/);
    const diplomate = { ...base, skillRanks: { ...base.skillRanks, diplomacy: 2 } };
    expect(draftErrors(diplomate).feat).toEqual([]);
  });
});

describe('les sauvegardes', () => {
  it('refusent une expérience démesurée (elle gelait l’onglet)', () => {
    const c = testCharacter();
    expect(characterError({ ...c, xp: 1e300 })).toBe('expérience invalide.');
    expect(characterError({ ...c, xp: MAX_XP })).toBeNull();
  });
});

describe('la caravane de Canopéa', () => {
  it('dit à qui n’a pas quinze Fers que la Grande Nacelle redescend pour rien', () => {
    const state = createNewGame(testCharacter());
    state.character!.fers = 0;
    expect(optionTexts(state, 'chef-caravane', 'gardebois')).toContain('Je n’ai pas quinze Fers.');
    expect(DIALOGUES['chef-caravane'].nodes['sans-fers'].text).toMatch(/Grande Nacelle/);
  });
});
