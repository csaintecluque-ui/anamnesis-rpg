import { attributeModifier, type Attributes } from './attributes';

export function maxHitPoints(attrs: Attributes, level = 1): number {
  const perLevel = 4 + attributeModifier(attrs.vigor);
  return 20 + 4 * attrs.vigor + (level - 1) * Math.max(1, perLevel);
}

export function resistancePoints(attrs: Attributes): number {
  return attrs.vigor + attributeModifier(attrs.presence);
}

export function defense(attrs: Attributes, armorBonus = 0): number {
  return 10 + attributeModifier(attrs.agility) + armorBonus;
}

/**
 * 7 PA, one more from Agilité 5, one less under 3 (feuille de route, chantier 3 : the PA depend less on Agilité ; before,
 * 6 + its modifier, and Agilité 6 gave 9 PA, three blows a turn). 7 PA: two blows and a step, or an aimed blow and
 * another.
 */
export function actionPoints(attrs: Attributes): number {
  return 7 + Math.floor(attributeModifier(attrs.agility) / 2);
}

export function carryCapacityKg(attrs: Attributes): number {
  return 30 + 10 * attrs.body;
}

export function talesRetained(attrs: Attributes): number {
  return attrs.memory + 1;
}

export function skillPointsPerLevel(attrs: Attributes): number {
  return Math.max(1, 3 + attributeModifier(attrs.intellect));
}
