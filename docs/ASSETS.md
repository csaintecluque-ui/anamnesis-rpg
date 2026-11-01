# Visuels générés — plan et journal

Style imposé à chaque prompt : `docs/STYLE.md`. Aucune génération sans le feu vert de Cyril (`CLAUDE.md` §5).

## Plan de la phase 2 (proposition du 2026-11-01 ; style validé et suite lancée par Cyril le 2026-11-01)

Les visuels provisoires actuels (`scripts/tiles-def.mjs`, `public/tiles/placeholder.png`) sont remplacés un par un ;
le jeu reste jouable à chaque étape.

| Lot | Contenu | Images |
|---|---|---|
| **0. Pilote** | Herbe (tuile), Arbre (décor), Héros (personnage), Ilyane (portrait). Sert à valider le style, la découpe et la réduction à 64 px avant de lancer le reste | 4 |
| 1. Sols | Herbe sombre, chemin, planches, eau, pont, fleurs, rail, quai | 8 |
| 2. Décors | Tronc d'Arbre-Titan, maison sur pilotis, étal, caisses, lanterne, rocher, panneau, wagon, foreuse, faille, tente, Écho (sur la carte) | 12 |
| 3. Personnages | Ilyane, Tobias, Ingrid, Golem de Ferraille, Rôdeur-Épine (le héros est dans le pilote) | 5 |
| 4. Portraits de dialogue | Tobias, Ingrid, l'Écho du dernier train (Ilyane est dans le pilote) | 3 |
| 5. Illustrations | Écran titre ; intérieur de l'Écho du dernier train | 2 |
| **Total** | | **34 images** |

- **Essais** : en comptant environ deux essais par image retenue, prévoir **70 générations environ**.
- **Outil** : Higgsfield, en ligne de commande (`higgsfield`, installé le 2026-11-01 dans `~/.local`), espace
  « Private », formule Plus, **110 crédits** au 2026-11-01. **Compte en période d'essai** : Higgsfield n'y autorise
  que le connecteur MCP (`only_mcp_usage_on_trial_is_available`, 2026-11-01, aucun crédit débité). Il faut donc
  ajouter le connecteur `https://mcp.higgsfield.ai/mcp` dans Claude (Paramètres → Connecteurs), ou sortir de l'essai.
- **Images brutes** : gardées en local dans `assets/raw/` (exclu du dépôt) ; seules les versions réduites sont publiées.
- **Modèle** : **GPT Image 2.5** (`gpt_image_2_5`) : fond **transparent natif** (pas de détourage), le moins cher.
  Qualité moyenne en 1k pour ce qui finit en 64 px ; haute qualité pour les portraits et les illustrations.
- **Coût estimé** (`higgsfield generate cost`, 2026-11-01), essais compris :

| Lot | Réglage | Prix par essai | Essais | Crédits |
|---|---|---|---|---|
| 0. Pilote | 3 images en qualité moyenne 1k, 1 portrait en haute qualité 1k | 0,5 / 1,5 | 6 + 2 | **6** |
| 1 à 3. Sols, décors, personnages | qualité moyenne 1k | 0,5 | 50 | 25 |
| 4. Portraits | haute qualité 1k | 1,5 | 6 | 9 |
| 5. Illustrations | haute qualité 2k | 2,75 | 4 | 11 |
| **Total** | | | **70** | **≈ 51 crédits** (sur 110) |

- **Code à prévoir** : un script de découpe et de réduction (images → planche de tuiles), et l'affichage d'un portrait
  dans le panneau de dialogue (lot 4).
- **Hors plan** : animations (marche, attaque), sons, autres lieux ; à proposer après ce lot.

## Pilote : réglages et prompts prêts (feu vert de Cyril le 2026-11-01)

Modèle `gpt_image_2_5`, résolution 1k. Un essai par image d'abord ; on montre les résultats à Cyril avant d'en
refaire. Chaque prompt = **bloc commun** + **précision « isométrique »** (sauf le portrait) + **sujet** + **à éviter**.

- Bloc commun : celui de `docs/STYLE.md` (« soft painterly digital illustration, … no modern technology »).
- Isométrique : `isometric 2:1 view, single object centered, isolated on a transparent background`.
- À éviter : `no text, no letters, no logo, no watermark, no blood, not photorealistic`.

