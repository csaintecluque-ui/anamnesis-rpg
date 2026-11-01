import itemData from '../data/items.json';
import { SLOTS, type Character, type Equipment, type Slot } from './character';
import { carryCapacityKg } from './derived';

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  weightKg: number;
  price: number;
  /** Item can be equipped in a slot of this kind; absent for loose goods. */
  slot?: 'main' | 'armure';
  /** Bonus to Défense while equipped (docs/gdd/combat.md). */
  armorBonus?: number;
  /** PV restored, then the item is consumed. */
  healHp?: number;
}

export const ITEMS = itemData as ItemDef[];
/** Items sell for half their price, rounded down (standard troc convention). */
export const SELL_RATIO = 0.5;

export function findItem(id: string): ItemDef | undefined {
  return ITEMS.find((i) => i.id === id);
}

export function emptyEquipment(): Equipment {
  return { mainGauche: null, mainDroite: null, armure: null };
}

export function ownedCount(character: Character, itemId: string): number {
  return character.inventory.find((s) => s.itemId === itemId)?.count ?? 0;
}

export function carriedWeightKg(character: Character): number {
  return character.inventory.reduce((sum, s) => sum + (findItem(s.itemId)?.weightKg ?? 0) * s.count, 0);
}

export function carryCapacityLeftKg(character: Character): number {
  return carryCapacityKg(character.attributes) - carriedWeightKg(character);
}

/** Sum of armorBonus from every equipped item that has one. */
export function armorBonus(character: Character): number {
  const equipped = [character.equipment.mainGauche, character.equipment.mainDroite, character.equipment.armure];
  return equipped.reduce((sum, id) => sum + (id ? (findItem(id)?.armorBonus ?? 0) : 0), 0);
}

export function addItem(character: Character, itemId: string, count = 1): void {
  const slot = character.inventory.find((s) => s.itemId === itemId);
  if (slot) slot.count += count;
  else character.inventory.push({ itemId, count });
}

/** Removes up to `count`; unequips the item from any slot it no longer fills. */
export function removeItem(character: Character, itemId: string, count = 1): void {
  const slot = character.inventory.find((s) => s.itemId === itemId);
  if (!slot) return;
  slot.count -= count;
  if (slot.count > 0) return;
  character.inventory = character.inventory.filter((s) => s.itemId !== itemId);
  for (const key of SLOTS) {
    if (character.equipment[key] === itemId) character.equipment[key] = null;
  }
}

export type TradeError = 'inconnu' | 'trop-cher' | 'trop-lourd' | 'pas-en-stock';

export function buy(character: Character, itemId: string, count = 1): TradeError | null {
  const item = findItem(itemId);
  if (!item) return 'inconnu';
  const cost = item.price * count;
  if (character.fers < cost) return 'trop-cher';
  if (carriedWeightKg(character) + item.weightKg * count > carryCapacityKg(character.attributes)) return 'trop-lourd';
  character.fers -= cost;
  addItem(character, itemId, count);
  return null;
}

export function sell(character: Character, itemId: string, count = 1): TradeError | null {
  const item = findItem(itemId);
  if (!item) return 'inconnu';
  if (ownedCount(character, itemId) < count) return 'pas-en-stock';
  removeItem(character, itemId, count);
  character.fers += Math.floor(item.price * SELL_RATIO) * count;
  return null;
}

export function canEquip(item: ItemDef, slot: Slot): boolean {
  if (slot === 'armure') return item.slot === 'armure';
  return item.slot === 'main';
}

/** Equips an owned item, freeing its previous slot (if any) and whatever already sat in the target slot. */
export function equip(character: Character, itemId: string, slot: Slot): boolean {
  const item = findItem(itemId);
  if (!item || !canEquip(item, slot) || ownedCount(character, itemId) === 0) return false;
  for (const key of SLOTS) {
    if (character.equipment[key] === itemId) character.equipment[key] = null;
  }
  character.equipment[slot] = itemId;
  return true;
}

export function unequip(character: Character, slot: Slot): void {
  character.equipment[slot] = null;
}

/** Restores HP from a healing item (e.g. a bandage), consuming one; returns the HP actually restored, or null if unusable. */
export function useConsumable(character: Character, itemId: string, maxHp: number): number | null {
  const item = findItem(itemId);
  if (!item?.healHp || ownedCount(character, itemId) === 0 || character.hp >= maxHp) return null;
  const restored = Math.min(item.healHp, maxHp - character.hp);
  character.hp += restored;
  removeItem(character, itemId, 1);
  return restored;
}
