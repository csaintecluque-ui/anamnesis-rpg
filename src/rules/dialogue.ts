import questData from '../data/quests.json';
import veilleeData from '../data/veillees.json';
import { findLocation, type GameState } from '../state/gameState';
import { ATTRIBUTES, SKILLS, attributeModifier, skillScoreOf, type AttributeId, type SkillId } from './attributes';
import { resolveCheck, rollD20, successChance, type Rng } from './checks';
import { heroKey, rngFor } from './graine';
import { finAction, finCondition, type FinAction, type FinCondition } from './fin';
import { characterStats } from './character';
import { ENCOUNTERS, GOLEM_FIGHT, GOLEM_QUEST_FIGHT, VOIE_FIGHT } from './combat';
import { dreamFragment } from './heros';
import { addItem, findItem, ownedCount, removeItem } from './inventory';
import { collectedEchos, easeEmprise, empriseMalus, ECHOS, fadeSouvenirs, relive, souvenirBonus } from './echos';
import { gardienNotices, gardienRank, rankNotices } from './factions';
import recetteData from '../data/recettes.json';
import { avisOf, changeAvis, findCompanion, inParty, joinParty, leaveParty, restParty } from './companions';
import { castCost, castOutsideCombat, findPower, hasPower, POWERS, resonanceMax, restoreResonance, teachSkillRank, wornCrystal, type PowerId } from './magic';
import { RECITS, findRecit, forgetRecit, knowsRecit, learnRecit } from './recits';
import { effacerMarques, manqueMalus, marquesOf } from './marques';
import { REPUTATION, reputationNotices, reputationScore, reputationTag } from './reputation';
import { MOMENTS, advance, formatDate, isNight, momentOf, sleepUntil, waitUntil, type Moment } from './time';

/** « C'est la nuit. », « C'est midi. » */
const ITS_MOMENT: Record<(typeof MOMENTS)[number], string> = { matin: 'C’est le matin.', midi: 'C’est midi.', soir: 'C’est le soir.', nuit: 'C’est la nuit.' };

/** Attribute and skill tests stay visible (greyed) when unmet; story conditions hide the option. */
export type Condition =
  | { attribute: AttributeId; min: number }
  | { skill: SkillId; min: number }
  | { flag: string }
  | { notFlag: string }
  | { quest: string; status: 'none' | 'active' | 'done' }
  | { recit: string }
  /** Carries this item (at least `count`, default 1): a story condition, the option is hidden otherwise. */
  | { item: string; count?: number }
  /** Enough Fers to pay (a meal at the inn): a test, shown greyed when unmet. */
  | { fers: number }
  /** The town's opinion of the hero (docs/gdd/reputation.md): a test, shown greyed when unmet. */
  | { reputation: string; min: number }
  /** The moment of the day (docs/gdd/temps.md): « jour » is any moment but « nuit ». A story condition. */
  | { moment: Moment | 'jour' }
  /** One day in `tousLes`, from the `decalage`-th (the news of the day at the inns). A story condition. */
  | { tousLes: number; decalage: number }
  /** A crystal is worn at the neck (true) or not (false): « on tient des listes » at Ironheart. A story condition. */
  | { cristal: boolean }
  /** This companion travels with the hero (docs/gdd/jalon-3.md, étape 2). A story condition. */
  | { compagnon: string }
  /** What this companion thinks of the hero, between `min` and `max` (both optional). A story condition. */
  | { avis: string; min?: number; max?: number }
  /** The hero stands in this place (src/data/locations.json). A story condition. */
  | { lieu: string }
  /**
   * The hero bears at least `marques` marks of the crystal (src/rules/marques.ts), and at most `max`: what the
   * town sees on the skin. A story condition.
   */
  | { marques: number; max?: number }
  /** At least this many Échos gathered in the Livre des Échos (docs/gdd/echos.md): a test, shown greyed when unmet. */
  | { echos: number }
  /** The worn crystal has been cast at least this many times since it was tuned (chantier 6). A story condition. */
  | { usureCristal: number }
  /** A question of the finale (src/rules/fin.ts): the pieces, the dame en gris, the lists, Ilyane. A story condition. */
  | { fin: FinCondition };

