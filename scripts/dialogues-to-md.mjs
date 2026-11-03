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
const powers = read('src/data/powers.json');
const echos = read('src/data/echos.json');
const companions = read('src/data/companions.json');
const MOMENTS = { matin: 'le matin', midi: 'à midi', soir: 'le soir', nuit: 'la nuit', jour: 'le jour' };
const companionName = (id) => nameOf(companions, id).split(' ')[0];

const nameOf = (list, id) => list.find((x) => x.id === id)?.name ?? id;

function condition(c) {
  if ('attribute' in c) return `**[${nameOf(attributes, c.attribute)} ${c.min}]**`;
  if ('skill' in c) return `**[${nameOf(skills, c.skill)} ${c.min}]**`;
  if ('flag' in c) return `_(si repère « ${c.flag} »)_`;
  if ('notFlag' in c) return `_(sans repère « ${c.notFlag} »)_`;
  if ('recit' in c) return `_(si Récit « ${titleOf(c.recit)} » connu)_`;
  if ('fers' in c) return `**[${c.fers} Fers]**`;
  if ('reputation' in c) return `**[réputation à ${c.reputation} ≥ ${c.min}]**`;
  if ('item' in c) return `_(si l’on porte « ${nameOf(items, c.item)} »${(c.count ?? 1) > 1 ? ` × ${c.count}` : ''})_`;
  if ('moment' in c) return `_(${MOMENTS[c.moment] ?? c.moment})_`;
  if ('tousLes' in c) return `_(un jour sur ${c.tousLes}, le ${c.decalage + 1}e)_`;
  if ('cristal' in c) return c.cristal ? '_(un cristal au cou)_' : '_(sans cristal au cou)_';
  if ('compagnon' in c) return `_(si ${companionName(c.compagnon)} suit le héros)_`;
  if ('avis' in c) {
    const range = [c.min !== undefined ? `≥ ${c.min}` : '', c.max !== undefined ? `≤ ${c.max}` : ''].filter(Boolean).join(' et ');
    return `_(avis de ${companionName(c.avis)} ${range})_`;
  }
  if ('lieu' in c) return `_(à « ${nameOf(locations, c.lieu)} »)_`;
  if ('usureCristal' in c) return `_(si le cristal porté a servi ${c.usureCristal} fois ou plus sans être réaccordé)_`;
  if ('echos' in c) return `_(${c.echos} Échos recueillis ou plus)_`;
  if ('marques' in c) return `_(${c.marques} marque${c.marques > 1 ? 's' : ''} du cristal ou plus${c.max !== undefined ? `, ${c.max} au plus` : ''})_`;
  if ('quest' in c) {
    const status = { none: 'pas commencée', active: 'en cours', done: 'terminée' }[c.status];
    return `_(si quête « ${nameOf(quests, c.quest)} » ${status})_`;
  }
  throw new Error(`condition inconnue : ${JSON.stringify(c)}`);
}

function effect(e) {
  if ('setFlag' in e) return `retient « ${e.setFlag} »`;
  if ('setFlagFor' in e) return `retient « ${e.setFlagFor} » pour ${e.days} jours`;
  if ('reaccorder' in e) return 'réaccorde le cristal porté';
  if ('donnerRecit' in e) return `donne le Récit « ${titleOf(e.donnerRecit)} »`;
  if ('startQuest' in e) return `lance la quête « ${nameOf(quests, e.startQuest)} »`;
  if ('completeQuest' in e) return `termine la quête « ${nameOf(quests, e.completeQuest)} »`;
  if ('giveFers' in e) return `${e.giveFers >= 0 ? '+' : '−'}${Math.abs(e.giveFers)} Fers`;
  if ('learnRecit' in e) return `retient le Récit « ${titleOf(e.learnRecit)} »`;
  if ('openTrade' in e) return 'ouvre le Troc';
  if ('giveItem' in e) return `donne ${e.count ?? 1} × « ${nameOf(items, e.giveItem)} »`;
  if ('takeItem' in e) return `reprend ${e.count ?? 1} × « ${nameOf(items, e.takeItem)} »`;
  if ('heal' in e) return `+${e.heal} PV`;
  if ('startCombat' in e) return `lance le combat « ${e.startCombat} »`;
  if ('goTo' in e) return `mène à « ${nameOf(locations, e.goTo)} »`;
  if ('veillee' in e) return `ouvre la veillée « ${e.veillee} »`;
  if ('atelier' in e) return `ouvre l’atelier « ${e.atelier} »`;
  if ('contrat' in e) return 'remplit le contrat en cours';
  if ('attendre' in e) return `attend ${MOMENTS[e.attendre] ?? e.attendre}`;
  if ('avancer' in e) return `fait passer ${e.avancer} moment${e.avancer > 1 ? 's' : ''}`;
  if ('dormir' in e) return `dort jusqu’${e.dormir === 'matin' ? 'au matin' : `à ${MOMENTS[e.dormir] ?? e.dormir}`}`;
  if ('lancer' in e) return `lance « ${nameOf(powers, e.lancer)} »`;
  if ('apprendre' in e) return `apprend un rang de ${nameOf(skills, e.apprendre)}`;
  if ('rejoindre' in e) return `${companionName(e.rejoindre)} se joint au héros`;
  if ('quitter' in e) return `${companionName(e.quitter)} rentre chez soi`;
  if ('avis' in e) return `avis de ${companionName(e.avis)} ${e.delta >= 0 ? '+' : '−'}${Math.abs(e.delta)}`;
  if ('revivre' in e) return `revit l’Écho « ${echos.find((x) => x.id === e.revivre)?.titre ?? e.revivre} »`;
  if ('blesser' in e) return `−${e.blesser} PV`;
  if ('effacerMarques' in e) return 'efface les marques du cristal (et un rang de Résonance)';
  if ('giveXp' in e) return `+${e.giveXp} XP`;
  throw new Error(`effet inconnu : ${JSON.stringify(e)}`);
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
    for (const [who, aside] of Object.entries(node.apartes ?? {})) lines.push(`_Si ${who === 'liane' ? 'Liane' : who === 'boulon' ? 'Boulon' : who} voyage avec toi :_ ${aside}`, '');
    const target = (next) => (next === 'fin' ? '**fin**' : next);
    for (const o of node.options) {
      const req = o.requires?.length ? o.requires.map(condition).join(' ') + ' ' : '';
      const roll = o.roll ? `**🎲 ${nameOf(skills, o.roll.skill)} ${o.roll.difficulty}** ` : '';
      const fx = o.effects?.length ? ` _(${o.effects.map(effect).join(', ')})_` : '';
      const fail = o.failNext ? `, ✗ → ${target(o.failNext)}` : '';
      // Raconter un Récit (feuille de route, chantier 1): where each kind of Récit leads.
      const r = o.raconter;
      const tell = r
        ? ` 📖 ${r.donne ? 'donner' : 'raconter'} un Récit : ${[
            ...Object.entries(r.recits ?? {}).map(([id, n]) => `${id} → ${target(n)}`),
            r.aime?.length ? `${r.aime.join(', ')} → ${target(r.touche ?? r.neutre)}` : '',
            r.refus ? `autres → ${target(r.refus)} (refusé)` : `autres → ${target(r.neutre)}`,
          ].filter(Boolean).join(' ; ')}`
        : '';
      lines.push(`- ${req}${roll}« ${o.text} » → ${target(o.next)}${fail}${fx}${tell}`);
    }
    lines.push('');
  }
}

writeFileSync(new URL('docs/DIALOGUES.md', root), lines.join('\n'));
console.log('docs/DIALOGUES.md');
