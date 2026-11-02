import encounterData from '../data/encounters.json';
import enemyData from '../data/enemies.json';
import weaponData from '../data/weapons.json';
import type { Tile } from '../engine/iso';
import { attributeModifier, type AttributeId, type SkillId } from './attributes';
import { characterStats, findFeat, type Character } from './character';
import type { Effect } from './dialogue';
import { armorBonus } from './inventory';

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
  /** Fers, between the two numbers. */
  fers?: [number, number];
  chance: number;
}

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
  /** Tile drawn for this enemy (name in scripts/tiles-def.mjs). */
  tile: string;
  /** In tiles: 1 (default) strikes up close, more shoots from afar. */
  range?: number;
  onHit?: OnHit;
  /** A healer tends its wounded allies instead of striking, when one needs it. */
  soin?: { amount: Dice; range: number };
  phases?: PhaseDef[];
  butin?: LootDef[];
  /** The bestiary page (docs/gdd/combat.md, « Bestiaire ») and where it comes from in the canon. */
  description?: string;
  source?: string;
}

/**
 * A fight started from a dialogue (src/data/encounters.json): the arena is carved around a map object, each enemy
 * starts on its own map object (drawn on the map until the fight is won or avoided).
 */
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
  { id: 'tete', label: 'Tête', toHitPenalty: -4, effect: 'stunned' },
  { id: 'bras', label: 'Bras', toHitPenalty: -2, effect: 'disarmed' },
  { id: 'jambes', label: 'Jambes', toHitPenalty: -2, effect: 'slowed' },
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
  /** 3 PA, fixed (docs/gdd/combat.md). */
  apCost: number;
  /** An effect the blow may leave on the target. */
  onHit?: OnHit;
}

export const ATTACK_AP_COST = 3;
export const MOVE_AP_COST_PER_TILE = 1;

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
  const feat = findFeat(character.feat)?.effects.combat ?? {};
  return heldWeapons(character).map((weapon) => {
    const rank = character.skills[weapon.skill];
    const mod = attributeModifier(character.attributes[weapon.attribute]);
    const isRanged = weapon.skill === 'ranged';
    const hitBonus = (isRanged ? 0 : (feat.meleeHit ?? 0)) + 0;
    return {
      weaponId: weapon.id,
      label: weapon.name,
      range: isRanged ? weapon.range * (feat.rangeMultiplier ?? 1) : weapon.range,
      toHitBonus: mod + rank + hitBonus,
      damage: weapon.damage,
      damageBonus: mod + (isRanged ? (feat.rangedDamage ?? 0) : (feat.meleeDamage ?? 0)),
      apCost: ATTACK_AP_COST,
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
    id: 'hero',
    name: character.name,
    side: 'heroes',
    hp: character.hp,
    maxHp: stats.maxHp,
    defense: stats.defense + armorBonus(character),
    actionPoints: stats.actionPoints,
    maxActionPoints: stats.actionPoints,
    initiative: 0,
    attacks: heroAttacks(character),
    tile,
    status: emptyStatus(),
    defeated: false,
    defeatText: `${character.name} tombe.`,
    phase: 0,
  };
}

export function makeEnemyCombatant(enemy: EnemyDef, id: string, tile: Tile): Combatant {
  return {
    id,
    name: enemy.name,
    side: 'enemies',
    hp: enemy.hp,
    maxHp: enemy.hp,
    defense: enemy.defense,
    actionPoints: enemy.actionPoints,
    maxActionPoints: enemy.actionPoints,
    initiative: 0,
    attacks: [enemyAttack(enemy)],
    tile,
    status: emptyStatus(),
    defeated: false,
    defeatText: enemy.defeatText,
    kind: enemy.id,
    heal: enemy.soin,
    phases: enemy.phases,
    phase: 0,
  };
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

export function canAttack(attacker: Combatant, attack: AttackProfile, target: Combatant): boolean {
  return (
    !attacker.defeated &&
    !target.defeated &&
    !attacker.status.disarmed &&
    attacker.actionPoints >= attack.apCost &&
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
  defeated: boolean;
  /** The effect the blow left (burning, bleeding…), if any. */
  inflicted: HitEffect | null;
}

/** Chance (0 to 1) that resolveAttack hits: shown before the player commits (docs/gdd/combat.md). */
export function hitChance(attack: AttackProfile, target: Combatant, zone: Zone = 'corps', coverBonus = 0): number {
  const need = target.defense + coverBonus - attack.toHitBonus - findZone(zone).toHitPenalty;
  let hits = 0;
  for (let roll = 2; roll <= 20; roll++) if (roll === 20 || roll >= need) hits++;
  return hits / 20;
}

/** d20 + bonus (+ zone penalty) ≥ target's defense (+ cover); a 20 always hits and doubles damage dice, a 1 always misses. */
export function resolveAttack(
  attacker: Combatant,
  attack: AttackProfile,
  target: Combatant,
  zone: Zone = 'corps',
  coverBonus = 0,
  rng: Rng = Math.random,
): AttackResult {
  attacker.actionPoints -= attack.apCost;
  const zoneDef = findZone(zone);
  const roll = rollDie(20, rng);
  const fumble = roll === 1;
  const critical = roll === 20;
  const total = roll + attack.toHitBonus + zoneDef.toHitPenalty;
  const hit = !fumble && (critical || total >= target.defense + coverBonus);

  if (!hit) return { hit: false, critical: false, fumble, damage: 0, zoneEffect: null, defeated: false, inflicted: null };

  const dice = rollDice(attack.damage, rng) + (critical ? rollDice(attack.damage, rng) : 0);
  const damage = Math.max(0, dice + attack.damageBonus);
  target.hp = Math.max(0, target.hp - damage);
  target.defeated = target.hp === 0;

  const zoneEffect = zoneDef.effect;
  if (zoneEffect && !target.defeated) target.status[zoneEffect] = true;
  const inflicted = !target.defeated && attack.onHit && rng() < (attack.onHit.chance ?? 1) ? attack.onHit.effet : null;
  if (inflicted) inflict(target, inflicted);

  return { hit: true, critical, fumble: false, damage, zoneEffect: zoneEffect && !target.defeated ? zoneEffect : null, defeated: target.defeated, inflicted };
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
      if (entry.item) loot.items.push(entry.item);
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
  if (combatant.status.stunned) {
    combatant.actionPoints = 0;
  } else if (combatant.status.slowed) {
    combatant.actionPoints = Math.ceil(combatant.maxActionPoints / 2);
  } else {
    combatant.actionPoints = combatant.maxActionPoints;
  }
}

/** The zone effects suffered are spent once the combatant's turn is over; burning and bleeding go on. */
export function endTurn(combatant: Combatant): void {
  combatant.status = { ...emptyStatus(), burning: combatant.status.burning, bleeding: combatant.status.bleeding };
}

export function isVictory(combatants: Combatant[]): boolean {
  return combatants.filter((c) => c.side === 'enemies').every((c) => c.defeated);
}

export function isDefeat(combatants: Combatant[]): boolean {
  return combatants.filter((c) => c.side === 'heroes').every((c) => c.defeated);
}
