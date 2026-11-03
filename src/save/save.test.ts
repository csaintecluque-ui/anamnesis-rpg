import { describe, expect, it } from 'vitest';
import {
  changeAttribute,
  changeSkill,
  createDraft,
  finalizeCharacter,
  STARTING_FERS,
  toggleOriginBonus,
  type Character,
  type CharacterDraft,
} from '../rules/character';
import { createNewGame, type GameState } from '../state/gameState';
import {
  SAVE_MAX_CHARS,
  SAVE_VERSION,
  createSave,
  exportFileName,
  formatPlayTime,
  parseSave,
  serializeSave,
} from './codec';
import { SAVE_KEY_PREFIX, SaveStore, type KeyValueStorage } from './store';

class MemoryStorage implements KeyValueStorage {
  readonly data = new Map<string, string>();
  failWrites = false;
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (this.failWrites) throw new DOMException('quota', 'QuotaExceededError');
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

const NOW = new Date('2026-11-01T14:32:00Z');

function hero(): Character {
  let d: CharacterDraft = { ...createDraft(), name: 'Aube', feat: 'tough' };
  d = changeAttribute(changeAttribute(changeAttribute(d, 'memory', 1), 'memory', 1), 'presence', 1);
  d = toggleOriginBonus(toggleOriginBonus(d, 'body'), 'vigor');
  for (const id of ['lore', 'lore', 'lore', 'diplomacy', 'diplomacy', 'stealth'] as const) d = changeSkill(d, id, 1);
  return finalizeCharacter(d);
}

const state: GameState = {
  character: hero(),
  location: 'gardebois',
  position: { col: 4, row: 7 },
  entrance: null,
  playTimeSeconds: 3725,
  flags: { 'laissez-passer': true },
  quests: { 'dernier-train': 'active' },
  encounter: null,
  time: { day: 3, phase: 2 },
  bestiaire: { 'rodeur-epine': 2 },
  groupe: [{ id: 'liane', hp: 20 }],
  avis: { liane: 2 },
  emprise: 1,
  voie: { site: 'halte-fougeres', seed: 42, depth: 2 },
  contrats: { actif: null, faits: 3, pris: ['gardebois-0-pli'] },
};

describe('save codec', () => {
  it('round-trips a game state', () => {
    const parsed = parseSave(serializeSave(createSave(state, NOW)));
    expect(parsed).toEqual({
      ok: true,
      value: { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state },
    });
  });

  it('copies the state so later changes do not leak into the save', () => {
    const live = createNewGame();
    const save = createSave(live, NOW);
    live.position.col = 9;
    expect(save.state.position.col).toBe(0);
  });

  it.each([
    ['not JSON', '{oops', 'pas une sauvegarde lisible'],
    ['JSON from elsewhere', '{"hello": 1}', 'pas une sauvegarde d’Anamnesis'],
    ['an array', '[1, 2]', 'pas une sauvegarde d’Anamnesis'],
    ['a future version', JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION + 1 }), 'version plus récente'],
    ['a bad version', JSON.stringify({ game: 'anamnesis', version: 'one' }), 'Version de sauvegarde inconnue'],
    ['a huge file', ' '.repeat(SAVE_MAX_CHARS + 1), 'trop gros'],
  ])('rejects %s with a clear French message', (_label, text, message) => {
    const parsed = parseSave(text);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });

