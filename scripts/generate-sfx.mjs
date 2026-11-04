// Les bruitages du jeu (étude du 2026-11-03, J2 et J3), fabriqués par le code : pas de fichier à télécharger, pas de
// crédit dépensé. Chaque son est une synthèse (bruit filtré, sinusoïdes, enveloppes), tirée d'un hasard à graine fixe :
// `npm run sfx` réécrit toujours les mêmes fichiers. Sortie : public/audio/sfx/<id>.wav (mono, 16 bits, 22 050 Hz).
// Les ambiances et la berceuse viendront plus tard, de Higgsfield (décision de Cyril, 2026-11-04).
import { mkdirSync, writeFileSync } from 'node:fs';

const RATE = 22050;
const out = new URL('../public/audio/sfx/', import.meta.url);
mkdirSync(out, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const buffer = (seconds) => new Float32Array(Math.round(seconds * RATE));
const noise = (rng) => rng() * 2 - 1;
/** A one-pole low-pass, coefficient from the cutoff. */
function lowpass(samples, cutoff) {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < samples.length; i++) samples[i] = y += a * (samples[i] - y);
  return samples;
}
/** A state-variable band-pass, its centre given per sample (a sweep). */
function bandpass(samples, centre, q = 4) {
  let low = 0;
  let band = 0;
  for (let i = 0; i < samples.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(centre(i / RATE), RATE / 6)) / RATE);
    low += f * band;
    const high = samples[i] - low - band / q;
    band += f * high;
    samples[i] = band;
  }
  return samples;
}
/** Attack then exponential decay, in seconds. */
const env = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) / decay));
/** Short fades at both ends: no click. */
function fades(samples, seconds = 0.004) {
  const n = Math.min(samples.length / 2, Math.round(seconds * RATE));
  for (let i = 0; i < n; i++) {
    samples[i] *= i / n;
    samples[samples.length - 1 - i] *= i / n;
  }
  return samples;
}
function normalize(samples, peak) {
  const max = samples.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  for (let i = 0; i < samples.length; i++) samples[i] *= peak / max;
  return samples;
}

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((v, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/**
 * A step on moss and packed earth: the heel, then the toe, softer, in the middle of the range (a phone's speaker
 * plays nothing under 300 Hz : a first version, all thud, only clicked there ; essai de Cyril, 2026-11-04), and a few
 * faint crackles of twigs.
 */
function pas(seed, centre) {
  const rng = mulberry32(seed);
  const s = buffer(0.16);
  const toe = 0.022 + rng() * 0.012;
  for (const [start, amp, decay] of [[0, 1, 0.03], [toe, 0.55, 0.024]]) {
    for (let i = Math.round(start * RATE); i < s.length; i++) s[i] += amp * noise(rng) * env(i / RATE - start, 0.006, decay);
  }
  bandpass(s, () => centre, 1.1);
  const crackle = buffer(0.16);
  for (let k = 0; k < 6; k++) {
    const at = Math.round((0.004 + rng() * 0.09) * RATE);
    for (let i = at; i < Math.min(crackle.length, at + 40); i++) crackle[i] += noise(rng) * 0.3 * (1 - (i - at) / 40);
  }
  bandpass(crackle, () => 3200, 2);
  for (let i = 0; i < s.length; i++) s[i] += crackle[i];
  return normalize(fades(s), 0.75);
}

/**
 * A blow that lands: a short smack in the middle of the range, a thud that falls from 320 to 170 Hz with its
 * overtone, and a little grit (a soft saturation) : what a small speaker can play.
 */
function coup() {
  const rng = mulberry32(31);
  const s = buffer(0.26);
  const smack = buffer(0.26);
  for (let i = 0; i < smack.length; i++) smack[i] = noise(rng) * env(i / RATE, 0.002, 0.03);
  bandpass(smack, () => 1100, 0.9);
  let phase = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / RATE;
    phase += (2 * Math.PI * (170 + 150 * Math.exp(-t / 0.04))) / RATE;
    s[i] = 0.7 * (Math.sin(phase) + 0.5 * Math.sin(2 * phase)) * env(t, 0.002, 0.07);
  }
  for (let i = 0; i < s.length; i++) s[i] = Math.tanh(1.8 * (0.8 * s[i] + 2 * smack[i]));
  return normalize(fades(s), 0.9);
}

/** A blow that misses: air, cut through. */
function rate() {
  const rng = mulberry32(47);
  const s = buffer(0.3);
  for (let i = 0; i < s.length; i++) {
    const t = i / RATE;
    s[i] = noise(rng) * (t < 0.07 ? t / 0.07 : Math.exp(-(t - 0.07) / 0.07));
  }
  bandpass(s, (t) => 500 + 2200 * Math.min(1, t / 0.2), 2.5);
  return normalize(fades(s), 0.7);
}

/**
 * Care given: a warm chord that swells and fades, and a breath of leaves (two bell notes, first, rang like a coin
 * picked up ; essai de Cyril, 2026-11-04).
 */
function soin() {
  const rng = mulberry32(83);
  const s = buffer(1.1);
  const swell = (t) => (t < 0.3 ? (t / 0.3) ** 2 : Math.exp(-(t - 0.3) / 0.35));
  for (let i = 0; i < s.length; i++) {
    const t = i / RATE;
    const tremolo = 1 + 0.15 * Math.sin(2 * Math.PI * 5.5 * t);
    s[i] = swell(t) * tremolo * (Math.sin(2 * Math.PI * 392 * t) + 0.7 * Math.sin(2 * Math.PI * 587.33 * t) + 0.25 * Math.sin(2 * Math.PI * 783.99 * t));
  }
  const air = buffer(1.1);
  for (let i = 0; i < air.length; i++) air[i] = noise(rng) * swell(i / RATE);
  bandpass(air, (t) => 1500 + 800 * t, 1.2);
  for (let i = 0; i < s.length; i++) s[i] = 0.8 * s[i] + 0.5 * air[i];
  return normalize(fades(s, 0.05), 0.55);
}

/** A dialogue opens: the rustle of a parchment, twice. */
function dialogue() {
  const rng = mulberry32(59);
  const s = buffer(0.22);
  for (const start of [0, 0.075]) {
    for (let i = Math.round(start * RATE); i < s.length; i++) s[i] += noise(rng) * env(i / RATE - start, 0.004, 0.025);
  }
  bandpass(s, () => 2800, 1.5);
  return normalize(fades(s), 0.55);
}

/** Something picked up: a bright pluck, a fifth above. */
function objet() {
  const s = buffer(0.4);
  const pluck = (freq, start) => {
    for (let i = Math.round(start * RATE); i < s.length; i++) {
      const t = i / RATE - start;
      s[i] += env(t, 0.003, 0.08) * (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 3 * t));
    }
  };
  pluck(1046.5, 0);
  pluck(1568, 0.085);
  return normalize(fades(s, 0.01), 0.6);
}

