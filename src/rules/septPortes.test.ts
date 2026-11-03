import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import type { Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type MapObject } from '../engine/tiledMap';
import { LOCATIONS, createNewGame, findLocation, type GameState } from '../state/gameState';
import { applyEffects, goesTo, startNode, visibleOptions } from './dialogue';
import { journalQuests } from './journal';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { reputationScore } from './reputation';
import { momentOf, waitUntil } from './time';
import { rumeurFlag } from './veillees';
import { knownPlaces } from './world';

/** Sept-Portes et « Les Mémoires du Monde Perdu » (chapitre 4, docs/gdd/jalon-4.md, docs/univers/lieux/sept-portes.md). */
const Q = 'memoires-monde-perdu';
const SEPT_PORTES = LOCATIONS.filter((l) => l.id.startsWith('sept-portes'));

/** The hero arrives at Sept-Portes with the quest given by Ilyane (the Clé done). */
function arrive(skills = {}): GameState {
  const state = createNewGame(testCharacter({}, skills));
  state.quests['cle-rouille-bleue'] = 'done';
  applyEffects(state, DIALOGUES.ilyane.nodes[startNode(DIALOGUES.ilyane, state)].effects);
  choose(state, 'ilyane', 'appel-sept-portes', 'J’irai à Sept-Portes');
  state.location = 'sept-portes';
  return state;
}

/** Opens a conversation: its first node's effects apply, as in the game. */
function talk(state: GameState, id: string): string {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
}

/** Chooses an option; a `goTo` moves the hero, as DialogueScene does. */
function say(state: GameState, dialogue: string, node: string, text: string): void {
  const place = goesTo(choose(state, dialogue, node, text).effects);
  if (place) state.location = place.location;
}

/** Chooses an option whose roll fails: its effects are skipped, the failure node's apply. */
function fail(state: GameState, dialogue: string, node: string, text: string): string {
  const view = visibleOptions(DIALOGUES[dialogue].nodes[node], state).find((v) => v.option.text.startsWith(text))!;
  expect(view?.option.roll, `${dialogue}/${node}: pas de jet`).toBeDefined();
  const next = view.option.failNext!;
  applyEffects(state, DIALOGUES[dialogue].nodes[next].effects);
  return next;
}

/** Hesper, then the Conservateur's register: the page sleeps in the Fonds Muet, Edda Varn asked for it. */
function toRegister(state: GameState): void {
  expect(talk(state, 'hesper')).toBe('appel');
  expect(talk(state, 'ambroise')).toBe('registre');
  say(state, 'ambroise', 'registre', 'Une clé de rouille bleue');
  say(state, 'ambroise', 'chaine', 'Et personne d’autre');
  expect(state.flags['registre-lu']).toBe(true);
}

function readPage(state: GameState): void {
  state.location = 'sept-portes-fonds-muet';
  expect(talk(state, 'page-dernier-depart')).toBe('page');
}

/** A failed attempt ends in the car: the raccompagnement, back on foot two days later. */
function raccompagne(state: GameState, dialogue: string, failNode: string): void {
  const day = state.time.day;
  choose(state, dialogue, failNode, DIALOGUES[dialogue].nodes[failNode].options[0].text);
  expect(state.flags.raccompagne).toBe(true);
  say(state, dialogue, 'racc', 'Revenir à Sept-Portes, à pied');
  expect(state.location).toBe('sept-portes');
  expect(state.time.day).toBe(day + 2);
}

describe('Sept-Portes on the world map', () => {
  it('appears once Ilyane has read Hesper’s letter, in place of the distant Terminus', () => {
    const state = createNewGame(testCharacter());
    expect(knownPlaces(state.flags, state.quests).map((p) => p.id)).not.toContain('sept-portes');
    state.quests['cle-rouille-bleue'] = 'done';
    expect(startNode(DIALOGUES.ilyane, state)).toBe('appel-sept-portes');
    choose(state, 'ilyane', 'appel-sept-portes', 'J’irai à Sept-Portes');
    expect(state.quests[Q]).toBe('active');
    expect(knownPlaces(state.flags, state.quests).map((p) => p.id)).toContain('sept-portes');
    expect(startNode(DIALOGUES.ilyane, state)).not.toBe('appel-sept-portes');
  });
});

