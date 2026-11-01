import Phaser from 'phaser';
import { characterStats } from '../rules/character';
import { saveStore } from '../save/browser';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const TOAST_MS = 4000;

/** Fixed overlay above the map: unaffected by the map camera's zoom and scroll. */
export class HudScene extends Phaser.Scene {
  private toastText!: Phaser.GameObjects.Text;
  private toastBg!: Phaser.GameObjects.Rectangle;
  private toastTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('Hud');
  }

  create(data: { locationName?: string }): void {
    const state = this.registry.get('game') as GameState;
    const hero = state.character!;

    // Interactive so that taps on the bar do not fall through to the map below.
    this.add.rectangle(GAME_WIDTH / 2, 50, GAME_WIDTH, 100, 0x1b1512, 0.75).setInteractive();
    this.add
      .text(GAME_WIDTH / 2, 34, data.locationName ?? '', { fontFamily: FONT_SERIF, fontSize: '24px', color: CSS.parchment })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 70, `${hero.name} · PV ${hero.hp} / ${characterStats(hero).maxHp} · niveau ${hero.level}`, {
        fontFamily: FONT_SERIF,
        fontSize: '22px',
        color: CSS.copper,
      })
      .setOrigin(0.5);

    addTextButton(this, 120, 50, '← Titre', () => this.backToTitle(), { width: 200, height: 76 });
    addTextButton(this, GAME_WIDTH - 140, 50, 'Sauvegarder', () => this.leaveMap('Slots', { mode: 'save', returnTo: 'Map' }), {
      width: 240,
      height: 76,
    });
    addTextButton(this, GAME_WIDTH - 400, 50, 'Inventaire', () => this.openInventory(), { width: 220, height: 76 });

    this.toastBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 900, 80, 0x1b1512, 0.85).setStrokeStyle(2, 0xc9804f, 0.8).setVisible(false);
    this.toastText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '', {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: 860 },
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  toast(message: string): void {
    this.toastText.setText(message).setVisible(true);
    this.toastBg.setVisible(true).setSize(Math.min(1100, this.toastText.width + 60), this.toastText.height + 30);
    this.toastTimer?.remove();
    this.toastTimer = this.time.delayedCall(TOAST_MS, () => {
      this.toastText.setVisible(false);
      this.toastBg.setVisible(false);
    });
  }

  private openInventory(): void {
    this.scene.pause('Map');
    this.scene.launch('Trade', {});
  }

  private backToTitle(): void {
    const result = saveStore.write('auto', this.registry.get('game') as GameState);
    if (!result.ok) console.warn('Sauvegarde auto impossible :', result.error);
    this.leaveMap('Title');
  }

  private leaveMap(target: string, data?: object): void {
    this.scene.stop('Map');
    this.scene.start(target, data);
  }
}
