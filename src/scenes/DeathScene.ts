import Phaser from 'phaser';
import { saveStore } from '../save/browser';
import { findLocation } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { formatDate } from '../rules/time';

export interface DeathSceneData {
  /** The hero's name, and how the fight ended. */
  name: string;
  cause: string;
}

/**
 * The hero is dead (décision de Cyril, 2026-11-02 : « je suis d'accord sur la mort » ; docs/univers/ton.md). The game
 * saves at every place, so the last save is never far: resume there, or go back to the title.
 */
export class DeathScene extends Phaser.Scene {
  constructor() {
    super('Death');
  }

  create(data: DeathSceneData): void {
    const cx = GAME_WIDTH / 2;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 1).setOrigin(0, 0);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x5a0c0c, 0.25).setOrigin(0, 0);
    this.add
      .text(cx, 170, `Ici s’arrête le voyage ${/^[aeiouyàâéèêëîïôûüh]/i.test(data.name) ? 'd’' : 'de '}${data.name}.`, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '40px' : '46px', color: CSS.parchment, align: 'center', wordWrap: { width: 1100 } })
      .setOrigin(0.5);
    this.add
      .text(cx, 250, data.cause, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '22px' : '28px', color: CSS.muted, align: 'center', wordWrap: { width: 1000 } })
      .setOrigin(0.5);

    const save = saveStore.latest();
    const button = { width: HAS_MOUSE ? 520 : 640, height: HAS_MOUSE ? 64 : 84, fontSize: HAS_MOUSE ? 24 : 30 };
    if (save) {
      const place = findLocation(save.state.location)?.name ?? '';
      const when = save.state.time ? `, ${formatDate(save.state.time)}` : '';
      this.add
        .text(cx, 360, `Dernière sauvegarde : ${place}${when}.`, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '20px' : '24px', color: CSS.copper, align: 'center', wordWrap: { width: 1100 } })
        .setOrigin(0.5);
      const resume = () => {
        const location = findLocation(save.state.location);
        if (!location || !save.state.character) return this.scene.start('Title');
        this.registry.set('game', structuredClone(save.state));
        this.scene.start(location.scene);
      };
      addTextButton(this, cx, 450, withKeyHint('Reprendre à la dernière sauvegarde', 'Entrée'), resume, button);
      onKeys(this, ['ENTER', 'SPACE'], resume);
    }
    addTextButton(this, cx, save ? 560 : 450, withKeyHint('Retour au titre', 'Échap'), () => this.scene.start('Title'), button);
    onKeys(this, ['ESC'], () => this.scene.start('Title'));
  }
}
