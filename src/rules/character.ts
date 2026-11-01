import featData from '../data/feats.json';
import { ATTRIBUTES, SKILLS, SKILL_RANK_MAX, type AttributeId, type Attributes, type SkillId } from './attributes';
import { actionPoints, carryCapacityKg, defense, maxHitPoints, resistancePoints, talesRetained } from './derived';

export type FeatId = 'tough' | 'marksman' | 'weapon-master' | 'kael-memory' | 'amira-spirit' | 'gorim-strength';

export interface FeatEffects {
  attributes?: Partial<Attributes>;
  skills?: Partial<Record<SkillId, number>>;
  hpVigorBonus?: number;
  hpPerLevelBonus?: number;
  carryBonusKg?: number;
  talesBonus?: number;
  revealsHiddenPlaces?: boolean;
  /** Applied once combat exists. */
  combat?: { rangeMultiplier?: number; rangedDamage?: number; meleeHit?: number; meleeDamage?: number };
}

export interface FeatDef {
  id: FeatId;
  name: string;
  description: string;
  effects: FeatEffects;
}

export const FEATS = featData as FeatDef[];

/** docs/gdd/attributs.md, competences.md, creation.md (validated 2026-11-01). */
export const CREATION = {
  base: 3,
  points: 3,
  minScore: 1,
  maxAllocated: 5,
  maxScore: 6,
  originBonusCount: 2,
  skillPoints: 6,
  skillMaxAtCreation: 3,
  nameMaxLength: 24,
} as const;

export type SkillRanks = Record<SkillId, number>;

export interface CharacterDraft {
  name: string;
  allocated: Attributes;
  originBonus: AttributeId[];
  skillRanks: SkillRanks;
  feat: FeatId | null;
}

/** Two hands and armour (docs/gdd/inventaire.md). */
export type Slot = 'mainGauche' | 'mainDroite' | 'armure';
export const SLOTS: Slot[] = ['mainGauche', 'mainDroite', 'armure'];

export interface InventorySlotState {
  itemId: string;
  count: number;
}

export type Equipment = Record<Slot, string | null>;

export interface Character {
  name: string;
  origin: 'human';
  feat: FeatId;
  level: number;
  xp: number;
  attributes: Attributes;
  skills: SkillRanks;
  hp: number;
  /** Récits recueillis (docs/gdd/memoire.md, piste B), plafonnés par talesRetained. */
  recits: string[];
  /** La monnaie de Ferros (docs/univers/personnages/pnj.md). */
  fers: number;
  inventory: InventorySlotState[];
  equipment: Equipment;
}

export interface CharacterStats {
  maxHp: number;
  resistance: number;
  defense: number;
  actionPoints: number;
  carryKg: number;
  tales: number;
}

const ATTRIBUTE_IDS = ATTRIBUTES.map((a) => a.id);
const SKILL_IDS = SKILLS.map((s) => s.id);

function fill<K extends string>(keys: K[], value: number): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, value])) as Record<K, number>;
}

export function findFeat(id: string): FeatDef | undefined {
  return FEATS.find((f) => f.id === id);
}

export function createDraft(): CharacterDraft {
  return {
    name: '',
    allocated: fill(ATTRIBUTE_IDS, CREATION.base),
    originBonus: [],
    skillRanks: fill(SKILL_IDS, 0),
    feat: null,
  };
}

// --- Attributes ---------------------------------------------------------

/** Lowering an attribute below 3 gives its points back. */
export function attributePointsLeft(d: CharacterDraft): number {
  const spent = ATTRIBUTE_IDS.reduce((sum, id) => sum + (d.allocated[id] - CREATION.base), 0);
  return CREATION.points - spent;
}

export function canRaiseAttribute(d: CharacterDraft, id: AttributeId): boolean {
  return d.allocated[id] < CREATION.maxAllocated && attributePointsLeft(d) > 0;
}

