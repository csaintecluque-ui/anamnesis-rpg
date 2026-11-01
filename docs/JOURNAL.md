# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- **Jalon 1 clos** (validé par Cyril le 2026-11-01) : tranche verticale complète, jouable sur PC et iPhone.
  Les 4 résolutions de « Le Dernier Train » (parole, Récit, combat, discrétion), contenus et chiffres validés.
- 181 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Jalon en cours : phase 2 des visuels (terminée, à valider par Cyril)

- Choisie par Cyril le 2026-11-01. Avant toute génération : fiche de style (`docs/STYLE.md`), liste des images,
  coût en crédits, feu vert de Cyril (`CLAUDE.md` §5). Chaque génération consignée dans `docs/ASSETS.md`.
- À essayer par Cyril : plein écran sur un vrai PC ; dernière version sur iPhone (combat sur la carte, mode test).

## Prochaine étape

1. **Phase 2 réalisée** le 2026-11-01 (lots 0 à 5, bilan dans `docs/ASSETS.md`) : 28 tuiles peintes sur 29,
   4 portraits de dialogue, 2 illustrations (écran titre, intérieur de l'Écho). 26,5 crédits dépensés, reste 83,5.
   **À faire** : avis de Cyril sur l'ensemble, puis pousser sur GitHub (mise en ligne) ; rien n'est poussé.
2. Après les visuels : proposer le périmètre du jalon 2 (contenu).

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
