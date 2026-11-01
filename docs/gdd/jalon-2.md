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
   gratuit, et tout le reste en dépend (les nouvelles images seront faites à la bonne taille).
2. **Pilote d'animation** sur le héros, puis choix de la méthode.
3. **Création de personnage** avec avatars (animés selon la méthode retenue).
4. **Contenu** : maisons à visiter, PNJ, quêtes secondaires (propositions de lore d'abord).
