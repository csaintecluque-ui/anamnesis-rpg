import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { findObject, parseTiledMap } from '../engine/tiledMap';
import { createNewGame } from '../state/gameState';
import { applyEffects, hasStoryEntry, startNode, visibleOptions } from './dialogue';
import { FIGURANTS } from './figurants';
import { ownedCount } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { knowsRecit } from './recits';
import { FACTIONS, reputationLevel, reputationPrices, reputationScore, reputationTag } from './reputation';
import { RENCONTRES, pickRencontre, storyRencontre } from './world';

/** « Les graines qui manquent », « Le carnet de chansons », « La caravane de midi » (docs/univers/quetes.md). */
describe('Les graines qui manquent', () => {
  it('starts with Véline, finds Elvan through Lisandre, and offers three endings', () => {
    const state = createNewGame(testCharacter());
    state.flags['canopee-accueillie'] = true;
    expect(startNode(DIALOGUES.veline, state)).toBe('retour');
    choose(state, 'veline', 'retour', 'Quoi de neuf');
    expect(state.quests.graines).toBe('active');
    expect(startNode(DIALOGUES.elvan, state)).toBe('accueil');
    choose(state, 'lisandre', 'nouvelles', 'Il manque des graines');
    expect(state.flags['indice-elvan']).toBe(true);
    expect(startNode(DIALOGUES.elvan, state)).toBe('confrontation');
    // Without proof or sharp eyes, only the roll is left.
    const views = visibleOptions(DIALOGUES.elvan.nodes.confrontation, state);
    expect(views.map((v) => v.option.text)).not.toContain('Ce sceau à tête de cerf, entre les sacs du grenier, c’est le tien.');
    expect(views.find((v) => v.option.roll)?.option.failNext).toBe('refus');

    const outcomes: Record<string, number> = {};
    for (const [text, flag] of [
      ['Je vais le dire', 'graines-denonce'],
      ['Partageons', 'graines-silence'],
    ] as const) {
      const s = structuredClone(state);
      s.character!.attributes.perception = 4;
      choose(s, 'elvan', 'confrontation', 'Ton ballot brille');
      choose(s, 'elvan', 'aveu', text);
      expect(s.quests.graines).toBe('done');
      expect(s.flags[flag]).toBe(true);
      outcomes[flag] = reputationScore(s, 'canopee');
    }
    expect(outcomes['graines-denonce']).toBeGreaterThan(outcomes['graines-silence']);
  });

  it('turns the stolen sack into a second chance', () => {
    const state = createNewGame(testCharacter());
    applyEffects(state, DIALOGUES['graines-conseil'].nodes.sacs.options.find((o) => o.next === 'pris')!.effects);
    expect(reputationLevel(state, 'canopee').id).toBe('mefiance');
    state.flags['veline-vol-dit'] = true;
    expect(startNode(DIALOGUES.veline, state)).toBe('soupcon');
    choose(state, 'veline', 'soupcon', 'C’était moi. Voici');
    expect(ownedCount(state.character!, 'graines-lumiere')).toBe(0);
    expect(reputationScore(state, 'canopee')).toBe(0);
    expect(state.quests.graines).toBe('active');
  });

  it('rewards Investigation 2 in the granary with the seal, which proves it', () => {
    const state = createNewGame(testCharacter({}, { investigation: 2 }));
    state.quests.graines = 'active';
    choose(state, 'graines-conseil', 'sacs', 'Examiner');
    expect(state.flags['preuve-sceau']).toBe(true);
    expect(optionTexts(state, 'elvan', 'confrontation')[0]).toMatch(/sceau/);
    choose(state, 'elvan', 'confrontation', 'Ce sceau');
    state.character!.skills.diplomacy = 3;
    choose(state, 'elvan', 'aveu', 'Rapporte-les');
    expect(reputationScore(state, 'compagnie-lisieres')).toBe(5);
    expect(startNode(DIALOGUES.elvan, state)).toBe('apres-rendu');
    expect(startNode(DIALOGUES.veline, state)).toBe('graines-merci');
  });

  it('puts Elvan at the Nid, until he is denounced', () => {
    const nid = parseTiledMap(MAPS['canopee-auberge']);
    expect(findObject(nid, 'elvan')?.properties.disparaitSi).toBe('graines-denonce');
  });
});

