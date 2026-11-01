import attributeData from '../data/attributes.json';
import skillData from '../data/skills.json';

export type AttributeId = 'body' | 'agility' | 'vigor' | 'intellect' | 'perception' | 'presence' | 'memory';

export type SkillId =
  | 'athletics'
  | 'melee'
  | 'ranged'
  | 'stealth'
  | 'crafting'
  | 'survival'
  | 'lore'
  | 'investigation'
  | 'medicine'
  | 'command'
  | 'diplomacy'
  | 'subterfuge';

export interface AttributeDef {
  id: AttributeId;
  name: string;
  description: string;
}

export interface SkillDef {
  id: SkillId;
  name: string;
  attribute: AttributeId;
  description: string;
}

export const ATTRIBUTES = attributeData as AttributeDef[];
export const SKILLS = skillData as SkillDef[];

export type Attributes = Record<AttributeId, number>;

export const ATTRIBUTE_MIN = 1;
export const ATTRIBUTE_MAX = 5;
export const ATTRIBUTE_AVERAGE = 3;
export const SKILL_RANK_MAX = 10;

/** JDR: modifier = attribute − 3. */
export function attributeModifier(score: number): number {
  return score - ATTRIBUTE_AVERAGE;
}
