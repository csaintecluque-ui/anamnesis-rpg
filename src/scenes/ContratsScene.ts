import Phaser from 'phaser';
import { abandon, accept, canTurnIn, contractStep, daysToRenewal, findTableau, offers, turnIn, type Tableau } from '../rules/contrats';
import { fontPx } from '../settings';
import type { Contrat, GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const MARGIN = 60;
const TEXT_WIDTH = GAME_WIDTH - 2 * MARGIN;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panelTop: 60, titleY: 92, closeWidth: 200, closeHeight: 44, closeFont: 20, button: { width: 190, height: 44, fontSize: 19 } }
  : { panelTop: 100, titleY: 142, closeWidth: 220, closeHeight: 64, closeFont: 24, button: { width: 210, height: 60, fontSize: 22 } };

const reward = (c: Contrat): string => `${c.fers} Fers · ${c.xp} XP`;

/**
 * Le tableau des contrats d'un relais des Gardiens (docs/gdd/voies.md) : le contrat en cours (le rendre, l'abandonner)
 * et les offres de la période (en prendre une). Opened from the board on the map, which is paused below.
 */
export class ContratsScene extends Phaser.Scene {
  private state!: GameState;
  private board!: Tableau;
  private layer!: Phaser.GameObjects.Container;
  private message = '';
  private choices: (() => void)[] = [];

  constructor() {
    super('Contrats');
  }

  create(data: { board: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.board = findTableau(data.board)!;
    this.message = '';
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    this.add
      .rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);
    const title = `Le tableau des contrats — ${this.board.nom}`;
    this.add.text(MARGIN, L.titleY, title, { fontFamily: FONT_SERIF, fontSize: fontPx(28), color: CSS.copper }).setOrigin(0, 0.5);
    addTextButton(this, GAME_WIDTH - MARGIN - L.closeWidth / 2, L.titleY, withKeyHint('Fermer', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.closeFont,
    });
    onKeys(this, ['ESC'], () => this.close());
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));
    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  private paragraph(y: number, value: string, size: number, color: string, italic = false, x = MARGIN, width = TEXT_WIDTH): number {
    const text = this.add.text(x, y, value, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(size),
      color,
      fontStyle: italic ? 'italic' : 'normal',
      lineSpacing: 4,
      wordWrap: { width },
    });
    this.layer.add(text);
    return y + text.height;
  }

  private button(x: number, y: number, label: string, action: () => void, enabled = true): void {
    this.layer.add(addTextButton(this, x, y, label, action, { ...LAYOUT.button, enabled }).container);
  }

  private redraw(): void {
    this.layer.removeAll(true);
    this.choices = [];
    const days = daysToRenewal(this.state);
    const done = this.state.contrats.faits;
    let y = LAYOUT.titleY + LAYOUT.closeHeight / 2 + 14;
    const intro = `Les Gardiens y épinglent ce qu’on leur demande. Un contrat à la fois. Le tableau change ${days === 1 ? 'demain' : `dans ${days} jours`}. Contrats remplis : ${done}.`;
    y = this.paragraph(y, intro, 19, CSS.muted, true);
    if (this.message) y = this.paragraph(y + 8, this.message, 19, CSS.copper);

    const actif = this.state.contrats.actif;
    if (actif) y = this.drawActive(actif, y + 16);
    const list = offers(this.state, this.board.id);
    y += 18;
    y = this.paragraph(y, list.length ? 'Sur le tableau' : 'Le tableau est vide pour l’instant : reviens quand il aura changé.', 20, CSS.copper);
    list.forEach((offer, i) => {
      y = this.drawOffer(offer, i, y + 10, !actif);
    });
  }

  /** The contract under way: what it asks, and its two buttons. */
  private drawActive(c: Contrat, top: number): number {
    const B = LAYOUT.button;
    const textWidth = TEXT_WIDTH - B.width - 40;
    let y = this.paragraph(top + 12, `En cours : ${c.titre} · ${reward(c)}`, 22, CSS.copper, false, MARGIN + 16, textWidth);
    y = this.paragraph(y + 4, c.texte, 19, CSS.parchment, false, MARGIN + 16, textWidth);
    y = this.paragraph(y + 4, contractStep(this.state, c), 19, CSS.muted, true, MARGIN + 16, textWidth);
    const bottom = Math.max(y + 12, top + B.height * 2 + 30);
    const box = this.add.rectangle(MARGIN, top, TEXT_WIDTH, bottom - top, 0x2a211c, 0.8).setOrigin(0, 0).setStrokeStyle(1, COLORS.copper, 0.6);
    this.layer.addAt(box, 0);
    const x = GAME_WIDTH - MARGIN - 16 - B.width / 2;
    const payable = canTurnIn(this.state, this.board.id);
    this.button(x, top + 10 + B.height / 2, 'Rendre le contrat', () => this.act(turnIn(this.state, this.board.id)), payable);
    this.button(x, top + 20 + B.height * 1.5, 'Abandonner', () => this.act(abandon(this.state)));
    return bottom;
  }

  /** An offer of the board; « Prendre » while no contract is under way. */
  private drawOffer(c: Contrat, index: number, top: number, free: boolean): number {
    const B = LAYOUT.button;
    const textWidth = TEXT_WIDTH - B.width - 40;
    let y = this.paragraph(top, `${index + 1}. ${c.titre} · ${reward(c)}`, 21, free ? CSS.parchment : CSS.muted, false, MARGIN + 16, textWidth);
    if (free) y = this.paragraph(y + 2, c.texte, 18, CSS.muted, true, MARGIN + 16, textWidth);
    const take = () => this.act(accept(this.state, c));
    this.button(GAME_WIDTH - MARGIN - 16 - B.width / 2, top + B.height / 2 - 4, 'Prendre', take, free);
    if (free) this.choices[index] = take;
    return Math.max(y, top + B.height);
  }

  private act(notices: string[]): void {
    this.message = notices.join('   ·   ');
    this.redraw();
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
