import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findPath } from '../engine/pathfinding';
import { findObject, isWalkable, parseTiledMap, tileKey, type MapObject } from '../engine/tiledMap';
import type { Tile } from '../engine/iso';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { applyEffects, startNode } from './dialogue';
import { merchantDiscount, ownedCount } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { reputationPrices, reputationScore } from './reputation';
import { knownPlaces } from './world';

/** Ironheart et « La Clé de Rouille Bleue » (chapitre 3, docs/univers/quetes.md, docs/univers/lieux/ironheart.md). */
const Q = 'cle-rouille-bleue';

function atIronheart(attributes = {}, skills = {}): GameState {
  const state = createNewGame(testCharacter(attributes, skills));
  state.quests.audience = 'done';
  state.character!.inventory.push({ itemId: 'sauf-conduit', count: 1 });
  return state;
}

/** The game applies a node's effects when it is shown: the first node of a conversation too. */
function meetBoulon(state: GameState): void {
  applyEffects(state, DIALOGUES.boulon.nodes['accueil-quete'].effects);
  choose(state, 'boulon', 'accueil-quete', 'Un certain Kaelis');
}

function keyFromVeilleuse(state: GameState): void {
  meetBoulon(state);
  choose(state, 'renfoncement', 'mur', 'Chercher le passage');
  choose(state, 'kaelis', 'accueil', 'Pourquoi certaines reliques');
  expect(startNode(DIALOGUES.veilleuse, state)).toBe('question-cle');
  choose(state, 'veilleuse', 'question-cle', 'Laisse-moi écouter');
  choose(state, 'veilleuse', 'ecoute', 'Et la clé');
}

describe('Ironheart on the world map', () => {
  it('appears once « L’audience » is done', () => {
    expect(knownPlaces({}, {}).map((p) => p.id)).not.toContain('ironheart');
    expect(knownPlaces({}, { audience: 'done' }).map((p) => p.id)).toContain('ironheart');
  });
});

describe('Ironheart maps', () => {
  const reach = (id: string, names: string[]) => {
    const map = parseTiledMap(MAPS[findLocation(id)!.map]);
    const start = findObject(map, findLocation(id)!.entrance)!;
    const taken = new Set(map.objects.filter((o) => o.type === 'pnj').map(tileKey));
    const walk = (t: Tile) => isWalkable(map, t, taken);
    for (const name of names) {
      const o: MapObject = findObject(map, name)!;
      expect(o, `${id}: ${name}`).toBeDefined();
      const around = [-1, 0, 1].flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: o.col + dc, row: o.row + dr })));
      expect(around.some((t) => walk(t) && findPath(start, t, walk) !== null), `${id}: ${name}`).toBe(true);
    }
  };

  it('lets one reach everyone and every door from the arrival', () => {
    reach('ironheart-forges', ['boulon', 'patrouilleur', 'veilleuse', 'vieille-machine', 'funiculaire', 'entree-marche', 'vers-monde', 'porte-ironheart-pension', 'porte-ironheart-atelier', 'porte-ironheart-martelroux', 'registre-puits']);
    reach('ironheart-marche', ['kaelis', 'guichet-cendres', 'vers-forges']);
    reach('ironheart-manufactures', ['porte-ironheart-archives', 'funiculaire-descente', 'funiculaire-hautes', 'patrouilleuse-haute']);
  });
});

