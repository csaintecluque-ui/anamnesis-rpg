import Phaser from 'phaser';
import { performRoll, rollChance } from '../rules/dialogue';
import {
  WORLD,
  clearEncounterFlags,
  distanceBetween,
  encounterChecks,
  findPlace,
  knownPlaces,
  pickTerrain,
  rollEncounter,
  storyRencontre,
  travelTimeLabel,
  zoneAt,
  type RencontreDef,
  type WorldPlace,
} from '../rules/world';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';

/** Where the hero stands when the world map opens: a place they leave, or the spot of an encounter. */
export interface WorldMapStartData {
  x: number;
  y: number;
  /** The trip interrupted by an encounter, offered again. */
  destination: string | null;
  /** The place the hero is leaving, if any. */
  at?: string;
}

const MAP_X = 40;
const MAP_Y = 70;
const MAP_W = GAME_WIDTH - 2 * MAP_X;
const MAP_H = GAME_HEIGHT - MAP_Y - 30;
const SCALE = Math.min(MAP_W / WORLD.width, MAP_H / WORLD.height);
/** A place counts as reached within this distance (world units). */
const AT_PLACE = 12;
const PLACE_HIT_RADIUS = HAS_MOUSE ? 28 : 40;

const INK = COLORS.ink;
const PARCHMENT = COLORS.parchment;
const COPPER = COLORS.copper;

/** Finger-sized on touch screens (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panelHeight: 150, text: 20, button: { height: 48, fontSize: 20, width: 230 }, name: 20 }
  : { panelHeight: 210, text: 24, button: { height: 76, fontSize: 24, width: 300 }, name: 24 };

/**
 * The world map (docs/gdd/carte-du-monde.md), like the travel maps of the reference CRPGs: touch a known place, the
 * hero walks there across the map, and the road may bring a random encounter. Provisional visuals drawn by code.
 */
export class WorldMapScene extends Phaser.Scene {
  private state!: GameState;
  private pos = { x: 0, y: 0 };
  private hero!: Phaser.GameObjects.Container;
  private trail!: Phaser.GameObjects.Graphics;
  private panel: Phaser.GameObjects.GameObject[] = [];
  private status!: Phaser.GameObjects.Text;
  private trip: { place: WorldPlace; from: { x: number; y: number }; travelled: number } | null = null;
  private rng: () => number = Math.random;

  constructor() {
    super('WorldMap');
  }

  create(data: WorldMapStartData): void {
    this.state = this.registry.get('game') as GameState;
    this.pos = { x: data.x, y: data.y };
    this.trip = null;
    this.panel = [];

    this.drawMap();
    this.trail = this.add.graphics();
    this.drawPlaces();
    this.hero = this.makeHero();
    this.placeHero();

    this.add.rectangle(GAME_WIDTH / 2, MAP_Y / 2, GAME_WIDTH, MAP_Y, INK);
    this.add.text(GAME_WIDTH / 2, 22, WORLD.title, { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.parchment }).setOrigin(0.5);
    this.status = this.add
      .text(GAME_WIDTH / 2, 52, 'Touche un lieu pour t’y rendre.', { fontFamily: FONT_SERIF, fontSize: '18px', color: CSS.copper })
      .setOrigin(0.5);

    const destination = data.destination ? findPlace(data.destination) : undefined;
    if (destination) this.offerTrip(destination, true);
    else if (data.at) this.offerPlace(findPlace(data.at)!);
  }