describe('Sept-Portes maps', () => {
  it('let one reach every NPC, object and door from the arrival', () => {
    for (const location of SEPT_PORTES) {
      const map = parseTiledMap(MAPS[location.map]);
      const start = findObject(map, location.entrance)!;
      expect(start, location.id).toBeDefined();
      const taken = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
      const walk = (t: Tile) => isWalkable(map, t, taken);
      for (const o of map.objects.filter((x: MapObject) => ['pnj', 'objet', 'porte', 'panneau'].includes(x.type))) {
        const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
        expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null), `${location.id}: ${o.name}`).toBe(true);
      }
    }
  });

  it('hold no fight: no beast, no ambush, no dialogue that starts a combat (l’Anneau)', () => {
    for (const location of SEPT_PORTES) {
      expect(location.nexus, location.id).toBe(true);
      const map = parseTiledMap(MAPS[location.map]);
      expect(map.objects.filter((o) => ['ennemi', 'apparition', 'piege'].includes(o.type)), location.id).toEqual([]);
      for (const o of map.objects.filter((x) => x.type === 'pnj' || x.type === 'objet' || x.properties.dialogue)) {
        const d = DIALOGUES[o.properties.dialogue ?? o.name];
        if (!d) continue;
        const effects = Object.values(d.nodes).flatMap((n) => [...(n.effects ?? []), ...n.options.flatMap((op) => op.effects ?? [])]);
        expect(effects.some((e) => 'startCombat' in e), `${location.id}: ${o.name}`).toBe(false);
      }
    }
  });

  it('keep the Conservateur at his desk by day, the night porter by night', () => {
    const map = parseTiledMap(MAPS[findLocation('sept-portes-bibliotheque')!.map]);
    expect(findObject(map, 'ambroise')!.properties.moment).toBe('jour');
    expect(findObject(map, 'portier-nuit')!.properties.moment).toBe('nuit');
    expect(findObject(map, 'porte-fonds-muet')!.properties.verrou).toBe('fonds-muet-ouvert');
  });
});

