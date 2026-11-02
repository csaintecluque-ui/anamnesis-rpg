import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame } from '../state/gameState';
import { characterStats } from './character';
import { applyEffects, conditionMet, startNode } from './dialogue';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { advance, formatDate, isNight, momentOf, shortTime, sleepUntil, waitUntil, type GameTime } from './time';

/** Le temps et les auberges (docs/gdd/temps.md). */
const at = (day: number, phase: number): GameTime => ({ day, phase });

describe('the calendar of the canon', () => {
  it('starts on the 1st of the eighth month of the year 3000, in the morning', () => {
    const state = createNewGame(testCharacter());
    expect(state.time).toEqual({ day: 1, phase: 0 });
    expect(formatDate(state.time)).toBe('le 1er du huitième mois de l’an 3000');
    expect(shortTime(state.time)).toBe('jour 1 · matin');
  });

  it('turns the months (31 days in the eighth) and the year', () => {
    expect(formatDate(at(31, 0))).toBe('le 31 du huitième mois de l’an 3000');
    expect(formatDate(at(32, 0))).toBe('le 1er du neuvième mois de l’an 3000');
    expect(formatDate(at(1 + 153, 0))).toBe('le 1er du premier mois de l’an 3001');
  });
});

describe('the moments of the day', () => {
  it('advances a quarter of a day at a time, into the next day', () => {
    const t = at(1, 2);
    advance(t, 3);
    expect(t).toEqual({ day: 2, phase: 1 });
  });

  it('waits until a moment, or not at all when it is already that moment', () => {
    const t = at(1, 1);
    expect(waitUntil(t, 'nuit')).toBe(2);
    expect(isNight(t)).toBe(true);
    expect(waitUntil(t, 'nuit')).toBe(0);
    expect(waitUntil(t, 'matin')).toBe(1);
    expect(t).toEqual({ day: 2, phase: 0 });
  });

  it('sleeps at least until the next moment of its kind', () => {
    const t = at(1, 0);
    expect(sleepUntil(t, 'matin')).toBe(4);
    expect(t).toEqual({ day: 2, phase: 0 });
    sleepUntil(t, 'nuit');
    expect(momentOf(t)).toBe('nuit');
  });
});

describe('time in the dialogues', () => {
  it('reads the moment and the day', () => {
    const state = createNewGame(testCharacter());
    expect(conditionMet(state, { moment: 'jour' })).toBe(true);
    expect(conditionMet(state, { moment: 'nuit' })).toBe(false);
    expect(conditionMet(state, { tousLes: 3, decalage: 0 })).toBe(true);
    state.time = at(3, 3);
    expect(conditionMet(state, { moment: 'nuit' })).toBe(true);
    expect(conditionMet(state, { tousLes: 3, decalage: 2 })).toBe(true);
  });

  it('makes the night come for real: the cold forge, the night watch at the triage', () => {
    const state = createNewGame(testCharacter());
    choose(state, 'forge-eteinte', 'jour', 'Revenir à la nuit tombée');
    expect(momentOf(state.time)).toBe('nuit');
    expect(state.quests['echos-forge']).toBe('active');
  });

  it('takes half a day by train, and brings the caravan in at evening', () => {
    const state = createNewGame(testCharacter());
    applyEffects(state, DIALOGUES['guichet-ouest'].nodes['train-canopee'].options[0].effects);
    expect(momentOf(state.time)).toBe('soir');
    applyEffects(state, DIALOGUES.convoyeuse.nodes['trajet-canopee'].options[0].effects);
    expect(state.time).toEqual({ day: 2, phase: 2 });
  });
});

describe('the inns', () => {
  it('sell a night until morning or until night: all PV back, and the clock moves on', () => {
    const state = createNewGame(testCharacter());
    state.character!.fers = 30;
    state.character!.hp = 1;
    choose(state, 'dorna', 'accueil', 'Manger ou dormir');
    expect(optionTexts(state, 'dorna', 'servir')).toEqual(['Une soupe épaisse.', 'Un lit jusqu’au matin.', 'Un lit jusqu’à la nuit.', 'Rien, merci.']);
    choose(state, 'dorna', 'servir', 'Un lit jusqu’au matin');
    expect(state.character!.fers).toBe(22);
    expect(state.character!.hp).toBe(characterStats(state.character!).maxHp);
    expect(state.time).toEqual({ day: 2, phase: 0 });
    choose(state, 'lisandre', 'accueil', 'Manger ou dormir');
    choose(state, 'lisandre', 'servir', 'Un hamac jusqu’à la nuit');
    expect(state.character!.fers).toBe(12);
    expect(state.time).toEqual({ day: 2, phase: 3 });
  });

  it('greet with the news of the day, a different one three days running', () => {
    const state = createNewGame(testCharacter());
    const greetings = [1, 2, 3].map((day) => {
      state.time = at(day, 0);
      return startNode(DIALOGUES.sylvan, state);
    });
    expect(greetings).toEqual(['accueil', 'accueil-2', 'accueil-3']);
  });
});

describe('saves and the time of day', () => {
  it('keeps the day and the moment, and gives the first morning to older saves', () => {
    const state = createNewGame(testCharacter());
    state.time = at(5, 2);
    const parsed = parseSave(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    expect(parsed.ok && parsed.value.state.time).toEqual({ day: 5, phase: 2 });
    const old = JSON.parse(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    old.version = 9;
    delete old.state.time;
    const migrated = parseSave(JSON.stringify(old));
    expect(migrated.ok && migrated.value.state.time).toEqual({ day: 1, phase: 0 });
  });
});
