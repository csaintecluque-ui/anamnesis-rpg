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
- `npm audit` signale des vulnérabilités modérées dans des dépendances de workbox-build (glob, minimatch,
  deepmerge, ejs). Ce sont des outils de **construction seulement**, rien n'est livré aux joueurs.
  La « correction » proposée rétrograderait vite-plugin-pwa en 1.1, peut-être incompatible avec Vite 8 :
  non appliquée, à revoir à la prochaine version de workbox.

### Reste à faire (jalon 1, dans l'ordre proposé)

1. Sauvegarde locale à plusieurs emplacements, avec export et import.
2. Création de personnage (attributs, compétences, don).
3. Cartes Tiled (Gardebois, Gare Engloutie), PNJ, dialogues, quête, combat, inventaire, troc, montée de niveau.

### Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : non corrigée, accord de Cyril requis.
  Ce logo sert de favicon.
- Chronologie du canon non arbitrée (`LORE.md` §10, points 6 à 13).
