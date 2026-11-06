import Phaser from 'phaser';
import { addTestFers, restoreFullHp, TEST_FERS } from '../rules/testTools';
import { openDevPanel } from '../ui/devPanel';
import { getSettings } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { beginNightAttack, nightAttack, restRefusal, restUntilMorning } from '../rules/repos';
import { PENDING_NIGHT_ATTACK, PENDING_NOTICE, type HudScene } from './HudScene';
import { writeAuto } from '../save/autosave';

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panel: 440, titleY: -170, titleSize: 30, firstY: -100, step: 62, buttonWidth: 300, buttonHeight: 52, buttonFont: 22 }
  : { panel: 600, titleY: -250, titleSize: 36, firstY: -170, step: 88, buttonWidth: 380, buttonHeight: 76, buttonFont: 26 };

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
    // One more line than before: « Se reposer » (étude du 2026-11-03, G2).
    const extra = (testMode ? L.step + 24 : 0) + L.step;
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
      ['Se reposer jusqu’au matin', () => this.rest()],
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
    // Three tools on one row, across the panel.
    const width = (L.panel - 60) / 3;
    const note = this.add
      .text(GAME_WIDTH / 2, y - L.buttonHeight / 2 - 14, 'Mode test', { fontFamily: FONT_SERIF, fontSize: '16px', color: CSS.copper })
      .setOrigin(0.5);
    const button = { width, height: L.buttonHeight, fontSize: L.buttonFont - (HAS_MOUSE ? 4 : 2) };
    addTextButton(this, GAME_WIDTH / 2 - width - 10, y, `+${TEST_FERS} Fers`, () => {
      if (!state.character) return;
      addTestFers(state.character);
      note.setText(`Mode test : ${state.character.fers} Fers`);
    }, button);
    addTextButton(this, GAME_WIDTH / 2, y, 'PV au max', () => {
      if (!state.character) return;
      const restored = restoreFullHp(state.character);
      note.setText(`Mode test : +${restored} PV`);
    }, button);
    // « Mode développeur » : the HTML panel; the map is rebuilt with the new state when it closes.
    addTextButton(this, GAME_WIDTH / 2 + width + 10, y, 'Outils de dev', () => this.openDevTools(state), button);
  }

  private openDevTools(state: GameState): void {
    const game = this.game;
    this.scene.stop();
    openDevPanel(state, (result) => {
      if (result.goTo) {
        state.location = result.goTo.location;
        state.entrance = result.goTo.entrance;
      } else {
        state.entrance = null; // back where the hero stood
      }
      game.scene.stop('Map');
      game.scene.start('Map');
    });
  }

  /**
   * A free night where the hero stands, the PV raised to half, one a day (src/rules/repos.ts); refused under the
   * ground and on the road. Outside the towns, something may come in the night: the map is rebuilt for the night, and
   * the fight starts there. Otherwise it is rebuilt for the morning.
   */
  private rest(): void {
    const state = this.registry.get('game') as GameState;
    const refusal = restRefusal(state);
    if (refusal) {
      this.resumeGame();
      (this.scene.get('Hud') as HudScene).toast(refusal);
      return;
    }
    const attack = nightAttack(state);
    if (attack) {
      this.registry.set(PENDING_NIGHT_ATTACK, attack);
      this.registry.set(PENDING_NOTICE, beginNightAttack(state));
    } else this.registry.set(PENDING_NOTICE, restUntilMorning(state));
    state.entrance = null; // back where the hero stood
    this.leaveMap('Map');
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
    writeAuto(this.registry, this.registry.get('game') as GameState, 'rafraichir');
    this.leaveMap('Title');
  }

  /** Stopping the map also stops the HUD (MapScene's shutdown handler). */
  private leaveMap(target: string, data?: object): void {
    this.scene.stop('Map');
    this.scene.start(target, data);
  }
}
