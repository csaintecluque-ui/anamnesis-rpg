import { describe, expect, it } from 'vitest';
import {
  ammoLeft,
  rollLoot,
  settleAmmo,
  canAttack,
  coverBetween,
  distance,
  enemyAttack,
  findEnemy,
  findWeapon,
  heldWeapons,
  heroAttacks,
  hitChance,
  isAdjacent,
  isDefeat,
  isVictory,
  makeEnemyCombatant,
  makeHeroCombatant,
  moveAlong,
  numberDuplicateNames,
  resolveAttack,
  rollDice,
  rollDie,
  rollInitiative,
  endTurn,
  startTurn,
  type Combatant,
  type Rng,
} from './combat';
import { changeAttribute, changeSkill, createDraft, finalizeCharacter, toggleOriginBonus, type Character, type CharacterDraft } from './character';
import { addItem, equip, ownedCount } from './inventory';
import { testCharacter } from './questTestKit';

function hero(feat: 'tough' | 'marksman' | 'weapon-master' = 'tough') {
  let d: CharacterDraft = { ...createDraft(), name: 'Aube', feat };
  d = changeAttribute(changeAttribute(changeAttribute(d, 'body', 1), 'body', 1), 'agility', 1);
  d = toggleOriginBonus(toggleOriginBonus(d, 'body'), 'agility');
  for (const id of ['melee', 'melee', 'melee', 'ranged', 'ranged', 'ranged'] as const) d = changeSkill(d, id, 1);
  return finalizeCharacter(d);
}

/** The hero with a sword in the right hand and a bow in the left. */
function armed(c: Character): Character {
  addItem(c, 'epee-longue');
  addItem(c, 'arc');
  equip(c, 'epee-longue', 'mainDroite');
  equip(c, 'arc', 'mainGauche');
  return c;
}

/** rng() value that makes rollDie(sides, rng) land on `face`. */
function at(face: number, sides: number): number {
  return (face - 1 + 0.5) / sides;
}

function sequence(...values: number[]): Rng {
  let i = 0;
  return () => values[i++ % values.length];
}

describe('dice', () => {
  it('rolls within [1, sides]', () => {
    for (let i = 0; i < 100; i++) {
      const roll = rollDie(6, () => i / 100);
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(6);
    }
  });

  it('sums several dice', () => {
    expect(rollDice({ count: 3, sides: 6 }, sequence(at(1, 6), at(6, 6), at(3, 6)))).toBe(1 + 6 + 3);
  });
});

describe('grid helpers', () => {
  it('measures Chebyshev distance and adjacency', () => {
    expect(distance({ col: 0, row: 0 }, { col: 2, row: 1 })).toBe(2);
    expect(isAdjacent({ col: 0, row: 0 }, { col: 1, row: 1 })).toBe(true);
    expect(isAdjacent({ col: 0, row: 0 }, { col: 2, row: 0 })).toBe(false);
  });
});

describe('initiative', () => {
  it('sorts by roll, highest first, keeping order on ties', () => {
    const combatants = ['a', 'b', 'c'].map((id) => makeEnemyCombatant(findEnemy('rodeur-epine')!, id, { col: 0, row: 0 }));
    const order = rollInitiative(combatants, { a: 0, b: 0, c: 0 }, sequence(at(10, 20), at(15, 20), at(10, 20)));
    expect(order.map((c) => c.id)).toEqual(['b', 'a', 'c']);
    expect(order.map((c) => c.initiative)).toEqual([15, 10, 10]);
  });
});

describe('movement', () => {
  it('spends 1 PA per tile and caps the path to the PA available', () => {
    const c = makeEnemyCombatant(findEnemy('rodeur-epine')!, 'r', { col: 0, row: 0 });
    c.actionPoints = 2;
    const path = [{ col: 1, row: 0 }, { col: 2, row: 0 }, { col: 3, row: 0 }, { col: 4, row: 0 }];
    const taken = moveAlong(c, path);
    expect(taken).toEqual(path.slice(0, 2));
    expect(c.tile).toEqual({ col: 2, row: 0 });
    expect(c.actionPoints).toBe(0);
  });
});

