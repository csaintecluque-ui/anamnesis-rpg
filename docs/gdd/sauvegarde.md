# Sauvegarde

Code : `src/save/codec.ts` (format, validation, migrations), `src/save/store.ts` (emplacements),
`src/save/browser.ts` (stockage, export, import), `src/scenes/SlotsScene.ts` ; état : `src/state/gameState.ts`.

- **Emplacements** : 3 manuels (Emplacement 1 à 3) et 1 sauvegarde automatique, écrite quand on revient au titre.
  Plus tard, elle sera aussi écrite à chaque changement de carte.
- **Stockage** : `localStorage` de l'appareil, en JSON. Le jeu demande au navigateur de ne pas effacer ces données
  (`navigator.storage.persist`). Si le stockage est bloqué (certains modes privés), le jeu fonctionne quand même,
  mais les sauvegardes ne durent que jusqu'à la fermeture, et un message le signale.
- **Format** : `{ game: "anamnesis", version, savedAt, state }`, versionné. Une sauvegarde plus ancienne est mise à jour
  étape par étape ; une sauvegarde plus récente que le jeu est refusée avec un message clair.
  Tout fichier est validé avant d'écraser quoi que ce soit.
- **Export** : sur écran tactile, la feuille de partage (iPhone : « Enregistrer dans Fichiers ») ;
  ailleurs, un téléchargement. Nom du fichier : `anamnesis-emplacement-1-AAAA-MM-JJ-HHMM.json`.
- **Import** : sélecteur de fichiers, dans l'emplacement choisi.
- **Confirmations** : écraser, importer par-dessus ou supprimer une sauvegarde demande un second appui
  (« Confirmer ? », 3 secondes).
- **Chaque changement de forme** de l'état passe par une nouvelle version et sa migration.

## Versions du format

| Version | Ajout | Migration depuis la précédente |
|---|---|---|
| v1 | lieu, position, temps de jeu | — |
| v2 | le personnage | une v1 (sans personnage) fait créer le personnage au chargement, puis la partie reprend au même endroit |
| v3 | `entrance` facultative (arrivée nommée) | les parties du terrain d'essai (supprimé) reprennent à l'entrée de Gardebois |
| v4 | `flags` (repères d'histoire) et `quests` | — |
| v5 | `character.recits` | liste vide |
| v6 | `character.fers`, `inventory`, `equipment` | 15 Fers, rien porté |
| v7 | (même format) le combat utilise les armes en main | un héros aux mains vides reçoit la Dague de départ, en main droite |
| v8 | `character.avatar` (apparence choisie à la création) | le héros de la première version (`apprenti`) |
| v9 | `encounter` : la rencontre de voyage en cours (`docs/gdd/carte-du-monde.md`), ou `null` | aucune rencontre en cours |
| v10 | `time` : le jour et le moment (`docs/gdd/temps.md`) | le premier matin |
| v11 | `character.resonance`, `skills.resonance`, `equipment.cristal` (`docs/gdd/magie.md`) | Résonance au rang 0, 3 PR, aucun cristal porté |
| v12 | `bestiaire` (créatures rencontrées, nombre de vaincus) et `groupe` (compagnons et leurs PV) (`docs/gdd/combat.md`) | bestiaire vide, personne dans le groupe |
| v13 | `avis` : ce que chaque compagnon pense du héros (`docs/gdd/compagnons.md`) | aucun avis |
| v14 | `emprise` : l'emprise des Échos revécus (`docs/gdd/echos.md`) | 0 |
| v15 | `voie` (la voie endormie en cours : site, graine, niveau) et `contrats` (le contrat en cours, le compte, les offres prises) (`docs/gdd/voies.md`) | aucune voie, aucun contrat |

- **Sauvegarde automatique à chaque lieu** (2026-11-02, jalon 3) : en entrant dans un lieu, l'emplacement automatique
  est réécrit ; à la mort du héros, on reprend la sauvegarde la plus récente de tous les emplacements.
