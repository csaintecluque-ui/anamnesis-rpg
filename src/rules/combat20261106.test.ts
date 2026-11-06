import { describe, expect, it } from 'vitest';
import type { Tile } from '../engine/iso';
import { ATTACK_AP_COST, findEnemy, findWeapon, makeEnemyCombatant, makeHeroCombatant, roadMenace } from './combat';
import { nextEnemyAction, type AiContext } from './combatAi';
import { PLAIN_ARENA, arenaContext } from './combatSim';
import { characterStats } from './character';
import { findCompanion, makeCompanionCombatant } from './companions';
import { RENCONTRES } from './world';
import { testCharacter } from './questTestKit';

/** L'équilibre du combat après le test du 2026-11-06 (décision de Cyril ; docs/gdd/combat.md). */

const at = (col: number, row: number): Tile => ({ col, row });
const average = (id: string): number => {
  const w = findWeapon(id)!;
  return (w.damage.count * (w.damage.sides + 1)) / 2 + (w.bonus ?? 0);
};
/** Average damage in a turn of 7 PA, for a hero who adds `bonus` to each blow (Corps, ranks, feats). */
const perTurn = (id: string, bonus: number): number => Math.floor(7 / (findWeapon(id)!.apCost ?? ATTACK_AP_COST)) * (average(id) + bonus);

describe('a weapon one buys is worth its price', () => {
  it('a long sword strikes about as hard in a turn as a dagger, a tempered sword and the hammer harder, at every bonus a hero has', () => {
    for (let bonus = 0; bonus <= 6; bonus++) {
      expect(perTurn('epee-longue', bonus), `bonus ${bonus}`).toBeGreaterThanOrEqual(perTurn('dague', bonus) - 1);
      expect(perTurn('epee-trempee', bonus), `bonus ${bonus}`).toBeGreaterThan(perTurn('dague', bonus));
      expect(perTurn('marteau-forge', bonus), `bonus ${bonus}`).toBeGreaterThan(perTurn('epee-trempee', bonus));
    }
  });

  it('the bow and the crossbow too, by their own bonus', () => {
    expect(findWeapon('arc')!.bonus).toBe(1);
    expect(findWeapon('arbalete-ferros')!.bonus).toBe(2);
  });
});

describe('the strength of the road follows the hero as well as the story', () => {
  it('the chapter, or the level less one when it is higher', () => {
    expect(roadMenace({}, 1)).toBe(1);
    expect(roadMenace({}, 2)).toBe(1);
    expect(roadMenace({}, 5)).toBe(4);
    expect(roadMenace({ 'dernier-train': 'done', audience: 'done', 'cle-rouille-bleue': 'done' }, 3)).toBe(4);
  });
});

describe('a hero of words has a way out of every fight of the road', () => {
  it('each hostile encounter drawn at random: parley with people (Diplomatie), lure the beasts (Subterfuge)', () => {
    for (const r of RENCONTRES.filter((r) => r.hostile && !r.story)) {
      expect(r.parler, r.id).toBeDefined();
      expect(['diplomacy', 'subterfuge'], r.id).toContain(r.parler!.skill);
      expect(r.parler!.difficulty, r.id).toBe(r.avoid!.difficulty);
    }
    expect(RENCONTRES.find((r) => r.id === 'pilleurs-route')!.parler!.skill).toBe('diplomacy');
  });
});

describe('Liane tends sooner', () => {
  it('a hero at 70 % of his PV, beside her, is healed (before: under 60 % only)', () => {
    const c = testCharacter();
    c.hp = Math.floor(characterStats(c).maxHp * 0.7);
    const hero = makeHeroCombatant(c, at(1, 4));
    const liane = makeCompanionCombatant(findCompanion('liane')!, 24, at(1, 5));
    const foe = makeEnemyCombatant(findEnemy('loup-rouille')!, 'loup', at(9, 4));
    const ctx: AiContext = arenaContext(PLAIN_ARENA, [hero, liane, foe]);
    liane.actionPoints = liane.maxActionPoints;
    expect(nextEnemyAction(liane, ctx)).toMatchObject({ kind: 'heal', target: hero });
  });
});