  it.each([
    ['an unknown location', { ...state, location: 'nulle-part' }, 'lieu inconnu'],
    ['a fractional position', { ...state, position: { col: 1.5, row: 0 } }, 'position invalide'],
    ['a negative play time', { ...state, playTimeSeconds: -1 }, 'temps de jeu invalide'],
    ['a missing state', undefined, 'état de jeu absent'],
  ])('rejects a save with %s', (_label, badState, message) => {
    const text = JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state: badState });
    const parsed = parseSave(text);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });

  it('migrates a version 1 save: no character yet, test ground replaced by the Gardebois entrance', () => {
    const v1 = JSON.stringify({
      game: 'anamnesis',
      version: 1,
      savedAt: NOW.toISOString(),
      state: { location: 'iso-test', position: { col: 2, row: 5 }, playTimeSeconds: 60 },
    });
    const parsed = parseSave(v1);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.version).toBe(SAVE_VERSION);
      expect(parsed.value.state).toEqual({
        character: null,
        location: 'gardebois',
        position: { col: 0, row: 0 },
        entrance: 'entree',
        playTimeSeconds: 60,
        flags: {},
        quests: {},
        encounter: null,
        time: { day: 1, phase: 0 },
        bestiaire: {},
        groupe: [],
        avis: {},
        emprise: 0,
        voie: null,
        contrats: { actif: null, faits: 0, pris: [] },
      });
    }
  });

  it('migrates a version 2 save from the test ground, keeping the character and play time', () => {
    const v2 = JSON.stringify({
      game: 'anamnesis',
      version: 2,
      savedAt: NOW.toISOString(),
      state: { character: state.character, location: 'iso-test', position: { col: 5, row: 3 }, playTimeSeconds: 90 },
    });
    const parsed = parseSave(v2);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.state).toMatchObject({ character: state.character, location: 'gardebois', entrance: 'entree', playTimeSeconds: 90 });
    }
  });

  it('migrates a version 3 save by adding empty story flags and quests', () => {
    const { flags: _f, quests: _q, ...v3State } = state;
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: 3, savedAt: NOW.toISOString(), state: v3State }));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.value.state).toMatchObject({ flags: {}, quests: {}, position: state.position });
  });

  it('migrates a version 4 save by adding an empty list of récits to the character', () => {
    const { recits: _r, ...v4Character } = state.character!;
    const v4State = { ...state, character: v4Character };
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: 4, savedAt: NOW.toISOString(), state: v4State }));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.value.state.character).toMatchObject({ recits: [] });
  });

  it('migrates a version 5 save by giving starting funds, then the starting dagger in hand', () => {
    const { fers: _f, inventory: _i, equipment: _e, ...v5Character } = state.character!;
    const v5State = { ...state, character: v5Character };
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: 5, savedAt: NOW.toISOString(), state: v5State }));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.state.character).toMatchObject({
        fers: STARTING_FERS,
        inventory: [{ itemId: 'dague', count: 1 }],
        equipment: { mainGauche: null, mainDroite: 'dague', armure: null },
      });
    }
  });

  it('migrates a version 6 save: empty hands get the dagger, armed hands are kept', () => {
    const v6 = (character: object) =>
      parseSave(JSON.stringify({ game: 'anamnesis', version: 6, savedAt: NOW.toISOString(), state: { ...state, character } }));
    const emptyHands = v6({ ...state.character!, inventory: [{ itemId: 'corde', count: 1 }], equipment: { mainGauche: null, mainDroite: null, armure: null } });
    expect(emptyHands.ok && emptyHands.value.state.character).toMatchObject({
      inventory: [{ itemId: 'corde', count: 1 }, { itemId: 'dague', count: 1 }],
      equipment: { mainGauche: null, mainDroite: 'dague', armure: null },
    });
    const withBow = v6({ ...state.character!, inventory: [{ itemId: 'arc', count: 1 }], equipment: { mainGauche: 'arc', mainDroite: null, armure: null } });
    expect(withBow.ok && withBow.value.state.character).toMatchObject({
      // The bow comes with its arrows (version 16).
      inventory: [{ itemId: 'arc', count: 1 }, { itemId: 'fleches', count: 20 }],
      equipment: { mainGauche: 'arc', mainDroite: null, armure: null },
    });
  });

  it('migrates a version 15 save: a bow or a crossbow already owned comes with twenty arrows or bolts', () => {
    const v15 = (inventory: object[]) =>
      parseSave(JSON.stringify({ game: 'anamnesis', version: 15, savedAt: NOW.toISOString(), state: { ...state, character: { ...state.character!, inventory } } }));
    const archer = v15([{ itemId: 'arc', count: 1 }, { itemId: 'arbalete-ferros', count: 1 }, { itemId: 'carreaux', count: 5 }]);
    expect(archer.ok && archer.value.state.character!.inventory).toEqual([
      { itemId: 'arc', count: 1 },
      { itemId: 'arbalete-ferros', count: 1 },
      { itemId: 'carreaux', count: 20 },
      { itemId: 'fleches', count: 20 },
    ]);
    const swordsman = v15([{ itemId: 'dague', count: 1 }, { itemId: 'carreaux', count: 5 }]);
    expect(swordsman.ok && swordsman.value.state.character!.inventory).toEqual([{ itemId: 'dague', count: 1 }, { itemId: 'carreaux', count: 5 }]);
  });

  it('migrates a version 7 save by giving the hero the look of the first version', () => {
    const { avatar: _a, ...v7Character } = state.character!;
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: 7, savedAt: NOW.toISOString(), state: { ...state, character: v7Character } }));
    expect(parsed.ok && parsed.value.state.character).toMatchObject({ avatar: 'apprenti' });
  });

  it('rejects a character with an unknown look', () => {
    const character = { ...state.character!, avatar: 'inconnu' };
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state: { ...state, character } }));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain('apparence');
  });

  it('migrates a version 8 save: no encounter under way (docs/gdd/carte-du-monde.md)', () => {
    const { encounter: _omit, ...v8State } = state;
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: 8, savedAt: NOW.toISOString(), state: v8State }));
    expect(parsed.ok && parsed.value.state.encounter).toBeNull();
  });

  it('keeps an encounter under way, with the spot and the trip to resume', () => {
    const onTheRoad = { ...state, location: 'rencontre-route', encounter: { id: 'colporteuse', x: 600, y: 300, destination: 'canopee' } };
    const parsed = parseSave(serializeSave(createSave(onTheRoad, NOW)));
    expect(parsed.ok && parsed.value.state.encounter).toEqual(onTheRoad.encounter);
  });

  it.each([
    ['a non-true flag', { flags: { 'laissez-passer': 'oui' } }, 'repères'],
    ['an unknown quest status', { quests: { 'dernier-train': 'peut-être' } }, 'quêtes'],
    ['an unknown encounter', { encounter: { id: 'dragon', x: 1, y: 1, destination: null } }, 'rencontre'],
    ['an encounter heading to an unknown place', { encounter: { id: 'rodeurs', x: 1, y: 1, destination: 'atlantide' } }, 'rencontre'],
  ])('rejects %s', (_label, change, message) => {
    const parsed = parseSave(JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString(), state: { ...state, ...change } }));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain(message);
  });

  it('rejects a current save whose character is missing or broken', () => {
    const base = { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString() };
    const { character: _omit, ...withoutCharacter } = state;
    const missing = parseSave(JSON.stringify({ ...base, state: withoutCharacter }));
    expect(missing.ok).toBe(false);
    const broken = parseSave(JSON.stringify({ ...base, state: { ...state, character: { ...state.character, feat: 'flying' } } }));
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.error).toContain('don inconnu');
  });

  it('rejects a character whose récits are not a list of strings', () => {
    const base = { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString() };
    const broken = parseSave(JSON.stringify({ ...base, state: { ...state, character: { ...state.character, recits: 'savant-corvan' } } }));
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.error).toContain('récits invalides');
  });

  it.each([
    ['negative Fers', { fers: -1 }, 'monnaie invalide'],
    ['an inventory slot without a count', { inventory: [{ itemId: 'corde' }] }, 'inventaire invalide'],
    ['an equipment slot holding a number', { equipment: { mainGauche: 1, mainDroite: null, armure: null } }, 'équipement invalide'],
  ])('rejects a character with %s', (_label, change, message) => {
    const base = { game: 'anamnesis', version: SAVE_VERSION, savedAt: NOW.toISOString() };
    const broken = parseSave(JSON.stringify({ ...base, state: { ...state, character: { ...state.character, ...change } } }));
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.error).toContain(message);
  });

  it('rejects an invalid date', () => {
    const text = JSON.stringify({ game: 'anamnesis', version: SAVE_VERSION, savedAt: 'hier', state });
    expect(parseSave(text).ok).toBe(false);
  });

  it('names export files after the slot and the local date', () => {
    expect(exportFileName('emplacement-2', new Date(2026, 10, 1, 9, 5))).toBe(
      'anamnesis-emplacement-2-2026-11-01-0905.json',
    );
  });

  it('formats play time as hours and minutes', () => {
    expect(formatPlayTime(0)).toBe('0 h 00');
    expect(formatPlayTime(3725)).toBe('1 h 02');
  });
});

