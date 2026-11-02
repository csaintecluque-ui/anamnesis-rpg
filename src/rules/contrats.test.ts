import { describe, expect, it } from 'vitest';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey } from '../engine/tiledMap';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { applyEffects } from './dialogue';
import { FIGURANTS } from './figurants';
import { ownedCount } from './inventory';
import { journalQuests } from './journal';
import { testCharacter } from './questTestKit';
import { PLI, TABLEAUX, abandon, accept, boardObjects, canTurnIn, contractStep, daysToRenewal, offers, turnIn } from './contrats';

/** Les contrats des Gardiens (docs/gdd/voies.md, jalon 3, étape 6). */
const game = (): GameState => createNewGame(testCharacter());
const ironheartKnown = (state: GameState) => {
  state.quests.audience = 'done';
  return state;
};

describe('the boards', () => {
  it('hang in the three relays, on a free cell within reach, off the passers-by’s paths', () => {
    expect(TABLEAUX.map((t) => [t.id, t.lieu])).toEqual([
      ['gardebois', 'maison-ilyane'],
      ['canopee', 'canopee-relais'],
      ['ironheart', 'ironheart-pension'],
    ]);
    for (const t of TABLEAUX) {
      const map = parseTiledMap(MAPS[findLocation(t.lieu)!.map]);
      const occupied = new Set(map.objects.filter((o) => o.type === 'pnj' || o.type === 'objet').map(tileKey));
      expect(isWalkable(map, t, occupied), t.id).toBe(true);
      const entree = findObject(map, 'entree')!;
      const walk = (c: { col: number; row: number }) => isWalkable(map, c, new Set([...occupied, tileKey(t)]));
      const near = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: t.col + dc, row: t.row + dr }))).filter(walk);
      expect(near.some((c) => findPath(entree, c, walk)), t.id).toBe(true);
      const paths = FIGURANTS.filter((f) => f.location === t.lieu).flatMap((f) => (f.path ?? []).map(([c, r]) => `${c},${r}`));
      expect(paths, t.id).not.toContain(tileKey(t));
      expect(boardObjects(t.lieu)).toEqual([{ name: 'tableau-contrats', type: 'objet', col: t.col, row: t.row, properties: { tuile: 'panneau', contrats: t.id } }]);
    }
  });

  it('offer a letter, a search and a hunt, the same for three days, then others', () => {
    const state = game();
    const first = offers(state, 'gardebois');
    expect(first.map((c) => c.kind)).toEqual(['pli', 'recherche', 'chasse']);
    // At the start, only Canopéa to write to, only the halte des Fougères to go down into.
    expect(first[0]).toMatchObject({ kind: 'pli', cible: 'canopee' });
    expect(first.slice(1).map((c) => c.cible)).toEqual(['halte-fougeres', 'halte-fougeres']);
    expect(daysToRenewal(state)).toBe(3);
    state.time.day = 3;
    expect(offers(state, 'gardebois')).toEqual(first);
    expect(daysToRenewal(state)).toBe(1);
    state.time.day = 4;
    expect(offers(state, 'gardebois').map((c) => c.id)).toEqual(['gardebois-1-pli', 'gardebois-1-recherche', 'gardebois-1-chasse']);
    for (const c of first) {
      expect(c.texte.length).toBeLessThan(220);
      expect(c.fers).toBeGreaterThan(0);
    }
  });

  it('write to Ironheart once it is known', () => {
    const later = ironheartKnown(game());
    const letters = [...Array(30).keys()].map((p) => {
      later.time.day = 1 + 3 * p;
      return offers(later, 'canopee')[0].cible;
    });
    expect(new Set(letters)).toEqual(new Set(['gardebois', 'ironheart']));
  });
});

describe('a contract', () => {
  it('a letter: taken with its sealed letter, paid at the board it goes to', () => {
    const state = game();
    const letter = offers(state, 'gardebois')[0];
    expect(accept(state, letter)).toEqual([`Contrat pris : ${letter.titre}`, '+1 Pli scellé des Gardiens']);
    expect(offers(state, 'gardebois').map((c) => c.kind)).toEqual(['recherche', 'chasse']);
    expect(accept(state, offers(state, 'gardebois')[0])).toEqual([]);
    expect(contractStep(state, letter)).toBe('Porter le pli au relais de Canopéa.');
    expect(canTurnIn(state, 'gardebois')).toBe(false);
    expect(canTurnIn(state, 'canopee')).toBe(true);
    const fers = state.character!.fers;
    expect(turnIn(state, 'canopee')).toEqual([`Contrat rempli : ${letter.titre}`, '−1 Pli scellé des Gardiens', `+${letter.fers} Fers`, `+${letter.xp} points d’expérience`]);
    expect([state.character!.fers, ownedCount(state.character!, PLI), state.contrats.actif, state.contrats.faits]).toEqual([fers + letter.fers, 0, null, 1]);
  });

  it('a search: paid where it was taken, once the thing is in the bag', () => {
    const state = game();
    const search = offers(state, 'gardebois')[1];
    accept(state, search);
    expect(canTurnIn(state, 'gardebois')).toBe(false);
    applyEffects(state, [{ giveItem: search.item! }]);
    expect(canTurnIn(state, 'canopee')).toBe(false);
    expect(turnIn(state, 'gardebois')[0]).toBe(`Contrat rempli : ${search.titre}`);
    expect(ownedCount(state.character!, search.item!)).toBe(0);
  });

  it('a hunt: paid once the beasts are beaten; it shows in the journal meanwhile', () => {
    const state = game();
    const hunt = offers(state, 'gardebois')[2];
    accept(state, hunt);
    expect(journalQuests(state)[0]).toMatchObject({ name: `Contrat : ${hunt.titre}`, done: false });
    expect(journalQuests(state)[0].step).toContain('premier niveau de la halte des Fougères');
    expect(canTurnIn(state, 'gardebois')).toBe(false);
    applyEffects(state, [{ contrat: 'fait' }]);
    expect(journalQuests(state)[0].step).toBe('Les bêtes sont chassées : retourner au relais de Gardebois.');
    expect(turnIn(state, 'gardebois')).toHaveLength(3);
    expect(journalQuests(state).some((q) => q.name.startsWith('Contrat'))).toBe(false);
  });

  it('can be given up: the letter goes back', () => {
    const state = game();
    accept(state, offers(state, 'gardebois')[0]);
    abandon(state);
    expect([state.contrats.actif, ownedCount(state.character!, PLI), state.contrats.faits]).toEqual([null, 0, 0]);
  });

  it('is kept by the save, with the sleeping line under way', () => {
    const state = game();
    accept(state, offers(state, 'gardebois')[1]);
    state.voie = { site: 'halte-fougeres', seed: 77, depth: 2 };
    state.location = 'voie-endormie';
    const back = parseSave(serializeSave(createSave(state, new Date('2026-11-02T20:00:00Z'))));
    expect(back.ok && back.value.state.contrats).toEqual(state.contrats);
    expect(back.ok && back.value.state.voie).toEqual(state.voie);
    const broken = structuredClone(state);
    broken.voie = { site: 'gardebois', seed: 1, depth: 1 };
    expect(parseSave(serializeSave(createSave(broken, new Date())))).toMatchObject({ ok: false });
  });
});
