import Phaser from 'phaser';
import npcData from '../data/npcs.json';
import { characterStats, type Character, type Slot } from '../rules/character';
import {
  ITEMS,
  SELL_RATIO,
  armorBonus,
  buy,
  carriedWeightKg,
  equip,
  ownedCount,
  sell,
  unequip,
  useConsumable,
  type ItemDef,
} from '../rules/inventory';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const MARGIN = 60;
const STATS_Y = 160;
const ROW_TOP = 198;
const ROW_HEIGHT = 60;

/** Buy, sell, equip and use items — docs/gdd/inventaire.md. Every trader sells the same small catalogue for now (à valider). */
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
    this.add.rectangle(0, 100, GAME_WIDTH, GAME_HEIGHT - 100, COLORS.ink, 0.96).setOrigin(0, 0).setStrokeStyle(2, COLORS.copper, 0.7);

    const npc = this.npcId ? npcData.find((n) => n.id === this.npcId) : undefined;
    const title = this.npcId ? `L’étal ${npc?.name ?? ''}` : 'Inventaire';
    this.add.text(MARGIN, 124, title, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.copper });

    addTextButton(this, GAME_WIDTH - 130, 130, withKeyHint('Fermer', 'Échap'), () => this.close(), { width: 220, height: 64, fontSize: 24 });
    onKeys(this, ['ESC'], () => this.close());
    if (!this.npcId) onKeys(this, ['I'], () => this.close());

    this.layer = this.add.container(0, 0);
    this.redraw();
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
        STATS_Y,
        `${c.fers} Fers · Charge ${weight.toFixed(1)} / ${capacity} kg · Défense +${armorBonus(c)} d’armure`,
        22,
        CSS.parchment,
      ),
    );
    // Right-aligned, but left of the Fermer button.
    if (this.message) this.layer.add(this.text(GAME_WIDTH - 260, STATS_Y, this.message, 20, CSS.copper, 1));

    ITEMS.forEach((item, i) => this.drawRow(item, ROW_TOP + i * ROW_HEIGHT));
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
    const label = `${item.name}${owned ? `  ×${owned}` : ''}${equippedIn ? `  (équipé)` : ''}  —  ${item.weightKg} kg  —  ${item.price} F`;
    this.layer.add(
      this.text(MARGIN + 10, y, label, 20, owned ? CSS.parchment : CSS.muted).setOrigin(0, 0.5).setFixedSize(620, ROW_HEIGHT).setAlign('left'),
    );

    let x = GAME_WIDTH - MARGIN - 90;
    const addButton = (label: string, onClick: () => void) => {
      const { container } = addTextButton(this, x, y, label, onClick, { width: 150, height: 48, fontSize: 18 });
      this.layer.add(container);
      x -= 160;
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
    if (owned > 0) {
      addButton(`Vendre (${sellPrice})`, () =>
        this.act(() => {
          const error = sell(this.character(), item.id, 1);
          return error ? null : true;
        }, `${item.name} vendu.`),
      );
    }
    if (this.npcId) {
      addButton('Acheter', () =>
        this.act(() => {
          const error = buy(this.character(), item.id, 1);
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
    return this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 2 * MARGIN, ROW_HEIGHT - 6, 0x2a211c, 0.6).setStrokeStyle(1, COLORS.copper, 0.3);
  }

  private text(x: number, y: number, value: string, fontSize: number, color: string, originX = 0): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: `${fontSize}px`, color }).setOrigin(originX, 0.5);
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.stop();
  }
}