/**
 * The train one hears before seeing it, at the Gare Engloutie (étude, J3) : a far rumble that grows, the beat of the
 * steam quickening, a whistle in the distance, then the fading.
 */
function train() {
  const rng = mulberry32(73);
  const seconds = 7;
  const s = buffer(seconds);
  const swell = (t) => Math.min(1, t / 4.5) * (t > 5.6 ? Math.max(0, 1 - (t - 5.6) / 1.4) : 1);
  // The rumble: brown noise, low.
  let brown = 0;
  for (let i = 0; i < s.length; i++) {
    brown = (brown + 0.02 * noise(rng)) / 1.02;
    s[i] = brown * 3 * swell(i / RATE);
  }
  lowpass(s, 160);
  // The beat of the steam: bursts that come faster.
  const chuffs = buffer(seconds);
  let at = 0.4;
  while (at < seconds - 0.3) {
    const start = Math.round(at * RATE);
    for (let i = start; i < Math.min(chuffs.length, start + Math.round(0.18 * RATE)); i++) chuffs[i] += noise(rng) * env((i - start) / RATE, 0.01, 0.05);
    at += 0.5 - 0.3 * Math.min(1, at / 5);
  }
  bandpass(chuffs, () => 700, 2);
  // The wheels on the joints of the rails: « ta-dam », faster as it comes.
  const wheels = buffer(seconds);
  let joint = 0.6;
  while (joint < seconds - 0.5) {
    for (const offset of [0, 0.11]) {
      const start = Math.round((joint + offset) * RATE);
      for (let i = start; i < Math.min(wheels.length, start + Math.round(0.03 * RATE)); i++) wheels[i] += noise(rng) * env((i - start) / RATE, 0.002, 0.008);
    }
    joint += 0.9 - 0.45 * Math.min(1, joint / 5);
  }
  bandpass(wheels, () => 1600, 1.5);
  for (let i = 0; i < s.length; i++) s[i] = 0.6 * s[i] + (0.9 * chuffs[i] + 0.7 * wheels[i]) * swell(i / RATE);
  // The whistle, far: two notes, a slow vibrato.
  for (let i = Math.round(4.1 * RATE); i < Math.round(5.7 * RATE); i++) {
    const t = i / RATE - 4.1;
    const e = Math.min(1, t / 0.2) * Math.min(1, (1.6 - t) / 0.4);
    const vib = 1 + 0.004 * Math.sin(2 * Math.PI * 5 * t);
    s[i] += 0.12 * e * (Math.sin(2 * Math.PI * 587.33 * vib * t) + 0.8 * Math.sin(2 * Math.PI * 739.99 * vib * t));
  }
  return normalize(fades(s, 0.3), 0.7);
}

const SOUNDS = {
  'pas-1': pas(11, 420),
  'pas-2': pas(17, 480),
  'pas-3': pas(23, 380),
  'pas-4': pas(29, 520),
  coup: coup(),
  rate: rate(),
  soin: soin(),
  dialogue: dialogue(),
  objet: objet(),
  train: train(),
};
for (const [id, samples] of Object.entries(SOUNDS)) {
  writeFileSync(new URL(`${id}.wav`, out), wav(samples));
  console.log(`${id}.wav  ${(samples.length / RATE).toFixed(2)} s`);
}
