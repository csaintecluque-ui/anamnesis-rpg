import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import { createNewGame, type GameState } from '../state/gameState';
import { createDraft, finalizeCharacter, type CharacterDraft } from './character';
import {
  END,
  applyEffects,
  conditionMet,
  dialogueProblems,
  opensTrade,
  performRoll,
  rollChance,
  startNode,
  visibleOptions,
  type Dialogue,
  type DialogueNode,
} from './dialogue';

/** A complete level 1 character with the given Perception (3–5) and Diplomatie rank (0–3). */
function stateWith(perception: 3 | 4 | 5, diplomacy: number): GameState {
  // The 3 attribute points go to Perception first, the rest to Mémoire.
  const draft: CharacterDraft = {
    ...createDraft(),
    name: 'Aube',
    feat: 'tough',
    allocated: { body: 3, agility: 3, vigor: 3, intellect: 3, presence: 3, perception, memory: 3 + (3 - (perception - 3)) },
    originBonus: ['body', 'vigor'],
  };
  // 6 skill ranks: Diplomatie as asked, Érudition 3, the rest in Discrétion.
  draft.skillRanks = { ...draft.skillRanks, diplomacy, lore: 3, stealth: 3 - diplomacy };
  return createNewGame(finalizeCharacter(draft));
}

const node: DialogueNode = {
  text: 'Bonjour.',
  options: [
    { text: 'Toujours là.', next: END },
    { text: 'Je remarque.', next: END, requires: [{ attribute: 'perception', min: 4 }] },
    { text: 'Secret.', next: END, requires: [{ flag: 'secret' }] },
    { text: 'Convaincre.', next: END, requires: [{ skill: 'diplomacy', min: 2 }, { quest: 'dernier-train', status: 'active' }] },
  ],
};

describe('conditions', () => {
  it('reads attributes, skill ranks, flags and quests', () => {
    const s = stateWith(4, 2);
    expect(conditionMet(s, { attribute: 'perception', min: 4 })).toBe(true);
    expect(conditionMet(s, { attribute: 'perception', min: 5 })).toBe(false);
    expect(conditionMet(s, { skill: 'diplomacy', min: 2 })).toBe(true);
    expect(conditionMet(s, { flag: 'x' })).toBe(false);
    expect(conditionMet(s, { notFlag: 'x' })).toBe(true);
    expect(conditionMet(s, { quest: 'dernier-train', status: 'none' })).toBe(true);
  });
});

describe('visibleOptions', () => {
  it('greys out failed attribute tests and says what is missing', () => {
    const views = visibleOptions(node, stateWith(3, 0));
    const test = views.find((v) => v.option.text === 'Je remarque.')!;
    expect(test.enabled).toBe(false);
    expect(test.tags).toEqual(['Perception 4']);
    expect(test.missing).toBe('Il te faut Perception 4.');
  });

  it('enables the test when the attribute is high enough, still showing its tag', () => {
    const test = visibleOptions(node, stateWith(4, 0)).find((v) => v.option.text === 'Je remarque.')!;
    expect(test).toMatchObject({ enabled: true, tags: ['Perception 4'], missing: undefined });
  });

  it('hides options whose story conditions fail, whatever the tests', () => {
    const texts = visibleOptions(node, stateWith(4, 2)).map((v) => v.option.text);
    expect(texts).not.toContain('Secret.');
    expect(texts).not.toContain('Convaincre.');
  });

  it('shows a skill test once its story condition holds', () => {
    const s = stateWith(3, 1);
    s.quests['dernier-train'] = 'active';
    const view = visibleOptions(node, s).find((v) => v.option.text === 'Convaincre.')!;
    expect(view).toMatchObject({ enabled: false, tags: ['Diplomatie 2'], missing: 'Il te faut Diplomatie 2.' });
  });
});

describe('applyEffects', () => {
  it('sets flags, starts quests once, grants experience and reports it', () => {
    const s = stateWith(3, 0);
    const notices = applyEffects(s, [{ setFlag: 'vu' }, { startQuest: 'dernier-train' }, { giveXp: 25 }]);
    expect(s.flags.vu).toBe(true);
    expect(s.quests['dernier-train']).toBe('active');
    expect(s.character?.xp).toBe(25);
    expect(notices).toEqual(['Nouvelle quête : Le Dernier Train', '+25 points d’expérience']);
    expect(applyEffects(s, [{ startQuest: 'dernier-train' }])).toEqual([]);
  });
});

