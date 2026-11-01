# Compétences (12) et résolution des tests

Ce sont les douze compétences du JDR, avec deux retouches (adaptation) :
- **Combat** est scindé en **Mêlée** et **Tir**, parce que le combat est au cœur d'un CRPG ;
- **Pilotage** est retiré : il n'y a pas de véhicule à piloter dans la tranche.

| Compétence | Attribut | Usage |
|---|---|---|
| Athlétisme | Corps | courir, sauter, nager, escalader |
| Mêlée | Corps | armes de contact |
| Tir | Agilité | arcs, arbalètes, frondes |
| Discrétion | Agilité | se cacher, voler à la tire |
| Artisanat | Intellect | fabriquer, réparer, **crocheter, désamorcer** |
| Survie | Perception | nature, pistage, premiers soins |
| Érudition | Intellect | histoire, cultures, Ancien Monde |
| Investigation | Perception | indices, analyse, déduction |
| Médecine | Intellect | soins avancés, poisons |
| Commandement | Présence | inspirer, **intimider** |
| Diplomatie | Présence | persuader, négocier, **troquer** |
| Subterfuge | Présence | mentir, bluffer, se déguiser |

## Résolution d'un test (JDR)

- **Formule** : d20 + modificateur d'attribut + rang ≥ difficulté.
- **Difficultés** : 5 (facile), 10 (moyen), 15 (difficile), 20 (très difficile), 25 (héroïque), 30 (légendaire).
- **Critiques** : un 20 naturel est un succès critique, un 1 naturel un échec critique.
- **Rang (adaptation)** : le JDR calcule le bonus comme « niveau × maîtrise ». Dans le jeu, chaque compétence a un **rang de 0 à 10**, qui progresse avec les points gagnés à chaque niveau, comme dans les CRPG de référence.
  - À la création : 6 points de rang à répartir, 3 au maximum par compétence.
  - À chaque niveau : 3 + mod. Intellect points (minimum 1).
- **Dans les dialogues** : on utilise des **seuils fixes**, sans dé (par exemple Présence ≥ 4, ou Diplomatie rang 3). L'option reste visible et grisée, avec la condition manquante affichée.
- **Pour les actions** (crocheter, se cacher, voler) : on lance le dé, et l'interface affiche la chance de réussite en %.
  Implémenté dans les dialogues depuis le 2026-11-01 (`docs/gdd/dialogues.md`, « Jets de dé ») : première utilisation,
  le sabotage de la foreuse (Discrétion puis Artisanat, difficulté 10).
