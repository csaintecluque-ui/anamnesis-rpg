# Attributs (7) et valeurs dérivées

Ce sont les six attributs du JDR, plus **Mémoire**. Données : `src/data/` ; règles : `src/rules/`.

| Attribut | Rôle (JDR) | Usages dans le jeu |
|---|---|---|
| Corps | force physique | mêlée, charge, forcer une porte |
| Agilité | réflexes, coordination | tir, esquive, discrétion, initiative, points d'action |
| Vigueur | endurance, santé | points de vie, résistance, survie |
| Intellect | intelligence, logique | artisanat, érudition, médecine, cristaux, points de compétence |
| Perception | sens, intuition | investigation, survie, repérer pièges et indices |
| Présence | charisme, leadership | diplomatie, commandement, subterfuge, prix du troc |
| **Mémoire** | se souvenir, écouter le passé | percevoir et recueillir les Échos du Passé, nombre de Récits retenus, résister aux Échos maudits et au Champignon-Mémoire |

- **Échelle (JDR)** : de 1 à 5 ; 3 correspond à la moyenne humaine. **Modificateur** = attribut − 3.
- **Création (adaptation)** : tous les attributs partent de 3, et le joueur répartit 3 points. Aucun attribut ne dépasse 5 à la création. Baisser un attribut sous 3 rend 1 point par cran (minimum 1).
  - Pourquoi ne pas reprendre le JDR tel quel ? Il donne 27 points pour 6 attributs, soit 4,5 de moyenne, ce qui ne colle pas avec « 3 = moyenne ». C'est la zone floue n° 21 (`docs/univers/zones-floues.md`).
- **Pourquoi Mémoire** : c'est le thème central de l'univers (les Gardiens de Mémoire) [E1] et une loi du monde (la Mémoire Vivante) [E2]. Ce n'est pas de la magie.

## Valeurs dérivées (personnage à 3 partout entre parenthèses)

| Valeur | Formule | Source |
|---|---|---|
| Points de vie | 20 + 4 × Vigueur (32) ; par niveau : +4 + mod. Vigueur | JDR, dé de vie fixé (adaptation) |
| Points de Résistance | Vigueur + mod. Présence (3) ; on en dépense 1 pour relancer un jet ; ils reviennent au repos | JDR |
| Défense | 10 + mod. Agilité + armure (10) | JDR |
| Initiative | d20 + mod. Agilité | JDR |
| Points d'action | 7 + la moitié du mod. Agilité, arrondie en dessous (7) ; avant le chantier 3 : 6 + mod. Agilité | adaptation : le JDR fonctionne en actions, pas en PA |
| Charge | 30 + 10 × Corps kg (60) | adaptation |
| Récits retenus | Mémoire + 1 (4) | voir `docs/gdd/memoire.md` |
