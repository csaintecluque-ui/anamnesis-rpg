# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- **Jalon 1 clos** (validé le 2026-11-01). **Jalon 2** fait et en ligne : avatars, marche 2D, combat sur grille,
  4 intérieurs, 5 PNJ, 3 quêtes (`docs/gdd/jalon-2.md`). 16,5 crédits Higgsfield restants.
- 269 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Chantier en cours : les grandes villes (plan validé par Cyril le 2026-11-01)

- Plan des dix villes : `docs/univers/lieux/villes.md` ; gabarit et coûts : `docs/gdd/villes.md`.
- **Fait et en ligne (accord de Cyril le 2026-11-02)** : Canopéa en visuels provisoires (3 quartiers,
  7 maisons, 7 PNJ, porte à crocheter, vol et rumeurs : `docs/univers/lieux/canopee.md`) ; carte du monde de Verdantis
  et rencontres aléatoires en route (`docs/gdd/carte-du-monde.md`) ; sauvegarde v9.

## Prochaine étape

1. Fait et en ligne (2026-11-02) : 14 passants et habitants à une ou deux répliques (`docs/gdd/figurants.md`).
   Peinture des 5 passants de Gardebois lancée (2,5 crédits sur 7,5, solde 16,5) : **bloquée**, l'hôte
   `d8j0ntlcm91z4.cloudfront.net` (images Higgsfield) est refusé par le réseau de l'environnement cloud.
2. Ensuite : réputation par ville, puis Ironheart ; les quêtes des villes après.

## Points ouverts

- Session cloud sans `docs/Lore/` : tout est à confronter au canon en local. Ironhold et Ironheart : deux villes ?
  Lyra, Thalorin, Kael Marchevent à décrire d'après N1.
- Sylvan a des oreilles pointues (elfes, zone floue n° 2) : garder ou refaire (2 crédits).
- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
