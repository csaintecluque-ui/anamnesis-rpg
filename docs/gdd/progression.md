# Montée de niveau

Règles : `src/rules/leveling.ts` ; écran : `LevelUpScene`.

- **Seuils d'expérience** (premier jet d'équilibrage, à valider) : `50 × niveau × (niveau − 1)` XP cumulés pour
  atteindre un niveau — niveau 2 à 100 XP, niveau 3 à 300, niveau 4 à 600…
- **À chaque niveau** : `3 + mod. Intellect` points de compétence à répartir (`docs/gdd/competences.md`), un repos
  complet (les PV reviennent au maximum). Pas de point d'attribut supplémentaire : seules les compétences progressent.
- **Plusieurs niveaux d'un coup** (XP gagnée en une fois qui franchit deux seuils) : traités un par un, chacun avec
  sa propre répartition de points.
- **Écran** : `LevelUpScene`, ouvert depuis un bouton « ✦ Montée de niveau ! » qui apparaît sur le HUD dès que le
  seuil est franchi (pas de montée automatique ou forcée : le joueur choisit son moment). Répartition des points
  comme à la création, sans plafond à 3 : jusqu'à 10 par compétence.