export type Effect =
  | { setFlag: string }
  /** A flag that holds `days` days, today included (a visitor's pass ; chantier 6). */
  | { setFlagFor: string; days: number }
  /** The worn crystal tuned again: its wear gone, its Points de Résonance back (src/rules/usure.ts ; chantier 6). */
  | { reaccorder: true }
  | { startQuest: string }
  | { completeQuest: string }
  | { giveXp: number }
  | { giveFers: number }
  | { learnRecit: string }
  /** Adds to the inventory (src/data/items.json). */
  | { giveItem: string; count?: number }
  /** Takes from the inventory (a quest item handed over, stolen goods given back). */
  | { takeItem: string; count?: number }
  /** Gives back hit points, up to the maximum. */
  | { heal: number }
  /** No state change: tells DialogueScene to open the Troc with this NPC instead of closing (docs/gdd/inventaire.md). */
  | { openTrade: true }
  /** No state change: tells DialogueScene to open the veillée of this public instead of closing (docs/gdd/veillees.md). */
  | { veillee: string }
  /** No state change: tells DialogueScene to close and the map to start this fight (src/data/encounters.json). */
  | { startCombat: string }
  /** No state change: tells DialogueScene to close and the map to go to this place (e.g. through a door just unlocked). */
  | { goTo: string; arrivee?: string }
  /** Waits until a moment of the day (nothing if it is already that moment) — « Attendre la nuit ». */
  | { attendre: Moment }
  /** Moves the clock forward by this many moments (a train, a caravan). */
  | { avancer: number }
  /** Sleeps until a moment (at least until the next of its kind): all PV and PR back, and the game saves (DialogueScene). */
  | { dormir: Moment }
  /**
   * Casts a power of the worn crystal (docs/gdd/magie.md): its PR are spent, and PV if forced. The option shows the
   * power and its cost, greyed without the right crystal; what the power does is the rest of the option's effects.
   */
  | { lancer: PowerId }
  /** Teaches one rank of a skill (Vanel teaches the Résonance). */
  | { apprendre: SkillId }
  /** A companion joins the party (docs/gdd/jalon-3.md, étape 2). */
  | { rejoindre: string }
  /** A companion leaves the party and goes home. */
  | { quitter: string }
  /** A companion travelling with the hero thinks of this choice (+ or −); too low, they leave. */
  | { avis: string; delta: number }
  /** Relives a gathered Écho (docs/gdd/echos.md): a moment of peace, time lost, the emprise grows. */
  | { revivre: string }
  /** A Récit given away (raconter, `donne`): forgotten, the listener keeps it (feuille de route, chantier 1). */
  | { donnerRecit: string }
  /** Loses PV (a cursed Écho holding on); never below 1. */
  | { blesser: number }
  /** The contract under way is fulfilled (a hunt's beasts beaten, docs/gdd/voies.md): back to its board. */
  | { contrat: 'fait' }
  /** A Druide Vert takes back the marks of the crystal, and a rank of Résonance with them (src/rules/marques.ts). */
  | { effacerMarques: true }
  /** No state change: tells DialogueScene to open this workshop (docs/gdd/artisanat.md): « forge » or « herbes ». */
  | { atelier: string }
  /** An action of the finale (src/rules/fin.ts): pieces handed back, taken back, given, the train called. */
  | { finale: FinAction }
  /** No state change: tells DialogueScene to close and open the epilogue (src/rules/epilogue.ts). */
  | { epilogue: true };

/** An action rolled with the d20 (docs/gdd/competences.md): the chance is shown, then `next` or `failNext` follows. */
export interface Roll {
  skill: SkillId;
  difficulty: number;
}

export interface DialogueOption {
  text: string;
  /** Node id, or END to close the dialogue. With a roll, where a success leads. */
  next: string;
  requires?: Condition[];
  effects?: Effect[];
  roll?: Roll;
  /** Where a failed roll leads. */
  failNext?: string;
  /** The hero tells (or gives away) a Récit of their choice; `next` is where « Aucun, finalement » goes back. */
  raconter?: RaconterDef;
}

/**
 * Raconter un Récit en dialogue (feuille de route, chantier 1 ; docs/gdd/memoire.md) : the hero picks one of their
 * Récits ; the listener reacts to that very Récit (`recits`), to what it speaks of (`aime`: themes of the veillées),
 * or not at all. A Récit given away (`donne`) is forgotten once accepted: the listener keeps it.
 */
export interface RaconterDef {
  aime?: string[];
  donne?: boolean;
  /** A node for a particular Récit (« J'ai vu le dernier train, moi aussi »). */
  recits?: Record<string, string>;
  /** A Récit that speaks of what the listener likes. */
  touche?: string;
  /** Any other Récit, when only what the listener likes is accepted (nothing is given then). */
  refus?: string;
  /** Any other Récit, accepted. */
  neutre: string;
}

/** The Récits the hero may tell here: all they know, or, to give one away, all but those of the main story. */
export function raconterChoices(state: GameState, def: RaconterDef): string[] {
  const known = state.character?.recits ?? [];
  return def.donne ? known.filter((id) => !findRecit(id)?.principal) : [...known];
}

/** Where telling this Récit leads, and whether the listener takes it. */
export function raconterTarget(def: RaconterDef, recitId: string): { node: string; accepted: boolean } {
  const special = def.recits?.[recitId];
  if (special) return { node: special, accepted: true };
  const themes = findRecit(recitId)?.themes ?? [];
  if (def.aime?.some((t) => themes.includes(t))) return { node: def.touche ?? def.neutre, accepted: true };
  if (def.refus) return { node: def.refus, accepted: false };
  return { node: def.neutre, accepted: true };
}

/** The choice of one Récit, as a dialogue option: where it leads, and (given away) its forgetting. */
export function raconterOption(def: RaconterDef, recitId: string): DialogueOption {
  const { node, accepted } = raconterTarget(def, recitId);
  return {
    text: `« ${findRecit(recitId)?.titre ?? recitId} »`,
    next: node,
    ...(def.donne && accepted ? { effects: [{ donnerRecit: recitId }] } : {}),
  };
}

