import { describe, expect, it } from 'vitest';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame } from '../state/gameState';
import { bestiaryEntries, recordDefeated, recordMet } from './bestiary';
import {
  ENCOUNTERS,
  ENEMIES,
  canHeal,
  findEnemy,
  lingeringDamage,
  makeEnemyCombatant,
  nextPhase,
  resolveAttack,
  resolveHeal,
  rollLoot,
  startTurn,
  endTurn,
} from './combat';
import { COMPANIONS, PARTY_MAX, companionsAfterFight, findCompanion, joinParty, makeCompanionCombatant } from './companions';
import { applyEffects } from './dialogue';
import { equip, findItem } from './inventory';
import { combatPower, powerAttack } from './magic';
import { testCharacter } from './questTestKit';
import { RENCONTRES } from './world';

/** Le combat pour adultes et à plusieurs (docs/gdd/jalon-3.md, étape 1). */
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};
const at = { col: 0, row: 0 };
const next = { col: 1, row: 0 };

describe('lingering effects', () => {
  it('burn for two turns and bleed for three, at the start of each turn, and outlast endTurn', () => {
    const wolf = makeEnemyCombatant(findEnemy('loup-rouille')!, 'w', at);
    wolf.status.burning = 2;
    wolf.status.bleeding = 3;
    endTurn(wolf);
    expect([wolf.status.burning, wolf.status.bleeding]).toEqual([2, 3]);
    const hp = wolf.hp;
    expect(lingeringDamage(wolf, seq(0.99))).toEqual({ brulure: 4, saignement: 2 });
    expect(wolf.hp).toBe(hp - 6);
    lingeringDamage(wolf, seq(0));
    lingeringDamage(wolf, seq(0));
    expect([wolf.status.burning, wolf.status.bleeding]).toEqual([0, 0]);
  });

  it('can finish a fighter off', () => {
    const wasps = makeEnemyCombatant(findEnemy('guepe-rouille')!, 'g', at);
    wasps.hp = 1;
    wasps.status.burning = 1;
    lingeringDamage(wasps, seq(0));
    expect(wasps.defeated).toBe(true);
  });

  it('are left by the blows that carry them: the Flammes forgées burn', () => {
    const c = testCharacter();
    c.inventory.push({ itemId: 'cristal-forge', count: 1 });
    equip(c, 'cristal-forge', 'cristal');
    const flames = powerAttack(c, combatPower(c)!);
    const hero = makeEnemyCombatant(findEnemy('rodeur-epine')!, 'h', at);
    hero.side = 'heroes';
    hero.attacks = [flames];
    hero.actionPoints = 6;
    const target = makeEnemyCombatant(findEnemy('golem-ferraille')!, 'g', next);
    // d20 = 19 hits; 2d6 = 1 + 1; the burn always takes.
    const result = resolveAttack(hero, flames, target, 'corps', 0, seq(0.9, 0, 0, 0.5));
    expect(result.hit).toBe(true);
    expect(result.inflicted).toBe('brulure');
    expect(target.status.burning).toBe(2);
  });
});

describe('enemies that shoot, heal and change pace', () => {
  it('shoot from afar', () => {
    const archer = makeEnemyCombatant(findEnemy('arbaletrier-cendres')!, 'a', at);
    expect(archer.attacks[0].range).toBe(5);
  });

  it('heal a hurt ally within reach, for 3 PA', () => {
    const healer = makeEnemyCombatant(findEnemy('rebouteuse-cendres')!, 'r', at);
    const ally = makeEnemyCombatant(findEnemy('pilleur-cendres')!, 'p', next);
    expect(canHeal(healer, ally)).toBe(false);
    ally.hp = 4;
    expect(canHeal(healer, ally)).toBe(true);
    expect(resolveHeal(healer, ally, seq(0.99))).toBe(8);
    expect([ally.hp, healer.actionPoints]).toEqual([12, 3]);
  });

  it('let the Golem enter its second phase once, at half its PV', () => {
    const golem = makeEnemyCombatant(findEnemy('golem-ferraille')!, 'g', at);
    golem.hp = 16;
    expect(nextPhase(golem)).toBeNull();
    golem.hp = 15;
    expect(nextPhase(golem)?.texte).toMatch(/s’emballe/);
    expect([golem.attacks[0].toHitBonus, golem.maxActionPoints]).toEqual([4, 7]);
    expect(nextPhase(golem)).toBeNull();
    startTurn(golem);
    expect(golem.actionPoints).toBe(7);
  });
});

