# Montée de niveau

Règles : `src/rules/leveling.ts` ; écran : `LevelUpScene`.

- **Seuils d'expérience** (validé par Cyril le 2026-11-01) : `50 × niveau × (niveau − 1)` XP cumulés pour
  atteindre un niveau — niveau 2 à 100 XP, niveau 3 à 300, niveau 4 à 600…
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
