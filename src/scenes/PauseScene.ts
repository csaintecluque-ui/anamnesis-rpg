import Phaser from 'phaser';
import { addTestFers, restoreFullHp, TEST_FERS } from '../rules/testTools';
import { saveStore } from '../save/browser';
import { getSettings } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panel: 440, titleY: -170, titleSize: 30, firstY: -100, step: 62, buttonWidth: 300, buttonHeight: 52, buttonFont: 22 }
  : { panel: 620, titleY: -260, titleSize: 36, firstY: -180, step: 96, buttonWidth: 380, buttonHeight: 80, buttonFont: 26 };

/** Opened from the HUD's Menu button; the map stays frozen underneath until « Reprendre ». */
export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause');
  }

  create(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.7).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    // The hidden test mode adds a row of tools under the menu: the panel grows, and everything moves up to stay centred.
    const testMode = getSettings().testMode;
    const extra = testMode ? L.step + 24 : 0;
    const top = GAME_HEIGHT / 2 - extra / 2;
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, L.panel, L.panel + extra, COLORS.ink, 0.97)
      .setStrokeStyle(2, COLORS.copper, 0.8);
    this.add
      .text(GAME_WIDTH / 2, top + L.titleY, 'Pause', { fontFamily: FONT_SERIF, fontSize: `${L.titleSize}px`, color: CSS.copper })
      .setOrigin(0.5);

    // Options opens on top of this menu: Échap then closes Options only.
    onKeys(this, ['ESC'], () => {
      if (!this.scene.isActive('Options')) this.resumeGame();
    });

    const entries: [string, () => void][] = [
      [withKeyHint('Reprendre', 'Échap'), () => this.resumeGame()],
      [withKeyHint('Journal', 'J'), () => this.openJournal()],
      ['Sauvegarder', () => this.leaveMap('Slots', { mode: 'save', returnTo: 'Map' })],
      ['Options', () => this.scene.launch('Options')],
      ['Retour au titre', () => this.backToTitle()],
    ];
    entries.forEach(([label, action], i) => {
      addTextButton(this, GAME_WIDTH / 2, top + L.firstY + i * L.step, label, action, {
        width: L.buttonWidth,
        height: L.buttonHeight,
        fontSize: L.buttonFont,
      });
    });
    if (testMode) this.addTestTools(top + L.firstY + entries.length * L.step + 24);
  }

  /** « Mode test » (docs/gdd/interface.md): Fers and PV on demand, to try things out. */
  private addTestTools(y: number): void {
    const L = LAYOUT;
    const state = this.registry.get('game') as GameState;
    const width = (L.buttonWidth - 12) / 2;
    const note = this.add
      .text(GAME_WIDTH / 2, y - L.buttonHeight / 2 - 14, 'Mode test', { fontFamily: FONT_SERIF, fontSize: '16px', color: CSS.copper })
      .setOrigin(0.5);
    const button = { width, height: L.buttonHeight, fontSize: L.buttonFont - 2 };
    addTextButton(this, GAME_WIDTH / 2 - width / 2 - 6, y, `+${TEST_FERS} Fers`, () => {
      if (!state.character) return;
      addTestFers(state.character);
      note.setText(`Mode test : ${state.character.fers} Fers`);
    }, button);
    addTextButton(this, GAME_WIDTH / 2 + width / 2 + 6, y, 'PV au max', () => {
      if (!state.character) return;
      const restored = restoreFullHp(state.character);
      note.setText(`Mode test : +${restored} PV`);
    }, button);
  }

  /** The journal resumes the map when it closes, so the pause menu goes first. */
  private openJournal(): void {
    this.scene.stop();
    this.scene.launch('Journal');
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
