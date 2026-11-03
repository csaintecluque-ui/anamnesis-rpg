import Phaser from 'phaser';
import { characterStats } from '../rules/character';
import { hasPendingLevelUp } from '../rules/leveling';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { withKeyHint } from '../ui/keys';
import { CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { momentOf } from '../rules/time';
import { resonanceMax, wornCrystal } from '../rules/magic';
import { Tooltip } from '../ui/tooltip';

const TOAST_MS = 4000;
/** Free band between the Menu button (left) and the Journal and Inventaire buttons (right). */
const HEADER_MAX_WIDTH = HAS_MOUSE ? 600 : 470;
/** Longest hero name shown in the status line before it is shortened. */
const NAME_MAX = HAS_MOUSE ? 20 : 12;

/** Finger-sized on touch screens; on PC a slim bar leaves the map most of the screen. */
const LAYOUT = HAS_MOUSE
  ? { barHeight: 52, titleY: 16, titleSize: 18, statusY: 37, statusSize: 16, buttonHeight: 40, buttonFont: 18, menuWidth: 150, inventoryWidth: 170, journalWidth: 140, margin: 14, levelUpY: 84, levelUpHeight: 44, levelUpWidth: 260, levelUpFont: 20 }
  : { barHeight: 100, titleY: 34, titleSize: 24, statusY: 70, statusSize: 22, buttonHeight: 76, buttonFont: 24, menuWidth: 200, inventoryWidth: 220, journalWidth: 150, margin: 20, levelUpY: 150, levelUpHeight: 64, levelUpWidth: 320, levelUpFont: 26 };

/** Fixed overlay above the map: unaffected by the map camera's zoom and scroll. */
export class HudScene extends Phaser.Scene {
  private toastText!: Phaser.GameObjects.Text;
  private toastBg!: Phaser.GameObjects.Rectangle;
  private toastTimer?: Phaser.Time.TimerEvent;
  private levelUpButton!: Phaser.GameObjects.Container;
  private statusText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private locationName = '';
  private state!: GameState;
  /** What a click would do on what the mouse is over, on the map (docs/gdd/interface.md, « PC d'abord »). */
  private tooltip!: Tooltip;

  constructor() {
    super('Hud');
  }

  create(data: { locationName?: string }): void {
    this.state = this.registry.get('game') as GameState;

    const L = LAYOUT;
    // Interactive so that taps on the bar do not fall through to the map below.
    this.add.rectangle(GAME_WIDTH / 2, L.barHeight / 2, GAME_WIDTH, L.barHeight, 0x1b1512, 0.96).setInteractive();
    this.locationName = data.locationName ?? '';
    this.titleText = this.add
      .text(GAME_WIDTH / 2, L.titleY, '', { fontFamily: FONT_SERIF, fontSize: `${L.titleSize}px`, color: CSS.parchment, align: 'center' })
      .setOrigin(0.5);
    this.statusText = this.add
      .text(GAME_WIDTH / 2, L.statusY, '', {
        fontFamily: FONT_SERIF,
        fontSize: `${L.statusSize}px`,
        color: CSS.copper,
        align: 'center',
      })
      .setOrigin(0.5);
    this.refreshStatus();

    const button = { height: L.buttonHeight, fontSize: L.buttonFont };
    addTextButton(this, L.margin + L.menuWidth / 2, L.barHeight / 2, withKeyHint('Menu', 'Échap'), () => this.openOverlay('Pause'), {
      ...button,
      width: L.menuWidth,
    });
    addTextButton(
      this,
      GAME_WIDTH - L.margin - L.inventoryWidth / 2,
      L.barHeight / 2,
      withKeyHint('Inventaire', 'I'),
      () => this.openOverlay('Trade', {}),
      { ...button, width: L.inventoryWidth },
    );
    addTextButton(
      this,
      GAME_WIDTH - L.margin - L.inventoryWidth - 10 - L.journalWidth / 2,
      L.barHeight / 2,
      withKeyHint('Journal', 'J'),
      () => this.openOverlay('Journal'),
      { ...button, width: L.journalWidth },
    );

    this.levelUpButton = addTextButton(this, GAME_WIDTH / 2, L.levelUpY, '✦ Montée de niveau !', () => this.openOverlay('LevelUp'), {
      width: L.levelUpWidth,
      height: L.levelUpHeight,
      fontSize: L.levelUpFont,
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
    this.tooltip = new Tooltip(this);
  }

  /** The map's tooltip, at (x, y) in logical screen coordinates; null hides it. */
  tip(text: string | null, x = 0, y = 0): void {
    this.tooltip?.show(text, x, y);
  }

  update(): void {
    this.levelUpButton.setVisible(hasPendingLevelUp(this.state.character!));
    this.refreshStatus();
  }

  private refreshStatus(): void {
    // The place and the moment of the day (docs/gdd/temps.md); a long name gets a smaller font to fit the band.
    const title = this.locationName ? `${this.locationName} · ${momentOf(this.state.time)}` : '';
    if (title !== this.titleText.text) {
      this.titleText.setText(title).setFontSize(LAYOUT.titleSize);
      for (let size = LAYOUT.titleSize - 1; this.titleText.width > HEADER_MAX_WIDTH && size >= 14; size--) this.titleText.setFontSize(size);
    }
    const hero = this.state.character!;
    // A long name is shortened so that PV and Fers always fit in the band (24 characters are allowed).
    const name = hero.name.length > NAME_MAX ? `${hero.name.slice(0, NAME_MAX - 1).trimEnd()}…` : hero.name;
    // With a crystal at the neck, its Points de Résonance (docs/gdd/magie.md).
    const resonance = wornCrystal(hero) ? ` · PR ${hero.resonance} / ${resonanceMax(hero)}` : '';
    const status = `${name} · PV ${hero.hp} / ${characterStats(hero).maxHp}${resonance} · niveau ${hero.level} · ${hero.fers} Fers`;
    if (status !== this.statusText.text) {
      this.statusText.setText(status).setFontSize(LAYOUT.statusSize);
      for (let size = LAYOUT.statusSize - 1; this.statusText.width > HEADER_MAX_WIDTH && size >= 12; size--) this.statusText.setFontSize(size);
    }
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
  openOverlay(key: string, data?: object): void {
    this.scene.pause('Map');
    this.scene.launch(key, data);
  }
}
