import powerData from '../data/powers.json';
import { attributeModifier, SKILL_RANK_MAX } from './attributes';
import { RESONANCE_BASE, characterStats, type Character } from './character';
import { ATTACK_AP_COST, type AttackProfile, type Dice } from './combat';
import { findItem, ownedCount, removeItem, type ItemDef } from './inventory';
import { marqueResonancePenalty, payThePrice } from './marques';
import { CAST_WEAR } from './usure';
import type { Rng } from './checks';

/**
 * La magie (demande de Cyril, 2026-11-02 ; proposition validée ; docs/gdd/magie.md). Canon [NOTION] : la magie vient
 * des cristaux de Résonance, que « tout humain peut théoriquement » utiliser ; elle fatigue, fait saigner du nez,
 * et le sommeil la rend. Dans le jeu : le héros n'a pas de pouvoir propre, c'est le cristal porté au cou qui en donne ;
 * la compétence Résonance donne les Points de Résonance (PR) qu'on y dépense.
 */
export type PowerId = 'guerison' | 'flammes' | 'lueur';

export interface PowerDef {
  id: PowerId;
  name: string;
  /** Points de Résonance spent. */
  cost: number;
  /** In a fight: PA spent; absent for a power that is not used in fights. */
  apCost?: number;
  /** What the power does in a fight: heal the hero, strike an enemy, or nothing. */
  combat: 'soin' | 'attaque' | null;
  range?: number;
  damage?: Dice;
  description: string;
}

export const POWERS = powerData as PowerDef[];
/** Every crystal shines: the Lueur comes with any of them. */
export const LUEUR: PowerId = 'lueur';
/**
 * Each Point de Résonance missing is paid in PV: the nose bleeds (canon). The lasting price, the marks, is rolled after
 * (src/rules/marques.ts, docs/gdd/passe-sombre.md).
 */
export const OVERUSE_HP_PER_POINT = 3;

export function findPower(id: string): PowerDef | undefined {
  return POWERS.find((p) => p.id === id);
}

/** 3 + rank of Résonance, less the third mark (la peau de cristal). */
export function resonanceMax(c: Pick<Character, 'skills' | 'marques' | 'usureCristal'>): number {
  // A tired crystal gives less (src/rules/usure.ts ; chantier 6), never under one point.
  const tired = Math.floor((c.usureCristal ?? 0) / CAST_WEAR);
  const full = RESONANCE_BASE + c.skills.resonance - marqueResonancePenalty(c);
  return Math.max(0, tired > 0 ? Math.max(1, full - tired) : full);
}

/** The crystal worn at the neck, if any. */
export function wornCrystal(c: Pick<Character, 'equipment'>): ItemDef | undefined {
  return c.equipment.cristal ? findItem(c.equipment.cristal) : undefined;
}

/** The powers the worn crystal gives: its own, then the Lueur. */
export function knownPowers(c: Pick<Character, 'equipment'>): PowerDef[] {
  const crystal = wornCrystal(c);
  if (!crystal) return [];
  const ids = [crystal.pouvoir, LUEUR].filter((id, i, all): id is string => !!id && all.indexOf(id) === i);
  return ids.map(findPower).filter((p): p is PowerDef => !!p);
}

export function hasPower(c: Pick<Character, 'equipment'>, id: PowerId): boolean {
  return knownPowers(c).some((p) => p.id === id);
}

/** The worn crystal's power that is used in fights (Guérison naturelle or Flammes forgées), if any. */
export function combatPower(c: Pick<Character, 'equipment'>): PowerDef | undefined {
  return knownPowers(c).find((p) => p.combat !== null);
}

/** What a cast takes: the PR there are, and PV for each one missing. */
export function castCost(c: Pick<Character, 'resonance'>, power: PowerDef): { resonance: number; hp: number } {
  const resonance = Math.min(power.cost, c.resonance);
  return { resonance, hp: (power.cost - resonance) * OVERUSE_HP_PER_POINT };
}