describe('rolled options', () => {
  // stateWith(3, 0): Agilité 3 (modifier 0) and Discrétion rank 3.
  const sneak: DialogueNode = {
    text: 'La nuit.',
    options: [
      { text: 'Se glisser.', next: 'ok', failNext: 'vu', roll: { skill: 'stealth', difficulty: 10 } },
      { text: 'Renoncer.', next: END },
    ],
  };

  it('shows the chance of success as a tag, and stays enabled', () => {
    const view = visibleOptions(sneak, stateWith(3, 0))[0];
    expect(view).toMatchObject({ enabled: true, tags: ['Discrétion 70 %'] });
    expect(rollChance(stateWith(3, 0), { skill: 'stealth', difficulty: 10 })).toBe(0.7);
  });

  it('rolls d20 + attribute modifier + rank against the difficulty, and says so', () => {
    const roll = { skill: 'stealth' as const, difficulty: 10 };
    expect(performRoll(stateWith(3, 0), roll, () => 0.3)).toEqual({
      success: true,
      notice: 'Jet de Discrétion : 7 + 3 = 10 contre 10, réussi',
    });
    expect(performRoll(stateWith(3, 0), roll, () => 0.25)).toMatchObject({ success: false });
    expect(performRoll(stateWith(3, 0), { skill: 'crafting', difficulty: 10 }, () => 0.95).notice).toBe(
      'Jet d’Artisanat : 20 + 0 = 20 contre 10, réussite critique',
    );
    expect(performRoll(stateWith(3, 0), roll, () => 0)).toEqual({
      success: false,
      notice: 'Jet de Discrétion : 1 + 3 = 4 contre 10, échec critique',
    });
  });
});

describe('dialogueProblems', () => {
  it('reports dead ends, missing nodes, unreachable nodes and unknown references', () => {
    const broken: Dialogue = {
      id: 'x',
      speaker: 'x',
      entries: [{ node: 'a' }],
      nodes: {
        a: { text: 'A', options: [{ text: '…', next: 'nulle-part' }] },
        b: { text: 'B', options: [] },
        c: { text: 'C', options: [{ text: '…', next: END, requires: [{ skill: 'magie' as never, min: 1 }] }] },
      },
    };
    const problems = dialogueProblems(broken).join('\n');
    expect(problems).toContain('nulle-part');
    expect(problems).toContain('b : aucune option');
    expect(problems).toContain('b : nœud inaccessible');
    expect(problems).toContain('compétence inconnue magie');
    expect(problems).toContain('c : il faut au moins une option toujours disponible');
  });

  it('requires a failure node for every roll, and follows it when checking reachability', () => {
    const rolled = (failNext?: string): Dialogue => ({
      id: 'x',
      speaker: 'x',
      entries: [{ node: 'a' }],
      nodes: {
        a: { text: 'A', options: [{ text: '…', next: END, failNext, roll: { skill: 'stealth', difficulty: 10 } }] },
        vu: { text: 'Vu.', options: [{ text: '…', next: END }] },
      },
    });
    expect(dialogueProblems(rolled()).join('\n')).toContain('jet sans suite en cas d’échec');
    expect(dialogueProblems(rolled('vu'))).toEqual([]);
  });
});

