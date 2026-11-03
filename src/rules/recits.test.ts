import { describe, expect, it } from 'vitest';
import { changeAttribute, changeSkill, createDraft, finalizeCharacter, toggleOriginBonus, type Character, type CharacterDraft } from './character';
import { findRecit, forgetRecit, knowsRecit, learnRecit, recitOverflow, RECITS } from './recits';

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
    expect(findRecit('savant-corvan')?.titre).toBe('Le savant du dernier quai');
    expect(findRecit('corvan')?.titre).toBe('Le Savant Corvan');
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

  it('past the cap (Mémoire + 1), lets the hero choose which récit to forget (feuille de route, chantier 1)', () => {
    const c = heroWithMemory(3); // cap = talesRetained(3) = 4
    for (let i = 0; i < 4; i++) learnRecit(c, `recit-${i}`);
    expect(recitOverflow(c)).toBe(0);
    learnRecit(c, 'recit-4');
    // Nothing forgotten by itself: one too many, to choose.
    expect(c.recits).toEqual(['recit-0', 'recit-1', 'recit-2', 'recit-3', 'recit-4']);
    expect([recitOverflow(c), recitOverflow(c, 1)]).toEqual([1, 0]);
    expect(forgetRecit(c, 'recit-2')).toBe(true);
    expect([c.recits, recitOverflow(c)]).toEqual([['recit-0', 'recit-1', 'recit-3', 'recit-4'], 0]);
  });

  it('never forgets a Récit of the main story, and does not count it against the cap (decision of Cyril, 2026-11-02)', () => {
    const c = heroWithMemory(3); // cap = 4
    learnRecit(c, 'savant-corvan');
    for (let i = 0; i < 4; i++) learnRecit(c, `recit-${i}`);
    learnRecit(c, 'triumvirat-vert');
    expect(recitOverflow(c)).toBe(0);
    expect(forgetRecit(c, 'savant-corvan')).toBe(false);
    expect(c.recits).toContain('savant-corvan');
  });

  it('ships with the Récit du savant Corvan, used to resolve Le Dernier Train (docs/gdd/memoire.md, tranche-verticale.md)', () => {
    expect(RECITS.some((r) => r.id === 'savant-corvan')).toBe(true);
  });
});