  update(_time: number, delta: number): void {
    this.state.playTimeSeconds += delta / 1000;
    if (!this.trip) return;
    const { place } = this.trip;
    const step = (WORLD.travel.pixelsPerSecond * delta) / 1000;
    const left = distanceBetween(this.pos, place);
    const move = Math.min(step, left);
    const before = this.trip.travelled;
    if (left > 0) {
      this.pos = { x: this.pos.x + ((place.x - this.pos.x) * move) / left, y: this.pos.y + ((place.y - this.pos.y) * move) / left };
    }
    this.trip.travelled += move;
    this.placeHero();
    this.drawTrail();
    const day = Math.max(1, Math.ceil(this.trip.travelled / WORLD.travel.pixelsPerDay));
    this.status.setText(`En route vers ${place.name} · jour ${day}`);

    for (let i = encounterChecks(before, this.trip.travelled); i > 0; i--) {
      const zone = zoneAt(this.pos.x, this.pos.y);
      const met = storyRencontre(this.state, zone) ?? rollEncounter(zone, this.rng);
      if (met) {
        this.meet(met);
        return;
      }
    }
    if (move >= left) this.arrive(place);
  }

  // --- Drawing (provisional, docs/gdd/carte-du-monde.md) ----------------------------------------

  private screen(p: { x: number; y: number }): { x: number; y: number } {
    return { x: MAP_X + p.x * SCALE, y: MAP_Y + p.y * SCALE };
  }

  private drawMap(): void {
    const g = this.add.graphics();
    g.fillStyle(INK, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(PARCHMENT, 1).fillRect(MAP_X, MAP_Y, WORLD.width * SCALE, WORLD.height * SCALE);
    // Forests of Verdantis: soft green clumps, from a fixed seed so the map never changes.
    const rng = seeded(3000);
    const margin = 14;
    for (let i = 0; i < 520; i++) {
      const r = 8 + rng() * 16;
      const x = margin + r + rng() * (WORLD.width - 2 * (margin + r));
      const y = margin + r + rng() * (WORLD.height - 2 * (margin + r));
      const shade = [0x9bb07a, 0x86a067, 0xa9bd88, 0x7d9a5e][Math.floor(rng() * 4)];
      if (x > 700 && y < 110) continue; // les monts de Ferros, au nord-est
      const p = this.screen({ x, y });
      g.fillStyle(shade, 0.55).fillCircle(p.x, p.y, r * SCALE);
    }
    // The border of Ferros (the lisière zone), dashed, and mountains beyond it.
    const lisiere = WORLD.zones.find((z) => z.id === 'lisiere');
    if (lisiere) {
      g.lineStyle(2, COPPER, 0.9);
      const a = this.screen({ x: lisiere.x0, y: lisiere.y0 });
      const b = this.screen({ x: lisiere.x1, y: lisiere.y1 });
      for (let t = 0; t < 1; t += 0.04) {
        const x0 = a.x + (b.x - a.x) * t;
        const y0 = a.y + (b.y - a.y) * t * t;
        const x1 = a.x + (b.x - a.x) * (t + 0.02);
        const y1 = a.y + (b.y - a.y) * (t + 0.02) * (t + 0.02);
        g.lineBetween(x0, y0, x1, y1);
      }
      for (let i = 0; i < 8; i++) {
        const p = this.screen({ x: 820 + i * 46, y: 44 + (i % 2) * 24 });
        g.fillStyle(0x8a7f74, 0.8).fillTriangle(p.x - 18, p.y + 16, p.x, p.y - 16, p.x + 18, p.y + 16);
        g.lineStyle(1, INK, 0.6).strokeTriangle(p.x - 18, p.y + 16, p.x, p.y - 16, p.x + 18, p.y + 16);
      }
      const label = this.screen({ x: lisiere.x1 - 150, y: lisiere.y1 - 40 });
      this.label(label.x, label.y, lisiere.name, '#7a4a2a');
    }
    // Lands beyond: written at the edge, not reachable yet.
    for (const far of WORLD.distant) {
      const p = this.screen(far);
      this.label(p.x, p.y, `${far.name}\n${far.hint}`, '#5a4a38');
    }
    g.lineStyle(3, INK, 1).strokeRect(MAP_X, MAP_Y, WORLD.width * SCALE, WORLD.height * SCALE);
    g.lineStyle(1, COPPER, 0.8).strokeRect(MAP_X + 6, MAP_Y + 6, WORLD.width * SCALE - 12, WORLD.height * SCALE - 12);
  }

  /** An italic note on a parchment patch, readable over the forests. */
  private label(x: number, y: number, text: string, color: string): void {
    const t = this.add
      .text(x, y, text, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '15px' : '19px', color, align: 'center', fontStyle: 'italic' })
      .setOrigin(0.5);
    const left = MAP_X + 10 + t.width / 2;
    const right = MAP_X + WORLD.width * SCALE - 10 - t.width / 2;
    t.setX(Math.min(right, Math.max(left, x)));
    // Above the panel that opens at the bottom when a place is touched, so it never hides a far land.
    t.setY(Math.min(y, GAME_HEIGHT - LAYOUT.panelHeight - 12 - t.height / 2));
    this.add.rectangle(t.x, t.y, t.width + 14, t.height + 8, PARCHMENT, 0.85).setStrokeStyle(1, 0x8a7a66, 0.6);
    t.setDepth(1);
  }

