import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { LIANE_RESTED_CARE, findCompanion, joinParty, makeCompanionCombatant } from './companions';
import { applyEffects, nodeApartes, startNode } from './dialogue';
import { choose, optionTexts, testCharacter } from './questTestKit';

/** Les compagnons présents, l'ennemi incarné (feuille de route, chantier 4 ; docs/gdd/compagnons.md, « Chantier 4 »). */

const game = (): GameState => createNewGame(testCharacter());
/** Opens a dialogue as the screen does: its first node, and that node's effects. */
const talk = (state: GameState, id: string): string => {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
};

/** The dialogues of each main quest, where the companions who can be there speak up. */
const MAIN_SCENES: Record<string, { dialogues: string[]; companions: string[] }> = {
  'dernier-train': { dialogues: ['ingrid', 'foreuse', 'ilyane'], companions: ['liane'] },
  audience: { dialogues: ['garrik', 'arbre-ancien', 'kael-marchevent'], companions: ['liane'] },
  'cle-rouille-bleue': { dialogues: ['veilleuse', 'kaelis'], companions: ['liane', 'boulon'] },
  'memoires-monde-perdu': { dialogues: ['hesper', 'ambroise', 'page-dernier-depart', 'edda'], companions: ['liane', 'boulon'] },
};

const asidesOf = (who: string, dialogues: string[]) =>
  dialogues.flatMap((id) => Object.values(DIALOGUES[id].nodes).filter((n) => n.apartes?.[who]).map((n) => n.apartes![who]));

describe('the companions in the key scenes', () => {
  it('react in every main quest they can be part of (Liane from the first, Boulon from Ironheart)', () => {
    for (const [quest, { dialogues, companions }] of Object.entries(MAIN_SCENES)) {
      for (const who of companions) expect(asidesOf(who, dialogues).length, `${who} dans ${quest}`).toBeGreaterThan(0);
    }
  });

  it('speak up about ten times each, in all the dialogues', () => {
    const all = Object.keys(DIALOGUES);
    expect(asidesOf('liane', all).length).toBeGreaterThanOrEqual(10);
    expect(asidesOf('boulon', all).length).toBeGreaterThanOrEqual(10);
  });

  it('only when they travel with the hero', () => {
    const state = game();
    const node = DIALOGUES.kaelis.nodes.offre;
    expect(nodeApartes(node, state)).toEqual([]);
    joinParty(state, 'boulon');
    expect(nodeApartes(node, state)).toEqual([node.apartes!.boulon]);
    joinParty(state, 'liane');
    expect(nodeApartes(node, state)).toHaveLength(2);
  });

  it('Liane faces Ingrid: Saule, under the spoil of the first survey', () => {
    const state = game();
    expect(optionTexts(state, 'ingrid', 'accueil')).not.toContain('Laisser parler Liane.');
    joinParty(state, 'liane');
    choose(state, 'ingrid', 'accueil', 'Laisser parler Liane');
    expect(state.flags['ingrid-sait-saule']).toBe(true);
    choose(state, 'ingrid', 'saule', 'Laisser le silence parler');
    expect(state.avis.liane).toBe(1);
  });

  it('Liane and Boulon talk between them, one exchange at a time; the last one knows whether she forgot Saule', () => {
    const state = game();
    joinParty(state, 'liane');
    joinParty(state, 'boulon');
    for (const step of ['duo-1', 'duo-2']) {
      expect(startNode(DIALOGUES['compagnon-boulon'], state)).toBe(step);
      state.flags[step] = true;
    }
    expect(startNode(DIALOGUES['compagnon-boulon'], state)).toBe('duo-3');
    state.flags['liane-a-oublie'] = true;
    expect(startNode(DIALOGUES['compagnon-boulon'], state)).toBe('duo-3-oublie');
  });
});

describe('Liane’s choice (« Ce que Liane veut oublier »)', () => {
  it('two true ends: forgetting steadies her care, remembering keeps Saule’s Récit; the same esteem either way', () => {
    const forget = DIALOGUES['compagnon-liane'].nodes.manger.options[0].effects!;
    const carve = DIALOGUES['arbre-vierge'].nodes.graver.effects!;
    const avis = (effects: typeof forget) => effects.find((e) => 'avis' in e && e.avis === 'liane');
    expect(avis(forget)).toEqual(avis(carve));
    expect(carve).toContainEqual({ learnRecit: 'saule' });
    const liane = findCompanion('liane')!;
    expect(makeCompanionCombatant(liane, 24, { col: 0, row: 0 }).heal?.amount).toEqual(liane.soin!.amount);
    expect(makeCompanionCombatant(liane, 24, { col: 0, row: 0 }, { 'liane-a-oublie': true }).heal?.amount).toEqual(LIANE_RESTED_CARE);
    // A voice for forgetting, not only against it.
    expect(optionTexts(game(), 'compagnon-liane', 'aveu')).toContain('Tu as le droit de ne plus le revoir mourir.');
  });
});

describe('the enemy has a face before Sept-Portes: the dame en gris', () => {
  it('Ingrid’s papers (chapter 1), Garrik (chapter 2), Kaelis (chapter 3) speak of her', () => {
    expect(DIALOGUES.ingrid.nodes.papiers.text).toMatch(/dame en gris/);
    expect(DIALOGUES.garrik.nodes.gris.text).toMatch(/dame en gris/);
    expect(DIALOGUES.kaelis.nodes.acheteuse.text).toMatch(/dame en gris/);
  });
});

describe('chapter 4 opens on the fate of the key', () => {
  it('Hesper’s letter says where the key went: the Veilleuse, the Archives, or the Marches', () => {
    for (const [flag, node] of [['cle-veilleuse', 'appel-veilleuse'], ['cle-archives', 'appel-archives'], ['cle-vendue', 'appel-vendue']]) {
      const state = game();
      state.quests['cle-rouille-bleue'] = 'done';
      state.flags[flag] = true;
      expect(startNode(DIALOGUES.ilyane, state)).toBe(node);
      choose(state, 'ilyane', node, 'J’irai à Sept-Portes');
      expect(state.quests['memoires-monde-perdu']).toBe('active');
    }
  });
});

describe('Ilyane forgets (décision de Cyril, 2026-11-03)', () => {
  it('a song, then Mirelle’s name, then, for a moment, the hero', () => {
    const state = game();
    state.quests['dernier-train'] = 'done';
    state.quests.audience = 'active';
    expect(talk(state, 'ilyane')).toBe('oubli-1');
    expect(talk(state, 'ilyane')).toBe('resolu');
    state.quests.audience = 'done';
    expect(talk(state, 'ilyane')).toBe('oubli-2');
    choose(state, 'ilyane', 'oubli-2', 'Mirelle');
    state.flags['porte-sud-connue'] = true;
    expect(talk(state, 'ilyane')).toBe('oubli-3');
    expect(talk(state, 'ilyane')).toBe('nouvelles-canopee');
  });
});
