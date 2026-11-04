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
  - **Personnage** : « Perso surpuissant » (attributs à 6, compétences à 10, niveau 10, PV et PR au max, 9999 Fers,
    marteau, arbalète, cuirasse et cristal de forge portés, cristal de Vie dans le sac, tous les Récits : tous les
    tests des dialogues passent, les jets ne ratent que sur un 1) ; chaque attribut et compétence réglable ; Fers ;
    PV ; PR (« PR au max », « PR à 0 ») ;
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

## Jalon 3, étape 1 (2026-11-02)

- **Écran titre** : « Jeu pour adultes (18 ans et plus) : violence, mort et thèmes sombres. »
- **Écran de mort** (`DeathScene`) : le nom du héros, le lieu, le dernier adversaire ; « Reprendre à la dernière
  sauvegarde » (lieu et date affichés) ou « Retour au titre ».
- **Journal** : quatrième onglet, **Bestiaire**.
- **Combat** : la liste du tour passe au-dessus des arbres ; les boutons d'attaque suivent le héros ou le compagnon
  dont c'est le tour ; en haut à droite, le pouvoir du cristal (héros) ou « Soigner » (Liane) ; clavier : 1 déplacer,
  2 et 3 attaques, 4 pouvoir ou soin.
- **Outils de dev** : onglet « Groupe » (ajouter ou retirer Liane et Boulon ; « Tout rencontrer » remplit le
  bestiaire).


## Jalon 3, étape 4 (2026-11-02) : les veillées

