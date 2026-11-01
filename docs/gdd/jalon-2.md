# Jalon 2 — proposition (2026-11-01)

**Décisions de Cyril (2026-11-01)** : corrections visuelles d'abord ; pilote d'animation comparant 2D et 3D sur le
héros (environ 20 crédits) ; 6 avatars à la création. Le reste du plan ci-dessous reste une proposition.

Né du retour de Cyril sur la phase 2 des visuels (2026-11-01) : « rendu beau, mais peu de contenu et répétitif ;
sol du marché sans texture ; personnages figés (une image qui glisse) et trop gros ; les quatre troncs de
l'Arbre-Titan pas beaux ; il faudrait des maisons où entrer, plus de PNJ et de quêtes, une création de personnage
plus riche avec choix d'avatar (comme Baldur's Gate) et des personnages animés (comme Fallout) ».

## Ce que dit chaque point, et ce que je propose

| Retour | Cause | Proposition | Crédits |
|---|---|---|---|
| Personnages trop gros | Sprites de 80 px pour des cases de 64 px (proportions d'une figurine) | Personnages ramenés à 52 px environ ; maisons et Arbre-Titan agrandis sur plusieurs cases | 0 |
| Sol du marché sans texture | Les planches, réduites à 64 × 32, deviennent un aplat brun | Nouvelle texture plus contrastée (planches larges ou pavés), deux variantes pour casser la répétition | ≈ 1 |
| Les quatre troncs | Une même tuile répétée sur 2 × 2 cases | Un seul grand décor (pied d'Arbre-Titan) posé sur 2 × 2 cases ; demande au moteur de savoir afficher un décor plus grand qu'une case | ≈ 1 |
| Répétitif | Peu de décors différents, herbe en losanges nets | Variantes de sol, petits décors (buissons, fleurs, barrières, puits), transitions herbe / chemin | ≈ 5 |
| Personnages figés | Une seule image par personnage | Voir « Animation » ci-dessous | 2 à 20 par personnage |
| Création de personnage | Écran en 5 étapes, sans visage | Écran refait, avec choix parmi 6 avatars prédéfinis (portrait + personnage sur la carte) | ≈ 15 hors animation |
| Maisons, PNJ, quêtes | La tranche verticale n'a qu'une quête | Gardebois agrandi : 3 ou 4 maisons où entrer (intérieurs = petites cartes), 4 à 6 nouveaux PNJ, 2 ou 3 quêtes secondaires | ≈ 20 hors animation |

Tout nom, PNJ, lieu ou quête nouveau sera d'abord proposé « à valider » dans `docs/univers/` (règle du projet).

## Animation : deux méthodes à départager par un pilote

Fallout 2 utilisait des personnages en 3D rendus en images 2D sous 6 angles. On peut faire pareil :

- **Méthode 3D** (la plus proche de Fallout) : image du personnage → modèle 3D (Tripo, 9 crédits) → squelette et
  marche toute faite (Meshy, 8 crédits ; chaque animation de plus, comme l'attaque, environ 8 crédits) → rendu par
  un script du projet en 8 directions × 8 images de marche. Mouvement fluide et cohérent sous tous les angles.
  **Environ 17 crédits par personnage pour la marche seule**, 25 à 33 avec repos et attaque.
- **Méthode 2D** : le modèle d'image dessine une planche d'images de marche, avec le personnage en référence
  (0,5 crédit l'image, 4 directions, les autres en miroir). **Environ 2 à 4 crédits par personnage**, mais le
  visage et les proportions peuvent varier d'une image à l'autre : à vérifier.
- Sans crédit : une animation par code (léger balancement de marche, personnage tourné dans le sens du
  déplacement). Moins riche, mais immédiate ; utile en attendant.

**Pilote proposé** : les deux méthodes sur le héros (environ 20 crédits), comparées dans le jeu, puis choix.

## Budget

Il reste 83,5 crédits. Les corrections visuelles, la création de personnage et le contenu tiennent dans
40 crédits environ. L'animation décide du reste : en méthode 2D, tout tient dans le budget ; en méthode 3D, animer
le héros, 6 avatars et une dizaine de PNJ coûterait 250 à 400 crédits, donc il faudrait recharger le compte ou
n'animer que le héros et les ennemis.

## Ordre proposé

1. **Corrections visuelles** (taille des personnages, sol du marché, grand Arbre-Titan, variantes) : rapide, presque
   gratuit, et tout le reste en dépend (les nouvelles images seront faites à la bonne taille). **Fait le 2026-11-01**
   (4 crédits, détail dans `docs/ASSETS.md`).
2. **Pilote d'animation** sur le héros, puis choix de la méthode.
3. **Création de personnage** avec avatars (animés selon la méthode retenue).
4. **Contenu** : maisons à visiter, PNJ, quêtes secondaires (propositions de lore d'abord).

## Étape 3 : création de personnage avec 6 avatars (validée et faite le 2026-11-01, 24 crédits)

Chaque avatar = un portrait (écran de création, panneau du héros) + une planche de marche 2D (8 directions, carte et
combat). Tous humains (seule origine de cette version), apprentis Gardiens de Mémoire, 14 à 18 ans environ ; le texte
du jeu reste neutre en genre. Apparences proposées (pas de canon ; on évite tout stéréotype culturel réel) :

| # | Avatar | Allure proposée |
|---|---|---|
| 1 | Le héros actuel | Garçon aux cheveux bruns bouclés, cape parchemin, sacoche, lanterne de cristal (déjà fait : portrait à ajouter) |
| 2 | Fille des lisières | Longue tresse châtaine, cape vert mousse, carnet relié de cuir, bracelet de feuilles |
| 3 | Fille des ateliers | Cheveux noirs courts, foulard cuivre, veste de toile à poches, petite sacoche d'outils |
| 4 | Garçon voyageur | Peau sombre, cheveux ras, manteau de voyage ocre, bâton de marche sculpté |
| 5 | Fille aux étoiles | Peau mate, cheveux noirs ondulés, cape bleu nuit brodée de petites étoiles, pendentif de cristal |
| 6 | Garçon roux | Taches de rousseur, gilet de cuir sur chemise claire, écharpe verte, lanterne de cristal à la main |

**Coût** : portrait en haute qualité (1,5) + personnage en pied (0,5) + 5 planches de marche (2,5) = 4,5 crédits par
nouvel avatar, soit **≈ 24 crédits** (5 nouveaux + le portrait du héros), sur ≈ 60 restants. Il en resterait ≈ 35 pour
le contenu (maisons, PNJ, quêtes).

**Code** : choix de l'avatar à la première étape (avec le nom), grille de 6 portraits ; l'avatar est enregistré dans
le personnage (sauvegarde v7, l'ancienne sauvegarde prend le héros actuel) ; la carte et le combat utilisent sa planche.

## Étape 4 : contenu (proposition du 2026-11-01, à valider)

Détail et statut : `docs/univers/lieux/gardebois.md` et `docs/univers/personnages/pnj.md` (« Jalon 2 »).

- **3 maisons à visiter + la réserve** : chacune une petite carte intérieure (porte sur la carte de Gardebois → intérieur
  → retour devant la porte, comme le passage vers la Gare).
- **5 PNJ** (aubergiste, mère, fille, herboriste, apprenti) et **3 quêtes secondaires**, chacune avec plusieurs
  façons de la résoudre (compétences, Mémoire, combat).
- **Images** : un petit jeu d'intérieur (parquet, murs, porte, lit, table, étagères, cheminée, comptoir, tonneaux :
  ≈ 10 images, 5 crédits), les 5 PNJ en pied et en portrait (≈ 10 crédits), 3 herbes et la caisse (≈ 1 crédit),
  l'Écho de la berceuse (≈ 0,5). **≈ 17 crédits** sur 35 ; PNJ sans marche (ils restent sur place).

