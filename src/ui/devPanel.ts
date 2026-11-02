import { ATTRIBUTES, SKILLS, SKILL_RANK_MAX } from '../rules/attributes';
import { MARQUES_MAX, marquesOf } from '../rules/marques';
import { CREATION, characterStats } from '../rules/character';
import { QUESTS } from '../rules/dialogue';
import { ITEMS, addItem, ownedCount, removeItem } from '../rules/inventory';
import { RECITS } from '../rules/recits';
import { allFlags, cycleQuest, makeOverpowered, restoreFullHp, restoreFullResonance, toggleFlag, type QuestState } from '../rules/testTools';
import { resonanceMax } from '../rules/magic';
import { COMPANIONS, findCompanion, inParty, joinParty, leaveParty } from '../rules/companions';
import { recordMet } from '../rules/bestiary';
import { ECHOS, collectedEchos, echoFlag } from '../rules/echos';
import { ENEMIES } from '../rules/combat';
import { advance, formatDate, shortTime, waitUntil } from '../rules/time';
import { placeOfLocation } from '../rules/world';
import { LOCATIONS, type GameState } from '../state/gameState';

/**
 * « Mode développeur » (demande de Cyril, 2026-11-02 ; docs/gdd/interface.md) : an HTML panel over the game, opened
 * from the pause menu in test mode. It changes the state freely: the overpowered character, any attribute, skill,
 * Fers, quest, flag, item or Récit, and a jump to any place. Closing it rebuilds the map with the new state.
 */
export interface DevPanelResult {
  /** Set when a place was chosen: the map reopens there. */
  goTo?: { location: string; entrance: string };
}

const STATE_LABEL: Record<QuestState, string> = { none: 'pas commencée', active: 'en cours', done: 'terminée' };
const TABS = ['Personnage', 'Groupe', 'Lieux', 'Quêtes', 'Repères', 'Objets', 'Récits'] as const;
type Tab = (typeof TABS)[number];

const CSS_TEXT = `
#dev-panel { position: fixed; inset: 0; z-index: 1000; background: rgba(27,21,18,0.97); color: #EAD9B8;
  font-family: Georgia, 'Times New Roman', serif; display: flex; flex-direction: column; }
#dev-panel header { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid #C9804F; }
#dev-panel h1 { font-size: 18px; margin: 0; color: #C9804F; flex: 1; font-weight: normal; }
#dev-panel nav { display: flex; gap: 6px; padding: 6px 12px; overflow-x: auto; }
#dev-panel button { font: inherit; font-size: 15px; color: #EAD9B8; background: #2a211c; border: 1px solid #C9804F;
  border-radius: 6px; min-height: 40px; padding: 4px 12px; cursor: pointer; }
#dev-panel button.on { background: #5a3a26; }
#dev-panel button.small { min-width: 40px; padding: 4px 8px; }
#dev-panel main { flex: 1; overflow-y: auto; padding: 8px 12px 24px; -webkit-overflow-scrolling: touch; }
#dev-panel .row { display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid rgba(201,128,79,0.2); }
#dev-panel .row span.label { flex: 1; }
#dev-panel .row span.value { min-width: 36px; text-align: center; }
#dev-panel h2 { font-size: 15px; color: #C9804F; margin: 12px 0 4px; font-weight: normal; }
#dev-panel input { font: inherit; font-size: 16px; width: 100%; box-sizing: border-box; padding: 8px; margin-bottom: 8px;
  background: #2a211c; color: #EAD9B8; border: 1px solid #C9804F; border-radius: 6px; }
#dev-panel .note { color: #b8a88c; font-size: 14px; margin: 4px 0 8px; }
`;

