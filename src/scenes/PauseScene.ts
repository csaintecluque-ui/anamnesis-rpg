import Phaser from 'phaser';
import { saveStore } from '../save/browser';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

/** Opened from the HUD's Menu button; the map stays frozen underneath until « Reprendre ». */
export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause');
  }

  create(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.7).setOrigin(0, 0).setInteractive();
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 520, 520, COLORS.ink, 0.97)
      .setStrokeStyle(2, COLORS.copper, 0.8);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 200, 'Pause', { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.copper }).setOrigin(0.5);

    // Options opens on top of this menu: Échap then closes Options only.
    onKeys(this, ['ESC'], () => {
      if (!this.scene.isActive('Options')) this.resumeGame();
    });

    const entries: [string, () => void][] = [
      [withKeyHint('Reprendre', 'Échap'), () => this.resumeGame()],
      ['Sauvegarder', () => this.leaveMap('Slots', { mode: 'save', returnTo: 'Map' })],
      ['Options', () => this.scene.launch('Options')],
      ['Retour au titre', () => this.backToTitle()],
    ];
    entries.forEach(([label, action], i) => {
      addTextButton(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100 + i * 96, label, action, { width: 380, height: 80 });
    });
  }

  private resumeGame(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }

  private backToTitle(): void {
    const result = saveStore.write('auto', this.registry.get('game') as GameState);
    if (!result.ok) console.warn('Sauvegarde auto impossible :', result.error);
    this.leaveMap('Title');
  }

  /** Stopping the map also stops the HUD (MapScene's shutdown handler). */
  private leaveMap(target: string, data?: object): void {
    this.scene.stop('Map');
    this.scene.start(target, data);
  }
}
