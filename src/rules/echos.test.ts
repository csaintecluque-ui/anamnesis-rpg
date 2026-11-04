import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { isWalkable, parseTiledMap, tileKey } from '../engine/tiledMap';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame, findLocation } from '../state/gameState';
import { joinParty } from './companions';
import { applyEffects, rollChance, startNode } from './dialogue';
import { ECHOS, collectedEchos, echoFlag, echoObjects, echoShows, empriseMalus, souvenirBonus, SOUVENIR_BONUS } from './echos';
import { FIGURANTS } from './figurants';
import { findRecit, knowsRecit } from './recits';
import { choose, testCharacter } from './questTestKit';

/** Le Livre des Échos (docs/gdd/echos.md, jalon 3, étape 3). */
const game = () => createNewGame(testCharacter());

describe('the Échos', () => {
  it('are sixteen, each on a free cell of its place, off the passers-by’s paths', () => {
    expect(ECHOS).toHaveLength(16);
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
  it('reliving gives a « souvenir vif » (+3 to its skill until sleep), but the emprise grows by 2 and weighs on every roll', () => {
    const state = game();
    joinParty(state, 'liane');
    state.flags[echoFlag('puits')] = true;
    state.flags[echoFlag('registre')] = true;
    const stealth = { skill: 'stealth' as const, difficulty: 10 };
    const medicine = { skill: 'medicine' as const, difficulty: 12 };
    const [stealthBefore, medicineBefore] = [rollChance(state, stealth), rollChance(state, medicine)];
    // Once: Médecine +3, no weight yet.
    choose(state, 'echo-puits', 'revivre', 'Revivre encore');
    expect([state.emprise, empriseMalus(state)]).toEqual([2, 0]);
    expect(rollChance(state, medicine)).toBeCloseTo(medicineBefore + 0.15);
    // Twice more: the emprise is at 6, every roll weighs 2 more; one souvenir at a time (the last one).
    choose(state, 'echo-puits', 'revivre', 'Revivre encore');
    choose(state, 'echo-registre', 'revivre', 'Revivre encore');
    expect([state.emprise, empriseMalus(state), state.time]).toEqual([6, 2, { day: 1, phase: 3 }]);
    expect([souvenirBonus(state, 'medicine'), souvenirBonus(state, 'lore')]).toEqual([0, SOUVENIR_BONUS]);
    expect(rollChance(state, stealth)).toBeCloseTo(stealthBefore - 0.1);
    expect(state.avis.liane).toBe(-3);
    // A night: the souvenir fades, the emprise eases by one only.
    applyEffects(state, [{ dormir: 'matin' }]);
    expect([state.emprise, souvenirBonus(state, 'lore')]).toEqual([5, 0]);
  });

  it('some Échos only show to a hero who remembers well (Mémoire 4 or 5)', () => {
    expect(echoObjects('ironheart-manufactures', 3)).toEqual([]);
    expect(echoObjects('ironheart-manufactures', 4).map((o) => o.name)).toEqual(['echo-registre']);
    expect(echoObjects('canopee-ramures', 4)).toEqual([]);
    expect(echoObjects('canopee-ramures', 5).map((o) => o.name)).toEqual(['echo-conseil']);
    expect(ECHOS.filter((e) => e.memoire).length).toBe(5);
    // Each skill has its Écho (thirteen skills ; the Voie du Bas and the drowned halt give Survie and Athlétisme again).
    expect(new Set(ECHOS.map((e) => e.don)).size).toBe(13);
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
