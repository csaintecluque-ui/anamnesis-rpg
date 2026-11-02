import { describe, expect, it } from 'vitest';
import { ATTRIBUTES, CREATION_SKILLS, SKILLS, attributeModifier, type Attributes } from './attributes';
import { DIFFICULTY, meetsThreshold, resolveCheck, rollD20, successChance } from './checks';
import {
  actionPoints,
  carryCapacityKg,
  defense,
  maxHitPoints,
  resistancePoints,
  skillPointsPerLevel,
  talesRetained,
} from './derived';

const average: Attributes = {
  body: 3,
  agility: 3,
  vigor: 3,
  intellect: 3,
  perception: 3,
  presence: 3,
  memory: 3,
};

describe('data', () => {
  it('defines 7 attributes and 13 skills (12 at creation, plus the Résonance), each tied to a known attribute', () => {
    expect(ATTRIBUTES).toHaveLength(7);
    expect(SKILLS).toHaveLength(13);
    expect(CREATION_SKILLS.map((s) => s.id)).not.toContain('resonance');
    expect(CREATION_SKILLS).toHaveLength(12);
    const ids = new Set(ATTRIBUTES.map((a) => a.id));
    for (const skill of SKILLS) expect(ids.has(skill.attribute)).toBe(true);
  });
});

describe('attributeModifier', () => {
  it('follows the JDR table (score − 3)', () => {
    expect([1, 2, 3, 4, 5].map(attributeModifier)).toEqual([-2, -1, 0, 1, 2]);
  });
});

describe('resolveCheck', () => {
  it('succeeds when the total meets the difficulty', () => {
    expect(resolveCheck({ roll: 8, modifier: 1, rank: 1, difficulty: 10 })).toEqual({
      total: 10,
      success: true,
      critical: false,
    });
    expect(resolveCheck({ roll: 7, modifier: 1, rank: 1, difficulty: 10 }).success).toBe(false);
  });

  it('treats natural 20 and natural 1 as criticals regardless of the total', () => {
    expect(resolveCheck({ roll: 20, modifier: -2, rank: 0, difficulty: 30 })).toMatchObject({
      success: true,
      critical: true,
    });
    expect(resolveCheck({ roll: 1, modifier: 2, rank: 10, difficulty: 5 })).toMatchObject({
      success: false,
      critical: true,
    });
  });
});

describe('successChance', () => {
  it('matches the GDD example: Présence 4 + Diplomatie 3 against a medium difficulty', () => {
    expect(successChance(1, 3, DIFFICULTY.medium)).toBe(0.75);
  });

  it('never goes below 5 % nor above 95 %', () => {
    expect(successChance(-2, 0, DIFFICULTY.legendary)).toBe(0.05);
    expect(successChance(2, 10, DIFFICULTY.easy)).toBe(0.95);
  });
});

describe('rollD20', () => {
  it('maps the random source onto 1–20', () => {
    expect(rollD20(() => 0)).toBe(1);
    expect(rollD20(() => 0.999)).toBe(20);
  });
});

describe('meetsThreshold', () => {
  it('compares without dice', () => {
    expect(meetsThreshold(4, 4)).toBe(true);
    expect(meetsThreshold(3, 4)).toBe(false);
  });
});

describe('derived values (docs/gdd/attributs.md, character at 3 everywhere)', () => {
  it('matches the reference column', () => {
    expect(maxHitPoints(average)).toBe(32);
    expect(resistancePoints(average)).toBe(3);
    expect(defense(average)).toBe(10);
    expect(actionPoints(average)).toBe(6);
    expect(carryCapacityKg(average)).toBe(60);
    expect(talesRetained(average)).toBe(4);
    expect(skillPointsPerLevel(average)).toBe(3);
  });

  it('adds hit points per level from Vigueur', () => {
    expect(maxHitPoints({ ...average, vigor: 5 }, 2)).toBe(20 + 20 + 6);
  });
});
