import { describe, expect, it } from 'vitest';
import { CREATION_FEATS,
  AVATARS,
  CREATION,
  DEFAULT_AVATAR,
  FEATS,
  attributePointsLeft,
  changeAttribute,
  changeSkill,
  characterError,
  characterStats,
  combatWarning,
  createDraft,
  draftErrors,
  finalAttributes,
  finalSkills,
  finalizeCharacter,
  findAvatar,
  isDraftComplete,
  nameError,
  skillPointsLeft,
  toggleOriginBonus,
  type CharacterDraft,
} from './character';

function completeDraft(): CharacterDraft {
  let d = createDraft();
  d = { ...d, name: '  Lise   Voix-Claire ' };
  d = changeAttribute(d, 'memory', 1);
  d = changeAttribute(d, 'memory', 1);
  d = changeAttribute(d, 'presence', 1);
  d = toggleOriginBonus(d, 'perception');
  d = toggleOriginBonus(d, 'agility');
  for (const id of ['diplomacy', 'diplomacy', 'lore', 'lore', 'stealth', 'investigation'] as const) d = changeSkill(d, id, 1);
  return { ...d, feat: 'tough' };
}

describe('attribute allocation (docs/gdd/attributs.md)', () => {
  it('starts at 3 everywhere with 3 points to spend', () => {
    const d = createDraft();
    expect(Object.values(d.allocated).every((v) => v === 3)).toBe(true);
    expect(attributePointsLeft(d)).toBe(3);
  });

  it('caps allocation at 5 and refuses to spend points that are not there', () => {
    let d = createDraft();
    d = changeAttribute(d, 'body', 1);
    d = changeAttribute(d, 'body', 1);
    d = changeAttribute(d, 'body', 1);
    expect(d.allocated.body).toBe(5);
    expect(attributePointsLeft(d)).toBe(1);
    d = changeAttribute(d, 'agility', 1);
    expect(attributePointsLeft(d)).toBe(0);
    expect(changeAttribute(d, 'vigor', 1)).toBe(d);
  });

  it('gives a point back for each notch below 3, never below 1', () => {
    let d = createDraft();
    d = changeAttribute(d, 'body', -1);
    d = changeAttribute(d, 'body', -1);
    expect(d.allocated.body).toBe(1);
    expect(attributePointsLeft(d)).toBe(5);
    expect(changeAttribute(d, 'body', -1)).toBe(d);
  });

  it('applies the human bonus (+1) to exactly two different attributes', () => {
    let d = createDraft();
    d = toggleOriginBonus(d, 'body');
    d = toggleOriginBonus(d, 'memory');
    d = toggleOriginBonus(d, 'vigor');
    expect(d.originBonus).toEqual(['body', 'memory']);
    d = toggleOriginBonus(d, 'body');
    expect(d.originBonus).toEqual(['memory']);
  });

  it('lets bonuses raise a score to 6 but no further', () => {
    let d = createDraft();
    d = changeAttribute(d, 'body', 1);
    d = changeAttribute(d, 'body', 1);
    d = toggleOriginBonus(d, 'body');
    d = { ...d, feat: 'gorim-strength' };
    expect(finalAttributes(d).body).toBe(CREATION.maxScore);
  });
});

describe('skill allocation (docs/gdd/competences.md)', () => {
  it('spends 6 ranks, at most 3 per skill', () => {
    let d = createDraft();
    for (let i = 0; i < 4; i++) d = changeSkill(d, 'melee', 1);
    expect(d.skillRanks.melee).toBe(3);
    expect(skillPointsLeft(d)).toBe(3);
    d = changeSkill(d, 'melee', -1);
    expect(skillPointsLeft(d)).toBe(4);
    expect(changeSkill(createDraft(), 'melee', -1).skillRanks.melee).toBe(0);
  });

  it('adds feat skill bonuses on top of creation ranks', () => {
    let d = changeSkill(createDraft(), 'lore', 1);
    d = { ...d, feat: 'kael-memory' };
    expect(finalSkills(d).lore).toBe(3);
  });
});

