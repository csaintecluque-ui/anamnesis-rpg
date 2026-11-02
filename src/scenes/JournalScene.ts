import Phaser from 'phaser';
import { journalQuests, journalRecits, journalReputation } from '../rules/journal';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { formatDate, momentOf } from '../rules/time';

const MOMENT_WORDS = { matin: 'au matin', midi: 'à midi', soir: 'au soir', nuit: 'la nuit' } as const;

type Tab = 'quetes' | 'recits' | 'reputation';
const TABS: [Tab, string][] = [
  ['quetes', 'Quêtes'],
  ['recits', 'Récits'],
  ['reputation', 'Réputation'],
];

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { tabY: 104, tabHeight: 48, tabWidth: 200, rowHeight: 46, perPage: 9, listTop: 170, buttonFont: 20, closeHeight: 52, closeWidth: 220 }
  : { tabY: 112, tabHeight: 68, tabWidth: 240, rowHeight: 66, perPage: 6, listTop: 186, buttonFont: 24, closeHeight: 72, closeWidth: 240 };
const LIST_X = 40;
const LIST_WIDTH = 440;
const DETAIL_X = 520;
const DETAIL_WIDTH = GAME_WIDTH - DETAIL_X - 40;

/** Quests, Récits and reputation, opened from the HUD, the pause menu or J; the map stays frozen underneath. */
export class JournalScene extends Phaser.Scene {
  private state!: GameState;
  private tab: Tab = 'quetes';
  private selected = 0;
  private page = 0;
  private layer!: Phaser.GameObjects.Container;

  constructor() {
    super('Journal');
  }

