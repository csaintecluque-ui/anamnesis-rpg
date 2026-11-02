# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 317 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Chantier en cours : Canopéa « finie à fond » (demande de Cyril, 2026-11-02)

- **En ligne le 2026-11-02** (validé par Cyril, détails nouveaux compris) : les cinq quêtes de Canopéa et
  « La caravane de midi » (`docs/univers/quetes.md`), l'amphithéâtre du Conseil, le journal (touche J), la réputation
  des guildes, une ville qui réagit (`docs/univers/lieux/canopee.md`).
- Moteur : conditions `item`, effet `takeItem`, objets de quête, `apparaitSi`, rencontres d'histoire, figurants à
  dialogue et à `reactions`, étapes de quête (`etapes`).

## Prochaine étape

1. Ensuite : Ironheart (chapitre 3, « La Clé de Rouille Bleue ») ; images peintes de Canopéa quand les crédits suivront.

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