export function canLowerAttribute(d: CharacterDraft, id: AttributeId): boolean {
  return d.allocated[id] > CREATION.minScore;
}

export function changeAttribute(d: CharacterDraft, id: AttributeId, delta: 1 | -1): CharacterDraft {
  const allowed = delta > 0 ? canRaiseAttribute(d, id) : canLowerAttribute(d, id);
  return allowed ? { ...d, allocated: { ...d.allocated, [id]: d.allocated[id] + delta } } : d;
}

export function toggleOriginBonus(d: CharacterDraft, id: AttributeId): CharacterDraft {
  if (d.originBonus.includes(id)) return { ...d, originBonus: d.originBonus.filter((a) => a !== id) };
  if (d.originBonus.length >= CREATION.originBonusCount) return d;
  return { ...d, originBonus: [...d.originBonus, id] };
}

export function finalAttributes(d: CharacterDraft): Attributes {
  const feat = d.feat ? findFeat(d.feat) : undefined;
  const result = { ...d.allocated };
  for (const id of ATTRIBUTE_IDS) {
    const bonus = (d.originBonus.includes(id) ? 1 : 0) + (feat?.effects.attributes?.[id] ?? 0);
    result[id] = Math.min(CREATION.maxScore, result[id] + bonus);
  }
  return result;
}

// --- Skills -------------------------------------------------------------

export function skillPointsLeft(d: CharacterDraft): number {
  return CREATION.skillPoints - SKILL_IDS.reduce((sum, id) => sum + d.skillRanks[id], 0);
}

export function canRaiseSkill(d: CharacterDraft, id: SkillId): boolean {
  return d.skillRanks[id] < CREATION.skillMaxAtCreation && skillPointsLeft(d) > 0;
}

export function canLowerSkill(d: CharacterDraft, id: SkillId): boolean {
  return d.skillRanks[id] > 0;
}

export function changeSkill(d: CharacterDraft, id: SkillId, delta: 1 | -1): CharacterDraft {
  const allowed = delta > 0 ? canRaiseSkill(d, id) : canLowerSkill(d, id);
  return allowed ? { ...d, skillRanks: { ...d.skillRanks, [id]: d.skillRanks[id] + delta } } : d;
}

export function finalSkills(d: CharacterDraft): SkillRanks {
  const feat = d.feat ? findFeat(d.feat) : undefined;
  const result = { ...d.skillRanks };
  for (const id of SKILL_IDS) {
    result[id] = Math.min(SKILL_RANK_MAX, result[id] + (feat?.effects.skills?.[id] ?? 0));
  }
  return result;
}

// --- Validation & result -------------------------------------------------

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function nameError(name: string): string | null {
  const clean = normalizeName(name);
  if (clean.length === 0) return 'Donne un nom à ton personnage.';
  if (clean.length > CREATION.nameMaxLength) return `Le nom ne doit pas dépasser ${CREATION.nameMaxLength} caractères.`;
  return null;
}

/** Errors per step, in French, empty when the draft is complete. */
export function draftErrors(d: CharacterDraft): { name: string[]; attributes: string[]; skills: string[]; feat: string[] } {
  const attributes: string[] = [];
  const points = attributePointsLeft(d);
  if (points > 0) attributes.push(`Il reste ${points} point${points > 1 ? 's' : ''} d’attribut à répartir.`);
  const bonus = CREATION.originBonusCount - d.originBonus.length;
  if (bonus > 0) attributes.push(`Choisis encore ${bonus} attribut${bonus > 1 ? 's' : ''} pour le bonus humain (+1).`);

  const skills: string[] = [];
  const ranks = skillPointsLeft(d);
  if (ranks > 0) skills.push(`Il reste ${ranks} rang${ranks > 1 ? 's' : ''} de compétence à répartir.`);

  const name = nameError(d.name);
  return {
    name: name ? [name] : [],
    attributes,
    skills,
    feat: d.feat ? [] : ['Choisis un don.'],
  };
}

