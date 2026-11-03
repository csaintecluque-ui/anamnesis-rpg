import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame } from '../state/gameState';
import { AVIS_DEPART, changeAvis, joinParty } from './companions';
import { applyEffects, conditionMet, startNode } from './dialogue';
import { choose, optionTexts, testCharacter } from './questTestKit';

/** Les compagnons (docs/gdd/jalon-3.md, étape 2) : recrutement, avis, départ. */
const game = () => {
  const state = createNewGame(testCharacter());
  state.character!.fers = 300;
  return state;
};

describe('recruiting', () => {
  it('Liane comes along once her herbs are gathered', () => {
    const state = game();
    expect(startNode(DIALOGUES.liane, state)).toBe('demande');
    state.quests['herbes-lisiere'] = 'done';
    choose(state, 'liane', 'apres', 'Viens avec moi');
    choose(state, 'liane', 'recrue', 'Compris');
    expect(state.groupe).toEqual([{ id: 'liane', hp: 24 }]);
    expect(conditionMet(state, { compagnon: 'liane' })).toBe(true);
  });

  it('a third companion does not fit', () => {
    const state = game();
    joinParty(state, 'liane');
    joinParty(state, 'boulon');
    state.groupe = [{ id: 'liane', hp: 24 }];
    expect(applyEffects(state, [{ rejoindre: 'boulon' }])).toEqual(['Boulon se joint à toi']);
    expect(applyEffects(state, [{ quitter: 'liane' }])).toEqual(['Liane Sève-Claire quitte le groupe']);
  });
});

describe('what they think', () => {
  it('only counts what they saw, while travelling with the hero', () => {
    const state = game();
    expect(changeAvis(state, 'liane', -2)).toEqual([]);
    expect(state.avis.liane).toBeUndefined();
    joinParty(state, 'liane');
    expect(applyEffects(state, [{ avis: 'liane', delta: 2 }])).toEqual(['Liane approuve']);
  });

  it('a theft seen three times is too much: Liane leaves, and will not come back for now', () => {
    const state = game();
    state.quests['herbes-lisiere'] = 'done';
    joinParty(state, 'liane');
    const steal = DIALOGUES['graines-conseil'].nodes.sacs.options.find((o) => o.text.startsWith('Prendre un sac'))!.effects!;
    applyEffects(state, steal);
    applyEffects(state, steal);
    expect(applyEffects(state, steal)).toContain('Liane en a assez, et quitte le groupe');
    expect(state.avis.liane).toBeLessThanOrEqual(AVIS_DEPART);
    expect(state.groupe).toEqual([]);
    expect(optionTexts(state, 'liane', 'apres')).toEqual(['Laisse-moi voir tes malades.', '…']);
  });

  it('shows in her greeting', () => {
    const state = game();
    joinParty(state, 'liane');
    expect(startNode(DIALOGUES['compagnon-liane'], state)).toBe('route');
    state.avis.liane = 3;
    expect(startNode(DIALOGUES['compagnon-liane'], state)).toBe('route-bon');
    state.avis.liane = -3;
    expect(startNode(DIALOGUES['compagnon-liane'], state)).toBe('route-froid');
  });
});

describe('Boulon', () => {
  it('pays the way: 120 Fers to strike him off the stock, and he follows', () => {
    const state = game();
    state.flags['boulon-accueilli'] = true;
    choose(state, 'boulon', 'accueil', 'Parlons un peu');
    choose(state, 'boulon', 'parler', 'Tu ne voyages jamais');
    choose(state, 'boulon', 'voyage', 'Et si tu venais avec moi');
    expect(startNode(DIALOGUES.noam, state)).toBe('registre');
    choose(state, 'noam', 'registre', 'Racheter son contrat');
    expect(state.character!.fers).toBe(180);
    expect(startNode(DIALOGUES.boulon, state)).toBe('libre');
    applyEffects(state, DIALOGUES.boulon.nodes.libre.effects);
    choose(state, 'boulon', 'libre', 'En route, Boulon');
    expect(state.groupe.map((m) => m.id)).toEqual(['boulon']);
  });

  it('still finds the caravan at the West station', () => {
    const state = game();
    joinParty(state, 'boulon');
    state.location = 'ironheart-forges';
    expect(startNode(DIALOGUES['compagnon-boulon'], state)).toBe('gare');
    choose(state, 'compagnon-boulon', 'gare', 'Payer la caravane');
    expect(state.character!.fers).toBe(285);
  });
});

describe('saves', () => {
  it('give older saves no opinions yet', () => {
    const state = game();
    state.avis = { liane: 2 };
    const old = JSON.parse(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    old.version = 12;
    delete old.state.avis;
    const parsed = parseSave(JSON.stringify(old));
    expect(parsed.ok && parsed.value.state.avis).toEqual({});
  });
});