export interface DialogueNode {
  text: string;
  /** Darkens the backdrop: the scene happens at night. */
  night?: boolean;
  /** Full-screen illustration behind the panel: public/illustrations/<id>.jpg (npm run art). */
  illustration?: string;
  /** Applied each time the node is shown. */
  effects?: Effect[];
  /**
   * What a companion travelling with the hero says here, under the text (feuille de route, chantier 4 : the companions
   * live in the key scenes). By companion id; written whole (« Liane serre les poings. — … »).
   */
  apartes?: Record<string, string>;
  options: DialogueOption[];
}

/** The longest aside, in characters. */
export const MAX_APARTE = 240;

/** The asides of the companions who travel with the hero, in the order of the party. */
export function nodeApartes(node: DialogueNode, state: Pick<GameState, 'groupe'>): string[] {
  if (!node.apartes) return [];
  return state.groupe.map((m) => node.apartes![m.id]).filter((line): line is string => !!line);
}

export interface Dialogue {
  id: string;
  speaker: string;
  /** First entry whose conditions hold decides where the conversation starts. */
  /**
   * `seul`: a companion's talk that comes by itself, once, when it holds on arriving in a place or at nightfall (étude
   * du 2026-11-03, D4 : l'aveu de Liane la nuit), and not only when one clicks on them.
   */
  entries: { requires?: Condition[]; node: string; seul?: boolean }[];
  nodes: Record<string, DialogueNode>;
}

export interface QuestDef {
  id: string;
  name: string;
  summary: string;
  /** Where the hero stands, for the journal: the last step whose flag is set (docs/gdd/interface.md). */
  etapes?: { si: string; texte: string }[];
  /** A main quest's different endings (étude du 2026-11-03, B11) : each one sets `fin-<quest>-<id>` (src/rules/fins.ts). */
  fins?: { id: string; titre: string }[];
}

export const END = 'fin';
export const QUESTS = questData as QuestDef[];
export const MAX_NODE_TEXT = 300;
export const MAX_OPTIONS = 4;

const isTest = (
  c: Condition,
): c is { attribute: AttributeId; min: number } | { skill: SkillId; min: number } | { fers: number } | { reputation: string; min: number } | { echos: number } =>
  'attribute' in c || 'skill' in c || 'fers' in c || 'reputation' in c || 'echos' in c;

export function conditionMet(state: GameState, c: Condition): boolean {
  if ('attribute' in c) return (state.character?.attributes[c.attribute] ?? 0) >= c.min;
  // A test of skill counts the rank and the attribute behind it (feuille de route, chantier 2).
  if ('skill' in c) return skillScore(state, c.skill) >= c.min;
  if ('flag' in c) return state.flags[c.flag] === true;
  if ('notFlag' in c) return state.flags[c.notFlag] !== true;
  if ('recit' in c) return knowsRecit(state.character, c.recit);
  if ('fers' in c) return (state.character?.fers ?? 0) >= c.fers;
  if ('reputation' in c) return reputationScore(state, c.reputation) >= c.min;
  if ('item' in c) return !!state.character && ownedCount(state.character, c.item) >= (c.count ?? 1);
  if ('moment' in c) return c.moment === 'jour' ? !isNight(state.time) : momentOf(state.time) === c.moment;
  if ('tousLes' in c) return (state.time.day - 1) % c.tousLes === c.decalage;
  if ('cristal' in c) return !!state.character && !!wornCrystal(state.character) === c.cristal;
  if ('compagnon' in c) return inParty(state, c.compagnon);
  if ('fin' in c) return finCondition(state, c.fin);
  if ('usureCristal' in c) return !!state.character?.equipment.cristal && (state.character.usureCristal ?? 0) >= c.usureCristal;
  if ('avis' in c) return avisOf(state, c.avis) >= (c.min ?? -Infinity) && avisOf(state, c.avis) <= (c.max ?? Infinity);
  if ('lieu' in c) return state.location === c.lieu;
  if ('marques' in c) return marquesOf(state.character) >= c.marques && marquesOf(state.character) <= (c.max ?? Infinity);
  if ('echos' in c) return collectedEchos(state).length >= c.echos;
  return (state.quests[c.quest] ?? 'none') === c.status;
}

/**
 * What a test of skill weighs: the rank plus the modifier of its attribute (Diplomatie and Présence, Athlétisme and
 * Corps…), as for the dice (feuille de route, chantier 2). The « souvenir vif » and the emprise only touch the dice.
 */
export function skillScore(state: Pick<GameState, 'character'>, skill: SkillId): number {
  return state.character ? skillScoreOf(state.character, skill) : attributeModifier(3);
}

/** "Perception 4", "Diplomatie 2" — shown as [tag] before the option. */
export function testLabel(c: Condition): string | null {
  if ('attribute' in c) return `${ATTRIBUTES.find((a) => a.id === c.attribute)?.name ?? c.attribute} ${c.min}`;
  if ('skill' in c) return `${SKILLS.find((s) => s.id === c.skill)?.name ?? c.skill} ${c.min}`;
  if ('fers' in c) return `${c.fers} Fers`;
  if ('reputation' in c) return reputationTag(c.reputation, c.min);
  if ('echos' in c) return `${c.echos} Échos recueillis`;
  return null;
}