describe('« Les Mémoires du Monde Perdu »', () => {
  it('the word: Ambroise convinced by Diplomatie, Érudition or the Récit of Kael', () => {
    const state = arrive({ diplomacy: 0, lore: 0 });
    toRegister(state);
    say(state, 'ambroise', 'edda-demande', 'Et si c’est moi');
    const views = visibleOptions(DIALOGUES.ambroise.nodes.demande, state);
    expect(views.map((v) => v.enabled)).toEqual([false, false, true]);
    expect(views.map((v) => v.option.text)).toEqual([expect.stringMatching(/^« On ne cache rien/), expect.stringMatching(/^Une provenance/), 'Je reviendrai.']);
    state.character!.recits.push('kael-chroniqueur');
    expect(optionTexts(state, 'ambroise', 'demande')[0]).toMatch(/^Kael a bâti/);
    say(state, 'ambroise', 'demande', 'Kael a bâti');
    expect(state.flags['fonds-muet-ouvert']).toBe(true);
    expect(startNode(DIALOGUES.ambroise, state)).toBe('accueil');
    readPage(state);
    expect(knowsRecit(state.character, 'dernier-depart')).toBe(true);
    expect(DIALOGUES['page-dernier-depart'].nodes.page.text).toContain('Altavent');
    expect(talk(state, 'page-dernier-depart')).toBe('relue');
  });

  it('the ruse: a request under a Chronicler’s hand, Subterfuge 13; missed, the car', () => {
    const state = arrive();
    toRegister(state);
    expect(optionTexts(state, 'registre-consultations', 'registre')).toEqual([
      'Inscrire une demande au nom d’un Chroniqueur.',
      'Examiner la demande d’Edda Varn.',
      'Laisser le registre.',
    ]);
    expect(fail(state, 'registre-consultations', 'registre', 'Inscrire')).toBe('faux-rate');
    raccompagne(state, 'registre-consultations', 'faux-rate');
    // The way of the ruse closes; the word and the night stay open.
    expect(optionTexts(state, 'registre-consultations', 'registre')).not.toContain('Inscrire une demande au nom d’un Chroniqueur.');
    expect(reputationScore(state, 'sept-portes')).toBe(-10);
    const fresh = arrive();
    toRegister(fresh);
    say(fresh, 'registre-consultations', 'registre', 'Inscrire');
    expect([fresh.flags['fonds-muet-ouvert'], fresh.flags['faux-registre']]).toEqual([true, true]);
  });

  it('the night: Discrétion 14 past the porter, 10 with the rumour of the veillée; missed, the car', () => {
    const state = arrive();
    toRegister(state);
    state.time = { day: 1, phase: 1 };
    expect(optionTexts(state, 'porte-fonds-muet', 'fermee')).toEqual(['Partir.']);
    waitUntil(state.time, 'nuit');
    expect(optionTexts(state, 'porte-fonds-muet', 'fermee')).toEqual(['Passer quand le portier tourne le dos.', 'Partir.']);
    state.flags[rumeurFlag('portier-nuit')] = true;
    const rumour = visibleOptions(DIALOGUES['porte-fonds-muet'].nodes.fermee, state).find((v) => v.option.text.startsWith('Attendre'))!;
    expect(rumour.option.roll).toEqual({ skill: 'stealth', difficulty: 10 });
    expect(fail(state, 'porte-fonds-muet', 'fermee', 'Attendre')).toBe('surpris');
    raccompagne(state, 'porte-fonds-muet', 'surpris');
    waitUntil(state.time, 'nuit');
    expect(optionTexts(state, 'porte-fonds-muet', 'fermee')).toEqual(['Partir.']);
    const fresh = arrive();
    toRegister(fresh);
    waitUntil(fresh.time, 'nuit');
    say(fresh, 'porte-fonds-muet', 'fermee', 'Passer');
    say(fresh, 'porte-fonds-muet', 'passe', 'Entrer');
    expect([fresh.location, momentOf(fresh.time)]).toEqual(['sept-portes-fonds-muet', 'nuit']);
  });

  it('the grey lady sold the line: 200 Fers, Liane and Boulon think less of it', () => {
    const state = arrive();
    toRegister(state);
    say(state, 'ambroise', 'edda-demande', 'Et si c’est moi');
    say(state, 'ambroise', 'demande', 'Une provenance');
    readPage(state);
    expect(journalQuests(state).find((q) => q.id === Q)?.step).toMatch(/dame en gris/);
    expect(talk(state, 'edda')).toBe('offre');
    const fers = state.character!.fers;
    say(state, 'edda', 'offre', 'La lui vendre');
    expect(state.character!.fers).toBe(fers + 200);
    expect(talk(state, 'hesper')).toBe('fin-vendue');
    expect(state.quests[Q]).toBe('done');
    expect(reputationScore(state, 'sept-portes')).toBe(15);
  });

  it('the grey lady denounced: her hand is false (Investigation 13 or the rumour); she leaves in the car', () => {
    const state = arrive();
    toRegister(state);
    say(state, 'ambroise', 'edda-demande', 'Et si c’est moi');
    say(state, 'ambroise', 'demande', 'Une provenance');
    readPage(state);
    expect(fail(state, 'registre-consultations', 'registre', 'Examiner')).toBe('rien');
    expect(startNode(DIALOGUES.ambroise, state)).toBe('accueil');
    state.flags[rumeurFlag('main-grise')] = true;
    say(state, 'registre-consultations', 'registre', 'Chercher, plus haut');
    expect(state.flags['main-edda-fausse']).toBe(true);
    expect(talk(state, 'ambroise')).toBe('denonce');
    say(state, 'ambroise', 'denonce', 'Edda Varn est morte');
    expect([state.flags['edda-raccompagnee'], state.flags.raccompagne]).toEqual([true, undefined]);
    expect(startNode(DIALOGUES.greffiere, state)).toBe('liste-edda');
    expect(talk(state, 'hesper')).toBe('fin-denonce');
    expect(reputationScore(state, 'sept-portes')).toBe(25);
  });

  it('the forger denouncing a forger: Ambroise sees the hero’s false request too; both in the car', () => {
    const state = arrive();
    toRegister(state);
    say(state, 'registre-consultations', 'registre', 'Inscrire');
    readPage(state);
    say(state, 'registre-consultations', 'registre', 'Examiner');
    expect(talk(state, 'ambroise')).toBe('denonce');
    expect(optionTexts(state, 'ambroise', 'denonce')).toHaveLength(2);
    say(state, 'ambroise', 'denonce', 'Edda Varn est morte');
    expect(state.flags['edda-raccompagnee']).toBe(true);
    raccompagne(state, 'ambroise', 'denonce-faux');
    expect(talk(state, 'hesper')).toBe('fin-denonce');
    expect(reputationScore(state, 'sept-portes')).toBe(15);
  });

  it('silence: the hero leaves first; she will follow', () => {
    const state = arrive();
    toRegister(state);
    say(state, 'ambroise', 'edda-demande', 'Et si c’est moi');
    say(state, 'ambroise', 'demande', 'Une provenance');
    readPage(state);
    say(state, 'edda', 'offre', 'Non');
    expect([state.flags['edda-suit'], state.flags['edda-partie']]).toEqual([true, true]);
    expect(talk(state, 'hesper')).toBe('fin-silence');
    expect([state.quests[Q], state.flags['piste-zephyria']]).toEqual(['done', true]);
    expect(talk(state, 'hesper')).toBe('apres');
  });
});
