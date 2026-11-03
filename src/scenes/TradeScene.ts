import Phaser from 'phaser';
import npcData from '../data/npcs.json';
import { crystalWear, repair, repairCost, wearOf } from '../rules/usure';
import { combinedDiscount, deName, merchantPlace, reputationLevel, reputationPrices, reputationSells, heroDiscount } from '../rules/reputation';
import { findPlace } from '../rules/world';
import { characterStats, wearPenalty, type Character, type Slot } from '../rules/character';
import { armorBonus, buy, buyPrice, carriedWeightKg, equip, merchantCatalogue, merchantDiscount, merchantShowcase, ownedCount, sell, SELL_RATIO, tradeItems, unequip, useConsumable, type ItemDef } from '../rules/inventory';
import { castOutsideCombat, combatPower, resonanceMax, useResonanceSap, wornCrystal } from '../rules/magic';
import { marquesBorne } from '../rules/marques';
import { CATEGORIES, categoryOf, itemUses, itemValue, itemsOf, type ItemCategory } from '../rules/objets';
import { forgettable } from '../rules/oubli';
import { MUSHROOM } from './OubliScene';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const MARGIN = 60;

/** Finger-sized on touch screens, compact with a mouse: the panel then starts right under the slim HUD bar. */
const LAYOUT = HAS_MOUSE
  ? {
      panelTop: 60, titleY: 72, titleSize: 26, closeY: 92, closeWidth: 180, closeHeight: 44, closeFont: 20, statsY: 124, statsFont: 19,
      tabsY: 166, tabHeight: 40, tabFont: 18, listTop: 192, rowHeight: 44, rowFont: 18, pagerHeight: 38,
      nameFont: 24, textFont: 18, buttonHeight: 40, buttonFont: 17,
    }
  : {
      panelTop: 100, titleY: 122, titleSize: 28, closeY: 130, closeWidth: 220, closeHeight: 64, closeFont: 24, statsY: 180, statsFont: 21,
      tabsY: 232, tabHeight: 54, tabFont: 21, listTop: 268, rowHeight: 60, rowFont: 21, pagerHeight: 54,
      nameFont: 26, textFont: 20, buttonHeight: 58, buttonFont: 20,
    };

/** The list of the tab on the left, the card of the item touched on the right. */
const LIST_WIDTH = 500;
const DETAIL_LEFT = MARGIN + LIST_WIDTH + 30;
const DETAIL_WIDTH = GAME_WIDTH - MARGIN - DETAIL_LEFT;
const PAGER_Y = GAME_HEIGHT - 14 - LAYOUT.pagerHeight / 2;
/** Rows that fit above the page buttons; a longer tab is shown page by page. */
const ROWS_PER_PAGE = Math.floor((PAGER_Y - LAYOUT.pagerHeight / 2 - 8 - LAYOUT.listTop) / LAYOUT.rowHeight);
const BUTTONS_Y = GAME_HEIGHT - 14 - LAYOUT.buttonHeight / 2;

const SLOT_NAMES: Record<Slot, string> = { mainDroite: 'main droite', mainGauche: 'main gauche', armure: 'porté', cristal: 'au cou' };

type Action = [label: string, run: () => void];

/**
 * Buy, sell, equip and use items — docs/gdd/inventaire.md. The bag in tabs (Équipement, Remèdes, Matières, Quête,
 * Divers), and the card of the item touched: what it is good for, its description, what is said about it, its buttons.
 * A stall lists its trader's catalogue with what is carried; the inventory, what is carried.
 */
export class TradeScene extends Phaser.Scene {
  private state!: GameState;
  private npcId: string | undefined;
  private layer!: Phaser.GameObjects.Container;
  private message = '';
  private tab: ItemCategory = 'equipement';
  private selected: string | null = null;
  private page = 0;
  /** What pressing 1, 2, 3… does on the card shown. */
  private actions: Action[] = [];

  constructor() {
    super('Trade');
  }

