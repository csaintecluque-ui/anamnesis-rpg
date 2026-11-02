# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-02)

- Jalons 1 et 2 faits et en ligne (`docs/gdd/jalon-2.md`). 11,5 crédits Higgsfield restants.
- 566 tests (dont le parcours complet d'affilée, `src/rules/parcours.test.ts`), typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → menu pause : +50 Fers, PV au max, **Outils de dev**
  (perso surpuissant, groupe, lieux, quêtes, repères, objets, Récits ; `docs/gdd/interface.md`).

## Fait et en ligne (2026-11-02, validé par Cyril)

- Canopéa « finie à fond » : cinq quêtes, « La caravane de midi », journal (touche J), réputation des guildes
  (`docs/univers/lieux/canopee.md`). Ironheart, chapitre 3 : trois quartiers, « La Clé de Rouille Bleue » et ses trois
  fins, les choix de Canopéa qui comptent (`docs/univers/lieux/ironheart.md`, `docs/univers/quetes.md`).
- Moteur : objets de quête, `apparaitSi`, rencontres d'histoire, figurants, étapes de quête (`etapes`).
- « Le Rail des Cendres », « Les Échos sous la Forge », « Voyager autrement » (`quetes.md`, `gdd/carte-du-monde.md`).

## Prochaine étape

1. **Jalon 3** (`docs/gdd/jalon-3.md`) : étapes 1 à 5 **validées et en ligne** (combat adulte, compagnons, Livre des
   Échos, veillées `docs/gdd/veillees.md`, passe sombre `docs/gdd/passe-sombre.md` ; scènes inventées des Échos à
   valider). Étape 6 (voies endormies et contrats, `docs/gdd/voies.md`) construite sur la branche, à valider. En cours
   ailleurs : **vérification qualité de tout le jeu** (`docs/qualite.md`). Mise en beauté à la fin.
2. Codex : Sept-Portes (`AGENTS.md`). Notion : page « Anamnesis — le jeu », à tenir à jour à chaque mise en ligne.

## Points ouverts

- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13 ; le 14 est tranché) ; points 29
  et 30 tranchés (le jeu suit le roman ; Elvan banni) ; 31 noté (fiche Verdantis ancienne).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
