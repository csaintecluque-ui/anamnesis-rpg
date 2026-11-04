import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, raconterOption, startNode, visibleOptions } from './dialogue';
import { factionRank, rivalMembership } from './factions';
import { ownedCount, addItem } from './inventory';
import { learnRecit } from './recits';
import { reputationScore } from './reputation';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { FIRST_FLIGHT_FLAG, findPlace, flightFare, flightSky, payFlight } from './world';

/** Aetherhaven, chapitre 5 (docs/gdd/chapitre-5.md) : le dirigeable, les quêtes de la ville, les deux guildes. */

const game = (): GameState => {
  const state = createNewGame(testCharacter());
  state.quests['memoires-monde-perdu'] = 'done';
  return state;
};
/** Opens a conversation: its first node, whose effects apply (as in the game). */
const start = (state: GameState, id: string) => {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
};

describe('le dirigeable de la Confédération', () => {
  it('Aetherhaven ne se rejoint qu’en dirigeable : le premier vol payé par Hesper, puis 30 Fers, la moitié pour la Compagnie', () => {
    const state = game();
    const sky = findPlace('aetherhaven')!;
    const gardebois = findPlace('gardebois')!;
    expect(flightSky(state, gardebois, sky)).toBe(sky);
    expect(flightSky(state, sky, gardebois)).toBe(sky);
    expect(flightSky(state, gardebois, findPlace('canopee')!)).toBeUndefined();
    expect(flightFare(state, sky)).toBe(0);
    const fers = state.character!.fers;
    expect(payFlight(state, sky)).toBe(true);
    expect(state.character!.fers).toBe(fers);
    expect(state.flags[FIRST_FLIGHT_FLAG]).toBe(true);
    expect(flightFare(state, sky)).toBe(30);
    state.flags['membre-compagnie-vire-nuee'] = true;
    expect(flightFare(state, sky)).toBe(15);
    state.character!.fers = 10;
    expect(payFlight(state, sky)).toBe(false);
  });
});

describe('« Les onze états »', () => {
  it('le carnet du Perchoir, prêté par Ravel, donne l’état juste ; lâché au garde-fou, il plaît aux Ailes Noires', () => {
    const state = game();
    choose(state, 'evrard', 'accueil', 'Je peux vous aider');
    expect(state.quests['onze-etats']).toBe('active');
    expect(start(state, 'ravel')).toBe('carnet');
    choose(state, 'ravel', 'carnet', 'Personne n’imposera');
    expect(ownedCount(state.character!, 'carnet-perchoir')).toBe(1);
    expect(start(state, 'evrard')).toBe('compare');
    expect(state.flags['septieme-juste']).toBe(true);
    expect(ownedCount(state.character!, 'carnet-perchoir')).toBe(0);
    choose(state, 'evrard', 'choix', 'Je la lâcherai');
    expect(state.quests['onze-etats']).toBe('active');
    choose(state, 'voile-lacher', 'voile', 'Lâcher l’état juste');
    expect(state.quests['onze-etats']).toBe('done');
    expect(state.flags['fin-onze-etats-lache']).toBe(true);
    expect(reputationScore(state, 'ailes-noires')).toBe(10);
  });

  it('volé la nuit, le carnet fâche le Perchoir ; porté au Conseil, l’état juste plaît à la Compagnie', () => {
    const state = game();
    choose(state, 'evrard', 'accueil', 'Je peux vous aider');
    state.time.phase = 3;
    choose(state, 'carnet-perchoir', 'carnet', 'Le prendre');
    expect(state.flags['carnet-vole']).toBe(true);
    start(state, 'evrard');
    choose(state, 'evrard', 'choix', 'Au Conseil');
    expect(state.flags['fin-onze-etats-conseil']).toBe(true);
    expect(reputationScore(state, 'ailes-noires')).toBe(-20);
    expect(reputationScore(state, 'compagnie-vire-nuee')).toBe(10);
  });
});

