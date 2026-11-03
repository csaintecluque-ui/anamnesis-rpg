import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { ENCOUNTERS } from './combat';
import { applyEffects, goesTo, startNode, startsCombat, visibleOptions } from './dialogue';
import { ownedCount } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { reputationScore } from './reputation';

/** « L'audience », chapitre 2 de l'histoire principale (docs/univers/quetes.md). */
const amphi = parseTiledMap(MAPS['canopee-amphitheatre']);

function reachable(mapId: string, from: string, names: string[]): Record<string, boolean> {
  const map = parseTiledMap(MAPS[mapId]);
  const start = findObject(map, from)!;
  const blocked = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
  const walk = (t: { col: number; row: number }) => isWalkable(map, t, blocked);
  const near = (o: MapObject) =>
    [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr }))).some((t) => walk(t) && findPath(start, t, walk) !== null);
  return Object.fromEntries(names.map((n) => [n, near(findObject(map, n)!)]));
}

/** After « Le Dernier Train »: the news to carry. */
function afterGardebois(state: GameState = createNewGame(testCharacter())): GameState {
  state.quests['dernier-train'] = 'done';
  return state;
}

describe('l’amphithéâtre du Conseil', () => {
  it('seats the Triumvirat within reach of the door, and leads back to the antechamber', () => {
    expect(findLocation('canopee-amphitheatre')?.map).toBe('canopee-amphitheatre');
    expect(reachable('canopee-amphitheatre', 'entree', ['kael-marchevent', 'lyra', 'thalorin', 'sortie'])).toEqual({
      'kael-marchevent': true,
      lyra: true,
      thalorin: true,
      sortie: true,
    });
    const exit = findObject(amphi, 'sortie')!;
    expect(exit.properties).toMatchObject({ cible: 'canopee-conseil', arrivee: 'depuis-amphitheatre' });
    expect(findObject(parseTiledMap(MAPS['canopee-conseil']), 'depuis-amphitheatre')).toBeDefined();
  });

  it('puts the digger on the Sol des Racines only during the inquiry', () => {
    const sol = parseTiledMap(MAPS['sol-racines']);
    expect(findObject(sol, 'garrik')?.properties).toMatchObject({ apparaitSi: 'audience-tenue', disparaitSi: 'fouille-elucidee' });
    expect(reachable('sol-racines', 'descente', ['garrik'])).toEqual({ garrik: true });
    const fight = ENCOUNTERS.find((e) => e.id === 'fouilleur-sol')!;
    expect(fight.enemies).toEqual([{ id: 'fouilleur', object: 'garrik' }]);
    expect(fight.victoryEffects).toContainEqual({ setFlag: 'fouille-elucidee' });
  });
});

