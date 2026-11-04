import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, performRoll, raconterOption, visibleOptions } from './dialogue';
import { addItem, ownedCount } from './inventory';
import { knowsRecit, learnRecit } from './recits';
import { choose, optionTexts, testCharacter } from './questTestKit';

/** Étude du 2026-11-03, vague 3, bloc B : ce qui brille sous le pont, et les habitants qui écoutent (Gardebois). */

const game = (): GameState => createNewGame(testCharacter());
/** Tells this Récit through the « raconter » option of a node: where it leads, and that node's effects. */
const tell = (state: GameState, dialogue: string, node: string, recit: string): string => {
  const option = DIALOGUES[dialogue].nodes[node].options.find((o) => o.raconter)!;
  const target = raconterOption(option.raconter!, recit).next;
  applyEffects(state, DIALOGUES[dialogue].nodes[target].effects);
  return target;
};

describe('ce qui brille sous le pont de Gardebois (H4)', () => {
  it('une boîte au fond du ruisseau : on glisse et l’on réessaie le lendemain, ou on l’attrape', () => {
    const state = game();
    const roll = DIALOGUES['reflet-pont'].nodes.regard.options[0].roll!;
    // Raté : deux PV, et l'option attend le lendemain.
    const hp = state.character!.hp;
    applyEffects(state, DIALOGUES['reflet-pont'].nodes.glisse.effects);
    expect(state.character!.hp).toBe(hp - 2);
    expect(optionTexts(state, 'reflet-pont', 'regard')).toEqual(['Laisser ça au ruisseau.']);
    // Réussi : la boîte du passeur.
    const lucky = game();
    expect(performRoll(lucky, roll, () => 0.99).success).toBe(true);
    applyEffects(lucky, DIALOGUES['reflet-pont'].nodes.boite.effects);
    expect(ownedCount(lucky.character!, 'boite-odon')).toBe(1);
    expect(lucky.flags['boite-odon-prise']).toBe(true);
  });

  it('Sylvan reconnaît la boîte d’Odon Passe-Rive : le Récit de Gardebois', () => {
    const state = game();
    expect(optionTexts(state, 'sylvan', 'rumeurs')).not.toContain('J’ai repêché cette boîte sous le pont.');
    addItem(state.character!, 'boite-odon');
    choose(state, 'sylvan', 'rumeurs', 'J’ai repêché cette boîte');
    choose(state, 'sylvan', 'odon', 'Que dit la dernière page ?');
    expect(knowsRecit(state.character!, 'odon-passe-rive')).toBe(true);
    expect(ownedCount(state.character!, 'boite-odon')).toBe(0);
  });
});

describe('les habitants de Gardebois écoutent un Récit, une fois chacun (D3)', () => {
  const cases: [string, string, string, string][] = [
    ['tobias', 'rumeurs', 'jeudi-ordinaire', 'raconte-jeudi'],
    ['maelis', 'apres', 'saule', 'raconte-saule'],
    ['nell', 'apres', 'berceuse-de-maelis', 'raconte-berceuse'],
    ['brann', 'apres', 'savant-corvan', 'raconte-savant'],
    ['liane', 'apres', 'voix-ecorce', 'raconte-bosquet'],
  ];

  it('chacun a sa réponse à un Récit précis, une autre à ce qu’il aime, une pour le reste', () => {
    for (const [npc, node, recit, special] of cases) {
      const state = game();
      learnRecit(state.character!, recit);
      expect(tell(state, npc, node, recit), npc).toBe(special);
      // Once told, the option is gone.
      expect(visibleOptions(DIALOGUES[npc].nodes[node], state).some((v) => v.option.raconter), npc).toBe(false);
    }
  });

  it('l’histoire rapporte : de l’expérience, et chez Tobias des Fers', () => {
    const state = game();
    learnRecit(state.character!, 'jeudi-ordinaire');
    const fers = state.character!.fers;
    tell(state, 'tobias', 'rumeurs', 'jeudi-ordinaire');
    expect(state.character!.fers).toBe(fers + 20);
  });
});

describe('Canopéa : l’échelle aux rubans et le nom de Pim (H4, F4)', () => {
  it('les rubans disent un nom ; on peut en nouer un, une fois', () => {
    const state = game();
    choose(state, 'rubans-echelle', 'regard', 'Nouer un ruban');
    expect(state.flags['ruban-noue']).toBe(true);
    expect(optionTexts(state, 'rubans-echelle', 'regard')).toEqual(['Laisser l’échelle.']);
  });

  it('au Bosquet, avec Mémoire 3, la main sur le nom donne le souvenir de sa sœur et le Récit de Canopéa', () => {
    const forgetful = createNewGame(testCharacter({ memory: 2 }));
    const view = visibleOptions(DIALOGUES['nom-pim'].nodes.nom, forgetful).find((v) => v.option.text.startsWith('Poser la main'));
    expect(view?.enabled).toBe(false);
    const state = game();
    choose(state, 'nom-pim', 'nom', 'Poser la main');
    expect(knowsRecit(state.character!, 'echelle-de-pim')).toBe(true);
  });
});

describe('les habitants de Canopéa écoutent un Récit, une fois chacun (D3)', () => {
  it('Elouan, Aïlis, Tiven et Malo ont chacun leur Récit préféré', () => {
    for (const [npc, node, recit, special] of [
      ['elouan', 'accueil', 'berceuse-de-maelis', 'raconte-berceuse'],
      ['ailis', 'accueil', 'saule', 'raconte-saule'],
      ['tiven', 'gueri', 'odon-passe-rive', 'raconte-odon'],
      ['malo', 'ami', 'echelle-de-pim', 'raconte-pim'],
    ]) {
      const state = game();
      learnRecit(state.character!, recit);
      expect(tell(state, npc, node, recit), npc).toBe(special);
      expect(visibleOptions(DIALOGUES[npc].nodes[node], state).some((v) => v.option.raconter), npc).toBe(false);
    }
  });
});
