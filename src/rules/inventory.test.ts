import { describe, expect, it } from 'vitest';
import {
  changeAttribute,
  changeSkill,
  createDraft,
  finalizeCharacter,
  STARTING_FERS,
  toggleOriginBonus,
  type Character,
  type CharacterDraft,
} from './character';
import {
  addItem,
  armorBonus,
  buy,
  canEquip,
  carriedWeightKg,
  carryCapacityLeftKg,
  equip,
  findItem,
  ownedCount,
  removeItem,
  sell,
  unequip,
  useConsumable,
} from './inventory';

function hero(): Character {
  let d: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough' };
  d = changeAttribute(changeAttribute(changeAttribute(d, 'body', 1), 'body', 1), 'agility', 1);
  d = toggleOriginBonus(toggleOriginBonus(d, 'body'), 'agility');
  for (const id of ['melee', 'melee', 'melee', 'ranged', 'ranged', 'ranged'] as const) d = changeSkill(d, id, 1);
  return finalizeCharacter(d);
}

describe('items', () => {
  it('ships the goods named in Tobias’s stall (DIALOGUES.md, validé)', () => {
    expect(findItem('lampe-cristal')).toBeDefined();
    expect(findItem('corde')).toBeDefined();
  });
});

describe('starting funds', () => {
  it('a new character starts with less than the laissez-passer (docs/gdd/inventaire.md, à dessein)', () => {
    expect(hero().fers).toBe(STARTING_FERS);
    expect(STARTING_FERS).toBeLessThan(50);
  });

  it('a new character holds the starting dagger in the right hand (docs/gdd/inventaire.md)', () => {
    const c = hero();
    expect(c.inventory).toEqual([{ itemId: 'dague', count: 1 }]);
    expect(c.equipment).toEqual({ mainGauche: null, mainDroite: 'dague', armure: null });
  });
});

describe('addItem / removeItem / ownedCount', () => {
  it('stacks the same item and reports the count', () => {
    const c = hero();
    addItem(c, 'corde', 2);
    addItem(c, 'corde', 1);
    expect(ownedCount(c, 'corde')).toBe(3);
  });

  it('removing down to zero drops the slot and unequips it', () => {
    const c = hero();
    addItem(c, 'armure-cuir', 1);
    equip(c, 'armure-cuir', 'armure');
    removeItem(c, 'armure-cuir', 1);
    expect(ownedCount(c, 'armure-cuir')).toBe(0);
    expect(c.inventory).toEqual([{ itemId: 'dague', count: 1 }]);
    expect(c.equipment.armure).toBeNull();
  });
});

describe('weight', () => {
  it('sums owned items, equipped or not, against Charge (docs/gdd/attributs.md)', () => {
    const c = hero();
    expect(carriedWeightKg(c)).toBe(1); // the starting dagger
    addItem(c, 'corde', 2); // 2 kg each
    addItem(c, 'bandage', 1); // 0.5 kg
    expect(carriedWeightKg(c)).toBe(5.5);
    expect(carryCapacityLeftKg(c)).toBeGreaterThan(0);
  });
});

describe('buy / sell', () => {
  it('buying spends Fers and adds the item', () => {
    const c = hero();
    const error = buy(c, 'corde', 1);
    expect(error).toBeNull();
    expect(c.fers).toBe(STARTING_FERS - 5);
    expect(ownedCount(c, 'corde')).toBe(1);
  });

  it('refuses to buy without enough Fers', () => {
    const c = hero();
    expect(buy(c, 'armure-ferraille', 1)).toBe('trop-cher');
    expect(c.fers).toBe(STARTING_FERS);
  });

  it('refuses to buy past the Charge limit', () => {
    const c = hero();
    c.fers = 10_000;
    expect(buy(c, 'armure-ferraille', 50)).toBe('trop-lourd');
  });

  it('selling returns half the price, rounded down, and never more than owned', () => {
    const c = hero();
    addItem(c, 'corde', 1); // price 5
    expect(sell(c, 'corde', 1)).toBeNull();
    expect(c.fers).toBe(STARTING_FERS + 2);
    expect(sell(c, 'corde', 1)).toBe('pas-en-stock');
  });
});

describe('equip / unequip / armorBonus', () => {
  it('only lets armour go in the armure slot, and weapons in a hand', () => {
    expect(canEquip(findItem('armure-cuir')!, 'armure')).toBe(true);
    expect(canEquip(findItem('armure-cuir')!, 'mainGauche')).toBe(false);
    expect(canEquip(findItem('epee-longue')!, 'mainGauche')).toBe(true);
    expect(canEquip(findItem('epee-longue')!, 'armure')).toBe(false);
  });

  it('refuses to equip an item not owned', () => {
    const c = hero();
    expect(equip(c, 'armure-cuir', 'armure')).toBe(false);
  });

  it('equipping moves the item from any previous slot', () => {
    const c = hero();
    addItem(c, 'epee-longue', 1);
    expect(equip(c, 'epee-longue', 'mainGauche')).toBe(true);
    expect(equip(c, 'epee-longue', 'mainDroite')).toBe(true);
    expect(c.equipment).toEqual({ mainGauche: null, mainDroite: 'epee-longue', armure: null });
  });

  it('sums the armorBonus of every equipped item', () => {
    const c = hero();
    addItem(c, 'armure-cuir', 1);
    equip(c, 'armure-cuir', 'armure');
    expect(armorBonus(c)).toBe(1);
    unequip(c, 'armure');
    expect(armorBonus(c)).toBe(0);
  });
});

describe('useConsumable', () => {
  it('restores HP up to the cap and consumes one item', () => {
    const c = hero();
    addItem(c, 'bandage', 2);
    c.hp = c.hp - 20;
    const restored = useConsumable(c, 'bandage', c.hp + 20);
    expect(restored).toBe(8);
    expect(ownedCount(c, 'bandage')).toBe(1);
  });

  it('never overheals, and refuses when full or unowned', () => {
    const c = hero();
    addItem(c, 'bandage', 1);
    c.hp = c.hp; // already full
    const maxHp = c.hp;
    expect(useConsumable(c, 'bandage', maxHp)).toBeNull();
    expect(useConsumable(c, 'corde', maxHp)).toBeNull();
  });
});
