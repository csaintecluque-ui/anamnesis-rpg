# Exploration

Code : `src/engine/tiledMap.ts` (lecteur Tiled), `src/engine/pathfinding.ts` (A*), `src/engine/iso.ts`, scènes `MapScene` et `HudScene`.

- **Cartes** : format Tiled (JSON, isométrique, tuiles de 64 × 32) dans `src/data/maps/`.
  - Elles sont générées par `npm run maps` (`scripts/build-maps.mjs`) et restent éditables dans Tiled.
  - Trois calques : `sol`, `obstacles` et `objets`.
  - Objets du calque `objets` : arrivées (`arrivee`), sorties (`sortie`, avec une `cible` et une `arrivee` : nom de
    l'objet d'arrivée dans l'autre carte), PNJ (`pnj`) et panneaux (`panneau`, avec un `texte`).
- **Tuiles** : planche provisoire `public/tiles/placeholder.png`, générée par `npm run tiles` (`scripts/tiles-def.mjs`).
  Une propriété `bloquant` sur la tuile rend la case infranchissable.
- **Déplacement** : on touche ou on clique une case, et le personnage trouve son chemin (A*, 8 directions, sans couper
  un coin bloqué). Un nouveau toucher en chemin le redirige.
- **Interactions** : toucher un PNJ ou un panneau (sur toute son image) fait marcher jusqu'à côté de lui, puis déclenche
  l'interaction : dialogue (`docs/gdd/dialogues.md`) ou texte du panneau.
- **Caméra** : zoom × 1,5, qui suit le personnage. Le HUD est une scène séparée, donc lisible quel que soit le zoom
  (`docs/gdd/interface.md`).
- **Outil de test** : en développement seulement, l'instance du jeu est exposée (`window.__anamnesis`) pour calculer
  la position exacte d'une case à l'écran. Elle est absente du site publié.
