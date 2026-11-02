# Canopéa, la cité des cimes (première grande ville, visuels provisoires)

Plan des dix villes validé par Cyril le 2026-11-01 (`docs/univers/lieux/villes.md`), Canopéa en premier. **Construite le
2026-11-01 en visuels provisoires** (dessinés par code). Cartes : `scripts/build-maps.mjs` (`npm run maps`) ;
textes : `docs/DIALOGUES.md`. Canon : capitale de Verdantis dans les Arbres-Titans, rien ne touche le sol ; la mémoire
du défunt passe dans l'arbre [E3, N1].

## Ce qui est construit

| Quartier | Contenu |
|---|---|
| La Grande Nacelle | arrivée par la nacelle depuis la forêt (et départ vers la carte du monde), Véline, Malo, marché suspendu, Auberge du Nid, Comptoir de la Sève, nacelle vers les Hautes Ramures, longue passerelle vers le Bois |
| Les Hautes Ramures | Antichambre du Conseil (l'huissier), Maison Feuillevent (Aïlis), Atelier Chante-Bois (Elouan), Grenier des semences (fermé à clé) |
| Le Bosquet des Échos | sept arbres gravés, le grand arbre du sanctuaire, le relais des Gardiens de Mémoire (Mirelle) |

Sept intérieurs, sept PNJ nommés. Toutes les maisons prévues sont là.

## Alignement sur le canon du Notion (2026-11-02)

- Canon [NOTION : fiche Verdantis, légendes] : Canopéa compte 500 000 habitants entre 50 et 500 m de haut ; aucun
  bâtiment ne touche le sol, **sacré** ; l'habitat s'étage par classe (Jeunes-Pousses 10–20 m, Cultivateurs 20–50 m,
  Citoyens-Arbres 50–100 m) ; le Conseil des Racines Profondes (300 sièges) siège dans un **amphithéâtre taillé dans un
  Arbre-Titan mort**, à 500 m. Le Triumvirat Vert : **Lyra Cœur-de-Sève** (elfe, 180 ans, affaires intérieures et
  économie), **Kael Marchevent** (humain, 45 ans, Gardien de la Canopée : défense et relations extérieures), l'Ancien
  **Thalorin** (dryade, Voix de Gaïa). Aucun quartier nommé dans le canon : nos trois quartiers restent des propositions.
- Le **Bosquet des Échos** est canon : on y grave dans le bois vivant, en colonnes de verdani ; quand le bois fend un
  signe, on ne le corrige jamais ; on y vient parler à ses morts ; toucher un arbre gravé transmet les souvenirs de qui
  a gravé. Notre troisième quartier en prend le nom (il s'appelait « Bois des Aïeux »).
- **Rite du Retour** (canon) : le défunt est mis en terre au pied d'un arbre ; l'arbre garde « une chaleur, un tour de
  main ». Anselme repose donc en bas ; Aïlis a gravé son nom au Bosquet, et c'est son souvenir à elle qu'on touche.
- La « Salle du Conseil » devient l'**Antichambre du Conseil** : l'amphithéâtre lui-même viendra avec « L'audience ».
- **Monnaie** : le canon donne à Verdantis la **Feuille Verte** (1 Feuille = 0,5 Fer ; un repas : 15 à 30 Feuilles).
  Le jeu compte tout en Fers : une seule monnaie pour l'instant (décision de Cyril, 2026-11-02, `docs/univers/zones-floues.md`).

## Détails nouveaux, inventés en écrivant les dialogues (validés par Cyril le 2026-11-02 : « vraiment pas mal »)

| Élément | Proposition | Ancrage canon |
|---|---|---|
| **Sévane Mielvert** | herboriste du Comptoir de la Sève, marchande (bandages, baume de mousse, corde) | — (le plan prévoyait le comptoir, pas son marchand) |
| **L'huissier du Conseil** | garde la Salle du Conseil : « les audiences se demandent par écrit » ; le Conseil parle de la frontière, des forages de Ferros et du mal qui fait oublier | N1 (Conseil des Racines Profondes), E10 |
| **Anselme Feuillevent** | le grand-père de Malo, défunt ; il repose au pied d'un arbre (Rite du Retour) et Aïlis a gravé son nom au Bosquet ; avec Mémoire 3, on touche le nom et l'on reçoit le souvenir d'Aïlis qui fredonne en gravant, qu'on peut lui raconter (15 XP) | NOTION (Rite du Retour, Bosquet des Échos) |
| Pas de feu à Canopéa | « les braises et les branches ne font pas bon ménage » : des cristaux chauffent les bols et les pièces | E2 (cristaux) |
| La règle de la Sève | « une feuille sur trois reste à l'arbre » ; on ne taille que les branches tombées | R1 (la Sève Éternelle) |
| Ce qui tombe | « ce qui tombe d'ici, la forêt le garde » ; un filet de lianes a rattrapé Malo | — |
| Le grenier des semences | fermé à clé (Artisanat 12 pour crocheter) ; on peut y voler un sac de graines-lumière : Véline et Lisandre en parlent ensuite | — |
| Récit « Les voix du Bosquet » | au très vieil arbre gravé, avec Mémoire 3 | NOTION (Bosquet des Échos) |
| Récit « Kael, le Premier Chroniqueur » | raconté par Mirelle | E4 |
| Mirelle et Ilyane | apprentissage commun ; Mirelle garde le carnet de chansons d'Ilyane (qui chanterait faux) | — |

## Le Triumvirat Vert et l'amphithéâtre (2026-11-02, avec « L'audience »)

- **L'amphithéâtre du Conseil** (`canopee-amphitheatre`), derrière l'Antichambre : gradins en fer à cheval, estrade du
  Triumvirat. On y entre par l'huissier. Canon [NOTION] : amphithéâtre circulaire taillé dans un Arbre-Titan mort.
- **Kael Marchevent** (cape de Garde Vert), **Lyra Cœur-de-Sève** (longs cheveux tressés de lianes) et **l'Ancien
  Thalorin** (dryade aux cheveux de feuilles) y siègent ; salutations du canon : « Racines profondes », « Que la sève
  coule ». Valeurs reprises : on ne ment pas au Conseil (« Racines Ouvertes »), méfiance envers Ferros.

## Canopéa « finie à fond » (2026-11-02)

- **Cinq quêtes** construites (`docs/univers/quetes.md`) : « Les lettres de Malo », « Le chant d'Anselme »,
  « L'audience » (chapitre 2), « Les graines qui manquent », « Le carnet de chansons » ; plus « La caravane de midi »,
  qui part de Gardebois et finit à la Grande Nacelle.
- **Nouveaux lieux et PNJ** : l'amphithéâtre du Conseil (Kael Marchevent, Lyra, Thalorin, trois conseillers), l'arbre
  d'Anselme et Garrik au Sol des Racines, Elvan Morelle au Nid.
- **La ville réagit** : passants dont les répliques suivent l'histoire, nouvelles du jour (Lisandre, Malo, Mirelle),
  réputation de Canopéa et des guildes (Compagnie des Lisières, Nacelliers) ; journal des quêtes.

## Reporté

- **Images peintes** (phase 2) : plan et coût à présenter avant toute génération (≈ 25 crédits ; 11,5 restants).
- **Services des guildes** : le courrier des Nacelliers (la caravane est construite : « Voyager autrement »).

## Quête « Les lettres de Malo » et le Sol des Racines (construites le 2026-11-02)

Quête validée par Cyril (`docs/univers/quetes.md`). Textes : `docs/DIALOGUES.md` ; carte : `sol-racines`.

- **Départ** : Malo a laissé tomber la sacoche des Nacelliers ; le sol est sacré, il faut l'accord de Véline.
- **Véline** descend le héros en nacelle (« Ne prends rien d'autre que la sacoche, ne grave rien »), puis le redescend
  sans redemander tant que la sacoche n'est pas retrouvée.
- **Le Sol des Racines** (nouvelle carte) : les pieds des Arbres-Titans, une vieille voie à demi enfouie, des lettres
  éparpillées (avec Survie 2, on lit les traces d'un Ours-Mousse), un trou de fouille (avec Investigation 2, une
  étiquette : « Lot douze, reliques. À livrer au Marché des Cendres. » : piste pour « L'audience »).
- **La sacoche**, sous la patte d'un Ours-Mousse endormi : la prendre en douce (Discrétion, difficulté 11 ; raté, l'ours
  se réveille), l'éloigner avec des baies (Survie 2), ou le combattre (15 XP).
- **Fin** : Malo rend les lettres aux Nacelliers ; 30 XP, 10 Fers, +10 de réputation à Canopéa, repère
  `nacelliers-amis` (le courrier des Nacelliers viendra avec le système de factions).

## La magie (2026-11-02, `docs/gdd/magie.md`)

- Le druide **Vanel** au pied du grand arbre du Bosquet des Échos (« Un prêt de la Terre »), **Tiven** à la Grande
  Nacelle, des cristaux de Vie au Comptoir de la Sève (Sévane, 250 Fers). Validé par Cyril.
- La Lueur d'un cristal révèle aussi le sceau de cire dans le grenier des semences.

## La passe sombre (2026-11-02, `docs/gdd/passe-sombre.md`, **à valider**)

- Passants : les Jeunes-Pousses et leurs échelles de corde, les Citoyens-Arbres et leurs ascenseurs [NOTION] (« ce qui
  tombe, la forêt le garde : les paniers, et les porteurs ») ; une pèlerine dont la mère « a choisi de partir »
  [NOTION : euthanasie légale] ; les Nacelliers tombés.
- Elvan Morelle dénoncé est **banni** (« ici, on n'enferme pas : on retire les racines ») ; le gardien du grenier, un
  Jeune-Pousse, est soupçonné si le héros a volé et nie.
- Vanel reprend les marques d'un cristal forcé, contre un rang de Résonance ; il enterre les éclats d'un cristal fendu.
