import Phaser from 'phaser';
import { ATTRIBUTES, CREATION_SKILLS, SKILLS, attributeModifier, type AttributeId, type SkillId } from '../rules/attributes';
import {
  AVATARS,
  CREATION,
  CREATION_FEATS,
  TRAITS,
  findTrait,
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
  combatWarning,
  findFeat,
  skillPointsLeft,
  toggleOriginBonus,
  type CharacterDraft,
} from '../rules/character';
import { createNewGame, findLocation, type GameState } from '../state/gameState';
import { addTextButton } from '../ui/button';
import { COLORS, CSS, FONT_SERIF, GAME_HEIGHT, GAME_WIDTH } from '../ui/theme';
import { HAS_MOUSE } from '../ui/viewport';
import { AUTO_LOCK } from '../save/autosave';

export interface CreationSceneData {
  draft?: CharacterDraft;
  step?: number;
  focus?: string;
  message?: string;
  /** Set when a save from before character creation is loaded: resume it once the character exists. */
  resume?: GameState;
}

const STEPS = ['Nom et apparence', 'Attributs', 'Compétences', 'Don', 'Récapitulatif'] as const;
/** Avatar portraits on the first step (docs/gdd/jalon-2.md, étape 3). */
const AVATAR_SIZE = 124;
const AVATAR_GAP = 22;
const FOOTER_Y = GAME_HEIGHT - 55;
/** The − and + buttons: wider for a finger on touch screens (docs/gdd/interface.md). */
const SMALL = HAS_MOUSE ? { width: 64, height: 58, fontSize: 32 } : { width: 84, height: 60, fontSize: 36 };
const ATTRIBUTE_TOP = HAS_MOUSE ? 196 : 192;
const ATTRIBUTE_STEP = HAS_MOUSE ? 62 : 64;
/** The help line under the rows; on touch screens, lower and narrower, between the two footer buttons. */
const FOCUS = HAS_MOUSE ? { y: 612, width: 1150 } : { y: 636, width: 720 };

const attributeName = (id: AttributeId): string => ATTRIBUTES.find((a) => a.id === id)?.name ?? id;
const signed = (n: number): string => (n >= 0 ? `+${n}` : `${n}`);

export class CreationScene extends Phaser.Scene {
  private draft: CharacterDraft = createDraft();
  private step = 0;
  private focus?: string;
  private message?: string;
  private messageText?: Phaser.GameObjects.Text;
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
    this.messageText = undefined;
    if (this.message) {
      this.messageText = this.add
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
    this.registry.set(AUTO_LOCK, false);
    this.scene.start(findLocation(state.location)?.scene ?? 'Map');
  }

  // --- Step 1: name and look ---------------------------------------------

