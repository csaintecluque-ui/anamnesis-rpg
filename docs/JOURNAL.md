# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-03)

- Jalons 1, 2 et 3 faits et en ligne ; jalon 4, chapitre 4 (Sept-Portes) en ligne et validé ; page Notion à jour.
- 667 tests (dont le parcours complet d'affilée, `src/rules/parcours.test.ts`), typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- **Décisions de Cyril (2026-11-03)** : le jeu se joue **sur PC** (le téléphone n'est qu'une cible d'essai) ; le
  ressenti est déjà testé : on corrige avant tout nouvel essai.

## En cours : la feuille de route (`docs/gdd/feuille-de-route.md`)

Sept chantiers, dans l'ordre, **avant tout nouveau chapitre** (Aetherhaven compris) ; chacun finit par une partie de
Cyril sur PC et sa validation. Aucun nouveau système d'ici là.

| Chantier | Contenu | État |
|---|---|---|
| 0 | PC d'abord : `CLAUDE.md`, infobulles, raccourcis, barre d'actions, taille du texte | **en ligne** (2026-11-03) ; partie de Cyril sur PC à faire |
| 1 | Une mémoire pour le héros : oubli choisi, champignon, Échos tentants et cachés, dons de Récit ; Écho du héros à valider (`univers/personnages/heros.md`) | **en ligne** (2026-11-03) ; partie de Cyril à faire |
| 2 | Recalibrer tests et compétences : seuils rang + attribut, courbe par chapitre, Athlétisme et Médecine ×5, atelier par compétence, rang ≤ niveau + 2 ; Pell sauvable (validé) | **en ligne** (2026-11-03) ; partie de Cyril à faire |
| 3 | Refaire le combat : PA et coût par arme, visée +1 PA et résistance, 2 capacités par ennemi, IA, force par chapitre, voie pacifiste ; simulation (écart ≤ 14 points) | **en ligne** (2026-11-03) ; partie de Cyril à faire |
| 4 | Compagnons présents, ennemi incarné (Ilyane oublie, Edda a perdu quelqu'un dans le train : validés) | en cours |
| 5 | Passe d'écriture | à faire |
| 6 | Économie et progression | à faire |

`docs/gdd/histoire-prenante.md` (proposition du même jour) nourrit les chantiers 1 et 4. Cyril n'a pas son PC tout de
suite : on enchaîne les chantiers, et ce qu'il aura à essayer s'ajoute à `docs/a-essayer.md`.

## Points ouverts

- Zones floues du canon : 6 à 13 (chronologie) et 33 à 37 (Terminus) à trancher par Cyril. `npm audit` : à revoir (workbox).
