import { describe, expect, it } from 'vitest';
import { SFX_IDS, SFX_VOLUME } from './sfx';

/** Les bruitages fabriqués par le code (npm run sfx ; étude du 2026-11-03, J2 et J3). */
const FILES = import.meta.glob('/public/audio/sfx/*.wav', { query: '?inline', import: 'default', eager: true }) as Record<string, string>;

function view(id: string): DataView {
  const url = FILES[`/public/audio/sfx/${id}.wav`];
  const bin = atob(url.slice(url.indexOf(',') + 1));
  return new DataView(Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer);
}

/** Share of a sound's energy above `cutoff` Hz (a one-pole high-pass): what a phone's small speaker can play. */
function shareAbove(id: string, cutoff: number): number {
  const v = view(id);
  const rate = v.getUint32(24, true);
  const n = v.getUint32(40, true) / 2;
  const a = 1 / (1 + 2 * Math.PI * cutoff / rate);
  let total = 0;
  let high = 0;
  let px = 0;
  let py = 0;
  for (let i = 0; i < n; i++) {
    const x = v.getInt16(44 + 2 * i, true) / 32768;
    py = a * (py + x - px);
    px = x;
    total += x * x;
    high += py * py;
  }
  return high / total;
}

function header(id: string) {
  const view_ = view(id);
  const text = (at: number) => String.fromCharCode(...[0, 1, 2, 3].map((i) => view_.getUint8(at + i)));
  return {
    riff: text(0),
    wave: text(8),
    pcm: view_.getUint16(20, true),
    channels: view_.getUint16(22, true),
    rate: view_.getUint32(24, true),
    seconds: view_.getUint32(40, true) / 2 / view_.getUint32(24, true),
  };
}

describe('the sound effects', () => {
  it('can be heard on a phone: most of the steps and of a blow above 300 Hz (essai de Cyril, 2026-11-04 : « un bruit métallique »)', () => {
    for (const id of ['pas-1', 'pas-2', 'pas-3', 'pas-4', 'coup', 'rate', 'soin', 'dialogue']) expect(shareAbove(id, 300), id).toBeGreaterThan(0.5);
  });

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
