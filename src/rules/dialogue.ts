import questData from '../data/quests.json';
import type { GameState } from '../state/gameState';
import { ATTRIBUTES, SKILLS, type AttributeId, type SkillId } from './attributes';
import { RECITS, findRecit, knowsRecit, learnRecit } from './recits';

/** Attribute and skill tests stay visible (greyed) when unmet; story conditions hide the option. */
export type Condition =
  | { attribute: AttributeId; min: number }
  | { skill: SkillId; min: number }
  | { flag: string }
  | { notFlag: string }
  | { quest: string; status: 'none' | 'active' | 'done' }
  | { recit: string };

export type Effect =
  | { setFlag: string }
  | { startQuest: string }
  | { completeQuest: string }
  | { giveXp: number }
  | { learnRecit: string }
  /** No state change: tells DialogueScene to open the Troc with this NPC instead of closing (GDD §3). */
  | { openTrade: true };

export interface DialogueOption {
  text: string;
  /** Node id, or END to close the dialogue. */
  next: string;
  requires?: Condition[];
  effects?: Effect[];
}

export interface DialogueNode {
  text: string;
  /** Applied each time the node is shown. */
  effects?: Effect[];
  options: DialogueOption[];
}

export interface Dialogue {
  id: string;
  speaker: string;
  /** First entry whose conditions hold decides where the conversation starts. */
  entries: { requires?: Condition[]; node: string }[];
  nodes: Record<string, DialogueNode>;
}

export interface QuestDef {
  id: string;
  name: string;
  summary: string;
}

export const END = 'fin';
export const QUESTS = questData as QuestDef[];
export const MAX_NODE_TEXT = 300;
export const MAX_OPTIONS = 4;

const isTest = (c: Condition): c is { attribute: AttributeId; min: number } | { skill: SkillId; min: number } =>
  'attribute' in c || 'skill' in c;

export function conditionMet(state: GameState, c: Condition): boolean {
  if ('attribute' in c) return (state.character?.attributes[c.attribute] ?? 0) >= c.min;
  if ('skill' in c) return (state.character?.skills[c.skill] ?? 0) >= c.min;
  if ('flag' in c) return state.flags[c.flag] === true;
  if ('notFlag' in c) return state.flags[c.notFlag] !== true;
  if ('recit' in c) return knowsRecit(state.character, c.recit);
  return (state.quests[c.quest] ?? 'none') === c.status;
}

/** "Perception 4", "Diplomatie 2" — shown as [tag] before the option. */
export function testLabel(c: Condition): string | null {
  if ('attribute' in c) return `${ATTRIBUTES.find((a) => a.id === c.attribute)?.name ?? c.attribute} ${c.min}`;
  if ('skill' in c) return `${SKILLS.find((s) => s.id === c.skill)?.name ?? c.skill} ${c.min}`;
  return null;
}

export interface OptionView {
  option: DialogueOption;
  enabled: boolean;
  /** Test tags such as "Perception 4", shown whether or not they are met. */
  tags: string[];
  /** What is missing, in French, when disabled. */
  missing?: string;
}

/** Visible options for the current state: hidden when a story condition fails, greyed when a test fails. */
export function visibleOptions(node: DialogueNode, state: GameState): OptionView[] {
  const views: OptionView[] = [];
  for (const option of node.options) {
    const conditions = option.requires ?? [];
    if (!conditions.filter((c) => !isTest(c)).every((c) => conditionMet(state, c))) continue;
    const tests = conditions.filter(isTest);
    const failed = tests.filter((c) => !conditionMet(state, c));
    views.push({
      option,
      enabled: failed.length === 0,
      tags: tests.map((c) => testLabel(c)!),
      missing: failed.length ? `Il te faut ${failed.map((c) => testLabel(c)).join(' et ')}.` : undefined,
    });
  }
  return views;
}

export function startNode(dialogue: Dialogue, state: GameState): string {
  const entry = dialogue.entries.find((e) => (e.requires ?? []).every((c) => conditionMet(state, c)));
  if (!entry) throw new Error(`Dialogue ${dialogue.id} has no entry for this state`);
  return entry.node;
}

/** Applies effects to the live state; returns player-facing notices (new quest, experience…). */
export function applyEffects(state: GameState, effects: Effect[] = []): string[] {
  const notices: string[] = [];
  for (const effect of effects) {
    if ('setFlag' in effect) {
      state.flags[effect.setFlag] = true;
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
    } else if ('openTrade' in effect) {
      // Handled by DialogueScene, which opens the Troc instead of closing; no state change here.
    } else if (state.character) {
      state.character.xp += effect.giveXp;
      notices.push(`+${effect.giveXp} points d’expérience`);
    }
  }
  return notices;
}

export function opensTrade(effects?: Effect[]): boolean {
  return !!effects?.some((e) => 'openTrade' in e);
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

  const checkConditions = (where: string, conditions: Condition[] = []) => {
    for (const c of conditions) {
      if ('attribute' in c && !knownAttributes.has(c.attribute)) problems.push(`${where} : attribut inconnu ${c.attribute}`);
      if ('skill' in c && !knownSkills.has(c.skill)) problems.push(`${where} : compétence inconnue ${c.skill}`);
      if ('quest' in c && !knownQuests.has(c.quest)) problems.push(`${where} : quête inconnue ${c.quest}`);
      if ('recit' in c && !knownRecits.has(c.recit)) problems.push(`${where} : récit inconnu ${c.recit}`);
    }
  };
  const checkEffects = (where: string, effects: Effect[] = []) => {
    for (const e of effects) {
      const quest = 'startQuest' in e ? e.startQuest : 'completeQuest' in e ? e.completeQuest : null;
      if (quest && !knownQuests.has(quest)) problems.push(`${where} : quête inconnue ${quest}`);
      if ('learnRecit' in e && !knownRecits.has(e.learnRecit)) problems.push(`${where} : récit inconnu ${e.learnRecit}`);
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
    if (node.options.length === 0) problems.push(`${id} : aucune option (impasse)`);
    if (node.options.length > MAX_OPTIONS) problems.push(`${id} : plus de ${MAX_OPTIONS} options`);
    if (!node.options.some((o) => !o.requires?.length)) problems.push(`${id} : il faut au moins une option toujours disponible`);
    checkEffects(id, node.effects);
    for (const option of node.options) {
      if (option.next !== END && !ids.has(option.next)) problems.push(`${id} : option vers un nœud inconnu ${option.next}`);
      checkConditions(`${id} → ${option.next}`, option.requires);
      checkEffects(`${id} → ${option.next}`, option.effects);
    }
  }

  // Every node must be reachable from an entry.
  const seen = new Set<string>();
  const queue = d.entries.map((e) => e.node);
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id) || !d.nodes[id]) continue;
    seen.add(id);
    for (const o of d.nodes[id].options) if (o.next !== END) queue.push(o.next);
  }
  for (const id of ids) if (!seen.has(id)) problems.push(`${id} : nœud inaccessible`);
  return problems;
}
