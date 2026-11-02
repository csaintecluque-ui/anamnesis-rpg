# Carte du monde et rencontres aléatoires

Demande de Cyril (2026-11-01) : une carte pour circuler entre les villes, puis des lieux aléatoires comme dans les CRPG de
référence. **Fait le 2026-11-01, en visuels provisoires ; validé et mis en ligne sur accord de Cyril le 2026-11-02.**
Le tableau des rencontres est validé avec ; le dessin de la région reste à caler sur la carte de Cyril.
Code : `src/scenes/WorldMapScene.ts`, `src/rules/world.ts` ; données : `src/data/world.json`, `src/data/rencontres.json`.

## La carte du monde

- **On y entre** en quittant une ville par sa route ou sa nacelle (Gardebois : la route de l'ouest ; Canopéa : la
  Grande Nacelle). On se trouve alors sur la ville qu'on quitte.
- **On voyage** en touchant un lieu connu : le panneau dit la durée (« environ 2 jours de marche »), puis le marqueur
  du héros traverse la carte. Le compteur affiche le jour de voyage. Toucher la ville où l'on est permet d'y rentrer.
- **Lieux connus** : Gardebois et Canopéa. Un lieu peut aussi apparaître plus tard grâce à un repère (`revealedBy`).
- **Terres lointaines** écrites au bord, pas encore accessibles : Ferros (nord), Terminus (est), Zephyria (sud-ouest),
  d'après la place des continents [E3].
- **À valider** : le dessin de la région (forêts, frontière de Ferros, montagnes) et les positions de Gardebois et de
  Canopéa sont provisoires ; à caler sur la carte de Cyril (`docs/Carte Anamnesis.png`, absente de la session cloud).
- **Pas de sauvegarde** sur la carte du monde : on sauvegarde dans les lieux, comme avant.

## Rencontres en route (« lieux aléatoires »)

- **Fréquence** : un tirage tous les 100 de distance parcourue, sauf dans les 60 premiers ; 16 % de chance à chaque
  tirage. Entre Gardebois et Canopéa (≈ 520), on a environ une chance sur deux de faire une rencontre.
- **Zones** : la **lisière de Ferros** (nord-est, autour de Gardebois) et la **forêt** (le reste).
- **Choix** : « Approcher » ou « Passer son chemin ». Une rencontre hostile se contourne par un jet de **Survie**
  (le pourcentage est affiché) ; raté, on est repéré et il faut se défendre.
- **Lieux** : trois petites cartes (20 × 16) tirées selon la rencontre : une clairière, une route forestière, des ruines
  de l'Ancien Monde. On repart par le bord ouest ou est, et la carte du monde propose de reprendre la route.
- **Combat** : les ennemis attaquent presque aussitôt, sur la carte même (comme le combat de la Gare) ; la victoire
  rapporte la moitié de leur valeur en XP. Une défaite ramène le héros à Gardebois, « trouvé par des voyageurs ».
- **Repères éphémères** : les repères qui commencent par `rencontre-` (boîte ouverte, voyageur aidé, victoire) sont
  oubliés au début de la rencontre suivante.

| Rencontre | Zone | Lieu | Contenu | Statut |
|---|---|---|---|---|
| Rôdeurs-Épine | forêt, lisière | clairière, route | 2 Rôdeurs-Épine [E8] ; contourner : Survie 11 | validé |
| Ours-Mousse | forêt | clairière | 1 Ours-Mousse [E8] (30 PV, Défense 12, 1d10) ; Survie 10 | validé |
| Loups de Rouille | lisière | route, ruines | 2 Loups de Rouille [E7-2] (12 PV, Défense 13, 8 PA) ; Survie 13 | validé |
| La colporteuse | forêt, lisière | route | marchande ambulante (troc) et sa carriole ; nouvelles des routes | validé |
| Un voyageur égaré | forêt, lisière | route, clairière | on lui retourne sa carte : 5 Fers, 10 XP | validé |
| Cerfs-Lucioles | forêt | clairière | émerveillement : 10 XP ; avec Survie 2, on les suit jusqu'à une source (+10 PV) | validé |
| La boîte de fer | forêt, lisière | ruines | « Pour qui en aura besoin » : 8 Fers et un bandage | validé |

## Prochaines étapes possibles

- Des **lieux découverts** en route (un hameau, une ruine) qui restent ensuite sur la carte.
- Le **temps** qui passe (jour et nuit, date du voyage), des rencontres qui dépendent du niveau.
- Les autres régions quand les villes suivantes seront construites (`docs/gdd/villes.md`).

## Rencontres d'histoire (2026-11-02)

Une rencontre peut porter `story` (`{ quest, flag }`) : jamais tirée au hasard, elle attend au premier contrôle d'un
voyage tant que la quête est en cours et le repère absent, puis pose le repère. Première : les Loups de Rouille de
« La caravane de midi » (`loups-caravane`).