/** The crystal is worn, and forcing it would not leave the hero without a single PV (`hp`: in a fight, the fighter's). */
export function canCast(c: Character, id: PowerId, hp = c.hp): boolean {
  const power = findPower(id);
  return !!power && hasPower(c, id) && hp > castCost(c, power).hp;
}

/**
 * Spends the PR, and returns the PV the overuse costs, for the caller to take (the character's or the fighter's).
 * A forced cast also rolls for its lasting price (`prix`: the notices, a mark or a split crystal).
 */
export function payCast(c: Character, power: PowerDef, rng: Rng = Math.random): { resonance: number; hp: number; prix: string[] } {
  const cost = castCost(c, power);
  c.resonance -= cost.resonance;
  c.usureCristal = (c.usureCristal ?? 0) + 1;
  const prix = payThePrice(c, power.cost - cost.resonance, rng);
  return { ...cost, prix };
}

/** PV given back by Guérison naturelle. */
export function healAmount(c: Pick<Character, 'skills'>): number {
  return 5 + 2 * c.skills.resonance;
}

/**
 * Casts a power outside a fight (the inventory, a dialogue): PR spent, PV lost if forced, and for Guérison naturelle
 * the hero's own PV back. Returns the notices, or null when the power cannot be cast.
 */
export function castOutsideCombat(c: Character, id: PowerId, healSelf = false, rng: Rng = Math.random): string[] | null {
  const power = findPower(id);
  if (!power || !canCast(c, id)) return null;
  const cost = payCast(c, power, rng);
  const notices = [cost.resonance > 0 ? `${power.name} : −${cost.resonance} PR` : `${power.name} : plus de Résonance`];
  if (cost.hp > 0) {
    c.hp -= cost.hp;
    notices.push(`Ton nez saigne : −${cost.hp} PV`);
  }
  notices.push(...cost.prix);
  if (healSelf && power.combat === 'soin') {
    const max = characterStats(c).maxHp;
    const before = c.hp;
    c.hp = Math.min(max, c.hp + healAmount(c));
    notices.push(`+${c.hp - before} PV`);
  }
  return notices;
}

/** Flammes forgées as an attack: d20 + Vigueur + rang de Résonance against the target's Défense. */
export function powerAttack(c: Character, power: PowerDef): AttackProfile {
  const mod = attributeModifier(c.attributes.vigor);
  return {
    weaponId: power.id,
    label: power.name,
    range: power.range ?? 1,
    toHitBonus: mod + c.skills.resonance,
    damage: power.damage ?? { count: 1, sides: 6 },
    damageBonus: Math.max(0, mod),
    apCost: power.apCost ?? ATTACK_AP_COST,
    // The fire clings: the target burns for two turns (docs/gdd/combat.md, « Effets »).
    onHit: power.id === 'flammes' ? { effet: 'brulure' } : undefined,
  };
}

/** A night's sleep gives every Point de Résonance back (canon : « 8 à 12 h de sommeil »). */
/** Drinks a sap that gives Points de Résonance back (Sève de Résonance): what it gave, or null if of no use now. */
export function useResonanceSap(c: Character, itemId: string): number | null {
  const item = findItem(itemId);
  const room = resonanceMax(c) - c.resonance;
  if (!item?.resonance || !wornCrystal(c) || ownedCount(c, itemId) === 0 || room <= 0) return null;
  const given = Math.min(item.resonance, room);
  c.resonance += given;
  removeItem(c, itemId, 1);
  return given;
}

export function restoreResonance(c: Character): void {
  c.resonance = Math.max(c.resonance, resonanceMax(c));
}

/** A rank taught (Vanel teaches the Résonance): one more rank, up to the maximum. */
export function teachSkillRank(c: Character, skill: keyof Character['skills']): boolean {
  if (c.skills[skill] >= SKILL_RANK_MAX) return false;
  c.skills[skill] += 1;
  if (skill === 'resonance') c.resonance += 1;
  return true;
}
