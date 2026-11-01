# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- Jalon 1, la tranche verticale : les 8 points de `docs/gdd/cahier-des-charges.md` sont faits. Jouable sur PC et iPhone.
- 164 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Quête « Le Dernier Train » : **les 4 résolutions sont jouables** (parole, Récit, combat, discrétion).

## Jalon en cours : clôture du jalon 1, en attente du feu vert de Cyril

- Contenus à valider : Gare Engloutie, Écho, Ingrid, nœud « resolu » d'Ilyane, caisse, 30 Fers, **sabotage de
  nuit et réactions d'Ingrid** (`docs/univers/lieux/gare-engloutie.md`).
- Chiffres à valider : armes et ennemis, prix, 15 Fers au départ, Fers gagnés, seuils d'XP, **difficulté 10 des
  deux jets du sabotage** (`docs/gdd/`).
- Choix à valider : arène de combat dédiée ; armes équipées sans effet en combat ; un seul catalogue pour
  tous les marchands ; pas de point d'attribut à la montée de niveau ; **un échec de nuit ferme la voie discrète**.
- À essayer par Cyril : plein écran sur un vrai PC ; dernière version sur iPhone (HUD, pause, options, sabotage).

## Prochaine étape

1. Armes équipées en combat ; couverture, fuite et arène tirées de la carte ; catalogue par marchand.
2. Phase 2 des visuels (plan et coût présentés avant toute génération).

## Points ouverts

- En combat, les noms des combattants se chevauchent quand ils sont côte à côte.
- Sur PC, menu pause, inventaire et combat gardent des boutons au format du doigt.
- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
