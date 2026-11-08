import { FILES, findTrack, fileUrl, trackLevel, type TrackDef } from './musicRules';

/**
 * Le lecteur de musique (docs/gdd/son.md). Chaque morceau est un fichier MP3 lu par un élément audio branché dans le
 * graphe Web Audio de Phaser : le volume général des options s'y applique, comme aux bruitages, et le réglage
 * « Musique » par-dessus. Les changements de morceau se font en fondu ; une boucle se relance en fondu enchaîné sur
 * elle-même.
 *
 * **Mis en cache à la première écoute**, pas à l'installation (la musique pèse ≈ 67 Mo, trop pour le cache hors
 * ligne) : un morceau est joué depuis son adresse, en flux, donc tout de suite ; une fois qu'il joue, une copie entière
 * est rangée dans le cache « anamnesis-musique », en arrière-plan. Ensuite, le service worker (vite.config.ts) le sert
 * depuis ce cache, par morceaux comme le demande un lecteur audio, même hors ligne. Hors ligne, un morceau jamais
 * entendu ne remplace pas celui qui joue.
 */
export const MUSIC_CACHE = 'anamnesis-musique';
/** Seconds of crossfade between two tracks, and at the loop of a track on itself. */
const FADE = 2.5;
const LOOP_FADE = 6;
/** A place's music left for a fight or a dialogue picks up where it was, if one comes back within five minutes. */
const RESUME_MS = 5 * 60_000;
/** Under a short note, the music drops to this share, then comes back. */
const DUCK = 0.3;

interface Voice {
  name: string;
  track: TrackDef;
  audio: HTMLAudioElement;
  gain: GainNode;
  source: MediaElementAudioSourceNode;
  /** Its loop's next round has already been started. */
  relooped: boolean;
  /** Fading out, then stopped. */
  leaving: boolean;
  /** Should be heard: a refused play() (no gesture yet) is tried again. */
  wantsPlay: boolean;
}

export class MusicPlayer {
  private readonly ctx: AudioContext;
  /** The music setting (0 to 1). */
  private readonly bus: GainNode;
  /** Lowered under a short note. */
  private readonly duck: GainNode;
  private current: Voice | null = null;
  private voices: Voice[] = [];
  /** The file asked for last. */
  private wanted: string | null = null;
  private positions = new Map<string, { time: number; at: number }>();
  /** Files whose whole copy is in the cache (read once at start, then kept up to date). */
  private cached = new Set<string>();
  private caching = new Set<string>();

  constructor(ctx: AudioContext, output: AudioNode) {
    this.ctx = ctx;
    this.bus = ctx.createGain();
    this.duck = ctx.createGain();
    this.duck.connect(this.bus);
    this.bus.connect(output);
    void readCache().then((names) => names.forEach((n) => this.cached.add(n)));
  }

  /** The music setting, 0 to 100. */
  setVolume(percent: number): void {
    this.bus.gain.setTargetAtTime(Math.max(0, Math.min(1, percent / 100)), this.ctx.currentTime, 0.05);
  }

  /** The file playing now: `gardebois-jour`, `combat-b`. */
  get playing(): string | null {
    return this.wanted;
  }

