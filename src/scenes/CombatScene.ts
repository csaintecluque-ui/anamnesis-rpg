import Phaser from 'phaser';
import { TILE_HEIGHT, screenToTile, tileToScreen, type Tile } from '../engine/iso';
import { findPath } from '../engine/pathfinding';
import { applyEffects, type Effect } from '../rules/dialogue';
import {
  ZONES,
  canAttack,
  distance,
  findEnemy,
  findZone,
  isDefeat,
  isVictory,
  makeEnemyCombatant,
  makeHeroCombatant,
  moveAlong,
  resolveAttack,
  rollInitiative,
  startTurn,
  type AttackProfile,
  type Combatant,
  type Zone,
} from '../rules/combat';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton, type TextButton } from '../ui/button';
import { DIGIT_KEYS, SHOW_KEY_HINTS, onKeys } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import type { HudScene } from './HudScene';

const COLS = 9;
const ROWS = 7;
const TOP = 70;
const BOTTOM_BAR = 150;
const LOG_Y = GAME_HEIGHT - BOTTOM_BAR - 30;

type Mode = 'move' | 'melee' | 'ranged';

export interface CombatStartData {
  /** Enemy ids from enemies.json, one combatant per entry. */
  enemyIds: string[];
  /** Applied to the live state on victory (same shape as a dialogue's effects). */
  victoryEffects: Effect[];
  /** Flag set on victory so the encounter cannot be re-triggered. */
  victoryFlag: string;
  /** Tile obstacles for flavour (rocks); purely visual and blocking in v1. */
  obstacles?: Tile[];
}

/** Turn-based combat on a small arena, GDD §5. Visuals are a stand-in: a dedicated arena rather than carving the
 *  explored map, and cover is not yet derived from terrain — see GDD §5, « Précisions d'implémentation ». */
export class CombatScene extends Phaser.Scene {
  private state!: GameState;
  private config!: CombatStartData;
  private combatants: Combatant[] = [];
  private order: Combatant[] = [];
  private turnIndex = 0;
  private obstacleTiles = new Set<string>();
  private mode: Mode = 'move';
  private zone: Zone = 'corps';
  private originX = 0;
  private originY = 0;
  private ended = false;
  private awaitingHero = false;

  private banner!: Phaser.GameObjects.Text;
  private log!: Phaser.GameObjects.Text;
  private tokens = new Map<string, { image: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text }>();
  private zoneButton?: TextButton;
  private moveButton?: TextButton;
  private meleeButton?: TextButton;
  private rangedButton?: TextButton;
  private marker!: Phaser.GameObjects.Graphics;

  constructor() {
    super('Combat');
  }

  create(data: CombatStartData): void {
    this.state = this.registry.get('game') as GameState;
    this.config = data;
    this.ended = false;
    this.mode = 'move';
    this.zone = 'corps';
    this.tokens.clear();

    const tiles = [] as Tile[];
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) tiles.push({ col, row });
    const xs = tiles.map((t) => tileToScreen(t).x);
    const ys = tiles.map((t) => tileToScreen(t).y);
    this.originX = GAME_WIDTH / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
    this.originY = TOP + 40 - Math.min(...ys);

    this.obstacleTiles = new Set((data.obstacles ?? []).map(({ col, row }) => `${col},${row}`));

