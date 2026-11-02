import Phaser from 'phaser';
import { getSettings, saveSettings } from '../settings';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

/** Taps on the version number that toggle the hidden test mode (docs/gdd/interface.md, « Mode test »). */
const TEST_MODE_TAPS = 5;
const TEST_MODE_WINDOW_MS = 3000;

interface MenuEntry {
  label: string;
  enabled: boolean;
  action?: () => void;
}

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;

    if (this.textures.exists('illustration-titre')) {
      this.add.image(0, 0, 'illustration-titre').setOrigin(0, 0).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
      // Ink veil so the title and menu stay readable over the painting.
      this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.5).setOrigin(0, 0);
    }

    this.add
      .text(cx, 190, 'ANAMNESIS', {
        fontFamily: FONT_SERIF,
        fontSize: '84px',
        color: CSS.parchment,
        letterSpacing: 12,
      })
      .setOrigin(0.5);

    this.add.rectangle(cx, 260, 220, 1, 0xc9804f);

    const entries: MenuEntry[] = [
      {
        label: 'Nouvelle partie',
        enabled: true,
        action: () => {
          this.registry.remove('game');
          this.scene.start('Creation');
        },
      },
      { label: 'Charger', enabled: true, action: () => this.scene.start('Slots', { mode: 'load' }) },
      { label: 'Options', enabled: true, action: () => this.scene.launch('Options') },
    ];

    entries.forEach((entry, i) => {
      const text = this.add
        .text(cx, 360 + i * (HAS_MOUSE ? 64 : 82), entry.label, {
          fontFamily: FONT_SERIF,
          fontSize: HAS_MOUSE ? '34px' : '40px',
          color: entry.enabled ? CSS.parchment : CSS.muted,
        })
        .setOrigin(0.5)
        // Finger-sized hit area on touch screens (docs/gdd/interface.md).
        .setPadding(HAS_MOUSE ? 24 : 48, HAS_MOUSE ? 10 : 20, HAS_MOUSE ? 24 : 48, HAS_MOUSE ? 10 : 20);

      if (!entry.enabled) return;
      text.setInteractive({ useHandCursor: true });
      text.on('pointerover', () => text.setColor(CSS.copper));
      text.on('pointerout', () => text.setColor(CSS.parchment));
      text.on('pointerup', () => entry.action?.());
    });

    this.addVersion();
    // Dark fantasy for adults (décision de Cyril, 2026-11-02 ; docs/univers/ton.md).
    this.add
      .text(cx, GAME_HEIGHT - 26, 'Jeu pour adultes (18 ans et plus) : violence, mort et thèmes sombres.', {
        fontFamily: FONT_SERIF,
        fontSize: HAS_MOUSE ? '16px' : '20px',
        color: CSS.muted,
      })
      .setOrigin(0.5);

    // Discreet signature (CLAUDE.md §6): seal + "Anamnesis · CSC".
    this.add.image(GAME_WIDTH - 70, GAME_HEIGHT - 70, 'seal').setDisplaySize(72, 72).setAlpha(0.85);
    this.add
      .text(GAME_WIDTH - 120, GAME_HEIGHT - 70, 'Anamnesis · CSC', {
        fontFamily: FONT_SERIF,
        fontSize: '18px',
        color: CSS.muted,
      })
      .setOrigin(1, 0.5);
  }

  /** The version number, which also hides the test-mode switch: five quick taps turn it on or off. */
  private addVersion(): void {
    const label = () => `${__APP_VERSION__}${getSettings().testMode ? ' · mode test' : ''}`;
    const version = this.add
      .text(24, GAME_HEIGHT - 70, label(), { fontFamily: FONT_SERIF, fontSize: '16px', color: CSS.muted })
      .setOrigin(0, 0.5)
      .setPadding(12, 12, 12, 12)
      .setInteractive();
    let taps: number[] = [];
    version.on('pointerup', () => {
      const now = this.time.now;
      taps = [...taps.filter((t) => now - t < TEST_MODE_WINDOW_MS), now];
      if (taps.length < TEST_MODE_TAPS) return;
      taps = [];
      const settings = getSettings();
      saveSettings({ ...settings, testMode: !settings.testMode });
      version.setText(label()).setColor(getSettings().testMode ? CSS.copper : CSS.muted);
    });
    if (getSettings().testMode) version.setColor(CSS.copper);
  }
}
