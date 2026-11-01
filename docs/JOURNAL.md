# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- Jalon 1, la tranche verticale : les 8 points de `docs/gdd/cahier-des-charges.md` sont faits. Jouable sur PC et iPhone.
- 170 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Quête « Le Dernier Train » : **les 4 résolutions sont jouables** (parole, Récit, combat, discrétion).

## Jalon en cours : clôture du jalon 1, en attente du feu vert de Cyril

- Contenus à valider : Gare Engloutie, Écho, Ingrid, nœud « resolu » d'Ilyane, caisse, 30 Fers
  (`docs/univers/lieux/gare-engloutie.md`).
- Chiffres à valider : armes et ennemis, prix, 15 Fers au départ, Fers gagnés, seuils d'XP (`docs/gdd/`).
- Choix à valider : arène de combat dédiée ; pas de point d'attribut à la montée de niveau ; objets réservés
  à un lieu ou stock limité chez les marchands (`docs/gdd/inventaire.md`).
- À essayer par Cyril : plein écran sur un vrai PC ; écrans compacts sur PC (pause, inventaire, combat) ;
  dernière version sur iPhone (HUD, pause, options, sabotage, « Ordre du tour » en combat).

## Prochaine étape

1. Catalogue par marchand ; couverture, fuite et arène tirées de la carte (arène plus grande sur PC).
2. Phase 2 des visuels (plan et coût présentés avant toute génération).

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
