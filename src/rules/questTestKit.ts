// Helpers shared by the quest tests (*.test.ts): play a dialogue choice, build a character. Not used by the game.
import { DIALOGUES } from '../data/dialogues';
import type { GameState } from '../state/gameState';
import type { AttributeId, SkillId } from './attributes';
import { createDraft, finalizeCharacter, type Character, type CharacterDraft } from './character';
import { applyEffects, visibleOptions, type DialogueOption } from './dialogue';

/** Picks the visible, enabled option starting with `text`, applies its effects and those of the node it leads to. */
export function choose(state: GameState, dialogue: string, node: string, text: string): DialogueOption {
  const view = visibleOptions(DIALOGUES[dialogue].nodes[node], state).find((v) => v.option.text.startsWith(text));
  if (!view) throw new Error(`${dialogue}/${node}: no option « ${text} »`);
  if (!view.enabled) throw new Error(`${dialogue}/${node}: option « ${text} » is greyed out`);
  applyEffects(state, view.option.effects);
  const next = DIALOGUES[dialogue].nodes[view.option.next];
  if (next?.effects) applyEffects(state, next.effects);
  return view.option;
}

/** Texts of the options shown (enabled or greyed) in a node. */
export function optionTexts(state: GameState, dialogue: string, node: string): string[] {
  return visibleOptions(DIALOGUES[dialogue].nodes[node], state).map((v) => v.option.text);
}

/** A complete level 1 character, with attributes and skill ranks changed afterwards. */
export function testCharacter(
  attributes: Partial<Record<AttributeId, number>> = {},
  skills: Partial<Record<SkillId, number>> = {},
): Character {
  const draft: CharacterDraft = {
    ...createDraft(),
    name: 'Aube',
    feat: 'tough',
    allocated: { body: 3, agility: 3, vigor: 3, intellect: 3, presence: 3, perception: 4, memory: 5 },
    originBonus: ['body', 'vigor'],
  };
  draft.skillRanks = { ...draft.skillRanks, lore: 3, stealth: 3 };
  const character = finalizeCharacter(draft);
  Object.assign(character.attributes, attributes);
  Object.assign(character.skills, skills);
  return character;
}
