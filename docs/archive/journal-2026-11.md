# Journal de bord — archive de novembre 2026

> Historique figé : l'état actuel est dans `docs/JOURNAL.md`.
> Les renvois ci-dessous suivent l'ancienne organisation (avant le découpage du 2026-11-01) :
> `LORE.md` §0 → `docs/univers/sources.md` · §10 → `docs/univers/zones-floues.md` ·
> §11 → `docs/univers/lieux/gardebois.md`, `lieux/gare-engloutie.md`, `personnages/pnj.md`, `propositions.md`.
> `GDD.md` §n → `docs/gdd/` (§0 decisions, §1 attributs, §2 competences, §3 creation, §4 memoire, §5 combat,
> §6 tranche-verticale, §7 sauvegarde, §8 exploration, §9 dialogues, §10 inventaire, §11 progression,
> §12–13 interface). `CLAUDE.md` §3–4 → `docs/gdd/cahier-des-charges.md`.

## 2026-11-01 — Session 1 : cadrage

### État constaté

- Dossier : `CLAUDE.md` et `assets/brand/` seulement ; pas encore de dépôt git.
- Outils : git 2.43 et gh 2.45 OK (connecté au compte GitHub `csaintec`) ; **Node.js absent** (ni npm) ; Playwright absent.
- MCP Higgsfield : à ajouter par Cyril depuis son terminal (le CLI `claude` n'est pas accessible depuis la session).
- `assets/brand/logo-small.svg` : coquille dans le tracé (`62.2931.73` au lieu de `62.29 31.73`) qui dessine un trait parasite
  à gauche du premier « c ». Non corrigé : le logo ne se modifie pas sans l'accord de Cyril.

### Fait

- Propositions consignées : attributs, compétences, traits, 3 pistes de mécanique signature, cadre de la tranche verticale
  (`GDD.md`, `LORE.md`, tout « à valider »).

### En attente de Cyril

- Validation des attributs, compétences, mécanique signature, cadre de la tranche verticale.
- Réponses aux questions sur le roman (`LORE.md`).
- Installation de Node.js, nom et visibilité du dépôt GitHub.

### Reste à faire après validation

- Initialiser le dépôt GitHub et le squelette Phaser + Vite.

## 2026-11-01 — Session 1 (suite) : intégration du lore canonique

### Décisions de Cyril

- Le héros est un nouveau personnage. La magie existe mais n'est pas liée à la mémoire.
- Dépôt GitHub `anamnesis-rpg` public : OK. TypeScript : OK.
- `docs/Lore/` fait foi (règle ajoutée dans `CLAUDE.md` §1).

### Fait

- Lecture intégrale de `docs/Lore/` (51 fichiers : markdown, HTML, 2 PDF) et de `docs/Carte Anamnesis.png`.
  Les trois fichiers « compilés » sont des copies des fichiers individuels (vérifié).
- `docs/LORE.md` réécrit : synthèse sourcée (monde, magie, mémoire, lieux, factions, peuples, personnages,
  chronologie, ton), 21 zones floues ou contradictions du canon, propositions de jeu « à valider ».
- `docs/GDD.md` réécrit : 7 attributs (les 6 du JDR de Cyril + Mémoire), 12 compétences du JDR (Combat scindé,
  Pilotage retiré), résolution au d20 du JDR, dons, 3 pistes de mémoire ancrées (Échos, Récits, Mémoire contre Oubli),
  tranche verticale à Gardebois.
- Propositions de la session 1 rejetées (doublons et contradictions avec le canon).

### En attente de Cyril

- Arbitrages sur les zones floues prioritaires, dont : Solarix (Califat ou Communion), peuples de Verdantis,
  nature des Gardiens de Mémoire.
- Validation : attributs, mécanique de mémoire, tranche verticale (lieu, quête, PNJ, noms).
- Node.js toujours absent (vérifié en fin de session).

### Validation (même jour)

- Cyril a validé toutes les recommandations : attributs, compétences, mécanique de mémoire (pistes A et B),
  tranche verticale, et arbitrages des zones floues 1 à 4 et 19. Le détail est dans `LORE.md` §10 et §11
  et dans `GDD.md` §0.
- `sudo` est bloqué dans le terminal de la session Claude : Cyril installe Node.js depuis son propre terminal.
- Dépôt git initialisé en local. Publication sur GitHub en attente d'une décision : publier `docs/Lore/` ou non.

## 2026-11-01 — Session 1 (fin) : dépôt et squelette

### Décisions

- `docs/Lore/` et la carte restent **en local** : ils sont exclus du dépôt public (`.gitignore`, règle dans `CLAUDE.md`).
  Ils n'ont jamais été commités.
- Phaser **3.90.0** (dernière v3), conformément à `CLAUDE.md`. Phaser 4 existe (4.2.1), mais la bascule n'est pas
  prévue sans décision explicite.
- Versions figées : Vite 8.3.5, TypeScript 7.0.2, Vitest 5.0.5. Node.js 26.13 installé par Cyril.

### Fait

- Dépôt public créé : https://github.com/csaintec/anamnesis-rpg (branche `main`).
- Squelette Phaser + Vite + TypeScript :
  - écran titre (Nouvelle partie ; Charger et Options grisés ; signature « Anamnesis · CSC » avec le sceau) ;
  - terrain d'essai isométrique 12 × 12, avec déplacement par toucher ou clic ;
  - règles du GDD en code pur (`src/rules/`) : modificateur d'attribut, test au d20, chance de réussite,
    seuils de dialogue, valeurs dérivées ;
  - données en JSON (`src/data/` : 7 attributs, 12 compétences) ;
  - projection isométrique (`src/engine/iso.ts`).
- Tests : 14 tests unitaires (règles et projection iso) au vert ; typecheck et build OK.
- Vérifié dans le navigateur en paysage téléphone (844 × 390) et en portrait.
  Bug corrigé : sur rotation, Phaser recentrait le canvas sans le redimensionner ; on force désormais `scale.refresh()`.

- Publication en ligne : https://csaintec.github.io/anamnesis-rpg/
  - Le workflow `.github/workflows/deploy.yml` lance les tests et le build, puis déploie à chaque push sur `main`.
  - Pages a été activé en mode « workflow ».
  - Vérifié en ligne : écran titre et terrain d'essai, aucune erreur, toutes les ressources en 200.

- PWA installable et jouable hors ligne :
  - `vite-plugin-pwa` 2.0.0 génère le manifeste et un service worker Workbox qui met tout le jeu en cache ;
    il se met à jour tout seul à chaque nouvelle version.
  - Icônes générées depuis `logo-seal.svg` par `npm run icons` (`scripts/generate-icons.mjs`, via `@resvg/resvg-js`),
    sans toucher au dessin du sceau :
    - 192 et 512 px : tuile encre arrondie (rx 22/100), sceau au centre, conformément à `CLAUDE.md` ;
    - apple-touch-icon 180 px et icône « maskable » 512 px : tuile carrée, car iOS et Android arrondissent eux-mêmes
      (des coins transparents apparaîtraient en noir sur iOS).
  - Balises iOS : écran plein, barre d'état translucide, titre « Anamnesis ».
  - Vérifié sur le build local : service worker actif, 10 fichiers en cache. Avec le serveur **arrêté**,
    l'écran titre et le terrain d'essai se chargent et fonctionnent.
  - Vérifié en ligne (commit 8a81c6f) : service worker actif sur `/anamnesis-rpg/`, page contrôlée, 10 fichiers en cache.
    Une page déjà ouverte peut afficher l'ancienne version pendant environ 10 minutes (cache de GitHub Pages).
  - **Vérifié par Cyril sur son iPhone** : installation sur l'écran d'accueil réussie, le jeu fonctionne.
- `npm audit` signale des vulnérabilités modérées dans des dépendances de workbox-build (glob, minimatch,
  deepmerge, ejs). Ce sont des outils de **construction seulement**, rien n'est livré aux joueurs.
  La « correction » proposée rétrograderait vite-plugin-pwa en 1.1, peut-être incompatible avec Vite 8 :
  non appliquée, à revoir à la prochaine version de workbox.

### Reste à faire (jalon 1, dans l'ordre proposé)

1. La Gare Engloutie (carte, Écho, Ingrid Brisefer, résolutions de la quête), puis le combat, l'inventaire, le troc
   et la montée de niveau.

### Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : non corrigée, accord de Cyril requis.
  Ce logo sert de favicon.
- Chronologie du canon non arbitrée (`LORE.md` §10, points 6 à 13).

## 2026-11-01 — Transfert du dépôt vers `csaintecluque-ui`

- Le dépôt avait été créé avec le compte `csaintec`, déjà connecté à `gh` sur la machine. Ce compte appartient
  bien à Cyril, mais son compte principal est `csaintecluque-ui`.
- Transfert demandé depuis `csaintec`, puis accepté par Cyril. Le dépôt est désormais
  https://github.com/csaintecluque-ui/anamnesis-rpg, et le site https://csaintecluque-ui.github.io/anamnesis-rpg/
  (l'ancienne adresse `csaintec.github.io` ne fonctionne plus).
- `gh` connaît les deux comptes ; le compte **actif** est `csaintecluque-ui`. Le remote git local pointe vers le
  nouveau dépôt.
- La configuration git globale signe toujours `csaintec <csaintecluque@proton.me>` : non modifiée, au choix de Cyril.
- Après le transfert : réinstaller l'icône sur l'iPhone depuis la nouvelle adresse.

## 2026-11-01 — Sauvegarde locale

- Écran des emplacements (« Charger » depuis le titre, « Sauvegarder » depuis le terrain d'essai) :
  3 emplacements et 1 sauvegarde auto. On peut y charger, exporter, importer et supprimer.
  Les détails sont dans `GDD.md` §7.
- Code : `src/save/codec.ts` (format, validation, migrations), `src/save/store.ts` (emplacements),
  `src/save/browser.ts` (stockage de l'appareil, export, import), `src/scenes/SlotsScene.ts`,
  état de jeu `src/state/gameState.ts`, lieux en données dans `src/data/locations.json`.
  Bouton tactile commun : `src/ui/button.ts`.
- Tests : 21 nouveaux (35 au total). Ils couvrent l'aller-retour, le refus des fichiers étrangers, abîmés,
  trop gros ou d'une version future, l'import invalide qui n'écrase rien, et le stockage plein.
- Vérifié dans le navigateur :
  - sauvegarder, écraser avec confirmation, sauvegarde auto au retour au titre, charger (position retrouvée) ;
  - exporter (fichier lu et valide) ; importer (le sélecteur s'ouvre bien pendant le geste du joueur,
    condition exigée par iOS) ; refus d'un faux fichier sans perte ;
  - emplacement corrompu affiché sans plantage, puis supprimé ; aucune erreur dans la console.
  - Texte des détails agrandi après calcul de la taille réelle en paysage sur téléphone (environ 12 px).
- Pas encore vérifié sur iPhone : l'export par « Enregistrer dans Fichiers » et l'import depuis Fichiers.
- Bug évité grâce au typage : une méthode `load` de la scène masquait le chargeur interne de Phaser ;
  elle s'appelle désormais `loadSave`.
- Mises à jour de la PWA : le nouveau service worker prenait le contrôle, mais la page gardait l'ancien code jusqu'à
  l'ouverture suivante. Désormais, la page se recharge d'elle-même quand une mise à jour s'installe, **seulement
  sur l'écran titre** : en pleine partie, on ne recharge jamais, pour ne rien perdre.
  Vérifié en ligne : une seule ouverture suffit pour arriver sur la dernière version.
- La version (`v0.1.0 · commit`) s'affiche en bas à gauche de l'écran titre, pour savoir ce qui tourne sur un appareil.
- TypeScript séparé en deux configurations : `tsconfig.json` (jeu, navigateur) et `tsconfig.node.json`
  (outils de construction, avec `@types/node`).
- **Vérifié par Cyril sur son iPhone** : sauvegarde, export vers Fichiers, import depuis Fichiers et chargement
  fonctionnent.

## 2026-11-01 — Création de personnage

- Assistant en 5 étapes (`src/scenes/CreationScene.ts`), conforme au GDD validé : nom ; 7 attributs avec 3 points
  et le bonus humain (+1 sur deux attributs) ; 12 compétences avec 6 rangs (3 au maximum) ; 1 don parmi 6 ;
  récapitulatif avec PV, résistance, défense, PA, charge et Récits retenus.
  Règles tranchées en codant : `GDD.md` §3, « Précisions d'implémentation ».
- Règles en code pur et testées (`src/rules/character.ts`, dons en données dans `src/data/feats.json`).
  57 tests au total, dont 22 nouveaux.
- Sauvegarde en **version 2**, avec le personnage. Les sauvegardes v1 sont converties : le joueur crée son personnage,
  puis la partie reprend au même endroit.
- Le champ du nom est un vrai champ HTML, pour faire apparaître le clavier du téléphone (éléments DOM de Phaser activés).
- Le terrain d'essai affiche le nom, les PV et le niveau du personnage.
- Vérifié dans le navigateur :
  - parcours complet ; refus d'avancer sans nom (message) ; plafonds et désactivation des boutons ;
  - bonus humain limité à deux attributs ; bonus au dé justes ;
  - sauvegarde v2 conforme (PV 40 avec Dur à Cuire) ;
  - ancienne sauvegarde v1 → création → reprise en (6, 2) avec son temps de jeu ;
  - Mémoire de Kael ajoute bien +2 en Érudition.
- Limite connue : en paysage sur téléphone, les petits boutons − / + font environ 31 px de haut à l'écran
  (en dessous des 44 px conseillés). Sept lignes d'attributs doivent tenir dans la hauteur. À juger sur iPhone.
- **Vérifié par Cyril sur son iPhone** : la création de personnage fonctionne. Pas de remarque sur la taille des boutons.

## 2026-11-01 — Carte de Gardebois (Marché des Lisières)

- Carte Tiled 28 × 24 (`src/data/maps/gardebois.json`), générée par `scripts/build-maps.mjs` à partir d'un plan lisible
  (graine fixe pour les arbres et fleurs aléatoires).
  - Contenu : bordure de forêt, route de l'entrée (ouest) à la sortie vers la Gare (est), place du marché avec étals,
    ruisseau et pont, base d'Arbre-Titan, maisons sur pilotis, lanternes, cercle de lanternes d'Ilyane,
    Tobias au marché, 2 panneaux.
  - L'aménagement est inventé : il est soumis à validation dans `LORE.md` §11.
- Tuiles provisoires dessinées en SVG (`scripts/tiles-def.mjs`), assemblées en une planche PNG lisible par Tiled.
- Moteur : lecteur Tiled (`src/engine/tiledMap.ts`), recherche de chemin A* (`src/engine/pathfinding.ts`),
  scène de carte (`MapScene`) et HUD séparé (`HudScene`). Le terrain d'essai est supprimé.
- Sauvegarde **v3** : arrivée nommée ; migration des parties du terrain d'essai vers l'entrée de Gardebois.
- Tests : 68 au total.
  - Sur la vraie carte : l'entrée mène à la sortie ; les abords de chaque PNJ et panneau sont accessibles ;
    il n'y a que deux ouvertures ; l'eau bloque, le pont non.
  - Sur la recherche de chemin : contournement, coins, cas impossibles.
- Vérifié dans le navigateur :
  - chargement ; marche jusqu'à une case éloignée ; caméra qui suit ;
  - toucher Tobias (marche jusqu'à lui, puis message) et un panneau (son texte) ;
  - sortie vers la Gare (message « bientôt ») ; sauvegarde puis retour au même endroit ;
  - Titre avec sauvegarde auto ; nouvelle partie à l'entrée ; ancienne sauvegarde v2 migrée ;
  - 60 i/s en WebGL sur ordinateur, aucune erreur.
- Corrigé pendant les tests : toucher le corps d'un PNJ visait la case derrière ses pieds.
  Les PNJ et panneaux sont désormais touchables sur toute leur image.
- Outil de test : en développement seulement, l'instance du jeu est exposée (`window.__anamnesis`)
  pour calculer la position exacte d'une case à l'écran. Elle est absente du site publié.
- **Aménagement du Marché des Lisières validé par Cyril** (`LORE.md` §11).

## 2026-11-01 — Dialogues (Ilyane, Tobias)

- Moteur pur et testé (`src/rules/dialogue.ts`). Les conditions de test d'attribut ou de compétence laissent l'option
  visible et grisée, avec ce qui manque ; les conditions d'histoire la masquent. Effets : repères, quêtes, XP.
  Détails dans `GDD.md` §9.
- Dialogues en JSON (`src/data/dialogues/`).
  - Ilyane confie la quête « Le Dernier Train » : **test d'attribut Perception 4** (remarquer qu'elle est atteinte),
    bonus **Érudition 2**.
  - Tobias : **test de compétence Diplomatie 2** pour obtenir le laissez-passer du chantier. Sinon, il en demande
    cinquante Fers ; ce sera possible quand le troc existera.
- Écran de dialogue (`DialogueScene`) au-dessus du HUD ; la carte est en pause pendant la conversation.
- Sauvegarde **v4** (repères et quêtes) ; migration des v3.
- Textes à relire : `docs/DIALOGUES.md`, généré par `npm run dialogues`. Statut « à valider » dans `LORE.md` §11.
- Tests : 83 au total. Ils couvrent le moteur et les deux fichiers de dialogue (bien formés, tests du GDD présents).
- Vérifié dans le navigateur :
  - **avec Perception 4 / Érudition 2 / Diplomatie 2** : chaque option testée est accessible ; repères, XP (10 + 10 + 25)
    et quête mis à jour ; Ilyane passe au nœud « en cours » ;
  - **avec Perception 3 / Diplomatie 0** : options grisées avec « Il te faut… », impossibles à choisir ;
  - la plus longue option tient sur deux lignes ; la sauvegarde auto conserve repères, quête et XP.
- **Textes des dialogues d'Ilyane et de Tobias validés par Cyril** (`LORE.md` §11).

## 2026-11-01 — La Gare Engloutie : carte, Écho, Ingrid Brisefer

- Carte Tiled 24 × 18 (`src/data/maps/gare-engloutie.json`, générée par `npm run maps`), accessible depuis la sortie est de
  Gardebois, déjà prévue (`cible: 'gare-engloutie'`). Un seul chemin, depuis l'ouest.
  - Contenu : quai de pierre fendu, rails, wagon renversé du « dernier train », chantier d'Ingrid Brisefer (foreuse dans
    la Faille, tente, caisses), un Golem de Ferraille endormi à l'écart, un panneau.
  - Aménagement inventé, soumis à validation (`LORE.md` §11, nouvelle section « Gare Engloutie »).
  - 8 nouvelles tuiles provisoires (`scripts/tiles-def.mjs` : rail, quai, wagon, foreuse, faille, tente, golem, echo).
- **Passage entre cartes**, jusqu'ici affiché « bientôt » : les objets `sortie` portent maintenant une propriété
  `arrivee` (nom de l'objet d'arrivée dans l'autre carte) ; `MapScene.checkExit` bascule réellement de carte.
  Testé dans les deux sens (Gardebois ↔ Gare Engloutie), le joueur arrive au bon endroit à chaque fois.
- **Écho interactif** (piste A) : sur le quai, près du wagon. Avec Mémoire 4, on peut y « entrer » et recueillir le
  **Récit du savant Corvan** [E2, cité en `GDD.md` §4] ; sinon on l'observe sans le recueillir. Réutilise le moteur de
  dialogue existant (un Écho est un `pnj`-like de plus dans `DIALOGUES`, avec son propre nœud).
- **Récits retenus** (piste B) : `character.recits`, un tableau plafonné par `talesRetained` (Mémoire + 1, dons compris) ;
  au-delà, le plus ancien est oublié. Nouvelle condition de dialogue `{ recit }` (masquée tant qu'on ne le connaît pas,
  comme un repère) et nouvel effet `{ learnRecit }`. Code dans `src/rules/recits.ts`.
- **Ingrid Brisefer** (`src/data/dialogues/ingrid.json`) : défend son chantier, puis cède à la parole
  (**Diplomatie 3** ou **Commandement 3**) ou au Récit du savant Corvan une fois recueilli. Les trois résolutions
  terminent la quête « Le Dernier Train » et donnent 40 XP.
- **Retour chez Ilyane** : nouveau nœud « resolu » une fois la quête terminée (additif, ne touche pas aux textes déjà
  validés) ; elle soupçonne les Réveilleurs d'avoir financé la prospection.
- Sauvegarde **v5** : `character.recits`. Migration des v4 (liste vide).
- Tests : 100 au total (+17). Nouvelle carte (ouverture unique, portique de retour, joignabilité d'Ingrid et de l'Écho,
  wagon/golem bloquants), seuils d'Ingrid et de l'Écho, plafond et oubli des Récits, migration et rejet de sauvegarde v5.
- Vérifié dans le navigateur (desktop, et le terrain en paysage 844 × 390) : la carte s'affiche correctement (tuiles,
  Ingrid, Écho, wagon, foreuse, golem) ; le dialogue d'Ingrid se résout par Diplomatie 3 avec le message de quête
  terminée ; l'Écho donne le Récit (message « Récit retenu : Le Savant Corvan ») ; le passage Gardebois → Gare
  Engloutie → Gardebois place le joueur au bon endroit dans les deux sens ; le nœud « resolu » d'Ilyane s'affiche
  une fois la quête terminée. Aucune erreur dans la console.

### Reste à faire (jalon 1, dans l'ordre proposé)

1. **Combat** au tour par tour : les résolutions « Combat » (Golem de Ferraille, 2 Rôdeurs-Épine) et « Discrétion »
   (entrer de nuit, saboter la foreuse) de la quête restent à câbler une fois le système prêt ; pour l'instant, seule
   la résolution par la parole (et le Récit) est jouable. Le Golem est visible sur la carte mais inerte.
2. Inventaire, troc avec Tobias, montée de niveau.

### Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : non corrigée, accord de Cyril requis.
- Chronologie du canon non arbitrée (`LORE.md` §10, points 6 à 13).
- Aménagement de la Gare Engloutie, dialogue d'Ingrid et scène de l'Écho : à valider par Cyril (`LORE.md` §11).

## 2026-11-01 — Combat au tour par tour (Golem de Ferraille, 2 Rôdeurs-Épine)

- Troisième résolution de la quête « Le Dernier Train » : le Golem de Ferraille, visible mais inerte sur la carte
  de la Gare Engloutie depuis la session précédente, devient combattable. Même récompense que les résolutions
  par la parole (`chantier-arrete`, quête terminée, 40 XP), pour rester équilibré.
- Règles en code pur et testées (`src/rules/combat.ts`, 23 tests) : dés, initiative (d20 + Agilité ou bonus propre),
  déplacement à 1 PA la case, attaque à 3 PA (toucher d20 + mod. + rang ≥ Défense, dégâts dés + mod., critique sur 20
  qui double les dés, échec sur 1), visée par zone (tête étourdit, bras désarme, jambes ralentit, jusqu'au prochain
  tour de la cible), couverture (prête, pas encore fournie par le terrain).
- Données : `src/data/weapons.json` (Épée longue, Arc — la Dague attend l'inventaire) et `src/data/enemies.json`
  (Golem de Ferraille, Rôdeur-Épine, PV/Défense/dégâts/PA/XP/texte de défaite non létal).
- `src/scenes/CombatScene.ts` : arène dédiée 9 × 7 (iso, même planche de tuiles), jetons avec PV affichés,
  barre d'actions (Déplacer, Mêlée, Tir, zone, Fin du tour, Fuir), IA ennemie simple (se rapproche puis attaque).
  Victoire : effets de quête appliqués et toast ; défaite du héros : non létale, ramené à Gardebois à 1 PV ;
  fuite : referme le combat sans conséquence.
- `MapScene` : toucher le Golem lance le combat (`scene.pause` Map et Hud, `scene.launch('Combat', …)`) si la quête
  est active et non résolue ; sinon un message signale qu'il est déjà immobile.
- Tests : 123 au total (+23). Carte (Golem placé et joignable), règles de combat (dés, initiative, déplacement,
  portée, résolution d'attaque, zones, tours, victoire/défaite, armes du héros, dons de combat).
- Vérifié dans le navigateur (paysage téléphone 844 × 390) : la carte (tuiles, Ingrid, Écho, Golem, Rôdeurs
  décoratifs) s'affiche correctement ; le combat se déclenche sur le Golem, l'arène et les jetons s'affichent, le
  tour de l'IA déplace les ennemis vers le héros sans dépasser leurs PA ; une vraie attaque au toucher (tap sur un
  ennemi en mode Mêlée) consomme 3 PA et affiche le résultat (ici un échec critique) ; une victoire simulée
  applique bien `chantier-arrete`, termine la quête et donne 40 XP, puis referme proprement le combat (la carte et
  le HUD reprennent). Aucune erreur dans la console sur une session de navigateur propre.
- Limite connue : non vérifié en conditions réelles de jeu (tour complet joué à la main du début à la fin) ; les
  vérifications ci-dessus combinent de vraies interactions (tap, attaque) et des appels directs aux méthodes de la
  scène pour contourner le ralentissement du navigateur de test en arrière-plan.

### Reste à faire (jalon 1)

1. Inventaire, troc avec Tobias, montée de niveau.
2. Couverture dérivée du terrain ; fuite liée à une position de l'arène plutôt qu'un bouton sans condition ;
   arène tirée de la carte explorée plutôt qu'un espace dédié — si Cyril souhaite aller plus loin que le provisoire.

## 2026-11-01 — Inventaire et troc

- Catalogue d'objets (`src/data/items.json`) : Dague, Épée longue, Arc, Armure de cuir, Armure de ferraille,
  Lampe à cristal, Corde, Bandage — poids, prix en Fers (monnaie de Ferros, déjà validée via le dialogue de Tobias),
  emplacement (main/armure) ou effet (bonus de Défense, soin). Monnaie de départ : 15 Fers, moins que le
  laissez-passer (50 Fers), à dessein (GDD §6).
- Règles en code pur et testées (`src/rules/inventory.ts`, 15 tests) : poids porté contre la Charge, achat/vente
  (vente à moitié prix, arrondie en dessous), équiper/déséquiper (deux mains + armure), objets de soin.
- **L'Armure équipée agit vraiment sur le combat** : son bonus de Défense s'ajoute à celle du héros
  (`makeHeroCombatant`). Les armes équipées n'ont pas encore d'effet en combat (le héros se bat toujours avec
  Épée longue et Arc, comme depuis la session précédente) : à raccorder plus tard.
- `TradeScene` : écran de troc/inventaire (acheter, vendre, équiper, utiliser), ouvert soit depuis le bouton
  « Inventaire » du HUD (ses propres objets seulement), soit depuis le dialogue de Tobias (« Voir l'étal. »,
  achat compris). Nouvel effet de dialogue `openTrade`, générique (n'importe quel PNJ pourra l'utiliser).
  Pour l'instant, tous les marchands vendraient le même catalogue : à valider si des objets doivent être exclusifs
  à un lieu.
- Sauvegarde **v6** : `character.fers`, `inventory`, `equipment`. Migration des v5 (15 Fers, rien porté).
- Tests : 143 au total (+20, carte et dialogues inclus). `npm run typecheck`, `npm run build` et `npm test` au vert.
- Vérifié dans le navigateur (paysage téléphone 844 × 390) : le bouton Inventaire du HUD ouvre l'écran (sans achat
  possible) ; depuis Tobias, « Que racontent… » → « Voir l'étal. » ouvre bien le troc avec achat ; acheter une
  Épée longue dépense les Fers et l'ajoute à l'inventaire ; l'équiper puis la vendre la retire proprement de
  l'équipement et rembourse la moitié du prix ; fermer l'écran rend la main à la carte et au HUD. Aucune erreur
  dans la console sur une session de navigateur propre.
- Limite connue de la session de vérification (pas du jeu) : le navigateur de test, en arrière-plan, perd parfois
  son contexte graphique (WebGL) après quelques secondes d'inactivité et affiche des tuiles « manquantes » ;
  les données sous-jacentes restent toujours correctes (vérifié par lecture d'état). Un onglet au premier plan,
  comme dans le jeu réel, n'est pas concerné.

### Reste à faire (jalon 1)

1. Montée de niveau (l'expérience s'accumule déjà).
2. Raccorder les armes équipées au combat ; catalogues de troc propres à chaque marchand, si souhaité.

## 2026-11-01 — Montée de niveau

- Seuils d'expérience cumulés (premier jet d'équilibrage, à valider) : `50 × niveau × (niveau − 1)` — niveau 2 à
  100 XP, niveau 3 à 300, niveau 4 à 600…
- Règles en code pur et testées (`src/rules/leveling.ts`, 8 tests) : seuils, points de compétence à répartir
  (`3 + mod. Intellect`, GDD §2), répartition (plafond à 10 par compétence, pas à la création), application
  (niveau +1, PV au maximum). Plusieurs niveaux d'affilée sont traités un par un, chacun avec ses points.
- `LevelUpScene` : répartition des points (même présentation que la création), bouton « Continuer » désactivé tant
  qu'il reste des points. Un nouveau bouton « ✦ Montée de niveau ! » apparaît sur le HUD dès que le seuil est
  franchi — à l'initiative du joueur, jamais automatique ni forcé.
- Au passage, le PV/niveau affiché sur le HUD, jusqu'ici figé à l'ouverture de la carte, **se met à jour en direct**
  (petite dette technique de la session des Récits, corrigée ici).
- Tests : 151 au total (+8). `npm run typecheck`, `npm run build` et `npm test` au vert.
- Vérifié dans le navigateur : le bouton de montée de niveau apparaît dès que l'XP franchit le seuil, sans recharger
  la carte ; répartir les points, puis confirmer, fait passer le personnage au niveau 2, le soigne entièrement et
  met à jour le HUD en direct (vérifié : PV 53/53, niveau 2) ; le bouton disparaît ensuite. Aucune erreur dans la
  console.

### Reste à faire (jalon 1)

Tous les points de `CLAUDE.md` §4 sont maintenant couverts, sauf un : **menu pause et options (volume, taille du
texte)**, toujours grisées depuis l'écran titre (session 1). Le reste de la tranche verticale est là : écran titre,
création de personnage, hub et donjon, PNJ et dialogues à embranchements, quête principale à plusieurs résolutions,
combat, inventaire et troc, montée de niveau, PWA installable.

1. Menu pause et options (volume, taille du texte) — le seul point du jalon 1 qui reste entièrement à faire.
2. Raccorder les armes équipées au combat (le héros se bat toujours avec Épée longue et Arc par défaut).
3. Couverture dérivée du terrain ; fuite liée à une position de l'arène ; arène de combat tirée de la carte
   explorée plutôt qu'un espace dédié.
4. Catalogues de troc propres à chaque marchand.
5. Les points en suspens listés plus haut (coquille du logo, chronologie du canon, contenus « à valider »).

## 2026-11-01 — Menu pause, options, HUD et Fers

Retours de Cyril : le bouton Inventaire débordait sur le nom du lieu ; il faut un moyen de gagner des Fers pour
tester le troc ; feu vert pour le menu pause et les options.

- **HUD réorganisé** : « Menu » à gauche, « Inventaire » à droite, nom du lieu et ligne d'état au centre, sans
  chevauchement. « ← Titre » et « Sauvegarder » passent dans le menu pause. La ligne d'état affiche aussi les Fers.
- **Menu pause** (`PauseScene`) : Reprendre, Sauvegarder, Options, Retour au titre (sauvegarde auto).
- **Options** (`OptionsScene`, depuis le titre ou la pause) : volume (0–100 %) et taille du texte (Normale /
  Grande), enregistrés sur l'appareil (`src/settings.ts`). Le volume est appliqué au moteur audio mais le jeu n'a pas
  encore de sons. La taille Grande agrandit les dialogues et les messages ; le panneau de dialogue remonte et les
  options prennent la hauteur de leur texte, pour ne jamais se chevaucher.
- **Gagner des Fers** : 30 Fers pour chaque résolution de « Le Dernier Train » (parole, Récit, combat), et une caisse
  de prospection à la Gare avec une bourse de 25 Fers (une seule fois). Nouvel effet de dialogue `giveFers`.
  Textes et montants à valider (`LORE.md` §11).
- Tests : 158 au total (+7 : réglages, effet `giveFers`, récompense identique des trois résolutions, caisse vidée
  après usage). `npm run typecheck`, `npm run build` et `npm test` au vert.
- Vérifié dans le navigateur (paysage téléphone 844 × 390) : HUD sans chevauchement ; Menu → Pause → Options →
  Retour → Reprendre ; volume et taille enregistrés et rechargés ; dialogue d'Ingrid à 4 options et dialogue
  d'Ilyane avec option grisée en taille Grande, sans chevauchement ; caisse : 15 → 40 Fers, affichés en direct ;
  Options depuis l'écran titre. Aucune erreur dans la console.

### Reste à faire (jalon 1)

Tous les points de `CLAUDE.md` §4 sont couverts. Avant de passer au jalon suivant, il faut la validation de Cyril
(test sur iPhone, et les contenus « à valider » de `LORE.md` §11). Pistes : voir la session suivante.

## 2026-11-01 — Jouable sur PC (Linux, Windows)

Décision de Cyril : le jeu doit être jouable sur PC, « voire surtout » ; l'iPhone sert surtout aux tests.

- **Image nette** : le jeu dessinait une image fixe de 1280 × 720 que le navigateur étirait (× 1,5 sur un écran
  1080p) : texte flou. L'image est maintenant calculée à la résolution de l'écran (× 1,5 en 1080p, × 2 au-delà et
  sur les écrans haute densité), les caméras zooment d'autant et le texte est rasterisé à ce zoom
  (`src/ui/viewport.ts`). Aucune mise en page à reprendre : tout reste en 1280 × 720 unités. 60 i/s en 1920 × 1080.
- **Clavier** : Échap (menu, retour, fermer), I (inventaire), 1–9 (dialogues), Entrée (montée de niveau),
  1/2/3, Z, Espace (combat). Rappels sur les boutons quand une souris est détectée ; rien ne change sur téléphone.
  Tableau complet : `GDD.md` §13 (`src/ui/keys.ts`).
- **Plein écran** : bouton dans les Options (PC, Android), en plus de F11.
- **Bug corrigé au passage** : sur une demande de plein écran refusée, Phaser déplaçait le canevas dans un
  conteneur à lui, et l'essai suivant plantait (« HierarchyRequestError »). On lui donne notre propre conteneur.
- Vérifié dans le navigateur en 1920 × 1080 : image 1:1 avec l'écran, texte rendu au bon zoom (HUD × 1,5,
  carte × 2,25) ; déplacement à la souris ; clic d'attaque en combat (la conversion du pointeur a été corrigée) ;
  champ du nom aligné sur son cadre ; vraies frappes clavier : Échap ouvre/ferme le menu, I ouvre/ferme
  l'inventaire, Échap dans les Options ouvertes depuis la pause ne ferme que les Options, 1 et 2 dans un dialogue
  (1 sans effet sur une option grisée), 2/Z/Espace en combat. En émulation téléphone : pas de rappels clavier.
- **Non vérifiable ici** : le passage effectif en plein écran. La fenêtre de test bloque le plein écran pour toute
  page ; la demande part bien, au bon élément et pendant le clic. À essayer sur un vrai PC.
- **Remarqué, pas corrigé** : en combat, les noms des combattants se chevauchent quand ils sont côte à côte.
- Tests : 158, au vert. `npm run typecheck` et `npm run build` au vert.

### Retour de Cyril (même jour)

- Sur PC, tout fonctionne très bien, mais le bandeau du haut (lieu, état, Menu, Inventaire) était trop gros : il
  était taillé pour le doigt sur téléphone.
- Corrigé : quand une souris est détectée, le HUD passe en version fine (52 unités de haut au lieu de 100, boutons
  de 40 au lieu de 76, textes plus petits) ; le bouton de montée de niveau remonte d'autant. Sur téléphone et
  tablette tactile, rien ne change. Vérifié en 1920 × 1080 (bandeau de 78 px au lieu de 150, boutons cliquables)
  et en émulation téléphone.

## État du projet — fin de journée, 2026-11-01

Cette section remplace les listes « Reste à faire » des sessions précédentes, qui ne sont plus à jour. Dernier
commit : `bc127e3`. 158 tests, typecheck et build au vert ; publié sur https://csaintecluque-ui.github.io/anamnesis-rpg/

### Jalon 1 (`CLAUDE.md` §4) : les huit points sont faits

| Point | État | Retour de Cyril |
|---|---|---|
| 1. Titre, menu pause, options, sauvegarde/chargement | fait | sauvegarde, export et import validés sur iPhone ; menu et options testés sur PC |
| 2. Création de personnage | fait | validée sur iPhone |
| 3. Hub + extérieur | Gardebois et la Gare Engloutie | aménagement de Gardebois validé ; Gare à valider |
| 4. 3 PNJ, dialogues avec tests d'attribut et de compétence | Ilyane, Tobias, Ingrid Brisefer | Ilyane et Tobias validés ; Ingrid à valider |
| 5. Quête à plusieurs résolutions | 3 sur les 4 prévues au GDD §6 : parole, Récit (piste mémoire), combat | **la discrétion n'est pas faite** |
| 6. Combat contre 2 ou 3 ennemis | Golem de Ferraille et 2 Rôdeurs-Épine | — |
| 7. Inventaire, troc, montée de niveau | faits | — |
| 8. PWA installable sur GitHub Pages | faite | installation validée sur iPhone |
| En plus : jouable sur PC | image nette, clavier, plein écran, HUD fin | « ça fonctionne très bien » ; bandeau trop gros, corrigé |

Le passage au jalon suivant attend le feu vert de Cyril (`CLAUDE.md` §4).

### Ce qui attend la validation de Cyril

- **Contenus** (`LORE.md` §11, « Gare Engloutie — contenu détaillé ») : aménagement de la Gare, scène de l'Écho,
  dialogue d'Ingrid Brisefer, nœud « resolu » d'Ilyane (soupçon sur les Réveilleurs), Rôdeurs-Épine et Golem,
  caisse de prospection, récompense de 30 Fers.
- **Chiffres** (premier jet d'équilibrage) : armes et ennemis (`GDD.md` §5), objets et prix, 15 Fers au départ,
  Fers gagnés (§10), seuils d'expérience (§11).
- **Choix de conception** : combat dans une arène dédiée plutôt que sur la carte ; armes équipées sans effet en
  combat pour l'instant ; même catalogue pour tous les marchands ; montée de niveau sans point d'attribut.
- **À essayer** : le plein écran sur un vrai PC (impossible à vérifier dans la fenêtre de test) ; la dernière
  version sur iPhone (HUD, menu pause, options, netteté), jamais testée sur l'appareil depuis ces changements.

### Points ouverts

- Résolution de la quête par la **discrétion** (entrer de nuit, saboter la foreuse : GDD §6) : pas commencée.
- En combat, les noms des combattants se chevauchent quand ils sont côte à côte.
- Sur PC, seuls le HUD et les raccourcis ont été adaptés : menu pause, inventaire et combat gardent des boutons au
  format du doigt.
- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : non corrigée, accord de Cyril requis.
- Chronologie du canon non arbitrée (`LORE.md` §10, points 6 à 13).
- Vulnérabilités modérées signalées par `npm audit` dans les outils de construction de la PWA (session 1) :
  rien n'est livré aux joueurs, à revoir à la prochaine version de workbox.

### Pistes pour la suite, après validation

1. Résolution par la discrétion, pour compléter les quatre voies du GDD §6.
2. Raccorder les armes équipées au combat.
3. Couverture tirée du terrain ; fuite liée à une position ; arène tirée de la carte explorée.
4. Catalogues de troc propres à chaque marchand.
5. Phase 2 (visuels générés via Higgsfield) : plan, nombre d'images et coût à présenter avant toute génération
   (`CLAUDE.md` §5).

## 2026-11-01 (suite) : résolution par la discrétion

- **Jets de dé dans les dialogues** : une option peut porter un `roll` (compétence, difficulté) ; elle affiche sa
  chance en % et mène à `next` ou `failNext`. Le résultat du dé s'écrit au-dessus du texte suivant. Un nœud `night`
  assombrit le fond. Contrôles automatiques : chaque jet a sa suite d'échec.
- **La foreuse** devient un objet interactif de la Gare (`foreuse.json`) : attendre la nuit, Discrétion 10 puis
  Artisanat 10, sabotage = fin de quête (40 XP, 30 Fers). Un échec ferme la voie et Ingrid s'en souvient.
- **`docs/DIALOGUES.md`** : le générateur affichait « +undefined XP » pour les Fers, les Récits et le Troc ; corrigé,
  il montre aussi les jets (🎲) et les scènes de nuit (🌙).
- Vérifié dans le navigateur : réussite, échec, Ingrid soupçonneuse.
- À valider par Cyril : textes de la séquence, difficulté 10, fermeture de la voie après un échec.

## 2026-11-01 (suite) : armes en main au combat

- Cyril valide le sabotage de nuit (textes, difficulté 10, voie fermée après un échec), puis choisit les armes en combat.
- Le combat utilise les armes **en main** (droite puis gauche), un bouton par arme, à son nom ; sans arme,
  **Mains nues** (1d3 + Corps). Le héros commence avec une **Dague** en main droite.
- Sauvegarde **v7** : un héros aux mains vides reçoit la Dague (les anciennes parties se battaient avec une épée et
  un arc gratuits).
- Vérifié dans le navigateur : « Dague » seule pour une ancienne sauvegarde migrée, « Épée longue » et « Arc »
  quand les deux sont en main. Panneau masqué : les tours ennemis tournaient au ralenti, attaque non jouée à l'écran.
- À valider par Cyril : la Dague de départ, les Mains nues 1d3, le combat contre le Golem plus dur sans achat.

## 2026-11-01 (suite) : confort PC

- Cyril valide les armes en main (Dague de départ, Mains nues 1d3, Golem plus dur), puis choisit le confort PC.
- Avec une souris : menu pause, inventaire et barre du combat compacts (le tactile garde la taille du doigt).
  L'inventaire indique la main de chaque arme équipée ; le nom des objets est recentré dans sa ligne.
- Combat : plus de noms au-dessus des combattants, mais une barre de PV ; panneau « Ordre du tour » à gauche ;
  un seul nom sur l'arène (survolé, sinon celui qui joue) ; ennemis de même nature numérotés.
- Vérifié dans le navigateur (PC) : pause, inventaire, combat, survol, attaque à l'épée.
- Reste : l'arène est petite au centre d'un grand écran vide ; à agrandir avec le chantier « arène tirée de la carte ».

## 2026-11-01 (suite) : catalogue par marchand, combat sur la carte

- **Catalogue par marchand** : liste `sells` dans `npcs.json` (Tobias : les 8 objets actuels) ; l'étal montre son
  catalogue et ce que l'on porte ; l'inventaire ne montre plus que les objets portés. Objets réservés ou stock
  limité : à décider par Cyril.
- **Combat sur la carte** : arène 11 × 9 découpée autour du Golem (`src/engine/arena.ts`), sol et obstacles de la
  carte ; Rôdeurs-Épine au bord le plus éloigné. **Couverture** par tuile (+2 caisses, rochers, tente ; +4 arbres,
  wagon, foreuse). **Fuite** depuis le bord de la zone seulement. Arène × 1,25 sur PC.
- Vérifié dans le navigateur (PC) : inventaire réduit aux objets portés, arène tirée de la Gare, refus de fuir
  hors du bord. Couverture vérifiée par les tests seulement (aucun tir à couvert joué à l'écran).

## 2026-11-01 (suite) : mode test caché

- Demande de Cyril : un réglage caché pour ajouter de l'argent ou des PV pendant les essais.
- 5 touches sur le numéro de version de l'écran titre activent le mode test (réglage de l'appareil) ; le menu pause
  gagne alors « +50 Fers » et « PV au max ». Vérifié dans le navigateur (PC).

## 2026-11-01 (suite) : clôture du jalon 1

- Cyril valide tout ce qui restait : contenus de la Gare Engloutie (aménagement, Écho, Ingrid, suite chez Ilyane,
  combat, caisse, 30 Fers), chiffres d'équilibrage (armes, ennemis, prix, 15 Fers, Fers gagnés, seuils d'XP),
  choix de conception (combat sur la carte, couverture, fuite par le bord, pas de point d'attribut, pas de stock
  limité tant qu'il n'y a qu'un marchand). **Jalon 1 clos.**
- Suite choisie : la phase 2 des visuels (plan et coût d'abord).
- Préparation de la phase 2 : fiche de style `docs/STYLE.md` (peinture numérique douce, isométrique 2:1, palette,
  formats, prompt commun, descriptions de personnages proposées) et plan de 34 images en 6 lots, pilote de 4 images
  d'abord (`docs/ASSETS.md`). Higgsfield n'est pas connecté à la session : coût en crédits à chiffrer.
- Higgsfield branché : CLI `@higgsfield/cli` 1.2.2 installé dans `~/.local` (sudo impossible dans le terminal de
  l'application), connexion au compte faite par Cyril, espace « Private » (Plus, 110 crédits) sélectionné. Les skills
  Higgsfield (`npx skills add higgsfield-ai/skills`) n'ont pas été installés : refusés par la protection automatique
  de la session ; le CLI suffit. Modèle retenu : GPT Image 2.5 (fond transparent natif). Coût estimé : pilote
  6 crédits, plan complet ≈ 51 crédits.
- Feu vert de Cyril pour le pilote. Les 4 générations par le CLI sont refusées (`only_mcp_usage_on_trial_is_available` :
  compte en essai, seul le connecteur MCP est permis) ; aucun crédit débité. Script du pilote prêt (prompts dans la
  fiche de style). `assets/raw/` ajouté au `.gitignore`.
- Cyril branche Higgsfield en MCP (connecteur ; le serveur ajouté par `claude mcp add --scope user` attend encore son
  authentification). La session en cours ne voit pas les outils : le pilote se lancera dans une nouvelle session.
  Prompts exacts du pilote recopiés dans `docs/ASSETS.md`.
- La session voit enfin le MCP Higgsfield (après `/mcp`). Pilote lancé : 4 images GPT Image 2.5 en un lot, 3 crédits
  (107 restants). Fond transparent propre. Réduction à la taille du jeu et comparaison avec les visuels provisoires
  (script jetable, images dans `assets/raw/pilote/reduit/`, local). Héros et portrait d'Ilyane réussis, arbre
  correct (socle de terre à retirer), herbe ratée (diorama). Piste pour les sols : texture vue de dessus projetée
  en losange par script. Bilan dans `docs/ASSETS.md` ; avis de Cyril attendu.
- Second essai sur accord de Cyril (1 crédit, 106 restants) : texture d'herbe vue de dessus, projetée en losange
  64 × 32 par script (raccord sans couture), et arbre sans socle. L'ombre de contact peinte en gris clair faisait
  un halo : repeinte en encre translucide par script. Les 4 images du pilote sont réussies ; scripts prototypes en
  local (`assets/raw/pilote/scripts/`), version Node à écrire au lot 1.
- Cyril valide le style et le héros du pilote, et lance la suite. Lot 1 : 8 textures de sol en un lot (4 crédits,
  102 restants), toutes réussies au premier essai (herbe sombre et fleurs avec l'herbe du pilote en référence).
  Nouveau script `scripts/process-art.mjs` (`npm run art`, sharp 0.35.5 en dépendance de développement) : texture →
  losange 64 × 32 raccordable (sur 2 axes, ou sur un seul pour le pont et le rail), décor et personnage détourés et
  posés sur la case, ombre repeinte. `generate-tiles.mjs` assemble ces frames avec les dessins restants dans
  `public/tiles/tiles.png` (ex-`placeholder.png`). Vérifié sur les deux cartes (rendu hors jeu, plus un passage dans
  le jeu par la console de développement, le panneau du navigateur étant masqué). Tests, typecheck et build au vert.
- Lot 2 lancé par Cyril : 12 décors (6 crédits, 96 restants), tous gardés. Quatre demandes refusées par Higgsfield
  (limite de débit, rien de débité) puis relancées. Nouveau dans `process-art.mjs` : ombre d'encre réglable par
  décor, option `matte` (fond clair raté : damier peint derrière la maison, halo blanc autour du wagon), opacité
  (Écho à 70 %), Faille en texture sans raccord. 23 tuiles peintes sur 25. Vérifié en rendu des deux cartes ; la
  Faille est presque cachée par un arbre placé devant (déjà le cas avant).