| Image | Format | Qualité | Fond | Sujet |
|---|---|---|---|---|
| Herbe (tuile) | 3:2 | moyenne | transparent | A single flat isometric ground tile: one diamond-shaped (rhombus twice as wide as tall) patch of soft green forest-edge grass with a few small blades and tiny wildflowers, seen from above at a 30 degree angle, the diamond fills the image width, nothing outside the diamond. Muted moss greens #3E4A2C and #56653D. |
| Arbre (décor) | 2:3 | moyenne | transparent | A single leafy deciduous tree standing on a small diamond-shaped patch of grass at its base, round lush canopy in moss and leaf greens, warm brown trunk, compact silhouette that reads well at small size. |
| Héros (personnage) | 2:3 | moyenne | transparent | Full-body character, three-quarter front view, standing: a young apprentice memory keeper of indeterminate gender, parchment-colored travel cloak, leather satchel, a small glowing cyan crystal lantern at the belt, calm determined expression, simple readable silhouette for a small game sprite. |
| Ilyane (portrait) | 1:1 | haute | opaque | Bust portrait for a dialogue panel, three-quarter view: Ilyane, a kind middle-aged woman guardian of memories from a forest people, cloak patterned with bark and leaves, holding a light wooden staff topped with a softly glowing cyan crystal, warm benevolent gaze, plain uniform dark ink background color #1B1512. |

Images brutes à ranger dans `assets/raw/pilote/` (local). Puis : réduire à la taille du jeu (64 × 32, 64 × 96,
environ 200 × 200) et comparer avec les visuels provisoires dans le navigateur.

## Journal des générations

| Date | Outil | Prompt | Coût | Fichier produit |
|---|---|---|---|---|
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k moyenne, transparent, 3:2 | Pilote « Herbe (tuile) » ci-dessus | 0,5 | `assets/raw/pilote/herbe.png` (1024 × 688) |
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k moyenne, transparent, 2:3 | Pilote « Arbre (décor) » ci-dessus | 0,5 | `assets/raw/pilote/arbre.png` (688 × 1024) |
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k moyenne, transparent, 2:3 | Pilote « Héros (personnage) » ci-dessus | 0,5 | `assets/raw/pilote/heros.png` (688 × 1024) |
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k haute, opaque, 1:1 | Pilote « Ilyane (portrait) » ci-dessus | 1,5 | `assets/raw/pilote/ilyane.png` (1024 × 1024) |

Solde après le pilote : 107 crédits (3 dépensés). Versions réduites et comparaison avec les visuels provisoires :
`assets/raw/pilote/reduit/` (local).

**Bilan du pilote (premier essai, 2026-11-01)** :
- Fond transparent : propre sur les trois images (détourage inutile).
- Herbe : **à refaire**. Le modèle a peint un petit diorama (arbres, rochers) au lieu d'un sol nu ; répété en
  tuiles, il donne un motif bosselé. Piste : générer une texture d'herbe vue de dessus, carrée et raccordable,
  et faire la projection isométrique par script (losange 2:1 exact, bords qui se raccordent).
- Arbre : bien lisible en 64 × 93. Défaut : socle de terre en bloc sous le tronc ; feuillage un peu jaune.
- Héros : bien lisible à la hauteur du pion actuel (87 px). Il tient un livre (non demandé) ; paraît plutôt
  masculin et jeune.
- Ilyane : réussi, lisible à 200 × 200.

**Second essai (2026-11-01, accord de Cyril)** : herbe et arbre refaits, 1 crédit, solde 106.

| Date | Outil | Prompt | Coût | Fichier produit |
|---|---|---|---|---|
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k moyenne, opaque, 1:1 | Bloc commun sans la lumière directionnelle + « Seamless tileable ground texture, flat top-down orthographic view looking straight down from above, filling the entire square edge to edge: short soft forest-edge grass, gentle variation of blade clumps, a very few tiny scattered white and yellow wildflower dots. Muted moss greens #3E4A2C and #56653D. Perfectly even, uniform lighting across the whole image, no vignette, no light spot, no cast shadows, no perspective, no horizon. No objects, no rocks, no trees, no bushes, no path. » + à éviter | 0,5 | `assets/raw/pilote/herbe-texture-v2.png` (1024 × 1024) |
| 2026-11-01 | Higgsfield MCP, `gpt_image_2_5` 1k moyenne, transparent, 2:3 | Bloc commun + isométrique + « A single leafy deciduous tree, round lush canopy in deep moss and leaf greens (not yellow), warm brown trunk with a few roots flaring at its foot, compact silhouette that reads well at small size. The trunk ends directly at the bottom with only a soft small oval contact shadow: no ground slab, no soil block, no grass patch, no base, no pedestal. » + à éviter | 0,5 | `assets/raw/pilote/arbre-v2.png` (688 × 1024) |