export interface OptionView {
  option: DialogueOption;
  /** Its place among the node's options: with the dialogue and the node, it names a roll (rollLockFlag). */
  index: number;
  enabled: boolean;
  /** Test tags such as "Perception 4" or "Discrétion 65 %", shown whether or not they are met. */
  tags: string[];
  /** What is missing, in French, when disabled. */
  missing?: string;
}

/** Where a node stands: its dialogue and its id, which name the rolls made there (test du 2026-11-06). */
export interface NodePlace {
  dialogue: string;
  node: string;
}

/** A roll, by where it stands: the dialogue, the node, its place among the options. */
const rollKey = (place: NodePlace, index: number): string => `${place.dialogue}-${place.node}-${index}`;

/**
 * The flag that holds a roll failed today for nothing (test du 2026-11-06, décision de Cyril): one try a day, as the
 * thirty rolls that already said « demain » did. It lasts until the end of the day (`expirations`).
 */
export const rollLockFlag = (place: NodePlace, index: number): string => `jet-rate-${rollKey(place, index)}`;

/** What a failure can cost: a wound, time, a thing, a fight. A failure that costs one of them can be tried again. */
const PRICES = ['blesser', 'avancer', 'attendre', 'dormir', 'takeItem', 'startCombat'];

/** True when failing the option costs nothing: then it waits for tomorrow. */
export function failureIsFree(dialogue: Dialogue, option: DialogueOption): boolean {
  const effects = (option.failNext && dialogue.nodes[option.failNext]?.effects) || [];
  return !effects.some((e) => PRICES.some((price) => price in e) || ('giveFers' in e && e.giveFers < 0));
}

/** How many times a roll was tried today. */
function attemptsToday(state: Pick<GameState, 'time' | 'jets'>, key: string): number {
  return state.jets?.jour === state.time.day ? (state.jets.essais[key] ?? 0) : 0;
}

/**
 * Rolls a dialogue's option (test du 2026-11-06, décision de Cyril). The die comes from a seed, as in the sleeping
 * lines: the day, the roll, how many times it was tried today, the hero ; reloading gives the same die. A failure that
 * costs nothing waits for tomorrow ; one that costs (a wound, time) can be paid again, for another die.
 */
export function rollOption(state: GameState, dialogue: Dialogue, place: NodePlace, index: number): RollOutcome {
  const option = dialogue.nodes[place.node].options[index];
  const key = rollKey(place, index);
  const tries = attemptsToday(state, key);
  const outcome = performRoll(state, option.roll!, rngFor('jet', state.time.day, key, tries, heroKey(state.character)));
  const today = state.jets?.jour === state.time.day ? state.jets.essais : {};
  state.jets = { jour: state.time.day, essais: { ...today, [key]: tries + 1 } };
  if (!outcome.success && failureIsFree(dialogue, option)) {
    const flag = rollLockFlag(place, index);
    state.flags[flag] = true;
    state.expirations = { ...state.expirations, [flag]: state.time.day };
  }
  return outcome;
}

const TRY_TOMORROW = 'Raté aujourd’hui : réessaie demain.';

/**
 * Visible options for the current state: hidden when a story condition fails, greyed when a test fails, or when its
 * roll failed today (given where the node stands).
 */
export function visibleOptions(node: DialogueNode, state: GameState, place?: NodePlace): OptionView[] {
  const views: OptionView[] = [];
  for (const [index, option] of node.options.entries()) {
    const conditions = option.requires ?? [];
    if (!conditions.filter((c) => !isTest(c)).every((c) => conditionMet(state, c))) continue;
    // Nothing to tell (or to give away): the option is not there.
    if (option.raconter && raconterChoices(state, option.raconter).length === 0) continue;
    const tests = conditions.filter(isTest);
    const failed = tests.filter((c) => !conditionMet(state, c));
    const tags = tests.map((c) => testLabel(c)!);
    if (option.roll) tags.push(`${skillName(option.roll.skill)} ${Math.round(rollChance(state, option.roll) * 100)} %`);
    const spell = castView(state, option);
    if (spell) tags.push(spell.tag);
    const locked = option.roll && place && state.flags[rollLockFlag(place, index)] ? TRY_TOMORROW : undefined;
    const missing = failed.length ? `Il te faut ${failed.map((c) => testLabel(c)).join(' et ')}.` : (spell?.missing ?? locked);
    views.push({ option, index, enabled: !missing, tags, missing });
  }
  return views;
}

/** What a crystal is needed for each power, in « Il te faut porter… ». */
const CRYSTAL_NEEDED: Record<PowerId, string> = { guerison: 'un cristal de Vie', flammes: 'un cristal de forge', lueur: 'un cristal' };

