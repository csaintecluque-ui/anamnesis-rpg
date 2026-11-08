import type Phaser from 'phaser';
import { endPreview, loadPicks, musicAvailable, musicPlaying, musicPosition, previewMusic, savePicks } from '../audio/conductor';
import { cachedCount } from '../audio/music';
import { FILES, TRACKS, chosenVariant, fileName, type TrackDef } from '../audio/musicRules';

/**
 * La page d'écoute (mode test ; décision de Cyril du 2026-11-08, docs/gdd/son.md) : les 36 morceaux, un à la fois ;
 * pour ceux qui ont deux versions, « Garder A » ou « Garder B ». Le choix vaut tout de suite sur cet appareil (le jeu
 * joue la version gardée) ; « Copier mes choix » donne la liste à envoyer pour qu'elle vaille pour tout le monde
 * (champ `choix` de src/data/musique.json).
 */
const LOTS: Record<TrackDef['lot'], string> = {
  A: 'Lot A · Les lieux, le jour et la nuit (une version)',
  B: 'Lot B · Les thèmes (deux versions)',
  C: 'Lot C · Les notes courtes des récompenses (deux versions)',
  D: 'Lot D · La berceuse de Maëlis (deux versions)',
};

const CSS_TEXT = `
#listening-panel { position: fixed; inset: 0; z-index: 1000; background: #1B1512; color: #EAD9B8;
  font-family: Georgia, 'Times New Roman', serif; display: flex; flex-direction: column; }
#listening-panel header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #C9804F; }
#listening-panel h1 { font-size: 20px; margin: 0; color: #C9804F; flex: 1; font-weight: normal; min-width: 220px; }
#listening-panel button { font: inherit; font-size: 15px; color: #EAD9B8; background: #2a211c; border: 1px solid #C9804F;
  border-radius: 6px; min-height: 36px; padding: 4px 12px; cursor: pointer; }
#listening-panel button:hover { background: #3a2b22; }
#listening-panel button.on { background: #5a3a26; }
#listening-panel button.playing { background: #7a4a2a; }
#listening-panel .now { padding: 6px 16px; color: #C9804F; min-height: 22px; }
#listening-panel main { flex: 1; overflow-y: auto; padding: 4px 16px 24px; }
#listening-panel h2 { font-size: 16px; color: #C9804F; margin: 16px 0 4px; font-weight: normal; }
#listening-panel .row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid rgba(201,128,79,0.2); }
#listening-panel .row .label { flex: 1; min-width: 260px; }
#listening-panel .row .time { color: #b8a88c; font-size: 14px; min-width: 52px; text-align: right; }
#listening-panel .row .pick { color: #b8a88c; font-size: 14px; width: 150px; }
#listening-panel .note { color: #b8a88c; font-size: 14px; margin: 8px 0; max-width: 900px; }
#listening-panel textarea { width: 100%; max-width: 900px; height: 80px; background: #2a211c; color: #EAD9B8; border: 1px solid #C9804F; }
`;