describe('L’audience', () => {
  it('starts with Ilyane’s letter, which opens the Council’s door', () => {
    const state = afterGardebois();
    expect(optionTexts(state, 'ilyane', 'resolu')).toContain('Et maintenant ?');
    choose(state, 'ilyane', 'resolu', 'Et maintenant');
    expect(state.quests.audience).toBe('active');
    expect(ownedCount(state.character!, 'lettre-ilyane')).toBe(1);
    expect(startNode(DIALOGUES.huissier, state)).toBe('lettre');
    const enter = choose(state, 'huissier', 'lettre', 'Entrer');
    expect(goesTo(enter.effects)).toEqual({ location: 'canopee-amphitheatre', arrivee: 'entree' });
  });

  it('opens without the letter for a known name, a Diplomatie roll (failed: try again tomorrow), or a lie that may cost', () => {
    const state = afterGardebois(createNewGame(testCharacter({}, { diplomacy: 2 })));
    expect(startNode(DIALOGUES.huissier, state)).toBe('nouvelles');
    const views = visibleOptions(DIALOGUES.huissier.nodes.nouvelles, state);
    expect(views[0].enabled).toBe(false);
    expect(views[1].option.roll).toEqual({ skill: 'diplomacy', difficulty: 13 });
    expect(DIALOGUES.huissier.nodes[views[1].option.failNext!].effects).toContainEqual({ setFlagFor: 'huissier-liste', days: 1 });
    expect(views[2].option.roll).toEqual({ skill: 'subterfuge', difficulty: 13 });
    expect(views[2].option.failNext).toBe('menteur');
    const before = reputationScore(state, 'canopee');
    applyEffects(state, DIALOGUES.huissier.nodes.menteur.effects);
    expect(reputationScore(state, 'canopee')).toBe(before - 5);
    state.character!.skills.diplomacy = 3;
    choose(state, 'huissier', 'nouvelles', 'Le Conseil parle');
    expect(state.quests.audience).toBe('active');
    expect(startNode(DIALOGUES.huissier, state)).toBe('retour');
  });

  it('is closed to whoever has not been to the Gare Engloutie', () => {
    expect(startNode(DIALOGUES.huissier, createNewGame(testCharacter()))).toBe('accueil');
  });

  it('runs the whole chapter: audience, the silent Bosquet, the digger, the report, Ironheart', () => {
    const state = afterGardebois(createNewGame(testCharacter({ memory: 3 })));
    choose(state, 'ilyane', 'resolu', 'Et maintenant');
    state.quests['chant-anselme'] = 'done';

    expect(startNode(DIALOGUES['kael-marchevent'], state)).toBe('audience');
    choose(state, 'kael-marchevent', 'audience', 'Ilyane');
    expect(ownedCount(state.character!, 'lettre-ilyane')).toBe(0);
    choose(state, 'kael-marchevent', 'lettre', 'Une foreuse');
    choose(state, 'kael-marchevent', 'recit-gare', 'Les papiers');
    choose(state, 'kael-marchevent', 'lyra', 'Et ce mal');
    choose(state, 'kael-marchevent', 'thalorin', 'Je peux chercher');
    expect(state.flags['audience-tenue']).toBe(true);
    expect(startNode(DIALOGUES['kael-marchevent'], state)).toBe('attente');
    expect(startNode(DIALOGUES.thalorin, state)).toBe('enquete');

    // The Bosquet is silent, even Anselme; Aïlis still has the flute.
    expect(startNode(DIALOGUES['arbre-ancien'], state)).toBe('silence');
    expect(startNode(DIALOGUES['arbre-anselme'], state)).toBe('muet');
    expect(startNode(DIALOGUES.ailis, state)).toBe('inquiete');
    expect(optionTexts(state, 'ailis', 'inquiete')).toContain('Vous avez encore sa chanson.');
    choose(state, 'arbre-ancien', 'silence', 'Écouter plus profond');
    expect(state.flags['piste-racines']).toBe(true);
    expect(optionTexts(state, 'arbre-ancien', 'silence')).toEqual(['Partir.']);

    expect(startNode(DIALOGUES.veline, state)).toBe('descente-conseil');
    expect(goesTo(choose(state, 'veline', 'descente-conseil', 'Descends').effects)?.location).toBe('sol-racines');

    // The digger: talked round with Diplomatie 3.
    state.character!.skills.diplomacy = 3;
    choose(state, 'garrik', 'rencontre', 'Ce sol est sacré');
    choose(state, 'garrik', 'defensif', 'Là-haut');
    choose(state, 'garrik', 'convaincu', 'Je t’écoute');
    expect(state.flags['cle-mentionnee']).toBe(true);
    choose(state, 'garrik', 'aveu', 'Pars');
    expect(state.flags['fouille-elucidee']).toBe(true);
    expect(startNode(DIALOGUES['arbre-ancien'], state)).toBe('arbre');
    expect(startNode(DIALOGUES.veline, state)).not.toBe('descente-conseil');

    expect(startNode(DIALOGUES['kael-marchevent'], state)).toBe('rapport');
    choose(state, 'kael-marchevent', 'rapport', 'Des fouilleurs');
    choose(state, 'kael-marchevent', 'rapport-suite', 'Ils cherchent');
    choose(state, 'kael-marchevent', 'cle', 'Que va faire');
    expect(visibleOptions(DIALOGUES['kael-marchevent'].nodes.choix, state)[2].enabled).toBe(true);
    const before = reputationScore(state, 'canopee');
    choose(state, 'kael-marchevent', 'choix', 'Le sol est sacré');
    expect(state.flags['conseil-accord']).toBe(true);
    choose(state, 'kael-marchevent', 'fin-accord', 'Et moi');
    expect(state.quests.audience).toBe('done');
    expect(ownedCount(state.character!, 'sauf-conduit')).toBe(1);
    expect(knowsRecit(state.character!, 'triumvirat-vert')).toBe(true);
    expect(reputationScore(state, 'canopee')).toBe(before + 15);
    for (const npc of ['kael-marchevent', 'lyra', 'thalorin', 'huissier']) expect(startNode(DIALOGUES[npc], state)).toBe('apres');
    // Ilyane oublie (feuille de route, chantier 4) : d'abord le nom de Mirelle, puis les nouvelles.
    expect(startNode(DIALOGUES.ilyane, state)).toBe('oubli-2');
    state.flags['ilyane-oubli-2'] = true;
    expect(startNode(DIALOGUES.ilyane, state)).toBe('nouvelles-canopee');
  });

  it('offers four ways past the digger: talk, command, a lie, or a fight', () => {
    const state = createNewGame(testCharacter());
    const opts = DIALOGUES.garrik.nodes.rencontre.options;
    // Commandement, a roll (étude, D1): failed, Garrik raises his pick, and one fights or steps back.
    expect(opts[1].roll).toEqual({ skill: 'command', difficulty: 11 });
    expect(DIALOGUES.garrik.nodes[opts[1].failNext!].options.map((o) => startsCombat(o.effects))).toEqual(['fouilleur-sol', null]);
    expect(opts[2].roll).toEqual({ skill: 'subterfuge', difficulty: 12 });
    expect(startsCombat(DIALOGUES.garrik.nodes.defensif.options[1].effects)).toBe('fouilleur-sol');
    expect(startsCombat(DIALOGUES.garrik.nodes.demasque.options[1].effects)).toBe('fouilleur-sol');
    // A lie that fails still leaves a way out: talk, fight, or step back (the fight is never forced).
    expect(visibleOptions(DIALOGUES.garrik.nodes.demasque, state).map((v) => v.option.text)).toHaveLength(3);
    expect(DIALOGUES.garrik.nodes.demasque.options.some((o) => o.next === 'fin' && !o.effects)).toBe(true);
  });
});
