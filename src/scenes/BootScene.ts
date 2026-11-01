import Phaser from 'phaser';
import sealUrl from '../../assets/brand/logo-seal.svg?url';
import npcData from '../data/npcs.json';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.svg('seal', sealUrl, { width: 256, height: 256 });
    // Tiles (npm run tiles), 64 × 96 frames in the order of scripts/tiles-def.mjs.
    this.load.spritesheet('tiles', 'tiles/tiles.png', { frameWidth: 64, frameHeight: 96 });
    // Dialogue portraits (npm run art).
    for (const npc of npcData) if ('portrait' in npc) this.load.image(`portrait-${npc.id}`, npc.portrait);
  }

  create(): void {
    this.scene.start('Title');
  }
}
