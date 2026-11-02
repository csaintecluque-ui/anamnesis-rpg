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
| Combat | 1 / 2 / 3 | Déplacer / première arme en main / seconde arme en main |
| Combat | Z | Zone visée suivante |
| Combat | Espace | Fin du tour |

  « Fuir » n'a volontairement pas de raccourci : on ne quitte pas un combat par une touche mal placée. Les lettres
  suivent la lettre gravée sur la touche (sur un clavier AZERTY, c'est bien la touche marquée Z), et les chiffres
  marchent sans Maj sur la rangée du haut.
- **HUD fin** : avec une souris, le bandeau du haut est deux fois moins haut (52 unités, boutons de 40) ; sur écran
  tactile, il garde la taille du doigt (100 unités, boutons de 76).
- **Écrans compacts avec une souris** (sur écran tactile, rien ne change) :
  - **Menu pause** : panneau de 400 (au lieu de 520), boutons de 300 × 52 (au lieu de 380 × 80) ;
  - **Inventaire / troc** : le panneau commence juste sous le bandeau, lignes de 52 (au lieu de 60), boutons
    de 130 × 38, « Fermer » de 180 × 44 ; chaque arme équipée dit dans quelle main elle est ;
  - **Combat** : barre du bas de 96 (au lieu de 150), boutons de 48 de haut, un peu relevés au-dessus du rappel
    des raccourcis.
- **Combat, noms des combattants** (PC et téléphone) : au-dessus de chaque combattant, seulement une barre de PV ;
  les noms et les PV sont dans le panneau **« Ordre du tour »**, à gauche (▶ devant celui qui joue). Un seul nom
  s'affiche sur l'arène : celui du combattant survolé à la souris, sinon celui qui joue. Les ennemis de même nature
  sont numérotés (« Rôdeur-Épine 1 », « Rôdeur-Épine 2 »), dans le panneau comme dans le journal du combat.
- **Plein écran** : bouton dans les Options (PC, Android) ; F11 fonctionne aussi. Absent sur iPhone, où Safari n'a
  pas d'API plein écran (l'application installée occupe déjà tout l'écran).

## Mode test (caché)

Pour essayer le jeu sans tout rejouer (demande de Cyril, 2026-11-01).

- **Activer / désactiver** : sur l'écran titre, toucher **5 fois de suite** (en moins de 3 secondes) le numéro de
  version, en bas à gauche. « · mode test » s'affiche alors en cuivre à côté de la version.
- **Outils** : dans le menu pause, sous les boutons habituels, **+50 Fers** et **PV au max** (`src/rules/testTools.ts`).
- Le réglage est propre à l'appareil (`settings.testMode`, comme les options), pas à la sauvegarde. Il n'apparaît
  dans aucun menu : un joueur ne le trouve pas par hasard.
- **Mode développeur** (demande de Cyril, 2026-11-02) : en mode test, le bouton **Outils de dev** du menu pause ouvre
  un panneau (HTML, au doigt, `src/ui/devPanel.ts`) :
  - **Personnage** : « Perso surpuissant » (attributs à 6, compétences à 10, niveau 10, PV au max, 9999 Fers, marteau,
    arbalète et cuirasse portés, tous les Récits : tous les tests des dialogues passent, les jets ne ratent que sur un
    1) ; chaque attribut et compétence réglable ; Fers ; PV ;
  - **Lieux** : aller tout de suite à n'importe quel lieu ; **Quêtes** : pas commencée → en cours → terminée ;
  - **Repères** : chercher et cocher n'importe quel repère d'histoire ; **Objets** et **Récits** : donner, retirer.
  - En fermant, la carte se reconstruit avec le nouvel état. Tout reste sauvegardable.

## Journal (2026-11-02)

- Bouton « Journal » dans la barre du haut (entre le titre et « Inventaire »), entrée du menu pause, touche J.
- Trois onglets : **Quêtes** (en cours d'abord, puis terminées ✓ ; à droite : résumé et « Où j'en suis », la dernière
  étape atteinte, `etapes` dans `quests.json`), **Récits** (ceux qu'on retient, et le plafond Mémoire + 1),
  **Réputation** (villes connues, guildes fréquentées, « membre »). Code : `src/rules/journal.ts`, `JournalScene`.

## Lisibilité sur téléphone (2026-11-02, accord de Cyril)

Sur un téléphone en paysage, l'écran logique de 1280 × 720 est affiché à environ la moitié de sa taille : les écrans
tactiles reçoivent donc des tailles à eux (détection « pas de souris », `HAS_MOUSE`).
- Combat : plateau agrandi (× 1,2), textes × 1,3 (bandeau, journal, ordre du tour, noms), boutons espacés.
- Écran titre : menu en 40 px, zones de toucher élargies. Création : boutons − et + plus larges (84 px), aide
  placée entre les deux boutons du bas.
- Carte : noms des PNJ en 17 px. Carte du monde : étiquettes en 19 px, jamais sous le panneau du bas.
- Commerce : titre et ligne des Fers séparés, boutons de 56 px. Menu pause : cadre ajusté aux cinq boutons.
- Reste un choix : le jeu garde le format 16:9 (bandes noires sur les côtés d'un iPhone).