  create(data: { npcId?: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.npcId = data.npcId;
    this.message = '';
    this.page = 0;
    this.selected = null;

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    this.add
      .rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);

    const npc = this.npcId ? npcData.find((n) => n.id === this.npcId) : undefined;
    // « L’étal de Tobias Cendrefer », « L’étal de la marchande des nations », « L’étal du colporteur ».
    const seller = (npc?.name ?? '').replace(/^(La |Le |Les |L’)/, (article) => article.toLowerCase());
    const title = this.npcId ? `L’étal ${deName(seller)}` : 'Inventaire';
    const heading = this.add.text(MARGIN, L.titleY, title, { fontFamily: FONT_SERIF, fontSize: `${L.titleSize}px`, color: CSS.copper });
    // The town's opinion of the hero changes its merchants' prices (docs/gdd/reputation.md).
    const place = merchantPlace(this.npcId);
    if (place) {
      const level = reputationLevel(this.state, place);
      const change = level.prices === 0 ? '' : ` (${level.prices < 0 ? '−' : '+'}${Math.round(Math.abs(level.prices) * 100)} %)`;
      this.add
        .text(heading.x + heading.width + 24, heading.y + heading.height / 2, `${findPlace(place)?.name ?? place} : ${level.label}${change}`, {
          fontFamily: FONT_SERIF,
          fontSize: `${Math.round(L.titleSize * 0.7)}px`,
          color: CSS.muted,
          fontStyle: 'italic',
        })
        .setOrigin(0, 0.5);
    }

    // The hero's own bag: the price of forcing the crystal, beside the title (src/rules/marques.ts).
    if (!this.npcId) this.showMarques(heading);

    addTextButton(this, GAME_WIDTH - MARGIN - L.closeWidth / 2, L.closeY, withKeyHint('Fermer', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.closeFont,
    });
    onKeys(this, ['ESC'], () => this.close());
    if (!this.npcId) onKeys(this, ['I'], () => this.close());
    // ← → change tab, ↑ ↓ the item, 1 to 4 the buttons of its card.
    onKeys(this, ['LEFT'], () => this.stepTab(-1));
    onKeys(this, ['RIGHT'], () => this.stepTab(1));
    onKeys(this, ['UP'], () => this.stepItem(-1));
    onKeys(this, ['DOWN'], () => this.stepItem(1));
    DIGIT_KEYS.slice(0, 4).forEach((keys, i) => onKeys(this, keys, () => this.actions[i]?.[1]()));

    // A stall opens on what its trader sells; the bag, on its first tab with something in it.
    const shown = this.shownItems();
    const sold = this.npcId ? merchantCatalogue(this.npcId) : [];
    const first = CATEGORIES.find((c) => itemsOf(sold.length ? sold : shown, c.id).length > 0);
    this.tab = first?.id ?? 'equipement';
    // A trader's showcase, shown first (étude, G1): the thing worth wanting in this town.
    const showcase = merchantShowcase(this.npcId);
    if (showcase) {
      this.tab = categoryOf(showcase.item);
      this.selected = showcase.item.id;
    }

    this.layer = this.add.container(0, 0);
    this.redraw();
    // Back from the Champignon-Mémoire (OubliScene): what was forgotten, and the bag as it is now.
    const onResume = () => {
      const said = this.registry.get('oubli-notices') as string[] | undefined;
      if (said?.length) {
        this.registry.remove('oubli-notices');
        this.message = said.join(' · ');
      }
      this.redraw();
    };
    this.events.on(Phaser.Scenes.Events.RESUME, onResume);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.events.off(Phaser.Scenes.Events.RESUME, onResume));
  }

  /** « Marques du cristal : les veines, le manque — −1 aux jets sans cristal », between the title and the Fermer button. */
  private showMarques(heading: Phaser.GameObjects.Text): void {
    const borne = marquesBorne(this.character());
    if (!borne.length) return;
    const effects = borne.filter((m) => m.niveau >= 2).map((m) => m.effet.replace(/\.$/, ''));
    const text = `Marques du cristal : ${borne.map((m) => m.nom.toLowerCase()).join(', ')}${effects.length ? ` (${effects.join(' ; ')})` : ''}`;
    const x = heading.x + heading.width + 24;
    const width = GAME_WIDTH - MARGIN - LAYOUT.closeWidth - 24 - x;
    this.add
      .text(x, heading.y + heading.height / 2, text, {
        fontFamily: FONT_SERIF,
        fontSize: `${Math.round(LAYOUT.titleSize * 0.62)}px`,
        color: CSS.copper,
        fontStyle: 'italic',
        wordWrap: { width },
      })
      .setOrigin(0, 0.5);
  }

  /** The trader's own discount combined with the town's opinion (negative: dearer). */
  private discount(): number {
    // The hero's own edge or handicap (Langue d'argent, Sang de Ferros ; chantier 6), on top of the trader's discount.
    const own = this.npcId ? heroDiscount(this.state.character, this.npcId) : 0;
    return combinedDiscount(merchantDiscount(this.state.flags, this.npcId) + own, reputationPrices(this.state, this.npcId));
  }

  private character(): Character {
    return this.state.character!;
  }

  private shownItems(): ItemDef[] {
    return tradeItems(this.character(), this.npcId);
  }

  private stepTab(step: number): void {
    const shown = this.shownItems();
    const tabs = CATEGORIES.filter((c) => itemsOf(shown, c.id).length > 0);
    if (!tabs.length) return;
    const at = Math.max(0, tabs.findIndex((c) => c.id === this.tab));
    this.selectTab(tabs[(at + step + tabs.length) % tabs.length].id);
  }

  private selectTab(tab: ItemCategory): void {
    this.tab = tab;
    this.selected = null;
    this.page = 0;
    this.message = '';
    this.redraw();
  }

  private stepItem(step: number): void {
    const rows = itemsOf(this.shownItems(), this.tab);
    if (!rows.length) return;
    const at = rows.findIndex((i) => i.id === this.selected);
    const next = rows[(at + step + rows.length) % rows.length];
    this.selected = next.id;
    this.page = Math.floor(rows.indexOf(next) / ROWS_PER_PAGE);
    this.message = '';
    this.redraw();
  }

  private redraw(): void {
    this.layer.removeAll(true);
    const c = this.character();
    const capacity = characterStats(c).carryKg;
    const weight = carriedWeightKg(c);

    // With a crystal at the neck, its Points de Résonance (docs/gdd/magie.md).
    const resonance = wornCrystal(c) ? ` · Résonance ${c.resonance} / ${resonanceMax(c)} PR` : '';
    this.layer.add(
      this.text(MARGIN, LAYOUT.statsY, `${c.fers} Fers · Charge ${weight.toFixed(1)} / ${capacity} kg · Défense +${armorBonus(c)} d’armure${resonance}`, LAYOUT.statsFont, CSS.parchment),
    );

    const shown = this.shownItems();
    this.drawTabs(shown);
    const rows = itemsOf(shown, this.tab);
    if (!rows.some((i) => i.id === this.selected)) this.selected = rows[0]?.id ?? null;

    if (shown.length === 0) this.layer.add(this.text(MARGIN, LAYOUT.listTop + LAYOUT.rowHeight / 2, 'Ton sac est vide.', LAYOUT.rowFont, CSS.muted));
    else if (rows.length === 0) this.layer.add(this.text(MARGIN, LAYOUT.listTop + LAYOUT.rowHeight / 2, 'Rien dans cet onglet.', LAYOUT.rowFont, CSS.muted));
    const pages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
    this.page = Math.min(this.page, pages - 1);
    rows
      .slice(this.page * ROWS_PER_PAGE, (this.page + 1) * ROWS_PER_PAGE)
      .forEach((item, i) => this.drawRow(item, LAYOUT.listTop + LAYOUT.rowHeight / 2 + i * LAYOUT.rowHeight));
    if (pages > 1) this.drawPager(pages);

    this.layer.add(
      this.add
        .rectangle(DETAIL_LEFT - 12, LAYOUT.listTop - 4, DETAIL_WIDTH + 24, GAME_HEIGHT - LAYOUT.listTop - 4, 0x2a211c, 0.5)
        .setOrigin(0, 0)
        .setStrokeStyle(1, COLORS.copper, 0.35),
    );
    const item = rows.find((i) => i.id === this.selected);
    this.actions = item ? this.actionsFor(item) : [];
    if (item) this.drawCard(item);
    else if (this.message) this.drawMessage(BUTTONS_Y);
  }

  /** One button per tab, with how many items it holds; an empty tab is greyed. */
  private drawTabs(shown: ItemDef[]): void {
    const gap = 8;
    const width = (GAME_WIDTH - 2 * MARGIN - gap * (CATEGORIES.length - 1)) / CATEGORIES.length;
    CATEGORIES.forEach((c, i) => {
      const count = itemsOf(shown, c.id).length;
      const button = addTextButton(this, MARGIN + width / 2 + i * (width + gap), LAYOUT.tabsY, count ? `${c.name} (${count})` : c.name, () => this.selectTab(c.id), {
        width,
        height: LAYOUT.tabHeight,
        fontSize: LAYOUT.tabFont,
        enabled: count > 0,
        selected: c.id === this.tab,
      });
      this.layer.add(button.container);
    });
  }

  /** « ◀ » and « ▶ », and where we are, under the rows of the list. */
  private drawPager(pages: number): void {
    const button = { width: 90, height: LAYOUT.pagerHeight, fontSize: LAYOUT.rowFont };
    const turn = (step: number) => {
      this.page = (this.page + step + pages) % pages;
      const rows = itemsOf(this.shownItems(), this.tab);
      this.selected = rows[this.page * ROWS_PER_PAGE]?.id ?? this.selected;
      this.redraw();
    };
    this.layer.add(addTextButton(this, MARGIN + button.width / 2, PAGER_Y, '◀', () => turn(-1), button).container);
    this.layer.add(this.text(MARGIN + LIST_WIDTH / 2, PAGER_Y, `Page ${this.page + 1} / ${pages}`, LAYOUT.rowFont, CSS.muted, 0.5));
    this.layer.add(addTextButton(this, MARGIN + LIST_WIDTH - button.width / 2, PAGER_Y, '▶', () => turn(1), button).container);
  }

  private equippedSlot(itemId: string): Slot | null {
    const c = this.character();
    for (const slot of ['mainGauche', 'mainDroite', 'armure', 'cristal'] as Slot[]) if (c.equipment[slot] === itemId) return slot;
    return null;
  }

  /** A line of the list: the name, how many, where it is worn; at a stall, its price. Touch it to see its card. */
  private drawRow(item: ItemDef, y: number): void {
    const owned = ownedCount(this.character(), item.id);
    const equippedIn = this.equippedSlot(item.id);
    const chosen = item.id === this.selected;
    const frame = this.add
      .rectangle(MARGIN + LIST_WIDTH / 2, y, LIST_WIDTH, LAYOUT.rowHeight - 6, chosen ? 0x5a3a26 : 0x2a211c, chosen ? 0.95 : 0.6)
      .setStrokeStyle(chosen ? 2 : 1, COLORS.copper, chosen ? 1 : 0.3)
      .setInteractive({ useHandCursor: true });
    frame.on('pointerup', () => {
      this.selected = item.id;
      this.message = '';
      this.redraw();
    });
    // With a mouse, the card follows the item under it (« PC d'abord »).
    if (HAS_MOUSE) {
      frame.on('pointerover', () => {
        if (this.selected === item.id) return;
        this.selected = item.id;
        this.message = '';
        this.redraw();
      });
    }
    this.layer.add(frame);
    const worn = equippedIn ? ' ◆' : '';
    const label = `${item.name}${owned > 1 ? `  ×${owned}` : ''}${worn}`;
    this.layer.add(this.text(MARGIN + 14, y, label, LAYOUT.rowFont, owned ? CSS.parchment : CSS.muted));
    if (this.npcId && merchantCatalogue(this.npcId).some((i) => i.id === item.id)) {
      this.layer.add(this.text(MARGIN + LIST_WIDTH - 14, y, `${buyPrice(item, this.discount())} F`, LAYOUT.rowFont, CSS.copper, 1));
    }
  }

  /** The card of the item touched: name, what it is, what it is good for, its text, what is said of it, its buttons. */
  private drawCard(item: ItemDef): void {
    const owned = ownedCount(this.character(), item.id);
    const equippedIn = this.equippedSlot(item.id);
    const wrap = { width: DETAIL_WIDTH };
    let y = LAYOUT.listTop + 8;
    const add = (value: string, size: number, color: string, style: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {}, gap = 8) => {
      const t = this.add.text(DETAIL_LEFT, y, value, { fontFamily: FONT_SERIF, fontSize: `${size}px`, color, wordWrap: wrap, lineSpacing: 3, ...style });
      this.layer.add(t);
      y += t.height + gap;
    };
    add(item.name, LAYOUT.nameFont, CSS.copper, {}, 4);
    const category = CATEGORIES.find((c) => c.id === categoryOf(item))?.name ?? '';
    const status = [category, owned ? `tu en as ${owned}` : 'tu n’en as pas', equippedIn ? (equippedIn === 'cristal' ? 'porté au cou' : equippedIn === 'armure' ? 'porté' : `en ${SLOT_NAMES[equippedIn]}`) : '']
      .filter(Boolean)
      .join(' · ');
    add(status, LAYOUT.textFont, CSS.muted, { fontStyle: 'italic' }, 12);
    const showcase = merchantShowcase(this.npcId);
    if (showcase?.item.id === item.id) add(`« ${showcase.mot} »`, LAYOUT.textFont, CSS.copper, { fontStyle: 'italic' }, 10);
    for (const use of itemUses(item)) add(`• ${use}`, LAYOUT.textFont, CSS.parchment, {}, 4);
    // Its wear (src/rules/usure.ts ; chantier 6).
    const wear = wearOf(this.character(), item.id);
    if (wear > 0) {
      const penalty = wearPenalty(this.character(), item.id);
      const state = penalty === 2 ? 'abîmé·e' : penalty === 1 ? 'émoussé·e' : 'un peu usé·e';
      add(`Usure : ${wear} combat${wear > 1 ? 's' : ''}, ${state}${penalty ? ` (−${penalty})` : ''}. Réparer : ${repairCost(this.character(), item.id)} Fers, chez un marchand.`, LAYOUT.textFont, CSS.copper, {}, 4);
    }
    if (item.slot === 'cristal' && this.character().equipment.cristal === item.id && crystalWear(this.character()) > 0) {
      add(`Cristal fatigué : −${crystalWear(this.character())} Point de Résonance. La tailleuse d’Ironheart le réaccorde, ou Vanel, au Bosquet.`, LAYOUT.textFont, CSS.copper, {}, 4);
    }
    if (this.npcId && merchantCatalogue(this.npcId).some((i) => i.id === item.id)) {
      const price = buyPrice(item, this.discount());
      const deal = price < item.price ? ' (prix d’ami)' : price > item.price ? ' (prix fort)' : '';
      add(`Prix ici : ${price} Fers${deal}`, LAYOUT.textFont, CSS.copper, {}, 4);
    }
    add(itemValue(item), LAYOUT.textFont, CSS.muted, {}, 12);
    add(item.description, LAYOUT.textFont, CSS.parchment, {}, 10);
    if (item.lore) add(item.lore, LAYOUT.textFont, '#c9a27a', { fontStyle: 'italic' }, 10);

    this.drawMessage(BUTTONS_Y - LAYOUT.buttonHeight / 2 - 18);
    const n = this.actions.length;
    if (!n) return;
    const gap = 10;
    const width = Math.min(230, (DETAIL_WIDTH - gap * (n - 1)) / n);
    this.actions.forEach(([label, run], i) => {
      const caption = n > 1 && HAS_MOUSE ? `${i + 1}. ${label}` : label;
      const button = addTextButton(this, DETAIL_LEFT + width / 2 + i * (width + gap), BUTTONS_Y, caption, run, {
        width,
        height: LAYOUT.buttonHeight,
        fontSize: LAYOUT.buttonFont,
      });
      this.layer.add(button.container);
    });
  }

  /** What just happened (« Tu équipes : Dague. »), above the card's buttons. */
  private drawMessage(y: number): void {
    if (!this.message) return;
    this.layer.add(this.text(DETAIL_LEFT, y, this.message, LAYOUT.textFont, CSS.copper).setWordWrapWidth(DETAIL_WIDTH));
  }

  /** The buttons of an item's card: use, drink, heal, wear, take off, sell, buy. */
  private actionsFor(item: ItemDef): Action[] {
    const actions: Action[] = [];
    const owned = ownedCount(this.character(), item.id);
    const equippedIn = this.equippedSlot(item.id);
    // A town that honours the hero buys at a better price (chantier 6).
    const ratio = SELL_RATIO + (this.npcId ? reputationSells(this.state, this.npcId) : 0);
    const sellPrice = Math.floor(item.price * ratio);

    // The worn crystal of Vie heals here too: Guérison naturelle on oneself, outside a fight.
    const power = equippedIn === 'cristal' ? combatPower(this.character()) : undefined;
    if (power?.combat === 'soin') {
      actions.push([`Soigner (${power.cost} PR)`, () => {
        const c = this.character();
        const notices = c.hp >= characterStats(c).maxHp ? null : castOutsideCombat(c, power.id, true);
        if (notices) this.message = notices.join(' · ');
        else this.message = c.hp >= characterStats(c).maxHp ? 'Tu n’as aucune blessure à soigner.' : 'Tu n’as plus assez de forces : dors d’abord.';
        this.redraw();
      }]);
    }
    // The Champignon-Mémoire: forget a Récit on purpose, and the Échos' hold with it (docs/gdd/memoire.md).
    if (item.id === MUSHROOM && owned > 0) {
      actions.push(['Manger', () => {
        if (!forgettable(this.state).length) {
          this.message = 'Tu n’as aucun Récit à oublier.';
          return this.redraw();
        }
        this.scene.pause();
        this.scene.launch('Oubli', { mode: 'champignon', from: 'Trade' });
      }]);
    }
    if (item.healHp && owned > 0) actions.push(['Utiliser', () => this.act(() => useConsumable(this.character(), item.id, characterStats(this.character()).maxHp), `Tu utilises : ${item.name}.`)]);
    // A sap that gives Points de Résonance back to the worn crystal (docs/gdd/artisanat.md).
    if (item.resonance && owned > 0) {
      actions.push(['Boire', () => {
        const given = useResonanceSap(this.character(), item.id);
        this.message = given ? `Tu bois : ${item.name}. +${given} PR.` : wornCrystal(this.character()) ? 'Ton cristal est déjà plein.' : 'Il te faut porter un cristal.';
        this.redraw();
      }]);
    }
    if (item.slot) {
      if (equippedIn) {
        actions.push(['Retirer', () => this.act(() => {
          unequip(this.character(), equippedIn);
          return true;
        }, `Tu retires : ${item.name}.`)]);
      } else if (owned > 0 && item.slot === 'cristal') actions.push(['Porter', () => this.act(() => this.equipBestSlot(item), `Tu portes au cou : ${item.name}.`)]);
      else if (owned > 0) actions.push(['Équiper', () => this.act(() => this.equipBestSlot(item), `Tu équipes : ${item.name}.`)]);
    }
    // A merchant sets a worn weapon or armour right (chantier 6).
    if (this.npcId && owned > 0 && repairCost(this.character(), item.id) > 0) {
      const cost = repairCost(this.character(), item.id);
      actions.push([`Réparer (${cost})`, () => this.act(() => (repair(this.character(), item.id) ? true : this.fail('Pas assez de Fers.')), `Comme neuf : ${item.name}.`)]);
    }
    if (owned > 0 && !item.quest) {
      actions.push([`Vendre (${sellPrice})`, () => this.act(() => (sell(this.character(), item.id, 1, ratio) ? null : true), `Tu vends : ${item.name}.`)]);
    }
    if (this.npcId && merchantCatalogue(this.npcId).some((i) => i.id === item.id)) {
      actions.push([`Acheter (${buyPrice(item, this.discount())})`, () => this.act(() => {
        const error = buy(this.character(), item.id, 1, this.discount());
        if (error === 'trop-cher') return this.fail('Pas assez de Fers.');
        if (error === 'trop-lourd') return this.fail('Trop lourd à porter.');
        return true;
      }, `Tu achètes : ${item.name}.`)]);
    }
    return actions;
  }

  private equipBestSlot(item: ItemDef): boolean {
    const c = this.character();
    const slot: Slot = item.slot === 'armure' ? 'armure' : item.slot === 'cristal' ? 'cristal' : c.equipment.mainGauche ? 'mainDroite' : 'mainGauche';
    return equip(c, item.id, slot);
  }

  private fail(message: string): null {
    this.message = message;
    return null;
  }

  private act(action: () => unknown, successMessage: string): void {
    const result = action();
    if (result !== null && result !== undefined) this.message = successMessage;
    this.redraw();
  }

  private text(x: number, y: number, value: string, fontSize: number, color: string, originX = 0): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: `${fontSize}px`, color }).setOrigin(originX, 0.5);
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
