import { describe, expect, it } from 'vitest';
import { SKILL_RANK_MAX } from './attributes';
import { characterStats, changeAttribute, changeSkill, createDraft, finalizeCharacter, toggleOriginBonus, type Character, type CharacterDraft } from './character';
import {
  applyLevelUp,
  canLowerLevelSkill,
  canRaiseLevelSkill,
  hasPendingLevelUp,
  levelForXp,
  lowerLevelSkill,
  maxRankAt,
  raiseLevelSkill,
  startLevelUp,
  xpForLevel,
} from './leveling';

function hero(intellect = 3): Character {
  let d: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough' };
  d = changeAttribute(changeAttribute(changeAttribute(d, 'intellect', 1), 'presence', 1), 'perception', 1);
  d = toggleOriginBonus(toggleOriginBonus(d, 'body'), 'vigor');
  for (const id of ['lore', 'lore', 'lore', 'diplomacy', 'diplomacy', 'stealth'] as const) d = changeSkill(d, id, 1);
  const c = finalizeCharacter(d);
  return { ...c, attributes: { ...c.attributes, intellect } };
}

describe('xpForLevel / levelForXp', () => {
  it('needs more XP for each level, starting at 1 with no XP', () => {
    expect(levelForXp(0)).toBe(1);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(299)).toBe(2);
    expect(levelForXp(300)).toBe(3);
  });
});

describe('hasPendingLevelUp', () => {
  it('is true once xp crosses the next level’s threshold', () => {
    const c = hero();
    c.xp = 99;
    expect(hasPendingLevelUp(c)).toBe(false);
    c.xp = 100;
    expect(hasPendingLevelUp(c)).toBe(true);
  });
});

describe('level-up skill allocation', () => {
  it('grants 3 + mod. Intellect points (docs/gdd/competences.md), minimum 1', () => {
    expect(startLevelUp(hero(5)).pointsLeft).toBe(5); // mod +2
    expect(startLevelUp(hero(1)).pointsLeft).toBe(1); // mod -2, floored at 1
  });

  it('raises a skill, capped at SKILL_RANK_MAX and the points available', () => {
    const c = hero();
    let state = startLevelUp(c);
    const before = state.pointsLeft;
    state = raiseLevelSkill(state, 'survival');
    expect(state.skillRanks.survival).toBe(c.skills.survival + 1);
    expect(state.pointsLeft).toBe(before - 1);
  });

  it('refuses to raise past SKILL_RANK_MAX', () => {
    const c = hero();
    let state = startLevelUp(c);
    state = { ...state, skillRanks: { ...state.skillRanks, survival: 10 }, pointsLeft: 5 };
    expect(canRaiseLevelSkill(state, 'survival')).toBe(false);
    expect(raiseLevelSkill(state, 'survival')).toBe(state);
  });

  it('caps a rank at the level + 2 (feuille de route, chantier 2): 4 at level 2, 7 at level 5', () => {
    const c = hero();
    expect([maxRankAt(1), maxRankAt(2), maxRankAt(5), maxRankAt(12)]).toEqual([3, 4, 7, SKILL_RANK_MAX]);
    let state = startLevelUp(c);
    expect(state.maxRank).toBe(4);
    state = { ...state, skillRanks: { ...state.skillRanks, survival: 4 }, pointsLeft: 5 };
    expect(canRaiseLevelSkill(state, 'survival')).toBe(false);
    c.level = 4;
    expect(startLevelUp(c).maxRank).toBe(7);
  });

  it('lowering only undoes points spent this level-up, never below the starting rank', () => {
    const c = hero();
    let state = startLevelUp(c);
    expect(canLowerLevelSkill(c, state, 'lore')).toBe(false); // untouched yet
    state = raiseLevelSkill(state, 'lore');
    expect(canLowerLevelSkill(c, state, 'lore')).toBe(true);
    state = lowerLevelSkill(c, state, 'lore');
    expect(state.skillRanks.lore).toBe(c.skills.lore);
    expect(canLowerLevelSkill(c, state, 'lore')).toBe(false);
  });
});

describe('applyLevelUp', () => {
  it('raises the level, keeps the new skill ranks and heals fully (docs/gdd/progression.md)', () => {
    const c = hero();
    c.hp = 1;
    let state = startLevelUp(c);
    for (const id of ['survival', 'lore', 'diplomacy', 'medicine'] as const) while (canRaiseLevelSkill(state, id)) state = raiseLevelSkill(state, id);
    expect(state.pointsLeft).toBe(0);
    applyLevelUp(c, state);
    expect(c.level).toBe(2);
    expect(c.skills.survival).toBeGreaterThan(0);
    expect(c.hp).toBe(characterStats(c).maxHp);
  });

  it('raises maxHp for the new level', () => {
    const c = hero();
    const before = characterStats(c).maxHp;
    applyLevelUp(c, startLevelUp(c));
    expect(characterStats(c).maxHp).toBeGreaterThan(before);
  });
});
