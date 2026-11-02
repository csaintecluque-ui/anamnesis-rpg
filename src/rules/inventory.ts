import itemData from '../data/items.json';
import npcData from '../data/npcs.json';
import { SLOTS, type Character, type Equipment, type Slot } from './character';
import { carryCapacityKg } from './derived';

export interface ItemDef {
  id: string;
  name: string;
  description: string;
  weightKg: number;
  price: number;
  /** Item can be equipped in a slot of this kind; absent for loose goods. A crystal is worn at the neck. */
  slot?: 'main' | 'armure' | 'cristal';
  /** A crystal's power (src/data/powers.json, docs/gdd/magie.md), given while it is worn, with the Lueur. */
  pouvoir?: string;
  /** Bonus to Défense while equipped (docs/gdd/combat.md). */
  armorBonus?: number;
  /** PV restored, then the item is consumed. */
  healHp?: number;
  /** Quest item: carried for someone, it cannot be sold. */
  quest?: boolean;
}

export const ITEMS = itemData as ItemDef[];
/** Items sell for half their price, rounded down (standard troc convention). */
export const SELL_RATIO = 0.5;

export function findItem(id: string): ItemDef | undefined {
  return ITEMS.find((i) => i.id === id);
}

/** What this trader sells (`sells` in npcs.json, docs/gdd/inventaire.md); empty for anyone else. */
export function merchantCatalogue(npcId: string): ItemDef[] {
  const sells = (npcData as { id: string; sells?: string[] }[]).find((n) => n.id === npcId)?.sells ?? [];
  return ITEMS.filter((i) => sells.includes(i.id));
}

/**
 * Share taken off this trader's prices, once earned (`remise` in npcs.json: the flag that grants it and the rate;
 * Tobias, after « La caisse égarée »).
 */
export function merchantDiscount(flags: Record<string, boolean>, npcId?: string): number {
  const remise = (npcData as { id: string; remise?: { flag: string; taux: number } }[]).find((n) => n.id === npcId)?.remise;
  return remise && flags[remise.flag] ? remise.taux : 0;
}

/** What one costs at a stall, after any discount. */
export function buyPrice(item: ItemDef, discount = 0): number {
  return Math.round(item.price * (1 - discount));
}

/** Rows of the inventory (what is carried) or of a stall (what the trader sells, plus what is carried, to sell it). */
export function tradeItems(character: Character, npcId?: string): ItemDef[] {
  const forSale = new Set(npcId ? merchantCatalogue(npcId).map((i) => i.id) : []);
  return ITEMS.filter((i) => forSale.has(i.id) || ownedCount(character, i.id) > 0);
}

export function emptyEquipment(): Equipment {
  return { mainGauche: null, mainDroite: null, armure: null, cristal: null };
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

export type TradeError = 'inconnu' | 'trop-cher' | 'trop-lourd' | 'pas-en-stock' | 'objet-de-quete';

export function buy(character: Character, itemId: string, count = 1, discount = 0): TradeError | null {
  const item = findItem(itemId);
  if (!item) return 'inconnu';
  const cost = buyPrice(item, discount) * count;
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
  if (item.quest) return 'objet-de-quete';
  removeItem(character, itemId, count);
  character.fers += Math.floor(item.price * SELL_RATIO) * count;
  return null;
}

export function canEquip(item: ItemDef, slot: Slot): boolean {
  if (slot === 'armure') return item.slot === 'armure';
  if (slot === 'cristal') return item.slot === 'cristal';
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
