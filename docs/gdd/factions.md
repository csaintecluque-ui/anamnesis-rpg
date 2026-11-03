# Factions : règles de jeu (proposition du 2026-11-02, validée par Cyril le 2026-11-02)

Factions retenues : celles du Notion (ANAMNESIS ENGINE : Travailleurs du Rail, Marches des Cendres, Archives de
Ferros) et trois guildes ajoutées (Compagnie des Lisières, Nacelliers, Route des Carrioles).

Lore des factions : `docs/univers/factions.md` (section « Factions du jeu »). Réputation par ville, dont on reprend le
mécanisme : `docs/gdd/reputation.md`.

- **Réputation de faction** : comme celle des villes, déduite des quêtes et des repères, avec les mêmes paliers
  (méfiance, neutre, estime, amitié). Une action peut plaire à l'une et déplaire à l'autre (dénoncer un contrebandier
  de la Compagnie des Lisières : estime de Canopéa, méfiance de la Compagnie ; donner la clé de rouille bleue aux
  Archives de Ferros : méfiance des Marches des Cendres).
- **Adhésion** : on rejoint une guilde par une quête (la « caravane de midi » pour la Compagnie des Lisières, « Les
  lettres de Malo » pour les Nacelliers). On peut être membre de plusieurs, sauf de guildes rivales.
- **Ce que donne l'adhésion** : prix de membre chez ses marchands (le meilleur des deux, ville ou guilde, sans cumul),
  un service propre (caravane, courrier), des quêtes réservées.
- **Rangs des Gardiens de Mémoire** : « Lanterne » (au départ), « Carnet » (cinq Récits recueillis et une quête de
  l'ordre), « Plume » (plus tard). Proposition d'effet : chaque rang retient un Récit de plus.
- **Affichage** : un écran « Réputation » dans le menu, une ligne par ville et par faction.
- **Code prévu** : `reputation.json` gagne une partie `factions` ; un marchand porte `place` ou `faction` ;
  l'adhésion est un repère (`membre-compagnie-lisieres`). Pas de nouvelle version de sauvegarde.

## Construit le 2026-11-02 (avec les quêtes de Canopéa)

- `src/data/factions.json` (Compagnie des Lisières, Nacelliers, puis Travailleurs du Rail, Marches des Cendres, Archives
  de Ferros : nom et repère d'adhésion) ; leurs sources de réputation
  dans `src/data/reputation.json`, à côté des villes, avec les mêmes paliers ; condition `reputation` et messages
  « Réputation auprès de la Compagnie des Lisières : … » (« on te fait confiance » au lieu de « la ville »).
- Adhésion : `membre-compagnie-lisieres` (« La caravane de midi ») ; `nacelliers-amis` (« Les lettres de Malo »).
- Prix de membre : un marchand porte `faction` (Tobias et Ragna : Compagnie des Lisières) ; un membre y paie −15 %, ou le prix
  de la ville s'il est meilleur, sans cumul.
- **Construit depuis** : l'onglet Réputation du journal ; la caravane (« Voyager autrement ») ; la réputation des trois
  factions de Ferros (Ironheart).
- **Reste** : le courrier entre villes ; les trois ou quatre quêtes de chaque faction (plus tard).

## Rangs et adhésions (jalon 3, étape 7 ; construit le 2026-11-03, validé et mis en ligne par Cyril le 2026-11-03)

Code : `src/rules/factions.ts` (et `factionRank`, les prix par rang dans `src/rules/reputation.ts`) ; données :
`src/data/factions.json` (rangs, rivales, chef, cadeau, avantages), `src/data/rangs.json` (seuils, prix, Gardiens).
Toujours rien de plus à sauvegarder : les rangs se déduisent des repères, des quêtes et des contrats.

### Les trois rangs des guildes et des factions

- **Membre** : la quête d'adhésion. **Deuxième rang** : membre et 20 de réputation. **Sommet** : membre et 40 de
  réputation, **si aucune rivale n'y est déjà** (« monter haut chez l'une ferme le sommet de l'autre ») ; il se gagne
  pour de bon (repère `sommet-<faction>`) et vient avec un **cadeau**, une fois.
- **Rivales** : les Marches des Cendres d'un côté, les Archives de Ferros et les Travailleurs du Rail de l'autre. On ne
  peut pas adhérer chez une rivale de ses guildes (l'offre ne vient pas).
- **Prix** chez les marchands de la guilde (Tobias et Ragna pour la Compagnie, la tailleuse pour les Marches) : −15 %
  membre, −20 % au deuxième rang, −25 % au sommet (le meilleur des deux, ville ou guilde, sans cumul).
- Un message à chaque rang gagné ; le rang s'affiche au journal (onglet Réputation : « on t'apprécie · Aiguilleur »).

| Faction | Chef | Rangs | Adhésion | Cadeau du sommet |
|---|---|---|---|---|
| Compagnie des Lisières | Tobias | Porteur, Convoyeur, Associé | « La caravane de midi » (déjà) | le manteau de convoyeur (armure +2) |
| Nacelliers | Véline | Ami des nacelles, Coursier, Passeur des cimes | « Les lettres de Malo » (déjà) | un cristal de Vie |
| Travailleurs du Rail | Varka | Graisseur, Aiguilleur, Chef de ligne | **« La lanterne du triage »** | le marteau de la ligne (marteau de forge) |
| Marches des Cendres | Kaelis | Fournisseur, Courtier, Associé des Cendres | **« Ce qui se souvient »** | un cristal de forge |
| Archives de Ferros | Noam | Correspondant, Classeur, Archiviste honoraire | **« Le fonds des Échos »** | une rente de classement (100 Fers, 50 XP) |

### Les trois quêtes d'adhésion de Ferros

- **« La lanterne du triage »** (Varka, après « Le Rail des Cendres » gagné pour les cheminots) : rapporter une lanterne
  de chef de gare du **Dépôt Sept, deuxième niveau** (elle y attend tant que la quête dure, `quetes` de
  `src/data/voies.json`). Membre, +10 auprès des Travailleurs, −5 auprès des Marches ; 40 XP.
- **« Le fonds des Échos »** (Noam, « Les Archives prennent-elles des correspondants ? ») : faire classer **cinq Échos**
  du Livre des Échos. Membre, +10 auprès des Archives, −5 auprès des Marches ; 40 XP.
- **« Ce qui se souvient »** (Kaelis, après la clé ou en parlant de reliques) : rapporter une **plaque émaillée** du
  **tunnel de la Combe, deuxième niveau**. Membre, 40 Fers, +10 auprès des Marches, −5 auprès des Archives et du Rail ;
  40 XP.

### Les rangs des Gardiens de Mémoire

| Rang | Il faut | Effet |
|---|---|---|
| **Lanterne** | au départ | — |
| **Carnet** | 5 Récits retenus et 3 contrats remplis | un Récit de plus retenu |
| **Plume** | 8 Échos recueillis, 8 contrats remplis, et « La Clé de Rouille Bleue » terminée | un Récit de plus encore |

Le rang s'affiche en tête de l'onglet Réputation du journal (avec ce qu'il faut pour le suivant) et sur les tableaux des
contrats ; un message quand il change.
