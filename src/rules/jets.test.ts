import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { expireFlags, failureIsFree, rollLockFlag, rollOption, visibleOptions, type NodePlace } from './dialogue';
import { testCharacter } from './questTestKit';
import { createSave, parseSave, serializeSave } from '../save/codec';

/** Les dés à graine et « réessayer demain » (test du 2026-11-06, décision de Cyril ; src/rules/dialogue.ts). */

const SOUTE: NodePlace = { dialogue: 'porte-soute', node: 'verrouillee' };
const BANC: NodePlace = { dialogue: 'banc-perles', node: 'banc' };

const encode = (state: GameState): string => serializeSave(createSave(state, new Date(0)));
function decode(text: string): GameState {
  const save = parseSave(text);
  if (!save.ok) throw new Error(save.error);
  return save.value.state;
}

function hero(day = 1): GameState {
  const state = createNewGame(testCharacter());
  state.time.day = day;
  state.quests['premiere-perle'] = 'active';
  return state;
}

/** The first day from `from` on which the first try of a roll fails. */
function failingDay(place: NodePlace, index: number, from = 1): number {
  for (let day = from; ; day++) if (!rollOption(hero(day), DIALOGUES[place.dialogue], place, index).success) return day;
}

describe('the die of a dialogue comes from a seed', () => {
  it('reloading gives the same die: the same day, the same roll, the same hero', () => {
    for (let day = 1; day <= 40; day++) {
      const before = hero(day);
      const saved = encode(before);
      const first = rollOption(before, DIALOGUES['porte-soute'], SOUTE, 0);
      const again = rollOption(decode(saved), DIALOGUES['porte-soute'], SOUTE, 0);
      expect(again.notice).toBe(first.notice);
    }
  });

  it('another day, another die', () => {
    const dice = new Set<string>();
    for (let day = 1; day <= 40; day++) dice.add(rollOption(hero(day), DIALOGUES['porte-soute'], SOUTE, 0).notice);
    expect(dice.size).toBeGreaterThan(8);
  });

  it('another hero, other dice', () => {
    const notices = (name: string) =>
      Array.from({ length: 30 }, (_, i) => {
        const state = hero(i + 1);
        state.character!.name = name;
        return rollOption(state, DIALOGUES['porte-soute'], SOUTE, 0).notice;
      }).join();
    expect(notices('Aube')).not.toBe(notices('Brune'));
  });
});

describe('a roll failed for nothing waits for tomorrow', () => {
  it('the lock of the padlock: greyed the rest of the day, back the next day', () => {
    expect(failureIsFree(DIALOGUES['porte-soute'], DIALOGUES['porte-soute'].nodes.verrouillee.options[0])).toBe(true);
    const day = failingDay(SOUTE, 0);
    const state = hero(day);
    rollOption(state, DIALOGUES['porte-soute'], SOUTE, 0);
    expect(state.flags[rollLockFlag(SOUTE, 0)]).toBe(true);
    const locked = visibleOptions(DIALOGUES['porte-soute'].nodes.verrouillee, state, SOUTE)[0];
    expect(locked.enabled).toBe(false);
    expect(locked.missing).toMatch(/demain/);
    // Without saying where the node stands (the tests of the quests), nothing changes.
    expect(visibleOptions(DIALOGUES['porte-soute'].nodes.verrouillee, state)[0].enabled).toBe(true);
    state.time.day++;
    expireFlags(state);
    expect(visibleOptions(DIALOGUES['porte-soute'].nodes.verrouillee, state, SOUTE)[0].enabled).toBe(true);
  });

  it('a failure that costs (a wound) can be paid again, for another die', () => {
    expect(failureIsFree(DIALOGUES['banc-perles'], DIALOGUES['banc-perles'].nodes.banc.options[0])).toBe(false);
    let differs = false;
    for (let day = 1; day <= 30; day++) {
      const state = hero(day);
      const first = rollOption(state, DIALOGUES['banc-perles'], BANC, 0);
      expect(state.flags[rollLockFlag(BANC, 0)]).toBeUndefined();
      expect(visibleOptions(DIALOGUES['banc-perles'].nodes.banc, state, BANC)[0].enabled).toBe(true);
      if (rollOption(state, DIALOGUES['banc-perles'], BANC, 0).notice !== first.notice) differs = true;
    }
    expect(differs).toBe(true);
  });

  it('the count of the day starts again the next day, and is kept in the save', () => {
    const state = hero(3);
    rollOption(state, DIALOGUES['banc-perles'], BANC, 0);
    rollOption(state, DIALOGUES['banc-perles'], BANC, 0);
    expect(state.jets).toEqual({ jour: 3, essais: { 'banc-perles-banc-0': 2 } });
    expect(decode(encode(state)).jets).toEqual(state.jets);
    state.time.day = 4;
    rollOption(state, DIALOGUES['banc-perles'], BANC, 0);
    expect(state.jets).toEqual({ jour: 4, essais: { 'banc-perles-banc-0': 1 } });
  });
});
