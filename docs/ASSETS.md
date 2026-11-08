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

## Plan des images de la mise en beauté (2026-11-08) — **fait** (feu vert de Cyril ; pilote, neuf portraits, sept villes, lot commun : sections suivantes)

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

## Lot Aetherhaven (2026-11-08, 79 images, 51,75 crédits, solde 1 905,11)

Le quatrième lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots ») :
Aetherhaven, la cité flottante, et sous les nuages le pays de cendre (`bas-cendres`, `voie-du-bas`, `halte-cendres`).
Le solde est celui du compte après le lot ; le lot de Sept-Portes tournait en même temps sur le même compte : les
51,75 crédits sont comptés tâche par tâche (tableau) ; prévu 47,25 (72 images : 52 tuiles peintes, `pont-ciel-r`
tirée de `pont-ciel-c`, 7 portraits, 2 planches de marche, l'illustration, 2 fonds), plus 4,5 de reprises (7 images),
plafond 60. Outil : Higgsfield MCP, `gpt_image_2_6`, six tâches en cours au plus. Bruts : `assets/raw/aetherhaven/`
(local) ; tailles et préréglages : `scripts/art/aetherhaven.json` ; traités par `npm run art`, `npm run tiles`,
`npm run lots`. La tuile `edda-halte` (la dame en gris) est du lot de Sept-Portes.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf les sols et les planches de marche), et « No text, no letters,
  no logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à la fin de
  tous.
- **Personnages** (et la Sylphe, Shass, les trois humains « ennemis ») : « Isometric 2:1 view, single character
  centered, isolated on a transparent background. Full-body character, three-quarter front view, standing: <sujet>.
  Simple readable silhouette for a small game sprite. He/She stands directly on the bottom of the image: no ground, no
  base, no cast shadow on the ground. » ; la **Mante-ailes** de même avec « single creature centered… : <sujet>… It
  stands… ».
- **Objets** et **bâtiments** : « Isometric 2:1 view, single object / building centered, isolated on a fully
  transparent background with no haze, no clouds and no mist: <sujet>. Simple readable shape for a small game sprite.
  It stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » (la clause sur la
  brume est venue après la première voile accrochée, sortie dans un nuage blanc : le garde-fou et cette v1 ne l'ont
  pas).
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes.
  Seamless tileable ground texture, flat top-down orthographic view looking straight down from above, filling the
  entire square edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light
  spot, no cast shadows, no perspective, no horizon. No objects. » ; les nuages avec le fond en référence, le pont avec
  les nuages en référence (ses bords se raccordent à la mer de nuages).
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: the same <boy/woman/man/young woman> as in
  the reference image, <sujet>, same face, same hair, same clothes, lit by warm lantern light from the upper left with
  cool shadow on the other side. Plain uniform dark ink background color #1B1512. », le personnage en pied en
  référence (`image_references`).
- **Planches de marche** (`docs/gdd/animation.md`) : « Sprite sheet for a 2D isometric game, on a fully transparent
  background with no haze and no glow: the same character as in the reference image (<tenue>), full body, seen from
  slightly above at a 30 degree angle, <direction>. Exactly 6 frames of a smooth walking cycle side by side in one
  single horizontal row, evenly spaced, every frame the same size and the same scale, feet on the same baseline, the
  character identical in every frame except the <parties> moving with the steps. No ground, no shadow, no grid lines,
  no frame borders. » ; hauteur 54 px pour l'attrapeur, 42 pour l'enfant (`npm run lots`).
- **Illustration** : bloc commun + sujet + à éviter. **Fonds** : « Painted backdrop for the empty edges around an
  isometric game map: <sujet>; no buildings or figures in the center, no focal subject, soft and slightly blurred,
  darker toward the edges. ».

