import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { joinParty, avisOf } from './companions';
import { opensVeillee, visibleOptions } from './dialogue';
import { ownedCount } from './inventory';
import { RECITS, learnRecit } from './recits';
import { choose, optionTexts, testCharacter } from './questTestKit';
import { REPUTATION, reputationScore } from './reputation';
import { momentOf } from './time';
import {
  PUBLICS,
  THEMES,
  VEILLEE,
  findPublic,
  heardRumeurs,
  renown,
  renownFlag,
  rumeurFlag,
  tell,
  tellingDifficulty,
  tellingSkill,
  toldFlag,
  veilleeChoices,
  type Theme,
} from './veillees';

/** Les veillées du conteur (docs/gdd/veillees.md, jalon 3, étape 4). */

/** A hero at the inn, in the evening, who retains these Récits. */
function evening(recits: string[], presence = 3, skills: Partial<Record<'diplomacy' | 'command' | 'subterfuge', number>> = {}): GameState {
  const state = createNewGame(testCharacter({ presence, memory: 9 }, skills));
  state.time = { day: 1, phase: 2 };
  for (const id of recits) learnRecit(state.character!, id);
  return state;
}

/** A d20 that rolls this face. */
const die = (face: number) => () => (face - 1) / 20;

describe('the publics of the veillées', () => {
  it('meet at the three inns, each with its host, its town and its tastes', () => {
    expect(PUBLICS.map((p) => p.id)).toEqual(['racine', 'nid', 'bielle']);
    for (const p of PUBLICS) {
      expect(findLocation(p.lieu), p.id).toBeDefined();
      expect(DIALOGUES[p.hote], p.id).toBeDefined();
      expect(REPUTATION[p.ville], p.id).toBeDefined();
      for (const t of [...p.aime, ...p.deteste]) expect(Object.keys(THEMES), `${p.id} : ${t}`).toContain(t);
      expect(p.aime.some((t) => p.deteste.includes(t)), p.id).toBe(false);
      expect(Object.keys(p.reactions).sort()).toEqual(['deteste', 'echec', 'redite', 'succes', 'triomphe']);
      expect(p.rumeurs).toHaveLength(2);
    }
  });

  it('every Récit speaks of known themes, and each public loves some of them', () => {
    for (const r of RECITS) {
      expect(r.themes?.length, r.id).toBeGreaterThan(0);
      for (const t of r.themes ?? []) expect(Object.keys(THEMES), `${r.id} : ${t}`).toContain(t);
    }
    for (const p of PUBLICS) expect(RECITS.filter((r) => r.themes?.some((t) => p.aime.includes(t as Theme))).length, p.id).toBeGreaterThanOrEqual(3);
  });

  it('the innkeeper opens the veillée, whatever the day', () => {
    for (const p of PUBLICS) {
      for (const node of ['accueil', 'accueil-2', 'accueil-3']) {
        const option = DIALOGUES[p.hote].nodes[node].options.find((o) => opensVeillee(o.effects));
        expect(opensVeillee(option?.effects), `${p.hote}/${node}`).toBe(p.id);
      }
    }
    expect(optionTexts(evening([]), 'lisandre', 'accueil')).toEqual(['Manger ou dormir ?', 'Quelles nouvelles ?', 'Raconter un Récit à la veillée.', 'Au revoir.']);
  });
});

