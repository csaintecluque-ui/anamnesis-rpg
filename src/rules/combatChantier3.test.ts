import { describe, expect, it } from 'vitest';
import type { Tile } from '../engine/iso';
import {
  AIM_AP_EXTRA,
  CAPACITES,
  ENEMIES,
  attackCost,
  canAttack,
  effectChance,
  endTurn,
  findEnemy,
  heroAttacks,
  makeEnemyCombatant,
  makeHeroCombatant,
  moveAlong,
  resolveAttack,
  startTurn,
  storyChapter,
  strengthen,
  type Combatant,
} from './combat';
import { nextEnemyAction, type AiContext } from './combatAi';
import { PLAIN_ARENA, TACTICS, arenaContext, winRate } from './combatSim';
import { attributeModifier } from './attributes';
import { characterStats } from './character';
import { addItem } from './inventory';
import { testCharacter } from './questTestKit';
import { findCompanion, makeCompanionCombatant } from './companions';

/** Le combat refait (feuille de route, chantier 3 ; docs/gdd/combat.md, « Chantier 3 »). */

const at = (col: number, row: number): Tile => ({ col, row });
const enemy = (id: string, tile: Tile, n = 0) => makeEnemyCombatant(findEnemy(id)!, `${id}-${n}`, tile);
/** A draw that gives this face of a die. */
const face = (value: number, sides: number) => (value - 1) / sides + 0.0001;
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

function armed(weapon: string, skills: Record<string, number> = { melee: 3 }) {
  const c = testCharacter({}, skills);
  addItem(c, weapon, 1);
  c.equipment.mainDroite = weapon;
  c.hp = characterStats(c).maxHp;
  return c;
}

describe('the cost of a blow', () => {
  it('depends on the weapon (2 PA with a dagger), and aiming costs 1 PA more, but not with a dagger', () => {
    const [dagger] = heroAttacks(armed('dague'));
    const [sword] = heroAttacks(armed('epee-longue'));
    expect([attackCost(dagger), attackCost(dagger, 'bras')]).toEqual([2, 2]);
    expect([attackCost(sword), attackCost(sword, 'tete')]).toEqual([3, 3 + AIM_AP_EXTRA]);
    const hero = makeHeroCombatant(armed('epee-longue'), at(0, 0));
    const wolf = enemy('loup-rouille', at(1, 0));
    hero.actionPoints = 3;
    expect([canAttack(hero, sword, wolf), canAttack(hero, sword, wolf, 'bras')]).toEqual([true, false]);
  });
});

describe('a zone’s effect', () => {
  it('takes only if the target fails its resistance roll: harder against a heavy hide, easier with a heavy blow', () => {
    const [sword] = heroAttacks(armed('epee-longue'));
    const golem = enemy('golem-ferraille', at(1, 0));
    const wasp = enemy('guepe-rouille', at(1, 0));
    expect(effectChance(sword, golem)).toBeLessThan(effectChance(sword, wasp));
    expect(effectChance(sword, wasp, 8)).toBeGreaterThan(effectChance(sword, wasp, 2));
  });

  it('is shaken off for a turn once suffered: no stun every turn', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(0, 0));
    const wolf = enemy('loup-rouille', at(1, 0));
    wolf.hp = 100;
    const [sword] = hero.attacks;
    // d20 18, damage, a failed resistance roll: stunned.
    expect(resolveAttack(hero, sword, wolf, 'tete', 0, seq(face(18, 20), face(4, 8), 0)).zoneEffect).toBe('stunned');
    startTurn(wolf);
    expect(wolf.actionPoints).toBe(0);
    endTurn(wolf);
    hero.actionPoints = 7;
    const again = resolveAttack(hero, sword, wolf, 'tete', 0, seq(face(18, 20), face(4, 8), 0));
    expect([again.hit, again.zoneEffect, again.resisted]).toEqual([true, null, true]);
  });
});

