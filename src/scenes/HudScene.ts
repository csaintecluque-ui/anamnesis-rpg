import Phaser from 'phaser';
import { characterStats } from '../rules/character';
import { hasPendingLevelUp } from '../rules/leveling';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const TOAST_MS = 4000;
/** Free band between the Menu button (left) and the Inventaire button (right). */
const HEADER_MAX_WIDTH = 720;

/** Fixed overlay above the map: unaffected by the map camera's zoom and scroll. */
export class HudScene extends Phaser.Scene {
  private toastText!: Phaser.GameObjects.Text;
  private toastBg!: Phaser.GameObjects.Rectangle;
  private toastTimer?: Phaser.Time.TimerEvent;
  private levelUpButton!: Phaser.GameObjects.Container;
  private statusText!: Phaser.GameObjects.Text;
  private state!: GameState;

  constructor() {
    super('Hud');
  }

  create(data: { locationName?: string }): void {
    this.state = this.registry.get('game') as GameState;

    // Interactive so that taps on the bar do not fall through to the map below.
    this.add.rectangle(GAME_WIDTH / 2, 50, GAME_WIDTH, 100, 0x1b1512, 0.75).setInteractive();
    this.add
      .text(GAME_WIDTH / 2, 34, data.locationName ?? '', {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.parchment,
        align: 'center',
        fixedWidth: HEADER_MAX_WIDTH,
      })
      .setOrigin(0.5);
    this.statusText = this.add
      .text(GAME_WIDTH / 2, 70, '', { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.copper, align: 'center', fixedWidth: HEADER_MAX_WIDTH })
      .setOrigin(0.5);
    this.refreshStatus();

    addTextButton(this, 120, 50, 'Menu', () => this.openOverlay('Pause'), { width: 200, height: 76 });
    addTextButton(this, GAME_WIDTH - 130, 50, 'Inventaire', () => this.openOverlay('Trade', {}), { width: 220, height: 76 });

    this.levelUpButton = addTextButton(this, GAME_WIDTH / 2, 150, '✦ Montée de niveau !', () => this.openOverlay('LevelUp'), {
      width: 320,
      height: 64,
    }).container;
    this.levelUpButton.setVisible(hasPendingLevelUp(this.state.character!));

    this.toastBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, 900, 80, 0x1b1512, 0.85).setStrokeStyle(2, 0xc9804f, 0.8).setVisible(false);
    this.toastText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '', {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(24),
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: 1040 },
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  update(): void {
    this.levelUpButton.setVisible(hasPendingLevelUp(this.state.character!));
    this.refreshStatus();
  }

  private refreshStatus(): void {
    const hero = this.state.character!;
    this.statusText.setText(`${hero.name} · PV ${hero.hp} / ${characterStats(hero).maxHp} · niveau ${hero.level} · ${hero.fers} Fers`);
  }

  toast(message: string): void {
    this.toastText.setFontSize(fontPx(24)).setText(message).setVisible(true);
    this.toastBg.setVisible(true).setSize(Math.min(1100, this.toastText.width + 60), this.toastText.height + 30);
    this.toastTimer?.remove();
    this.toastTimer = this.time.delayedCall(TOAST_MS, () => {
      this.toastText.setVisible(false);
      this.toastBg.setVisible(false);
    });
  }

  /** Overlays (pause menu, inventory, level-up) freeze the map underneath; each one resumes it when it closes. */
  private openOverlay(key: string, data?: object): void {
    this.scene.pause('Map');
    this.scene.launch(key, data);
  }
}