- **Écran de la veillée** (`VeilleeScene`, ouvert par l'aubergiste) : le public, ses goûts, la compétence de conteur
  et la renommée ; une ligne par Récit retenu (♥ aimé, ✗ détesté, « déjà racontée ici », chance) ; touches 1 à 9,
  pages au-delà ; le résultat (jet, réaction, rumeur encadrée, gains), « Finir la soirée » (Entrée). Hors du soir :
  « Attendre le soir ». Conception : `docs/gdd/veillees.md`.
- **Journal**, onglet « Récits » : les rumeurs entendues suivent les Récits (« Rumeur · … », lieu où on l'a entendue).
- **Outils de dev** : « Soir » (temps) ; « Veillées : rumeurs → Toutes entendues » (onglet « Groupe »).

## Jalon 3, étape 6 (2026-11-02) : les voies endormies et les contrats

- **Carte du monde** : les voies endormies ont leur marque (une bouche noire, deux rails), leur nom en italique, pas de
  route tracée ; le panneau dit leur danger (●○○) et propose « Descendre ».
- **Dans une voie** : le haut de l'écran dit « La halte des Fougères — niveau 2 » (ou « — le terminus ») ; les caisses
  à fouiller luisent de cuivre ; la descente est un trou dans le sol ; un piège ou des bêtes arrêtent la marche.
- **Le tableau des contrats** (`ContratsScene`, touché dans un relais) : le contrat en cours (Rendre, Abandonner),
  puis les offres (Prendre ; touches 1 à 3). Le contrat en cours s'affiche en tête du journal, onglet « Quêtes ».
- **Outils de dev**, onglet « Lieux » : descendre dans chaque voie au niveau voulu ; révéler les trois voies.

## Jalon 3, étape 7 (2026-11-03) : les factions et l'artisanat

- **L'atelier** (`AtelierScene`, ouvert par Ragna ou Sévane) : une ligne par recette (ce qu'elle donne, ce qu'il faut
  sur ce qu'on a, les Fers), « Forger » ou « Préparer » (touches 1 à 9), pages sur téléphone.
- **Inventaire** : « Boire » pour la Sève de Résonance (avec un cristal au cou).
- **Journal**, onglet Réputation : le rang chez les Gardiens de Mémoire en tête, avec ce qu'il faut pour le suivant ;
  le rang dans chaque guilde à côté de l'opinion. **Tableaux des contrats** : « Ton rang : Lanterne ».
- **Outils de dev**, onglet « Groupe » : « Matières du butin : 3 de chaque » ; « Factions : adhérer ».

## Essai de Cyril sur iPhone (2026-11-03) : correctifs

- **Murs translucides** (`src/engine/occlusion.ts`) : en vue isométrique, ce qui est plus près de l'écran se dessine
  par-dessus ce qui est derrière ; les murs du bord sud et est cachaient le héros et les caisses des voies endormies.
  Un obstacle qui cache le milieu du corps du héros, d'un habitant, d'une bête ou d'un objet à toucher devient
  translucide (35 %), comme dans les CRPG de référence. Un comptoir qui ne cache que les jambes reste opaque.
- **Carte du monde** : le panneau d'un lieu s'ouvre **en haut quand le lieu est en bas** (les voies endormies,
  Sept-Portes), et inversement ; il prend la hauteur de son texte ; le lieu touché est cerclé. En sortant d'une ville,
  plus de panneau qui cache le bas de la carte : un petit bouton « Rentrer : Gardebois » dans la barre du haut.
- **Dialogues** : les gains (réputation, rangs, objets) passent sous le nom quand ils ne tiennent pas sur sa ligne,
  au lieu de déborder dessus. « Réputation auprès des Nacelliers » (et non « de les »).
- **Outils de dev**, onglet « Lieux » : « Toute la carte » révèle tous les lieux de la carte du monde.

## PC d'abord (feuille de route, chantier 0, 2026-11-03)

Décision de Cyril : le jeu se joue sur PC (souris et clavier, 1920 × 1080) ; le téléphone reste une cible d'essai.
L'écran logique reste 1280 × 720, dessiné 1,5 fois plus grand sur un écran 1080p (`RENDER_SCALE`).

- **Infobulles au survol** (`src/ui/tooltip.ts`, textes : `src/rules/hints.ts`) :
  - sur la carte, ce qu'un clic ferait : « Ilyane Voix-d'Écorce — parler », « Le Fonds Muet — fermée », « Loup de
    Rouille — combattre », « Une caisse qui luit — la fouiller », « Un Écho — l'écouter », les sorties ; la main
    remplace la flèche ;
  - dans un dialogue, sur une option à jet ou à condition : « Jet : un d20 + 2 (Subterfuge) contre 13. Chances : 50 %. »,
    « Il faut Diplomatie 3 : tu as 1. » (même grisée) ;
  - au combat, sur un combattant : PV, Défense, portée, effets ; sur la carte du monde, le lieu et le temps de marche ;
  - dans l'inventaire, la fiche suit l'objet sous la souris.
- **Raccourcis clavier** :
  - carte : **E, Espace ou Entrée** pour parler ou agir avec le plus proche (à trois pas au plus) ; I, J, Échap comme
    avant. On marche **à la souris seulement** : les flèches (ZQSD, WASD) sont retirées le 2026-11-04, injouables sur
    une grille en losanges (retour de Cyril) ;
  - dialogue : 1 à 9, et Entrée ou Espace quand il n'y a qu'une réponse ;
  - combat : 1 Déplacer (la case se choisit à la souris), 2 et 3 les armes, 4 le pouvoir, **Tab** pour viser
    un ennemi, **Entrée** pour le frapper, Z la zone, Espace la fin du tour ; Fuir reste à la souris ;
  - carte du monde : **Tab** ou les flèches pour passer d'un lieu à l'autre, **Entrée** pour partir, **Échap** pour fermer ;
  - inventaire : ← → les onglets, ↑ ↓ les objets, 1 à 4 les boutons ; journal : ← → ou Tab, les onglets ;
  - écran titre : ↑ ↓ et Entrée ; écran de la mort : Entrée pour reprendre, Échap pour le titre.
- **Barre d'actions** du combat : chaque bouton porte sa touche (« 1 · Déplacer », « 3 · Arc · 12 », « Espace · Fin du
  tour »).
- **Texte** : les étiquettes de la carte du monde passent à 17 px ; le reste se lit déjà à 1080p.

## Étude du 3 novembre : la navigation (A1, A2, A3, A5)

Constat de l'étude (`docs/gdd/etude-2026-11-03.md`) : la caméra collée au héros cachait les sorties, un clic sur un mur
ne disait rien, traverser Gardebois prenait 8 s.

- **Caméra libre** (A1) : glisser à la souris (ou au doigt) déplace la vue ; la **molette** zoome entre 1,0 et 1,5
  (gardé d'un lieu à l'autre, pas dans la sauvegarde) ; **C** ou **Origine**, le bouton « Recentrer (C) » qui paraît
  sous le menu, ou le premier pas du héros ramènent la vue sur lui. Un appui qui bouge de plus de 10 px est un glisser,
  pas un clic.
- **Case interdite** (A2) : un losange rouge barré qui s'efface, et « On ne passe pas par là. » sous la souris
  (« Rien par là. » hors de la carte).
- **Courir** (A3) : **Maj** tenue en cliquant, ou un **double clic** : un pas en 80 ms au
  lieu de 160, l'animation deux fois plus vite.
- **Zone de clic** (A5) : le nom d'un PNJ au-dessus de sa tête se clique aussi ; sur écran tactile, le corps compte
  une fois et demie plus large.

## Étude du 3 novembre, vague 2 : la fiche et les barres (B1, B2)

- **La fiche** (`src/rules/fiche.ts`), premier onglet du journal : le niveau, l'expérience jusqu'au suivant (avec sa
  barre), les valeurs (PV, Défense, PA, résistance, Récits, Résonance), les sept attributs et leur modificateur, chaque
  compétence apprise avec son rang, **ce qu'elle ajoute au dé** et sa chance sur un test normal (difficulté 12), les
  dons et le trait, l'équipement (et son usure), les PV des compagnons.
- **Les barres du HUD**, en haut à droite sous le bandeau : PV du héros (rouges sous le quart), expérience vers le
  niveau suivant, PV de chaque compagnon.

## Étude du 3 novembre, vague 3 : la mini-carte (A7)

- **La mini-carte** (`src/engine/miniMap.ts` pour le calcul, `src/ui/miniMap.ts` pour le dessin), en bas à droite
  (232 × 128 sur PC) : tout le lieu en losange, comme la carte ; le sol (vert), les chemins, planchers et le pont
  (sable), l'eau (bleu), ce qui bloque (vert sombre) ; les **sorties et portes** (losanges clairs), les **habitants**
  (cuivre), les **ennemis** (rouge), les **Échos** (bleu clair) ; le **héros** (point clair cerclé d'encre) ; le
  **cadre de la vue**.
- **Un clic** (ou un glisser) sur elle porte la vue à cet endroit, comme glisser la carte : le héros ne bouge pas,
  « Recentrer (C) » paraît. Le survol le dit dans l'infobulle.
- **M** l'affiche ou la masque ; les **Options** aussi (« Mini-carte : Affichée / Masquée »), retenu sur l'appareil.
  Les messages du bas se font plus étroits quand elle est là, pour ne jamais la couvrir.

## Étude du 3 novembre, vague 3 : les fins vues (B11)

- Une quête principale à plusieurs issues, une fois finie, dit au journal **« Fins vues : 2 / 7 »**, avec le nom de
  celles qu'on a vues (« ✓ La foreuse sabotée ») et « D'autres chemins menaient ailleurs. » tant qu'il en reste ; les
  autres ne sont pas nommées. Le Dernier Train en a 7 (le rapport, Corvan, « Même réussir peut tout détruire », la
  peur, la foreuse sabotée, la chaudière, le Golem), la Clé de Rouille Bleue 3 (rendue, vendue, confiée), les
  Mémoires du Monde Perdu 3 (la ligne vendue, la dame en gris raccompagnée, le silence).
- Chaque fin pose `fin-<quête>-<fin>` (`fins` dans `src/data/quests.json`, `src/rules/fins.ts`) ; l'appareil retient
  les fins vues dans toutes ses parties (comme les options), pour que la deuxième partie compte la première. Une
  quête finie avant ce compte (ancienne sauvegarde) en montre une, sans nom.
- Un test vérifie que chaque façon de finir ces quêtes pose le repère d'une de leurs fins, et que chaque fin a la
  sienne (`src/rules/fins.test.ts`).
