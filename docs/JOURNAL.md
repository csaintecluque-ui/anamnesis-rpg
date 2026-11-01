# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- **Jalon 1 clos** (validé par Cyril le 2026-11-01) : tranche verticale complète, jouable sur PC et iPhone.
- **Phase 2 des visuels** terminée et en ligne (bilan `docs/ASSETS.md`) ; Cyril aime le rendu.
- 192 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/ (avec le jalon 2 en cours).
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Jalon en cours : jalon 2 (`docs/gdd/jalon-2.md`)

- Né du retour de Cyril sur la phase 2 : personnages trop gros et figés, répétitivité, maisons à visiter, PNJ et
  quêtes, création avec avatars. Avant toute génération : plan, coût, feu vert de Cyril (`CLAUDE.md` §5).
- Fait et en ligne : corrections visuelles (grand Arbre-Titan, personnages à 54 px, sol du marché, variantes) ;
  animation de marche en 2D, méthode retenue par Cyril (`docs/gdd/animation.md`) ; 6 avatars au choix à la création,
  animés sur la carte (sauvegarde v8). Puis (pas encore poussé) : vrai pont, lanterne qui cachait Ilyane, combat
  lisible sur grille (`docs/gdd/combat.md`, « Lisibilité »). 48,5 crédits dépensés sur le jalon, **35 restants**.

## Prochaine étape

1. Avis de Cyril sur le pont et le nouveau combat (à pousser).
2. Contenu : maisons à visiter (intérieurs), nouveaux PNJ, quêtes secondaires. Propositions de lore d'abord
   (`docs/univers/`, « à valider ») ; budget ≈ 35 crédits (PNJ animés ≈ 3,5 crédits chacun).

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
