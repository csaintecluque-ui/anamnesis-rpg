# Anamnesis RPG — Analyse et feuille de route

Nov 3, 2026 · @Cyril

## Verdict

Anamnesis est solide techniquement et original dans son univers. Mais la mémoire, son thème, est encore un décor et une collection, pas le moteur du jeu. Et les systèmes s'empilent plus vite que le contenu qui les fait vivre.

État analysé : dépôt `anamnesis-rpg`, commit `cf12518` du 3 novembre 2026. Le jeu compte 4 chapitres sur 10 prévus, 21 quêtes et 99 dialogues ; les 630 tests passent. Les visuels sont provisoires et ne sont pas jugés ici.

**Deux décisions de Cyril (3 novembre 2026) qui cadrent tout le document :**

- **Le jeu se joue sur PC.** Le téléphone ne sert qu'aux essais quand Cyril n'a pas son PC. Il doit rester jouable sur téléphone, mais n'impose plus ses contraintes au jeu.
- **Le ressenti est déjà testé.** Cyril a joué « en long, en large et en travers », et ce qui le dérangeait sans qu'il sache le nommer correspond au diagnostic ci-dessous. On ne refait pas d'essai avant de corriger.

**Pour Claude Code et Codex.** Ce document est une feuille de route. Avant de commencer, lisez `CLAUDE.md`, `docs/JOURNAL.md` et `docs/INDEX.md`. Faites un chantier à la fois, dans l'ordre de la section « Feuille de route ». Tout nouveau lore reste une proposition « à valider » par Cyril, et le Notion « ANAMNESIS » fait foi.

## Les forces à garder

Ces points forment l'identité du jeu. Aucun chantier ne doit les affaiblir.

| Force | Pourquoi elle compte | Où la trouver |
| --- | --- | --- |
| Les Échos | Des fantômes du quotidien d'avant la Chute (un gobelet de café, un panneau « retard ») dans une fantasy de l'an 3000 : une idée qui n'existe nulle part ailleurs | `src/data/echos.json`, `docs/gdd/echos.md` |
| Sept-Portes | Une ville sans violence, où la seule peine est d'être raccompagné hors de la cité, au cent unième kilomètre | `docs/univers/lieux/sept-portes.md` |
| Les veillées du conteur | Le meilleur système du jeu : on choisit un Récit selon les goûts du public, et il ouvre des rumeurs | `docs/gdd/veillees.md` |
| Les marques du cristal | Une magie qui coûte, et que les gens remarquent | `docs/gdd/passe-sombre.md` |
| Des quêtes à plusieurs issues | 3 à 5 résolutions, et un échec ouvre une branche au lieu de bloquer ; la mort de Pell et la quête de Tam et Kerta en sont les meilleurs exemples | `docs/gdd/tranche-verticale.md` |
| Des tests transparents | Pourcentages de réussite affichés, options grisées lisibles | `src/rules/checks.ts` |
| Une base technique saine | 630 tests dont le parcours complet, contenu en données JSON, version hors ligne | `src/rules/parcours.test.ts` |

## Narration : le diagnostic

Le premier problème est le héros : il n'a aucun enjeu personnel dans un jeu dont le thème est la mémoire. Comptages faits sur `docs/DIALOGUES.md` : 625 répliques de PNJ et 1 130 options du joueur.

1. **Le héros est vide.** C'est un apprenti qui écoute et transmet, sans passé, sans manque, sans secret. *Planescape* repose entier sur la mémoire de son héros ; ici, la mémoire est toujours celle des autres.
2. **La quête principale est une course de relais.** On suit une chaîne d'objets et de personnes (Écho, Garrik, Kaelis, la clé, le carnet, la page, Altavent), et chaque chapitre finit par « va à la ville suivante ». Il n'y a pas d'adversaire incarné : les Réveilleurs ne sont nommés qu'une seule fois dans tous les dialogues.
3. **Les compagnons sont muets hors de leur quête.** Une seule réplique du jeu dépend de leur présence, et ils n'interviennent jamais dans les scènes. Occasion manquée : Saule, le frère de Liane, est mort sur le chantier de Brisefer, mais Liane et Ingrid ne se croisent jamais.
4. **La noirceur est annoncée plus que tenue.** Gardebois et Canopéa restent proches de Ghibli (berceuse, cerfs-lucioles). Le registre sombre vient surtout de la passe sombre, ajoutée après coup (Pell, Joss, Tam).
5. **L'écriture a des tics d'IA.**
   - Des « … » dans une réplique sur six.
   - 14 maximes en « Ici, on… » et 14 antithèses en « X, pas Y ».
   - 33 comparaisons en « comme un… ».
   - Des marchands qui parlent tous pareil (« Tout se vend, ici »).
