# Journal — état actuel (30 lignes max ; récit des sessions : `docs/archive/journal-AAAA-MM.md`)

## État (2026-11-03)

- Jalons 1, 2 et 3 faits et en ligne ; jalon 4, chapitre 4 (Sept-Portes) en ligne et validé ; page Notion à jour.
- 630 tests (dont le parcours complet d'affilée, `src/rules/parcours.test.ts`), typecheck et build au vert. En ligne : https://csaintecluque-ui.github.io/anamnesis-rpg/
- Mode test caché : 5 touches sur la version (écran titre) → menu pause : +50 Fers, PV au max, **Outils de dev**.
- **Décisions de Cyril (2026-11-03)** : le jeu se joue **sur PC** (le téléphone n'est qu'une cible d'essai) ; le
  ressenti est déjà testé : on corrige avant tout nouvel essai.

## En cours : la feuille de route (`docs/gdd/feuille-de-route.md`)

Sept chantiers, dans l'ordre, **avant tout nouveau chapitre** (Aetherhaven compris) ; chacun finit par une partie de
Cyril sur PC et sa validation. Aucun nouveau système d'ici là.

| Chantier | Contenu | État |
|---|---|---|
| 0 | PC d'abord : `CLAUDE.md`, infobulles, raccourcis, barre d'actions, taille du texte | **en cours** |
| 1 | Une mémoire pour le héros (Écho personnel, oubli choisi, Échos tentants) | à faire |
| 2 | Recalibrer tests et compétences | à faire |
| 3 | Refaire le combat | à faire |
| 4 | Compagnons présents, ennemi incarné | à faire |
| 5 | Passe d'écriture | à faire |
| 6 | Économie et progression | à faire |

`docs/gdd/histoire-prenante.md` (proposition du même jour) nourrit les chantiers 1 et 4.

## Points ouverts

- Chronologie du canon non arbitrée (`docs/univers/zones-floues.md`, points 6 à 13) ; 33 à 37 notés (Terminus).
- `npm audit` : vulnérabilités modérées dans les outils de build de la PWA ; à revoir avec workbox.
