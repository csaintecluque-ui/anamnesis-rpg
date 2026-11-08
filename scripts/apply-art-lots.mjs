// Mise en beauté (2026-11-08, docs/ASSETS.md) : after `npm run art` and `npm run tiles`, applies what the lots of
// scripts/art/<lot>.json declare beyond the tiles:
//  - « portraits » : the field `portrait` of each named character in src/data/npcs.json ;
//  - « walks » : each passer-by's walk sheet (scripts/assemble-walk.mjs, 2d) and its field `walk` in
//    src/data/figurants.json.
// The JSON files keep their layout (JSON.stringify with two spaces, as written).
// Usage: npm run lots
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { ART_LOTS } from './tiles-def.mjs';

const NPCS = 'src/data/npcs.json';
const FIGURANTS = 'src/data/figurants.json';
const npcs = JSON.parse(readFileSync(NPCS, 'utf8'));
const figurants = JSON.parse(readFileSync(FIGURANTS, 'utf8'));
const AVATAR = /^avatar-/;

/** A copy of the object with `key` set, placed after `after` if it is new (the files keep a readable order). */
function withKey(obj, key, value, after) {
  if (key in obj) return { ...obj, [key]: value };
  const out = {};
  let placed = false;
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v;
    if (k === after) {
      out[key] = value;
      placed = true;
    }
  }
  if (!placed) out[key] = value;
  return out;
}

let portraits = 0;
let walks = 0;
for (const lot of ART_LOTS) {
  for (const id of Object.keys(lot.portraits ?? {})) {
    if (AVATAR.test(id)) continue;
    const i = npcs.findIndex((n) => n.id === id);
    if (i < 0) throw new Error(`scripts/art/${lot.lot}.json : PNJ inconnu « ${id} »`);
    if (!existsSync(`public/portraits/${id}.jpg`)) {
      console.warn(`portrait ${id} : public/portraits/${id}.jpg absent (npm run art d'abord)`);
      continue;
    }
    npcs[i] = withKey(npcs[i], 'portrait', `portraits/${id}.jpg`, 'role');
    portraits++;
  }
  for (const [id, walk] of Object.entries(lot.walks ?? {})) {
    const i = figurants.findIndex((f) => f.id === id);
    if (i < 0) throw new Error(`scripts/art/${lot.lot}.json : passant inconnu « ${id} »`);
    const sheet = `public/sprites/figurant-${id}.png`;
    if (existsSync(`assets/raw/${walk.dir}/s.png`)) {
      execFileSync('node', ['scripts/assemble-walk.mjs', '2d', walk.dir, `figurant-${id}`, String(walk.height ?? 54)], { stdio: 'inherit' });
    } else if (!existsSync(sheet)) {
      console.warn(`marche ${id} : ni planche brute (assets/raw/${walk.dir}/) ni planche faite`);
      continue;
    }
    figurants[i] = withKey(figurants[i], 'walk', `sprites/figurant-${id}.png`, 'lines');
    walks++;
  }
}
writeFileSync(NPCS, `${JSON.stringify(npcs, null, 2)}\n`);
writeFileSync(FIGURANTS, `${JSON.stringify(figurants, null, 2)}\n`);
console.log(`${portraits} portrait(s), ${walks} marche(s) appliqués.`);
