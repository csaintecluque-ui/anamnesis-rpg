import encounterData from '../data/encounters.json';
import enemyData from '../data/enemies.json';
import weaponData from '../data/weapons.json';
import type { Tile } from '../engine/iso';
import { attributeModifier, type AttributeId, type SkillId } from './attributes';
import { characterStats, effectSum, heroEffects, wearPenalty, type Character } from './character';
import type { Effect } from './dialogue';
import { addItem, armorBonus, findItem, ownedCount, removeItem } from './inventory';

export interface Dice {
  count: number;
  sides: number;
}

export interface WeaponDef {
  id: string;
  name: string;
  skill: SkillId;
  attribute: AttributeId;
  /** In tiles; 1 means melee (adjacent, 8 directions). */
  range: number;
  damage: Dice;
  /** What it shoots, one per shot (an item: arrows, bolts ; docs/gdd/combat.md, « Munitions »). */
  munition?: string;
  /** PA per blow (chantier 3) : 2 for a dagger or bare hands, 3 by default. */
  apCost?: number;
  /** PA more to aim at a zone, when not AIM_AP_EXTRA (a dagger: none). */
  aimExtra?: number;
}

/** An effect a blow can leave (docs/gdd/combat.md, « Effets ») : the lingering ones hurt at the start of each turn. */
export type HitEffect = 'brulure' | 'saignement' | 'ralenti' | 'etourdi';
export type Lingering = 'brulure' | 'saignement';
export interface OnHit {
  effet: HitEffect;
  /** 0 to 1; always when absent. */
  chance?: number;
}
export const LINGERING: Record<Lingering, { turns: number; damage: Dice; label: string }> = {
  brulure: { turns: 2, damage: { count: 1, sides: 4 }, label: 'brûlé·e' },
  saignement: { turns: 3, damage: { count: 1, sides: 2 }, label: 'en sang' },
};

/** A boss turns harder once hurt enough (docs/gdd/combat.md, « Boss à phases »). */
export interface PhaseDef {
  /** Share of the maximum PV at or under which the phase starts. */
  seuil: number;
  texte: string;
  attackBonus?: number;
  actionPoints?: number;
  defense?: number;
}

/** What a beaten enemy may leave (docs/gdd/combat.md, « Butin »). */
export interface LootDef {
  item?: string;
  /** How many of the item (arrows and bolts come by the handful); 1 by default. */
  count?: number;
  /** Fers, between the two numbers. */
  fers?: [number, number];
  chance: number;
}

/**
 * What makes an enemy fight its own way (feuille de route, chantier 3 : two each ; docs/gdd/combat.md, « Capacités »).
 * Some carry their numbers elsewhere in the enemy (onHit, range, soin, phases).
 */
export type CapaciteId =
  | 'saigner'
  | 'bruler'
  | 'ralentir'
  | 'tir'
  | 'soigner'
  | 'emballement'
  | 'meute'
  | 'epines'
  | 'carapace'
  | 'charge'
  | 'fuite'
  | 'visee';

export const CAPACITES: Record<CapaciteId, { nom: string; texte: string }> = {
  saigner: { nom: 'Saignement', texte: 'ses coups font parfois saigner' },
  bruler: { nom: 'Brûlure', texte: 'ses coups brûlent parfois' },
  ralentir: { nom: 'Engourdissement', texte: 'ses coups ralentissent parfois' },
  tir: { nom: 'Tir', texte: 'frappe de loin, et cherche le couvert' },
  soigner: { nom: 'Soins', texte: 'soigne un allié blessé' },
  emballement: { nom: 'Emballement', texte: 'plus dangereux sous la moitié de ses PV' },
  meute: { nom: 'Meute', texte: '+2 au toucher quand un allié est déjà au contact de sa cible' },
  epines: { nom: 'Épines', texte: 'qui le frappe au corps à corps perd 1 PV (épines, froid de l’Écho)' },
  carapace: { nom: 'Carapace', texte: '2 dégâts de moins à chaque coup reçu' },
  charge: { nom: 'Charge', texte: '+1d4 dégâts au premier coup, après deux cases de course' },
  fuite: { nom: 'Fuite', texte: 's’enfuit ou se rend sous le tiers de ses PV' },
  visee: { nom: 'Visée', texte: '+2 au toucher s’il n’a pas bougé de son tour' },
};

