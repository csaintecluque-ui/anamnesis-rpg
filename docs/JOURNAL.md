# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- **Jalon 1 clos** (validé par Cyril le 2026-11-01) : tranche verticale complète, jouable sur PC et iPhone.
  Les 4 résolutions de « Le Dernier Train » (parole, Récit, combat, discrétion), contenus et chiffres validés.
- 181 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Jalon en cours : phase 2 des visuels (en production)

- Choisie par Cyril le 2026-11-01. Avant toute génération : fiche de style (`docs/STYLE.md`), liste des images,
  coût en crédits, feu vert de Cyril (`CLAUDE.md` §5). Chaque génération consignée dans `docs/ASSETS.md`.
- À essayer par Cyril : plein écran sur un vrai PC ; dernière version sur iPhone (combat sur la carte, mode test).

## Prochaine étape

1. Pilote validé par Cyril (style et héros) le 2026-11-01. **Lots 1 (8 sols) et 2 (12 décors) générés et intégrés** :
   23 tuiles peintes sur 25 dans `public/tiles/tiles.png` (`npm run art` puis `npm run tiles`). 14 crédits dépensés
   depuis le début, reste 96. Suite : **lot 3 (personnages : Ilyane, Tobias, Ingrid, Golem, Rôdeur-Épine)**, environ
   2,5 crédits ; demande du code : PNJ et ennemis du combat partagent aujourd'hui la seule tuile `pnj`.
2. Après les visuels : proposer le périmètre du jalon 2 (contenu).

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
