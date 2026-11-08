import { describe, expect, it } from 'vitest';
import { LOCATIONS } from '../state/gameState';
import { FONDS, coverScale, fondOf } from './fonds';

describe('les fonds peints sous la carte (mise en beauté)', () => {
  it('chaque lieu nommé existe, et aucun n’a deux fonds', () => {
    const seen = new Set<string>();
    for (const [id, locations] of Object.entries(FONDS)) {
      for (const location of locations) {
        expect(LOCATIONS.some((l) => l.id === location), `${id} : ${location}`).toBe(true);
        expect(seen.has(location), location).toBe(false);
        seen.add(location);
      }
    }
  });

  it('les lieux en plein air ont le leur ; les intérieurs gardent leur couleur', () => {
    expect(fondOf('aetherhaven-quai')).toBe('aetherhaven');
    expect(fondOf('bas-cendres')).toBe('nuages');
    expect(fondOf('gare-engloutie')).toBe('souterrain');
    expect(fondOf('auberge-racine')).toBeNull();
    expect(fondOf('maison-ilyane')).toBeNull();
  });

  it('le fond couvre toujours l’écran, quel que soit le zoom', () => {
    expect(coverScale(1600, 900, 1280, 720, 1)).toBeCloseTo(0.8);
    expect(coverScale(1600, 900, 1280, 720, 0.5)).toBeCloseTo(1.6);
    expect(coverScale(1600, 900, 1280, 1000, 1)).toBeCloseTo(1000 / 900);
  });
});
