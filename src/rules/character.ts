import avatarData from '../data/avatars.json';
import featData from '../data/feats.json';
import traitData from '../data/traits.json';
import { ATTRIBUTES, CREATION_SKILLS, SKILLS, SKILL_RANK_MAX, type AttributeId, type Attributes, type SkillId } from './attributes';
import { actionPoints, carryCapacityKg, defense, maxHitPoints, resistancePoints, talesRetained } from './derived';

export type FeatId =
  | 'tough'
  | 'marksman'
  | 'weapon-master'
  | 'kael-memory'
  | 'amira-spirit'
  | 'gorim-strength'
  // Dons de niveau (feuille de route, chantier 6) : at levels 3, 6 and 9 only.
  | 'marchandeur'
  | 'peau-dure'
  | 'sang-froid';

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
  // Chantier 6 : the level feats and the traits.
  defenseBonus?: number;
  resistanceBonus?: number;
  /** Share off every merchant's price (0.1: 10 % cheaper). */
  buyDiscount?: number;
  /** Share more at the merchants of Verdantis (Gardebois, Canopéa). */
  verdantisSurcharge?: number;
  skillPointsBonus?: number;
  resonanceBonus?: number;
  hpBonus?: number;
}

export interface FeatDef {
  id: FeatId;
  name: string;
  description: string;
  /** Only taken on levelling up (levels 3, 6, 9), not at creation. */
  niveau?: boolean;
  effects: FeatEffects;
}

export const FEATS = featData as FeatDef[];
/** The feats offered at creation. */
export const CREATION_FEATS = FEATS.filter((f) => !f.niveau);

/** A trait chosen at creation (feuille de route, chantier 6) : an edge, and its price. Optional. */
export interface TraitDef {
  id: string;
  name: string;
  description: string;
  effects: FeatEffects;
}
export const TRAITS = traitData as TraitDef[];
export const findTrait = (id?: string | null): TraitDef | undefined => TRAITS.find((t) => t.id === id);

/** A feat every three levels (feuille de route, chantier 6). */
export const DON_EVERY = 3;

/** Everything the hero's feats, level feats and trait add up to. */
export function heroEffects(c: Pick<Character, 'feat' | 'dons' | 'trait'>): FeatEffects[] {
  return [findFeat(c.feat), ...(c.dons ?? []).map(findFeat), findTrait(c.trait)].filter((x): x is FeatDef | TraitDef => !!x).map((x) => x.effects);
}

/** The sum of one numeric effect over the hero's feats and trait. */
export function effectSum(c: Pick<Character, 'feat' | 'dons' | 'trait'>, key: Exclude<keyof FeatEffects, 'attributes' | 'skills' | 'combat' | 'revealsHiddenPlaces'>): number {
  return heroEffects(c).reduce((sum, e) => sum + ((e[key] as number | undefined) ?? 0), 0);
}

/** The feats the hero could still take on levelling up. */
export function donsAvailable(c: Pick<Character, 'feat' | 'dons'>): FeatDef[] {
  const owned = new Set([c.feat, ...(c.dons ?? [])]);
  return FEATS.filter((f) => !owned.has(f.id));
}

/** Whether the hero is owed a feat at their level (3, 6, 9…). */
export function donDue(c: Pick<Character, 'level' | 'dons'>): boolean {
  return (c.dons?.length ?? 0) < Math.floor(c.level / DON_EVERY);
}

/** Takes a feat: its ranks and attributes at once; the rest counts from now on. */
export function takeDon(c: Character, id: FeatId): void {
  const feat = findFeat(id);
  if (!feat) return;
  c.dons = [...(c.dons ?? []), id];
  for (const [skill, n] of Object.entries(feat.effects.skills ?? {})) c.skills[skill as SkillId] = Math.min(SKILL_RANK_MAX, c.skills[skill as SkillId] + (n ?? 0));
  for (const [attr, n] of Object.entries(feat.effects.attributes ?? {})) c.attributes[attr as AttributeId] = Math.min(CREATION.maxScore, c.attributes[attr as AttributeId] + (n ?? 0));
  c.hp = characterStats(c).maxHp;
}

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
  avatar: string;
  allocated: Attributes;
  originBonus: AttributeId[];
  skillRanks: SkillRanks;
  feat: FeatId | null;
  /** Optional (chantier 6). */
  trait?: string | null;
}

