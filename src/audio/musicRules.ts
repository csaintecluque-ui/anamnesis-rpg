import musicData from '../data/musique.json';
import fileData from '../data/musique-fichiers.json';
import enemyData from '../data/enemies.json';
import { FIL } from '../rules/fil';
import { collectedEchos } from '../rules/echos';
import { LOCATIONS, type GameState } from '../state/gameState';
import { momentOf } from '../rules/time';

/**
 * La musique (décision de Cyril du 2026-11-08, docs/gdd/son.md) : 36 morceaux d'ElevenLabs Music v2.5 par Higgsfield,
 * réduits par `npm run music` (scripts/process-music.mjs). Ce fichier ne contient que des règles, sans navigateur :
 * quel morceau pour quel moment du jeu (le chef d'orchestre), quelle variante, quelle note courte pour une récompense.
 */
export type Genre = 'ambiance' | 'theme' | 'combat' | 'note' | 'berceuse';

export interface TrackDef {
  id: string;
  titre: string;
  lot: 'A' | 'B' | 'C' | 'D';
  genre: Genre;
  /** Played again and again with a crossfade (places, themes), or once (the fall, the short notes, the sung lullaby). */
  boucle: boolean;
  /** Two takes to choose from on the listening page (docs/gdd/son.md); absent: a single file. */
  variantes?: string[];
  /** The take kept by Cyril, once chosen. */
  choix?: string;
}

interface MusicData {
  pistes: TrackDef[];
  niveaux: Record<Genre, number>;
  familles: Record<string, string[]>;
  momentsNuit: string[];
  scenes: Record<string, string>;
  dialogues: { exacts: Record<string, string>; prefixes: Record<string, string>; noeuds: Record<string, string> };
  recompenses: string[];
}

/** What `npm run music` wrote for each file: a short hash of its content (the cache key), its length in seconds. */
export interface FileInfo {
  v: string;
  duree: number;
  octets: number;
}

export const MUSIC = musicData as MusicData;
export const TRACKS = MUSIC.pistes;
export const FILES = fileData as Record<string, FileInfo>;

export function findTrack(id: string): TrackDef | undefined {
  return TRACKS.find((t) => t.id === id);
}

/** The file of one take: `gardebois-jour`, `combat-a`, `combat-b`. */
export function fileName(track: TrackDef, variant?: string): string {
  return track.variantes ? `${track.id}-${variant ?? track.variantes[0]}` : track.id;
}

/** The URL of a file, with its content hash so a new take is never served from an old cache. */
export function fileUrl(name: string): string {
  const info = FILES[name];
  return `audio/musique/${name}.mp3${info ? `?v=${info.v}` : ''}`;
}

/** The take to play: the one picked on the listening page on this device, else Cyril's choice, else the first. */
export function chosenVariant(track: TrackDef, picks: Record<string, string> = {}): string | undefined {
  if (!track.variantes) return undefined;
  const pick = picks[track.id];
  if (pick && track.variantes.includes(pick)) return pick;
  if (track.choix && track.variantes.includes(track.choix)) return track.choix;
  return track.variantes[0];
}

/** How loud a track plays, under the general volume and the music setting (files are all at −20 LUFS). */
export function trackLevel(track: TrackDef): number {
  return MUSIC.niveaux[track.genre] ?? 0.5;
}

/** The family of places whose music a location plays: `souterrain`, `route`, or its town (`gardebois`, `coralia`…). */
export function familyOf(locationId: string): string | null {
  for (const [family, ids] of Object.entries(MUSIC.familles)) if (ids.includes(locationId)) return family;
  const location = LOCATIONS.find((l) => l.id === locationId);
  if (location?.voie) return 'souterrain';
  if (location?.encounter) return 'route';
  return location?.place ?? null;
}

/** The ambience of a family at a moment of the day: `coralia-nuit`, `route-jour`. */
export function ambienceOf(family: string, night: boolean): string | null {
  const id = `${family}-${night ? 'nuit' : 'jour'}`;
  return findTrack(id) ? id : null;
}

