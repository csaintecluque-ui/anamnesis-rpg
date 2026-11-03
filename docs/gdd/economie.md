# Économie et progression (chantier 6 de la feuille de route, 2026-11-03)

Le diagnostic de Cyril (`docs/gdd/feuille-de-route.md`) : l'argent perdait sa valeur (tout le catalogue pour 4 ou 5
descentes), la réputation plafonnait à 25, la progression était plate. Code : `src/rules/usure.ts`,
`src/rules/voies.ts` (`voieYield`), `src/rules/reputation.ts`, `src/rules/character.ts` (dons, traits) ; tests :
`economie.test.ts`, `usure.test.ts`, `progression.test.ts`.

## Des dépenses qui reviennent

- **L'usure** : chaque combat (gagné ou fui) use l'arme en main et l'armure portée. Après 6 combats, elles sont
  **émoussées** (−1 au toucher, −1 en Défense) ; après 12, **abîmées** (−2). Un marchand les répare : prix de l'objet
  × combats ÷ 40 (une épée trempée émoussée : 11 Fers). La fiche de l'objet dit son usure ; le bouton « Réparer » est
  chez tous les marchands.
- **Le cristal s'use** : tous les 6 lancers, il donne un Point de Résonance de moins (jamais moins d'un). La
  **tailleuse** d'Ironheart le réaccorde pour 20 Fers ; **Vanel**, au Bosquet des Échos, pour rien, mais il faut y
  passer la nuit (« La Terre ne vend pas ses soins »).
- **Le laissez-passer** de visiteur du funiculaire d'Ironheart dure **sept jours** (10 Fers), le bluff un jour ; le
  sauf-conduit du Triumvirat reste. Drapeaux à durée : `setFlagFor`, `expireFlags`.
- Déjà là : les nuits (6 à 12 Fers), les repas (8), le train et la caravane, les pots-de-vin (le patrouilleur, Dask),
  les munitions, les remèdes.

## Des voies qui s'épuisent

Chaque descente dans une même voie rapporte **un cinquième de moins** que la précédente (Fers des caisses, objets
qu'elles contiennent, XP des bêtes), jusqu'à deux cinquièmes du départ. Moyennes sur 200 tirages (Fers des caisses ;
butin vendu, caisses et bêtes ; 6,4 combats par descente) :

| Voie | 1re descente | 2e | 3e | 4e et suivantes |
|---|---|---|---|---|
| La halte des Fougères | 121 + 80 | 97 + 73 | 73 + 66 | 48 + 57 |
| Le tunnel de la Combe | 154 + 92 | 123 + 84 | 92 + 75 | 61 + 67 |
| Le Dépôt Sept | 186 + 127 | 149 + 112 | 112 + 97 | 74 + 101 |

Une descente coûte environ 40 Fers à un héros du chapitre 3 (réparations de 6 combats avec une épée trempée et une
armure de cuir clouté, une nuit, un repas). Le Dépôt Sept rapporte donc ~270 Fers nets la première fois, ~135 à partir
de la quatrième ; la halte des Fougères, ~160 puis ~65.

## La réputation au-delà de 25

| Palier | Seuil | Prix d'achat | Et aussi |
|---|---|---|---|
| On te fait confiance | 25 | −15 % | |
| **La ville t'honore** | 40 | −20 % | ses marchands rachètent 20 % plus cher |
| **Ton nom court aux veillées** | 55 | −25 % | le chapeau de la veillée de la ville paie double |

Gardebois atteint 40 en jouant tout ; Canopéa, 55.

## La progression

- **Un don tous les deux niveaux** (2, 4, 6… ; décision de Cyril du 2026-11-03, étude F2 ; d'abord tous les trois) : les six dons de la création, ou trois dons de niveau : **Langue
  d'argent** (−10 % chez tous les marchands), **Peau de cuir** (+1 Défense), **Sang-froid** (+2 aux jets de
  résistance). L'écran de montée de niveau le propose après les points de compétence.
- **Un trait à la création**, facultatif, un avantage et son prix : **Mémoire trouée** (un Récit de moins, un point
  de compétence de plus par niveau), **Main lourde** (+1 dégâts en Mêlée, −2 Diplomatie), **Sang de Ferros** (+2
  résistance, 10 % plus cher à Gardebois et Canopéa), **Rêveur·se** (+2 Points de Résonance, −4 PV).
- Le rang plafonne à niveau + 2 (chantier 2).

## Le bilan, jusqu'à la fin du chapitre 4

Ce qu'un joueur qui fait tout gagne et dépense, à la grosse (les quêtes : 858 Fers toutes branches confondues, une
partie en donne environ 550 ; les contrats : 15 à 25 Fers le pli, 40 à 80 la recherche, 35 à 55 la chasse ; les
veillées : 4 à 15 Fers) :

| Rentrées | Fers | Dépenses | Fers |
|---|---|---|---|
| Quêtes | ~550 | Un cristal | 250 |
| Une descente par voie | ~760 brut | La meilleure armure (forgée) | ~170 |
| Dix contrats | ~450 | La meilleure arme | ~70 |
| Veillées | ~150 | Lampe, remèdes, munitions | ~150 |
| | | Nuits, repas, voyages (40 jours) | ~550 |
| | | Réparations, cristal, laissez-passer | ~250 |
| **Total** | **~1 900** | **Total** | **~1 440** |

Avant le chantier, les mêmes descentes répétées rapportaient chaque fois autant, et rien ne s'usait : quatre ou cinq
descentes vidaient les boutiques. Désormais, un joueur qui fait tout garde de quoi choisir, pas de quoi tout prendre
(le catalogue coûte 1 700 Fers), et chaque nouvelle descente rapporte moins.
