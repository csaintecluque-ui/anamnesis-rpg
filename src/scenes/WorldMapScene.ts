import Phaser from 'phaser';
import { heroKey, rngFor } from '../rules/graine';
import { performRoll, rollChance } from '../rules/dialogue';
import { SKILLS } from '../rules/attributes';
import {
  AT_PLACE,
  WORLD,
  clearEncounterFlags,
  crossingOf,
  flightFare,
  flightSky,
  flightTimeLabel,
  payFlight,
  distanceBetween,
  canWaitOut,
  encounterChecks,
  findPlace,
  knownPlaces,
  walkTheMarches,
  pickTerrain,
  rollEncounter,
  trainStation,
  storyRencontre,
  travelTimeLabel,
  waitOut,
  zoneAt,
  type RencontreDef,
  type WorldPlace,
} from '../rules/world';
import { findLocation, type GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { MOMENTS, advance, shortTime } from '../rules/time';
import { VOIE_DEPTH, startVoie, voieRecord, voieRecordLabel } from '../rules/voies';
import { filPage } from '../rules/fil';
import { onKeys, withKeyHint } from '../ui/keys';
import { Tooltip } from '../ui/tooltip';

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
const PLACE_HIT_RADIUS = HAS_MOUSE ? 28 : 40;

const INK = COLORS.ink;
const PARCHMENT = COLORS.parchment;
const COPPER = COLORS.copper;

/** Finger-sized on touch screens (docs/gdd/interface.md). */
const LAYOUT = HAS_MOUSE
  ? { panelHeight: 150, text: 20, button: { height: 48, fontSize: 20, width: 300 }, name: 20, back: { width: 220, height: 44, fontSize: 18 } }
  : { panelHeight: 210, text: 24, button: { height: 76, fontSize: 24, width: 300 }, name: 24, back: { width: 250, height: 60, fontSize: 21 } };

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
  /**
   * `moments`: the moments of the day already counted for this stretch of road (src/rules/time.ts). `flight`: an
   * airship's trip (Aetherhaven), its moments counted at once on landing, and nothing met on the way.
   */
  private trip: { place: WorldPlace; from: { x: number; y: number }; travelled: number; moments: number; flight?: number; moyen?: string } | null = null;
  private rng: () => number = Math.random;
  /** The panel's buttons, for Enter (the first) and Escape (the last) ; the place picked with Tab. */
  private panelActions: (() => void)[] = [];
  private picked = -1;
  private tooltip!: Tooltip;

  constructor() {
    super('WorldMap');
  }

  create(data: WorldMapStartData): void {
    this.state = this.registry.get('game') as GameState;
    this.pos = { x: data.x, y: data.y };
    this.trip = null;
    this.panel = [];
    this.panelActions = [];
    this.picked = -1;
    // The Marche-Mère is not where it was yesterday (src/rules/world.ts).
    walkTheMarches(this.state.time.day);

    this.drawMap();
    this.trail = this.add.graphics();
    this.drawPlaces();
    this.markLead();
    this.hero = this.makeHero();
    this.placeHero();

    this.add.rectangle(GAME_WIDTH / 2, MAP_Y / 2, GAME_WIDTH, MAP_Y, INK);
    this.add.text(GAME_WIDTH / 2, 22, WORLD.title, { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.parchment }).setOrigin(0.5);
    this.status = this.add
      .text(GAME_WIDTH / 2, 52, HAS_MOUSE ? 'Clique un lieu, ou choisis-le avec Tab et pars avec Entrée.' : 'Touche un lieu pour t’y rendre.', { fontFamily: FONT_SERIF, fontSize: '18px', color: CSS.copper })
      .setOrigin(0.5);
    this.tooltip = new Tooltip(this);
    // Clavier (« PC d'abord ») : Tab or the arrows go from place to place, Enter takes the panel's first button,
    // Escape its last one (stay, choose another place).
    onKeys(this, ['TAB', 'RIGHT', 'DOWN'], () => this.pickPlace(1));
    onKeys(this, ['LEFT', 'UP'], () => this.pickPlace(-1));
    onKeys(this, ['ENTER', 'SPACE'], () => this.panelActions[0]?.());
    onKeys(this, ['ESC'], () => this.panelActions[this.panelActions.length - 1]?.());

    const destination = data.destination ? findPlace(data.destination) : undefined;
    if (destination) this.offerTrip(destination, true);
    // Leaving a place: the whole map stays in sight; a small button in the top bar takes the hero back in.
    const at = data.at ? findPlace(data.at) : undefined;
    if (at && !destination) {
      const { width, height, fontSize } = LAYOUT.back;
      const back = addTextButton(this, GAME_WIDTH - 20 - width / 2, MAP_Y / 2, `Rentrer : ${at.name}`, () => {
        if (!this.trip) this.arrive(at);
      }, { width, height, fontSize });
      back.container.setDepth(30);
    }
  }

  update(_time: number, delta: number): void {
    if (!this.trip) return;
    const { place } = this.trip;
    const step = ((this.trip.flight ? 3 : 1) * WORLD.travel.pixelsPerSecond * delta) / 1000;
    const left = distanceBetween(this.pos, place);
    const move = Math.min(step, left);
    const before = this.trip.travelled;
    if (left > 0) {
      this.pos = { x: this.pos.x + ((place.x - this.pos.x) * move) / left, y: this.pos.y + ((place.y - this.pos.y) * move) / left };
    }
    this.trip.travelled += move;
    this.placeHero();
    this.drawTrail();
    if (this.trip.flight) {
      this.status.setText(`En ${this.trip.moyen ?? 'dirigeable'} vers ${place.name}`);
      if (move >= left) this.arrive(place);
      return;
    }
    // A quarter of a day's walk is one moment of the day (docs/gdd/temps.md).
    const moments = Math.floor(this.trip.travelled / (WORLD.travel.pixelsPerDay / MOMENTS.length));
    if (moments > this.trip.moments) {
      advance(this.state.time, moments - this.trip.moments);
      this.trip.moments = moments;
    }
    this.status.setText(`En route vers ${place.name} · ${shortTime(this.state.time)}`);

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
    // The desert of Solarix, to the south-east (the Communion): dunes over the edge of the forests.
    const dunes = seeded(3007);
    for (let i = 0; i < 70; i++) {
      const x = 860 + dunes() * 320;
      const y = 505 + dunes() * 100;
      const p = this.screen({ x, y });
      g.fillStyle([0xd8b47a, 0xc9a46a, 0xe2c48e][Math.floor(dunes() * 3)], 0.7).fillEllipse(p.x, p.y, (24 + dunes() * 30) * SCALE, (8 + dunes() * 8) * SCALE);
    }
    // The ice of Glacialis, to the north (Khrysos, under the cap): white fields over the edge of the map.
    const ice = seeded(3008);
    for (let i = 0; i < 40; i++) {
      const p = this.screen({ x: 400 + ice() * 230, y: 8 + ice() * 64 });
      g.fillStyle([0xeef4f6, 0xd8e8f0, 0xc4dce8][Math.floor(ice() * 3)], 0.8).fillEllipse(p.x, p.y, (26 + ice() * 30) * SCALE, (8 + ice() * 8) * SCALE);
    }
    // Lands beyond: written at the edge, not reachable yet.
    const known = new Set(knownPlaces(this.state.flags, this.state.quests).map((p) => p.id));
    for (const far of WORLD.distant.filter((d) => !d.remplacePar || !known.has(d.remplacePar))) {
      const p = this.screen(far);
      this.label(p.x, p.y, `${far.name}\n${far.hint}`, '#5a4a38');
    }
    g.lineStyle(3, INK, 1).strokeRect(MAP_X, MAP_Y, WORLD.width * SCALE, WORLD.height * SCALE);
    g.lineStyle(1, COPPER, 0.8).strokeRect(MAP_X + 6, MAP_Y + 6, WORLD.width * SCALE - 12, WORLD.height * SCALE - 12);
  }

  /** An italic note on a parchment patch, readable over the forests. */
  private label(x: number, y: number, text: string, color: string): void {
    const t = this.add
      .text(x, y, text, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '17px' : '19px', color, align: 'center', fontStyle: 'italic' })
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
    const all = knownPlaces(this.state.flags, this.state.quests);
    // The sleeping lines (docs/gdd/voies.md) are off the roads: no road leads there, and they get their own mark.
    const places = all.filter((p) => !p.voie && !crossingOf(p));
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
    // Railway lines (« Voyager autrement ») : a rail with its sleepers, and its name halfway.
    for (const rail of WORLD.rails ?? []) {
      const from = all.find((p) => p.id === rail.from);
      const to = all.find((p) => p.id === rail.to);
      if (!from || !to) continue;
      const a = this.screen(from);
      const b = this.screen(to);
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      const [ux, uy] = [(b.x - a.x) / length, (b.y - a.y) / length];
      g.lineStyle(3, 0x3a3238, 0.75).lineBetween(a.x, a.y, b.x, b.y);
      g.lineStyle(2, 0x3a3238, 0.6);
      for (let d = 16; d < length - 16; d += 12) {
        const [cx, cy] = [a.x + ux * d, a.y + uy * d];
        g.lineBetween(cx - uy * 5, cy + ux * 5, cx + uy * 5, cy - ux * 5);
      }
      this.label((a.x + b.x) / 2, (a.y + b.y) / 2 - 18, rail.name, '#3a3238');
    }
    for (const place of all) {
      const p = this.screen(place);
      if (place.voie) {
        // A sleeping line: a dark mouth with two rails going down into it.
        g.fillStyle(INK, 1).fillRect(p.x - 10, p.y - 10, 20, 20);
        g.lineStyle(2, COPPER, 1).strokeRect(p.x - 10, p.y - 10, 20, 20);
        g.lineStyle(2, PARCHMENT, 0.8).lineBetween(p.x - 4, p.y + 8, p.x - 2, p.y - 6).lineBetween(p.x + 4, p.y + 8, p.x + 2, p.y - 6);
        // How deep the hero went (étude H1): one pip per level, lit down to the deepest reached.
        const { visits, depth } = voieRecord(this.state, place.id);
        if (visits > 0) {
          for (let level = 1; level <= VOIE_DEPTH; level++) {
            const x = p.x + (level - (VOIE_DEPTH + 1) / 2) * 10;
            g.fillStyle(level <= depth ? COPPER : INK, 1).fillCircle(x, p.y - 17, 3.5);
            g.lineStyle(1.5, INK, 1).strokeCircle(x, p.y - 17, 3.5);
          }
        }
      } else if (place.train) {
        // A town under the ice, reached by train: an ice-blue mark, and a small star of frost beside it.
        g.fillStyle(0xc4dce8, 1).fillCircle(p.x, p.y, 11);
        g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
        g.lineStyle(2.5, 0x3a5a78, 1);
        for (const [dx, dy] of [[0, 9], [8, 5], [8, -5]]) g.lineBetween(p.x - 26 - dx, p.y - 12 - dy, p.x - 26 + dx, p.y - 12 + dy);
      } else if (place.caravane) {
        // A town that walks: a sand-coloured mark, and a small covered wagon beside it.
        g.fillStyle(0xd8b47a, 1).fillCircle(p.x, p.y, 11);
        g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
        g.fillStyle(PARCHMENT, 1).fillRect(p.x + 12, p.y - 28, 20, 12);
        g.lineStyle(1.5, INK, 1).strokeRect(p.x + 12, p.y - 28, 20, 12);
        g.fillStyle(INK, 1).fillCircle(p.x + 16, p.y - 14, 3).fillCircle(p.x + 28, p.y - 14, 3);
      } else if (place.navire) {
        // A town across the sea: a sea-blue mark, and a small sail beside it.
        g.fillStyle(0x3a7a8a, 1).fillCircle(p.x, p.y, 11);
        g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
        g.fillStyle(PARCHMENT, 1).fillTriangle(p.x + 16, p.y - 30, p.x + 16, p.y - 12, p.x + 30, p.y - 12);
        g.lineStyle(1.5, INK, 1).strokeTriangle(p.x + 16, p.y - 30, p.x + 16, p.y - 12, p.x + 30, p.y - 12);
        g.fillStyle(COPPER, 1).fillRect(p.x + 10, p.y - 11, 24, 4);
      } else if (place.dirigeable) {
        // A town in the sky: a pale-blue mark, and a small airship over it.
        g.fillStyle(0xa9c4d8, 1).fillCircle(p.x, p.y, 11);
        g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
        g.fillStyle(PARCHMENT, 1).fillEllipse(p.x, p.y - 22, 26, 11);
        g.lineStyle(1.5, INK, 1).strokeEllipse(p.x, p.y - 22, 26, 11);
        g.fillStyle(COPPER, 1).fillRect(p.x - 4, p.y - 16, 8, 4);
      } else {
        g.fillStyle(COPPER, 1).fillCircle(p.x, p.y, 11);
        g.lineStyle(3, INK, 1).strokeCircle(p.x, p.y, 11);
        g.fillStyle(PARCHMENT, 1).fillCircle(p.x, p.y, 4);
      }
      this.add
        .text(p.x, p.y + 18, place.name, {
          fontFamily: FONT_SERIF,
          fontSize: `${LAYOUT.name}px`,
          color: CSS.ink,
          stroke: CSS.parchment,
          strokeThickness: 4,
          fontStyle: place.voie ? 'italic' : 'normal',
        })
        .setOrigin(0.5, 0);
      const hit = this.add.circle(p.x, p.y, PLACE_HIT_RADIUS, 0x000000, 0.001).setInteractive({ useHandCursor: true });
      hit.on('pointerup', () => {
        if (!this.trip) this.offerPlace(place);
      });
      hit.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        const here = distanceBetween(this.pos, place) <= AT_PLACE;
        const record = place.voie ? `\n${voieRecordLabel(this.state, place.id)}` : '';
        this.tooltip.show(`${place.name}${here ? ' — tu es ici' : ` — ${this.tripLabel(place)}`}${record}`, pointer.worldX, pointer.worldY);
      });
      hit.on('pointerout', () => this.tooltip.hide());
    }
  }

  /** Le fil (docs/gdd/fil-directeur.md): a copper ring, slowly breathing, where the lead points. */
  private markLead(): void {
    const target = filPage(this.state).piste?.cible;
    if (!target) return;
    const place = WORLD.places.find((p) => p.id === target);
    const far = WORLD.distant.find((d) => d.name === target);
    const spot = place ?? far;
    if (!spot) return;
    const p = this.screen(spot);
    const radius = far ? 64 : 24;
    const ring = this.add.ellipse(p.x, p.y, radius * 2, far ? radius * 1.1 : radius * 2).setStrokeStyle(3, COPPER, 0.9).setDepth(9);
    this.tweens.add({ targets: ring, scale: 1.15, alpha: 0.45, duration: 1100, yoyo: true, repeat: -1 });
    this.add
      .text(p.x, p.y - (far ? 46 : 32), 'La piste', { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '15px' : '18px', color: CSS.ink, stroke: CSS.parchment, strokeThickness: 4, fontStyle: 'italic' })
      .setOrigin(0.5, 1)
      .setDepth(9);
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
    this.panelActions = [];
  }

  /** Tab, the arrows: the next or the previous known place, its panel open. */
  private pickPlace(step: number): void {
    if (this.trip) return;
    const places = knownPlaces(this.state.flags, this.state.quests);
    if (!places.length) return;
    this.picked = (this.picked + step + places.length) % places.length;
    this.offerPlace(places[this.picked]);
  }

  /**
   * A framed panel: a text and up to three buttons, as tall as its text needs. It opens at the bottom, or at the top
   * when what it speaks of (`about`: a place, the hero) is in the lower half: the place touched always stays in sight,
   * ringed.
   */
  private showPanel(text: string, buttons: [string, () => void][], about: { x: number; y: number } = this.pos): void {
    this.clearPanel();
    const label = this.add
      .text(GAME_WIDTH / 2, 0, text, {
        fontFamily: FONT_SERIF,
        fontSize: `${LAYOUT.text}px`,
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5, 0)
      .setDepth(21);
    const h = 16 + label.height + 14 + LAYOUT.button.height + 12;
    const spot = this.screen(about);
    const atTop = spot.y > MAP_Y + (WORLD.height * SCALE) / 2;
    const y = atTop ? MAP_Y + 4 + h / 2 : GAME_HEIGHT - h / 2 - 10;
    label.setY(y - h / 2 + 16);
    const frame = this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 60, h, INK, 0.97).setStrokeStyle(2, COPPER, 0.9).setDepth(20).setInteractive();
    const ring = this.add.circle(spot.x, spot.y, 22, COPPER, 0).setStrokeStyle(3, COPPER, 1).setDepth(19);
    this.tweens.add({ targets: ring, scale: 1.35, duration: 700, yoyo: true, repeat: -1 });
    this.panel.push(frame, label, ring);
    this.panelActions = buttons.map(([, action]) => action);
    this.tooltip?.hide();
    const gap = 30;
    // Four choices (a talk out of an encounter, test du 2026-11-06) must hold inside the frame: narrower buttons.
    const w = Math.min(LAYOUT.button.width, Math.floor((GAME_WIDTH - 100 - (buttons.length - 1) * gap) / buttons.length));
    const total = buttons.length * w + (buttons.length - 1) * gap;
    buttons.forEach(([caption, action], i) => {
      // On PC, the keys that press them: Enter for the first button, Escape for the last.
      const key = i === 0 ? 'Entrée' : i === buttons.length - 1 ? 'Échap' : '';
      const label = key ? withKeyHint(caption, key) : caption;
      const button = addTextButton(this, GAME_WIDTH / 2 - total / 2 + w / 2 + i * (w + gap), y + h / 2 - LAYOUT.button.height / 2 - 12, label, action, { ...LAYOUT.button, width: w });
      button.container.setDepth(22);
      this.panel.push(button.container);
    });
  }

  private offerPlace(place: WorldPlace): void {
    if (distanceBetween(this.pos, place) <= AT_PLACE) {
      this.showPanel(`${place.name} — ${place.description}${dangerLabel(place)}${place.voie ? `\n${voieRecordLabel(this.state, place.id)}` : ''}`, [
        [place.voie ? 'Descendre' : 'Entrer', () => this.arrive(place)],
        ['Rester sur la carte', () => this.clearPanel()],
      ], place);
      return;
    }
    this.offerTrip(place, false);
  }

  /** « environ un jour de marche », or « un jour en dirigeable ». */
  private tripLabel(place: WorldPlace): string {
    const sky = flightSky(this.state, this.pos, place);
    return sky ? flightTimeLabel(sky) : travelTimeLabel(distanceBetween(this.pos, place));
  }

  private offerTrip(place: WorldPlace, resumed: boolean): void {
    // The train du Nord (chapitre 8) leaves from Ironheart only: one goes there first.
    const station = trainStation(this.pos, place);
    if (station) {
      this.showPanel(`${place.name} — ${place.description}\nLe ${place.train!.ligne} part d’${station.name} : il faut d’abord y aller (${travelTimeLabel(distanceBetween(this.pos, station))}).`, [
        [`Partir pour ${station.name}`, () => this.depart(station)],
        ['Choisir un autre lieu', () => this.clearPanel()],
      ], place);
      return;
    }
    const sky = flightSky(this.state, this.pos, place);
    if (sky) {
      this.offerFlight(place, sky);
      return;
    }
    const time = this.tripLabel(place);
    const lead = resumed ? `Reprendre la route vers ${place.name} ?` : `${place.name} — ${place.description}${dangerLabel(place)}`;
    this.showPanel(`${lead}\n(${time})`, [
      ['Partir', () => this.depart(place)],
      ['Choisir un autre lieu', () => this.clearPanel()],
    ], place);
  }

  /**
   * The airship of the Confédération (docs/gdd/chapitre-5.md): to Aetherhaven, or from it to any known town ; the
   * first flight is paid by Hesper.
   */
  private offerFlight(place: WorldPlace, sky: WorldPlace): void {
    const fare = flightFare(this.state, sky);
    const fers = this.state.character?.fers ?? 0;
    const price = fare === 0 ? 'Hesper a payé ta place.' : `${fare} Fers la place (tu en as ${fers}).`;
    const text = `${place.name} — ${place.description}\n(${flightTimeLabel(sky)} · ${price})`;
    if (fers < fare) {
      this.showPanel(`${text}\nIl te manque de quoi payer la place.`, [['Choisir un autre lieu', () => this.clearPanel()]], place);
      return;
    }
    this.showPanel(text, [
      [{ navire: 'Embarquer', dirigeable: 'Prendre le dirigeable', caravane: 'Partir avec la caravane', train: 'Prendre le train du Nord' }[crossingOf(sky)?.moyen ?? 'dirigeable'], () => {
        if (!payFlight(this.state, sky)) return;
        this.clearPanel();
        const crossing = crossingOf(sky);
        this.trip = { place, from: { ...this.pos }, travelled: 0, moments: 0, flight: crossing?.moments ?? 4, moyen: crossing?.moyen };
      }],
      ['Choisir un autre lieu', () => this.clearPanel()],
    ], place);
  }

  private depart(place: WorldPlace): void {
    this.clearPanel();
    this.trip = { place, from: { ...this.pos }, travelled: 0, moments: 0 };
  }

  // --- Arrivals and encounters ---------------------------------------------------------------------

  private arrive(place: WorldPlace): void {
    // Even a short walk takes a moment of the day ; a flight, its own length.
    if (this.trip?.flight) advance(this.state.time, this.trip.flight);
    else if (this.trip && this.trip.moments === 0) advance(this.state.time, 1);
    this.trip = null;
    this.state.encounter = null;
    this.state.location = place.location;
    this.state.entrance = place.entrance;
    // A sleeping line: a new draw of its levels at each visit (docs/gdd/voies.md).
    if (place.voie) startVoie(this.state, place.id);
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
    const skillName = (id: string) => SKILLS.find((s) => s.id === id)?.name ?? id;
    // The die comes from a seed (the day, the encounter, what is tried, the hero): reloading changes nothing.
    const die = (what: string) => rngFor(what, this.state.time.day, r.id, heroKey(this.state.character));
    const caught = (notice: string) => this.showPanel(`Repéré ! Impossible de les éviter.\n${notice}`, [['Se défendre', () => this.startEncounter(r, destination)]]);
    // A hero of words has a way out of every fight of the road (test du 2026-11-06, décision de Cyril).
    const talk: [string, () => void][] = r.parler
      ? [
          [
            `${r.parler.label} (${skillName(r.parler.skill)} ${Math.round(rollChance(this.state, r.parler) * 100)} %)`,
            () => {
              const outcome = performRoll(this.state, r.parler!, die('parler'));
              if (outcome.success) this.showPanel(`${r.parler!.texte}\n${outcome.notice}`, [['Continuer', goOn]]);
              else caught(outcome.notice);
            },
          ],
        ]
      : [];
    // A free way out for any hero, at the cost of time (étude H2) ; last, so that Échap picks it.
    const wait: [string, () => void][] = canWaitOut(r) ? [['Attendre qu’ils passent', () => this.showPanel(waitOut(this.state), [['Continuer', goOn]])]] : [];
    this.showPanel(r.intro, [
      ['Approcher', () => this.startEncounter(r, destination)],
      [
        // The roll's own skill (Survie, Discrétion, Subterfuge…), not always Survie.
        `Contourner (${skillName(avoid.skill)} ${chance} %)`,
        () => {
          const outcome = performRoll(this.state, avoid, die('contourner'));
          if (outcome.success) this.showPanel(`Tu t’éloignes sans bruit.\n${outcome.notice}`, [['Continuer', goOn]]);
          else caught(outcome.notice);
        },
      ],
      ...talk,
      ...wait,
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

/** « Danger : ●●○ », for a sleeping line (docs/gdd/voies.md). */
function dangerLabel(place: WorldPlace): string {
  const danger = place.voie?.danger;
  return danger ? `\nDanger : ${'●'.repeat(danger)}${'○'.repeat(3 - danger)} · trois niveaux, jusqu’au terminus.` : '';
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
