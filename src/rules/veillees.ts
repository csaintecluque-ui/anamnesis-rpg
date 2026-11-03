import veilleeData from '../data/veillees.json';
import type { GameState } from '../state/gameState';
import { SKILLS, type SkillId } from './attributes';
import { resolveCheck, rollD20, successChance, type Rng } from './checks';
import { applyEffects, rollBonus, type Effect } from './dialogue';
import { findRecit, type RecitDef } from './recits';
import { reputationLevel } from './reputation';

/**
 * Les veillées du conteur (docs/gdd/veillees.md, jalon 3, étape 4) : le soir, à l'auberge, le héros raconte un de ses
 * Récits à un public qui a ses goûts. Un bon accueil remplit le chapeau (des Fers) et fait sa renommée dans la ville
 * (réputation) ; un triomphe lui vaut une rumeur, qui ouvre un secret ailleurs (un repère `rumeur-<id>`). Tout se
 * déduit des repères et de l'heure : rien de plus à sauvegarder.
 */
export type Theme = 'chansons' | 'familles' | 'morts' | 'arbres' | 'trains' | 'machines' | 'ancien-monde' | 'puissants' | 'mysteres';

/** « Ils aiment : les chansons, les familles ». */
export const THEMES: Record<Theme, string> = {
  chansons: 'les chansons',
  familles: 'les familles',
  morts: 'les morts',
  arbres: 'les arbres',
  trains: 'les trains',
  machines: 'les machines',
  'ancien-monde': 'l’Ancien Monde',
  puissants: 'les puissants',
  mysteres: 'les mystères',
};

export type Outcome = 'triomphe' | 'succes' | 'redite' | 'echec' | 'deteste';

export interface Rumeur {
  id: string;
  titre: string;
  /** What is heard, at the end of the evening. */
  texte: string;
}

export interface PublicDef {
  id: string;
  /** The inn (src/data/locations.json). */
  lieu: string;
  /** The innkeeper, whose dialogue opens the veillée. */
  hote: string;
  /** The town whose opinion of the hero grows with his renown (src/data/reputation.json). */
  ville: string;
  nom: string;
  /** Who is there tonight. */
  public: string;
  /** What the innkeeper says of their tastes. */
  gouts: string;
  aime: Theme[];
  deteste: Theme[];
  reactions: Record<Outcome, string>;
  /** Given in this order, one per triumph. */
  rumeurs: Rumeur[];
}

export const PUBLICS = veilleeData as PublicDef[];

/** Numbers of the veillées (docs/gdd/veillees.md, à valider). */
export const VEILLEE = {
  /** Difficulty of a Récit the public neither loves nor dislikes. */
  base: 12,
  /** A theme they love makes it easier, one they dislike harder, a Récit they already heard a little harder. */
  aime: -4,
  deteste: 4,
  redite: 2,
  /** Fers in the hat; doubled on a natural 20. */
  fers: { triomphe: 15, succes: 8, redite: 4 },
  xp: { triomphe: 15, succes: 10 },
  /** Renown: the first Récits told well to a public each raise the town's opinion (3 points each in reputation.json). */
  renommee: 3,
} as const;

/** One tells with warmth (Diplomatie), authority (Commandement) or art (Subterfuge): the best of the three. */
export const TELLING_SKILLS: SkillId[] = ['diplomacy', 'command', 'subterfuge'];

export const rumeurFlag = (id: string): string => `rumeur-${id}`;
/** A Récit told well to this public. */
export const toldFlag = (publicId: string, recitId: string): string => `veillee-${publicId}-${recitId}`;
export const renownFlag = (publicId: string, level: number): string => `conteur-${publicId}-${level}`;

export function findPublic(id: string): PublicDef | undefined {
  return PUBLICS.find((p) => p.id === id);
}

/** The themes of a Récit this public loves, and those it dislikes. */
export function taste(pub: PublicDef, recit: RecitDef): { aime: Theme[]; deteste: Theme[] } {
  const themes = (recit.themes ?? []) as Theme[];
  return { aime: themes.filter((t) => pub.aime.includes(t)), deteste: themes.filter((t) => pub.deteste.includes(t)) };
}

/** The telling skill with the best bonus (Présence and rank, less the emprise of the Échos). */
export function tellingSkill(state: GameState): { skill: SkillId; name: string; bonus: number } {
  const best = TELLING_SKILLS.map((skill) => ({ skill, bonus: rollBonus(state, skill) })).reduce((a, b) => (b.bonus > a.bonus ? b : a));
  return { ...best, name: SKILLS.find((s) => s.id === best.skill)!.name };
}

export function tellingDifficulty(state: Pick<GameState, 'flags'>, pub: PublicDef, recit: RecitDef): number {
  const t = taste(pub, recit);
  const told = !!state.flags[toldFlag(pub.id, recit.id)];
  return VEILLEE.base + (t.aime.length ? VEILLEE.aime : 0) + (t.deteste.length ? VEILLEE.deteste : 0) + (told ? VEILLEE.redite : 0);
}

