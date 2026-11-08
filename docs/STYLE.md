# Fiche de style — visuels de la phase 2 (validée par Cyril le 2026-11-01, après le pilote)

Fiche unique, reprise dans **tous** les prompts d'images (`CLAUDE.md` §5). Plan des images et journal des générations :
`docs/ASSETS.md`. Ton de l'univers : `docs/univers/ton.md`.

## Direction

- **Peinture numérique douce et lumineuse** : formes simples et lisibles en petit, contours légèrement marqués,
  lumière chaude, couleurs saturées sans être criardes. Un monde dangereux mais beau, jamais sombre ni sale.
- **Public 8–15 ans** : pas de sang, pas de blessure visible, des créatures impressionnantes mais pas effrayantes.
  **À revoir avant la mise en beauté** : depuis le 2026-11-02, le jeu est une dark fantasy pour adultes (« le côté
  image fantasy, mais dans un univers sombre », `docs/univers/ton.md`).
- **Vue isométrique 2:1** pour la carte et le combat (losange deux fois plus large que haut, comme les tuiles actuelles).
  Lumière venant du **haut à gauche**, ombres douces vers le bas à droite, sur toutes les images.
- **Originalité** : aucun nom d'artiste, de studio, de film ou de jeu dans les prompts ; on décrit le rendu voulu.

## Palette

- **Interface** (sceau de Cyril) : Encre `#1B1512`, Cuivre `#C9804F`, Parchemin `#EAD9B8`.
- **Verdantis / Gardebois** : verts mousse et feuillage (`#3E4A2C`, `#56653D`), bois chaud (`#6B4A32`), lumière dorée.
- **Ferros** : fer bleuté, cuivre et laiton patinés, rouille orangée, cuir sombre.
- **Magie et cristaux** : bleu-cyan lumineux, discret, comme une lueur intérieure.
- **Échos du Passé** : silhouettes translucides bleu pâle bordées d'or, légèrement floues, comme un souvenir.

## Ce qu'on évite

- Technologie moderne brillante (écrans, plastique, armes à feu modernes) : le monde est **néo-industriel**
  (vapeur, cristaux, laiton) [E2, E9].
- Texte, lettres ou logos dans les images.
- Tout stéréotype culturel réel [E1].

## Formats techniques

| Type | Généré en | Utilisé en jeu | Fond |
|---|---|---|---|
| Tuile de sol | 1024 × 1024, **texture vue de dessus** raccordable (projetée en losange par script) | 64 × 32 | opaque |
| Obstacle ou décor (arbre, wagon…) | 1024 × 1536 | 64 × 96 | transparent |
| Personnage (carte et combat) | 1024 × 1536, en pied, vue 3/4 de face | 64 × 96 | transparent |
| Portrait de dialogue | 1024 × 1024, buste | environ 200 × 200 | fond uni du panneau |
| Illustration | 1920 × 1080 | plein écran | complet |

