# Visuels et musique générés — plan et journal

Style imposé à chaque prompt : `docs/STYLE.md`. Aucune génération sans le feu vert de Cyril (`CLAUDE.md` §5).

## Plan de la phase 2 (proposition du 2026-11-01 ; style validé et suite lancée par Cyril le 2026-11-01 ; **réalisé le 2026-11-01**)

Les visuels provisoires (`scripts/tiles-def.mjs`, ex-`public/tiles/placeholder.png`) sont remplacés un par un ;
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
le PNJ générique et le Golem, lot 3 : fait).

Remarques :
- Le Tronc d'Arbre-Titan occupe 2 × 2 cases faites de la même tuile : l'ensemble se lit comme une masse de racines.
  Un vrai décor sur plusieurs cases demanderait de découper une grande image ; hors plan.
- Le wagon occupe 2 cases : on voit deux wagons renversés côte à côte.
- Sur la carte de la Gare, la Faille (case 20, 9) est presque cachée par un arbre placé devant (déjà le cas avant).

### Lot 3 : personnages (2026-11-01, 5 images, 2,5 crédits, solde 93,5)

Tous gardés au premier essai, fond transparent propre. Réglages : Higgsfield MCP, `gpt_image_2_5`, 1k, qualité
moyenne, transparent. Prompt = bloc commun + isométrique (« single character / creature centered ») + sujet + « stands
directly on the bottom of the image: no ground, no base, no cast shadow on the ground » + à éviter. Descriptions :
`docs/STYLE.md` (« Personnages »). Ilyane : son portrait du pilote donné en référence (`image_references`) pour garder
le même visage et la même cape.

| Fichier (`assets/raw/lot3/`) | Format | Sujet du prompt | Coût |
|---|---|---|---|
| `ilyane.png` | 2:3 | « Full-body character, three-quarter front view, standing: the same woman as in the reference portrait, Ilyane, a kind middle-aged guardian of memories from a forest people, same face, same braided greying hair with leaves, same cloak patterned with bark and leaves, holding her light wooden staff topped with a softly glowing cyan crystal, warm benevolent expression » | 0,5 |
| `tobias.png` | 2:3 | « Tobias, a jovial stocky merchant from an industrial empire, leather apron over a waistcoat with brass buttons, rolled-up sleeves, small tools hanging at his belt, holding up a lamp with a glowing cyan crystal, friendly smile » | 0,5 |
| `ingrid.png` | 2:3 | « Ingrid, a determined woman engineer from an industrial empire, brass protective goggles pushed up on her forehead, sturdy work jacket reinforced with copper plates and rivets, work trousers and boots, rolled-up plans under one arm, confident stance » | 0,5 |
| `golem.png` | 1:1 | « a Scrap Golem, a massive half-mechanical half-magical automaton assembled from rusty scrap iron plates and old machine parts, gears and pipes, with veins of glowing cyan tellurian light between the plates and two calm cyan glowing eyes, hulking and impressive but not scary » | 0,5 |
| `rodeur-epine.png` | 1:1 | « standing on four legs: a Thorn Prowler, a lean and agile wild canine creature whose back and tail are covered with long flexible thorny spines in green and brown like brambles, alert ears, lively stance ready to pounce, mouth closed, impressive but not frightening » | 0,5 |

**Code** : quatre tuiles ajoutées en fin de planche (`ilyane`, `tobias`, `ingrid`, `rodeur-epine`, les numéros des
autres tuiles ne changent pas). Sur la carte, un PNJ prend la tuile de son nom (repli : `pnj`) ; en combat, un ennemi
prend la tuile de son champ `tile` (`src/data/enemies.json`) et n'est plus teinté. Noms, barres de vie et zone de clic
remontés à la hauteur des nouveaux personnages. Test : chaque PNJ et chaque ennemi a sa tuile. Vérifié dans le jeu
(Marché avec Ilyane et Tobias ; combat du Golem et des deux Rôdeurs-Épine). Seule la tuile `pnj` générique reste
provisoire (repli, plus utilisée par les cartes actuelles).

### Lot 4 : portraits de dialogue (2026-11-01, 3 images, 4,5 crédits, solde 89)

