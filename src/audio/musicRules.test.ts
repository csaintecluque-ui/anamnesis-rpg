import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { testCharacter } from '../rules/questTestKit';
import { FIL } from '../rules/fil';
import { ECHOS, echoFlag } from '../rules/echos';
import { LOCATIONS, createNewGame } from '../state/gameState';
import {
  FILES,
  MUSIC,
  TRACKS,
  chooseMusic,
  chosenVariant,
  dialogueTheme,
  familyOf,
  fileName,
  findTrack,
  isMusicNight,
  rewardCounts,
  rewardNote,
  type MusicContext,
} from './musicRules';

/** The reduced files in public/ (npm run music). */
const PUBLISHED = Object.keys(import.meta.glob('/public/audio/musique/*.mp3'));

const map = (location: string, night = false): MusicContext => ({ scenes: ['Map', 'Hud'], location, night });

describe('les morceaux (décision du 2026-11-08 : le plan « recommandé »)', () => {
  // The table of docs/gdd/son.md: 20 + 8 + 6 + 2 = 36 tracks (79 min ; its title said 34 by mistake).
  it('36 morceaux : 20 ambiances, 8 thèmes, 6 notes courtes, la berceuse en deux', () => {
    expect(TRACKS).toHaveLength(36);
    expect(TRACKS.filter((t) => t.lot === 'A')).toHaveLength(20);
    expect(TRACKS.filter((t) => t.lot === 'B')).toHaveLength(8);
    expect(TRACKS.filter((t) => t.lot === 'C')).toHaveLength(6);
    expect(TRACKS.filter((t) => t.lot === 'D')).toHaveLength(2);
    // One take for the ambiences, two for the rest.
    expect(TRACKS.filter((t) => t.lot === 'A').every((t) => !t.variantes)).toBe(true);
    expect(TRACKS.filter((t) => t.lot !== 'A').every((t) => t.variantes?.length === 2)).toBe(true);
  });

  it('chaque fichier est réduit, déclaré (empreinte, durée, poids) et publié, à 96 kbit/s (12 000 octets la seconde)', () => {
    const names = TRACKS.flatMap((t) => (t.variantes ? t.variantes.map((v) => fileName(t, v)) : [fileName(t)]));
    expect(names).toHaveLength(52);
    // Nothing published that the data does not name.
    expect(PUBLISHED.sort()).toEqual(names.map((n) => `/public/audio/musique/${n}.mp3`).sort());
    for (const name of names) {
      const info = FILES[name];
      expect(info, name).toBeDefined();
      expect(PUBLISHED, name).toContain(`/public/audio/musique/${name}.mp3`);
      // 96 kbit/s = 12 000 octets la seconde, à 5 % près.
      expect(Math.abs(info.octets / info.duree / 12000 - 1), name).toBeLessThan(0.05);
    }
  });

  it('les ambiances durent près de 3 min, les thèmes 1 à 3 min, les notes moins de 11 s', () => {
    for (const t of TRACKS) {
      const d = FILES[fileName(t)].duree;
      if (t.lot === 'A') expect(d).toBeGreaterThan(170);
      if (t.genre === 'note') expect(d).toBeLessThan(11);
      if (t.lot === 'B') expect(d).toBeGreaterThan(50);
    }
  });

  it('les notes courtes et la mort jouent une fois, les lieux et les thèmes en boucle', () => {
    expect(TRACKS.filter((t) => !t.boucle).map((t) => t.id).sort()).toEqual(
      ['berceuse-chantee', 'caisse-trouvee', 'chute', 'echo-recueilli', 'niveau-gagne', 'quete-terminee', 'recit-retenu', 'veillee-reussie'].sort(),
    );
  });
});

