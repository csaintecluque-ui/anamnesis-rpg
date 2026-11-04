import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, LOCATIONS, type GameState } from '../state/gameState';
import { applyEffects, startNode } from './dialogue';
import { echoObjects } from './echos';
import { filPage } from './fil';
import { addItem, ownedCount } from './inventory';
import { campDresse, chaleur, GOURDE, mapNow, sableDefile, SOIF_PV } from './marche';
import { choose, optionTexts, testCharacter } from './questTestKit';
import {
  crossingOf,
  FIRST_CARAVAN_FLAG,
  findPlace,
  flightFare,
  flightSky,
  flightTimeLabel,
  knownPlaces,
  marchePosition,
  payFlight,
  WORLD,
} from './world';

/** La Marche-Mère, chapitre 7 (docs/gdd/chapitre-7.md) : la ville qui marche, la caravane, la chaleur hors de la Marche. */

const game = (): GameState => {
  const state = createNewGame(testCharacter());
  for (const q of ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu', 'noms-qui-montent', 'mer-rend']) state.quests[q] = 'done';
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

describe('la ville qui marche', () => {
  it('avance le matin et à midi, et dresse le camp le soir et la nuit : le Camp change alors de carte', () => {
    const camp = findLocation('marche-camp')!;
    expect([0, 1, 2, 3].map((phase) => campDresse({ day: 4, phase }))).toEqual([false, false, true, true]);
    expect([0, 1, 2, 3].map((phase) => mapNow(camp, { day: 4, phase }))).toEqual(['marche-route', 'marche-route', 'marche-camp', 'marche-camp']);
    // Les marées de Coralia n'ont pas bougé.
    expect(mapNow(findLocation('coralia-port')!, { day: 4, phase: 0 })).toBe('coralia-port-reflux');
    expect(mapNow(findLocation('coralia-canaux')!, { day: 4, phase: 0 })).toBe('coralia-canaux');
  });

  it('fait défiler le sable sous la Marche quand elle avance, jamais au camp ni hors de la Marche', () => {
    const at = (id: string, phase: number) => sableDefile(findLocation(id)!, { day: 2, phase });
    expect(at('marche-camp', 0)).toBe(true);
    expect(at('marche-coeur', 1)).toBe(true);
    expect(at('marche-camp', 2)).toBe(false);
    expect(at('marche-desert', 0)).toBe(false);
  });

  it('garde ses foyers aux mêmes portes, en tentes le soir et en chariots le jour', () => {
    const doors = (id: string) =>
      parseTiledMap(MAPS[id])
        .objects.filter((o) => o.type === 'porte')
        .map((o) => `${o.name}@${o.col},${o.row}`)
        .sort();
    expect(doors('marche-route')).toEqual(doors('marche-camp'));
  });

  it('laisse atteindre chaque personne, porte, sortie et objet, de jour comme de nuit', () => {
    const ids = [...LOCATIONS.filter((l) => l.place === 'marche-mere').map((l) => l.map), 'marche-camp'];
    for (const id of ids) expect(unreachable(parseTiledMap(MAPS[id]), 'entree'), id).toEqual([]);
  });

  it('envoie chaque sortie et chaque porte du camp du soir vers un lieu qui existe', () => {
    const map = parseTiledMap(MAPS['marche-camp']);
    for (const o of map.objects.filter((x) => x.type === 'sortie' || (x.type === 'porte' && x.properties.cible !== 'carte-du-monde'))) {
      const target = findLocation(o.properties.cible);
      expect(target, o.name).toBeDefined();
      expect(findObject(parseTiledMap(MAPS[target!.map]), o.properties.arrivee ?? target!.entrance), o.name).toBeDefined();
    }
  });
});

describe('la chaleur, hors de la Marche', () => {
  it('coûte des PV à qui n’a pas d’eau, jamais le dernier ; une gourde de l’errance la tient à distance', () => {
    const state = game();
    const c = state.character!;
    const before = c.hp;
    expect(chaleur(c)).toBe(SOIF_PV);
    expect(c.hp).toBe(before - SOIF_PV);
    c.hp = 2;
    expect(chaleur(c)).toBe(1);
    expect(chaleur(c)).toBe(0);
    expect(c.hp).toBe(1);
    addItem(c, GOURDE);
    expect(chaleur(c)).toBeNull();
    expect(c.hp).toBe(1);
    expect(findLocation('marche-desert')!.soif).toBe(true);
    expect(findLocation('marche-halte-morte')!.soif).toBe(true);
  });
});

describe('la caravane des verriers, et la Marche sur la carte du monde', () => {
  it('rejoint la Marche-Mère en caravane : le premier passage payé par Hesper, puis 35 Fers, trois jours', () => {
    const state = game();
    const marche = findPlace('marche-mere')!;
    expect(crossingOf(marche)?.moyen).toBe('caravane');
    expect(flightSky(state, findPlace('sept-portes')!, marche)).toBe(marche);
    expect(flightTimeLabel(marche)).toBe('trois jours en caravane');
    expect(flightFare(state, marche)).toBe(0);
    expect(payFlight(state, marche)).toBe(true);
    expect(state.flags[FIRST_CARAVAN_FLAG]).toBe(true);
    expect(flightFare(state, marche)).toBe(35);
    state.flags['membre-matriarches-cristaux'] = true;
    expect(flightFare(state, marche)).toBe(17);
    // Les autres traversées ont leur propre premier passage.
    expect(flightFare(state, findPlace('coralia')!)).toBe(0);
  });

  it('n’est jamais au même endroit : un tour de son cercle en trente jours, dans le désert du sud-est', () => {
    const { marche } = findPlace('marche-mere')!;
    const days = Array.from({ length: 30 }, (_, i) => marchePosition(marche!, i + 1));
    expect(days[0]).toEqual({ x: marche!.points[0][0], y: marche!.points[0][1] });
    expect(new Set(days.map((p) => `${p.x},${p.y}`)).size).toBeGreaterThan(20);
    expect(marchePosition(marche!, 31)).toEqual(days[0]);
    for (const p of days) {
      expect(p.x).toBeGreaterThan(850);
      expect(p.x).toBeLessThan(WORLD.width);
      expect(p.y).toBeGreaterThan(500);
      expect(p.y).toBeLessThan(WORLD.height);
    }
  });

  it('apparaît sur la carte du monde après Coralia ; Coralia, après Aetherhaven', () => {
    const state = createNewGame(testCharacter());
    const known = () => knownPlaces(state.flags, state.quests).map((p) => p.id);
    expect(known()).not.toContain('coralia');
    state.quests['noms-qui-montent'] = 'done';
    expect(known()).toContain('coralia');
    expect(known()).not.toContain('marche-mere');
    state.quests['mer-rend'] = 'done';
    expect(known()).toContain('marche-mere');
  });

  it('donne à chaque ville au-delà des routes une quête qui la fait apparaître (rien ne reste caché pour de bon)', () => {
    for (const place of WORLD.places.filter((p) => crossingOf(p))) expect(place.known || place.revealedByQuest, place.id).toBeTruthy();
  });
});

// --- « Ce qui n'a plus lieu » ---------------------------------------------------------------------------------------

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
const caisse = (state: GameState) => filPage(state).caisses.find((c) => c.continent === 'la Communion')?.etat;
/** At the halte, the quest started, the halte found and the water of the errance in hand. */
const atHalte = (): GameState => {
  const state = game();
  talk(state, 'tam-ruu');
  choose(state, 'daru-khen', 'halte-q', 'Dis-moi seulement');
  choose(state, 'gardienne-eau', 'accueil', 'L’eau de l’Année Errante');
  return state;
};

describe('« Ce qui n’a plus lieu »', () => {
  it('commence à la Halte, après Coralia : la dame en gris est partie à pied vers le sud', () => {
    const state = game();
    expect(talk(state, 'tam-ruu')).toBe('dame');
    expect(state.quests['plus-lieu']).toBe('active');
    expect(caisse(state)).toBe('inconnue');
    expect(filPage(state).piste?.cible).toBe('marche-mere');
    // Ou chez Ish'Lenne, qui garde les mots.
    const other = game();
    expect(talk(other, 'ish-lenne')).toBe('caisse-debut');
    expect(other.quests['plus-lieu']).toBe('active');
  });

  it('trouve la halte de trois façons : Longue-Ombre, le Coffre des routes, le premier guide', () => {
    const viaNes = game();
    talk(viaNes, 'tam-ruu');
    expect(talk(viaNes, 'nes-mira')).toBe('tete');
    choose(viaNes, 'nes-mira', 'tete', 'Poser la main');
    expect(viaNes.flags['halte-trouvee']).toBe(true);
    expect(viaNes.flags['lien-longue-ombre']).toBe(true);

    const viaCoffre = game();
    talk(viaCoffre, 'tam-ruu');
    expect(talk(viaCoffre, 'coffre-routes')).toBe('coffre-quete');
    choose(viaCoffre, 'coffre-routes', 'coffre-quete', 'Défaire le nœud');
    expect(viaCoffre.flags['halte-trouvee']).toBe(true);

    const surpris = game();
    talk(surpris, 'tam-ruu');
    expect(fail(surpris, 'coffre-routes', 'coffre-quete', 'Les lire')).toBe('surpris');
    expect(talk(surpris, 'coffre-routes')).toBe('coffre');

    const viaDaru = game();
    talk(viaDaru, 'tam-ruu');
    viaDaru.flags['membre-guides-eau'] = true;
    choose(viaDaru, 'daru-khen', 'halte-q', 'Je suis des Guides de l’Eau');
    expect(viaDaru.flags['halte-trouvee']).toBe(true);
  });

  it('Ish’Lenne donne les mots à qui sait où il faut les dire ; au pied du jalon, la halte a de nouveau lieu, et son Écho se montre', () => {
    const state = atHalte();
    expect(optionTexts(state, 'ish-lenne', 'caisse')).toContain('Je sais où est sa halte.');
    choose(state, 'ish-lenne', 'caisse', 'Je sais où est sa halte');
    expect(state.flags['ish-mots']).toBe(true);
    const echo = echoObjects('marche-halte-morte').find((o) => o.properties.echo === 'personne')!;
    expect(echo.properties.apparaitSi).toBe('episode-dit');
    expect(talk(state, 'jalon-halte')).toBe('dire');
    choose(state, 'jalon-halte', 'dire', 'Dire l’épisode');
    expect(state.flags['episode-dit']).toBe(true);
    expect(talk(state, 'jalon-halte')).toBe('vivant');
    expect(talk(state, 'ish-lenne')).toBe('merci');
  });

  it('le pas de la dame en gris : le compte d’un matin d’il y a trente ans, et sa réplique à la halte', () => {
    const state = atHalte();
    expect(talk(state, 'yel-dara')).toBe('edda');
    expect(DIALOGUES['yel-dara'].nodes.nombre.text).toContain('la ration de l’étrangère');
    expect(talk(state, 'edda-marche')).toBe('soif');
    expect(DIALOGUES['edda-marche'].nodes.soif.text).toContain('Le lendemain matin, elle était dans un nombre.');
    expect(talk(state, 'edda-marche')).toBe('caisse');
  });

  it('l’eau : la donner, la marchander (un sacrilège, et la dame en gris ne reprend plus la caisse), ou n’en pas avoir', () => {
    const donne = atHalte();
    talk(donne, 'edda-marche');
    choose(donne, 'edda-marche', 'soif', 'Lui tendre ta gourde');
    expect(donne.flags['edda-eau']).toBe(true);
    expect(ownedCount(donne.character!, GOURDE)).toBe(0);

    const marchande = atHalte();
    talk(marchande, 'edda-marche');
    choose(marchande, 'edda-marche', 'soif', 'Ta gourde contre la caisse');
    expect(optionTexts(marchande, 'edda-marche', 'caisse')).not.toContain('La laisser à la dame en gris.');

    const sansEau = game();
    talk(sansEau, 'tam-ruu');
    talk(sansEau, 'edda-marche');
    expect(optionTexts(sansEau, 'edda-marche', 'soif')).toEqual(['Je n’ai pas d’eau à te donner.']);
  });

  it('quatre fins : laissée à sa halte, la pièce gardée, portée par Longue-Ombre, laissée à la dame en gris', () => {
    const ends: [string, string, 'trouvee' | 'prise'][] = [
      ['La laisser ici', 'halte', 'trouvee'],
      ['Prendre la pièce', 'gardee', 'trouvee'],
      ['La rapporter à la Marche', 'longue-ombre', 'trouvee'],
      ['La laisser à la dame en gris', 'edda', 'prise'],
    ];
    for (const [text, fin, etat] of ends) {
      const state = atHalte();
      talk(state, 'edda-marche');
      choose(state, 'edda-marche', 'soif', 'Je n’ai pas d’eau');
      choose(state, 'edda-marche', 'caisse', text);
      expect(state.quests['plus-lieu'], fin).toBe('done');
      expect(state.flags[`fin-plus-lieu-${fin}`], fin).toBe(true);
      expect(caisse(state), fin).toBe(etat);
      expect(talk(state, 'caisse-communion')).toBe('vide');
      expect(talk(state, 'tam-ruu')).toBe(etat === 'prise' ? 'lettre-prise' : 'lettre');
    }
    // Trop lourde : sans les chariots des guides, on la laisse, ou on n'en prend que la pièce.
    const lourde = atHalte();
    talk(lourde, 'edda-marche');
    expect(fail(lourde, 'edda-marche', 'caisse', 'La rapporter')).toBe('trop-lourde');
    expect(optionTexts(lourde, 'edda-marche', 'trop-lourde')).not.toContain('Les guides ont des chariots.');
  });

  it('les pilleurs du col : leur donner à boire les fait partir ; et la Marche, au retour, se rattrape', () => {
    const state = atHalte();
    choose(state, 'pilleurs-desert', 'barre', 'Vous avez soif');
    expect(state.flags['pilleurs-partis']).toBe(true);
    expect(ownedCount(state.character!, GOURDE)).toBe(0);
    expect(optionTexts(state, 'piste-retour', 'rattraper')).toEqual(['Suivre les traces.', 'Pas encore.']);
    state.flags['lien-longue-ombre'] = true;
    expect(optionTexts(state, 'piste-retour', 'rattraper')).toContain('Écouter le grondement de Longue-Ombre.');
  });
});
