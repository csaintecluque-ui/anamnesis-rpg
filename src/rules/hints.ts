import npcData from '../data/npcs.json';
import type { MapObject } from '../engine/tiledMap';
import type { GameState } from '../state/gameState';
import { ATTRIBUTES, SKILLS } from './attributes';
import { findEnemy } from './combat';
import { rollBonus, rollChance, type OptionView } from './dialogue';
import { ECHOS, echoFlag } from './echos';

/**
 * Ce que dit l'infobulle (feuille de route, chantier 0, docs/gdd/interface.md) : what a click does on each thing of
 * the map, and what a roll or a test of a dialogue option asks. Pure functions, tested.
 */

const npcs = npcData as { id: string; name: string; role?: string }[];
const nameOf = (id: string): string | undefined => npcs.find((n) => n.id === id)?.name;

/** « Ilyane Voix-d'Écorce — parler », « Auberge des Sept Routes — entrer », « Une caisse — la fouiller »… */
export function mapObjectHint(o: MapObject, state: Pick<GameState, 'flags'>): string | null {
  const p = o.properties;
  if (p.echo) {
    const echo = ECHOS.find((e) => e.id === p.echo);
    return echo && state.flags[echoFlag(echo.id)] ? `Écho recueilli : ${echo.titre} — le revoir` : 'Un Écho — l’écouter';
  }
  if (p.contrats) return 'Tableau des contrats — le lire';
  if (p.lueur) return 'Une caisse qui luit — la fouiller';
  switch (o.type) {
    case 'pnj':
      return `${nameOf(o.name) ?? o.name} — parler`;
    case 'porte': {
      const place = p.libelle ?? 'Une porte';
      return p.verrou && !state.flags[p.verrou] ? `${place} — fermée` : `${place} — entrer`;
    }
    case 'sortie':
      return p.libelle ?? 'Sortir';
    case 'panneau':
      return 'Lire';
    case 'golem':
      return 'Golem de Ferraille';
    case 'ennemi':
      return `${findEnemy(p.ennemi ?? '')?.name ?? 'Un ennemi'} — combattre`;
    case 'descente':
      return 'Descendre au niveau suivant';
    case 'objet':
      return `${nameOf(o.name) ?? 'Quelque chose'} — examiner`;
    default:
      return null;
  }
}

/** For an option with a roll or a test: what it asks, and the hero's chances. Null for a plain option. */
export function optionHint(view: OptionView, state: GameState): string | null {
  const lines: string[] = [];
  const c = state.character;
  for (const r of view.option.requires ?? []) {
    if ('skill' in r) {
      const skill = SKILLS.find((s) => s.id === r.skill);
      lines.push(`Il faut ${skill?.name ?? r.skill} ${r.min} : tu as ${c?.skills[r.skill] ?? 0}.`);
    } else if ('attribute' in r) {
      const attribute = ATTRIBUTES.find((a) => a.id === r.attribute);
      lines.push(`Il faut ${attribute?.name ?? r.attribute} ${r.min} : tu as ${c?.attributes[r.attribute] ?? 0}.`);
    } else if ('fers' in r) {
      lines.push(`Il faut ${r.fers} Fers : tu en as ${c?.fers ?? 0}.`);
    }
  }
  const roll = view.option.roll;
  if (roll) {
    const skill = SKILLS.find((s) => s.id === roll.skill);
    const bonus = rollBonus(state, roll.skill);
    const sign = bonus < 0 ? '−' : '+';
    lines.push(`Jet : un d20 ${sign} ${Math.abs(bonus)} (${skill?.name ?? roll.skill}) contre ${roll.difficulty}.`);
    lines.push(`Chances : ${Math.round(rollChance(state, roll) * 100)} %. Un 20 réussit toujours, un 1 rate toujours.`);
  }
  return lines.length ? lines.join('\n') : null;
}
