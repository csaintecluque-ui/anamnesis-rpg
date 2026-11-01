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
