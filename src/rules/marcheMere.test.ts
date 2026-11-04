import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, LOCATIONS, type GameState } from '../state/gameState';
import { addItem } from './inventory';
import { campDresse, chaleur, GOURDE, mapNow, sableDefile, SOIF_PV } from './marche';
import { testCharacter } from './questTestKit';
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
