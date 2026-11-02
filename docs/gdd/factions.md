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
- Prix de membre : un marchand porte `faction` (Tobias et Hedda : Compagnie des Lisières) ; un membre y paie −15 %, ou le prix
  de la ville s'il est meilleur, sans cumul.
- **Construit depuis** : l'onglet Réputation du journal ; la caravane (« Voyager autrement ») ; la réputation des trois
  factions de Ferros (Ironheart).
- **Reste** : les rangs des Gardiens de Mémoire, le courrier entre villes, l'adhésion aux factions de Ferros.
