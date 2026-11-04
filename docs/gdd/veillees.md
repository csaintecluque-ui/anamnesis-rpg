# Les veillées du conteur (jalon 3, étape 4 ; construite le 2026-11-02, validée et mise en ligne par Cyril le 2026-11-02)

Plan : `docs/gdd/jalon-3.md` ; idée validée dans `docs/gdd/jeu-complet.md` (« une mécanique propre à Anamnesis »).
Code : `src/rules/veillees.ts`, écran `src/scenes/VeilleeScene.ts` ; données : `src/data/veillees.json` (les publics),
`themes` dans `src/data/recits.json`. Lore proposé : sections « Les veillées » de `docs/univers/lieux/gardebois.md`,
`canopee.md` et `ironheart.md`.

Cyril (2026-11-02) : « Oui pour tout, mets en ligne » : chiffres, publics, rumeurs et secrets validés.

## Le principe

- **Où, quand** : dans les trois auberges, l'aubergiste propose « Raconter un Récit à la veillée ». La veillée se
  tient **le soir** ; le matin et à midi, on peut **attendre le soir** sur place ; la nuit, elle est finie (« reviens
  demain soir »). Elle dure la soirée : quoi qu'il arrive, on sort **à la nuit** (on peut alors dormir à l'auberge).
  Une veillée par soir, donc.
- **Le public** a ses goûts : des thèmes qu'il **aime** et un qu'il **n'aime pas**. Chaque Récit parle de thèmes
  (chansons, familles, morts, arbres, trains, machines, Ancien Monde, puissants, mystères). L'écran montre le public,
  ce que l'aubergiste dit de ses goûts, et pour chaque Récit retenu : ♥ ce qu'ils aimeront, ✗ ce qui les fâchera,
  « déjà racontée ici », et la chance de bien le dire.
- **Le jet** : d20 + la meilleure des trois compétences de Présence (Diplomatie : la chaleur ; Commandement :
  l'autorité ; Subterfuge : l'art d'embellir), moins l'emprise des Échos, contre la difficulté.

| Récit | Difficulté |
|---|---|
| ordinaire | 12 |
| un thème aimé | −4 (8) |
| le thème détesté | +4 (16) |
| déjà raconté à ce public | +2 |

| Résultat | Chapeau | Expérience | Renommée | Rumeur |
|---|---|---|---|---|
| **Triomphe** (réussi, un thème aimé, Récit nouveau ici) | 15 Fers | 15 | +1 | la suivante du public |
| **Bon accueil** (réussi, Récit nouveau ici) | 8 Fers | 10 | +1 | — |
| **Redite** (réussi, déjà raconté ici) | 4 Fers | — | — | — |
| **Échec** (raté ; si le thème détesté y est, la salle se vide) | — | — | — | — |

- Un **20 naturel** double le chapeau.
- **Renommée** : les trois premiers Récits bien reçus par un public valent chacun **+3 de réputation** à sa ville
  (+9 au plus : la veillée seule n'amène pas jusqu'à l'estime). Repères `conteur-<public>-1` à `-3`
  (`src/data/reputation.json`).
- **Rumeurs** : deux par public, données dans l'ordre, une par triomphe. Chacune pose un repère `rumeur-<id>` qui
  **ouvre un secret** ailleurs (une réplique de plus chez un personnage ou devant un objet). Elles s'inscrivent au
  journal, onglet « Récits », sous les Récits.
- **Rien de plus à sauvegarder** : tout se déduit des repères et de l'heure (pas de nouvelle version de sauvegarde).

## Les publics et leurs secrets

| Auberge (hôte) | Public | Aime | N'aime pas | Rumeurs → secrets |
|---|---|---|---|---|
| La Racine, Gardebois (Sylvan) | caravaniers, familles du Marché, marchands de Ferros | chansons, familles | morts (« la maladie des souvenirs nous en raconte assez ») | **La cache des passeurs** : sous le rocher moussu, 30 Fers et une fiole de sève… avec un mot « pour la petite » ; tout prendre ou tout laisser (Liane désapprouve) · **Ce que Tobias garde sous l'étal** : une arbalète de Ferros « tombée d'un convoi », 35 Fers au lieu de 80 |
| Le Nid, Canopéa (Lisandre) | Nacelliers, cultivateurs, un druide | arbres, morts | machines (« les foreuses, on les entend assez la nuit ») | **La clé du nichoir** : le grenier des semences s'ouvre sans crocheter · **La sève des aïeux** : sous le comptoir de Sévane, une sève tirée au pied des arbres des morts (soigne 30 PV, 30 Fers ; défendue) |
| La Bielle, Ironheart (Dorna) | cheminots, ouvriers en gris, un homme qui ne boit pas | trains, machines | puissants (« ici, on tient des listes ») | **De la part de Dorna** : la tailleuse vend un cristal de forge à moitié prix (125 Fers) · **Ta fiche, aux Archives** : l'article onze oblige Noam à la montrer (« À surveiller. Signalé·e par : » un nom rayé ; 20 XP) |

Chaque public aime au moins trois des quinze Récits du jeu. Au passage, Lisandre dit la nouvelle du grenier forcé une
fois, en accueil, comme ses autres nouvelles : son « Quelles nouvelles ? » a laissé la place à la veillée.

## Outils de dev

« Soir » dans la ligne du temps ; « Veillées : rumeurs → Toutes entendues » (onglet « Groupe »).

## Plus tard

- Les compagnons réagissent au Récit choisi (Liane à « Saule », Boulon aux trains).
- Un public par nouvelle ville (Sept-Portes, Aetherhaven…), avec ses goûts et ses rumeurs.
- Des goûts à découvrir (l'aubergiste ne les dit qu'à qui revient) ; un public changeant selon les nouvelles du jour.

## Étude du 3 novembre, vague 3 : un premier soir jamais vide (D5)

Constat de l'étude : arrivé à la Racine la nuit, « il ne reste personne » ; les goûts du public, eux, étaient déjà
dits avant de choisir (l'aubergiste, puis ♥ et ✗ sur chaque Récit). Désormais, **la première veillée d'une auberge
s'ouvre aussi la nuit** : « Les derniers veilleurs traînent autour des braises. Sylvan te fait signe : « Pour une
première, ils resteront bien encore un peu. » » Ensuite, la nuit, la veillée est finie comme avant ; le soir, elle
est toujours là. `veilleeOpen` (`src/rules/veillees.ts`).
