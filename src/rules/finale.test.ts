import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createNewGame, type GameState } from '../state/gameState';
import { applyEffects, startNode, startsCombat, goesTo, type Effect } from './dialogue';
import { CONTINENTS, pieceItem } from './fin';
import { endingOf, epiloguePages } from './epilogue';
import { addItem } from './inventory';
import { choose, optionTexts, testCharacter } from './questTestKit';

/** La fin jouée de bout en bout (chapitre 9, docs/gdd/chapitre-9.md) : chaque fin, par les dialogues. */

const FATES: Record<string, string> = {
  'sous-la-faille': 'laissee',
  'caisse-cendriere': 'archives',
  'caisse-sans-main': 'prise',
  'noms-qui-montent': 'partage',
  'mer-rend': 'rendue',
  'plus-lieu': 'gardee',
  'glace-pris': 'college',
};

/** A game at the end of « Ce que la glace a pris », every caisse settled. */
function game(edda = 0): GameState {
  const s = createNewGame(testCharacter({ presence: 5 }, { diplomacy: 4, subterfuge: 3 }));
  for (const [quest, fin] of Object.entries(FATES)) {
    s.quests[quest] = 'done';
    s.flags[`fin-${quest}-${fin}`] = true;
  }
  for (const c of CONTINENTS) if (c !== 'verdantis') s.flags[`caisse-${c}-reglee`] = true;
  s.flags['caisse-terminus-prise'] = true;
  for (const c of ['ferros', 'zephyria', 'marisol', 'communion']) s.flags[`caisse-${c}-trouvee`] = true;
  s.flags['caisse-glacialis-vue'] = true;
  s.flags['heros-enfant'] = true;
  addItem(s.character!, pieceItem('zephyria'));
  addItem(s.character!, pieceItem('communion'));
  if (edda >= 2) {
    s.flags['edda-eau'] = true;
    s.flags['descendu-edda'] = true;
  }
  s.location = 'gardebois';
  return s;
}

const talk = (s: GameState, id: string): string => startNode(DIALOGUES[id], s);
/** Opens a dialogue as the game does: its first node's effects apply. */
function open(s: GameState, id: string): string {
  const node = talk(s, id);
  applyEffects(s, DIALOGUES[id].nodes[node].effects);
  return node;
}
const opt = (s: GameState, id: string, node: string, text: string) => choose(s, id, node, text);
const fx = (o: { effects?: Effect[] }) => o.effects;

/** Gardebois, then down to the quai sept: Ilyane, Hesper, the ladder. */
function veille(s: GameState): void {
  expect(open(s, 'ilyane')).toBe('finale-intacte');
  opt(s, 'ilyane', 'finale-intacte', 'J’y descends');
  expect(s.quests['voie-sept']).toBe('active');
  s.location = 'maison-ilyane';
  expect(open(s, 'hesper')).toBe('gardebois-pieces');
  choose(s, 'hesper', 'gardebois-pieces', 'J’y descends');
  expect(s.flags['hesper-pieces']).toBe(true);
  s.location = 'gare-engloutie';
  expect(talk(s, 'faille-descente')).toBe('echelle');
  expect(goesTo(fx(opt(s, 'faille-descente', 'echelle', 'Descendre')))).toMatchObject({ location: 'quai-sept' });
  s.location = 'quai-sept';
}

/** The train called, the journey, Altavent. */
function voyage(s: GameState, withEdda = false): void {
  expect(talk(s, 'train-quai')).toBe('monter');
  opt(s, 'train-quai', 'monter', withEdda ? 'Monter, avec' : 'Monter.');
  let node = withEdda ? 'depart-edda' : 'depart';
  opt(s, 'train-quai', node, 'Dire leurs âges');
  for (const [halte, known] of [['halte-ferros', true], ['halte-terminus', false], ['halte-communion', true], ['halte-marisol', true], ['halte-glacialis', true], ['halte-zephyria', true]] as const) {
    node = halte;
    opt(s, 'train-quai', node, known ? 'Dire leurs noms' : 'Les regarder');
  }
  expect(s.flags['heros-fragment-quai']).toBe(true);
  expect(goesTo(fx(opt(s, 'train-quai', 'arrivee', 'Descendre')))).toMatchObject({ location: 'altavent' });
  expect(s.flags['altavent-vu']).toBe(true);
  s.location = 'altavent';
}

