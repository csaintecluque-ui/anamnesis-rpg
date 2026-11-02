import Phaser from 'phaser';
import npcData from '../data/npcs.json';
import { THEMES, VEILLEE, findPublic, renown, tell, tellingSkill, veilleeChoices, type PublicDef, type VeilleeChoice, type VeilleeResult } from '../rules/veillees';
import { momentOf, waitUntil } from '../rules/time';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const MARGIN = 60;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panelTop: 60, titleY: 92, closeWidth: 200, closeHeight: 44, closeFont: 20, rowHeight: 54, rowFont: 20, pagerHeight: 44 }
  : { panelTop: 100, titleY: 142, closeWidth: 220, closeHeight: 64, closeFont: 24, rowHeight: 70, rowFont: 22, pagerHeight: 60 };
const TEXT_WIDTH = GAME_WIDTH - 2 * MARGIN;
const PAGER_Y = GAME_HEIGHT - 40;

/** « l’Ancien Monde » → « Ancien Monde », for the short tags of a row. */
const shortTheme = (theme: keyof typeof THEMES): string => THEMES[theme].replace(/^(les |l’)/, '');

/**
 * La veillée du conteur (docs/gdd/veillees.md) : the public of the inn and its tastes, the Récits the hero retains and
 * how each will be taken, then the evening's outcome. Opened from the innkeeper's dialogue; the map is paused below.
 */
export class VeilleeScene extends Phaser.Scene {
  private state!: GameState;
  private pub!: PublicDef;
  private layer!: Phaser.GameObjects.Container;
  private page = 0;
  private result: VeilleeResult | null = null;
  /** What pressing 1, 2, 3… does on the current view. */
  private choices: (() => void)[] = [];

  constructor() {
    super('Veillee');
  }

