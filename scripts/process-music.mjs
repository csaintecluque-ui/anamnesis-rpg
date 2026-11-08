// npm run music : les morceaux bruts de Higgsfield (assets/raw/musique/, local, hors dépôt) → public/audio/musique/,
// en MP3 mono 96 kbit/s, tous au même volume (−20 LUFS), silences du début et de la fin retirés (docs/gdd/son.md).
// Écrit src/data/musique-fichiers.json : pour chaque fichier, une empreinte de son contenu (la clé du cache : un
// morceau refait ne sort jamais d'un ancien cache), sa durée et son poids.
//   node scripts/process-music.mjs            ne refait que les fichiers absents ou plus vieux que leur brut
//   node scripts/process-music.mjs --force    refait tout
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const RAW = 'assets/raw/musique';
const OUT = 'public/audio/musique';
const MANIFEST = 'src/data/musique-fichiers.json';
const TARGET = { I: -20, TP: -1.5, LRA: 11 };
const force = process.argv.includes('--force');

const { pistes } = JSON.parse(readFileSync('src/data/musique.json', 'utf8'));
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
mkdirSync(OUT, { recursive: true });

const names = pistes.flatMap((t) => (t.variantes ? t.variantes.map((v) => `${t.id}-${v}`) : [t.id]));
// Silence at both ends: the music starts at once, and the crossfade of a loop is not a dip into nothing.
const TRIM =
  'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.05,areverse,' +
  'silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.3,areverse';

/** First pass of loudnorm: the track's loudness, read from ffmpeg's report (stderr). */
function measure(src) {
  const filter = `${TRIM},loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}:print_format=json`;
  const run = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', src, '-ac', '1', '-af', filter, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 24 });
  const report = run.stderr.slice(run.stderr.lastIndexOf('{'));
  return JSON.parse(report.slice(0, report.indexOf('}') + 1));
}

let done = 0;
const missing = [];
for (const name of names) {
  const src = `${RAW}/${name}.mp3`;
  const dst = `${OUT}/${name}.mp3`;
  if (!existsSync(src)) {
    if (!existsSync(dst)) missing.push(name);
    continue;
  }
  if (!force && existsSync(dst) && manifest[name] && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue;
  // Two passes: measure, then a linear gain (no pumping on quiet ambiences).
  const stats = measure(src);
  const filter =
    `${TRIM},loudnorm=I=${TARGET.I}:TP=${TARGET.TP}:LRA=${TARGET.LRA}:linear=true:` +
    `measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:` +
    `measured_thresh=${stats.input_thresh}:offset=${stats.target_offset},aresample=44100`;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-ac', '1', '-af', filter, '-c:a', 'libmp3lame', '-b:a', '96k', '-map_metadata', '-1', dst]);
  const duree = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], { encoding: 'utf8' }).trim());
  const bytes = readFileSync(dst);
  manifest[name] = { v: createHash('sha1').update(bytes).digest('hex').slice(0, 8), duree: Math.round(duree * 10) / 10, octets: bytes.length };
  done++;
  console.log(`${name} : ${manifest[name].duree} s, ${Math.round(bytes.length / 1024)} Ko (mesuré ${stats.input_i} LUFS)`);
}

// Only the files of the data, in its order.
const ordered = Object.fromEntries(names.filter((n) => manifest[n]).map((n) => [n, manifest[n]]));
writeFileSync(MANIFEST, `${JSON.stringify(ordered, null, 2)}\n`);
const total = Object.values(ordered).reduce((sum, f) => sum + f.octets, 0);
console.log(`${done} fichier(s) refait(s) ; ${Object.keys(ordered).length} / ${names.length} prêts, ${(total / 1024 / 1024).toFixed(1)} Mo.`);
if (missing.length) console.log(`Manquants (ni brut ni réduit) : ${missing.join(', ')}`);
