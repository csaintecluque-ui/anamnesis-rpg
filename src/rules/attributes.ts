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
  | 'subterfuge'
  /** La magie (docs/gdd/magie.md) : not offered at creation, learned on the road. */
  | 'resonance';

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
  /** False when the skill cannot get ranks at creation (Résonance: learned on the road). */
  creation?: boolean;
}

export const ATTRIBUTES = attributeData as AttributeDef[];
export const SKILLS = skillData as SkillDef[];
/** The skills offered at creation (all but those learned on the road). */
export const CREATION_SKILLS = SKILLS.filter((s) => s.creation !== false);

export type Attributes = Record<AttributeId, number>;

export const ATTRIBUTE_MIN = 1;
export const ATTRIBUTE_MAX = 5;
export const ATTRIBUTE_AVERAGE = 3;
export const SKILL_RANK_MAX = 10;

/** JDR: modifier = attribute − 3. */
export function attributeModifier(score: number): number {
  return score - ATTRIBUTE_AVERAGE;
}
