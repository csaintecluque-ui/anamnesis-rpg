import { describe, expect, it } from 'vitest';
import { DIALOGUES } from '../data/dialogues';
import { createSave, parseSave, serializeSave } from '../save/codec';
import { createNewGame } from '../state/gameState';
import { SKILL_RANK_MAX } from './attributes';
import { canRaiseSkill, characterStats, createDraft } from './character';
import { applyEffects, conditionMet, visibleOptions } from './dialogue';
import { canEquip, equip, findItem, merchantCatalogue, sell } from './inventory';
import { canCast, castOutsideCombat, combatPower, healAmount, knownPowers, powerAttack, resonanceMax, teachSkillRank } from './magic';
import { choose, testCharacter } from './questTestKit';
import { makeOverpowered } from './testTools';

/** La magie (docs/gdd/magie.md) : cristaux portés au cou, compétence Résonance, trois pouvoirs. */
const gameWith = (crystal?: string) => {
  const state = createNewGame(testCharacter());
  if (crystal) {
    state.character!.inventory.push({ itemId: crystal, count: 1 });
    expect(equip(state.character!, crystal, 'cristal')).toBe(true);
  }
  return state;
};

describe('Résonance and its points', () => {
  it('starts at rank 0 with 3 PR, is not offered at creation, and grows by one PR a rank', () => {
    const c = testCharacter();
    expect(c.skills.resonance).toBe(0);
    expect(c.resonance).toBe(3);
    expect(resonanceMax(c)).toBe(3);
    expect(canRaiseSkill(createDraft(), 'resonance')).toBe(false);
    expect(teachSkillRank(c, 'resonance')).toBe(true);
    expect([c.skills.resonance, c.resonance, resonanceMax(c)]).toEqual([1, 4, 4]);
    c.skills.resonance = SKILL_RANK_MAX;
    expect(teachSkillRank(c, 'resonance')).toBe(false);
  });
});

describe('crystals worn at the neck', () => {
  it('give their power and the Lueur; none without a crystal', () => {
    expect(knownPowers(gameWith().character!)).toEqual([]);
    expect(knownPowers(gameWith('cristal-vie').character!).map((p) => p.id)).toEqual(['guerison', 'lueur']);
    expect(knownPowers(gameWith('cristal-forge').character!).map((p) => p.id)).toEqual(['flammes', 'lueur']);
    expect(combatPower(gameWith('cristal-forge').character!)?.name).toBe('Flammes forgées');
  });

  it('only fit the crystal slot, and are sold at the canon price (ⓕ 500, 250 Fers); the lent one is not for sale', () => {
    const vie = findItem('cristal-vie')!;
    expect([canEquip(vie, 'cristal'), canEquip(vie, 'mainDroite'), canEquip(findItem('dague')!, 'cristal')]).toEqual([true, false, false]);
    expect(merchantCatalogue('sevane').find((i) => i.id === 'cristal-vie')?.price).toBe(250);
    expect(merchantCatalogue('tailleuse').map((i) => i.id)).toEqual(['cristal-forge']);
    const state = gameWith('cristal-vanel');
    expect(sell(state.character!, 'cristal-vanel')).toBe('objet-de-quete');
  });
});