describe('SaveStore', () => {
  it('reports empty slots, then reads back what it wrote', () => {
    const store = new SaveStore(new MemoryStorage());
    expect(store.read('slot1')).toEqual({ kind: 'empty' });
    expect(store.write('slot1', state, NOW).ok).toBe(true);
    const content = store.read('slot1');
    expect(content.kind).toBe('save');
    if (content.kind === 'save') expect(content.save.state).toEqual(state);
  });

  it('keeps slots independent and removes one without touching the others', () => {
    const store = new SaveStore(new MemoryStorage());
    store.write('slot1', state, NOW);
    store.write('auto', { ...state, playTimeSeconds: 10 }, NOW);
    store.remove('slot1');
    expect(store.read('slot1').kind).toBe('empty');
    expect(store.read('auto').kind).toBe('save');
  });

  it('flags corrupted slots instead of crashing', () => {
    const storage = new MemoryStorage();
    storage.setItem(SAVE_KEY_PREFIX + 'slot2', '{broken');
    expect(new SaveStore(storage).read('slot2').kind).toBe('corrupted');
  });

  it('imports a valid exported file into any slot', () => {
    const store = new SaveStore(new MemoryStorage());
    const exported = serializeSave(createSave(state, NOW));
    expect(store.importText('slot3', exported).ok).toBe(true);
    const content = store.read('slot3');
    expect(content.kind === 'save' && content.save.state).toEqual(state);
  });

  it('never overwrites a slot with an invalid import', () => {
    const store = new SaveStore(new MemoryStorage());
    store.write('slot1', state, NOW);
    expect(store.importText('slot1', '{"hello": 1}').ok).toBe(false);
    const content = store.read('slot1');
    expect(content.kind === 'save' && content.save.state).toEqual(state);
  });

  it('turns a full storage into an error result', () => {
    const storage = new MemoryStorage();
    storage.failWrites = true;
    const result = new SaveStore(storage).write('slot1', state, NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('espace de stockage');
  });
});
