import { describe, expect, it } from 'vitest';
import { SFX_IDS, SFX_VOLUME } from './sfx';

/** Les bruitages fabriqués par le code (npm run sfx ; étude du 2026-11-03, J2 et J3). */
const FILES = import.meta.glob('/public/audio/sfx/*.wav', { query: '?inline', import: 'default', eager: true }) as Record<string, string>;

function header(id: string) {
  const url = FILES[`/public/audio/sfx/${id}.wav`];
  const bin = atob(url.slice(url.indexOf(',') + 1));
  const view = new DataView(Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer);
  const text = (at: number) => String.fromCharCode(...[0, 1, 2, 3].map((i) => view.getUint8(at + i)));
  return {
    riff: text(0),
    wave: text(8),
    pcm: view.getUint16(20, true),
    channels: view.getUint16(22, true),
    rate: view.getUint32(24, true),
    seconds: view.getUint32(40, true) / 2 / view.getUint32(24, true),
  };
}

describe('the sound effects', () => {
  it('one file per sound, no more: mono PCM WAV at 22 050 Hz', () => {
    expect(Object.keys(FILES).sort()).toEqual(SFX_IDS.map((id) => `/public/audio/sfx/${id}.wav`).sort());
    for (const id of SFX_IDS) expect(header(id), id).toMatchObject({ riff: 'RIFF', wave: 'WAVE', pcm: 1, channels: 1, rate: 22050 });
  });

  it('short where they repeat (a step under a fifth of a second), the train long enough to be heard coming', () => {
    expect(header('pas-1').seconds).toBeLessThan(0.2);
    expect(header('coup').seconds).toBeLessThan(0.5);
    expect(header('train').seconds).toBeGreaterThan(5);
    for (const id of SFX_IDS) expect(SFX_VOLUME[id], id).toBeGreaterThan(0);
    expect(SFX_VOLUME['pas-1']).toBeLessThan(SFX_VOLUME.coup);
  });
});
