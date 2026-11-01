# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-01)

- **Jalon 1 clos** (validé le 2026-11-01). **Jalon 2** fait et en ligne : avatars, marche 2D, combat sur grille,
  4 intérieurs, 5 PNJ, 3 quêtes (`docs/gdd/jalon-2.md`). 19 crédits Higgsfield restants.
- 264 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/ (sans les villes).
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Chantier en cours : les grandes villes (plan validé par Cyril le 2026-11-01)

- Plan des dix villes : `docs/univers/lieux/villes.md` ; gabarit et coûts : `docs/gdd/villes.md`.
- **Fait, branche `claude/wizardly-gates-560mxp`, pas encore en ligne** : Canopéa en visuels provisoires (3 quartiers,
  7 maisons, 7 PNJ, porte à crocheter, vol et rumeurs : `docs/univers/lieux/canopee.md`) ; carte du monde de Verdantis
  et rencontres aléatoires en route (`docs/gdd/carte-du-monde.md`) ; sauvegarde v9.
- Session cloud : `docs/Lore/` absent ; tout reste à confronter au canon en session locale.

## Prochaine étape

1. Cyril : mettre en ligne (fusion dans `main`) ? Puis son avis sur Canopéa, la carte et les rencontres.
2. Cyril : valider les détails nouveaux (Sévane, l'huissier, Anselme, rencontres, ennemis : tableaux « à valider »).
3. Ensuite : figurants et réputation (systèmes communs), puis Ironheart ; les quêtes des villes après.

## Points ouverts

- Ironhold et Ironheart : deux villes ? Lyra, Thalorin, Kael Marchevent à décrire d'après N1 (session locale).
- Sylvan a des oreilles pointues (elfes, zone floue n° 2) : garder ou refaire (2 crédits).
- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
