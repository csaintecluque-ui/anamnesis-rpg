import { describe, expect, it } from 'vitest';
import { createNewGame, type GameState } from '../state/gameState';
import { CONTINENTS, eddaScore, finAction, finCondition, finaleReady, ilyaneLoss, ilyaneState, listsKnown, missingAtCall, pieceItem, pieceWhere, piecesAtHand, piecesPrises } from './fin';
import { ENDINGS, endingOf, epiloguePages } from './epilogue';
import { addItem, ownedCount } from './inventory';
import { testCharacter } from './questTestKit';

/** La fin du jeu (chapitre 9, docs/gdd/chapitre-9.md) : ses règles, et son épilogue. */

const FATES: Record<string, string> = {
  'sous-la-faille': 'gardiens',
  'caisse-cendriere': 'prise',
  'caisse-sans-main': 'confiee',
  'noms-qui-montent': 'partage',
  'mer-rend': 'rendue',
  'plus-lieu': 'edda',
  'glace-pris': 'brisee',
};

/** Every caisse settled, as a game that went everywhere would leave them. */
function ready(): GameState {
  const s = createNewGame(testCharacter());
  for (const [quest, fin] of Object.entries(FATES)) {
    s.quests[quest] = 'done';
    s.flags[`fin-${quest}-${fin}`] = true;
  }
  for (const c of CONTINENTS) if (c !== 'verdantis') s.flags[`caisse-${c}-reglee`] = true;
  s.flags['caisse-ferros-prise'] = true;
  s.flags['caisse-communion-prise'] = true;
  s.flags['caisse-terminus-trouvee'] = true;
  s.flags['caisse-zephyria-trouvee'] = true;
  s.flags['caisse-marisol-trouvee'] = true;
  s.flags['caisse-glacialis-vue'] = true;
  addItem(s.character!, pieceItem('zephyria'));
  addItem(s.character!, pieceItem('glacialis'));
  return s;
}

describe('the finale', () => {
  it('begins once every caisse has a fate, and « Ce que la glace a pris » is done', () => {
    const s = ready();
    expect(finaleReady(s)).toBe(true);
    delete s.flags['caisse-marisol-reglee'];
    expect(finaleReady(s)).toBe(false);
  });

  it('knows where each piece is: carried, entrusted, taken, out of reach', () => {
    const s = ready();
    expect(Object.fromEntries(CONTINENTS.map((c) => [c, pieceWhere(s, c)]))).toEqual({
      verdantis: 'confiee',
      ferros: 'prise',
      terminus: 'confiee',
      zephyria: 'heros',
      marisol: 'ailleurs',
      communion: 'prise',
      glacialis: 'heros',
    });
    expect(piecesPrises(s)).toBe(2);
    expect(finCondition(s, 'prises-peu')).toBe(true);
  });

  it('Ilyane and Hesper hand back what was entrusted; the Réveilleurs’ pieces are taken back', () => {
    const s = ready();
    finAction(s, 'rendre-verdantis');
    expect(finCondition(s, 'pieces-a-rendre')).toBe(true);
    finAction(s, 'rendre-pieces');
    expect(finCondition(s, 'pieces-a-rendre')).toBe(false);
    expect(ownedCount(s.character!, pieceItem('terminus'))).toBe(1);
    expect(piecesAtHand(s)).toEqual(['verdantis', 'terminus', 'zephyria', 'glacialis']);
    finAction(s, 'reprendre-pieces');
    expect(piecesAtHand(s)).toEqual(['verdantis', 'ferros', 'terminus', 'zephyria', 'communion', 'glacialis']);
    expect(finCondition(s, 'manque')).toBe(true);
  });

  it('the call: the Faille replaces what is missing, and Ilyane pays for it', () => {
    const s = ready();
    finAction(s, 'rendre-verdantis');
    finAction(s, 'rendre-pieces');
    finAction(s, 'reprendre-pieces');
    expect(ilyaneLoss(s)).toBe(2);
    finAction(s, 'appeler');
    expect(missingAtCall(s)).toBe(1);
    expect(ilyaneLoss(s)).toBe(3);
    expect(ilyaneState(s)).toBe('entamee');
    expect(CONTINENTS.every((c) => ownedCount(s.character!, pieceItem(c)) === 0)).toBe(true);
    // « Le dernier passager » gives her everything back.
    s.flags['fin-voie-sept-monte'] = true;
    expect(ilyaneState(s)).toBe('intacte');
  });

  it('the dame en gris turns at +2: what was done for her, less what was done against her', () => {
    const s = ready();
    expect(eddaScore(s)).toBe(0);
    s.flags['edda-eau'] = true;
    s.flags['descendu-edda'] = true;
    expect(finCondition(s, 'edda-alliee')).toBe(true);
    s.flags['edda-raccompagnee'] = true;
    expect(finCondition(s, 'edda-alliee')).toBe(false);
  });

  it('the truth needs four lists of names (Verdantis’s was drowned)', () => {
    const s = ready();
    expect(listsKnown(s)).toEqual(['terminus', 'zephyria', 'marisol', 'glacialis']);
    expect(finCondition(s, 'listes')).toBe(true);
    expect(finCondition(s, 'liste-ferros')).toBe(false);
  });
});

describe('the epilogue', () => {
  it('nothing before an end of « La voie sept »', () => {
    expect(endingOf(ready())).toBeNull();
    expect(epiloguePages(ready())).toEqual([]);
  });

  it('a page for each thread, for every end, without a tic, each short enough to read on one screen', () => {
    for (const ending of ENDINGS) {
      const s = ready();
      s.flags[`fin-voie-sept-${ending}`] = true;
      s.flags['oubli-choix-graver'] = true;
      s.flags['boulon-libre'] = true;
      const pages = epiloguePages(s);
      expect(pages.map((p) => p.titre)).toEqual(['La voie sept', 'Les sept caisses', 'La dame en gris', 'Ilyane', 'Ceux qui ont marché avec toi', ending === 'monte' ? 'Le dernier passager' : 'Toi']);
      for (const p of pages) {
        expect(p.texte.length, `${ending} ${p.titre}`).toBeLessThan(1100);
        expect(p.texte).not.toMatch(/\b\w+, pas (?:un |une |le |la |les |des |du |de |d’|l’)?\w+[.!]/);
        expect(p.texte).not.toMatch(/\bcomme (?:un|une)\b/);
      }
      // One line per caisse, by its fate.
      expect(pages[1].texte.split('\n')).toHaveLength(7);
    }
  });
});
