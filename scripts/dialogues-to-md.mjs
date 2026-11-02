// Writes docs/DIALOGUES.md: a readable script of every dialogue, generated from src/data/dialogues/*.json
// so Cyril can review the texts (on GitHub, from a phone). Usage: npm run dialogues
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const npcs = read('src/data/npcs.json');
const quests = read('src/data/quests.json');
const recits = read('src/data/recits.json');
const attributes = read('src/data/attributes.json');
const skills = read('src/data/skills.json');
const items = read('src/data/items.json');
const locations = read('src/data/locations.json');

const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? id;

function condition(c) {
  if ('attribute' in c) return `**[${nameOf(attributes, c.attribute)} ${c.min}]**`;
  if ('skill' in c) return `**[${nameOf(skills, c.skill)} ${c.min}]**`;
  if ('flag' in c) return `_(si repère « ${c.flag} »)_`;
  if ('notFlag' in c) return `_(sans repère « ${c.notFlag} »)_`;
  if ('recit' in c) return `_(si Récit « ${titleOf(c.recit)} » connu)_`;
  if ('fers' in c) return `**[${c.fers} Fers]**`;
  if ('reputation' in c) return `**[réputation à ${c.reputation} ≥ ${c.min}]**`;
  const status = { none: 'pas commencée', active: 'en cours', done: 'terminée' }[c.status];
  return `_(si quête « ${nameOf(quests, c.quest)} » ${status})_`;
}

function effect(e) {
  if ('setFlag' in e) return `retient « ${e.setFlag} »`;
  if ('startQuest' in e) return `lance la quête « ${nameOf(quests, e.startQuest)} »`;
  if ('completeQuest' in e) return `termine la quête « ${nameOf(quests, e.completeQuest)} »`;
  if ('giveFers' in e) return `${e.giveFers >= 0 ? '+' : '−'}${Math.abs(e.giveFers)} Fers`;
  if ('learnRecit' in e) return `retient le Récit « ${titleOf(e.learnRecit)} »`;
  if ('openTrade' in e) return 'ouvre le Troc';
  if ('giveItem' in e) return `donne ${e.count ?? 1} × « ${nameOf(items, e.giveItem)} »`;
  if ('heal' in e) return `+${e.heal} PV`;
  if ('startCombat' in e) return `lance le combat « ${e.startCombat} »`;
  if ('goTo' in e) return `mène à « ${nameOf(locations, e.goTo)} »`;
  return `+${e.giveXp} XP`;
}

function titleOf(id) {
  return recits.find((r) => r.id === id)?.titre ?? id;
}

const lines = [
  '# Dialogues — texte à relire',
  '',
  'Document **généré** à partir de `src/data/dialogues/*.json` (`npm run dialogues`) : ne pas le modifier à la main.',
  'Statut des textes (validé ou à valider) : voir `docs/univers/personnages/pnj.md`, `docs/univers/lieux/gare-engloutie.md`',
  'et, pour Canopéa et les rencontres en voyage, `docs/univers/lieux/canopee.md` et `docs/gdd/carte-du-monde.md`.',
  '',
  'Légende : **[Perception 4]** = test d’attribut ou de compétence (option visible mais grisée si le seuil manque) ;',
  '_(si …)_ = option qui n’apparaît que dans cette situation ; → = où mène la réponse.',
  '**🎲 Discrétion 10** = jet de dé (d20 + modificateur + rang contre 10) : → en cas de réussite, ✗ → en cas d’échec.',
  '🌙 = scène de nuit (le fond s’assombrit).',
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
    lines.push(`> ${node.night ? '🌙 ' : ''}${node.text}`, '');
    const target = (next) => (next === 'fin' ? '**fin**' : next);
    for (const o of node.options) {
      const req = o.requires?.length ? o.requires.map(condition).join(' ') + ' ' : '';
      const roll = o.roll ? `**🎲 ${nameOf(skills, o.roll.skill)} ${o.roll.difficulty}** ` : '';
      const fx = o.effects?.length ? ` _(${o.effects.map(effect).join(', ')})_` : '';
      const fail = o.failNext ? `, ✗ → ${target(o.failNext)}` : '';
      lines.push(`- ${req}${roll}« ${o.text} » → ${target(o.next)}${fail}${fx}`);
    }
    lines.push('');
  }
}

writeFileSync(new URL('docs/DIALOGUES.md', root), lines.join('\n'));
console.log('docs/DIALOGUES.md');