describe('the capacités', () => {
  it('two for every enemy, all known', () => {
    for (const e of ENEMIES) {
      expect(e.capacites, e.id).toHaveLength(2);
      for (const c of e.capacites) expect(CAPACITES[c], `${e.id} : ${c}`).toBeDefined();
      if (e.capacites.includes('saigner')) expect(e.onHit?.effet).toBe('saignement');
      if (e.capacites.includes('bruler')) expect(e.onHit?.effet).toBe('brulure');
      if (e.capacites.includes('ralentir')) expect(e.onHit?.effet).toBe('ralenti');
      if (e.capacites.includes('tir')) expect(e.range ?? 1).toBeGreaterThan(1);
      if (e.capacites.includes('soigner')) expect(e.soin).toBeDefined();
      if (e.capacites.includes('emballement')) expect(e.phases?.length).toBeGreaterThan(0);
    }
  });

  it('Meute: +2 to hit once an ally stands at the target’s side', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(1, 1));
    const wolf = enemy('loup-rouille', at(0, 1));
    const other = enemy('loup-rouille', at(5, 5), 1);
    const all = [hero, wolf, other];
    hero.defense = 14; // d20 10 + 2 (its attack) misses; + 2 (Meute) reaches it
    expect(resolveAttack(wolf, wolf.attacks[0], hero, 'corps', 0, seq(face(10, 20), 0, 0.99), all).hit).toBe(false);
    other.tile = at(2, 1);
    wolf.actionPoints = 8;
    expect(resolveAttack(wolf, wolf.attacks[0], hero, 'corps', 0, seq(face(10, 20), 0, 0.99), all).hit).toBe(true);
  });

  it('Épines hurt the one who strikes close up; Charge adds 1d4 after two steps', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(0, 0));
    const rodeur = enemy('rodeur-epine', at(1, 0));
    rodeur.hp = 100;
    const hp = hero.hp;
    const result = resolveAttack(hero, hero.attacks[0], rodeur, 'corps', 0, seq(face(19, 20), 0, 0.99, 0));
    expect([result.thorns, hero.hp]).toEqual([1, hp - 1]);
    const bear = enemy('ours-mousse', at(3, 0));
    startTurn(bear);
    moveAlong(bear, [at(2, 0), at(1, 0)]);
    const target = makeHeroCombatant(armed('epee-longue'), at(0, 0));
    target.hp = 100;
    // d20 19; 1d10 → 1; the charge's 1d4 → 4.
    expect(resolveAttack(bear, bear.attacks[0], target, 'corps', 0, seq(face(19, 20), face(1, 10), face(4, 4))).damage).toBe(5);
  });
});

describe('the enemy AI', () => {
  const ctx = (all: Combatant[]): AiContext => arenaContext(PLAIN_ARENA, all);

  it('finishes the wounded: of the heroes within reach, the weakest', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(4, 4));
    const ally = makeHeroCombatant(armed('dague'), at(6, 4));
    ally.id = 'ally';
    ally.hp = 3;
    const wolf = enemy('loup-rouille', at(5, 5));
    startTurn(wolf);
    const action = nextEnemyAction(wolf, ctx([hero, ally, wolf]));
    expect(action.kind === 'attack' && action.target.id).toBe('ally');
  });

  it('flees under a third of its PV (Fuite), to the edge, then out of the fight', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(5, 4));
    const bandit = enemy('pilleur-cendres', at(6, 4));
    bandit.hp = 4;
    startTurn(bandit);
    const action = nextEnemyAction(bandit, ctx([hero, bandit]));
    expect(action.kind).toBe('move');
    bandit.tile = at(10, 4);
    expect(nextEnemyAction(bandit, ctx([hero, bandit])).kind).toBe('flee');
  });

  it('a shooter walks to a cell in range sheltered from its target', () => {
    const hero = makeHeroCombatant(armed('epee-longue'), at(1, 4));
    const archer = enemy('arbaletrier-cendres', at(10, 4));
    startTurn(archer);
    const action = nextEnemyAction(archer, ctx([hero, archer]));
    expect(action.kind).toBe('move');
    if (action.kind !== 'move') return;
    const end = action.path[action.path.length - 1];
    expect(Math.max(Math.abs(end.col - 1), Math.abs(end.row - 4))).toBeLessThanOrEqual(5);
  });
});

describe('the strength of the road', () => {
  it('follows the story: the chapter is one more than the main quests done', () => {
    expect(storyChapter({})).toBe(1);
    expect(storyChapter({ 'dernier-train': 'done', audience: 'done' })).toBe(3);
    const wolf = (ch: number) => strengthen(enemy('loup-rouille', at(0, 0)), ch);
    expect([wolf(1).maxHp, wolf(2).maxHp, wolf(3).maxHp]).toEqual([12, 17, 22]);
    // To hit: +1 at most from the road, from chapter 3 (étude, E4 / F3 simulés ; d'abord +2 au chapitre 4).
    expect([wolf(1).attacks[0].toHitBonus, wolf(3).attacks[0].toHitBonus, wolf(4).attacks[0].toHitBonus, wolf(4).defense]).toEqual([2, 3, 3, 14]);
  });
});

