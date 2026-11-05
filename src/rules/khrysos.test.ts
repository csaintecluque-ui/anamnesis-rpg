import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, LOCATIONS, type GameState } from '../state/gameState';
import { FROID_PV, froid, MANTEAU } from './glace';
import { addItem, merchantCatalogue, ownedCount } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { applyEffects, startNode } from './dialogue';
import { echoObjects } from './echos';
import { filPage } from './fil';
import { dreamFragment, FRAGMENTS } from './heros';
import { reputationScore } from './reputation';
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

// --- « Ce que la glace a pris » -------------------------------------------------------------------------------------

const talk = (state: GameState, id: string) => {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
};
/** A roll that fails: the node it falls to, and that node's effects. */
const fail = (state: GameState, dialogue: string, node: string, text: string) => {
  const option = DIALOGUES[dialogue].nodes[node].options.find((o) => o.text.startsWith(text))!;
  applyEffects(state, DIALOGUES[dialogue].nodes[option.failNext!].effects);
  return option.failNext;
};
const caisse = (state: GameState) => filPage(state).caisses.find((c) => c.continent === 'Glacialis')?.etat;
/** The lacune read at the Bibliothèque, the formula said. */
const lacune = (): GameState => {
  const state = game();
  talk(state, 'ulga');
  choose(state, 'hrolda', 'accueil', 'Et ne juge pas');
  choose(state, 'hrolda', 'parle', 'Je cherche une lacune');
  choose(state, 'hrolda', 'registre', 'Qu’est-ce qui manque');
  return state;
};
/** On the quay of the voie sept, gone down with the dame en gris. */
const onQuay = (): GameState => {
  const state = lacune();
  talk(state, 'edda-khrysos');
  choose(state, 'edda-khrysos', 'nom', 'Et maintenant');
  choose(state, 'edda-khrysos', 'attend', 'Descendons ensemble');
  choose(state, 'mur-voie-sept', 'claire', 'Passer de profil');
  state.location = 'khrysos-voie-sept';
  talk(state, 'caisse-glacialis');
  return state;
};

