# Interface : HUD, menu pause, options, PC

## Menu pause, options et HUD

- **HUD** : bouton « Menu » à gauche, « Inventaire » à droite ; le nom du lieu et la ligne d'état (nom, PV, niveau,
  Fers) occupent tout le centre et se mettent à jour en direct.
- **Menu pause** (`PauseScene`, depuis « Menu ») : Reprendre, Sauvegarder, Options, Retour au titre (avec sauvegarde
  auto). La carte est figée tant qu'il est ouvert.
- **Options** (`OptionsScene`, depuis l'écran titre ou le menu pause) :
  - **Volume** de 0 à 100 %, par pas de 10. Le jeu n'a pas encore de sons : le réglage est enregistré et appliqué
    au moteur audio, il servira dès leur arrivée.
  - **Taille du texte** : Normale ou Grande (× 1,15). S'applique aux dialogues (texte, options, nom du PNJ, messages)
    et aux messages du HUD. En taille Grande, le panneau de dialogue remonte jusque sous la barre du HUD, et chaque
    option prend la hauteur que son texte demande.
- **Enregistrement** : les options sont propres à l'appareil (`localStorage`, `src/settings.ts`), pas à la sauvegarde :
  une sauvegarde importée sur un autre appareil garde les options de cet appareil.

## PC (Linux, Windows) : clavier, souris, netteté

Le PC est une cible principale, au même titre que le téléphone (décision de Cyril, 2026-11-01).

- **Netteté** : la mise en page reste en 1280 × 720 unités, mais l'image est calculée à la résolution réelle de
  l'écran (× 1,5 sur un écran 1080p, × 2 sur un écran 1440p, un portable haute densité ou un téléphone ; plafonné à
  × 2). Les caméras zooment d'autant et le texte est rasterisé à ce zoom : rien n'est plus étiré par le navigateur.
  Code : `src/ui/viewport.ts`. Les tuiles provisoires restent dessinées à leur taille d'origine (elles seront
  remplacées en phase 2).
- **Raccourcis clavier** (`src/ui/keys.ts` ; un rappel s'affiche sur les boutons quand une souris est détectée, jamais
  sur téléphone) :

| Écran | Touche | Action |
|---|---|---|
| Carte | Échap | Menu pause |
| Carte | I | Inventaire |
| Menu pause | Échap | Reprendre |
| Options | Échap | Retour |
| Inventaire / troc | Échap (ou I pour l'inventaire) | Fermer |
| Dialogue | 1 à 9 (rangée du haut ou pavé numérique) | Choisir l'option (sans effet sur une option grisée) |
| Montée de niveau | Entrée | Continuer (quand tous les points sont répartis) |
| Montée de niveau | Échap | Remettre à plus tard (le bouton reste sur le HUD) |
| Sauvegardes | Échap | Retour |
| Combat | 1 / 2 / 3 | Déplacer / Mêlée / Tir |
| Combat | Z | Zone visée suivante |
| Combat | Espace | Fin du tour |

  « Fuir » n'a volontairement pas de raccourci : on ne quitte pas un combat par une touche mal placée. Les lettres
  suivent la lettre gravée sur la touche (sur un clavier AZERTY, c'est bien la touche marquée Z), et les chiffres
  marchent sans Maj sur la rangée du haut.
- **HUD fin** : avec une souris, le bandeau du haut est deux fois moins haut (52 unités, boutons de 40) ; sur écran
  tactile, il garde la taille du doigt (100 unités, boutons de 76).
- **Plein écran** : bouton dans les Options (PC, Android) ; F11 fonctionne aussi. Absent sur iPhone, où Safari n'a
  pas d'API plein écran (l'application installée occupe déjà tout l'écran).
