import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type GameMap, type MapObject } from '../engine/tiledMap';
import { createNewGame, findLocation, type GameState, type VoieState } from '../state/gameState';
import { findEnemy } from './combat';
import { applyEffects, dialogueProblems } from './dialogue';
import { addItem, findItem, ownedCount } from './inventory';
import { choose, testCharacter } from './questTestKit';
import {
  VOIE_DEPTH,
  VOIE_PLANS,
  descend,
  groupNear,
  leaveVoie,
  springTrap,
  carriesLamp,
  clearVoieFlags,
  lightTraps,
  trapSeenFlag,
  startVoie,
  tierOf,
  voieLevel,
  voiePlan,
  voieTitle,
} from './voies';
import { DIALOGUES } from '../data/dialogues';
import { WORLD, WORLD_MAP_TARGET, knownPlaces } from './world';

/** Les voies endormies à explorer (docs/gdd/voies.md, jalon 3, étape 6). */
const SITES = WORLD.places.filter((p) => p.voie);

function inVoie(voie: VoieState, state: GameState = createNewGame(testCharacter())): GameState {
  state.voie = { ...voie };
  state.location = 'voie-endormie';
  return state;
}

function levelOf(state: GameState): { map: GameMap; objects: MapObject[]; level: ReturnType<typeof voieLevel> } {
  const map = parseTiledMap(MAPS[voiePlan(state.voie!)]);
  const level = voieLevel(state, map);
  return { map, objects: level.objects, level };
}

const SPOTS = ['ennemi-1', 'ennemi-2', 'ennemi-3', 'coffre-1', 'coffre-2', 'coffre-3', 'piege-1', 'piege-2', 'piege-3', 'piege-4', 'echo-1', 'contrat', 'descente'];

describe('the sleeping lines on the world map', () => {
  it('are three, from the halte des Fougères to the Dépôt Sept, deeper in danger', () => {
    expect(SITES.map((p) => [p.id, p.voie?.danger, p.location])).toEqual([
      ['halte-fougeres', 1, 'voie-endormie'],
      ['tunnel-combe', 2, 'voie-endormie'],
      ['depot-sept', 3, 'voie-endormie'],
    ]);
    expect(findLocation('voie-endormie')?.voie).toBe(true);
    expect(knownPlaces({}, {}).filter((p) => p.voie).map((p) => p.id)).toEqual(['halte-fougeres']);
    expect(knownPlaces({}, { 'dernier-train': 'done', 'cle-rouille-bleue': 'done' }).filter((p) => p.voie)).toHaveLength(3);
  });
});

describe('the plans', () => {
  it('each has its spawn points on free cells, all reachable from the entrance, and a way back up', () => {
    for (const { id } of VOIE_PLANS) {
      const map = parseTiledMap(MAPS[id]);
      const entree = findObject(map, 'entree')!;
      expect(map.objects.some((o) => o.type === 'sortie' && o.properties.cible === WORLD_MAP_TARGET), id).toBe(true);
      for (const name of SPOTS) {
        const spot = findObject(map, name);
        expect(spot, `${id} ${name}`).toBeDefined();
        expect(isWalkable(map, spot!), `${id} ${name} libre`).toBe(true);
        expect(findPath(entree, spot!, (t) => isWalkable(map, t)), `${id} ${name} accessible`).not.toBeNull();
      }
    }
  });
});

