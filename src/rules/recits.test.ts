import { describe, expect, it } from 'vitest';
import { changeAttribute, changeSkill, createDraft, finalizeCharacter, toggleOriginBonus, type Character, type CharacterDraft } from './character';
import { findRecit, knowsRecit, learnRecit, RECITS } from './recits';

function heroWithMemory(memory: number): Character {
  let draft: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough' };
  draft = changeAttribute(changeAttribute(changeAttribute(draft, 'memory', 1), 'presence', 1), 'perception', 1);
  draft = toggleOriginBonus(toggleOriginBonus(draft, 'body'), 'vigor');
  for (const id of ['lore', 'lore', 'lore', 'diplomacy', 'diplomacy', 'stealth'] as const) draft = changeSkill(draft, id, 1);
  const c = finalizeCharacter(draft);
  return { ...c, attributes: { ...c.attributes, memory } };
}

describe('recits', () => {
  it('finds a known récit and reports an unknown one as absent', () => {
    expect(findRecit('savant-corvan')?.titre).toBe('Le Savant Corvan');
    expect(findRecit('inconnu')).toBeUndefined();
  });

  it('knowsRecit is false for a fresh character and for no character at all', () => {
    const c = heroWithMemory(3);
    expect(knowsRecit(c, 'savant-corvan')).toBe(false);
    expect(knowsRecit(null, 'savant-corvan')).toBe(false);
  });

  it('learns a récit once, without duplicating it', () => {
    const c = heroWithMemory(3);
    learnRecit(c, 'savant-corvan');
    learnRecit(c, 'savant-corvan');
    expect(c.recits).toEqual(['savant-corvan']);
    expect(knowsRecit(c, 'savant-corvan')).toBe(true);
  });

  it('forgets the oldest récit once past the cap (Mémoire + 1)', () => {
    const c = heroWithMemory(3); // cap = talesRetained(3) = 4
    for (let i = 0; i < 4; i++) learnRecit(c, `recit-${i}`);
    expect(c.recits).toEqual(['recit-0', 'recit-1', 'recit-2', 'recit-3']);
    learnRecit(c, 'recit-4');
    expect(c.recits).toEqual(['recit-1', 'recit-2', 'recit-3', 'recit-4']);
  });

  it('ships with the Récit du savant Corvan, used to resolve Le Dernier Train (GDD §4, §6)', () => {
    expect(RECITS.some((r) => r.id === 'savant-corvan')).toBe(true);
  });
});
