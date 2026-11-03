import { describe, expect, it } from 'vitest';
import { createNewGame } from '../state/gameState';
import { characterFiche } from './fiche';
import { addItem } from './inventory';
import { testCharacter } from './questTestKit';

/** La fiche de personnage (étude du 2026-11-03, B1). */
describe('the character sheet', () => {
  const state = createNewGame(testCharacter({ presence: 6 }, { diplomacy: 3, melee: 0 }));
  const c = state.character!;
  addItem(c, 'dague', 1);
  c.equipment.mainDroite = 'dague';
  c.usure = { dague: 6 };
  c.xp = 155;
  c.level = 2;
  state.groupe = [{ id: 'liane', hp: 16 }];
  const fiche = characterFiche(state)!;

  it('shows the experience and what the next level needs', () => {
    expect(fiche.titre).toBe('Aube · niveau 2');
    expect(fiche.xp).toEqual({ now: 155, next: 300 });
  });

  it('gives each trained skill its bonus to the die and its chance on a normal test', () => {
    // Présence 6 (+3) and Diplomatie 3: +6, a d20 + 6 against 12 → 75 %.
    expect(fiche.competences.find((l) => l.label === 'Diplomatie')?.value).toBe('rang 3 · +6 au dé · 75 %');
    expect(fiche.competences.some((l) => l.label === 'Mêlée')).toBe(false);
  });

  it('lists the attributes with their modifier, the equipment and its wear, the companions’ PV', () => {
    expect(fiche.attributs.find((l) => l.label === 'Présence')?.value).toBe('6 (+3)');
    expect(fiche.equipement).toEqual([{ label: 'Main droite', value: 'Dague (usée : −1)' }]);
    expect(fiche.groupe).toEqual([{ label: 'Liane Sève-Claire', value: 'PV 16 / 24' }]);
  });
});
