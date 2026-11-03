# Compétences (12, plus la Résonance) et résolution des tests

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
| **Résonance** (2026-11-02) | Vigueur | écouter un cristal porté au cou, en tirer la magie (`docs/gdd/magie.md`) ; pas de rang à la création, elle s'apprend en route |

## Résolution d'un test (JDR)

- **Formule** : d20 + modificateur d'attribut + rang ≥ difficulté.
- **Difficultés** : 5 (facile), 10 (moyen), 15 (difficile), 20 (très difficile), 25 (héroïque), 30 (légendaire).
- **Critiques** : un 20 naturel est un succès critique, un 1 naturel un échec critique.
- **Rang (adaptation)** : le JDR calcule le bonus comme « niveau × maîtrise ». Dans le jeu, chaque compétence a un **rang de 0 à 10**, qui progresse avec les points gagnés à chaque niveau, comme dans les CRPG de référence.
  - À la création : 6 points de rang à répartir, 3 au maximum par compétence.
  - À chaque niveau : 3 + mod. Intellect points (minimum 1).
- **Dans les dialogues** : on utilise des **seuils fixes**, sans dé (par exemple Présence ≥ 4, ou Diplomatie 3). L'option reste visible et grisée, avec la condition manquante affichée.
  Depuis le chantier 2 (2026-11-03), un seuil de compétence compte **le rang et le modificateur de l'attribut**, comme
  un jet : Diplomatie 2 avec Présence 4 fait 3 (`skillScoreOf`, `src/rules/attributes.ts`). L'infobulle le détaille :
  « Il faut Diplomatie 4 : tu as 3 (rang 2, Présence +1). »
- **Pour les actions** (crocheter, se cacher, voler) : on lance le dé, et l'interface affiche la chance de réussite en %.
  Implémenté dans les dialogues depuis le 2026-11-01 (`docs/gdd/dialogues.md`, « Jets de dé ») : première utilisation,
  le sabotage de la foreuse (Discrétion puis Artisanat, difficulté 10).

## Chantier 2 : la courbe des tests et le rôle de chaque compétence (2026-11-03)

Feuille de route de Cyril (`docs/gdd/feuille-de-route.md`, chantier 2). Le test `src/rules/competences.test.ts` garde
la courbe et l'usage des compétences : un ajout qui en sort fait échouer les tests.

### La courbe

| Chapitre | Seuil (rang + attribut) | Difficulté d'un jet |
|---|---|---|
| 1 (Gardebois, la Gare) | 2 à 3 | 10 à 12 |
| 2 (Canopéa) | 2 à 3 | 11 à 13 |
| 3 (Ironheart) | 3 à 4 | 12 à 14 |
| 4 (Sept-Portes) | 3 à 5 | 13 à 15 |
| 5 (à écrire) | 4 à 5 | 14 à 16 |
| finale (à écrire) | 6 à 7 | 18 à 20 |

Seule exception : un jet facilité par une rumeur de veillée (le portier du Fonds Muet, 10). Douze seuils ont été
relevés d'un cran (Ambroise, le Registre, l'aiguillage, Joss, la plaque du pilote…).

**Le rang plafonne à niveau + 2** (3 au niveau 1, comme à la création ; 7 au niveau 5 ; 10 au plus) : sans ce plafond,
un héros qui mettait tous ses points dans une compétence atteignait le rang 10 au niveau 5 et réussissait tout. Un
personnage spécialisé de niveau 5 (rang 7, attribut 6, soit 10) passe tous les seuils du chapitre 5, mais rate encore
un jet sur quatre à 16 : au chapitre 5, les épreuves de sa spécialité seront des jets à 15 ou 16.

### Chaque compétence sert au moins cinq fois

| Compétence | Où (chapitre) |
|---|---|
| **Athlétisme** (escalade, fuite) | la palissade de la Gare (1, jet 11) ; la lucarne du grenier des semences (2, jet 12) ; sauter sur le dernier wagon du convoi (3, jet 13) ; bousculer le guetteur du tunnel (3, jet 13) ; la verrière du Fonds Muet (4, jet 14) ; contourner les Geckos-Soudeurs (route, jet 11) ; forcer une caisse des voies endormies (raté : 3 PV) |
| **Médecine** (soins, poisons) | les malades de Liane (1, seuil 2) ; **Pell**, tiré du feu de la chaudière (1, seuil 3 : il vit, sans ses mains ; sans Médecine, il meurt dans tes bras) ; les brûlures de Tiven (2, seuil 3) ; les poumons de Tam (3, seuil 3) ; de quoi dormir pour Joss (3, seuil 3) ; **+2 PV par point** à chaque remède (bandage, baume, fiole) ; les recettes des herbes de Sévane |
| **Artisanat** | le sabotage de la foreuse, le grenier, l'aiguillage, l'arbre d'Anselme, le capot de la vieille locomotive (3, seuil 3) ; les cadenas des voies ; **les recettes de la forge d'Hedda** |
| **Commandement** | Elvan, Garrik, Ingrid, Joss, et le patrouilleur du funiculaire qui découvre la rouille de l'âme (3, seuil 4) |

L'artisanat (`docs/gdd/artisanat.md`) demande la compétence : Artisanat 1 à 4 à la forge, Médecine 1 à 3 aux herbes.
Sans elle, Hedda ou Sévane font le travail, pour le double des Fers (bouton « Faire forger », « Faire préparer »).