describe('the tactics, simulated (feuille de route : « aucune tactique ne dépasse les autres de plus de 15 points »)', () => {
  const RUNS = 200;
  const fight = (weapon: string, level: number, melee: number, foes: string[]) => () => {
    const c = armed(weapon, { melee });
    c.level = level;
    addItem(c, 'armure-cuir', 1);
    c.equipment.armure = 'armure-cuir';
    c.hp = characterStats(c).maxHp;
    const enemies = foes.map((id, i) => enemy(id, at(9 + (i % 2), 2 + 2 * i), i));
    const initiative: Record<string, number> = { hero: attributeModifier(c.attributes.agility) };
    for (const e of enemies) initiative[e.id] = findEnemy(e.kind!)!.initiativeBonus;
    return { heroes: [makeHeroCombatant(c, at(1, 4))], enemies, initiative };
  };
  const cases: [string, () => ReturnType<ReturnType<typeof fight>>][] = [
    ['épée, niveau 2 : le Golem et deux Rôdeurs', fight('epee-longue', 2, 3, ['golem-ferraille', 'rodeur-epine', 'rodeur-epine'])],
    ['épée, niveau 3 : pilleur, arbalétrier, rebouteuse', fight('epee-longue', 3, 4, ['pilleur-cendres', 'arbaletrier-cendres', 'rebouteuse-cendres'])],
    ['dague, niveau 3 : pilleur, arbalétrier, rebouteuse', fight('dague', 3, 4, ['pilleur-cendres', 'arbaletrier-cendres', 'rebouteuse-cendres'])],
  ];
  for (const [name, setup] of cases) {
    it(name, () => {
      const rates = TACTICS.map((t) => Math.round(winRate(setup, t, RUNS) * 100));
      expect(Math.max(...rates) - Math.min(...rates), TACTICS.map((t, i) => `${t} ${rates[i]} %`).join(', ')).toBeLessThanOrEqual(15);
    }, 60000);
  }
});

/**
 * Un héros de parole doit pouvoir se défendre (étude du 2026-11-03, E3 ; docs/gdd/etude-2026-11-03.md) : contre ce
 * qui garde une caisse, seul ; contre une meute de la route, avec Liane. Pas contre un boss : là, il lui faut la fuite,
 * le détour ou la parole.
 */
describe('a hero of words, simulated (étude, E3)', () => {
  const RUNS = 200;
  const parleur = (level: number, companions: string[], foes: string[], chapter: number) => () => {
    const c = testCharacter({ body: 3, agility: 3, vigor: 3, intellect: 3, perception: 3, presence: 6, memory: 3 }, { melee: 3, diplomacy: 3 });
    c.feat = 'kael-memory';
    c.level = level;
    addItem(c, 'dague', 1);
    c.equipment.mainDroite = 'dague';
    c.hp = characterStats(c).maxHp;
    const allies = companions.map((id, i) => {
      const def = findCompanion(id)!;
      return makeCompanionCombatant(def, def.hp, at(1, 5 + i));
    });
    const enemies = foes.map((id, i) => strengthen(enemy(id, at(9 + (i % 2), 2 + 2 * i), i), chapter));
    const initiative: Record<string, number> = { hero: 0 };
    for (const a of allies) initiative[a.id] = findCompanion(a.kind!)!.initiativeBonus;
    for (const e of enemies) initiative[e.id] = findEnemy(e.kind!)!.initiativeBonus;
    return { heroes: [makeHeroCombatant(c, at(1, 4)), ...allies], enemies, initiative };
  };

  it('level 2, a dagger, alone: two Rôdeurs-Épines (the crate) at least 6 times out of 10', () => {
    expect(winRate(parleur(2, [], ['rodeur-epine', 'rodeur-epine'], 1), 'corps', RUNS)).toBeGreaterThanOrEqual(0.6);
  }, 60000);

  it('level 3, with Liane: two Loups de Rouille of chapter 2 at least 6 times out of 10', () => {
    expect(winRate(parleur(3, ['liane'], ['loup-rouille', 'loup-rouille'], 2), 'corps', RUNS)).toBeGreaterThanOrEqual(0.6);
  }, 60000);

  it('still no match, alone, for the Golem and its Rôdeurs: one wins there by other means', () => {
    expect(winRate(parleur(2, [], ['golem-ferraille', 'rodeur-epine', 'rodeur-epine'], 1), 'corps', RUNS)).toBeLessThan(0.3);
  }, 60000);
});
