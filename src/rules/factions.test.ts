import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import { parseTiledMap } from '../engine/tiledMap';
import { createNewGame, type GameState } from '../state/gameState';
import { accept, offers, turnIn } from './contrats';
import { applyEffects, opensAtelier, startNode } from './dialogue';
import { echoFlag, ECHOS } from './echos';
import {
  GARDIENS,
  factionRank,
  gardienRank,
  nextGardienRank,
  rankName,
  ranksOf,
  rivalMembership,
  sommetFlag,
  talesCap,
  topClosedBy,
} from './factions';
import { findItem, ownedCount } from './inventory';
import { journalReputation } from './journal';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { RECITS } from './recits';
import { FACTIONS, REPUTATION, findFaction, reputationPrices } from './reputation';
import { voieLevel, voiePlan } from './voies';

/** Les rangs des factions et des Gardiens, les quêtes d'adhésion (docs/gdd/factions.md, jalon 3, étape 7). */
const game = (): GameState => createNewGame(testCharacter());

/** Reputation flags worth at least `points` for a faction (from src/data/reputation.json). */
function raise(state: GameState, faction: string, points: number): void {
  let total = 0;
  for (const s of REPUTATION[faction].filter((x) => x.points > 0).sort((a, b) => b.points - a.points)) {
    if (total >= points) break;
    if (s.flag) state.flags[s.flag] = true;
    else if (s.quest) state.quests[s.quest] = 'done';
    total += s.points;
  }
}

describe('the ranks of the factions', () => {
  it('each faction has three ranks, a leader, a gift at the top, and rivals that name it back', () => {
    for (const f of FACTIONS) {
      const r = ranksOf(f);
      expect(r.rangs, f.id).toHaveLength(3);
      expect(r.avantages, f.id).toHaveLength(3);
      expect(r.chef, f.id).toBeTruthy();
      if (r.don.item) expect(findItem(r.don.item), f.id).toBeDefined();
      for (const rival of r.rivales) expect(ranksOf(findFaction(rival)!).rivales, `${f.id} ↔ ${rival}`).toContain(f.id);
    }
  });

  it('member, then the second rank with the reputation, then the top', () => {
    const state = game();
    expect(factionRank(state, 'travailleurs-rail')).toBe(0);
    state.flags['membre-travailleurs-rail'] = true;
    expect([factionRank(state, 'travailleurs-rail'), rankName('travailleurs-rail', 1)]).toEqual([1, 'Graisseur']);
    state.flags['rail-travailleurs'] = true;
    expect(factionRank(state, 'travailleurs-rail')).toBe(2);
    state.flags[sommetFlag('travailleurs-rail')] = true;
    expect([factionRank(state, 'travailleurs-rail'), rankName('travailleurs-rail', 3)]).toEqual([3, 'Chef de ligne']);
  });

  it('the top comes with its gift, once, and closes the rivals’ top', () => {
    const state = game();
    state.flags['membre-travailleurs-rail'] = true;
    state.flags['membre-marches-cendres'] = true;
    const notices = applyEffects(state, [{ setFlag: 'cle-veilleuse' }, { setFlag: 'rail-travailleurs' }, { setFlag: 'dette-joss-payee' }]);
    expect(notices).toContain('Les Travailleurs du Rail : te voici Chef de ligne');
    expect(notices).toContain('+1 Marteau de forge');
    expect(state.flags[sommetFlag('travailleurs-rail')]).toBe(true);
    expect(topClosedBy(state, 'marches-cendres')?.id).toBe('travailleurs-rail');
    expect(applyEffects(state, [{ giveXp: 1 }]).some((n) => n.includes('Marteau'))).toBe(false);
    // The Marches, however high their opinion climbs now, stay below their top.
    raise(state, 'marches-cendres', 60);
    expect(applyEffects(state, [{ giveXp: 1 }])).not.toContain('+1 Cristal de forge');
    expect(factionRank(state, 'marches-cendres')).toBeLessThan(3);
  });

  it('a member pays less at the guild’s stalls, better with each rank', () => {
    const state = game();
    expect(reputationPrices(state, 'tailleuse')).toBe(0);
    state.flags['membre-marches-cendres'] = true;
    expect(reputationPrices(state, 'tailleuse')).toBe(-0.15);
    raise(state, 'marches-cendres', 20);
    expect(reputationPrices(state, 'tailleuse')).toBe(-0.2);
    state.flags[sommetFlag('marches-cendres')] = true;
    expect(reputationPrices(state, 'tailleuse')).toBe(-0.25);
  });

  it('shows in the journal: the rank beside the opinion', () => {
    const state = game();
    state.flags['membre-compagnie-lisieres'] = true;
    expect(journalReputation(state).find((r) => r.id === 'compagnie-lisieres')).toMatchObject({ member: true, rank: 'Porteur' });
  });
});

