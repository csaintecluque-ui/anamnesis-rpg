import Phaser from 'phaser';
import { formatPlayTime, type SaveFile } from '../save/codec';
import {
  exportSave,
  pickSaveFile,
  requestPersistentStorage,
  saveStore,
  storageIsPersistent,
} from '../save/browser';
import { SLOTS, type SlotContent, type SlotDef } from '../save/store';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton, type TextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { AUTO_LOCK } from '../save/autosave';

export interface SlotsSceneData {
  mode: 'load' | 'save';
  returnTo?: string;
  message?: string;
  isError?: boolean;
}

interface Action {
  label: string;
  run: () => void | Promise<void>;
  confirm?: boolean;
  width?: number;
}

const ROW_START_Y = 180;
const ROW_SPACING = 122;
const BUTTON_WIDTH = 170;
const BUTTON_GAP = 14;
const RIGHT_EDGE = GAME_WIDTH - 50;
const CONFIRM_MS = 3000;

export class SlotsScene extends Phaser.Scene {
  private params: SlotsSceneData = { mode: 'load' };

  constructor() {
    super('Slots');
  }

  init(data: SlotsSceneData): void {
    this.params = { mode: data.mode ?? 'load', returnTo: data.returnTo, message: data.message, isError: data.isError };
  }

  create(): void {
    const saving = this.params.mode === 'save';

    this.add
      .text(GAME_WIDTH / 2, 60, saving ? 'Sauvegarder la partie' : 'Charger une partie', {
        fontFamily: FONT_SERIF,
        fontSize: '40px',
        color: CSS.parchment,
      })
      .setOrigin(0.5);

    addTextButton(this, 140, 60, withKeyHint('← Retour', 'Échap'), () => this.leave(), { width: 240, height: 76, fontSize: 24 });
    onKeys(this, ['ESC'], () => this.leave());

    const slots = saving ? SLOTS.filter((s) => s.manual) : SLOTS;
    slots.forEach((slot, i) => this.drawRow(slot, ROW_START_Y + i * ROW_SPACING));

    const footer = this.params.message ?? (storageIsPersistent ? '' : 'Stockage indisponible : les sauvegardes dureront jusqu’à la fermeture du jeu.');
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 40, footer, {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: this.params.isError || !storageIsPersistent ? CSS.copper : CSS.parchment,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);
  }

  private drawRow(slot: SlotDef, y: number): void {
    const content = saveStore.read(slot.id);

    this.add.text(60, y - 22, slot.label, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0, 0.5);
    this.add
      .text(60, y + 18, describe(content), {
        fontFamily: FONT_SERIF,
        // 22 game px ≈ 12 css px on a landscape phone, the smallest comfortable size.
        fontSize: '22px',
        color: content.kind === 'corrupted' ? CSS.copper : CSS.muted,
        wordWrap: { width: 430 },
      })
      .setOrigin(0, 0.5);

    let x = RIGHT_EDGE;
    for (const action of this.actionsFor(slot, content).reverse()) {
      const width = action.width ?? BUTTON_WIDTH;
      x -= width / 2;
      this.addAction(x, y, action);
      x -= width / 2 + BUTTON_GAP;
    }
  }

  private actionsFor(slot: SlotDef, content: SlotContent): Action[] {
    if (this.params.mode === 'save') {
      return [{ label: 'Sauvegarder ici', width: 260, confirm: content.kind !== 'empty', run: () => this.saveInto(slot) }];
    }
    const actions: Action[] = [];
    if (content.kind === 'save') {
      const save = content.save;
      actions.push({ label: 'Charger', run: () => this.loadSave(save) });
      actions.push({ label: 'Exporter', run: () => this.exportSlot(save, slot) });
    }
    actions.push({ label: 'Importer', confirm: content.kind !== 'empty', run: () => this.importInto(slot) });
    if (content.kind !== 'empty') actions.push({ label: 'Supprimer', confirm: true, run: () => this.remove(slot) });
    return actions;
  }

  private addAction(x: number, y: number, action: Action): void {
    let armed = false;
    let timer: Phaser.Time.TimerEvent | undefined;
    const button: TextButton = addTextButton(
      this,
      x,
      y,
      action.label,
      () => {
        if (action.confirm && !armed) {
          armed = true;
          button.setLabel('Confirmer ?');
          timer = this.time.delayedCall(CONFIRM_MS, () => {
            armed = false;
            button.setLabel(action.label);
          });
          return;
        }
        timer?.remove();
        void action.run();
      },
      { width: action.width ?? BUTTON_WIDTH, height: 80, fontSize: 24 },
    );
  }

  private loadSave(save: SaveFile): void {
    const location = findLocation(save.state.location);
    if (!location) return this.refresh('Lieu inconnu dans cette sauvegarde.', true);
    const state = structuredClone(save.state);
    if (!state.character) {
      // Saved before character creation existed: create the character, then resume this save.
      this.scene.start('Creation', { resume: state, message: 'Cette sauvegarde n’a pas encore de personnage : crée-le pour reprendre.' });
      return;
    }
    this.registry.set('game', state);
    // The auto save keeps the game it held until this one moves on (src/save/autosave.ts).
    this.registry.set(AUTO_LOCK, true);
    this.scene.start(location.scene);
  }

  private saveInto(slot: SlotDef): void {
    const state = this.registry.get('game') as GameState | undefined;
    if (!state) return this.refresh('Aucune partie en cours à sauvegarder.', true);
    const result = saveStore.write(slot.id, state);
    if (!result.ok) return this.refresh(result.error, true);
    requestPersistentStorage();
    this.refresh(`Partie sauvegardée dans « ${slot.label} ».`);
  }

  private async exportSlot(save: SaveFile, slot: SlotDef): Promise<void> {
    try {
      await exportSave(save, slot);
      this.refresh(`Fichier de « ${slot.label} » prêt.`);
    } catch {
      this.refresh('L’export a échoué.', true);
    }
  }

  private async importInto(slot: SlotDef): Promise<void> {
    const picked = await pickSaveFile();
    if (picked.kind === 'cancelled') return;
    if (picked.kind === 'too-big') return this.refresh('Ce fichier est trop gros pour être une sauvegarde.', true);
    if (picked.kind === 'unreadable') return this.refresh('Impossible de lire ce fichier.', true);
    const result = saveStore.importText(slot.id, picked.text);
    if (!result.ok) return this.refresh(result.error, true);
    requestPersistentStorage();
    this.refresh(`Sauvegarde importée dans « ${slot.label} ».`);
  }

  private remove(slot: SlotDef): void {
    saveStore.remove(slot.id);
    this.refresh(`« ${slot.label} » est vide.`);
  }

  private refresh(message: string, isError = false): void {
    this.scene.restart({ ...this.params, message, isError });
  }

  private leave(): void {
    this.scene.start(this.params.mode === 'save' ? (this.params.returnTo ?? 'Title') : 'Title');
  }
}

function describe(content: SlotContent): string {
  if (content.kind === 'empty') return 'Vide';
  if (content.kind === 'corrupted') return `Fichier illisible — ${content.error}`;
  const { savedAt, state } = content.save;
  const date = new Date(savedAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  const place = findLocation(state.location)?.name ?? '?';
  return `${date} · ${place} · ${formatPlayTime(state.playTimeSeconds)}`;
}