/** The theme a dialogue (or one of its nodes) calls for, if any: the Échos, the lady in grey, the crates, the lullaby. */
export function dialogueTheme(dialogue: string, node?: string): string | null {
  const d = MUSIC.dialogues;
  if (node && d.noeuds[`${dialogue}:${node}`]) return d.noeuds[`${dialogue}:${node}`];
  if (d.exacts[dialogue]) return d.exacts[dialogue];
  for (const [prefix, theme] of Object.entries(d.prefixes)) if (dialogue.startsWith(prefix)) return theme;
  return null;
}

/** The fights against a guardian (an enemy with phases: the Golem, the Veuve Grêle) get their own music. */
const GUARDIANS = new Set((enemyData as { id: string; phases?: unknown }[]).filter((e) => e.phases).map((e) => e.id));
export const isGuardianFight = (enemyIds: string[]): boolean => enemyIds.some((id) => GUARDIANS.has(id));

/** Everything the conductor looks at, read from the game each few hundred milliseconds. */
export interface MusicContext {
  /** The scenes open (running or paused under an overlay). */
  scenes: string[];
  /** The hero's location (GameState.location). */
  location?: string;
  night?: boolean;
  /** The fight's enemies, when the Combat scene is open. */
  combatEnemies?: string[];
  /** The dialogue on screen and its node, when the Dialogue scene is open. */
  dialogue?: { dialogue: string; node: string } | null;
}

/**
 * The conductor's rule: the track the game should play now, or null to leave the music as it is (a menu over the
 * map, the save slots). In order: the fall, a fight, a veillée, the epilogue, a dialogue with its own theme, the place
 * (its family, day or night), the world map, the title screen and the creation of the hero.
 */
export function chooseMusic(ctx: MusicContext): string | null {
  const open = (key: string) => ctx.scenes.includes(key);
  const s = MUSIC.scenes;
  if (open('Death')) return s.Death;
  if (open('Combat')) return isGuardianFight(ctx.combatEnemies ?? []) ? 'combat-gardien' : 'combat';
  if (open('Veillee')) return s.Veillee;
  if (open('Epilogue')) return s.Epilogue;
  if (open('Dialogue') && ctx.dialogue) {
    const theme = dialogueTheme(ctx.dialogue.dialogue, ctx.dialogue.node);
    if (theme) return theme;
  }
  if ((open('Map') || open('Dialogue')) && ctx.location) {
    const family = familyOf(ctx.location);
    if (family) return ambienceOf(family, !!ctx.night);
  }
  if (open('WorldMap')) return ambienceOf('route', !!ctx.night);
  if (open('Title')) return s.Title;
  if (open('Creation')) return s.Creation;
  return null;
}

/** Whether the game's clock says night, for the music (data: `momentsNuit`). */
export function isMusicNight(state: Pick<GameState, 'time'>): boolean {
  return MUSIC.momentsNuit.includes(momentOf(state.time));
}

/** What the short notes count: a quest done, a Récit kept, a level, an Écho, a crate found, a veillée won. */
export interface RewardCounts {
  'quete-terminee': number;
  'recit-retenu': number;
  'niveau-gagne': number;
  'echo-recueilli': number;
  'caisse-trouvee': number;
  'veillee-reussie': number;
}

export function rewardCounts(state: GameState): RewardCounts {
  const flags = state.flags;
  return {
    'quete-terminee': Object.values(state.quests).filter((q) => q === 'done').length,
    'recit-retenu': state.character?.recits.length ?? 0,
    'niveau-gagne': state.character?.level ?? 0,
    'echo-recueilli': collectedEchos(state).length,
    'caisse-trouvee': FIL.caisses.filter((c) => c.trouvee && flags[c.trouvee]).length,
    // A veillée won leaves its mark (src/rules/veillees.ts, toldFlag): « veillee-<public>-<récit> ».
    'veillee-reussie': Object.keys(flags).filter((f) => f.startsWith('veillee-') && flags[f]).length,
  };
}

/** The one short note to play when the counts grow (several at once: the most important, data `recompenses`). */
export function rewardNote(before: RewardCounts, after: RewardCounts): string | null {
  for (const id of MUSIC.recompenses as (keyof RewardCounts)[]) if (after[id] > before[id]) return id;
  return null;
}