describe('casting outside a fight', () => {
  it('heals the hero with Guérison naturelle for 2 PR', () => {
    const c = gameWith('cristal-vie').character!;
    c.hp = 5;
    expect(castOutsideCombat(c, 'guerison', true)).toEqual(['Guérison naturelle : −2 PR', `+${healAmount(c)} PV`]);
    expect([c.hp, c.resonance]).toEqual([10, 1]);
  });

  it('makes the nose bleed when the PR run out (3 PV a missing point), never down to 0 PV', () => {
    const c = gameWith('cristal-vie').character!;
    c.resonance = 1;
    expect(castOutsideCombat(c, 'lueur')).toEqual(['Lueur : −1 PR']);
    const hp = c.hp;
    expect(castOutsideCombat(c, 'lueur')).toEqual(['Lueur : plus de Résonance', 'Ton nez saigne : −3 PV']);
    expect(c.hp).toBe(hp - 3);
    c.hp = 3;
    expect(canCast(c, 'lueur')).toBe(false);
    expect(castOutsideCombat(c, 'lueur')).toBeNull();
    expect(canCast(gameWith().character!, 'lueur')).toBe(false);
  });

  it('gives every PR back after a night at the inn', () => {
    const state = gameWith('cristal-vie');
    state.character!.fers = 20;
    state.character!.resonance = 0;
    choose(state, 'dorna', 'servir', 'Un lit jusqu’au matin');
    expect(state.character!.resonance).toBe(resonanceMax(state.character!));
  });
});

describe('Flammes forgées in a fight', () => {
  it('strike 5 cells away for 2d6, d20 + Vigueur + rang de Résonance to hit', () => {
    const c = gameWith('cristal-forge').character!;
    c.skills.resonance = 2;
    const attack = powerAttack(c, combatPower(c)!);
    expect(attack).toMatchObject({ label: 'Flammes forgées', range: 5, damage: { count: 2, sides: 6 }, apCost: 3 });
    expect(attack.toHitBonus).toBe(c.attributes.vigor - 3 + 2);
  });
});

describe('magic in the dialogues', () => {
  it('shows a power greyed without its crystal, with its cost once worn', () => {
    const lueur = (state: ReturnType<typeof gameWith>) =>
      visibleOptions(DIALOGUES.renfoncement.nodes.mur, state).find((v) => v.option.text.startsWith('Faire luire'))!;
    expect(lueur(gameWith())).toMatchObject({ enabled: false, missing: 'Il te faut porter un cristal.', tags: ['Lueur · 1 PR'] });
    const state = gameWith('cristal-forge');
    expect(lueur(state)).toMatchObject({ enabled: true, tags: ['Lueur · 1 PR'] });
    choose(state, 'renfoncement', 'mur', 'Faire luire');
    expect(state.flags['marche-cendres-connu']).toBe(true);
    expect(state.character!.resonance).toBe(2);
  });

  it('knows whether a crystal is worn: at Ironheart, they keep lists', () => {
    const state = gameWith();
    expect(conditionMet(state, { cristal: false })).toBe(true);
    state.character!.inventory.push({ itemId: 'cristal-vie', count: 1 });
    expect(conditionMet(state, { cristal: true })).toBe(false);
    equip(state.character!, 'cristal-vie', 'cristal');
    expect(conditionMet(state, { cristal: true })).toBe(true);
    applyEffects(state, [{ apprendre: 'resonance' }]);
    expect(state.character!.skills.resonance).toBe(1);
  });
});

describe('saves, and the overpowered character', () => {
  it('give older saves the Résonance at rank 0, full PR and no crystal', () => {
    const state = gameWith('cristal-vie');
    const old = JSON.parse(serializeSave(createSave(state, new Date('2026-11-02T12:00:00Z'))));
    old.version = 10;
    delete old.state.character.resonance;
    delete old.state.character.skills.resonance;
    delete old.state.character.equipment.cristal;
    const migrated = parseSave(JSON.stringify(old));
    expect(migrated.ok).toBe(true);
    const c = migrated.ok ? migrated.value.state.character! : null;
    expect([c?.skills.resonance, c?.resonance, c?.equipment.cristal]).toEqual([0, 3, null]);
  });

  it('wear the forge crystal and carry the crystal of Vie, PR full', () => {
    const c = testCharacter();
    makeOverpowered(c);
    expect(c.equipment.cristal).toBe('cristal-forge');
    expect(c.inventory.some((s) => s.itemId === 'cristal-vie')).toBe(true);
    expect(c.resonance).toBe(resonanceMax(c));
    expect(c.hp).toBe(characterStats(c).maxHp);
  });
});
