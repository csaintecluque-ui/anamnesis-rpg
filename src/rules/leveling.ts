import { SKILL_RANK_MAX, type SkillId } from './attributes';
import { characterStats, type Character, type SkillRanks } from './character';
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
}

export function startLevelUp(character: Character): LevelUpState {
  return { skillRanks: { ...character.skills }, pointsLeft: skillPointsPerLevel(character.attributes) };
}

export function canRaiseLevelSkill(state: LevelUpState, id: SkillId): boolean {
  return state.pointsLeft > 0 && state.skillRanks[id] < SKILL_RANK_MAX;
}

export function raiseLevelSkill(state: LevelUpState, id: SkillId): LevelUpState {
  if (!canRaiseLevelSkill(state, id)) return state;
  return { skillRanks: { ...state.skillRanks, [id]: state.skillRanks[id] + 1 }, pointsLeft: state.pointsLeft - 1 };
}

/** Lowering only gives back points spent this level-up: never below the character's rank at its start. */
export function canLowerLevelSkill(character: Character, state: LevelUpState, id: SkillId): boolean {
  return state.skillRanks[id] > character.skills[id];
}

export function lowerLevelSkill(character: Character, state: LevelUpState, id: SkillId): LevelUpState {
  if (!canLowerLevelSkill(character, state, id)) return state;
  return { skillRanks: { ...state.skillRanks, [id]: state.skillRanks[id] - 1 }, pointsLeft: state.pointsLeft + 1 };
}

/** Applies one level: +1 niveau, the new skill ranks, a full heal (docs/gdd/progression.md). */
export function applyLevelUp(character: Character, state: LevelUpState): void {
  character.level += 1;
  character.skills = { ...state.skillRanks };
  character.hp = characterStats(character).maxHp;
}
