import { SKILL_RANK_MAX, type SkillId } from './attributes';
import { effectSum, characterStats, type Character, type SkillRanks } from './character';
import { skillPointsPerLevel } from './derived';

/** Cumulative XP needed to reach a level (premier jet d'équilibrage, à valider). */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export function hasPendingLevelUp(character: Character): boolean {
  return levelForXp(character.xp) > character.level;
}

export interface LevelUpState {
  /** Working copy of the skill ranks, including points already spent this level-up. */
  skillRanks: SkillRanks;
  pointsLeft: number;
  /** The highest rank at the new level (feuille de route, chantier 2) : niveau + 2, never above SKILL_RANK_MAX. */
  maxRank: number;
}

/** A rank never goes past the level plus this (3 at level 1, as at creation; 7 at level 5). */
export const RANK_OVER_LEVEL = 2;

/** The highest rank a skill may reach at this level. */
export function maxRankAt(level: number): number {
  return Math.min(SKILL_RANK_MAX, level + RANK_OVER_LEVEL);
}

export function startLevelUp(character: Character): LevelUpState {
  const points = Math.max(1, skillPointsPerLevel(character.attributes) + effectSum(character, 'skillPointsBonus'));
  return { skillRanks: { ...character.skills }, pointsLeft: points, maxRank: maxRankAt(character.level + 1) };
}

export function canRaiseLevelSkill(state: LevelUpState, id: SkillId): boolean {
  return state.pointsLeft > 0 && state.skillRanks[id] < state.maxRank;
}

export function raiseLevelSkill(state: LevelUpState, id: SkillId): LevelUpState {
  if (!canRaiseLevelSkill(state, id)) return state;
  return { ...state, skillRanks: { ...state.skillRanks, [id]: state.skillRanks[id] + 1 }, pointsLeft: state.pointsLeft - 1 };
}

/** Lowering only gives back points spent this level-up: never below the character's rank at its start. */
export function canLowerLevelSkill(character: Character, state: LevelUpState, id: SkillId): boolean {
  return state.skillRanks[id] > character.skills[id];
}

export function lowerLevelSkill(character: Character, state: LevelUpState, id: SkillId): LevelUpState {
  if (!canLowerLevelSkill(character, state, id)) return state;
  return { ...state, skillRanks: { ...state.skillRanks, [id]: state.skillRanks[id] - 1 }, pointsLeft: state.pointsLeft + 1 };
}

/** Applies one level: +1 niveau, the new skill ranks, a full heal (docs/gdd/progression.md). */
export function applyLevelUp(character: Character, state: LevelUpState): void {
  character.level += 1;
  character.skills = { ...state.skillRanks };
  character.hp = characterStats(character).maxHp;
}
