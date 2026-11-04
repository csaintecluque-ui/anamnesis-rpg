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

describe('les quêtes de Coralia', () => {
  it('la conque muette : Oaïna, puis Basile, la nuit, et le Récit « Le chant qu’on ne chante pas »', () => {
    const state = game();
    choose(state, 'oaina', 'accueil', 'Certaines conques se taisent');
    state.time.phase = 3;
    expect(talk(state, 'basile')).toBe('chant');
    choose(state, 'basile', 'chant', 'Ça vous fait de la peine');
    expect(state.character!.recits).toContain('chant-qu-on-ne-chante-pas');
  });

  it('le Don rendu : Aïo, Tadéo ; la vérité dite à Amande', () => {
    const state = game();
    choose(state, 'amande', 'bague', 'Je vais chercher pourquoi');
    choose(state, 'aio', 'accueil', 'Les plongeurs remontent');
    expect(talk(state, 'tadeo')).toBe('aveu');
    choose(state, 'tadeo', 'aveu', 'Et ?');
    expect(talk(state, 'amande')).toBe('choix');
    choose(state, 'amande', 'choix', 'La mer ne l’a pas rendue');
    expect(state.flags['fin-don-rendu-verite']).toBe(true);
  });

  it('sous une lune rouge : Aïo parti seul revient sans le nom de sa mère', () => {
    const state = game();
    state.location = 'coralia-coquelune';
    expect(talk(state, 'aio')).toBe('lune');
    choose(state, 'aio', 'lune', 'C’est ton choix');
    expect(state.flags['aio-oublie']).toBe(true);
    expect(talk(state, 'iris-coquelune')).toBe('oubli');
  });

  it('le Cargo Noir : le journal de Gunnar, confié à la Confrérie, fâche les Plongeurs', () => {
    const state = game();
    choose(state, 'gunnar', 'accueil', 'Que s’est-il passé');
    choose(state, 'gunnar', 'passe', 'Montrez-moi le journal');
    expect(ownedCount(state.character!, 'journal-cargo')).toBe(1);
    choose(state, 'matteo', 'accueil', 'La Confrérie en fera meilleur usage');
    expect(state.flags['fin-cargo-noir-confrerie']).toBe(true);
  });

  it('la grotte du Grand Reflux : les Abyssaux renvoyés à leurs mots, Lio ramené à Euria', () => {
    const state = game();
    state.quests['mer-rend'] = 'done';
    expect(talk(state, 'euria')).toBe('lio');
    choose(state, 'euria', 'lio', 'J’y vais');
    choose(state, 'abyssaux-grotte', 'abyssaux', '« Tout », c’est vague');
    expect(talk(state, 'lio')).toBe('libre');
    expect(talk(state, 'euria')).toBe('retour-parole');
    expect(state.flags['fin-grotte-reflux-parole']).toBe(true);
  });

  it('les guildes : la Confrérie par la paie du Bel-Écart, les Plongeurs par la première perle ; l’une ferme l’autre', () => {
    const state = game();
    choose(state, 'matteo', 'accueil', 'Je veux entrer à la Confrérie');
    choose(state, 'matteo', 'paie', 'J’y vais');
    state.flags['rumeur-bel-ecart'] = true;
    choose(state, 'doucenet', 'paie', 'Vous avez vendu la cargaison');
    expect(talk(state, 'matteo')).toBe('paie-faite');
    expect(state.flags['membre-confrerie-brisants']).toBe(true);
    expect(optionTexts(state, 'ondine', 'accueil')).not.toContain('Je veux plonger avec vous.');
    expect(flightFare({ ...state, flags: { ...state.flags, [FIRST_CROSSING_FLAG]: true } }, findPlace('coralia')!)).toBe(20);
    const diver = game();
    choose(diver, 'ondine', 'accueil', 'Je veux plonger avec vous');
    choose(diver, 'ondine', 'perle', 'J’y vais');
    choose(diver, 'banc-perles', 'banc', 'Plonger');
    expect(talk(diver, 'ondine')).toBe('perle-apportee');
    expect(diver.flags['membre-plongeurs-perles']).toBe(true);
  });
});