export function openDevPanel(state: GameState, onClose: (result: DevPanelResult) => void): void {
  const character = state.character;
  if (!character) return;
  document.getElementById('dev-panel')?.remove();
  const style = document.createElement('style');
  style.textContent = CSS_TEXT;
  const root = document.createElement('div');
  root.id = 'dev-panel';
  root.append(style);

  const header = el('header');
  const title = el('h1', 'Mode développeur');
  const close = button('Fermer', () => finish({}));
  header.append(title, close);
  const nav = el('nav');
  const main = el('main');
  root.append(header, nav, main);
  document.body.append(root);

  let tab: Tab = 'Personnage';
  let flagFilter = '';
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') finish({});
  };
  window.addEventListener('keydown', onKey);

  function finish(result: DevPanelResult): void {
    window.removeEventListener('keydown', onKey);
    root.remove();
    onClose(result);
  }

  function render(): void {
    nav.replaceChildren(...TABS.map((t) => button(t, () => ((tab = t), render()), t === tab ? 'on' : '')));
    main.replaceChildren();
    if (tab === 'Personnage') renderCharacter();
    else if (tab === 'Groupe') renderParty();
    else if (tab === 'Lieux') renderPlaces();
    else if (tab === 'Quêtes') renderQuests();
    else if (tab === 'Repères') renderFlags();
    else if (tab === 'Objets') renderItems();
    else renderRecits();
  }

  function renderCharacter(): void {
    const c = character!;
    main.append(
      el('p', `${c.name} · niveau ${c.level} · PV ${c.hp} / ${characterStats(c).maxHp} · PR ${c.resonance} / ${resonanceMax(c)} · ${c.fers} Fers`, 'note'),
      row('Perso surpuissant (tout au maximum)', [button('Appliquer', () => (makeOverpowered(c), render()))]),
      row('Points de vie et de Résonance', [
        button('PV au max', () => (restoreFullHp(c), render())),
        button('PR au max', () => (restoreFullResonance(c), render())),
        button('PR à 0', () => ((c.resonance = 0), render())),
      ]),
      row(`Marques du cristal (${marquesOf(c)} / ${MARQUES_MAX})`, [
        button('Aucune', () => ((c.marques = 0), render()), 'small'),
        button('+1', () => ((c.marques = Math.min(MARQUES_MAX, marquesOf(c) + 1)), render()), 'small'),
      ]),
      el('p', `Temps : ${shortTime(state.time)} — ${formatDate(state.time)}`, 'note'),
      row('Temps', [
        button('+1 moment', () => (advance(state.time, 1), render()), 'small'),
        button('Matin', () => (waitUntil(state.time, 'matin'), render()), 'small'),
        button('Nuit', () => (waitUntil(state.time, 'nuit'), render()), 'small'),
        button('+1 jour', () => (advance(state.time, 4), render()), 'small'),
      ]),
      row('Fers', [
        button('+100', () => ((c.fers += 100), render()), 'small'),
        button('+1000', () => ((c.fers += 1000), render()), 'small'),
        button('0', () => ((c.fers = 0), render()), 'small'),
      ]),
      el('h2', 'Attributs'),
      ...ATTRIBUTES.map((a) =>
        stepper(a.name, c.attributes[a.id], CREATION.minScore, CREATION.maxScore, (v) => (c.attributes[a.id] = v)),
      ),
      el('h2', 'Compétences'),
      ...SKILLS.map((s) => stepper(s.name, c.skills[s.id], 0, SKILL_RANK_MAX, (v) => (c.skills[s.id] = v))),
    );
  }

  /** Les compagnons (docs/gdd/jalon-3.md) : to add or remove before step 2 brings their recruitment. */
  function renderParty(): void {
    main.append(el('p', `Deux compagnons au plus. Dans le groupe : ${state.groupe.map((m) => `${findCompanion(m.id)?.name} (${m.hp} PV)`).join(', ') || 'personne'}.`, 'note'));
    for (const def of COMPANIONS) {
      const here = inParty(state, def.id);
      main.append(row(`${def.name} — ${def.description}`, [
        button(here ? 'dans le groupe' : 'absent·e', () => (here ? leaveParty(state, def.id) : joinParty(state, def.id), render()), here ? 'on' : ''),
      ]));
    }
    main.append(row('Bestiaire', [button('Tout rencontrer', () => (recordMet(state, ENEMIES.map((e) => e.id)), render()))]));
    main.append(
      row(`Échos (${collectedEchos(state).length} / ${ECHOS.length} ; emprise ${state.emprise})`, [
        button('Tout recueillir', () => (ECHOS.forEach((e) => (state.flags[echoFlag(e.id)] = true)), render())),
        button('Emprise 0', () => ((state.emprise = 0), render()), 'small'),
        button('+1', () => ((state.emprise += 1), render()), 'small'),
      ]),
    );
  }

  function renderPlaces(): void {
    main.append(el('p', 'Toucher un lieu y emmène tout de suite, à son entrée.', 'note'));
    let lastPlace = '';
    for (const l of LOCATIONS.filter((x) => !x.encounter)) {
      const place = placeOfLocation(l.id)?.name ?? 'Ailleurs';
      if (place !== lastPlace) main.append(el('h2', (lastPlace = place)));
      main.append(row(l.name, [button('Y aller', () => finish({ goTo: { location: l.id, entrance: l.entrance } }))]));
    }
  }

  function renderQuests(): void {
    main.append(el('p', 'Toucher l’état le fait passer : pas commencée → en cours → terminée.', 'note'));
    for (const q of QUESTS) {
      const now = (state.quests[q.id] as QuestState | undefined) ?? 'none';
      main.append(row(q.name, [button(STATE_LABEL[now], () => (cycleQuest(state, q.id), render()), now === 'none' ? '' : 'on')]));
    }
  }

  function renderFlags(): void {
    const search = document.createElement('input');
    search.placeholder = 'Chercher un repère…';
    search.value = flagFilter;
    search.addEventListener('input', () => {
      flagFilter = search.value;
      list.replaceChildren(...flagRows());
    });
    const list = el('div');
    const flagRows = () =>
      allFlags()
        .filter((f) => f.includes(flagFilter.trim()))
        .map((f) => row(f, [button(state.flags[f] ? 'oui' : 'non', () => (toggleFlag(state, f), list.replaceChildren(...flagRows())), state.flags[f] ? 'on' : '')]));
    list.replaceChildren(...flagRows());
    main.append(el('p', 'Les repères d’histoire : cocher, c’est faire comme si c’était arrivé.', 'note'), search, list);
  }

  function renderItems(): void {
    const c = character!;
    for (const item of ITEMS) {
      const owned = ownedCount(c, item.id);
      main.append(
        row(`${item.name}${item.quest ? ' (quête)' : ''}`, [
          button('−', () => (owned > 0 && removeItem(c, item.id), render()), 'small'),
          valueSpan(owned),
          button('+', () => (addItem(c, item.id), render()), 'small'),
        ]),
      );
    }
  }

  function renderRecits(): void {
    const c = character!;
    for (const r of RECITS) {
      const known = c.recits.includes(r.id);
      main.append(
        row(r.titre, [
          button(known ? 'connu' : 'inconnu', () => {
            if (known) c.recits.splice(c.recits.indexOf(r.id), 1);
            else c.recits.push(r.id);
            render();
          }, known ? 'on' : ''),
        ]),
      );
    }
  }

  function stepper(label: string, value: number, min: number, max: number, set: (v: number) => void): HTMLElement {
    return row(label, [
      button('−', () => (set(Math.max(min, value - 1)), render()), 'small'),
      valueSpan(value),
      button('+', () => (set(Math.min(max, value + 1)), render()), 'small'),
    ]);
  }

  render();
}

function el(tag: string, text?: string, className?: string): HTMLElement {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label: string, onClick: () => void, className = ''): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  if (className) b.className = className;
  b.addEventListener('click', onClick);
  return b;
}

function valueSpan(value: number): HTMLElement {
  return el('span', String(value), 'value');
}

function row(label: string, controls: HTMLElement[]): HTMLElement {
  const r = el('div', undefined, 'row');
  r.append(el('span', label, 'label'), ...controls);
  return r;
}
