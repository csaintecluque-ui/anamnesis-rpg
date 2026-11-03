# Jalon 3 : le cœur du jeu complet (validé par Cyril le 2026-11-02)

Plan d'ensemble : `docs/gdd/jeu-complet.md`. Ton : dark fantasy pour adultes (`docs/univers/ton.md`). Codex fait
Sept-Portes en parallèle (`AGENTS.md`). Chaque étape : tests, vérification sur PC et téléphone, puis mise en ligne
quand Cyril le dit. Tout s'essaie à Gardebois, Canopéa et Ironheart, qu'on enrichit au passage.

| Étape | Contenu | État |
|---|---|---|
| 1. Le combat, pour adultes et à plusieurs | la mort est réelle (les ennemis meurent, fuient ou se rendent ; le héros vaincu meurt : on recharge, avec une sauvegarde automatique à chaque lieu) ; plusieurs héros dans l'arène (les compagnons, joués à tour de rôle) ; ennemis variés (tir, soin, protection, essaims) ; effets (brûlure, saignement, ralenti, étourdi) ; boss à phases ; butin ; **bestiaire** dans le journal ; avertissement « Contenu pour adultes » à l'écran titre | **fait et en ligne** (`docs/gdd/combat.md`) |
| 2. Les deux premiers compagnons | **Liane Sève-Claire** (herboriste de Gardebois) et **Boulon** (le Ferrôme de la gare d'Ironheart) : les recruter, leurs mots en route, leur avis sur nos choix, leur quête personnelle ; ils peuvent partir si on les déçoit | **fait et en ligne** (`docs/gdd/compagnons.md`) |
| 3. Le Livre des Échos | une douzaine d'Échos cachés (Gardebois, Canopéa, Ironheart, les routes ; certains la nuit seulement) ; le danger de vouloir les revivre [canon] ; un onglet du journal | **fait et en ligne** (`docs/gdd/echos.md`), scènes inventées à valider |
| 4. Les veillées du conteur | le soir, à l'auberge, raconter un Récit à un public qui a ses goûts : Fers, réputation, rumeurs qui ouvrent des secrets | **fait et en ligne** (`docs/gdd/veillees.md`) |
| 5. La passe sombre | réécrire Gardebois, Canopéa et Ironheart dans le ton adulte : morts possibles, conséquences, castes du Puits Trois, prix de la magie | **fait et en ligne**, validé par Cyril (`docs/gdd/passe-sombre.md`) |
| 6. Les ruines et les contrats | des voies endormies à explorer sur la carte du monde, tirées d'une réserve de plans ; un tableau de contrats dans chaque relais des Gardiens | **fait et en ligne**, validé par Cyril (`docs/gdd/voies.md`) |
| 7. Les factions et l'artisanat | rangs et quêtes d'adhésion des six factions existantes ; la forge d'Ironheart et les herbes de Canopéa | **fait et en ligne**, validé par Cyril (`docs/gdd/factions.md`, `docs/gdd/artisanat.md`) |

## Réponses de Cyril (2026-11-02)

« Sexualité possiblement montrée mais en effet pas de torture, je suis d'accord sur la mort » : charte dans
`docs/univers/ton.md` ; la mort du héros est réelle (on recharge la dernière sauvegarde).

## Bilan (2026-11-03, demandé par Cyril)

**Fait et en ligne** : les sept étapes, et une vérification qualité de tout le jeu (`docs/qualite.md`). Le jeu compte
aujourd'hui 3 villes (Gardebois, Canopéa, Ironheart) et leurs abords, 32 lieux, 20 quêtes dont les chapitres 1 à 3 de
l'histoire principale, 84 dialogues, 15 Récits, 12 Échos, 12 sortes de créatures, 3 voies endormies, 5 guildes à
rangs, 9 recettes ; 584 tests automatiques, dont le parcours complet d'affilée.

**Encore à valider** : les scènes inventées des Échos (la première graveuse, les premiers Nacelliers, le vote sous la
pluie, le voyageur sans visage, la dernière chanson de la Cendrière, le train qui ne s'arrête pas) et leurs trois
Récits ; le dessin de la carte du monde (à caler sur la carte de Cyril) ; la chronologie du canon (zones floues 6 à 13).

**Reporté** (noté « plus tard » dans chaque document) : les trois ou quatre quêtes de chaque faction, le courrier des
Nacelliers, la Route des Carrioles (sans jeu pour l'instant) ; l'escorte des caravanes, un vrai relais à Ironheart ; la
taille des cristaux, les plantes à cueillir ; les compagnons qui réagissent aux veillées ; la récompense d'un Livre des
Échos complet ; les images peintes (11,5 crédits Higgsfield restants).

**Points faibles** :
- **L'histoire principale s'arrête au chapitre 3** : Sept-Portes (chapitre 4) est confié à Codex depuis le 2026-11-02,
  et rien n'est arrivé sur le dépôt ; Aetherhaven et la suite en dépendent.
- **Le ressenti n'est pas encore testé par un humain** : les tests vérifient que tout se finit, pas que c'est bien
  dosé (difficulté des voies endormies, prix, expérience, rythme).
- Sur téléphone, deux gênes connues : les noms de l'amphithéâtre se touchent, et un dialogue à quatre options
  chevauche un peu le portrait.
- Les visuels restent provisoires (la mise en beauté est prévue à la fin, ≈ 1 400 crédits).

**Suite proposée** (jalon 4, à valider) : d'abord une partie de Cyril sur téléphone pour le ressenti ; puis le
chapitre 4, Sept-Portes (repris par Claude si Codex n'avance pas) ; puis une ville à la fois dans l'ordre validé
(Aetherhaven d'abord) ; la mise en beauté à la fin.
