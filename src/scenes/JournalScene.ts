import Phaser from 'phaser';
import { bestiaryEntries } from '../rules/bestiary';
import { CAPACITES } from '../rules/combat';
import { ECHOS, TYPE_LABELS, collectedEchos, empriseLabel } from '../rules/echos';
import { findLocation } from '../state/gameState';
import { journalQuests, journalRecits, journalReputation } from '../rules/journal';
import { NORMAL_DIFFICULTY, characterFiche } from '../rules/fiche';
import { gardienRank, gardienRankName, nextGardienRank } from '../rules/factions';
import { heardRumeurs } from '../rules/veillees';
import { fontPx } from '../settings';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { formatDate, momentOf } from '../rules/time';

const MOMENT_WORDS = { matin: 'au matin', midi: 'à midi', soir: 'au soir', nuit: 'la nuit' } as const;

type Tab = 'fiche' | 'quetes' | 'recits' | 'echos' | 'reputation' | 'bestiaire';
const TABS: [Tab, string][] = [
  ['fiche', 'Fiche'],
  ['quetes', 'Quêtes'],
  ['recits', 'Récits'],
  ['echos', 'Échos'],
  ['reputation', 'Réputation'],
  ['bestiaire', 'Bestiaire'],
];
const EFFECT_WORDS = { brulure: 'brûle', saignement: 'fait saigner', ralenti: 'ralentit', etourdi: 'étourdit' } as const;

