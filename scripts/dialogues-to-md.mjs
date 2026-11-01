// Writes docs/DIALOGUES.md: a readable script of every dialogue, generated from src/data/dialogues/*.json
// so Cyril can review the texts (on GitHub, from a phone). Usage: npm run dialogues
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const npcs = read('src/data/npcs.json');
const quests = read('src/data/quests.json');
const attributes = read('src/data/attributes.json');
const skills = read('src/data/skills.json');

const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? id;

function condition(c) {
  if ('attribute' in c) return `**[${nameOf(attributes, c.attribute)} ${c.min}]**`;
  if ('skill' in c) return `**[${nameOf(skills, c.skill)} ${c.min}]**`;
  if ('flag' in c) return `_(si repère « ${c.flag} »)_`;
  if ('notFlag' in c) return `_(sans repère « ${c.notFlag} »)_`;
  const status = { none: 'pas commencée', active: 'en cours', done: 'terminée' }[c.status];
  return `_(si quête « ${nameOf(quests, c.quest)} » ${status})_`;
}

function effect(e) {
  if ('setFlag' in e) return `retient « ${e.setFlag} »`;
  if ('startQuest' in e) return `lance la quête « ${nameOf(quests, e.startQuest)} »`;
  if ('completeQuest' in e) return `termine la quête « ${nameOf(quests, e.completeQuest)} »`;
  return `+${e.giveXp} XP`;
}

const lines = [
  '# Dialogues — texte à relire',
  '',
  'Document **généré** à partir de `src/data/dialogues/*.json` (`npm run dialogues`) : ne pas le modifier à la main.',
  'Statut des textes (validé ou à valider) : voir `docs/univers/personnages/pnj.md` et `docs/univers/lieux/gare-engloutie.md`.',
  '',
  'Légende : **[Perception 4]** = test d’attribut ou de compétence (option visible mais grisée si le seuil manque) ;',
  '_(si …)_ = option qui n’apparaît que dans cette situation ; → = où mène la réponse.',
  '',
];

for (const file of readdirSync(new URL('src/data/dialogues/', root)).filter((f) => f.endsWith('.json')).sort()) {
  const d = read(`src/data/dialogues/${file}`);
  const npc = npcs.find((n) => n.id === d.speaker);
  lines.push(`## ${npc?.name ?? d.speaker}`, '', `_${npc?.role ?? ''}_`, '');
  lines.push(
    'Commence par : ' +
      d.entries.map((e) => `« ${e.node} »${e.requires?.length ? ' ' + e.requires.map(condition).join(' ') : ''}`).join(', sinon '),
    '',
  );
  for (const [id, node] of Object.entries(d.nodes)) {
    lines.push(`### ${id}`, '');
    if (node.effects?.length) lines.push(`_Effet : ${node.effects.map(effect).join(', ')}._`, '');
    lines.push(`> ${node.text}`, '');
    for (const o of node.options) {
      const req = o.requires?.length ? o.requires.map(condition).join(' ') + ' ' : '';
      const fx = o.effects?.length ? ` _(${o.effects.map(effect).join(', ')})_` : '';
      lines.push(`- ${req}« ${o.text} » → ${o.next === 'fin' ? '**fin**' : o.next}${fx}`);
    }
    lines.push('');
  }
}

writeFileSync(new URL('docs/DIALOGUES.md', root), lines.join('\n'));
console.log('docs/DIALOGUES.md');