| Fichier (`assets/raw/aetherhaven/`) | Tâche | Réglage ; préréglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `siffrin.png` | `4344e5ed` | moyenne 1k, transparent, 2:3 ; `enfant` | « Siffrin, a boy of about twelve, the lookout of a city floating above the clouds, tousled sandy hair, a lively freckled face, a faded sky-blue tunic, brown trousers and soft boots, a coil of rope knotted around his waist as a safety line, two fingers raised to his lips as if whistling, a small dark-blue swallow with a pale belly perched on his shoulder, simple child's clothes » | 0,5 |
| `ysolde.png` | `756c0d6c` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ysolde, the registrar of the Register of Sails of a city floating above the clouds, an Aerial woman in her fifties (a light-boned people of the high sky: very pale skin with a faint cool bluish tint, pale silver hair that floats slightly as if weightless), a calm attentive face, a long slate-blue coat with small pale gold buttons, thin grey gloves, a small brass key on a cord at her belt, a stack of neatly folded pale cloths held under one arm » | 0,5 |
| `ravel-v1-brun.png` (écarté : sorti en cuir brun) | `05b6a3b6` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ravel, a pilot of the Black Wings who fly without contract, a lean man in his late thirties, black hair tied back, stubble, a wind-burnt face with a crooked joyless smile, a worn black leather flight jacket with a few black feathers sewn on one sleeve, black trousers and boots, a single faceted pale blue crystal on a cord at his neck, arms crossed, nothing in his hands » | 0,5 |
| `ossiane.png` | `a12b8450` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ossiane, captain of an airship company of a city floating above the clouds, an Aerial woman in her late forties (a light-boned people of the high sky: pale cream skin, silver-white hair that floats as if weightless), a composed lined face, a fitted midnight-blue pilot's jacket with pale gold piping, a small copper brooch shaped like a feather inside a circle, dark trousers and tall boots, leather wind goggles pushed up on her forehead, gloved hands at her sides, nothing in her hands » | 0,5 |
| `celeste-v1-brun.png` (écarté : sortie en cuir brun) | `c3df6f7f` | moyenne 1k, transparent, 2:3 ; `personnage` | « Céleste, a seventeen-year-old apprentice pilot, a slim young woman with tousled pale blond hair, a defiant determined face, a worn black leather flight jacket and trousers, leather gloves, a long sky-blue scarf blowing in the wind, pulling tight a leather strap held in both hands » | 0,5 |
| `veuve-grele.png` | `c9941bb9` | moyenne 1k, transparent, 2:3 ; `personnage` | « the Widow Hail, captain of sky pirates, a wiry hard woman in her fifties with cropped iron-grey hair, a gaunt weathered face with cold appraising eyes, a long dark oilcloth coat with rows of small iron hailstone beads sewn along both sleeves, dark trousers and boots, a short chain of iron balls hanging from one hand » | 0,5 |
| `holger.png` | `da46c865` | moyenne 1k, transparent, 2:3 ; `personnage` | « Holger Brandt, a thin archivist fleeing an industrial empire, a man in his fifties with thinning brown hair, a tired anxious face, a threadbare ink-black coat, a worn leather satchel clutched tightly against his chest with both arms » | 0,5 |
| `attrapeur.png` | `a359ce05` | moyenne 1k, transparent, 2:3 ; `personnage` | « a sail catcher of a city floating above the clouds, an Aerial man in his sixties (a light-boned people of the high sky: pale cream skin, silver-white hair that floats as if weightless), a lean weathered face with a wistful look, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net » | 0,5 |
| `enfant-collier.png` | `8d2da69d` | moyenne 1k, transparent, 2:3 ; `enfant`, `matte: true` | « a little Aerial girl of about seven (a light-boned people of the high sky: pale cream skin, silvery-white hair floating slightly as if weightless), a simple cream tunic dress and soft shoes, a small faceted pale blue crystal on a cord around her neck that she lifts in one hand close to her ear to listen to it, a delighted face, simple child's clothes » | 0,5 |
| `nuages-v1-clair.png` (écarté : trop clair et trop chargé, jure avec le fond) | `958cf2e6` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « a dense sea of soft clouds seen from directly above, billowing pale grey-white cloud tops with soft cool blue-grey hollows between them, nothing else » | 0,5 |
| `garde-fou.png` | `a2f8a95b` | moyenne 1k, transparent, 1:1 ; `meuble`, `maxWidth: 60`, `maxHeight: 44` | « a short straight section of weathered wooden railing at the edge of a floating island: three wooden posts and a worn wooden handrail, running diagonally from the upper right to the lower left » (avec « isolated on a transparent background », sans la clause sur la brume) | 0,5 |
| `gardien-ciel.png` | `5ef8c69b` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Sky Guardian, a woman of the Storm Hunters (a people whose skin has a faint turquoise luminescence, as if lit by a distant flash of lightning) in her thirties, short dark hair, a steady watchful face, a fitted storm-blue uniform coat with a high collar, a turquoise armband on one arm, a coil of rescue rope over her shoulder, a leather belt with pouches, empty hands » | 0,5 |
| `ravel.png` (reprise) | `145a2a63` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ravel, a pilot of the Black Wings who fly without contract, a lean man in his late thirties, black hair tied back, stubble, a wind-burnt face with a crooked joyless smile, a worn jet-black leather flight jacket (truly black, not brown) with a few black feathers sewn on one sleeve, black leather trousers and black boots, a single faceted pale blue crystal on a cord at his neck, arms crossed, nothing in his hands » | 0,5 |
| `celeste.png` (reprise) | `8fcf3865` | moyenne 1k, transparent, 2:3 ; `personnage` | « Céleste, a seventeen-year-old apprentice pilot, a slim young woman with tousled pale blond hair, a defiant determined face, a worn jet-black leather flight jacket and black leather trousers (truly black, not brown), leather gloves, a long sky-blue scarf blowing in the wind, pulling tight a leather strap held in both hands » | 0,5 |
| `portrait-siffrin.png` | `480bec05` | haute 1k, opaque, 1:1, `siffrin.png` en référence (`4344e5ed`) | « Siffrin, a twelve-year-old lookout who whistles to the birds, the small dark-blue swallow perched on his shoulder, two fingers near his lips as if about to whistle, a bright watchful gaze turned to the sky with a shadow of worry, simple child's clothes » | 1,5 |
| `portrait-ysolde.png` | `a3f36de1` | haute 1k, opaque, 1:1, `ysolde.png` en référence (`756c0d6c`) | « Ysolde, the registrar of the Register of Sails, her pale silver hair floating slightly, a folded pale cloth in her gloved hands, a calm attentive gaze, patient and quietly sorrowful, as if keeping names that nobody comes to claim » | 1,5 |
| `portrait-ossiane.png` | `082a0758` | haute 1k, opaque, 1:1, `ossiane.png` en référence (`a12b8450`) | « Ossiane, captain of an airship company, her wind goggles pushed up on her forehead, her silver-white hair floating slightly, a firm measured gaze and set lips, a captain who brings her pilots home every night » | 1,5 |
| `portrait-veuve-grele.png` | `78c18a3b` | haute 1k, opaque, 1:1, `veuve-grele.png` en référence (`c9941bb9`) | « the Widow Hail, captain of sky pirates, the iron hailstones sewn on her sleeves, a cold appraising gaze as if judging the weather, thin unsmiling lips » | 1,5 |
| `portrait-ravel.png` | `0c7d75d7` | haute 1k, opaque, 1:1, `ravel.png` en référence (`145a2a63`) | « Ravel, a pilot of the Black Wings, the single pale blue crystal at his neck, black feathers on his sleeve, a crooked joyless smile and defiant wind-narrowed eyes » | 1,5 |
| `portrait-celeste-v1-brun.png` (écarté : la veste redevenue brune sous la lumière chaude) | `ca9c3b7e` | haute 1k, opaque, 1:1, `celeste.png` en référence (`8fcf3865`) | « Céleste, a seventeen-year-old apprentice pilot, her sky-blue scarf, wind-tousled pale blond hair, a stubborn defiant look with a trace of fear she hides » | 1,5 |
| `portrait-holger.png` | `40ea05fa` | haute 1k, opaque, 1:1, `holger.png` en référence (`da46c865`) | « Holger Brandt, a former archivist fleeing his empire, his satchel held against his chest, an anxious tired hunted look, a quiet man who never learned to speak loudly » | 1,5 |
| `pont-ciel-c-v1-clair.png` (écarté : nuages de la v1) | `c1405d52` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol-voie`, `nuages-v1-clair.png` en référence (`958cf2e6`) | « a suspended footbridge of weathered wooden planks running from the top edge to the bottom edge, centered, covering the middle half of the width, the planks laid crosswise, two rope handrails along both sides of the bridge, and on both sides of the bridge the same sea of soft clouds as in the reference image » | 0,5 |
| `voile-accrochee-v1-brume.png` (écarté : brume blanche autour, fond non transparent) | `78d68812` | moyenne 1k, transparent, 1:1 ; `meuble`, `garde-fou.png` en référence (`a2f8a95b`) | « the same short section of wooden railing as in the reference image, with a single long pale linen cloth tied to the handrail by a knot and fluttering in the wind, no writing visible on the cloth » (avec « isolated on a transparent background », sans la clause sur la brume) | 0,5 |
| `marche-attrapeur-quai/s.png` | `250d04d3` | moyenne 1k, transparent, 21:9, `attrapeur.png` en référence (`a359ce05`) | tenue « an Aerial man in his sixties with pale cream skin and silver-white hair floating as if weightless, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net, same face, same proportions and colors » ; « walking straight toward the viewer, front view » ; « legs, arms and tunic moving » | 0,5 |
| `marche-attrapeur-quai/se.png` | `322c680d` | moyenne 1k, transparent, 21:9, `attrapeur.png` en référence (`a359ce05`) | tenue « an Aerial man in his sixties with pale cream skin and silver-white hair floating as if weightless, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net, same face, same proportions and colors » ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and tunic moving » | 0,5 |
| `marche-attrapeur-quai/e.png` | `5a34a7dc` | moyenne 1k, transparent, 21:9, `attrapeur.png` en référence (`a359ce05`) | tenue « an Aerial man in his sixties with pale cream skin and silver-white hair floating as if weightless, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net, same face, same proportions and colors » ; « walking to the right, side profile view facing right » ; « legs, arms and tunic moving » | 0,5 |
| `marche-attrapeur-quai/ne.png` | `ede108d4` | moyenne 1k, transparent, 21:9, `attrapeur.png` en référence (`a359ce05`) | tenue « an Aerial man in his sixties with pale cream skin and silver-white hair floating as if weightless, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and tunic moving » | 0,5 |
| `marche-attrapeur-quai/n.png` | `343995fe` | moyenne 1k, transparent, 21:9, `attrapeur.png` en référence (`a359ce05`) | tenue « an Aerial man in his sixties with pale cream skin and silver-white hair floating as if weightless, a faded grey-blue tunic and loose trousers, soft boots, holding upright in one hand a long light wooden pole topped with a small hoop net, same face, same proportions and colors » ; « walking straight away from the viewer, back view » ; « legs, arms and tunic moving » | 0,5 |
| `marche-enfant-collier/s.png` | `9507a01e` | moyenne 1k, transparent, 21:9, `enfant-collier.png` en référence (`8d2da69d`) | tenue « a little girl of about seven with pale cream skin and silvery-white hair floating slightly, a simple cream tunic dress and soft shoes, a small pale blue crystal on a cord around her neck, same face, same proportions and colors » ; « walking straight toward the viewer, front view » ; « legs, arms and dress moving » | 0,5 |
| `marche-enfant-collier/se.png` | `e2e4650d` | moyenne 1k, transparent, 21:9, `enfant-collier.png` en référence (`8d2da69d`) | tenue « a little girl of about seven with pale cream skin and silvery-white hair floating slightly, a simple cream tunic dress and soft shoes, a small pale blue crystal on a cord around her neck, same face, same proportions and colors » ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and dress moving » | 0,5 |
| `marche-enfant-collier/e.png` | `9b8cd0c9` | moyenne 1k, transparent, 21:9, `enfant-collier.png` en référence (`8d2da69d`) | tenue « a little girl of about seven with pale cream skin and silvery-white hair floating slightly, a simple cream tunic dress and soft shoes, a small pale blue crystal on a cord around her neck, same face, same proportions and colors » ; « walking to the right, side profile view facing right » ; « legs, arms and dress moving » | 0,5 |
| `marche-enfant-collier/ne.png` | `1baaeed8` | moyenne 1k, transparent, 21:9, `enfant-collier.png` en référence (`8d2da69d`) | tenue « a little girl of about seven with pale cream skin and silvery-white hair floating slightly, a simple cream tunic dress and soft shoes, a small pale blue crystal on a cord around her neck, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and dress moving » | 0,5 |
| `marche-enfant-collier/n.png` | `96bfdf1e` | moyenne 1k, transparent, 21:9, `enfant-collier.png` en référence (`8d2da69d`) | tenue « a little girl of about seven with pale cream skin and silvery-white hair floating slightly, a simple cream tunic dress and soft shoes, a small pale blue crystal on a cord around her neck, same face, same proportions and colors » ; « walking straight away from the viewer, back view » ; « legs, arms and dress moving » | 0,5 |
| `zelie.png` | `b341b2ea` | moyenne 1k, transparent, 2:3 ; `personnage` | « Zélie, a priestess of the wind of a city floating above the clouds, a woman in her forties, pale golden hair in a long loose braid, a serene grave face, a long flowing white robe, faded blue ribbons tied at her wrists and fluttering in the wind, empty hands open at her sides » | 0,5 |
| `vessin.png` | `f21e465f` | moyenne 1k, transparent, 2:3 ; `personnage` | « Vessin, a sailmaker, a man in his sixties, greying brown hair, a lined patient face, a heavy canvas work apron over a pale shirt with rolled sleeves, a sewing needle with a long thread in one hand and a folded piece of pale sail-cloth in the other, loops of thread around his fingers » | 0,5 |
| `assel.png` | `5ac7ae9b` | moyenne 1k, transparent, 2:3 ; `personnage` | « Assel, an old innkeeper, an Aerial woman in her eighties (a light-boned people of the high sky: very pale skin with a faint cool bluish tint, silver-white hair floating as if weightless), slight and frail, a kind tired face, a long cream wool shawl over a soft grey-blue dress, holding a small pale clay teapot in both hands » | 0,5 |
| `shass.png` | `8f178f1c` | moyenne 1k, transparent, 2:3 ; `personnage`, `opacity: 0.85` | « Shass, a Sylph who sings for the temple of the wind: a semi-ethereal humanoid spirit made of wind and pale light, a slender feminine figure only half there, translucent at the edges, long hair streaming like wisps of wind, a calm luminous face with pale eyes, a simple flowing robe whose hem frays into wisps of air, no wings, empty hands, on a fully transparent background with no haze and no halo around her » | 0,5 |
| `evrard.png` | `70785252` | moyenne 1k, transparent, 2:3 ; `personnage` | « Évrard, a wind scholar from another floating city, a thin fussy man in his fifties, receding grey hair, a pearl-grey long coat buttoned neatly, a magnifying glass in one hand and a pale piece of cloth held up close to it in the other, a small leather notebook case at his belt, an absorbed muttering expression » | 0,5 |
| `odile.png` | `01d15618` | moyenne 1k, transparent, 2:3 ; `personnage`, `matte: true` | « Odile, a mother in her late forties, greying light-brown hair pinned back, a worried lined face, a long cream wool dress under a cream knitted cardigan, her hands clasped tightly together in front of her chest » | 0,5 |
| `bastien.png` | `d53c2a04` | moyenne 1k, transparent, 2:3 ; `personnage` | « Bastien, an old man in his seventies, white hair and a short white beard, a weathered lined face, a faded grey-green coat with patched elbows, a long brass spyglass slung over his shoulder on a leather strap, a folded new pale linen cloth held in both hands » | 0,5 |
| `agent-ferros.png` | `df86c206` | moyenne 1k, transparent, 2:3 ; `personnage` | « a clerk of a cold industrial empire, a lean man in his forties, grey from head to toe: short grey hair, a buttoned grey coat with a high collar, grey trousers and grey gloves, a thin smile that does not reach his cold eyes, a thick grey ledger held under one arm, a small dark-red pin at his collar » | 0,5 |
| `oiselier.png` | `09de72eb` | moyenne 1k, transparent, 2:3 ; `personnage` | « a bird seller, a man in his fifties with a short brown beard and sly eyes, a brown waistcoat over a mustard shirt, many brass and copper rings on his fingers, a small wicker birdcage with a dark-blue swallow inside held up in one hand, two small empty cages hanging from his belt » | 0,5 |
| `pilote-vire-nuee.png` | `e870de6a` | moyenne 1k, transparent, 2:3 ; `personnage` | « a company airship pilot, a woman in her thirties, sandy-blond hair tied back, a sensible tired face, a fitted midnight-blue pilot's jacket with pale gold piping and a small copper brooch shaped like a feather inside a circle, leather wind goggles around her neck, dark trousers and boots, a pair of leather gloves held in one hand » | 0,5 |
| `marchand-pain.png` | `5668b22b` | moyenne 1k, transparent, 2:3 ; `personnage` | « a baker woman of a city floating above the clouds, in her forties, brown hair under a cream headscarf, flour on her forearms, a sand-coloured dress with a flour-dusted apron, a wide flat wicker basket with a few round loaves of bread held at her hip, a weary bitter half-smile » | 0,5 |
| `copiste.png` | `3ee79f85` | moyenne 1k, transparent, 2:3 ; `personnage` | « a copyist who copies messages written on cloth, a thin man in his thirties, short dark hair, ink-stained fingers, a slate-blue scribe's coat with black sleeve protectors, a folded pale cloth in one hand and a writing pen in the other » | 0,5 |
| `sylphe.png` | `3f9dba80` | moyenne 1k, transparent, 2:3 ; `personnage`, `opacity: 0.85` | « a Sylph: a semi-ethereal humanoid spirit made of wind and pale light, a slender feminine figure only half there, translucent at the edges, short wind-tossed hair like wisps of air, pale glowing eyes, a light flowing tunic whose edges fray into swirling air, no wings, empty hands, on a fully transparent background with no haze and no halo around her » | 0,5 |
| `aerien.png` | `37eddeb6` | moyenne 1k, transparent, 2:3 ; `personnage` | « a grieving Aerial father (a light-boned people of the high sky: very pale skin with a faint cool bluish tint, silver-white hair floating as if weightless), a man in his forties, a gentle sad face, light loose clothes of pale sky-blue and cream, holding a folded pale linen cloth against his chest with both hands » | 0,5 |
| `aeropretre.png` | `4a3a0e9e` | moyenne 1k, transparent, 2:3 ; `personnage` | « a priest of the wind, an old man in his sixties with short grey hair and a short grey beard, a serene face, a long flowing white robe, faded blue ribbons tied at his wrists fluttering in the wind, empty hands open at his sides » | 0,5 |
| `chasseur-orage.png` | `aaa15484` | moyenne 1k, transparent, 2:3 ; `personnage` | « a wind cartographer of the Storm Hunters (a people whose skin has a faint turquoise luminescence), a man in his thirties with short black hair, a keen weathered face, a dark teal travelling coat with many pockets, a rolled parchment chart in one hand and a stick of charcoal in the other » | 0,5 |
| `aile-noire.png` | `99b76492` | moyenne 1k, transparent, 2:3 ; `personnage` | « a hired pilot of the Black Wings, a lean hard-faced pilot of uncertain age, close-cropped dark hair, leather wind goggles pushed up on the forehead, a worn jet-black leather flight jacket (truly black, not brown) with a few black feathers sewn on one sleeve, a dark scarf, a single faceted pale blue crystal on a cord at the neck, a short curved blade sheathed at the hip, gloved empty hands » | 0,5 |
| `pirate-air.png` | `8411e941` | moyenne 1k, transparent, 2:3 ; `personnage` | « a sky pirate, a gaunt hungry man in his thirties with hollow cheeks, a faded dark-red headscarf, wind goggles around his neck, a patched brown oilcloth coat, a rope coiled across his chest, an iron boarding hook held in one hand » | 0,5 |
| `mante-ailes.png` | `5a636675` | moyenne 1k, transparent, 1:1 ; `creature` | « a Wing Mantis, a gigantic predatory insect of a grey dead land of ash, a wild creature, a long segmented body of dull grey-green chitin dusted with ash, a narrow triangular head with small red eyes, raised folded forelegs like scythes, long pale translucent wings with sharp edges like blades, half spread, no harness, no saddle » | 0,5 |
| `voile-accrochee.png` (reprise) | `098eb30d` | moyenne 1k, transparent, 1:1 ; `meuble`, `garde-fou.png` en référence (`a2f8a95b`), `maxWidth: 60`, `maxHeight: 48` | « the same short section of wooden railing as in the reference image, with a single long pale linen cloth tied to the handrail by a knot and fluttering in the wind, no writing visible on the cloth » | 0,5 |
| `ilot.png` | `f3c78912` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « the top of a floating island high in the sky: short pale wind-flattened grass of a silvery grey-green, patches of pale bare earth and a few small flat pale stones, a few tiny pale yellow flowers » | 0,5 |
| `dalles-azur.png` | `cf5aa07e` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « large square flagstones of pale blue-grey stone with fine joints, smooth and worn by the wind, a few tiny inlaid pale gold specks » | 0,5 |
| `ruine-v1-lanterne.png` (écarté : une lanterne allumée et un cristal sur le mur) | `f3008e31` | moyenne 1k, transparent, 1:1 ; `objet` | « a ruined fragment of an old wall of grey stone blocks, collapsed and jagged on top, a few cracked stones fallen at its foot, a patch of dry grey moss, dust in the cracks » | 0,5 |
| `mat-amarrage.png` | `127a7a77` | moyenne 1k, transparent, 2:3 ; `haut` | « a tall wooden mooring mast for airships: a single weathered wooden pole with a short crossbeam near the top, a copper cap and iron mooring rings, a thick rope hanging in a loop from the crossbeam » | 0,5 |
| `dirigeable.png` | `af612571` | moyenne 1k, transparent, 1:1 ; `batiment` | « a moored airship: a long weathered grey canvas envelope patched in places and held by a net of ropes, small pale blue tail fins, under it a wooden gondola with a row of small round windows resting on the ground, a faceted pale blue crystal fixed under the gondola, mooring ropes hanging down, no flag, no emblem » | 0,5 |
| `maison-voile.png` | `316d76c4` | moyenne 1k, transparent, 2:3 ; `batiment` | « a light house of a city floating above the clouds: walls of pale weathered wooden planks, a tall pointed roof made of taut pale sail-cloth stretched over a wooden frame and lashed with ropes, a faded sky-blue stripe across the sail roof, a small blue streamer at the top, a rounded copper door, small windows of pale blue glass » | 0,5 |
| `moulin.png` | `ecdf56af` | moyenne 1k, transparent, 2:3 ; `batiment` | « a tall narrow windmill house: a slightly tapered tower of weathered pale wood with a small rounded copper door and a small window, four long sails of pale patched canvas on a wooden cross, a pale shingled cap roof » | 0,5 |
| `tour-vents.png` | `e83bb607` | moyenne 1k, transparent, 2:3 ; `batiment` | « a tall slender spiral tower of translucent pale blue crystal twisting upward to a sharp point, faceted and cool, a pale gold door at its base, faint white wind streaks spiralling around it » | 0,5 |
| `temple-vent.png` | `2ceb1ea7` | moyenne 1k, transparent, 1:1 ; `batiment` | « a temple of the wind: a round building of pale weathered stone under a wide dome open on all sides between slender columns, so the wind passes through it, long faded blue ribbons streaming from the top of the dome, a copper door » | 0,5 |
| `cristal-azur.png` | `60eac386` | moyenne 1k, transparent, 2:3 ; `haut`, `maxHeight: 72` | « a large faceted pale blue crystal floating a hand's breadth above the top of a short carved wooden post, a faint cool blue glow in the crystal only » | 0,5 |
| `jardin-suspendu.png` | `50dd1ee0` | moyenne 1k, transparent, 1:1 ; `meuble` | « a small hanging garden: a weathered wooden planter trough raised on a light wooden frame, overflowing with pale green herbs and small white and pale gold flowers, long trailing vines hanging down over its sides » | 0,5 |
| `voile.png` | `9470949f` | moyenne 1k, transparent, 1:1 ; `petit`, `maxWidth: 34`, `maxHeight: 30`, `foot: 74` | « a single small piece of pale linen cloth floating in the air, carried by the wind, its corners curling, a thin faded blue ribbon trailing from one corner, no writing visible on the cloth » | 0,5 |
| `filet.png` | `5fe06e6d` | moyenne 1k, transparent, 2:3 ; `haut` | « a sail catcher's net: a long light wooden pole standing upright, topped by a wide hoop of bent wood holding a loose rope net, a few knotted cords » | 0,5 |
| `caisse-ouverte.png` | `d6800673` | moyenne 1k, transparent, 1:1 ; `meuble` | « an old heavy wooden crate that was sealed with lead and opened long ago: the lead seals broken, the swollen grey wood split, its lid pushed aside, inside a heavy bundle wrapped in grey canvas, the crate dusted with fine grey ash, no lantern, no lamp, no light source » | 0,5 |
| `machine-volante.png` | `3c4428db` | moyenne 1k, transparent, 1:1 ; `objet`, `maxWidth: 58` | « a light flying machine: a slender frame of pale weathered wood and cords, a wide wing of pale stretched canvas above it, a small open seat, two faceted pale blue crystals fixed under the frame, no engine, no propeller » | 0,5 |
| `vigie.png` | `17538cbb` | moyenne 1k, transparent, 2:3 ; `batiment` | « a small wooden lookout tower: four tall weathered wooden legs with cross braces and a ladder, a small railed platform at the top under a pointed roof of pale canvas, a long rope hanging from the platform » | 0,5 |
| `arche-vent.png` | `cf1b38c5` | moyenne 1k, transparent, 1:1 ; `batiment`, `maxHeight: 80` | « a large wooden archway at the entrance of a quay: two tall weathered wooden posts and a gently curved crossbeam bearing a plain band of pale gold leaf without any letters, long faded blue and white ribbons streaming from the crossbeam in the wind » | 0,5 |
| `echelle-corde.png` | `a8585241` | moyenne 1k, transparent, 2:3 ; `haut` | « a long rope ladder hanging straight down from above, wooden rungs and frayed ropes, its upper end fading softly away into transparency, its bottom rungs resting on the ground, no lantern, no lamp, no light source » | 0,5 |
| `saut.png` | `19e50054` | moyenne 1k, transparent, 1:1 ; `petit`, `maxWidth: 40`, `maxHeight: 24`, `foot: 88` | « white chalk marks drawn flat on the ground, seen in isometric perspective: a dashed curved chalk line and a simple chalk arrow, with two short chalk strokes like gusts of wind; only the chalk marks, no ground, no stones, no lantern, no lamp, no light source » | 0,5 |
| `aetherhaven-arrivee.png` | `065baaae` | haute 2k, opaque, 16:9 | « The arrival by airship at a city floating high above a sea of clouds, at dusk. In the foreground, a long wooden quay at the edge of a floating island, tall wooden mooring masts and a weathered grey airship being moored with ropes, a few small tired travellers stepping onto the planks, and a small woman guard in a storm-blue uniform with a turquoise armband waiting to greet them. Beyond, many floating islands of rock with pale grass on top, each held aloft by large faceted pale blue crystals glowing faintly beneath it, linked by sagging rope suspension bridges; light houses of pale wood with roofs of taut sail-cloth, a windmill with canvas sails, hanging gardens trailing vines over the void; on the highest island, a slender spiral tower of translucent blue crystal. Small pieces of pale cloth drift on the wind like birds. Pale sky blue, silver white and pale gold muted by the dusk, a few warm windows. The lower third is darker, the sea of clouds in calm cool shadow, leaving room for a dialogue panel » | 2,75 |
| `fond-aetherhaven.png` | `6a4f95f6` | haute 1k, opaque, 16:9 | « a vast sea of clouds seen from very high above at dusk, soft rolling cloud tops of pale grey-blue and silver, a faint cold light, thin wisps drifting, here and there a gap of deep blue-grey void » | 1,5 |
| `fond-nuages.png` | `e3bed831` | haute 1k, opaque, 16:9 | « a dead grey land of ash seen from very high above under a low ceiling of dark clouds: dark grey ash plains with soft drifts and dunes of ash, a few thin straight lines of old rails half buried in ash, drifting ash haze, a dim cold light » | 1,5 |
| `ruine.png` (reprise) | `19449277` | moyenne 1k, transparent, 1:1 ; `objet`, `maxWidth: 56`, `maxHeight: 52` | « a ruined fragment of an old wall of grey stone blocks, long abandoned, collapsed and jagged on top, a few cracked stones fallen at its foot, a patch of dry grey moss, dust in the cracks, no lantern, no lamp, no light source, no crystal » | 0,5 |
| `portrait-celeste.png` (reprise) | `23ab68f7` | haute 1k, opaque, 1:1, `celeste.png` en référence (`8fcf3865`) | « Céleste, a seventeen-year-old apprentice pilot, her worn jet-black leather flight jacket (truly black, not brown), her sky-blue scarf, wind-tousled pale blond hair, a stubborn defiant look with a trace of fear she hides » | 1,5 |
| `nuages.png` (reprise) | `7d6785e3` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol`, `fond-aetherhaven.png` en référence (`6a4f95f6`) | « a sea of soft clouds seen from directly above, large soft rounded cloud masses with low contrast, muted dusky grey-blue and dim silver with faint lilac shadows, in the same colours and light as the clouds of the reference image, nothing else » | 0,5 |
| `pont-ciel-c.png` (reprise) | `b568aa6f` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol-voie`, `nuages.png` en référence (`7d6785e3`) | « a suspended footbridge of weathered wooden planks running from the top edge to the bottom edge, centered, covering the middle half of the width, the planks laid crosswise, two rope handrails along both sides of the bridge, and on both sides of the bridge the same sea of soft clouds as in the reference image » | 0,5 |
| `pont-ciel-r.png` | — | `pont-ciel-c.png` tournée d'un quart (sharp) ; `sol-voie`, `seam: "horizontal"` | (aucune génération) | 0 |
| **Total** | | | **79 images** (72 prévues + 7 reprises) | **51,75** |

**Dans le jeu** : 53 tuiles (52 images et `pont-ciel-r`), 7 portraits (`src/data/npcs.json` : Siffrin, Ysolde, Ravel,
Ossiane, Céleste, la Veuve Grêle, Holger), les planches de marche de l'attrapeur du quai et de l'enfant au collier
(`public/sprites/figurant-{attrapeur-quai,enfant-collier}.png`, `src/data/figurants.json`), l'illustration
`public/illustrations/aetherhaven-arrivee.jpg`, les fonds `public/fonds/aetherhaven.jpg` (le Quai, les Îles-Marchés, la
Haute-Île) et `public/fonds/nuages.jpg` (le pays de cendre, la Voie du Bas, la Halte des Cendres, Altavent). Vérifié dans
Chromium : les trois quartiers (la Haute-Île de jour et de nuit, avec Bastien), sept intérieurs, les trois cartes d'en
bas, l'accueil de la Gardienne avec l'illustration, les dialogues des sept portraits, un combat (Mante-ailes, Aile
Noire à gages, pirate de l'air, la Veuve Grêle) ; aucune erreur ; typecheck et 1079 tests.

**Bilan** :
- **Reprises (7 images, 4,5 crédits, chacune une fois)** : Ravel et Céleste sortis en cuir brun, alors que leur texte
  dit « un homme en cuir noir », « une jeune femme en cuir noir » (la palette sourde brunit le noir) : refaits avec
  « jet-black leather (truly black, not brown) », et l'Aile Noire à gages peinte d'emblée ainsi ; le portrait de Céleste,
  dont la lumière chaude avait rebruni la veste : refait avec la même précision ; la voile accrochée, sortie dans une
  brume blanche (fond non transparent) : refaite avec la clause « no haze, no clouds and no mist », mise ensuite sur tous
  les objets ; la ruine, avec une lanterne allumée et un cristal sur le mur, alors qu'elle sert aux lieux abandonnés
  (« personne n'y va ») : refaite « long abandoned… no lantern, no light source, no crystal » (même précaution d'emblée
  pour la caisse, l'échelle et le saut) ; la mer de nuages, d'abord trop claire et trop chargée (de petits moutons
  blancs réguliers, comme un tricot) : dans le jeu elle jurait avec le fond du crépuscule ; refaite avec le fond en
  référence, et le pont refait sur les nouveaux nuages (ses bords se raccordent). Les versions écartées restent dans
  `assets/raw/aetherhaven/` (`-v1-…`).
- **Sortes vérifiées** (le calcul automatique les donnait toutes « décor », « passant » ou « ennemi ») : `nuages`,
  `ilot`, `dalles-azur` (`sol`) et `pont-ciel-c` (`sol-voie`) sont des sols ; `pont-ciel-r` est `pont-ciel-c` tournée d'un
  quart (`seam: "horizontal"`, comme la passerelle de Canopéa), sans génération ; `garde-fou` et `voile-accrochee` sont
  le même garde-fou (`meuble`, la voile peinte avec le garde-fou en référence) ; `voile` est un tissu qui flotte
  (`petit`, `foot: 74` : le jeu le fait monter et descendre) ; `saut`, des marques à la craie au sol (`petit`) ;
  `filet`, `mat-amarrage`, `cristal-azur`, `echelle-corde` sont hauts (`haut`) ; `dirigeable`, `maison-voile`, `moulin`,
  `tour-vents`, `temple-vent`, `vigie`, `arche-vent` sont des bâtiments ; `ruine` et `machine-volante` des objets ;
  `jardin-suspendu`, `caisse-ouverte` des meubles ; `gardien-ciel` (« passant ») est la Gardienne, un personnage ;
  `aile-noire`, `veuve-grele`, `pirate-air` (« ennemis ») sont des humains (`personnage`) ; `mante-ailes`, `creature` ;
  Siffrin et l'enfant au collier, `enfant` ; Shass et la Sylphe, `personnage` à 85 % d'opacité (« à demi là ») ; Odile et
  l'enfant, `matte` (un léger halo blanc, enlevé par le script).
- **Tuiles partagées** : `ruine` sert aussi à la voie noyée de Coralia, à la halte morte de la Marche, à la voie sept
  de Khrysos, aux voies endormies (le plan « quai ») et aux rencontres « ruines » : un pan de mur de pierre grise, sans signe d'une ville ; `echelle-corde` sert aussi au Quai Sept
  (sous la Faille) : le haut s'efface, sans nuage ; `maison-voile` fait sept maisons (Voilerie, Compagnie, Perchoir, Nid,
  Registre, Observatoire, Relais) : une maison de bois et de toile, sans enseigne ; `dirigeable` fait le dirigeable de la
  Confédération et celui de la soute (« un dirigeable gris, sans pavillon ») : gris, sans pavillon ; `machine-volante`
  fait la carcasse de l'îlot du vent et la machine de la Voilerie ; `gardien-ciel` sert à la Gardienne (une femme, son
  texte) et au passant « Un Gardien du Ciel » : peinte en femme ; `aile-noire` sert à l'escorte « Aile Noire à gages »
  (« Il vole sans contrat ») et à la passante « Une Aile Noire » : un pilote sec au visage dur, plutôt un homme (à séparer
  si Cyril le veut) ; `marchand-pain` sert à « Une boulangère » : peinte en femme ; `caisse-ouverte` montre la forme
  emballée de toile et pas de rouleau (« Le rouleau qui en sortait n'y est plus »).
- **L'illustration** est sur `src/data/dialogues/gardien-ciel.json`, nœud `accueil` (« Bienvenue à Aetherhaven. Je ne
  demanderai pas d'où vous venez ») : la Gardienne du Ciel se tient à trois cases de l'arrivée du Quai des Dirigeables
  (`entree` en 4,10 ; elle en 7,11), la première qui reçoit le héros ; Siffrin est plus loin, et de jour seulement. Le
  nœud `asile` (quand la quête de Holger est en cours) ne l'a pas.
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : les Aériens d'après la
  page canon « Zephyria — Races & peuples » (peau pâle, crème ou bleutée, cheveux qui flottent) : Ossiane (la
  cinquantaine proche, cheveux blanc d'argent, veste de pilote bleu nuit à passepoil or pâle, broche de cuivre « une
  plume dans un cercle » comme celle qu'elle donne aux Passagers, lunettes de vent sur le front), Ysolde (la
  cinquantaine, manteau bleu ardoise, gants gris, clé de laiton à la ceinture, pile de tissus pliés), Assel (très
  vieille, frêle, châle crème, théière d'argile), l'attrapeur (la soixantaine, tunique gris-bleu, filet sur perche),
  l'enfant au collier (sept ans, robe crème, cristal à l'oreille), le père du Lâcher (tissu plié contre la poitrine) ;
  les Chasseurs d'Orage (la Gardienne : uniforme bleu d'orage, brassard turquoise, corde de secours ; le cartographe :
  manteau sarcelle, carte et fusain ; la luminescence turquoise ne se voit presque pas) ; les Sylphes, sans ailes,
  translucides (Shass aux longs cheveux de vent, la passante aux cheveux courts) ; Siffrin (douze ans, cheveux blond
  sable, taches de rousseur, tunique bleu passé, corde nouée à la taille, comme la corde que sa grand-mère lui a nouée,
  hirondelle bleu sombre à l'épaule) ; Ravel (la fin de la trentaine, cheveux noirs noués, plumes noires cousues à la
  manche, comme la plume qu'il en détache) ; Céleste (blonde, cuir noir, écharpe bleu ciel, sans plumes encore) ; l'Aile
  Noire à gages (lunettes relevées, écharpe sombre, lame courbe au fourreau) ; Zélie et l'aéroprêtre (robe blanche,
  rubans bleus aux poignets) ; Vessin (la soixantaine, tablier de toile, aiguille et fil) ; Évrard (manteau gris perle,
  loupe et tissu ; quelques signes dorés à l'ourlet, illisibles à 54 px) ; Odile (laine crème, mains jointes) ; Holger
  (maigre, manteau d'encre râpé, sacoche serrée) ; Bastien (barbe blanche, longue-vue de laiton en bandoulière, tissu
  neuf plié) ; le commis de Ferros (gris de la tête aux pieds, registre, épingle rouge sombre au col) ; l'oiseleur
  (doigts bagués, cage à hirondelle, cages vides à la ceinture) ; la pilote de la Compagnie (même veste et même broche
  qu'Ossiane) ; la boulangère (fichu crème, corbeille de pains) ; le copiste (manteau bleu ardoise, manchettes noires,
  tissu et plume) ; la Veuve Grêle (la cinquantaine, cheveux gris de fer, manteau de toile cirée aux manches cousues de
  grêlons de fer, chaîne de boules de fer) ; le pirate (maigre, foulard rouge passé, grappin) ; la Mante-ailes (grise et
  brune plus que verte, ailes translucides en lames, yeux rouges). Décors : la Tour des Vents en spirale de cristal bleu
  à porte d'or pâle ; le Temple, une rotonde de pierre pâle sous un dôme, ouverte entre les colonnes, rubans bleus ; la
  maison-voile, un toit de toile tendue rayé de bleu et une petite tourelle à lanterne ; le moulin Plume-Vive à quatre
  ailes de toile ; la vigie sur quatre pieds, toit de toile ; l'arche, un bandeau d'or pâle sans lettres (le panneau
  garde la phrase de la Charte), des cristaux et des lanternes aux poteaux ; le mât d'amarrage à chapeau de cuivre ; la
  machine volante, une aile de toile et deux cristaux sous le cadre ; le garde-fou du Lâcher, une lanterne et des
  cristaux à chaque tronçon ; les dalles bleu-gris de la Haute-Île ; l'herbe pâle des îlots. L'illustration : le Quai au
  crépuscule, un dirigeable gris à quai, trois voyageurs qui descendent, la Gardienne qui les accueille, les îles portées
  par de grands cristaux bleus, des ponts de corde, des jardins suspendus, le moulin, la Tour des Vents au sommet de l'île
  la plus haute, des voiles qui volent comme des oiseaux. Les fonds : la mer de nuages au crépuscule ; le pays de cendre
  vu de haut, des rails à demi enterrés (quelques cristaux violets dans les coins).
- **Vu au passage** : beaucoup de lanternes à flamme (à la ceinture de l'attrapeur, de la boulangère, du copiste, de
  l'oiseleur, au sac du cartographe ; aux tronçons du garde-fou, à l'arche, à la vigie, au jardin suspendu, à la
  tourelle de la maison-voile) : le texte n'exclut pas le feu à Aetherhaven, gardées. Le fond d'Aetherhaven est un
  crépuscule, à toute heure (le jeu assombrit la nuit). Sur le Quai, le quai de bois (`planches`, hors lot) tranche,
  très orange, sur les nuages. Vue de dos, l'enfant au collier porte son cristal dans le dos (un point bleu à 42 px). Le
  pont fait à peu près la moitié de la largeur de la case : il se lit bien.

## Lot Coralia (2026-11-08, 64 images, 40,25 crédits, solde 1 905,11)

Un lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots »). Le solde est
celui du compte après le lot (1 968,11 avant) ; le lot d'Aetherhaven tournait en même temps sur le même compte : les
40,25 crédits sont comptés tâche par tâche (tableau) ; prévu 40,25 (dont 0,5 économisé : `pont-arche-r` est
`pont-arche-c` tourné), plus 0,5 de reprise (1 image), plafond 51. Outil : Higgsfield MCP, `gpt_image_2_6`, six tâches
en cours au plus. Bruts : `assets/raw/coralia/` (local) ; tailles et préréglages : `scripts/art/coralia.json` ; traités
par `npm run art`, `npm run tiles`, `npm run lots`.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf les sols, le mur et les planches de marche), et « No text, no
  letters, no logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à
  la fin de tous.
- **Personnages** : « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body
  character, three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She
  stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » (le Murmureur : « The
  figure stands… ») ; **décors** : « single object centered, isolated on a transparent background: <sujet>. Simple
  readable shape for a small game sprite. It stands directly on the bottom of the image… » ; les trois **bateaux** (« à
  flot ») finissent par « It floats with its waterline exactly at the bottom of the image: the hull cut straight at the
  waterline, no keel visible, no water, no reflection, no cast shadow. ».
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes.
  Seamless tileable ground texture, flat top-down orthographic view looking straight down from above, filling the
  entire square edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light
  spot, no cast shadows, no perspective, no horizon. No objects. » ; les rails et le pont avec le sable ou les dalles en
  référence, pour qu'ils se raccordent.
- **Mur** (`vitre-mer`, `kind: "wall"` comme le `mur` des intérieurs) : « … Seamless tileable wall texture, flat front
  orthographic view looking straight at the wall, filling the entire square edge to edge, tiling seamlessly from left to
  right: <sujet>. Perfectly even, uniform lighting…, no perspective, no floor, no ceiling. ».
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: <sujet>, lit by warm lantern light from the
  upper left with cool shadow on the other side. Plain uniform dark ink background color #1B1512. », le personnage en
  pied en référence (`image_references`).
- **Planches de marche** (`docs/gdd/animation.md`) : « Sprite sheet for a 2D isometric game, on a transparent
  background: the same character as in the reference image (<tenue>), full body, seen from slightly above at a 30 degree
  angle, <direction>. Exactly 6 frames of a smooth walking cycle side by side in one single horizontal row, evenly
  spaced, every frame the same size and the same scale, feet on the same baseline, the character identical in every
  frame except the legs, arms and <robe/hair> moving with the steps. No ground, no shadow, no grid lines, no frame
  borders. » ; directions : « walking toward the viewer, facing the viewer » (s), « walking toward the lower right,
  three-quarter front view turned to the right » (se), « walking to the right, seen in side profile facing right » (e),
  « walking toward the upper right, three-quarter back view turned to the right » (ne), « walking away from the viewer,
  seen from behind » (n).
- **Illustration** : le bloc commun, puis le sujet du tableau (qui finit par la phrase du tiers bas sombre).
- **Fond** : « Painted backdrop for the empty edges around an isometric game map: <sujet>; no buildings or figures in
  the center, no focal subject, soft and slightly blurred, darker toward the edges. »

| Fichier (`assets/raw/coralia/`) | Tâche | Réglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `aio.png` | `e88f2cce` | moyenne 1k, transparent, 2:3 | « Aïo, a ten-year-old boy pearl diver of a coral sea city, small and wiry, sun-tanned skin, messy short dark hair still damp with sea water, a cheeky, brave face, a faded turquoise sleeveless tunic and knee-length rolled-up canvas trousers, barefoot, an empty woven wicker basket held under one arm » | 0,5 |
| `euria.png` | `f45c90cb` | moyenne 1k, transparent, 2:3 | « Euria Sel-Doux, a priestess of a whispering deep-sea faith, a woman in her forties with pale sandy-blond hair tied back, wearing a smooth mask carved from a large pale pink seashell that covers her whole face except two eye openings through which her tired eyes show, a long dark sea-blue robe under a short mantle of woven grey cord, empty hands held calmly in front of her » | 0,5 |
| `matteo.png` | `f421bc44` | moyenne 1k, transparent, 2:3 | « Matteo Marée-Haute, a sailors' union delegate of a coral harbour city, a lean sun-tanned man in his late thirties with short brown hair and stubble, a shrewd, friendly half-smile, a dark navy-blue wool sailor's smock with rolled sleeves, a dark sailor's cap tilted over one ear, dark trousers and worn boots » | 0,5 |
| `marina-azurios.png` | `3302a72d` | moyenne 1k, transparent, 2:3 | « Marina Azurios, the Grand Admiral of a maritime nation, a woman of fifty-eight and a former merchant captain, short silver-grey hair, a sun-tanned weathered face with deep lines and a tired, determined gaze, an impeccable long white admiral's uniform coat with gold buttons and gold braid, a small golden trident badge on her chest, standing very straight, reading a folded report held in one hand » | 0,5 |
| `gunnar.png` | `622f208c` | moyenne 1k, transparent, 2:3 | « Gunnar, the second mate of a confiscated ship from a grim iron-forging empire, held on parole in a foreign harbour, a tall gaunt man in his late forties, short dirty-blond hair and a blond stubble beard, pale skin, a bitter, weary face, a long grey wool sailor's pea coat with the collar turned up, a faded rust-red scarf, dark trousers and heavy boots, hands in his coat pockets » | 0,5 |
| `murmureur.png` | `7bd86666` | moyenne 1k, transparent, 2:3 | « a priest of a whispering deep-sea faith, a tall figure in a long hooded robe of deep sea-blue under a short mantle of woven grey cord, the face entirely hidden behind a smooth mask carved from a large pale cream seashell with two narrow eye slits, a few strands of grey hair escaping the hood, hands hidden in wide sleeves » | 0,5 |
| `selenide.png` | `7c9b4f15` | moyenne 1k, transparent, 2:3 | « a woman of a sea people, slender, pale blue-grey pearly skin glistening as if still wet, fine gill slits on the sides of her neck, softly glowing pale cyan eyes, long pale silver-blue hair floating and rippling around her head as if underwater, a tired look, a simple sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, empty hands » | 0,5 |
| `noea.png` | `f960f8c8` | moyenne 1k, transparent, 2:3 | « Noéa Perlemer, the innkeeper of a seaside tavern in a coral city, a Maréenne woman of about forty with warm golden skin, thick dark brown hair pinned up with a string of small seashells, small white pearl earrings, a laughing but tired face, a faded sea-blue dress with the sleeves rolled up and a stained off-white apron, wiping a pewter mug with a cloth » | 0,5 |
| `aureo.png` | `0908e20c` | moyenne 1k, transparent, 2:3 | « Auréo Brisevague, a ship carpenter of a coral sea city, a broad weathered man in his fifties, sun-darkened skin, short grey hair and a short beard crusted white with sea salt, bare-chested under a worn leather work apron, rolled canvas trousers, a heavy wooden mallet in one hand, a few wooden pegs tucked in his belt » | 0,5 |
| `oaina.png` | `7af44611` | moyenne 1k, transparent, 2:3 | « Oaïna, a woman of a sea people who keeps a hall of memory conches, slender, pale bluish pearly skin, fine gill slits on the sides of her neck, softly glowing pale cyan eyes, long silver-white hair floating and rippling around her head as if underwater, a long flowing deep-blue robe with turquoise trim, holding a large pale spiral conch shell against her chest » | 0,5 |
| `merande.png` | `216ace2e` | moyenne 1k, transparent, 2:3 | « Captain Mérande Fond-de-Cale, captain of the harbour customs of a maritime nation, a stern woman in her forties with dark hair in a tight bun, a weathered face with a sharp, watchful gaze, a fitted azure-blue officer's jacket with gold braid on the cuffs and shoulders, dark trousers and tall boots, an iron key hanging at her belt, holding a small slate tablet and a stick of chalk » | 0,5 |
| `ondine.png` | `41bca782` | moyenne 1k, transparent, 2:3 | « Ondine Perle-Noire, the elder of the pearl divers, an old woman of a half-abyssal sea people, in her seventies, lean and wiry, pale grey-blue skin, long straight white hair, fine gill slits just below her ears, a hard, unsmiling face lined by the sea, a necklace of large black pearls, a simple sleeveless dark teal tunic belted with rope over knee-length trousers, bare forearms with old pale coral scratches, barefoot » | 0,5 |
| `portrait-matteo.png` | `9111d310` | haute 1k, opaque, 1:1, `matteo.png` (`f421bc44`) en référence | « the same man as in the reference image, Matteo Marée-Haute, delegate of a sailors' union, same face, same hair, same clothes and the same dark cap tilted over one ear, a shrewd, friendly half-smile and the watchful eyes of a man who counts what the winter will cost » | 1,5 |
| `portrait-aio.png` | `4fa9f234` | haute 1k, opaque, 1:1, `aio.png` (`e88f2cce`) en référence | « the same boy as in the reference image, Aïo, a ten-year-old pearl diver, same face, same damp messy dark hair, same clothes, the empty wicker basket against his side, a bold, cheeky grin that hides his worry for his sick mother » | 1,5 |
| `portrait-euria.png` | `a3e3ba55` | haute 1k, opaque, 1:1, `euria.png` (`f45c90cb`) en référence | « the same woman as in the reference image, Euria Sel-Doux, a priestess of a whispering deep-sea faith, same pale pink seashell mask covering her face except the eyes, same hair, same robe and mantle, her tired, grave eyes visible through the mask, as if listening to something very large breathing far below » | 1,5 |
| `portrait-marina-azurios.png` | `4813078f` | haute 1k, opaque, 1:1, `marina-azurios.png` (`3302a72d`) en référence | « the same woman as in the reference image, Marina Azurios, Grand Admiral of a maritime nation, same face, same short silver-grey hair, same white admiral's uniform with gold braid and the small golden trident badge, the tired, determined, guarded gaze of a leader waiting for an answer that never comes » | 1,5 |
| `portrait-gunnar.png` | `04c1194e` | haute 1k, opaque, 1:1, `gunnar.png` (`622f208c`) en référence | « the same man as in the reference image, Gunnar, a second mate held on parole far from home, same face, same dirty-blond hair and stubble, same grey pea coat with the collar turned up and the faded rust-red scarf, a bitter, haunted, weary gaze » | 1,5 |
| `marche-selenide-port/s.png` | `07d66688` | moyenne 1k, transparent, 21:9, `selenide.png` (`7c9b4f15`) en référence | « vers le spectateur ; tenue : a slender woman with pale blue-grey pearly skin, fine gill slits on the neck, glowing pale cyan eyes, long pale silver-blue hair floating as if underwater, a sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, same face, same proportions and colors ; « legs, arms and hair moving » » | 0,5 |
| `marche-selenide-port/se.png` | `b666f5f7` | moyenne 1k, transparent, 21:9, `selenide.png` (`7c9b4f15`) en référence | « bas-droite, trois quarts face ; tenue : a slender woman with pale blue-grey pearly skin, fine gill slits on the neck, glowing pale cyan eyes, long pale silver-blue hair floating as if underwater, a sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, same face, same proportions and colors ; « legs, arms and hair moving » » | 0,5 |
| `marche-selenide-port/e.png` | `a63a7182` | moyenne 1k, transparent, 21:9, `selenide.png` (`7c9b4f15`) en référence | « profil vers la droite ; tenue : a slender woman with pale blue-grey pearly skin, fine gill slits on the neck, glowing pale cyan eyes, long pale silver-blue hair floating as if underwater, a sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, same face, same proportions and colors ; « legs, arms and hair moving » » | 0,5 |
| `marche-selenide-port/ne.png` | `35d18621` | moyenne 1k, transparent, 21:9, `selenide.png` (`7c9b4f15`) en référence | « haut-droite, trois quarts dos ; tenue : a slender woman with pale blue-grey pearly skin, fine gill slits on the neck, glowing pale cyan eyes, long pale silver-blue hair floating as if underwater, a sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, same face, same proportions and colors ; « legs, arms and hair moving » » | 0,5 |
| `marche-selenide-port/n.png` | `0870f2df` | moyenne 1k, transparent, 21:9, `selenide.png` (`7c9b4f15`) en référence | « de dos ; tenue : a slender woman with pale blue-grey pearly skin, fine gill slits on the neck, glowing pale cyan eyes, long pale silver-blue hair floating as if underwater, a sleeveless sea-green tunic wrapped at the waist over loose knee-length trousers, barefoot, same face, same proportions and colors ; « legs, arms and hair moving » » | 0,5 |
| `marche-murmureur-canaux/s.png` | `31e8eca0` | moyenne 1k, transparent, 21:9, `murmureur.png` (`7bd86666`) en référence | « vers le spectateur ; tenue : a tall figure in a long hooded deep sea-blue robe under a short mantle of woven grey cord, the face hidden behind a smooth pale cream seashell mask with two narrow eye slits, hands hidden in wide sleeves, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-murmureur-canaux/se.png` | `f30f69d5` | moyenne 1k, transparent, 21:9, `murmureur.png` (`7bd86666`) en référence | « bas-droite, trois quarts face ; tenue : a tall figure in a long hooded deep sea-blue robe under a short mantle of woven grey cord, the face hidden behind a smooth pale cream seashell mask with two narrow eye slits, hands hidden in wide sleeves, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-murmureur-canaux/e.png` | `4c56ff82` | moyenne 1k, transparent, 21:9, `murmureur.png` (`7bd86666`) en référence | « profil vers la droite ; tenue : a tall figure in a long hooded deep sea-blue robe under a short mantle of woven grey cord, the face hidden behind a smooth pale cream seashell mask with two narrow eye slits, hands hidden in wide sleeves, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-murmureur-canaux/ne.png` | `563d3eb0` | moyenne 1k, transparent, 21:9, `murmureur.png` (`7bd86666`) en référence | « haut-droite, trois quarts dos ; tenue : a tall figure in a long hooded deep sea-blue robe under a short mantle of woven grey cord, the face hidden behind a smooth pale cream seashell mask with two narrow eye slits, hands hidden in wide sleeves, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `marche-murmureur-canaux/n.png` | `71b39e84` | moyenne 1k, transparent, 21:9, `murmureur.png` (`7bd86666`) en référence | « de dos ; tenue : a tall figure in a long hooded deep sea-blue robe under a short mantle of woven grey cord, the face hidden behind a smooth pale cream seashell mask with two narrow eye slits, hands hidden in wide sleeves, same proportions and colors ; « legs, arms and robe moving » » | 0,5 |
| `pecheur.png` | `ac659b22` | moyenne 1k, transparent, 2:3 | « a fisherman of a coral harbour city, a weathered man in his forties with sun-darkened skin and short dark hair, a tired but calm face, an olive-green oilcloth smock, rolled trousers, bare feet, a long wooden fishing rod resting over his shoulder » | 0,5 |
| `marchande-poisson.png` | `90d83074` | moyenne 1k, transparent, 2:3 | « a fish seller of a coral harbour city, a sturdy woman in her fifties with brown hair tied back under a plain blue kerchief, a loud, weary face, a sand-coloured dress with a stained canvas apron, sleeves rolled up, a flat wicker basket of silver fish held at her hip » | 0,5 |
| `matelot.png` | `6e6bf823` | moyenne 1k, transparent, 2:3 | « a young sailor of a maritime nation, sun-tanned, short dark hair, a weary face, a loose off-white canvas shirt with the sleeves rolled up, a dark blue sash at the waist, dark blue trousers, worn boots, a blue knitted cap, empty hands » | 0,5 |
| `plongeuse.png` (écarté) | `fd973c52` | moyenne 1k, transparent, 2:3 | « a pearl diver of a coral harbour city, a lean strong woman in her twenties, sun-tanned skin, wet black hair tied back, a determined, tired face, a simple practical sleeveless dark teal tunic over knee-length trousers, barefoot, a string net bag for oysters hanging at her belt » | 0,5 |
| `amande.png` | `630d7a6c` | moyenne 1k, transparent, 2:3 | « Amande, a young widow of a coral harbour city, a woman in her thirties with light brown hair, a pale grieving face with red-rimmed eyes, a plain black mourning dress and a black shawl over her head and shoulders, both hands clasped tightly together at her chest around a small silver ring » | 0,5 |
| `tadeo.png` | `e99d0335` | moyenne 1k, transparent, 2:3 | « Tadéo, a poor pearl diver, a thin wiry man in his thirties, dark hair cropped short, sunken cheeks and a guilty, evasive look, hands scarred and scratched by coral, a faded grey sleeveless shirt and rolled canvas trousers, barefoot, a diver's knife in a sheath at his belt, a bundle of brown fishing net and a wooden netting needle in his hands » | 0,5 |
| `iris-coquelune.png` | `841310ef` | moyenne 1k, transparent, 2:3 | « Iris Coquelune, a sick mother, a thin pale woman in her thirties, loose dark brown hair, dark circles under her eyes, a gentle, exhausted face, a plain pale linen nightdress with a knitted blue shawl wrapped around her shoulders, barefoot, one hand held to her chest » | 0,5 |
| `doucenet.png` | `124b9a7d` | moyenne 1k, transparent, 2:3 | « Doucenet, a greedy shipowner, a portly man in his fifties with slicked-back grey hair, a smug, calculating face, a fine plum-coloured coat with brass buttons over a cream waistcoat, several heavy gold rings on his fingers, counting a few gold coins in one open palm » | 0,5 |
| `basile.png` | `018c4a2c` | moyenne 1k, transparent, 2:3 | « Basile Chante-Creux, a very old sailor in his eighties, slightly stooped, white hair and a long white beard, a deeply lined sun-darkened face with a faraway gaze, a faded dark blue sailor's jacket, a white knitted scarf, patched trousers and worn boots, empty hands resting together » | 0,5 |
| `lio.png` | `3f153b13` | moyenne 1k, transparent, 2:3 | « Lio, a twelve-year-old boy, a novice of a whispering deep-sea faith, thin and frightened, pale skin, short dark brown hair, downcast eyes, a plain dark sea-blue novice robe with a grey cord belt, barefoot, arms held close to his body » | 0,5 |
| `abyssal.png` | `9033c13c` | moyenne 1k, transparent, 2:3 | « an Abyssal, a fanatic of a sect that worships the devouring sea abyss, a gaunt hunched figure in a tattered dark green-black robe soaked with sea water and hung with strands of seaweed, a mask carved from a black seashell covering the whole face with two small pale glowing eye holes, a curved dagger of sharpened black shell held low in one hand, menacing » | 0,5 |
| `corail-dalles.png` | `376ab5ac` | moyenne 1k, opaque, 1:1, vue de dessus | « pale flagstones of fossilised coral, irregular rounded slabs of cream and off-white stone fitted together with narrow joints, the stone full of fine fossil coral pores and branching patterns, a few faint pink coral tints and pale salt stains, worn smooth by many feet » | 0,5 |
| `sable-mouille.png` | `4f7bfb5c` | moyenne 1k, opaque, 1:1, vue de dessus | « wet grey-beige sand of a beach at low tide, soft ripple marks left by the retreating sea, a few shallow glistening puddles, scattered small white shell fragments and a few thin strands of dark green seaweed » | 0,5 |
| `vitre-mer.png` | `e948ef33` | moyenne 1k, opaque, 1:1, mur vu de face | « a great underwater window of thick greenish sea glass, through which the deep blue-green sea can be seen, with dark green seaweed rising from the bottom and two small golden fish, a narrow band of pale fossilised coral stone along the top edge and along the bottom edge » | 0,5 |
| `maison-corail.png` | `35c772df` | moyenne 1k, transparent, 2:3 | « a house of a coral sea city, built of pale cream fossilised coral with rounded walls, a curved roof shaped like a billowing pink-coral sail, gold-painted trim along the roof edge, two round windows of greenish sea glass glowing softly, an arched blue wooden door, small branches of pink coral growing on the walls, weathered and salt-stained » | 0,5 |
| `plongeuse-v2.png` | `05bde547` | moyenne 1k, transparent, 2:3 | « a pearl diver of a coral harbour city who dives holding her breath, a lean strong woman in her twenties, sun-tanned skin, wet black hair tied back, a determined, tired face, a simple practical sleeveless dark teal tunic over knee-length trousers, barefoot, a small empty string net bag for oysters hanging at her belt, empty hands, no diving helmet, no diving equipment » | 0,5 |
| `maison-corail-bleue.png` | `d1ec3524` | moyenne 1k, transparent, 2:3 | « a house of a coral sea city, built of off-white fossilised coral with rounded walls, a curved roof shaped like a billowing deep azure-blue sail, turquoise trim along the roof edge, two round windows of greenish sea glass glowing softly, an arched blue wooden door, a few pale shells set in the walls, weathered and salt-stained » | 0,5 |
| `palais-nacre.png` | `467cb362` | moyenne 1k, transparent, 2:3 | « the palace of the Grand Admiral of a maritime nation: a colossal upright seashell of iridescent mother-of-pearl, its ribs fanning up from the base, a tall arched golden doorway at its foot, a band of gold around its middle, small round sea-glass windows, faint salt stains and wear » | 0,5 |
| `temple-abysse.png` | `a5ca69b0` | moyenne 1k, transparent, 2:3 | « the temple of a whispering deep-sea faith: a squat building of dark blue-grey stone crowned by a low dark dome, a large luminous pale cyan window shaped like an eye glowing on the dome, a dark turquoise doorway, strands of seaweed and barnacles on the stone, ominous and quiet » | 0,5 |
| `salle-conques.png` | `5ebd331a` | moyenne 1k, transparent, 2:3 | « the hall of memory conches of a coral sea city: a low wide hall of pale fossilised coral with a curved pink-coral roof shaped like a sail, its front wall a great window of thick greenish sea glass through which deep blue water and small golden fish can be seen, a large pale spiral conch shell as an ornament on the roof ridge » | 0,5 |
| `entrepot.png` | `7a426f12` | moyenne 1k, transparent, 2:3 | « a heavy customs warehouse on a harbour quay: thick weathered walls of grey stone and pale coral blocks, a low pitched slate roof, large iron-bound double wooden doors, a round gilded seal showing a stylised wave above the doors, salt stains and dark damp marks at the base » | 0,5 |
| `rail-noye-v.png` | `9da80f4f` | moyenne 1k, opaque, 1:1, vue de dessus, `sable-mouille.png` (`4f7bfb5c`) en référence | « a single old railway track running straight from the top edge to the bottom edge, centered: two heavily rusted iron rails on rotting dark wooden sleepers, half buried in the same wet grey-beige sand as in the reference image, strands of dark green seaweed caught on the rails, small shells and glistening puddles between the sleepers » | 0,5 |
| `rail-noye.png` | — | `rail-noye-v.png` tournée d’un quart (sharp), pour les rails le long des rangées | — | 0 |
| `pont-arche-c.png` | `1c417033` | moyenne 1k, opaque, 1:1, vue de dessus, `corail-dalles.png` (`376ab5ac`) en référence | « a narrow arched footbridge of pale fossilised coral stone running straight from the top edge to the bottom edge, centered, occupying the middle half of the image width: a walkway paved with the same pale coral flagstones as in the reference image, a low carved coral parapet along each side; on the left and right quarters of the image, dark teal-blue canal water (#1a505f) with fine pale ripples » | 0,5 |
| `pont-arche-r.png` | — | `pont-arche-c.png` tournée d’un quart (sharp), pour les ponts le long des rangées | — | 0 |
| `bateau.png` | `48e025bd` | moyenne 1k, transparent, 1:1, à flot | « a small wooden fishing sailboat moored afloat, seen at a three-quarter angle: a weathered brown wooden hull with a thin gold-painted stripe, a single mast with an off-white sail, coils of rope and a folded fishing net on the deck » | 0,5 |
| `maison-bateau.png` | `be4b0d4d` | moyenne 1k, transparent, 1:1, à flot | « a houseboat of a coral sea city: a small cabin of bleached driftwood planks with a curved turquoise roof shaped like a sail, a copper door and a round porthole window, set on a broad weathered wooden hull, a few pots of sea plants and hanging shells on the deck » | 0,5 |
| `chantier.png` | `e507372e` | moyenne 1k, transparent, 1:1 | « the hull of an unfinished wooden ship in a shipyard, resting on slanted wooden props and trestles, bare curved ribs at one end and fresh pale planks on the other » | 0,5 |
| `filet-peche.png` | `e6c45fa5` | moyenne 1k, transparent, 1:1 | « a brown fishing net hung to dry between two weathered wooden poles, the net sagging in a curve, a few cork floats and small shells caught in the mesh » | 0,5 |
| `autel-corail.png` | `c2a4bd4a` | moyenne 1k, transparent, 1:1 | « a small sea altar: a low block of weathered pink coral stone, three branches of pink coral rising from it, a pale white shell laid on top as an offering, a few strands of dry seaweed » | 0,5 |
| `lanterne-coquillage.png` | `6bea2d19` | moyenne 1k, transparent, 2:3 | « a tall street lantern of a coral sea city: a slender weathered wooden post topped by a lantern made of a large pale translucent seashell, glowing softly from within with a pale turquoise crystal light, small brass fittings » | 0,5 |
| `conque.png` | `38ba5e21` | moyenne 1k, transparent, 1:1 | « a large pale pink spiral conch shell resting on a small turned wooden pedestal stand, the inside of the shell glossy, a few faint salt stains » | 0,5 |
| `caisse-plomb.png` | `f2d67aa9` | moyenne 1k, transparent, 1:1 | « an old heavy crate sheathed in dull grey lead plates over dark salt-eaten wood, bound with two worn leather straps where strands of wet green seaweed are still caught, small barnacles on the corners, wet and glistening, no markings » | 0,5 |
| `cargo-noir.png` | `01d9abae` | moyenne 1k, transparent, 1:1, à flot | « a confiscated steam cargo ship rotting at anchor: a long black iron hull streaked with rust, a thin rust-red stripe along the hull, a dark cabin superstructure with dark portholes, a single tall cold black funnel with no smoke, a dark oily stain running down the side » | 0,5 |
| `grotte.png` | `f4c7cc58` | moyenne 1k, transparent, 1:1 | « the entrance of a sea cave revealed at low tide: a rough arch of dark wet black rock, a deep pitch-black opening, curtains of dark green seaweed hanging from the rock, clusters of mussels and small shells, glistening wet surfaces » | 0,5 |
| `banc-perles.png` | `9353330d` | moyenne 1k, transparent, 1:1 | « a small low cluster of grey pearl oysters piled together, rough layered shells, one oyster half open showing a glossy white pearl inside, a few strands of seaweed, wet and glistening » | 0,5 |
| `rocher-mouille.png` | `94f1550b` | moyenne 1k, transparent, 1:1 | « a large wet boulder of dark grey rock on a sea shore, rounded and rough, streaks of dark green seaweed and patches of small barnacles and mussels at its base, glistening wet » | 0,5 |
| `coralia-arrivee.png` | `f7162fe0` | haute 2k, opaque, 16:9 | « The arrival by sea at the Grand Port of a great city built of pale fossilised coral on a cluster of islands, in the early morning at low tide: seen from the deck of an arriving ship, stone quays and wooden jetties with moored fishing sailboats and houseboats, a black confiscated steam cargo ship rotting at anchor to one side; beyond the quays, white, cream and pink coral houses with curved roofs shaped like sails climb the islands, linked by canals and arched coral bridges; on the highest island, a colossal palace shaped like an upright iridescent mother-of-pearl seashell catches the first pale light; farther, a squat dark domed temple with a glowing eye-shaped window; the retreating tide has bared wet sand, dark rocks and old rusty railway rails that run down into the sea; soft turquoise shell lanterns still glow along the quays, a cool morning mist on the water. Small figures of sailors, fishermen and divers only, no one in the foreground. The lower third is darker, calm water and shadow, leaving room for a dialogue panel. » | 2,75 |
| `fond-coralia.png` | `2a1746ee` | haute 1k, opaque, 16:9 | « the open sea and its coral reefs seen from very high above, deep blue-green water, pale turquoise shallows over wide pale coral reefs and sandbars, soft lines of white foam, the dark blue of the deep between the reefs, faint ripples » | 1,5 |

**Dans le jeu** : 47 tuiles (46 images : `pont-arche-r` est `pont-arche-c` tourné, `rail-noye` est `rail-noye-v`
tourné), 5 portraits (Matteo, Aïo, Euria, Marina Azurios, Gunnar), les planches de marche du Murmureur des Canaux et de
la Sélénide du port (`public/sprites/figurant-{murmureur-canaux,selenide-port}.png`, `src/data/figurants.json`), le
fond `public/fonds/coralia.jpg` (le port, les Canaux, l'Amirauté, la voie noyée), l'illustration
`public/illustrations/coralia-arrivee.jpg` sur le premier mot de la capitaine Mérande (`merande.json`, nœud `accueil`).

**Bilan** :
- **Reprise (1, 0,5 crédit)** : la plongeuse, sortie avec un casque de scaphandre de laiton à la main : aucun texte ne le
  lui donne, et elle plonge en apnée (« Quatre minutes, aujourd'hui. ») ; refaite les mains vides, « no diving helmet,
  no diving equipment ». **Détourages sans nouvelle image** : Marina Azurios et Tadéo, sortis avec un halo clair autour
  des jambes, sont traités par `"matte": true` ; la direction `se` du Murmureur avait un voile clair semi-transparent
  sur près de la moitié de l'image : détourée sur place par le même procédé que `matte` (le script de la marche ne le
  fait pas) ; l'image d'origine reste à côté, `marche-murmureur-canaux-se-brut.png`.
- **L'illustration** est sur `src/data/dialogues/merande.json`, nœud `accueil` (« Douanes de l'Amirauté. Rien à
  déclarer, j'espère ? Ne mentez jamais en mer : le quai, c'est déjà la mer. »). Au Grand Port, on arrive en navire
  (`entree`, (9, 6)) et personne n'accueille comme Véline ou Boulon : Gunnar, le plus proche, regarde le Cargo Noir ;
  Marina Azurios dit bien « Bienvenue à Coralia », mais au Palais, à l'Amirauté. La capitaine des douanes est celle qui
  reçoit les voyageurs sur le quai, et le journal envoie d'abord à « l'Entrepôt des douanes, sur le quai du sud »
  (`fil.json`), qu'elle garde. Le nœud `garde` (quête active, porte fermée) ne l'a pas ; `accueil` revient après la
  quête, comme celui de Véline.
- **Sortes vérifiées** (le calcul automatique en donnait d'autres) : `banc-perles` est un objet bas posé sur le sable
  (`petit`), pas un personnage (son « PNJ » n'est que le nom de son dialogue) ; `conque`, une conque sur un pied tourné
  (objet) ; `vitre-mer`, un pan de mur (`kind: "wall"`) : la grande vitre du fond de la Salle des Conques, continue d'un
  bloc à l'autre ; `abyssal`, un ennemi humain (personnage en pied, 2:3) ; `bateau`, `maison-bateau` et `cargo-noir`
  sont à flot, sans ombre ; `rail-noye` et `pont-arche-r` courent le long des rangées (images tournées, raccord
  `horizontal`), `pont-arche-c` le long des colonnes ; `aio` et `lio` en `enfant`.
- **Tuiles partagées** : `aio` sert aussi à « un enfant des Canaux » ; `noea`, à la chanteuse de la Conque ; `matelot`,
  au matelot et à « une garde de l'Amirauté » : peint en homme (à séparer plus tard si Cyril le souhaite) ; `murmureur`,
  au Murmureur et à la Murmureuse : capuche et masque, aucun visage ; `selenide`, à la Sélénide du port et au Sélénide
  des Récifs : peinte en femme (la planche de marche est la sienne) ; `caisse-plomb` sert aussi au quai sept (la même
  caisse) : sans aucune marque (le texte dit « Sur le couvercle, frappé : 7 », mais aucun chiffre dans les images).
- **Le chantier** : ses deux cases sont l'une derrière l'autre à l'écran ((22, 7) et (23, 8)) ; la coque peinte à
  56 px faisait une tour avec la maison voisine : réduite à 38 px de haut, sans nouvelle image.
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : Noéa (Maréenne à la peau
  dorée et aux perles d'oreilles, comme son texte ; chignon brun piqué de coquillages, robe bleu de mer, tablier, chope
  et torchon) ; Aïo (dix ans, cheveux noirs mouillés, tunique turquoise sans manches, pantalon roulé, pieds nus, panier
  vide sous le bras, comme son texte) ; Auréo (la cinquantaine, torse nu sous un tablier de cuir, barbe blanchie de sel,
  maillet, comme son texte) ; Oaïna (Sélénide : peau bleutée nacrée, branchies, yeux luminescents, cheveux qui flottent
  comme dans l'eau, comme son texte ; longue robe bleu profond, une conque contre elle) ; Euria (masque de coquillage rose
  qui couvre tout le visage sauf les yeux, cheveux blond cendré, robe bleu de mer, mantelet de cordelette ; son portrait
  garde le masque) ; Mérande (la quarantaine, chignon noir, veste azur à galons d'or, clé à la ceinture, ardoise et
  craie, comme son texte) ; Matteo (la trentaine, vareuse bleu marine à col marin, casquette sur l'oreille, comme son
  texte) ; Ondine (vieille, peau gris-bleu, longs cheveux blancs, collier de perles noires, branchies fines, comme son
  texte ; tunique de plongeuse sarcelle) ; Marina Azurios (58 ans et ancienne capitaine de la marine marchande, d'après
  la fiche de Marisol [NOTION] ; cheveux gris argent courts, long uniforme blanc à épaulettes et galons d'or, un insigne
  au trident d'or, pris à l'emblème de Marisol, un rapport à la main, comme son texte) ; Gunnar (grand, maigre, blond,
  vareuse grise au col relevé, comme son texte ; écharpe rouille) ; Amande (robe et châle de deuil noirs, mains serrées
  sur l'alliance d'argent) ; Tadéo (maigre, mains abîmées par le corail, filet et aiguille, comme son texte ; un couteau
  de plongeur à la ceinture, puisque la bague porte « la lame d'un couteau de plongeur ») ; Iris (pâle, chemise de nuit
  de lin, châle bleu) ; Doucenet (bedonnant, manteau prune, bagues d'or, pièces au creux de la main) ; Basile (très
  vieux, barbe blanche, veste bleue délavée, écharpe blanche) ; Lio (douze ans, robe de novice bleu de mer, pieds nus) ;
  l'Abyssal (robe en lambeaux chargée d'algues, masque de coquillage noir aux yeux pâles, dague de coquillage noir) ;
  les passants (le pêcheur à la canne, la marchande au panier de poissons et au foulard bleu uni, la Sélénide en tunique
  vert d'eau, le matelot en chemise écrue, ceinture et bonnet bleus (une petite ancre brodée sur la ceinture), la
  plongeuse, le Murmureur à capuche et masque de coquillage crème). Décors : les maisons de corail aux toits en voile
  (rose, ou bleu azur) et aux fenêtres rondes de verre de mer ; le Palais en coquille nacrée à porte d'or, petites tours
  et fanions sans signe ; le Temple à dôme sombre et grand œil cyan ; la Salle des Conques au toit en voile rose, à la
  grande vitre aux poissons d'or, une conque sur le faîte ; l'Entrepôt de pierre grise au sceau doré à la vague ; la
  grande vitre (verre vert de mer, algues, deux poissons d'or, bandeaux de corail) ; la maison-bateau au toit turquoise
  en voile ; le Cargo Noir, un vapeur à coque noire rouillée et cheminée froide (une ancre peinte sur la coque) ; l'autel
  de corail rose et sa coquille ; la lanterne-coquillage à lueur turquoise de cristal ; la conque sur pied tourné ; la
  caisse de plomb sanglée, algues et balanes. L'illustration : l'arrivée en navire au petit matin, à marée basse, le
  Grand Port vu du pont, les maisons de corail en terrasses, le Palais-coquille nacré au sommet, le Temple à l'œil, le
  Cargo Noir à l'ancre, les rails rouillés qui entrent dans la mer ; **des palmiers, des cristaux violets et des
  cheminées qui fument** (inventions), une voile rouge à motif rond. Le fond : la mer et ses récifs vus de très haut,
  des nuages aux coins.
- **Vu au passage** : des lanternes à flamme à la ceinture (Matteo, Noéa, le pêcheur, la marchande, le Murmureur) et
  des cheminées qui fument (une maison de corail, l'Entrepôt, le chantier) : le feu n'est pas exclu à Coralia (Noéa
  grille le poisson « à la braise de bois flotté », un brasero sur le quai). Les dalles de corail peintes sont nettement
  plus claires que le quai du lot 1 (comme le dessin provisoire). La grotte du Grand Reflux est rattachée au fond
  « souterrain », pas encore peint : la console signale `fond-souterrain` absent (déjà vu au lot d'Ironheart). Dans le
  jeu (Chromium) : le Grand Port à marée haute et basse (la grotte, le banc d'huîtres, les rails), les Canaux et leurs
  ponts, l'Amirauté, la Salle des Conques (la vitre, Oaïna, la dame en gris), le Temple, le Palais, la Confrérie, la
  maison Coquelune, l'auberge, l'Entrepôt, la voie noyée, la grotte ; l'accueil de Mérande avec l'illustration ; Euria,
  Marina Azurios, Matteo, Aïo et Gunnar avec leur portrait ; les deux marcheurs ; un combat contre deux Abyssaux ; aucune
  autre erreur ; typecheck et 1079 tests passent.

## Lot Khrysos (2026-11-08, 69 images, 42,75 crédits, solde 1 814,86)

Un lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots ») : Khrysos, le
Cœur de Cristal (chapitre 8) : les Portes de Glace, la surface, les Galeries Chaudes, le Niveau Royal, le Niveau Douze,
les cryptes, la voie sept et leurs intérieurs. Le solde est celui du compte après le lot (1 905,11 avant) ; le lot de
Marche-Mère tournait en même temps sur le même compte : les 42,75 crédits sont comptés tâche par tâche (tableau) ; prévu
42,25 (68 images : 51 tuiles, 5 portraits, 2 planches de marche, l'illustration, le fond), plus 0,5 de reprise (1
image), plafond 53. Outil : Higgsfield MCP, `gpt_image_2_6`, six tâches en cours au plus. Bruts : `assets/raw/khrysos/`
(local) ; tailles et préréglages : `scripts/art/khrysos.json` ; traités par `npm run art`, `npm run tiles`,
`npm run lots`. Les tuiles `edda-khrysos` (la dame en gris) et `glacien` sont du lot de Sept-Portes.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf les sols, le mur et les planches de marche), et « No text, no
  letters, no logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à
  la fin de tous.
- **Personnages** (le Yéti, le Géant et les Elfes compris ; les Yétis avec « a person of a proud people, not a beast ») :
  « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body character,
  three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She/The elf/The
  child stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. ».
- **Objets** et **bâtiments** : « Isometric 2:1 view, single object / building centered, isolated on a fully transparent
  background with no haze, no clouds and no mist: <sujet>. Simple readable shape for a small game sprite. It stands
  directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » ; le Puits d'Ascension et le
  geyser sans la clause sur la brume (leur vapeur fait partie du sujet).
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes.
  Seamless tileable ground texture, flat top-down orthographic view looking straight down from above, filling the
  entire square edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light
  spot, no cast shadows, no perspective, no horizon. No objects. ».
- **Mur** (`mur-glace`, `kind: "wall"` comme le `mur-brique` d'Ironheart) : « … Seamless tileable wall texture, flat
  front orthographic view looking straight at the wall, filling the entire square edge to edge, tiling seamlessly from
  left to right: <sujet>. Perfectly even, uniform lighting…, no perspective, no floor, no ceiling. No objects. ».
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: the same <woman/man/Yeti/girl> as in the
  reference image, <sujet>, same face, same hair, same clothes, lit by warm lantern light from the upper left with cool
  shadow on the other side. Plain uniform dark ink background color #1B1512. », le personnage en pied en référence
  (`image_references`).
- **Planches de marche** (`docs/gdd/animation.md`) : « Sprite sheet for a 2D isometric game, on a fully transparent
  background with no haze and no glow: the same character as in the reference image (<tenue>), full body, seen from
  slightly above at a 30 degree angle, <direction>. Exactly 6 frames of a smooth walking cycle side by side in one
  single horizontal row, evenly spaced, every frame the same size and the same scale, feet on the same baseline, the
  character identical in every frame except the legs, arms and coat moving with the steps. No ground, no shadow, no grid
  lines, no frame borders. » ; hauteur 44 px pour le mineur (un Nain de Glace), 54 pour la marchande (`npm run lots`).
- **Illustration** : bloc commun + sujet + à éviter. **Fond** : « Painted backdrop for the empty edges around an
  isometric game map: <sujet>; no buildings or figures in the center, no focal subject, soft and slightly blurred,
  darker toward the edges. ».

| Fichier (`assets/raw/khrysos/`) | Tâche | Réglage ; préréglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `nain-glace.png` | `64eeecce` | moyenne 1k, transparent, 2:3 ; `enfant`, `maxHeight: 44` | « an Ice Dwarf miner of a frozen city under the ice: a dwarf, short and very stocky with adult proportions and a broad chest, a long thick white beard, a weathered ruddy face, a knitted grey wool cap, an old heavy brown fur-lined coat, much patched, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow hanging at his belt » | 0,5 |
| `glacienne.png` | `f3e13759` | moyenne 1k, transparent, 2:3 ; `personnage` | « a fish seller of the warm market galleries of a frozen city under the ice, a woman in her forties, wisps of blond hair escaping a tan fur-lined hood, a weary closed face, a long plum-coloured padded wool coat, thick wool gloves, a flat wicker basket of silver fish from the frozen sea held at her hip » | 0,5 |
| `hrolda.png` | `30aac14e` | moyenne 1k, transparent, 2:3 ; `personnage` | « Hrolda Rochebrume, keeper of the Ice Library and member of a college of archivists who record what is missing, a straight-backed woman in her sixties, iron-grey hair pulled back tightly, a stern composed face with a level unsmiling gaze, a long plain grey wool robe with a high collar on which nine small shards of mirror are sewn, a grey leather notebook held closed against her chest with one hand, a quill pen in the other hand » | 0,5 |
| `halvard.png` | `64005fb0` | moyenne 1k, transparent, 2:3 ; `personnage` | « Halvard Neigeclaire, a rescuer of the White Vigils who bring back the lost from the frozen surface, a lean weathered man in his forties, short brown hair and a short brown beard, a long white padded coat with a white hood down on his shoulders, a coil of rope over one shoulder, a small crystal lamp with a pale cyan glow hanging at his belt, a worn leather glove held in one hand » | 0,5 |
| `ennir.png` | `ae2c5519` | moyenne 1k, transparent, 2:3 ; `personnage` | « Master Ennir, a Frost Weaver who shapes the cold into lasting forms, a thin gaunt man in his sixties, long white hair tied back, a long dark indigo coat, long pale grey gloves up to the elbows, white frost crystals clinging to his sleeves, holding up a small clear crystal in one gloved hand and touching it with one fingertip of the other as if to make it sing, an absorbed, wary face » | 0,5 |
| `korvek.png` | `2dbe6c6f` | moyenne 1k, transparent, 2:3 ; `colosse` | « Korvek, a Yeti guide of the ice fields, a person of a proud people, not a beast: a towering heavy humanoid two heads taller than a man, covered in long thick white fur that turns sooty grey around the ankles, a broad calm face of dark grey-blue skin with small deep-set patient eyes, mouth closed, heavy coils of rope worn across his chest as bandoliers, a tall wooden guide's staff held upright in one hand, bare furred feet without boots, no other clothing » | 0,5 |
| `torka.png` | `2441f0b7` | moyenne 1k, transparent, 2:3 ; `enfant` | « Torka, a ten-year-old girl who carves animals out of ice, a red knitted wool bonnet over blond hair, round rosy cheeks, a serious concentrated face, a padded blue wool coat, mittens tucked in her belt, holding a small carved ice fox in one hand and a small curved carving knife pointed down in the other, simple child's clothes » | 0,5 |
| `ulga.png` | `df3715c7` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ulga Brasegel, who keeps an inn with a giant fireplace in a frozen city under the ice, a sturdy woman in her fifties, bright rosy red cheeks warmed by the fire, thick honey-blond hair braided and pinned up, sleeves rolled up on strong forearms, a long worn leather apron over a rust-red wool dress, a short fur-trimmed collar, wiping a pewter tankard with a cloth, a brisk warm tired smile » | 0,5 |
| `brodd.png` | `e62f8d53` | moyenne 1k, transparent, 2:3 ; `personnage` | « Brodd, a crystal cutter, a short, stocky, broad man in his fifties, brown hair and a short brown beard, a jeweller's brass loupe screwed into one eye, a thick leather apron over a fur-lined wool vest, sleeves pushed up, holding a small faceted pale blue crystal in one hand and a fine cutting tool in the other » | 0,5 |
| `sigrun.png` | `428518f1` | moyenne 1k, transparent, 2:3 ; `personnage` | « Sigrun, a sixteen-year-old girl wearing her father's heavy brown fur-lined coat, a man's coat far too big for her, the sleeves falling past her hands, the hood down, blond hair in a loose messy braid, frost on her eyelashes, a pale, stubborn, exhausted face, wool trousers and big boots » | 0,5 |
| `crysta.png` | `04daf6c1` | moyenne 1k, transparent, 2:3 ; `personnage` | « Crysta Frostborn, the Primus of the council of a frozen kingdom, a tall Frost Elf woman five and a half centuries old yet ageless: pale skin with a cool bluish tint, long straight hair whiter than snow, slightly pointed ears, a severe calm face with ancient pale eyes, a long flowing robe of white and pale ice-blue with a high stiff collar, a thin circlet of small clear crystal points on her brow, hands folded in front of her » | 0,5 |
| `bjorn.png` | `b5e2f2e4` | moyenne 1k, transparent, 2:3 ; `personnage` | « Bjorn Glaceforge, a blacksmith elected to the council as the voice of the common people, a broad-shouldered man in his early forties, a thick red beard rimed with white frost, short red hair, bare muscular arms despite the cold, a sleeveless dark grey wool tunic under a scorched leather smith's apron, a heavy leather belt, scarred hands empty at his sides » | 0,5 |
| `portrait-hrolda.png` | `c1aeefba` | haute 1k, opaque, 1:1, `hrolda.png` en référence (`30aac14e`) | « the same woman as in the reference image, Hrolda Rochebrume, keeper of the Ice Library, the nine small mirror shards sewn on her high grey collar, iron-grey hair pulled back, a stern level gaze that finishes its line before looking up, precise and unbending, quietly weary » | 1,5 |
| `portrait-halvard.png` | `dff30b38` | haute 1k, opaque, 1:1, `halvard.png` en référence (`64005fb0`) | « the same man as in the reference image, Halvard Neigeclaire of the White Vigils, his white hood down, the coil of rope on his shoulder, frost in his short beard, a frank steady gaze, tired from bringing back the lost, a rough warmth » | 1,5 |
| `portrait-ennir.png` | `35db3da5` | haute 1k, opaque, 1:1, `ennir.png` en référence (`ae2c5519`) | « the same man as in the reference image, Master Ennir, a Frost Weaver, white frost on his sleeves and long gloves, the small clear crystal held near his face, a gaunt wary face, haunted by a master whose name he does not say » | 1,5 |
| `portrait-korvek.png` | `f9928774` | haute 1k, opaque, 1:1, `korvek.png` en référence (`2dbe6c6f`) | « the same Yeti as in the reference image, Korvek, a Yeti guide, his white fur stiff with frost, the ropes across his chest, mouth closed, a calm patient gaze with a dry quiet irony » | 1,5 |
| `dagny.png` (voile blanc semi-transparent : `matte`) | `aea9301b` | moyenne 1k, transparent, 2:3 ; `personnage`, `matte: true` | « Dagny Ferme-Givre, a woman in her forties in mourning, dark hair pinned back, a pale drawn determined face, a long black wool mourning coat buttoned high, a black armband on one sleeve, a thick bundle of rolled petitions held in her arms, no writing visible » | 0,5 |
| `portrait-torka.png` | `c16d1844` | haute 1k, opaque, 1:1, `torka.png` en référence (`2441f0b7`) | « the same girl as in the reference image, Torka, a ten-year-old girl in her red knitted bonnet, rosy cheeks, a serious, stubborn little face, worried for her missing sister, simple child's clothes » | 1,5 |
| `oskarsen.png` | `e8ce17fa` | moyenne 1k, transparent, 2:3 ; `personnage`, `maxWidth: 48` | « the Oskarsens, refugees from the thawing south: a thin worn mother in her thirties with lank brown hair and a gaunt exhausted face, wrapped in three worn grey and brown blankets over her shoulders, a small child of about five pressed against her side under the blankets, only the child's small head showing, simple child's clothes » | 0,5 |
| `marche-mineur-douze/s.png` (voile blanc : détourée sur place, l'originale à côté, `marche-mineur-douze-s-brut.png`) | `80d61672` | moyenne 1k, transparent, 21:9, `nain-glace.png` en référence (`64eeecce`) | tenue « a stocky Ice Dwarf miner with adult proportions, a long thick white beard, a knitted grey wool cap, an old patched brown fur-lined coat, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow at his belt, same face, same proportions and colors » ; « walking straight toward the viewer, front view » ; « legs, arms and coat moving » | 0,5 |
| `marche-mineur-douze/se.png` | `9412b37a` | moyenne 1k, transparent, 21:9, `nain-glace.png` en référence (`64eeecce`) | tenue « a stocky Ice Dwarf miner with adult proportions, a long thick white beard, a knitted grey wool cap, an old patched brown fur-lined coat, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow at his belt, same face, same proportions and colors » ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and coat moving » | 0,5 |
| `marche-mineur-douze/e.png` (voile blanc : détourée sur place, l'originale à côté, `marche-mineur-douze-e-brut.png`) | `d8e27707` | moyenne 1k, transparent, 21:9, `nain-glace.png` en référence (`64eeecce`) | tenue « a stocky Ice Dwarf miner with adult proportions, a long thick white beard, a knitted grey wool cap, an old patched brown fur-lined coat, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow at his belt, same face, same proportions and colors » ; « walking to the right, side profile view facing right » ; « legs, arms and coat moving » | 0,5 |
| `marche-mineur-douze/ne.png` | `a722aadc` | moyenne 1k, transparent, 21:9, `nain-glace.png` en référence (`64eeecce`) | tenue « a stocky Ice Dwarf miner with adult proportions, a long thick white beard, a knitted grey wool cap, an old patched brown fur-lined coat, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow at his belt, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and coat moving » | 0,5 |
| `marche-mineur-douze/n.png` | `bce7cff0` | moyenne 1k, transparent, 21:9, `nain-glace.png` en référence (`64eeecce`) | tenue « a stocky Ice Dwarf miner with adult proportions, a long thick white beard, a knitted grey wool cap, an old patched brown fur-lined coat, sturdy boots, a miner's pick resting on one shoulder, a small crystal lamp with a pale cyan glow at his belt, same face, same proportions and colors » ; « walking straight away from the viewer, back view » ; « legs, arms and coat moving » | 0,5 |
| `marche-marchande-galeries/s.png` | `0ef0a024` | moyenne 1k, transparent, 21:9, `glacienne.png` en référence (`f3e13759`) | tenue « a woman in her forties, a long plum-coloured padded wool coat, a tan fur-lined hood, thick wool gloves, a flat wicker basket of silver fish held at her hip, same face, same proportions and colors » ; « walking straight toward the viewer, front view » ; « legs, arms and coat moving » | 0,5 |
| `marche-marchande-galeries/se.png` | `6e45ae3b` | moyenne 1k, transparent, 21:9, `glacienne.png` en référence (`f3e13759`) | tenue « a woman in her forties, a long plum-coloured padded wool coat, a tan fur-lined hood, thick wool gloves, a flat wicker basket of silver fish held at her hip, same face, same proportions and colors » ; « walking toward the bottom right, three-quarter front view facing right » ; « legs, arms and coat moving » | 0,5 |
| `marche-marchande-galeries/e.png` | `6c1f3aae` | moyenne 1k, transparent, 21:9, `glacienne.png` en référence (`f3e13759`) | tenue « a woman in her forties, a long plum-coloured padded wool coat, a tan fur-lined hood, thick wool gloves, a flat wicker basket of silver fish held at her hip, same face, same proportions and colors » ; « walking to the right, side profile view facing right » ; « legs, arms and coat moving » | 0,5 |
| `marche-marchande-galeries/ne.png` | `8e0b44dd` | moyenne 1k, transparent, 21:9, `glacienne.png` en référence (`f3e13759`) | tenue « a woman in her forties, a long plum-coloured padded wool coat, a tan fur-lined hood, thick wool gloves, a flat wicker basket of silver fish held at her hip, same face, same proportions and colors » ; « walking toward the top right, three-quarter back view facing away to the right » ; « legs, arms and coat moving » | 0,5 |
| `marche-marchande-galeries/n.png` | `ed8c512a` | moyenne 1k, transparent, 21:9, `glacienne.png` en référence (`f3e13759`) | tenue « a woman in her forties, a long plum-coloured padded wool coat, a tan fur-lined hood, thick wool gloves, a flat wicker basket of silver fish held at her hip, same face, same proportions and colors » ; « walking straight away from the viewer, back view » ; « legs, arms and coat moving » | 0,5 |
| `garde-portes.png` | `5ab08c49` | moyenne 1k, transparent, 2:3 ; `personnage` | « a guard of the Ice Gates of a frozen city under the ice, a woman in her thirties, dark hair cut short, a hard watchful face, a long grey-blue uniform greatcoat with a fur-lined hood down, thick grey gloves, leather boots, holding upright an iron spear whose point is a blade of clear ice » | 0,5 |
| `machiniste.png` | `96c4664d` | moyenne 1k, transparent, 2:3 ; `personnage` | « a machinist of the steam elevators of a city under the ice, a woman in her thirties, dark hair tied under a knitted grey cap, soot on her cheeks, a thick wool sweater under a worn leather work overall, heavy boots, a large brass wrench held in one hand » | 0,5 |
| `gardien-cryptes.png` | `53439486` | moyenne 1k, transparent, 2:3 ; `personnage` | « the keeper of the crypts, an old man in his seventies, short white hair and white stubble, a tired gentle lined face, a long dark slate-grey wool robe, a key of black ice hanging on a leather thong against his robe, holding up in one hand a crystal lamp with a pale cyan glow » | 0,5 |
| `pretresse-hiver.png` | `171fa334` | moyenne 1k, transparent, 2:3 ; `personnage` | « a priestess of the Awakened Winter, a woman in her forties, black hair in a long braid, a calm grave face, a long white wool robe, a long blue stole hanging from her shoulders, hands folded in front of her » | 0,5 |
| `geant-glaces.png` | `cd639eba` | moyenne 1k, transparent, 2:3 ; `colosse` | « an Ice Giant, a huge heavy man far taller and broader than a human, a long white beard and white hair, a broad weathered ruddy face, a heavy slate-blue wool coat with a thick tan fur collar, a wide leather belt, enormous boots, empty hands at his sides » | 0,5 |
| `elfe-givre.png` | `f675d754` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Frost Elf of a frozen city, slender and androgynous, pale skin with a cool bluish tint, long straight white hair, slightly pointed ears, a cool appraising face, a fitted long coat of pale ice-blue wool with a white fur collar, grey gloves, empty hands » | 0,5 |
| `enfant-givre.png` | `6341c3d4` | moyenne 1k, transparent, 2:3 ; `enfant` | « a child of about eight of a frozen city under the ice, a padded rust-red wool coat, a blue knitted hood, blond hair, rosy cheeks, a lively mischievous face, mittens, small boots, empty hands, simple child's clothes » | 0,5 |
| `yeti.png` | `79bd2690` | moyenne 1k, transparent, 2:3 ; `colosse` | « a Yeti of a frozen city, a person of a proud people, not a beast: a towering heavy humanoid covered in long thick white fur, a broad calm face of dark grey skin with small deep-set eyes, mouth closed, a plain faded dark blue woollen scarf around his neck, bare furred feet, empty hands » | 0,5 |
| `cristal-lumineux.png` | `cdc0d720` | moyenne 1k, transparent, 2:3 ; `objet`, `maxWidth: 44`, `maxHeight: 64` | « a cluster of three tall luminescent crystals of clear pale cyan rising from a small base of ice, sharp faceted points, glowing softly from within with a pure cold blue light, no lantern, no flame » | 0,5 |
| `cristal-crypte.png` | `c9e5e3b7` | moyenne 1k, transparent, 2:3 ; `objet`, `maxWidth: 50`, `maxHeight: 80` | « a crypt crystal: a tall six-sided block of clear pale blue crystal, taller than a man, its top cut to a point, and held inside it the dim, blurred, shadowy silhouette of a standing person, peaceful, arms at the sides, no face visible, fine white veins in the crystal » | 0,5 |
| `puits-ascension.png` | `c50e16cd` | moyenne 1k, transparent, 2:3 ; `batiment` | « a steam elevator shaft of a city under the ice: a tall open tower of riveted iron girders and copper bars, a pulley wheel at its top, thick cables running down to a small brass elevator cage with a folding lattice door at the bottom, brass pipes and a round pressure gauge without numbers, a thin jet of white steam escaping from a pipe at its base (sans la clause « no haze, no clouds and no mist » : la vapeur est le sujet) » | 0,5 |
| `porte-glace.png` | `50a21a38` | moyenne 1k, transparent, 1:1 ; `batiment` | « a great gate of ice: a massive rounded archway cut into a block of thick translucent blue ice, framed with heavy iron bands and rivets, opening on a dark tunnel that slopes upward, with a faint warm orange glow of heating deep inside the tunnel » | 0,5 |
| `foyer-glace.png` | `ae8a1b3a` | moyenne 1k, transparent, 1:1 ; `batiment` | « the Hearth, a low squat inn of dark heavy timber and grey stone, its walls partly built of blocks of blue ice, a low roof thick with rime and frost, a huge wide stone chimney rising above it with a thin wisp of grey smoke, small windows and an open doorway glowing warm orange with firelight » | 0,5 |
| `maison-glace.png` | `c5bf8fcb` | moyenne 1k, transparent, 2:3 ; `batiment` | « a small dwelling of a city carved under the ice: thick walls of pale blue ice blocks reinforced with a few dark timber beams, a steep pointed roof of white rime-covered ice, a small dark blue wooden door, one small window glowing with a soft cold blue crystal light » | 0,5 |
| `atelier-facettier.png` | `8395beb4` | moyenne 1k, transparent, 2:3 ; `batiment` | « a crystal cutter's workshop of a city under the ice: a narrow facade of dark weathered timber set between walls of blue ice, a steep rime-covered roof, a large cut crystal hanging above the door as a sign, a few heavy fur coats hanging on a rail under the eaves, a window glowing warm and blue, no lettering » | 0,5 |
| `poste-vigiles.png` | `271eb51f` | moyenne 1k, transparent, 2:3 ; `batiment` | « the post of the White Vigils, rescuers of the lost in the snow: a small sturdy guard house of pale grey stone and white ice, a steep white rime-covered roof, a long white coat hung by its shoulders from a pole above the door like a banner, coils of rope and a pair of wooden snowshoes hanging on the wall, a dark blue door » | 0,5 |
| `bibliotheque-glace.png` | `42ab6d9e` | moyenne 1k, transparent, 2:3 ; `batiment` | « the Ice Library: a tall faceted tower of clear blue ice tapering to a spire tipped with a small crystal, through its translucent walls the dim shapes of many archive crystals standing in rows on pedestals, glowing faintly cyan, a narrow dark blue door at its base » | 0,5 |
| `palais-glace.png` | `e61ef2e2` | moyenne 1k, transparent, 2:3 ; `batiment` | « the Ice Palace: the base of an immense palace of clear pale crystal and ice rising into a single tall sharp faceted spire, walls of overlapping crystal facets veined with pale blue, a tall pointed arched doorway of dark blue, cold and majestic » | 0,5 |
| `temple-hiver.png` | `89536bbc` | moyenne 1k, transparent, 1:1 ; `batiment` | « the Temple of the Awakened Winter: a small round temple of white stone with a smooth white dome of packed snow and ice, a six-branched star of frost in pale blue metal on top of the dome, a dark blue door, quiet and austere » | 0,5 |
| `geyser.png` | `58068acb` | moyenne 1k, transparent, 1:1 ; `objet` | « a geothermal steam vent: a round mouth in a slab of dark blue-black ice, ringed with a heavy rusted iron collar with rivets, a soft column of white steam rising straight up from it, the steam with soft but defined edges, nothing else around it (sans la clause « no haze, no clouds and no mist » : la vapeur est le sujet) » | 0,5 |
| `congere.png` | `e485ca1a` | moyenne 1k, transparent, 1:1 ; `meuble`, `maxWidth: 62`, `maxHeight: 40` | « a large wind-carved snowdrift: a long low mound of smooth white snow with a sharp curling crest, soft cool blue-grey shading in its hollows » | 0,5 |
| `sapin-givre.png` | `ff84b347` | moyenne 1k, transparent, 2:3 ; `objet`, `maxWidth: 46`, `maxHeight: 84` | « a tall dark green fir tree, its branches heavy with snow and white rime, a short dark trunk » | 0,5 |
| `rocher-glace.png` | `710fdf89` | moyenne 1k, transparent, 1:1 ; `objet`, `maxHeight: 48` | « a large weathered grey boulder half covered by a cap of snow, patches of clear ice and frost in its cracks » | 0,5 |
| `sculpture-glace.png` | `59e25d5a` | moyenne 1k, transparent, 1:1 ; `petit`, `maxWidth: 34`, `maxHeight: 38` | « a small sculpture of a sitting fox carved by a child out of clear blue-white ice, its bushy tail curled around its paws, simple rounded shapes, translucent » | 0,5 |
| `grille-cryptes-v1-rouille.png` (écarté : fer rouillé brun, le texte dit « une grille de fer noir ») | `a56c8bae` | moyenne 1k, transparent, 1:1 ; `objet`, `maxWidth: 58` | « a heavy gate of black iron bars set in a black iron frame, standing alone, simple vertical bars with one crossbar, a thick iron padlock, no plaque, seen in three-quarter view » | 0,5 |
| `cristal-archive.png` | `96b5d74c` | moyenne 1k, transparent, 2:3 ; `objet`, `maxHeight: 62` | « an archive crystal: a clear faceted crystal as tall as a man's chest, its flat facets like the pages of a closed book, standing on a low square pedestal of dark blue-grey stone, a faint cool cyan glow inside, no label » | 0,5 |
| `khrys.png` | `f8e8e3aa` | moyenne 1k, transparent, 2:3 ; `objet`, `maxWidth: 58`, `maxHeight: 88`, `foot: 88` | « Khrys, an immense ancient crystal as tall as two men, older than the city: a massive cluster of faceted crystal points rising from the floor, milky and clouded with age, inner layers and fine cracks like the rings of a tree, a faint pale white-blue glow rising in its heart » | 0,5 |
| `cristal-espion.png` | `f01e0094` | moyenne 1k, transparent, 2:3 ; `haut` | « a spying crystal: a tall thin black iron pole bent at its top into a gallows bracket, from which hangs a small faceted crystal cut like an eye, with a tiny glowing red point at its heart » | 0,5 |
| `traineau.png` | `91f18a45` | moyenne 1k, transparent, 1:1 ; `meuble` | « a wooden cargo sled with long curved iron-shod runners, two wooden crates strapped on it with leather straps, worn and frosted, no lettering » | 0,5 |
| `caisse-glace.png` | `c2d8c360` | moyenne 1k, transparent, 1:1 ; `objet`, `maxWidth: 56`, `maxHeight: 60` | « a large block of clear pale blue crypt crystal, wider than tall, faceted, inside which an old dull dark grey lead crate stands upright, held in the ice like a sleeper, no writing visible » | 0,5 |
| `galerie-mine.png` | `3765e078` | moyenne 1k, transparent, 1:1 ; `batiment` | « the entrance of a mine tunnel cut into a wall of dark blue-black ice and rock, framed by heavy timber props and a thick timber lintel, a dark opening, a pair of small rails running into the darkness, a faint warm glow deep inside » | 0,5 |
| `glace-sol.png` | `d0c1d706` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « a floor of smooth pale blue-grey ice, faintly translucent, fine white scratches and a few hairline cracks, tiny frozen bubbles, worn by many footsteps » | 0,5 |
| `neige.png` | `0abebdad` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « fresh soft snow, pale white with faint cool blue-grey shading, a few small wind ripples and shallow footprint dimples, fine powdery texture » | 0,5 |
| `dalle-givre.png` | `2672f30a` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « large square flagstones of pale blue-grey stone covered with a thin layer of white frost, fine joints filled with ice, a few hairline cracks » | 0,5 |
| `tapis-fourrure.png` | `f9f945cc` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « thick worn fur rugs and pelts of brown, tawny and grey, overlapping each other and covering the whole floor, soft long hair, a few worn patches » | 0,5 |
| `glace-noire.png` | `dd5bd10f` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « dark ice, deep slate blue-grey almost black, thick and cloudy, faint pale cracks and a few small dark stones frozen inside, a damp sheen » | 0,5 |
| `mur-glace.png` | `c5f83a96` | moyenne 1k, opaque, 1:1, vue de face ; `wall`, `height: 60` | « a wall of thick clear blue ice blocks, translucent, pale white veins and frozen bubbles inside, faint vertical streaks of frozen meltwater, straight horizontal joints between the blocks running from the left edge to the right edge » | 0,5 |
| `khrysos-arrivee.png` | `62e6682c` | haute 2k, opaque, 16:9 | « The arrival by train at a city carved in vast caverns of ice three hundred metres under a polar ice cap, in the cold blue light of morning. In the foreground, a train of dark iron carriages has just stopped at a stone quay at the bottom of a long heated tunnel of ice, a little warm steam around its wheels, a few small tired travellers in heavy coats stepping down, and a small woman guard in a long grey-blue greatcoat, holding upright an iron spear with a point of clear ice, waiting to look them over. Beyond the mouth of the tunnel opens an immense vertical city of many levels carved into walls of translucent blue ice, terraces and galleries lit by countless luminous pale cyan crystals, steam elevator shafts of iron and copper rising between the levels, and far above, in the ice ceiling, a shaft of light where a faint green aurora is channelled down. The lower third is darker, calm shadow, leaving room for a dialogue panel » | 2,75 |
| `fond-khrysos.png` | `44540f81` | haute 1k, opaque, 16:9 | « an endless expanse of thick translucent blue ice seen from very high above, cracked and layered, with faint scattered clusters of pale cyan luminous crystals glowing deep beneath its surface, cold blue light, thin veils of frost » | 1,5 |
| `grille-cryptes.png` (reprise) | `76b606b7` | moyenne 1k, transparent, 1:1 ; `objet`, `maxWidth: 58` | « a heavy gate of blackened iron bars, truly black, not rusty brown, set in a black iron frame, standing alone, simple vertical bars with one crossbar, a thick black iron padlock, no plaque, seen in three-quarter view » | 0,5 |
| **Total** | | | **69 images** (68 prévues + 1 reprise) | **42,75** |

**Dans le jeu** : 51 tuiles, 5 portraits (`src/data/npcs.json` : Hrolda, Halvard, Maître Ennir, Korvek, Torka), les
planches de marche du mineur du Niveau Douze et de la marchande des Galeries
(`public/sprites/figurant-{mineur-douze,marchande-galeries}.png`, `src/data/figurants.json`), l'illustration
`public/illustrations/khrysos-arrivee.jpg`, le fond `public/fonds/khrysos.jpg` (les Portes, la surface, les Galeries, le
Niveau Royal, le Niveau Douze ; les cryptes et la voie sept gardent le fond « souterrain »). Vérifié dans Chromium : les
cinq quartiers, les cryptes, la voie sept, huit des dix intérieurs, l'accueil de la garde des Portes avec l'illustration, les dialogues
des cinq portraits ; aucune erreur ; typecheck et 1079 tests.

**Bilan** :
- **Reprise (1 image, 0,5 crédit)** : la grille des cryptes, sortie en fer rouillé brun, alors que son texte dit « Une
  grille de fer noir » : refaite « blackened iron, truly black, not rusty brown ». La version écartée reste dans
  `assets/raw/khrysos/` (`grille-cryptes-v1-rouille.png`). **Détourages sans nouvelle image** : Dagny, sortie sous un
  voile blanc semi-transparent sur toute l'image, est traitée par `"matte": true` ; les directions `s` et `e` du mineur
  avaient le même voile : détourées sur place par le même procédé que `matte` (le script de la marche ne le fait pas),
  les originales à côté, `marche-mineur-douze-{s,e}-brut.png`.
- **Sortes vérifiées** (le calcul automatique les donnait « décor », « personnage » ou « passant ») : `glace-sol`,
  `neige`, `dalle-givre`, `tapis-fourrure` (le sol du Foyer) et `glace-noire` sont des sols ; `mur-glace` un mur
  (`kind: "wall"`) ; parmi les « personnages », `puits-ascension` est la cage du Puits (« du cuivre et des câbles ; la
  vapeur siffle par en dessous », `batiment` ; la machiniste a sa propre tuile), `grille-cryptes` une grille de fer
  (`objet`, elle sert aussi aux trois grilles des prisons du Douze), `khrys` l'Entité, un cristal « haut comme deux
  hommes » (`objet` agrandi à 58 × 88), `cristal-espion` l'œil de cristal sur sa potence (`haut`) ; `gardien-cryptes` est
  bien un vieil homme (`personnage`) ; Korvek, le Yéti et le Géant des Glaces sont `colosse` ; Torka et l'enfant des
  Portes `enfant` ; le Nain de Glace `enfant` à 44 px, comme sa marche ; les Oskarsen (la mère, l'enfant contre elle sous
  les couvertures) `personnage` élargi à 48 ; les cristaux, le geyser, le rocher, le sapin, la caisse prise et la grille
  des `objet` ; le traîneau et la congère des `meuble` ; la sculpture de Torka `petit` ; la Porte de Glace, le Foyer, les
  maisons, l'Atelier Facettier, le poste des Vigiles, la Bibliothèque, le Palais, le Temple et l'entrée de mine des
  `batiment`.
- **Tuiles partagées** : `garde-portes` sert aussi à « Une garde du Palais » (Niveau Royal) : peinte en femme, un
  uniforme gris-bleu sans signe des Portes ; `elfe-givre` sert à « Une Elfe de Givre » (Galeries) et à « Un Elfe de
  Givre » (Royal) : peint androgyne ; `nain-glace` sert au Nain des Galeries (« Un manteau de Brodd tient dix hivers. Le
  mien en a douze. ») et au mineur du Douze : un vieux manteau rapiécé et un pic sur l'épaule ; `maison-glace` fait la
  maison de Torka, le Relais des Gardiens et l'atelier d'Ennir : une maison de glace sans enseigne ; `porte-glace` fait
  la Porte de la surface (des deux côtés) et la porte du Caveau (« une porte de glace épaisse, cerclée de fer ») : une
  arche de glace cerclée de fer, ouverte sur un tunnel chauffé, comme le dessin provisoire ; `cristal-archive` fait les
  cristaux de la Bibliothèque, le registre des Portes, ceux de l'atelier d'Ennir, du Temple et du Caveau ; `traineau` fait
  les deux traîneaux des Portes, dont celui de la quête du Yéti : peint chargé de deux caisses sanglées (son texte hors
  quête : « des caisses de bougies de suif sanglées dessus ») ; pendant la quête, le texte le dit vidé et l'image ne
  change pas (une tuile « traîneau vide » coûterait 0,5 crédit, si Cyril le veut).
- **L'illustration** est sur `src/data/dialogues/garde-portes.json`, nœud `accueil` (« Vous venez du train. Bien. Ceux
  qui arrivent à pied, par la surface, je dois les renvoyer. La loi de 2995. »). On arrive en train sur le quai du Nord
  (`entree`, (5, 8)) et personne n'y accueille comme Véline ou Boulon : le comptoir du quai (`quai-nord`, un objet) vend
  les billets du retour, Ulga accueille dans le Foyer (« Le Foyer ! Assieds-toi près du feu »), et le journal envoie
  seulement « Khrysos : la Bibliothèque de Glace, au Niveau Royal ». La garde des Portes est celle qui reçoit qui arrive
  (« Vous venez du train ») ; elle se tient pourtant à l'autre bout de la carte, devant la Porte de la surface (27, 9) :
  l'illustration la montre sur le quai, devant le train. Les nœuds `face`, `preuve` et `yeti` (quêtes en cours) ne
  l'ont pas.
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : Ulga (la cinquantaine,
  joues rouges, tresse blond miel relevée, robe rouille, tablier de cuir, chope d'étain et torchon) ; Korvek (fourrure
  blanche grise de suie aux chevilles, visage gris-bleu, cordes en bandoulière, bâton de guide ; il porte aussi une
  lanterne et un cristal au bâton, que le texte ne lui donne pas) ; Hrolda (la soixantaine, cheveux gris de fer tirés,
  robe grise, neuf éclats de miroir au col, cahier de cuir gris et plume) ; Brodd (trapu, barbe brune, loupe de laiton à
  l'œil, tablier de cuir, cristal et outil) ; Torka (bonnet rouge, tresses blondes, manteau bleu, renard de glace et
  couteau courbe) ; Sigrun (seize ans, blonde, le manteau de fourrure brun de son père, trop grand) ; la Primus Crysta
  Frostborn (Elfe de Givre, peau bleutée, longs cheveux blancs, oreilles un peu pointues, robe blanche et bleu glace,
  fin diadème de pointes de cristal) ; Bjorn Glaceforge (barbe rousse prise de givre, bras nus, tablier de forgeron) ;
  Halvard (la quarantaine, barbe brune, long manteau blanc, corde à l'épaule, gant à la main) ; Maître Ennir (maigre, la
  soixantaine, longs cheveux blancs, manteau indigo, longs gants gris, givre aux manches, petit cristal tenu près du
  visage) ; Dagny (la quarantaine, manteau de deuil brun-noir, brassard noir, rouleaux de pétitions) ; les Oskarsen (la
  mère maigre sous trois couvertures, l'enfant contre elle) ; la garde des Portes (cheveux courts sombres, capote
  gris-bleu, lance de fer à pointe de glace) ; la machiniste (bonnet gris, salopette de cuir, grande clé de laiton) ; le
  gardien des cryptes (vieil homme, robe gris ardoise, clé de glace noire à une lanière, lampe de cristal cyan ; une
  canne en plus) ; la Prêtresse (tresse noire, robe blanche, étole bleue brodée d'étoiles de givre) ; la marchande des
  Galeries (manteau prune matelassé, capuche fourrée, corbeille de poissons d'argent) ; le Géant des Glaces (longue barbe
  blanche, manteau bleu ardoise à col de fourrure) ; l'Elfe de Givre (androgyne, manteau bleu glace à col blanc) ; le
  Nain de Glace (barbe blanche tressée, bonnet, manteau brun rapiécé, pic, lampe cyan) ; l'enfant des Portes (manteau
  rouille, capuche grise) ; le Yéti des Galeries (une écharpe bleu passé, pour le distinguer de Korvek). Décors : la Porte
  de Glace (une arche de glace cerclée de fer, des lanternes et un bouquet de cristaux au sommet) ; le Foyer (bois et
  pierre, quelques blocs de glace, une grande cheminée de pierre qui fume) ; la maison de glace (blocs de glace, poutres,
  toit de givre, une lanterne de cristal au mur) ; l'Atelier Facettier (façade de bois sombre, un grand cristal taillé
  pour enseigne, des manteaux de fourrure pendus sous l'avant-toit) ; le poste des Vigiles (pierre grise, un manteau
  blanc pendu en bannière, cordes et raquettes) ; la Bibliothèque (une tour de glace à facettes, des cristaux d'archive
  derrière la glace) ; le Palais (une flèche de cristal) ; le Temple (une coupole de neige, une étoile de givre à six
  branches) ; le Puits d'Ascension (une tour de fer et de cuivre, une roue à poulie, une cabine de laiton) ; Khrys (un
  amas de cristaux laiteux, cerné de couches comme les cernes d'un arbre) ; le cristal espion (un œil de cristal à cœur
  rouge, pendu à une potence de fer, comme le dessin provisoire) ; le cristal de crypte (une silhouette sombre et floue,
  debout, sans visage) ; la caisse prise (une caisse grise dans un bloc de cristal, plutôt couchée que « prise debout ») ;
  le mur de glace en assises horizontales ; le sol des Portes, une glace pâle marquée de pas ; le Foyer, un sol de
  fourrures. L'illustration : un train de fer arrêté au bas d'un tunnel de glace, quelques voyageurs qui descendent, la
  garde des Portes (une casquette en plus) qui les attend, et au-delà, la cité verticale aux galeries éclairées de
  cristaux cyan, des Puits d'Ascension qui fument, et dans le plafond de glace un puits de lumière où descend une aurore
  verte. Le fond : la glace vue de très haut, fendue, des cristaux cyan pris dedans (une lueur chaude dans un coin).
- **Vu au passage** : beaucoup de lanternes à flamme (à la ceinture de la marchande, de Hrolda, de Halvard, d'Ennir, de
  la garde, de la machiniste ; à la Porte de Glace, aux maisons) : le texte n'exclut pas le feu à Khrysos (le Foyer, les
  bougies de suif), gardées, bien que la ville soit éclairée par ses cristaux. Les murs de glace ont le couvercle de bois
  brun que le script pose sur tout mur (`wallFrame`, commun à tous les lots) : sur la glace, il fait un rebord sombre.
  Le Palais Glacé, la Bibliothèque et le Temple ont la taille d'une maison (préréglage `batiment`) : le Palais, « deux
  cents mètres de cristal », n'en a pas l'air (un grand décor `big` le permettrait sans nouvelle image, mais il faut toucher `scripts/tiles-def.mjs`). Le
  manteau de deuil de Dagny est brun-noir plutôt que noir ; à 54 px, il se lit noir.

## Lot Marche-Mère (2026-11-08, 74 images, 47,5 crédits, solde 1 787,61)

Un lot de la mise en beauté (décision de Cyril : « Nouvelle Ilyane, refais les 9, et lance les lots »). Le solde est
celui du compte après le lot (1 905,11 avant) ; un autre lot tournait en même temps sur le même compte : les 47,5
crédits sont comptés tâche par tâche (tableau) ; prévu 44,25 (72 images), plus 3,25 de reprises (2 images), plafond 56.
Outil : Higgsfield MCP, `gpt_image_2_6`, six tâches en cours au plus. Bruts : `assets/raw/marche-mere/` (local) ; tailles
et préréglages : `scripts/art/marche-mere.json` ; traités par `npm run art`, `npm run tiles`, `npm run lots`. La dame en
gris (`edda-marche`) était déjà peinte : pas dans ce lot.

**Le canon lu pour les images** (Notion, en lecture seule : « Communion des Sables Vivants — fiche complète » et
« Solarix — Créatures légendaires ») : les Léviathans de Sable « ressemblent à [un] croisement tortue/crabe géant +
carapace cristalline », jusqu'à 300 m ; le vêtement de tous les jours, « tunique ample (lin), pantalon large serré aux
chevilles, ceinture de cuir multifonction, voile facial (tous genres), chapeau large à bord circulaire, sandales épaisses
à attaches multiples », pieds nus admis sur les Léviathans ; aux funérailles, « vêtements sobres (gris, brun) » et
« henné noir, joues » ; la Reine, « robe cristalline (tissée fils verre), couronne cristaux vivants, pieds nus » ; les
habitations, « bois pétrifié + os de créatures géantes, toiles » (repris pour les tentes et les arceaux des chariots) ;
les peaux humaines « du cuivre au noir profond ». Aucune tradition réelle reconnaissable : ni turban, ni keffieh, ni
motif d'une culture du désert réelle (dit dans chaque prompt) ; le « chèche » des pilleurs (noir) et de Daru'Khen
(couleur de sable) est dans le texte : peint en écharpe enroulée, sans autre signe.

**Réglages communs** (le prompt entier = ces blocs + le sujet du tableau) :
- **Bloc commun** du style révisé en tête de tous (sauf les sols, le mur et les planches de marche), et « No text, no
  letters, no logo, no watermark, no gore, nothing sexualized, no modern firearms, no screens, not photorealistic. » à
  la fin de tous.
- **Personnages** : « Isometric 2:1 view, single character centered, isolated on a transparent background. Full-body
  character, three-quarter front view, standing: <sujet>. Simple readable silhouette for a small game sprite. He/She/The
  child stands directly on the bottom of the image: no ground, no base, no cast shadow on the ground. » ; le sujet finit
  par « (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh,
  no real-world ethnic patterns or jewellery, no lantern) » ; **créatures** : « single creature centered … : <sujet>.
  Simple readable silhouette for a small game sprite. It stands (le dragonnet : lies) directly on the bottom of the
  image… » ; **décors** : « single object centered, isolated on a transparent background: <sujet>. Simple readable shape
  for a small game sprite. It stands directly on the bottom of the image: no ground, no base, no cast shadow on the
  ground. ».
- **Sols** : « Painterly digital illustration, muted earthy palette, weathered materials, clean readable shapes. Seamless
  tileable ground texture, flat top-down orthographic view looking straight down from above, filling the entire square
  edge to edge: <sujet>. Perfectly even, uniform lighting across the whole image, no vignette, no light spot, no cast
  shadows, no perspective, no horizon. No objects. » ; la piste et le rail avec le sable en référence.
- **Mur** (`mur-toile`, `kind: "wall"` comme le `mur` des intérieurs) : « … Seamless tileable wall texture, flat front
  orthographic view looking straight at the wall, filling the entire square edge to edge, tiling seamlessly from left to
  right: <sujet>. Perfectly even, uniform lighting…, no perspective, no floor, no ceiling. No objects. ».
- **Portraits** : « Bust portrait for a dialogue panel, three-quarter view: <sujet>, lit by warm firelight from the upper
  left with cool shadow on the other side. Plain uniform dark ink background color #1B1512. », le personnage en pied en
  référence (`image_references`) ; « firelight » au lieu de « lantern light » : à la Marche, on vit au feu (brasero,
  feux de camp, chariots-fours).
- **Planches de marche** (`docs/gdd/animation.md`) : « Sprite sheet for a 2D isometric game, on a transparent
  background: the same character as in the reference image (<tenue>), full body, seen from slightly above at a 30 degree
  angle, <direction>. Exactly 6 frames of a smooth walking cycle side by side in one single horizontal row, evenly
  spaced, every frame the same size and the same scale, feet on the same baseline, the character identical in every
  frame except the legs, arms and tunic moving with the steps. No ground, no shadow, no grid lines, no frame borders. » ;
  directions : « walking toward the viewer, facing the viewer » (s), « walking toward the lower right, three-quarter
  front view turned to the right » (se), « walking to the right, seen in side profile facing right » (e), « walking
  toward the upper right, three-quarter back view turned to the right » (ne), « walking away from the viewer, seen from
  behind » (n).
- **Illustration** : bloc commun + le sujet ; **fond** : bloc commun + « Painted backdrop for the empty edges around an
  isometric game map: <sujet>; no buildings or figures in the center, no focal subject, soft and slightly blurred, darker
  toward the edges. ».

| Fichier (`assets/raw/marche-mere/`) | Tâche | Réglage | Sujet du prompt | Crédits |
|---|---|---|---|---|
| `tam-ruu.png` | `4c3e1b6e` | moyenne 1k, transparent, 2:3 ; `personnage` | « Tam'Ruu, the keeper of a travelling inn of a nomad city that walks across the desert, a broad, heavy-set man in his fifties with deep copper-brown skin, a shaved head and a short greying beard, a cheerful but tired face, a long stained leather apron over a loose sand-coloured linen tunic, wide trousers gathered at the ankles, thick-soled strapped sandals, a big wooden ladle in one hand (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `ish-lenne.png` | `31a6d530` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ish'Lenne, an old storyteller of a nomad city that walks across the desert, a slender woman in her seventies with dark brown skin and long loose white hair, a lined, gentle, grave face with heavy-lidded eyes, a long faded plum-coloured linen robe over wide trousers gathered at the ankles, many faded cloth ribbons of different colours knotted around both wrists with their ends hanging, simple strapped sandals, empty hands (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `ahm-ras.png` | `fc1a19a2` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ahm'Ras, a pure nomad who has walked the desert all his life, a weathered lean man of sixty with deep brown skin, close-cropped grey hair and a short grey beard, eyes narrowed as if against a strong wind with deep lines around them, a stubborn, haunted face, a long worn and patched travelling coat of faded dun canvas over a linen tunic, wide trousers gathered at the ankles, cracked thick-soled strapped sandals, empty hands (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `hiran-amra.png` | `8ecfa18d` | moyenne 1k, transparent, 2:3 ; `personnage` | « Hiran'Amra, a Crystal Matriarch, a wealthy glass and crystal merchant of a nomad desert city, a poised woman in her fifties with dark brown skin and black hair pulled back in a tight bun, a shrewd, polished half-smile, small amber crystals set like jewels on her forehead and a necklace of raw amber crystal shards at her throat, a long dark rust-red linen robe with a wide leather belt, holding a small balance scale of clear glass with a few amber shards on its pans (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `shal-vera.png` | `ef87296e` | moyenne 1k, transparent, 2:3 ; `personnage` | « Shal'Vera, the Queen of the Sands, a woman of thirty-eight transformed by seven days of walking through a sea of glass: translucent pale skin through which fine glowing golden veins can be seen, a soft light shining through her hands, eyes of clear amber crystal, long dark brown hair, a calm, deep, searching gaze, a long modest flowing robe woven of fine glass threads that catches the light, a slender crown of small living amber crystals, bare feet (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `nes-mira.png` | `5c8afac8` | moyenne 1k, transparent, 2:3 ; `personnage` | « Nes'Mira, the healer of an ancient giant desert beast, a wiry woman in her forties with dark brown skin and short black hair tied back, a tender, weary face, bare feet, forearms dusted grey with sand up to the elbows, a sleeveless dusty brown linen tunic over wide trousers gathered at the ankles, a leather satchel of balm pots at her hip, a small open clay pot of ointment in one hand (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `varo-ssin.png` | `98b30359` | moyenne 1k, transparent, 2:3 ; `personnage` | « Varo'Ssin, a master glassmaker who is a Glass-Man: a tall gaunt man in his sixties whose skin has turned, in large patches on his face, neck and arms, into translucent pale crystal glass through which a faint warm orange glow shows, his hands entirely of clear glass, short pale silvery hair, a calm, ascetic face, a scorched brown leather apron over a dark linen tunic, wide trousers gathered at the ankles, a long iron glassblower's blowpipe held upright like a cane (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `saal-ema.png` | `ac9fbae6` | moyenne 1k, transparent, 2:3 ; `personnage` | « Saal'Ema, the very old matriarch of a desert clan, a tiny frail woman over ninety with deep brown wrinkled skin and thin white hair in a long braid, a kind, mischievous, half-blind gaze, bare feet, a faded rust-red linen robe with plain ochre bands of stitching at the hem, leaning on a long worn wooden travel staff (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `keo-sa.png` | `11bbda60` | moyenne 1k, transparent, 2:3 ; `enfant` | « Kéo'Sa, a nine-year-old girl of a nomad desert city, a small child with dark brown skin and short black hair, a serious, stubborn little face, a simple loose ochre linen tunic and wide trousers gathered at the ankles, bare feet, a single red dragon scale hanging on a cord around her neck, a child in simple clothes (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `yel-dara.png` | `0e1e3a4c` | moyenne 1k, transparent, 2:3 ; `personnage` | « Yel'Dara, an old woman who silently keeps the count of the dead each morning, in her late sixties, deep black skin, a soft pale blue linen veil draped over her grey hair and shoulders like a light hood with her face uncovered, lips moving silently, a long blue-grey linen robe, empty hands joined in front of her, a calm, heavy, inward gaze (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `gardienne-eau.png` | `f56ad85a` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Water Guardian of a nomad desert city, a woman in her forties with copper-brown skin, a deep blue linen veil draped over her hair and shoulders like a hood with her face uncovered, eyes lowered, a long deep blue linen robe with the sleeves rolled up, hands and forearms wet up to the wrists, holding a heavy clay water jar against her hip, ready to pour (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `daru-khen.png` | `d764694f` | moyenne 1k, transparent, 2:3 ; `personnage` | « Daru'Khen, the first guide of a nomad city that walks across the desert, a lean, dry man in his fifties with dark copper skin, a long sand-coloured linen scarf wound loosely around his head and neck like a soft hood with his face uncovered, sharp narrowed eyes, a sun-bleached sand-coloured linen tunic, wide trousers gathered at the ankles, a thick leather belt with water flasks, thick-soled strapped sandals, a long wooden walking staff covered with many small carved notches (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `eskil.png` | `c4bba666` | moyenne 1k, transparent, 2:3 ; `personnage` | « Eskil Kolm, a pale man of about thirty-five from an industrial city of iron and steam, hiding among desert nomads, short fair hair, an unshaven, anxious, hunted face, a worn grey-blue drilling worker's jacket with brass buttons and a frayed rust-red collar under a long sand-coloured canvas walker's cloak thrown over his shoulders, rough calloused worker's hands, worn work boots (no turban, no lantern) » | 0,5 |
| `ysha-ren.png` | `bb57e0cd` | moyenne 1k, transparent, 2:3 ; `personnage` | « Ysha'Ren, a sixteen-year-old girl of a nomad desert city, slender, dark copper skin, long black hair in a simple braid, a guarded, dreamy, frightened look, a simple ochre linen tunic and wide trousers gathered at the ankles, bare feet, a pale linen scarf wrapped around both forearms, and where it slips the skin of her forearms is pale, frosted and faintly glowing like clear glass (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `dova-ren.png` | `f12c72f4` | moyenne 1k, transparent, 2:3 ; `personnage` | « Dova'Ren, a mother in her early forties from a nomad desert city, strong and stern, dark brown skin, black hair streaked with grey tied back in a knot, a fierce, exhausted, protective face, arms crossed over her chest, a rust-brown linen tunic and wide trousers gathered at the ankles, a thick leather belt, bare feet (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `oss-amar.png` | `d8c98e5f` | moyenne 1k, transparent, 2:3 ; `personnage` | « Oss'Amar, an old man of eighty in mourning, from a nomad desert city, thin and stooped, deep brown skin, sparse white hair and white stubble, two simple black mourning stripes painted on his cheeks, a long plain grey linen mourning coat without any ornament, wide grey trousers gathered at the ankles, bare feet, empty hands hanging, a quiet, stubborn grief in his eyes (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `pilleur-sables.png` | `4873cfab` | moyenne 1k, transparent, 2:3 ; `personnage` | « a sand raider, a gaunt and thirsty mercenary of the deep desert, a black cloth scarf wound around his head and over his nose and mouth so that only his hard, tired eyes show, a dirty dark brown canvas tunic and wide trousers gathered at the ankles, a battered leather belt with an almost empty water skin and a short straight broad-bladed knife, a long iron digging shovel held in both hands like a weapon, menacing (invented clothing of this fantasy world, no other cultural sign, no lantern) » | 0,5 |
| `marcheur.png` | `e204a486` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Walker of a nomad city that walks across the desert, a man in his thirties with dark brown skin and short black hair, a tired, patient face, a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a thick leather belt with a water flask, a light linen face veil lowered around his neck, dusty thick-soled strapped sandals, a rolled tent canvas strapped across his back (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `porteuse-eau.png` | `5e91bbf8` | moyenne 1k, transparent, 2:3 ; `personnage` | « a water carrier of a nomad desert city, a strong young woman in her twenties with dark brown skin and black hair tied up, a determined, tired face, a deep blue linen tunic, wide trousers gathered at the ankles, a thick leather belt, thick-soled strapped sandals, a large round clay water jar carried on her back in a leather harness with the strap across her chest (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `marcheuse.png` | `d6dc34fd` | moyenne 1k, transparent, 2:3 ; `personnage` | « a Walker woman of a nomad city that walks across the desert, in her thirties, deep black skin, black hair in a long single braid, a calm, weary face, a loose dark red linen tunic, wide trousers gathered at the ankles, a thick leather belt, a light pale linen face veil lowered around her neck, bare feet, a small leather shoulder bag (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `convoyeur.png` | `49632eeb` | moyenne 1k, transparent, 2:3 ; `personnage` | « a wagon driver of a desert caravan, a stocky man in his forties with copper-brown skin and a short brown beard, a weathered, good-humoured face, a dusty brown linen tunic, wide trousers gathered at the ankles, a thick leather belt with a coiled driver's whip, thick-soled strapped sandals, a long wooden ox-goad stick resting on his shoulder (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `verrier.png` | `fc9c4613` | moyenne 1k, transparent, 2:3 ; `personnage` (matte true) | « a glassworker of a desert caravan of glassmakers, a man in his forties with copper skin, short thinning black hair and singed eyebrows, a sweaty, tired face, a scorched leather apron over a linen tunic, wide trousers gathered at the ankles, thick leather gloves, holding a long iron blowpipe with a small glowing orange gather of molten glass at its end (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `enfant-marche.png` | `d60d98f2` | moyenne 1k, transparent, 2:3 ; `enfant` | « a child of about eight from a nomad desert city, small, dark brown skin, short curly black hair, a bright, curious face, a simple cream linen tunic and wide trousers gathered at the ankles, bare feet, dusty knees, a child in simple clothes (invented desert clothing of this fantasy world, not based on any real-world culture: no turban, no keffiyeh, no real-world ethnic patterns or jewellery, no lantern) » | 0,5 |
| `dragonnet.png` | `ce3595f9` | moyenne 1k, transparent, 1:1 ; `creature` (maxWidth 40, maxHeight 30) | « a young red sand dragon the size of a large dog, curled up lying on the ground with its head resting on its forepaws, eyes half-closed, sad and listless, its red scales dull and faded, small wings folded, a long tail wrapped around its body, wild animal, no clothing, no harness, no saddle, no collar » | 0,5 |
| `dragon-rouge.png` | `11ade290` | moyenne 1k, transparent, 1:1 ; `colosse` | « Kresh'Tal, an ancient red dragon six hundred years old, resting on a low perch of weathered sandstone and amber crystal, wings folded along its body, long neck raised and head turned slightly aside, dark red scales scarred and dulled by sand, amber eyes, horns worn smooth with age, calm and dangerous, no saddle, no harness, no rider » | 0,5 |
| `tente-ocre.png` | `959affd3` | moyenne 1k, transparent, 1:1 ; `batiment` | « a nomad desert tent of an invented culture of this fantasy world, not based on any real-world culture: a ridge tent of weathered ochre canvas stretched over a frame of pale petrified-wood poles and long curved bones of a giant creature, low sloping walls, the front flap tied open on a dark interior with the entrance facing the viewer, guy ropes pegged into the ground, dust and wind stains on the canvas » | 0,5 |
| `tente-beige.png` | `d3a8afa1` | moyenne 1k, transparent, 1:1 ; `batiment` | « a nomad desert tent of an invented culture of this fantasy world, not based on any real-world culture: a ridge tent of weathered pale beige canvas stretched over a frame of pale petrified-wood poles and long curved bones of a giant creature, low sloping walls, the front flap tied open on a dark interior with the entrance facing the viewer, guy ropes pegged into the ground, dust and wind stains on the canvas » | 0,5 |
| `tente-rouge.png` | `490a3d38` | moyenne 1k, transparent, 1:1 ; `batiment` | « a nomad desert tent of an invented culture of this fantasy world, not based on any real-world culture: a ridge tent of faded rust-red canvas with a single plain ochre band along the ridge, stretched over a frame of pale petrified-wood poles and long curved bones of a giant creature, low sloping walls, the front flap tied open on a dark interior with the entrance facing the viewer, guy ropes pegged into the ground, dust stains » | 0,5 |
| `tente-eau.png` | `1a225b70` | moyenne 1k, transparent, 1:1 ; `batiment` | « the Tent of the Water of a nomad desert city, an invented culture of this fantasy world: a ridge tent of deep blue canvas with a pale beige band along the ridge, stretched over a frame of pale petrified-wood poles, the front flap tied open on a dark interior with the entrance facing the viewer, a large round clay water jar standing beside the entrance, guy ropes pegged into the ground » | 0,5 |
| `tente-mille-pas.png` | `6783a611` | moyenne 1k, transparent, 1:1 ; `batiment` | « the Tent of a Thousand Steps, the largest tent of a nomad desert camp, an invented culture of this fantasy world: a tall, long tent of pale sand-coloured canvas with a faded rust-red band along the ridge, its tall wooden poles covered with hundreds of faded cloth ribbons of many colours fluttering in the wind, the front flap open on the warm glow of a brazier inside, with the entrance facing the viewer, guy ropes pegged into the ground » | 0,5 |
| `chariot.png` | `60f01a9b` | moyenne 1k, transparent, 1:1 ; `objet` (maxWidth 60) | « a covered convoy wagon of a desert caravan: a sturdy wooden wagon with four large wooden wheels with wide rims for sand, an arched cover of weathered pale beige canvas stretched over curved pale bone ribs of a giant creature, wooden boxes and rolled tents at the back, dust everywhere, no animals, no driver (an invented caravan of this fantasy world, not a real-world covered wagon) » | 0,5 |
| `chariot-ocre.png` | `bf7f7514` | moyenne 1k, transparent, 1:1 ; `objet` (maxWidth 60) | « a covered convoy wagon of a desert caravan: a sturdy wooden wagon with four large wooden wheels with wide rims for sand, an arched cover of weathered ochre canvas stretched over curved pale bone ribs of a giant creature, wooden boxes and bundles at the back, dust everywhere, no animals, no driver (an invented caravan of this fantasy world, not a real-world covered wagon) » | 0,5 |
| `chariot-eau.png` | `510df9a1` | moyenne 1k, transparent, 1:1 ; `objet` (maxWidth 60) | « a water wagon of a desert caravan: a sturdy wooden wagon with four large wooden wheels with wide rims for sand, an arched cover of weathered deep blue canvas stretched over curved pale bone ribs of a giant creature, loaded with several large round clay water jars and leather water skins tied with ropes, no animals, no driver (an invented caravan of this fantasy world, not a real-world covered wagon) » | 0,5 |
| `four-verre.png` | `aae2bf6c` | moyenne 1k, transparent, 1:1 ; `objet` (maxWidth 60, maxHeight 64, matte true) | « a glassmaker's furnace wagon of a desert caravan: a heavy four-wheeled wooden wagon carrying a squat furnace of brick and clay with a small iron door glowing orange, a short iron chimney with a thin plume of grey smoke, a rack of slender plain glass rods cooling on its side, iron tools hanging, no animals, no people » | 0,5 |
| `feu-camp.png` | `51724c04` | moyenne 1k, transparent, 1:1 ; `petit` (maxWidth 36, maxHeight 30) | « a small campfire of a nomad desert camp: low flames and glowing embers on a bed of grey ash, ringed by pale stones, a few sticks of pale dry wood, small and low » | 0,5 |
| `jalon.png` | `91a8b99b` | moyenne 1k, transparent, 2:3 ; `haut` (maxHeight 46) | « a waymarker of the desert: a single slender upright rod of clear pale desert glass about the height of a child, slightly irregular and hand-cast, planted straight in the ground, catching a faint amber reflection, completely plain with no inscription, no carving, no ornament » | 0,5 |
| `dune.png` | `7bcdd20c` | moyenne 1k, transparent, 1:1 ; `meuble` (maxWidth 64, maxHeight 40, foot 92, shadow false) | « a single low sand dune: a smooth rounded mound of muted pale beige-tan desert sand, desaturated, not orange, with a sharp wind-sculpted crest and fine ripples, its base wide and flat, filling the width of the image » | 0,5 |
| `tete-leviathan.png` | `8f654c87` | moyenne 1k, transparent, 1:1 ; `batiment` | « the colossal head of an ancient sand leviathan, a desert titan like a cross between a giant tortoise and a crab: a huge, low, heavy head emerging from under the rim of its carapace, seen in three-quarter view turned to the right, its brow like weathered living stone and sandstone-coloured plates, deep folds full of sand, a large half-closed amber eye, very old and weary, no harness, no clothing, no people » | 0,5 |
| `flanc-leviathan.png` | `4cb4aa22` | moyenne 1k, transparent, 1:1 ; `batiment` | « a section of the rim of the immense carapace of a sand leviathan, a desert titan like a giant tortoise crossed with a crab: a thick curved wall of weathered sandstone-coloured shell plates rising like a low rampart, worn and scarred, sand caught in the seams, small amber crystals growing along its top edge » | 0,5 |
| `pilier-cristal.png` | `901701c6` | moyenne 1k, transparent, 2:3 ; `haut` (maxHeight 80) | « a pillar of memory crystals: a tall natural column of living crystal with milky white and pale amber facets growing upward to a pointed tip, a soft warm golden glow deep at its heart, a little drifted sand at its foot » | 0,5 |
| `palais-cristal.png` | `51ac0edb` | moyenne 1k, transparent, 2:3 ; `batiment` | « the Pavilion of the Queen of the Sands: a tall open pavilion of living crystal that grows in a rising spiral, pale cream and amber crystal blades and arches, no walls so that the wind can pass, long pale linen veils stretched between the crystal arches and moving in the wind, an open entrance facing the viewer, warm golden light inside » | 0,5 |
| `temple-desert.png` | `89f8276b` | moyenne 1k, transparent, 1:1 ; `batiment` | « the Temple of the Living Desert: a low open sanctuary under a wide dome of amber glass ribs that grow like living crystal in a spiral, no walls, open to the wind, sand drifted on its threshold, three slender plain glass rods standing inside, an open entrance facing the viewer » | 0,5 |
| `nid-dragon.png` | `1a3ca9f6` | moyenne 1k, transparent, 1:1 ; `batiment` (maxHeight 72) | « the nest of the young dragons on a high perch: a large round nest woven of pale petrified branches, bleached bones and strips of canvas, raised on a low platform of wooden beams, a few shed red dragon scales caught in the weave, a low opening facing the viewer, empty, no dragon » | 0,5 |
| `citerne.png` | `1fc759d6` | moyenne 1k, transparent, 1:1 ; `objet` (maxHeight 52) | « a water cistern of the Water Guardians: a great round-bellied earthenware jar as tall as a man, terracotta clay, bound with two broad copper hoops, a wooden lid half open on dark water, a small copper cup hanging on a cord » | 0,5 |
| `voile-ombre.png` | `034e4a53` | moyenne 1k, transparent, 1:1 ; `meuble` (maxWidth 60, maxHeight 52) | « a shade sail: a large rectangle of pale beige linen canvas stretched taut and sloping between four tall wooden poles, held by ropes, the cloth slightly worn and patched, nothing underneath » | 0,5 |
| `caisse-sable.png` | `cf5ef5e8` | moyenne 1k, transparent, 1:1 ; `meuble` (maxWidth 48, maxHeight 38) | « a heavy old crate of dull grey lead half buried in a small heap of sand, its surface pitted and polished by blowing sand, the heavy lid pried open and leaning against it, empty dark inside, no markings, no numbers » | 0,5 |
| `traces-pas.png` (`traces-pas-brut.png` écrasé de moitié en hauteur) | `194b7546` | moyenne 1k, transparent, 1:1 ; `petit` (maxWidth 40, maxHeight 22, foot 88, opacity 0.8) | « a short trail of six bare human footprints pressed into the ground, crossing diagonally, seen from above in isometric view, only the soft dark brown-grey imprints themselves with no ground, no sand and no snow around them » | 0,5 |
| `sable-v1-orange.png` (écarté : trop orange) | `423751c4` | moyenne 1k, opaque, 1:1, vue de dessus | « fine pale golden desert sand with soft low wind ripples, a few tiny darker grains, warm ochre and cream tones » | 0,5 |
| `sable.png` | `ed173ff6` | moyenne 1k, opaque, 1:1, vue de dessus (reprise) ; `sol` | « fine dusty desert sand of a muted pale beige-tan colour, desaturated and soft, not orange, not yellow, with soft low irregular wind ripples and a few tiny darker grains » | 0,5 |
| `piste.png` | `e65891e1` | moyenne 1k, opaque, 1:1, vue de dessus, `sable.png` en référence ; `sol` | « the same desert sand as in the reference image, trampled and packed hard by thousands of travellers: countless overlapping bare footprints, sandal prints, hoof prints and faint crossing wheel ruts in every direction, slightly darker and more compact than loose sand » | 0,5 |
| `rail-sable.png` | `3f7c10b0` | moyenne 1k, opaque, 1:1, vue de dessus, `sable.png` en référence ; `sol-voie` | « the same desert sand as in the reference image, with an old railway track of the Ancient World half buried in it, running straight from the top edge to the bottom edge, centered: two heavily rusted iron rails, a few old dark wooden sleepers partly covered by drifted sand » | 0,5 |
| `carapace.png` | `e0a62a17` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « the back of a colossal desert titan's carapace: large irregular interlocking plates of weathered sandstone-coloured shell of different sizes, worn smooth by bare feet, thin dark seams between the plates with a little drifted sand, a few small amber crystal shards embedded in the shell » | 0,5 |
| `verre-sol.png` | `2c6ed460` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « a floor of pale cream and amber living crystal glass, smooth and slightly translucent, faint golden veins curling in spirals beneath the surface, fine scratches, a thin dusting of sand » | 0,5 |
| `tapis-sable.png` | `a1f3a4a7` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol` | « the floor inside a nomad tent: several overlapping plain woven mats of coarse rust-red and dark ochre fibre laid over sand, a simple coarse weave texture, a few thin stitched seams, sand dust between the mats, no ornamental pattern » | 0,5 |
| `pont-corde.png` | `e99994bb` | moyenne 1k, opaque, 1:1, vue de dessus ; `sol-voie` | « a rope bridge running straight from the top edge to the bottom edge, centered, covering the middle half of the width: weathered pale wooden planks laid crosswise and lashed with thick ropes, a thick rope handrail along each side; on both sides of the bridge, muted pale beige-tan desert dunes far below, seen from very high, hazy and slightly blurred » | 0,5 |
| `mur-toile.png` | `00f430dd` | moyenne 1k, opaque, 1:1, mur vu de face ; `wall` (kind "wall", height 60) | « the inside wall of a large nomad tent: heavy sand-coloured canvas with vertical sewn seams, pale wooden tent poles standing vertically at even intervals, a few patched spots and dust stains » | 0,5 |
| `portrait-tam-ruu.png` | `48f63c7a` | haute 1k, opaque, 1:1, `tam-ruu.png` en référence | « the same man as in the reference image, Tam'Ruu, the keeper of the travelling inn of a desert city that walks, same face, same shaved head and greying beard, same leather apron and linen tunic, the wooden ladle in his hand, a broad, warm, tired smile, steam rising from a pot below » | 1,5 |
| `portrait-ish-lenne.png` | `b06b73f9` | haute 1k, opaque, 1:1, `ish-lenne.png` en référence | « the same old woman as in the reference image, Ish'Lenne, the storyteller of the Tent of a Thousand Steps, same face, same long white hair, same plum-coloured robe, the faded ribbons knotted on her wrists, eyes half-closed as if listening to a story that belongs to a place, a grave, tender, fragile expression, the warm glow of a brazier on her face » | 1,5 |
| `portrait-ahm-ras.png` | `3cdffcdb` | haute 1k, opaque, 1:1, `ahm-ras.png` en référence | « the same man as in the reference image, Ahm'Ras, the pure nomad, same weathered face, same grey beard and cropped grey hair, same worn travelling coat, eyes narrowed as against the wind, a stubborn, guarded, haunted look of a man who carries two numbers that nobody else knows, campfire light on his face » | 1,5 |
| `portrait-hiran-amra.png` | `d624533b` | haute 1k, opaque, 1:1, `hiran-amra.png` en référence | « the same woman as in the reference image, Hiran'Amra, the Crystal Matriarch, same face, same tight black bun, same amber crystal jewels on her forehead and at her throat, same rust-red robe, the small glass balance in her hand, a shrewd, courteous, calculating half-smile » | 1,5 |
| `portrait-shal-vera.png` | `683fc938` | haute 1k, opaque, 1:1, `shal-vera.png` en référence | « the same woman as in the reference image, Shal'Vera, the Queen of the Sands, same face, same translucent skin with glowing golden veins, same amber crystal eyes, same long dark hair, same robe of glass threads, the same slender crown whose points are small pointed amber crystal shards (not leaves), a calm, deep, searching gaze, as one looks at a road, a soft inner golden glow under her skin » | 1,5 |
| `marche-marcheur-camp/s.png` | `8b0af78c` | moyenne 1k, transparent, 21:9, `marcheur.png` en référence | « (a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a leather belt with a water flask, a linen face veil lowered around the neck, strapped sandals, a rolled tent canvas across his back) … walking toward the viewer, facing the viewer … the legs, arms and tunic moving » | 0,5 |
| `marche-marcheur-camp/se.png` | `901cf784` | moyenne 1k, transparent, 21:9, `marcheur.png` en référence | « (a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a leather belt with a water flask, a linen face veil lowered around the neck, strapped sandals, a rolled tent canvas across his back) … walking toward the lower right, three-quarter front view turned to the right … the legs, arms and tunic moving » | 0,5 |
| `marche-marcheur-camp/e.png` | `c2b7e969` | moyenne 1k, transparent, 21:9, `marcheur.png` en référence | « (a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a leather belt with a water flask, a linen face veil lowered around the neck, strapped sandals, a rolled tent canvas across his back) … walking to the right, seen in side profile facing right … the legs, arms and tunic moving » | 0,5 |
| `marche-marcheur-camp/ne.png` | `a4195681` | moyenne 1k, transparent, 21:9, `marcheur.png` en référence | « (a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a leather belt with a water flask, a linen face veil lowered around the neck, strapped sandals, a rolled tent canvas across his back) … walking toward the upper right, three-quarter back view turned to the right … the legs, arms and tunic moving » | 0,5 |
| `marche-marcheur-camp/n.png` | `bd223ca3` | moyenne 1k, transparent, 21:9, `marcheur.png` en référence | « (a wide flat-brimmed hat of stiff pale canvas, a loose ochre linen tunic, wide trousers gathered at the ankles, a leather belt with a water flask, a linen face veil lowered around the neck, strapped sandals, a rolled tent canvas across his back) … walking away from the viewer, seen from behind … the legs, arms and tunic moving » | 0,5 |
| `marche-porteuse-camp/s.png` | `6f419d45` | moyenne 1k, transparent, 21:9, `porteuse-eau.png` en référence | « (a deep blue linen tunic, wide trousers gathered at the ankles, a leather belt, strapped sandals, a large round clay water jar carried on her back in a leather harness) … walking toward the viewer, facing the viewer … the legs, arms and tunic moving » | 0,5 |
| `marche-porteuse-camp/se.png` | `ee294b62` | moyenne 1k, transparent, 21:9, `porteuse-eau.png` en référence | « (a deep blue linen tunic, wide trousers gathered at the ankles, a leather belt, strapped sandals, a large round clay water jar carried on her back in a leather harness) … walking toward the lower right, three-quarter front view turned to the right … the legs, arms and tunic moving » | 0,5 |
| `marche-porteuse-camp/e.png` | `94fd2f39` | moyenne 1k, transparent, 21:9, `porteuse-eau.png` en référence | « (a deep blue linen tunic, wide trousers gathered at the ankles, a leather belt, strapped sandals, a large round clay water jar carried on her back in a leather harness) … walking to the right, seen in side profile facing right … the legs, arms and tunic moving » | 0,5 |
| `marche-porteuse-camp/ne.png` | `8278f58b` | moyenne 1k, transparent, 21:9, `porteuse-eau.png` en référence | « (a deep blue linen tunic, wide trousers gathered at the ankles, a leather belt, strapped sandals, a large round clay water jar carried on her back in a leather harness) … walking toward the upper right, three-quarter back view turned to the right … the legs, arms and tunic moving » | 0,5 |
| `marche-porteuse-camp/n.png` | `866700be` | moyenne 1k, transparent, 21:9, `porteuse-eau.png` en référence | « (a deep blue linen tunic, wide trousers gathered at the ankles, a leather belt, strapped sandals, a large round clay water jar carried on her back in a leather harness) … walking away from the viewer, seen from behind … the legs, arms and tunic moving » | 0,5 |
| `marche-mere-arrivee-v1-turban.png` (écarté : un turban) | `f4ba8521` | haute 2k, opaque, 16:9 | « The arrival at Marche-Mère, a nomad city that never stops walking across a vast desert, seen at dusk from a low dune as a caravan of glassmakers' wagons joins it: on the horizon, several colossal sand leviathans, ancient desert titans like giant tortoises crossed with crabs, hundreds of metres long, walking slowly in a line, their huge domed carapaces of weathered sandstone plates and amber crystals carrying small clusters of tents; on the back of the central one, a tall open spiral palace of living crystal glowing amber; rope bridges strung between the giant beasts and a few small red dragons flying around them; on the sand around the leviathans, a huge crowd on foot and long convoys of wagons covered with canvas stretched over pale bone ribs, people raising beige and ochre tents for the evening camp, the first campfires being lit, slender glass rods planted in the sand; long shadows, a low copper sun and a cool violet sky. Small figures, an invented desert culture of this fantasy world, not based on any real-world culture. The lower third is darker, calm shadow of the dunes in the foreground, leaving room for a dialogue panel. » | 2,75 |
| `marche-mere-arrivee.png` | `0380ef64` | haute 2k, opaque, 16:9, la v1 en référence (reprise) | « The same image as the reference image, keeping exactly the same scene, composition, colours, light, giant walking leviathans, crystal palace, camp, crowd and foreground figures, with one single change: the old white-bearded man standing at the far left behind the wagon is now bareheaded, with short tousled white hair, no turban, no head wrap, no headscarf. Nobody in the image wears a turban or a keffiyeh: an invented desert culture of this fantasy world, not based on any real-world culture. The lower third stays darker, calm shadow of the dunes in the foreground, leaving room for a dialogue panel. » | 2,75 |
| `fond-marche-mere.png` | `46c0190d` | haute 1k, opaque, 16:9 | « an endless desert of muted pale beige-tan dunes and wind ripples seen from very high above, dusty desaturated sand, not orange, with long violet-blue dune shadows, a few faint caravan tracks » | 1,5 |

**Dans le jeu** : 55 tuiles (dont `mur-toile`, le mur des tentes, et `pilier-cristal`, qui fait aussi le mur du Pavillon et
du Temple), 5 portraits (`npcs.json`), 2 planches de marche (`public/sprites/figurant-marcheur-camp.png`,
`figurant-porteuse-camp.png`, `figurants.json`), le fond `public/fonds/marche-mere.jpg` (les six lieux de la Marche,
`src/data/fonds.json`), l'illustration `public/illustrations/marche-mere-arrivee.jpg` sur le premier mot d'Ish'Lenne
(`ish-lenne.json`, nœud `caisse-debut`).

**Bilan** :
- **Reprises (2, 3,25 crédits)** : le **sable**, sorti orange vif (moyenne 236, 168, 81, quand le dessin provisoire
  était beige, 216, 184, 128), et il couvre toute la Marche : refait « muted pale beige-tan, desaturated, not orange »
  (188, 159, 131), avant la piste et le rail qui le prennent en référence ; l'**illustration**, où le vieil homme barbu
  du premier plan, à gauche, portait un turban bien lisible : refaite avec la v1 en référence, tout pareil, l'homme tête
  nue aux cheveux blancs (le reste de l'image n'a pas bougé). Rien d'autre refait.
- **Retouches sans nouvelle image** : `traces-pas` est la v1 écrasée de moitié en hauteur (sharp), pour que les
  empreintes, peintes vues de dessus, se couchent sur le sol isométrique ; la tuile sert aussi à Khrysos
  (`traces-sigrun`, sur la neige) : des empreintes seules, sans sable, à 80 % d'opacité. Le verrier (halo de sa paraison
  rougeoyante) et le chariot-four (fumée) sont détourés par `"matte": true` ; la dune, sans ombre d'encre.
- **L'illustration** est sur `src/data/dialogues/ish-lenne.json`, nœud `caisse-debut` (« Tu viens pour « La caisse que
  personne n'est venu chercher ». Je connais ses mots… »). Au Camp, personne ne reçoit le héros à l'entrée ((2, 12) :
  Ahm'Ras est assis seul près du feu, le soir, Oss'Amar assis dans le sable ; le panneau dit seulement « Un enfant te
  montre du doigt la Halte, la Tente des Mille Pas, la Tente de l'Eau ») ; c'est donc **celle vers qui le journal envoie
  d'abord** : la lettre de Hesper (« Leurs conteurs ont un épisode qu'ils ne disent plus », `mer-rend` faite), puis
  « Marche-Mère : la Tente des Mille Pas, au Camp » (`fil.json`). La ville n'apparaît sur la carte qu'avec `mer-rend`
  faite : `caisse-debut` (`mer-rend` faite, `plus-lieu` pas commencée, avant les nœuds du soir) est le premier mot
  d'Ish'Lenne pour tout héros. Le nœud `accueil` (sans le fil) ne l'a pas. Tam'Ruu (nœud `dame`) peut aussi lancer la
  quête si l'on va d'abord à la Halte : il n'a pas l'illustration.
- **Sortes vérifiées** (avec les dessins provisoires et les cartes de `scripts/build-maps.mjs`) : les cinq tentes, le
  chariot-four, le Pavillon, le Temple et le Nid sont des maisons (porte en dessous) : entrée tournée vers nous ;
  `mur-toile` est le mur des intérieurs (`kind: "wall"`) ; `pilier-cristal` en `haut` ; `flanc-leviathan` n'est posé
  sur aucune carte aujourd'hui (peint quand même, en rempart de carapace) ; `tete-leviathan` est la tête de Longue-Ombre
  au bout de son dos (tournée vers la droite) ; `dragon-rouge`, Kresh'Tal sur son perchoir (`colosse`) ; le dragonnet
  roulé en boule, la tête basse, les écailles ternes (« roulé en boule dans le sable du Nid. Il ne lève pas la tête »),
  en `creature` réduite (40 × 30) ; `pilleur-sables`, ennemi humain en pied ; `keo-sa` et `enfant-marche` en `enfant`.
- **Tuiles partagées** : `marcheuse` sert à cinq passants (la Marcheuse, la convoyeuse, la Marcheuse du Souffle, la
  Lien-Dragon, la femme du clan) : peinte pieds nus (« Pieds nus, elle est plus nette »), sans rien de propre à l'une
  d'elles ; `convoyeur` sert aussi au diseur de nouvelles de la Halte ; `enfant-marche` aux deux enfants. La PNJ
  « Marcheuse du Souffle » du Temple (tête rasée, pieds nus) n'a pas de tuile à elle : elle garde la silhouette `pnj`.
- **À valider par Cyril (inventions visuelles ; le canon donne les rôles, pas les visages)** : Tam'Ruu (large, crâne
  rasé, barbe grise courte, tablier de cuir, louche, comme son texte) ; Ish'Lenne (âgée, longs cheveux
  blancs, robe prune délavée, rubans de couleurs aux poignets, comme son texte) ; Nes'Mira (pieds nus, avant-bras gris de
  sable, pot de baume, comme son texte ; sacoche de pots) ; Varo'Ssin (grand et maigre, plaques de verre au visage, au
  cou, mains de verre, comme son texte ; tablier brûlé, canne de verrier) ; Saal'Ema (minuscule, très ridée, longue
  tresse blanche, bâton de route, comme son texte ; robe rouille à bandes ocre) ; Kéo'Sa (neuf ans, écaille rouge au cou,
  comme son texte ; tunique ocre, pieds nus) ; Yel'Dara (voile bleu pâle en capuche, mains vides jointes, comme son
  texte) ; la Gardienne de l'Eau (voile et robe bleu profond, mains mouillées, jarre, comme son texte ; une lanterne à la
  ceinture, que le prompt excluait : le feu n'est pas exclu à la Marche) ; Daru'Khen (sec, écharpe couleur de sable en
  capuche, bâton, comme son texte) ; Hiran'Amra (chignon, cristaux d'ambre au front et au cou, balance de verre, comme son
  texte ; robe rouille) ; Ahm'Ras (soixante ans, barbe grise, manteau de route rapiécé, yeux plissés, comme son texte) ;
  Eskil (pâle, blond, veste de forage gris-bleu à boutons de laiton sous une toile de Marcheur, bottes) ; Ysha'Ren
  (seize ans, tresse, foulard aux avant-bras, peau de verre dessous, comme son texte) ; Dova'Ren (bras croisés, pieds
  nus) ; Oss'Amar (manteau de deuil gris sans parure, deux traits noirs aux joues, pieds nus, comme son texte et le
  canon des funérailles) ; la Reine Shal'Vera (peau pâle translucide aux veines d'or, yeux d'ambre, longs cheveux bruns
  ondulés, robe de fils de verre, couronne d'éclats d'ambre, pieds nus, comme le canon) ; le pilleur (écharpe noire sur
  la tête et le visage, pelle, couteau, outre presque vide, comme son texte) ; les passants (le Marcheur au **chapeau
  plat à large bord** de toile, canon « chapeau large », qui sort un peu conique ; la porteuse d'eau en bleu, **la jarre
  portée dans le dos** dans un harnais, au lieu de sur la tête ; la Marcheuse en rouge, voile baissé au cou ; le
  convoyeur au fouet et à l'aiguillon ; le verrier à la canne et sa paraison ; l'enfant aux cheveux bouclés) ; le
  dragonnet ; Kresh'Tal (rouge sombre, cornes usées, sur un perchoir de grès et d'ambre). Décors : les tentes de toile
  sur des arceaux de bois pétrifié et de **grands os courbes**, une lanterne à l'entrée ; la Tente de l'Eau bleue à motif
  de vague et sa jarre ; la Tente des Mille Pas aux mâts couverts de rubans et au brasero ; les chariots bâchés sur des
  **côtes d'os** (pour ne pas faire un chariot bâché du Far West), le bleu chargé de jarres et d'outres ; le chariot-four
  de brique et sa cheminée ; le jalon, une tige de verre nue ; la tête de Longue-Ombre en **tortue de pierre**, l'œil
  d'ambre mi-clos (avec, sur la carapace, deux minuscules cheminées qui fument, presque invisibles en jeu) ; le flanc en
  rempart de plaques ; les piliers de cristal blanc et ambre ; le Pavillon en spirale de lames de cristal tendue de
  voiles ; le Temple, un dôme de côtes de verre ambré en spirale, ouvert, trois jalons dedans ; le Nid, une corbeille de
  branches, d'os et de toile, une lanterne sur un mât ; la citerne de terre cerclée de cuivre ; la caisse de plomb
  ouverte, à demi ensablée, sans marque ; la carapace en grandes plaques de grès, éclats d'ambre ; le sol de verre crème
  aux veines dorées en spirale ; les nattes rouille et ocre des tentes. L'illustration : l'arrivée au crépuscule avec la
  caravane des verriers, sous un ciel violet et un soleil cuivre ; **trois Léviathans en tortues-crabes géantes sur de
  hautes pattes**, les dos chargés de tentes et de cristaux, des ponts de corde entre eux, le Pavillon de cristal en
  spirale sur celui du milieu, des dragons rouges ; autour, la foule à pied, les convois, les tentes qu'on dresse, les
  feux et les jalons de verre ; tirés par des bœufs à longues cornes et **un dromadaire**, un soleil peint sur une bâche.
  Le fond : des dunes beiges vues de très haut, ombres violettes.
- **Vu au passage** : les tentes, plus larges que hautes, sont limitées par la largeur de la case (64 px) : ≈ 52 px de
  haut, moins que les 74 px du dessin provisoire ; elles se lisent, mais basses. Les nattes des tentes forment un damier
  à l'échelle du jeu. Le jour (la Marche en route, et sur les Léviathans), le « sable qui défile » du code passe devant le
  fond peint ; le soir et hors de la Marche, le fond se voit. **Un défaut du code** (`src/scenes/DialogueScene.ts`, non
  corrigé, hors du lot) : une illustration sur le **premier** nœud d'un dialogue ne s'affiche que la première fois qu'on
  l'ouvre ; ensuite, l'image étant déjà chargée, `show()` appelle `showIllustration()` pendant `create()`, où
  `this.scene.isActive()` est encore faux : la fonction sort aussitôt (vérifié dans Chromium : rouvert, le nœud
  `caisse-debut` a `illustration.visible === false`). Cela vaut pour toutes les illustrations d'arrivée (Véline,
  Mérande…) quand on reparle au personnage dans la même partie.
- Vérifié dans Chromium (serveur de dev) : le Camp le soir et la Marche en route, le convoi des verriers, le Cœur Spiral,
  le dos de Longue-Ombre, le désert (les pilleurs au col, le chariot perdu), la halte morte (le rail, la caisse, la dame
  en gris), la Halte, la Tente des Mille Pas, la Tente de l'Eau, la tente des Ren, l'Atelier, le comptoir, le Pavillon,
  le Temple, le Nid ; les portraits d'Ish'Lenne, Tam'Ruu, Ahm'Ras, Hiran'Amra et de la Reine ; l'illustration derrière
  `caisse-debut` ; les deux marcheurs ; un combat contre deux pilleurs ; aucune erreur (seulement des avertissements
  WebGL de performance) ; typecheck et 1079 tests passent.

## Lot commun (2026-11-08) : 18 images, 27,25 crédits, solde 1 787,61

Peint par Claude, en dernier : ce qu'aucune ville ne portait. `gpt_image_2_6`, bloc commun du style révisé ; personnages
et objets en moyenne 1k transparent (2:3 ou 1:1) ; portraits en haute 1k opaque, fond encre ; illustrations en haute
2k 16:9 ; fonds en haute 1k 16:9. Bruts : `assets/raw/commun/` ; branchés par `scripts/art/commun.json`. Tout gardé au
premier essai. `reflet` (l'éclat sous le pont de Gardebois, un indice pour le joueur) reste dessiné par le code, comme
le PNJ générique `pnj` : 421 tuiles peintes sur 423.

| Image | Tâche | Sujet du prompt | Crédits |
|---|---|---|---|
| `ouvrier` (passants d'Ironheart) | `189eb7d6` | « a forge worker of an industrial city, a worn man in his forties in faded grey work clothes and a grey flat cap, soot on his face and hands, a tired, hollow look, a short iron bar resting on his shoulder » | 0,5 |
| `caravaniere` | `67b436bc` | « a caravan woman of a merchant company after three days on the road, a long dusty travel coat over worn leather, a faded scarf, sturdy boots, a small travel bag » | 0,5 |
| `cueilleuse` | `31d0c4d2` | « a mushroom picker of a forest village, a lean woman in a moss-coloured hooded smock, a wicker basket of brown mushrooms with a few faintly glowing cyan ones, a small knife, a sly, knowing look » | 0,5 |
| `garde-vert` | `f39dfff3` | « a guard of a forest republic watching the road to an industrial empire, a stern man in a deep green hooded cloak over leather armour, a long spear, a horn at his belt » | 0,5 |
| `vieille` | `db7edd1a` | « a very old woman with a frail bent back, a thick knitted shawl over a plain dark dress, thin white hair in a bun, her empty hands joined, a faraway, lost gaze » | 0,5 |
| `geometre` | `d4a59203` | « a surveyor woman from an industrial empire, a practical coat with brass buttons, a folded brass surveying instrument on a tripod over her shoulder, a notebook, frowning with doubt » | 0,5 |
| `convoyeuse` | `4ed1fab0` | « a caravan leader of a merchant company, a strong woman in her forties in a long road coat, leather gloves, checking a leather strap held in both hands, a coiled whip at her belt » (son texte : « Une femme en manteau de route vérifie les sangles d'un chariot ») | 0,5 |
| `colporteuse` | `f647e93b` | « a travelling peddler woman on the forest roads, a big backpack hung with rolled bandages, coils of rope, small jars of balm and a bunch of red strings » (son texte : « une ficelle rouge contre les loups ») | 0,5 |
| `voyageur-egare` | `1373a2e4` | « a lost traveller, a young man in a crumpled travel coat and muddy boots, holding a large unfolded paper map with no readable marks, embarrassed and blushing, scratching his head » | 0,5 |
| `echo-furieux` | `dcb0a6a1` | « a Furious Echo, a ghostly human figure rendered as pale luminous blue translucent smoke with soft golden outlines, split into three overlapping blurred copies of the same body, contorted and violent, clawed hands reaching out » (préréglage `echo`) | 0,5 |
| `charrette` | `11f18b22` | « a simple wooden handcart with two large wooden wheels and long handles, loaded with sacks under a stained canvas tarp tied with rope » | 0,5 |
| `carriole` | `f80aaadc` | « a small covered wagon of a travelling merchant, one axle with two wheels and a shaft resting on the ground, a patched canvas cover on wooden hoops, small crates tied at the back » | 0,5 |
| Portrait : la fin, la mère au registre | `51e65016` | « an Echo of the past, a woman in her fifties in a light grey coat standing at a registry lectern, a dry quill in her hand, made of the same pale luminous blue light as a ghost train… a calm, grave, loving gaze » (son texte : « manteau gris clair… une plume sèche… faite de la même lumière que le train ») | 1,5 |
| Portrait : la fin, l'enfant à la fenêtre | `d8b4995c` | « an Echo of a child of about eight seen through the last window of an old train carriage, one small hand pressed flat against the glass with fingers spread… patient and sad eyes » (son texte : « Il pose la main contre la vitre, les doigts écartés ») | 1,5 |
| Portrait : la fin, le mandataire | `9f1c5285` | « a nameless man in a long dark rain coat with a high collar and a wide-brimmed hat, his face almost entirely in shadow, his very pale, almost white gloves the brightest thing in the image, one gloved hand resting on the edge of an iron frame » (son texte : « on ne voit que ses gants, très clairs ») | 1,5 |
| La carte du monde peinte | `3b373024` | La carte dessinée du jeu en référence (capture, téléversée) : « Repaint the reference map as an old hand-painted traveller's map on aged parchment… keeping exactly the same layout and proportions: forests… exactly where the green clumps are; grey mountains along the top right corner; a strip of pale ice fields along the top edge in the middle; a desert of dunes in the bottom right corner… Remove every text, label, frame, circle, marker, dotted line » | 2,75 |
| Fond `gardebois` (Gardebois, le Sol des Racines, les rencontres) | `73c1fe3b` | « an ancient forest of colossal trees seen from far above at dusk, dense dark green crowns and mist drifting between them, a few faint warm lights deep below » | 1,5 |
| Fond `souterrain` | `a287c680` | « a deep underground darkness seen from above, wet stone vaults and rubble, old rails disappearing into the dark, dripping water, a few faint cyan glints of crystal » | 1,5 |
| Illustration de la fin « monte » | `7ffead66` | « A ghostly train made of pale luminous blue light leaves an abandoned terminus platform under grey ash clouds at night; every window full of faint translucent faces; at the last window two hands, a child's and an older one, are joined against the glass… » | 2,75 |
| Illustration de la fin « reçu » | `baf4497c` | « an old registry book lies open on a brass lectern, a long column of handwritten names drawn as abstract unreadable strokes, a fresh signature at the bottom… a ghostly train leaves empty… small translucent silhouettes of children fade peacefully » | 2,75 |
| Illustration de la fin « jetée » | `b788f05e` | « a heavy iron frame holding seven small glowing pieces tumbles into a deep chasm that glows faintly cyan… a ghostly train passes by without stopping, its windows full of faint hands » | 2,75 |
| Illustration de la fin « déchirée » | `f6297783` | « a chasm forced wide open tears through the dark; pale blue memory echoes ripped apart like smoke and torn paper… hired men in black scarves recoil… a ghostly train rushes past without stopping; far along the line, small lit halts fade into grey » | 2,75 |

**Dans le jeu** : la carte du monde peinte sous les lieux, la piste, les noms et la lisière (`WorldMapScene`, dans le
cadre exact de la carte dessinée) ; l'illustration de chaque fin sous les pages de l'épilogue, voilée d'encre
(`EpilogueScene`) ; les deux fonds. Vérifié dans Chromium. Corrigés en même temps : une illustration d'arrivée ne
s'affichait qu'à la première ouverture de son dialogue (signalé par le lot Marche-Mère) ; la carte peinte passait
d'abord devant les lieux.

**Bilan de la mise en beauté (pilote, neuf portraits, sept villes, lot commun)** : 521 images, 357,75 crédits (plan
≈ 397, ≈ 410 avec les neuf portraits) ; avec la musique (854,64), 1 212,39 crédits dépensés sur 3 000 ; **solde 1 787,61**.
421 tuiles peintes sur 423 ; 58 portraits ; 14 passants qui marchent ; 8 illustrations d'arrivée (Canopéa à Khrysos),
la carte du monde et 4 fins ; 10 fonds peints. Cache hors ligne : 18,4 Mo (14,6 avant) ; les illustrations, les fonds et
la musique se mettent en cache à la première vue.

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