export interface VeilleeChoice {
  recit: RecitDef;
  aime: Theme[];
  deteste: Theme[];
  /** Already told well to this public. */
  deja: boolean;
  difficulty: number;
  /** Probability (0–1) of a good reception. */
  chance: number;
}

/** Every Récit the hero retains, with how this public will take it. */
export function veilleeChoices(state: GameState, publicId: string): VeilleeChoice[] {
  const pub = findPublic(publicId);
  const c = state.character;
  if (!pub || !c) return [];
  const { bonus } = tellingSkill(state);
  return c.recits.flatMap((id) => {
    const recit = findRecit(id);
    if (!recit) return [];
    const difficulty = tellingDifficulty(state, pub, recit);
    return [{ recit, ...taste(pub, recit), deja: !!state.flags[toldFlag(pub.id, recit.id)], difficulty, chance: successChance(bonus, 0, difficulty) }];
  });
}

/** How many different Récits this public has liked (its renown, up to VEILLEE.renommee). */
export function renown(state: Pick<GameState, 'flags'>, publicId: string): number {
  const pub = findPublic(publicId);
  return pub ? Math.min(VEILLEE.renommee, Object.keys(state.flags).filter((f) => f.startsWith(`veillee-${pub.id}-`) && state.flags[f]).length) : 0;
}

export interface VeilleeResult {
  outcome: Outcome;
  success: boolean;
  /** « Jet de Diplomatie : 14 + 2 = 16 contre 8, réussi » */
  rollNotice: string;
  reaction: string;
  rumeur?: Rumeur;
  /** +15 Fers, +15 points d'expérience, réputation, « C'est la nuit. » */
  notices: string[];
}

/**
 * Tells a Récit to the public: a d20 with the best telling skill against the difficulty. Whatever the outcome, the
 * veillée lasts the evening: the clock moves to the night.
 */
export function tell(state: GameState, publicId: string, recitId: string, rng: Rng = Math.random): VeilleeResult {
  const pub = findPublic(publicId);
  const recit = findRecit(recitId);
  if (!pub || !recit || !state.character?.recits.includes(recitId)) throw new Error(`Veillée impossible : ${publicId} / ${recitId}`);
  const { name, bonus } = tellingSkill(state);
  const difficulty = tellingDifficulty(state, pub, recit);
  const die = rollD20(rng);
  const check = resolveCheck({ roll: die, modifier: bonus, rank: 0, difficulty });
  const t = taste(pub, recit);
  const deja = !!state.flags[toldFlag(pub.id, recit.id)];
  const outcome: Outcome = !check.success ? (t.deteste.length ? 'deteste' : 'echec') : deja ? 'redite' : t.aime.length ? 'triomphe' : 'succes';

  const effects: Effect[] = [];
  let rumeur: Rumeur | undefined;
  if (outcome === 'triomphe' || outcome === 'succes' || outcome === 'redite') {
    // A legend of the town fills the chapeau twice (feuille de route, chantier 6).
    const chapeau = reputationLevel(state, pub.ville).chapeau ?? 1;
    effects.push({ giveFers: VEILLEE.fers[outcome] * (check.critical ? 2 : 1) * chapeau });
  }
  if (outcome === 'triomphe' || outcome === 'succes') {
    effects.push({ giveXp: VEILLEE.xp[outcome] });
    const level = renown(state, pub.id) + 1;
    effects.push({ setFlag: toldFlag(pub.id, recit.id) });
    if (level <= VEILLEE.renommee) effects.push({ setFlag: renownFlag(pub.id, level) });
  }
  if (outcome === 'triomphe') {
    rumeur = pub.rumeurs.find((r) => !state.flags[rumeurFlag(r.id)]);
    if (rumeur) effects.push({ setFlag: rumeurFlag(rumeur.id) });
  }
  effects.push({ attendre: 'nuit' });
  const notices = applyEffects(state, effects);
  if (rumeur) notices.push(`Rumeur : ${rumeur.titre}`);

  const sign = bonus < 0 ? '−' : '+';
  const verdict = check.critical ? (check.success ? 'réussite critique' : 'échec critique') : check.success ? 'réussi' : 'raté';
  const jet = /^[AEIOUYÉÈÊ]/.test(name) ? `Jet d’${name}` : `Jet de ${name}`;
  return {
    outcome,
    success: check.success,
    rollNotice: `${jet} : ${die} ${sign} ${Math.abs(bonus)} = ${check.total} contre ${difficulty}, ${verdict}`,
    reaction: pub.reactions[outcome],
    rumeur,
    notices,
  };
}

/** Rumours heard at the veillées, for the journal: what they say and where they were heard. */
export function heardRumeurs(state: Pick<GameState, 'flags'>): (Rumeur & { ou: string })[] {
  return PUBLICS.flatMap((p) => p.rumeurs.filter((r) => state.flags[rumeurFlag(r.id)]).map((r) => ({ ...r, ou: p.nom })));
}