describe('a level', () => {
  /** Every site, every depth, many visits. */
  const visits = SITES.flatMap((site) => [...Array(VOIE_DEPTH).keys()].flatMap((d) => [...Array(40).keys()].map((seed) => ({ site: site.id, seed: seed * 7919 + 13, depth: d + 1 }))));

  it('never takes the same plan twice in a row, and every plan comes up', () => {
    const seen = new Set<string>();
    for (const v of visits) {
      seen.add(voiePlan(v));
      if (v.depth > 1) expect(voiePlan(v), JSON.stringify(v)).not.toBe(voiePlan({ ...v, depth: v.depth - 1 }));
    }
    expect([...seen].sort()).toEqual(VOIE_PLANS.map((p) => p.id).sort());
  });

  it('puts beasts, crates, traps and the descent on free cells, and leaves everything reachable', () => {
    for (const v of visits) {
      const state = inVoie(v);
      const { map, objects, level } = levelOf(state);
      const where = JSON.stringify(v);
      const cells = objects.filter((o) => o.type !== 'piege').map(tileKey);
      expect(new Set(cells).size, `${where} : deux objets sur une case`).toBe(cells.length);
      for (const o of objects) expect(isWalkable(map, o), `${where} ${o.name}`).toBe(true);
      // Crates, the Écho and the descent block their cell: the rest must stay reachable around them.
      const blocking = new Set(objects.filter((o) => o.properties.tuile).map(tileKey));
      const entree = findObject(map, 'entree')!;
      const walk = (t: { col: number; row: number }) => isWalkable(map, t, blocking);
      for (const o of objects) {
        const near = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr }))).filter(walk);
        expect(near.some((t) => findPath(entree, t, walk) !== null), `${where} ${o.name} accessible`).toBe(true);
      }
      expect(objects.some((o) => o.type === 'descente'), where).toBe(!level.terminus);
      expect(objects.filter((o) => o.name.startsWith('voie-coffre')).length, where).toBeGreaterThanOrEqual(level.terminus ? 2 : 1);
      for (const e of objects.filter((o) => o.type === 'ennemi')) expect(findEnemy(e.properties.ennemi), where).toBeDefined();
      for (const d of Object.values(level.dialogues)) expect(dialogueProblems(d), `${where} ${d.id}`).toEqual([]);
    }
  });

  it('is the same for the same visit, and differs from one visit to the next', () => {
    const v = { site: 'halte-fougeres', seed: 1234, depth: 2 };
    expect(levelOf(inVoie(v)).objects).toEqual(levelOf(inVoie(v)).objects);
    const layouts = new Set([...Array(12).keys()].map((seed) => JSON.stringify(levelOf(inVoie({ ...v, seed })).objects.map((o) => [o.name, o.col, o.row]))));
    expect(layouts.size).toBeGreaterThan(8);
  });

  it('grows more dangerous with the site and the depth', () => {
    expect(tierOf({ site: 'halte-fougeres', seed: 1, depth: 1 })).toBe(1);
    expect(tierOf({ site: 'tunnel-combe', seed: 1, depth: 3 })).toBe(4);
    expect(tierOf({ site: 'depot-sept', seed: 1, depth: 3 })).toBe(5);
    expect(voieTitle({ site: 'halte-fougeres', seed: 1, depth: 2 })).toBe('La halte des Fougères — niveau 2');
    expect(voieTitle({ site: 'depot-sept', seed: 1, depth: 3 })).toBe('Le Dépôt Sept — le terminus');
  });
});