describe('« Le second cristal »', () => {
  it('Céleste : convaincue, un cristal donné, l’état juste en tête, ou tombée', () => {
    for (const [option, fin, extra] of [
      ['Prends un second cristal', 'persuadee', null],
      ['Tiens. Un second cristal', 'cristal', 'cristal-second'],
      ['Voici l’état juste', 'voile', 'voile-septieme'],
    ] as const) {
      const state = game();
      if (extra) addItem(state.character!, extra);
      choose(state, 'odile', 'demande', 'Je vais lui parler');
      expect(start(state, 'celeste')).toBe('avant');
      choose(state, 'celeste', 'avant', option);
      expect(state.flags[`fin-second-cristal-${fin}`], fin).toBe(true);
      expect(start(state, 'odile')).toBe('merci');
    }
    const state = game();
    choose(state, 'odile', 'demande', 'Je vais lui parler');
    choose(state, 'celeste', 'avant', 'C’est ton vol');
    choose(state, 'celeste', 'partie', 'Attendre');
    expect(state.flags['celeste-tombee']).toBe(true);
    expect(start(state, 'odile')).toBe('merci-tombee');
  });
});

describe('« Les voiles dormantes »', () => {
  it('Bastien, Zélie, la doublure du dôme ; la liste recopiée et lâchée, ou confiée', () => {
    const state = game();
    state.time.phase = 3;
    choose(state, 'bastien', 'nuit', 'Pourquoi');
    choose(state, 'bastien', 'pourquoi', 'Et la liste entière');
    choose(state, 'bastien', 'entiere', 'Je la chercherai');
    expect(state.quests['voiles-dormantes']).toBe('active');
    expect(start(state, 'doublure-dome')).toBe('ordinaire');
    expect(start(state, 'zelie')).toBe('listes');
    expect(start(state, 'doublure-dome')).toBe('doublure');
    choose(state, 'doublure-dome', 'doublure', 'Chercher');
    expect(ownedCount(state.character!, 'liste-an-cinquante')).toBe(1);
    expect(optionTexts(state, 'voile-lacher', 'voile')).not.toContain('Recopier la liste de l’an cinquante, et la lâcher.');
    addItem(state.character!, 'tissu-voile');
    choose(state, 'voile-lacher', 'voile', 'Recopier la liste');
    expect(state.flags['fin-voiles-dormantes-lachee']).toBe(true);
    expect(reputationScore(state, 'aetherhaven')).toBe(15);
    const other = game();
    other.quests['voiles-dormantes'] = 'active';
    addItem(other.character!, 'liste-an-cinquante');
    expect(start(other, 'ysolde')).toBe('liste');
    choose(other, 'ysolde', 'liste', 'La lui confier');
    expect(other.flags['fin-voiles-dormantes-registre']).toBe(true);
  });
});

describe('« L’asile »', () => {
  it('la page lue, la Gardienne accorde l’asile ; ou Holger est rendu, et les Archives s’en souviennent', () => {
    const state = game();
    choose(state, 'holger', 'accueil', 'Pourquoi vous rendre');
    choose(state, 'holger', 'pourquoi', 'Montrez-la-moi');
    choose(state, 'holger', 'page', 'Je parlerai');
    expect(start(state, 'gardien-ciel')).toBe('asile');
    choose(state, 'gardien-ciel', 'asile', 'Lisez la page');
    expect(state.flags['fin-asile-defendu']).toBe(true);
    expect(reputationScore(state, 'archives-ferros')).toBe(-10);
    expect(start(state, 'holger')).toBe('defendu');
    const other = game();
    choose(other, 'holger', 'accueil', 'Pourquoi vous rendre');
    choose(other, 'gardien-ciel', 'asile', 'C’est un voleur');
    expect(other.flags['holger-livre']).toBe(true);
    expect(reputationScore(other, 'aetherhaven')).toBe(-10);
  });
});