describe('telling a Récit', () => {
  it('is easier when the public loves its theme, harder when it dislikes it or knows it', () => {
    const state = evening([]);
    const racine = findPublic('racine')!;
    const recit = (id: string) => RECITS.find((r) => r.id === id)!;
    expect(tellingDifficulty(state, racine, recit('berceuse-de-maelis'))).toBe(8);
    expect(tellingDifficulty(state, racine, recit('kael-chroniqueur'))).toBe(12);
    expect(tellingDifficulty(state, racine, recit('voix-ecorce'))).toBe(16);
    expect(tellingDifficulty(state, racine, recit('saule'))).toBe(12);
    state.flags[toldFlag('racine', 'berceuse-de-maelis')] = true;
    expect(tellingDifficulty(state, racine, recit('berceuse-de-maelis'))).toBe(10);
  });

  it('uses the best of Diplomatie, Commandement and Subterfuge', () => {
    expect(tellingSkill(evening([], 3)).bonus).toBe(0);
    expect(tellingSkill(evening([], 5, { subterfuge: 2 }))).toMatchObject({ skill: 'subterfuge', name: 'Subterfuge', bonus: 4 });
    expect(tellingSkill(evening([], 4, { diplomacy: 1, command: 1 }))).toMatchObject({ skill: 'diplomacy', bonus: 2 });
  });

  it('lists the Récits retained, with what the public thinks of them', () => {
    const state = evening(['berceuse-de-maelis', 'voix-ecorce']);
    const choices = veilleeChoices(state, 'racine');
    expect(choices.map((c) => [c.recit.id, c.aime, c.deteste, c.difficulty])).toEqual([
      ['berceuse-de-maelis', ['chansons', 'familles'], [], 8],
      ['voix-ecorce', [], ['morts'], 16],
    ]);
    expect(choices[0].chance).toBeGreaterThan(choices[1].chance);
  });

  it('a triumph fills the hat, makes a name, brings a rumour, and lasts the evening', () => {
    const state = evening(['berceuse-de-maelis', 'deux-apprenties', 'on-se-retrouvera']);
    const fers = state.character!.fers;
    const result = tell(state, 'racine', 'berceuse-de-maelis', die(15));
    expect(result.outcome).toBe('triomphe');
    expect(result.rollNotice).toBe('Jet de Diplomatie : 15 + 0 = 15 contre 8, réussi');
    expect(state.character!.fers).toBe(fers + VEILLEE.fers.triomphe);
    expect(state.character!.xp).toBe(VEILLEE.xp.triomphe);
    expect(result.rumeur?.id).toBe('cache-passeurs');
    expect(state.flags[rumeurFlag('cache-passeurs')]).toBe(true);
    expect(renown(state, 'racine')).toBe(1);
    expect(momentOf(state.time)).toBe('nuit');
    expect(result.notices).toEqual([`+${VEILLEE.fers.triomphe} Fers`, `+${VEILLEE.xp.triomphe} points d’expérience`, 'C’est la nuit.', 'Rumeur : La cache des passeurs']);

    // The next evenings: the second rumour, then none left.
    state.time = { day: 2, phase: 2 };
    expect(tell(state, 'racine', 'deux-apprenties', die(15)).rumeur?.id).toBe('arbalete-convoi');
    state.time = { day: 3, phase: 2 };
    const third = tell(state, 'racine', 'on-se-retrouvera', die(15));
    expect([third.outcome, third.rumeur]).toEqual(['triomphe', undefined]);
    expect(heardRumeurs(state).map((r) => [r.id, r.ou])).toEqual([
      ['cache-passeurs', 'Auberge de la Racine'],
      ['arbalete-convoi', 'Auberge de la Racine'],
    ]);
  });

  it('a good reception without love: Fers and renown, no rumour', () => {
    const state = evening(['kael-chroniqueur']);
    const result = tell(state, 'racine', 'kael-chroniqueur', die(12));
    expect([result.outcome, result.rumeur]).toEqual(['succes', undefined]);
    expect(state.character!.fers).toBe(VEILLEE.fers.succes + createNewGame(testCharacter()).character!.fers);
    expect(state.flags[renownFlag('racine', 1)]).toBe(true);
  });

  it('a Récit told again earns little, and no renown', () => {
    const state = evening(['berceuse-de-maelis']);
    tell(state, 'racine', 'berceuse-de-maelis', die(15));
    state.time = { day: 2, phase: 2 };
    const fers = state.character!.fers;
    const again = tell(state, 'racine', 'berceuse-de-maelis', die(15));
    expect(again.outcome).toBe('redite');
    expect(state.character!.fers).toBe(fers + VEILLEE.fers.redite);
    expect(renown(state, 'racine')).toBe(1);
  });

  it('a natural 20 doubles the hat; a failure earns nothing, and a disliked theme empties the room', () => {
    const crit = evening(['convoi-sans-conducteur']);
    const fers = crit.character!.fers;
    expect(tell(crit, 'bielle', 'convoi-sans-conducteur', die(20)).rollNotice).toContain('réussite critique');
    expect(crit.character!.fers).toBe(fers + 2 * VEILLEE.fers.triomphe);

    const flop = evening(['kael-chroniqueur', 'triumvirat-vert']);
    const before = flop.character!.fers;
    const failed = tell(flop, 'bielle', 'kael-chroniqueur', die(2));
    expect([failed.outcome, failed.success]).toEqual(['echec', false]);
    expect(flop.character!.fers).toBe(before);
    expect(momentOf(flop.time)).toBe('nuit');
    flop.time = { day: 2, phase: 2 };
    expect(tell(flop, 'bielle', 'triumvirat-vert', die(2)).reaction).toContain('carnet');
    expect(renown(flop, 'bielle')).toBe(0);
  });

  it('renown raises the town’s opinion, three Récits at most', () => {
    const state = evening(['berceuse-de-maelis', 'deux-apprenties', 'on-se-retrouvera', 'kael-chroniqueur', 'savant-corvan']);
    const start = reputationScore(state, 'gardebois');
    for (const [day, id] of ['berceuse-de-maelis', 'deux-apprenties', 'on-se-retrouvera', 'kael-chroniqueur', 'savant-corvan'].entries()) {
      state.time = { day: day + 1, phase: 2 };
      tell(state, 'racine', id, die(19));
    }
    expect(renown(state, 'racine')).toBe(VEILLEE.renommee);
    expect(reputationScore(state, 'gardebois') - start).toBe(9);
    expect(reputationScore(state, 'canopee')).toBe(0);
  });
});