6. **Le héros n'a pas de voix.** Un quart de ses options sont des sorties polies (« Merci », « Je reviendrai »). Seules 2 options sont hostiles, on ne peut donc jamais être dur, ironique ou cruel dans le ton.
7. **Les choix pèsent peu.**
   - Ingrid cède sur un seul jet de dés.
   - Vaincre le Golem arrête la foreuse sans aucune raison dans l'histoire (`src/scenes/MapScene.ts`).
   - Toutes les résolutions du Dernier Train rapportent 70 XP et 30 Fers.
   - Vendre la clé à Kaelis ne change rien au chapitre 4.
8. **Le lore a des incohérences.**
   - Le Récit de Corvan, un savant d'après la Chute, est donné par un Écho d'avant la Chute.
   - Des noms se ressemblent trop : Kael, Kaelis et Kael Marchevent ; Hedda et Edda ; Joss et Josse.
   - La monnaie « Nexus » apparaît encore 4 fois, alors que le Fer a été retenu.

**Ce que change le PC.** Les répliques ont été limitées à environ 30 mots pour l'écran du téléphone. Sur PC, les scènes clés peuvent être plus longues, avec plus d'échanges et de vraies joutes verbales, comme dans *Fallout 2* ou *Planescape*. Les répliques ordinaires restent courtes.

## Systèmes : le diagnostic

La mémoire laisse au joueur presque aucune décision, et les tests de compétence cessent de compter vers le chapitre 4 ou 5. Les chiffres viennent du code et de 20 000 combats simulés par cas, sans placement, compagnons ni objets.

| Problème | Ce qu'on constate | Où |
| --- | --- | --- |
| La mémoire n'oblige à aucun choix | Quand on dépasse le nombre maximum de Récits, le jeu oublie seul le plus ancien. 8 des 12 Récits ordinaires ne servent qu'aux veillées | `learnRecit`, `src/rules/recits.ts` |
| Revivre un Écho n'est pas tentant | Ce « danger » rend 5 PV, un repas à 8 Fers en rend 15 : rien ne pousse à prendre le risque | `src/rules/echos.ts` |
| L'attribut Mémoire compte peu | Il sert 16 fois, dont 12 au niveau 3, celui qu'on a par défaut | `src/data/dialogues/` |
| Deux compétences mortes | Athlétisme et Médecine ne servent nulle part, et l'artisanat n'utilise pas la compétence Artisanat | `src/data/skills.json`, `src/rules/artisanat.ts` |
| Une échelle de tests inutilisée | Aucun test ne demande plus de 3 rangs sur 10, et aucune difficulté ne dépasse 14 (une seule veillée monte à 16). Les tests de dialogue ignorent l'attribut | `conditionMet`, `src/rules/dialogue.ts` |
| Viser les bras gagne toujours | Un ennemi désarmé perd tout son tour. Victoires d'un héros moyen contre un Golem et 2 Rôdeurs : 20 % en frappant le corps, 45 % en visant les bras | `ZONES`, `src/rules/combat.ts` |
| L'Agilité écrase les autres attributs | Elle donne les points d'action, la défense, le tir et la discrétion. Agilité 6 = 9 PA = 3 attaques par tour au lieu de 2 | `src/rules/derived.ts` |
| Des ennemis pauvres | 12 ennemis à une seule attaque. L'IA attaque le plus proche, sauf la soigneuse | `src/data/enemies.json` |
| La difficulté ne suit pas | Un personnage optimisé de niveau 1 gagne 97 à 100 % des combats ; un personnage moyen de niveau 3 gagne 15 % contre un groupe dangereux | `src/data/encounters.json` |
| Le pacifisme s'arrête à l'histoire | Les voies endormies sont 100 % combat, et elles conditionnent 2 adhésions de faction et 2 contrats sur 3 | `src/rules/voies.ts` |
| Une progression plate | Monter de niveau donne 1 à 5 points de compétence, sans don ni attribut | `docs/gdd/progression.md` |
| L'argent perd sa valeur | Tout le catalogue coûte environ 1 000 Fers ; une descente rapporte 260 à 280 Fers, donc 4 ou 5 descentes vident les boutiques | `src/rules/voies.ts` |
| La réputation plafonne | Le palier maximal est à 25, mais on finit à 40-55 : tout ce qui dépasse 25 ne sert à rien | `src/data/reputation.json` |
| On peut recharger sans fin | Le jeu sauvegarde à chaque lieu, et recharger jusqu'à réussir un jet ne coûte rien | `docs/gdd/sauvegarde.md` |
| Trop de systèmes pour le contenu | Environ 12 couches de systèmes pour 21 quêtes, alors que le plan vise 5 à 8 fois plus de contenu | `docs/gdd/jeu-complet.md` |

