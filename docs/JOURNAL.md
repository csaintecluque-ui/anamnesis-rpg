# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 340 tests, typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Fait : Canopéa « finie à fond » (en ligne le 2026-11-02, validé par Cyril)

- Les cinq quêtes de Canopéa et « La caravane de midi », l'amphithéâtre, le journal (touche J), la réputation des
  guildes, une ville qui réagit (`docs/univers/lieux/canopee.md`, `docs/univers/quetes.md`).
- Moteur : conditions `item`, effet `takeItem`, objets de quête, `apparaitSi`, rencontres d'histoire, figurants à
  dialogue et à `reactions`, étapes de quête (`etapes`).

## Chantier en cours : Ironheart, chapitre 3 (demande de Cyril, 2026-11-02)

- **Construit sur la branche, pas encore en ligne** : Forges-Basses, Marché des Cendres, Manufactures-Moyennes,
  « La Clé de Rouille Bleue » et ses trois fins (`docs/univers/lieux/ironheart.md`, `docs/univers/quetes.md`).
- À faire valider par Cyril : les détails nouveaux (Boulon, gare de l'Ouest, Fonds Zéro, carnet du dernier train…).

## Prochaine étape

1. Mise en ligne d'Ironheart (accord de Cyril) ; puis Sept-Portes (chapitre 4) ou « Le Rail des Cendres ».

## Points ouverts

- Coquille dans `assets/brand/logo-small.svg` (trait parasite) : accord de Cyril requis.
- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
