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

## Plan des images de la mise en beauté (2026-11-08) — **à valider par Cyril, rien n'est généré**

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

