import Phaser from 'phaser';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from './theme';
import { HAS_MOUSE } from './viewport';

/**
 * Infobulle au survol (feuille de route, chantier 0 : « PC d'abord », docs/gdd/interface.md) : a short framed text
 * next to the mouse, in the scene's logical 1280 × 720 coordinates. Nothing on touch screens, where nothing hovers.
 */
export class Tooltip {
  private readonly text: Phaser.GameObjects.Text;
  private readonly frame: Phaser.GameObjects.Rectangle;
  private shown = '';

  constructor(scene: Phaser.Scene, depth = 100_000) {
    this.frame = scene.add.rectangle(0, 0, 10, 10, COLORS.ink, 0.94).setStrokeStyle(1, COLORS.copper, 0.9).setOrigin(0, 0).setDepth(depth).setVisible(false);
    this.text = scene.add
      .text(0, 0, '', { fontFamily: FONT_SERIF, fontSize: '17px', color: CSS.parchment, lineSpacing: 3, wordWrap: { width: 380 } })
      .setDepth(depth + 1)
      .setVisible(false);
  }

  /** Shows `value` near (x, y), kept inside the screen; `null` or an empty text hides it. */
  show(value: string | null, x: number, y: number): void {
    if (!HAS_MOUSE || !value) return this.hide();
    if (value !== this.shown) {
      this.text.setText(value);
      this.shown = value;
    }
    const w = this.text.width + 16;
    const h = this.text.height + 10;
    const left = Math.min(GAME_WIDTH - w - 6, x + 18);
    const top = y + 22 + h > GAME_HEIGHT - 6 ? y - h - 12 : y + 22;
    this.frame.setPosition(left, top).setSize(w, h).setVisible(true);
    this.text.setPosition(left + 8, top + 5).setVisible(true);
  }

  hide(): void {
    this.shown = '';
    this.frame.setVisible(false);
    this.text.setVisible(false);
  }
}