/** Two hands, armour, and a crystal worn at the neck (docs/gdd/inventaire.md, docs/gdd/magie.md). */
export type Slot = 'mainGauche' | 'mainDroite' | 'armure' | 'cristal';
export const SLOTS: Slot[] = ['mainGauche', 'mainDroite', 'armure', 'cristal'];

/** Points de Résonance at rank 0 of the skill (docs/gdd/magie.md); each rank adds one. */
export const RESONANCE_BASE = 3;

export interface InventorySlotState {
  itemId: string;
  count: number;
}

export type Equipment = Record<Slot, string | null>;

export interface Character {
  name: string;
  /** Look chosen at creation (src/data/avatars.json): portrait and walk sheet. */
  avatar: string;
  origin: 'human';
  feat: FeatId;
  level: number;
  xp: number;
  attributes: Attributes;
  skills: SkillRanks;
  hp: number;
  /** Points de Résonance left (docs/gdd/magie.md): spent by the powers of a worn crystal, all back after a night's sleep. */
  resonance: number;
  /** Récits recueillis (docs/gdd/memoire.md, piste B), plafonnés par talesRetained. */
  recits: string[];
  /** La monnaie de Ferros (docs/univers/personnages/pnj.md). */
  fers: number;
  inventory: InventorySlotState[];
  equipment: Equipment;
  /**
   * Marks left by forcing the crystal (src/rules/marques.ts, docs/gdd/passe-sombre.md), 0 to 3. Optional: saves
   * from before the marks (v14) have none, and stay valid as they are.
   */
  marques?: number;
  /** Feats taken on levelling up (feuille de route, chantier 6). */
  dons?: FeatId[];
  /** A trait chosen at creation, with its price (src/data/traits.json ; chantier 6). */
  trait?: string;
  /** Fights each weapon or armour has been through since its last repair (src/rules/usure.ts ; chantier 6). */
  usure?: Record<string, number>;
  /** Casts since the worn crystal was last tuned (src/rules/usure.ts ; chantier 6). */
  usureCristal?: number;
}

/** Fights after which a weapon or an armour is dulled (−1), then worn (−2) (feuille de route, chantier 6). */
export const WEAR_DULL = 6;
export const WEAR_WORN = 12;

/** What a weapon (to hit) or an armour (Défense) loses to its wear: 0, 1 or 2. */
export function wearPenalty(c: Pick<Character, 'usure'>, itemId: string | null): number {
  const wear = itemId ? (c.usure?.[itemId] ?? 0) : 0;
  return wear >= WEAR_WORN ? 2 : wear >= WEAR_DULL ? 1 : 0;
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
const CREATION_SKILL_IDS = new Set(CREATION_SKILLS.map((s) => s.id));

function fill<K extends string>(keys: K[], value: number): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, value])) as Record<K, number>;
}

export function findFeat(id: string): FeatDef | undefined {
  return FEATS.find((f) => f.id === id);
}

