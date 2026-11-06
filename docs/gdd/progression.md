# Montée de niveau

Règles : `src/rules/leveling.ts` ; écran : `LevelUpScene`.

- **Seuils d'expérience** (validé par Cyril le 2026-11-01) : `50 × niveau × (niveau − 1)` XP cumulés pour
  atteindre un niveau — niveau 2 à 100 XP, niveau 3 à 300, niveau 4 à 600…
- **Plafond** (chantier 2, 2026-11-03) : un rang ne dépasse pas **niveau + 2** (3 au niveau 1, 7 au niveau 5,
  10 au plus) ; l'écran l'affiche (« rang maximum : 4 »). `maxRankAt`, `src/rules/leveling.ts`.
- **À chaque niveau** : `3 + mod. Intellect` points de compétence à répartir (`docs/gdd/competences.md`), un repos
  complet (les PV reviennent au maximum). Pas de point d'attribut supplémentaire : seules les compétences progressent (validé par Cyril le 2026-11-01).
- **Plusieurs niveaux d'un coup** (XP gagnée en une fois qui franchit deux seuils) : traités un par un, chacun avec
  sa propre répartition de points.
- **Écran** : `LevelUpScene`, ouvert depuis un bouton « ✦ Montée de niveau ! » qui apparaît sur le HUD dès que le
  seuil est franchi (pas de montée automatique ou forcée : le joueur choisit son moment). Répartition des points
  comme à la création, sans plafond à 3 : jusqu'à 10 par compétence.

## Passe de qualité (2026-11-02)

- « Le Dernier Train » rapporte **70 XP** (au lieu de 40) quelle que soit l'issue : le niveau 2 promis à la fin du
  chapitre 1 est atteint même sans les quêtes annexes. Garrik vaincu rapporte 20 XP. Chapitre 3 : rendre la clé à la
  Veilleuse 60 XP, la confier à Noam 70, la vendre à Kaelis 60.
- Repères : quêtes principales seules, environ niveau 2 à Canopéa et 3 à Ironheart ; tout fait, niveau 4 à la fin du
  « Rail des Cendres ». L'Écho du dernier train ne rapporte plus d'XP qu'une fois.

## Chantier 6 (2026-11-03)

Un don tous les deux niveaux (2, 4, 6… ; décision de Cyril du 2026-11-03), et un trait facultatif à la création : `docs/gdd/economie.md`.

## Test du 6 novembre : le rythme (décision de Cyril, 2026-11-06)

Le testeur : le premier niveau arrive trop tard, et les combats ne rapportent presque rien. Appliqué
(`rythme.test.ts`) :

- **l'expérience des combats doublée** : la valeur de chaque bête (`enemies.json`, un Rôdeur-Épine 30) et celle des
  combats écrits (`encounters.json`, le premier combat 30). La route, la nuit et les voies en donnent la moitié, comme
  avant : doublées elles aussi ;
- **le niveau 2 avant la fin de Gardebois**, par le seul chemin principal : Ilyane 20, Tobias 25, le Rôdeur du sentier
  30, l'Écho du dernier train 25 à 30 (10 à 15 avant) : 100 XP et plus avant la foreuse ;
- **les fins de quêtes principales à 120 ou 150 XP** (50 à 90 avant), leur ordre gardé : chapitres 1 à 4 de 100 à 140
  (la fin la moins bonne 100, la meilleure 140 ; le Golem vaincu 120), chapitres 5 à 8 de 130 à 150 ;
- **la marche plus rapide** : 120 ms par case (160 avant ; la course reste à 80).

Repère : chapitres 1 à 5, tout fait, sans un combat de route, niveau 6 (5 avant).
