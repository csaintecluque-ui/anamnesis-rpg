import Phaser from 'phaser';
import { playSfx } from '../audio/sfx';
import type { Effect } from '../rules/dialogue';
import { DIALOGUES } from '../data/dialogues';
import npcData from '../data/npcs.json';
import { END, applyEffects, expireFlags, goesTo, nodeApartes, opensAtelier, opensTrade, opensVeillee, raconterChoices, raconterOption, rollOption, startNode, startsCombat, visibleOptions, type Dialogue, type DialogueOption, type NodePlace, type OptionView } from '../rules/dialogue';
import { fontPx, textScale } from '../settings';
import type { GameState } from '../state/gameState';
import type { MapScene } from './MapScene';
import { DIGIT_KEYS, onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { optionHint } from '../rules/hints';
import { Tooltip } from '../ui/tooltip';
import { writeAuto } from '../save/autosave';

const MARGIN = 60;
/** Side of the speaker's portrait, at the top left of the panel; name and text move right of it. */
const PORTRAIT = 150;
const PORTRAIT_GAP = 24;
/** Finger-sized on touch screens (≈ 42 px on a landscape phone), compact with a mouse. */
const OPTION_MIN_HEIGHT = HAS_MOUSE ? 62 : 76;
const OPTION_GAP = 8;
const OPTIONS_BOTTOM = GAME_HEIGHT - 30;
/** Backdrop over the map for night scenes (nodes with `night`). */
const NIGHT = 0x0a0f1e;
/** Récits shown at once when the hero picks one to tell; « Autres histoires… » turns the page. */
const RACONTER_PAGE = 5;
const RACONTER_MORE = '\u0000autres-recits';

/** Panel opacity: lighter over an illustration so it shows through. */
const PANEL_ALPHA = 0.94;
const PANEL_ALPHA_OVER_ILLUSTRATION = 0.78;

/** Conversation overlay above the map (which is paused meanwhile). */
/** A night's sleep or a quest finished: the auto save is written at once (docs/gdd/temps.md ; test du 2026-11-06). */
const savesProgress = (effects?: Effect[]): boolean => !!effects?.some((e) => 'dormir' in e || 'completeQuest' in e);

export class DialogueScene extends Phaser.Scene {
  private dialogue!: Dialogue;
  /** The node shown: with the dialogue, it names the rolls made there (seeded dice, one try a day). */
  private nodeId = '';
  private state!: GameState;
  private layer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;
  /** Full-screen illustration of the current node, if it has one (`illustration`). */
  private illustration!: Phaser.GameObjects.Image;
  private panel!: Phaser.GameObjects.Rectangle;
  private notices: string[] = [];
  /** Result of the die just rolled, shown above the next node's text. */
  private rollNotice: string | null = null;
  /** Larger text needs more room: the panel then rises up to just under the HUD bar. */
  private panelTop = 200;
  /** Left edge of the name and text: after the portrait when the speaker has one. */
  private textLeft = MARGIN;
  /** Right edge of the speaker's name: the notices of what was gained go after it when they fit. */
  private nameRight = MARGIN;
  /** What pressing 1, 2, 3… does on the current node (undefined for a greyed option). */
  private choices: ((() => void) | undefined)[] = [];
  /** With a mouse: what a roll or a test of the option under it asks, and the chances. */
  private tooltip!: Tooltip;
  /** The Récit being chosen (raconter): the option that asked, and the page of Récits shown. */
  private raconter: { option: DialogueOption; page: number } | null = null;

  constructor() {
    super('Dialogue');
  }

  create(data: { id: string }): void {
    playSfx(this, 'dialogue');
    this.dialogue = DIALOGUES[data.id];
    this.state = this.registry.get('game') as GameState;
    expireFlags(this.state);
    this.notices = [];
    this.rollNotice = null;
    this.panelTop = textScale() > 1 ? 112 : 200;

    // Swallows taps so nothing reaches the map or the HUD below.
    this.backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    this.illustration = this.add.image(0, 0, '__DEFAULT').setOrigin(0, 0).setVisible(false);
    this.panel = this.add
      .rectangle(0, this.panelTop, GAME_WIDTH, GAME_HEIGHT - this.panelTop, COLORS.ink, PANEL_ALPHA)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);
    const npc = npcData.find((n) => n.id === this.dialogue.speaker);
    const portrait = `portrait-${this.dialogue.speaker}`;
    this.textLeft = MARGIN;
    if (this.textures.exists(portrait)) {
      const top = this.panelTop + 24;
      this.add.image(MARGIN, top, portrait).setOrigin(0, 0).setDisplaySize(PORTRAIT, PORTRAIT);
      this.add
        .rectangle(MARGIN, top, PORTRAIT, PORTRAIT)
        .setOrigin(0, 0)
        .setStrokeStyle(2, COLORS.copper, 0.7);
      this.textLeft = MARGIN + PORTRAIT + PORTRAIT_GAP;
    }
    const name = this.add.text(this.textLeft, this.panelTop + 24, npc?.name ?? this.dialogue.speaker, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(28),
      color: CSS.copper,
    });
    this.nameRight = name.x + name.width;
    this.layer = this.add.container(0, 0);
    this.tooltip = new Tooltip(this);
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.choices[i]?.()));
    // A node with a single way on: Enter or Space takes it (« PC d'abord »).
    onKeys(this, ['ENTER', 'SPACE'], () => {
      if (this.choices.length === 1) this.choices[0]?.();
    });

    this.show(startNode(this.dialogue, this.state));
  }

  private show(nodeId: string): void {
    if (nodeId === END) return this.close();
    this.tooltip.hide();
    if (nodeId === RACONTER_MORE && this.raconter) return this.showRaconter(this.raconter.option, this.raconter.page + 1);
    this.raconter = null;
    const node = this.dialogue.nodes[nodeId];
    this.nodeId = nodeId;
    this.notices.push(...applyEffects(this.state, node.effects));
    if (gives(node.effects)) playSfx(this, 'objet');
    if (savesProgress(node.effects)) writeAuto(this.registry, this.state, 'progres');
    this.layer.removeAll(true);
    if (node.night) this.backdrop.setFillStyle(NIGHT, 0.82);
    else this.backdrop.setFillStyle(COLORS.ink, 0.45);
    const illustration = `illustration-${node.illustration}`;
    const illustrated = node.illustration !== undefined && this.textures.exists(illustration);
    if (illustrated) this.illustration.setTexture(illustration).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.illustration.setVisible(illustrated);
    this.panel.setFillStyle(COLORS.ink, illustrated ? PANEL_ALPHA_OVER_ILLUSTRATION : PANEL_ALPHA);

    let textTop = this.panelTop + 74 * textScale();
    // What was just gained: on the name's line when it fits there, else on lines of its own under the name.
    if (this.notices.length) {
      const style = { fontFamily: FONT_SERIF, fontSize: fontPx(22), color: CSS.copper };
      const line = this.add.text(GAME_WIDTH - MARGIN, this.panelTop + 30, this.notices.join('   ·   '), style).setOrigin(1, 0);
      if (line.x - line.width < this.nameRight + 40) {
        line
          .setText(this.notices.join('  ·  '))
          .setOrigin(0, 0)
          .setPosition(this.textLeft, textTop)
          .setWordWrapWidth(GAME_WIDTH - MARGIN - this.textLeft);
        textTop += line.height + 10;
      }
      this.layer.add(line);
      this.notices = [];
    }

    if (this.rollNotice) {
      const line = this.add.text(this.textLeft, textTop, this.rollNotice, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(22),
        fontStyle: 'italic',
        color: CSS.muted,
      });
      this.layer.add(line);
      textTop += line.height + 10;
      this.rollNotice = null;
    }

    const body = this.add.text(this.textLeft, textTop, node.text, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(26),
      color: CSS.parchment,
      lineSpacing: 6,
      wordWrap: { width: GAME_WIDTH - MARGIN - this.textLeft },
    });
    this.layer.add(body);
    // What the companions say here (feuille de route, chantier 4), under the text, in copper.
    let asideTop = body.y + body.height + 14;
    for (const aside of nodeApartes(node, this.state)) {
      const line = this.add.text(this.textLeft, asideTop, aside, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(23),
        fontStyle: 'italic',
        color: CSS.copper,
        lineSpacing: 4,
        wordWrap: { width: GAME_WIDTH - MARGIN - this.textLeft },
      });
      this.layer.add(line);
      asideTop += line.height + 8;
    }

    // Options are stacked from the bottom, each as tall as its (possibly wrapped) text needs.
    const views = visibleOptions(node, this.state, this.place());
    // Every way on failed today (a roll is tried once a day): one can always leave, and come back tomorrow.
    if (views.length > 0 && views.every((v) => !v.enabled)) views.push({ option: { text: 'Revenir demain.', next: END }, index: -1, enabled: true, tags: [] });
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
    // The details of a roll or a test, on hover, even for a greyed option.
    const hint = optionHint(view, this.state);
    if (hint) {
      frame.setInteractive({ useHandCursor: view.enabled });
      frame.on('pointermove', (p: Phaser.Input.Pointer) => this.tooltip.show(hint, p.worldX, p.worldY));
      frame.on('pointerout', () => this.tooltip.hide());
    }
    if (!view.enabled) return bottom - height;

    frame.setInteractive({ useHandCursor: true });
    frame.on('pointerover', () => text.setColor(CSS.copper));
    frame.on('pointerout', () => text.setColor(CSS.parchment));
    const choose = () => {
      // Tell a Récit (feuille de route, chantier 1): first, which one.
      if (view.option.raconter) return this.showRaconter(view.option, 0);
      // An option with a roll only has its effects when the roll succeeds (a failed lie starts nothing).
      const roll = view.option.roll;
      if (roll) {
        // The die comes from a seed: reloading changes nothing ; failed for nothing, it waits for tomorrow (test du 2026-11-06).
        const outcome = rollOption(this.state, this.dialogue, this.place(), view.index);
        this.rollNotice = outcome.notice;
        if (!outcome.success) {
          this.show(view.option.failNext!);
          return;
        }
      }
      this.notices.push(...applyEffects(this.state, view.option.effects));
      if (gives(view.option.effects)) playSfx(this, 'objet');
      // Sleeping at an inn saves the game (docs/gdd/temps.md) ; a quest finished too (test du 2026-11-06).
      if (savesProgress(view.option.effects)) writeAuto(this.registry, this.state, 'progres');
      if (opensTrade(view.option.effects)) {
        this.scene.stop();
        this.scene.launch('Trade', { npcId: this.dialogue.speaker });
        return;
      }
      // The veillée of the inn (docs/gdd/veillees.md): its own screen, over the paused map.
      const veillee = opensVeillee(view.option.effects);
      if (veillee) {
        this.scene.stop();
        this.scene.launch('Veillee', { publicId: veillee });
        return;
      }
      // A workshop (docs/gdd/artisanat.md): Ragna's forge, Sévane's herbs.
      const atelier = opensAtelier(view.option.effects);
      if (atelier) {
        this.scene.stop();
        this.scene.launch('Atelier', { atelier });
        return;
      }
      const fight = startsCombat(view.option.effects);
      if (fight) {
        // The map carves the arena and launches the fight (it pauses itself again).
        this.scene.resume('Map');
        this.scene.stop();
        (this.scene.get('Map') as MapScene).startEncounter(fight);
        return;
      }
      const place = goesTo(view.option.effects);
      if (place) {
        this.scene.resume('Map');
        this.scene.stop();
        (this.scene.get('Map') as MapScene).goToLocation(place.location, place.arrivee);
        return;
      }
      this.show(view.option.next);
    };
    frame.on('pointerup', choose);
    this.choices[index - 1] = choose;
    return bottom - height;
  }

  /**
   * Which Récit to tell, or to give away: one option per Récit (the listener's reaction follows), a page at a time,
   * and « Aucun, finalement » back to where the hero was.
   */
  private showRaconter(option: DialogueOption, page: number): void {
    const def = option.raconter!;
    const ids = raconterChoices(this.state, def);
    const pages = Math.max(1, Math.ceil(ids.length / RACONTER_PAGE));
    const at = page % pages;
    this.raconter = { option, page: at };
    this.layer.removeAll(true);
    this.tooltip.hide();
    const prompt = def.donne ? 'Quel Récit lui laisses-tu ? Celui-là, tu ne l’auras plus.' : 'Quel Récit lui racontes-tu ?';
    this.layer.add(
      this.add.text(this.textLeft, this.panelTop + 74 * textScale(), prompt, {
        fontFamily: FONT_SERIF,
        fontSize: fontPx(26),
        color: CSS.parchment,
        fontStyle: 'italic',
        wordWrap: { width: GAME_WIDTH - MARGIN - this.textLeft },
      }),
    );
    const options: DialogueOption[] = ids.slice(at * RACONTER_PAGE, (at + 1) * RACONTER_PAGE).map((id) => raconterOption(def, id));
    if (pages > 1) options.push({ text: 'Autres histoires…', next: RACONTER_MORE });
    options.push({ text: 'Aucun, finalement.', next: option.next });
    const views: OptionView[] = options.map((o, index) => ({ option: o, index, enabled: true, tags: [] }));
    this.choices = [];
    let bottom = OPTIONS_BOTTOM;
    for (let i = views.length - 1; i >= 0; i--) bottom = this.addOption(views[i], i + 1, bottom) - OPTION_GAP;
  }

  private place(): NodePlace {
    return { dialogue: this.dialogue.id, node: this.nodeId };
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}

/** Something given (an item, Fers): the sound of a thing picked up. */
function gives(effects?: Effect[]): boolean {
  return !!effects?.some((e) => 'giveItem' in e || ('giveFers' in e && e.giveFers > 0));
}
