import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, LOCATIONS, type GameState } from '../state/gameState';
import { FROID_PV, froid, MANTEAU } from './glace';
import { addItem, merchantCatalogue } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { startNode } from './dialogue';
import { DIALOGUES } from '../data/dialogues';
import { crossingOf, findPlace, FIRST_TRAIN_FLAG, flightFare, flightSky, flightTimeLabel, knownPlaces, payFlight, trainStation, WORLD } from './world';

/** Khrysos, chapitre 8 (docs/gdd/chapitre-8.md) : le train du Nord, la cité sous la glace, le froid de la surface. */

const CHAPTERS = ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu', 'noms-qui-montent', 'mer-rend', 'plus-lieu'];
const game = (): GameState => {
  const state = createNewGame(testCharacter());
  for (const q of CHAPTERS) state.quests[q] = 'done';
  return state;
};

/** Every person, sign, door, exit and object of a map, reachable on foot from one of its objects. */
function unreachable(map: GameMap, from: string): string[] {
  const start = findObject(map, from)!;
  const blocked = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
  const walk = (t: { col: number; row: number }) => isWalkable(map, t, blocked);
  const near = (o: MapObject) =>
    [{ col: o.col, row: o.row }, ...[-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })))].some(
      (t) => walk(t) && findPath(start, t, walk) !== null,
    );
  return map.objects.filter((o) => ['pnj', 'panneau', 'porte', 'sortie', 'objet'].includes(o.type) && !near(o)).map((o) => o.name);
}

describe('la cité sous la glace', () => {
  const khrysos = LOCATIONS.filter((l) => l.place === 'khrysos');

  it('a ses quartiers, ses intérieurs, et la surface', () => {
    expect(khrysos.map((l) => l.id)).toEqual(
      expect.arrayContaining(['khrysos-portes', 'khrysos-galeries', 'khrysos-royal', 'khrysos-douze', 'khrysos-cryptes', 'khrysos-voie-sept', 'khrysos-surface', 'khrysos-foyer', 'khrysos-bibliotheque', 'khrysos-caveau']),
    );
    expect(findPlace('khrysos')!.auberge).toBe('khrysos-foyer');
  });

  it('laisse atteindre chaque personne, porte, sortie et objet', () => {
    for (const l of khrysos) expect(unreachable(parseTiledMap(MAPS[l.map]), 'entree'), l.id).toEqual([]);
  });

  it('envoie chaque sortie et chaque porte vers un lieu qui existe, et chaque Puits vers une arrivée', () => {
    for (const l of khrysos) {
      const map = parseTiledMap(MAPS[l.map]);
      for (const o of map.objects.filter((x) => x.type === 'sortie' || x.type === 'porte')) {
        const target = findLocation(o.properties.cible);
        expect(target, `${l.id} : ${o.name}`).toBeDefined();
        expect(findObject(parseTiledMap(MAPS[target!.map]), o.properties.arrivee ?? target!.entrance), `${l.id} : ${o.name}`).toBeDefined();
      }
    }
    for (const node of Object.values(DIALOGUES['puits-ascension'].nodes)) {
      for (const o of node.options) {
        const go = o.effects?.find((e) => 'goTo' in e);
        if (!go || !('goTo' in go)) continue;
        expect(findObject(parseTiledMap(MAPS[findLocation(go.goTo)!.map]), go.arrivee!), go.goTo).toBeDefined();
      }
    }
  });

  it('le Puits d’Ascension mène de chaque niveau aux trois autres', () => {
    const state = game();
    for (const level of ['khrysos-portes', 'khrysos-galeries', 'khrysos-royal', 'khrysos-douze']) {
      state.location = level;
      const node = startNode(DIALOGUES['puits-ascension'], state);
      const targets = DIALOGUES['puits-ascension'].nodes[node].options.flatMap((o) => o.effects?.flatMap((e) => ('goTo' in e ? [e.goTo] : [])) ?? []);
      expect(targets.sort(), level).toEqual(['khrysos-douze', 'khrysos-galeries', 'khrysos-portes', 'khrysos-royal'].filter((x) => x !== level).sort());
    }
  });

  it('ferme les cryptes et le Caveau derrière un verrou qui a sa scène', () => {
    const doors = [
      ['khrysos-douze', 'grille-cryptes'],
      ['khrysos-douze', 'porte-khrysos-caveau'],
    ];
    for (const [map, name] of doors) {
      const door = findObject(parseTiledMap(MAPS[map]), name)!;
      expect(door.properties.verrou, name).toBeTruthy();
      expect(DIALOGUES[door.properties.dialogue], name).toBeDefined();
    }
  });
});

describe('le froid de la surface', () => {
  it('coûte des PV à qui n’a pas de manteau, jamais le dernier ; le manteau de Brodd le tient dehors', () => {
    const state = game();
    const c = state.character!;
    const before = c.hp;
    expect(froid(c)).toBe(FROID_PV);
    expect(c.hp).toBe(before - FROID_PV);
    c.hp = 3;
    expect(froid(c)).toBe(2);
    expect(froid(c)).toBe(0);
    expect(c.hp).toBe(1);
    addItem(c, MANTEAU);
    expect(froid(c)).toBeNull();
    expect(findLocation('khrysos-surface')!.froid).toBe(true);
    expect(findLocation('khrysos-portes')!.froid).toBeFalsy();
    expect(merchantCatalogue('brodd').map((i) => i.id)).toContain(MANTEAU);
  });
});