  create(data: { tab?: Tab } = {}): void {
    this.state = this.registry.get('game') as GameState;
    this.tab = data.tab ?? 'quetes';
    this.selected = 0;
    this.page = 0;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 1).setOrigin(0, 0).setInteractive();
    this.add.text(GAME_WIDTH / 2, 48, 'Journal', { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.copper }).setOrigin(0.5);
    // The date of the canon's calendar (docs/gdd/temps.md): « Jour 3, au soir — le 3 du huitième mois de l'an 3000 ».
    const t = this.state.time;
    this.add
      .text(40, GAME_HEIGHT - 20 - LAYOUT.closeHeight / 2, `Jour ${t.day}, ${MOMENT_WORDS[momentOf(t)]} — ${formatDate(t)}`, { fontFamily: FONT_SERIF, fontSize: '20px', color: CSS.muted })
      .setOrigin(0, 0.5);
    const L = LAYOUT;
    addTextButton(this, GAME_WIDTH - 40 - L.closeWidth / 2, GAME_HEIGHT - 20 - L.closeHeight / 2, withKeyHint('Fermer', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.buttonFont,
    });
    onKeys(this, ['ESC', 'J'], () => this.close());
    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }

  private show(tab: Tab): void {
    this.tab = tab;
    this.selected = 0;
    this.page = 0;
    this.redraw();
  }

  private text(x: number, y: number, content: string, size: number, color: string, width?: number): Phaser.GameObjects.Text {
    const t = this.add.text(x, y, content, {
      fontFamily: FONT_SERIF,
      fontSize: fontPx(size),
      color,
      wordWrap: width ? { width } : undefined,
      lineSpacing: 4,
    });
    this.layer.add(t);
    return t;
  }

  private redraw(): void {
    this.layer.removeAll(true);
    const L = LAYOUT;
    TABS.forEach(([id, label], i) => {
      const { container } = addTextButton(this, GAME_WIDTH / 2 + (i - 1) * (L.tabWidth + 16), L.tabY, label, () => this.show(id), {
        width: L.tabWidth,
        height: L.tabHeight,
        fontSize: L.buttonFont,
        selected: this.tab === id,
      });
      this.layer.add(container);
    });
    if (this.tab === 'quetes') this.drawQuests();
    else if (this.tab === 'recits') this.drawRecits();
    else this.drawReputation();
  }

  /** A paged list on the left; the selected entry, in full, on the right. */
  private drawList(labels: { text: string; muted: boolean }[], detail: (index: number) => void, empty: string): void {
    const L = LAYOUT;
    if (labels.length === 0) {
      this.text(LIST_X, L.listTop, empty, 24, CSS.muted, GAME_WIDTH - 2 * LIST_X);
      return;
    }
    const pages = Math.ceil(labels.length / L.perPage);
    this.page = Math.min(this.page, pages - 1);
    const first = this.page * L.perPage;
    labels.slice(first, first + L.perPage).forEach((label, i) => {
      const index = first + i;
      const { container } = addTextButton(
        this,
        LIST_X + LIST_WIDTH / 2,
        L.listTop + L.rowHeight / 2 + i * L.rowHeight,
        label.text,
        () => {
          this.selected = index;
          this.redraw();
        },
        { width: LIST_WIDTH, height: L.rowHeight - 8, fontSize: L.buttonFont - 2, selected: index === this.selected },
      );
      if (label.muted && index !== this.selected) (container.list[1] as Phaser.GameObjects.Text).setColor(CSS.muted);
      this.layer.add(container);
    });
    if (pages > 1) {
      const y = L.listTop + L.perPage * L.rowHeight + L.rowHeight / 2 - 4;
      const step = (delta: number) => () => {
        this.page = (this.page + delta + pages) % pages;
        this.selected = this.page * L.perPage;
        this.redraw();
      };
      for (const [dx, label, delta] of [[-110, '◀', -1], [110, '▶', 1]] as const) {
        this.layer.add(addTextButton(this, LIST_X + LIST_WIDTH / 2 + dx, y, label, step(delta), { width: 90, height: L.rowHeight - 8, fontSize: L.buttonFont }).container);
      }
      this.text(LIST_X + LIST_WIDTH / 2, y, `${this.page + 1} / ${pages}`, 18, CSS.muted).setOrigin(0.5);
    }
    detail(Math.min(this.selected, labels.length - 1));
  }

  private drawQuests(): void {
    const quests = journalQuests(this.state);
    this.drawList(
      quests.map((q) => ({ text: q.done ? `✓ ${q.name}` : q.name, muted: q.done })),
      (i) => {
        const q = quests[i];
        const title = this.text(DETAIL_X, LAYOUT.listTop, q.name, 30, CSS.copper, DETAIL_WIDTH);
        const status = this.text(DETAIL_X, title.y + title.height + 6, q.done ? 'Terminée' : 'En cours', 20, q.done ? CSS.muted : CSS.copper);
        const summary = this.text(DETAIL_X, status.y + status.height + 18, q.summary, 24, CSS.parchment, DETAIL_WIDTH);
        if (q.step) {
          const label = this.text(DETAIL_X, summary.y + summary.height + 26, 'Où j’en suis', 20, CSS.copper);
          this.text(DETAIL_X, label.y + label.height + 8, q.step, 24, CSS.parchment, DETAIL_WIDTH);
        }
      },
      'Aucune quête pour l’instant. Parle aux gens : chacun a quelque chose à demander.',
    );
  }

  private drawRecits(): void {
    const { recits, cap } = journalRecits(this.state);
    this.drawList(
      recits.map((r) => ({ text: r.titre, muted: false })),
      (i) => {
        const r = recits[i];
        const title = this.text(DETAIL_X, LAYOUT.listTop, r.titre, 30, CSS.copper, DETAIL_WIDTH);
        this.text(DETAIL_X, title.y + title.height + 18, r.texte, 24, CSS.parchment, DETAIL_WIDTH);
      },
      'Aucun Récit retenu. Les Échos, les anciens et les livres en gardent : écoute-les.',
    );
    if (recits.length > 0) {
      const ordinary = recits.filter((r) => !r.principal).length;
      const note = `Tu retiens ${ordinary} Récit${ordinary > 1 ? 's' : ''} sur ${cap} (Mémoire + 1). Au-delà, le plus ancien s’efface ; ceux de l’histoire principale restent.`;
      this.text(DETAIL_X, GAME_HEIGHT - 20 - LAYOUT.closeHeight / 2, note, 18, CSS.muted, DETAIL_WIDTH - LAYOUT.closeWidth - 30).setOrigin(0, 0.5);
    }
  }

  private drawReputation(): void {
    const L = LAYOUT;
    const rows = journalReputation(this.state);
    let y = L.listTop + 10;
    for (const kind of ['ville', 'guilde'] as const) {
      const group = rows.filter((r) => r.kind === kind);
      if (group.length === 0) continue;
      this.text(LIST_X + 40, y, kind === 'ville' ? 'Villes' : 'Guildes', 22, CSS.muted);
      y += 40;
      for (const row of group) {
        this.text(LIST_X + 80, y, row.name, 26, CSS.parchment);
        this.text(560, y, row.member ? `${row.label} · membre` : row.label, 26, CSS.copper);
        y += 44;
      }
      y += 16;
    }
    this.text(LIST_X + 40, Math.max(y, L.listTop + 300), 'La réputation change les prix des marchands et l’accueil des gens. Elle suit ce que tu fais.', 18, CSS.muted, 820);
  }
}
