import Phaser from 'phaser';
import { SKILLS, type SkillId } from '../rules/attributes';
import { donDue, donsAvailable, takeDon, type Character, type FeatId } from '../rules/character';
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
import { DIGIT_KEYS, onKeys, withKeyHint } from '../ui/keys';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

const SMALL = { width: 64, height: 58, fontSize: 32 };

/** One level at a time: +1 niveau, des points de compétence, un repos complet (docs/gdd/progression.md). */
export class LevelUpScene extends Phaser.Scene {
  private state!: GameState;
  private levelUp!: LevelUpState;
  private layer!: Phaser.GameObjects.Container;
  /** Choosing a feat (every three levels ; chantier 6) rather than spending points. */
  private choosingDon = false;
  private donChoices: (() => void)[] = [];

  constructor() {
    super('LevelUp');
  }

  create(): void {
    this.state = this.registry.get('game') as GameState;
    this.levelUp = startLevelUp(this.character());

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0.6).setOrigin(0, 0).setInteractive();
    this.add.rectangle(0, 60, GAME_WIDTH, GAME_HEIGHT - 60, COLORS.ink, 0.97).setOrigin(0, 0).setStrokeStyle(2, COLORS.copper, 0.7);

    this.layer = this.add.container(0, 0);
    // A feat owed from an earlier level (an old save, or a closed screen) comes first.
    this.choosingDon = donDue(this.character());
    this.redraw();
    DIGIT_KEYS.forEach((keys, i) => onKeys(this, keys, () => this.donChoices[i]?.()));
    onKeys(this, ['ENTER', 'NUMPAD_ENTER'], () => this.confirm());
    // Putting it off is harmless: the HUD button stays until the points are spent.
    onKeys(this, ['ESC'], () => this.close());
  }

  private character(): Character {
    return this.state.character!;
  }

  private redraw(): void {
    this.layer.removeAll(true);
    this.donChoices = [];
    if (this.choosingDon) return this.drawDons();
    const c = this.character();
    const nextLevel = c.level + 1;

    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 100, `Niveau ${nextLevel} !`, { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.copper })
        .setOrigin(0.5),
    );
    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 148, `Points de compétence à répartir : ${this.levelUp.pointsLeft}  ·  rang maximum : ${this.levelUp.maxRank}`, {
          fontFamily: FONT_SERIF,
          fontSize: '24px',
          color: CSS.parchment,
        })
        .setOrigin(0.5),
    );

    // Thirteen skills with the Résonance (docs/gdd/magie.md): two columns of seven.
    const perColumn = Math.ceil(SKILLS.length / 2);
    SKILLS.forEach((skill, i) => {
      const x0 = i < perColumn ? 60 : 680;
      const y = 206 + (i % perColumn) * (perColumn > 6 ? 62 : 70);
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

  /** Every three levels, a feat (feuille de route, chantier 6). */
  private drawDons(): void {
    const c = this.character();
    this.layer.add(
      this.add.text(GAME_WIDTH / 2, 100, `Niveau ${c.level} : un don`, { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.copper }).setOrigin(0.5),
    );
    this.layer.add(
      this.add
        .text(GAME_WIDTH / 2, 146, 'Tous les trois niveaux, un don de plus. Choisis-le : il est pour toujours.', { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.parchment })
        .setOrigin(0.5),
    );
    donsAvailable(c).forEach((feat, i) => {
      const x = i % 2 === 0 ? 340 : 940;
      const y = 225 + Math.floor(i / 2) * 92;
      const pick = () => this.pickDon(feat.id);
      const card = this.add.rectangle(x, y, 570, 82, 0x2a211c).setStrokeStyle(2, COLORS.copper, 0.7).setInteractive({ useHandCursor: true });
      card.on('pointerup', pick);
      this.layer.add(card);
      this.layer.add(this.add.text(x - 265, y - 22, `${i + 1}. ${feat.name}`, { fontFamily: FONT_SERIF, fontSize: '24px', color: CSS.parchment }).setOrigin(0, 0.5));
      this.layer.add(
        this.add.text(x - 265, y + 14, feat.description, { fontFamily: FONT_SERIF, fontSize: '19px', color: CSS.muted, wordWrap: { width: 530 } }).setOrigin(0, 0.5),
      );
      this.donChoices[i] = pick;
    });
  }

  private pickDon(id: FeatId): void {
    takeDon(this.character(), id);
    this.choosingDon = false;
    this.afterLevel();
  }

  private setSkill(id: SkillId, delta: 1 | -1): void {
    this.levelUp = delta > 0 ? raiseLevelSkill(this.levelUp, id) : lowerLevelSkill(this.character(), this.levelUp, id);
    this.redraw();
  }

  private confirm(): void {
    if (this.choosingDon || this.levelUp.pointsLeft > 0) return;
    const character = this.character();
    applyLevelUp(character, this.levelUp);
    // Levels 3, 6, 9: a feat before anything else.
    if (donDue(character)) {
      this.choosingDon = true;
      this.redraw();
      return;
    }
    this.afterLevel();
  }

  /** Another level waiting, or back to the map. */
  private afterLevel(): void {
    const character = this.character();
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
