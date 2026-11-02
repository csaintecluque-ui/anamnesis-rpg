# Animation des personnages (jalon 2, pilote du 2026-11-01)

Demande de Cyril : des personnages qui marchent, « à la Fallout », au lieu d'une image qui glisse.
Pilote : la marche du héros faite de deux façons, comparées dans le jeu. **Choix de Cyril (2026-11-01) : la méthode
2D.** L'essai 3D est retiré du jeu ; ses outils restent (`npm run render-sprites`, `tools/sprite-render/`).

## Dans le jeu

- Planche de marche `public/sprites/<nom>.png` : 8 rangées (directions à l'écran s, se, e, ne, n, nw, w, sw), images de
  64 × 96, personnage de 54 px, pieds à y = 84, ombre d'encre (comme les tuiles, `scripts/tiles-def.mjs`).
- La carte (`MapScene`) joue la rangée de la direction de chaque pas (`facingOf`, `src/engine/facing.ts` : un pas de
  colonne va en bas à droite, un pas de rangée en bas à gauche, une diagonale de la grille est une direction droite à
  l'écran), à 14 images par seconde ; à l'arrêt, la première image de la dernière direction.
- Planche du héros : `public/sprites/heros-marche.png` (méthode 2D) ; sans planche, le héros reste la tuile fixe
  `heros`. Le combat garde la tuile fixe.

## Méthode 2D (2,5 crédits pour le héros)

1. Cinq images au modèle d'image (`gpt_image_2_5`, 1k, moyenne, transparent, 21:9), le personnage en référence :
   « Sprite sheet… Exactly 6 frames of a smooth walking cycle side by side in one single horizontal row… » pour s, se,
   e, ne, n (prompts exacts : `docs/ASSETS.md`).
2. `npm run walk -- 2d <dossier> <nom>` découpe chaque rangée en 6 (coupe à la colonne la plus vide près de chaque
   limite attendue), met chaque direction à la même hauteur, aligne les pieds et le centre du buste, et crée nw, w, sw
   en miroir de ne, e, se. Un 4e argument donne la taille du personnage (54 px par défaut ; 42 pour un enfant).

## Méthode 3D (17 crédits pour le héros)

1. Image du personnage → modèle 3D texturé (Tripo H3.1, 9 crédits) → squelette et marche « Casual_Walk »
   (Meshy, 8 crédits ; chaque animation de plus, environ 8).
2. `npm run render-sprites -- <modèle.glb> <dossier>` sert une page three.js (`tools/sprite-render/`) à ouvrir dans le
   navigateur : caméra orthographique 30° au-dessus du sol (un carré de sol y devient le losange 2:1 du jeu), 8
   orientations, un cycle de marche repéré automatiquement (la pose revient à son départ), images renvoyées au script.
   Paramètres : `?frames=8&front=270&light=0` (`front` : rotation qui tourne le visage du modèle vers la caméra).
3. `npm run walk -- 3d <dossier> <nom>` : une échelle et une ligne de sol pour toutes les images (caméra fixe).

## Comparaison (héros, 2026-11-01)

| | 2D | 3D |
|---|---|---|
| Coût par personnage | ≈ 2,5 crédits | ≈ 17 crédits (marche seule) |
| Ressemblance au personnage | Très bonne, stable d'une image à l'autre | Moyenne : visage caché, tenue simplifiée |
| Mouvement | Pas lisibles en profil et de trois quarts ; peu de mouvement de face | Fluide, mais posture voûtée et jambes déformées |
| Directions | 5 dessinées, 3 en miroir (lumière inversée sur les miroirs) | 8 vraies |

La 3D pâtit du modèle tiré d'une seule image (le héros tient un livre, la cape cache les jambes) et du squelette posé
automatiquement. **Recommandation : la méthode 2D** pour les avatars et les PNJ ; la 3D ne vaudrait le coût qu'avec
un personnage dessiné exprès en pose neutre (bras écartés), à retenter éventuellement pour un seul personnage.

Choix de Cyril : méthode 2D (2026-11-01).
