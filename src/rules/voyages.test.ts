import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import type { Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey } from '../engine/tiledMap';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { goesTo } from './dialogue';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { WORLD } from './world';

/** « Voyager autrement » : le train de la ligne de l'Ouest et la caravane de la Compagnie des Lisières. */

function traveller(fers = 100): GameState {
  const state = createNewGame(testCharacter());
  state.character!.fers = fers;
  state.quests.audience = 'done';
  return state;
}

/** Where the last option of a trip node takes the hero. */
const destination = (dialogue: string, node: string) => goesTo(DIALOGUES[dialogue].nodes[node].options[0].effects ?? []);

describe('Voyager autrement: stations and caravans on the maps', () => {
  it('can be reached in Gardebois, Canopéa and Ironheart', () => {
    for (const [id, names] of [
      ['gardebois', ['convoyeuse']],
      ['canopee-nacelle', ['chef-caravane', 'halte-ouest']],
      ['ironheart-forges', ['guichet-ouest', 'boulon']],
    ] as const) {
      const map = parseTiledMap(MAPS[findLocation(id)!.map]);
      const start = findObject(map, findLocation(id)!.entrance)!;
      const taken = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
      const walk = (t: Tile) => isWalkable(map, t, taken);
      for (const name of names) {
        const o = findObject(map, name)!;
        expect(o, name).toBeDefined();
        const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
        expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null), `${id}: ${name}`).toBe(true);
      }
    }
  });

  it('draws the ligne de l’Ouest between Canopéa and Ironheart on the world map', () => {
    expect(WORLD.rails).toContainEqual({ from: 'canopee', to: 'ironheart', name: 'Ligne de l’Ouest' });
  });
});

describe('Voyager autrement: the train', () => {
  it('costs 40 Fers (80 Feuilles in the canon), 30 if the railway workers owe the hero, 50 if the Marches still rob the convoys', () => {
    const state = traveller();
    expect(optionTexts(state, 'guichet-ouest', 'guichet')).toEqual(['Prendre un billet.', 'Pas aujourd’hui.']);
    choose(state, 'guichet-ouest', 'guichet', 'Prendre un billet.');
    expect(state.character!.fers).toBe(60);
    const friend = traveller();
    friend.flags['rail-travailleurs'] = true;
    choose(friend, 'guichet-ouest', 'guichet', 'Prendre un billet : les cheminots');
    expect(friend.character!.fers).toBe(70);
    const accomplice = traveller();
    accomplice.flags['rail-marches'] = true;
    choose(accomplice, 'guichet-ouest', 'guichet', 'Prendre un billet : les convois');
    expect(accomplice.character!.fers).toBe(50);
  });

  it('takes the hero between Ironheart and the halte at the foot of the Grande Nacelle', () => {
    expect(destination('guichet-ouest', 'train-canopee')).toEqual({ location: 'canopee-nacelle', arrivee: 'entree' });
    expect(destination('halte-ouest', 'train-ironheart')).toEqual({ location: 'ironheart-forges', arrivee: 'entree' });
  });

  it('needs the Triumvirat’s sauf-conduit to cross the border: no ticket before « L’audience »', () => {
    const state = createNewGame(testCharacter());
    state.character!.fers = 100;
    expect(optionTexts(state, 'halte-ouest', 'billet')).toEqual(['Pas aujourd’hui.']);
  });
});

describe('Voyager autrement: the caravan of the Compagnie des Lisières', () => {
  it('costs 15 Fers, nothing for members', () => {
    const state = traveller();
    choose(state, 'convoyeuse', 'accueil', 'À Canopéa');
    choose(state, 'convoyeuse', 'canopee', 'Payer le voyage');
    expect(state.character!.fers).toBe(85);
    const member = traveller();
    member.flags['membre-compagnie-lisieres'] = true;
    expect(optionTexts(member, 'chef-caravane', 'gardebois')).toEqual(['Montrer ta marque de la Compagnie.', 'Une autre fois.']);
    choose(member, 'chef-caravane', 'gardebois', 'Montrer ta marque');
    expect(member.character!.fers).toBe(100);
  });

  it('links Gardebois with Canopéa and Ironheart, both ways', () => {
    expect(destination('convoyeuse', 'trajet-canopee')).toEqual({ location: 'canopee-nacelle', arrivee: 'entree' });
    expect(destination('convoyeuse', 'trajet-ironheart')).toEqual({ location: 'ironheart-forges', arrivee: 'entree' });
    expect(destination('chef-caravane', 'trajet-gardebois')).toEqual({ location: 'gardebois', arrivee: 'entree' });
    expect(destination('boulon', 'trajet-gardebois')).toEqual({ location: 'gardebois', arrivee: 'entree' });
  });

  it('only goes to Ironheart once the hero may cross the border', () => {
    const state = createNewGame(testCharacter());
    expect(optionTexts(state, 'convoyeuse', 'accueil')).toEqual(['À Canopéa.', 'Pas aujourd’hui.']);
  });
});