Petit bug : sur la carte du monde, le bouton affiche « Contourner (Survie %) » même quand le jet porte sur la Discrétion ou le Subterfuge (`src/scenes/WorldMapScene.ts`, ligne 387).

**Ce que change le PC.** La souris et le clavier permettent un combat plus riche : des capacités par arme, des raccourcis, des infobulles au survol, une file d'initiative visible, le contrôle de 3 ou 4 personnages sans lourdeur. Les cartes peuvent aussi être plus grandes et plus denses.

## Feuille de route

Sept chantiers, à faire dans l'ordre, avant tout nouveau chapitre (y compris Aetherhaven). Chaque chantier se termine par une partie de Cyril sur PC et sa validation.

### 0. Passer en « PC d'abord »

- [ ] Dans `CLAUDE.md` (section 2), faire du PC la cible principale (souris et clavier, écran 1920 × 1080). Le téléphone devient une cible d'essai, qui doit rester jouable sans dicter la conception. Remplacer l'objectif de 60 i/s sur iPhone par un objectif sur PC.
- [ ] Revoir l'interface pour le PC :
  - infobulles au survol (objets, ennemis, options de dialogue) ;
  - raccourcis clavier pour toutes les actions ;
  - barre d'actions en combat ;
  - texte à une taille de lecture PC.
- [ ] Mettre à jour `docs/gdd/interface.md`.

* **Fini quand** une partie complète se joue à la souris et au clavier sans gestes pensés pour le tactile, et que le jeu reste jouable sur téléphone.

### 1. Donner une mémoire au héros

- [ ] Proposer à Cyril un Écho personnel non résolu pour le héros : un manque, un trou de mémoire, une scène qu'il ne comprend pas. Il se révèle par morceaux, chapitre après chapitre. C'est une proposition « à valider », sans personnage du roman.
- [ ] Quand on dépasse le nombre maximum de Récits, c'est **le joueur** qui choisit lequel oublier (`learnRecit`). Le Champignon-Mémoire devient un oubli volontaire, en échange d'une contrepartie.
- [ ] Revivre un Écho donne un bonus temporaire réel, et l'emprise un vrai coût : c'est ce qui crée la tentation.
- [ ] Les Échos cachés se révèlent avec Mémoire 4 ou 5.
- [ ] Au moins une option « raconter un Récit » par quête, et des PNJ qui réagissent différemment selon le Récit choisi.

* **Fini quand** chaque chapitre contient au moins un choix de mémoire qui coûte quelque chose au joueur.

### 2. Recalibrer les tests et les compétences

- [ ] Faire monter la difficulté au fil des chapitres :
  - chapitre 1 : rang 2-3, difficulté 10-12 ;
  - chapitre 5 : rang 4-5, difficulté 14-16 ;
  - finale : rang 6-7, difficulté 18-20.
- [ ] Les tests de dialogue comptent l'attribut et le rang (`conditionMet`).
- [ ] Donner un rôle à Athlétisme (escalade, raccourcis, fuite) et à Médecine (sauver Pell ou Joss, poisons, meilleurs soins), ou les fusionner avec d'autres compétences. L'artisanat exige la compétence Artisanat.
- [ ] Corriger le libellé « Contourner (Survie %) » (`WorldMapScene.ts`, ligne 387).

* **Fini quand** chaque compétence sert au moins 5 fois, et qu'un personnage spécialisé au niveau 5 échoue encore à certains tests du chapitre 5.

### 3. Refaire le combat

