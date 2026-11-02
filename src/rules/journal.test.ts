import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import { QUESTS } from './dialogue';
import { journalQuests, journalRecits, journalReputation } from './journal';
import { testCharacter } from './questTestKit';
import { learnRecit } from './recits';

/** Le journal (docs/gdd/interface.md). */
describe('journal', () => {
  it('lists quests in progress first, the latest step reached, then the finished ones', () => {
    const state = createNewGame(testCharacter());
    state.quests['dernier-train'] = 'done';
    state.quests['lettres-malo'] = 'active';
    state.quests.audience = 'active';
    state.flags['audience-tenue'] = true;
    state.flags['fouille-elucidee'] = true;
    const quests = journalQuests(state);
    expect(quests.map((q) => q.id)).toEqual(['audience', 'lettres-malo', 'dernier-train']);
    expect(quests[0].step).toMatch(/rapport/);
    expect(quests[1].step).toBeUndefined();
    expect(quests[2].done).toBe(true);
  });

  it('only points steps at flags the game sets somewhere', async () => {
    const { DIALOGUES } = await import('../data/dialogues');
    const set = new Set<string>(JSON.stringify(DIALOGUES).match(/"setFlag":"[^"]+"/g)!.map((m) => m.slice(11, -1)));
    for (const flag of ['loups-caravane']) set.add(flag); // set by the world map when the wolves are met
    const { ENCOUNTERS } = await import('./combat');
    for (const e of ENCOUNTERS) set.add(e.victoryFlag); // set when a fight started from a dialogue is won
    for (const q of QUESTS) for (const e of q.etapes ?? []) expect(set.has(e.si), `${q.id}: ${e.si}`).toBe(true);
  });

  it('shows Récits retained against the cap, and towns and guilds dealt with', () => {
    const state = createNewGame(testCharacter({ memory: 1 }));
    learnRecit(state.character!, 'chant-anselme');
    expect(journalRecits(state)).toEqual({ recits: [expect.objectContaining({ id: 'chant-anselme' })], cap: 2 });
    expect(journalReputation(state).map((r) => r.id)).not.toContain('compagnie-lisieres');
    state.flags['membre-compagnie-lisieres'] = true;
    state.quests['caravane-midi'] = 'done';
    const guild = journalReputation(state).find((r) => r.id === 'compagnie-lisieres')!;
    expect(guild).toMatchObject({ name: 'La Compagnie des Lisières', kind: 'guilde', member: true, label: 'on t’apprécie' });
    expect(journalReputation(state)[0]).toMatchObject({ id: 'gardebois', kind: 'ville' });
  });
});
