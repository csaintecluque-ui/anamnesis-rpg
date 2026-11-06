# Le temps et les auberges (demande de Cyril, 2026-11-02 ; conception validée le 2026-11-02)

Code : `src/rules/time.ts` ; état : `GameState.time` (sauvegarde v10) ; canon : `docs/univers/magie.md` (relecture du
Notion), `docs/univers/zones-floues.md` (points 26 à 28).

## Le calendrier

- Canon [NOTION, « Géographie »] : 365 jours en douze mois **sans nom** (« le 4 du neuvième mois de 1387 »), sept de
  31 jours, quatre de 30, un de 28 ; l'ère se compte en AN, le présent est l'an 3000.
- Le jeu commence **le 1er du huitième mois de l'an 3000**, au matin (choix proposé par Claude ; facile à changer :
  `START` dans `src/rules/time.ts`). Les mois suivent l'ordre 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31.
- Quatre **moments** par jour : matin, midi, soir, nuit. Le haut de l'écran dit le lieu et le moment (« Ironheart —
  Les Forges-Basses · soir ») ; le journal dit le jour et la date (« Jour 2, au matin — le 2 du huitième mois de l'an
  3000 »).

## Ce qui fait passer le temps

| Action | Temps |
|---|---|
| Marcher sur la carte du monde | un moment par quart de journée de marche (au moins un) |
| Le train (ligne de l'Ouest) | une demi-journée (deux moments) |
| La caravane | elle part à midi et arrive le soir |
| « Attendre la nuit » (forge froide, foreuse, garde du triage) | jusqu'à la nuit |
| Dormir à l'auberge | jusqu'au matin, ou jusqu'à la nuit (au moins jusqu'au prochain) |

Entrer dans une maison ou changer de quartier ne fait pas passer le temps.

## La nuit

- Un voile bleu nuit sur la carte (lumière dorée le soir) ; les noms des personnages restent lisibles.
- Ce qui se passait « la nuit » se passe vraiment la nuit : on y attend la nuit et l'heure change.
- Les boutiques restent ouvertes la nuit (recommandation acceptée : ne pas frustrer).

## Les auberges

| Auberge | Ville | Repas | Nuit |
|---|---|---|---|
| Auberge de la Racine (Sylvan) | Gardebois | 8 Fers, +15 PV | 6 Fers |
| Auberge du Nid (Lisandre, hamacs) | Canopéa | 8 Fers, +15 PV | 10 Fers |
| Pension de la Bielle (Dorna) | Ironheart | 8 Fers, +15 PV | 8 Fers |

- « Manger ou dormir ? » : dormir rend tous les PV et tous les Points de Résonance (`docs/gdd/magie.md`), et
  **sauvegarde la partie** (emplacement automatique).
- L'accueil change chaque jour, sur trois jours, avec une **nouvelle du jour**.
- Canon des prix : un repas coûte ⓕ 15 à 30 (7,5 à 15 Fers) : le repas d’auberge est à 8 Fers ; aucun prix de nuit dans le canon.

- **Se reposer sans auberge** (étude du 2026-11-03, G2 ; `src/rules/repos.ts`) : dans le menu Pause, « Se reposer
  jusqu'au matin », gratuit, n'importe où sauf sous terre (voies) et sur la route, sans les PR ni l'emprise ; « une
  auberge t'aurait tout rendu ». Avant, blessé et à moins de 6 Fers, on ne pouvait plus se soigner.
  **Depuis le test du 2026-11-06 (décision de Cyril)** : les PV (héros et compagnons) remontent **à la moitié au plus**
  (au-dessus, la nuit ne rend rien) ; **une nuit par jour** (réveillé·e d'une nuit dehors, qui se recouche avant le soir attend d'abord que la journée
  passe) ;
  **hors des villes**, une nuit sur trois, quelque chose vient : la nuit tombe, le combat a lieu sur place, et gagné, on
  se rendort jusqu'au matin (moitié de l'XP des bêtes, comme sur la route). Le tirage se fait d'une graine (le jour, le
  lieu, le héros) : recharger n'y change rien ; qui se recouche la même nuit dort en paix. Lieux « hors des villes » et
  qui y rôde (`nuit` dans `src/data/locations.json`) : la Gare Engloutie (Rôdeurs-Épines, Loups de Rouille), le Sol des
  Racines (Ours-Mousse, Griffe-Sylve), sous les nuages (Mante-ailes), la voie noyée et la grotte de Coralia (Abyssal),
  le désert et la halte morte (Pilleur des sables). À l'auberge, rien ne change.

## Dialogues

- Conditions : `{ "moment": "nuit" }` (ou `"jour"`, `"matin"`…), `{ "tousLes": 3, "decalage": 1 }` (un jour sur trois).
- Effets : `{ "attendre": "nuit" }`, `{ "avancer": 2 }`, `{ "dormir": "matin" }`.
- Mode développeur : « +1 moment », « Matin », « Nuit », « +1 jour ».

## Plus tard

La magie est construite : `docs/gdd/magie.md`.
