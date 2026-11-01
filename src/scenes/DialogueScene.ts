import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import { END, applyEffects, opensTrade, startNode, visibleOptions, type Dialogue, type OptionView } from '../rules/dialogue';
import type { GameState } from '../state/gameState';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const PANEL_TOP = 200;
const MARGIN = 60;
const OPTION_HEIGHT = 62;
const OPTION_GAP = 8;
const OPTIONS_BOTTOM = GAME_HEIGHT - 30;

/** Conversation overlay above the map (which is paused meanwhile). */
export class DialogueScene extends Phaser.Scene {
  private dialogue!: Dialogue;
  private state!: GameState;
  private layer!: Phaser.GameObjects.Container;
  private notices: string[] = [];

  constructor() {
    super('Dialogue');
  }

  create(data: { id: string }): void {
    this.dialogue = DIALOGUES[data.id];
    this.state = this.registry.get('game') as GameState;
    this.notices = [];

    // Swallows taps so nothing reaches the map or the HUD below.
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    this.add
      .rectangle(0, PANEL_TOP, GAME_WIDTH, GAME_HEIGHT - PANEL_TOP, COLORS.ink, 0.94)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);
    const npc = npcData.find((n) => n.id === this.dialogue.speaker);
    this.add.text(MARGIN, PANEL_TOP + 24, npc?.name ?? this.dialogue.speaker, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.copper });
    this.layer = this.add.container(0, 0);

    this.show(startNode(this.dialogue, this.state));
  }

  private show(nodeId: string): void {
    if (nodeId === END) return this.close();
    const node = this.dialogue.nodes[nodeId];
    this.notices.push(...applyEffects(this.state, node.effects));
    this.layer.removeAll(true);

    if (this.notices.length) {
      this.layer.add(
        this.add
          .text(GAME_WIDTH - MARGIN, PANEL_TOP + 30, this.notices.join('   ·   '), { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.copper })
          .setOrigin(1, 0),
      );
      this.notices = [];
    }

    this.layer.add(
      this.add.text(MARGIN, PANEL_TOP + 74, node.text, {
        fontFamily: FONT_SERIF,
        fontSize: '26px',
        color: CSS.parchment,
        lineSpacing: 6,
        wordWrap: { width: GAME_WIDTH - 2 * MARGIN },
      }),
    );

    const views = visibleOptions(node, this.state);
    views.forEach((view, i) => {
      const y = OPTIONS_BOTTOM - (views.length - i) * (OPTION_HEIGHT + OPTION_GAP) + OPTION_HEIGHT / 2;
      this.addOption(view, i + 1, y);
    });
  }

  private addOption(view: OptionView, index: number, y: number): void {
    const width = GAME_WIDTH - 2 * MARGIN;
    const frame = this.add
      .rectangle(GAME_WIDTH / 2, y, width, OPTION_HEIGHT, view.enabled ? 0x2a211c : 0x1f1915)
      .setStrokeStyle(2, COLORS.copper, view.enabled ? 0.8 : 0.25);
    const tags = view.tags.map((t) => `[${t}] `).join('');
    const label = `${index}. ${tags}${view.option.text}${view.enabled ? '' : `   — ${view.missing}`}`;
    const text = this.add
      .text(MARGIN + 20, y, label, {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: view.enabled ? CSS.parchment : CSS.muted,
        wordWrap: { width: width - 40 },
      })
      .setOrigin(0, 0.5);
    this.layer.add([frame, text]);
    if (!view.enabled) return;

    frame.setInteractive({ useHandCursor: true });
    frame.on('pointerover', () => text.setColor(CSS.copper));
    frame.on('pointerout', () => text.setColor(CSS.parchment));
    frame.on('pointerup', () => {
      this.notices.push(...applyEffects(this.state, view.option.effects));
      if (opensTrade(view.option.effects)) {
        this.scene.stop();
        this.scene.launch('Trade', { npcId: this.dialogue.speaker });
        return;
      }
      this.show(view.option.next);
    });
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