describe('Le carnet de chansons', () => {
  it('carries Mirelle’s notebook to Ilyane, who sings page seventeen', () => {
    const state = createNewGame(testCharacter());
    choose(state, 'mirelle', 'ilyane', 'Je peux le lui rapporter');
    expect(state.quests['carnet-chansons']).toBe('active');
    expect(startNode(DIALOGUES.ilyane, state)).toBe('carnet');
    choose(state, 'ilyane', 'carnet', 'La dix-sept');
    expect(state.quests['carnet-chansons']).toBe('done');
    expect(knowsRecit(state.character!, 'deux-apprenties')).toBe(true);
    expect(ownedCount(state.character!, 'carnet-chansons')).toBe(0);
    expect(optionTexts(state, 'mirelle', 'ilyane')).toContain('Je le lui ai rendu.');
  });

  it('still lends the song to Elouan once the notebook has left', () => {
    const state = createNewGame(testCharacter());
    state.quests['chant-anselme'] = 'active';
    state.quests['carnet-chansons'] = 'done';
    expect(startNode(DIALOGUES.mirelle, state)).toBe('chanson-copie');
    applyEffects(state, DIALOGUES.mirelle.nodes['chanson-copie'].effects);
    expect(state.flags['melodie-carnet']).toBe(true);
  });
});

describe('La caravane de midi', () => {
  it('turns the hurried commis into a quest giver, then back into a passer-by', () => {
    const commis = FIGURANTS.find((f) => f.id === 'commis-ferros')!;
    const state = createNewGame(testCharacter());
    expect(commis.dialogue).toBe('commis-caravane');
    expect(hasStoryEntry(DIALOGUES['commis-caravane'], state)).toBe(true);
    choose(state, 'commis-caravane', 'presse', 'Je peux la porter');
    expect(ownedCount(state.character!, 'sacoche-compagnie')).toBe(1);
    expect(startNode(DIALOGUES['commis-caravane'], state)).toBe('attente');

    // On the road: the wolves wait once, whatever the zone, and never at random.
    expect(storyRencontre(state, 'lisiere')?.id).toBe('loups-caravane');
    expect(RENCONTRES.find((r) => r.id === 'loups-caravane')?.avoid?.skill).toBe('survival');
    for (let i = 0; i < 50; i++) expect(pickRencontre('lisiere', () => i / 50)?.id).not.toBe('loups-caravane');
    state.flags['loups-caravane'] = true;
    expect(storyRencontre(state, 'lisiere')).toBeNull();

    expect(startNode(DIALOGUES.veline, state)).toBe('caravane');
    choose(state, 'veline', 'caravane', 'La voici');
    expect(state.quests['caravane-midi']).toBe('done');
    expect(state.flags['membre-compagnie-lisieres']).toBe(true);
    expect(hasStoryEntry(DIALOGUES['commis-caravane'], state)).toBe(false);
  });
});

describe('guildes', () => {
  it('names guilds apart from towns, and gives members their prices at Tobias', () => {
    expect(FACTIONS.map((f) => f.id).slice(0, 2)).toEqual(['compagnie-lisieres', 'nacelliers']);
    expect(reputationTag('compagnie-lisieres', 25)).toBe('Réputation auprès de la Compagnie des Lisières : on te fait confiance');
    expect(reputationTag('canopee', 10)).toBe('Réputation à Canopéa : on t’apprécie');
    const state = createNewGame(testCharacter());
    expect(reputationPrices(state, 'tobias')).toBe(0);
    state.flags['membre-compagnie-lisieres'] = true;
    expect(reputationPrices(state, 'tobias')).toBe(-0.15);
    expect(reputationPrices(state, 'sevane')).toBe(0);
  });

  it('counts the Nacelliers’ friendship from Malo’s letters', () => {
    const state = createNewGame();
    state.quests['lettres-malo'] = 'done';
    expect(reputationLevel(state, 'nacelliers').id).toBe('estime');
  });
});