Les images sont réduites et découpées par `scripts/process-art.mjs` (`npm run art`, puis `npm run tiles`).
Pour les sols, le prompt retire la lumière directionnelle (« perfectly even, uniform lighting ») pour que la
texture se raccorde ; une piste, un pont ou un rail court du haut vers le bas de la texture et suit ainsi les
colonnes de la carte. Pour les décors, le prompt demande « no ground, no base, no cast shadow on the ground » : l'ombre
de contact est ajoutée par le script (ellipse d'encre translucide), identique pour tous. Le modèle retenu (GPT Image 2.5, `docs/ASSETS.md`)
produit directement un **fond transparent** (`--background transparent`).

## Bloc de prompt commun (anglais : les modèles le comprennent mieux)

> soft painterly digital illustration, warm luminous light from the upper left, gentle soft shadows,
> clean readable shapes, slightly defined outlines, rich but harmonious colors, hopeful and wondrous mood,
> family-friendly fantasy, neo-industrial world of steam, crystals and brass, no modern technology

Pour les tuiles, décors et personnages, on ajoute : `isometric 2:1 view, single object centered, isolated on a plain
background`. À éviter dans tous les prompts : `text, letters, logo, watermark, blood, gore, modern firearms, screens,
photorealistic`.

## Personnages (descriptions visuelles proposées ; héros validé, les autres utilisées pour le lot 3 le 2026-11-01)

Le canon donne leur rôle, pas leur apparence. Tout ce qui suit est une **proposition**.

- **Héros** (apprenti Gardien de Mémoire, nom choisi par le joueur) : silhouette neutre, cape de voyage parchemin,
  sacoche, petite lanterne de cristal à la ceinture.
- **Ilyane Voix-d'Écorce** (Gardienne de Mémoire de Gardebois, mentor) : femme d'âge mûr, cape aux motifs d'écorce et de
  feuilles, bâton de bois clair surmonté d'un cristal, regard bienveillant.
- **Tobias Cendrefer** (marchand de Ferros) : homme jovial, tablier de cuir, gilet aux boutons de laiton, outils à la
  ceinture, lampe à cristal à la main.
- **Ingrid Brisefer** (ingénieure de Ferros) : femme décidée, lunettes de protection relevées, veste de travail
  renforcée de cuivre, plans roulés sous le bras.
- **Golem de Ferraille** [E2 : automate mi-technologique mi-magique] : assemblage massif de ferraille rouillée et de
  pièces de machines, veines de lumière tellurique cyan entre les plaques.
- **Rôdeur-Épine** [E8 : canidé recouvert d'épines flexibles, rapide] : canidé élancé, épines souples vert-brun le long
  du dos, allure vive, pas de crocs sanglants.
- **Écho du dernier train** : foule de voyageurs translucides sur le quai, bleu pâle bordé d'or (voir « Palette »).

## Révision proposée pour la mise en beauté (2026-11-08) — **à valider par Cyril** (le pilote la met à l'épreuve)

Le jeu est une dark fantasy pour adultes depuis le 2026-11-02 (`docs/univers/ton.md` : « le côté image fantasy, mais
dans un univers sombre », jamais gratuit ni nihiliste). Ce qui change, ce qui reste :

- **Reste** : la peinture numérique, les formes simples et lisibles à 64 px, les contours légèrement marqués, la vue
  isométrique 2:1, la lumière du haut à gauche, la palette du sceau pour l'interface, les cristaux cyan, les Échos bleu
  pâle bordés d'or, le monde néo-industriel, aucun nom d'artiste, de studio ou de jeu.
- **Change** : plus de « public 8–15 ans », plus de « family-friendly », plus de « hopeful » ; une lumière plus basse
  (lanternes, braises, crépuscule), des ombres plus froides, une palette plus sourde, des matières usées (cuir élimé,
  rouille, suie, cicatrices, fatigue sur les visages). Toujours : pas de gore, pas de sang complaisant, rien de
  sexualisé ; les créatures inquiétantes mais lisibles.
- **Sur la carte**, la différence reste douce : les sprites doivent aller avec ce qui est déjà peint (Gardebois) ;
  c'est dans les portraits et les illustrations que l'humeur change vraiment.

**Bloc de prompt commun proposé** (remplacerait celui du haut) :

> painterly digital illustration, dark fantasy for adults, muted earthy palette lit by warm lantern light against cool
> shadows, low-key light from the upper left, weathered materials and tired faces, melancholic and poetic mood, clean
> readable shapes, slightly defined outlines, neo-industrial world of steam, crystals and brass, no modern technology

À éviter dans tous les prompts : `text, letters, logo, watermark, gore, gratuitous blood, sexualized, modern firearms,
screens, photorealistic`. Pour les tuiles, décors et personnages, inchangé : `isometric 2:1 view, single object
centered, isolated on a plain background`, sans sol ni ombre (ajoutée par le script).

**Modèle** : `gpt_image_2_6` (le modèle par défaut aujourd'hui, même prix que `gpt_image_2_5` qui a peint le reste,
fond transparent natif) ; le pilote dit s'il va avec l'existant, sinon on garde `gpt_image_2_5`.