describe('loot and the bestiary', () => {
  it('leave items and Fers by their chances', () => {
    const golem = findEnemy('golem-ferraille')!;
    const thief = findEnemy('pilleur-cendres')!;
    expect(rollLoot([golem, thief], seq(0, 0.5))).toEqual({ items: ['coeur-ferraille'], fers: 2 });
    expect(rollLoot([findEnemy('rodeur-epine')!], seq(0.99))).toEqual({ items: [], fers: 0 });
  });

  it('every enemy has a bestiary page and a source; every loot item exists', () => {
    for (const e of ENEMIES) {
      expect(e.description, e.id).toBeTruthy();
      expect(e.source, e.id).toBeTruthy();
      for (const l of e.butin ?? []) if (l.item) expect(findItem(l.item), l.item).toBeDefined();
    }
  });

  it('count what is met and what is beaten', () => {
    const state = createNewGame(testCharacter());
    recordMet(state, ['loup-rouille', 'loup-rouille', 'golem-ferraille']);
    recordDefeated(state, ['loup-rouille', 'loup-rouille']);
    expect(bestiaryEntries(state).map((e) => [e.enemy.id, e.defeated])).toEqual([
      ['golem-ferraille', 0],
      ['loup-rouille', 2],
    ]);
  });

  it('new enemies are met on the roads and at the switch', () => {
    const met = new Set(RENCONTRES.flatMap((r) => r.enemies ?? []).concat(ENCOUNTERS.flatMap((e) => e.enemies.map((x) => x.id))));
    for (const id of ['griffe-sylve', 'guepe-rouille', 'gecko-soudeur', 'arbaletrier-cendres', 'rebouteuse-cendres']) expect(met.has(id), id).toBe(true);
  });
});

describe('companions', () => {
  it('join two at most, with full PV', () => {
    const state = createNewGame(testCharacter());
    expect(COMPANIONS.map((c) => c.id)).toEqual(['liane', 'boulon']);
    expect(joinParty(state, 'liane')).toBe(true);
    expect(joinParty(state, 'liane')).toBe(false);
    expect(joinParty(state, 'boulon')).toBe(true);
    expect(state.groupe).toEqual([
      { id: 'liane', hp: 24 },
      { id: 'boulon', hp: 40 },
    ]);
    expect(state.groupe.length).toBe(PARTY_MAX);
  });

  it('fight on the heroes’ side; one who fell gets up with 1 PV; a night’s sleep heals them', () => {
    const state = createNewGame(testCharacter());
    joinParty(state, 'liane');
    const liane = makeCompanionCombatant(findCompanion('liane')!, 24, at);
    expect([liane.side, liane.heal?.range, liane.attacks[0].range]).toEqual(['heroes', 3, 4]);
    liane.hp = 0;
    liane.defeated = true;
    expect(companionsAfterFight(state, [liane])).toEqual(['Liane Sève-Claire']);
    expect(state.groupe[0].hp).toBe(1);
    applyEffects(state, [{ dormir: 'matin' }]);
    expect(state.groupe[0].hp).toBe(24);
  });
});

describe('saves', () => {
  it('give older saves an empty bestiary and nobody along', () => {
    const state = createNewGame(testCharacter());
    joinParty(state, 'boulon');
    const old = JSON.parse(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    old.version = 11;
    delete old.state.bestiaire;
    delete old.state.groupe;
    const parsed = parseSave(JSON.stringify(old));
    expect(parsed.ok && [parsed.value.state.bestiaire, parsed.value.state.groupe]).toEqual([{}, []]);
  });
});
