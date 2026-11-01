import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import { END, applyEffects, opensTrade, performRoll, startNode, visibleOptions, type Dialogue, type OptionView } from '../rules/dialogue';
import { fontPx, textScale } from '../settings';
import type { GameState } from '../state/gameState';
import { DIGIT_KEYS, onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const MARGIN = 60;
const OPTION_MIN_HEIGHT = 62;
const OPTION_GAP = 8;
const OPTIONS_BOTTOM = GAME_HEIGHT - 30;
/** Backdrop over the map for night scenes (nodes with `night`). */
const NIGHT = 0x0a0f1e;

/** Conversation overlay above the map (which is paused meanwhile). */
export class DialogueScene extends Phaser.Scene {
  private dialogue!: Dialogue;
  private state!: GameState;
  private layer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;
  private notices: string[] = [];
  /** Result of the die just rolled, shown above the next node's text. */
  private rollNotice: string | null = null;
  /** Larger text needs more room: the panel then rises up to just under the HUD bar. */
  private panelTop = 200;
  /** What pressing 1, 2, 3… does on the current node (undefined for a greyed option). */
  private choices: ((() => void) | undefined)[] = [];

  constructor() {
    super('Dialogue');
  }

  create(data: { id: string }): void {
    this.dialogue = DIALOGUES[data.id];
    this.state = this.registry.get('game') as GameState;
    this.notices = [];
    this.rollNotice = null;
    this.panelTop = textScale() > 1 ? 112 : 200;

    // Swallows taps so nothing reaches the map or the HUD below.
    this.backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    this.add
      .rectangle(0, this.panelTop, GAME_WIDTH, GAME_HEIGHT - this.panelTop, COLORS.ink, 0.94)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);
    const npc = npcData.find((n) => n.id === this.dialogue.speaker);
    this.add.text(MARGIN, this.panelTop + 24, npc?.name ?? this.dialogue.speaker, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(28),
      color: CSS.copper,
    });
    this.layer = this.add.container(0, 0);
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));

    this.show(startNode(this.dialogue, this.state));
  }

  private show(nodeId: string): void {
    if (nodeId === END) return this.close();
    const node = this.dialogue.nodes[nodeId];
    this.notices.push(...applyEffects(this.state, node.effects));
    this.layer.removeAll(true);
    if (node.night) this.backdrop.setFillStyle(NIGHT, 0.82);
    else this.backdrop.setFillStyle(COLORS.ink, 0.45);

    if (this.notices.length) {
      this.layer.add(
        this.add
          .text(GAME_WIDTH - MARGIN, this.panelTop + 30, this.notices.join('   ·   '), {
            fontFamily: FONT_SERIF,
            fontSize: fontPx(22),
            color: CSS.copper,
          })
          .setOrigin(1, 0),
      );
      this.notices = [];
    }

    let textTop = this.panelTop + 74 * textScale();
    if (this.rollNotice) {
      const line = this.add.text(MARGIN, textTop, this.rollNotice, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(22),
        fontStyle: 'italic',
        color: CSS.muted,
      });
      this.layer.add(line);
      textTop += line.height + 10;
      this.rollNotice = null;
    }

    this.layer.add(
      this.add.text(MARGIN, textTop, node.text, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(26),
        color: CSS.parchment,
        lineSpacing: 6,
        wordWrap: { width: GAME_WIDTH - 2 * MARGIN },
      }),
    );

    // Options are stacked from the bottom, each as tall as its (possibly wrapped) text needs.
    const views = visibleOptions(node, this.state);
    this.choices = [];
    let bottom = OPTIONS_BOTTOM;
    for (let i = views.length - 1; i >= 0; i--) bottom = this.addOption(views[i], i + 1, bottom) - OPTION_GAP;
  }

  /** Draws one option whose bottom edge sits at `bottom`; returns its top edge. */
  private addOption(view: OptionView, index: number, bottom: number): number {
    const width = GAME_WIDTH - 2 * MARGIN;
    const tags = view.tags.map((t) => `[${t}] `).join('');
    const label = `${index}. ${tags}${view.option.text}${view.enabled ? '' : `   — ${view.missing}`}`;
    const text = this.add
      .text(MARGIN + 20, 0, label, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(24),
        color: view.enabled ? CSS.parchment : CSS.muted,
        wordWrap: { width: width - 40 },
      })
      .setOrigin(0, 0.5);
    const height = Math.max(OPTION_MIN_HEIGHT * textScale(), text.height + 16);
    const y = bottom - height / 2;
    text.setY(y);
    const frame = this.add
      .rectangle(GAME_WIDTH / 2, y, width, height, view.enabled ? 0x2a211c : 0x1f1915)
      .setStrokeStyle(2, COLORS.copper, view.enabled ? 0.8 : 0.25);
    this.layer.add([frame, text]);
    if (!view.enabled) return bottom - height;

    frame.setInteractive({ useHandCursor: true });
    frame.on('pointerover', () => text.setColor(CSS.copper));
    frame.on('pointerout', () => text.setColor(CSS.parchment));
    const choose = () => {
      this.notices.push(...applyEffects(this.state, view.option.effects));
      if (opensTrade(view.option.effects)) {
        this.scene.stop();
        this.scene.launch('Trade', { npcId: this.dialogue.speaker });
        return;
      }
      const roll = view.option.roll;
      if (roll) {
        const outcome = performRoll(this.state, roll);
        this.rollNotice = outcome.notice;
        this.show(outcome.success ? view.option.next : view.option.failNext!);
        return;
      }
      this.show(view.option.next);
    };
    frame.on('pointerup', choose);
    this.choices[index - 1] = choose;
    return bottom - height;
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