  private drawPlaces(): void {
    const g = this.add.graphics();
    const places = knownPlaces(this.state.flags, this.state.quests);
    // Known roads between places: a faint dotted line.
    g.fillStyle(0x6b4a32, 0.5);
    for (let i = 0; i < places.length; i++) {
      for (let j = i + 1; j < places.length; j++) {
        const a = this.screen(places[i]);
        const b = this.screen(places[j]);
        const n = Math.floor(Math.hypot(b.x - a.x, b.y - a.y) / 14);
        for (let k = 1; k < n; k++) g.fillCircle(a.x + ((b.x - a.x) * k) / n, a.y + ((b.y - a.y) * k) / n, 2);
      }
    }
    for (const place of places) {
      const p = this.screen(place);
      g.fillStyle(COPPER, 1).fillCircle(p.x, p.y, 11);
      g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
      g.fillStyle(PARCHMENT, 1).fillCircle(p.x, p.y, 4);
      this.add
        .text(p.x, p.y + 18, place.name, { fontFamily: FONT_SERIF, fontSize: `${LAYOUT.name}px`, color: CSS.ink, stroke: CSS.parchment, strokeThickness: 4 })
        .setOrigin(0.5, 0);
      const hit = this.add.circle(p.x, p.y, PLACE_HIT_RADIUS, 0x000000, 0.001).setInteractive({ useHandCursor: true });
      hit.on('pointerup', () => {
        if (!this.trip) this.offerPlace(place);
      });
    }
  }

  private makeHero(): Phaser.GameObjects.Container {
    const ring = this.add.circle(0, 0, 14, COPPER, 0.25).setStrokeStyle(2, COPPER, 1);
    const dot = this.add.circle(0, 0, 6, INK, 1).setStrokeStyle(2, PARCHMENT, 1);
    this.tweens.add({ targets: ring, scale: 1.5, alpha: 0.2, duration: 900, yoyo: true, repeat: -1 });
    return this.add.container(0, 0, [ring, dot]).setDepth(10);
  }

  private placeHero(): void {
    const p = this.screen(this.pos);
    this.hero.setPosition(p.x, p.y);
  }

  private drawTrail(): void {
    if (!this.trip) return;
    const a = this.screen(this.trip.from);
    const b = this.screen(this.pos);
    this.trail.clear().lineStyle(3, COPPER, 0.8).lineBetween(a.x, a.y, b.x, b.y);
  }

  // --- Panels -----------------------------------------------------------------------------------

  private clearPanel(): void {
    for (const o of this.panel) o.destroy();
    this.panel = [];
  }

