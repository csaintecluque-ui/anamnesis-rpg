import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { parseTiledMap } from '../engine/tiledMap';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, startNode, visibleOptions } from './dialogue';
import { FRAGMENTS, dreamFragment, herosPage } from './heros';
import { choose, testCharacter } from './questTestKit';
import { HISTOIRES, HISTOIRE_ID, VOIE_DEPTH, voieLevel, voiePlan } from './voies';

/**
 * Le héros qui a oublié (piste A, vérité écrite par Cyril le 2026-11-03 ; étude, F1) et les Échos de l'histoire au fond
 * des voies (validés le 2026-11-03).
 */

const chapterDone = (state: GameState, n: number) => {
  for (const q of ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu'].slice(0, n)) state.quests[q] = 'done';
};

describe('the child at the window (chapter 1)', () => {
  it('turns to the hero alone, once, for whoever stays a moment in the Écho of the last train', () => {
    const state = createNewGame(testCharacter());
    expect(herosPage(state)).toBeNull();
    const views = visibleOptions(DIALOGUES['echo-dernier-train'].nodes.interieur, state);
    expect(views.map((v) => v.option.next)).toEqual(['enfant', 'fin']);
    choose(state, 'echo-dernier-train', 'interieur', 'Rester encore');
    expect(DIALOGUES['echo-dernier-train'].nodes.enfant.text).toContain('Tu es venu·e. Les autres n’ont pas entendu.');
    expect(state.flags['heros-enfant']).toBe(true);
    expect(visibleOptions(DIALOGUES['echo-dernier-train'].nodes.interieur, state)).toHaveLength(1);
    expect(herosPage(state)?.lignes[0].texte).toMatch(/Tu es venu·e/);
  });
});

describe('the fragments come back in the order of the return: the steam, the hand, the voice', () => {
  it('one a night at an inn, only once the story has reached its chapter', () => {
    const state = createNewGame(testCharacter());
    expect(dreamFragment(state)).toBeNull();
    chapterDone(state, 1);
    expect(dreamFragment(state)).toMatch(/vapeur/);
    expect(dreamFragment(state)).toBeNull();
    chapterDone(state, 3);
    expect(dreamFragment(state)).toMatch(/une main tient la tienne/);
    expect(dreamFragment(state)).toMatch(/compte jusqu’à sept/);
    expect(FRAGMENTS.every((f) => state.flags[f.flag])).toBe(true);
  });

  it('come with the sleep of an inn', () => {
    const state = createNewGame(testCharacter());
    chapterDone(state, 1);
    const notices = applyEffects(state, [{ dormir: 'matin' }]);
    expect(notices.at(-1)).toMatch(/^Cette nuit, tu rêves d’une odeur de vapeur/);
  });

  it('are written in that order on the page, whatever order they came back in; something still missing', () => {
    const state = createNewGame(testCharacter());
    state.flags['heros-fragment-voix'] = true;
    const page = herosPage(state)!;
    expect(page.titre).toBe('Ce qui n’est pas à moi');
    expect(page.lignes.map((l) => l.titre)).toEqual(['L’enfant à la fenêtre', 'La vapeur', 'La main', 'La voix qui compte']);
    expect(page.lignes.map((l) => !!l.texte)).toEqual([false, false, false, true]);
    expect(page.manque).toMatch(/Un quai/);
  });
});

describe('the Écho of the story at the end of each line', () => {
  const terminus = (site: string, flags: Record<string, true> = {}) => {
    const state = createNewGame(testCharacter());
    state.voie = { site, seed: 7, depth: VOIE_DEPTH };
    state.location = 'voie-endormie';
    Object.assign(state.flags, flags);
    return { state, level: voieLevel(state, parseTiledMap(MAPS[voiePlan(state.voie)])) };
  };

  it('stands at the terminus of the three lines, on no other level, until heard', () => {
    for (const site of Object.keys(HISTOIRES)) {
      const { level } = terminus(site);
      expect(level.objects.some((o) => o.name === HISTOIRE_ID), site).toBe(true);
      expect(level.dialogues[HISTOIRE_ID].nodes.scene.text).toBe(HISTOIRES[site].scene);
      expect(terminus(site, { [HISTOIRES[site].flag]: true }).level.objects.some((o) => o.name === HISTOIRE_ID)).toBe(false);
    }
    const state = createNewGame(testCharacter());
    state.voie = { site: 'tunnel-combe', seed: 7, depth: 1 };
    expect(voieLevel(state, parseTiledMap(MAPS[voiePlan(state.voie)])).objects.some((o) => o.name === HISTOIRE_ID)).toBe(false);
  });

  it('heard to the end, gives its flag, then the hero’s own detail: in the Combe, the steam', () => {
    const { state, level } = terminus('tunnel-combe');
    const d = level.dialogues[HISTOIRE_ID];
    applyEffects(state, d.nodes.suite.effects);
    applyEffects(state, d.nodes.detail.effects);
    expect(state.flags['echo-voie-tunnel-combe']).toBe(true);
    expect(state.flags['heros-fragment-vapeur']).toBe(true);
    expect(d.nodes.detail.text).toMatch(/vapeur/);
  });

  it('opens an answer: the Combe with the Veilleuse (the key), the halte and the Dépôt Sept with Ambroise (the Fonds Muet)', () => {
    const state = createNewGame(testCharacter());
    state.quests['cle-rouille-bleue'] = 'active';
    const texts = () => visibleOptions(DIALOGUES.veilleuse.nodes.trains, state).map((v) => v.option.text);
    expect(texts().some((t) => t.startsWith('Dans la Combe'))).toBe(false);
    state.flags['echo-voie-tunnel-combe'] = true;
    choose(state, 'veilleuse', 'trains', 'Dans la Combe');
    expect(DIALOGUES.veilleuse.nodes.combe.options[0].next).toBe('don');
    const ambroise = () => visibleOptions(DIALOGUES.ambroise.nodes['edda-demande'], state).map((v) => v.option.next);
    expect(ambroise()).not.toContain('fourgon');
    state.flags['echo-voie-halte-fougeres'] = true;
    state.flags['echo-voie-depot-sept'] = true;
    expect(ambroise()).toEqual(expect.arrayContaining(['fourgon', 'alta']));
    for (const node of ['fourgon', 'alta']) expect(DIALOGUES.ambroise.nodes[node].options[0].next).toBe('convaincu');
    expect(startNode(DIALOGUES.ambroise, createNewGame(testCharacter()))).toBe('accueil');
  });
});
