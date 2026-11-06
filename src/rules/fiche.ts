import type { GameState } from '../state/gameState';
import { ATTRIBUTES, SKILLS, attributeModifier } from './attributes';
import { characterStats, findFeat, findTrait, wearPenalty, type Slot } from './character';
import { successChance } from './checks';
import { findCompanion } from './companions';
import { rollBonus } from './dialogue';
import { findItem } from './inventory';
import { xpForLevel } from './leveling';
import { resonanceMax, wornCrystal } from './magic';

/**
 * La fiche de personnage (étude du 2026-11-03, B1) : un onglet du journal. Ce que le héros vaut, en chiffres : ses
 * attributs, ce que chaque compétence ajoute au dé et ce que cela donne sur un test normal, l'expérience jusqu'au
 * niveau suivant, ses dons, son équipement et l'état de ses compagnons. Rien à sauvegarder : tout se lit sur l'état.
 */

/** The difficulty of a « normal » test, for the chance shown beside each skill (docs/gdd/competences.md). */
export const NORMAL_DIFFICULTY = 12;

export interface FicheLine {
  label: string;
  value: string;
}

export interface Fiche {
  titre: string;
  /** « XP 155 / 300 » : the experience, and what the next level needs. */
  xp: { now: number; next: number };
  valeurs: FicheLine[];
  attributs: FicheLine[];
  /** Every skill with a rank (and Résonance once learned): its rank, its bonus to the die, its chance on a normal test. */
  competences: FicheLine[];
  dons: FicheLine[];
  equipement: FicheLine[];
  groupe: FicheLine[];
}

const SLOT_LABELS: Record<Slot, string> = { mainDroite: 'Main droite', mainGauche: 'Main gauche', armure: 'Armure', cristal: 'Au cou' };
const signed = (n: number): string => (n < 0 ? `−${-n}` : `+${n}`);

export function characterFiche(state: GameState): Fiche | null {
  const c = state.character;
  if (!c) return null;
  const stats = characterStats(c);
  const crystal = wornCrystal(c);
  const valeurs: FicheLine[] = [
    { label: 'Points de vie', value: `${c.hp} / ${stats.maxHp}` },
    { label: 'Défense', value: String(stats.defense) },
    { label: 'Points d’action', value: String(stats.actionPoints) },
    { label: 'Résistance aux effets', value: `${stats.resistance >= 0 ? '+' : ''}${stats.resistance}` },
    { label: 'Récits retenus', value: `${c.recits.length} (jusqu’à ${stats.tales} ordinaires)` },
    ...(crystal ? [{ label: 'Résonance', value: `${c.resonance} / ${resonanceMax(c)} PR` }] : []),
  ];
  const attributs = ATTRIBUTES.map((a) => ({ label: a.name, value: `${c.attributes[a.id]} (${signed(attributeModifier(c.attributes[a.id]))})` }));
  const competences = SKILLS.filter((s) => (c.skills[s.id] ?? 0) > 0).map((s) => {
    const bonus = rollBonus(state, s.id);
    const chance = Math.round(successChance(bonus, 0, NORMAL_DIFFICULTY) * 100);
    return { label: s.name, value: `rang ${c.skills[s.id]} · ${signed(bonus)} au dé · ${chance} %` };
  });
  const dons: FicheLine[] = [c.feat, ...(c.dons ?? [])].flatMap((id) => {
    const f = findFeat(id);
    return f ? [{ label: f.name, value: f.description }] : [];
  });
  const trait = findTrait(c.trait);
  if (trait) dons.push({ label: `Trait : ${trait.name}`, value: trait.description });
  const equipement = (Object.keys(SLOT_LABELS) as Slot[]).flatMap((slot) => {
    const id = c.equipment[slot];
    if (!id) return [];
    const worn = wearPenalty(c, id);
    return [{ label: SLOT_LABELS[slot], value: `${findItem(id)?.name ?? id}${worn > 0 ? ` (usée : −${worn})` : ''}` }];
  });
  const groupe = state.groupe.map((m) => {
    const def = findCompanion(m.id);
    return { label: def?.name ?? m.id, value: `PV ${m.hp} / ${def?.hp ?? m.hp}` };
  });
  return {
    titre: `${c.name} · niveau ${c.level}`,
    xp: { now: c.xp, next: xpForLevel(c.level + 1) },
    valeurs,
    attributs,
    competences,
    dons,
    equipement,
    groupe,
  };
}
