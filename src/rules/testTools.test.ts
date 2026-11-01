import { describe, expect, it } from 'vitest';
import { characterStats, createDraft, finalizeCharacter, STARTING_FERS } from './character';
import { TEST_FERS, addTestFers, restoreFullHp } from './testTools';

function hero() {
  return finalizeCharacter({
    ...createDraft(),
    name: 'Aube',
    feat: 'tough',
    allocated: { body: 3, agility: 3, vigor: 4, intellect: 3, presence: 3, perception: 4, memory: 4 },
    originBonus: ['body', 'vigor'],
    skillRanks: { ...createDraft().skillRanks, melee: 3, stealth: 3 },
  });
}

describe('mode test', () => {
  it('adds Fers', () => {
    const c = hero();
    addTestFers(c);
    expect(c.fers).toBe(STARTING_FERS + TEST_FERS);
  });

  it('restores PV to the maximum, and says how many', () => {
    const c = hero();
    const max = characterStats(c).maxHp;
    c.hp = 1;
    expect(restoreFullHp(c)).toBe(max - 1);
    expect(c.hp).toBe(max);
    expect(restoreFullHp(c)).toBe(0);
  });
});