describe('canAttack', () => {
  const golem = findEnemy('golem-ferraille')!;
  it('requires range, PA and no disarm, and ignores defeated combatants', () => {
    const attacker = makeEnemyCombatant(golem, 'g', { col: 0, row: 0 });
    const far = makeEnemyCombatant(golem, 'far', { col: 5, row: 5 });
    const near = makeEnemyCombatant(golem, 'near', { col: 1, row: 0 });
    const attack = enemyAttack(golem);

    expect(canAttack(attacker, attack, far)).toBe(false);
    expect(canAttack(attacker, attack, near)).toBe(true);

    attacker.actionPoints = 2;
    expect(canAttack(attacker, attack, near)).toBe(false);

    attacker.actionPoints = 5;
    attacker.status.disarmed = true;
    expect(canAttack(attacker, attack, near)).toBe(false);

    attacker.status.disarmed = false;
    near.defeated = true;
    expect(canAttack(attacker, attack, near)).toBe(false);
  });
});

describe('resolveAttack', () => {
  const rodeur = findEnemy('rodeur-epine')!;

  function duel(): { attacker: Combatant; target: Combatant } {
    const attacker = makeEnemyCombatant(rodeur, 'attacker', { col: 0, row: 0 });
    const target = makeEnemyCombatant(rodeur, 'target', { col: 1, row: 0 });
    return { attacker, target };
  }

  it('hits when the roll clears defense, deals damage and spends 3 PA', () => {
    const { attacker, target } = duel();
    const attack = enemyAttack(rodeur);
    const result = resolveAttack(attacker, attack, target, 'corps', 0, sequence(at(15, 20), at(4, 6)));
    expect(result).toMatchObject({ hit: true, critical: false, damage: 4 });
    expect(target.hp).toBe(rodeur.hp - 4);
    expect(attacker.actionPoints).toBe(rodeur.actionPoints - 3);
  });

  it('misses when the roll falls short of defense, dealing no damage', () => {
    const { attacker, target } = duel();
    const attack = enemyAttack(rodeur);
    const result = resolveAttack(attacker, attack, target, 'corps', 0, sequence(at(2, 20)));
    expect(result).toMatchObject({ hit: false, damage: 0 });
    expect(target.hp).toBe(rodeur.hp);
  });

  it('a natural 1 always misses, even against weak defense', () => {
    const { attacker, target } = duel();
    target.defense = -100;
    const result = resolveAttack(attacker, enemyAttack(rodeur), target, 'corps', 0, sequence(at(1, 20)));
    expect(result.hit).toBe(false);
    expect(result.fumble).toBe(true);
  });

  it('a natural 20 always hits and doubles the damage dice', () => {
    const { attacker, target } = duel();
    target.defense = 1000;
    const result = resolveAttack(attacker, enemyAttack(rodeur), target, 'corps', 0, sequence(at(20, 20), at(6, 6), at(6, 6)));
    expect(result).toMatchObject({ hit: true, critical: true, damage: 6 + 6 });
  });

  it('defeats the target and reports it once HP reaches 0', () => {
    const { attacker, target } = duel();
    target.hp = 3;
    const result = resolveAttack(attacker, enemyAttack(rodeur), target, 'corps', 0, sequence(at(20, 20), at(6, 6), at(6, 6)));
    expect(result.defeated).toBe(true);
    expect(target.hp).toBe(0);
    expect(target.defeated).toBe(true);
  });

  it('aiming at a zone applies its penalty and, on a non-lethal hit, its status effect', () => {
    const { attacker, target } = duel();
    target.hp = 100;
    const result = resolveAttack(attacker, enemyAttack(rodeur), target, 'tete', 0, sequence(at(18, 20), at(6, 6)));
    expect(result.zoneEffect).toBe('stunned');
    expect(target.status.stunned).toBe(true);
  });

  it('never applies a zone effect to a target it defeats', () => {
    const { attacker, target } = duel();
    target.hp = 1;
    const result = resolveAttack(attacker, enemyAttack(rodeur), target, 'jambes', 0, sequence(at(18, 20), at(6, 6)));
    expect(result.zoneEffect).toBeNull();
    expect(target.status.slowed).toBe(false);
  });

  it('cover raises the effective defense', () => {
    const { attacker, target } = duel();
    const roll = sequence(at(15, 20), at(4, 6));
    const withoutCover = resolveAttack(attacker, enemyAttack(rodeur), target, 'corps', 0, roll);
    expect(withoutCover.hit).toBe(true);

    const { attacker: a2, target: t2 } = duel();
    const result = resolveAttack(a2, enemyAttack(rodeur), t2, 'corps', 6, sequence(at(15, 20)));
    expect(result.hit).toBe(false);
  });
});

