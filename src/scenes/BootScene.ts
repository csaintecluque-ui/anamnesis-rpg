import Phaser from 'phaser';
import sealUrl from '../../assets/brand/logo-seal.svg?url';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.svg('seal', sealUrl, { width: 256, height: 256 });
  }

  create(): void {
    this.scene.start('Title');
  }
}
