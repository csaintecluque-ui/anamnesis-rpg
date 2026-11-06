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
| **Artisanat** | le sabotage de la foreuse, le grenier, l'aiguillage, l'arbre d'Anselme, le capot de la vieille locomotive (3, seuil 3) ; les cadenas des voies ; **les recettes de la forge de Ragna** |
| **Commandement** | Elvan, Garrik, Ingrid, Joss, et le patrouilleur du funiculaire qui découvre la rouille de l'âme (3, seuil 4) |

L'artisanat (`docs/gdd/artisanat.md`) demande la compétence : Artisanat 1 à 4 à la forge, Médecine 1 à 3 aux herbes.
Sans elle, Ragna ou Sévane font le travail, pour le double des Fers (bouton « Faire forger », « Faire préparer »).

## Étude du 3 novembre : la compétence modifie le dé (D1 ; décision de Cyril : seuils pour les attributs, jet pour les compétences)

Avant, un test de compétence dans un dialogue était une porte : « il te faut Diplomatie 3 » ; la fiche décidait seule,
et l'on ne ratait jamais rien. Désormais **toute compétence se joue au dé** ; seuls les **attributs** (Mémoire,
Perception…) restent des seuils : ils disent qui est le héros, pas ce qu'il tente.

- **Les 45 seuils de compétence sont devenus des jets** (`roll` + `failNext`), même formule qu'avant :
  d20 + modificateur d'attribut + rang (+ souvenir − emprise − manque) ≥ difficulté ; 20 réussit, 1 échoue.
- **La difficulté suit la courbe du chantier 2** (et non la table de l'étude, plus dure au chapitre 1) : le seuil le
  plus bas du chapitre donne son jet le plus facile. Chapitre 1 : seuil 2 → 10, 3 → 12. Chapitre 2 : 2 → 11, 3 → 13.
  Chapitre 3 : 3 → 12, 4 → 14. Chapitre 4 : 3 → 13, 4 → 14, 5 → 15. Un héros qui avait juste le seuil réussit 55 à
  65 % ; deux points de plus, 65 à 75 % ; un héros sans la compétence, 30 à 50 %.
- **L'échec mène quelque part**, chaque fois écrit (`docs/DIALOGUES.md`) :
  - **une parole ratée ne se répète pas** : un repère (`ingrid-braquee`, `garrik-ferme`, `veilleuse-mefiante`…) retire
    l'option ; il reste les autres voies (une preuve, un Récit, la ruse, le combat) ;
  - **un examen raté se retente le lendemain** (traces, outils, rangées, mur, mécanisme, et la liste de l'huissier
    du Conseil) : repère d'un jour (`setFlagFor`), pour ne jamais fermer une quête ;
  - **l'échec qui coûte ou qui change la scène** : Tobias rit et fait le laissez-passer à 35 Fers au lieu de 50 ;
    Garrik lève sa pioche (combat ou recul) ; l'ours se réveille ; Pell meurt malgré tes soins ; le patrouilleur serre
    le poignet (vingt Fers ou le poste).
  - Exception : la berceuse de Maëlis se retente (rien d'autre en jeu qu'une chanson).
- **Le jet se lit avant de choisir** : « [Diplomatie 55 %] » sur l'option, le détail au survol (« Jet : un d20 + 1
  (Diplomatie) contre 14. Chances : 40 % »), le résultat écrit après coup ; la fiche de personnage (journal) donne le
  bonus de chaque compétence et sa chance sur un test normal.
- **Garde-fous** (`dialogue.test.ts`) : plus aucun seuil de compétence ; chaque jet a une suite d'échec différente de
  sa réussite ; la courbe par chapitre (`competences.test.ts`) tient toujours.

## Test du 6 novembre : le dé ne se recharge plus (décision de Cyril)

Le testeur relançait 41 jets ratés en reparlant au PNJ, et rechargeait pour changer le dé (`Math.random` au moment du
choix). Désormais (`rollOption`, `src/rules/dialogue.ts` ; `src/rules/graine.ts` ; garde-fous `jets.test.ts`) :

- **le dé vient d'une graine**, comme les voies endormies : le jour, la réplique (dialogue, nœud, option), le nombre
  d'essais du jour, le héros. Recharger rend le même dé ; un autre jour, un autre dé. Le compte des essais du jour est
  dans la sauvegarde (`jets`). « Contourner » une rencontre de la carte du monde se tire de même (le jour, la rencontre,
  le héros) ;
- **un jet raté pour rien attend le lendemain**, dans le moteur, pour tous les dialogues (et ceux à venir) : l'option
  reste visible, grisée, « Raté aujourd'hui : réessaie demain. » (repère d'un jour `jet-rate-…`). Les 33 jets qui
  disaient déjà « demain » et les 38 qui ne se retentent pas ne changent pas ;
- **un échec qui coûte se repaie** (une blessure, du temps, un objet, un combat : 21 jets, la nage, les sauts, l'échelle
  du Calme…) : « Réessayer » reste, et chaque essai payé tire un nouveau dé ;
- si plus rien n'est possible dans une réplique, « Revenir demain. » la ferme ; « Réessayer » de la serrure du
  grenier et du cadenas de la soute devient « Chercher un autre moyen. » (l'autre voie, payante, reste ouverte).