- [ ] Viser coûte 4 PA, et le désarmement demande un jet de résistance.
- [ ] Les PA dépendent moins de l'Agilité ; le coût d'une attaque dépend de l'arme (2 PA à la dague).
- [ ] Donner 2 capacités à chaque ennemi, et une IA qui achève les blessés, se met à couvert et fuit.
- [ ] Faire monter la force des ennemis au fil des chapitres.
- [ ] Ouvrir une voie pacifiste dans les voies endormies : la Discrétion pour éviter un groupe, un Récit pour apaiser un Écho furieux.

* **Fini quand**, en simulation, aucune tactique ne dépasse les autres de plus de 15 points de victoire, et qu'un personnage pacifiste peut finir les voies.

### 4. Faire vivre les compagnons et incarner l'ennemi

- [ ] Une dizaine d'interventions par compagnon dans les scènes clés (Liane face à Ingrid, Boulon devant la clé), et des dialogues entre eux.
- [ ] Relier la mort de Saule au chantier d'Ingrid.
- [ ] Rendre l'issue de la quête de Liane moins orientée (oublier et se souvenir doivent être deux vrais choix).
- [ ] Un Réveilleur visible et nommé dès le chapitre 2 (proposition à valider).
- [ ] Faire dépendre le début du chapitre 4 du sort de la clé.

* **Fini quand** chaque compagnon réagit dans chaque quête principale, et que l'adversaire a un visage avant Sept-Portes.

### 5. Passe d'écriture

- [ ] Diviser par trois les « … », les « Ici, on… », les « X, pas Y » et les « comme un… ».
- [ ] Donner une voix propre à chaque marchand.
- [ ] Ajouter au héros des répliques dures, ironiques et cruelles, à côté des polies.
- [ ] Faire résister Ingrid sur 2 ou 3 échanges, et justifier le lien entre le Golem et la foreuse.
- [ ] Différencier les récompenses selon la résolution choisie.
- [ ] Corriger le Récit de Corvan, retirer les « Nexus », et proposer à Cyril de renommer les noms qui se ressemblent.
- [ ] Assombrir Gardebois et Canopéa dans le cadre de la charte `docs/univers/ton.md`.

* **Fini quand** un comptage automatique des tics donne moins de 5 % des répliques.

### 6. Économie et progression

- [ ] Ajouter un don tous les 3 niveaux, et des traits avec une contrepartie à la création.
- [ ] Ajouter des dépenses qui reviennent : réparation de l'équipement, pots-de-vin, cristaux qui s'usent.
- [ ] Réduire les gains quand on redescend dans les mêmes voies.
- [ ] Donner quelque chose aux paliers de réputation au-delà de 25.

* **Fini quand** les Fers gardent de la valeur jusqu'à la fin du chapitre 4 en jouant tout le contenu annexe.

## Ce qu'on gèle, et les règles pour les agents

On n'ajoute aucun nouveau système tant que les chantiers 0 à 6 ne sont pas finis. Le plan de `docs/gdd/jeu-complet.md` vise 5 à 8 fois le contenu actuel : il faut le resserrer.

| Élément du plan | Décision proposée |
| --- | --- |
| Jeux d'auberge, course de planeurs, plongée, carillons | Gelés jusqu'au chapitre 6 |
| Le foyer (Maison de Mémoire), la nouvelle partie+ | Gelés jusqu'à la finale |
| Le calendrier vivant | Réduit à la Fête du Souvenir |
| Les 21 légendaires | Fondus dans les Échos, sur le mode « trouver, étudier, apaiser » |
| Les contrats | Fondus dans les voies endormies |
| Les 21 pouvoirs | Ramenés à 2 pouvoirs pour chacun des 7 cristaux |
| Les compagnons | 4 au plus, mais vraiment présents |
| Les 10 chapitres | Envisager 7 chapitres (à trancher par Cyril) |

**Règles pour Claude Code et Codex :**

- Un chantier à la fois, une étape par commit, `main` toujours jouable ; `npm run typecheck`, `npm test` et `npm run build` au vert après chaque modification.
- Tout lore nouveau (l'Écho du héros, le Réveilleur, des noms) est une proposition « à valider » dans `docs/univers/`. On ne contredit jamais le Notion « ANAMNESIS ».
- Pour les changements d'équilibrage, joindre une simulation chiffrée, comme celles de ce document.
- À la fin de chaque chantier, mettre à jour `docs/JOURNAL.md` et demander à Cyril de jouer une partie sur PC.
- L'essai sur téléphone reste une vérification secondaire : le jeu doit s'y lancer et se jouer, sans plus.
