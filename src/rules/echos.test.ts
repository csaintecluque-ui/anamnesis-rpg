import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { isWalkable, parseTiledMap, tileKey } from '../engine/tiledMap';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame, findLocation } from '../state/gameState';
import { joinParty } from './companions';
import { applyEffects, rollChance, startNode } from './dialogue';
import { ECHOS, collectedEchos, echoFlag, echoObjects, echoShows, empriseMalus } from './echos';
import { FIGURANTS } from './figurants';
import { findRecit, knowsRecit } from './recits';
import { choose, testCharacter } from './questTestKit';

/** Le Livre des Échos (docs/gdd/echos.md, jalon 3, étape 3). */
const game = () => createNewGame(testCharacter());

describe('the Échos', () => {
  it('are twelve, each on a free cell of its place, off the passers-by’s paths', () => {
    expect(ECHOS).toHaveLength(12);
    for (const e of ECHOS) {
      const location = findLocation(e.lieu);
      expect(location, e.id).toBeDefined();
      const map = parseTiledMap(MAPS[location!.map]);
      const occupied = new Set(map.objects.map(tileKey));
      expect(isWalkable(map, e, occupied), `${e.id} sur une case libre`).toBe(true);
      const paths = FIGURANTS.filter((f) => f.location === e.lieu).flatMap((f) => (f.path ?? []).map(([c, r]) => `${c},${r}`));
      expect(paths, e.id).not.toContain(tileKey(e));
      if (e.recit) expect(findRecit(e.recit), e.recit).toBeDefined();
    }
    expect(echoObjects('gare-engloutie').map((o) => o.name)).toEqual(['echo-jeudi-ordinaire', 'echo-lumiere']);
  });

  it('some only show at night', () => {
    const state = game();
    expect(echoShows('nuit', state)).toBe(false);
    expect(echoShows('jour', state)).toBe(true);
    state.time = { day: 1, phase: 3 };
    expect([echoShows('nuit', state), echoShows('jour', state), echoShows(undefined, state)]).toEqual([true, false, true]);
  });

  it('are gathered by listening to the end: XP, a page of the book, sometimes a Récit', () => {
    const state = game();
    choose(state, 'echo-soixante-douze', 'scene', 'Écouter jusqu’au bout');
    expect(state.flags[echoFlag('soixante-douze')]).toBe(true);
    expect(state.character!.xp).toBe(15);
    expect(knowsRecit(state.character!, 'soixante-douze-heures')).toBe(true);
    expect(collectedEchos(state).map((e) => e.id)).toEqual(['soixante-douze']);
    expect(startNode(DIALOGUES['echo-soixante-douze'], state)).toBe('revivre');
  });

  it('a cursed one holds on when the roll fails: PV lost, then torn away', () => {
    const state = game();
    const hp = state.character!.hp;
    const trap = DIALOGUES['echo-cendriere'].nodes.piege;
    applyEffects(state, trap.effects);
    expect(state.character!.hp).toBe(hp - 8);
    choose(state, 'echo-cendriere', 'piege', 'S’arracher');
    expect(state.flags[echoFlag('cendriere')]).toBe(true);
  });
});

describe('the emprise', () => {
  it('grows each time an Écho is relived: a moment of peace, time lost, and the dice weigh more', () => {
    const state = game();
    joinParty(state, 'liane');
    state.flags[echoFlag('puits')] = true;
    state.character!.hp = 10;
    const roll = { skill: 'stealth' as const, difficulty: 10 };
    const before = rollChance(state, roll);
    for (let i = 0; i < 3; i++) choose(state, 'echo-puits', 'revivre', 'Revivre encore');
    expect([state.emprise, state.character!.hp, state.time]).toEqual([3, 25, { day: 1, phase: 3 }]);
    expect(empriseMalus(state)).toBe(1);
    expect(rollChance(state, roll)).toBeCloseTo(before - 0.05);
    expect(state.avis.liane).toBe(-3);
    state.emprise = 5;
    expect(empriseMalus(state)).toBe(2);
  });

  it('loosens with a night’s sleep', () => {
    const state = game();
    state.emprise = 4;
    applyEffects(state, [{ dormir: 'matin' }]);
    expect(state.emprise).toBe(3);
  });

  it('starts at nothing for older saves', () => {
    const state = game();
    state.emprise = 2;
    const old = JSON.parse(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    old.version = 13;
    delete old.state.emprise;
    const parsed = parseSave(JSON.stringify(old));
    expect(parsed.ok && parsed.value.state.emprise).toBe(0);
  });
});