/** Meute, Visée : the bonus to hit ; Carapace : the damage taken off ; Fuite : the share of PV under which it flees. */
export const PACK_BONUS = 2;
export const AIM_STILL_BONUS = 2;
export const SHELL_REDUCTION = 2;
export const CHARGE_DAMAGE: Dice = { count: 1, sides: 4 };
export const CHARGE_MIN_TILES = 2;
export const THORNS_DAMAGE: Dice = { count: 1, sides: 1 };
export const FLEE_SHARE = 1 / 3;

export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  defense: number;
  attackBonus: number;
  damage: Dice;
  actionPoints: number;
  initiativeBonus: number;
  xp: number;
  defeatText: string;
  /** What the log says when it flees or gives up (Fuite). */
  fleeText?: string;
  /** Tile drawn for this enemy (name in scripts/tiles-def.mjs). */
  tile: string;
  /** In tiles: 1 (default) strikes up close, more shoots from afar. */
  range?: number;
  onHit?: OnHit;
  /** A healer tends its wounded allies instead of striking, when one needs it. */
  soin?: { amount: Dice; range: number };
  phases?: PhaseDef[];
  /** Two capacités (chantier 3). */
  capacites: CapaciteId[];
  /** Added to the resistance roll against a blow aimed at the head, the arms or the legs. */
  resistance: number;
  butin?: LootDef[];
  /** The bestiary page (docs/gdd/combat.md, « Bestiaire ») and where it comes from in the canon. */
  description?: string;
  source?: string;
}

/**
 * A fight started from a dialogue (src/data/encounters.json): the arena is carved around a map object, each enemy
 * starts on its own map object (drawn on the map until the fight is won or avoided).
 */
/** A fight a dialogue starts against a group of a sleeping line: `startCombat: 'voie:1'` (src/rules/voies.ts). */
export const VOIE_FIGHT = 'voie:';
/**
 * The Golem of the Gare, struck after the yard was stopped some other way (décision de Cyril, 2026-11-03 ; étude, E11):
 * `startCombat: 'golem-gare'` from its warning (src/data/dialogues/golem-gare.json).
 */
export const GOLEM_FIGHT = 'golem-gare';

export interface EncounterDef {
  id: string;
  center: string;
  enemies: { id: string; object: string }[];
  victoryFlag: string;
  victoryEffects: Effect[];
}

export const WEAPONS = weaponData as WeaponDef[];
export const ENEMIES = enemyData as EnemyDef[];
export const ENCOUNTERS = encounterData as EncounterDef[];

export function findWeapon(id: string): WeaponDef | undefined {
  return WEAPONS.find((w) => w.id === id);
}

export function findEnemy(id: string): EnemyDef | undefined {
  return ENEMIES.find((e) => e.id === id);
}

/** docs/gdd/combat.md: aim at a zone for a penalty, with an effect that lasts the target's next turn. */
export type Zone = 'corps' | 'tete' | 'bras' | 'jambes';

export const ZONES: { id: Zone; label: string; toHitPenalty: number; effect: 'stunned' | 'disarmed' | 'slowed' | null }[] = [
  { id: 'corps', label: 'Corps', toHitPenalty: 0, effect: null },
  { id: 'tete', label: 'Tête', toHitPenalty: -2, effect: 'stunned' },
  { id: 'bras', label: 'Bras', toHitPenalty: -2, effect: 'disarmed' },
  { id: 'jambes', label: 'Jambes', toHitPenalty: -1, effect: 'slowed' },
];

