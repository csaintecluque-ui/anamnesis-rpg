import powerData from '../data/powers.json';
import recetteData from '../data/recettes.json';
import weaponData from '../data/weapons.json';
import { SKILLS } from './attributes';
import { findItem, HEAL_PER_MEDICINE, SELL_RATIO, type ItemDef } from './inventory';

/**
 * The bag sorted and explained (docs/gdd/inventaire.md, « Le sac rangé », demande de Cyril du 2026-11-03) : each item in
 * a tab, and what it is good for, worked out from the rules (weapons, armour, crystals, care, the workshops' recipes).
 */
export type ItemCategory = 'equipement' | 'remedes' | 'matieres' | 'quete' | 'divers';

export const CATEGORIES: { id: ItemCategory; name: string }[] = [
  { id: 'equipement', name: 'Équipement' },
  { id: 'remedes', name: 'Remèdes' },
  { id: 'matieres', name: 'Matières' },
  { id: 'quete', name: 'Quête' },
  { id: 'divers', name: 'Divers' },
];

interface Recette {
  atelier: string;
  produit: { item: string };
  ingredients: { item: string; count: number }[];
}
const RECETTES = recetteData as Recette[];
const WEAPONS = weaponData as { id: string; name: string; skill: string; range: number; damage: { count: number; sides: number }; munition?: string }[];
const POWERS = powerData as { id: string; name: string }[];

/** Where each workshop is, in a sentence (src/rules/artisanat.ts). */
const ATELIER_WHERE: Record<string, string> = {
  forge: 'la forge de Ragna, à Ironheart',
  herbes: 'les herbes de Sévane, à Canopéa',
};

/**
 * Its tab: what is worn first (a lent crystal too), then quest items, care, the workshops' materials; `categorie` in
 * items.json overrides it (the crystal shards, sold for their matter).
 */
export function categoryOf(item: ItemDef): ItemCategory {
  if (item.categorie) return item.categorie;
  if (item.slot) return 'equipement';
  if (item.quest) return 'quete';
  if (item.healHp || item.resonance) return 'remedes';
  if (RECETTES.some((r) => r.ingredients.some((i) => i.item === item.id))) return 'matieres';
  return 'divers';
}

/** What an item is good for, in a few short lines, from the rules; empty when it is only worth its price. */
export function itemUses(item: ItemDef): string[] {
  const lines: string[] = item.usage ? [item.usage] : [];
  const weapon = item.slot === 'main' ? WEAPONS.find((w) => w.id === item.id) : undefined;
  if (weapon) {
    const skill = SKILLS.find((s) => s.id === weapon.skill)?.name ?? weapon.skill;
    const kind = weapon.range > 1 ? `Arme de tir, portée ${weapon.range}` : 'Arme de corps à corps';
    lines.push(`${kind} : ${weapon.damage.count}d${weapon.damage.sides} de dégâts (${skill}).`);
    const ammo = weapon.munition ? findItem(weapon.munition) : undefined;
    if (ammo) lines.push(`Tire des ${ammo.name.toLowerCase()} : une par tir ; après un combat gagné, on en ramasse la moitié.`);
  }
  const shotBy = WEAPONS.filter((w) => w.munition === item.id).map((w) => findItem(w.id)?.name ?? w.name);
  if (shotBy.length) lines.push(`Munitions : ${shotBy.join(', ')}. Une par tir ; après un combat gagné, on en ramasse la moitié.`);
  if (item.slot === 'armure') lines.push(`Armure : +${item.armorBonus ?? 0} en Défense, en route comme en combat.`);
  if (item.slot === 'cristal') {
    const power = POWERS.find((p) => p.id === item.pouvoir)?.name;
    lines.push(`Se porte au cou : ${power ? `${power} et la Lueur` : 'la Lueur'}, avec des Points de Résonance.`);
  }
  if (item.healHp) lines.push(`Soigne ${item.healHp} points de vie, plus ${HEAL_PER_MEDICINE} par point de Médecine, hors combat (bouton « Utiliser »).`);
  if (item.resonance) lines.push(`Rend ${item.resonance} Points de Résonance au cristal porté (bouton « Boire »).`);
  const made = RECETTES.find((r) => r.produit.item === item.id);
  if (made) lines.push(`Se fabrique : ${ATELIER_WHERE[made.atelier] ?? made.atelier}.`);
  const into = RECETTES.filter((r) => r.ingredients.some((i) => i.item === item.id));
  for (const atelier of [...new Set(into.map((r) => r.atelier))]) {
    const products = into.filter((r) => r.atelier === atelier).map((r) => findItem(r.produit.item)?.name ?? r.produit.item);
    lines.push(`Entre dans ${products.join(', ')} : ${ATELIER_WHERE[atelier] ?? atelier}.`);
  }
  if (item.quest) lines.push('Objet de quête : on le porte pour quelqu’un, il ne se vend pas.');
  return lines;
}

/** « 3 kg · vaut 35 Fers, se vend 17 », or no price for a quest item. */
export function itemValue(item: ItemDef): string {
  const sold = Math.floor(item.price * SELL_RATIO);
  return item.quest ? `${item.weightKg} kg` : `${item.weightKg} kg · vaut ${item.price} Fers, se vend ${sold}`;
}

/** Items of one tab, among those shown (the bag, or the bag and a stall). */
export function itemsOf(items: ItemDef[], category: ItemCategory): ItemDef[] {
  return items.filter((i) => categoryOf(i) === category);
}

