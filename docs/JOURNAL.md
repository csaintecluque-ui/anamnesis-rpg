# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- **Jalon 1 clos** (validé par Cyril le 2026-11-01) : tranche verticale complète, jouable sur PC et iPhone.
  Les 4 résolutions de « Le Dernier Train » (parole, Récit, combat, discrétion), contenus et chiffres validés.
- 181 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Jalon en cours : phase 2 des visuels terminée ; jalon 2 en cours (corrections, animation et avatars faits ; contenu ensuite)

- Choisie par Cyril le 2026-11-01. Avant toute génération : fiche de style (`docs/STYLE.md`), liste des images,
  coût en crédits, feu vert de Cyril (`CLAUDE.md` §5). Chaque génération consignée dans `docs/ASSETS.md`.
- À essayer par Cyril : plein écran sur un vrai PC ; dernière version sur iPhone (combat sur la carte, mode test).

## Prochaine étape

1. Phase 2 des visuels terminée et en ligne (2026-11-01, bilan `docs/ASSETS.md`, 83,5 crédits restants). Cyril aime
   le rendu ; les trois éléments inventés des illustrations sont gardés faute d'objection.
2. **Jalon 2 proposé** (`docs/gdd/jalon-2.md`), né de son retour : personnages trop gros et figés, sol du marché,
   troncs de l'Arbre-Titan, répétitivité, maisons à visiter, PNJ et quêtes, création avec avatars, animation.
   Choix de Cyril : corrections visuelles d'abord (**faites**, 4 crédits, reste 79,5 ; pas encore poussées), puis
   pilote d'animation fait (19,5 crédits, reste ≈ 60) : **méthode 2D retenue par Cyril**, le héros marche sur la carte
   (`docs/gdd/animation.md`). **6 avatars faits** (24 crédits, reste 36) : choix à la création, marche sur la carte,
   pose en combat. Ensuite : contenu (maisons à visiter, PNJ, quêtes), propositions de lore d'abord.

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