describe('the ranks of the Gardiens de Mémoire', () => {
  it('Lanterne at the start; Carnet with five Récits and three contracts; Plume later', () => {
    const state = game();
    expect(gardienRank(state)).toBe(1);
    expect(nextGardienRank(state)).toContain('Carnet');
    state.character!.recits = RECITS.slice(0, GARDIENS.carnet.recits).map((r) => r.id);
    state.contrats.faits = GARDIENS.carnet.contrats;
    expect(gardienRank(state)).toBe(2);
    expect(talesCap(state)).toBe(talesCap({ ...state, contrats: { ...state.contrats, faits: 0 } }) + 1);
    state.contrats.faits = GARDIENS.plume.contrats;
    ECHOS.slice(0, GARDIENS.plume.echos).forEach((e) => (state.flags[echoFlag(e.id)] = true));
    expect(gardienRank(state)).toBe(2);
    state.quests[GARDIENS.plume.quete] = 'done';
    expect(gardienRank(state)).toBe(3);
    expect(nextGardienRank(state)).toBeNull();
  });

  it('a contract fulfilled can raise the hero, and the board says so', () => {
    const state = game();
    state.character!.recits = RECITS.slice(0, GARDIENS.carnet.recits).map((r) => r.id);
    state.contrats.faits = GARDIENS.carnet.contrats - 1;
    const hunt = offers(state, 'gardebois').find((c) => c.kind === 'chasse')!;
    accept(state, hunt);
    applyEffects(state, [{ contrat: 'fait' }]);
    expect(turnIn(state, 'gardebois')).toContain('Gardiens de Mémoire : te voici Carnet (un Récit de plus retenu)');
  });
});

describe('the adhesion quests of Ferros', () => {
  it('Varka: after the Rail des Cendres, the lantern of the yard, found at the Dépôt Sept', () => {
    const state = game();
    state.flags['rail-travailleurs'] = true;
    expect(startNode(DIALOGUES.varka, state)).toBe('apres-rail');
    choose(state, 'varka', 'apres-rail', 'Je voudrais être des vôtres');
    choose(state, 'varka', 'serment', 'J’irai la chercher');
    expect([state.quests['lanterne-triage'], state.flags['connait-depot-sept']]).toEqual(['active', true]);
    // The lantern waits on the second level of the Dépôt Sept, where an Écho would stand.
    state.voie = { site: 'depot-sept', seed: 5, depth: 2 };
    const level = voieLevel(state, parseTiledMap(MAPS[voiePlan(state.voie)]));
    expect(level.objects.some((o) => o.name === 'voie-quete')).toBe(true);
    Object.assign(DIALOGUES, level.dialogues);
    choose(state, 'voie-quete', 'trouve', 'La prendre');
    expect([ownedCount(state.character!, 'lanterne-chef-gare'), state.flags['lanterne-triage-trouvee']]).toEqual([1, true]);
    expect(startNode(DIALOGUES.varka, state)).toBe('lanterne');
    applyEffects(state, DIALOGUES.varka.nodes.lanterne.effects);
    expect([state.quests['lanterne-triage'], factionRank(state, 'travailleurs-rail')]).toEqual(['done', 2]);
  });

  it('Noam: five Échos to classify make a correspondant', () => {
    const state = game();
    choose(state, 'noam', 'tout', 'Les Archives prennent-elles des correspondants');
    choose(state, 'noam', 'correspondant', 'Je reviendrai');
    expect(state.quests['fonds-echos']).toBe('active');
    expect(startNode(DIALOGUES.noam, state)).toBe('accueil');
    ECHOS.slice(0, 5).forEach((e) => (state.flags[echoFlag(e.id)] = true));
    expect(startNode(DIALOGUES.noam, state)).toBe('fonds');
    applyEffects(state, DIALOGUES.noam.nodes.fonds.effects);
    expect(factionRank(state, 'archives-ferros')).toBeGreaterThan(0);
  });

  it('Kaelis: an enamel plate from the tunnel de la Combe, forty Fers, and a name at the Marches', () => {
    const state = game();
    state.quests['cle-rouille-bleue'] = 'done';
    choose(state, 'kaelis', 'apres', 'Les Marches prennent-elles des fournisseurs');
    choose(state, 'kaelis', 'fournisseur', 'Marché conclu');
    expect([state.quests['ce-qui-se-souvient'], state.flags['connait-tunnel-combe']]).toEqual(['active', true]);
    applyEffects(state, [{ giveItem: 'plaque-emaillee' }]);
    expect(startNode(DIALOGUES.kaelis, state)).toBe('plaque');
    const fers = state.character!.fers;
    applyEffects(state, DIALOGUES.kaelis.nodes.plaque.effects);
    expect([state.character!.fers, factionRank(state, 'marches-cendres')]).toEqual([fers + 40, 1]);
  });

  it('a member of a rival is not asked: no Marches for the Archives, no Archives nor Rail for the Marches', () => {
    const state = game();
    state.quests['cle-rouille-bleue'] = 'done';
    state.flags['membre-archives-ferros'] = true;
    expect(rivalMembership(state, 'marches-cendres')?.id).toBe('archives-ferros');
    expect(optionTexts(state, 'kaelis', 'apres')).toEqual(['Au revoir.']);
    const rail = game();
    rail.flags['rail-travailleurs'] = true;
    rail.flags['membre-marches-cendres'] = true;
    expect(optionTexts(rail, 'varka', 'apres-rail')).toEqual(['Au revoir.']);
    expect(optionTexts(rail, 'noam', 'tout')).toEqual(['Je vois.']);
  });

  it('the workshops open from Hedda’s forge and Sévane’s herbs', () => {
    const forge = DIALOGUES.hedda.nodes.forge.options.find((o) => opensAtelier(o.effects));
    const herbes = DIALOGUES.sevane.nodes.herbes.options.find((o) => opensAtelier(o.effects));
    expect([opensAtelier(forge?.effects), opensAtelier(herbes?.effects)]).toEqual(['forge', 'herbes']);
  });
});