export function findZone(id: Zone) {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Unknown zone ${id}`);
  return zone;
}

export interface AttackProfile {
  weaponId: string;
  label: string;
  range: number;
  /** d20 + this ≥ target's defense (+ cover) to hit. */
  toHitBonus: number;
  damage: Dice;
  /** Added to the damage roll (attribute modifier, feat bonuses). */
  damageBonus: number;
  /** PA per blow: by the weapon (2 for a dagger), 3 by default; aiming at a zone costs AIM_AP_EXTRA more. */
  apCost: number;
  /** An effect the blow may leave on the target. */
  onHit?: OnHit;
  /** The item each shot spends (a bow's arrows), if any. */
  munition?: string;
  /** PA more to aim at a zone: AIM_AP_EXTRA, none with a light blade that finds the gap by itself (a dagger). */
  aimExtra?: number;
}

export const ATTACK_AP_COST = 3;
export const MOVE_AP_COST_PER_TILE = 1;
/** Aiming at the head, the arms or the legs costs this many PA more (feuille de route, chantier 3). */
export const AIM_AP_EXTRA = 1;
/**
 * Every hero's weapon blow, to hit: a trained hand finds its mark, whatever the build (étude du 2026-11-03, E1 ;
 * docs/gdd/etude-2026-11-03.md). Without it a hero of words, dagger in hand, lost 55 % of the fights at the crate.
 */
export const HERO_HIT_BONUS = 2;
/** The rank of the weapon's skill adds half itself to the damage (E2): skill counts for everyone, not Corps alone. */
export function rankDamage(rank: number): number {
  return Math.floor(rank / 2);
}
/** The resistance roll against a zone's effect: d20 + resistance ≥ this + the damage of the blow (a heavy blow takes surer). */
export const RESIST_BASE = 8;

/** PA of a blow at this zone. */
export function attackCost(attack: AttackProfile, zone: Zone = 'corps'): number {
  return attack.apCost + (zone === 'corps' ? 0 : (attack.aimExtra ?? AIM_AP_EXTRA));
}

export interface Combatant {
  id: string;
  name: string;
  side: 'heroes' | 'enemies';
  hp: number;
  maxHp: number;
  defense: number;
  actionPoints: number;
  maxActionPoints: number;
  initiative: number;
  attacks: AttackProfile[];
  tile: Tile;
  /** Zone effects last one turn; burning and bleeding count the turns they still hurt. */
  status: { stunned: boolean; disarmed: boolean; slowed: boolean; burning: number; bleeding: number };
  defeated: boolean;
  defeatText: string;
  /** For an enemy: its id in enemies.json (bestiary, loot). For a companion: its id in companions.json. */
  kind?: string;
  heal?: { amount: Dice; range: number };
  phases?: PhaseDef[];
  /** Phases already begun. */
  phase: number;
  /** The hero's arrows and bolts: what is left, and what was shot (settled after the fight, settleAmmo). */
  ammo?: Record<string, number>;
  fired?: Record<string, number>;
  /** An enemy's capacités (chantier 3); none for the heroes. */
  capacites: CapaciteId[];
  /** Added to the resistance roll against a zone's effect. */
  resistance: number;
  /** Tiles walked, and whether it struck, this turn (Charge, Visée). */
  moved: number;
  struck: boolean;
  /** Fled or surrendered (Fuite): out of the fight, without loot. */
  fled?: boolean;
  /**
   * The zone effects it has just shaken off: it cannot suffer them again before the end of its next turn (no stun
   * every turn ; chantier 3).
   */
  immune: Partial<Record<ZoneStatus, boolean>>;
}

/** The fields every fighter starts a fight with. */
export const freshFighter = (): Pick<Combatant, 'status' | 'defeated' | 'phase' | 'initiative' | 'capacites' | 'resistance' | 'moved' | 'struck' | 'immune'> => ({
  status: emptyStatus(),
  defeated: false,
  phase: 0,
  initiative: 0,
  capacites: [],
  resistance: 0,
  moved: 0,
  struck: false,
  immune: {},
});

export function hasCapacite(c: Combatant, id: CapaciteId): boolean {
  return c.capacites.includes(id);
}

const emptyStatus = () => ({ stunned: false, disarmed: false, slowed: false, burning: 0, bleeding: 0 });

/** Fallback when no weapon is held (docs/gdd/combat.md). */
export const UNARMED = 'mains-nues';

/** Weapons held in hand (right first), each once; bare hands when none (docs/gdd/combat.md). */
export function heldWeapons(character: Character): WeaponDef[] {
  const ids = [character.equipment.mainDroite, character.equipment.mainGauche].filter((id): id is string => !!id);
  const weapons = [...new Set(ids)].map(findWeapon).filter((w): w is WeaponDef => !!w);
  return weapons.length > 0 ? weapons : [findWeapon(UNARMED)!];
}

/** One attack per weapon in hand. */
export function heroAttacks(character: Character): AttackProfile[] {
  // The feats, the level feats and the trait, added up (chantier 6).
  const combats = heroEffects(character).map((e) => e.combat ?? {});
  const feat = {
    meleeHit: combats.reduce((n, e) => n + (e.meleeHit ?? 0), 0),
    meleeDamage: combats.reduce((n, e) => n + (e.meleeDamage ?? 0), 0),
    rangedDamage: combats.reduce((n, e) => n + (e.rangedDamage ?? 0), 0),
    rangeMultiplier: Math.max(1, ...combats.map((e) => e.rangeMultiplier ?? 1)),
  };
  return heldWeapons(character).map((weapon) => {
    const rank = character.skills[weapon.skill];
    const mod = attributeModifier(character.attributes[weapon.attribute]);
    const isRanged = weapon.skill === 'ranged';
    const hitBonus = (isRanged ? 0 : (feat.meleeHit ?? 0)) + 0;
    return {
      weaponId: weapon.id,
      label: weapon.name,
      range: isRanged ? weapon.range * (feat.rangeMultiplier ?? 1) : weapon.range,
      // A dulled weapon misses more (src/rules/usure.ts ; chantier 6).
      toHitBonus: HERO_HIT_BONUS + mod + rank + hitBonus - wearPenalty(character, weapon.id),
      damage: weapon.damage,
      damageBonus: mod + rankDamage(rank) + (isRanged ? (feat.rangedDamage ?? 0) : (feat.meleeDamage ?? 0)),
      apCost: weapon.apCost ?? ATTACK_AP_COST,
      aimExtra: weapon.aimExtra,
      munition: weapon.munition,
    };
  });
}

export function enemyAttack(enemy: EnemyDef): AttackProfile {
  return {
    weaponId: enemy.id,
    label: enemy.name,
    range: enemy.range ?? 1,
    toHitBonus: enemy.attackBonus,
    damage: enemy.damage,
    damageBonus: 0,
    apCost: ATTACK_AP_COST,
    onHit: enemy.onHit,
  };
}

export function makeHeroCombatant(character: Character, tile: Tile): Combatant {
  const stats = characterStats(character);
  return {
    ...freshFighter(),
    id: 'hero',
    name: character.name,
    side: 'heroes',
    hp: character.hp,
    maxHp: stats.maxHp,
    defense: stats.defense + armorBonus(character),
    actionPoints: stats.actionPoints,
    maxActionPoints: stats.actionPoints,
    attacks: heroAttacks(character),
    tile,
    defeatText: `${character.name} tombe.`,
    // The hero resists a blow to the head or the arms by Vigueur.
    resistance: attributeModifier(character.attributes.vigor) + effectSum(character, 'resistanceBonus'),
    ...heroAmmo(character),
  };
}

// --- Munitions (docs/gdd/combat.md) : a bow shoots arrows, a crossbow bolts, one per shot -------------------------

/** Share of the arrows and bolts shot that are picked up again after a fight won. */
export const AMMO_RECOVERED = 0.5;

/** The arrows and bolts of the weapons in hand, counted at the start of a fight. */
function heroAmmo(character: Character): Pick<Combatant, 'ammo' | 'fired'> {
  const kinds = [...new Set(heroAttacks(character).map((a) => a.munition).filter((m): m is string => !!m))];
  if (!kinds.length) return {};
  return { ammo: Object.fromEntries(kinds.map((m) => [m, ownedCount(character, m)])), fired: Object.fromEntries(kinds.map((m) => [m, 0])) };
}

/** Arrows or bolts left for this attack (Infinity when it needs none). */
export function ammoLeft(attacker: Combatant, attack: AttackProfile): number {
  return attack.munition ? (attacker.ammo?.[attack.munition] ?? 0) : Infinity;
}

/**
 * After the fight, the arrows and bolts shot leave the bag; once it is won, half of them (rounded down) are picked up
 * again. Returns « Tu ramasses 2 de tes flèches. », or nothing.
 */
export function settleAmmo(character: Character, hero: Combatant, won: boolean): string[] {
  const notices: string[] = [];
  for (const [munition, shot] of Object.entries(hero.fired ?? {})) {
    if (shot <= 0) continue;
    removeItem(character, munition, shot);
    const back = won ? Math.floor(shot * AMMO_RECOVERED) : 0;
    if (back > 0) {
      addItem(character, munition, back);
      notices.push(`Tu ramasses ${back} de tes ${(findItem(munition)?.name ?? munition).toLowerCase()}.`);
    }
  }
  return notices;
}

export function makeEnemyCombatant(enemy: EnemyDef, id: string, tile: Tile): Combatant {
  return {
    ...freshFighter(),
    id,
    name: enemy.name,
    side: 'enemies',
    hp: enemy.hp,
    maxHp: enemy.hp,
    defense: enemy.defense,
    actionPoints: enemy.actionPoints,
    maxActionPoints: enemy.actionPoints,
    attacks: [enemyAttack(enemy)],
    tile,
    defeatText: enemy.defeatText,
    kind: enemy.id,
    heal: enemy.soin,
    phases: enemy.phases,
    capacites: [...enemy.capacites],
    resistance: enemy.resistance,
  };
}

// --- The strength of the road (feuille de route, chantier 3) ------------------------------------------------------

/** The main quests that close each chapter: the story's chapter is one more than those done. */
export const CHAPTER_QUESTS = ['dernier-train', 'audience', 'cle-rouille-bleue', 'memoires-monde-perdu'];

export function storyChapter(quests: Record<string, string>): number {
  return 1 + CHAPTER_QUESTS.filter((q) => quests[q] === 'done').length;
}

/** Per chapter after the first: this share of PV more; from the third, +1 to hit a chapter and +1 Défense. */
export const MENACE_HP_PER_CHAPTER = 0.4;

/**
 * The beasts and bands of the road and of the sleeping lines grow with the story; the fights of the story keep the
 * strength of their chapter. Returns the combatant, made stronger.
 */
export function strengthen(c: Combatant, chapter: number): Combatant {
  const steps = Math.max(0, chapter - 1);
  if (!steps) return c;
  c.maxHp = Math.round(c.maxHp * (1 + MENACE_HP_PER_CHAPTER * steps));
  c.hp = c.maxHp;
  if (chapter >= 3) {
    for (const a of c.attacks) a.toHitBonus += chapter - 2;
    c.defense += 1;
  }
  return c;
}

/** "Rôdeur-Épine 1", "Rôdeur-Épine 2": tells apart enemies of the same kind in the turn order and the log. */
export function numberDuplicateNames(combatants: Combatant[]): void {
  const counts = new Map<string, number>();
  for (const c of combatants) counts.set(c.name, (counts.get(c.name) ?? 0) + 1);
  const seen = new Map<string, number>();
  for (const c of combatants) {
    if ((counts.get(c.name) ?? 0) < 2) continue;
    const n = (seen.get(c.name) ?? 0) + 1;
    seen.set(c.name, n);
    c.name = `${c.name} ${n}`;
  }
}

// --- Dice -------------------------------------------------------------

export type Rng = () => number;

export function rollDie(sides: number, rng: Rng = Math.random): number {
  return Math.floor(rng() * sides) + 1;
}

export function rollDice({ count, sides }: Dice, rng: Rng = Math.random): number {
  let total = 0;
  for (let i = 0; i < count; i++) total += rollDie(sides, rng);
  return total;
}

// --- Initiative, movement ----------------------------------------------

/** d20 + Agilité (hero) or the enemy's own bonus; ties keep their given order. */
export function rollInitiative(combatants: Combatant[], bonuses: Record<string, number>, rng: Rng = Math.random): Combatant[] {
  const rolled = combatants.map((c) => ({ c, roll: rollDie(20, rng) + (bonuses[c.id] ?? 0) }));
  return rolled
    .map((r, i) => ({ ...r, i }))
    .sort((a, b) => b.roll - a.roll || a.i - b.i)
    .map(({ c, roll }) => {
      c.initiative = roll;
      return c;
    });
}

export function distance(a: Tile, b: Tile): number {
  return Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
}

export function isAdjacent(a: Tile, b: Tile): boolean {
  return distance(a, b) === 1;
}

/** Moves along a path the combatant can afford; spends 1 PA per tile actually taken. */
export function moveAlong(combatant: Combatant, path: Tile[]): Tile[] {
  const steps = Math.min(path.length, combatant.actionPoints);
  const taken = path.slice(0, steps);
  if (taken.length > 0) combatant.tile = taken[taken.length - 1];
  combatant.actionPoints -= taken.length;
  combatant.moved += taken.length;
  return taken;
}

/**
 * Cover (docs/gdd/combat.md): a target is sheltered by the obstacle on the cell next to it, towards the attacker.
 * Melee attacks (adjacent) ignore it.
 */
export function coverBetween(attacker: Tile, target: Tile, coverAt: (tile: Tile) => number): number {
  if (distance(attacker, target) <= 1) return 0;
  const step = { col: Math.sign(attacker.col - target.col), row: Math.sign(attacker.row - target.row) };
  return coverAt({ col: target.col + step.col, row: target.row + step.row });
}

export function canAttack(attacker: Combatant, attack: AttackProfile, target: Combatant, zone: Zone = 'corps'): boolean {
  return (
    !attacker.defeated &&
    !target.defeated &&
    !attacker.status.disarmed &&
    attacker.actionPoints >= attackCost(attack, zone) &&
    ammoLeft(attacker, attack) > 0 &&
    distance(attacker.tile, target.tile) <= attack.range
  );
}

export type ZoneStatus = 'stunned' | 'disarmed' | 'slowed';

export interface AttackResult {
  hit: boolean;
  critical: boolean;
  fumble: boolean;
  damage: number;
  zoneEffect: ZoneStatus | null;
  /** The target shook off the zone's effect (its resistance roll). */
  resisted: boolean;
  defeated: boolean;
  /** The effect the blow left (burning, bleeding…), if any. */
  inflicted: HitEffect | null;
  /** PV the attacker lost on the target's thorns (Épines). */
  thorns: number;
  /** The phase the blow sent a boss into, if any. */
  phase: PhaseDef | null;
}

/**
 * Bonus to hit from the attacker's capacités: Meute (an ally already at the target's side), Visée (still this turn).
 * `others` are all the fighters (for Meute).
 */
export function capaciteToHit(attacker: Combatant, target: Combatant, others: Combatant[] = []): number {
  let bonus = 0;
  if (hasCapacite(attacker, 'meute') && others.some((o) => o !== attacker && o.side === attacker.side && !o.defeated && isAdjacent(o.tile, target.tile))) bonus += PACK_BONUS;
  if (hasCapacite(attacker, 'visee') && attacker.moved === 0) bonus += AIM_STILL_BONUS;
  return bonus;
}

/** Chance (0 to 1) that resolveAttack hits: shown before the player commits (docs/gdd/combat.md). */
export function hitChance(attack: AttackProfile, target: Combatant, zone: Zone = 'corps', coverBonus = 0, extraToHit = 0): number {
  const need = target.defense + coverBonus - attack.toHitBonus - extraToHit - findZone(zone).toHitPenalty;
  let hits = 0;
  for (let roll = 2; roll <= 20; roll++) if (roll === 20 || roll >= need) hits++;
  return hits / 20;
}

/** The average damage of a blow (shown with the chance of an effect). */
export function averageDamage(attack: AttackProfile): number {
  return Math.max(0, Math.round((attack.damage.count * (attack.damage.sides + 1)) / 2 + attack.damageBonus));
}

/**
 * Chance (0 to 1) that a zone's effect takes once the blow hits, for that much damage (by default, the blow's
 * average): the target fails its resistance roll, d20 + resistance ≥ RESIST_BASE + damage.
 */
export function effectChance(attack: AttackProfile, target: Combatant, damage = averageDamage(attack)): number {
  const need = RESIST_BASE + damage - target.resistance;
  return Math.min(1, Math.max(0, (need - 1) / 20));
}

/**
 * d20 + bonus (+ zone penalty, + capacités) ≥ target's defense (+ cover); a 20 always hits and doubles damage dice, a
 * 1 always misses. A zone's effect then takes unless the target makes its resistance roll (chantier 3); the
 * capacités of both sides apply (Charge, Carapace, Épines), and a boss hurt enough enters its next phase.
 */
export function resolveAttack(
  attacker: Combatant,
  attack: AttackProfile,
  target: Combatant,
  zone: Zone = 'corps',
  coverBonus = 0,
  rng: Rng = Math.random,
  others: Combatant[] = [],
): AttackResult {
  const extraToHit = capaciteToHit(attacker, target, others);
  const charging = hasCapacite(attacker, 'charge') && !attacker.struck && attacker.moved >= CHARGE_MIN_TILES;
  attacker.actionPoints -= attackCost(attack, zone);
  attacker.struck = true;
  // A shot spends an arrow or a bolt, hit or miss.
  if (attack.munition && attacker.ammo && attacker.fired) {
    attacker.ammo[attack.munition] = Math.max(0, (attacker.ammo[attack.munition] ?? 0) - 1);
    attacker.fired[attack.munition] = (attacker.fired[attack.munition] ?? 0) + 1;
  }
  const zoneDef = findZone(zone);
  const roll = rollDie(20, rng);
  const fumble = roll === 1;
  const critical = roll === 20;
  const total = roll + attack.toHitBonus + extraToHit + zoneDef.toHitPenalty;
  const hit = !fumble && (critical || total >= target.defense + coverBonus);

  if (!hit) return { hit: false, critical: false, fumble, damage: 0, zoneEffect: null, resisted: false, defeated: false, inflicted: null, thorns: 0, phase: null };

  const dice = rollDice(attack.damage, rng) + (critical ? rollDice(attack.damage, rng) : 0) + (charging ? rollDice(CHARGE_DAMAGE, rng) : 0);
  let damage = Math.max(0, dice + attack.damageBonus);
  if (hasCapacite(target, 'carapace')) damage = Math.max(1, damage - SHELL_REDUCTION);
  target.hp = Math.max(0, target.hp - damage);
  target.defeated = target.hp === 0;

  // The zone's effect, unless the target shakes it off (feuille de route, chantier 3).
  let zoneEffect = target.defeated ? null : zoneDef.effect;
  let resisted = false;
  if (zoneEffect && (target.immune[zoneEffect] || rng() >= effectChance(attack, target, damage))) {
    resisted = true;
    zoneEffect = null;
  }
  if (zoneEffect) target.status[zoneEffect] = true;
  const inflicted = !target.defeated && attack.onHit && rng() < (attack.onHit.chance ?? 1) ? attack.onHit.effet : null;
  if (inflicted) inflict(target, inflicted);

  // Épines: striking it bare-handed close up costs some blood.
  let thorns = 0;
  if (hasCapacite(target, 'epines') && distance(attacker.tile, target.tile) <= 1) {
    thorns = Math.min(attacker.hp, rollDice(THORNS_DAMAGE, rng));
    attacker.hp -= thorns;
    attacker.defeated = attacker.hp === 0;
  }
  const phase = target.defeated ? null : nextPhase(target);
  return { hit: true, critical, fumble: false, damage, zoneEffect, resisted, defeated: target.defeated, inflicted, thorns, phase };
}

export function inflict(target: Combatant, effet: HitEffect): void {
  if (effet === 'brulure') target.status.burning = LINGERING.brulure.turns;
  else if (effet === 'saignement') target.status.bleeding = LINGERING.saignement.turns;
  else if (effet === 'ralenti') target.status.slowed = true;
  else target.status.stunned = true;
}

/**
 * At the start of its turn, a burning or bleeding fighter loses PV (one roll per effect) and one turn of each effect.
 * Returns what each effect took.
 */
export function lingeringDamage(c: Combatant, rng: Rng = Math.random): { brulure: number; saignement: number } {
  const taken = { brulure: 0, saignement: 0 };
  if (c.defeated) return taken;
  if (c.status.burning > 0) {
    taken.brulure = rollDice(LINGERING.brulure.damage, rng);
    c.status.burning--;
  }
  if (c.status.bleeding > 0) {
    taken.saignement = rollDice(LINGERING.saignement.damage, rng);
    c.status.bleeding--;
  }
  c.hp = Math.max(0, c.hp - taken.brulure - taken.saignement);
  c.defeated = c.hp === 0;
  return taken;
}

/** A healer can tend this ally: both standing, the ally hurt and within reach, PA enough. */
export function canHeal(healer: Combatant, target: Combatant): boolean {
  return (
    !!healer.heal &&
    !healer.defeated &&
    !target.defeated &&
    healer.side === target.side &&
    target.hp < target.maxHp &&
    healer.actionPoints >= ATTACK_AP_COST &&
    distance(healer.tile, target.tile) <= healer.heal.range
  );
}

export function resolveHeal(healer: Combatant, target: Combatant, rng: Rng = Math.random): number {
  healer.actionPoints -= ATTACK_AP_COST;
  const healed = Math.min(target.maxHp - target.hp, rollDice(healer.heal!.amount, rng));
  target.hp += healed;
  return healed;
}

/** A boss hurt enough enters its next phase: harder blows, more PA, a thicker hide. Returns that phase, if any. */
export function nextPhase(c: Combatant): PhaseDef | null {
  const phase = c.phases?.[c.phase];
  if (!phase || c.defeated || c.hp > phase.seuil * c.maxHp) return null;
  c.phase++;
  for (const a of c.attacks) a.toHitBonus += phase.attackBonus ?? 0;
  c.maxActionPoints += phase.actionPoints ?? 0;
  c.defense += phase.defense ?? 0;
  return phase;
}

/** What the beaten enemies leave: items and Fers, each by its chance. */
export function rollLoot(enemies: EnemyDef[], rng: Rng = Math.random): { items: string[]; fers: number } {
  const loot = { items: [] as string[], fers: 0 };
  for (const enemy of enemies) {
    for (const entry of enemy.butin ?? []) {
      if (rng() >= entry.chance) continue;
      if (entry.item) for (let n = 0; n < (entry.count ?? 1); n++) loot.items.push(entry.item);
      if (entry.fers) loot.fers += entry.fers[0] + Math.floor(rng() * (entry.fers[1] - entry.fers[0] + 1));
    }
  }
  return loot;
}

/**
 * Resets PA for a new turn, applying the zone effects received since the combatant's last turn (docs/gdd/combat.md):
 * they last the whole of this turn (a disarmed combatant cannot attack), and are cleared by endTurn.
 */
export function startTurn(combatant: Combatant): void {
  combatant.moved = 0;
  combatant.struck = false;
  if (combatant.status.stunned) {
    combatant.actionPoints = 0;
  } else if (combatant.status.slowed) {
    combatant.actionPoints = Math.ceil(combatant.maxActionPoints / 2);
  } else {
    combatant.actionPoints = combatant.maxActionPoints;
  }
}

/**
 * The zone effects suffered are spent once the combatant's turn is over, and it is spared them until the end of its
 * next turn; burning and bleeding go on.
 */
export function endTurn(combatant: Combatant): void {
  const s = combatant.status;
  combatant.immune = { stunned: s.stunned, disarmed: s.disarmed, slowed: s.slowed };
  combatant.status = { ...emptyStatus(), burning: s.burning, bleeding: s.bleeding };
}

export function isVictory(combatants: Combatant[]): boolean {
  return combatants.filter((c) => c.side === 'enemies').every((c) => c.defeated);
}

export function isDefeat(combatants: Combatant[]): boolean {
  return combatants.filter((c) => c.side === 'heroes').every((c) => c.defeated);
}
