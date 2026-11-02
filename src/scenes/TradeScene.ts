import Phaser from 'phaser';
import npcData from '../data/npcs.json';
import { combinedDiscount, merchantPlace, reputationLevel, reputationPrices } from '../rules/reputation';
import { findPlace } from '../rules/world';
import { characterStats, type Character, type Slot } from '../rules/character';
import { armorBonus, buy, buyPrice, carriedWeightKg, equip, merchantCatalogue, merchantDiscount, ownedCount, sell, SELL_RATIO, tradeItems, unequip, useConsumable, type ItemDef } from '../rules/inventory';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

const MARGIN = 60;

/** Finger-sized on touch screens, compact with a mouse: the panel then starts right under the slim HUD bar. */
const LAYOUT = HAS_MOUSE
  ? { panelTop: 60, titleY: 72, titleSize: 26, closeY: 92, closeWidth: 180, closeHeight: 44, closeFont: 20, statsY: 124, messageRight: GAME_WIDTH - MARGIN, rowTop: 162, rowHeight: 52, rowFont: 19, buttonWidth: 130, buttonHeight: 38, buttonFont: 17 }
  : { panelTop: 100, titleY: 124, titleSize: 28, closeY: 130, closeWidth: 220, closeHeight: 64, closeFont: 24, statsY: 160, messageRight: GAME_WIDTH - 260, rowTop: 198, rowHeight: 60, rowFont: 20, buttonWidth: 150, buttonHeight: 48, buttonFont: 18 };

const SLOT_NAMES: Record<Slot, string> = { mainDroite: 'main droite', mainGauche: 'main gauche', armure: 'porté' };

/** Buy, sell, equip and use items — docs/gdd/inventaire.md. A stall lists its trader's catalogue; the inventory, what is carried. */
export class TradeScene extends Phaser.Scene {
  private state!: GameState;
  private npcId: string | undefined;
  private layer!: Phaser.GameObjects.Container;
  private message = '';

  constructor() {
    super('Trade');
  }

  create(data: { npcId?: string }): void {
    this.state = this.registry.get('game') as GameState;
    this.npcId = data.npcId;
    this.message = '';

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.45).setOrigin(0, 0).setInteractive();
    const L = LAYOUT;
    this.add
      .rectangle(0, L.panelTop, GAME_WIDTH, GAME_HEIGHT - L.panelTop, COLORS.ink, 0.96)
      .setOrigin(0, 0)
      .setStrokeStyle(2, COLORS.copper, 0.7);

    const npc = this.npcId ? npcData.find((n) => n.id === this.npcId) : undefined;
    const title = this.npcId ? `L’étal ${npc?.name ?? ''}` : 'Inventaire';
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

    addTextButton(this, GAME_WIDTH - MARGIN - L.closeWidth / 2, L.closeY, withKeyHint('Fermer', 'Échap'), () => this.close(), {
      width: L.closeWidth,
      height: L.closeHeight,
      fontSize: L.closeFont,
    });
    onKeys(this, ['ESC'], () => this.close());
    if (!this.npcId) onKeys(this, ['I'], () => this.close());