  create(data: { publicId: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.pub = findPublic(data.publicId)!;
    this.page = 0;
    this.result = null;

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    this.add
      .rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);
    this.add.text(MARGIN, L.titleY, `La veillée — ${this.pub.nom}`, { fontFamily: FONT_SERIF, fontSize: fontPx(28), color: CSS.copper }).setOrigin(0, 0.5);
    addTextButton(this, GAME_WIDTH - MARGIN - L.closeWidth / 2, L.titleY, withKeyHint('Partir', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.closeFont,
    });
    onKeys(this, ['ESC'], () => this.close());
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));
    onKeys(this, ['ENTER', 'SPACE'], () => {
      if (this.result) this.close();
    });

    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  private redraw(): void {
    this.layer.removeAll(true);
    this.choices = [];
    if (this.result) return this.drawResult(this.result);
    const top = LAYOUT.titleY + LAYOUT.closeHeight / 2 + 18;
    const moment = momentOf(this.state.time);
    if (moment !== 'soir') return this.drawClosed(top, moment === 'nuit');
    this.drawEvening(top);
  }

  /** Text that wraps at the panel's width; returns its bottom edge. */
  private paragraph(y: number, value: string, size: number, color: string, italic = false, width = TEXT_WIDTH, x = MARGIN): number {
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

  /** Morning, noon or night: the room is not ready; one may wait for the evening here. */
  private drawClosed(top: number, night: boolean): void {
    const host = npcData.find((n) => n.id === this.pub.hote)?.name.split(' ')[0] ?? '';
    const message = night
      ? 'La veillée est finie : les derniers dorment sur les bancs, et les lanternes baissent. Reviens demain soir.'
      : `La veillée commence le soir, quand la salle se remplit. Pour l’instant, ${host} essuie les tables.`;
    let y = this.paragraph(top + 10, message, 24, CSS.parchment);
    y = this.paragraph(y + 18, `${host} : « ${this.pub.gouts} »`, 20, CSS.muted, true);
    const button = { width: 320, height: LAYOUT.rowHeight, fontSize: LAYOUT.rowFont };
    const wait = () => {
      waitUntil(this.state.time, 'soir');
      this.redraw();
    };
    const label = night ? 'Attendre demain soir' : 'Attendre le soir';
    this.layer.add(addTextButton(this, MARGIN + button.width / 2, y + 30 + button.height / 2, `1. ${label}`, wait, button).container);
    this.layer.add(addTextButton(this, MARGIN + button.width * 1.5 + 20, y + 30 + button.height / 2, '2. Plus tard', () => this.close(), button).container);
    this.choices = [wait, () => this.close()];
  }

  /** The public, its tastes, and the Récits to choose from. */
  private drawEvening(top: number): void {
    const L = LAYOUT;
    let y = this.paragraph(top, this.pub.public, 20, CSS.muted, true);
    y = this.paragraph(y + 8, `« ${this.pub.gouts} »`, 20, CSS.parchment);
    const { name, bonus } = tellingSkill(this.state);
    const fame = renown(this.state, this.pub.id);
    const skill = `Tu racontes avec ta ${name} (${bonus < 0 ? '−' : '+'}${Math.abs(bonus)}). Renommée ici : ${fame} / ${VEILLEE.renommee}.`;
    y = this.paragraph(y + 8, skill, 18, CSS.copper);

    const choices = veilleeChoices(this.state, this.pub.id);
    const rowTop = y + 16;
    if (choices.length === 0) {
      this.paragraph(rowTop + 10, 'Tu n’as aucun Récit à raconter. Les Échos, les anciens et les livres en gardent : écoute-les, puis reviens.', 24, CSS.muted);
      return;
    }
    const perPage = Math.max(1, Math.floor((PAGER_Y - L.pagerHeight / 2 - 8 - rowTop) / L.rowHeight));
    const pages = Math.ceil(choices.length / perPage);
    this.page = Math.min(this.page, pages - 1);
    choices.slice(this.page * perPage, (this.page + 1) * perPage).forEach((choice, i) => this.drawChoice(choice, i, rowTop + i * L.rowHeight + L.rowHeight / 2));
    if (pages > 1) this.drawPager(pages);
  }

  private drawChoice(choice: VeilleeChoice, index: number, y: number): void {
    const L = LAYOUT;
    const frame = this.add
      .rectangle(GAME_WIDTH / 2, y, TEXT_WIDTH, L.rowHeight - 8, 0x2a211c)
      .setStrokeStyle(2, COLORS.copper, 0.8)
      .setInteractive({ useHandCursor: true });
    const title = this.add.text(MARGIN + 16, y, `${index + 1}. ${choice.recit.titre}`, { fontFamily: FONT_SERIF, fontSize: `${L.rowFont}px`, color: CSS.parchment }).setOrigin(0, 0.5);
    const tags = [
      ...choice.aime.map((t) => `♥ ${shortTheme(t)}`),
      ...choice.deteste.map((t) => `✗ ${shortTheme(t)}`),
      ...(choice.deja ? ['déjà racontée ici'] : []),
    ].join('   ');
    const tagColor = choice.deteste.length ? CSS.muted : CSS.copper;
    const tagText = this.add.text(GAME_WIDTH / 2 + 40, y, tags, { fontFamily: FONT_SERIF, fontSize: `${L.rowFont - 2}px`, color: tagColor, fontStyle: 'italic' }).setOrigin(0, 0.5);
    const chance = this.add
      .text(GAME_WIDTH - MARGIN - 16, y, `${Math.round(choice.chance * 100)} %`, { fontFamily: FONT_SERIF, fontSize: `${L.rowFont}px`, color: CSS.copper })
      .setOrigin(1, 0.5);
    this.layer.add([frame, title, tagText, chance]);
    const pick = () => {
      this.result = tell(this.state, this.pub.id, choice.recit.id);
      this.redraw();
    };
    frame.on('pointerover', () => title.setColor(CSS.copper));
    frame.on('pointerout', () => title.setColor(CSS.parchment));
    frame.on('pointerup', pick);
    this.choices[index] = pick;
  }

  /** « Précédents » and « Suivants », under the rows. */
  private drawPager(pages: number): void {
    const button = { width: 220, height: LAYOUT.pagerHeight, fontSize: LAYOUT.rowFont };
    const turn = (step: number) => {
      this.page = (this.page + step + pages) % pages;
      this.redraw();
    };
    this.layer.add(addTextButton(this, MARGIN + button.width / 2, PAGER_Y, '◀ Précédents', () => turn(-1), button).container);
    const where = this.add.text(GAME_WIDTH / 2, PAGER_Y, `Page ${this.page + 1} / ${pages}`, { fontFamily: FONT_SERIF, fontSize: `${LAYOUT.rowFont}px`, color: CSS.muted }).setOrigin(0.5);
    this.layer.add(where);
    this.layer.add(addTextButton(this, GAME_WIDTH - MARGIN - button.width / 2, PAGER_Y, 'Suivants ▶', () => turn(1), button).container);
  }

  /** How the evening went: the die, the room, perhaps a rumour, and what was earned. */
  private drawResult(result: VeilleeResult): void {
    let y = LAYOUT.titleY + LAYOUT.closeHeight / 2 + 22;
    y = this.paragraph(y, result.rollNotice, 20, CSS.muted, true);
    y = this.paragraph(y + 14, result.reaction, 24, CSS.parchment);
    if (result.rumeur) {
      const boxTop = y + 22;
      const heading = this.add.text(MARGIN + 20, boxTop + 14, `Plus tard, quelqu’un s’approche… · ${result.rumeur.titre}`, { fontFamily: FONT_SERIF, fontSize: fontPx(20), color: CSS.copper });
      const body = this.add.text(MARGIN + 20, heading.y + heading.height + 8, result.rumeur.texte, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(22),
        color: CSS.parchment,
        fontStyle: 'italic',
        lineSpacing: 4,
        wordWrap: { width: TEXT_WIDTH - 40 },
      });
      const bottom = body.y + body.height + 14;
      const box = this.add.rectangle(MARGIN, boxTop, TEXT_WIDTH, bottom - boxTop, 0x2a211c, 0.8).setOrigin(0, 0).setStrokeStyle(1, COLORS.copper, 0.6);
      this.layer.add([box, heading, body]);
      y = bottom;
    }
    if (result.notices.length) this.paragraph(y + 18, result.notices.join('   ·   '), 20, CSS.copper);
    const button = { width: 300, height: LAYOUT.rowHeight, fontSize: LAYOUT.rowFont };
    this.layer.add(addTextButton(this, GAME_WIDTH / 2, PAGER_Y - 6, withKeyHint('Finir la soirée', 'Entrée'), () => this.close(), button).container);
    this.choices = [() => this.close()];
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