  /** A copy is being put in the cache: the prefetch of the short notes waits, so it never slows a track down. */
  get busy(): boolean {
    return this.caching.size > 0 || (!!this.current && this.current.audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
  }

  /** Where the current track is, in seconds (null while it loads). */
  position(): { time: number; duration: number } | null {
    const audio = this.current?.audio;
    return audio && Number.isFinite(audio.duration) ? { time: audio.currentTime, duration: audio.duration } : null;
  }

  /** Plays a file (a track's take) in place of the current one, in a crossfade; the same file: nothing changes. */
  play(name: string | null): void {
    if (name === this.wanted) return;
    // Offline, a track never heard cannot load: the one playing goes on (it is asked again when back online).
    if (name && !navigator.onLine && !this.cached.has(name)) return;
    this.wanted = name;
    const previous = this.current;
    this.current = null;
    const track = name ? findTrack(trackIdOf(name)) : undefined;
    if (name && track) {
      const saved = this.positions.get(name);
      const start = track.boucle && saved && performance.now() - saved.at < RESUME_MS ? saved.time : 0;
      this.current = this.start(name, track, start, previous ? FADE : FADE / 2);
    }
    this.leave(previous, FADE);
  }

  /** A short note over the music, which steps aside while it plays. */
  note(name: string): void {
    const track = findTrack(trackIdOf(name));
    if (!track || (!navigator.onLine && !this.cached.has(name))) return;
    const voice = this.start(name, track, 0, 0.02, this.bus);
    const length = FILES[name]?.duree ?? 8;
    const now = this.ctx.currentTime;
    this.duck.gain.cancelScheduledValues(now);
    this.duck.gain.setValueAtTime(this.duck.gain.value, now);
    this.duck.gain.linearRampToValueAtTime(DUCK, now + 0.4);
    this.duck.gain.setValueAtTime(DUCK, now + Math.max(0.5, length - 1.5));
    this.duck.gain.linearRampToValueAtTime(1, now + length + 1.5);
    voice.audio.addEventListener('ended', () => this.drop(voice), { once: true });
  }

  /** Puts files in the cache ahead of time (the short notes: they play at once, offline too). */
  prefetch(names: string[]): void {
    for (const name of names) this.keep(name);
  }

  /**
   * Called a few times a second: the loop of the current track (a new round in a crossfade before the end), a play()
   * refused before the player's first gesture tried again.
   */
  tick(): void {
    const voice = this.current;
    if (voice && !voice.leaving && voice.track.boucle && !voice.relooped) {
      const left = voice.audio.duration - voice.audio.currentTime;
      if (Number.isFinite(left) && left < LOOP_FADE) {
        voice.relooped = true;
        this.current = this.start(voice.name, voice.track, 0, LOOP_FADE);
        this.leave(voice, LOOP_FADE);
      }
    }
    for (const v of this.voices) if (v.wantsPlay && v.audio.paused && !v.audio.ended) void v.audio.play().catch(() => undefined);
  }

  /** Stops everything at once (the listening page takes over). */
  stopAll(): void {
    this.wanted = null;
    this.current = null;
    for (const v of [...this.voices]) this.drop(v);
  }

  private start(name: string, track: TrackDef, at: number, fadeIn: number, into: AudioNode = this.duck): Voice {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = fileUrl(name);
    if (at > 0) audio.currentTime = at;
    const source = this.ctx.createMediaElementSource(audio);
    const gain = this.ctx.createGain();
    source.connect(gain);
    gain.connect(into);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(trackLevel(track), now + fadeIn);
    const voice: Voice = { name, track, audio, gain, source, relooped: false, leaving: false, wantsPlay: true };
    this.voices.push(voice);
    audio.addEventListener('ended', () => {
      voice.wantsPlay = false;
    });
    // Once it plays, a whole copy goes to the cache, in the background.
    audio.addEventListener('playing', () => this.keep(name), { once: true });
    void audio.play().catch(() => undefined);
    return voice;
  }

  private leave(voice: Voice | null, fade: number): void {
    if (!voice || voice.leaving) return;
    voice.leaving = true;
    if (voice.track.boucle && !voice.relooped) this.positions.set(voice.name, { time: voice.audio.currentTime, at: performance.now() });
    const now = this.ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + fade);
    window.setTimeout(() => this.drop(voice), fade * 1000 + 100);
  }

  private drop(voice: Voice): void {
    voice.wantsPlay = false;
    voice.audio.pause();
    try {
      voice.source.disconnect();
      voice.gain.disconnect();
    } catch {
      // Already disconnected.
    }
    voice.audio.removeAttribute('src');
    voice.audio.load();
    this.voices = this.voices.filter((v) => v !== voice);
  }

  /** A whole copy of the file in the cache (once). */
  private keep(name: string): void {
    if (this.cached.has(name) || this.caching.has(name) || typeof caches === 'undefined') return;
    this.caching.add(name);
    void (async () => {
      try {
        const cache = await caches.open(MUSIC_CACHE);
        const url = fileUrl(name);
        if (!(await cache.match(url))) {
          const response = await fetch(url);
          if (!response.ok || response.status !== 200) return;
          await cache.put(url, response);
        }
        this.cached.add(name);
      } catch {
        // Storage refused (private mode, quota): it will be streamed again next time.
      } finally {
        this.caching.delete(name);
      }
    })();
  }
}

/** `combat-b` → `combat` ; `gardebois-jour` → `gardebois-jour`. */
export function trackIdOf(name: string): string {
  return findTrack(name) ? name : name.replace(/-[ab]$/, '');
}

/** The files whose current take is in the cache; older takes (another hash) are removed. */
async function readCache(): Promise<string[]> {
  if (typeof caches === 'undefined') return [];
  try {
    const cache = await caches.open(MUSIC_CACHE);
    const byUrl = new Map(Object.keys(FILES).map((name) => [new URL(fileUrl(name), document.baseURI).href, name]));
    const names: string[] = [];
    for (const request of await cache.keys()) {
      const name = byUrl.get(request.url);
      if (name) names.push(name);
      else await cache.delete(request);
    }
    return names;
  } catch {
    return [];
  }
}

/** How many of the files are already in the cache (the listening page shows it). */
export async function cachedCount(): Promise<number> {
  return (await readCache()).length;
}