describe('the rumours open secrets', () => {
  /** Every rumour is read by some dialogue: it opens something. */
  it('each rumour is the key of some dialogue option', () => {
    const conditions = JSON.stringify(Object.values(DIALOGUES));
    for (const r of PUBLICS.flatMap((p) => p.rumeurs)) expect(conditions, r.id).toContain(`"flag":"${rumeurFlag(r.id)}"`);
  });

  it('la cache des passeurs, under the mossy rock: Fers, a phial, and Liane frowns', () => {
    const state = evening([]);
    expect(optionTexts(state, 'rocher-sauge', 'rocher')).toEqual(['…']);
    state.flags[rumeurFlag('cache-passeurs')] = true;
    joinParty(state, 'liane');
    const fers = state.character!.fers;
    choose(state, 'rocher-sauge', 'rocher', 'Glisser la main');
    choose(state, 'rocher-sauge', 'cache', 'Tout prendre');
    expect(state.character!.fers).toBe(fers + 30);
    expect(ownedCount(state.character!, 'fiole-seve')).toBeGreaterThan(0);
    expect(avisOf(state, 'liane')).toBe(-1);
    expect(optionTexts(state, 'rocher-sauge', 'vide')).toEqual(['…']);
  });

  it('les arbalètes de Tobias, at half price', () => {
    const state = evening([]);
    state.character!.fers = 50;
    state.flags[rumeurFlag('arbalete-convoi')] = true;
    choose(state, 'tobias', 'rumeurs', 'Et ces arbalètes');
    choose(state, 'tobias', 'arbalete', 'Payer trente-cinq Fers');
    expect([state.character!.fers, ownedCount(state.character!, 'arbalete-ferros')]).toEqual([15, 1]);
    expect(optionTexts(state, 'tobias', 'rumeurs')).not.toContain('Et ces arbalètes « tombées d’un convoi » ?');
  });

  it('la clé du nichoir opens the seed loft without picking the lock', () => {
    const state = evening([]);
    state.flags[rumeurFlag('cle-nichoir')] = true;
    choose(state, 'porte-grenier', 'verrouillee', 'Chercher la clé dans le nichoir');
    expect(state.flags['grenier-deverrouille']).toBe(true);
    expect(DIALOGUES['porte-grenier'].nodes.nichoir.options[0].effects).toEqual([{ goTo: 'canopee-grenier' }]);
  });

  it('la sève des aïeux, under Sévane’s counter', () => {
    const state = evening([]);
    state.character!.fers = 40;
    expect(optionTexts(state, 'sevane', 'herbes')).toEqual(['Préparer des remèdes, avec ce que j’ai récolté.', 'Une belle règle.']);
    state.flags[rumeurFlag('seve-aieux')] = true;
    choose(state, 'sevane', 'herbes', 'Et la sève');
    choose(state, 'sevane', 'aieux', 'Payer trente Fers');
    expect([state.character!.fers, ownedCount(state.character!, 'seve-aieux')]).toEqual([10, 1]);
  });

  it('de la part de Dorna, a forge crystal at half price', () => {
    const state = evening([]);
    state.character!.fers = 130;
    state.flags[rumeurFlag('part-de-dorna')] = true;
    choose(state, 'tailleuse', 'accueil', 'Je viens de la part de Dorna');
    choose(state, 'tailleuse', 'dorna', 'Payer cent vingt-cinq Fers');
    expect([state.character!.fers, ownedCount(state.character!, 'cristal-forge')]).toEqual([5, 1]);
    expect(optionTexts(state, 'tailleuse', 'accueil')).not.toContain('Je viens de la part de Dorna.');
  });

  it('ta fiche aux Archives: Noam must show it (article onze)', () => {
    const state = evening([]);
    state.flags[rumeurFlag('fiche-archives')] = true;
    choose(state, 'noam', 'tout', 'Et ma fiche');
    expect(state.flags['fiche-lue']).toBe(true);
    expect(state.character!.xp).toBe(20);
    expect(visibleOptions(DIALOGUES.noam.nodes.tout, state).map((v) => v.option.text)).toEqual(['Les Archives prennent-elles des correspondants ?', 'Je vois.']);
  });
});
