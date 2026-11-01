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
  sur l'herbe peinte : il disparaîtra avec le lot 2 (fait).
- Herbe et herbe sombre se distinguent en losanges nets (comme avant). Des transitions douces seraient un plus, hors plan.
- Le portrait d'Ilyane attend le code d'affichage des portraits (lot 4).

### Lot 2 : décors (2026-11-01, 12 images, 6 crédits, solde 96)

Toutes gardées au premier essai. Réglages : Higgsfield MCP, `gpt_image_2_5`, 1k, qualité moyenne, fond transparent
(Faille : opaque, 1:1). Prompt = bloc commun + isométrique + sujet + « The object stands directly on the bottom of the
image: no ground, no grass patch, no base, no pedestal, no cast shadow on the ground. » + à éviter. Quatre demandes ont
d'abord été refusées par Higgsfield (`429 rate_limit_reached`, rien de débité) puis relancées telles quelles.

| Fichier (`assets/raw/lot2/`) | Format | Sujet du prompt | Coût |
|---|---|---|---|
| `tronc-titan.png` | 2:3 | « The base of a colossal ancient Titan tree: a huge section of trunk with deeply furrowed warm brown bark #6B4A32 and patches of moss, massive roots flaring out at the bottom, the trunk rises straight up and is cut off by the top edge of the image, filling the full image width. » | 0,5 |
| `maison-pilotis.png` | 2:3 | « A small round wooden house on stilts from a forest people: a round hut of warm brown wood planks raised on four wooden stilts, a dome roof covered with living green moss, grass and small leaves, a small round door and a warm glowing window, a short wooden ladder, cosy and simple silhouette. » | 0,5 |
| `etal.png` | 1:1 | « A small wooden market stall: a wooden counter under a striped awning in copper orange #C9804F and parchment cream #EAD9B8 on four poles, baskets of fruits, vegetables and bundles of herbs on the counter. » | 0,5 |
| `caisses.png` | 1:1 | « A small stack of three sturdy wooden crates with iron corner brackets and rope handles, one crate open with brass tools inside. » | 0,5 |
| `lanterne.png` | 2:3 | « A tall slender lamp post of dark carved wood with leaf motifs, topped by a lantern of brass and glass holding a softly glowing cyan crystal, gentle cyan halo of light. » | 0,5 |
| `rocher.png` | 1:1 | « A single rounded grey boulder with patches of green moss and a few small ferns at its foot, compact. » | 0,5 |
| `panneau.png` | 2:3 | « A wooden signpost: one weathered post with a single arrow-shaped wooden board pointing right, the board is blank with no writing, a little ivy at its foot. » | 0,5 |
| `wagon.png` | 1:1 | « An old railway passenger carriage from a long-gone era, overturned and lying on its side, faded wood and patinated brass panels, broken windows, wheels in the air, ivy and moss creeping over it, compact enough to read at small size. » | 0,5 |
| `foreuse.png` | 2:3 | « A steam-powered drilling machine of an industrial empire: an upright iron and brass frame with a large spiral drill bit plunged into the ground, gears, pipes, a small boiler with a wisp of steam, copper rivets, light rust patina, a faint cyan crystal glow where the drill meets the ground. » | 0,5 |
| `tente.png` | 1:1 | « A sturdy canvas work tent of an engineer's camp: beige canvas on wooden poles, guy ropes with iron pegs, front flap open showing a folding table with rolled-up plans and a brass lamp. » | 0,5 |
| `echo.png` | 2:3 | « A small group of three translucent ghostly travellers from a bygone era, waiting: an adult holding a suitcase and two children holding hands, rendered as pale luminous blue silhouettes with soft golden outlines, slightly blurred like a fading memory, semi-transparent. » | 0,5 |
| `faille.png` | 1:1, opaque | Texture vue de dessus : « dark rocky earth #2A2018 with cracked stones, and in the middle a jagged deep fissure running from the upper left area to the lower right area, glowing from within with soft cyan tellurian light and a few tiny floating crystal sparks » (sans raccord : motif unique) | 0,5 |

**Traitement** (`scripts/process-art.mjs`, réglages par tuile dans `scripts/tiles-def.mjs`) : détourage, mise à
l'échelle, pied posé sur la case, ombre d'encre ajoutée. Deux images avaient un fond « transparent » raté : la maison
(damier gris peint derrière elle, alpha 93 % partout) et le wagon (halo blanc) ; l'option `matte` du script efface le
fond clair relié au bord et rend le reste opaque. L'Écho est rendu à 70 % d'opacité. 23 tuiles peintes sur 25 (restent
le PNJ générique et le Golem, lot 3).

Remarques :
- Le Tronc d'Arbre-Titan occupe 2 × 2 cases faites de la même tuile : l'ensemble se lit comme une masse de racines.
  Un vrai décor sur plusieurs cases demanderait de découper une grande image ; hors plan.
- Le wagon occupe 2 cases : on voit deux wagons renversés côte à côte.
- Sur la carte de la Gare, la Faille (case 20, 9) est presque cachée par un arbre placé devant (déjà le cas avant).