  private drawName(): void {
    const cx = GAME_WIDTH / 2;
    this.add
      .text(cx, 150, 'Tu entres en apprentissage chez les Gardiens de Mémoire, un ordre de conteurs voyageurs.', {
        fontFamily: FONT_SERIF,
        fontSize: '26px',
        color: CSS.parchment,
        align: 'center',
        wordWrap: { width: 900 },
      })
      .setOrigin(0.5);
    this.drawAvatars(cx, 290);
    this.add.text(cx, 400, 'Comment t’appelles-tu ?', { fontFamily: FONT_SERIF, fontSize: '28px', color: CSS.parchment }).setOrigin(0.5);

    const field = this.add.dom(
      cx,
      462,
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
      // « Donne un nom à ton personnage. » disappears as soon as a name is typed.
      if (input.value.trim() && this.messageText) {
        this.messageText.destroy();
        this.messageText = undefined;
        this.message = '';
      }
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        input.blur();
        this.next();
      }
    });

    this.add
      .text(cx, 530, 'Origine : Humain (seule origine de cette version).', {
        fontFamily: FONT_SERIF,
        fontSize: '22px',
        color: CSS.muted,
      })
      .setOrigin(0.5);
  }

  /** One portrait per look, in a row centred on cx; the chosen one is framed in copper. */
  private drawAvatars(cx: number, y: number): void {
    const width = AVATARS.length * AVATAR_SIZE + (AVATARS.length - 1) * AVATAR_GAP;
    AVATARS.forEach((avatar, i) => {
      const x = cx - width / 2 + AVATAR_SIZE / 2 + i * (AVATAR_SIZE + AVATAR_GAP);
      const chosen = this.draft.avatar === avatar.id;
      const key = `avatar-${avatar.id}`;
      const image = this.textures.exists(key)
        ? this.add.image(x, y, key).setDisplaySize(AVATAR_SIZE, AVATAR_SIZE)
        : this.add.rectangle(x, y, AVATAR_SIZE, AVATAR_SIZE, 0x2a211c);
      image.setAlpha(chosen ? 1 : 0.6).setInteractive({ useHandCursor: true });
      image.on('pointerup', () => this.redraw({ draft: { ...this.draft, avatar: avatar.id }, message: undefined }));
      this.add
        .rectangle(x, y, AVATAR_SIZE, AVATAR_SIZE)
        .setStrokeStyle(chosen ? 4 : 2, COLORS.copper, chosen ? 1 : 0.4);
    });
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
      const y = ATTRIBUTE_TOP + i * ATTRIBUTE_STEP;
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
    // Résonance is learned on the road (docs/gdd/magie.md): twelve skills here, as before.
    CREATION_SKILLS.forEach((skill, i) => {
      const x0 = i < 6 ? 40 : 660;
      const y = 200 + (i % 6) * 66;
      this.rowLabel(x0 + 150, y, skill.name, skill.id);
      addTextButton(this, x0 + 345, y, '−', () => this.setSkill(skill.id, -1), { ...SMALL, enabled: canLowerSkill(this.draft, skill.id) });
      this.add.text(x0 + 410, y, String(this.draft.skillRanks[skill.id]), { fontFamily: FONT_SERIF, fontSize: '30px', color: CSS.parchment }).setOrigin(0.5);
      addTextButton(this, x0 + 475, y, '+', () => this.setSkill(skill.id, 1), { ...SMALL, enabled: canRaiseSkill(this.draft, skill.id) });
      const bonus = attributeModifier(attrs[skill.attribute]) + ranks[skill.id];
      this.add.text(x0 + 525, y, signed(bonus), { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.copper }).setOrigin(0, 0.5);
    });

    const focused = CREATION_SKILLS.find((s) => s.id === this.focus);
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
      .text(GAME_WIDTH / 2, 128, 'Choisis un don.', { fontFamily: FONT_SERIF, fontSize: '24px', color: CSS.parchment })
      .setOrigin(0.5);

    CREATION_FEATS.forEach((feat, i) => {
      const x = i % 2 === 0 ? 340 : 940;
      const y = 200 + Math.floor(i / 2) * 104;
      const selected = this.draft.feat === feat.id;
      const card = this.add
        .rectangle(x, y, 570, 94, selected ? 0x5a3a26 : 0x2a211c)
        .setStrokeStyle(selected ? 3 : 2, COLORS.copper, selected ? 1 : 0.6)
        .setInteractive({ useHandCursor: true });
      card.on('pointerup', () => this.redraw({ draft: { ...this.draft, feat: feat.id }, message: undefined }));
      this.add.text(x - 265, y - 26, feat.name, { fontFamily: FONT_SERIF, fontSize: '26px', color: CSS.parchment }).setOrigin(0, 0.5);
      this.add
        .text(x - 265, y + 14, feat.description, {
          fontFamily: FONT_SERIF,
          fontSize: '20px',
          color: selected ? CSS.parchment : CSS.muted,
          wordWrap: { width: 530 },
        })
        .setOrigin(0, 0.5);
    });

    // A trait, if one wants (feuille de route, chantier 6) : an edge, and its price.
    this.add
      .text(GAME_WIDTH / 2, 515, 'Un trait, si tu veux : un avantage, et son prix.', { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.parchment })
      .setOrigin(0.5);
    const choices: { id: string | null; name: string }[] = [{ id: null, name: 'Aucun' }, ...TRAITS.map((t) => ({ id: t.id, name: t.name }))];
    choices.forEach((t, i) => {
      const x = 140 + i * 250;
      const selected = (this.draft.trait ?? null) === t.id;
      const card = this.add
        .rectangle(x, 560, 230, 46, selected ? 0x5a3a26 : 0x2a211c)
        .setStrokeStyle(selected ? 3 : 2, COLORS.copper, selected ? 1 : 0.6)
        .setInteractive({ useHandCursor: true });
      card.on('pointerup', () => this.redraw({ draft: { ...this.draft, trait: t.id }, message: undefined }));
      this.add.text(x, 560, t.name, { fontFamily: FONT_SERIF, fontSize: '21px', color: selected ? CSS.parchment : CSS.muted }).setOrigin(0.5);
    });
    const chosen = findTrait(this.draft.trait);
    this.add
      .text(GAME_WIDTH / 2, 605, chosen ? chosen.description : 'Sans trait : rien à gagner, rien à payer.', {
        fontFamily: FONT_SERIF,
        fontSize: '20px',
        fontStyle: 'italic',
        color: CSS.muted,
        align: 'center',
        wordWrap: { width: 1150 },
      })
      .setOrigin(0.5);
  }

  // --- Step 5: summary ----------------------------------------------------

  private drawSummary(): void {
    const draft = this.draft;
    const attrs = finalAttributes(draft);
    const skills = finalSkills(draft);
    const feat = draft.feat ? findFeat(draft.feat) : undefined;
    const stats = characterStats({ attributes: attrs, feat: draft.feat ?? 'tough', level: 1, trait: draft.trait ?? undefined });
    const text = (x: number, y: number, value: string, size = 24, color: string = CSS.parchment) =>
      this.add.text(x, y, value, { fontFamily: FONT_SERIF, fontSize: `${size}px`, color }).setOrigin(0, 0.5);

    this.add
      .text(GAME_WIDTH / 2, 140, `${draft.name.trim()} — origine humaine, en apprentissage chez les Gardiens de Mémoire`, {
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
      `Résistance aux effets : ${stats.resistance >= 0 ? '+' : ''}${stats.resistance}`,
      `Défense : ${stats.defense}`,
      `Points d’action : ${stats.actionPoints}`,
      `Charge : ${stats.carryKg} kg`,
      `Récits retenus : ${stats.tales}`,
    ].forEach((line, i) => text(860, 238 + i * 40, line));

    // C3: an honest warning for a hero who cannot hold a weapon (étude du 2026-11-03).
    const warning = combatWarning(skills);
    if (warning) {
      this.add
        .text(GAME_WIDTH / 2, FOCUS.y, warning, { fontFamily: FONT_SERIF, fontSize: '22px', color: CSS.copper, align: 'center', wordWrap: { width: 1100 } })
        .setOrigin(0.5);
    }

    if (feat) {
      this.add
        .text(GAME_WIDTH / 2, 545, `Don : ${feat.name} — ${feat.description}${findTrait(draft.trait) ? `\nTrait : ${findTrait(draft.trait)!.name} — ${findTrait(draft.trait)!.description}` : ''}`, {
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
      .text(GAME_WIDTH / 2, FOCUS.y, value, {
        fontFamily: FONT_SERIF,
        fontSize: '22px',
        color: CSS.muted,
        align: 'center',
        wordWrap: { width: FOCUS.width },
      })
      .setOrigin(0.5);
  }
}
