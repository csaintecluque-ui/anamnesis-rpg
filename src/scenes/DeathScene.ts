import Phaser from 'phaser';
import { saveStore } from '../save/browser';
import { findLocation } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { formatDate } from '../rules/time';
import { characterStats } from '../rules/character';
import { reveilLabel, reveilPrice, wakeUpAtInn } from '../rules/repos';
import type { GameState } from '../state/gameState';
import { PENDING_NOTICE } from './HudScene';
import { AUTO_LOCK } from '../save/autosave';

export interface DeathSceneData {
  /** The hero's name, and how the fight ended. */
  name: string;
  cause: string;
}

/**
 * The hero is dead (décision de Cyril, 2026-11-02 : « je suis d'accord sur la mort » ; docs/univers/ton.md). Two ways
 * back (décision de Cyril, 2026-11-03 ; étude, I1): the last save (the game saves at every place, with the PV one had
 * there), or waking up at the inn of the last town, healed, for an ordinary Récit (src/rules/repos.ts). The second one
 * frees a hero saved at 4 PV in front of the Golem.
 */
export class DeathScene extends Phaser.Scene {
  constructor() {
    super('Death');
  }

  create(data: DeathSceneData): void {
    const cx = GAME_WIDTH / 2;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 1).setOrigin(0, 0);
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x5a0c0c, 0.25).setOrigin(0, 0);
    this.add
      .text(cx, 170, `Ici s’arrête le voyage ${/^[aeiouyàâéèêëîïôûüh]/i.test(data.name) ? 'd’' : 'de '}${data.name}.`, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '40px' : '46px', color: CSS.parchment, align: 'center', wordWrap: { width: 1100 } })
      .setOrigin(0.5);
    this.add
      .text(cx, 250, data.cause, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '22px' : '28px', color: CSS.muted, align: 'center', wordWrap: { width: 1000 } })
      .setOrigin(0.5);

    const save = saveStore.latest();
    const button = { width: HAS_MOUSE ? 760 : 900, height: HAS_MOUSE ? 60 : 80, fontSize: HAS_MOUSE ? 22 : 28 };
    const step = HAS_MOUSE ? 80 : 100;
    let y = 340;
    if (save) {
      const place = findLocation(save.state.location)?.name ?? '';
      const when = save.state.time ? `, ${formatDate(save.state.time)}` : '';
      // The PV one had there: resuming in front of the Golem at 4 PV is a choice made knowingly.
      const hero = save.state.character;
      const hp = hero ? ` · PV ${hero.hp} / ${characterStats(hero).maxHp}` : '';
      this.add
        .text(cx, y, `Dernière sauvegarde : ${place}${when}${hp}.`, { fontFamily: FONT_SERIF, fontSize: HAS_MOUSE ? '20px' : '24px', color: CSS.copper, align: 'center', wordWrap: { width: 1100 } })
        .setOrigin(0.5);
      y += step;
      const resume = () => {
        const location = findLocation(save.state.location);
        if (!location || !save.state.character) return this.scene.start('Title');
        this.registry.set('game', structuredClone(save.state));
        this.registry.set(AUTO_LOCK, true);
        this.scene.start(location.scene);
      };
      addTextButton(this, cx, y, withKeyHint('Reprendre à la dernière sauvegarde', 'Entrée'), resume, button);
      onKeys(this, ['ENTER', 'SPACE'], resume);
      y += step;
    }
    // The state as the fight left it: the hero is carried to the inn of the last town.
    const state = this.registry.get('game') as GameState | undefined;
    if (state?.character) {
      const wake = () => {
        this.registry.set(PENDING_NOTICE, wakeUpAtInn(state));
        this.scene.start('Map');
      };
      addTextButton(this, cx, y, withKeyHint(reveilLabel(reveilPrice(state)), 'R'), wake, button);
      onKeys(this, ['R'], wake);
      y += step;
    }
    addTextButton(this, cx, y, withKeyHint('Retour au titre', 'Échap'), () => this.scene.start('Title'), button);
    onKeys(this, ['ESC'], () => this.scene.start('Title'));
  }
}
