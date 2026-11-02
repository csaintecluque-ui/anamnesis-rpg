# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 528 tests (dont le parcours complet d'affilée, `src/rules/parcours.test.ts`), typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → menu pause : +50 Fers, PV au max, **Outils de dev**
  (perso surpuissant, groupe, lieux, quêtes, repères, objets, Récits ; `docs/gdd/interface.md`).

## Fait et en ligne (2026-11-02, validé par Cyril)

- Canopéa « finie à fond » : cinq quêtes, « La caravane de midi », journal (touche J), réputation des guildes
  (`docs/univers/lieux/canopee.md`). Ironheart, chapitre 3 : trois quartiers, « La Clé de Rouille Bleue » et ses trois
  fins, les choix de Canopéa qui comptent (`docs/univers/lieux/ironheart.md`, `docs/univers/quetes.md`).
- Moteur : objets de quête, `apparaitSi`, rencontres d'histoire, figurants, étapes de quête (`etapes`).
- « Le Rail des Cendres », « Les Échos sous la Forge », « Voyager autrement » (`quetes.md`, `gdd/carte-du-monde.md`).

## Prochaine étape

1. En ligne (2026-11-02) : le temps et les auberges (`docs/gdd/temps.md`), la magie et « Un prêt de la Terre »
   (`docs/gdd/magie.md`). **Jeu complet validé** (`docs/gdd/jeu-complet.md`) ; ton : dark fantasy pour adultes
   (`docs/univers/ton.md`). En cours : **jalon 3** (`docs/gdd/jalon-3.md`) ; étape 1 (le combat pour adultes et à
   plusieurs), 2 (les compagnons) et 3 (le Livre des Échos, `docs/gdd/echos.md` ; scènes inventées à valider) en
   ligne ; étape 4 (les veillées, `docs/gdd/veillees.md`) validée et en ligne ; ensuite : la passe sombre.
2. Codex : Sept-Portes (`AGENTS.md`). Notion : page « Anamnesis — le jeu », à tenir à jour à chaque mise en ligne.

## Points ouverts

- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13 ; le 14 est tranché).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