/** An option that casts a power: its tag (« Lueur · 1 PR »), and what is missing to cast it. */
function castView(state: GameState, option: DialogueOption): { tag: string; missing?: string } | null {
  const effect = option.effects?.find((e) => 'lancer' in e);
  const power = effect && 'lancer' in effect ? findPower(effect.lancer) : undefined;
  const c = state.character;
  if (!power || !c) return null;
  if (!hasPower(c, power.id)) return { tag: `${power.name} · ${power.cost} PR`, missing: `Il te faut porter ${CRYSTAL_NEEDED[power.id]}.` };
  const cost = castCost(c, power);
  // Forcing is shown with its price: the nosebleed, and the mark it may leave (src/rules/marques.ts).
  const tag = `${power.name} · ${power.cost} PR${cost.hp > 0 ? ` (nez qui saigne : −${cost.hp} PV, risque de marque)` : ''}`;
  return { tag, missing: c.hp > cost.hp ? undefined : 'Tu n’as plus assez de forces : dors d’abord.' };
}

/**
 * Attribute modifier + rank, less the emprise of the Échos (docs/gdd/echos.md) and the craving of a marked hero
 * without a crystal (src/rules/marques.ts): what is added to the d20.
 */
export function rollBonus(state: GameState, skill: SkillId): number {
  const c = state.character;
  const attribute = SKILLS.find((s) => s.id === skill)!.attribute;
  return attributeModifier(c?.attributes[attribute] ?? 3) + (c?.skills[skill] ?? 0) + souvenirBonus(state, skill) - empriseMalus(state) - manqueMalus(c);
}

/** Probability (0–1) that the roll succeeds, shown on the option before choosing it. */
export function rollChance(state: GameState, roll: Roll): number {
  return successChance(rollBonus(state, roll.skill), 0, roll.difficulty);
}

export interface RollOutcome {
  success: boolean;
  /** "Jet de Discrétion : 14 + 2 = 16 contre 10, réussi" */
  notice: string;
}

/** Rolls the d20 for a rolled option; the caller then shows `next` or `failNext`. */
export function performRoll(state: GameState, roll: Roll, rng: Rng = Math.random): RollOutcome {
  const die = rollD20(rng);
  const bonus = rollBonus(state, roll.skill);
  const result = resolveCheck({ roll: die, modifier: bonus, rank: 0, difficulty: roll.difficulty });
  const sign = bonus < 0 ? '−' : '+';
  const verdict = result.critical ? (result.success ? 'réussite critique' : 'échec critique') : result.success ? 'réussi' : 'raté';
  return {
    success: result.success,
    notice: `${jetDe(skillName(roll.skill))} : ${die} ${sign} ${Math.abs(bonus)} = ${result.total} contre ${roll.difficulty}, ${verdict}`,
  };
}

/** "Jet de Discrétion", "Jet d’Artisanat". */
function jetDe(name: string): string {
  return /^[AEIOUYÉÈÊ]/.test(name) ? `Jet d’${name}` : `Jet de ${name}`;
}

function skillName(id: SkillId): string {
  return SKILLS.find((s) => s.id === id)?.name ?? id;
}

