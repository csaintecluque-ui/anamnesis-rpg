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

describe('mode développeur', () => {
  it('makes an overpowered character that passes every test and can still be saved', async () => {
    const { makeOverpowered, OVERPOWERED_LEVEL } = await import('./testTools');
    const { characterError } = await import('./character');
    const { RECITS } = await import('./recits');
    const { hasPendingLevelUp } = await import('./leveling');
    const c = hero();
    makeOverpowered(c);
    expect(Object.values(c.attributes).every((v) => v === 6)).toBe(true);
    expect(Object.values(c.skills).every((v) => v === 10)).toBe(true);
    expect(c.level).toBe(OVERPOWERED_LEVEL);
    expect(hasPendingLevelUp(c)).toBe(false);
    expect(c.hp).toBe(characterStats(c).maxHp);
    expect(c.equipment.armure).toBe('cuirasse-rivetee');
    expect(c.recits.length).toBe(RECITS.length);
    expect(characterError(JSON.parse(JSON.stringify(c)))).toBeNull();
  });

  it('cycles quests, toggles flags, and lists every flag the game uses', async () => {
    const { allFlags, cycleQuest, toggleFlag } = await import('./testTools');
    const { createNewGame } = await import('../state/gameState');
    const state = createNewGame(hero());
    expect(cycleQuest(state, 'audience')).toBe('active');
    expect(cycleQuest(state, 'audience')).toBe('done');
    expect(cycleQuest(state, 'audience')).toBe('none');
    expect(state.quests.audience).toBeUndefined();
    expect(toggleFlag(state, 'laissez-passer')).toBe(true);
    expect(toggleFlag(state, 'laissez-passer')).toBe(false);
    const flags = allFlags();
    for (const f of ['laissez-passer', 'veille-aiguillage', 'echos-dissipes', 'membre-compagnie-lisieres', 'loups-caravane']) expect(flags, f).toContain(f);
  });
});
