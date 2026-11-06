import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import { characterStats } from './character';
import { NIGHT_FLAG, REVEIL_FERS, beginNightAttack, nightAttack, nightXp, restRefusal, restUntilMorning, reveilLabel, reveilPrice, reveilTown, wakeUpAtInn } from './repos';
import { expireFlags } from './dialogue';
import { testCharacter } from './questTestKit';

/** Le repos gratuit et le réveil à l'auberge (étude du 2026-11-03, G2 et I1 ; src/rules/repos.ts). */

function hurt(location = 'gardebois') {
  const state = createNewGame(testCharacter());
  state.location = location;
  state.character!.hp = 3;
  state.character!.fers = 4;
  return state;
}

describe('a free night', () => {
  it('raises the PV to half by the morning, for the hero and the companions, without an inn', () => {
    const state = hurt();
    state.groupe = [{ id: 'liane', hp: 2 }];
    const max = characterStats(state.character!).maxHp;
    expect(restRefusal(state)).toBeNull();
    const notice = restUntilMorning(state);
    expect(state.character!.hp).toBe(Math.ceil(max / 2));
    expect(state.groupe[0].hp).toBe(12);
    expect(state.time.phase).toBe(0);
    expect(state.time.day).toBe(2);
    expect(notice).toContain(`+${Math.ceil(max / 2) - 3} PV`);
  });

  it('never more than half: above it, the night gives nothing (test du 2026-11-06)', () => {
    const state = hurt();
    const max = characterStats(state.character!).maxHp;
    state.character!.hp = max - 1;
    const notice = restUntilMorning(state);
    expect(state.character!.hp).toBe(max - 1);
    expect(notice).not.toMatch(/PV\./);
    expect(notice).toMatch(/moitié/);
  });

  it('one a day: after a night outside, not again before the evening', () => {
    const state = hurt();
    restUntilMorning(state);
    expect(restRefusal(state)).toMatch(/avant ce soir/);
    state.time.phase = 1;
    expect(restRefusal(state)).toMatch(/avant ce soir/);
    state.time.phase = 2;
    expect(restRefusal(state)).toBeNull();
  });

  it('not under the ground, nor on the road', () => {
    const voie = hurt('voie-endormie');
    voie.voie = { site: 'halte-fougeres', seed: 1, depth: 1 };
    expect(restRefusal(voie)).toMatch(/sous terre/);
    expect(restRefusal(hurt('rencontre-route'))).toMatch(/sur la route/);
  });
});

describe('a night outside the towns (test du 2026-11-06)', () => {
  it('never in a town', () => {
    for (let day = 1; day <= 30; day++) {
      const state = hurt('gardebois');
      state.time.day = day;
      expect(nightAttack(state)).toBeNull();
    }
  });

  it('about one night in three at the Gare Engloutie, the same draw when one reloads', () => {
    let attacks = 0;
    for (let day = 1; day <= 300; day++) {
      const state = hurt('gare-engloutie');
      state.time.day = day;
      const first = nightAttack(state);
      expect(nightAttack(state)).toEqual(first);
      if (first) {
        attacks++;
        expect([['rodeur-epine', 'rodeur-epine'], ['loup-rouille', 'loup-rouille']]).toContainEqual(first);
      }
    }
    expect(attacks).toBeGreaterThan(70);
    expect(attacks).toBeLessThan(130);
  });

  it('the attack falls in the night; the hero who lies down again that night sleeps in peace', () => {
    const state = hurt('gare-engloutie');
    let day = 1;
    for (state.time.day = day; !nightAttack(state); state.time.day = ++day);
    const notice = beginNightAttack(state);
    expect(notice).toMatch(/on vient/);
    expect(state.time).toEqual({ day, phase: 3 });
    expect(state.flags[NIGHT_FLAG]).toBe(true);
    expect(nightAttack(state)).toBeNull();
    restUntilMorning(state);
    expireFlags(state);
    expect(state.flags[NIGHT_FLAG]).toBeUndefined();
  });

  it('the beasts of the night give half their worth, like those of the road', () => {
    expect(nightXp(['rodeur-epine', 'rodeur-epine'])).toBe(15);
  });
});

describe('waking up at the inn after a fall', () => {
  it('in the town of the fall: at the Gare Engloutie, Gardebois’s inn', () => {
    expect(reveilTown(hurt('gare-engloutie'))).toBe('gardebois');
    expect(reveilTown(hurt('ironheart-cendriere'))).toBe('ironheart');
  });

  it('on the road or in a sleeping line, the last town walked in (Gardebois for an old save)', () => {
    const road = hurt('rencontre-route');
    expect(reveilTown(road)).toBe('gardebois');
    road.derniereVille = 'canopee';
    expect(reveilTown(road)).toBe('canopee');
  });

  it('costs the oldest ordinary Récit, never one of the main story', () => {
    const state = hurt('canopee-ramures');
    state.character!.recits = ['savant-corvan', 'berceuse-de-maelis', 'chant-anselme'];
    expect(reveilPrice(state)).toEqual({ town: 'Canopéa', inn: 'canopee-auberge', recit: 'berceuse-de-maelis' });
    expect(reveilLabel(reveilPrice(state))).toBe('Te réveiller à Canopéa : tu oublies « La berceuse de Maëlis »');
    const notice = wakeUpAtInn(state);
    expect(state.character!.recits).toEqual(['savant-corvan', 'chant-anselme']);
    expect(notice).toContain('La berceuse de Maëlis');
  });

  it('without an ordinary Récit, 10 Fers; without them, nothing', () => {
    const rich = hurt();
    rich.character!.fers = 25;
    expect(reveilPrice(rich).fers).toBe(REVEIL_FERS);
    wakeUpAtInn(rich);
    expect(rich.character!.fers).toBe(25 - REVEIL_FERS);
    const poor = hurt();
    expect(reveilPrice(poor)).toEqual({ town: 'Gardebois', inn: 'auberge-racine' });
    expect(reveilLabel(reveilPrice(poor))).toBe('Te réveiller à Gardebois');
  });

  it('at the inn, the morning after, healed, the road and the line left behind', () => {
    const state = hurt('voie-endormie');
    state.voie = { site: 'halte-fougeres', seed: 1, depth: 2 };
    state.groupe = [{ id: 'liane', hp: 1 }];
    wakeUpAtInn(state);
    expect([state.location, state.entrance, state.voie, state.encounter]).toEqual(['auberge-racine', 'entree', null, null]);
    expect(state.character!.hp).toBe(characterStats(state.character!).maxHp);
    expect(state.groupe[0].hp).toBe(24);
    expect(state.time.phase).toBe(0);
  });
});