/** Finger-sized on touch screens, compact with a mouse (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { tabY: 104, tabHeight: 48, tabWidth: 190, rowHeight: 46, perPage: 9, listTop: 170, buttonFont: 20, closeHeight: 52, closeWidth: 220 }
  : { tabY: 112, tabHeight: 68, tabWidth: 224, rowHeight: 66, perPage: 6, listTop: 186, buttonFont: 24, closeHeight: 72, closeWidth: 240 };
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
    // ← → or Tab: the previous or next tab (« PC d'abord »).
    const step = (d: number) => {
      const at = TABS.findIndex(([id]) => id === this.tab);
      this.show(TABS[(at + d + TABS.length) % TABS.length][0]);
    };
    onKeys(this, ['RIGHT', 'TAB'], () => step(1));
    onKeys(this, ['LEFT'], () => step(-1));
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
    // Six tabs: narrower where the screen would not hold them.
    const tabWidth = Math.min(L.tabWidth, (GAME_WIDTH - 40 - 16 * (TABS.length - 1)) / TABS.length);
    TABS.forEach(([id, label], i) => {
      const { container } = addTextButton(this, GAME_WIDTH / 2 + (i - (TABS.length - 1) / 2) * (tabWidth + 16), L.tabY, label, () => this.show(id), {
        width: tabWidth,
        height: L.tabHeight,
        fontSize: L.buttonFont,
        selected: this.tab === id,
      });
      this.layer.add(container);
    });
    if (this.tab === 'fiche') this.drawFiche();
    else if (this.tab === 'quetes') this.drawQuests();
    else if (this.tab === 'recits') this.drawRecits();
    else if (this.tab === 'bestiaire') this.drawBestiary();
    else if (this.tab === 'echos') this.drawEchos();
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

  /**
   * The character sheet (étude du 2026-11-03, B1): the values and the experience, the attributes, what each skill adds
   * to the die, the feats, the equipment, the companions.
   */
  private drawFiche(): void {
    const fiche = characterFiche(this.state);
    if (!fiche) return;
    const top = LAYOUT.listTop;
    const line = 25;
    const column = (x: number, y: number, title: string, lines: { label: string; value: string }[], width: number): number => {
      this.text(x, y, title, 22, CSS.copper);
      let at = y + 34;
      for (const l of lines) {
        const t = this.text(x, at, `${l.label} : ${l.value}`, 18, CSS.parchment, width);
        at += Math.max(line, t.height + 4);
      }
      return at + 12;
    };
    this.text(LIST_X, top, fiche.titre, 26, CSS.copper);
    const xp = this.text(LIST_X, top + 36, `Expérience : ${fiche.xp.now} / ${fiche.xp.next} pour le niveau suivant`, 18, CSS.parchment);
    // The bar of experience towards the next level.
    const bar = this.add.graphics();
    const ratio = Math.min(1, fiche.xp.now / Math.max(1, fiche.xp.next));
    bar.fillStyle(COLORS.ink, 1).fillRect(LIST_X, xp.y + xp.height + 6, 340, 8);
    bar.lineStyle(1, COLORS.copper, 0.8).strokeRect(LIST_X, xp.y + xp.height + 6, 340, 8);
    bar.fillStyle(COLORS.copper, 1).fillRect(LIST_X, xp.y + xp.height + 6, Math.round(340 * ratio), 8);
    this.layer.add(bar);
    const left = column(LIST_X, top + 92, 'Valeurs', fiche.valeurs, 380);
    column(LIST_X, left, 'Attributs', fiche.attributs.slice(0, 4), 380);
    column(LIST_X + 200, left, '', fiche.attributs.slice(4), 200);
    const middleX = 440;
    const skillsEnd = column(middleX, top, 'Compétences', fiche.competences.length ? fiche.competences : [{ label: 'Aucune', value: 'rang 0' }], 400);
    this.text(middleX, skillsEnd - 4, `Le dé : un d20 + le bonus, contre la difficulté. Le % : la chance sur un test normal (difficulté ${NORMAL_DIFFICULTY}).`, 16, CSS.muted, 400);
    const rightX = 870;
    let y = column(rightX, top, 'Dons', fiche.dons, GAME_WIDTH - rightX - 40);
    y = column(rightX, y, 'Équipement', fiche.equipement.length ? fiche.equipement : [{ label: 'Rien', value: 'les mains nues' }], GAME_WIDTH - rightX - 40);
    if (fiche.groupe.length) column(rightX, y, 'Compagnons', fiche.groupe, GAME_WIDTH - rightX - 40);
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

  /** The Récits retained, then the rumours heard at the veillées (docs/gdd/veillees.md), which open secrets. */
  private drawRecits(): void {
    const { recits, cap } = journalRecits(this.state);
    const rumeurs = heardRumeurs(this.state);
    this.drawList(
      [...recits.map((r) => ({ text: r.titre, muted: false })), ...rumeurs.map((r) => ({ text: `Rumeur · ${r.titre}`, muted: true }))],
      (i) => {
        if (i >= recits.length) {
          const r = rumeurs[i - recits.length];
          const title = this.text(DETAIL_X, LAYOUT.listTop, r.titre, 30, CSS.copper, DETAIL_WIDTH);
          const where = this.text(DETAIL_X, title.y + title.height + 6, `Rumeur entendue à la veillée · ${r.ou}`, 20, CSS.copper, DETAIL_WIDTH);
          this.text(DETAIL_X, where.y + where.height + 18, r.texte, 24, CSS.parchment, DETAIL_WIDTH);
          return;
        }
        const r = recits[i];
        const title = this.text(DETAIL_X, LAYOUT.listTop, r.titre, 30, CSS.copper, DETAIL_WIDTH);
        this.text(DETAIL_X, title.y + title.height + 18, r.texte, 24, CSS.parchment, DETAIL_WIDTH);
      },
      'Aucun Récit retenu. Les Échos, les anciens et les livres en gardent : écoute-les. Le soir, à l’auberge, raconte-les.',
    );
    if (recits.length > 0 && this.selected < recits.length) {
      const ordinary = recits.filter((r) => !r.principal).length;
      const note = `Tu retiens ${ordinary} Récit${ordinary > 1 ? 's' : ''} sur ${cap} (Mémoire + 1). Au-delà, le plus ancien s’efface ; ceux de l’histoire principale restent.`;
      this.text(DETAIL_X, GAME_HEIGHT - 20 - LAYOUT.closeHeight / 2, note, 18, CSS.muted, DETAIL_WIDTH - LAYOUT.closeWidth - 30).setOrigin(0, 0.5);
    }
  }

  private drawReputation(): void {
    const L = LAYOUT;
    const rows = journalReputation(this.state);
    let y = L.listTop + 4;
    // The hero's own order (docs/gdd/factions.md): Lanterne, Carnet, Plume.
    this.text(LIST_X + 40, y, 'Gardiens de Mémoire', 24, CSS.parchment);
    this.text(560, y, gardienRankName(gardienRank(this.state)), 24, CSS.copper);
    const next = nextGardienRank(this.state);
    if (next) y = this.text(LIST_X + 80, y + 32, `Prochain rang, ${next}`, 17, CSS.muted, GAME_WIDTH - LIST_X - 120).getBounds().bottom - 32;
    y += 46;
    for (const kind of ['ville', 'guilde'] as const) {
      const group = rows.filter((r) => r.kind === kind);
      if (group.length === 0) continue;
      this.text(LIST_X + 40, y, kind === 'ville' ? 'Villes' : 'Guildes', 20, CSS.muted);
      y += 32;
      for (const row of group) {
        this.text(LIST_X + 80, y, row.name, 23, CSS.parchment);
        this.text(560, y, row.rank ? `${row.label} · ${row.rank}` : row.label, 23, CSS.copper);
        y += 36;
      }
      y += 10;
    }
    if (y < GAME_HEIGHT - 110) this.text(LIST_X + 40, y + 6, 'La réputation change les prix des marchands et l’accueil des gens ; dans une guilde, elle fait monter en rang.', 17, CSS.muted, 1100);
  }

  /** Every kind of enemy met (docs/gdd/combat.md, « Bestiaire ») : what the canon says of it, and how it fights. */
  private drawBestiary(): void {
    const entries = bestiaryEntries(this.state);
    this.drawList(
      entries.map((e) => ({ text: e.enemy.name, muted: e.defeated === 0 })),
      (i) => {
        const { enemy, defeated } = entries[i];
        const title = this.text(DETAIL_X, LAYOUT.listTop, enemy.name, 30, CSS.copper, DETAIL_WIDTH);
        const count = defeated === 0 ? 'Rencontré, jamais vaincu' : `Vaincus : ${defeated}`;
        const status = this.text(DETAIL_X, title.y + title.height + 6, count, 20, CSS.copper);
        const traits = [
          `PV ${enemy.hp}`,
          `Défense ${enemy.defense}`,
          (enemy.range ?? 1) > 1 ? `tire jusqu’à ${enemy.range} cases` : 'au corps à corps',
          enemy.onHit ? EFFECT_WORDS[enemy.onHit.effet] : '',
          enemy.soin ? 'soigne ses alliés' : '',
          enemy.phases?.length ? 'change de rythme, blessé' : '',
        ].filter(Boolean);
        const stats = this.text(DETAIL_X, status.y + status.height + 14, traits.join(' · '), 20, CSS.parchment, DETAIL_WIDTH);
        // Its two capacités (chantier 3).
        const capacites = enemy.capacites.map((c) => `${CAPACITES[c].nom} : ${CAPACITES[c].texte}.`).join('\n');
        const caps = this.text(DETAIL_X, stats.y + stats.height + 10, capacites, 19, CSS.copper, DETAIL_WIDTH);
        const description = this.text(DETAIL_X, caps.y + caps.height + 18, enemy.description ?? '', 24, CSS.parchment, DETAIL_WIDTH);
        if (enemy.source) this.text(DETAIL_X, description.y + description.height + 14, `Source : ${enemy.source}`, 18, CSS.muted, DETAIL_WIDTH);
      },
      'Aucune créature rencontrée. Les routes et les ruines en sont pleines.',
    );
  }

  /** Le Livre des Échos (docs/gdd/echos.md) : the Échos gathered, and the emprise of those relived. */
  private drawEchos(): void {
    const echos = collectedEchos(this.state);
    this.drawList(
      echos.map((e) => ({ text: e.titre, muted: false })),
      (i) => {
        const e = echos[i];
        const title = this.text(DETAIL_X, LAYOUT.listTop, e.titre, 30, CSS.copper, DETAIL_WIDTH);
        const where = `${findLocation(e.lieu)?.name ?? e.lieu}${e.moment === 'nuit' ? ', la nuit' : ''} · ${TYPE_LABELS[e.type]}`;
        const place = this.text(DETAIL_X, title.y + title.height + 6, where, 20, CSS.copper, DETAIL_WIDTH);
        this.text(DETAIL_X, place.y + place.height + 18, e.texte, 24, CSS.parchment, DETAIL_WIDTH);
      },
      'Aucun Écho recueilli. Ils se cachent là où le passé a laissé une trace : gares, places, forges. Certains ne viennent que la nuit.',
    );
    const note = `Échos recueillis : ${echos.length} / ${ECHOS.length}. ${empriseLabel(this.state)}`;
    this.text(DETAIL_X, GAME_HEIGHT - 20 - LAYOUT.closeHeight / 2, note, 18, CSS.muted, DETAIL_WIDTH - LAYOUT.closeWidth - 30).setOrigin(0, 0.5);
  }
}