describe('« Ce que la glace a pris »', () => {
  it('s’annonce par une lettre de Hesper après Marche-Mère, et commence au Foyer : la dame en gris est passée', () => {
    const state = game();
    expect(filPage(state).piste?.cible).toBe('khrysos');
    expect(filPage(state).piste?.texte).toMatch(/Ce qui dort sur le quai du niveau douze/);
    expect(talk(state, 'ulga')).toBe('dame');
    expect(state.quests['glace-pris']).toBe('active');
    expect(caisse(state)).toBe('inconnue');
    expect(filPage(state).piste?.texte).toMatch(/Niveau Douze/);
  });

  it('la lacune : Hrolda la fait rendre à qui a dit la formule ; un nom, à la place de l’auteur', () => {
    const state = game();
    expect(optionTexts(state, 'hrolda', 'accueil')).not.toContain('Je cherche une lacune : « Ce qui dort sur le quai du niveau douze ».');
    choose(state, 'hrolda', 'accueil', 'Et ne juge pas');
    expect(state.flags['formule-dite']).toBe(true);
    choose(state, 'hrolda', 'parle', 'Je cherche une lacune');
    expect(state.quests['glace-pris']).toBe('active');
    choose(state, 'hrolda', 'registre', 'Qu’est-ce qui manque');
    expect(state.flags['glace-lacune']).toBe(true);
    expect(DIALOGUES.hrolda.nodes.lacune.text).toContain('une étrangère, qui a dit son nom');
    // Le nom de la mère n'est jamais écrit.
    expect(talk(state, 'hrolda')).toBe('retour');
    expect(optionTexts(state, 'hrolda', 'retour')).not.toContain('Je cherche une lacune : « Ce qui dort sur le quai du niveau douze ».');
  });

  it('le pas de la dame en gris : le nom de sa mère, et sa réplique', () => {
    const state = lacune();
    expect(findObject(parseTiledMap(MAPS['khrysos-douze']), 'edda-khrysos')!.properties.apparaitSi).toBe('glace-lacune');
    expect(talk(state, 'edda-khrysos')).toBe('nom');
    expect(DIALOGUES['edda-khrysos'].nodes.nom.text).toContain('Elle a brisé un écho. Elle savait ce qu’on en ferait.');
    expect(filPage(state).savoirs.at(-1)).toMatch(/la mère de la dame en gris/);
    expect(talk(state, 'edda-khrysos')).toBe('attend');
  });

  it('trois façons d’avoir un second : la dame en gris, Halvard (Diplomatie 17), ou personne, de nuit', () => {
    const withEdda = lacune();
    talk(withEdda, 'edda-khrysos');
    choose(withEdda, 'edda-khrysos', 'attend', 'Descendons ensemble');
    expect(withEdda.flags['cryptes-ouvertes']).toBe(true);
    expect(withEdda.flags['descendu-edda']).toBe(true);

    const withHalvard = lacune();
    expect(optionTexts(withHalvard, 'halvard', 'accueil')).toContain('Descends aux cryptes avec moi.');
    choose(withHalvard, 'halvard', 'accueil', 'Descends aux cryptes');
    expect(withHalvard.flags['descendu-halvard']).toBe(true);
    const refused = lacune();
    expect(fail(refused, 'halvard', 'accueil', 'Descends aux cryptes')).toBe('refus');
    expect(optionTexts(refused, 'halvard', 'accueil')).not.toContain('Descends aux cryptes avec moi.');

    // Seul·e, de nuit : la ville le saura.
    const alone = lacune();
    choose(alone, 'grille-cryptes', 'ferme', 'S’éloigner');
    alone.flags['descendu-seul'] = true;
    expect(reputationScore(alone, 'khrysos')).toBeLessThan(reputationScore(lacune(), 'khrysos'));
  });

  it('au bout des cryptes, la glace claire ne s’ouvre qu’à qui sait ce qu’il cherche', () => {
    const state = game();
    expect(startNode(DIALOGUES['mur-voie-sept'], state)).toBe('ferme');
    const knows = lacune();
    expect(startNode(DIALOGUES['mur-voie-sept'], knows)).toBe('claire');
    choose(knows, 'mur-voie-sept', 'claire', 'Passer de profil');
    expect(knows.flags['voie-sept-ouverte']).toBe(true);
  });

  it('la caisse prise : six noms, et quatre fins', () => {
    const ends: [string, string, 'trouvee' | 'prise'][] = [
      ['La laisser prise', 'prise', 'trouvee'],
      ['Briser la prise', 'brisee', 'trouvee'],
      ['La confier au Collège', 'college', 'trouvee'],
      ['La laisser à la dame en gris', 'edda', 'prise'],
    ];
    for (const [text, fin, etat] of ends) {
      const state = onQuay();
      expect(DIALOGUES['caisse-glacialis'].nodes.liste.text).toContain('Aksel, sept ans');
      choose(state, 'caisse-glacialis', 'liste', text);
      expect(state.quests['glace-pris'], fin).toBe('done');
      expect(state.flags[`fin-glace-pris-${fin}`], fin).toBe(true);
      expect(caisse(state), fin).toBe(etat);
      expect(talk(state, 'caisse-glacialis')).toBe('vide');
      expect(talk(state, 'ulga')).toBe(etat === 'prise' ? 'lettre-prise' : 'lettre');
    }
  });

  it('briser la prise : un jet d’Athlétisme ; réussi, on devient un Briseur d’Échos ; raté, le cristal tient', () => {
    const state = onQuay();
    choose(state, 'caisse-glacialis', 'liste', 'Briser la prise');
    expect(state.flags['briseur-echos']).toBe(true);
    expect(ownedCount(state.character!, 'piece-glacialis')).toBe(1);
    expect(reputationScore(state, 'khrysos')).toBeLessThan(0);
    state.location = 'khrysos-douze';
    expect(talk(state, 'gardien-cryptes')).toBe('briseur');
    const holds = onQuay();
    expect(fail(holds, 'caisse-glacialis', 'liste', 'Briser la prise')).toBe('tient');
    expect(optionTexts(holds, 'caisse-glacialis', 'tient')).toHaveLength(3);
  });

  it('sans la dame en gris descendue, on ne peut pas la lui laisser', () => {
    const state = lacune();
    choose(state, 'halvard', 'accueil', 'Descends aux cryptes');
    state.location = 'khrysos-voie-sept';
    talk(state, 'caisse-glacialis');
    expect(optionTexts(state, 'caisse-glacialis', 'liste')).not.toContain('La laisser à la dame en gris.');
    expect(talk(state, 'halvard')).toBe('quai');
  });

  it('l’Écho de la voie sept ; le fragment des chaussures trop grandes', () => {
    const echo = echoObjects('khrysos-voie-sept').find((o) => o.properties.echo === 'glace-monte')!;
    expect(echo).toBeDefined();
    const state = onQuay();
    choose(state, 'caisse-glacialis', 'liste', 'La laisser prise');
    // Les fragments des chapitres d'avant sont déjà revenus.
    for (const f of FRAGMENTS.filter((x) => x.chapitre < 9)) state.flags[f.flag] = true;
    expect(dreamFragment(state)).toMatch(/chaussures trop grandes/);
  });
});
