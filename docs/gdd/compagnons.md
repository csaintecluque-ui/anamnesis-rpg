# Les compagnons (jalon 3, étape 2 ; construite le 2026-11-02, validée par Cyril : « Ok on est partie »)

Plan : `docs/gdd/jalon-3.md`. Code : `src/rules/companions.ts`, `src/scenes/Party.ts` ; données :
`src/data/companions.json` ; dialogues `compagnon-liane`, `compagnon-boulon`. Combat à plusieurs : `docs/gdd/combat.md`.

## Le système

- **Deux compagnons au plus.** Ils suivent le héros sur la carte, un pas derrière, en file ; on **touche** un compagnon
  pour lui parler. Pendant qu'il voyage avec le héros, il n'est plus chez lui (son PNJ disparaît de la carte).
- **Recruter** : effet de dialogue `rejoindre` ; **renvoyer** : « Rentre à Gardebois, Liane » (effet `quitter`) : il
  retourne chez lui, et l'on peut revenir le chercher.
- **Leur avis** (effet `avis`, + ou −) : un compagnon ne juge que ce qu'il **voit**, donc seulement quand il voyage avec
  le héros. On l'entend tout de suite (« Liane approuve », « Liane désapprouve »), et dans son accueil (chaleureux à
  +3, froid à −2). **À −5, il s'en va** et ne revient pas pour l'instant.
- **Une nuit à l'auberge** les soigne ; au combat, un compagnon tombé se relève avec 1 PV.
- Conditions de dialogue : `compagnon` (il voyage avec le héros), `avis` (entre `min` et `max`), `lieu`.

## Liane Sève-Claire, l'herboriste

- **Recrutement** : à Gardebois, une fois « Les herbes de lisière » terminée : « Je ne me bats pas pour les causes
  perdues, et je ne vole rien à personne. » 24 PV, une fronde, et elle **soigne** un allié au combat.
- **Ce qu'elle aime** : soigner (Tiven), rendre ce qui a été volé (Elvan qui rapporte les graines), garder un Écho pour
  Ilyane. **Ce qu'elle n'aime pas** : voler les graines du Conseil, partager le silence d'Elvan, vendre la clé à
  Kaelis, frapper un Écho.
- **Sa quête, « Ce que Liane veut oublier »** : la nuit, elle mâche du Champignon-Mémoire (canon : il « absorbe les
  souvenirs récents des marcheurs ») pour ne plus revoir la mort de son petit frère **Saule**, sous les déblais du
  chantier de Brisefer, à la Gare Engloutie : la maladie mémorielle le lui remontre chaque nuit. Deux fins :
  - **oublier** : cueillir le vieux Champignon-Mémoire qui pousse près du chantier ; elle le mange et ne se souvient
    plus de Saule (« Quelqu'un est mort ? »), puis rêve d'un garçon qui riait fort (40 XP) ;
  - **se souvenir autrement** : graver le nom de Saule dans un jeune arbre du Bosquet des Échos (canon : on y grave
    les morts, le bois garde la mémoire de qui grave) ; elle pleure enfin ; Récit « Saule » (40 XP, avis +3).

## Boulon, le Ferrôme

- **Sa quête, « Le contrat de Boulon »** : porteur de la gare de l'Ouest, il n'a jamais vu une seule des gares dont il
  porte les malles : au registre des Archives, il est « matériel de quai » (canon : les Ferrômes ont un statut
  juridique ambigu). L'archiviste Noam tient le registre :
  - **racheter** son contrat (120 Fers) ;
  - **convaincre** Noam (Érudition 3) : « une archive vivante ne se vend pas » ; Archives +10 ;
  - **arracher la page** (Discrétion, 13) ; raté, Noam note le nom (Archives −10), mais on peut encore payer ou
    convaincre.
  De retour à la gare : « Je ne suis plus du matériel. » (40 XP) ; il vient, ou attend qu'on revienne le chercher.
- 40 PV, des poings de fer. À la gare de l'Ouest, il arrange toujours la caravane pour Gardebois.
- **Ce qu'il aime** : garder les Échos et les mémoires (les archiver, les confier, suivre l'Écho). **Ce qu'il n'aime
  pas** : vendre la clé à Kaelis, frapper un Écho, voler.

## Validé par Cyril le 2026-11-02

Les deux quêtes et leurs textes ; Saule, le frère de Liane, et sa mort au chantier de Brisefer ; le registre des
Ferrômes aux Archives et le prix du rachat.
