import Phaser from 'phaser';
import { ATTRIBUTES, SKILLS, attributeModifier, type AttributeId, type SkillId } from '../rules/attributes';
import {
  CREATION,
  FEATS,
  attributePointsLeft,
  canLowerAttribute,
  canLowerSkill,
  canRaiseAttribute,
  canRaiseSkill,
  changeAttribute,
  changeSkill,
  characterStats,
  createDraft,
  draftErrors,
  finalAttributes,
  finalSkills,
  finalizeCharacter,
  findFeat,
  skillPointsLeft,
  toggleOriginBonus,
  type CharacterDraft,
} from '../rules/character';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';

export interface CreationSceneData {
  draft?: CharacterDraft;
  step?: number;
  focus?: string;
  message?: string;
  /** Set when a save from before character creation is loaded: resume it once the character exists. */
  resume?: GameState;
}

const STEPS = ['Nom', 'Attributs', 'Compétences', 'Don', 'Récapitulatif'] as const;
const FOOTER_Y = GAME_HEIGHT - 55;
const SMALL = { width: 64, height: 58, fontSize: 32 };

const attributeName = (id: AttributeId): string => ATTRIBUTES.find((a) => a.id === id)?.name ?? id;
const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);

export class CreationScene extends Phaser.Scene {
  private draft: CharacterDraft = createDraft();
  private step = 0;
  private focus?: string;
  private message?: string;
  private resume?: GameState;

  constructor() {
    super('Creation');
  }

  init(data: CreationSceneData): void {
    this.draft = data.draft ?? createDraft();
    this.step = data.step ?? 0;
    this.focus = data.focus;
    this.message = data.message;
    this.resume = data.resume;
  }

  create(): void {
    this.add
      .text(GAME_WIDTH / 2, 44, 'Création du personnage', { fontFamily: FONT_SERIF, fontSize: '36px', color: CSS.parchment })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 92, `Étape ${this.step + 1} / ${STEPS.length} — ${STEPS[this.step]}`, {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.copper,
      })
      .setOrigin(0.5);