describe('le chef d’orchestre', () => {
  it('chaque lieu du jeu a une ambiance, le jour et la nuit', () => {
    for (const location of LOCATIONS) {
      const day = chooseMusic(map(location.id));
      const night = chooseMusic(map(location.id, true));
      expect(day, location.id).toMatch(/-jour$/);
      expect(night, location.id).toMatch(/-nuit$/);
      expect(findTrack(day!)).toBeDefined();
      expect(findTrack(night!)).toBeDefined();
    }
  });

  it('les villes ont la leur ; la Gare, les voies, les cryptes et le pays sous les nuages sont « sous la terre »', () => {
    expect(chooseMusic(map('gardebois'))).toBe('gardebois-jour');
    expect(chooseMusic(map('auberge-racine', true))).toBe('gardebois-nuit');
    expect(chooseMusic(map('sol-racines'))).toBe('canopee-jour');
    expect(chooseMusic(map('ironheart-forges'))).toBe('ironheart-jour');
    expect(chooseMusic(map('sept-portes-bibliotheque', true))).toBe('sept-portes-nuit');
    expect(chooseMusic(map('aetherhaven-quai'))).toBe('aetherhaven-jour');
    expect(chooseMusic(map('coralia-port'))).toBe('coralia-jour');
    expect(chooseMusic(map('marche-desert'))).toBe('marche-mere-jour');
    expect(chooseMusic(map('khrysos-surface', true))).toBe('khrysos-nuit');
    for (const id of ['gare-engloutie', 'voie-endormie', 'ironheart-cendriere', 'khrysos-cryptes', 'bas-cendres', 'altavent', 'quai-sept'])
      expect(familyOf(id), id).toBe('souterrain');
    expect(chooseMusic(map('rencontre-route', true))).toBe('route-nuit');
  });

  it('la carte du monde joue la route ; l’écran titre et la création, le thème principal', () => {
    expect(chooseMusic({ scenes: ['WorldMap'], night: false })).toBe('route-jour');
    expect(chooseMusic({ scenes: ['WorldMap'], night: true })).toBe('route-nuit');
    expect(chooseMusic({ scenes: ['Title'] })).toBe('theme-principal');
    expect(chooseMusic({ scenes: ['Title', 'Options'] })).toBe('theme-principal');
    expect(chooseMusic({ scenes: ['Creation'] })).toBe('theme-principal');
  });

  it('un menu seul (les emplacements de sauvegarde) laisse la musique comme elle est', () => {
    expect(chooseMusic({ scenes: ['Slots'] })).toBeNull();
    expect(chooseMusic({ scenes: [] })).toBeNull();
  });

  it('le combat passe avant le lieu ; un gardien (un ennemi à phases) a sa musique', () => {
    const fight = (enemies: string[]): MusicContext => ({ ...map('gare-engloutie'), scenes: ['Map', 'Combat'], combatEnemies: enemies });
    expect(chooseMusic(fight(['rodeur-epine', 'rodeur-epine']))).toBe('combat');
    expect(chooseMusic(fight(['golem-ferraille']))).toBe('combat-gardien');
    expect(chooseMusic(fight(['veuve-grele', 'pirate-air']))).toBe('combat-gardien');
  });

  it('la chute passe avant tout ; la veillée et l’épilogue ont la leur', () => {
    expect(chooseMusic({ scenes: ['Death', 'Combat'], combatEnemies: ['golem-ferraille'] })).toBe('chute');
    expect(chooseMusic({ ...map('gardebois'), scenes: ['Map', 'Dialogue', 'Veillee'] })).toBe('veillee');
    expect(chooseMusic({ ...map('altavent'), scenes: ['Map', 'Dialogue', 'Epilogue'] })).toBe('theme-principal');
  });

  it('un dialogue garde la musique du lieu, sauf les Échos, la dame en gris, les caisses et la berceuse', () => {
    const talk = (dialogue: string, node = 'debut'): MusicContext => ({ ...map('gardebois'), scenes: ['Map', 'Dialogue'], dialogue: { dialogue, node } });
    expect(chooseMusic(talk('sylvan'))).toBe('gardebois-jour');
    expect(chooseMusic(talk('hedda'))).toBe('gardebois-jour');
    expect(chooseMusic(talk('echo-dernier-train'))).toBe('echos');
    expect(chooseMusic(talk(`echo-${ECHOS[0].id}`))).toBe('echos');
    expect(chooseMusic(talk('edda-coralia'))).toBe('dame-en-gris');
    expect(chooseMusic(talk('edda-varn'))).toBe('dame-en-gris');
    expect(chooseMusic(talk('caisse-ferros'))).toBe('sept-caisses');
    expect(chooseMusic(talk('echo-berceuse'))).toBe('berceuse-fredonnee');
    expect(chooseMusic(talk('nell', 'silence'))).toBe('gardebois-jour');
    expect(chooseMusic(talk('nell', 'souvenir'))).toBe('berceuse-chantee');
  });

  it('les dialogues, nœuds et morceaux nommés dans les données existent', () => {
    const d = MUSIC.dialogues;
    // `voie-echo` is built with each sleeping line (src/rules/voies.ts).
    for (const id of Object.keys(d.exacts)) if (id !== 'voie-echo') expect(DIALOGUES[id], id).toBeDefined();
    for (const key of Object.keys(d.noeuds)) {
      const [dialogue, node] = key.split(':');
      expect(DIALOGUES[dialogue]?.nodes[node], key).toBeDefined();
    }
    const named = [...Object.values(d.exacts), ...Object.values(d.prefixes), ...Object.values(d.noeuds), ...Object.values(MUSIC.scenes), ...MUSIC.recompenses];
    for (const id of named) expect(findTrack(id), id).toBeDefined();
    for (const ids of Object.values(MUSIC.familles)) for (const id of ids) expect(LOCATIONS.some((l) => l.id === id), id).toBe(true);
    // Every dialogue of the lady in grey has her theme, and no other one starts like hers.
    expect(Object.keys(DIALOGUES).filter((id) => dialogueTheme(id) === 'dame-en-gris').sort()).toEqual(
      ['edda', 'edda-coralia', 'edda-halte', 'edda-khrysos', 'edda-marche', 'edda-quai', 'edda-varn'].sort(),
    );
  });

  it('la nuit de la musique est la nuit du jeu', () => {
    expect(isMusicNight({ time: { day: 1, phase: 0 } })).toBe(false);
    expect(isMusicNight({ time: { day: 1, phase: 3 } })).toBe(true);
  });
});

