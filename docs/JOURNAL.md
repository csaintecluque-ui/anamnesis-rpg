# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 434 tests (dont le parcours complet d'affilée, `src/rules/parcours.test.ts`), typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → +50 Fers, PV au max dans le menu pause.

## Fait et en ligne (2026-11-02, validé par Cyril)

- Canopéa « finie à fond » : cinq quêtes, « La caravane de midi », journal (touche J), réputation des guildes
  (`docs/univers/lieux/canopee.md`). Ironheart, chapitre 3 : trois quartiers, « La Clé de Rouille Bleue » et ses trois
  fins, les choix de Canopéa qui comptent (`docs/univers/lieux/ironheart.md`, `docs/univers/quetes.md`).
- Moteur : conditions `item`, effet `takeItem`, objets de quête, `apparaitSi`, rencontres d'histoire, figurants à
  dialogue et à `reactions`, étapes de quête (`etapes`).

- « Le Rail des Cendres », « Les Échos sous la Forge », « Voyager autrement » (`quetes.md`, `gdd/carte-du-monde.md`).

## Prochaine étape

1. En ligne (2026-11-02) : passe de qualité, logo, pièces de Hedda, lisibilité sur téléphone, « Les Échos sous la
   Forge », « Voyager autrement ». Analyse de conformité faite (2026-11-02) : corrections sur la branche, mise en
   ligne à valider ; deux questions à Cyril (laissez-passer de Tobias, plafond des Récits).
2. Codex : Sept-Portes (`AGENTS.md`). Notion : page « Anamnesis — le jeu », à tenir à jour à chaque mise en ligne.

## Points ouverts

- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13 ; le 14 est tranché).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