    [this.drawName, this.drawAttributes, this.drawSkills, this.drawFeats, this.drawSummary][this.step].call(this);
    this.drawFooter();
  }

  // --- Navigation ---------------------------------------------------------

  private redraw(changes: Partial<CreationSceneData> = {}): void {
    this.scene.restart({
      draft: this.draft,
      step: this.step,
      focus: this.focus,
      resume: this.resume,
      ...changes,
    } satisfies CreationSceneData);
  }

  private drawFooter(): void {
    const first = this.step === 0;
    const last = this.step === STEPS.length - 1;
    const backLabel = !first ? '← Précédent' : this.resume ? '← Retour' : '← Titre';
    addTextButton(this, 150, FOOTER_Y, backLabel, () => this.back(), { width: 230, height: 76 });
    addTextButton(this, GAME_WIDTH - (last ? 200 : 150), FOOTER_Y, last ? 'Commencer l’aventure' : 'Suivant →', () => this.next(), {
      width: last ? 330 : 230,
      height: 76,
    });
    if (this.message) {
      this.add
        .text(GAME_WIDTH / 2, FOOTER_Y, this.message, {
          fontFamily: FONT_SERIF,
          fontSize: '22px',
          color: CSS.copper,
          align: 'center',
          wordWrap: { width: 560 },
        })
        .setOrigin(0.5);
    }
  }

  private back(): void {
    if (this.step === 0) {
      this.scene.start(this.resume ? 'Slots' : 'Title', this.resume ? { mode: 'load' } : undefined);
      return;
    }
    this.redraw({ step: this.step - 1, focus: undefined });
  }

  private next(): void {
    const errors = draftErrors(this.draft);
    const stepErrors = [errors.name, errors.attributes, errors.skills, errors.feat, []][this.step];
    if (stepErrors.length > 0) {
      this.redraw({ message: stepErrors[0] });
      return;
    }
    if (this.step < STEPS.length - 1) {
      this.redraw({ step: this.step + 1, focus: undefined });
      return;
    }
    this.start();
  }

  private start(): void {
    const character = finalizeCharacter(this.draft);
    const state: GameState = this.resume ? { ...this.resume, character } : createNewGame(character);
    this.registry.set('game', state);
    this.scene.start(findLocation(state.location)?.scene ?? 'Map');
  }

  // --- Step 1: name -------------------------------------------------------

  private drawName(): void {
    const cx = GAME_WIDTH / 2;
    this.add
      .text(cx, 200, 'Tu entres en apprentissage chez les Gardiens de Mémoire, un ordre de conteurs voyageurs.', {
        fontFamily: FONT_SERIF,
        fontSize: '26px',
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: 900 },
      })
      .setOrigin(0.5);
    this.add.text(cx, 300, 'Comment t’appelles-tu ?', { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0.5);

    const field = this.add.dom(
      cx,
      380,
      'input',
      [
        'width: 520px',
        'height: 66px',
        'box-sizing: border-box',
        'padding: 0 18px',
        'font: 32px Georgia, "Times New Roman", serif',
        `color: ${CSS.parchment}`,
        'background: #2a211c',
        `border: 2px solid ${CSS.copper}`,
        'border-radius: 6px',
        'outline: none',
        'text-align: center',
      ].join(';'),
    );
    const input = field.node as HTMLInputElement;
    input.type = 'text';
    input.value = this.draft.name;
    input.maxLength = CREATION.nameMaxLength;
    input.placeholder = 'Ton nom';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.setAttribute('aria-label', 'Nom du personnage');
    input.addEventListener('input', () => {
      this.draft = { ...this.draft, name: input.value };
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        input.blur();
        this.next();
      }
    });

    this.add
      .text(cx, 480, 'Origine : Humain (seule origine de cette version).', {
        fontFamily: FONT_SERIF,
        fontSize: '22px',
        color: CSS.muted,
      })
      .setOrigin(0.5);
  }

  // --- Step 2: attributes -------------------------------------------------

  private drawAttributes(): void {
    const points = attributePointsLeft(this.draft);
    const bonusLeft = CREATION.originBonusCount - this.draft.originBonus.length;
    this.add
      .text(GAME_WIDTH / 2, 140, `Points à répartir : ${points}   ·   Bonus humain (+1) à choisir : ${bonusLeft}`, {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.parchment,
      })
      .setOrigin(0.5);

    const finals = finalAttributes(this.draft);
    ATTRIBUTES.forEach((attr, i) => {
      const y = 196 + i * 62;
      this.rowLabel(260, y, attr.name, attr.id);
      addTextButton(this, 460, y, '−', () => this.setAttr(attr.id, -1), { ...SMALL, enabled: canLowerAttribute(this.draft, attr.id) });
      this.add.text(530, y, String(this.draft.allocated[attr.id]), { fontFamily: FONT_SERIF, fontSize: '30px', color: CSS.parchment }).setOrigin(0.5);
      addTextButton(this, 600, y, '+', () => this.setAttr(attr.id, 1), { ...SMALL, enabled: canRaiseAttribute(this.draft, attr.id) });
      const chosen = this.draft.originBonus.includes(attr.id);
      addTextButton(this, 780, y, '+1 humain', () => this.redraw({ draft: toggleOriginBonus(this.draft, attr.id), focus: attr.id, message: undefined }), {
        width: 200,
        height: 58,
        fontSize: 22,
        selected: chosen,
        enabled: chosen || bonusLeft > 0,
      });
      this.add
        .text(960, y, `= ${finals[attr.id]}  (${signed(attributeModifier(finals[attr.id]))})`, {
          fontFamily: FONT_SERIF,
          fontSize: '28px',
          color: CSS.copper,
        })
        .setOrigin(0, 0.5);
    });

    const focused = ATTRIBUTES.find((a) => a.id === this.focus);
    this.focusLine(focused ? `${focused.name} — ${focused.description}` : 'Touche un nom pour voir à quoi sert l’attribut.');
  }

  private setAttr(id: AttributeId, delta: 1 | -1): void {
    this.redraw({ draft: changeAttribute(this.draft, id, delta), focus: id, message: undefined });
  }

  // --- Step 3: skills -----------------------------------------------------

  private drawSkills(): void {
    const left = skillPointsLeft(this.draft);
    this.add
      .text(GAME_WIDTH / 2, 140, `Rangs à répartir : ${left}   ·   ${CREATION.skillMaxAtCreation} au maximum par compétence`, {
        fontFamily: FONT_SERIF,
        fontSize: '24px',
        color: CSS.parchment,
      })
      .setOrigin(0.5);

    const attrs = finalAttributes(this.draft);
    const ranks = finalSkills(this.draft);
    SKILLS.forEach((skill, i) => {
      const x0 = i < 6 ? 40 : 660;
      const y = 200 + (i % 6) * 66;
      this.rowLabel(x0 + 150, y, skill.name, skill.id);
      addTextButton(this, x0 + 345, y, '−', () => this.setSkill(skill.id, -1), { ...SMALL, enabled: canLowerSkill(this.draft, skill.id) });
      this.add.text(x0 + 410, y, String(this.draft.skillRanks[skill.id]), { fontFamily: FONT_SERIF, fontSize: '30px', color: CSS.parchment }).setOrigin(0.5);
      addTextButton(this, x0 + 475, y, '+', () => this.setSkill(skill.id, 1), { ...SMALL, enabled: canRaiseSkill(this.draft, skill.id) });
      const bonus = attributeModifier(attrs[skill.attribute]) + ranks[skill.id];
      this.add.text(x0 + 525, y, signed(bonus), { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.copper }).setOrigin(0, 0.5);
    });

    const focused = SKILLS.find((s) => s.id === this.focus);
    this.focusLine(
      focused
        ? `${focused.name} (${attributeName(focused.attribute)}) — ${focused.description} Bonus au dé : attribut + rang.`
        : 'Touche un nom pour voir à quoi sert la compétence. En cuivre : ton bonus au dé.',
    );
  }

  private setSkill(id: SkillId, delta: 1 | -1): void {
    this.redraw({ draft: changeSkill(this.draft, id, delta), focus: id, message: undefined });
  }

  // --- Step 4: feat -------------------------------------------------------

  private drawFeats(): void {
    this.add
      .text(GAME_WIDTH / 2, 140, 'Choisis un don.', { fontFamily: FONT_SERIF, fontSize: '24px', color: CSS.parchment })
      .setOrigin(0.5);

    FEATS.forEach((feat, i) => {
      const x = i % 2 === 0 ? 340 : 940;
      const y = 235 + Math.floor(i / 2) * 128;
      const selected = this.draft.feat === feat.id;
      const card = this.add
        .rectangle(x, y, 570, 112, selected ? 0x5a3a26 : 0x2a211c)
        .setStrokeStyle(selected ? 3 : 2, COLORS.copper, selected ? 1 : 0.6)
        .setInteractive({ useHandCursor: true });
      card.on('pointerup', () => this.redraw({ draft: { ...this.draft, feat: feat.id }, message: undefined }));
      this.add.text(x - 265, y - 30, feat.name, { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0, 0.5);
      this.add
        .text(x - 265, y + 16, feat.description, {
          fontFamily: FONT_SERIF,
          fontSize: '22px',
          color: selected ? CSS.parchment : CSS.muted,
          wordWrap: { width: 530 },
        })
        .setOrigin(0, 0.5);
    });
  }

  // --- Step 5: summary ----------------------------------------------------

  private drawSummary(): void {
    const draft = this.draft;
    const attrs = finalAttributes(draft);
    const skills = finalSkills(draft);
    const feat = draft.feat ? findFeat(draft.feat) : undefined;
    const stats = characterStats({ attributes: attrs, feat: draft.feat ?? 'tough', level: 1 });
    const text = (x: number, y: number, value: string, size = 24, color: string = CSS.parchment) =>
      this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: `${size}px`, color }).setOrigin(0, 0.5);

    this.add
      .text(GAME_WIDTH / 2, 140, `${draft.name.trim()} — Humain, en apprentissage chez les Gardiens de Mémoire`, {
        fontFamily: FONT_SERIF,
        fontSize: '28px',
        color: CSS.parchment,
      })
      .setOrigin(0.5);

    text(60, 195, 'Attributs', 26, CSS.copper);
    ATTRIBUTES.forEach((a, i) => text(60, 238 + i * 40, `${a.name} : ${attrs[a.id]} (${signed(attributeModifier(attrs[a.id]))})`));

    text(470, 195, 'Compétences', 26, CSS.copper);
    const trained = SKILLS.filter((s) => skills[s.id] > 0);
    trained.forEach((s, i) => text(470, 238 + i * 40, `${s.name} : rang ${skills[s.id]}`));
    if (trained.length === 0) text(470, 238, 'Aucune', 24, CSS.muted);

    text(860, 195, 'Valeurs', 26, CSS.copper);
    [
      `Points de vie : ${stats.maxHp}`,
      `Points de résistance : ${stats.resistance}`,
      `Défense : ${stats.defense}`,
      `Points d’action : ${stats.actionPoints}`,
      `Charge : ${stats.carryKg} kg`,
      `Récits retenus : ${stats.tales}`,
    ].forEach((line, i) => text(860, 238 + i * 40, line));

    if (feat) {
      this.add
        .text(GAME_WIDTH / 2, 545, `Don : ${feat.name} — ${feat.description}`, {
          fontFamily: FONT_SERIF,
          fontSize: '24px',
          color: CSS.parchment,
          align: 'center',
          wordWrap: { width: 1100 },
        })
        .setOrigin(0.5);
    }
  }

  // --- Helpers ------------------------------------------------------------

  /** Tapping a row name shows its description in the focus line. */
  private rowLabel(rightX: number, y: number, label: string, id: string): void {
    const t = this.add
      .text(rightX, y, label, {
        fontFamily: FONT_SERIF,
        fontSize: '26px',
        color: this.focus === id ? CSS.copper : CSS.parchment,
      })
      .setOrigin(1, 0.5)
      .setPadding(8, 12, 8, 12)
      .setInteractive({ useHandCursor: true });
    t.on('pointerup', () => this.redraw({ focus: id, message: undefined }));
  }

  private focusLine(value: string): void {
    this.add
      .text(GAME_WIDTH / 2, 612, value, {
        fontFamily: FONT_SERIF,
        fontSize: '22px',
        color: CSS.muted,
        align: 'center',
        wordWrap: { width: 1150 },
      })
      .setOrigin(0.5);
  }
}
