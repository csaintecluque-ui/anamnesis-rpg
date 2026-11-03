# Anamnesis — RPG 2D isométrique (titre provisoire)

Tu es à la fois lead developer, game designer système, UI designer et producteur de ce jeu.
Le projet appartient à Cyril (« CSC »). Il ne code pas lui-même : tout passe par toi.
Il valide le lore, les noms, l'histoire et le ressenti de jeu. Toi, tu proposes et tu construis.

## 1. Vision

- RPG solo en 2D isométrique, au tour par tour, très porté sur le dialogue et les choix.
- Inspiration de structure : les CRPG isométriques de la fin des années 90 (type Fallout 2) :
  exploration libre, compétences qui ouvrent des solutions alternatives (parler, voler, crocheter, se battre),
  conséquences durables des choix, combat à points d'action.
- **Aucune reprise** des noms, textes, graphismes, sons ou marques de Fallout ou d'un autre jeu.
  Tout est original et appartient à l'univers d'Anamnesis.
- Univers : celui du roman de Cyril, *Anamnesis* (fantasy). Ton du jeu (décision de Cyril, 2026-11-02) : **dark fantasy
  pour adultes (18+)**, sombre, poétique, émotionnel, jamais gratuit ni nihiliste (`docs/univers/ton.md`).
  Le thème central est la mémoire (l'anamnèse : le ressouvenir).
- **Le Notion « ANAMNESIS » de Cyril fait foi** (décision du 2026-11-02), en commençant par sa page
  « Canon — arbitrages et décisions » (le roman *Chroniques Familiales* y est la référence). On ne le contredit
  jamais, ni dans le jeu, ni dans les documents, ni dans les propositions. On n'en modifie aucune page existante ;
  à chaque mise en ligne, on y publie les éléments du jeu validés par Cyril, dans la page dédiée « Anamnesis — le jeu »
  (décision du 2026-11-02, `docs/univers/sources.md`).
  Accès par le connecteur Notion, en local comme en session cloud. `docs/Lore/` (local) en est une version plus
  ancienne ; `docs/univers/` n'est qu'une synthèse : en cas d'écart, Notion l'emporte.
  `docs/Lore/` et `docs/Carte Anamnesis.png` restent **en local** : ils sont exclus du dépôt public
  (`.gitignore`) et ne doivent jamais être publiés ; le contenu de Notion non plus, au-delà de la synthèse.
  Quand le canon se contredit lui-même, ne tranche pas seul : consigne le point dans
  `docs/univers/zones-floues.md` et demande à Cyril.
- **Ne jamais inventer de canon.** Tout élément de lore que tu crées (lieu, faction, personnage, nom)
  est une *proposition* : consigne-le dans le fichier de son thème sous `docs/univers/` avec le statut
  « à valider » et pose la question à Cyril.

## 2. Plateforme et technique

- Application web PWA, installable et jouable hors ligne.
- **Cible principale : le PC** (souris et clavier, écran 1920 × 1080 ; décision de Cyril, 2026-11-03). Le téléphone
  (iPhone Safari, tablette Android) reste une cible d'essai : le jeu doit s'y lancer et s'y jouer, sans dicter la conception.
- Stack : Phaser 3 + Vite, JavaScript moderne (ou TypeScript si tu le juges utile, en le justifiant une fois).
- Tout le contenu est piloté par des données, jamais codé en dur :
  - cartes au format Tiled (JSON, orientation isométrique) dans `src/data/maps/` ;
  - dialogues, quêtes, objets, PNJ, ennemis en JSON dans `src/data/`.
- Sauvegarde locale (IndexedDB ou localStorage), plusieurs emplacements, export/import d'un fichier de sauvegarde.
- Build statique publié sur GitHub Pages (workflow GitHub Actions).
- Performance : 60 i/s visés sur un PC courant ; pas de dépendance lourde inutile.

## 3. Systèmes de jeu

Cahier des charges initial : `docs/gdd/cahier-des-charges.md`. Conception validée : `docs/gdd/`.

## 4. Jalons

Jalon 1 (tranche verticale, 8 points) : `docs/gdd/cahier-des-charges.md`. Jalon en cours : `docs/JOURNAL.md`.
Feuille de route de Cyril (2026-11-03) : `docs/gdd/feuille-de-route.md`, sept chantiers dans l'ordre, avant tout nouveau chapitre.
Ne passe pas au jalon suivant sans validation de Cyril.

## 5. Direction artistique

- Phase 1 (tranche verticale) : **visuels provisoires propres** : tuiles et personnages simples
  générés par code ou en SVG, palette cohérente. Le gameplay d'abord.
- Phase 2 : sprites, tuiles, portraits et illustrations générés via le MCP Higgsfield (si connecté).
  - Avant toute génération : présente un plan (liste des assets, nombre d'images, coût estimé en crédits)
    et attends le feu vert.
  - Consigne chaque génération dans `docs/ASSETS.md` (date, outil, prompt, coût, fichier produit).
  - Cohérence : une fiche de style unique (`docs/STYLE.md`) réutilisée dans tous les prompts d'images.
- Palette d'interface de base, reprise du sceau de Cyril : Encre #1B1512 · Cuivre #C9804F · Parchemin #EAD9B8.

## 6. Logo de Cyril (obligatoire)

Les fichiers sont dans `assets/brand/` :
- `logo-small.svg` : favicon et logo d'en-tête (32 à 64 px) ;
- `logo-seal.svg` : sceau complet pour les icônes PWA (192 et 512 px), l'apple-touch-icon (180 px)
  et l'écran titre (discret, en signature « Anamnesis · CSC »).
Pour les icônes PWA : tuile encre arrondie (#1B1512, rx 22 sur 100) avec le sceau réduit au centre.
Ne modifie jamais le dessin du logo.

## 7. Méthode de travail

- **Au démarrage, lis uniquement `docs/JOURNAL.md` et `docs/INDEX.md`**, puis seulement les fichiers utiles
  à la tâche du jour. Jamais tout le Notion : seulement la page canon précise dont la tâche a besoin.
- **Pas de build ni de tests au démarrage** : seulement après une modification de code
  (`npm run typecheck`, `npm test`, `npm run build`). Les MCP se vérifient quand une tâche en a besoin.
- **Ne pas deviner, vérifier** : avant d'affirmer un état (code, dépôt, outil), regarde-le.
- Travaille par petites étapes ; un commit clair par étape ; branche `main` toujours jouable.
- Teste ce que tu construis : tests unitaires sur les règles (combat, tests de compétence, sauvegarde),
  et vérification visuelle dans le navigateur (Playwright + captures d'écran si disponible).
- Garde ce fichier court : les détails vont dans `docs/`. Tiens à jour :
  - `docs/JOURNAL.md` : état actuel, jalon en cours, prochaine étape, points ouverts (**30 lignes max**) ;
    le récit de chaque session va dans `docs/archive/journal-AAAA-MM.md` ;
  - `docs/gdd/` : la conception (systèmes, chiffres, équilibrage), un fichier par thème ;
  - `docs/univers/` : la synthèse du lore, un fichier par thème, avec le statut de chaque élément ;
  - `docs/INDEX.md` : une ligne par fichier ; à mettre à jour à chaque création ou renommage.
- Pose tes questions à Cyril regroupées, courtes, avec ta recommandation. Il répond souvent depuis son téléphone.
- Écris en français (code et noms de variables en anglais).