describe('exploring', () => {
  it('goes down from the world map, one level at a time, and back up to the site', () => {
    const state = createNewGame(testCharacter());
    startVoie(state, 'halte-fougeres', () => 0.5);
    expect([state.location, state.entrance, state.voie?.depth]).toEqual(['voie-endormie', 'entree', 1]);
    state.flags['voie-coffre-1-ouvert'] = true;
    state.flags['laissez-passer'] = true;
    expect(descend(state)).toBe(true);
    expect([state.voie?.depth, state.time.phase, state.flags['voie-coffre-1-ouvert'], state.flags['laissez-passer']]).toEqual([2, 1, undefined, true]);
    descend(state);
    expect(descend(state)).toBe(false);
    expect(state.voie?.depth).toBe(VOIE_DEPTH);
    expect(leaveVoie(state)?.id).toBe('halte-fougeres');
    expect(state.voie).toBeNull();
  });

  it('a crate gives Fers, sometimes more; a locked one can be forced at the cost of some PV', () => {
    for (let seed = 0; seed < 30; seed++) {
      const state = inVoie({ site: 'tunnel-combe', seed, depth: 3 });
      const { level } = levelOf(state);
      Object.assign(DIALOGUES, level.dialogues);
      const fers = state.character!.fers;
      const hp = state.character!.hp;
      const crate = level.dialogues['voie-coffre-1'];
      const locked = crate.nodes.caisse.options.some((o) => o.roll);
      choose(state, 'voie-coffre-1', 'caisse', locked ? 'Forcer le couvercle' : 'L’ouvrir');
      expect(state.character!.fers, String(seed)).toBeGreaterThan(fers);
      expect(state.character!.hp).toBe(locked ? hp - 3 : hp);
      expect(state.flags['voie-coffre-1-ouvert']).toBe(true);
    }
  });

  it('a hidden trap is seen in time (Investigation), or it hurts', () => {
    const state = inVoie({ site: 'halte-fougeres', seed: 3, depth: 2 });
    const trap: MapObject = { name: 'voie-piege-1', type: 'piege', col: 5, row: 7, properties: { piege: 'dalle', disparaitSi: 'voie-piege-1' } };
    const seen = springTrap(state, trap, () => 0.99);
    expect([seen.spotted, seen.text, state.character!.xp]).toEqual([true, 'Une dalle sonne creux sous ta botte : tu passes à côté.', 5]);
    expect(state.flags['voie-piege-1']).toBe(true);
    const hp = state.character!.hp;
    const hit = springTrap(state, { ...trap, properties: { piege: 'rail', disparaitSi: 'voie-piege-2' } }, () => 0);
    expect([hit.spotted, state.character!.hp]).toEqual([false, hp - 6]);
  });

  it('with the crystal lamp, traps are seen two steps away and stepped over (docs/gdd/voies.md, « La lampe »)', () => {
    const state = inVoie({ site: 'halte-fougeres', seed: 3, depth: 2 });
    const near: MapObject = { name: 'voie-piege-1', type: 'piege', col: 6, row: 7, properties: { piege: 'dalle', disparaitSi: 'voie-piege-1' } };
    const far: MapObject = { name: 'voie-piege-2', type: 'piege', col: 9, row: 7, properties: { piege: 'rail', disparaitSi: 'voie-piege-2' } };
    const hero = { col: 4, row: 7 };
    expect(carriesLamp(state)).toBe(false);
    expect(lightTraps(state, [near, far], hero, () => false)).toEqual([]);
    addItem(state.character!, 'lampe-cristal', 1);
    expect(lightTraps(state, [near, far], hero, () => false)).toEqual([near]);
    expect(lightTraps(state, [near, far], hero, () => false)).toEqual([]);
    expect(state.flags[trapSeenFlag(near)]).toBe(true);
    // Stepped on anyway: no roll, no harm, no XP.
    const [hp, xp] = [state.character!.hp, state.character!.xp];
    const outcome = springTrap(state, near, () => 0);
    expect([outcome.spotted, outcome.notices, state.character!.hp, state.character!.xp]).toEqual([true, [], hp, xp]);
    // A new level forgets what was seen.
    clearVoieFlags(state.flags);
    expect(state.flags[trapSeenFlag(near)]).toBeUndefined();
  });

  it('beasts see the hero within two cells', () => {
    const beast: MapObject = { name: 'voie-ennemi-2-1', type: 'ennemi', col: 10, row: 5, properties: { ennemi: 'loup-rouille', voie: '2', disparaitSi: 'voie-groupe-2-vaincu' } };
    expect(groupNear([beast], { col: 8, row: 7 }, () => false)).toBe('2');
    expect(groupNear([beast], { col: 7, row: 7 }, () => false)).toBeNull();
    expect(groupNear([beast], { col: 9, row: 5 }, () => true)).toBeNull();
  });
});

describe('the contracts in the sleeping lines', () => {
  it('a search puts the thing on its level, until it is found', () => {
    const state = inVoie({ site: 'halte-fougeres', seed: 8, depth: 2 });
    state.contrats.actif = { id: 'x', kind: 'recherche', board: 'gardebois', titre: 't', texte: 't', cible: 'halte-fougeres', depth: 2, item: 'registre-quai', fers: 50, xp: 35 };
    const { level } = levelOf(state);
    expect(level.objects.some((o) => o.name === 'voie-contrat')).toBe(true);
    Object.assign(DIALOGUES, level.dialogues);
    choose(state, 'voie-contrat', 'trouve', 'La prendre');
    expect(ownedCount(state.character!, 'registre-quai')).toBe(1);
    expect(findItem('registre-quai')?.quest).toBe(true);
    expect(levelOf(state).objects.some((o) => o.name === 'voie-contrat')).toBe(false);
    state.voie!.depth = 1;
    expect(levelOf(state).objects.some((o) => o.name === 'voie-contrat')).toBe(false);
  });

  it('a hunt puts its beasts on the first level; beating them fulfils it', () => {
    const state = inVoie({ site: 'halte-fougeres', seed: 8, depth: 1 });
    state.contrats.actif = { id: 'x', kind: 'chasse', board: 'gardebois', titre: 't', texte: 't', cible: 'halte-fougeres', enemies: ['loup-rouille', 'loup-rouille'], fers: 35, xp: 25 };
    const hunted = levelOf(state).objects.filter((o) => o.properties.contrat);
    expect(hunted.map((o) => o.properties.ennemi)).toEqual(['loup-rouille', 'loup-rouille']);
    expect(applyEffects(state, [{ contrat: 'fait' }])).toEqual(['Contrat rempli : retourne au tableau des Gardiens']);
    expect(state.contrats.actif?.fait).toBe(true);
    expect(levelOf(state).objects.some((o) => o.properties.contrat)).toBe(false);
  });
});
