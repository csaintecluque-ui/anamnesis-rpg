# Journal de bord

## 2026-11-01 — Session 1 : cadrage

### État constaté

- Dossier : `CLAUDE.md` et `assets/brand/` seulement ; pas encore de dépôt git.
- Outils : git 2.43 et gh 2.45 OK (connecté au compte GitHub `csaintec`) ; **Node.js absent** (ni npm) ; Playwright absent.
- MCP Higgsfield : à ajouter par Cyril depuis son terminal (le CLI `claude` n'est pas accessible depuis la session).
- `assets/brand/logo-small.svg` : coquille dans le tracé (`62.2931.73` au lieu de `62.29 31.73`) qui dessine un trait parasite
  à gauche du premier « c ». Non corrigé : le logo ne se modifie pas sans l'accord de Cyril.

### Fait

- Propositions consignées : attributs, compétences, traits, 3 pistes de mécanique signature, cadre de la tranche verticale
  (`GDD.md`, `LORE.md`, tout « à valider »).

### En attente de Cyril

- Validation des attributs, compétences, mécanique signature, cadre de la tranche verticale.
- Réponses aux questions sur le roman (`LORE.md`).
- Installation de Node.js, nom et visibilité du dépôt GitHub.

### Reste à faire après validation

- Initialiser le dépôt GitHub et le squelette Phaser + Vite.

## 2026-11-01 — Session 1 (suite) : intégration du lore canonique

### Décisions de Cyril

- Le héros est un nouveau personnage. La magie existe mais n'est pas liée à la mémoire.
- Dépôt GitHub `anamnesis-rpg` public : OK. TypeScript : OK.
- `docs/Lore/` fait foi (règle ajoutée dans `CLAUDE.md` §1).

### Fait

- Lecture intégrale de `docs/Lore/` (51 fichiers : markdown, HTML, 2 PDF) et de `docs/Carte Anamnesis.png`.
  Les trois fichiers « compilés » sont des copies des fichiers individuels (vérifié).
- `docs/LORE.md` réécrit : synthèse sourcée (monde, magie, mémoire, lieux, factions, peuples, personnages,
  chronologie, ton), 21 zones floues ou contradictions du canon, propositions de jeu « à valider ».
- `docs/GDD.md` réécrit : 7 attributs (les 6 du JDR de Cyril + Mémoire), 12 compétences du JDR (Combat scindé,
  Pilotage retiré), résolution au d20 du JDR, dons, 3 pistes de mémoire ancrées (Échos, Récits, Mémoire contre Oubli),
  tranche verticale à Gardebois.
- Propositions de la session 1 rejetées (doublons et contradictions avec le canon).

### En attente de Cyril

- Arbitrages sur les zones floues prioritaires, dont : Solarix (Califat ou Communion), peuples de Verdantis,
  nature des Gardiens de Mémoire.
- Validation : attributs, mécanique de mémoire, tranche verticale (lieu, quête, PNJ, noms).
- Node.js toujours absent (vérifié en fin de session).

### Validation (même jour)

- Cyril a validé toutes les recommandations : attributs, compétences, mécanique de mémoire (pistes A et B),
  tranche verticale, et arbitrages des zones floues 1 à 4 et 19. Le détail est dans `LORE.md` §10 et §11
  et dans `GDD.md` §0.
- `sudo` est bloqué dans le terminal de la session Claude : Cyril installe Node.js depuis son propre terminal.
- Dépôt git initialisé en local. Publication sur GitHub en attente d'une décision : publier `docs/Lore/` ou non.
