import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { joinParty } from './companions';
import { applyEffects, autoTalk, startNode } from './dialogue';
import { testCharacter } from './questTestKit';

/** Les paroles des compagnons qui viennent seules (étude du 2026-11-03, D4 ; docs/gdd/compagnons.md). */

const withParty = (...ids: string[]): GameState => {
  const state = createNewGame(testCharacter());
  for (const id of ids) joinParty(state, id);
  return state;
};

describe('les paroles des compagnons qui viennent seules (étude D4)', () => {
  it('l’aveu de Liane vient seul la nuit, une seule fois', () => {
    const state = withParty('liane');
    state.time = { day: 2, phase: 0 };
    expect(autoTalk(state, DIALOGUES)).toBeNull();
    state.time = { day: 2, phase: 3 };
    const talk = autoTalk(state, DIALOGUES);
    expect(talk?.id).toBe('compagnon-liane');
    expect(startNode(DIALOGUES['compagnon-liane'], state)).toBe('nuit');
    state.flags[talk!.flag] = true;
    expect(autoTalk(state, DIALOGUES)).toBeNull();
  });

  it('les trois échanges entre Boulon et Liane viennent l’un après l’autre', () => {
    const state = withParty('liane', 'boulon');
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const talk = autoTalk(state, DIALOGUES);
      expect(talk?.id).toBe('compagnon-boulon');
      const node = startNode(DIALOGUES['compagnon-boulon'], state);
      seen.push(node);
      state.flags[talk!.flag] = true;
      // What the exchange itself records (its effects), so that the next one comes.
      applyEffects(state, DIALOGUES['compagnon-boulon'].nodes[node].effects);
    }
    expect(seen).toEqual(['duo-1', 'duo-2', 'duo-3']);
    expect(autoTalk(state, DIALOGUES)).toBeNull();
  });

  it('chaque parole qui vient seule se laisse refuser : une réponse au moins finit l’échange', () => {
    let count = 0;
    for (const dialogue of Object.values(DIALOGUES)) {
      for (const entry of dialogue.entries.filter((e) => e.seul)) {
        count++;
        expect(dialogue.id.startsWith('compagnon-'), dialogue.id).toBe(true);
        const node = dialogue.nodes[entry.node];
        expect(node, `${dialogue.id} › ${entry.node}`).toBeDefined();
        expect(node.options.some((o) => o.next === 'fin'), `${dialogue.id} › ${entry.node}`).toBe(true);
      }
    }
    expect(count).toBeGreaterThanOrEqual(8);
  });
});
