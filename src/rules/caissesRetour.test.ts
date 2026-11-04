import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, startNode } from './dialogue';
import { filPage } from './fil';
import { ownedCount } from './inventory';
import { choose, testCharacter } from './questTestKit';

/**
 * Les trois caisses des continents déjà joués (docs/gdd/fil-directeur.md, validé ; Cyril, 2026-11-04 : « 4 oui ») :
 * au retour dans chaque ville, après « Les noms qui montent ». Ce qu'on a fait de la clé et de la ligne décide.
 */

const after = (flags: string[] = []): GameState => {
  const state = createNewGame(testCharacter());
  for (const q of ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu', 'noms-qui-montent']) state.quests[q] = 'done';
  for (const f of flags) state.flags[f] = true;
  return state;
};
const talk = (state: GameState, id: string) => {
  const node = startNode(DIALOGUES[id], state);
  applyEffects(state, DIALOGUES[id].nodes[node].effects);
  return node;
};
const caisse = (state: GameState, continent: string) => filPage(state).caisses.find((c) => c.continent === continent)?.etat;

describe('Verdantis : ce que cherchait la foreuse', () => {
  it('Ilyane a gardé les papiers ; sous la Faille, le quai sept et la caisse', () => {
    const state = after();
    expect(talk(state, 'ilyane')).toBe('papiers-prospection');
    choose(state, 'ilyane', 'papiers-prospection', 'Lire la ligne');
    choose(state, 'ilyane', 'papiers-ligne', 'Oui. Je vais');
    expect(filPage(state).piste?.cible).toBe('gardebois');
    expect(talk(state, 'faille-descente')).toBe('bord');
    choose(state, 'faille-descente', 'bord', 'Descendre par la corde');
    choose(state, 'faille-descente', 'ouverte', 'Prendre la pièce');
    expect(ownedCount(state.character!, 'piece-verdantis')).toBe(1);
    expect(caisse(state, 'Verdantis')).toBe('trouvee');
    expect(talk(state, 'faille-descente')).toBe('faille');
  });
});

describe('Ferros : sous la cendre', () => {
  it('la clé confiée à Noam : le carnet de bord mène à la Cendrière', () => {
    const state = after(['cle-archives']);
    expect(talk(state, 'noam')).toBe('carnet-cendriere');
    choose(state, 'noam', 'carnet-cendriere', 'Je vais à la Cendrière');
    expect(state.flags['caisse-ferros-cherchee']).toBe(true);
    choose(state, 'caisse-ferros', 'tas', 'Dégager');
    choose(state, 'caisse-ferros', 'caisse', 'Faire classer');
    expect(state.flags['fin-caisse-cendriere-archives']).toBe(true);
    expect(caisse(state, 'Ferros')).toBe('trouvee');
  });

  it('la clé rendue à la Veilleuse : elle chante à l’aiguillage de la Cendrière', () => {
    const state = after(['cle-veilleuse']);
    expect(talk(state, 'veilleuse')).toBe('cle-cendriere');
  });

  it('la clé vendue à Kaelis : les gants fins sont passés avant', () => {
    const state = after(['cle-vendue']);
    expect(talk(state, 'kaelis')).toBe('gants-cendriere');
    choose(state, 'kaelis', 'gants-cendriere', 'Ils avaient la clé');
    choose(state, 'kaelis', 'gants-cle', 'Partir');
    expect(state.quests['caisse-cendriere']).toBe('done');
    expect(caisse(state, 'Ferros')).toBe('prise');
  });
});

describe('Terminus : la caisse sans main', () => {
  it('Ambroise ouvre le Fonds Muet ; la caisse reçoit enfin une main', () => {
    const state = after();
    expect(talk(state, 'ambroise')).toBe('sans-main');
    choose(state, 'ambroise', 'sans-main-2', 'Je descends');
    choose(state, 'caisse-terminus', 'caisse', 'Rompre le plomb');
    choose(state, 'caisse-terminus', 'ouverte', 'La confier');
    expect(state.flags['fin-caisse-sans-main-confiee']).toBe(true);
    expect(caisse(state, 'Terminus')).toBe('trouvee');
  });

  it('la ligne vendue à la dame en gris : le monte-charge a été forcé par en dessous', () => {
    const state = after(['fin-memoires-monde-perdu-vendue']);
    expect(talk(state, 'ambroise')).toBe('sans-main-vide');
    choose(state, 'ambroise', 'sans-main-vide-2', 'Partir');
    expect(caisse(state, 'Terminus')).toBe('prise');
  });
});
