import { describe, expect, it } from 'vitest';
import { ITEMS, findItem } from './inventory';
import { CATEGORIES, categoryOf, itemUses, itemValue, itemsOf } from './objets';

/** Le sac rangé (docs/gdd/inventaire.md) : des onglets, et à quoi sert chaque objet. */
const item = (id: string) => findItem(id)!;

describe('the tabs of the bag', () => {
  it('give every item one tab, and no tab stays empty', () => {
    for (const c of CATEGORIES) expect(itemsOf(ITEMS, c.id).length, c.id).toBeGreaterThan(0);
    expect(CATEGORIES.flatMap((c) => itemsOf(ITEMS, c.id)).length).toBe(ITEMS.length);
  });

  it('sort what is worn, care, the workshops’ matter and what is carried for someone', () => {
    expect(['epee-longue', 'armure-cuir', 'cristal-vie', 'cristal-vanel'].map((id) => categoryOf(item(id)))).toEqual(['equipement', 'equipement', 'equipement', 'equipement']);
    expect(['bandage', 'seve-resonance'].map((id) => categoryOf(item(id)))).toEqual(['remedes', 'remedes']);
    expect(['crocs-rouille', 'coeur-ferraille', 'eclats-cristal'].map((id) => categoryOf(item(id)))).toEqual(['matieres', 'matieres', 'matieres']);
    expect(['cle-rouille-bleue', 'pli-scelle'].map((id) => categoryOf(item(id)))).toEqual(['quete', 'quete']);
    expect(['corde', 'lampe-cristal'].map((id) => categoryOf(item(id)))).toEqual(['divers', 'divers']);
  });
});

describe('what an item is good for', () => {
  it('says the damage of a weapon, the Défense of an armour, the powers of a crystal', () => {
    expect(itemUses(item('epee-longue'))).toEqual([
      'Arme de corps à corps : 1d8 de dégâts (Mêlée).',
      'Entre dans Épée trempée : la forge de Ragna, à Ironheart.',
    ]);
    expect(itemUses(item('arbalete-ferros'))[0]).toMatch(/^Arme de tir, portée 6 : 1d10 de dégâts/);
    expect(itemUses(item('cuirasse-rivetee'))[0]).toBe('Armure : +3 en Défense, en route comme en combat.');
    expect(itemUses(item('cristal-forge'))[0]).toBe('Se porte au cou : Flammes forgées et la Lueur, avec des Points de Résonance.');
  });

  it('says what care gives back, and where a matter is used or a piece is made', () => {
    expect(itemUses(item('bandage'))).toEqual(['Soigne 8 points de vie, plus 2 par point de Médecine, hors combat (bouton « Utiliser »).', 'Se fabrique : les herbes de Sévane, à Canopéa.']);
    expect(itemUses(item('seve-resonance'))[0]).toMatch(/^Rend 3 Points de Résonance/);
    expect(itemUses(item('crocs-rouille'))).toEqual(['Entre dans Épée trempée, Armure de cuir clouté : la forge de Ragna, à Ironheart.']);
    expect(itemUses(item('cle-rouille-bleue'))).toEqual(['Objet de quête : on le porte pour quelqu’un, il ne se vend pas.']);
  });

  it('gives weight and value, never a price for a quest item', () => {
    expect(itemValue(item('epee-longue'))).toBe('3 kg · vaut 35 Fers, se vend 17');
    expect(itemValue(item('cle-rouille-bleue'))).not.toMatch(/Fers/);
  });

  it('keeps the lines of lore short', () => {
    const lore = ITEMS.filter((i) => i.lore);
    expect(lore.length).toBeGreaterThanOrEqual(10);
    for (const i of lore) expect(i.lore!.length, i.id).toBeLessThanOrEqual(140);
  });
});

describe('arrows, bolts and the lamp (docs/gdd/combat.md, docs/gdd/voies.md)', () => {
  it('say what shoots what, and what the lamp is for', () => {
    expect(itemUses(item('arc'))[1]).toBe('Tire des flèches : une par tir ; après un combat gagné, on en ramasse la moitié.');
    expect(itemUses(item('fleches'))[0]).toMatch(/^Munitions : Arc\./);
    expect(itemUses(item('carreaux'))[0]).toMatch(/^Munitions : Arbalète de Ferros\./);
    expect(['fleches', 'carreaux'].map((id) => categoryOf(item(id)))).toEqual(['equipement', 'equipement']);
    expect(itemUses(item('lampe-cristal'))[0]).toMatch(/voies endormies.*pièges à deux pas/);
  });
});