describe('draft validation', () => {
  it('lists what is missing, step by step, in French', () => {
    const errors = draftErrors(createDraft());
    expect(errors.name[0]).toContain('Donne un nom');
    expect(errors.attributes).toHaveLength(2);
    expect(errors.skills[0]).toContain('6 rangs');
    expect(errors.feat[0]).toContain('don');
  });

  it('accepts a complete draft', () => {
    expect(isDraftComplete(completeDraft())).toBe(true);
  });

  it('rejects empty or overly long names', () => {
    expect(nameError('   ')).not.toBeNull();
    expect(nameError('x'.repeat(CREATION.nameMaxLength + 1))).not.toBeNull();
    expect(nameError('Aube')).toBeNull();
  });
});

describe('finalizeCharacter', () => {
  it('builds a level 1 character at full health with a clean name', () => {
    const c = finalizeCharacter(completeDraft());
    expect(c.name).toBe('Lise Voix-Claire');
    expect(c.level).toBe(1);
    expect(c.attributes).toMatchObject({ memory: 5, presence: 4, perception: 4, agility: 4, body: 3 });
    expect(c.skills).toMatchObject({ diplomacy: 2, lore: 2, stealth: 1, investigation: 1, melee: 0 });
    expect(c.hp).toBe(characterStats(c).maxHp);
    expect(characterError(c)).toBeNull();
  });

  it('refuses an incomplete draft', () => {
    expect(() => finalizeCharacter(createDraft())).toThrow();
  });
});

describe('characterStats', () => {
  const base = finalizeCharacter(completeDraft());

  it('applies Dur à Cuire: +2 Vigueur for hit points', () => {
    // Vigueur 3 → computed as 5: 20 + 4 × 5 = 40.
    expect(characterStats(base).maxHp).toBe(40);
    // Level 2: +4 + mod(5) = +6, plus +2 from the feat.
    expect(characterStats({ ...base, level: 2 }).maxHp).toBe(48);
  });

  it('applies Fort comme Gorim (+10 kg) and Mémoire de Kael (+1 Récit)', () => {
    expect(characterStats({ ...base, feat: 'gorim-strength' }).carryKg).toBe(30 + 10 * 3 + 10);
    expect(characterStats({ ...base, feat: 'kael-memory' }).tales).toBe(5 + 1 + 1);
  });

  it('has a description for every feat', () => {
    expect(FEATS).toHaveLength(9);
    expect(CREATION_FEATS).toHaveLength(6);
    for (const feat of FEATS) expect(feat.description.length).toBeGreaterThan(10);
  });
});

describe('characterError (save validation)', () => {
  const valid = finalizeCharacter(completeDraft());

  it.each([
    ['an unknown feat', { ...valid, feat: 'flying' }],
    ['an out-of-range attribute', { ...valid, attributes: { ...valid.attributes, body: 9 } }],
    ['a missing skill', { ...valid, skills: { ...valid.skills, lore: undefined } }],
    ['an empty name', { ...valid, name: '' }],
    ['a negative level', { ...valid, level: 0 }],
  ])('rejects %s', (_label, raw) => {
    expect(characterError(raw)).not.toBeNull();
  });
});

describe('avatars (docs/gdd/jalon-2.md, étape 3)', () => {
  it('offers six looks, the first version\'s hero by default, each with a portrait and a walk sheet', () => {
    expect(AVATARS).toHaveLength(6);
    expect(createDraft().avatar).toBe(DEFAULT_AVATAR);
    expect(findAvatar(DEFAULT_AVATAR)).toBeDefined();
    const files = Object.keys(import.meta.glob('/public/{portraits,sprites}/*'));
    for (const a of AVATARS) {
      expect(files, a.portrait).toContain(`/public/${a.portrait}`);
      expect(files, a.walk).toContain(`/public/${a.walk}`);
    }
  });

  it('keeps the chosen look on the finished character', () => {
    expect(finalizeCharacter({ ...completeDraft(), avatar: 'etoiles' }).avatar).toBe('etoiles');
  });
});


describe('the warning at the end of creation (étude, C3)', () => {
  it('speaks only when the hero has neither Mêlée nor Tir', () => {
    expect(combatWarning({ melee: 0, ranged: 0 })).toMatch(/il y en a qu’on n’évite pas/);
    expect(combatWarning({ melee: 1, ranged: 0 })).toBeNull();
    expect(combatWarning({ melee: 0, ranged: 2 })).toBeNull();
  });
});
