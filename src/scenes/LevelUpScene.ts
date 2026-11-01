import Phaser from 'phaser';
import { SKILLS, type SkillId } from '../rules/attributes';
import type { Character } from '../rules/character';
import {
  applyLevelUp,
  canLowerLevelSkill,
  canRaiseLevelSkill,
  hasPendingLevelUp,
  lowerLevelSkill,
  raiseLevelSkill,
  startLevelUp,
  type LevelUpState,
} from '../rules/leveling';
import type { GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const SMALL = { width: 64, height: 58, fontSize: 32 };

/** One level at a time: +1 niveau, des points de compétence, un repos complet (GDD §2, précisions). */
export class LevelUpScene extends Phaser.Scene {
  private state!: GameState;
  private levelUp!: LevelUpState;
  private layer!: Phaser.GameObjects.Container;

  constructor() {
    super('LevelUp');
  }

  create(): void {
    this.state = this.registry.get('game') as GameState;
    this.levelUp = startLevelUp(this.character());

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.6).setOrigin(0, 0).setInteractive();
    this.add.rectangle(0, 60, GAME_WIDTH, GAME_HEIGHT - 60, COLORS.ink, 0.97).setOrigin(0, 0).setStrokeStyle(2, COLORS.copper, 0.7);

    this.layer = this.add.container(0, 0);
    this.redraw();
    onKeys(this, ['ENTER', 'NUMPAD_ENTER'], () => this.confirm());
    // Putting it off is harmless: the HUD button stays until the points are spent.
    onKeys(this, ['ESC'], () => this.close());
  }

  private character(): Character {
    return this.state.character!;
  }

  private redraw(): void {
    this.layer.removeAll(true);
    const c = this.character();
    const nextLevel = c.level + 1;

    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 100, `Niveau ${nextLevel} !`, { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.copper })
        .setOrigin(0.5),
    );
    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 148, `Points de compétence à répartir : ${this.levelUp.pointsLeft}`, {
          fontFamily: FONT_SERIF,
          fontSize: '24px',
          color: CSS.parchment,
        })
        .setOrigin(0.5),
    );

    SKILLS.forEach((skill, i) => {
      const x0 = i < 6 ? 60 : 680;
      const y = 210 + (i % 6) * 70;
      this.layer.add(
        this.add.text(x0, y, skill.name, { fontFamily: FONT_SERIF, fontSize: '24px', color: CSS.parchment }).setOrigin(0, 0.5),
      );
      const { container: minus } = addTextButton(this, x0 + 320, y, '−', () => this.setSkill(skill.id, -1), {
        ...SMALL,
        enabled: canLowerLevelSkill(c, this.levelUp, skill.id),
      });
      this.layer.add(minus);
      this.layer.add(
        this.add
          .text(x0 + 385, y, String(this.levelUp.skillRanks[skill.id]), { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment })
          .setOrigin(0.5),
      );
      const { container: plus } = addTextButton(this, x0 + 450, y, '+', () => this.setSkill(skill.id, 1), {
        ...SMALL,
        enabled: canRaiseLevelSkill(this.levelUp, skill.id),
      });
      this.layer.add(plus);
    });

    const { container: continueBtn } = addTextButton(this, GAME_WIDTH / 2, GAME_HEIGHT - 60, withKeyHint('Continuer', 'Entrée'), () => this.confirm(), {
      width: 300,
      height: 76,
      enabled: this.levelUp.pointsLeft === 0,
    });
    this.layer.add(continueBtn);
  }

  private setSkill(id: SkillId, delta: 1 | -1): void {
    this.levelUp = delta > 0 ? raiseLevelSkill(this.levelUp, id) : lowerLevelSkill(this.character(), this.levelUp, id);
    this.redraw();
  }

  private confirm(): void {
    if (this.levelUp.pointsLeft > 0) return;
    const character = this.character();
    applyLevelUp(character, this.levelUp);
    if (hasPendingLevelUp(character)) {
      this.levelUp = startLevelUp(character);
      this.redraw();
      return;
    }
    this.close();
  }

  private close(): void {
    this.scene.resume('Map');
    this.scene.resume('Hud');
    this.scene.stop();
  }
}
