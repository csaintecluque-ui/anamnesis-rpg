import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import figurantData from '../data/figurants.json';

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
];

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
