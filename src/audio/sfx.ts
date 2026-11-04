import type Phaser from 'phaser';

/**
 * Les bruitages (étude du 2026-11-03, J2 et J3 ; décision de Cyril du 2026-11-04 : par le code d'abord, Higgsfield à la
 * fin pour les ambiances). Fabriqués par `npm run sfx` (scripts/generate-sfx.mjs) dans public/audio/sfx/. Le volume
 * général des options s'applique à tous.
 */
export const SFX_IDS = ['pas-1', 'pas-2', 'coup', 'rate', 'soin', 'dialogue', 'objet', 'train'] as const;
export type SfxId = (typeof SFX_IDS)[number];

/** Each sound's own level, under the general volume: steps barely there, the train far away. */
export const SFX_VOLUME: Record<SfxId, number> = {
  'pas-1': 0.16,
  'pas-2': 0.16,
  coup: 0.6,
  rate: 0.45,
  soin: 0.5,
  dialogue: 0.3,
  objet: 0.5,
  train: 0.55,
};

const key = (id: SfxId): string => `sfx-${id}`;

export function loadSfx(load: Phaser.Loader.LoaderPlugin): void {
  for (const id of SFX_IDS) load.audio(key(id), `audio/sfx/${id}.wav`);
}

/** Plays a sound if the browser lets the game make any (no sound card, a file missing: silence, never an error). */
export function playSfx(scene: Phaser.Scene, id: SfxId): void {
  try {
    if (scene.cache.audio.exists(key(id))) scene.sound.play(key(id), { volume: SFX_VOLUME[id] });
  } catch {
    // Silence rather than a broken game.
  }
}

let stepCount = 0;
/** One step out of two on each foot. */
export function playStep(scene: Phaser.Scene): void {
  playSfx(scene, stepCount++ % 2 === 0 ? 'pas-1' : 'pas-2');
}