describe('« La voie sept », jouée', () => {
  it('Reçu : la dame en gris se retourne, le train appelé avec ce qui manque, le registre signé', () => {
    const s = game(2);
    veille(s);
    expect(open(s, 'mandataire')).toBe('face-peu');
    opt(s, 'mandataire', 'face-peu', 'Demande-lui');
    expect(s.flags['quai-sept-libre']).toBe(true);
    expect(open(s, 'chassis')).toBe('libre-manque');
    opt(s, 'chassis', 'libre-manque', 'Appeler le train');
    expect(s.flags['train-appele']).toBe(true);
    // Verdantis (on the quai), Ferros and Glacialis (Hesper), Zephyria and Communion (carried), Terminus (taken back) ;
    // Marisol was given back to the sea: the Faille takes one piece in the Échos.
    expect(s.flags['fin-manque-1']).toBe(true);
    voyage(s, true);
    expect(open(s, 'edda-varn')).toBe('avec-fille');
    opt(s, 'edda-varn', 'avec-fille', 'Les laisser');
    opt(s, 'enfant-fenetre', 'fenetre', 'Rester');
    const sign = opt(s, 'enfant-fenetre', 'rester-confirm', 'Signer');
    expect(sign.next).toBe('recu');
    expect(s.quests['voie-sept']).toBe('done');
    expect(endingOf(s)).toBe('recu');
    const pages = epiloguePages(s);
    expect(pages.find((p) => p.titre === 'La dame en gris')!.texte).toMatch(/quarante-troisième nom/);
    expect(pages.find((p) => p.titre === 'Ilyane')!.texte).toMatch(/gardé le reste/);
    expect(talk(s, 'registre-altavent')).toBe('signe');
  });

  it('Le dernier passager : la vérité dite aux hommes, l’enfant rejoint', () => {
    const s = game();
    veille(s);
    expect(optionTexts(s, 'mandataire', 'face-peu')).not.toContain('Demande-lui, à elle.');
    opt(s, 'mandataire', 'face-peu', 'Écoutez-moi');
    expect(optionTexts(s, 'mandataire', 'parler')[0]).toMatch(/Rien que des noms/);
    opt(s, 'mandataire', 'parler', 'Il n’y a rien à Altavent');
    expect(s.flags['quai-sept-libre']).toBe(true);
    opt(s, 'chassis', 'libre-manque', 'Appeler le train');
    voyage(s);
    expect(open(s, 'edda-varn')).toBe('seule');
    opt(s, 'enfant-fenetre', 'fenetre', 'Lui rendre la main');
    opt(s, 'enfant-fenetre', 'monter-confirm', 'Monter');
    expect(endingOf(s)).toBe('monte');
    expect(epiloguePages(s).at(-1)!.titre).toBe('Le dernier passager');
    expect(epiloguePages(s).find((p) => p.titre === 'Ilyane')!.texte).toMatch(/se souvenant de tout/);
  });

  it('Le train ne s’arrêtera plus : le combat, puis la machine jetée dans la Faille', () => {
    const s = game();
    veille(s);
    opt(s, 'mandataire', 'face-peu', 'Personne ne les aura');
    const fight = opt(s, 'mandataire', 'combat', 'Se battre');
    expect(startsCombat(fight.effects)).toBe('quai-sept-2');
    // The fight won (src/data/encounters.json): the quai is the hero's, the pieces taken back.
    s.flags['quai-sept-libre'] = true;
    s.flags['pieces-reprises'] = true;
    opt(s, 'chassis', 'libre-manque', 'La jeter');
    opt(s, 'chassis', 'jeter', 'La jeter');
    expect(endingOf(s)).toBe('jetee');
    expect(talk(s, 'train-quai')).toBe('apres');
  });

  it('La voie déchirée : les pièces données, le train passe sans s’arrêter', () => {
    const s = game();
    veille(s);
    opt(s, 'mandataire', 'face-peu', 'Prenez-les');
    opt(s, 'mandataire', 'donner', 'Les lui donner');
    expect(s.character!.inventory.some((i) => i.itemId.startsWith('piece-'))).toBe(false);
    opt(s, 'mandataire', 'appel-reveilleurs', 'Le regarder partir');
    expect(endingOf(s)).toBe('dechiree');
    expect(epiloguePages(s)[0].texte).toMatch(/sans s’arrêter/);
  });

  it('pas avant que toutes les caisses aient un sort : Ilyane l’explique', () => {
    const s = game();
    delete s.flags['caisse-marisol-reglee'];
    expect(talk(s, 'ilyane')).toBe('finale-attendre');
  });
});