describe('startTurn', () => {
  const golem = findEnemy('golem-ferraille')!;

  it('restores full PA; a disarmed combatant cannot attack this turn, and endTurn clears the effects', () => {
    const c = makeEnemyCombatant(golem, 'g', { col: 0, row: 0 });
    const h = makeHeroCombatant(hero(), { col: 1, row: 0 });
    c.actionPoints = 0;
    c.status.disarmed = true;
    startTurn(c);
    expect(c.actionPoints).toBe(golem.actionPoints);
    expect(canAttack(c, c.attacks[0], h)).toBe(false);
    endTurn(c);
    expect(c.status).toEqual({ stunned: false, disarmed: false, slowed: false, burning: 0, bleeding: 0 });
    startTurn(c);
    expect(canAttack(c, c.attacks[0], h)).toBe(true);
  });

  it('a stunned combatant gets no PA this turn', () => {
    const c = makeEnemyCombatant(golem, 'g', { col: 0, row: 0 });
    c.status.stunned = true;
    startTurn(c);
    expect(c.actionPoints).toBe(0);
  });

  it('a slowed combatant gets half PA, rounded up', () => {
    const c = makeEnemyCombatant(golem, 'g', { col: 0, row: 0 });
    c.status.slowed = true;
    startTurn(c);
    expect(c.actionPoints).toBe(Math.ceil(golem.actionPoints / 2));
  });
});

describe('victory and defeat', () => {
  it('is victory once every enemy is defeated, regardless of heroes', () => {
    const h = makeHeroCombatant(hero(), { col: 0, row: 0 });
    const e = makeEnemyCombatant(findEnemy('rodeur-epine')!, 'r', { col: 1, row: 0 });
    expect(isVictory([h, e])).toBe(false);
    e.defeated = true;
    expect(isVictory([h, e])).toBe(true);
    expect(isDefeat([h, e])).toBe(false);
  });

  it('is defeat once every hero is defeated', () => {
    const h = makeHeroCombatant(hero(), { col: 0, row: 0 });
    const e = makeEnemyCombatant(findEnemy('rodeur-epine')!, 'r', { col: 1, row: 0 });
    h.defeated = true;
    expect(isDefeat([h, e])).toBe(true);
  });
});

