import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { parseTiledMap } from '../engine/tiledMap';
import { createNewGame } from '../state/gameState';
import type { SkillId } from './attributes';
import { rollChance, startNode, visibleOptions, type DialogueOption } from './dialogue';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { RENCONTRES } from './world';

/**
 * Les compétences et la courbe des tests (feuille de route, chantier 2 ; docs/gdd/competences.md) : chaque compétence
 * sert, et la difficulté monte de chapitre en chapitre.
 */

/** The skills of talk, of the road and of the hands; Mêlée and Tir serve in combat, Résonance in magic. */
const SKILLS_OF_TESTS: SkillId[] = ['athletics', 'stealth', 'crafting', 'survival', 'lore', 'investigation', 'medicine', 'command', 'diplomacy', 'subterfuge'];

/** What a test asks, chapter by chapter: the score of a condition (rank + attribute), the difficulty of a roll. */
const CURVE: Record<number, { score: [number, number]; roll: [number, number] }> = {
  1: { score: [2, 3], roll: [10, 12] },
  2: { score: [2, 3], roll: [11, 13] },
  3: { score: [3, 4], roll: [12, 14] },
  4: { score: [3, 5], roll: [13, 15] },
  5: { score: [4, 5], roll: [14, 16] },
};

/** The chapter of a map, by its name; null for the maps of the road (encounters, the sleeping lines). */
function chapterOfMap(map: string): number | null {
  if (/^(gardebois|gare-|auberge-racine|maison-|reserve-)/.test(map)) return 1;
  if (/^(canopee|sol-racines)/.test(map)) return 2;
  if (/^ironheart/.test(map)) return 3;
  if (/^sept-portes/.test(map)) return 4;
  if (/^(aetherhaven|bas-cendres|voie-du-bas|halte-cendres)/.test(map)) return 5;
  return null;
}

/** Each dialogue's chapter: the map where its speaker stands, or where an object opens it. */
const CHAPTER_OF: Record<string, number | null> = {};
for (const [id, json] of Object.entries(MAPS)) {
  for (const o of parseTiledMap(json).objects) {
    for (const key of [o.name, o.properties.dialogue]) if (key && !(key in CHAPTER_OF)) CHAPTER_OF[key] = chapterOfMap(id);
  }
}

interface Use {
  where: string;
  chapter: number | null;
  skill: SkillId;
  kind: 'score' | 'roll';
  value: number;
  /** A roll made easier by a rumour heard at a veillée (docs/gdd/veillees.md). */
  helped: boolean;
}

const USES: Use[] = Object.values(DIALOGUES).flatMap((d) => {
  const chapter = CHAPTER_OF[d.id] ?? CHAPTER_OF[d.speaker] ?? null;
  return Object.values(d.nodes).flatMap((n) =>
    n.options.flatMap((o: DialogueOption): Use[] => {
      const helped = (o.requires ?? []).some((r) => 'flag' in r && r.flag.startsWith('rumeur-'));
      const uses: Use[] = (o.requires ?? []).flatMap((r) => ('skill' in r ? [{ where: d.id, chapter, skill: r.skill, kind: 'score' as const, value: r.min, helped }] : []));
      if (o.roll) uses.push({ where: d.id, chapter, skill: o.roll.skill, kind: 'roll', value: o.roll.difficulty, helped });
      return uses;
    }),
  );
});

describe('the skills', () => {
  it('each serves in at least five places: dialogues, or the encounters of the road (feuille de route, chantier 2)', () => {
    const roads = RENCONTRES.flatMap((r) => (r.avoid ? [{ where: r.id, skill: r.avoid.skill }] : []));
    for (const skill of SKILLS_OF_TESTS) {
      const places = new Set([...USES, ...roads].filter((u) => u.skill === skill).map((u) => u.where));
      expect(places.size, `${skill} : ${[...places].join(', ')}`).toBeGreaterThanOrEqual(5);
    }
  });

  it('ask more from chapter to chapter: a score and a difficulty within the curve of the chapter', () => {
    const placed = USES.filter((u) => u.chapter !== null);
    expect(placed.length).toBeGreaterThan(60);
    for (const u of placed) {
      if (u.helped) continue;
      const [low, high] = CURVE[u.chapter!][u.kind];
      expect(u.value, `${u.where} (chapitre ${u.chapter}) : ${u.skill} ${u.value}`).toBeGreaterThanOrEqual(low);
      expect(u.value, `${u.where} (chapitre ${u.chapter}) : ${u.skill} ${u.value}`).toBeLessThanOrEqual(high);
    }
  });
});

describe('Médecine at the Gare', () => {
  const blowUp = (medicine: number) => {
    const state = createNewGame(testCharacter({}, { medicine }));
    state.quests['dernier-train'] = 'active';
    choose(state, 'foreuse', 'au-pied', 'Ouvrir la chaudière');
    expect(state.flags['foreuse-explosee']).toBe(true);
    return state;
  };

  it('pulls Pell out of the fire, alive and without his hands; Ingrid, Ilyane and the lavandière know it', () => {
    const state = blowUp(3);
    choose(state, 'foreuse', 'chaudiere', 'Revenir dans le feu :');
    expect(state.flags['pell-sauve']).toBe(true);
    expect(startNode(DIALOGUES.foreuse, state)).toBe('explosee-pell');
    expect(startNode(DIALOGUES.ingrid, state)).toBe('apres-explosion-pell');
    expect(startNode(DIALOGUES.ilyane, state)).toBe('pell-vivant');
  });

  it('a Médecine roll: without it, little chance; failed, Pell dies in the hero’s hands (étude, D1)', () => {
    const state = blowUp(0);
    const save = visibleOptions(DIALOGUES.foreuse.nodes.chaudiere, state).find((v) => v.option.text.startsWith('Revenir dans le feu :'))!;
    expect(save.option.roll?.skill).toBe('medicine');
    expect(rollChance(state, save.option.roll!)).toBeLessThan(rollChance(blowUp(3), save.option.roll!));
    expect(DIALOGUES.foreuse.nodes[save.option.failNext!].effects ?? []).not.toContainEqual({ setFlag: 'pell-sauve' });
    expect(optionTexts(state, 'foreuse', 'chaudiere')).toHaveLength(3);
    choose(state, 'foreuse', 'chaudiere', 'Revenir dans le feu.');
    expect(state.flags['pell-sauve']).toBeUndefined();
    expect(startNode(DIALOGUES.ingrid, state)).toBe('apres-explosion');
    expect(startNode(DIALOGUES.ilyane, state)).toBe('pell');
  });
});