Tous gardés au premier essai. Réglages : Higgsfield MCP, `gpt_image_2_5`, 1k, **haute qualité**, opaque, 1:1. Prompt =
bloc commun + « Bust portrait for a dialogue panel, three-quarter view: » + sujet + « plain uniform dark ink background
color #1B1512 » + à éviter (comme le portrait d'Ilyane du pilote). Chaque portrait reçoit en référence
(`image_references`) le sprite du même personnage (lot 3, ou l'Écho du lot 2) pour garder visage et tenue.

| Fichier (`assets/raw/lot4/`) | Sujet du prompt | Coût |
|---|---|---|
| `tobias.png` | « Tobias, the same man as in the reference image, same face, hair and beard, a jovial stocky merchant from an industrial empire, leather apron over a waistcoat with brass buttons, holding up a lamp with a glowing cyan crystal near his face, warm friendly smile » | 1,5 |
| `ingrid.png` | « Ingrid, the same woman as in the reference image, same face and red hair, a determined woman engineer from an industrial empire, brass protective goggles pushed up on her forehead, work jacket reinforced with copper plates and rivets, rolled-up plans under her arm, confident and slightly defiant gaze » | 1,5 |
| `echo-dernier-train.png` | Bloc commun allégé (« gentle soft light… hopeful, wondrous and melancholic mood ») + « the Echo of the last train, the same ghostly travellers as in the reference image seen closer, from the chest up: a child in front looking toward the viewer with a hopeful gaze, an adult with a hat and another child behind, all rendered as pale luminous blue translucent silhouettes with soft golden outlines, slightly blurred like a fading memory, faint golden sparks drifting » | 1,5 |

**Code** : `npm run art` réduit les portraits en JPEG 320 × 320 dans `public/portraits/` (20 Ko chacun) ; le champ
`portrait` de `src/data/npcs.json` les désigne ; `BootScene` les charge ; le panneau de dialogue affiche celui de
l'interlocuteur (150 × 150, cadre cuivre) en haut à gauche, nom et texte décalés à sa droite. Les `.jpg` entrent dans le
cache hors ligne (`vite.config.ts`). Test : chaque portrait déclaré existe. Vérifié dans le jeu : sur les 37 répliques,
en texte normal et grand, le texte ne touche jamais les choix (121 px d'écart au moins) et les choix restent sous le
portrait (106 px au moins, avec un personnage neuf).

### Lot 5 : illustrations (2026-11-01, 2 images, 5,5 crédits, solde 83,5)

Toutes deux gardées au premier essai. Réglages : Higgsfield MCP, `gpt_image_2_5`, **2k haute qualité**, opaque, 16:9
(2688 × 1520), réduites en JPEG 1600 × 900 dans `public/illustrations/` (220 à 280 Ko).

| Fichier (`assets/raw/lot5/`) | Sujet du prompt | Coût |
|---|---|---|
| `titre.png` | Bloc commun + « Wide establishing landscape for a game title screen: at golden hour, colossal Titan trees of a forest republic rise on the left with small round houses and lantern lights in their canopy, soft glowing cyan crystals among their roots; far away on the right horizon, the brass towers and gentle steam plumes of an industrial empire; between them an old railway overgrown with grass winds through the valley toward a faint cyan glow in the distance; on a hill in the foreground a small lone traveller in a parchment-colored cloak with a little crystal lantern, seen from behind, looking at the world. The center of the image is calm, open sky and soft mist, darker toward the bottom, leaving room for a title and a menu. » | 2,75 |
| `echo-dernier-train.png` | Bloc commun allégé + « Inside a living memory, three thousand years ago: a bustling station platform of a long-lost ancient world, a grand steam train waiting under a glass and iron canopy, a crowd of travellers hurrying toward it with raised hands and suitcases, children laughing and waving at a train window, an elderly scholar with a satchel of books being led toward the train, looking back over his shoulder. The whole scene is rendered as a luminous memory in pale blue with soft golden outlines and drifting golden sparks, the travellers in the same ghostly style as the reference image (l'Écho du lot 2), slightly blurred like a fading dream. The figures and the train fill the upper half of the image; the lower part is a darker, calm platform floor fading into shadow. » | 2,75 |

**Code** : écran titre peint en fond, sous un voile d'encre à 50 % (titre et menu lisibles). Nouveau champ `illustration`
d'un nœud de dialogue (`src/rules/dialogue.ts`) : l'image couvre l'écran derrière le panneau, rendu plus transparent
(78 %) ; utilisé par le nœud `interieur` de l'Écho du dernier train (quand on entre dans l'Écho, Récit du savant
Corvan). `BootScene` charge l'illustration du titre et celles des nœuds. Test : chaque illustration a son fichier.
Vérifié dans le jeu.

**À valider par Cyril (éléments visuels inventés, pas du canon)** : l'écran titre montre, au loin, une cité de
cristal au milieu de la vallée et un petit dirigeable au-dessus de la ville industrielle ; l'intérieur de l'Écho
montre une gare de l'Ancien Monde à verrière, aux voyageurs vêtus comme au début du XXe siècle (même allure que
l'Écho sur la carte).

## Bilan de la phase 2 (2026-11-01)

34 images prévues, 35 générées (l'herbe et l'arbre refaits une fois), toutes gardées : **26,5 crédits** au lieu des
51 estimés (110 au départ, 83,5 restants). Méthode retenue pour la suite : sols en textures vues de dessus projetées
par script, décors et personnages sans sol ni ombre (ombre ajoutée par script), le sprite ou le portrait déjà fait
donné en référence pour garder les visages. Chaîne : `npm run art` puis `npm run tiles`.

## Jalon 2, étape 1 : corrections visuelles (2026-11-01, 8 images, 4 crédits, solde 79,5)

Demandées par Cyril (`docs/gdd/jalon-2.md`). Toutes gardées au premier essai, réglages habituels (`gpt_image_2_5`, 1k,
qualité moyenne). Fichiers dans `assets/raw/jalon2/`.

| Fichier | Sujet du prompt | Coût |
|---|---|---|
| `tronc-titan.png` | « The base of a colossal ancient Titan tree: a gigantic trunk wider than a house, enormous roots spreading out in every direction at its foot, deeply furrowed warm brown bark #6B4A32 with moss and ivy, a wooden staircase winding up around the trunk toward the canopy, small lanterns with glowing cyan crystals hanging along the stairs; the trunk rises straight up and is cut off by the top edge » (sans sol ni ombre) | 0,5 |
| `planches-marche.png` | Texture vue de dessus : « a market square floor of wide weathered wooden planks running vertically, exactly four planks of equal width, warm honey and chestnut wood tones with clearly visible wood grain, each plank slightly different in shade, deep dark gaps between planks… Strong readable contrast between planks and gaps » | 0,5 |
| `herbe-2.png`, `herbe-3.png` | L'herbe du pilote en référence, « same colors and same scale, but with a different pattern » : trèfles et touffes plus longues ; herbe plus rase avec un peu de terre et quelques feuilles mortes | 1 |
| `buisson.png`, `fougeres.png`, `souche.png`, `champignons.png` | Petits décors isolés, sans sol ni ombre : buisson rond à baies blanches ; touffe de fougères ; vieille souche moussue ; champignons orangés dont deux luisent en cyan | 2 |

**Code** : grand décor sur plusieurs cases (champ `big` de `scripts/tiles-def.mjs`, image `public/decor/<nom>.png`,
propriété Tiled `grand`, dessiné une fois depuis la case de devant : `isBigAnchor`) ; l'Arbre-Titan devient une seule
image de 128 × 192 sur ses 2 × 2 cases. Personnages ramenés de 80 à 54 px (Golem 66, Rôdeur 36, Écho 58), noms,
barres de vie et zone de clic suivis. Sur les deux cartes, l'herbe libre reçoit au hasard (graine fixe) variantes,
herbe sombre, fleurs et petits décors (`groundVariety` dans `scripts/build-maps.mjs`) ; buissons et souches bloquent
et couvrent (+2). Limite : en combat, un grand décor reste dessiné case par case (aucun dans l'arène actuelle).

## Jalon 2, pilote d'animation (2026-11-01, 19,5 crédits, solde ≈ 60)

Méthode et comparaison : `docs/gdd/animation.md`.

| Fichier | Outil | Prompt / réglages | Coût |
|---|---|---|---|
| `assets/raw/anim2d/{s,se,e,ne,n}.png` | `gpt_image_2_5`, 1k, moyenne, transparent, 21:9, héros du pilote en référence | « Sprite sheet for a 2D isometric game, on a transparent background: the same character as in the reference image (same face, hair, parchment-colored cloak, leather satchel, cyan crystal lantern at the belt, same proportions and colors), full body, seen from slightly above at a 30 degree angle, {direction}. Exactly 6 frames of a smooth walking cycle side by side in one single horizontal row, evenly spaced, every frame the same size and the same scale, feet on the same baseline, the character identical in every frame except the legs, arms and cloak moving with the steps. No ground, no shadow, no grid lines, no frame borders. » ; directions : vers le spectateur, bas-droite de trois quarts, profil vers la droite, haut-droite de trois quarts dos, de dos | 2,5 |
| `assets/raw/anim3d/heros-modele.glb` | Tripo H3.1 image → 3D, `face_limit` 12000, texturé | Image du héros du pilote | 9 |
| `assets/raw/anim3d/heros-marche.glb` | Meshy 3D Rigging, hauteur 1,5 m, animation 30 « Casual_Walk » | Le modèle ci-dessus | 8 |

Résultats : planche 2D (8 × 6 images), gardée sous `public/sprites/heros-marche.png` ; planche 3D (8 × 8) retirée du jeu
au choix de la méthode 2D par Cyril.

## Jalon 2, étape 3 : 6 avatars (2026-11-01, 36 images, 24 crédits, solde 36)

Plan validé par Cyril (`docs/gdd/jalon-2.md`). Toutes les images gardées au premier essai. Fichiers bruts :
`assets/raw/avatars/` (en pied et portraits), `assets/raw/anim2d/<avatar>/` (planches de marche).

| Images | Réglages | Prompt | Coût |
|---|---|---|---|
| 5 personnages en pied (`lisiere`, `atelier`, `voyageur`, `etoiles`, `roux`) | moyenne, transparent, 2:3 | Bloc commun + isométrique + « Full-body character, three-quarter front view, standing: a young apprentice memory keeper, » + allure du tableau de `jalon-2.md` (ex. « a girl of about fifteen with a long chestnut braid, moss-green travel cloak, a leather-bound notebook held under one arm, a bracelet of woven leaves ») + sans sol ni ombre | 2,5 |
| 6 portraits (avec le héros `apprenti`) | haute, opaque, 1:1, personnage en pied en référence | Bloc commun + « Bust portrait for a character selection screen, three-quarter view: the same character as in the reference image, same face, hair and clothes, » + allure + « friendly and determined gaze, plain uniform dark ink background color #1B1512 » | 9 |
| 25 planches de marche (5 avatars × 5 directions) | moyenne, transparent, 21:9, personnage en pied en référence | Prompt de la méthode 2D (`docs/gdd/animation.md`), allure résumée entre parenthèses | 12,5 |

Résultats : `public/portraits/avatar-<id>.jpg` (320 px), `public/sprites/marche-<id>.png` (8 directions × 6 images) ;
la planche du héros du pilote devient `marche-apprenti.png`.

## Jalon 2 : le pont (2026-11-01, 1 crédit, solde 35)

Retour de Cyril : « le pont n'est pas du tout fait » (une bande de planches à plat sur l'eau). Deux variantes générées
(`gpt_image_2_5`, moyenne, transparent, 3:2, `count: 2`), prompt : bloc commun + « Isometric 2:1 view (the ground is
seen at a 30 degree angle)… A small sturdy wooden footbridge of a forest village: a gently arched deck of warm brown
planks running diagonally from the upper-left to the lower-right of the image, along the isometric axis, low wooden
railings with posts on both long sides, a few hanging lanterns with glowing cyan crystals on two posts, short stone
footings at both ends. No water, no river, no ground, no grass, no cast shadow. » Gardée : `assets/raw/jalon2/pont-a.png`
(pente ≈ 0,5, celle de la grille ; la B était trop raide). Image unique de 176 × 120 posée sur les deux cases d'eau
(grand décor de sol), appuis enfoncés dans les berges ; la lanterne qui se trouvait sur son passage est retirée.
Recalage du 2026-11-04 (retour de Cyril : le héros « passe à côté ») : l'image est posée 18 px à gauche et 9 px plus
bas (une demi-case vers l'avant), et sa rambarde de devant est redessinée au-dessus des marcheurs
(`src/engine/bigGround.ts`) ; aucune nouvelle génération. Le même jour, l'image entière : l'image brute d'origine,
reprise de l'historique Higgsfield (variante A, `e3e82355`, identique au pixel près à l'ancienne une fois traitée ;
aucun crédit), est retraitée sans couper son appui est (`foot: 120` au lieu de 146). Puis (retour de Cyril : « un
décalage au niveau des chemins ») : l'image reprend la place d'origine, ses deux bouts sur les chemins (abaissée de
28 px, sans glissement de côté), et les marcheurs montent de 12 px sur les deux cases du pont (l'arche).

## Jalon 2, étape 4 : contenu (2026-11-01, 22 images, 16 crédits, solde 19)

Contenu validé par Cyril (`docs/univers/lieux/gardebois.md`, `docs/univers/personnages/pnj.md`). Fichiers bruts :
`assets/raw/contenu/`. Toutes gardées au premier essai ; l'Écho de la berceuse a échoué une fois chez Higgsfield
(rien de débité) puis a été relancé avec un sujet simplifié (une jeune femme seule qui fredonne).

| Images | Réglages | Prompt (résumé ; bloc commun et « à éviter » habituels) | Coût |
|---|---|---|---|
| 5 PNJ en pied (Sylvan, Maëlis, Nell, Liane, Brann) | moyenne, transparent, 2:3 | Allure du tableau de `pnj.md` (ex. « Sylvan, a round and talkative innkeeper of a forest people, middle-aged, kind face with a short beard, green linen apron… holding a wooden mug ») | 2,5 |
| 5 portraits | haute, opaque, 1:1, le PNJ en pied en référence | « Bust portrait for a dialogue panel, three-quarter view: the same character as in the reference image… plain uniform dark ink background color #1B1512 » | 7,5 |
| Parquet, paillasson | moyenne, opaque, 1:1, vue de dessus | Plancher de maison de la forêt (six lames) ; paillasson de roseau tressé à motif de feuille | 1 |
| Texture de mur | moyenne, opaque, 1:1, vue de face | Lambris de bois en bas, enduit clair à motifs de feuilles en haut, poutre sombre ; raccordable de gauche à droite | 0,5 |
| Meubles (lit, table, étagère, cheminée, comptoir, tonneaux, cristal de veille) | moyenne, transparent | Objet isolé, sans sol ni ombre | 3,5 |
| Sauge-lumière, Écho de la berceuse | moyenne, transparent ; l'Écho du dernier train en référence | Herbe aux feuilles argentées et étincelles cyan ; jeune femme translucide qui fredonne, yeux fermés | 1 |

**Murs** : tuile `mur` construite par `process-art` (`kind: 'wall'`) : la texture plaquée sur les deux faces visibles
d'un bloc de case, inclinées le long de ses arêtes, la face droite à l'ombre, une poutre sombre dessus.

**À trancher par Cyril** : Sylvan est sorti avec des oreilles pointues. Les elfes de Verdantis sont une contradiction
ouverte du canon (`docs/univers/zones-floues.md`, point 2) ; le refaire en humain coûterait 2 crédits.

## Passants de Gardebois (2026-11-02, 15 images, 7,5 crédits, solde 11,5)

Plan validé par Cyril le 2026-11-02 (« Oui, pas bête ») : peindre les cinq passants de Gardebois
(`docs/gdd/figurants.md`) : 5 personnages en pied (2,5 crédits), puis les planches de marche des deux qui marchent
(2 × 5 directions, 5 crédits). Réglages : `gpt_image_2_5`, 1k, moyenne, transparent, 2:3. Prompt : bloc commun +
« Isometric 2:1 view, single character centered… Full-body character, three-quarter front view, standing: » + sujet +
« stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground » + à éviter.

| Fichier prévu (`assets/raw/figurants/`) | Tuile | Sujet du prompt | Tâche Higgsfield | Coût |
|---|---|---|---|---|
| `commis-ferros.png` | `colporteur-ferros` | « a young hurried clerk from an industrial empire, slim, dark leather vest with small brass buttons over a rust-orange shirt with rolled sleeves, a flat brown cap, a heavy leather satchel full of papers on his shoulder, cheerful but hurried expression » | `b2c63edf-df53-4bec-a9e7-1ad5da95c224` | 0,5 |
| `garcon-curieux.png` | `enfant-b` | « a curious boy of about eight from a forest village, tousled dark hair, warm tan skin, simple rust-orange tunic with a moss-green sash, short trousers, little leather boots, holding a small carved wooden toy dragon in both hands, wide-eyed and delighted » | `5984946e-6890-4125-b88b-c1961fad45a6` | 0,5 |
| `lavandiere.png` | `lavandiere` | « a cheerful washerwoman of a forest village, middle-aged, sleeves rolled up, blue-grey linen dress with a white apron, hair tied in a pale kerchief, carrying a woven wicker basket of folded linen on her hip, friendly smile » | `53e1706e-a8b7-41cb-b8a5-564a6facd36f` | 0,5 |
| `joueur-pipeau.png` | `joueur-pipeau` | « an old street musician of a forest village, short white beard, patched plum-purple cloak, a small soft hat with a green feather, playing a little wooden pipe flute held in both hands, gentle twinkling eyes » | `92e9308e-231a-44c2-9071-4351a0a9f4f4` | 0,5 |
| `client.png` | `client` | « a sleepy, content inn patron of a forest village, plump middle-aged man, mossy green tunic and brown trousers, holding a steaming wooden bowl of soup and a wooden spoon, eyes half closed, peaceful smile » | `de4b76f0-dafd-40ab-bdc3-f15ef84e78f2` | 0,5 |

Téléchargement d'abord bloqué : l'hôte des images Higgsfield (`d8j0ntlcm91z4.cloudfront.net`) était refusé par le
réseau de la session cloud ; Cyril a ouvert l'accès réseau de l'environnement (« Complet ») le 2026-11-02. Les cinq
personnages, montrés à Cyril, lui plaisent ; tous gardés au premier essai.

| Planches de marche (`assets/raw/anim2d/<nom>/{s,se,e,ne,n}.png`) | Réglages | Prompt | Coût |
|---|---|---|---|
| `commis-ferros` (5 directions) | moyenne, transparent, 21:9, le commis en pied en référence (`image_references`) | Prompt de la méthode 2D (`docs/gdd/animation.md`), tenue résumée entre parenthèses (casquette, gilet, chemise rouille, sacoche de papiers), « legs, arms and satchel moving » | 2,5 |
| `garcon-curieux` (5 directions) | idem, le garçon en pied en référence | idem (cheveux en bataille, tunique rouille, ceinture verte, dragon de bois dans les mains), « legs, arms and sash moving » | 2,5 |

Deux demandes refusées à l'envoi par Higgsfield (limite de débit, 429), sans tâche créée ni débit, relancées aussitôt.

**Résultats** : `assets/tiles/{colporteur-ferros,enfant-b,lavandiere,joueur-pipeau,client}.png` (tuiles, `npm run art`) ;
`public/sprites/figurant-commis-ferros.png` et `figurant-garcon-curieux.png` (8 directions × 6 images,
`npm run walk -- 2d anim2d/<nom> figurant-<nom> [hauteur]` ; le garçon à 42 px au lieu de 54, c'est un enfant).
Vérifié dans le jeu : les deux marcheurs animés dans Gardebois, les trois autres immobiles, bulle du client.

## Musique (2026-11-08) : 36 morceaux, 52 fichiers, 854,64 crédits, solde 2 145,36

Plan « recommandé » validé par Cyril le 2026-11-08 (`docs/gdd/son.md`). Outil : Higgsfield MCP, **ElevenLabs Music v2.5**
(`elevenlabs_music_v2_5`), `force_instrumental` sauf la berceuse, `batch_size` = nombre de variantes (Higgsfield crée une
tâche par variante : la seconde se retrouve dans l'historique, même prompt). Coût de chaque lot vérifié sans générer
(`get_cost`) avant l'envoi : une variante coûte 0,1453 crédit la seconde (26,16 les 3 min, 17,44 les 2 min, 8,72 la minute,
1,46 les 10 s). Un essai d'abord (Gardebois, le jour) pour vérifier la chaîne, puis le reste. Tout gardé au premier essai.
Un envoi refusé par Higgsfield (limite de débit, 429), sans tâche ni débit, relancé une fois les premiers finis.
Bruts : `assets/raw/musique/<fichier>.mp3` (local, MP3 stéréo 128 kbit/s) ; réduits par `npm run music` dans
`public/audio/musique/` (mono 96 kbit/s, −20 LUFS).

**Fiche de style sonore**, ajoutée à la fin de chaque prompt du lot A : « Dark fantasy role-playing game soundtrack, original. Slow, dark and warm; acoustic instruments only; no vocals; no loud percussion; soft steady dynamics with no build-up, no marked intro and no ending, so it can loop; mixed soft and discreet, made to sit under spoken dialogue; poetic and melancholic, about memory and remembrance. Not in the style of any recognizable real-world folk tradition. » Les thèmes, les notes et la berceuse en reprennent l'esprit dans leur propre prompt (en entier ci-dessous).

### Lot A · les ambiances (20 × 3 min, une variante, 26,16 crédits chacune : 523,20)

| Fichier | Tâche | Prompt (avant la fiche de style) |
|---|---|---|
| `gardebois-jour.mp3` | `73ce6a2c` | Daytime ambience for a forest market at the foot of colossal ancient trees, lanterns hanging from the roots: a gentle wooden flute melody, warm low strings, soft plucked harp, faint birdsong-like woodwind trills, rustling leaves texture. Around 60 BPM. |
| `gardebois-nuit.mp3` | `5b8f80eb` | Night ambience for the same forest market, lanterns glowing among giant roots, the stalls closed: a low cello drone, a sparse and tender wooden flute, soft glass chimes, night insects texture, quiet and intimate. Around 50 BPM. |
| `canopee-jour.mp3` | `bd74d383` | Daytime ambience for a city built high in the canopy of giant trees, where nothing touches the ground: hanging bridges, gondolas, wind in the leaves. Airy high strings, wooden flutes, very soft wooden mallet tones, harp, a sense of height and light. Around 64 BPM. |
| `canopee-nuit.mp3` | `d6d1096c` | Night ambience for a city high in the canopy of giant trees, where the memory of the dead passes into the trees: reverent and solemn, bowed glass, low strings, a distant wooden flute, soft wind through leaves, starlight. Around 50 BPM. |
| `ironheart-jour.mp3` | `25db9bde` | Daytime ambience for a vast industrial capital of forges and foundries under a persistent industrial fog, iron, brass and steam, weary workers: low brass chords, a slow deep cello ostinato, distant muffled anvil strikes as a slow regular pulse, metallic resonances, soft steam hiss texture. Heavy and weary but warm. Around 56 BPM. |
| `ironheart-nuit.mp3` | `26119225` | Night ambience for an industrial city of forges glowing in the fog, the night shift at work: a lonely muted brass melody, a low drone, faraway metallic clanks, embers, slow and sad. Around 48 BPM. |
| `sept-portes-jour.mp3` | `232f3343` | Daytime ambience for an ancient stone city of seven gates, crossroads of every people, with a great library and the house of the memory keepers: slow distant bells, harp arpeggios, warm strings, a faint murmur of a crowd, scholarly and solemn. Around 60 BPM. |
| `sept-portes-nuit.mp3` | `43e72170` | Night ambience for quiet stone streets and a candlelit library in an ancient city of seven gates: a single distant bell now and then, a soft harp, low strings, a sense of old secrets. Around 50 BPM. |
| `aetherhaven-jour.mp3` | `995dbf0c` | Daytime ambience for a city of islands floating among the clouds, airships and sails, a spiral tower of blue crystal: airy wind texture, gentle wind chimes, high sustained strings, a soft flute, open sky and a hint of vertigo. Around 62 BPM. |
| `aetherhaven-nuit.mp3` | `05b8aae5` | Night ambience above the clouds, cold wind and stars, the dark ash country far below: soft chimes, a lonely viola, a thin airy drone, fragile and suspended. Around 50 BPM. |
| `coralia-jour.mp3` | `3e60436e` | Daytime ambience for a city of coral on the sea, canals, a great harbor and a fleet: gentle sea swell texture, a warm cello melody, a distant buoy bell, plucked strings like lapping water. Around 58 BPM. |
| `coralia-nuit.mp3` | `f52509f3` | Night ambience for a coral city at high tide, whispering depths under the water: a low cello, a deep drone, a far buoy bell, soft swell, mysterious and melancholic. Around 48 BPM. |
| `marche-mere-jour.mp3` | `38dac526` | Daytime ambience for a city that walks across the desert on the backs of giant creatures, never stopping: plucked strings, a low wooden flute, sand wind texture, a very slow soft low pulse like enormous footsteps far below, hot and vast. Around 56 BPM. |
| `marche-mere-nuit.mp3` | `5983126f` | Night ambience in a cold desert under the stars, a city still walking on the backs of giant creatures: sparse plucked strings, a low breathy flute, wind, a slow giant heartbeat far below, lonely and immense. Around 48 BPM. |
| `khrysos-jour.mp3` | `c86db6a4` | Ambience for a city of crystal three hundred meters under an ice cap, warm galleries carved in the ice: rubbed glass tones, crystal harmonics, a cold sustained drone, a slow fragile shimmering melody. Around 54 BPM. |
| `khrysos-nuit.mp3` | `00cb4477` | Night ambience deep under the ice, a city of crystal asleep, cold silence and old crypts: single crystal tones, a cold low drone, faint creaking ice, very sparse. Around 44 BPM. |
| `souterrain-jour.mp3` | `cb202d65` | Ambience for an underground ruin: a sunken railway station, sleeping rail tunnels and crypts from a lost ancient world: a deep drone, slow water drops, resonating metal, faint distant rail creaks, mournful and oppressive. Around 50 BPM. |
| `souterrain-nuit.mp3` | `e57e0fbf` | Darker ambience for underground rail tunnels and crypts at night, where old memories tear apart: a very low drone, distant metallic groans, water drops, cold string harmonics, a slow uneasy pulse, menacing but restrained. Around 44 BPM. |
| `route-jour.mp3` | `90f235f3` | Travel music for crossing a wide wild world on foot between distant cities: a gentle walking pace, warm strings and woodwinds, an unhurried melody, open landscape, bittersweet hope. Around 72 BPM. |
| `route-nuit.mp3` | `fbe9e0e8` | Night travel music, a camp under the stars on a long road: sparse plucked strings, a low flute, soft wind, a quiet melody, lonely and tender. Around 56 BPM. |

### Lot B · les thèmes (8, deux variantes : 279,04)

| Fichiers | Tâches (A / B) | Durée | Crédits | Prompt |
|---|---|---|---|---|
| `theme-principal-a.mp3`, `theme-principal-b.mp3` | `75d85f53` / `8c250bb2` | 3 min | 52,32 | Main theme for a dark fantasy role-playing game about memory and remembrance, played on the title screen: a melancholic, poetic main melody introduced on solo cello, answered by a wooden flute, slowly swelling with warm strings, soft horns and harp, emotional and bittersweet, grand but intimate, then settling back to calm. Acoustic orchestra, original melody, no vocals, no loud percussion, slow tempo around 66 BPM. Not in the style of any recognizable real-world folk tradition. |
| `combat-a.mp3`, `combat-b.mp3` | `76618d21` / `6b3c6b51` | 2 min | 34,88 | Turn-based battle music for a dark fantasy role-playing game: tense and driving but measured, a low strings ostinato, frame drums and low toms at moderate level, short brass stabs, dark and urgent, steady intensity throughout with no intro and no ending so it can loop, mixed so that sound effects stay audible. Acoustic orchestra, original, no vocals, around 120 BPM. Not in the style of any recognizable real-world folk tradition. |
| `combat-gardien-a.mp3`, `combat-gardien-b.mp3` | `be671761` / `e673af58` | 2 min | 34,88 | Battle music against an ancient guardian, a huge automaton of rusty scrap iron with veins of cyan light: heavy and menacing, low brass, metallic percussion and anvil hits, driving strings, dark and epic, steady intensity with no intro and no ending so it can loop, mixed so that sound effects stay audible. Acoustic orchestra, original, no vocals, around 110 BPM. Not in the style of any recognizable real-world folk tradition. |
| `veillee-a.mp3`, `veillee-b.mp3` | `7b9bd258` / `efab3eb2` | 2 min | 34,88 | Music for an evening gathering around a fire, where a storyteller tells tales to an audience at an inn: warm plucked strings, a soft wooden flute, a gentle cello, intimate and hopeful, discreet under the spoken story, soft steady dynamics with no marked intro or ending so it can loop. Acoustic, original, no vocals, no loud percussion, around 70 BPM. Not in the style of any recognizable real-world folk tradition. |
| `echos-a.mp3`, `echos-b.mp3` | `8992e35a` / `b190511e` | 2 min | 34,88 | Music for entering a living memory of the past, a ghostly vision in pale blue and gold of people long gone: ethereal and dreamlike, celesta, bowed glass, shimmering high strings, a distant soft piano, lots of reverb, nostalgia, a fading memory, soft steady dynamics with no marked intro or ending so it can loop. Original, no vocals, no percussion, slow, around 56 BPM. |
| `dame-en-gris-a.mp3`, `dame-en-gris-b.mp3` | `8cbbd8c3` / `62a7106c` | 2 min | 34,88 | Theme for a mysterious woman in grey, a rival who crosses the hero's path in every city while searching for her lost mother: elegant and melancholic, a solo viola melody over low pizzicato strings and a soft clarinet, restrained tension, a secret grief, never villainous, soft steady dynamics with no marked intro or ending so it can loop. Acoustic, original, no vocals, no loud percussion, around 64 BPM. |
| `sept-caisses-a.mp3`, `sept-caisses-b.mp3` | `d7781206` / `610c7b63` | 2 min | 34,88 | Theme for a quest across seven continents to find seven ancient crates lost for three thousand years at the end of sleeping railways: mystery and investigation, a slow steady pulse of low pizzicato strings, a questioning clarinet and harp motif, a quiet sense of urgency, no marked intro or ending so it can loop. Acoustic orchestra, original, no vocals, no loud percussion, around 76 BPM. |
| `chute-a.mp3`, `chute-b.mp3` | `cf469d4d` / `d8ed9d8b` | 1 min | 17,44 | Music for the death of the hero in a dark fantasy role-playing game: a slow, grave lament, solo cello over a low string drone, a few soft harp notes, sorrowful but not hopeless, fading out at the end. Acoustic, original, no vocals, no percussion, around 50 BPM. |

### Lot C · les notes courtes (6 × 10 s, deux variantes, 2,92 crédits chacune : 17,52)

Prompt : « A short 10-second musical cue for <le moment> in a dark fantasy role-playing game: <ce qu'on entend>. Acoustic, original, no vocals, no drums. » (l'Écho recueilli : sans « Acoustic »).

| Fichiers | Tâches (A / B) | Le moment : ce qu'on entend |
|---|---|---|
| `quete-terminee-a.mp3`, `quete-terminee-b.mp3` | `c417c99d` / `34b2269c` | completing a quest : warm strings and soft horns rising to a resolved chord, satisfying and bittersweet, then ringing out. |
| `recit-retenu-a.mp3`, `recit-retenu-b.mp3` | `a642217e` / `e2f7e780` | keeping a story in memory : a tender harp arpeggio and a wooden flute phrase, a soft resolved chord, intimate and poetic, then ringing out. |
| `niveau-gagne-a.mp3`, `niveau-gagne-b.mp3` | `e0c3bde4` / `fb35b49f` | gaining a level : rising harp and strings, a bright warm horn chord, uplifting but understated, then ringing out. |
| `echo-recueilli-a.mp3`, `echo-recueilli-b.mp3` | `ef365638` / `d1a9f347` | gathering a ghostly memory of the past : shimmering celesta and bowed glass, a soft rising chord with reverb, ethereal and nostalgic, then fading out. |
| `caisse-trouvee-a.mp3`, `caisse-trouvee-b.mp3` | `0a8efcef` / `61e53ec3` | finding a long-lost ancient crate : a low mysterious string chord, a deep bell, then a solemn brass swell resolving, a sense of discovery and weight. |
| `veillee-reussie-a.mp3`, `veillee-reussie-b.mp3` | `620372f9` / `fc881c3e` | a storytelling evening that won over its audience at an inn : warm plucked strings and a wooden flute flourish, a joyful resolved chord, cosy, then ringing out. |

### Lot D · la berceuse de Maëlis (2 × 1 min, deux variantes, 17,44 crédits chacune : 34,88)

| Fichiers | Tâches (A / B) | Prompt |
|---|---|---|
| `berceuse-fredonnee-a.mp3`, `-b.mp3` | `ff9eb53d` / `325b59b4` | (voix permise, sans paroles) « A lullaby hummed softly by a gentle young woman's voice, humming only with closed lips, no words, slow and tender in three-four time, almost a whisper, with a single gently plucked string instrument; intimate, warm and melancholic, a mother humming to her child under giant trees at night. Original melody, simple and memorable. No drums. » |
| `berceuse-chantee-a.mp3`, `-b.mp3` | `3c1ba184` / `5f058b95` | « A tender lullaby sung in French by a soft, gentle young woman's voice, slow, almost spoken, intimate, in three-four time, with a single gently plucked string instrument; warm and melancholic, a mother singing to her child under giant trees at night. The same simple melody for every verse. Original, no drums. » ; paroles (`lyrics`) : les trois couplets de `docs/gdd/son.md` |

**À écouter et choisir** (Cyril) : la page d'écoute du jeu (mode test, `docs/gdd/son.md`). Claude n'entend pas les
morceaux : seuls leur durée, leur volume au fil du temps (régulier, sans montée, sauf le thème principal qui monte et
redescend comme demandé) et leur format sont vérifiés. À vérifier à l'oreille : ni voix ni percussion forte dans les
ambiances, et la berceuse chantée qui dit bien les paroles, en français.

## Plan des images de la mise en beauté (2026-11-08) — pilote fait (section suivante), le reste attend le feu vert

Décision du 2026-11-08 (section suivante) : tout le jeu peint, portraits pour les importants seulement. Inventaire fait
dans le code le 2026-11-08 : **423 tuiles, 56 peintes, 367 encore dessinées par le code** ; 9 portraits de dialogue ;
124 passants, tous sur un trajet, dont 2 seulement avec une marche peinte (les autres glissent). Prix revérifiés le
2026-11-08 sans générer (`get_cost`, `gpt_image_2_6`, les mêmes pour `gpt_image_2_5`) : **0,5** une image moyenne 1k
(tuile, décor, personnage en pied, une direction de marche), **1,5** un portrait (haute 1k), **2,75** une illustration
(haute 2k). Solde après la musique : **2 145,36**.

| Poste | Nombre | Réglage | Prix | Crédits |
|---|---|---|---|---|
| Portraits de dialogue des personnages importants (liste ci-dessous) | 45 | haute 1k, opaque, 1:1, le personnage en pied en référence | 1,5 | 67,50 |
| Personnages nommés en pied (carte et combat), tous ceux encore dessinés par le code ; la dame en gris une seule fois pour ses cinq tuiles | 110 | moyenne 1k, transparent, 2:3 | 0,5 | 55,00 |
| Passants en pied (une tuile par allure ; 124 passants pour 76 allures) | 76 | idem | 0,5 | 38,00 |
| Passants qui marchent : planche de marche (5 directions) pour **deux par ville** (sept villes ; Gardebois en a déjà deux) | 14 | moyenne 1k, transparent, 21:9, le passant en référence | 2,5 | 35,00 |
| Ennemis et créatures (ours, loups, guêpes, mantes, Abyssaux, pilleurs, la Veuve Grêle…) | 16 | moyenne 1k, transparent | 0,5 | 8,00 |
| Sols (plates-formes, passerelles, pavés, dalles, sable, corail, glace, neige…), méthode de la texture vue de dessus | 30 | moyenne 1k, opaque, 1:1 | 0,5 | 15,00 |
| Décors (maisons, tentes, palais, temples, forges, bateaux, dirigeable, cristaux, Léviathan…) | 129 | moyenne 1k, transparent | 0,5 | 64,50 |
| Illustrations : la carte du monde peinte ; une scène d'arrivée par ville (Canopéa à Khrysos, sept) ; une par fin (quatre, sans rien en dévoiler ici) | 12 | haute 2k, 16:9 | 2,75 | 33,00 |
| Fonds peints sous la carte (au lieu de la couleur unie) : les huit villes, « sous la terre », « sous les nuages » | 10 | haute 1k | 1,5 | 15,00 |
| **Sous-total** | **442 images** | | | **331,00** |
| Reprises (20 % ; presque tout est passé au premier essai jusqu'ici) | | | | 66,20 |
| **Total** | | | | **≈ 397** |

**Options** (à choisir) : refaire les **9 portraits existants** dans le style révisé, pour qu'ils aillent avec les
nouveaux (13,50) ; refaire l'**écran titre** (2,75) ; **deux passants qui marchent de plus** par ville (35,00). Avec
toutes les options : **≈ 448**. Il resterait **≈ 1 700 crédits** sur le compte (≈ 1 750 sans les options).

**Les 45 portraits** (les 9 existants : Ilyane, Tobias, Ingrid, Sylvan, Maëlis, Nell, Liane, Brann, l'Écho du dernier
train ; total 54). Choisis par l'histoire : compagnons, fil principal, personnages qui donnent ou ferment une quête,
les plus longs dialogues.

| Où | Personnages |
|---|---|
| Le fil (3) | Boulon (compagnon) ; la dame en gris (une seule image pour toutes ses apparitions) ; Hesper Mille-Récits |
| La fin (3) | trois personnages du chapitre 9, non nommés ici pour ne rien dévoiler (`gdd/chapitre-9.md`) |
| Gardebois (2) | Elouan Chante-Bois ; Ragna Cendrefer (la forge) |
| Canopéa (7) | Véline Nacelière ; Kael Marchevent ; Mirelle Doucebranche ; Vanel Lentefeuille ; Malo et Aïlis Feuillevent ; Kaelis |
| Ironheart (6) | l'archiviste Noam ; Varka ; la Veilleuse du Rail ; Tam et Kerta Orvel ; Joss Brakel |
| Sept-Portes (3) | Ambroise Encrelune ; Holger Brandt ; Lior Rose-des-Vents |
| Aetherhaven (6) | Siffrin Plume-Vive ; Ysolde Cent-Plis ; Ravel Sans-Fil ; Ossiane Vire-Nuée ; Céleste Fend-l'Air ; la Veuve Grêle |
| Coralia (5) | Matteo Marée-Haute ; Aïo Coquelune ; Euria Sel-Doux ; la Grande Amiral Marina Azurios ; Gunnar |
| Marche-Mère (5) | Ish'Lenne ; Tam'Ruu ; Ahm'Ras ; Hiran'Amra ; la Reine Shal'Vera |
| Khrysos (5) | Hrolda Rochebrume ; Halvard Neigeclaire ; Maître Ennir ; Korvek ; Torka |

Sans portrait (en pied seulement, comme aujourd'hui) : les aubergistes, marchands, gardes, guides et les autres
personnages d'une ou deux scènes (65 environ), les passants, les Échos du Livre.

**Les passants qui marchent** (proposition, deux par ville, les plus vus) : Canopéa, la marchande de fleurs et le
messager ; Ironheart, un ouvrier des forges et le porteur de charbon ; Sept-Portes, le porteur des Halles et
l'étudiante ; Aetherhaven, la pilote et l'attrapeur du quai ; Coralia, le pêcheur et la marchande de poisson ;
Marche-Mère, un marcheur et une porteuse d'eau du Camp ; Khrysos, la marchande des Galeries et le mineur du Niveau
Douze. Les autres gardent leur trajet, sur une seule image.

**Code à prévoir** (sans crédits) : `npm run art` et `npm run tiles` pour les 365 tuiles (méthode éprouvée) ; un champ
`portrait` pour 45 PNJ ; `npm run walk` pour les 14 planches ; l'illustration d'arrivée sur le premier dialogue de
chaque ville, la carte peinte sous la carte du monde, une illustration par fin à l'épilogue ; les fonds peints à la
place du champ `fond` des lieux. Poids : ≈ 10 Mo de plus (tuiles ≈ 2, planches de marche ≈ 1,7, portraits ≈ 1, illustrations ≈ 3,
fonds ≈ 2) ; recommandé : les illustrations et les fonds mis en cache à la première vue, comme la musique, pour que
l'installation hors ligne passe de 14,6 à ≈ 19,5 Mo seulement.

**Le style** : `docs/STYLE.md` demandait d'être revu « avant la mise en beauté » (il disait encore « 8–15 ans »).
Proposition de révision dans `STYLE.md` (« Révision proposée pour la mise en beauté ») : la même peinture lisible à
64 px, une humeur dark fantasy adulte (lumière basse, matières usées, palette plus sourde), jamais gratuite.

### Le pilote proposé (8,25 crédits) : avant tout le reste

Sept images, toutes de Canopéa sauf deux, pour juger le style révisé à côté de ce qui est déjà peint, à la taille du jeu :

| Image | Réglage | Pourquoi | Crédits |
|---|---|---|---|
| Hesper Mille-Récits, en pied, puis son portrait (en pied en référence) | moyenne 1k + haute 1k | un nouveau personnage important, la chaîne complète en pied → portrait | 0,5 + 1,5 |
| Ilyane, portrait refait dans le style révisé (l'actuel en référence) | haute 1k | comparer avec l'ancien : faut-il refaire les 9 ? | 1,5 |
| La marchande de fleurs (passant, Canopéa) | moyenne 1k | un passant à côté des passants peints de Gardebois | 0,5 |
| La maison-cosse (décor) et la plate-forme (sol) de Canopéa | moyenne 1k | la ville la plus vue après Gardebois | 0,5 + 0,5 |
| La Griffe-Sylve (ennemi) | moyenne 1k | un ennemi en combat, à côté du Rôdeur-Épine | 0,5 |
| Canopéa, l'illustration d'arrivée (la Grande Nacelle qui monte dans les Arbres-Titans) | haute 2k | une illustration dans le style révisé | 2,75 |

Ensuite, montrées à Cyril dans le jeu (captures), avant de lancer le reste par lots (un lot par ville). Les apparences
de Hesper et des autres sont des **propositions** (le canon donne leur rôle, pas leur visage), consignées avec chaque
lot dans `docs/univers/personnages/` au statut « à valider ».

## Pilote de la mise en beauté (2026-11-08, feu vert de Cyril : « Oui pour le pilote et le style révisé, lance ») : 10 images, 10,25 crédits, solde 2 135,11

Outil : Higgsfield MCP, `gpt_image_2_6`. Bloc commun : le style révisé (`docs/STYLE.md`), « Painterly digital illustration, dark fantasy for adults, muted earthy palette lit by warm lantern light against cool shadows, low-key light from the upper left, weathered materials and tired faces, melancholic and poetic mood, clean readable shapes, slightly defined outlines, neo-industrial world of steam, crystals and brass, no modern technology. » À éviter : « no
text, no letters, no logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not
photorealistic ». Personnages, décors et créatures : « Isometric 2:1 view, single … centered, isolated on a transparent
background », sans sol ni ombre (ajoutée par le script). Bruts : `assets/raw/pilote2/` (local) ; traités par
`npm run art` puis `npm run tiles` (les images des lots précédents, dont les bruts ne sont pas dans cette session,
gardent leur frame : rien d'autre n'a bougé).

| Fichier (`assets/raw/pilote2/`) | Tâche | Réglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `hesper-v1-manteau-sombre.png` (écarté) | `d678ff16` | moyenne 1k, transparent, 2:3 | Hesper, doyenne des Gardiens, « a heavy dark travelling coat with many small pockets… », lanterne à la ceinture | 0,5 |
| `portrait-hesper-v1-manteau-sombre.png` (écarté) | `bdec210b` | haute 1k, opaque, 1:1, la v1 en référence | le même buste | 1,5 |
| `hesper.png` | `f5bff015` | moyenne 1k, transparent, 2:3 | refait pour suivre son texte (« Une vieille femme en cape couleur parchemin pose sa lanterne », « les mains jointes sur sa lanterne ») : « a tall thin old woman in her seventies, long white hair in a loose braid, a lined, tired but piercing face, ink-stained fingers, a long weathered parchment-coloured hooded cape over dark layered clothes, a worn leather-bound register tucked under one arm, both hands joined around a small brass lantern with a faint cyan glow held at her chest » | 0,5 |
| `portrait-hesper.png` | `0c27e242` | haute 1k, opaque, 1:1, `hesper.png` en référence | « Bust portrait for a dialogue panel, three-quarter view: the same old woman as in the reference image… same weathered parchment-coloured hooded cape, both ink-stained hands joined around her small brass lantern… a lined, tired but piercing gaze that has read too many names… Plain uniform dark ink background color #1B1512 » | 1,5 |
| `portrait-ilyane-v2.png` | `e2d69727` | haute 1k, opaque, 1:1, le portrait actuel en référence (téléversé, `8050cebc`) | « the same woman as in the reference image, Ilyane… same face, same braided greying hair with small leaves, same cloak patterned with bark and leaves… a little older and wearier, faint lines of worry around her eyes, a quiet sorrow behind her kind gaze » | 1,5 |
| `fleuriste.png` | `6b6806e8` | moyenne 1k, transparent, 2:3 | « a flower seller of a city built high in the canopy of giant trees, a lean woman in her forties with sun-weathered skin, a patched moss-green dress and a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers… a guarded, tired smile » | 0,5 |
| `maison-cosse.png` | `a72cd24f` | moyenne 1k, transparent, 2:3 | « a large rounded seed-pod-shaped house woven from bark strips and living branches, a round wooden door and a small round window glowing with warm lantern light, a curved roof of overlapping dark leaves, moss and lichen… » | 0,5 |
| `plateforme.png` | `94842475` | moyenne 1k, opaque, 1:1, texture vue de dessus | « the floor of a wooden platform high in the canopy of giant trees, exactly four wide weathered planks of equal width running vertically… a few patches of moss, two or three fallen leaves, worn nail holes » (lumière uniforme, comme les sols du lot 1) | 0,5 |
| `griffe-sylve.png` | `7521ffe4` | moyenne 1k, transparent, 1:1 | « a Griffe-Sylve, a lean green feline predator of the deep forest with plant-like camouflage, its fur patterned like leaves, moss and bark, long curved claws, slitted amber eyes, low stalking crouch, mouth closed » | 0,5 |
| `canopee-arrivee.png` | `6856b44a` | haute 2k, opaque, 16:9 | « the arrival in a city built high in the canopy of colossal Titan trees… at dusk, a large wooden gondola hoisted by braided ropes and a water counterweight rises out of the misty forest… toward a vast suspended market of wooden platforms, rope bridges and rounded seed-pod houses lit by warm lanterns… The lower third is darker, calm mist and shadow, leaving room for a dialogue panel » | 2,75 |

**Dans le jeu** : la plate-forme, la maison-cosse et la marchande de fleurs à la Grande Nacelle ; l'illustration derrière
l'accueil de Véline (« Bienvenue à Canopéa ! ») ; Hesper en pied et son portrait à la maison mère de Sept-Portes ; la
Griffe-Sylve en combat. Le nouveau portrait d'Ilyane **n'est pas mis dans le jeu** : il attend le choix de Cyril (refaire
ou non les neuf anciens). Vérifié dans Chromium, sans erreur ; 1076 tests ; build (cache hors ligne 14,9 Mo).

**Bilan** :
- Tout est sorti propre au premier essai (fond transparent net, formes lisibles à 64 px). Le style révisé donne des
  visages fatigués, une lumière de lanterne, des matières usées ; sur la carte, les nouvelles images vont avec celles de
  Gardebois.
- **Hesper refaite** (2 crédits, pris sur les reprises prévues) : la première version portait un manteau sombre, alors
  que son texte validé dit « cape couleur parchemin » et la montre la lanterne en main. Règle pour la suite : **relire
  les dialogues d'un personnage avant d'écrire son prompt**.
- **La Griffe-Sylve** se perdait dans l'herbe (son camouflage est canon) : traitée plus grande (54 × 42 au lieu de
  48 × 38) et éclaircie de 30 % par le script (option `lift` de `scripts/process-art.mjs`), sans nouvelle image.
- Vu au passage : à la maison mère, Hesper se tient juste derrière le cristal de veille, qui la voile un peu ; à reprendre
  avec le lot de Sept-Portes (placement sur la carte, pas l'image).
- **À valider par Cyril (inventions visuelles)** : l'illustration montre des maisons en dômes de laiton et de verre
  suspendues, des bannières à motif de feuille, des cristaux au marché et une cheminée qui fume ; la cape parchemin de
  Hesper reprend celle des Gardiens (le héros la porte aussi).

## Les neuf portraits refaits (2026-11-08, Cyril : « Nouvelle Ilyane, refais les 9 ») : 8 images, 12 crédits, solde 2 123,11

Le nouveau portrait d'Ilyane est celui du pilote (`e2d69727`). Les huit autres : `gpt_image_2_6`, haute 1k, opaque,
1:1, **le portrait actuel en référence** (importé depuis le site, `media_import_url`), bloc commun du style révisé, puis
« Bust portrait for a dialogue panel, three-quarter view: the same <man/woman> as in the reference image, <nom, rôle>,
same face, same hair, same clothes… ; in this darker style, <ce qui change> … Plain uniform dark ink background color
#1B1512 ». Bruts : `assets/raw/portraits-v2/` ; branchés par `scripts/art/portraits-v2.json` (ils remplacent les
anciens dans `public/portraits/`). Tous gardés au premier essai.

| Portrait | Tâche | Ce qui change (le reste : « same face, same hair, same clothes ») | Crédits |
|---|---|---|---|
| Tobias | `792bb68a` | « a little wearier, soot in the creases of his hands, a friendly but calculating smile », la lampe au cristal | 1,5 |
| Ingrid | `08a547ae` | « oil and soot on her cheek, tired eyes, a defiant, stubborn gaze », lunettes de laiton, plans | 1,5 |
| L'Écho du dernier train | `9154f823` | « more sorrowful and haunting, the child's gaze patient and sad, the figures fraying at the edges like smoke » | 1,5 |
| Sylvan | `1b53e7a8` | « a little wearier, warm hearth light on his face, a kind but tired smile » (traits gardés tels quels : la question des oreilles reste ouverte, zone floue 2) | 1,5 |
| Maëlis | `72fd05d3` | « shadows of sleepless nights under her eyes, a tender, worried gaze » | 1,5 |
| Nell | `912cf344` | « a shy, solemn, searching look as if trying to remember a song », l'oiseau de bois | 1,5 |
| Liane | `706af765` | « road dust and fatigue, a calm, steady, watchful gaze » | 1,5 |
| Brann | `fc708572` | « soot on his hands, an eager but uneasy look » | 1,5 |

## Lot Canopéa (2026-11-08, 75 images, 45,5 crédits, solde 2 038,61)

Le premier lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots »). Le solde
est celui du compte après le lot ; le lot d'Ironheart tournait en même temps sur le même compte : les 45,5 crédits sont
comptés tâche par tâche (tableau). Outil : Higgsfield MCP, `gpt_image_2_6`. Bruts : `assets/raw/canopee/` (local) ;
tailles et préréglages : `scripts/art/canopee.json` ; traités par `npm run art`, `npm run tiles`, `npm run lots`.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête (sauf sols et planches de marche) et « No text, no letters, no logo, no
  watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à la fin de tous.
- **Personnages** : « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body
  character, three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She
  stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » ; **créatures** et
  **objets** : de même avec « single creature / single object centered … : <sujet>. Simple readable silhouette / shape for
  a small game sprite. It stands directly on the bottom of the image… ».
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes. Seamless
  tileable ground texture, flat top-down orthographic view looking straight down from above, filling the entire square
  edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light spot, no cast
  shadows, no perspective, no horizon. No objects. »
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: the same <woman/man/boy/old woman> as in the
  reference image, <sujet>, same face, same hair, same clothes, lit by warm lantern light from the upper left with cool
  shadow on the other side. Plain uniform dark ink background color #1B1512. »
- **Planches de marche** : le prompt de la méthode 2D (`docs/gdd/animation.md`), « Sprite sheet for a 2D isometric game,
  on a transparent background: the same character as in the reference image (<tenue>), full body, seen from slightly
  above at a 30 degree angle, <direction>. Exactly 6 frames… the character identical in every frame except the legs, arms
  and <dress/cape> moving with the steps. No ground, no shadow, no grid lines, no frame borders. » ; directions : « walking
  toward the viewer, facing the viewer » (s), « walking toward the lower right, three-quarter front view turned to the
  right » (se), « walking to the right, seen in side profile facing right » (e), « walking toward the upper right,
  three-quarter back view turned to the right » (ne), « walking away from the viewer, seen from behind » (n).
- **Fond** : « Painted backdrop for the empty edges around an isometric game map: <sujet>; no buildings or figures in the
  center, no focal subject, soft and slightly blurred, darker toward the edges. »

| Fichier (`assets/raw/canopee/`) | Tâche | Réglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `veline.png` | `3e8fc554` | moyenne 1k, transparent, 2:3 | « Véline, the gondola keeper of a city built high in the canopy of colossal trees, a strong woman in her late thirties, dark brown hair tied back in a practical knot, a sun-weathered face with a warm but tired smile, sleeves rolled up over muscular forearms, a leaf-green work tunic with a tan leather vest and belt, worn leather gloves, a coil of braided rope over one shoulder » | 0,5 |
| `kael-marchevent.png` | `2fca59b0` | moyenne 1k, transparent, 2:3 | « Kael Marchevent, the Guardian of the Canopy, a human man of about forty-five, short dark brown hair greying at the temples, a short beard, a weathered stern face with tired eyes, dark green leather armour and a long dark green cloak of the Green Guard fastened at the chest with a copper clasp set with a small green stone, a rolled map in one hand » | 0,5 |
| `mirelle.png` | `ca9d831e` | moyenne 1k, transparent, 2:3 | « Mirelle, an old memory keeper of a city high in the canopy of giant trees, a woman in her sixties with short grey hair, lively laughing eyes with crow's feet, ink-stained fingers, a dark moss-green dress under a weathered parchment-coloured short cape fastened with a copper brooch, an old notebook bound with string held against her chest » | 0,5 |
| `vanel.png` | `9c72f26c` | moyenne 1k, transparent, 2:3 | « Vanel, a druid of the forest, a patient man in his sixties with grey hair and a short grey beard, a long deep green hooded robe with the hood lowered on his shoulders, a small emerald crystal pendant on a cord at his neck glowing faintly green, one open hand raised gently as if feeling the pulse of a tree » | 0,5 |
| `malo.png` | `bf1da7fa` | moyenne 1k, transparent, 2:3 | « Malo, a boy of about eleven, a courier of the rope bridges in a city built high in the canopy of giant trees, tousled auburn hair, freckles, a lively cheeky grin, a simple rust-orange tunic with rolled sleeves, brown trousers, soft leather shoes, a brown leather courier satchel with a copper clasp worn across his chest, simple child's clothes » | 0,5 |
| `ailis.png` | `ba8ba35e` | moyenne 1k, transparent, 2:3 | « Aïlis, an old grandmother of a city high in the canopy of giant trees, small and frail, in her seventies, white hair in a neat bun, a lined kind face marked by grief, a grey-green wool dress with a knitted shawl, holding knitting needles and a little knitting in her hands » | 0,5 |
| `elouan.png` | `90370c3c` | moyenne 1k, transparent, 2:3 | « Elouan, a luthier of a city high in the canopy of giant trees, a man in his sixties with black hair streaked with grey tied back and a short greying beard, gentle absorbed eyes, slightly stooped on stiff knees, a brown wool tunic under a worn leather work apron dusted with wood shavings, holding a half-carved wooden flute in his hands » | 0,5 |
| `messager.png` | `5ff7f521` | moyenne 1k, transparent, 2:3 | « a hurried young messenger of the forest council, a slim young man with short black hair, a slate-blue tunic with a leather belt, dark trousers and soft boots, a small leather message pouch at his hip, a sealed letter with a copper wax seal held in one hand » | 0,5 |
| `lisandre.png` | `add4bb13` | moyenne 1k, transparent, 2:3 | « Lisandre, the innkeeper of a hammock inn high in the canopy of giant trees, a woman in her forties with honey-blond hair pinned up in a loose bun, warm tired eyes, a faded plum-purple dress with a cream linen apron, holding a steaming wooden bowl of flower soup with floating pale petals in both hands » | 0,5 |
| `sevane.png` | `69d1670f` | moyenne 1k, transparent, 2:3 | « Sévane, a herbalist of a city high in the canopy of giant trees, a woman in her thirties with tan brown skin and dark auburn hair in a thick braid, a wary guarded look, a deep green dress under a leather apron with many small pockets, bundles of dried herbs at her belt, a small stoppered glass vial held in one hand » | 0,5 |
| `huissier.png` | `feb68e51` | moyenne 1k, transparent, 2:3 | « the usher of the council of a city high in the canopy of giant trees, a thin stiff man in his fifties, neatly combed dark brown hair, a stern tired face, a long dark green formal coat with dull gold trim, a long rolled parchment list under one arm and a quill pen in his hand » | 0,5 |
| `lyra.png` (écarté) | `6068604c` | moyenne 1k, transparent, 2:3 | « Lyra Cœur-de-Sève, the First Root of the council of a forest nation, an elf woman with an ageless face and faint fine lines, pointed ears, long pale blond hair braided with living green vines, calm shrewd eyes, a sober moss-green robe with a gold-thread belt and a simple gold leaf clasp » | 0,5 |
| `thalorin.png` (écarté) | `69182c2f` | moyenne 1k, transparent, 2:3 | « Thalorin, an ancient dryad, the Voice of the Earth: a tall slender humanoid tree spirit whose skin is smooth pale grey-green bark, hair made of living green leaves, calm deep amber eyes, long thin fingers like twigs, a simple robe of woven leaves and moss, looking like a young tree that has decided to walk » | 0,5 |
| `garrik.png` | `31147929` | moyenne 1k, transparent, 2:3 | « Garrik, a hired digger, a stocky man in his forties with short dark hair and stubble, a sullen wary face, dirt-stained grey work clothes with patched knees, heavy boots, a pickaxe resting on his shoulder, a small brass lantern of industrial make hanging at his belt » | 0,5 |
| `elvan.png` | `3463d3e4` | moyenne 1k, transparent, 2:3 | « Elvan Morelle, a travelling cloth merchant, a lean nervous man in his thirties with dark auburn hair, shifty eyes, olive-brown travelling clothes and a dusty cloak, a fat coin purse at his belt, clutching a bulging cloth-wrapped bale under one arm » | 0,5 |
| `chef-caravane.png` | `a1ad38fa` | moyenne 1k, transparent, 2:3 | « the chief of a merchant caravan, a weathered man in his fifties with brown hair and stubble under a wide-brimmed leather hat, chewing a strip of dried meat, a faded olive-green travelling coat, a leather belt with pouches, a coiled rope at his hip » | 0,5 |
| `tiven.png` | `7c1bd85e` | moyenne 1k, transparent, 2:3 | « Tiven, a young rope-hauler of the gondolas, a lanky young man of about eighteen with messy auburn hair and a pale face, a sleeveless brown work tunic, a coil of rope slung across his chest, both reddened rope-burned palms held up in front of him, wincing » | 0,5 |
| `porteur.png` | `8331ce9c` | moyenne 1k, transparent, 2:3 | « a wiry porter, a man in his thirties with dark hair and a sweaty tired face, simple brown work clothes, bent forward under a tall wicker back-basket held by shoulder straps, its load hidden under a tied sackcloth cover » | 0,5 |
| `enfant-a.png` | `b68bb357` | moyenne 1k, transparent, 2:3 | « a little girl of about eight playing, tousled sandy hair, a simple blue tunic over brown leggings, small leather shoes, arms spread out as if balancing on a plank, a mischievous smile, simple child's clothes » | 0,5 |
| `vieillard.png` | `9eab74fc` | moyenne 1k, transparent, 2:3 | « an old man in his eighties with sparse white hair and white stubble, a thin lined face, a long faded grey coat, leaning on a wooden cane with his right hand, his left hand tucked inside his coat, a calm distant gaze » | 0,5 |
| `tisseuse.png` | `92f816e4` | moyenne 1k, transparent, 2:3 | « a leaf weaver of a city high in the canopy of giant trees, a woman in her thirties, auburn hair under a green headscarf, a leaf-green dress, a folded translucent veil woven from green leaves draped over her forearm » | 0,5 |
| `portrait-veline.png` | `30ea34da` | haute 1k, opaque, 1:1, `veline.png` en référence | « Véline, the gondola keeper of the canopy city, a warm welcoming half-smile with a trace of hidden worry in her eyes » | 1,5 |
| `portrait-kael-marchevent.png` | `0e8bca32` | haute 1k, opaque, 1:1, `kael-marchevent.png` en référence | « Kael Marchevent, the Guardian of the Canopy, a stern weighing gaze and a set jaw, a weary soldier who wants facts, not rumours » | 1,5 |
| `portrait-mirelle.png` | `fdbf1164` | haute 1k, opaque, 1:1, `mirelle.png` en référence | « Mirelle, the memory keeper of the canopy city, a fond laughing smile with glistening eyes, as if remembering an old friend » | 1,5 |
| `portrait-vanel.png` | `e2b88109` | haute 1k, opaque, 1:1, `vanel.png` en référence | « Vanel, a druid of the forest, a calm patient gaze, gentle and grave, as if listening to something far away » | 1,5 |
| `portrait-malo.png` | `2d1ec80b` | haute 1k, opaque, 1:1, `malo.png` en référence | « Malo, a young courier of the rope bridges, a cheeky lively grin and bright eyes, simple child's clothes » | 1,5 |
| `lyra-v2.png` | `ef86d66e` | moyenne 1k, transparent, 2:3 | « Lyra Cœur-de-Sève, the First Root of the council of a forest nation, an elf woman with an ageless face and faint fine lines, pointed ears, long pale blond hair braided with living green vines, calm shrewd eyes, a sober moss-green robe with a gold-thread belt and a simple gold leaf clasp, empty hands folded in front of her, no staff, no lantern, no glow, no light aura around her » | 0,5 |
| `thalorin-v2.png` | `5b83c6d3` | moyenne 1k, transparent, 2:3 | « Thalorin, an ancient dryad, the Voice of the Earth: a tall slender humanoid tree spirit whose skin is smooth pale grey-green bark, hair made of living green leaves, calm deep amber eyes, long thin fingers like twigs, a simple robe of woven leaves and moss, looking like a young tree that has decided to walk, empty hands at his sides, no staff, no lantern, no glow, no light aura around him » | 0,5 |
| `portrait-ailis.png` | `e14b3146` | haute 1k, opaque, 1:1, `ailis.png` en référence | « Aïlis, a grandmother of the canopy city, a tender sad smile, eyes full of grief and kindness » | 1,5 |
| `portrait-elouan.png` | `6f59a319` | haute 1k, opaque, 1:1, `elouan.png` en référence | « Elouan, the luthier, a gentle absorbed look, eyes half closed as if listening to the wood sing » | 1,5 |
| `pelerine.png` | `6eac50a6` | moyenne 1k, transparent, 2:3 | « a young woman pilgrim in mourning, auburn hair, a pale drawn face, a long plain ash-grey hooded cloak with the hood lowered, holding a small sprig of green leaves in her joined hands » | 0,5 |
| `jardinier.png` | `ddeec263` | moyenne 1k, transparent, 2:3 | « an old bark-tender who cares for sacred trees, a man in his sixties with grey hair under a wide-brimmed straw hat, earth-brown work clothes with patched knees, a small cloth pouch of green moss at his belt and a little wooden spatula in his hand » | 0,5 |
| `voyageuse.png` | `be1671f9` | moyenne 1k, transparent, 2:3 | « a footsore travelling woman, black hair tied back, a dusty exhausted face, rust-brown travelling clothes and a worn cloak, a heavy travel pack strapped on her back » | 0,5 |
| `druide.png` | `91ec079d` | moyenne 1k, transparent, 2:3 | « an old druid of the forest council, a man in his seventies with a long grey beard, a deep dark-green hooded robe with the hood up, a long gnarled wooden staff, a calm patient face » | 0,5 |
| `conseillere.png` | `ad5a2042` | moyenne 1k, transparent, 2:3 | « a council deputy of a forest nation, a woman in her forties with dark brown hair in a neat coil, a stern pragmatic face, an olive-green formal long coat, a thin gold torc necklace, a rolled document tied with a green ribbon under her arm » | 0,5 |
| `nacelliere.png` | `7d595720` | moyenne 1k, transparent, 2:3 | « a sturdy rope-hauler who works the gondolas of a city in the canopy of giant trees, a woman in her thirties with a copper-brown braid and strong arms, dark teal work clothes, a harness of rope coiled around her waist, leather gloves tucked in her belt » | 0,5 |
| `marchand-the.png` | `9c23d63b` | moyenne 1k, transparent, 2:3 | « a tea merchant of the high canopy, an elderly man with pale straw-blond hair and a thin moustache, a leaf-green robe with a cream apron, holding a small tray with a clay teapot and a little cup of steaming green tea » | 0,5 |
| `scribe.png` | `331fa724` | moyenne 1k, transparent, 2:3 | « a council scribe, a woman in her twenties with black hair in a tight bun, a serious face, a dark green robe with ink-stained sleeves, holding a wooden writing board with blank papers and a quill pen » | 0,5 |
| `citoyen-arbre.png` | `2a66ee05` | moyenne 1k, transparent, 2:3 | « a wealthy citizen of the highest branches, a haughty man in his fifties with pale blond hair, a fine dark teal long coat with a gold sash across the chest, fine leather gloves, a slightly disdainful look » | 0,5 |
| `graveur.png` | `0014022d` | moyenne 1k, transparent, 2:3 | « an old engraver of names, a man in his sixties with grey hair and a grey beard, a leather apron covered with wood dust over a brown tunic, a small steel engraving chisel in one hand and a wooden mallet in the other » | 0,5 |
| `veuve.png` | `15c6d81b` | moyenne 1k, transparent, 2:3 | « a widow in mourning, a woman in her fifties, dark grey and black mourning clothes, a dark shawl drawn over her head and shoulders, a pale grieving face, hands clasped » | 0,5 |
| `ours-mousse.png` | `71ca6693` | moyenne 1k, transparent, 1:1 | « an Ours-Mousse, a massive bear whose fur is covered in soft thick green moss, small ferns and lichen growing on its back, calm heavy-lidded eyes, standing on all fours, side three-quarter view, territorial but calm, mouth closed » | 0,5 |
| `guepe-rouille.png` | `3aebe64b` | moyenne 1k, transparent, 1:1 | « a small swarm of three rust wasps flying close together: hand-sized wasps whose bodies look like corroded rusty orange metal with dark stripes, translucent pale wings, glinting stingers » | 0,5 |
| `gecko-soudeur.png` (écarté) | `84455219` | moyenne 1k, transparent, 1:1 | « a Gecko-Soudeur, a lizard the size of a cat with grey metallic scaly skin like riveted iron plates, glowing yellow eyes, a few bright orange sparks crackling from its mouth, low crouching pose, side three-quarter view » | 0,5 |
| `cerf-luciole.png` | `fe8a1f42` | moyenne 1k, transparent, 1:1 | « a firefly deer, a slender forest deer with soft brown fur and branching antlers dotted with small glowing pale yellow-green lights like fireflies, gentle wary eyes, standing, side three-quarter view » | 0,5 |
| `feuillage.png` | `08de1349` | moyenne 1k, opaque, 1:1, vue de dessus | « the canopy of a forest of colossal trees seen from high above, a sea of dense overlapping dark green leaf clusters and leafy branch tips, deep shadowed gaps between the clusters suggesting a great drop below, a few lighter yellow-green leaves, dark and cool overall » | 0,5 |
| `passerelle-c-v1.png` (écarté) | `46a746bb` | moyenne 1k, opaque, 1:1, vue de dessus | « a narrow suspended footbridge running from the top edge to the bottom edge, centered, about half as wide as the image: short weathered light wooden planks laid crosswise side by side and tied with ropes, a thick rope handrail along each side; on both sides of the footbridge, dense dark green treetop foliage far below » | 0,5 |
| `salle-conseil.png` | `d1322e49` | moyenne 1k, transparent, 2:3 | « the council antechamber of a city high in the canopy of giant trees: a large rounded seed-pod-shaped hall woven from pale bark strips and living branches, taller and finer than a house, a tall arched wooden double door with dull gold leaf ornaments, a curved roof of overlapping fresh green leaves, a softly glowing pale green crystal set at its tip, moss and lichen » | 0,5 |
| `grenier.png` | `ab2267c7` | moyenne 1k, transparent, 2:3 | « a seed granary of a city high in the canopy of giant trees: a squat sturdy rounded seed-pod-shaped storehouse woven from dark bark strips and living branches, a heavy grey wooden door with a copper lock plate, a small wooden nest box hanging just above the door, a curved roof of dark overlapping leaves, moss » | 0,5 |
| `gecko-soudeur-v2.png` | `10912545` | moyenne 1k, transparent, 1:1 | « a Gecko-Soudeur, a wild lizard the size of a cat with grey metallic scaly skin like riveted iron plates, glowing yellow eyes, a few bright orange sparks crackling from its open jaws, low crouching pose, side three-quarter view, a wild animal with no clothing, no goggles, no harness, no equipment » | 0,5 |
| `nacelle.png` | `be275cbe` | moyenne 1k, transparent, 2:3 | « a wooden gondola of a city in the canopy of giant trees: an open square cage-basket of weathered planks with a low railing, hanging from three thick braided ropes that rise straight up and leave through the top edge of the image » | 0,5 |
| `arbre-souvenir.png` | `48c3c7ca` | moyenne 1k, transparent, 2:3 | « an old tree of a sacred memorial grove, a sturdy dark trunk carved with vertical columns of small abstract engraved signs glowing faint pale green, a rounded crown of dark green leaves with a few tiny glowing motes, exposed roots » | 0,5 |
| `arbre-retour.png` | `ccc8f324` | moyenne 1k, transparent, 2:3 | « a young slender tree with a fresh light green crown, a green ribbon tied around its trunk, moss on its roots, a few fallen dry branches lying around its roots » | 0,5 |
| `lanterne-verte.png` | `9de4027e` | moyenne 1k, transparent, 2:3 | « a tall slender wooden lantern post with a small brass cage at its top holding a green crystal that glows soft pale green » | 0,5 |
| `rubans.png` | `ce3d9efc` | moyenne 1k, transparent, 2:3 | « the top of a rope ladder: two short weathered wooden posts from which a rope ladder with wooden rungs hangs straight down, many small faded cloth ribbons of different colours knotted to its rungs and fluttering » | 0,5 |
| `hamac.png` | `9bc33cf9` | moyenne 1k, transparent, 1:1 | « a hammock of woven green fibre hanging between two sturdy wooden posts, a folded wool blanket lying in it » | 0,5 |
| `etabli.png` | `0a270e5b` | moyenne 1k, transparent, 1:1 | « a sturdy worn wooden workbench with a wooden vice, a few hand tools (chisel, mallet, small saw) and curled wood shavings on top » | 0,5 |
| `sacs-graines.png` | `5c07d272` | moyenne 1k, transparent, 1:1 | « three plump burlap seed sacks tied with twine, one open at the top showing pale seeds with a faint golden glimmer, a small copper tag tied to each » | 0,5 |
| `ballots.png` | `dd168bf2` | moyenne 1k, transparent, 1:1 | « two bulging bales of cloth wrapped in rough canvas and tied with green cords » | 0,5 |
| `gradin.png` | `fc1c5331` | moyenne 1k, transparent, 1:1 | « a short section of amphitheater seating: a low block of two broad stepped tiers carved out of the pale grey weathered wood of a huge dead tree, seen as an isometric block » | 0,5 |
| `fond-canopee.png` | `79a8d2b2` | haute 1k, opaque, 16:9 | « the empty void between the colossal branches of giant Titan trees, seen from very high above: drifting mist and soft clouds, the forest canopy far, far below fading into a deep blue-green haze, a few huge dark branches fading into the mist near the edges » | 1,5 |
| `sacoche.png` | `91e87391` | moyenne 1k, transparent, 1:1 | « a brown leather courier satchel with a copper clasp lying on its side, the flap half open, a few folded letters sticking out, no writing visible » | 0,5 |
| `lettres.png` | `17a3c3fa` | moyenne 1k, transparent, 1:1 | « a few scattered letters lying flat: folded parchment papers and envelopes, some with red wax seals, no writing visible » | 0,5 |
| `trou-fouille.png` | `3a141858` | moyenne 1k, transparent, 1:1 | « a freshly dug pit in dark earth: a dark hole with a mound of loose soil beside it, severed pale tree roots sticking out of its walls, a pickaxe stuck in the soil » | 0,5 |
| `marche-fleuriste/s.png` | `594578e8` | moyenne 1k, transparent, 21:9, `pilote2/fleuriste.png` (`6b6806e8`) en référence | « vers le spectateur ; tenue : a lean woman with brown hair adorned with small flowers, a patched moss-green dress, a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers carried on her arm at her hip, brown boots, same face, same proportions and colors ; « legs, arms and dress moving » » | 0,5 |
| `marche-fleuriste/se.png` | `3bddbcf3` | moyenne 1k, transparent, 21:9, `pilote2/fleuriste.png` (`6b6806e8`) en référence | « bas-droite, trois quarts face ; tenue : a lean woman with brown hair adorned with small flowers, a patched moss-green dress, a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers carried on her arm at her hip, brown boots, same face, same proportions and colors ; « legs, arms and dress moving » » | 0,5 |
| `marche-fleuriste/e.png` | `b524cd70` | moyenne 1k, transparent, 21:9, `pilote2/fleuriste.png` (`6b6806e8`) en référence | « profil vers la droite ; tenue : a lean woman with brown hair adorned with small flowers, a patched moss-green dress, a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers carried on her arm at her hip, brown boots, same face, same proportions and colors ; « legs, arms and dress moving » » | 0,5 |
| `marche-fleuriste/ne.png` | `c03a68ee` | moyenne 1k, transparent, 21:9, `pilote2/fleuriste.png` (`6b6806e8`) en référence | « haut-droite, trois quarts dos ; tenue : a lean woman with brown hair adorned with small flowers, a patched moss-green dress, a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers carried on her arm at her hip, brown boots, same face, same proportions and colors ; « legs, arms and dress moving » » | 0,5 |
| `marche-fleuriste/n.png` | `137385d0` | moyenne 1k, transparent, 21:9, `pilote2/fleuriste.png` (`6b6806e8`) en référence | « de dos ; tenue : a lean woman with brown hair adorned with small flowers, a patched moss-green dress, a frayed brown shawl, a wide shallow wicker basket of pale moon-flowers carried on her arm at her hip, brown boots, same face, same proportions and colors ; « legs, arms and dress moving » » | 0,5 |
| `marche-messager/s.png` | `33eef500` | moyenne 1k, transparent, 21:9, `messager.png` en référence | « vers le spectateur ; tenue : a slim young man with short black hair, a short dark green cape over a slate-blue tunic, a leather belt with a small pouch, dark trousers, brown boots, a sealed letter with a copper wax seal in one hand, same face, same proportions and colors ; « legs, arms and cape moving » » | 0,5 |
| `marche-messager/se.png` | `3168ee55` | moyenne 1k, transparent, 21:9, `messager.png` en référence | « bas-droite, trois quarts face ; tenue : a slim young man with short black hair, a short dark green cape over a slate-blue tunic, a leather belt with a small pouch, dark trousers, brown boots, a sealed letter with a copper wax seal in one hand, same face, same proportions and colors ; « legs, arms and cape moving » » | 0,5 |
| `marche-messager/e.png` | `f3c09079` | moyenne 1k, transparent, 21:9, `messager.png` en référence | « profil vers la droite ; tenue : a slim young man with short black hair, a short dark green cape over a slate-blue tunic, a leather belt with a small pouch, dark trousers, brown boots, a sealed letter with a copper wax seal in one hand, same face, same proportions and colors ; « legs, arms and cape moving » » | 0,5 |
| `marche-messager/ne.png` | `c1041b5f` | moyenne 1k, transparent, 21:9, `messager.png` en référence | « haut-droite, trois quarts dos ; tenue : a slim young man with short black hair, a short dark green cape over a slate-blue tunic, a leather belt with a small pouch, dark trousers, brown boots, a sealed letter with a copper wax seal in one hand, same face, same proportions and colors ; « legs, arms and cape moving » » | 0,5 |
| `marche-messager/n.png` | `7a9c9b2a` | moyenne 1k, transparent, 21:9, `messager.png` en référence | « de dos ; tenue : a slim young man with short black hair, a short dark green cape over a slate-blue tunic, a leather belt with a small pouch, dark trousers, brown boots, a sealed letter with a copper wax seal in one hand, same face, same proportions and colors ; « legs, arms and cape moving » » | 0,5 |
| `passerelle-c-v2.png` | `162a29b3` | moyenne 1k, opaque, 1:1, vue de dessus, `feuillage.png` en référence | « a wide suspended footbridge running straight from the top edge to the bottom edge, centered, occupying the middle half of the image width: weathered light wooden planks laid crosswise side by side, each plank as long as half the image width, tied with ropes, a thick rope handrail along each side; on the left and right quarters of the image, the same dark green treetop foliage as in the reference image, far below » | 0,5 |
| `passerelle-r.png` | — | `passerelle-c-v2.png` tournée d’un quart (sharp), pour les passerelles le long des rangées | — | 0 |

**Dans le jeu** : 54 tuiles (53 images et `passerelle-r`), 7 portraits (`src/data/npcs.json`), les planches de marche
de la marchande de fleurs et du messager du Conseil (`public/sprites/figurant-{fleuriste,messager}.png`,
`src/data/figurants.json`), le fond `public/fonds/canopee.jpg` (sous la Grande Nacelle, les Hautes Ramures et le Bosquet
des Échos). Pas d'illustration dans ce lot : celle du pilote reste sur l'accueil de Véline (`veline.json`, nœud
`accueil`), aucun dialogue touché. Vérifié dans Chromium : les trois quartiers, le Nid, l'atelier, le grenier,
l'amphithéâtre, le Sol des Racines, un combat (Ours-Mousse, Guêpes-Rouille, Gecko-Soudeur, fouilleur), les dialogues de
Véline et de Malo avec leur portrait ; aucune erreur ; typecheck et 1079 tests.

**Bilan** :
- **Reprises (4, 2 crédits)** : Lyra et Thalorin sortis avec un halo blanc (fond non transparent) et un bâton à
  lanterne (une flamme pour Lyra, alors qu'on ne fait pas de feu à Canopéa) : refaits mains vides, sans bâton ni halo ;
  le Gecko-Soudeur sorti avec lunettes, foulard et sac (une bête apprivoisée, alors que c'est une bête sauvage) : refait
  sans équipement ; la passerelle, trop étroite et bordée d'un feuillage plus clair que la mer de feuilles : refaite
  plus large, `feuillage.png` en référence (les deux se raccordent sans couture).
- **Sortes vérifiées** : `cerf-luciole` (donné « décor ») est une bête, `garrik` (« ennemi ») un personnage ;
  `feuillage`, `passerelle-c`, `passerelle-r` sont des sols ; ours, guêpes et gecko : `creature`.
- **Script** : `scripts/process-art.mjs` reçoit un raccord `seam: "horizontal"` (motif qui court de gauche à droite
  dans la texture, le long des rangées) : `passerelle-r` est `passerelle-c-v2.png` tournée d'un quart, sans génération.
- **Tuiles partagées avec d'autres villes** (une image par allure) : `porteur` sert aussi aux porteurs des Halles, de
  charbon (Ironheart) et des Sept Portes : peint avec une hotte couverte, contenu caché ; `vieillard` sert aussi à
  l'ancien aiguilleur « une main en moins » : main gauche glissée dans le manteau ; `pelerine` sert aussi à la Voix des
  Arbres, à l'étudiante en robe d'encre et à la pèlerine des Trois Cents : cape grise sobre ; `enfant-a` est une
  fillette, mais sert aussi à « un écolier de neuf ans » (Sept-Portes) : à séparer plus tard si Cyril le souhaite. Les
  meubles `etabli`, `ballots`, `hamac`, `gradin` servent ailleurs : peints sans signe propre à Canopéa (le ballot ne luit
  plus : la lueur n'était que dans le dessin provisoire, pas dans le texte).
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : Véline (la trentaine
  passée, cheveux bruns noués, tunique vert feuille, gants, corde tressée à l'épaule) ; Kael Marchevent (humain, 45 ans,
  barbe courte, cuir et cape vert sombre de la Garde Verte, fermoir de cuivre à pierre verte, carte roulée) ; Lyra (elfe,
  longue tresse blonde mêlée de lianes, robe vert mousse, or sobre) ; Thalorin (dryade haute et mince, peau d'écorce
  gris-vert, cheveux de feuilles, robe de feuilles) ; Mirelle (la soixantaine, cheveux gris courts, cape courte couleur
  parchemin des Gardiens sur une robe vert mousse, carnet ficelé) ; Vanel (barbe grise, robe verte à capuche, cristal
  émeraude au cou, bâton à cristal) ; Malo (onze ans, roux, taches de rousseur, tunique rouille, sacoche à fermoir de
  cuivre, comme son texte) ; Aïlis (frêle, chignon blanc, châle tricoté, aiguilles) ; Elouan (la soixantaine, cheveux
  noirs grisonnants noués, tablier de cuir, flûte à demi taillée) ; Lisandre (chignon blond, robe prune, bol de soupe de
  fleurs) ; Sévane (peau hâlée, tresse auburn, tablier à poches, fiole) ; l'huissier (long manteau vert à galons dorés,
  liste roulée, plume) ; Garrik, Elvan, le chef de caravane et Tiven suivent leur texte (pioche et lanterne ; ballot et
  bourse ; chapeau de cuir et viande séchée ; paumes rougies) ; les passants ; les bêtes (Ours-Mousse couvert de mousse
  et de fougères, Guêpes-Rouille en essaim de trois au corps de métal rouillé, Gecko-Soudeur aux plaques rivetées,
  Cerf-Luciole aux bois piqués de lueurs) ; le grenier porte un nichoir au-dessus de sa porte (la rumeur validée de la
  clé du nichoir) ; l'Antichambre du Conseil, portes dorées et cristal vert au sommet ; les arbres du Bosquet gravés de
  colonnes de signes verts lumineux ; le fond : le vide entre les branches, la brume, une lanterne et des cristaux pris
  dans les branches des bords.
- **Vu au passage** : le bloc commun (« warm lantern light ») met une lanterne à flamme à la ceinture de beaucoup de
  personnages, alors que Canopéa ne fait pas de feu ; à 54 px cela se lit comme une lueur. Pour les lots suivants,
  préciser « crystal lantern » là où le feu est exclu. Une petite fumée sort de l'Antichambre du Conseil et d'une
  conduite du fond (vapeur ?).

## Lot Ironheart (2026-11-08, 83 images, 53,75 crédits, solde 2 023,86)

Le deuxième lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots »). Le solde
est celui du compte après le lot ; le lot de Canopéa tournait en même temps sur le même compte : les 53,75 crédits sont
comptés tâche par tâche (tableau) ; prévu 51,75 (79 images), plus 2 de reprises (4 images), plafond 65. Outil :
Higgsfield MCP, `gpt_image_2_6`, six tâches en cours au plus. Bruts : `assets/raw/ironheart/` (local) ; tailles et
préréglages : `scripts/art/ironheart.json` ; traités par `npm run art`, `npm run tiles`, `npm run lots`.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf les sols et le mur), et « No text, no letters, no logo, no
  watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à la fin de tous.
- **Personnages** : « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body
  character, three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She/It
  stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » ; l'**Écho** de même
  avec « single figure » ; **créature**, **objets** et **bâtiments** : « single creature / object / building centered,
  isolated on a transparent background: <sujet>. Simple readable silhouette / shape for a small game sprite. It stands
  directly on the bottom of the image… ».
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes. Seamless
  tileable ground texture, flat top-down orthographic view looking straight down from above, filling the entire square
  edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light spot, no cast
  shadows, no perspective, no horizon. No objects. » ; **mur** (`mur-brique`, `kind: "wall"` comme le `mur` de
  Gardebois) : « Seamless tileable wall texture, flat front orthographic view looking straight at the wall, filling the
  entire square edge to edge, tiling seamlessly from left to right: <sujet>. Perfectly even, uniform lighting…, no
  perspective, no floor, no ceiling. No objects. ».
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: <sujet>, lit by warm lantern light from the
  upper left with cool shadow on the other side. Plain uniform dark ink background color #1B1512. », le personnage en
  pied en référence (`image_references`).
- **Planches de marche** (`docs/gdd/animation.md`) : « Sprite sheet for a 2D isometric game, on a transparent
  background: the same character as in the reference image (<tenue>), full body, seen from slightly above at a 30 degree
  angle, <direction>. Exactly 6 frames of a smooth walking cycle side by side in one single horizontal row, evenly
  spaced, every frame the same size and the same scale, feet on the same baseline, the character identical in every
  frame except the <parties> moving with the steps. No ground, no shadow, no grid lines, no frame borders. » ; hauteur
  54 px (`npm run lots`).

| Fichier (`assets/raw/ironheart/`) | Tâche | Réglage ; préréglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `paves.png` | `7ff4ef37` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « old cobblestones of a forge district street, small rounded dark grey-brown stones set in tight irregular rows, soot in the joints, a few darker oily patches » | 0,5 |
| `paves-cendre.png` | `2930921e` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « old grey cobblestones of a railway yard half covered with fine pale grey ash and cinders, a few black slag grains » | 0,5 |
| `dalles.png` | `a22fc7cf` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « large square flagstones of worn grey stone, exactly four slabs of equal size in a two by two grid filling the square, thin dark joints, subtle cracks and soot stains » | 0,5 |
| `sol-cendre.png` | `82aa2353` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « a floor of dark grey ash and black cinders, packed and uneven, scattered small lumps of black slag » | 0,5 |
| `mur-brique.png` | `5962df28` | moyenne 1k, opaque, 1:1, vue de face ; `wall` | « an old wall of dark red-brown bricks blackened by soot and streaked with rust, thin pale mortar lines, horizontal brick courses running straight from the left edge to the right edge » | 0,5 |
| `maison-brique.png` | `8054c332` | moyenne 1k, transparent, 2:3 ; `batiment` | « a narrow two-storey workers' house of dark red-brown soot-stained brick in a smog-choked industrial city, a steep roof of dark grey slate with a small iron chimney, a copper-sheathed arched door, two small windows glowing warm amber, rusty drainpipes, patched with mismatched sheet metal » | 0,5 |
| `forge.png` | `e98b2b25` | moyenne 1k, transparent, 2:3 ; `batiment` | « a blacksmith's forge workshop of soot-blackened stone and brick under a corrugated iron roof, a tall brick chimney breathing a little grey smoke, a wide open hearth glowing bright orange with fire, an anvil and tongs by the door, iron beams and rivets » | 0,5 |
| `archives.png` | `0f7bc3c3` | moyenne 1k, transparent, 2:3 ; `batiment` | « the Central Archives of an industrial empire, a severe tall building of grey stone and rusted iron, six narrow storeys of tall windows between pale stone pilasters, a triangular stone pediment with a plain blank frieze, a heavy dark iron double door, copper trim, cold and imposing » | 0,5 |
| `monte-charge.png` | `af863cd5` | moyenne 1k, transparent, 2:3 ; `batiment` | « the lower station of a steam funicular: a tall narrow riveted iron gantry with two uprights, a large copper pulley wheel at the top, a small iron cage cabin with a lattice gate at the bottom, thick cables running upward, a small steam boiler beside it » | 0,5 |
| `poste-aiguillage.png` | `6fd2b8d8` | moyenne 1k, transparent, 2:3 ; `batiment` | « a small railway signal box: a narrow two-level hut of dark weathered wooden planks on a brick base, a steep slate roof, a wide upper window glowing warm yellow, a small iron stair, a lantern hanging by the door » | 0,5 |
| `forge-eteinte.png` | `cd83c75b` | moyenne 1k, transparent, 2:3 ; `batiment` | « a cold, abandoned blacksmith's forge: soot-blackened stone and brick under a sagging corrugated iron roof, a tall dead brick chimney with no smoke, a wide dark empty hearth full of cold ash with only a faint dull red glow deep inside, cobwebs and rust, an eerie stillness » | 0,5 |
| `reverbere.png` | `6587482c` | moyenne 1k, transparent, 2:3 ; `haut` | « a tall cast-iron street lamp of an industrial city, a slender dark riveted iron post, a lantern head holding a glowing red crystal that casts a warm red light » | 0,5 |
| `puits.png` | `b82a8471` | moyenne 1k, transparent, 1:1 ; `objet` | « the workers' public well of a forge district: a round low wall of dark sooty stones with an iron rim, dark water inside, a heavy cast-iron hand pump with a long copper spout and a crank wheel, a chained iron cup » | 0,5 |
| `tente-cendres.png` | `1f398563` | moyenne 1k, transparent, 1:1 ; `objet` | « a low market tent of an underground black market: patched ash-grey canvas stretched on crooked iron poles, an open front, polished animal bones, old spare parts and small trinkets hanging under the edge, a small oil lamp glowing inside » | 0,5 |
| `tuyaux.png` | `bf8a1d16` | moyenne 1k, transparent, 1:1 ; `objet` | « a run of thick old industrial pipes: two large riveted pipes of copper and rusted iron rising from the ground and bending at a right angle with a big flanged elbow, a small valve wheel, a wisp of steam leaking from a joint » | 0,5 |
| `tas-cendres.png` | `72414ef6` | moyenne 1k, transparent, 1:1 ; `objet` | « a large heap of grey ash and black slag cinders from the foundries, a rough lumpy mound, a few embers still glowing faint orange deep inside » | 0,5 |
| `levier.png` | `feac35a7` | moyenne 1k, transparent, 1:1 ; `objet` | « a railway switch lever: a long iron lever handle with a red-painted grip set in a heavy iron base frame with a notched quadrant and a counterweight » | 0,5 |
| `brasero.png` | `c8172c17` | moyenne 1k, transparent, 1:1 ; `objet` | « a brazier: a round iron fire basket on three short legs, burning coal with bright orange flames and a few sparks » | 0,5 |
| `enclume.png` | `902126a7` | moyenne 1k, transparent, 1:1 ; `meuble` | « an old blacksmith's anvil black with soot on a thick wooden block, five handprints, big and small, engraved side by side on its flat top, their grooves glowing faintly cyan » | 0,5 |
| `ferraille.png` | `fc4d07c5` | moyenne 1k, transparent, 1:1 ; `meuble` | « a low pile of scrap: a broken worker automaton lying stored under bent iron sheets, old pipes and rusted plates, only its large metal hand sticking out with its fingers slightly raised » | 0,5 |
| `echo-forge.png` | `13d3d2a5` | moyenne 1k, transparent, 2:3 ; `echo` | « a translucent ghostly Echo, the memory of a person from another time: a slender pale blue glowing silhouette edged with soft gold light, leaning forward slightly as if humming a lullaby, a gentle face without detail, fading into mist at the feet » | 0,5 |
| `boulon.png` | `9a89ac8d` | moyenne 1k, transparent, 2:3 ; `colosse` | « Boulon, a Ferrome: a conscious automaton about two metres tall and massive, entirely made of riveted dark iron and dull brass plates, broad shoulders and long strong arms, a round riveted head with two round glass eyes glowing faintly cyan and no human face, worn leather porter straps across its chest, effortlessly lifting a stack of three battered leather travel trunks in one hand, calm and patient posture, old patched metal with soot and a little rust » | 0,5 |
| `kaelis.png` | `ef7753d2` | moyenne 1k, transparent, 2:3 ; `personnage` | « Kaelis, a bone merchant of an underground black market, a gaunt thin man in his fifties with short grey hair and a closely trimmed grey beard, hollow cheeks, a calm knowing closed-lipped smile, a long dark charcoal coat over a dark waistcoat, several necklaces of polished wolf teeth and small bones, holding a large polished rusty iron jaw of an old automaton in one hand and a polishing rag in the other » | 0,5 |
| `veilleuse.png` | `bcc35710` | moyenne 1k, transparent, 2:3 ; `personnage` | « the Rail Watcher, a lean woman in her thirties with dark hair tied back and a tired, distant, dreamy gaze, a worn dark slate-blue railway worker's jacket with brass buttons over a long grey skirt and work boots, a small key covered in soft blue rust hanging on a cord around her neck, holding up a glowing brass railway lamp in one hand » | 0,5 |
| `noam.png` | `e31c90cc` | moyenne 1k, transparent, 2:3 ; `personnage` | « Noam, the archivist of the Central Archives of an industrial empire, a thin precise man in his fifties, neatly combed dark hair greying at the temples, small round copper-rimmed spectacles, a long dark navy archivist's coat buttoned to the collar with grey sleeve protectors, ink-stained fingers, holding a thick grey register under one arm and a quill pen in the other hand, a reserved, meticulous expression » | 0,5 |
| `hedda.png` | `c1988eb3` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ragna Cendrefer, a blacksmith and weaponsmith of the forge district, a sturdy broad-shouldered woman in her forties with thick curly chestnut-brown hair tied back, a few loose strands, a warm lopsided smile, soot on her cheek, a heavy scorched leather apron over a rust-brown shirt with rolled sleeves, strong bare forearms, leather gloves tucked in her belt, holding a heavy forge hammer » | 0,5 |
| `rika.png` | `16d19a75` | moyenne 1k, transparent, 2:3 ; `personnage` | « Rika Martelroux, a boilermaker of the forge district, a strong woman in her forties with auburn red hair tied up under a faded kerchief, freckles, her bare forearms covered in soot, a patched grey-brown work dress with a heavy leather apron, holding a riveting hammer, a tired but kind face » | 0,5 |
| `varka.png` | `4bd9c61b` | moyenne 1k, transparent, 2:3 ; `personnage` | « Varka, the crew chief of the railway workers of an ash-covered railway yard, a tough wiry woman in her forties, short brown hair, a weathered face, a faded dark-blue stoker's boiler suit with rolled sleeves and a dark work belt, a red neckerchief, hands blackened with coal, a long iron poker in one hand, a stern, protective expression » | 0,5 |
| `joss.png` | `c084a8d5` | moyenne 1k, transparent, 2:3 ; `personnage` | « Joss Brakel, a night switchman of a railway yard, a young man in his late twenties, unkempt sandy-blond hair, dark circles under his anxious eyes, unshaven, a worn dark-blue railway jacket with patched elbows, grease-blackened hands, holding a brass railway lantern close to his chest with a rag, a guilty, sleepless look » | 0,5 |
| `ostrik.png` | `e079585c` | moyenne 1k, transparent, 2:3 ; `personnage` | « Controller Ostrik of the Bureau of Transport, a dry, upright man in his fifties, clean-shaven, thin lips, dark hair slicked back under a light-grey peaked official cap, a long buttoned light-grey uniform coat with a small metal rank badge, holding a wooden clipboard with papers and a pencil, a cold, bureaucratic expression » | 0,5 |
| `sorn.png` | `5294e39b` | moyenne 1k, transparent, 2:3 ; `personnage` | « Sorn, a smuggler boss of the Ash Marches, a hard-faced man in his forties with short black hair and a short black beard, a long ragged ash-grey coat dusted with cinders, a faded ember-orange scarf, dark leather gloves, a heavy belt with a pouch of coins, holding a small ledger, a cool, calculating look » | 0,5 |
| `patrouilleur.png` | `936024d1` | moyenne 1k, transparent, 2:3 ; `personnage` | « a patrol guard of an industrial empire, a heavy-set man in blackened plate armour over a dark uniform, a helmet with a narrow red glass visor raised up to show a hard, suspicious stubbled face, thick leather gloves, a small black notebook in one hand and a short iron baton at his belt » | 0,5 |
| `patrouilleuse-haute.png` | `16c98819` | moyenne 1k, transparent, 2:3 ; `personnage` | « a patrol guard of an industrial empire posted at a forbidden upper funicular, a tall woman in blackened plate armour over a dark uniform, a helmet with its narrow red glass visor lowered over her eyes, a long dark cloak, gloved hands resting on a tall iron halberd, a rigid, impassive stance » | 0,5 |
| `dorna.png` | `e3d6bd72` | moyenne 1k, transparent, 2:3 ; `personnage` | « Dorna Vissard, keeper of a workers' boarding house, a stout, hearty woman in her fifties, greying light-brown hair in a bun, ruddy cheeks, a warm but tired face, sleeves rolled up, a patched brown dress with a large white apron, holding a steaming bowl of thick soup and a ladle » | 0,5 |
| `hesk.png` | `04151cb4` | moyenne 1k, transparent, 2:3 ; `personnage` | « Hesk, a miner of the people who guard the tunnels beneath the forges, a lean woman in her forties, her face and hands powdered with black soot so that her pale grey eyes stand out, short dark hair under a leather miner's cap, dark layered work clothes of heavy cloth and leather, holding up a miner's oil lamp with a warm glow, a calm, guarded expression » | 0,5 |
| `tailleuse.png` | `30dceac0` | moyenne 1k, transparent, 2:3 ; `personnage` | « a crystal cutter of an underground black market, a lean woman in her thirties with short-cropped black hair, hands blackened with soot and stone dust, dark patched clothes with a leather work apron, holding a small steel chisel and a glowing red crystal veined with black, a wary, quiet face » | 0,5 |
| `kerta.png` | `f8b5bd4e` | moyenne 1k, transparent, 2:3 ; `personnage` | « Kerta Orvel, a foundry worker of the lower forges, a tired woman in her mid-forties with dark brown hair tied back, a lined face, her bare forearms marked with old pale healed burn scars, plain coarse grey work clothes and a patched apron, holding an iron water bucket by its handle, a grim, worried expression » | 0,5 |
| `tam.png` | `ce67a206` | moyenne 1k, transparent, 2:3 ; `personnage` | « Tam Orvel, a riveter of the lower forges, a skinny young man of nineteen with short dark hair, pale hollow cheeks, one fist raised near his mouth as if holding back a cough, coarse grey work clothes with rolled sleeves, a simple grey felt mask with three straps hanging loose around his neck, a riveting hammer at his belt, earnest, defiant eyes » | 0,5 |
| `dask.png` | `845187b4` | moyenne 1k, transparent, 2:3 ; `personnage` | « Dask, a technician of the Technical Class of an industrial empire, a lean man in his late thirties with neatly slicked black hair, a clean-shaven narrow face, a cold faint smile, an immaculate light-grey high-collared coat, small blue numbers tattooed on his wrist, holding a sheaf of index cards and a steel-nibbed pen » | 0,5 |
| `guichet-nord.png` | `b7778c81` | moyenne 1k, transparent, 2:3 ; `personnage` | « the ticket clerk of the northern railway line, a middle-aged man with a dark moustache, a dark grey railway uniform jacket, a flat-topped railway cap, a thick knitted off-white wool scarf wound around his neck, cupping his hands to blow warm breath into them against the cold, an indifferent, weary look » | 0,5 |
| `garde-ferros.png` | `ead8c425` | moyenne 1k, transparent, 2:3 ; `personnage` | « a city guard of an industrial empire, a stocky man in his thirties, a dark grey military greatcoat with brass buttons and a leather cross-belt, a low iron helmet with a short brim, short dark hair, holding a tall pike, a stern, bored expression » | 0,5 |
| `aubergiste-bielle.png` | `804b6082` | moyenne 1k, transparent, 2:3 ; `personnage` | « the barkeeper of a workers' boarding house in the forge district, a stocky bald man in his fifties with a thick brown moustache, a dark brown waistcoat over a greyish shirt with rolled sleeves, a stained cream apron, drying a pewter mug with a cloth, a gruff but kind face » | 0,5 |
| `ferrome.png` | `8db7c65b` | moyenne 1k, transparent, 2:3 ; `personnage` | « a reconditioned Ferrome, a conscious worker automaton of human height, its body patched together from mismatched old plates of iron, copper and dark steel held by rows of rivets, a round head with two small glass eyes glowing faintly cyan and no human face, a small blank brass plate riveted on its chest, a coil of cable over one shoulder, slightly stooped and patient » | 0,5 |
| `veilleur-rouille.png` | `a6681ffc` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Rust Watcher, a stern inspector who hunts corrosion, an older man in his sixties with short grey hair and grey stubble, a long dark rust-red inspector's coat buttoned high, leather gloves, a brass magnifying loupe on a short rod in one hand and a steel scraper in the other, suspicious narrow eyes » | 0,5 |
| `archiviste-guichet.png` | `362daa04` | moyenne 1k, transparent, 2:3 ; `personnage` | « a clerk in pale grey, a thin man in his thirties with short neat dark hair, a long pale grey-blue clerk's coat buttoned up, black sleeve protectors, a register book held against his chest and a pen tucked behind his ear, a prim, punctual expression » | 0,5 |
| `cheminot.png` | `3ca83d99` | moyenne 1k, transparent, 2:3 ; `personnage` | « a railway worker woman of an ash-covered railway yard, sturdy, in her thirties, short dark-brown hair under a flat cloth cap, a faded dark-blue work jacket and trousers with copper buttons, a red neckerchief, heavy boots, a long-spouted iron oil can in one hand » | 0,5 |
| `vieux-forgeron.png` | `5c934a71` | moyenne 1k, transparent, 2:3 ; `personnage` | « an old blacksmith of the forge district, in his seventies, bald on top with white hair at the sides and a short white beard, stooped, a heavy scorched leather apron over a brown shirt, leaning on a forge hammer like a cane, wary, haunted eyes » | 0,5 |
| `vendeur-livres.png` | `05e05e98` | moyenne 1k, transparent, 2:3 ; `personnage` | « a seller of untitled books in an underground black market, a hunched man in his sixties with untidy grey hair and grey stubble, a patched brown coat, a stack of old books with worn blank leather bindings held in his arms, a sly, tired look » | 0,5 |
| `mecano.png` | `05e7852b` | moyenne 1k, transparent, 2:3 ; `personnage` | « a spare-parts mechanic woman of an underground black market, in her thirties, dark hair in a short braid, a smear of grease on her cheek, a charcoal-grey work overall with many pockets, a leather tool belt, holding a large wrench and a brass gear, a shrewd half-smile » | 0,5 |
| `horlogere.png` | `f1fcc9fd` | moyenne 1k, transparent, 2:3 ; `personnage` | « a watchmaker woman of the middle manufactories, in her fifties, dark hair pinned up, a jeweller's loupe pushed up on her forehead, a plum-purple waistcoat over a cream blouse, a long dark skirt, holding an open brass pocket watch in her palm, a precise, proud expression » | 0,5 |
| `employe.png` | `6ed90407` | moyenne 1k, transparent, 2:3 ; `personnage` | « an office clerk in light grey of the middle manufactories, a balding man in his forties with a tired, resigned face, a light-grey suit with a high collar and a narrow dark tie, a bundle of stamped forms under one arm » | 0,5 |
| `loup-rouille.png` | `80662cd7` | moyenne 1k, transparent, 1:1 ; `creature` | « a Rust Wolf, a lean wolf-like beast of the barren hills of an industrial land, its coarse fur the colour of old rusted iron with darker streaks, sharp ears, amber eyes, a low prowling stance, mouth closed » | 0,5 |
| `pilleur-cendres.png` | `a7f8ad33` | moyenne 1k, transparent, 2:3 ; `personnage` | « a raider of the Ash Marches, a wiry man in a long ragged ash-grey hooded coat dusted with cinders, a dark cloth mask over the lower half of his face, a heavy iron crowbar in one hand, an empty sack over his shoulder, a crouched, wary stance » | 0,5 |
| `arbaletrier-cendres.png` | `d6d309e8` | moyenne 1k, transparent, 2:3 ; `personnage` | « a crossbowman of the Ash Marches, a lean man in a hooded ash-grey coat over dark leather armour, a dark cloth mask over his lower face, a heavy iron-and-wood crossbow resting on his shoulder, a quiver of bolts at his hip, watchful » | 0,5 |
| `rebouteuse-cendres.png` | `73c7db0c` | moyenne 1k, transparent, 2:3 ; `personnage` | « a bonesetter healer of the Ash Marches, a weathered woman in her fifties with grey-streaked brown hair tied back, a patched ash-grey coat with rolled sleeves, a leather satchel of balms at her side, holding a roll of bandage and a small jar of green balm, a grim, tired face » | 0,5 |
| `pilote-v1-fumee.png` (écartée) | `8e4b4a24` | moyenne 1k, transparent, 1:1 | « a driverless machine: a squat, heavy automaton locomotive with no cabin and no seat, a low riveted iron body on four railway wheels, two round blue crystals pulsing softly at the front like eyes, a small blank copper plate on its side, steam pipes and pistons, soot and rust, ancient but repaired » : sortie avec une cheminée qui fume | 0,5 |
| `pilote.png` (reprise) | `2b02b561` | idem ; `objet`, `maxWidth` 58 | « a driverless crystal-powered machine: a squat, heavy automaton engine with no cabin, no seat and no chimney, a low riveted iron body mounted on four railway wheels, two round blue crystals glowing softly at the front like eyes, a small blank copper plate on its side, exposed gears and pistons, soot and rust, ancient but repaired; no smoke, no steam » | 0,5 |
| `renfoncement-v1-eclaire.png` (écartée) | `524a4e91` | moyenne 1k, transparent, 2:3 | « a recess between two cold foundries: a narrow section of soot-blackened old brick wall with a deep dark arched recess, a loose sheet of rusted iron leaning at the back, a faint warm glow of oil light seeping from below, no sign » : sortie entre deux façades aux fenêtres éclairées, avec fumée et lanterne | 0,5 |
| `renfoncement.png` (reprise) | `b0ac966e` | idem ; `batiment` | « a recess in a soot-blackened old brick wall between two cold, dead foundries: a narrow section of dark brick wall with a deep, dark, empty arched recess, a loose sheet of rusted iron leaning at the back of the recess, no windows, no lights, no lamp, no smoke, no sign, abandoned and anonymous » | 0,5 |
| `butoir-v1-rails.png` (écartée) | `f8a57d83` | moyenne 1k, transparent, 1:1 | « a railway buffer stop at the end of a track: a heavy low block of dark red painted iron beams with two round iron buffers on the front and a faded yellow stripe, rust and soot » : sortie posée sur un bout de voie, dans le mauvais sens pour la carte | 0,5 |
| `butoir.png` (reprise) | `55aeca7b` | idem ; `meuble` | « a railway buffer stop: a heavy low block of dark red painted iron beams with two round iron buffers on the front and a faded yellow stripe, rust and soot, standing alone with no rails and no track » | 0,5 |
| `portrait-boulon.png` | `024205c7` | haute 1k, opaque, 1:1, le personnage en pied en référence (`9a89ac8d`) | « the same automaton as in the reference image, Boulon, a Ferrome porter of the western railway station, same riveted head and body, same dark iron and dull brass plates, same leather porter straps, no human face, its round glass eyes glowing softly cyan, a calm, gentle, patient presence that remembers every traveller » | 1,5 |
| `portrait-noam.png` | `ba398123` | haute 1k, opaque, 1:1, le personnage en pied en référence (`e31c90cc`) | « the same man as in the reference image, Noam, archivist of the Central Archives, same face, same hair, same clothes, adjusting his small round copper-rimmed spectacles with ink-stained fingers, a meticulous, reserved gaze with a faint hint of apology » | 1,5 |
| `portrait-veilleuse.png` | `4b52892b` | haute 1k, opaque, 1:1, le personnage en pied en référence (`bcc35710`) | « the same woman as in the reference image, the Rail Watcher who guards the old railway line, same face, same hair, same clothes, the small key covered in soft blue rust on a cord at her neck, a distant, dreamy gaze as if listening to a far-off train, a quiet lifelong sorrow » | 1,5 |
| `portrait-varka.png` | `4f2c4d83` | haute 1k, opaque, 1:1, le personnage en pied en référence (`4bd9c61b`) | « the same woman as in the reference image, Varka, crew chief of the railway workers, same face, same hair, same clothes, coal on her hands and cheek, a hard, weathered, protective gaze, tired but unbending (lumière : « warm brazier and lantern light ») » | 1,5 |
| `portrait-joss.png` | `824c5a7b` | haute 1k, opaque, 1:1, le personnage en pied en référence (`c084a8d5`) | « the same young man as in the reference image, Joss Brakel, night switchman, same face, same hair, same cap, same clothes, holding his brass railway lantern close, dark circles under his eyes, an anxious, guilty, sleepless look, avoiding the viewer's eyes » | 1,5 |
| `portrait-kaelis.png` | `366e9c60` | haute 1k, opaque, 1:1, le personnage en pied en référence (`ef7753d2`) | « the same man as in the reference image, Kaelis, bone merchant of the Ash Marches, same face, same hair, same beard, same clothes and necklaces of polished wolf teeth, a calm, closed-lipped knowing smile, heavy-lidded appraising eyes (lumière : « a warm oil lamp ») » | 1,5 |
| `portrait-hedda.png` | `6c3a720f` | haute 1k, opaque, 1:1, le personnage en pied en référence (`c1988eb3`) | « the same woman as in the reference image, Ragna Cendrefer, blacksmith of the Cendrefer workshop, same face, same curly hair, same clothes and leather apron, soot on her cheek, a warm lopsided smile, frank, steady eyes (lumière : « warm forge and lantern light ») » | 1,5 |
| `portrait-kerta.png` | `36ba512b` | haute 1k, opaque, 1:1, le personnage en pied en référence (`f8b5bd4e`) | « the same woman as in the reference image, Kerta Orvel, foundry worker waiting in line at the workers' well, same face, same hair, same clothes, old healed burn scars on her forearms, deep lines of fatigue, a grim, worried, unyielding gaze of a mother afraid for her son » | 1,5 |
| `portrait-tam.png` | `52f24838` | haute 1k, opaque, 1:1, le personnage en pied en référence (`ce67a206`) | « the same young man as in the reference image, Tam Orvel, riveter of the lower forges, same face, same hair, same clothes, the grey felt mask hanging at his chest, pale and hollow-cheeked, an earnest, defiant look and a faint smile despite his cough » | 1,5 |
| `marche-cheminote/s.png` | `fe7906d8` | moyenne 1k, transparent, 21:9, `cheminot.png` en référence (`3ca83d99`) | tenue « a sturdy railway worker woman, short dark-brown hair under a flat cloth cap, faded dark-blue work jacket and trousers with copper buttons, red neckerchief, heavy boots, a long-spouted iron oil can in one hand, same face, same proportions and colors » ; « walking straight toward the viewer, front view » ; « legs, arms and jacket moving » | 0,5 |
| `marche-cheminote/se.png` | `f1fe8310` | moyenne 1k, transparent, 21:9, `cheminot.png` en référence (`3ca83d99`) | tenue « a sturdy railway worker woman, short dark-brown hair under a flat cloth cap, faded dark-blue work jacket and trousers with copper buttons, red neckerchief, heavy boots, a long-spouted iron oil can in one hand, same face, same proportions and colors » ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and jacket moving » | 0,5 |
| `marche-cheminote/e.png` | `1421e3f8` | moyenne 1k, transparent, 21:9, `cheminot.png` en référence (`3ca83d99`) | tenue « a sturdy railway worker woman, short dark-brown hair under a flat cloth cap, faded dark-blue work jacket and trousers with copper buttons, red neckerchief, heavy boots, a long-spouted iron oil can in one hand, same face, same proportions and colors » ; « walking to the right, side profile view facing right » ; « legs, arms and jacket moving » | 0,5 |
| `marche-cheminote/ne.png` | `38373a79` | moyenne 1k, transparent, 21:9, `cheminot.png` en référence (`3ca83d99`) | tenue « a sturdy railway worker woman, short dark-brown hair under a flat cloth cap, faded dark-blue work jacket and trousers with copper buttons, red neckerchief, heavy boots, a long-spouted iron oil can in one hand, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and jacket moving » | 0,5 |
| `marche-cheminote/n.png` | `3922e2dc` | moyenne 1k, transparent, 21:9, `cheminot.png` en référence (`3ca83d99`) | tenue « a sturdy railway worker woman, short dark-brown hair under a flat cloth cap, faded dark-blue work jacket and trousers with copper buttons, red neckerchief, heavy boots, a long-spouted iron oil can in one hand, same face, same proportions and colors » ; « walking straight away from the viewer, back view » ; « legs, arms and jacket moving » | 0,5 |
| `marche-employe-gris-clair/s.png` | `cff44f48` | moyenne 1k, transparent, 21:9, `archiviste-guichet.png` en référence | tenue de l'employé (ligne `ne`) ; « walking straight toward the viewer, front view » ; « legs, arms and long coat moving » | 0,5 |
| `marche-employe-gris-clair/se.png` | `ba9a9ccb` | moyenne 1k, transparent, 21:9, `archiviste-guichet.png` en référence | tenue de l'employé (ligne `ne`) ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and long coat moving » | 0,5 |
| `marche-employe-gris-clair/e.png` | `888f99ce` | moyenne 1k, transparent, 21:9, `archiviste-guichet.png` en référence | tenue de l'employé (ligne `ne`) ; « walking to the right, side profile view facing right » ; « legs, arms and long coat moving » | 0,5 |
| `marche-employe-gris-clair-ne-v1-voile.png` (écartée) | `cab1c2cc` | moyenne 1k, transparent, 21:9, `archiviste-guichet.png` en référence (`362daa04`) | tenue « a thin clerk with short neat dark hair, a long pale grey-blue clerk's coat buttoned up, black sleeve protectors, a register book held against his chest, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and long coat moving » : sortie avec un voile clair semi-transparent sur 55 % de l'image | 0,5 |
| `marche-employe-gris-clair/ne.png` (reprise) | `37f1be78` | idem | idem, avec « on a fully transparent background with no haze and no glow » | 0,5 |
| `marche-employe-gris-clair/n.png` | `0f2c8716` | moyenne 1k, transparent, 21:9, `archiviste-guichet.png` en référence | tenue de l'employé (ligne `ne`) ; « walking straight away from the viewer, back view » ; « legs, arms and long coat moving » | 0,5 |
| `ironheart-arrivee.png` | `fecb3abf` | haute 2k, opaque, 16:9 | « The arrival by train at the western railway station of a vast smog-choked industrial capital, at dawn. In the foreground, a soot-blackened platform under a riveted iron-and-glass station roof, a steam train exhaling white vapour, a few small tired travellers and workers in grey cloth with their trunks, and a tall riveted automaton porter. Beyond, the city climbs a valley side in three tiers: below, the forge district of brick workshops and corrugated iron roofs linked by narrow footbridges, countless chimneys breathing smoke under a sky that looks rusted, warm orange forge glows and red crystal street lamps piercing the persistent industrial fog; above, a middle tier of grey stone and wrought iron with an elevated steam tramway and a steam funicular climbing the slope; the highest tier almost lost in the haze. The lower third is darker, calm shadow, leaving room for a dialogue panel. » | 2,75 |
| `fond-ironheart.png` | `37f91928` | haute 1k, opaque, 16:9 | « Painted backdrop for the empty edges around an isometric game map: a sea of thick industrial fog and smoke seen from very high above, a dark rust-tinted haze where only the tops of a few brick chimneys and smokestacks break through, their smoke trails drifting, faint warm orange forge glows shining through the murk; no buildings or figures in the center, no focal subject, soft and slightly blurred, darker toward the edges. » | 1,5 |
| **Total** | | | **83 images** (79 prévues + 4 reprises) | **53,75** |

**Bilan** :
- **Reprises (2 crédits, 4 images, chacune une fois)** : la direction `ne` de l'employé en gris clair (un voile clair
  semi-transparent couvrait 55 % de l'image : fond non transparent) ; la machine sans homme (une cheminée qui fumait,
  alors que la Veilleuse dit « pas de vapeur, juste un cliquetis de cristal » : la faute venait de mon prompt, « steam
  pipes ») ; le renfoncement (deux façades aux fenêtres éclairées, une fumée et une lanterne, contre « entre deux
  fonderies éteintes… un mur noirci de suie, et rien d'autre, en apparence ») ; le butoir (peint sur un bout de voie
  orienté à l'inverse des rails de la carte). Les versions écartées restent dans `assets/raw/ironheart/`.
- **Sortes corrigées** (le calcul automatique les donnait « personnage » ou « décor ») : `renfoncement` est un pan de mur
  noirci et sa niche (`batiment`, il sert aussi au tunnel du triage) ; `pilote`, la machine sans homme (`objet`) ;
  `forge-eteinte`, la forge froide (`batiment`) ; `guichet-nord`, le guichetier de la ligne du Nord (`personnage`) ;
  `echo-forge`, un Écho (`echo`, translucide) ; `ferraille`, Quatre-dix-sept rangé sous les tôles, sa main qui dépasse
  (`meuble`) ; `mur-brique`, une texture de mur (`kind: "wall"`) ; Boulon, `colosse` ; le Ferrôme reconditionné,
  `personnage` ; les trois humains des Marches, `personnage` (2:3), le Loup de Rouille, `creature`.
- **Tuiles partagées** : `cheminot` sert à deux cheminots et deux cheminotes ; peinte en femme (la planche de marche est
  celle d'« une cheminote »), casquette et cheveux courts, elle se lit pour les deux à 54 px (à séparer si Cyril le
  veut). `archiviste-guichet` sert à l'employé en gris clair des Manufactures et au Chroniqueur de Sept-Portes : un
  commis sans signe propre à Ferros. `monte-charge` sert aux trois funiculaires ; sa cabine montre trois passagers
  minuscules (on ne monte pas aux Manufactures-Hautes : à 64 px, cela se voit à peine). `maison-brique` fait aussi
  l'enceinte des Forges et des Manufactures, `tas-cendres` celle de la galerie et de la Cendrière, `mur-brique` celle du
  Marché, du triage et des intérieurs.
- `garde-ferros` et `aubergiste-bielle` sont dans le lot, mais aucun PNJ ni passant ne s'en sert aujourd'hui (Dorna a
  sa tuile) : peints quand même (1 crédit).
- **L'illustration** est sur `src/data/dialogues/boulon.json`, nœud `accueil-quete` (« Bienvenue à Ironheart. Je
  m'appelle Boulon. ») : le premier accueil du héros, à la gare de l'Ouest des Forges-Basses, où l'on arrive (`entree`,
  Boulon à deux cases). Le nœud `accueil` (« Bonjour. Boulon, porteur de la gare de l'Ouest », si l'on vient sans la
  quête de l'audience) ne l'a pas.
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : Boulon (deux mètres, fer
  sombre et laiton rivetés, tête ronde aux deux yeux de verre cyan, sangles de porteur, trois malles d'une main, un
  cristal cyan et une petite cheminée dans le dos) ; Kaelis (maigre, la cinquantaine, cheveux et barbe gris, manteau
  anthracite, colliers de dents de loup, une mâchoire de fer rouillé d'automate) ; la Veilleuse (la trentaine, veste de
  cheminot bleu ardoise, jupe grise, lampe de laiton, clé à rouille bleue au cou) ; Noam (la cinquantaine, lunettes
  rondes cerclées de cuivre, long manteau bleu nuit boutonné, manchettes grises, registre et plume) ; Ragna (la
  quarantaine, robuste, cheveux châtains bouclés comme son frère Tobias, tablier de cuir roussi, marteau de forge) ;
  Rika (rousse et tachée de son comme Brann, foulard, avant-bras noirs de suie) ; Varka (bleu de chauffe, foulard rouge,
  tisonnier) ; Joss (blond, cernes, casquette, lanterne) ; Ostrik (gris clair, casquette d'uniforme, planchette) ; Sorn
  (barbe noire, manteau de cendre, écharpe couleur braise) ; le patrouilleur (armure noircie, visière rouge relevée,
  carnet noir) et la patrouilleuse (visière baissée, cape, hallebarde) ; Dorna (la cinquantaine, chignon, tablier
  blanc, bol de soupe) ; Hesk (visage poudré de suie, yeux gris pâle, casquette de mineur, lampe à huile) ; la tailleuse
  (cheveux noirs courts, mains noires, cristal rouge veiné de noir, burin) ; Kerta (gris, vieilles brûlures aux
  avant-bras, seau de fer) ; Tam (maigre, poing devant la bouche, masque de feutre pendu au cou) ; Dask (gris clair, col
  haut, chiffres bleus au poignet, fiches) ; le guichetier du Nord (moustache, casquette, écharpe de laine, il souffle
  dans ses mains) ; les passants (le Veilleur de Rouille en long manteau rouille, loupe et grattoir ; le Ferrôme
  reconditionné aux plaques dépareillées, plaque vierge sur la poitrine ; la mécanicienne, l'horlogère, le marchand de
  livres sans titre, le vieux forgeron appuyé sur son marteau) ; les Marches (manteaux de cendre, masques de tissu sur le
  bas du visage) ; le Loup de Rouille (pelage de vieux fer). Décors : réverbères à cristal rouge (comme le dessin
  provisoire), Archives de pierre grise au fronton nu coiffées de lanternes à cristaux cyan, funiculaire à roue de
  cuivre, Puits Trois à pompe de fonte, machine sans homme à cristaux bleus (devant et dessus), enclume aux cinq mains
  gravées luisant de cyan. L'illustration : la gare de l'Ouest sous une verrière à l'aube, un Ferrôme porteur doré (pas
  Boulon), la ville en trois étages (les Forges, les Manufactures avec un tramway surélevé et le funiculaire, les Hautes
  dans la brume), des bannières rouges sans signe, des cristaux violets sur les hauteurs.
- **Vu au passage** : `ouvrier`, le passant le plus vu d'Ironheart (six passants, dont la marchande de cristaux et
  l'horloger), n'est dans aucun lot : il reste dessiné par le code. La Cendrière est rattachée au fond « souterrain »
  (`src/data/fonds.json`), pas encore peint : la console signale `fond-souterrain` absent. Les pavés cendrés du triage
  sont nettement plus clairs que ceux des Forges (la cendre). Dans le jeu (Chromium) : les sept lieux d'Ironheart et la
  Pension, l'accueil de Boulon avec l'illustration et son portrait, Kaelis et Varka avec le leur, les deux marcheurs, un
  combat contre les trois des Marches et un Loup de Rouille ; aucune autre erreur ; typecheck et 1079 tests passent.

## Lot Sept-Portes (2026-11-08, 41 images, 26,75 crédits, solde 1 991,11)

Le troisième lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots »). Le
solde est celui du compte après le lot (2 023,86 avant) ; un autre lot tournait en même temps sur le même compte : les
26,75 crédits sont comptés tâche par tâche (tableau) ; prévu 26,25 (40 images), plus 0,5 de reprise (1 image), plafond
33. Outil : Higgsfield MCP, `gpt_image_2_6`, six tâches en cours au plus. Bruts : `assets/raw/sept-portes/` (local) ;
tailles et préréglages : `scripts/art/sept-portes.json` ; traités par `npm run art`, `npm run tiles`, `npm run lots`.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf le sol et les planches de marche), et « No text, no letters, no
  logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à la fin de tous.
- **Personnages** : « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body
  character, three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She
  stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » ; **décors** : de même
  avec « single object centered, isolated on a transparent background: <sujet>. Simple readable shape for a small game
  sprite. It stands directly on the bottom of the image… ».
- **Sol** (la mosaïque) : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable
  shapes. Seamless tileable ground texture, flat top-down orthographic view looking straight down from above, filling
  the entire square edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no
  light spot, no cast shadows, no perspective, no horizon. No objects. »
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: the same <man/woman> as in the reference
  image, <sujet>, same face, same hair, same clothes, lit by warm lantern light from the upper left with cool shadow on
  the other side. Plain uniform dark ink background color #1B1512. »
- **Planches de marche** : « Sprite sheet for a 2D isometric game, on a transparent background: the same character as in
  the reference image (<tenue>), full body, seen from slightly above at a 30 degree angle, <direction>. Exactly 6 frames
  of a smooth walking cycle side by side in one single horizontal row, evenly spaced, every frame the same size and the
  same scale, feet on the same baseline, the character identical in every frame except the legs, arms and <robe/coat>
  moving with the steps. No ground, no shadow, no grid lines, no frame borders. » ; les directions comme au lot Canopéa.
- **Illustration** : le bloc commun, puis le sujet du tableau (qui finit par la phrase du tiers bas sombre).
- **Fond** : « Painted backdrop for the empty edges around an isometric game map: <sujet>; no buildings or figures in
  the center, no focal subject, soft and slightly blurred, darker toward the edges. »

| Fichier (`assets/raw/sept-portes/`) | Tâche | Réglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `edda.png` | `6e00ff9e` | moyenne 1k, transparent, 2:3 | « a woman of about forty, a broker from an industrial nation, slender and upright, pale skin, black hair pinned up in a neat low knot with a few loose strands, a composed, guarded, tired face with shadows under her dark eyes, a long well-cut mid-grey wool travelling coat buttoned high, a grey scarf at her throat, fine thin dark grey leather gloves, dark trousers and worn dark boots, gloved hands empty at her sides, holding nothing » | 0,5 |
| `ambroise.png` | `32b242aa` | moyenne 1k, transparent, 2:3 | « Ambroise Encrelune, the Curator of a great library, a lean dignified man in his sixties with short silver-white hair combed back, a clean-shaven lined face, dry, attentive, precise eyes, a long ink-black scholar's robe with a high collar, wide sleeves and thin dull gold trim, ink-stained fingers, a small iron key hanging on a cord around his neck, a heavy leather-bound register held under one arm and a quill pen in his other hand » | 0,5 |
| `lior.png` | `44361375` | moyenne 1k, transparent, 2:3 | « Lior Rose-des-Vents, a cartographer, a thin wiry man in his forties with untidy auburn-brown hair and short stubble, a narrow thoughtful face, curious searching eyes, a long slate-blue coat with many pockets over a cream shirt, a brass compass hanging on a chain around his neck, a rolled map held under one arm » | 0,5 |
| `pelerin.png` | `4fc33f14` | moyenne 1k, transparent, 2:3 | « a pilgrim come early for a festival of remembrance, a man in his fifties with greying brown hair and a weathered patient face, a long dusty undyed brown travelling robe with the hood lowered on his shoulders, a simple cord belt, a tall plain wooden walking staff in his right hand, a small cloth bundle slung on his back, worn leather sandals » | 0,5 |
| `guide.png` | `d17d21b2` | moyenne 1k, transparent, 2:3 | « a guide for pilgrims, a lively wiry man in his thirties with short straw-blond hair, a cheerful hoarse-voiced face, a short teal-blue coat over a cream shirt, a leather satchel at his hip, holding up a short wooden stick with a small plain red pennant to gather his group » | 0,5 |
| `josse.png` | `9ed55408` | moyenne 1k, transparent, 2:3 | « Olmo Sept-Routes, the innkeeper of an inn at the crossroads of the world, a round, stout, jovial man in his fifties, a sun-browned weathered face with a broad warm smile and crinkled laughing eyes, short dark brown hair and a short beard, a scarf striped in six faded colours knotted at his neck, a linen shirt with rolled sleeves, a brown leather apron over his round belly, a dishcloth over one shoulder, sturdy boots » | 0,5 |
| `arlo.png` | `557a1a83` | moyenne 1k, transparent, 2:3 | « Arlo, a boy of nine, almost white pale blond hair, light olive-brown skin, bright curious eyes, a simple sea-blue tunic over grey trousers, soft leather shoes, rocking from one foot to the other, simple child's clothes » | 0,5 |
| `mina.png` | `a5376a57` | moyenne 1k, transparent, 2:3 | « Mina, a girl of nine, Arlo's twin sister, almost white pale blond hair in two short braids, light olive-brown skin, a serious, mischievous look, a simple pale blue tunic dress over grey leggings, soft leather shoes, simple child's clothes » | 0,5 |
| `greffiere.png` | `05a0a88e` | moyenne 1k, transparent, 2:3 | « the clerk of a council of seven nations, a composed woman in her fifties, dark brown hair streaked with grey in a tight low bun, a calm unreadable face, a long pearl-grey high-collared robe, a slim silver quill pen in one hand, a long narrow ledger held against her side » | 0,5 |
| `portier-nuit.png` | `e89b6033` | moyenne 1k, transparent, 2:3 | « the night porter of a great library, a tall gaunt man in his fifties with greying dark hair and grey stubble, tired melancholic eyes, a long dark navy-blue coat buttoned up, a ring of heavy iron keys at his belt, holding a small shuttered dark lantern that lets out a narrow beam of warm light » | 0,5 |
| `marchande-nations.png` (écarté) | `af2a88c0` | moyenne 1k, transparent, 2:3 | « a merchant of a market of all nations, a shrewd woman in her forties with brown skin and black hair wrapped in a patterned headscarf, a sly knowing smile, layered clothes of fabrics from many lands: a plum-coloured vest, a saffron sash, a striped shawl, several bracelets, a belt hung with little pouches and small stoppered vials, a small glowing crystal held up between two fingers » | 0,5 |
| `eprouveur.png` | `a69cad79` | moyenne 1k, transparent, 2:3 | « a Tester of the Ring, a lean calm man in his forties with short dark hair, an impassive weathered face that no longer flinches, a plain off-white close-fitting uniform tunic and trousers, a white armband on his left arm, a small notebook tucked in his belt, bare fists loosely clenched at his sides » | 0,5 |
| `portrait-edda.png` | `e46c8dd0` | haute 1k, opaque, 1:1, `edda.png` (`6e00ff9e`) en référence | « the lady in grey, a broker from an industrial nation, a composed, guarded half-smile that does not reach her eyes, a cool unreadable gaze hiding a deep weariness » | 1,5 |
| `portrait-ambroise.png` | `b4ae66b0` | haute 1k, opaque, 1:1, `ambroise.png` (`32b242aa`) en référence | « Ambroise Encrelune, the Curator of the Great Library, the small iron key on a cord at his neck, a dry, precise, faintly ironic look, a scholar who records and never searches » | 1,5 |
| `portrait-lior.png` | `99e31429` | haute 1k, opaque, 1:1, `lior.png` (`44361375`) en référence | « Lior Rose-des-Vents, the cartographer, the brass compass at his neck, a curious, wry half-smile and searching eyes » | 1,5 |
| `marche-pelerin-souvenir/s.png` | `b59d2885` | moyenne 1k, transparent, 21:9, `pelerin.png` (`4fc33f14`) en référence | « vers le spectateur ; tenue : a man in his fifties with greying brown hair, a long dusty undyed brown hooded robe with the hood lowered, a cord belt, a small cloth bundle slung on his back, worn leather sandals, a tall plain wooden walking staff in his right hand, same face, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-pelerin-souvenir/se.png` | `7a9a2ca8` | moyenne 1k, transparent, 21:9, `pelerin.png` (`4fc33f14`) en référence | « bas-droite, trois quarts face ; tenue : a man in his fifties with greying brown hair, a long dusty undyed brown hooded robe with the hood lowered, a cord belt, a small cloth bundle slung on his back, worn leather sandals, a tall plain wooden walking staff in his right hand, same face, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-pelerin-souvenir/e.png` | `fc0bcb6f` | moyenne 1k, transparent, 21:9, `pelerin.png` (`4fc33f14`) en référence | « profil vers la droite ; tenue : a man in his fifties with greying brown hair, a long dusty undyed brown hooded robe with the hood lowered, a cord belt, a small cloth bundle slung on his back, worn leather sandals, a tall plain wooden walking staff in his right hand, same face, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-pelerin-souvenir/ne.png` | `130d9251` | moyenne 1k, transparent, 21:9, `pelerin.png` (`4fc33f14`) en référence | « haut-droite, trois quarts dos ; tenue : a man in his fifties with greying brown hair, a long dusty undyed brown hooded robe with the hood lowered, a cord belt, a small cloth bundle slung on his back, worn leather sandals, a tall plain wooden walking staff in his right hand, same face, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-pelerin-souvenir/n.png` | `991d84dc` | moyenne 1k, transparent, 21:9, `pelerin.png` (`4fc33f14`) en référence | « de dos ; tenue : a man in his fifties with greying brown hair, a long dusty undyed brown hooded robe with the hood lowered, a cord belt, a small cloth bundle slung on his back, worn leather sandals, a tall plain wooden walking staff in his right hand, same face, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-guide/s.png` | `f80fb462` | moyenne 1k, transparent, 21:9, `guide.png` (`d17d21b2`) en référence | « vers le spectateur ; tenue : a wiry man with short straw-blond hair, a short teal-blue coat over a cream shirt, a red neckerchief, brown trousers and brown boots, a leather satchel and a small lantern at his hip, holding up a short wooden stick with a small plain red pennant, same face, same proportions and colors ; « legs, arms and coat moving » » | 0,5 |
| `voyageuse-zephyria.png` | `723c0f63` | moyenne 1k, transparent, 2:3 | « a traveller from a nation of sky cities, a woman in her thirties with wind-tousled pale blond hair, a fair wind-burnt face, a fitted pale sky-blue travelling jacket with brass buttons, a long white scarf fluttering in the wind, grey trousers tucked into tall soft boots, flight goggles pushed up on her forehead, a small leather travel bag at her hip » | 0,5 |
| `marin-marisol.png` | `00b3e3aa` | moyenne 1k, transparent, 2:3 | « a sailor from a sea nation, a broad-shouldered man in his thirties with dark brown skin, short black curly hair and a short beard, a deep navy-blue sailor's jacket over a cream striped shirt, wide trousers rolled at the calves, a few seashells held in one open hand » | 0,5 |
| `nomade-sables.png` | `879abe68` | moyenne 1k, transparent, 2:3 | « a woman of the desert nomads, in her thirties, dark sun-weathered skin, black hair tied back under a loose sand-coloured hood, wary eyes, a long layered sand-coloured travelling coat with a rust-red sash, a scarf wound loosely around her neck, dusty worn leather boots » | 0,5 |
| `marche-guide/se.png` | `cb23e4df` | moyenne 1k, transparent, 21:9, `guide.png` (`d17d21b2`) en référence | « bas-droite, trois quarts face ; tenue : a wiry man with short straw-blond hair, a short teal-blue coat over a cream shirt, a red neckerchief, brown trousers and brown boots, a leather satchel and a small lantern at his hip, holding up a short wooden stick with a small plain red pennant, same face, same proportions and colors ; « legs, arms and coat moving » » | 0,5 |
| `marche-guide/e.png` | `20c2c766` | moyenne 1k, transparent, 21:9, `guide.png` (`d17d21b2`) en référence | « profil vers la droite ; tenue : a wiry man with short straw-blond hair, a short teal-blue coat over a cream shirt, a red neckerchief, brown trousers and brown boots, a leather satchel and a small lantern at his hip, holding up a short wooden stick with a small plain red pennant, same face, same proportions and colors ; « legs, arms and coat moving » » | 0,5 |
| `marche-guide/ne.png` | `016c74a9` | moyenne 1k, transparent, 21:9, `guide.png` (`d17d21b2`) en référence | « haut-droite, trois quarts dos ; tenue : a wiry man with short straw-blond hair, a short teal-blue coat over a cream shirt, a red neckerchief, brown trousers and brown boots, a leather satchel and a small lantern at his hip, holding up a short wooden stick with a small plain red pennant, same face, same proportions and colors ; « legs, arms and coat moving » » | 0,5 |
| `marche-guide/n.png` | `7aba2848` | moyenne 1k, transparent, 21:9, `guide.png` (`d17d21b2`) en référence | « de dos ; tenue : a wiry man with short straw-blond hair, a short teal-blue coat over a cream shirt, a red neckerchief, brown trousers and brown boots, a leather satchel and a small lantern at his hip, holding up a short wooden stick with a small plain red pennant, same face, same proportions and colors ; « legs, arms and coat moving » » | 0,5 |
| `glacien.png` | `f4102be3` | moyenne 1k, transparent, 2:3 | « a man of the frozen north in his sixties, pale weathered skin reddened by the cold, white hair and a short white-streaked beard, a long heavy padded slate-blue wool coat with a thick pale fur collar and fur cuffs, a grey knitted scarf, fur-lined boots, gloved hands » | 0,5 |
| `changeur.png` | `42c0f193` | moyenne 1k, transparent, 2:3 | « a money changer, a sharp-eyed man in his fifties with neatly combed black hair and a thin moustache, a long plum-coloured coat with dull gold buttons, a small brass pair of balance scales hanging from his belt next to several coin purses, weighing a few coins in his open palm » | 0,5 |
| `fruitiere.png` | `a8644829` | moyenne 1k, transparent, 2:3 | « a fruit seller of a market in a great crater, a sturdy woman in her forties with dark brown skin and black hair tied up in a cloth, a practical earth-brown dress with rolled sleeves and a cream apron, a wide shallow wicker basket of pears, dates and pale frosted apples held on her hip » | 0,5 |
| `chroniqueur.png` | `35e23a4b` | moyenne 1k, transparent, 2:3 | « a Chronicler of a great library, an austere man in his sixties with thin grey hair, a pale ascetic face, a long ink-black robe with a deep violet stole, a thick ledger under one arm and a pencil in his hand » | 0,5 |
| `etudiante.png` | `8a52b1cb` | moyenne 1k, transparent, 2:3 | « a young woman student of a great library, about twenty, auburn hair in a loose braid, a pale studious face with a small ink smudge on her cheek, a dark plum-violet scholar's robe over a cream blouse, a satchel strap across her chest, a book held against her chest » | 0,5 |
| `marchande-nations-v2.png` | `d98622a1` | moyenne 1k, transparent, 2:3 | « a shrewd market trader of a market of all nations, a woman in her forties with brown skin and black hair in a thick practical braid, a sly knowing smile, a long patchwork coat sewn from panels of plain fabrics from many different lands (plum, saffron, teal, rust), a leather belt hung with little pouches and small stoppered vials, sturdy boots, no jewellery, no headscarf, a small glowing crystal held up between two fingers » | 0,5 |
| `porte-nexus.png` | `ffd9f7a1` | moyenne 1k, transparent, 2:3 | « one of the Seven Gates of a city at the centre of the world, a tall permanent portal: a monumental pointed archway of pale weathered sandstone blocks with worn carved geometric bands, the opening inside the arch filled with a shimmering translucent veil of pale cyan-green light like standing water, a small copper keystone at the top » | 0,5 |
| `dome.png` | `7618b857` | moyenne 1k, transparent, 2:3 | « a small domed building of pale cream stone: a squat square base with a low dark arched wooden door, a broad copper band running around it, topped by a smooth round stone dome with a small copper finial, a few weathering stains » | 0,5 |
| `stele.png` | `3bc1646b` | moyenne 1k, transparent, 2:3 | « a tall upright stele of pale weathered stone with a rounded top, its face carved with many neat rows of tiny abstract notches and dashes like a long list, moss in the cracks of its base » | 0,5 |
| `lutrin.png` | `32c28233` | moyenne 1k, transparent, 2:3 | « a tall reading lectern of dark carved wood on a single sturdy column and a cross-shaped foot, a very large old book lying open on its slanted top, cream parchment pages with faint illegible lines, a thin ribbon bookmark hanging down » | 0,5 |
| `mosaique.png` | `1a7a4483` | moyenne 1k, opaque, 1:1, vue de dessus | « an old mosaic pavement of small square tesserae, cream and pale sand with scattered faded ochre and copper-brown tesserae, crossed by thin straight bands of darker copper-brown tesserae, worn smooth by countless feet, a few chipped tesserae » | 0,5 |
| `sept-portes-arrivee.png` | `1bca8b0c` | haute 2k, opaque, 16:9 | « The arrival in a great walled city at the exact centre of the world, at dusk: seen from just in front of the tall stone archway gate the traveller has come through, a vast square paved with pale worn stone and a faded mosaic of seven rays at its centre; across the square, six other monumental stone archway gates stand in a row in the far city wall, each filled with a faint veil of light of a different soft colour; around the square, tall old houses of many different styles (brick, pale stone domes, timber on stilts) with warm lit windows, market stalls under awnings, street lamps, and small figures of travellers from many lands; beyond the roofs, the massive silhouette of a great library with a long colonnaded facade and a dark green copper dome; a violet dusk sky with the first stars. Small figures only, no one in the foreground. The lower third is darker, calm shadow, leaving room for a dialogue panel. » | 2,75 |
| `fond-sept-portes.png` | `5657b4f0` | haute 1k, opaque, 16:9 | « the pale stone rooftops of a vast ancient walled city seen from very high above at dusk, a maze of weathered stone and slate roofs, narrow shadowed streets and a few green copper domes dissolving into soft haze toward the center; along the edges, stretches of a great city wall with tall archway gates glowing faintly with pale light; faint warm lamplight in a few windows » | 1,5 |

**Dans le jeu** : 29 tuiles (25 images : une seule pour les cinq tuiles de la dame en gris), 8 portraits (Ambroise,
Lior, et un seul pour les six PNJ de la dame en gris : `edda`, `edda-halte`, `edda-coralia`, `edda-marche`,
`edda-khrysos`, `edda-quai`), les planches de marche du pèlerin de la Fête du Souvenir et du guide des Halles
(`public/sprites/figurant-{pelerin-souvenir,guide}.png`, `src/data/figurants.json`), le fond
`public/fonds/sept-portes.jpg` (la place, le parvis, les Halles Basses), l'illustration
`public/illustrations/sept-portes-arrivee.jpg` sur le premier mot de Hesper à Sept-Portes (`hesper.json`, nœud `appel` :
« Te voilà. Ilyane m'a écrit que tu écoutais bien… »).

**Bilan** :
- **Reprise (1, 0,5 crédit)** : la marchande des nations, sortie avec un foulard à motifs, de grands anneaux d'oreilles
  et des châles superposés, l'image toute faite d'une « diseuse de bonne aventure » qui renvoie à un peuple réel
  (interdit par le brief) : refaite en long manteau cousu d'étoffes de plusieurs pays, une tresse, sans bijoux ni
  foulard. La voyageuse de Zephyria est sortie avec un halo blanc : traitée par `"matte": true`, sans nouvelle image
  (vérifié sur fond gris et dans le jeu).
- **L'illustration** est sur le nœud `appel` de Hesper (son premier mot quand la quête « Les Mémoires du Monde Perdu »
  est active, avant le drapeau `hesper-vue`), pas sur un accueil de la place : à l'arrivée par la Porte du sud, aucun
  PNJ ne reçoit (la place n'a que la marchande des nations, qui vend) ; c'est Hesper qui fait venir le héros
  (`gdd/jalon-4.md` : « on arrive par la Porte du sud, sur la place des Sept Portes. Hesper explique le Registre des
  Mains »), et le fil du journal y envoie d'abord (« Sept-Portes : Hesper Mille-Récits, et la Grande Bibliothèque »). Ce
  nœud ne sert qu'à Sept-Portes (à Gardebois et au quai sept, ses entrées par lieu passent avant).
- **Sortes vérifiées** : `porte-nexus` et `dome` en `batiment` (le dôme sert aussi de maison dans l'enceinte des trois
  quartiers) ; `stele` en `haut`, réduite à la taille du dessin provisoire ; `lutrin` en `meuble` ; `mosaique` en `sol`.
- **Tuiles partagées** (une image par allure, sans détail propre à une seule ville) : la stèle sert aussi au temple
  d'Aetherhaven, à la halte morte, au quai sept, à la statue d'Aldara et au monument des Trois Cents : des marques
  abstraites en colonnes, aucune lettre ; le lutrin sert aussi à Aetherhaven et à Khrysos ; `changeur` sert aussi aux
  deux « marchands de Ferros » d'Aetherhaven et de Coralia : un changeur sans signe de ville (manteau prune, petite
  balance, bourses) ; `etudiante` sert aussi à l'étudiante de l'Académie d'Aetherhaven ; `voyageuse-zephyria` sert aussi
  à la pilote de Zephyria de l'auberge (d'où les lunettes de vol relevées) ; `eprouveur` sert à l'Éprouveur et à
  l'Éprouveuse de la même paire : un homme en uniforme blanc cassé et brassard blanc (à séparer plus tard si Cyril le
  souhaite).
- **Souci, `glacien` défini deux fois** dans `scripts/tiles-def.mjs` (Sept-Portes, l. 1180, et Khrysos, l. 2227) : le
  lot peint la première (`TILES.find`), mais le jeu prend la dernière (`frames[nom]`, `src/engine/tiledMap.ts`). Le
  Glacien de la place, celui des Portes de Khrysos et le Vigile Blanc restent donc dessinés par le code tant que le
  doublon n'est pas réglé (script partagé, non touché ici). L'image est prête et vaut pour les trois (un homme du Nord,
  la soixantaine, manteau rembourré à col de fourrure).
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : la dame en gris (la
  quarantaine, puisqu'elle était enfant il y a trente ans ; peau claire, cheveux noirs en chignon bas, long manteau gris
  boutonné haut, écharpe grise, gants fins gris, mains vides : ni rouleau, ni conque, ni rien de ses scènes, qui ne la
  montrent qu'en manteau gris et gants fins) ; Ambroise (la soixantaine, cheveux blanc d'argent, robe d'encre à liseré
  d'or, clé de fer au cou, registre et plume, comme son texte) ; Olmo (rond, la cinquantaine, barbe courte, foulard à
  six couleurs, tablier de cuir) ; Lior (maigre, la quarantaine, cheveux châtain-roux en bataille, manteau bleu ardoise,
  boussole au cou, rouleau sous le bras, comme son texte) ; Arlo et Mina (neuf ans, cheveux presque blancs comme le dit
  le texte d'Arlo, peau olivâtre : une mère de Marisol, un père de Glacialis) ; la greffière (la cinquantaine, robe gris
  perle, plume d'argent, registre) ; le portier de nuit (grand et maigre, manteau bleu nuit, trousseau de clés, lanterne
  sourde) ; la marchande des nations ; l'Éprouveur ; la voyageuse de Zephyria (veste bleu ciel, écharpe blanche au
  vent) ; le marin de Marisol (peau brune, veste bleu marine, coquillages dans la main) ; la nomade des Sables (capuche et
  manteau couleur sable, ceinture rouille) ; le Glacien ; le pèlerin (robe de bure, bâton, baluchon) ; le changeur ; la
  marchande de fruits (poires, dattes, pommes givrées) ; le guide (veste bleu-vert, fanion rouge du dessin provisoire) ;
  le Chroniqueur (robe d'encre, étole violette, registre, crayon) ; l'étudiante (robe prune, tresse auburn, livre).
  Décors : les Portes en arche de pierre claire, voile de lumière vert-cyan, deux lanternes et deux cristaux en
  pinacles ; le dôme (pierre crème, bandeau de cuivre) ; un petit emblème de cristal et d'engrenage au sommet de la stèle ; une
  lampe à flamme sur le lutrin ; la mosaïque en carreaux crème quadrillés de bandes de cuivre. L'illustration : la place
  au crépuscule vue sous l'arche de la Porte du sud, les six autres Portes au fond, chacune d'une couleur, la Grande
  Bibliothèque à colonnade et dôme de cuivre vert, des maisons de tous les styles, des bannières à rose des vents ; **la
  mosaïque y a huit rayons, pas sept** (le dessin provisoire en voulait sept, aucun texte du jeu ne le dit : gardée ;
  2,75 crédits pour la refaire si Cyril le souhaite). Le fond : les toits et les dômes vus de haut, de la brume au
  centre, deux Portes de l'enceinte allumées aux coins.
- **Vu au passage** : beaucoup de passants portent une petite lanterne à la ceinture (le bloc commun), et le Glacien en
  tient une sans texte qui la lui donne ; le feu n'est pas exclu à Sept-Portes. Sur la place, la mosaïque peinte est
  nettement plus claire que les pavés (comme le dessin provisoire). Dans le jeu (Chromium) : la place, le parvis, les
  Halles Basses, l'auberge (Olmo, la dame en gris), la Bibliothèque (Ambroise, les lutrins), l'échoppe (Lior), la maison
  des jumeaux, le Conseil ; les dialogues de Hesper (avec l'illustration), de la dame en gris, d'Ambroise et de Lior,
  avec leur portrait ; les deux marcheurs ; aucune erreur ; typecheck et 1079 tests passent.

## Décision du 2026-11-08 (Cyril) : la mise en beauté, portraits pour les importants seulement

Budget du compte : 3 000 crédits (formule Ultra), dont ≈ 854 pour la musique (`docs/gdd/son.md`). Les images : **tout le
jeu actuel** (chapitres 1 à 8 et la fin) en sprites et décors peints, **portraits de dialogue pour les personnages
importants seulement** (une cinquantaine), passants, ennemis, tuiles encore dessinées par le code, illustrations et un
fond peint par ville. Estimation à l'échelle (prix revérifiés le 2026-11-08 sans générer : 0,25 une image basse 1k,
0,5 moyenne 1k, 1,5 haute 1k, 2,75 haute 2k ; `gpt_image_2_6`) : **≈ 500 crédits**. **La liste précise, son coût exact
(≈ 397 crédits, ≈ 448 avec les options) et un pilote (8,25)** : section précédente, en attente du feu vert de Cyril. Fiche de style : `docs/STYLE.md`.

## Mise en beauté complète : estimation (2026-11-02, demandée par Cyril)

Prix mesurés (`gpt_image_2_5`) : **0,5** crédit une image moyenne 1k (tuile, décor, personnage en pied, une direction de
marche), **1,5** un portrait (haute 1k), **2,75** une illustration (haute 2k). Presque tout est passé au premier essai ;
on compte 10 % de marge pour les reprises. Solde : 11,5 crédits (formule Plus).

**1. Rattraper le jeu actuel** (Canopéa, Ironheart, routes ; 104 tuiles encore dessinées par code) :

| Poste | Nombre | Crédits |
|---|---|---|
| PNJ nommés en pied (Véline, Malo, Ragna, Kaelis, Vanel…) | 34 | 17 |
| Leurs portraits de dialogue | 34 | 51 |
| Passants (tuiles) | 19 | 9,5 |
| Planches de marche des passants qui marchent | 8 | 20 |
| Ennemis et créatures (ours, loups, pilleurs, Échos furieux, cerfs) | 5 | 2,5 |
| Décors (maisons-cosses, forges, réverbères, gradins…) | 38 | 19 |
| Sols (plates-formes, passerelles, pavés, dalles…) et murs d'intérieur | 11 | 5,5 |
| Illustrations (carte du monde peinte, l'amphithéâtre, Ironheart) | 3 | 8,25 |
| **Total, marge comprise** | | **≈ 145** |

**2. Chaque nouvelle ville** (calée sur Canopéa et Ironheart) : 17 PNJ en pied et en portrait (34), 9 passants dont
4 qui marchent (14,5), 20 décors, 5 sols et un kit d'intérieur (14,5), 3 ennemis (1,5), un fond peint (1,5), une
illustration (2,75) : **≈ 75 crédits**, marge comprise. Huit villes (Sept-Portes et les sept autres) : **≈ 600**.

**Total : ≈ 750 crédits.** Variante économe (portraits pour les PNJ importants seulement, deux marcheurs par ville,
passants partagés entre les deux villes d'un même pays) : **≈ 500 crédits** (≈ 100 pour le rattrapage, ≈ 400 pour
les huit villes). Hors estimation : musique et sons, animations d'attaque, vidéos.

### Version « belle » (choisie par Cyril le 2026-11-02 : « je veux un truc de beau ») : ≈ 1 400 crédits

Tout est peint, plus animé et plus illustré que dans l'estimation ci-dessus ; 25 % de marge (deux essais pour
choisir le meilleur portrait ou la meilleure illustration).

| Poste | Rattrapage (jeu actuel) | Par nouvelle ville |
|---|---|---|
| PNJ nommés en pied et en portrait | 34 (68) | 17 (34) |
| PNJ importants qui marchent | — | 4 (10) |
| Passants, et marche de ceux qui marchent | 19 dont 8 qui marchent (29,5) | 9 dont 6 (19,5) |
| Décors, sols, murs, kit d'intérieur, grands décors phares | 53 (28,5) | 43 (23,5) |
| Ennemis et leur posture d'attaque | 6 (3) | 4 (4) |
| Illustrations (carte du monde peinte, scènes clés) | 11 (30,25) | 4 (11) |
| Fonds peints sous la carte | 2 (5,5) | 2 (5,5) |
| Icônes des objets dans l'inventaire | 27 (13,5) | 8 (4) |
| Habillage de l'interface (cadres, boutons ; logo intact) | 10 (5) | — |
| Animations d'attaque en combat (6 avatars, 7 ennemis) | 18,5 | — |
| **Total, marge comprise** | **≈ 250** | **≈ 140** |

Huit villes à venir : ≈ 1 120 ; **total ≈ 1 370 crédits**. Au prix donné par Cyril (49 € par mois pour 1 000 crédits),
≈ 70 € de crédits, soit deux mois d'abonnement (2 000 crédits) avec une bonne réserve, à vérifier : les crédits
mensuels se cumulent-ils d'un mois à l'autre ? Hors estimation : musique et sons (Higgsfield a des modèles de musique ;
prix à relever).

