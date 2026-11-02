import { RESONANCE_BASE, type Character } from './character';
import { attributeModifier } from './attributes';
import { resolveCheck, rollD20, type Rng } from './checks';
import { findItem, removeItem, addItem } from './inventory';

/**
 * Le prix de la magie (jalon 3, étape 5, « La passe sombre », docs/gdd/passe-sombre.md). Canon [NOTION, « Règles
 * fondamentales du monde »] : forcer un cristal fait saigner du nez ; au-delà, « risque de mutation » (JDR) ; les
 * symptômes : « veines lumineuses », l'addiction (« syndrome de sevrage si privé de cristaux »), la « peau
 * cristallisée » ; et les cristaux peuvent « se fissurer ou se briser ».
 *
 * Dans le jeu : chaque fois que le héros force son cristal (des PV payés faute de PR), un jet de Vigueur (d20 + Vigueur
 * + rang de Résonance contre 10 + 2 par PR manquant). Raté, une marque ; avec trois marques, c'est le cristal qui se
 * fend. Les marques ne s'effacent pas en dormant : seul un Druide Vert les reprend (Vanel), au prix d'un rang de
 * Résonance.
 *
 * `character.marques` est facultatif (absent = 0) : les sauvegardes v14 restent valides sans migration.
 */
export interface MarqueDef {
  niveau: number;
  nom: string;
  /** What the hero sees, when the mark comes. */
  texte: string;
  /** What it does, for the journal. */
  effet: string;
}

export const MARQUES: MarqueDef[] = [
  { niveau: 1, nom: 'Les veines', texte: 'Sous le cristal, tes veines s’allument de sa couleur, et ne s’éteignent plus.', effet: 'Cela se voit : on te regarde autrement.' },
  { niveau: 2, nom: 'Le manque', texte: 'Tes doigts reviennent sans cesse au cristal. Sans lui, tout est trop lent, trop gris.', effet: '−1 aux jets sans cristal au cou.' },
  { niveau: 3, nom: 'La peau de cristal', texte: 'Sous la clavicule, une plaque de peau a durci : lisse, froide, comme une pierre polie.', effet: '−1 Point de Résonance au maximum.' },
];
export const MARQUES_MAX = MARQUES.length;
/** What is left of a crystal that split (docs/gdd/passe-sombre.md). */
export const ECLATS = 'eclats-cristal';

export function marquesOf(c: Pick<Character, 'marques'> | null | undefined): number {
  return c?.marques ?? 0;
}

/** The marks the hero bears, lightest first. */
export function marquesBorne(c: Pick<Character, 'marques'> | null | undefined): MarqueDef[] {
  return MARQUES.slice(0, marquesOf(c));
}

/** Forcing by one PR is a 12, by two a 14: the deeper one draws, the more it costs. */
export function forcingDifficulty(missing: number): number {
  return 10 + 2 * missing;
}

/** Le manque: −1 to the dice while no crystal is worn (from the second mark). */
export function manqueMalus(c: Pick<Character, 'marques' | 'equipment'> | null | undefined): number {
  return c && marquesOf(c) >= 2 && !c.equipment.cristal ? 1 : 0;
}

/** La peau de cristal: one Point de Résonance less (from the third mark). */
export function marqueResonancePenalty(c: Pick<Character, 'marques'>): number {
  return marquesOf(c) >= 3 ? 1 : 0;
}

/**
 * After a forced cast (`missing` PR were paid in PV): the d20 against the price. A failed roll leaves a mark, or,
 * with every mark already borne, splits the worn crystal (it is lost, its shards stay in the bag).
 */
export function payThePrice(c: Character, missing: number, rng: Rng = Math.random): string[] {
  if (missing <= 0) return [];
  const die = rollD20(rng);
  const bonus = attributeModifier(c.attributes.vigor) + c.skills.resonance;
  const difficulty = forcingDifficulty(missing);
  const result = resolveCheck({ roll: die, modifier: bonus, rank: 0, difficulty });
  const sign = bonus < 0 ? '−' : '+';
  const roll = `Jet de Vigueur : ${die} ${sign} ${Math.abs(bonus)} = ${die + bonus} contre ${difficulty}`;
  if (result.success) return [`${roll} : le cristal te laisse en paix, cette fois.`];
  if (marquesOf(c) < MARQUES_MAX) {
    c.marques = marquesOf(c) + 1;
    // La peau de cristal: the PR above the new maximum are gone.
    c.resonance = Math.min(c.resonance, Math.max(0, RESONANCE_BASE + c.skills.resonance - marqueResonancePenalty(c)));
    const mark = MARQUES[c.marques - 1];
    return [`${roll} : raté.`, `${mark.nom} : ${mark.texte}`];
  }
  const crystal = c.equipment.cristal ? findItem(c.equipment.cristal) : undefined;
  if (!crystal) return [`${roll} : raté.`];
  removeItem(c, crystal.id, 1);
  addItem(c, ECLATS, 1);
  return [`${roll} : raté.`, `${crystal.name} se fend en travers, avec un bruit de glace. Il est perdu.`];
}

/**
 * A Druide Vert takes the marks back (Vanel, « Un prêt de la Terre ») : « la Terre reprend ce qu'on lui a trop
 * pris », and a rank of Résonance with them, when there is one. Returns false when there was nothing to take.
 */
export function effacerMarques(c: Character): boolean {
  if (marquesOf(c) === 0) return false;
  c.marques = 0;
  if (c.skills.resonance > 0) c.skills.resonance -= 1;
  c.resonance = Math.min(c.resonance, RESONANCE_BASE + c.skills.resonance);
  return true;
}

/** For the journal and the inventory: where the price stands. */
export function marquesLabel(c: Pick<Character, 'marques'> | null | undefined): string {
  const borne = marquesBorne(c);
  if (!borne.length) return 'Aucune marque : le cristal ne t’a encore rien pris.';
  return borne.map((m) => `${m.nom} (${m.effet})`).join(' · ');
}
