import type Phaser from 'phaser';
import { getSettings } from '../settings';
import type { GameState } from '../state/gameState';
import { MusicPlayer } from './music';
import {
  TRACKS,
  chooseMusic,
  chosenVariant,
  fileName,
  findTrack,
  isMusicNight,
  rewardCounts,
  rewardNote,
  type MusicContext,
  type RewardCounts,
} from './musicRules';

/**
 * Le chef d'orchestre (docs/gdd/son.md) : quelques fois par seconde, il regarde le jeu (les scènes ouvertes, le lieu,
 * l'heure, le combat, le dialogue) et demande au lecteur le morceau que la règle choisit (src/audio/musicRules.ts),
 * en fondu. Il compte aussi les récompenses (quête, Récit, niveau, Écho, caisse, veillée) et joue la note courte
 * quand l'une d'elles augmente. Il ne touche à aucune scène : il les observe.
 */
const PICKS_KEY = 'anamnesis.musique.choix';
const TICK_MS = 250;

let conductor: Conductor | null = null;

/** The last files asked for (tracks and notes), for the browser checks (exposed in development only, src/main.ts). */
export const musicLog: string[] = [];
const log = (name: string | null): void => {
  if (!name || musicLog[musicLog.length - 1] === name) return;
  musicLog.push(name);
  if (musicLog.length > 50) musicLog.shift();
};

export function startConductor(game: Phaser.Game): void {
  if (!conductor) conductor = new Conductor(game);
}

/** The « Musique » setting changed (Options). */
export function setMusicVolume(percent: number): void {
  conductor?.player?.setVolume(percent);
}

/** The listening page (test mode): it plays one take at a time, and the conductor waits until it closes. */
export function previewMusic(name: string | null): void {
  if (!conductor?.player) return;
  conductor.listening = true;
  conductor.player.stopAll();
  // A short note too goes through play() here, so the page can show where it is.
  if (name) conductor.player.play(name);
}

export function endPreview(): void {
  if (!conductor?.player) return;
  conductor.player.stopAll();
  conductor.listening = false;
}

/** The file being heard now (the listening page shows it). */
export function musicPlaying(): string | null {
  return conductor?.player?.playing ?? null;
}

/** Where the track being heard is, in seconds (null while it loads). */
export function musicPosition(): { time: number; duration: number } | null {
  return conductor?.player?.position() ?? null;
}

export const musicAvailable = (): boolean => !!conductor?.player;

/** The takes picked on the listening page, on this device. */
export function loadPicks(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PICKS_KEY);
    const value = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return value && typeof value === 'object' ? value : {};
  } catch {
    return {};
  }
}

export function savePicks(picks: Record<string, string>): void {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify(picks));
  } catch {
    // Kept for this session only.
  }
}

/** The file to play for a track: its take picked here, else Cyril's choice, else the first. */
export function fileFor(trackId: string): string | null {
  const track = findTrack(trackId);
  return track ? fileName(track, chosenVariant(track, loadPicks())) : null;
}

class Conductor {
  readonly player: MusicPlayer | null = null;
  listening = false;
  private readonly game: Phaser.Game;
  private lastState: GameState | null = null;
  private counts: RewardCounts | null = null;
  private prefetched = false;

  constructor(game: Phaser.Game) {
    this.game = game;
    const sound = game.sound as Phaser.Sound.WebAudioSoundManager;
    // No Web Audio (a very old browser): the game stays silent rather than broken.
    if (!sound.context || !sound.destination) return;
    this.player = new MusicPlayer(sound.context, sound.destination);
    this.player.setVolume(getSettings().music);
    window.setInterval(() => this.update(), TICK_MS);
    // Safari (iPhone) lets a new audio player start only during a touch: a start refused is tried again at each one.
    for (const type of ['pointerdown', 'touchend', 'keydown']) window.addEventListener(type, () => this.player?.tick(), { passive: true });
  }

  private update(): void {
    const player = this.player;
    if (!player) return;
    try {
      player.tick();
      if (this.listening) return;
      const ctx = this.read();
      const track = chooseMusic(ctx);
      if (track) {
        const name = fileFor(track);
        log(name);
        player.play(name);
      }
      this.rewards();
      // The short notes, once the place's music plays (first time on a map): heard at once when the reward comes.
      if (!this.prefetched && ctx.scenes.includes('Map') && !player.busy) {
        this.prefetched = true;
        player.prefetch(TRACKS.filter((t) => t.genre === 'note').map((t) => fileFor(t.id)!));
      }
    } catch {
      // The music never stops the game.
    }
  }

  private read(): MusicContext {
    const open = this.game.scene.getScenes(false).filter((s) => s.sys.isActive() || s.sys.isPaused());
    const scenes = open.map((s) => s.scene.key);
    const state = this.game.registry.get('game') as GameState | undefined;
    const ctx: MusicContext = { scenes, location: state?.location, night: state ? isMusicNight(state) : false };
    if (scenes.includes('Combat')) {
      const data = this.game.scene.getScene('Combat').sys.settings.data as { enemyIds?: string[] } | undefined;
      ctx.combatEnemies = data?.enemyIds ?? [];
    }
    if (scenes.includes('Dialogue')) {
      const dialogue = this.game.scene.getScene('Dialogue') as unknown as { musicPlace?: () => { dialogue: string; node: string } };
      ctx.dialogue = dialogue.musicPlace?.() ?? null;
    }
    return ctx;
  }

  /** A reward just counted (one note at a time: the most important); a new or loaded game starts the count afresh. */
  private rewards(): void {
    const state = this.game.registry.get('game') as GameState | undefined;
    if (!state?.character) {
      this.lastState = null;
      this.counts = null;
      return;
    }
    const counts = rewardCounts(state);
    if (state !== this.lastState || !this.counts) {
      this.lastState = state;
      this.counts = counts;
      return;
    }
    const note = rewardNote(this.counts, counts);
    this.counts = counts;
    if (note) {
      log(`note:${fileFor(note)}`);
      this.player?.note(fileFor(note)!);
    }
  }
}
