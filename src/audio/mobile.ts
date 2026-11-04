import type Phaser from 'phaser';

/**
 * Le son sur téléphone (essai de Cyril, 2026-11-04 : « sur le tel, je n'ai pas entendu de son »).
 * - Sur iPhone, l'interrupteur silencieux coupe l'audio des pages web, sauf si la page se déclare lecteur
 *   (`navigator.audioSession.type = 'playback'`, Safari 16.4 et plus) : le jeu suit alors les boutons de volume, comme
 *   une vidéo ; le volume des options reste le moyen de le faire taire.
 * - Un téléphone garde l'audio en veille jusqu'à un geste, et l'y remet quand l'application passe en arrière-plan :
 *   chaque toucher, clic ou touche le réveille, et le retour au premier plan aussi.
 */
export function setUpMobileAudio(game: Phaser.Game): void {
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  const wake = () => {
    try {
      if (session && session.type !== 'playback') session.type = 'playback';
    } catch {
      // An older browser: nothing to declare.
    }
    const context = (game.sound as Phaser.Sound.WebAudioSoundManager).context;
    if (context && context.state !== 'running') void context.resume().catch(() => undefined);
  };
  wake();
  for (const event of ['pointerdown', 'touchend', 'keydown']) window.addEventListener(event, wake, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') wake();
  });
}