describe('La Clé de Rouille Bleue', () => {
  it('starts with Boulon at the station, after « L’audience »', () => {
    const state = atIronheart();
    expect(startNode(DIALOGUES.boulon, state)).toBe('accueil-quete');
    meetBoulon(state);
    expect(state.quests[Q]).toBe('active');
    expect(state.flags['marche-cendres-indice']).toBe(true);
  });

  it('opens the funicular with the Triumvirat’s pass, Fers or a bluff', () => {
    const state = atIronheart();
    expect(optionTexts(state, 'patrouilleur', 'controle')).toContain('Montrer le sauf-conduit du Triumvirat.');
    choose(state, 'patrouilleur', 'controle', 'Montrer le sauf-conduit');
    expect(state.flags['laissez-passer-ironheart']).toBe(true);
    expect(startNode(DIALOGUES.patrouilleur, state)).toBe('passe');
  });

  it('finds the hidden market with a hint or Investigation 2', () => {
    const state = createNewGame(testCharacter({}, { investigation: 0 }));
    expect(optionTexts(state, 'renfoncement', 'mur')).toEqual(['Examiner le mur.', 'Passer son chemin.']);
    choose(state, 'rika', 'accueil', 'Le Marché des Cendres');
    choose(state, 'renfoncement', 'mur', 'Chercher le passage');
    expect(state.flags['marche-cendres-connu']).toBe(true);
  });

  it('only answers Kaelis’s riddle with Mémoire 3 or the Récit of the Bosquet; otherwise the answer is bought', () => {
    const state = atIronheart({ memory: 2 });
    expect(optionTexts(state, 'kaelis', 'accueil')).not.toContain('Au Bosquet des Échos, le bois garde la main de qui a gravé. Et tes os ?');
    choose(state, 'kaelis', 'accueil', 'Je cherche la clé');
    expect(state.flags['kaelis-parle']).toBeUndefined();
    choose(state, 'kaelis', 'mauvaise', 'Tout se vend');
    state.character!.fers = 30;
    choose(state, 'kaelis', 'prix', 'Payer vingt-cinq Fers');
    expect(state.character!.fers).toBe(5);
    expect(state.flags['kaelis-parle']).toBe(true);
  });

  it('can be finished without Mémoire or Diplomatie: the Fonds Zéro convinces the Veilleuse', () => {
    const state = atIronheart({ memory: 2 }, { diplomacy: 0 });
    state.character!.fers = 30;
    meetBoulon(state);
    choose(state, 'kaelis', 'accueil', 'Je cherche la clé');
    choose(state, 'kaelis', 'mauvaise', 'Tout se vend');
    choose(state, 'kaelis', 'prix', 'Payer');
    choose(state, 'veilleuse', 'question-cle', 'Lui parler de ce que la clé ouvre');
    expect(optionTexts(state, 'veilleuse', 'ouvre').some((t) => t.startsWith('Aux Archives'))).toBe(false);
    choose(state, 'noam', 'accueil', 'Je cherche ce qui concerne le dernier train');
    choose(state, 'veilleuse', 'ouvre', 'Aux Archives');
    expect(ownedCount(state.character!, 'cle-rouille-bleue')).toBe(1);
    choose(state, 'noam', 'cle', 'La lui confier');
    expect(state.quests[Q]).toBe('done');
  });

  it('ends with Kaelis: the Marches des Cendres pay', () => {
    const state = atIronheart();
    keyFromVeilleuse(state);
    expect(ownedCount(state.character!, 'cle-rouille-bleue')).toBe(1);
    const fers = state.character!.fers;
    choose(state, 'kaelis', 'offre', 'La lui vendre');
    expect(state.character!.fers).toBe(fers + 100);
    expect(ownedCount(state.character!, 'cle-rouille-bleue')).toBe(0);
    expect(state.quests[Q]).toBe('done');
    expect(reputationScore(state, 'marches-cendres')).toBeGreaterThan(0);
    expect(reputationScore(state, 'archives-ferros')).toBeLessThan(0);
  });

  it('ends with Noam: the Fonds Zéro opens', () => {
    const state = atIronheart();
    keyFromVeilleuse(state);
    expect(startNode(DIALOGUES.noam, state)).toBe('cle');
    choose(state, 'noam', 'cle', 'La lui confier');
    expect(state.flags['cle-archives']).toBe(true);
    expect(state.character!.recits).toContain('carnet-dernier-train');
    expect(reputationScore(state, 'archives-ferros')).toBeGreaterThan(0);
  });

  it('ends with the Veilleuse: the key stays on the line, studied first with Érudition 3', () => {
    const state = atIronheart({}, { lore: 3 });
    keyFromVeilleuse(state);
    expect(startNode(DIALOGUES.veilleuse, state)).toBe('avec-cle');
    choose(state, 'veilleuse', 'avec-cle', 'L’étudier d’abord');
    expect(state.flags['cle-etudiee']).toBe(true);
    choose(state, 'veilleuse', 'etude', 'Te la rendre');
    expect(state.quests[Q]).toBe('done');
    expect(reputationScore(state, 'travailleurs-rail')).toBeGreaterThan(0);
    expect(startNode(DIALOGUES.veilleuse, state)).toBe('rendue-apres');
  });

  it('starts at the end of « L’audience » for a new game', () => {
    const effects = DIALOGUES['kael-marchevent'].nodes.envoi.effects ?? [];
    expect(effects).toContainEqual({ startQuest: Q });
  });
});

describe('what Gardebois and Canopéa leave to Ironheart (AGENTS.md)', () => {
  it('Kaelis knows who sent Garrik away from the sacred ground', () => {
    const state = atIronheart();
    expect(startNode(DIALOGUES.kaelis, state)).toBe('accueil');
    state.flags['fouille-elucidee'] = true;
    expect(startNode(DIALOGUES.kaelis, state)).toBe('accueil-garrik');
    choose(state, 'kaelis', 'accueil-garrik', 'Pourquoi certaines reliques');
    expect(state.flags['kaelis-parle']).toBe(true);
  });

  it('Noam reads the telegram of the advice given to the Triumvirat', () => {
    const state = atIronheart();
    state.flags['conseil-accord'] = true;
    choose(state, 'noam', 'accueil', 'Classez-vous aussi');
    expect(optionTexts(state, 'noam', 'verdantis')).toEqual(['Le lire.', 'Une autre fois.']);
    choose(state, 'noam', 'verdantis', 'Le lire');
  });

  it('the Cendrefer family pays its debt: Hedda gives Tobias’s discount, Rika thanks the one who found Brann’s box', () => {
    const state = atIronheart();
    expect(merchantDiscount(state.flags, 'hedda')).toBe(0);
    state.flags['remise-cendrefer'] = true;
    state.quests['caisse-egaree'] = 'done';
    expect(merchantDiscount(state.flags, 'hedda')).toBe(0.2);
    expect(startNode(DIALOGUES.hedda, state)).toBe('accueil-remise');
    choose(state, 'rika', 'accueil', 'J’ai rapporté sa caisse');
    expect(optionTexts(state, 'rika', 'accueil')).not.toContain('J’ai rapporté sa caisse d’outils, sur la route de l’est.');
  });

  it('Hedda gives the member price of the Compagnie des Lisières', () => {
    const state = atIronheart();
    const before = reputationPrices(state, 'hedda');
    state.flags['membre-compagnie-lisieres'] = true;
    expect(reputationPrices(state, 'hedda')).toBeLessThan(before);
  });
});