describe('heroAttacks', () => {
  it('a new hero fights with the starting dagger only', () => {
    expect(heroAttacks(hero()).map((a) => a.weaponId)).toEqual(['dague']);
  });

  it('fights bare-handed (1d3) with empty hands, whatever is carried', () => {
    const c = hero();
    c.equipment.mainDroite = null;
    addItem(c, 'arc');
    const attacks = heroAttacks(c);
    expect(attacks.map((a) => a.label)).toEqual(['Mains nues']);
    expect(attacks[0].damage).toEqual({ count: 1, sides: 3 });
    expect(attacks[0].range).toBe(1);
  });

  it('gives one attack per weapon in hand, right hand first', () => {
    expect(heldWeapons(armed(hero())).map((w) => w.id)).toEqual(['epee-longue', 'arc']);
  });

  it('builds Épée longue and Arc from Corps/Agilité and the matching skill ranks', () => {
    const c = armed(hero('tough'));
    const attacks = heroAttacks(c);
    const sword = attacks.find((a) => a.weaponId === 'epee-longue')!;
    const bow = attacks.find((a) => a.weaponId === 'arc')!;
    expect(sword.toHitBonus).toBe(c.attributes.body - 3 + c.skills.melee);
    expect(bow.toHitBonus).toBe(c.attributes.agility - 3 + c.skills.ranged);
    expect(sword.range).toBe(1);
  });

  it('Tireur d’Élite doubles the bow range and adds ranged damage', () => {
    const base = heroAttacks(armed(hero('tough'))).find((a) => a.weaponId === 'arc')!;
    const marksman = heroAttacks(armed(hero('marksman'))).find((a) => a.weaponId === 'arc')!;
    expect(marksman.range).toBe(base.range * 2);
    expect(marksman.damageBonus).toBe(base.damageBonus + 2);
  });

  it('Maître d’Armes adds to melee hit and damage only', () => {
    const base = heroAttacks(armed(hero('tough')));
    const master = heroAttacks(armed(hero('weapon-master')));
    const sword = master.find((a) => a.weaponId === 'epee-longue')!;
    const baseSword = base.find((a) => a.weaponId === 'epee-longue')!;
    const bow = master.find((a) => a.weaponId === 'arc')!;
    const baseBow = base.find((a) => a.weaponId === 'arc')!;
    expect(sword.toHitBonus).toBe(baseSword.toHitBonus + 1);
    expect(sword.damageBonus).toBe(baseSword.damageBonus + 1);
    expect(bow.toHitBonus).toBe(baseBow.toHitBonus);
    expect(bow.damageBonus).toBe(baseBow.damageBonus);
  });
});

describe('coverBetween', () => {
  // A crate (+2) at (3, 2), a tree (+4) at (5, 5).
  const cover = ({ col, row }: { col: number; row: number }) => (col === 3 && row === 2 ? 2 : col === 5 && row === 5 ? 4 : 0);

  it('shelters a target behind the obstacle next to it, on the attacker’s side', () => {
    expect(coverBetween({ col: 0, row: 2 }, { col: 4, row: 2 }, cover)).toBe(2);
    expect(coverBetween({ col: 0, row: 0 }, { col: 6, row: 6 }, cover)).toBe(4);
  });

  it('gives nothing from the other side, nor in melee', () => {
    expect(coverBetween({ col: 8, row: 2 }, { col: 4, row: 2 }, cover)).toBe(0);
    expect(coverBetween({ col: 3, row: 2 }, { col: 4, row: 2 }, cover)).toBe(0);
  });
});

describe('numberDuplicateNames', () => {
  it('numbers enemies of the same kind and leaves unique names alone', () => {
    const team = [
      makeHeroCombatant(hero(), { col: 0, row: 0 }),
      makeEnemyCombatant(findEnemy('golem-ferraille')!, 'g', { col: 1, row: 0 }),
      makeEnemyCombatant(findEnemy('rodeur-epine')!, 'r1', { col: 2, row: 0 }),
      makeEnemyCombatant(findEnemy('rodeur-epine')!, 'r2', { col: 3, row: 0 }),
    ];
    numberDuplicateNames(team);
    expect(team.map((c) => c.name)).toEqual(['Aube', 'Golem de Ferraille', 'Rôdeur-Épine 1', 'Rôdeur-Épine 2']);
  });
});

describe('data', () => {
  it('ships the two weapons and both enemies named in docs/gdd/combat.md and tranche-verticale.md', () => {
    expect(findWeapon('epee-longue')).toBeDefined();
    expect(findWeapon('arc')).toBeDefined();
    expect(findWeapon('mains-nues')).toBeDefined();
    expect(findEnemy('golem-ferraille')).toBeDefined();
    expect(findEnemy('rodeur-epine')).toBeDefined();
  });
});