describe('« L’hirondelle de Siffrin » et « Le convoi de pain »', () => {
  it('Pointe rachetée à l’oiseleur ; le mot sous la cage annonce la Grêle ; la farine sauvée fait un Passager de la Compagnie', () => {
    const state = game();
    state.flags['bande-vue'] = true;
    expect(start(state, 'siffrin')).toBe('pointe');
    choose(state, 'siffrin', 'pointe', 'Je vais voir');
    state.character!.fers = 40;
    expect(start(state, 'oiselier')).toBe('pointe');
    choose(state, 'oiselier', 'pointe', 'Payer trente Fers');
    expect(state.flags['raid-annonce']).toBe(true);
    expect(start(state, 'siffrin')).toBe('retour');
    expect(state.quests.hirondelle).toBe('done');
    choose(state, 'ossiane', 'accueil', 'Les pirates frappent');
    choose(state, 'ossiane', 'raid', 'J’y serai');
    expect(state.flags['convoi-attendu']).toBe(true);
    // La Veuve Grêle vaincue (src/data/encounters.json, raid-quai).
    state.flags['raid-quai-vaincu'] = true;
    state.flags['raid-regle'] = true;
    expect(start(state, 'ossiane')).toBe('raid-sauve');
    expect(state.flags['membre-compagnie-vire-nuee']).toBe(true);
    expect(factionRank(state, 'compagnie-vire-nuee')).toBe(2);
    expect(rivalMembership(state, 'ailes-noires')?.id).toBe('compagnie-vire-nuee');
    expect(optionTexts(state, 'ravel', 'accueil')).not.toContain('Je veux entrer aux Ailes Noires.');
  });

  it('le quart négocié, ou tout laissé aux pirates', () => {
    const state = game();
    state.flags['raid-annonce'] = true;
    choose(state, 'ossiane', 'accueil', 'Les pirates frappent');
    choose(state, 'ossiane', 'raid', 'J’y serai');
    choose(state, 'veuve-grele', 'quai', 'Vous avez faim');
    expect(start(state, 'ossiane')).toBe('raid-quart');
    const lost = game();
    lost.flags['raid-annonce'] = true;
    choose(lost, 'ossiane', 'accueil', 'Les pirates frappent');
    choose(lost, 'ossiane', 'raid', 'J’y serai');
    choose(lost, 'veuve-grele', 'quai', 'Prenez tout');
    expect(start(lost, 'ossiane')).toBe('raid-perdu');
    expect(lost.flags['membre-compagnie-vire-nuee']).toBeUndefined();
  });
});

describe('« La course des îlots » (les Ailes Noires)', () => {
  it('deux sauts gagnés font une Plume, qui descend sous les nuages sans payer', () => {
    const state = game();
    choose(state, 'ravel', 'accueil', 'Je veux entrer');
    choose(state, 'ravel', 'course', 'Courir');
    choose(state, 'ravel', 'saut-1', 'Sauter');
    choose(state, 'ravel', 'saut-2', 'Sauter encore');
    expect(state.flags['membre-ailes-noires']).toBe(true);
    expect(factionRank(state, 'ailes-noires')).toBe(1);
    state.quests['noms-qui-montent'] = 'active';
    state.flags['tiroir-vu'] = true;
    expect(optionTexts(state, 'ravel', 'bas')).toContain('Je suis une Plume. Le vent paie.');
  });
});

describe('Aetherhaven vivante : les habitants écoutent, la veillée du Nid des Nuées', () => {
  it('Siffrin, Ysolde, Vessin, Assel et Zélie écoutent un Récit, une fois chacun, et chacun a son préféré', () => {
    for (const [npc, node, recit] of [
      ['siffrin', 'sifflet', 'echelle-de-pim'],
      ['ysolde', 'compter', 'la-dedicace'],
      ['vessin', 'accueil', 'matricule-4-17'],
      ['assel', 'nouvelles', 'berceuse-de-maelis'],
      ['zelie', 'courant', 'voix-ecorce'],
    ]) {
      const state = game();
      learnRecit(state.character!, recit);
      const option = DIALOGUES[npc].nodes[node].options.find((o) => o.raconter)!;
      const target = raconterOption(option.raconter!, recit).next;
      expect(target, npc).toBe('raconte-special');
      applyEffects(state, DIALOGUES[npc].nodes[target].effects);
      expect(visibleOptions(DIALOGUES[npc].nodes[node], state).some((v) => v.option.raconter), npc).toBe(false);
    }
  });

  it('Assel ouvre la veillée ; ses rumeurs rendent le carnet du Perchoir et la doublure du dôme plus faciles', () => {
    const state = game();
    expect(optionTexts(state, 'assel', 'accueil')).toContain('Raconter un Récit à la veillée.');
    state.quests['onze-etats'] = 'active';
    state.time.phase = 3;
    const rolls = () => visibleOptions(DIALOGUES['carnet-perchoir'].nodes.carnet, state).flatMap((v) => (v.option.roll ? [v.option.roll.difficulty] : []));
    expect(rolls()).toEqual([15]);
    state.flags['rumeur-perchoir-sommeil'] = true;
    expect(rolls()).toEqual([15, 12]);
    state.flags['dome-indice'] = true;
    expect(optionTexts(state, 'doublure-dome', 'doublure')).toHaveLength(2);
    state.flags['rumeur-doublure'] = true;
    expect(optionTexts(state, 'doublure-dome', 'doublure')).toHaveLength(3);
  });
});
