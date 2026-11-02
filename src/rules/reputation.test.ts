import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { QUESTS, visibleOptions } from './dialogue';
import { applyEffects } from './dialogue';
import { createNewGame } from '../state/gameState';
import { buyPrice, findItem } from './inventory';
import {
  LEVELS,
  findFaction,
  REPUTATION,
  combinedDiscount,
  levelOf,
  merchantPlace,
  reputationLevel,
  reputationNotices,
  reputationPrices,
  reputationScore,
} from './reputation';
import { findPlace } from './world';

/** Réputation par ville (docs/gdd/reputation.md). */
describe('reputation', () => {
  it('only counts known towns, quests and story flags', () => {
    const quests = new Set(QUESTS.map((q) => q.id));
    for (const [place, sources] of Object.entries(REPUTATION)) {
      expect(findPlace(place) ?? findFaction(place), place).toBeDefined();
      for (const s of sources) {
        expect(!!s.quest !== !!s.flag, `${place}: a quest or a flag`).toBe(true);
        if (s.quest) expect(quests.has(s.quest), s.quest).toBe(true);
      }
    }
  });

  it('starts neutral everywhere, rises with quests done there, falls with a theft', () => {
    const state = createNewGame();
    expect(reputationLevel(state, 'gardebois').id).toBe('neutre');
    state.quests['dernier-train'] = 'active';
    expect(reputationScore(state, 'gardebois')).toBe(0);
    state.quests['dernier-train'] = 'done';
    expect(reputationLevel(state, 'gardebois').id).toBe('estime');
    state.quests.berceuse = 'done';
    expect(reputationLevel(state, 'gardebois').id).toBe('amitie');
    state.flags['vol-grenier'] = true;
    expect(reputationLevel(state, 'canopee').id).toBe('mefiance');
    expect(reputationLevel(state, 'gardebois').id).toBe('amitie');
  });

  it('has ordered levels from mistrust to trust', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['mefiance', 'neutre', 'estime', 'amitie']);
    expect(levelOf(-1).id).toBe('mefiance');
    expect(levelOf(9).id).toBe('neutre');
    expect(levelOf(10).id).toBe('estime');
  });

  it('changes the prices of the town’s merchants, not the wanderers’', () => {
    const state = createNewGame();
    expect(merchantPlace('sevane')).toBe('canopee');
    expect(merchantPlace('colporteuse')).toBeUndefined();
    state.flags['vol-grenier'] = true;
    expect(reputationPrices(state, 'sevane')).toBe(0.2);
    expect(reputationPrices(state, 'colporteuse')).toBe(0);
    const baume = findItem('baume-mousse')!;
    expect(buyPrice(baume, combinedDiscount(0, reputationPrices(state, 'sevane')))).toBe(14);
    // Tobias's own discount and the friendship of Gardebois add up.
    expect(combinedDiscount(0.2, -0.15)).toBeCloseTo(0.32);
  });

  it('says so when a town changes its mind', () => {
    const before = createNewGame();
    const after = createNewGame();
    after.flags['ailis-reconfortee'] = true;
    expect(reputationNotices(before, after)).toEqual(['Réputation à Canopéa : on t’apprécie']);
    const state = createNewGame();
    expect(applyEffects(state, [{ setFlag: 'vol-grenier' }])).toContain('Réputation à Canopéa : on se méfie de toi');
  });

  it('opens a word with the Council’s usher once Canopéa thinks well of the hero', () => {
    const state = createNewGame();
    const ask = () => visibleOptions(DIALOGUES.huissier.nodes.accueil, state).find((v) => v.option.next === 'estime')!;
    expect(ask().enabled).toBe(false);
    expect(ask().tags).toEqual(['Réputation à Canopéa : on t’apprécie']);
    state.flags['ailis-reconfortee'] = true;
    expect(ask().enabled).toBe(true);
  });
});