describe('hitChance', () => {
  it('matches resolveAttack over all twenty rolls, cover and zone included', () => {
    const golem = findEnemy('golem-ferraille')!;
    const attacker = makeEnemyCombatant(findEnemy('rodeur-epine')!, 'a', { col: 0, row: 0 });
    const attack = attacker.attacks[0];
    for (const [zone, cover] of [['corps', 0], ['tete', 2], ['jambes', 4]] as const) {
      let hits = 0;
      for (let roll = 1; roll <= 20; roll++) {
        const a = { ...attacker, actionPoints: 10, status: { ...attacker.status } };
        const target = makeEnemyCombatant(golem, 't', { col: 1, row: 0 });
        if (resolveAttack(a, attack, target, zone, cover, () => (roll - 1) / 20).hit) hits++;
      }
      const target = makeEnemyCombatant(golem, 't', { col: 1, row: 0 });
      expect(hitChance(attack, target, zone, cover), `${zone} +${cover}`).toBe(hits / 20);
    }
  });
});


describe('Munitions (docs/gdd/combat.md) : a bow shoots arrows, a crossbow bolts', () => {
  const archer = (arrows: number) => {
    const c = testCharacter();
    addItem(c, 'arc', 1);
    equip(c, 'arc', 'mainDroite');
    if (arrows) addItem(c, 'fleches', arrows);
    return c;
  };
  const target = () => makeEnemyCombatant(findEnemy('loup-rouille')!, 'loup', { col: 3, row: 0 });

  it('counts the arrows at the start of the fight, and spends one per shot, hit or miss', () => {
    const c = archer(2);
    const hero = makeHeroCombatant(c, { col: 0, row: 0 });
    const bow = hero.attacks.find((a) => a.weaponId === 'arc')!;
    expect([bow.munition, ammoLeft(hero, bow)]).toEqual(['fleches', 2]);
    const wolf = target();
    resolveAttack(hero, bow, wolf, 'corps', 0, () => 0.01);
    hero.actionPoints = 10;
    resolveAttack(hero, bow, wolf, 'corps', 0, () => 0.99);
    expect([ammoLeft(hero, bow), hero.fired]).toEqual([0, { fleches: 2 }]);
    hero.actionPoints = 10;
    expect(canAttack(hero, bow, wolf)).toBe(false);
  });

  it('cannot shoot without arrows; the dagger needs none', () => {
    const c = archer(0);
    addItem(c, 'dague', 1);
    equip(c, 'dague', 'mainGauche');
    const hero = makeHeroCombatant(c, { col: 0, row: 0 });
    const [bow, dagger] = ['arc', 'dague'].map((id) => hero.attacks.find((a) => a.weaponId === id)!);
    expect([ammoLeft(hero, bow), ammoLeft(hero, dagger)]).toEqual([0, Infinity]);
    expect(canAttack(hero, bow, target())).toBe(false);
  });

  it('picks half the arrows up after a fight won, none after fleeing', () => {
    const won = archer(10);
    const hero = makeHeroCombatant(won, { col: 0, row: 0 });
    hero.fired = { fleches: 5 };
    expect(settleAmmo(won, hero, true)).toEqual(['Tu ramasses 2 de tes flèches.']);
    expect(ownedCount(won, 'fleches')).toBe(7);
    const fled = archer(10);
    const runner = makeHeroCombatant(fled, { col: 0, row: 0 });
    runner.fired = { fleches: 5 };
    expect(settleAmmo(fled, runner, false)).toEqual([]);
    expect(ownedCount(fled, 'fleches')).toBe(5);
  });

  it('a crossbowman of the Marches leaves three bolts at a time', () => {
    const loot = rollLoot([findEnemy('arbaletrier-cendres')!], () => 0);
    expect(loot.items.filter((i) => i === 'carreaux')).toHaveLength(3);
  });
});