const clock = (s: number): string => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function openListeningPanel(scene?: Phaser.Scene): void {
  document.getElementById('listening-panel')?.remove();
  const keyboard = scene?.input.keyboard;
  if (keyboard) keyboard.enabled = false;
  const root = el('div');
  root.id = 'listening-panel';
  const style = document.createElement('style');
  style.textContent = CSS_TEXT;
  const header = el('header');
  const choices = el('span');
  header.append(
    el('h1', 'La musique · page d’écoute'),
    button('■ Arrêter', () => {
      previewMusic(null);
      render();
    }),
    choices,
    button('Copier mes choix', () => copyPicks()),
    button('Fermer (Échap)', () => close()),
  );
  const now = el('div');
  now.className = 'now';
  const main = el('main');
  root.append(style, header, now, main);
  document.body.append(root);

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  window.addEventListener('keydown', onKey);
  const timer = window.setInterval(() => showNow(), 250);

  function close(): void {
    window.clearInterval(timer);
    window.removeEventListener('keydown', onKey);
    root.remove();
    endPreview();
    if (keyboard) keyboard.enabled = true;
  }

  function showNow(): void {
    const playing = musicPlaying();
    const track = playing ? TRACKS.find((t) => playing === t.id || playing.startsWith(`${t.id}-`)) : undefined;
    const position = musicPosition();
    now.textContent = track
      ? `En écoute : ${track.titre}${track.variantes ? `, version ${playing!.slice(-1).toUpperCase()}` : ''}` +
        (position ? `  ·  ${clock(position.time)} / ${clock(position.duration)}` : '  ·  chargement…')
      : 'Rien en écoute.';
  }

  function render(): void {
    main.replaceChildren();
    const picks = loadPicks();
    const twoTakes = TRACKS.filter((t) => t.variantes);
    choices.textContent = `${twoTakes.filter((t) => picks[t.id]).length} / ${twoTakes.length} choisis`;
    main.append(
      note(
        'Un morceau à la fois. Pour ceux qui ont deux versions, écoute A et B, puis « Garder A » ou « Garder B » : le jeu ' +
          'joue aussitôt la version gardée, sur cet appareil. Quand tu as fini, « Copier mes choix » et envoie-les : ' +
          'je les garderai pour tout le monde. Chaque morceau se met en cache à la première écoute (un instant, la ' +
          'première fois), puis se rejoue hors ligne.',
      ),
    );
    if (!musicAvailable()) main.append(note('Ce navigateur ne permet pas la musique du jeu (pas de Web Audio).'));
    void cachedCount().then((n) => {
      if (n) main.firstChild?.appendChild(document.createTextNode(` Déjà en cache sur cet appareil : ${n} fichier${n > 1 ? 's' : ''}.`));
    });
    for (const lot of Object.keys(LOTS) as TrackDef['lot'][]) {
      main.append(el('h2', LOTS[lot]));
      for (const track of TRACKS.filter((t) => t.lot === lot)) main.append(row(track, picks));
    }
  }

  function row(track: TrackDef, picks: Record<string, string>): HTMLElement {
    const line = el('div');
    line.className = 'row';
    line.append(Object.assign(el('span', track.titre), { className: 'label' }));
    const takes = track.variantes ?? [undefined];
    for (const v of takes) {
      const name = fileName(track, v);
      const label = v ? `▶ ${v.toUpperCase()}` : '▶ Écouter';
      const play = button(label, () => {
        previewMusic(name);
        render();
      });
      if (musicPlaying() === name) play.className = 'playing';
      if (!FILES[name]) play.disabled = true;
      const time = Object.assign(el('span', FILES[name] ? clock(FILES[name].duree) : '—'), { className: 'time' });
      line.append(play, time);
    }
    if (track.variantes) {
      const picked = picks[track.id];
      for (const v of track.variantes) {
        const keep = button(`Garder ${v.toUpperCase()}`, () => {
          savePicks({ ...loadPicks(), [track.id]: v });
          render();
        });
        if (picked === v) keep.className = 'on';
        line.append(keep);
      }
      const shown = chosenVariant(track, picks);
      line.append(Object.assign(el('span', picked ? `gardée : ${picked.toUpperCase()}` : `à choisir (le jeu joue ${shown?.toUpperCase()})`), { className: 'pick' }));
    }
    return line;
  }

  function copyPicks(): void {
    const picks = loadPicks();
    const lines = TRACKS.filter((t) => t.variantes).map((t) => `${t.titre} : ${picks[t.id] ? picks[t.id].toUpperCase() : 'pas choisi'}`);
    const text = `Musique, mes choix (page d’écoute)\n${lines.join('\n')}`;
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = text;
      main.prepend(note('Copie ce texte :'), area);
      area.select();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          choices.textContent = 'Choix copiés : colle-les dans ton message.';
        },
        fallback,
      );
    } else fallback();
  }

  render();
  showNow();
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  return e;
}

function button(label: string, action: () => void): HTMLButtonElement {
  const b = el('button', label);
  b.type = 'button';
  b.addEventListener('click', action);
  return b;
}

function note(text: string): HTMLElement {
  const p = el('p', text);
  p.className = 'note';
  return p;
}
