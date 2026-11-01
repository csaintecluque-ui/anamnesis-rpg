# Combat (adaptation du JDR)

Règles : `src/rules/combat.ts` ; écran : `src/scenes/CombatScene.ts` ; données : `src/data/weapons.json`, `src/data/enemies.json`.

- **Déroulement** : tour par tour sur grille iso, dans l'ordre d'initiative. Se déplacer coûte 1 PA par case ; attaquer, 3 PA.
- **Toucher** : d20 + mod. (Corps en mêlée, Agilité à distance) + rang ≥ Défense de la cible. [JDR]
- **Dégâts** : selon l'arme, avec les valeurs du JDR (dague 1d4 + Corps, épée longue 1d8 + Corps, arc 1d8 + Agilité).
  - Armes de la tranche : lames, arcs, arbalètes.
  - La poudre reste rare et réglementée [E9]. Les armes du JDR comme le fusil d'assaut sont écartées (zone floue n° 18, `docs/univers/zones-floues.md`).
- **Visée par zone** : tête −4, bras −2, jambes −2, avec des effets propres (étourdi, désarmé, ralenti).
- **Couverture** : +2 ou +4 en Défense.
- **Fuite** : on peut fuir en atteignant le bord de la zone.
- **Ton** : public de 8 à 15 ans [E1].
  - Les ennemis sont **mis hors de combat** : les créatures fuient, les golems s'éteignent, les humains se rendent.
  - Pas de gore. Le combat est toujours évitable dans la quête principale.

## Précisions d'implémentation (premier combat : Golem de Ferraille, 2 Rôdeurs-Épine)

- **Armes (validé par Cyril le 2026-11-01 : Dague de départ, Mains nues 1d3, Golem plus dur sans achat)** : le héros se bat avec les **armes qu'il tient en main**
  (`character.equipment`, main droite puis main gauche ; `heldWeapons` dans `combat.ts`). Chaque arme en main
  devient un bouton du combat, à son nom (« Dague », « Épée longue », « Arc »), avec les raccourcis 2 et 3.
  - Sans arme en main : **Mains nues**, 1d3 + Corps, en mêlée (profil de `src/data/weapons.json`, qui n'est pas
    un objet : on ne peut ni l'acheter ni le vendre).
  - Kit de départ : une **Dague** (1d4) en main droite (`docs/gdd/inventaire.md`).
  - Équilibrage : avant, tout héros avait gratuitement l'Épée longue et l'Arc ; avec la seule Dague, le combat
    contre le Golem est plus dur. Il faut acheter une meilleure arme chez Tobias (Épée 35 Fers, Arc 30) : possible
    avec les 15 Fers de départ et la bourse de la caisse (25), à condition de ne pas avoir payé le laissez-passer.
    Le combat reste une voie parmi quatre.
- **Zone** : un coup à la tête, aux bras ou aux jambes qui ne met pas hors de combat applique son effet
  (étourdi, désarmé, ralenti) jusqu'au **prochain tour de la cible** ; un coup au corps n'a pas d'effet.
- **Arène (validé le 2026-11-01)** : le combat se déroule **sur la carte explorée**, dans un rectangle de
  11 × 9 cases autour de l'ennemi touché (`carveArena`, `src/engine/arena.ts`), avec son sol et ses obstacles
  (arbres, caisses, wagon, tente…), qui bloquent le passage. Le héros commence là où il se tenait ; le Golem sur sa
  case ; les deux Rôdeurs-Épine surgissent des fourrés, sur les cases du bord les plus éloignées du héros. Sur PC,
  l'arène est affichée × 1,25.
- **Couverture (validé le 2026-11-01)** : chaque obstacle a une valeur de couverture (propriété de tuile `couverture`,
  `scripts/tiles-def.mjs`) : **+2** pour les caisses, rochers, étals et la tente ; **+4** pour les arbres, le wagon,
  la foreuse, le tronc d'Arbre-Titan et les maisons. Une cible est à couvert si la case voisine, du côté de
  l'attaquant, porte un obstacle : sa Défense augmente d'autant (`coverBetween`). Pas de couverture au corps à corps.
  Le journal l'annonce (« à couvert, +2 en Défense »). Pour l'instant, seul le héros tire : la couverture protège
  donc les ennemis.
- **Fuite (validé le 2026-11-01)** : il faut **atteindre le bord de la zone de combat** (n'importe quelle case du pourtour),
  puis toucher « Fuir ». Ailleurs, le jeu le rappelle. Fuir referme le combat sans autre conséquence.
- **Défaite du héros** : non létale, comme pour les ennemis. Le héros est ramené à 1 PV à l'entrée de Gardebois
  (par Ilyane ; sur la route, par des voyageurs : `docs/gdd/carte-du-monde.md`).
- **Victoire** : mêmes effets que les résolutions par la parole (`chantier-arrete`, quête terminée, 40 XP),
  pour que les trois résolutions restent équilibrées.
- **IA ennemie** : simple — se rapproche si hors de portée, attaque sinon, jusqu'à épuisement des PA.
- **Armure** : son bonus de Défense compte en combat (`makeHeroCombatant`).

## Lisibilité (jalon 2, demandé par Cyril le 2026-11-01 : « à la FF Tactics »)

Le combat était « fouillis » : on ne savait ni où l'on était, ni ce qu'on faisait, ni jusqu'où aller. Désormais
(`CombatScene`, `drawBoard`) :

- **Grille** sur chaque case libre de l'arène, et contour cuivre de l'arène (son bord sert à fuir).
- **Case de celui qui joue** en cuivre ; l'ordre du tour reste à gauche.
- **Déplacement** : les cases atteignables ce tour-ci (1 PA par case, `reachable` dans `src/engine/pathfinding.ts`)
  en bleu ; au survol, le chemin en pointillés et son coût (« 4 PA »). On ne peut cliquer que sur une case bleue.
- **Attaque** : les ennemis à portée en rouge vif, les autres en rouge pâle ; au survol, la **chance de toucher**
  (`hitChance`, même calcul que le jet), le coût en PA et la couverture.
- **Ligne d'aide** sous le bandeau (« Choisis une case bleue… », « Choisis un ennemi en rouge vif… »).
- **Mouvement pas à pas** : le héros marche (planche de son avatar), les ennemis glissent case par case, chaque
  coup est montré (« −5 », « Raté ») avant le suivant ; pendant ce temps, on ne peut pas agir.
- **Arbres transparents** : un obstacle devant un combattant ou la case survolée devient translucide.