export function createDraft(): CharacterDraft {
  return {
    name: '',
    avatar: DEFAULT_AVATAR,
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
  return CREATION_SKILL_IDS.has(id) && d.skillRanks[id] < CREATION.skillMaxAtCreation && skillPointsLeft(d) > 0;
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
  const trait = findTrait(d.trait);
  const result = { ...d.skillRanks };
  for (const id of SKILL_IDS) {
    const bonus = (feat?.effects.skills?.[id] ?? 0) + (trait?.effects.skills?.[id] ?? 0);
    result[id] = Math.max(0, Math.min(SKILL_RANK_MAX, result[id] + bonus));
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
/** Six looks to choose from at creation (docs/gdd/jalon-2.md, étape 3). */
export interface AvatarDef {
  id: string;
  label: string;
  /** Under public/: dialogue-style portrait, and the 8-direction walk sheet (docs/gdd/animation.md). */
  portrait: string;
  walk: string;
}
export const AVATARS = avatarData as AvatarDef[];
/** The hero of the first version; older saves get it. */
export const DEFAULT_AVATAR = 'apprenti';

export function findAvatar(id: string): AvatarDef | undefined {
  return AVATARS.find((a) => a.id === id);
}

export const STARTING_FERS = 15;

/** Every apprentice starts with this weapon in the right hand (docs/gdd/inventaire.md, à valider). */
export const STARTING_WEAPON = 'dague';

export function finalizeCharacter(d: CharacterDraft): Character {
  if (!isDraftComplete(d) || !d.feat) throw new Error('Character draft is incomplete');
  const character: Character = {
    name: normalizeName(d.name),
    avatar: d.avatar,
    origin: 'human',
    feat: d.feat,
    ...(d.trait ? { trait: d.trait } : {}),
    level: 1,
    xp: 0,
    attributes: finalAttributes(d),
    skills: finalSkills(d),
    hp: 0,
    resonance: 0,
    recits: [],
    fers: STARTING_FERS,
    inventory: [{ itemId: STARTING_WEAPON, count: 1 }],
    equipment: { mainGauche: null, mainDroite: STARTING_WEAPON, armure: null, cristal: null },
  };
  character.resonance = RESONANCE_BASE + character.skills.resonance;
  character.hp = characterStats(character).maxHp;
  return character;
}

export function characterStats(c: Pick<Character, 'attributes' | 'feat' | 'level'> & Partial<Pick<Character, 'dons' | 'trait'>>): CharacterStats {
  const sum = (key: Parameters<typeof effectSum>[1]) => effectSum(c, key);
  const attrs = c.attributes;
  const hpAttrs = { ...attrs, vigor: attrs.vigor + sum('hpVigorBonus') };
  return {
    maxHp: Math.max(1, maxHitPoints(hpAttrs, c.level) + sum('hpPerLevelBonus') * (c.level - 1) + sum('hpBonus')),
    resistance: resistancePoints(attrs),
    defense: defense(attrs) + sum('defenseBonus'),
    actionPoints: actionPoints(attrs),
    carryKg: carryCapacityKg(attrs) + sum('carryBonusKg'),
    tales: Math.max(1, talesRetained(attrs) + sum('talesBonus')),
  };
}

/** Structural check used when reading saves; returns a French reason or null. */
export function characterError(raw: unknown): string | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return 'personnage absent.';
  const c = raw as Record<string, unknown>;
  if (typeof c.name !== 'string' || nameError(c.name)) return 'nom du personnage invalide.';
  if (typeof c.avatar !== 'string' || !findAvatar(c.avatar)) return 'apparence inconnue.';
  if (c.origin !== 'human') return 'origine inconnue.';
  if (typeof c.feat !== 'string' || !findFeat(c.feat)) return 'don inconnu.';
  if (c.dons !== undefined && (!Array.isArray(c.dons) || c.dons.some((d) => typeof d !== 'string' || !findFeat(d)))) return 'dons de niveau inconnus.';
  if (c.trait !== undefined && (typeof c.trait !== 'string' || !findTrait(c.trait))) return 'trait inconnu.';
  if (!Number.isInteger(c.level) || (c.level as number) < 1) return 'niveau invalide.';
  if (typeof c.xp !== 'number' || !(c.xp >= 0)) return 'expérience invalide.';
  if (!Number.isInteger(c.hp) || (c.hp as number) < 0) return 'points de vie invalides.';
  if (!Number.isInteger(c.resonance) || (c.resonance as number) < 0) return 'points de Résonance invalides.';
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
  if (c.marques !== undefined && (!Number.isInteger(c.marques) || (c.marques as number) < 0 || (c.marques as number) > 3)) {
    return 'marques invalides.';
  }
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
