import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap } from '../engine/tiledMap';
import { createNewGame } from '../state/gameState';
import { applyEffects, goesTo, startNode, visibleOptions } from './dialogue';
import { ownedCount, sell } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { reputationScore } from './reputation';

/** « Le chant d'Anselme » (docs/univers/quetes.md) : la branche en bas, la mélodie en haut, la flûte pour Aïlis. */
describe('Le chant d’Anselme', () => {
  it('can be reached on the Sol des Racines, away from the bear', () => {
    const sol = parseTiledMap(MAPS['sol-racines']);
    const start = findObject(sol, 'descente')!;
    const tree = findObject(sol, 'arbre-retour-anselme')!;
    const walk = (t: { col: number; row: number }) => isWalkable(sol, t);
    const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: tree.col + dc, row: tree.row + dr })));
    expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null)).toBe(true);
  });

  it('is offered by Elouan once Aïlis has spoken of Anselme', () => {
    const state = createNewGame(testCharacter());
    expect(startNode(DIALOGUES.elouan, state)).toBe('accueil');
    choose(state, 'ailis', 'accueil', 'Parler à un arbre');
    expect(state.flags['anselme-connu']).toBe(true);
    expect(startNode(DIALOGUES.elouan, state)).toBe('proposition');
    choose(state, 'elouan', 'proposition', 'J’irai chercher');
    expect(state.quests['chant-anselme']).toBe('active');
    expect(startNode(DIALOGUES.elouan, state)).toBe('attente');
  });

  it('plays the song from the Bosquet: Véline, the branch, Elouan, Aïlis', () => {
    const state = createNewGame(testCharacter({ memory: 3 }));
    choose(state, 'arbre-anselme', 'arbre', 'Poser la main');
    expect(startNode(DIALOGUES.elouan, state)).toBe('proposition');
    choose(state, 'elouan', 'proposition', 'J’irai chercher');

    expect(startNode(DIALOGUES.veline, state)).toBe('descente-anselme');
    expect(goesTo(choose(state, 'veline', 'descente-anselme', 'Allons-y').effects)).toEqual({ location: 'sol-racines', arrivee: 'descente' });
    expect(startNode(DIALOGUES['arbre-retour-anselme'], state)).toBe('arbre-quete');
    choose(state, 'arbre-retour-anselme', 'arbre-quete', 'Ramasser');
    expect(ownedCount(state.character!, 'branche-anselme')).toBe(1);
    expect(sell(state.character!, 'branche-anselme')).toBe('objet-de-quete');
    expect(startNode(DIALOGUES['arbre-retour-anselme'], state)).toBe('arbre');
    expect(startNode(DIALOGUES.veline, state)).not.toBe('descente-anselme');

    expect(startNode(DIALOGUES.elouan, state)).toBe('branche');
    expect(optionTexts(state, 'elouan', 'branche')).not.toContain('Mirelle m’a montré la chanson, dans le carnet d’Ilyane.');
    choose(state, 'elouan', 'branche', 'Je l’ai entendue');
    expect(ownedCount(state.character!, 'branche-anselme')).toBe(0);
    expect(ownedCount(state.character!, 'flute-anselme')).toBe(1);
    expect(startNode(DIALOGUES.elouan, state)).toBe('flute-prete');

    // The flute comes before the comfort scene of the Bosquet.
    expect(startNode(DIALOGUES.ailis, state)).toBe('flute');
    const before = reputationScore(state, 'canopee');
    const xp = state.character!.xp;
    choose(state, 'ailis', 'flute', 'Elouan l’a taillée');
    expect(DIALOGUES.ailis.nodes.flute.options.find((o) => o.next === 'chant-fidele')).toBeDefined();
    expect(state.quests['chant-anselme']).toBe('done');
    expect(state.character!.xp - xp).toBe(40);
    expect(ownedCount(state.character!, 'flute-anselme')).toBe(0);
    expect(knowsRecit(state.character!, 'chant-anselme')).toBe(true);
    expect(reputationScore(state, 'canopee')).toBe(before + 10);
    expect(startNode(DIALOGUES.ailis, state)).toBe('voix');
    state.flags['ailis-reconfortee'] = true;
    expect(startNode(DIALOGUES.ailis, state)).toBe('apres-chant');
    expect(startNode(DIALOGUES.elouan, state)).toBe('apres');
  });

  it('can do without Mémoire: Mirelle shows the song in Ilyane’s notebook', () => {
    const state = createNewGame(testCharacter({ memory: 1 }));
    choose(state, 'ailis', 'accueil', 'Parler à un arbre');
    choose(state, 'elouan', 'proposition', 'J’irai chercher');
    expect(startNode(DIALOGUES.mirelle, state)).toBe('chanson');
    choose(state, 'mirelle', 'chanson', 'Connais-tu');
    expect(state.flags['melodie-carnet']).toBe(true);
    expect(startNode(DIALOGUES.mirelle, state)).toBe('accueil');

    applyEffects(state, [{ giveItem: 'branche-anselme' }, { setFlag: 'branche-prise' }]);
    expect(optionTexts(state, 'elouan', 'branche')).not.toContain('Je l’ai entendue au Bosquet. Je peux te la fredonner.');
    choose(state, 'elouan', 'branche', 'Mirelle m’a montré');
    const xp = state.character!.xp;
    const shown = visibleOptions(DIALOGUES.ailis.nodes.flute, state);
    expect(shown.map((v) => v.option.next)).toEqual(['chant-carnet', 'fin']);
    choose(state, 'ailis', 'flute', 'Elouan l’a taillée');
    expect(state.character!.xp - xp).toBe(30);
    expect(state.quests['chant-anselme']).toBe('done');
  });

  it('rewards an Artisanat roll with the branch that already sings; failed, the branches stay mute', () => {
    const state = createNewGame(testCharacter({}, { crafting: 1 }));
    state.quests['chant-anselme'] = 'active';
    const knock = () => visibleOptions(DIALOGUES['arbre-retour-anselme'].nodes['arbre-quete'], state)[1];
    expect(knock().option.roll).toEqual({ skill: 'crafting', difficulty: 11 });
    expect(knock().option.failNext).toBe('branche-sourde');
    const xp = state.character!.xp;
    choose(state, 'arbre-retour-anselme', 'arbre-quete', 'Toquer');
    expect(state.character!.xp - xp).toBe(10);
    expect(ownedCount(state.character!, 'branche-anselme')).toBe(1);
  });
});
