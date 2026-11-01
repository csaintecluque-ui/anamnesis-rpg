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

export function actionPoints(attrs: Attributes): number {
  return 6 + attributeModifier(attrs.agility);
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
