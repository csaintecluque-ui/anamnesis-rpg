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
- Univers : celui du roman de Cyril, *Anamnesis* (fantasy). Ton : lumineux, poétique, émotionnel.
  Le thème central est la mémoire (l'anamnèse : le ressouvenir).
- **`docs/Lore/` fait foi.** C'est le lore canonique d'Anamnesis, fourni par Cyril. On ne le contredit jamais,
  ni dans le jeu, ni dans les documents, ni dans les propositions. On ne le modifie pas sans son accord.
  `docs/LORE.md` n'en est qu'une synthèse : en cas d'écart, `docs/Lore/` l'emporte.
  `docs/Lore/` et `docs/Carte Anamnesis.png` restent **en local** : ils sont exclus du dépôt public
  (`.gitignore`) et ne doivent jamais être publiés.
  Quand le canon se contredit lui-même, ne tranche pas seul : consigne le point dans `docs/LORE.md`
  (« zones floues ») et demande à Cyril.
- **Ne jamais inventer de canon.** Tout élément de lore que tu crées (lieu, faction, personnage, nom)
  est une *proposition* : consigne-le dans `docs/LORE.md` avec le statut « à valider » et pose la question à Cyril.

## 2. Plateforme et technique

- Application web PWA, installable et jouable hors ligne.
- Cibles : iPhone (Safari), tablette Android, navigateur desktop.
  Tactile **et** souris/clavier. Interface lisible en mode paysage sur téléphone.
- Stack : Phaser 3 + Vite, JavaScript moderne (ou TypeScript si tu le juges utile, en le justifiant une fois).
- Tout le contenu est piloté par des données, jamais codé en dur :
  - cartes au format Tiled (JSON, orientation isométrique) dans `src/data/maps/` ;
  - dialogues, quêtes, objets, PNJ, ennemis en JSON dans `src/data/`.
- Sauvegarde locale (IndexedDB ou localStorage), plusieurs emplacements, export/import d'un fichier de sauvegarde.
- Build statique publié sur GitHub Pages (workflow GitHub Actions).
- Performance : 60 i/s visés sur un iPhone récent ; pas de dépendance lourde inutile.

## 3. Systèmes de jeu (premier jet, à valider avec Cyril)

- **Attributs** : 7 attributs propres à l'univers d'Anamnesis (équivalent fonctionnel d'un système à la SPECIAL).
  Propose les noms et leur rôle, puis fais valider avant de les coder en dur.
- **Compétences** : une douzaine, dérivées des attributs, qui progressent avec l'expérience.
- **Traits / dons** : quelques choix à la création et aux montées de niveau.
- **Dialogues** : arbres à embranchements, conditions sur attributs/compétences/objets/quêtes,
  options grisées visibles quand une condition manque (le joueur voit ce qu'il aurait pu dire).
- **Combat** : tour par tour, points d'action, initiative, déplacement sur grille iso,
  tir/attaque ciblée par zone, couverture, fuite possible. Combat toujours évitable quand l'histoire le permet.
- **Inventaire** : poids, équipement (2 mains + armure), troc avec les PNJ.
- **Journal** : quêtes actives/terminées, notes, carte du monde.
- **Mécanique signature** à proposer : quelque chose autour de la mémoire (souvenirs à retrouver,
  souvenirs qui débloquent dialogues ou compétences). Propose 2 ou 3 pistes, Cyril choisit.

## 4. Premier jalon : la tranche verticale

Objectif : 20 à 30 minutes de jeu complet, de bout en bout, avec des visuels provisoires.

1. Écran titre, menu pause, options (volume, taille du texte), sauvegarde/chargement.
2. Création de personnage : attributs, compétences, un trait.
3. Une carte « hub » (un petit village ou un quartier) + une carte de donjon/extérieur.
4. 3 PNJ avec dialogues à embranchements, dont au moins un test d'attribut et un test de compétence.
5. Une quête principale avec au moins 2 résolutions (dialogue OU combat OU discrétion).
6. Un combat au tour par tour contre 2 ou 3 ennemis.
7. Inventaire, troc avec un marchand, montée d'un niveau.
8. PWA installable sur iPhone, publiée sur GitHub Pages.

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

- **Ne pas deviner, vérifier.** Au début de chaque session : lis `docs/JOURNAL.md`, vérifie l'état du dépôt,
  lance le build et les tests, vérifie les MCP connectés (`/mcp`).
- Travaille par petites étapes ; un commit clair par étape ; branche `main` toujours jouable.
- Teste ce que tu construis : tests unitaires sur les règles (combat, tests de compétence, sauvegarde),
  et vérification visuelle dans le navigateur (Playwright + captures d'écran si disponible).
- Tiens à jour :
  - `docs/JOURNAL.md` : ce qui a été fait, ce qui reste, les décisions prises ;
  - `docs/GDD.md` : le document de conception (systèmes, chiffres, équilibrage) ;
  - `docs/LORE.md` : le lore, avec le statut de chaque élément (validé / à valider).
- Pose tes questions à Cyril regroupées, courtes, avec ta recommandation. Il répond souvent depuis son téléphone.
- Écris en français (code et noms de variables en anglais).
