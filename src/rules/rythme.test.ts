import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame } from '../state/gameState';
import { CHAPTER_QUESTS, ENCOUNTERS, GOLEM_VICTORY_EFFECTS, findEnemy } from './combat';
import type { Effect } from './dialogue';
import { levelForXp } from './leveling';
import { choose, testCharacter } from './questTestKit';

/** Le rythme (test du 2026-11-06, décision de Cyril ; docs/gdd/progression.md). */

const xpOf = (effects: Effect[] = []): number => effects.reduce((n, e) => n + ('giveXp' in e ? e.giveXp : 0), 0);

describe('the pace of the levels', () => {
  it('level 2 before the end of Gardebois, by the main path alone: Ilyane, Tobias, the first fight, the Écho of the train', () => {
    const s = createNewGame(testCharacter({}, { diplomacy: 3 }));
    choose(s, 'ilyane', 'accueil', 'Que se passe-t-il');
    choose(s, 'ilyane', 'trouble', 'Tes mains tremblent');
    choose(s, 'ilyane', 'atteinte', 'Que puis-je faire');
    choose(s, 'ilyane', 'cause', 'La loi de la Mémoire Vivante');
    choose(s, 'ilyane', 'savant', 'J’irai à la Gare');
    choose(s, 'tobias', 'accueil', 'Je dois entrer sur le chantier');
    choose(s, 'tobias', 'chantier', 'Si ce chantier');
    // The Rôdeur on the path to the Gare (the first fight), then the Écho, only looked at (the least it gives).
    s.character!.xp += xpOf(ENCOUNTERS.find((e) => e.id === 'embuscade-gare')!.victoryEffects);
    choose(s, 'echo-dernier-train', 'approche', 'Observer');
    expect(s.quests['dernier-train']).toBe('active');
    expect(levelForXp(s.character!.xp)).toBe(2);
  });

  it('the fights pay twice what they did: a Rôdeur-Épine 30, the first fight 30', () => {
    expect(findEnemy('rodeur-epine')!.xp).toBe(30);
    expect(xpOf(ENCOUNTERS.find((e) => e.id === 'embuscade-gare')!.victoryEffects)).toBe(30);
  });

  it('every end of a main quest pays 100 to 150 XP: 120 or so to chapter 4, 150 or so after', () => {
    const ends: { quest: string; xp: number }[] = [];
    for (const d of Object.values(DIALOGUES)) {
      for (const n of Object.values(d.nodes)) {
        for (const effects of [n.effects, ...n.options.map((o) => o.effects)]) {
          const done = effects?.find((e): e is { completeQuest: string } => 'completeQuest' in e && CHAPTER_QUESTS.includes(e.completeQuest));
          if (done) ends.push({ quest: done.completeQuest, xp: xpOf(effects) });
        }
      }
    }
    ends.push({ quest: 'dernier-train', xp: xpOf(GOLEM_VICTORY_EFFECTS) });
    expect(new Set(ends.map((e) => e.quest)).size).toBe(CHAPTER_QUESTS.length);
    for (const { quest, xp } of ends) {
      const chapter = CHAPTER_QUESTS.indexOf(quest) + 1;
      const [low, high] = chapter <= 4 ? [100, 140] : [130, 150];
      expect(xp, quest).toBeGreaterThanOrEqual(low);
      expect(xp, quest).toBeLessThanOrEqual(high);
    }
  });
});
