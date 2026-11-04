import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import { QUESTS } from './dialogue';
import figurantData from '../data/figurants.json';
import barkData from '../data/barks.json';

/**
 * La passe d'écriture (feuille de route, chantier 5) : les tics d'écriture comptés automatiquement, dans les répliques
 * des habitants, les apartés des compagnons et les phrases des passants. « Fini quand un comptage automatique des tics
 * donne moins de 5 % des répliques. »
 */

const TICS: Record<string, RegExp> = {
  'points de suspension': /…/,
  '« Ici, on… »': /\b[Ii]ci,? on\b/,
  '« X, pas Y »': /\b\w+, pas (?:un |une |le |la |les |des |du |de |d’|l’)?\w+[.!]/,
  '« comme un… »': /\bcomme (?:un|une)\b/,
};

/** Before the pass (2026-11-03): 106 lines with « … », 15 « Ici, on », 7 « X, pas Y », 23 « comme un ». */
const BEFORE: Record<string, number> = { 'points de suspension': 106, '« Ici, on… »': 15, '« X, pas Y »': 7, '« comme un… »': 23 };

const figurants = figurantData as { lines?: string[]; reactions?: { lines: string[] }[] }[];
const LINES: string[] = [
  ...Object.values(DIALOGUES).flatMap((d) => Object.values(d.nodes).flatMap((n) => [n.text, ...Object.values(n.apartes ?? {})])),
  ...figurants.flatMap((f) => [...(f.lines ?? []), ...(f.reactions ?? []).flatMap((r) => r.lines)]),
  ...(barkData as typeof figurants).flatMap((f) => [...(f.lines ?? []), ...(f.reactions ?? []).flatMap((r) => r.lines)]),
];

describe('what the named NPCs say on their own (Cyril, 2026-11-04 : « comme dans Fallout »)', () => {
  const barks = barkData as { id: string; lines: string[]; reactions?: { lines: string[]; quest?: string; flag?: string }[] }[];
  it('are short lines of known NPCs, without a single tic', () => {
    const ids = new Set((npcData as { id: string }[]).map((n) => n.id));
    for (const b of barks) {
      expect(ids.has(b.id), b.id).toBe(true);
      for (const line of [...b.lines, ...(b.reactions ?? []).flatMap((r) => r.lines)]) {
        expect(line.length, line).toBeLessThanOrEqual(110);
        for (const [name, rx] of Object.entries(TICS)) expect(rx.test(line), `${b.id} : ${name} : ${line}`).toBe(false);
      }
    }
  });

  it('follow quests and flags that exist', () => {
    const quests = new Set(QUESTS.map((q) => q.id));
    for (const b of barks) for (const r of b.reactions ?? []) if (r.quest) expect(quests.has(r.quest), `${b.id} : ${r.quest}`).toBe(true);
  });
});

describe('the writing (feuille de route, chantier 5)', () => {
  it('has fewer than 5 % of its lines with a tic', () => {
    const marked = LINES.filter((line) => Object.values(TICS).some((rx) => rx.test(line)));
    expect(LINES.length).toBeGreaterThan(700);
    expect(marked.length / LINES.length).toBeLessThan(0.05);
  });

  it('has divided each tic by three at least', () => {
    for (const [name, rx] of Object.entries(TICS)) {
      const count = LINES.filter((line) => rx.test(line)).length;
      expect(count, name).toBeLessThanOrEqual(Math.floor(BEFORE[name] / 3));
    }
  });

  it('pays in Fers: the Nexus is only the name of the day the Surgeons opened', () => {
    for (const line of LINES) expect(line).not.toMatch(/\bNexus\b(?! :)/);
  });
});
