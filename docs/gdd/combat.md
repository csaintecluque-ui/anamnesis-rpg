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

- **Armes** : en attendant l'inventaire, le héros se bat avec les deux meilleures armes de sa classe,
  Épée longue (Corps, 1d8) et Arc (Agilité, 1d8), choisies comme deux actions de combat plutôt qu'un équipement.
  La Dague reste dans `src/data/weapons.json` pour plus tard.
- **Zone** : un coup à la tête, aux bras ou aux jambes qui ne met pas hors de combat applique son effet
  (étourdi, désarmé, ralenti) jusqu'au **prochain tour de la cible** ; un coup au corps n'a pas d'effet.
- **Couverture** : le calcul existe (`resolveAttack(… , coverBonus)`), mais rien sur la carte ne la fournit
  encore automatiquement — à faire quand le terrain portera cette information.
- **Arène** : le combat ne se déroule pas sur un fragment de la carte explorée, mais sur une petite arène dédiée
  (9 × 7, iso, même palette), pour rester simple tant que les cartes ne portent pas de zones de couverture ou
  de limites de combat. Visuel provisoire, comme le reste de la phase 1.
- **Fuite** : bouton toujours disponible, qui referme le combat sans conséquence (pas encore liée à une position
  précise sur l'arène).
- **Défaite du héros** : non létale, comme pour les ennemis. Le héros est ramené à 1 PV à l'entrée de Gardebois.
- **Victoire** : mêmes effets que les résolutions par la parole (`chantier-arrete`, quête terminée, 40 XP),
  pour que les trois résolutions restent équilibrées.
- **IA ennemie** : simple — se rapproche si hors de portée, attaque sinon, jusqu'à épuisement des PA.
- **Armure** : son bonus de Défense compte en combat (`makeHeroCombatant`). Les armes équipées, elles, n'ont pas
  encore d'effet (`docs/gdd/inventaire.md`).
