# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 364 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Fait et en ligne (2026-11-02, validé par Cyril)

- Canopéa « finie à fond » : cinq quêtes, « La caravane de midi », journal (touche J), réputation des guildes
  (`docs/univers/lieux/canopee.md`). Ironheart, chapitre 3 : trois quartiers, « La Clé de Rouille Bleue » et ses trois
  fins, les choix de Canopéa qui comptent (`docs/univers/lieux/ironheart.md`, `docs/univers/quetes.md`).
- Moteur : conditions `item`, effet `takeItem`, objets de quête, `apparaitSi`, rencontres d'histoire, figurants à
  dialogue et à `reactions`, étapes de quête (`etapes`).

## Chantier en cours : « Le Rail des Cendres » (demande de Cyril, 2026-11-02)

- **Construite sur la branche, pas encore en ligne** : triage des Cendres, Cendrière, Varka, Joss, Ostrik, Sorn, la
  machine sans homme, trois fins (`docs/univers/quetes.md`, point 8) ; détails à valider par Cyril.

## Prochaine étape

1. Mise en ligne (accord de Cyril) ; ensuite Sept-Portes (chapitre 4).

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 14).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
