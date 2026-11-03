import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { GOLEM_FIGHT } from './combat';
import { startNode, startsCombat } from './dialogue';
import { choose, testCharacter } from './questTestKit';

/** Le Golem reste attaquable après la résolution par la parole (décision de Cyril, 2026-11-03 ; étude, E11). */

function yardStopped() {
  const state = createNewGame(testCharacter());
  state.location = 'gare-engloutie';
  state.quests['dernier-train'] = 'done';
  state.flags['chantier-arrete'] = true;
  state.groupe = [{ id: 'liane', hp: 24 }];
  state.avis.liane = 2;
  return state;
}

describe('the Golem, once the yard is stopped', () => {
  it('warns first, in Ingrid’s words', () => {
    const state = yardStopped();
    expect(startNode(DIALOGUES['golem-gare'], state)).toBe('garde');
    expect(DIALOGUES['golem-gare'].nodes.garde.text).toContain('Touchez-y, et je ne réponds plus de rien');
  });

  it('striking it starts the fight, and Liane disapproves', () => {
    const state = yardStopped();
    const option = choose(state, 'golem-gare', 'garde', 'Le frapper quand même');
    expect(startsCombat(option.effects)).toBe(GOLEM_FIGHT);
    expect(state.avis.liane).toBe(1);
    expect(state.flags['golem-attaque-apres']).toBe(true);
  });

  it('beaten, Ingrid holds it against the hero', () => {
    const state = yardStopped();
    choose(state, 'golem-gare', 'garde', 'Le frapper quand même');
    state.flags['golem-vaincu'] = true;
    expect(startNode(DIALOGUES.ingrid, state)).toBe('apres-golem-trahie');
  });

  it('left alone, nothing changes', () => {
    const state = yardStopped();
    choose(state, 'golem-gare', 'garde', 'Le laisser');
    expect([state.avis.liane, state.flags['golem-attaque-apres']]).toEqual([2, undefined]);
  });
});