describe('dialogue files', () => {
  it.each(Object.values(DIALOGUES).map((d) => [d.id, d] as const))('%s is well formed', (_id, dialogue) => {
    expect(dialogueProblems(dialogue)).toEqual([]);
    expect(npcData.some((n) => n.id === dialogue.speaker)).toBe(true);
  });

  it('gives every NPC of the map a dialogue', () => {
    // The crates and Échos of a sleeping line get theirs when the level is drawn (src/rules/voies.ts, voies.test.ts).
    for (const npc of npcData.filter((n) => !n.id.startsWith('voie-'))) expect(DIALOGUES[npc.id], npc.id).toBeDefined();
  });

  it('Ilyane starts the quest, with a Perception 4 test (docs/gdd/tranche-verticale.md)', () => {
    const d = DIALOGUES.ilyane;
    const tests = Object.values(d.nodes).flatMap((n) => n.options.flatMap((o) => o.requires ?? []));
    expect(tests).toContainEqual({ attribute: 'perception', min: 4 });
    const effects = Object.values(d.nodes).flatMap((n) => [...(n.effects ?? []), ...n.options.flatMap((o) => o.effects ?? [])]);
    expect(effects).toContainEqual({ startQuest: 'dernier-train' });
    expect(startNode(d, stateWith(3, 0))).not.toBe(startNode(d, { ...stateWith(3, 0), quests: { 'dernier-train': 'active' } }));
  });

  it('Tobias gives the pass with a Diplomatie 2 test, only once the quest is active (docs/gdd/tranche-verticale.md)', () => {
    const d = DIALOGUES.tobias;
    const passOption = Object.values(d.nodes)
      .flatMap((n) => n.options)
      .find((o) => o.effects?.some((e) => 'setFlag' in e && e.setFlag === 'laissez-passer'));
    expect(passOption?.requires).toContainEqual({ skill: 'diplomacy', min: 2 });
  });

  it('gives Fers and reports them', () => {
    const s = stateWith(3, 0);
    const before = s.character!.fers;
    expect(applyEffects(s, [{ giveFers: 30 }])).toEqual(['+30 Fers']);
    expect(s.character!.fers).toBe(before + 30);
  });

  it('every resolution of Le Dernier Train pays the same reward', () => {
    const resolutions = [...Object.values(DIALOGUES.ingrid.nodes).flatMap((n) => n.options), ...Object.values(DIALOGUES.foreuse.nodes)]
      .map((o) => o.effects ?? [])
      .filter((effects) => effects.some((e) => 'completeQuest' in e));
    expect(resolutions).toHaveLength(4);
    for (const effects of resolutions) {
      expect(effects).toContainEqual({ setFlag: 'chantier-arrete' });
      expect(effects).toContainEqual({ giveXp: 70 });
      expect(effects).toContainEqual({ giveFers: 30 });
    }
  });

  it('the drill can be sabotaged at night: Discrétion then Artisanat (docs/gdd/tranche-verticale.md)', () => {
    const d = DIALOGUES.foreuse;
    const s = stateWith(3, 0);
    expect(startNode(d, s)).toBe('jour');
    expect(visibleOptions(d.nodes.jour, s).map((v) => v.option.next)).toEqual([END]);

    s.quests['dernier-train'] = 'active';
    expect(visibleOptions(d.nodes.jour, s).map((v) => v.option.next)).toEqual(['nuit', END]);
    expect(d.nodes.nuit.night).toBe(true);
    expect(d.nodes.nuit.options[0].roll).toEqual({ skill: 'stealth', difficulty: 10 });
    expect(d.nodes['au-pied'].options[0].roll).toEqual({ skill: 'crafting', difficulty: 10 });

    applyEffects(s, d.nodes.sabotee.effects);
    expect(s.quests['dernier-train']).toBe('done');
    expect(startNode(d, s)).toBe('faussee');
    expect(startNode(DIALOGUES.ingrid, s)).toBe('apres-sabotage');
  });

  it('a failed night attempt closes that path, and Ingrid knows (docs/gdd/tranche-verticale.md)', () => {
    const d = DIALOGUES.foreuse;
    for (const failure of ['repere', 'bruit']) {
      const s = stateWith(3, 0);
      s.quests['dernier-train'] = 'active';
      expect([d.nodes.nuit.options[0].failNext, d.nodes['au-pied'].options[0].failNext]).toContain(failure);
      applyEffects(s, d.nodes[failure].effects);
      expect(startNode(d, s)).toBe('gardee');
      expect(startNode(DIALOGUES.ingrid, s)).toBe('soupcon');
      expect(s.quests['dernier-train']).toBe('active');
    }
  });

  it('the crate at the Gare pays once, then stays empty', () => {
    const d = DIALOGUES['caisse-prospection'];
    const s = stateWith(3, 0);
    expect(startNode(d, s)).toBe('pleine');
    const take = d.nodes.pleine.options.find((o) => o.effects?.some((e) => 'giveFers' in e))!;
    applyEffects(s, take.effects);
    expect(startNode(d, s)).toBe('vide');
  });

  it('Tobias opens the Troc from his stall, available to everyone (docs/gdd/inventaire.md)', () => {
    const d = DIALOGUES.tobias;
    const tradeOption = Object.values(d.nodes)
      .flatMap((n) => n.options)
      .find((o) => opensTrade(o.effects));
    expect(tradeOption?.requires ?? []).toEqual([]);
  });

  it('the Écho grants the Récit du savant Corvan only with Mémoire 4, and completes the dialogue either way', () => {
    const base = stateWith(3, 0);
    const low: GameState = { ...base, character: { ...base.character!, attributes: { ...base.character!.attributes, memory: 3 } } };
    expect(startNode(DIALOGUES['echo-dernier-train'], low)).toBe('approche');
    const optionsLow = visibleOptions(DIALOGUES['echo-dernier-train'].nodes.approche, low);
    expect(optionsLow.find((v) => v.option.text === 'Entrer dans l’Écho.')).toMatchObject({ enabled: false });

    const highMemory: GameState = { ...low, character: { ...low.character!, attributes: { ...low.character!.attributes, memory: 4 } } };
    const optionsHigh = visibleOptions(DIALOGUES['echo-dernier-train'].nodes.approche, highMemory);
    const enter = optionsHigh.find((v) => v.option.text === 'Entrer dans l’Écho.')!;
    expect(enter.enabled).toBe(true);
    applyEffects(highMemory, enter.option.effects);
    const notices = applyEffects(highMemory, DIALOGUES['echo-dernier-train'].nodes.interieur.effects);
    expect(highMemory.character?.recits).toContain('savant-corvan');
    expect(notices).toEqual(['Récit retenu : Le Savant Corvan']);
  });

  it('Ingrid stops the dig for a Diplomatie 3 or Commandement 3 test, or for the Récit du savant Corvan (docs/gdd/tranche-verticale.md)', () => {
    const d = DIALOGUES.ingrid;
    const tests = Object.values(d.nodes).flatMap((n) => n.options.flatMap((o) => o.requires ?? []));
    expect(tests).toContainEqual({ skill: 'diplomacy', min: 3 });
    expect(tests).toContainEqual({ skill: 'command', min: 3 });
    expect(tests).toContainEqual({ recit: 'savant-corvan' });

    const withoutRecit = stateWith(3, 3);
    withoutRecit.quests['dernier-train'] = 'active';
    const recitOption = visibleOptions(d.nodes.cause, withoutRecit).find((v) => v.option.text.includes('savant Corvan'));
    expect(recitOption).toBeUndefined();

    const withRecit: GameState = { ...withoutRecit, character: { ...withoutRecit.character!, recits: ['savant-corvan'] } };
    const recitOptionVisible = visibleOptions(d.nodes.cause, withRecit).find((v) => v.option.text.includes('savant Corvan'));
    expect(recitOptionVisible).toMatchObject({ enabled: true });
  });
});

describe('dialogue portraits', () => {
  it('points every portrait of npcs.json to a file in public/', () => {
    const files = Object.keys(import.meta.glob('/public/portraits/*'));
    const portraits = npcData.flatMap((n) => ('portrait' in n ? [n.portrait] : []));
    expect(portraits.length).toBeGreaterThan(0);
    for (const p of portraits) expect(files, p).toContain(`/public/${p}`);
  });
});

describe('illustrations', () => {
  it('has a file in public/illustrations/ for the title screen and every illustrated node', () => {
    const files = Object.keys(import.meta.glob('/public/illustrations/*'));
    const ids = ['titre', ...Object.values(DIALOGUES).flatMap((d) => Object.values(d.nodes).flatMap((n) => (n.illustration ? [n.illustration] : [])))];
    expect(ids).toContain('echo-dernier-train');
    for (const id of ids) expect(files, id).toContain(`/public/illustrations/${id}.jpg`);
  });
});