  /** A framed panel at the bottom: a text and up to three buttons. */
  private showPanel(text: string, buttons: [string, () => void][]): void {
    this.clearPanel();
    const h = LAYOUT.panelHeight;
    const y = GAME_HEIGHT - h / 2 - 10;
    const frame = this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 60, h, INK, 0.97).setStrokeStyle(2, COPPER, 0.9).setDepth(20).setInteractive();
    const label = this.add
      .text(GAME_WIDTH / 2, y - h / 2 + 16, text, {
        fontFamily: FONT_SERIF,
        fontSize: `${LAYOUT.text}px`,
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5, 0)
      .setDepth(21);
    this.panel.push(frame, label);
    const w = LAYOUT.button.width;
    const gap = 30;
    const total = buttons.length * w + (buttons.length - 1) * gap;
    buttons.forEach(([caption, action], i) => {
      const button = addTextButton(this, GAME_WIDTH / 2 - total / 2 + w / 2 + i * (w + gap), y + h / 2 - LAYOUT.button.height / 2 - 12, caption, action, LAYOUT.button);
      button.container.setDepth(22);
      this.panel.push(button.container);
    });
  }

  private offerPlace(place: WorldPlace): void {
    if (distanceBetween(this.pos, place) <= AT_PLACE) {
      this.showPanel(`${place.name} — ${place.description}`, [
        [`Entrer`, () => this.arrive(place)],
        ['Rester sur la carte', () => this.clearPanel()],
      ]);
      return;
    }
    this.offerTrip(place, false);
  }

  private offerTrip(place: WorldPlace, resumed: boolean): void {
    const time = travelTimeLabel(distanceBetween(this.pos, place));
    const lead = resumed ? `Reprendre la route vers ${place.name} ?` : `${place.name} — ${place.description}`;
    this.showPanel(`${lead}\n(${time})`, [
      ['Partir', () => this.depart(place)],
      ['Choisir un autre lieu', () => this.clearPanel()],
    ]);
  }

  private depart(place: WorldPlace): void {
    this.clearPanel();
    this.trip = { place, from: { ...this.pos }, travelled: 0 };
  }

  // --- Arrivals and encounters ---------------------------------------------------------------------

  private arrive(place: WorldPlace): void {
    this.trip = null;
    this.state.encounter = null;
    this.state.location = place.location;
    this.state.entrance = place.entrance;
    this.scene.start('Map');
  }

  /** An encounter on the road: approach it, or skirt it (a Survie roll against hostile ones). */
  private meet(r: RencontreDef): void {
    const destination = this.trip?.place ?? null;
    this.trip = null;
    if (r.story) this.state.flags[r.story.flag] = true;
    this.status.setText('Rencontre !');
    const goOn = () => {
      if (destination) this.depart(destination);
      else this.clearPanel();
    };
    if (!r.hostile || !r.avoid) {
      this.showPanel(r.intro, [
        ['Approcher', () => this.startEncounter(r, destination)],
        ['Passer son chemin', goOn],
      ]);
      return;
    }
    const avoid = { skill: r.avoid.skill, difficulty: r.avoid.difficulty };
    const chance = Math.round(rollChance(this.state, avoid) * 100);
    this.showPanel(r.intro, [
      ['Approcher', () => this.startEncounter(r, destination)],
      [
        `Contourner (Survie ${chance} %)`,
        () => {
          const outcome = performRoll(this.state, avoid);
          if (outcome.success) this.showPanel(`Tu t’éloignes sans bruit.\n${outcome.notice}`, [['Continuer', goOn]]);
          else this.showPanel(`Repéré ! Impossible de les éviter.\n${outcome.notice}`, [['Se défendre', () => this.startEncounter(r, destination)]]);
        },
      ],
    ]);
  }

  private startEncounter(r: RencontreDef, destination: WorldPlace | null): void {
    clearEncounterFlags(this.state.flags);
    const terrain = pickTerrain(r, this.rng);
    this.state.encounter = { id: r.id, x: Math.round(this.pos.x), y: Math.round(this.pos.y), destination: destination?.id ?? null };
    this.state.location = terrain;
    this.state.entrance = findLocation(terrain)?.entrance ?? 'entree';
    this.scene.start('Map');
  }
}

/** Fixed-seed RNG (same as scripts/build-maps.mjs) for decor that must not change between visits. */
function seeded(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
