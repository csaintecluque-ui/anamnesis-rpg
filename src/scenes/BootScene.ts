import Phaser from 'phaser';
import sealUrl from '../../assets/brand/logo-seal.svg?url';
import { DIALOGUES } from '../data/dialogues';
import { MAPS } from '../data/maps';
import npcData from '../data/npcs.json';
import { parseTiledMap } from '../engine/tiledMap';
import { AVATARS } from '../rules/character';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.svg('seal', sealUrl, { width: 256, height: 256 });
    // Tiles (npm run tiles), 64 × 96 frames in the order of scripts/tiles-def.mjs.
    this.load.spritesheet('tiles', 'tiles/tiles.png', { frameWidth: 64, frameHeight: 96 });
    // Large decor drawn over several cells (npm run art), as named in the maps' tileset.
    const big = new Set(Object.values(MAPS).flatMap((m) => Object.values(parseTiledMap(m).big)));
    for (const name of big) this.load.image(`decor-${name}`, `decor/${name}.png`);
    // Each look of the hero (src/data/avatars.json): portrait, and walk sheet of 64 × 96 frames (npm run walk).
    for (const avatar of AVATARS) {
      this.load.image(`avatar-${avatar.id}`, avatar.portrait);
      this.load.spritesheet(`marche-${avatar.id}`, avatar.walk, { frameWidth: 64, frameHeight: 96 });
    }
    // Dialogue portraits (npm run art).
    for (const npc of npcData) if ('portrait' in npc) this.load.image(`portrait-${npc.id}`, npc.portrait);
    // Illustrations (npm run art): the title screen's, and those of dialogue nodes.
    const illustrations = new Set(['titre']);
    for (const d of Object.values(DIALOGUES)) for (const n of Object.values(d.nodes)) if (n.illustration) illustrations.add(n.illustration);
    for (const id of illustrations) this.load.image(`illustration-${id}`, `illustrations/${id}.jpg`);
  }

  create(): void {
    this.scene.start('Title');
  }
}
