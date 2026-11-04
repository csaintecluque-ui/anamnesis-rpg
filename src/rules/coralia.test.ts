import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { applyEffects, startNode } from './dialogue';
import { filPage } from './fil';
import { ownedCount } from './inventory';
import { mapAtTide, mareeBasse } from './marees';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { FIRST_CROSSING_FLAG, findPlace, flightFare, flightSky, flightTimeLabel, payFlight } from './world';

/** Coralia, chapitre 6 (docs/gdd/chapitre-6.md, validé par Cyril le 2026-11-04). */

const game = (): GameState => {
  const state = createNewGame(testCharacter());
  for (const q of ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu', 'noms-qui-montent']) state.quests[q] = 'done';
  state.flags['caisse-zephyria-reglee'] = true;
  return state;
};
const talk = (state: GameState, id: string) => {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
};
const caisse = (state: GameState) => filPage(state).caisses.find((c) => c.continent === 'Marisol')?.etat;

describe('les marées et le navire', () => {
  it('la mer se retire le matin et le soir : le Grand Port montre alors sa carte de marée basse', () => {
    const port = findLocation('coralia-port')!;
    const at = (phase: number) => mapAtTide(port, { day: 3, phase });
    expect([0, 1, 2, 3].map((phase) => mareeBasse({ day: 3, phase }))).toEqual([true, false, true, false]);
    expect([at(0), at(1), at(2), at(3)]).toEqual(['coralia-port-reflux', 'coralia-port', 'coralia-port-reflux', 'coralia-port']);
    expect(mapAtTide(findLocation('coralia-canaux')!, { day: 3, phase: 0 })).toBe('coralia-canaux');
  });

  it('Coralia ne se rejoint qu’en navire : la première traversée payée par Hesper, puis 40 Fers, deux jours', () => {
    const state = game();
    const coralia = findPlace('coralia')!;
    expect(flightSky(state, findPlace('sept-portes')!, coralia)).toBe(coralia);
    expect(flightTimeLabel(coralia)).toBe('deux jours en navire');
    expect(flightFare(state, coralia)).toBe(0);
    expect(payFlight(state, coralia)).toBe(true);
    expect(state.flags[FIRST_CROSSING_FLAG]).toBe(true);
    expect(flightFare(state, coralia)).toBe(40);
    // Le dirigeable a son propre premier vol.
    expect(flightFare(state, findPlace('aetherhaven')!)).toBe(0);
  });
});

describe('« Ce que la mer rend »', () => {
  it('l’avis de l’Entrepôt lance la quête ; l’ordre de la Grande Amiral ouvre la porte', () => {
    const state = game();
    expect(talk(state, 'porte-entrepot')).toBe('avis');
    expect(state.quests['mer-rend']).toBe('active');
    expect(talk(state, 'marina-azurios')).toBe('audience');
    choose(state, 'marina-azurios', 'audience', 'Une pièce d’une machine');
    expect(ownedCount(state.character!, 'ordre-amiraute')).toBe(1);
    expect(talk(state, 'merande')).toBe('garde');
    choose(state, 'merande', 'garde', 'Voici un ordre');
    expect(state.flags['entrepot-ouvert']).toBe(true);
  });

  it('Euria, Oaïna et la dame en gris : la mer a rendu ce qu’on lui demandait ; rendue à la mer, la caisse est réglée', () => {
    const state = game();
    talk(state, 'porte-entrepot');
    expect(talk(state, 'euria')).toBe('don');
    choose(state, 'euria', 'don', 'Que faut-il faire');
    expect(talk(state, 'oaina')).toBe('qui');
    expect(talk(state, 'edda-coralia')).toBe('conque');
    choose(state, 'edda-coralia', 'conque', 'Votre mère');
    choose(state, 'edda-coralia', 'mere', 'Laissez-moi l’écouter');
    expect(state.flags['conque-ecoutee']).toBe(true);
    choose(state, 'caisse-marisol', 'caisse', 'L’ouvrir');
    expect(optionTexts(state, 'caisse-marisol', 'ouverte')).toHaveLength(4);
    choose(state, 'caisse-marisol', 'ouverte', 'La rendre à la mer');
    expect(state.quests['mer-rend']).toBe('done');
    expect(state.flags['fin-mer-rend-rendue']).toBe(true);
    expect(caisse(state)).toBe('trouvee');
  });

  it('par la cale, à marée basse ; laissée à la dame en gris, la caisse est prise', () => {
    const state = game();
    talk(state, 'porte-entrepot');
    talk(state, 'edda-coralia');
    choose(state, 'cale-entrepot', 'cale', 'Passer par la cale');
    choose(state, 'caisse-marisol', 'caisse', 'L’ouvrir');
    choose(state, 'caisse-marisol', 'ouverte', 'La laisser à la dame en gris');
    expect(caisse(state)).toBe('prise');
    expect(talk(state, 'noea')).toBe('lettre-prise');
  });

  it('un mensonge en mer ferme la parole avec la capitaine des douanes', () => {
    const state = game();
    talk(state, 'porte-entrepot');
    applyEffects(state, DIALOGUES.merande.nodes.mensonge.effects);
    expect(optionTexts(state, 'merande', 'garde')).toEqual(['Je reviendrai.']);
  });
});
