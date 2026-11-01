# Exploration

Code : `src/engine/tiledMap.ts` (lecteur Tiled), `src/engine/pathfinding.ts` (A*), `src/engine/iso.ts`, scènes `MapScene` et `HudScene`.

- **Cartes** : format Tiled (JSON, isométrique, tuiles de 64 × 32) dans `src/data/maps/`.
  - Elles sont générées par `npm run maps` (`scripts/build-maps.mjs`) et restent éditables dans Tiled.
  - Trois calques : `sol`, `obstacles` et `objets`.
  - Objets du calque `objets` : arrivées (`arrivee`), sorties (`sortie`, avec une `cible` et une `arrivee` : nom de
    l'objet d'arrivée dans l'autre carte), PNJ (`pnj`) et panneaux (`panneau`, avec un `texte`).
- **Tuiles** : planche `public/tiles/tiles.png`, générée par `npm run tiles` (images peintes : `npm run art`, `docs/ASSETS.md`) (`scripts/tiles-def.mjs`).
- **Grands décors** : un décor plus grand qu'une case (l'Arbre-Titan, 2 × 2) occupe un bloc de cases portant la même tuile
  (propriété Tiled `grand`) ; son image `public/decor/<nom>.png` est dessinée une fois, depuis la case de devant du bloc.
  Sur la couche du sol, il passe sous les personnages : le pont (2 × 1 cases, de l'eau dessous), qui déborde sur les
  berges ; son image est centrée (largeur − hauteur du bloc) demi-cases à gauche de la case de devant (`bigBlock`).
  Une propriété `bloquant` sur la tuile rend la case infranchissable ; une propriété `couverture` (2 ou 4) donne la
  couverture de l'obstacle en combat (`docs/gdd/combat.md`).
- **Déplacement** : on touche ou on clique une case, et le personnage trouve son chemin (A*, 8 directions, sans couper
  un coin bloqué). Un nouveau toucher en chemin le redirige.
- **Interactions** : toucher un PNJ ou un panneau (sur toute son image) fait marcher jusqu'à côté de lui, puis déclenche
  l'interaction : dialogue (`docs/gdd/dialogues.md`) ou texte du panneau.
- **Caméra** : zoom × 1,5, qui suit le personnage. Le HUD est une scène séparée, donc lisible quel que soit le zoom
  (`docs/gdd/interface.md`).
- **Outil de test** : en développement seulement, l'instance du jeu est exposée (`window.__anamnesis`) pour calculer
  la position exacte d'une case à l'écran. Elle est absente du site publié.

## Maisons, intérieurs et objets d'histoire (jalon 2)

- **Porte** : un objet `porte` sur la case d'une maison ; le toucher fait marcher jusqu'à elle, puis entrer
  (`cible` : le lieu, `arrivee` : l'objet où apparaître). Pas d'entrée par mégarde en passant devant.
- **Intérieur** (`interior` dans `scripts/build-maps.mjs`) : une petite carte de parquet, des murs sur les deux côtés du
  fond (tuile `mur`, bloc construit par script à partir d'une texture de mur), ouverte devant comme une maquette ;
  le paillasson (`seuil`) au milieu du bord avant ramène devant la porte. Quatre intérieurs : maison d'Ilyane,
  Auberge de la Racine, maison Lunelierre, réserve de l'étal Cendrefer (`src/data/locations.json`).
- **Objets d'histoire** (`objet`, `coffre`, `echo`) : un dialogue à leur nom ; la propriété `disparaitSi` (repères
  séparés par des virgules) les retire de la carte quand l'histoire avance (herbe cueillie, caisse reprise).
- **Ennemis sur la carte** (`ennemi`, propriété `ennemi` : l'id d'`enemies.json`) : ils occupent leur case jusqu'à
  ce que leur combat (`src/data/encounters.json`, lancé par un dialogue) soit gagné ou évité (`disparaitSi`).

