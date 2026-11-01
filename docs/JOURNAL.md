# Journal de bord

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