export function isDraftComplete(d: CharacterDraft): boolean {
  return Object.values(draftErrors(d)).every((errors) => errors.length === 0);
}

/** Starting funds (docs/univers/personnages/pnj.md) : less than Tobias's laissez-passer, on purpose — see docs/gdd/inventaire.md. */
export const STARTING_FERS = 15;

export function finalizeCharacter(d: CharacterDraft): Character {
  if (!isDraftComplete(d) || !d.feat) throw new Error('Character draft is incomplete');
  const character: Character = {
    name: normalizeName(d.name),
    origin: 'human',
    feat: d.feat,
    level: 1,
    xp: 0,
    attributes: finalAttributes(d),
    skills: finalSkills(d),
    hp: 0,
    recits: [],
    fers: STARTING_FERS,
    inventory: [],
    equipment: { mainGauche: null, mainDroite: null, armure: null },
  };
  character.hp = characterStats(character).maxHp;
  return character;
}

export function characterStats(c: Pick<Character, 'attributes' | 'feat' | 'level'>): CharacterStats {
  const effects = findFeat(c.feat)?.effects ?? {};
  const attrs = c.attributes;
  const hpAttrs = { ...attrs, vigor: attrs.vigor + (effects.hpVigorBonus ?? 0) };
  return {
    maxHp: maxHitPoints(hpAttrs, c.level) + (effects.hpPerLevelBonus ?? 0) * (c.level - 1),
    resistance: resistancePoints(attrs),
    defense: defense(attrs),
    actionPoints: actionPoints(attrs),
    carryKg: carryCapacityKg(attrs) + (effects.carryBonusKg ?? 0),
    tales: talesRetained(attrs) + (effects.talesBonus ?? 0),
  };
}

/** Structural check used when reading saves; returns a French reason or null. */
export function characterError(raw: unknown): string | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return 'personnage absent.';
  const c = raw as Record<string, unknown>;
  if (typeof c.name !== 'string' || nameError(c.name)) return 'nom du personnage invalide.';
  if (c.origin !== 'human') return 'origine inconnue.';
  if (typeof c.feat !== 'string' || !findFeat(c.feat)) return 'don inconnu.';
  if (!Number.isInteger(c.level) || (c.level as number) < 1) return 'niveau invalide.';
  if (typeof c.xp !== 'number' || !(c.xp >= 0)) return 'expérience invalide.';
  if (!Number.isInteger(c.hp) || (c.hp as number) < 0) return 'points de vie invalides.';
  const attrs = c.attributes as Record<string, unknown> | undefined;
  for (const id of ATTRIBUTE_IDS) {
    const v = attrs?.[id];
    if (!Number.isInteger(v) || (v as number) < CREATION.minScore || (v as number) > CREATION.maxScore) {
      return 'attributs invalides.';
    }
  }
  const skills = c.skills as Record<string, unknown> | undefined;
  for (const id of SKILL_IDS) {
    const v = skills?.[id];
    if (!Number.isInteger(v) || (v as number) < 0 || (v as number) > SKILL_RANK_MAX) return 'compétences invalides.';
  }
  if (!Array.isArray(c.recits) || c.recits.some((r) => typeof r !== 'string')) return 'récits invalides.';
  if (typeof c.fers !== 'number' || !(c.fers >= 0)) return 'monnaie invalide.';
  if (
    !Array.isArray(c.inventory) ||
    c.inventory.some(
      (s) =>
        typeof s !== 'object' ||
        s === null ||
        typeof (s as Record<string, unknown>).itemId !== 'string' ||
        !Number.isInteger((s as Record<string, unknown>).count) ||
        ((s as Record<string, unknown>).count as number) < 1,
    )
  ) {
    return 'inventaire invalide.';
  }
  const equipment = c.equipment as Record<string, unknown> | undefined;
  for (const slot of SLOTS) {
    const v = equipment?.[slot];
    if (v !== null && typeof v !== 'string') return 'équipement invalide.';
  }
  return null;
}