describe('le train du Nord', () => {
  it('apparaît sur la carte du monde après Marche-Mère, au nord', () => {
    const state = createNewGame(testCharacter());
    for (const q of CHAPTERS.slice(0, 6)) state.quests[q] = 'done';
    expect(knownPlaces(state.flags, state.quests).map((p) => p.id)).not.toContain('khrysos');
    state.quests['plus-lieu'] = 'done';
    expect(knownPlaces(state.flags, state.quests).map((p) => p.id)).toContain('khrysos');
    const khrysos = findPlace('khrysos')!;
    expect(khrysos.y).toBeLessThan(findPlace('ironheart')!.y);
    expect(WORLD.rails).toContainEqual({ from: 'ironheart', to: 'khrysos', name: 'Ligne du Nord' });
  });

  it('ne part que d’Ironheart : ailleurs, on y va d’abord ; le premier billet payé par Hesper, puis 45 Fers', () => {
    const state = game();
    const khrysos = findPlace('khrysos')!;
    expect(crossingOf(khrysos)?.moyen).toBe('train');
    expect(flightSky(state, findPlace('sept-portes')!, khrysos)).toBeUndefined();
    expect(trainStation(findPlace('sept-portes')!, khrysos)?.id).toBe('ironheart');
    expect(flightSky(state, findPlace('ironheart')!, khrysos)).toBe(khrysos);
    expect(trainStation(findPlace('ironheart')!, khrysos)).toBeUndefined();
    expect(flightTimeLabel(khrysos)).toBe('un jour en train');
    expect(flightFare(state, khrysos)).toBe(0);
    expect(payFlight(state, khrysos)).toBe(true);
    expect(state.flags[FIRST_TRAIN_FLAG]).toBe(true);
    expect(flightFare(state, khrysos)).toBe(45);
    state.flags['rail-travailleurs'] = true;
    expect(flightFare(state, khrysos)).toBe(22);
    // Le dirigeable d'Aetherhaven ne passe pas par Khrysos.
    expect(flightSky(state, khrysos, findPlace('gardebois')!)).toBeUndefined();
  });

  it('au guichet d’Ironheart : fermé avant Marche-Mère ; le billet de Hesper, puis le prix', () => {
    const early = createNewGame(testCharacter());
    expect(startNode(DIALOGUES['guichet-nord'], early)).toBe('ferme');
    const state = game();
    expect(startNode(DIALOGUES['guichet-nord'], state)).toBe('guichet');
    expect(optionTexts(state, 'guichet-nord', 'guichet')).toEqual(['Le billet que Hesper a payé.', 'Pas aujourd’hui.']);
    choose(state, 'guichet-nord', 'guichet', 'Le billet que Hesper');
    expect(state.flags[FIRST_TRAIN_FLAG]).toBe(true);
    expect(optionTexts(state, 'guichet-nord', 'guichet')).toEqual(['Prendre un billet.', 'Pas aujourd’hui.']);
    const train = DIALOGUES['guichet-nord'].nodes.train.options[0].effects!;
    expect(train).toContainEqual({ goTo: 'khrysos-portes', arrivee: 'entree' });
    // Et le retour, au quai des Portes de Glace.
    expect(DIALOGUES['quai-nord'].nodes.retour.options[0].effects).toContainEqual({ goTo: 'ironheart-forges', arrivee: 'entree' });
    expect(findObject(parseTiledMap(MAPS['ironheart-forges']), 'guichet-nord')).toBeDefined();
  });
});

describe('la règle des cryptes (on ne descend plus seul, 2857)', () => {
  const atGrille = () => {
    const state = game();
    state.location = 'khrysos-douze';
    return state;
  };

  it('ouvre la grille pour la journée à qui vient avec un compagnon de route', () => {
    const state = atGrille();
    expect(optionTexts(state, 'grille-cryptes', 'ferme')).toEqual(['S’éloigner.']);
    state.groupe.push({ id: 'liane' } as GameState['groupe'][number]);
    choose(state, 'grille-cryptes', 'ferme', 'Liane descendra');
    expect(state.flags['cryptes-ouvertes']).toBe(true);
    expect(state.expirations?.['cryptes-ouvertes']).toBe(state.time.day);
  });

  it('seul·e, seulement de nuit, contre la règle : la ville le saura', () => {
    const state = atGrille();
    state.time.phase = 3;
    expect(optionTexts(state, 'grille-cryptes', 'ferme')).toContain('Passer seul·e, cette nuit, quand le gardien dort.');
    const option = DIALOGUES['grille-cryptes'].nodes.ferme.options.find((o) => o.text.startsWith('Passer seul'))!;
    expect(option.roll).toEqual({ skill: 'stealth', difficulty: 17 });
    expect(DIALOGUES['grille-cryptes'].nodes.seul.effects).toContainEqual({ setFlag: 'descendu-seul' });
    expect(DIALOGUES['grille-cryptes'].nodes[option.failNext!].effects).toContainEqual({ setFlagFor: 'grille-surprise', days: 1 });
  });

  it('★ le Caveau des cristaux scellés : crocheter, bluffer le gardien, ou lui prendre la clé', () => {
    const state = atGrille();
    expect(optionTexts(state, 'porte-caveau', 'ferme')).toHaveLength(4);
    for (const node of ['ouvert', 'bluff', 'cle']) expect(DIALOGUES['porte-caveau'].nodes[node].effects, node).toContainEqual({ setFlag: 'caveau-ouvert' });
  });
});
