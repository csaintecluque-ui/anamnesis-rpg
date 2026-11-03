# Anamnesis — consignes pour les agents de code (Codex et autres)

Ce dépôt est un jeu en cours, pas un nouveau projet : on **continue** le même jeu, avec le même moteur, les mêmes
données et les mêmes règles.

**Avant tout, lis `CLAUDE.md` : il fait foi pour tous les agents**, quel que soit l'outil (vision, canon, technique,
direction artistique, logo de Cyril, méthode de travail). Ce fichier-ci n'ajoute que ce qui est propre aux autres agents.

## Démarrage

1. `CLAUDE.md`, puis `docs/JOURNAL.md` (état, prochaine étape) et `docs/INDEX.md` (une ligne par document).
2. Seulement ensuite, les documents utiles à la tâche. **Ironheart et le chapitre 3 (« La Clé de Rouille Bleue ») sont
   faits et en ligne** (`docs/univers/lieux/ironheart.md`), ainsi que **« Le Rail des Cendres »**, **« Les Échos sous la
   Forge »** (quête cachée) et **« Voyager autrement »** (train et caravane, `docs/gdd/carte-du-monde.md`) (Claude,
   2026-11-02, en ligne) : ne pas les refaire, les compléter. **Sept-Portes, chapitre 4 (« Les Mémoires du Monde
   Perdu »)** : confié à Codex le 2026-11-02, rien n'est arrivé sur le dépôt ; **repris et construit par Claude le
   2026-11-03** (décision de Cyril : « L'histoire principale doit continuer », `docs/gdd/jalon-4.md`). Ne pas le
   refaire ; demander à Cyril le prochain chantier. Histoire et suites
   attendues : `docs/univers/quetes.md` ; factions : `docs/univers/factions.md` ; plan des villes :
   `docs/univers/lieux/villes.md` ; gabarit d'une grande ville : `docs/gdd/villes.md`.

## Feuille de route (Cyril, 2026-11-03)

`docs/gdd/feuille-de-route.md` : sept chantiers, **dans l'ordre**, avant tout nouveau chapitre ; un chantier à la fois ;
aucun nouveau système d'ici là. Le PC est la cible principale ; le téléphone reste une cible d'essai.

## Canon

- Le Notion « ANAMNESIS » de Cyril fait foi (`CLAUDE.md`, section 1). **Si tu n'as pas d'accès au Notion, ne devine
  pas** : appuie-toi sur la synthèse `docs/univers/` et marque tout ajout « à valider » en posant la question à Cyril.
- `docs/Lore/` et `docs/Carte Anamnesis.png` restent locaux et ne doivent jamais être publiés.

## Ce que Canopéa a laissé pour la suite

Les choix du joueur à Canopéa sont dans les repères (`state.flags`) et doivent compter à Ironheart :
`conseil-frontiere` / `conseil-commerce` / `conseil-accord` (conseil donné au Triumvirat), `cle-mentionnee`,
`fouille-marches`, `graines-denonce` / `graines-rendues` / `graines-silence` (sort d'Elvan Morelle),
`membre-compagnie-lisieres`, `nacelliers-amis` ; objet `sauf-conduit` (sauf-conduit du Triumvirat).

Outils de moteur déjà prêts (détails dans `docs/gdd/`) : conditions `item` et `reputation`, effets `takeItem` et
`goTo`, objets de quête (`quest: true`), objets et PNJ `apparaitSi` / `disparaitSi`, rencontres d'histoire (`story`),
figurants à dialogue et à `reactions`, étapes de quête (`etapes`, affichées dans le journal), réputation des guildes
(`src/data/factions.json`).

## Commandes

- Après une modification de code : `npm run typecheck`, `npm test`, `npm run build`.
- Données générées : `npm run maps` (cartes, `scripts/build-maps.mjs`), `npm run tiles` (tuiles provisoires,
  `scripts/tiles-def.mjs` ; ajouter les tuiles **à la fin** de la liste), `npm run dialogues` (`docs/DIALOGUES.md`).
- Un commit par étape ; `main` toujours jouable ; travailler sur une branche et demander à Cyril avant de mettre en
  ligne (tout ce qui arrive sur `main` est publié sur GitHub Pages).
