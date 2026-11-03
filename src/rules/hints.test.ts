import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import type { MapObject } from '../engine/tiledMap';
import { createNewGame } from '../state/gameState';
import { visibleOptions } from './dialogue';
import { echoFlag } from './echos';
import { mapObjectHint, optionHint } from './hints';
import { testCharacter } from './questTestKit';

/** Ce que dit l'infobulle (feuille de route, chantier 0, « PC d'abord »). */
const at = (name: string, type: string, properties: Record<string, string> = {}): MapObject => ({ name, type, col: 1, row: 1, properties });

describe('the tooltip of the map', () => {
  it('says who one would speak to, where a door leads, and whether it is shut', () => {
    const state = createNewGame(testCharacter());
    expect(mapObjectHint(at('ilyane', 'pnj'), state)).toBe('Ilyane Voix-d’Écorce — parler');
    expect(mapObjectHint(at('porte-auberge', 'porte', { libelle: 'Auberge de la Racine' }), state)).toBe('Auberge de la Racine — entrer');
    const fonds = at('porte-fonds-muet', 'porte', { libelle: 'Le Fonds Muet', verrou: 'fonds-muet-ouvert' });
    expect(mapObjectHint(fonds, state)).toBe('Le Fonds Muet — fermée');
    state.flags['fonds-muet-ouvert'] = true;
    expect(mapObjectHint(fonds, state)).toBe('Le Fonds Muet — entrer');
    expect(mapObjectHint(at('vers-monde', 'sortie', { libelle: 'Quitter Gardebois' }), state)).toBe('Quitter Gardebois');
  });

  it('names the beasts, the crates, the boards, and the Échos once gathered', () => {
    const state = createNewGame(testCharacter());
    expect(mapObjectHint(at('voie-ennemi-1-1', 'ennemi', { ennemi: 'loup-rouille' }), state)).toBe('Loup de Rouille — combattre');
    expect(mapObjectHint(at('voie-coffre-1', 'objet', { tuile: 'caisses', lueur: 'oui' }), state)).toBe('Une caisse qui luit — la fouiller');
    expect(mapObjectHint(at('tableau-contrats', 'objet', { tuile: 'panneau', contrats: 'gardebois' }), state)).toBe('Tableau des contrats — le lire');
    const echo = at('echo-trois-cents', 'objet', { tuile: 'echo', echo: 'trois-cents' });
    expect(mapObjectHint(echo, state)).toBe('Un Écho — l’écouter');
    state.flags[echoFlag('trois-cents')] = true;
    expect(mapObjectHint(echo, state)).toBe('Écho recueilli : Les Trois Cents — le revoir');
  });
});

describe('the tooltip of a dialogue option', () => {
  it('gives the roll and the chances, or what a test asks', () => {
    const state = createNewGame(testCharacter({}, { subterfuge: 2, diplomacy: 1 }));
    state.quests['memoires-monde-perdu'] = 'active';
    state.flags['registre-lu'] = true;
    const [ruse] = visibleOptions(DIALOGUES['registre-consultations'].nodes.registre, state);
    expect(optionHint(ruse, state)).toMatch(/^Jet : un d20 [+−] \d+ \(Subterfuge\) contre 14\.\nChances : \d+ %/);
    const [diplomacy] = visibleOptions(DIALOGUES.ambroise.nodes.demande, state);
    expect(optionHint(diplomacy, state)).toBe('Il faut Diplomatie 4 : tu as 1 (rang 1, Présence +0).');
    const leave = visibleOptions(DIALOGUES.ambroise.nodes.demande, state).at(-1)!;
    expect(optionHint(leave, state)).toBeNull();
  });
});