    this.layer = this.add.container(0, 0);
    this.redraw();
  }

  /** The trader's own discount combined with the town's opinion (negative: dearer). */
  private discount(): number {
    return combinedDiscount(merchantDiscount(this.state.flags, this.npcId), reputationPrices(this.state, this.npcId));
  }

  private character(): Character {
    return this.state.character!;
  }

  private redraw(): void {
    this.layer.removeAll(true);
    const c = this.character();
    const capacity = characterStats(c).carryKg;
    const weight = carriedWeightKg(c);

    this.layer.add(
      this.text(
        MARGIN,
        LAYOUT.statsY,
        `${c.fers} Fers · Charge ${weight.toFixed(1)} / ${capacity} kg · Défense +${armorBonus(c)} d’armure`,
        22,
        CSS.parchment,
      ),
    );
    // Right-aligned; on touch screens, left of the tall Fermer button.
    if (this.message) this.layer.add(this.text(LAYOUT.messageRight, LAYOUT.statsY, this.message, 20, CSS.copper, 1));

    const rows = tradeItems(c, this.npcId);
    if (rows.length === 0) this.layer.add(this.text(MARGIN, LAYOUT.rowTop, 'Ton sac est vide.', LAYOUT.rowFont, CSS.muted));
    rows.forEach((item, i) => this.drawRow(item, LAYOUT.rowTop + i * LAYOUT.rowHeight));
  }

  private equippedSlot(itemId: string): Slot | null {
    const c = this.character();
    for (const slot of ['mainGauche', 'mainDroite', 'armure'] as Slot[]) if (c.equipment[slot] === itemId) return slot;
    return null;
  }

  private drawRow(item: ItemDef, y: number): void {
    const owned = ownedCount(this.character(), item.id);
    const equippedIn = this.equippedSlot(item.id);
    const sellPrice = Math.floor(item.price * SELL_RATIO);

    this.layer.add(this.rect(y));
    const L = LAYOUT;
    const discount = this.discount();
    const price = buyPrice(item, discount);
    const deal = price < item.price ? ' (prix d’ami)' : price > item.price ? ' (prix fort)' : '';
    const label = `${item.name}${owned ? `  ×${owned}` : ''}${equippedIn ? `  (${SLOT_NAMES[equippedIn]})` : ''}  —  ${item.weightKg} kg  —  ${price} F${deal}`;
    this.layer.add(
      this.text(MARGIN + 10, y, label, L.rowFont, owned ? CSS.parchment : CSS.muted).setOrigin(0, 0.5).setFixedSize(620, 0).setAlign('left'),
    );

    let x = GAME_WIDTH - MARGIN - 10 - L.buttonWidth / 2;
    const addButton = (label: string, onClick: () => void) => {
      const { container } = addTextButton(this, x, y, label, onClick, { width: L.buttonWidth, height: L.buttonHeight, fontSize: L.buttonFont });
      this.layer.add(container);
      x -= L.buttonWidth + 10;
    };

    if (item.healHp && owned > 0) addButton('Utiliser', () => this.act(() => useConsumable(this.character(), item.id, characterStats(this.character()).maxHp), `${item.name} utilisé.`));
    if (item.slot) {
      if (equippedIn) {
        addButton('Retirer', () =>
          this.act(() => {
            unequip(this.character(), equippedIn);
            return true;
          }, `${item.name} retiré.`),
        );
      }
      else if (owned > 0) addButton('Équiper', () => this.act(() => this.equipBestSlot(item), `${item.name} équipé.`));
    }
    if (owned > 0 && !item.quest) {
      addButton(`Vendre (${sellPrice})`, () =>
        this.act(() => {
          const error = sell(this.character(), item.id, 1);
          return error ? null : true;
        }, `${item.name} vendu.`),
      );
    }
    if (this.npcId && merchantCatalogue(this.npcId).some((i) => i.id === item.id)) {
      addButton('Acheter', () =>
        this.act(() => {
          const error = buy(this.character(), item.id, 1, this.discount());
          if (error === 'trop-cher') return this.fail('Pas assez de Fers.');
          if (error === 'trop-lourd') return this.fail('Trop lourd à porter.');
          return true;
        }, `${item.name} acheté.`),
      );
    }
  }

  private equipBestSlot(item: ItemDef): boolean {
    const c = this.character();
    const slot: Slot = item.slot === 'armure' ? 'armure' : c.equipment.mainGauche ? 'mainDroite' : 'mainGauche';
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

  private rect(y: number): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 2 * MARGIN, LAYOUT.rowHeight - 6, 0x2a211c, 0.6).setStrokeStyle(1, COLORS.copper, 0.3);
  }

  private text(x: number, y: number, value: string, fontSize: number, color: string, originX = 0): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: `${fontSize}px`, color }).setOrigin(originX, 0.5);
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
