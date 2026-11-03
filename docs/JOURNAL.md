# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-03)

- Jalons 1, 2 et 3 faits et en ligne ; jalon 4, chapitre 4 (Sept-Portes) en ligne et validé ; page Notion à jour.
- En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/ (les sept chantiers de la feuille de route).
- **Décisions de Cyril (2026-11-03)** : le jeu se joue **sur PC** ; dé sur les compétences (seuils pour les attributs),
  Golem attaquable, deux boutons à la mort, compagnons joués par l'IA, jeu plus long avant tout nouveau chapitre.

## En cours : l'étude complète du 3 novembre (`docs/gdd/etude-2026-11-03.md`)

L'analyse demandée après le chantier 6 : 87 améliorations en trois vagues (jouable, tendu, vivant). Claude l'a
vérifiée contre le code (§ 1 : ce qui est exact, faux, non reproduit, en conflit avec une décision).

| Vague | Contenu | État |
|---|---|---|
| 1 · jouable | Caméra libre, case interdite, course, noms cliquables, combattants visibles, compagnons par l'IA, E1 + E2 (+ garde-fou en simulation), étal de Tobias, repos gratuit, mort à deux boutons | **faite** sur `claude/eloquent-newton-qvomzy` (704 tests, vérifiée dans Chromium) ; pas en ligne ; partie de Cyril à faire |
| 2 · tendu | Golem attaquable, premier combat, fiche et HUD, la fiche du dé, le héros qui a oublié, objet convoité, voies, jeu plus long | à lancer après la partie et les réponses de Cyril (§ 3 et 4) |
| 3 · vivant | Son, dialogues à une option, apartés seuls, mini-carte, carte des voies | plus tard |

Les chantiers 0 à 6 (`docs/gdd/feuille-de-route.md`) restent en ligne, leur partie sur PC à faire : la liste unique
est `docs/a-essayer.md` (une section par chantier, et la vague 1).

## Points ouverts

- Questions à Cyril (`docs/gdd/etude-2026-11-03.md`, § 4) : dons tous les 2 ou 3 niveaux ; piste du héros qui a
  oublié (A recommandée) ; ordre de la vague 2 ; Échos au fond des voies proposés par Claude.
- Zones floues du canon : 6 à 13 (chronologie) et 33 à 37 (Terminus) à trancher par Cyril. `npm audit` : à revoir (workbox).
