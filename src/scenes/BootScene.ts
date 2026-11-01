import Phaser from 'phaser';
import sealUrl from '../../assets/brand/logo-seal.svg?url';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.svg('seal', sealUrl, { width: 256, height: 256 });
    // Placeholder tiles (npm run tiles), 64 × 96 frames in the order of scripts/tiles-def.mjs.
    this.load.spritesheet('tiles', 'tiles/tiles.png', { frameWidth: 64, frameHeight: 96 });
  }

  create(): void {
    this.scene.start('Title');
  }
}