export function startNode(dialogue: Dialogue, state: GameState): string {
  const entry = dialogue.entries.find((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
  if (!entry) throw new Error(`Dialogue ${dialogue.id} has no entry for this state`);
  return entry.node;
}

/**
 * The companion's talk that comes by itself now (étude D4): for each companion in the party, the entry their dialogue
 * would open on, if it is marked `seul` and was not offered yet. `flag` records the offer (one time each).
 */
export function autoTalk(state: GameState, dialogues: Record<string, Dialogue>): { id: string; flag: string } | null {
  for (const m of state.groupe) {
    const dialogue = dialogues[`compagnon-${m.id}`];
    const entry = dialogue?.entries.find((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
    if (!dialogue || !entry?.seul) continue;
    const flag = `aparte-seul-${m.id}-${entry.node}`;
    if (!state.flags[flag]) return { id: dialogue.id, flag };
  }
  return null;
}

/** True when a conditional entry holds, not just the last, unconditional one (a figurant who has something to say). */
export function hasStoryEntry(dialogue: Dialogue, state: GameState): boolean {
  const index = dialogue.entries.findIndex((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
  return index >= 0 && index < dialogue.entries.length - 1;
}

/** Takes off the flags whose time is over (a visitor's pass, after its week ; chantier 6). Returns those taken off. */
export function expireFlags(state: Pick<GameState, 'flags' | 'time' | 'expirations'>): string[] {
  const gone = Object.entries(state.expirations ?? {}).filter(([, last]) => state.time.day > last).map(([flag]) => flag);
  for (const flag of gone) {
    delete state.flags[flag];
    delete state.expirations![flag];
  }
  return gone;
}

/** Applies effects to the live state; returns player-facing notices (new quest, experience…). */
export function applyEffects(state: GameState, effects: Effect[] = []): string[] {
  const notices: string[] = [];
  const before = { flags: { ...state.flags }, quests: { ...state.quests } };
  const gardienBefore = gardienRank(state);
  for (const effect of effects) {
    if ('setFlag' in effect) {
      state.flags[effect.setFlag] = true;
    } else if ('reaccorder' in effect) {
      if (state.character) {
        state.character.usureCristal = 0;
        state.character.resonance = resonanceMax(state.character);
        notices.push('Ton cristal est réaccordé : il chante juste');
      }
    } else if ('setFlagFor' in effect) {
      state.flags[effect.setFlagFor] = true;
      state.expirations = { ...state.expirations, [effect.setFlagFor]: state.time.day + effect.days - 1 };
    } else if ('startQuest' in effect) {
      if (!state.quests[effect.startQuest]) {
        state.quests[effect.startQuest] = 'active';
        notices.push(`Nouvelle quête : ${questName(effect.startQuest)}`);
      }
    } else if ('completeQuest' in effect) {
      if (state.quests[effect.completeQuest] !== 'done') {
        state.quests[effect.completeQuest] = 'done';
        notices.push(`Quête terminée : ${questName(effect.completeQuest)}`);
      }
    } else if ('learnRecit' in effect) {
      if (state.character && !knowsRecit(state.character, effect.learnRecit)) {
        learnRecit(state.character, effect.learnRecit);
        notices.push(`Récit retenu : ${findRecit(effect.learnRecit)?.titre ?? effect.learnRecit}`);
      }
    } else if ('openTrade' in effect || 'veillee' in effect || 'atelier' in effect || 'startCombat' in effect || 'goTo' in effect) {
      // Handled by DialogueScene (Troc, veillée, a fight on the map, another place); no state change here.
    } else if ('giveItem' in effect) {
      if (state.character) {
        const count = effect.count ?? 1;
        addItem(state.character, effect.giveItem, count);
        notices.push(`+${count} ${findItem(effect.giveItem)?.name ?? effect.giveItem}`);
      }
    } else if ('takeItem' in effect) {
      if (state.character) {
        const count = Math.min(effect.count ?? 1, ownedCount(state.character, effect.takeItem));
        if (count > 0) {
          removeItem(state.character, effect.takeItem, count);
          notices.push(`−${count} ${findItem(effect.takeItem)?.name ?? effect.takeItem}`);
        }
      }
    } else if ('attendre' in effect) {
      if (waitUntil(state.time, effect.attendre) > 0) notices.push(ITS_MOMENT[momentOf(state.time)]);
    } else if ('avancer' in effect) {
      advance(state.time, effect.avancer);
    } else if ('dormir' in effect) {
      sleepUntil(state.time, effect.dormir);
      if (state.character) {
        state.character.hp = characterStats(state.character).maxHp;
        restoreResonance(state.character);
      }
      restParty(state);
      easeEmprise(state);
      fadeSouvenirs(state.flags);
      notices.push(`Tes forces sont revenues. ${ITS_MOMENT[momentOf(state.time)]} Nous sommes ${formatDate(state.time)}.`);
      // A fragment of the hero's own past may come back in the night (piste A ; étude, F1).
      const reve = dreamFragment(state);
      if (reve) notices.push(reve);
    } else if ('lancer' in effect) {
      if (state.character) notices.push(...(castOutsideCombat(state.character, effect.lancer) ?? []));
    } else if ('rejoindre' in effect) {
      const def = findCompanion(effect.rejoindre);
      if (def && joinParty(state, effect.rejoindre)) notices.push(`${def.name} se joint à toi`);
      else if (def && !inParty(state, effect.rejoindre)) notices.push(`Ton groupe est complet : ${def.name.split(' ')[0]} ne peut pas venir`);
    } else if ('quitter' in effect) {
      const def = findCompanion(effect.quitter);
      if (def && inParty(state, effect.quitter)) {
        leaveParty(state, effect.quitter);
        notices.push(`${def.name} quitte le groupe`);
      }
    } else if ('revivre' in effect) {
      notices.push(...relive(state, effect.revivre));
    } else if ('donnerRecit' in effect) {
      if (state.character && forgetRecit(state.character, effect.donnerRecit)) notices.push(`Récit donné : ${findRecit(effect.donnerRecit)?.titre ?? effect.donnerRecit}`);
    } else if ('contrat' in effect) {
      if (state.contrats.actif && !state.contrats.actif.fait) {
        state.contrats.actif.fait = true;
        notices.push('Contrat rempli : retourne au tableau des Gardiens');
      }
    } else if ('finale' in effect) {
      notices.push(...finAction(state, effect.finale));
    } else if ('blesser' in effect) {
      if (state.character) {
        const lost = Math.min(effect.blesser, state.character.hp - 1);
        state.character.hp -= lost;
        if (lost > 0) notices.push(`−${lost} PV`);
      }
    } else if ('effacerMarques' in effect) {
      const rank = state.character?.skills.resonance ?? 0;
      if (state.character && effacerMarques(state.character)) {
        notices.push(rank > 0 ? 'Les marques s’effacent ; ta Résonance perd un rang' : 'Les marques s’effacent');
      }
    } else if ('avis' in effect && 'delta' in effect) {
      notices.push(...changeAvis(state, effect.avis, effect.delta));
    } else if ('apprendre' in effect) {
      if (state.character && teachSkillRank(state.character, effect.apprendre)) notices.push(`+1 rang de ${skillName(effect.apprendre)}`);
    } else if ('heal' in effect) {
      if (state.character) {
        const max = characterStats(state.character).maxHp;
        const before = state.character.hp;
        state.character.hp = Math.min(max, before + effect.heal);
        if (state.character.hp > before) notices.push(`+${state.character.hp - before} PV`);
      }
    } else if ('giveFers' in effect) {
      if (state.character) {
        state.character.fers = Math.max(0, state.character.fers + effect.giveFers);
        notices.push(`${effect.giveFers >= 0 ? '+' : '−'}${Math.abs(effect.giveFers)} Fers`);
      }
    } else if ('epilogue' in effect) {
      // Nothing to change: DialogueScene opens the epilogue.
    } else if (state.character) {
      state.character.xp += effect.giveXp;
      notices.push(`+${effect.giveXp} points d’expérience`);
    }
  }
  notices.push(...reputationNotices(before, state));
  // Ranks won in the factions and in the order of the Gardiens (docs/gdd/factions.md).
  notices.push(...rankNotices(before, state), ...gardienNotices(gardienBefore, state));
  return notices;
}

/** The workshop an option opens, if any (src/data/recettes.json): « forge », « herbes ». */
export function opensAtelier(effects?: Effect[]): string | null {
  const effect = effects?.find((e) => 'atelier' in e);
  return effect && 'atelier' in effect ? effect.atelier : null;
}

export function opensTrade(effects?: Effect[]): boolean {
  return !!effects?.some((e) => 'openTrade' in e);
}

/** The public whose veillée an option opens, if any (src/data/veillees.json). */
/** The epilogue (src/rules/epilogue.ts), after an end of « La voie sept ». */
export function opensEpilogue(effects?: Effect[]): boolean {
  return !!effects?.some((e) => 'epilogue' in e);
}

export function opensVeillee(effects?: Effect[]): string | null {
  const effect = effects?.find((e) => 'veillee' in e);
  return effect && 'veillee' in effect ? effect.veillee : null;
}

/** The fight an option starts, if any (src/data/encounters.json). */
export function startsCombat(effects?: Effect[]): string | null {
  const effect = effects?.find((e) => 'startCombat' in e);
  return effect && 'startCombat' in effect ? effect.startCombat : null;
}

/** The place an option leads to, if any (src/data/locations.json). */
export function goesTo(effects?: Effect[]): { location: string; arrivee?: string } | null {
  const effect = effects?.find((e) => 'goTo' in e);
  return effect && 'goTo' in effect ? { location: effect.goTo, arrivee: effect.arrivee } : null;
}

function questName(id: string): string {
  return QUESTS.find((q) => q.id === id)?.name ?? id;
}

/** Structural problems in dialogue data (French), empty when valid. Used by tests on every dialogue file. */
export function dialogueProblems(d: Dialogue): string[] {
  const problems: string[] = [];
  const ids = new Set(Object.keys(d.nodes));
  const knownAttributes = new Set(ATTRIBUTES.map((a) => a.id));
  const knownSkills = new Set(SKILLS.map((s) => s.id));
  const knownQuests = new Set(QUESTS.map((q) => q.id));
  const knownRecits = new Set(RECITS.map((r) => r.id));
  // `fin` closes the conversation: a node with that name would never be shown, its effects never applied.
  if (ids.has(END)) problems.push(`nœud nommé « ${END} » : c’est la fin de la conversation`);

  const checkConditions = (where: string, conditions: Condition[] = []) => {
    for (const c of conditions) {
      if ('attribute' in c && !knownAttributes.has(c.attribute)) problems.push(`${where} : attribut inconnu ${c.attribute}`);
      if ('skill' in c && !knownSkills.has(c.skill)) problems.push(`${where} : compétence inconnue ${c.skill}`);
      if ('quest' in c && !knownQuests.has(c.quest)) problems.push(`${where} : quête inconnue ${c.quest}`);
      if ('recit' in c && !knownRecits.has(c.recit)) problems.push(`${where} : récit inconnu ${c.recit}`);
      if ('reputation' in c && !REPUTATION[c.reputation]) problems.push(`${where} : réputation inconnue ${c.reputation}`);
      if ('item' in c && !findItem(c.item)) problems.push(`${where} : objet inconnu ${c.item}`);
      if ('compagnon' in c && !findCompanion(c.compagnon)) problems.push(`${where} : compagnon inconnu ${c.compagnon}`);
      if ('avis' in c && !findCompanion(c.avis)) problems.push(`${where} : compagnon inconnu ${c.avis}`);
      if ('lieu' in c && !findLocation(c.lieu)) problems.push(`${where} : lieu inconnu ${c.lieu}`);
    }
  };
  const checkEffects = (where: string, effects: Effect[] = []) => {
    for (const e of effects) {
      const quest = 'startQuest' in e ? e.startQuest : 'completeQuest' in e ? e.completeQuest : null;
      if (quest && !knownQuests.has(quest)) problems.push(`${where} : quête inconnue ${quest}`);
      if ('learnRecit' in e && !knownRecits.has(e.learnRecit)) problems.push(`${where} : récit inconnu ${e.learnRecit}`);
      if ('giveItem' in e && !findItem(e.giveItem)) problems.push(`${where} : objet inconnu ${e.giveItem}`);
      if ('takeItem' in e && !findItem(e.takeItem)) problems.push(`${where} : objet inconnu ${e.takeItem}`);
      if ('startCombat' in e && !e.startCombat.startsWith(VOIE_FIGHT) && e.startCombat !== GOLEM_FIGHT && e.startCombat !== GOLEM_QUEST_FIGHT && !ENCOUNTERS.some((x) => x.id === e.startCombat)) problems.push(`${where} : combat inconnu ${e.startCombat}`);
      if ('goTo' in e && !findLocation(e.goTo)) problems.push(`${where} : lieu inconnu ${e.goTo}`);
      if ('lancer' in e && !POWERS.some((p) => p.id === e.lancer)) problems.push(`${where} : pouvoir inconnu ${e.lancer}`);
      if ('apprendre' in e && !knownSkills.has(e.apprendre)) problems.push(`${where} : compétence inconnue ${e.apprendre}`);
      if ('revivre' in e && !ECHOS.some((x) => x.id === e.revivre)) problems.push(`${where} : Écho inconnu ${e.revivre}`);
      if ('veillee' in e && !(veilleeData as { id: string }[]).some((v) => v.id === e.veillee)) problems.push(`${where} : veillée inconnue ${e.veillee}`);
      if ('atelier' in e && !(recetteData as { atelier: string }[]).some((r) => r.atelier === e.atelier)) problems.push(`${where} : atelier inconnu ${e.atelier}`);
      const companion = 'rejoindre' in e ? e.rejoindre : 'quitter' in e ? e.quitter : 'avis' in e ? e.avis : null;
      if (companion && !findCompanion(companion)) problems.push(`${where} : compagnon inconnu ${companion}`);
    }
  };

  for (const entry of d.entries) {
    if (!ids.has(entry.node)) problems.push(`entrée vers un nœud inconnu : ${entry.node}`);
    checkConditions(`entrée ${entry.node}`, entry.requires);
  }
  if (d.entries.length === 0 || (d.entries.at(-1)?.requires?.length ?? 0) > 0) {
    problems.push('la dernière entrée doit être sans condition (point de départ par défaut)');
  }

  for (const [id, node] of Object.entries(d.nodes)) {
    if (node.text.length > MAX_NODE_TEXT) problems.push(`${id} : texte trop long (${node.text.length} > ${MAX_NODE_TEXT})`);
    for (const [who, aside] of Object.entries(node.apartes ?? {})) {
      if (!findCompanion(who)) problems.push(`${id} : aparté d’un compagnon inconnu ${who}`);
      if (aside.length > MAX_APARTE) problems.push(`${id} : aparté de ${who} trop long (${aside.length})`);
    }
    if (node.options.length === 0) problems.push(`${id} : aucune option (impasse)`);
    if (node.options.length > MAX_OPTIONS) problems.push(`${id} : plus de ${MAX_OPTIONS} options`);
    if (!node.options.some((o) => !o.requires?.length)) problems.push(`${id} : il faut au moins une option toujours disponible`);
    checkEffects(id, node.effects);
    for (const option of node.options) {
      if (option.next !== END && !ids.has(option.next)) problems.push(`${id} : option vers un nœud inconnu ${option.next}`);
      if (option.roll) {
        if (!knownSkills.has(option.roll.skill)) problems.push(`${id} → ${option.next} : compétence inconnue ${option.roll.skill}`);
        if (!option.failNext) problems.push(`${id} → ${option.next} : jet sans suite en cas d’échec (failNext)`);
        else if (option.failNext !== END && !ids.has(option.failNext)) problems.push(`${id} : option vers un nœud inconnu ${option.failNext}`);
      } else if (option.failNext) {
        problems.push(`${id} → ${option.next} : failNext sans jet`);
      }
      checkConditions(`${id} → ${option.next}`, option.requires);
      checkEffects(`${id} → ${option.next}`, option.effects);
      if (option.raconter) {
        const r = option.raconter;
        for (const target of [r.neutre, r.touche, r.refus, ...Object.values(r.recits ?? {})]) {
          if (target && target !== END && !ids.has(target)) problems.push(`${id} : raconter vers un nœud inconnu ${target}`);
        }
        for (const recit of Object.keys(r.recits ?? {})) if (!knownRecits.has(recit)) problems.push(`${id} : raconter, récit inconnu ${recit}`);
      }
    }
  }

  // Every node must be reachable from an entry.
  const seen = new Set<string>();
  const queue = d.entries.map((e) => e.node);
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id) || !d.nodes[id]) continue;
    seen.add(id);
    for (const o of d.nodes[id].options) {
      const told = o.raconter ? [o.raconter.neutre, o.raconter.touche, o.raconter.refus, ...Object.values(o.raconter.recits ?? {})] : [];
      for (const next of [o.next, o.failNext, ...told]) if (next && next !== END) queue.push(next);
    }
  }
  for (const id of ids) if (!seen.has(id)) problems.push(`${id} : nœud inaccessible`);
  return problems;
}