describe('la version jouée', () => {
  const combat = findTrack('combat')!;
  it('A par défaut, la version gardée sur la page d’écoute, sinon le choix de Cyril', () => {
    expect(chosenVariant(combat)).toBe('a');
    expect(chosenVariant(combat, { combat: 'b' })).toBe('b');
    expect(chosenVariant(combat, { combat: 'z' })).toBe('a');
    expect(chosenVariant({ ...combat, choix: 'b' })).toBe('b');
    expect(chosenVariant({ ...combat, choix: 'b' }, { combat: 'a' })).toBe('a');
    expect(chosenVariant(findTrack('gardebois-jour')!)).toBeUndefined();
    expect(fileName(combat, 'b')).toBe('combat-b');
    expect(fileName(findTrack('gardebois-jour')!)).toBe('gardebois-jour');
  });
});

describe('les notes courtes des récompenses', () => {
  it('une note quand un compte augmente, la plus importante si plusieurs à la fois', () => {
    const state = createNewGame(testCharacter());
    const before = rewardCounts(state);
    expect(rewardNote(before, rewardCounts(state))).toBeNull();

    state.character!.recits.push('berceuse-de-maelis');
    expect(rewardNote(before, rewardCounts(state))).toBe('recit-retenu');

    state.flags[echoFlag(ECHOS[0].id)] = true;
    expect(rewardNote(before, rewardCounts(state))).toBe('echo-recueilli');

    state.quests['berceuse'] = 'done';
    expect(rewardNote(before, rewardCounts(state))).toBe('quete-terminee');

    state.flags[FIL.caisses.find((c) => c.trouvee)!.trouvee!] = true;
    expect(rewardNote(before, rewardCounts(state))).toBe('caisse-trouvee');

    state.character!.level += 1;
    expect(rewardNote(before, rewardCounts(state))).toBe('niveau-gagne');
  });

  it('une veillée réussie se compte à sa marque ; une quête seulement commencée ne compte pas', () => {
    const state = createNewGame(testCharacter());
    const before = rewardCounts(state);
    state.quests['berceuse'] = 'active';
    expect(rewardNote(before, rewardCounts(state))).toBeNull();
    state.flags['veillee-auberge-racine-berceuse-de-maelis'] = true;
    expect(rewardNote(before, rewardCounts(state))).toBe('veillee-reussie');
  });

  it('un compte qui baisse (un Récit perdu) ne joue rien', () => {
    const state = createNewGame(testCharacter());
    state.character!.recits.push('berceuse-de-maelis');
    const before = rewardCounts(state);
    state.character!.recits.pop();
    expect(rewardNote(before, rewardCounts(state))).toBeNull();
  });
});