    const hero = makeHeroCombatant(this.state.character!, { col: 1, row: Math.floor(ROWS / 2) });
    const spots: Tile[] = [
      { col: COLS - 2, row: Math.floor(ROWS / 2) },
      { col: COLS - 2, row: 1 },
      { col: COLS - 2, row: ROWS - 2 },
    ];
    const enemyDefs = data.enemyIds.map((id) => findEnemy(id)!);
    const enemies = enemyDefs.map((def, i) => makeEnemyCombatant(def, `${def.id}-${i}`, spots[i % spots.length]));
    this.combatants = [hero, ...enemies];
    const initiativeBonus = new Map<string, number>(enemies.map((c, i) => [c.id, enemyDefs[i].initiativeBonus]));

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.97).setInteractive();
    this.drawArena();
    this.banner = this.add
      .text(GAME_WIDTH / 2, 30, '', { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.copper })
      .setOrigin(0.5);
    this.log = this.add
      .text(GAME_WIDTH / 2, LOG_Y, '', { fontFamily: FONT_SERIF, fontSize: '20px', color: CSS.parchment, align: 'center', wordWrap: { width: 1100 } })
      .setOrigin(0.5);
    this.marker = this.add.graphics().setDepth(5000);

    for (const c of this.combatants) this.addToken(c);
    this.buildActionBar();

    this.input.on('pointerup', (p: Phaser.Input.Pointer) => this.onTap(p));

    const bonuses = Object.fromEntries(
      this.combatants.map((c) => [c.id, c.side === 'heroes' ? this.state.character!.attributes.agility - 3 : initiativeBonus.get(c.id)!]),
    );
    this.order = rollInitiative(this.combatants, bonuses);
    this.turnIndex = -1;
    this.nextTurn();
  }

  // --- Arena ---------------------------------------------------------------

  private center(tile: Tile): { x: number; y: number } {
    const p = tileToScreen(tile);
    return { x: this.originX + p.x, y: this.originY + p.y };
  }

  private feet(tile: Tile): { x: number; y: number } {
    const c = this.center(tile);
    return { x: c.x, y: c.y + TILE_HEIGHT / 2 };
  }

  private drawArena(): void {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const f = this.feet({ col, row });
        const blocked = this.obstacleTiles.has(`${col},${row}`);
        this.add.image(f.x, f.y, 'tiles', blocked ? this.frames.rocher : this.frames.herbe).setOrigin(0.5, 1).setDepth(f.y);
      }
    }
  }

  private get frames(): Record<string, number> {
    return (this.registry.get('tileFrames') as Record<string, number>) ?? {};
  }

  private addToken(c: Combatant): void {
    const f = this.feet(c.tile);
    const frame = c.side === 'heroes' ? this.frames.heros : this.frames.pnj;
    const image = this.add.image(f.x, f.y, 'tiles', frame).setOrigin(0.5, 1).setDepth(f.y + 1);
    if (c.side === 'enemies') image.setTint(c.id.startsWith('golem') ? 0x8a8276 : 0xb5653a);
    const label = this.add
      .text(f.x, f.y - 60, '', { fontFamily: FONT_SERIF, fontSize: '15px', color: CSS.parchment, align: 'center' })
      .setOrigin(0.5, 1);
    this.tokens.set(c.id, { image, label });
    this.refreshToken(c);
  }

  private refreshToken(c: Combatant): void {
    const token = this.tokens.get(c.id);
    if (!token) return;
    const f = this.feet(c.tile);
    token.image.setPosition(f.x, f.y).setDepth(f.y + 1).setAlpha(c.defeated ? 0.25 : 1);
    token.label.setPosition(f.x, f.y - 60).setText(`${c.name}\nPV ${c.hp}/${c.maxHp}`);
  }

  private walkable = (tile: Tile): boolean => {
    if (tile.col < 0 || tile.row < 0 || tile.col >= COLS || tile.row >= ROWS) return false;
    if (this.obstacleTiles.has(`${tile.col},${tile.row}`)) return false;
    return !this.combatants.some((c) => !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);
  };

  // --- Turn loop -------------------------------------------------------------

  private current(): Combatant {
    return this.order[this.turnIndex];
  }

  private hero(): Combatant {
    return this.combatants[0];
  }

  private nextTurn(): void {
    if (this.checkOutcome()) return;
    do {
      this.turnIndex = (this.turnIndex + 1) % this.order.length;
    } while (this.current().defeated);
    const c = this.current();
    startTurn(c);
    this.banner.setText(`Tour de ${c.name}${c.status.stunned ? ' (étourdi·e)' : c.status.slowed ? ' (ralenti·e)' : ''}`);
    this.refreshAll();

    if (c.side === 'heroes') {
      this.mode = 'move';
      this.awaitingHero = true;
      this.updateActionBar();
    } else {
      this.awaitingHero = false;
      this.updateActionBar();
      this.time.delayedCall(400, () => this.runEnemyTurn(c));
    }
  }

  private runEnemyTurn(enemy: Combatant): void {
    let guard = 0;
    while (enemy.actionPoints > 0 && !enemy.defeated && !this.hero().defeated && guard++ < 10) {
      const attack = enemy.attacks[0];
      if (canAttack(enemy, attack, this.hero())) {
        this.performAttack(enemy, attack, this.hero(), 'corps', 0);
        if (this.checkOutcome()) return;
        continue;
      }
      const path = this.pathAdjacentTo(enemy.tile, this.hero().tile);
      if (!path || path.length === 0) break;
      moveAlong(enemy, path);
      this.refreshToken(enemy);
    }
    this.time.delayedCall(300, () => this.nextTurn());
  }

  private pathAdjacentTo(from: Tile, target: Tile): Tile[] | null {
    const candidates = [-1, 0, 1]
      .flatMap((dc) => [-1, 0, 1].map((dr) => ({ col: target.col + dc, row: target.row + dr })))
      .filter((t) => (t.col !== target.col || t.row !== target.row) && this.walkable(t));
    let best: Tile[] | null = null;
    for (const tile of candidates) {
      if (tile.col === from.col && tile.row === from.row) return [];
      const p = findPath(from, tile, this.walkable);
      if (p && (!best || p.length < best.length)) best = p;
    }
    return best;
  }

  private checkOutcome(): boolean {
    if (this.ended) return true;
    if (isVictory(this.combatants)) {
      this.ended = true;
      this.onVictory();
      return true;
    }
    if (isDefeat(this.combatants)) {
      this.ended = true;
      this.onDefeat();
      return true;
    }
    return false;
  }

  // --- Hero actions ------------------------------------------------------

  private onTap(pointer: Phaser.Input.Pointer): void {
    if (!this.awaitingHero || this.ended) return;
    const tile = screenToTile({ x: pointer.worldX - this.originX, y: pointer.worldY - this.originY });
    const target = this.combatants.find((c) => c.side === 'enemies' && !c.defeated && c.tile.col === tile.col && c.tile.row === tile.row);

    if (target && this.mode !== 'move') {
      this.tryAttack(target);
      return;
    }
    if (this.mode === 'move' && this.walkable(tile)) {
      const hero = this.hero();
      const path = findPath(hero.tile, tile, this.walkable);
      if (!path) return;
      moveAlong(hero, path);
      this.refreshToken(hero);
      this.marker.clear();
      this.updateActionBar();
    }
  }

  private tryAttack(target: Combatant): void {
    const hero = this.hero();
    const attack = hero.attacks.find((a) => (this.mode === 'melee' ? a.weaponId === 'epee-longue' : a.weaponId === 'arc'))!;
    if (!canAttack(hero, attack, target)) {
      this.appendLog(distance(hero.tile, target.tile) > attack.range ? 'Hors de portée.' : 'Pas assez de PA.');
      return;
    }
    this.performAttack(hero, attack, target, this.zone, 0);
    this.updateActionBar();
    this.checkOutcome();
  }

  private performAttack(attacker: Combatant, attack: AttackProfile, target: Combatant, zone: Zone, cover: number): void {
    const result = resolveAttack(attacker, attack, target, zone, cover);
    this.refreshToken(attacker);
    this.refreshToken(target);
    const zoneLabel = zone === 'corps' ? '' : ` [${findZone(zone).label}]`;
    if (result.fumble) this.appendLog(`${attacker.name} rate son attaque (échec critique).`);
    else if (!result.hit) this.appendLog(`${attacker.name} attaque${zoneLabel} ${target.name} : raté.`);
    else {
      const crit = result.critical ? ' (critique !)' : '';
      this.appendLog(`${attacker.name} touche${zoneLabel} ${target.name} : ${result.damage} dégâts${crit}.`);
      if (result.defeated) this.appendLog(target.defeatText);
      else if (result.zoneEffect === 'stunned') this.appendLog(`${target.name} est étourdi·e.`);
      else if (result.zoneEffect === 'disarmed') this.appendLog(`${target.name} est désarmé·e.`);
      else if (result.zoneEffect === 'slowed') this.appendLog(`${target.name} est ralenti·e.`);
    }
  }

  private appendLog(line: string): void {
    this.log.setText(line);
  }

  // --- UI ------------------------------------------------------------------

  private buildActionBar(): void {
    const y = GAME_HEIGHT - BOTTOM_BAR / 2;
    this.moveButton = addTextButton(this, 150, y, 'Déplacer', () => this.setMode('move'), { width: 200, height: 76 });
    this.meleeButton = addTextButton(this, 370, y, 'Mêlée', () => this.setMode('melee'), { width: 180, height: 76 });
    this.rangedButton = addTextButton(this, 560, y, 'Tir', () => this.setMode('ranged'), { width: 180, height: 76 });
    this.zoneButton = addTextButton(this, 760, y, '', () => this.cycleZone(), { width: 200, height: 76 });
    addTextButton(this, 970, y, 'Fin du tour', () => this.endHeroTurn(), { width: 220, height: 76 });
    addTextButton(this, GAME_WIDTH - 110, y, 'Fuir', () => this.flee(), { width: 180, height: 76 });
    this.updateActionBar();

    // No shortcut for Fuir: leaving a fight should never happen by a stray key press.
    onKeys(this, DIGIT_KEYS[0], () => this.setMode('move'));
    onKeys(this, DIGIT_KEYS[1], () => this.setMode('melee'));
    onKeys(this, DIGIT_KEYS[2], () => this.setMode('ranged'));
    onKeys(this, ['Z'], () => this.cycleZone());
    onKeys(this, ['SPACE'], () => this.endHeroTurn());
    if (SHOW_KEY_HINTS) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 16, 'Clavier : 1 Déplacer · 2 Mêlée · 3 Tir · Z zone visée · Espace fin du tour', {
          fontFamily: FONT_SERIF,
          fontSize: '16px',
          color: CSS.muted,
        })
        .setOrigin(0.5);
    }
  }

  private setMode(mode: Mode): void {
    if (!this.awaitingHero) return;
    this.mode = mode;
    this.updateActionBar();
  }

  private cycleZone(): void {
    const i = ZONES.findIndex((z) => z.id === this.zone);
    this.zone = ZONES[(i + 1) % ZONES.length].id;
    this.updateActionBar();
  }

  private endHeroTurn(): void {
    if (!this.awaitingHero) return;
    this.awaitingHero = false;
    this.marker.clear();
    this.nextTurn();
  }

  private flee(): void {
    if (this.ended) return;
    this.ended = true;
    this.appendLog('Tu te replies.');
    this.closeAfter(false, () => {});
  }

  private updateActionBar(): void {
    const hero = this.hero();
    this.zoneButton?.setLabel(`Zone : ${findZone(this.zone).label}`);
    this.moveButton?.setLabel(this.mode === 'move' ? '▶ Déplacer' : 'Déplacer');
    this.meleeButton?.setLabel(this.mode === 'melee' ? '▶ Mêlée' : 'Mêlée');
    this.rangedButton?.setLabel(this.mode === 'ranged' ? '▶ Tir' : 'Tir');
    if (this.awaitingHero) this.banner.setText(`${hero.name} · PA ${hero.actionPoints}/${hero.maxActionPoints} · PV ${hero.hp}/${hero.maxHp}`);
  }

  private refreshAll(): void {
    for (const c of this.combatants) this.refreshToken(c);
  }

  // --- Outcome ---------------------------------------------------------------

  private onVictory(): void {
    this.appendLog('Combat gagné.');
    const notices = applyEffects(this.state, [...this.config.victoryEffects]);
    this.state.flags[this.config.victoryFlag] = true;
    this.closeAfter(false, (hud) => {
      if (notices.length) hud.toast(notices.join('   ·   '));
    });
  }

  private onDefeat(): void {
    this.appendLog(`${this.hero().name} est mis hors de combat.`);
    this.state.character!.hp = 1;
    this.state.location = findLocation('gardebois')!.id;
    this.state.entrance = 'entree';
    this.closeAfter(true, (hud) => hud.toast('Ilyane te ramène au Marché des Lisières le temps de reprendre des forces.'));
  }

  private closeAfter(restart: boolean, onHud: (hud: HudScene) => void): void {
    this.time.delayedCall(1400, () => {
      this.scene.stop();
      if (restart) {
        this.scene.stop('Hud');
        this.scene.stop('Map');
        this.scene.start('Map');
      } else {
        this.scene.resume('Map');
        this.scene.resume('Hud');
        onHud(this.scene.get('Hud') as HudScene);
      }
    });
  }
}