- **Herbe : réussie par la nouvelle méthode.** La texture vue de dessus est rendue raccordable (mélange avec une
  copie décalée d'une demi-largeur), tournée de 45°, écrasée en 2:1 et réduite à 64 × 32. Aucune couture visible
  sur la carte. Un peu plus claire que la palette provisoire. Méthode à reprendre pour tous les sols (lot 1).
- **Arbre : réussi**, sans socle, feuillage plus vert. Le modèle peint l'ombre de contact en gris clair (halo pâle
  sur l'herbe) : un script la repeint en ombre d'encre translucide. À prévoir pour tous les décors.
- Le héros n'a pas d'ombre au sol : à ajouter par script de la même façon.
- Scripts prototypes (Python, jetables) gardés en local dans `assets/raw/pilote/scripts/` ; la version définitive
  sera écrite en Node avec les autres scripts du projet. Comparaison : `assets/raw/pilote/reduit/comparaison-carte-v2.png`.

### Lot 1 : sols (2026-11-01, 8 images, 4 crédits, solde 102)

Toutes réussies au premier essai. Réglages communs : Higgsfield MCP, `gpt_image_2_5`, 1k, qualité moyenne, opaque, 1:1.
Prompt = bloc commun **sans lumière directionnelle** + « Seamless tileable ground texture, flat top-down orthographic
view looking straight down from above, filling the entire square edge to edge: » + sujet + « Perfectly even, uniform
lighting across the whole image, no vignette, no light spot, no cast shadows, no perspective, no horizon. » + exclusions
propres à chaque sol + à éviter. Pont et rail : contours légèrement marqués en plus, et sans « seamless » (le motif est
centré). Herbe sombre et fleurs : l'herbe du pilote donnée en image de référence (`image_references`) pour garder la
même matière.

| Fichier (`assets/raw/lot1/`) | Sujet du prompt | Raccord | Coût |
|---|---|---|---|
| `herbe-sombre.png` | « the same grass as the reference image, same painting style and scale, but denser and in a darker, deeper shade of moss green #334023 and #465733 » ; sans fleurs ni chemin | 2 axes | 0,5 |
| `chemin.png` | « packed earth forest path, warm brown dirt #6B5338 with lighter patches #85694A, tiny pebbles and a few small flattened grass tufts » ; sans gros rochers, ornières ni bordure d'herbe | 2 axes | 0,5 |
| `planches.png` | « weathered wooden floor of long parallel planks running vertically from the top edge to the bottom edge, exactly eight planks of equal width side by side, dark warm brown wood #5A4030 with darker seams #3B2A20, a few small iron nails » | 2 axes | 0,5 |
| `eau.png` | « calm dark teal river water #2C4A55 with soft painterly ripples and small light reflections #5B8A96 » ; sans poissons, nénuphars, rive ni rochers | 2 axes | 0,5 |
| `pont.png` | « a wooden footbridge deck made of short planks laid crosswise, running straight and vertically from the top edge to the bottom edge through the exact middle of the image and occupying the central half of the width, dark brown wood #6B4A32, with calm dark teal river water #2C4A55 visible in the left quarter and the right quarter » ; sans rambarde, poteaux ni rive | vertical | 0,5 |
| `fleurs.png` | « the same grass as the reference image, same painting style, colors and scale, sprinkled with many small wildflowers in parchment cream #EAD9B8, copper orange #C9804F and soft pink #D9A3C4 » | 2 axes | 0,5 |
| `rail.png` | « a single straight railway track running vertically from the top edge to the bottom edge through the exact middle of the image, two parallel brass-copper rails #C9804F about half the image width apart, resting on dark wooden sleepers laid crosswise at regular intervals, set in grey-brown gravel ballast #4A4038 that fills the rest of the square » | vertical | 0,5 |
| `quai.png` | « old station platform paving of large worn grey-beige stone slabs #8A8276 in a regular grid, fine darker joints #5F5A50, a little moss in some cracks » ; sans bord de quai, marquage ni rails | 2 axes | 0,5 |

**Intégration** : `scripts/process-art.mjs` (`npm run art`) produit les frames 64 × 96 dans `assets/tiles/` (publiées) ;
`npm run tiles` les assemble dans `public/tiles/tiles.png` (ex-`placeholder.png`, 60 Ko) ; les tuiles sans image gardent
leur dessin provisoire. 11 tuiles peintes sur 25 : les 8 sols du lot 1, l'herbe, l'arbre et le héros du pilote.
Vérifié sur les deux cartes : aucun raccord visible, pont et rail dans le bon sens.

Remarques pour la suite :
- Les décors encore provisoires (rocher, lanterne, caisses, maisons…) portent leur propre losange de sol, visible
  sur l'herbe peinte : il disparaîtra avec le lot 2.
- Herbe et herbe sombre se distinguent en losanges nets (comme avant). Des transitions douces seraient un plus, hors plan.
- Le portrait d'Ilyane attend le code d'affichage des portraits (lot 4).
