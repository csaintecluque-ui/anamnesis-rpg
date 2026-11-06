# Combat (adaptation du JDR)

Règles : `src/rules/combat.ts` ; écran : `src/scenes/CombatScene.ts` ; données : `src/data/weapons.json`, `src/data/enemies.json`.

- **Déroulement** : tour par tour sur grille iso, dans l'ordre d'initiative. Se déplacer coûte 1 PA par case ; attaquer, 2 PA (dague, mains nues) ou 3 PA (les autres armes) depuis le chantier 3.
- **Toucher** : d20 + mod. (Corps en mêlée, Agilité à distance) + rang ≥ Défense de la cible. [JDR]
- **Dégâts** : selon l'arme, avec les valeurs du JDR (dague 1d4 + Corps, épée longue 1d8 + Corps, arc 1d8 + Agilité),
  plus le bonus propre de l'arme depuis le test du 2026-11-06 (épée longue +2, épée trempée +3, marteau +4, arc +1,
  arbalète +2 ; section en fin de fichier).
  - Armes de la tranche : lames, arcs, arbalètes.
  - La poudre reste rare et réglementée [E9]. Les armes du JDR comme le fusil d'assaut sont écartées (zone floue n° 18, `docs/univers/zones-floues.md`).
- **Visée par zone** : tête −2, bras −2, jambes −1 (avant le chantier 3 : −4, −2, −2), avec des effets propres (étourdi, désarmé, ralenti), qui demandent désormais un jet de résistance ; viser coûte 1 PA de plus (pas à la dague).
- **Couverture** : +2 ou +4 en Défense.
- **Fuite** : on peut fuir en atteignant le bord de la zone.
- **Magie** (`docs/gdd/magie.md`) : avec un cristal au cou, un bouton en haut à droite lance son pouvoir : Flammes
  forgées (une attaque à 5 cases, 3 PA et 2 PR) ou Guérison naturelle (3 PA et 2 PR, PV rendus aussitôt). Les PV
  rendus en combat restent après le combat.
- **Ton** : à l'origine, public de 8 à 15 ans [E1] ; depuis le 2026-11-02, dark fantasy pour adultes
  (`docs/univers/ton.md`) : ce qui suit sera revu au jalon 3 (`docs/gdd/jalon-3.md`).
  - Les ennemis sont **mis hors de combat** : les créatures fuient, les golems s'éteignent, les humains se rendent.
  - Pas de gore. Le combat est toujours évitable dans la quête principale.

## Précisions d'implémentation (premier combat : Golem de Ferraille, 2 Rôdeurs-Épine)

- **Armes (validé par Cyril le 2026-11-01 : Dague de départ, Mains nues 1d3, Golem plus dur sans achat)** : le héros se bat avec les **armes qu'il tient en main**
  (`character.equipment`, main droite puis main gauche ; `heldWeapons` dans `combat.ts`). Chaque arme en main
  devient un bouton du combat, à son nom (« Dague », « Épée longue », « Arc »), avec les raccourcis 2 et 3.
  - Sans arme en main : **Mains nues**, 1d3 + Corps, en mêlée (profil de `src/data/weapons.json`, qui n'est pas
    un objet : on ne peut ni l'acheter ni le vendre).
  - Kit de départ : une **Dague** (1d4) en main droite (`docs/gdd/inventaire.md`).
  - Équilibrage : avant, tout héros avait gratuitement l'Épée longue et l'Arc ; avec la seule Dague, le combat
    contre le Golem est plus dur. Il faut acheter une meilleure arme chez Tobias (Épée 35 Fers, Arc 30) : possible
    avec les 15 Fers de départ et la bourse de la caisse (25), à condition de ne pas avoir payé le laissez-passer.
    Le combat reste une voie parmi quatre.
- **Zone** : un coup à la tête, aux bras ou aux jambes qui ne met pas hors de combat applique son effet
  (étourdi, désarmé, ralenti) jusqu'au **prochain tour de la cible** ; un coup au corps n'a pas d'effet.
- **Arène (validé le 2026-11-01)** : le combat se déroule **sur la carte explorée**, dans un rectangle de
  11 × 9 cases autour de l'ennemi touché (`carveArena`, `src/engine/arena.ts`), avec son sol et ses obstacles
  (arbres, caisses, wagon, tente…), qui bloquent le passage. Le héros commence là où il se tenait ; le Golem sur sa
  case ; les deux Rôdeurs-Épine surgissent des fourrés, sur les cases du bord les plus éloignées du héros. Sur PC,
  l'arène est affichée × 1,25.
- **Couverture (validé le 2026-11-01)** : chaque obstacle a une valeur de couverture (propriété de tuile `couverture`,
  `scripts/tiles-def.mjs`) : **+2** pour les caisses, rochers, étals et la tente ; **+4** pour les arbres, le wagon,
  la foreuse, le tronc d'Arbre-Titan et les maisons. Une cible est à couvert si la case voisine, du côté de
  l'attaquant, porte un obstacle : sa Défense augmente d'autant (`coverBetween`). Pas de couverture au corps à corps.
  Le journal l'annonce (« à couvert, +2 en Défense »). Pour l'instant, seul le héros tire : la couverture protège
  donc les ennemis.
- **Fuite (validé le 2026-11-01)** : il faut **atteindre le bord de la zone de combat** (n'importe quelle case du pourtour),
  puis toucher « Fuir ». Ailleurs, le jeu le rappelle. Fuir referme le combat.
- **Blessures (passe de qualité, 2026-11-02)** : les PV perdus le restent après une victoire ou une fuite (1 PV au
  moins) ; on se soigne avec les objets, la soupe ou un lit (Mirelle, Dorna). Avant, le héros repartait toujours
  intact.
- **Défaite du héros** : non létale, comme pour les ennemis. Le héros est ramené à 1 PV à l'entrée de la ville du
  lieu (Gardebois, par Ilyane ; Canopéa ; Ironheart) ; sur la route, à Gardebois, par des voyageurs
  (`docs/gdd/carte-du-monde.md`).
- **Aucun combat imposé** : après un jet raté qui mène à l'affrontement (Garrik démasqué, pilleurs qui surprennent le
  héros), on peut toujours reculer.
- **Effets de zone** : ils durent tout le tour suivant de la cible (un ennemi désarmé n'attaque pas), puis s'effacent.
- **Victoire** : mêmes effets que les résolutions par la parole (`chantier-arrete`, quête terminée, 70 XP),
  pour que les trois résolutions restent équilibrées.
- **Équilibrage (passe de qualité, 2026-11-02, par simulation de 20 000 combats)** : le Golem passe de 44 PV, Déf 14,
  +3, 2d6 à **30 PV, Déf 12, +2, 1d8** ; les Rôdeurs-Épine de 7 à **5 PA** (une attaque par tour). Avant : le combat du
  Golem était gagné 0 à 1 % des fois au niveau 1 ; après : environ 40 % avec l'épée au niveau 1, plus de 80 % au
  niveau 2 avec Mêlée 3 (il reste un combat de fin de chapitre, évitable par la parole ou le sabotage).
- **IA ennemie** : depuis le chantier 3, `src/rules/combatAi.ts` (voir plus bas) ; avant : se rapprocher, attaquer, jusqu'à épuisement des PA.
- **Armure** : son bonus de Défense compte en combat (`makeHeroCombatant`).

## Lisibilité (jalon 2, demandé par Cyril le 2026-11-01 : « à la FF Tactics »)

Le combat était « fouillis » : on ne savait ni où l'on était, ni ce qu'on faisait, ni jusqu'où aller. Désormais
(`CombatScene`, `drawBoard`) :

- **Grille** sur chaque case libre de l'arène, et contour cuivre de l'arène (son bord sert à fuir).
- **Case de celui qui joue** en cuivre ; l'ordre du tour reste à gauche.
- **Déplacement** : les cases atteignables ce tour-ci (1 PA par case, `reachable` dans `src/engine/pathfinding.ts`)
  en bleu ; au survol, le chemin en pointillés et son coût (« 4 PA »). On ne peut cliquer que sur une case bleue.
- **Attaque** : les ennemis à portée en rouge vif, les autres en rouge pâle ; au survol, la **chance de toucher**
  (`hitChance`, même calcul que le jet), le coût en PA et la couverture.
- **Ligne d'aide** sous le bandeau (« Choisis une case bleue… », « Choisis un ennemi en rouge vif… »).
- **Mouvement pas à pas** : le héros marche (planche de son avatar), les ennemis glissent case par case, chaque
  coup est montré (« −5 », « Raté ») avant le suivant ; pendant ce temps, on ne peut pas agir.
- **Arbres transparents** : un obstacle devant un combattant ou la case survolée devient translucide.

## Le combat pour adultes et à plusieurs (jalon 3, étape 1, 2026-11-02)

Ton : `docs/univers/ton.md`. Code : `src/rules/combat.ts`, `companions.ts`, `bestiary.ts` ; écran : `CombatScene`.

- **La mort est réelle** : les bêtes meurent ou s'enfuient, les humains se rendent souvent (ils parlent), les Échos se
  dispersent. **Le héros vaincu meurt** : écran « Ici s'arrête le voyage d'Aube », puis « Reprendre à la dernière
  sauvegarde » ou « Retour au titre ». Le jeu **sauvegarde tout seul à chaque lieu** (emplacement automatique), pour
  ne jamais perdre beaucoup. Avertissement à l'écran titre : « Jeu pour adultes (18 ans et plus) ».
- **Effets** : la **brûlure** (1d4 par tour, deux tours ; les Flammes forgées brûlent toujours) et le **saignement**
  (1d2 par tour, trois tours) frappent au début du tour de la victime et peuvent l'achever ; le **ralenti** et
  l'**étourdi** viennent aussi de certains coups (Guêpes-Rouille), en plus des zones visées.
- **Ennemis variés** : des **tireurs** (Arbalétrier des Marches, 5 cases ; Gecko-Soudeur, 3 cases, qui brûle) qui
  s'arrêtent dès qu'ils ont la cible à portée ; des **soigneurs** (Rebouteuse des Marches : elle soigne un allié
  tombé sous 60 % de ses PV) ; des **essaims** (Guêpes-Rouille, faibles mais rapides) ; des bêtes qui font saigner
  (Rôdeur-Épine, Loup de Rouille, Griffe-Sylve). Les ennemis visent le héros ou le compagnon le plus proche.
- **Boss à phases** : sous la moitié de ses PV, le Golem de Ferraille « s'emballe » (+2 au toucher, +2 PA).
- **Butin** : chaque ennemi vaincu peut laisser des Fers et des matières (épines, crocs, fourrure, cœur de
  ferraille…), qui serviront à l'artisanat (étape 7) et se vendent déjà.
- **Bestiaire** : un onglet du journal ; chaque créature rencontrée y a sa page (PV, Défense, manière de se battre,
  description du canon « Faune & flore par continent » quand elle existe, source) et le nombre de vaincus.
- **Compagnons** : jusqu'à deux, joués à leur tour par le joueur (déplacer, attaquer ; Liane soigne un allié avec le
  bouton « Soigner · 3 PA » en haut à droite). Ils commencent à côté du héros. Un compagnon qui tombe se relève après
  le combat avec 1 PV ; si le héros tombe, c'est la mort, même si les compagnons tiennent encore. Une nuit à l'auberge
  les soigne. Liane (24 PV, fronde, soin) et Boulon (40 PV, poings de fer) : on les recrutera à l'étape 2 ; d'ici là,
  les outils de dev les ajoutent (onglet « Groupe »).
- **Nouvelles rencontres** (carte du monde) : Griffe-Sylve (forêt), Guêpes-Rouille, Geckos-Soudeurs (lisière,
  ruines), trois déserteurs des Marches qui font « péage » (Subterfuge 13 pour passer). À l'aiguillage du triage, l'un
  des deux pilleurs est désormais un arbalétrier.

## Munitions (demande de Cyril, 2026-11-03 ; validé : « Oui mets en ligne »)

« Ce serait bien qu'il y ait un système de flèches ou carreaux. » Règles : `src/rules/combat.ts` (`ammoLeft`,
`settleAmmo`) ; données : `munition` dans `src/data/weapons.json`.

- L'**Arc** tire des **flèches**, l'**Arbalète de Ferros** des **carreaux** : un par tir, touché ou raté. Le bouton
  d'attaque montre ce qui reste (« Arc · 7 »). Sans munitions, l'arme ne tire plus : « Plus de flèches : change d'arme
  dans ta main, ou bats-toi à mains nues. »
- **Après un combat gagné**, on ramasse la moitié de ce qu'on a tiré (arrondi en dessous) ; après une fuite, rien.
- **Prix** : 2 Fers pièce, 0,05 kg. Flèches chez Tobias, Ragna et la marchande des nations ; carreaux chez Ragna et la
  marchande des nations ; dix carreaux à la forge de Ragna (deux dards de Guêpe-Rouille et 5 Fers, recette inchangée).
- **Butin** : un arbalétrier des Marches laisse 3 carreaux (une fois sur deux) ; une caisse des voies endormies en
  donne 8, flèches ou carreaux.
- **Sauvegardes** : version 16 ; qui possède déjà un arc ou une arbalète reçoit 20 flèches ou carreaux (`docs/gdd/sauvegarde.md`).
  Le « Perso surpuissant » des outils de dev en a 99 de chaque.

## Chantier 3 : le combat refait (feuille de route de Cyril, 2026-11-03)

Règles : `src/rules/combat.ts` ; IA : `src/rules/combatAi.ts` ; simulation : `src/rules/combatSim.ts` ; tests :
`src/rules/combatChantier3.test.ts`. Le diagnostic : viser les bras gagnait toujours (45 % contre 20 % au corps),
l'Agilité donnait jusqu'à 9 PA, les ennemis n'avaient qu'une attaque et visaient le plus proche, la difficulté ne
suivait pas l'histoire, et les voies endormies n'étaient que des combats.

- **Les PA** : 7, un de plus avec Agilité 5 ou 6, un de moins sous 3 (6 à 8 ; avant : 4 à 9). Sept PA, c'est deux
  coups d'épée et un pas, ou un coup visé et un coup au corps.
- **Le coût d'un coup dépend de l'arme** : 2 PA à la dague, à la dague dentelée et à mains nues ; 3 PA pour les autres.
- **Viser coûte 1 PA de plus** (4 PA à l'épée), sauf à la dague, lame légère qui trouve seule le défaut.
- **Le jet de résistance** : une fois le coup porté, l'effet de la zone ne prend que si la cible rate son jet,
  d20 + sa résistance contre 8 + les dégâts du coup (un coup lourd désarme plus sûrement). Le survol d'un ennemi
  l'annonce (« effet 55 % »). Résistance : la Vigueur pour le héros ; de 0 (guêpes, tireurs) à 6 (le Golem) pour les
  ennemis. **Après avoir subi un effet, on y échappe jusqu'à la fin de son tour suivant** : pas d'étourdissement à
  chaque tour.
- **Deux capacités par ennemi** (le bestiaire et le survol les nomment) :

| Ennemi | Capacités |
|---|---|
| Golem de Ferraille | Emballement (sous la moitié de ses PV) · Charge (+1d4 au premier coup après deux cases) |
| Rôdeur-Épine | Saignement · Épines (qui le frappe au corps à corps perd 1 PV) |
| Ours-Mousse | Charge · Fuite (sous le tiers de ses PV, il regagne les fourrés) |
| Loup de Rouille | Saignement · Meute (+2 au toucher quand un allié est déjà au contact de la cible) |
| Fouilleur | Charge · Fuite |
| Pilleur des Marches | Meute · Fuite (il se rend) |
| Écho furieux | Engourdissement (ralentit) · Épines (le froid de l'Écho) |
| Griffe-Sylve | Saignement · Charge |
| Guêpe-Rouille | Engourdissement · Meute |
| Gecko-Soudeur | Brûlure · Tir (cherche le couvert) |
| Arbalétrier des Marches | Tir · Visée (+2 au toucher s'il n'a pas bougé) |
| Rebouteuse des Marches | Soins · Fuite |

- **L'IA** : sous le tiers de ses PV, un ennemi qui a Fuite court vers le bord et quitte le combat (sans butin) ; une
  soigneuse soigne un allié sous 60 % (75 % depuis le test du 2026-11-06) ; sinon l'ennemi **achève les blessés** (de ceux qu'il peut frapper, le plus
  faible), marche pour frapper ce tour-ci si possible, et un tireur choisit une case à portée **à couvert** de sa cible.
- **La force suit l'histoire** : les bêtes et les bandes de la route et des voies endormies gagnent 40 % de PV par
  chapitre après le premier, puis, à partir du chapitre 3, +1 au toucher par chapitre et +1 en Défense. Le chapitre est
  1 + les quêtes principales finies (« Le Dernier Train », « L'audience », « La clé de rouille bleue », « Les Mémoires
  du Monde Perdu »). Les combats de l'histoire gardent la force de leur chapitre. Le Golem passe de 30 à 26 PV.
- **La voie pacifiste des voies endormies** : un groupe qui va voir le héros n'attaque plus d'emblée. On peut **passer
  dans son ombre** (Discrétion, 9 + le danger du niveau : il ne vous arrête plus de tout le niveau ; demi-XP) ; repéré,
  **fuir en courant** (Athlétisme, même difficulté) ou se battre ; face à des **Échos furieux**, **leur raconter un
  Récit** les apaise et les disperse (XP entière, le Récit est gardé). La descente n'est jamais gardée par un combat :
  un personnage pacifiste peut finir les voies, leurs quêtes d'adhésion et les contrats de recherche et de pli ; seuls
  les contrats de chasse demandent de se battre.

### La simulation (« aucune tactique ne dépasse les autres de plus de 15 points »)

Même règles et même IA que l'écran de combat, sur une arène nue de 11 × 9 avec quatre obstacles ; le héros joue une
tactique fixe (viser toujours la même zone, le corps quand la cible subit déjà son effet). Victoires sur 500 combats :

| Héros (attributs à 3, Corps 4, armure de cuir) | Corps | Tête | Bras | Jambes | Écart |
|---|---|---|---|---|---|
| Niv. 1, épée, Mêlée 2 · Golem + 2 Rôdeurs | 28 | 29 | 29 | 24 | 5 |
| Niv. 2, épée, Mêlée 3 · Golem + 2 Rôdeurs | 55 | 57 | 57 | 53 | 4 |
| Niv. 2, dague, Mêlée 3 · Golem + 2 Rôdeurs | 49 | 60 | 60 | 46 | 14 |
| Niv. 1, dague, Mêlée 2 · 2 Rôdeurs | 95 | 97 | 97 | 94 | 3 |
| Niv. 2, épée, Mêlée 3 · 2 Loups | 91 | 91 | 91 | 93 | 2 |
| Niv. 3, épée, Mêlée 4 · pilleur, arbalétrier, rebouteuse | 76 | 65 | 68 | 63 | 13 |
| Niv. 3, dague, Mêlée 4 · pilleur, arbalétrier, rebouteuse | 77 | 69 | 77 | 75 | 8 |
| Niv. 3, épée, Mêlée 4 · 3 Guêpes + Griffe-Sylve | 67 | 61 | 61 | 64 | 6 |
| Niv. 2, arc, Tir 3, Agilité 4 · 2 Rôdeurs | 99 | 100 | 100 | 100 | 1 |

Avant le chantier : 20 % au corps, 45 % aux bras contre le Golem et deux Rôdeurs. Le test
`combatChantier3.test.ts` rejoue trois de ces cas à chaque fois (200 combats par tactique).

La force selon le chapitre (300 combats, au corps) : un héros **moyen** a le niveau du chapitre, Mêlée = niveau + 1,
l'épée (trempée dès le chapitre 3) et l'armure de cuir (cloutée dès le 3) ; l'**optimisé**, Corps 6, Agilité 4,
Vigueur 4, Mêlée = niveau + 2.

| Groupe | Ch. 1 moyen / optimisé | Ch. 2 | Ch. 3 | Ch. 4 |
|---|---|---|---|---|
| 2 Rôdeurs | 96 / 100 | 97 / 100 | 98 / 100 | 98 / 100 |
| 2 Loups | 80 / 99 | 71 / 98 | 79 / 99 | 80 / 99 |
| 3 Guêpes | 89 / 100 | 91 / 100 | 95 / 100 | 95 / 100 |
| Pilleur, arbalétrier, rebouteuse | 37 / 81 | 20 / 74 | 25 / 79 | 20 / 76 |
| 3 Loups | 24 / 72 | 15 / 73 | 15 / 74 | 13 / 70 |
| 3 Échos furieux | 13 / 58 | 5 / 46 | 7 / 49 | 2 / 38 |
| Golem + Gecko | 61 / 90 | 55 / 91 | 60 / 96 | 57 / 94 |

Avant, la difficulté baissait de chapitre en chapitre ; elle reste désormais à peu près la même pour un héros du
niveau attendu. Les groupes dangereux (bandes des Marches, trois Loups, trois Échos) le restent : on les évite, on les
contourne, ou on y vient avec des compagnons (non simulés), et les Échos s'apaisent d'un Récit.

## Étude du 3 novembre : un héros de parole qui se défend (E1, E2, E3, E12)

L'étude complète (`docs/gdd/etude-2026-11-03.md`) a montré que le combat ne mesurait qu'un guerrier : un héros de
parole (Présence 6, Diplomatie 3, Mêlée 3, dague) perdait plus d'une fois sur deux contre les deux Rôdeurs de la caisse.
Chaque point d'attribut comptait trois fois (toucher, dégâts, PV) ; un rang de compétence, une seule.

- **E1** : +2 au toucher pour toutes les armes du héros (`HERO_HIT_BONUS`, `src/rules/combat.ts`). Pas pour les
  pouvoirs du cristal ni pour les compagnons, qui ont leurs propres chiffres.
- **E2** : les dégâts d'une arme = dé + modificateur d'attribut + **rang ÷ 2** (arrondi bas, `rankDamage`) : Mêlée 3,
  +1 ; Mêlée 5, +2. La fiche de l'arme le dit (« +1 par deux rangs de Mêlée »).
- **E12** (décision de Cyril) : les compagnons jouent seuls, avec l'IA des ennemis (`combatAi.ts`) : Liane soigne un
  allié sous 60 % de ses PV, sinon tire sur le plus faible à portée ; Boulon frappe. Plus d'attente de « leur » tour.
  Rythme de l'IA : 300 ms avant son tour, 400 ms entre deux actions (550 avant).
- **B6** : les combattants se dessinent au-dessus des arbres et des murs de l'arène (`TOKEN_DEPTH`) ; les arbres devant
  eux s'estompent toujours. Avant, au combat de la caisse, un Rôdeur sous la canopée ne se voyait qu'à sa barre de vie.
  La barre d'actions ne propose plus « Soigner » pour Liane (elle soigne seule) ; la touche 4 reste le pouvoir du cristal.
- **E11 Le Golem reste attaquable** (décision de Cyril, vague 2) : le chantier arrêté autrement (la parole, la foreuse
  sabotée ou explosée), le Golem ne bouge plus mais se laisse frapper, après un avertissement
  (`golem-gare.json` : « Touchez-y, et je ne réponds plus de rien ») ; Liane désapprouve (−1) ; même combat (le Golem
  et deux Rôdeurs), 50 XP et le cœur de ferraille, sans Fers ni fin de quête ; Ingrid le reproche ensuite
  (`apres-golem-trahie`). Vaincu, il gît pour de bon.
- **C5 Le premier combat** (vague 2) : un Rôdeur-Épine barre le sentier de la Gare Engloutie (`rodeur-sentier`,
  propriété `embuscade` : il attaque qui arrive par l'entrée ; après une fuite, il attend sur le sentier et le toucher
  relance le combat) ; rencontre `embuscade-gare`, 15 XP, et au premier tour du héros une ligne d'aide (`intro` :
  cases bleues, touche 2, Espace, les épines). Avant, on pouvait finir le chapitre 1 sans voir l'écran de combat.
- **C3** : à la fin de la création, sans rang de Mêlée ni de Tir, un avertissement honnête (`combatWarning`).
- **F3** (+PV par niveau) et **E4** (renfort par chapitre plafonné) : non appliqués. F3 n'apporte que 1 à 3 points
  (simulation ci-dessous) ; E4 change l'équilibre des chapitres 3 et 4 (guerrier niveau 3 contre les pilleurs :
  34 % → 73 %) et attend la vague 2.

Simulation, 300 combats au corps, `combatSim.ts`, graine fixe. Parleur : Présence 6, Mêlée 3, dague, sans armure.
Guerrier : Corps 5, Vigueur 5, Mêlée 3, épée longue, cuir. Liane et Boulon jouent par l'IA.

| Cas | Avant | E1 seul | E1 + E2 (en ligne) |
|---|---|---|---|
| Parleur niv. 1 · 2 Rôdeurs (la caisse) | 32 | 42 | 81 |
| Parleur niv. 2 · 2 Rôdeurs | 45 | 58 | 91 |
| Parleur niv. 2 · 2 Loups, ch. 1 | 30 | 45 | 76 |
| Parleur niv. 2 · 2 Loups, ch. 2 | 7 | 10 | 40 |
| Parleur niv. 2 · 3 Loups, ch. 2 | 0 | 0 | 3 |
| Parleur niv. 2 · Golem + 2 Rôdeurs | 0 | 2 | 11 |
| Parleur niv. 3 · pilleur, arbalétrier, rebouteuse, ch. 3 | 0 | 0 | 0 |
| Guerrier niv. 2 · Golem + 2 Rôdeurs | 64 | 79 | 89 |
| Guerrier niv. 2 · 3 Loups, ch. 2 | 20 | 36 | 54 |
| Guerrier niv. 3 · pilleur, arbalétrier, rebouteuse, ch. 3 | 11 | 16 | 29 |

Avec les compagnons (avant : Liane ne faisait que tirer dans la simulation ; après : elle soigne, par l'IA) :

| Cas | Avant | Après |
|---|---|---|
| Parleur niv. 2 + Liane · 2 Rôdeurs | 95 | 100 |
| Parleur niv. 3 + Liane · 2 Loups, ch. 2 | 72 | 96 |
| Parleur niv. 2 + Liane · Golem + 2 Rôdeurs | 25 | 88 |
| Parleur niv. 3 + Liane + Boulon · 3 Loups, ch. 2 | 53 | 83 |

Lecture : le parleur se défend seul contre ce qui garde une caisse ; contre une meute ou un boss, il lui faut Liane, la
fuite, le détour ou la parole. Liane qui soigne pèse lourd (le Golem passe de 25 à 88 %) : c'est ce qu'un joueur
attentif faisait déjà à la main. La limiter à un soin par tour n'y change presque rien (86 %) : si c'est trop facile
dans la partie de Cyril, le levier est ce qu'elle rend (2d4) ou le seuil où elle soigne (60 % des PV). Le garde-fou
(`combatChantier3.test.ts`, « a hero of words ») vérifie à chaque test : parleur niv. 2 seul contre 2 Rôdeurs ≥ 60 %,
niv. 3 avec Liane contre 2 Loups du ch. 2 ≥ 60 %, et toujours < 30 % seul contre le Golem. L'écart entre tactiques
reste sous 15 points.

## Étude du 3 novembre : E4 et F3 simulés (**recommandation appliquée** le 2026-11-04, accord de Cyril)

Les deux derniers réglages de la vague 2. **E4** (l'étude) : les bêtes de la route prennent +25 % de PV par chapitre
au lieu de +40 %, et leur bonus au toucher ne commence qu'au chapitre 4. **F3** : +1 PV par niveau pour le héros (5 +
modificateur de Vigueur au lieu de 4). Simulation : 300 combats au corps par case, `combatSim.ts`, chapitres 1 / 2 / 3
/ 4. Héros **moyen** : niveau du chapitre, Corps 4, Vigueur 4, Mêlée = niveau + 1, épée (trempée dès le ch. 3), cuir
(clouté dès le 3). **Optimisé** : Corps 6, Agilité 4, Vigueur 4, Mêlée = niveau + 2. **Parleur** : Présence 6, Mêlée 3
toujours, dague, avec Liane.

| Groupe (héros moyen) | Aujourd'hui | E4 | F3 (+1 PV/niv.) | E4 + F3 |
|---|---|---|---|---|
| 2 Loups | 84 / 80 / 87 / 86 | 84 / 87 / 96 / 95 | 84 / 82 / 89 / 89 | 84 / 88 / 97 / 96 |
| 3 Loups | 36 / 20 / 28 / 20 | 36 / 33 / 67 / 52 | 36 / 21 / 31 / 25 | 36 / 35 / 71 / 57 |
| Pilleur, arbalétrier, rebouteuse | 41 / 31 / 42 / 32 | 41 / 42 / 73 / 63 | 41 / 33 / 47 / 38 | 41 / 44 / 77 / 69 |
| 3 Échos furieux | 22 / 8 / 16 / 6 | 22 / 14 / 44 / 29 | 22 / 9 / 19 / 8 | 22 / 15 / 47 / 33 |
| Golem + Gecko | 62 / 57 / 66 / 62 | 62 / 63 / 89 / 83 | 62 / 59 / 69 / 70 | 62 / 65 / 90 / 87 |

| Groupe (héros optimisé) | Aujourd'hui | E4 | F3 | E4 + F3 |
|---|---|---|---|---|
| 3 Loups | 81 / 86 / 82 / 69 | 81 / 89 / 96 / 90 | 81 / 86 / 85 / 74 | 81 / 89 / 97 / 93 |
| Pilleur, arbalétrier, rebouteuse | 81 / 85 / 85 / 73 | 81 / 87 / 94 / 92 | 81 / 86 / 88 / 79 | 81 / 89 / 95 / 95 |
| 3 Échos furieux | 64 / 58 / 55 / 39 | 64 / 67 / 83 / 65 | 64 / 59 / 59 / 44 | 64 / 70 / 85 / 70 |

Le parleur avec Liane (Mêlée 3 toute la partie) : 2 Loups 96 / 95 / 81 / 68 aujourd'hui, 96 / 96 / 95 / 88 avec E4 ;
3 Loups 74 / 49 / 13 / 3 aujourd'hui, 74 / 62 / 49 / 17 avec E4. F3 ne change presque rien pour lui (+0 à +5).

Lecture :

- **E4 rend les chapitres 3 et 4 plus faciles que le chapitre 1** (3 Loups : 36 au ch. 1, 67 au ch. 3) : les groupes
  dangereux cessent de l'être, à l'inverse de « un jeu tendu ». Claude ne le recommande pas tel quel.
- **F3 seul** ajoute 1 à 8 points, surtout au chapitre 4 : modeste, mais c'est une montée de niveau qui se voit.
- **Le vrai défaut d'aujourd'hui est la chute du chapitre 4** (+2 au toucher des bêtes) : l'optimisé passe de 82 à
  69 contre 3 Loups, de 55 à 39 contre les Échos. Une variante l'efface sans toucher au reste : **plafonner le bonus
  au toucher des bêtes à +1** (les PV +40 % restent).

| Chapitres 3 / 4 | Aujourd'hui | Plafond +1 | Plafond +1 et F3 |
|---|---|---|---|
| Moyen · 3 Loups | 28 / 20 | 28 / 24 | 31 / 30 |
| Moyen · pilleur, arbalétrier, rebouteuse | 42 / 32 | 42 / 34 | 47 / 44 |
| Moyen · 3 Échos furieux | 16 / 6 | 16 / 8 | 19 / 11 |
| Moyen · Golem + Gecko | 66 / 62 | 66 / 67 | 69 / 73 |
| Optimisé · 3 Loups | 82 / 69 | 82 / 75 | 85 / 79 |
| Optimisé · 3 Échos furieux | 55 / 39 | 55 / 45 | 59 / 49 |

**Appliqué (accord de Cyril)** : `MENACE_HIT_MAX = 1` (`combat.ts`) et `HP_PER_LEVEL = 5` (`derived.ts`). **Recommandation de Claude : plafond +1 et F3 (+1 PV par niveau)** : le chapitre 4 redevient aussi tendu que le 3, pas
plus facile ; les groupes dangereux le restent ; le héros sent un peu plus chaque niveau. Le parleur, lui, reste fait
pour éviter les meutes : avec Liane, la parole, la fuite ou la Discrétion.

## Test du 6 novembre : l'équilibre revu (décision de Cyril, 2026-11-06)

Le testeur : « la dague à 2 PA écrase tout, une arme achetée est une perte » ; « un guerrier gagne 98-100 % dès le
niveau 3, un parleur en perd 90-100 % ». Revérifié d'abord par la simulation du projet (`combatSim.ts`, 150 combats par
case, guerrier Corps 6 + Maître d'Armes, parleur Présence 6 à la dague, archer Agilité 6 + Tireur d'Élite) : c'était
vrai. Appliqué :

- **un bonus de dégâts par arme** (`bonus`, `weapons.json`) : épée longue +2, épée trempée +3, marteau de forge +4, arc
  +1, arbalète +2. La fiche d'un objet le dit (« 1d8 + 2 de dégâts, 3 PA le coup »). Garde-fou : à tout bonus de héros
  de 0 à 6, l'épée longue frappe autant par tour que la dague (à 1 près), la trempée et le marteau davantage
  (`combat20261106.test.ts`) ;
- **les bêtes de la route, de la nuit et des voies suivent aussi le niveau du héros** : la menace est le chapitre, ou
  le niveau − 1 s'il est plus haut (`roadMenace`). Le bonus au toucher reste plafonné à +1 (accord du 2026-11-04 : à +2,
  la simulation donnait moins de 1 point d'écart de victoires, et 3 points de PV en moins) ;
- **Tireur d'Élite : +2 cases de portée** au lieu du double (12 cases à l'arc : toute l'arène) ;
- **une issue sans combat à chaque rencontre hostile** : sur la carte du monde, « Parlementer » (Diplomatie, les
  pilleurs) ou « Les leurrer » (Subterfuge, les bêtes), à la difficulté du détour ; dans les voies, « Les attirer
  ailleurs » (Subterfuge) à côté de la Discrétion, sauf devant les Échos furieux, qu'on apaise d'un Récit ;
- **Liane soigne sous 75 % des PV** d'un allié (60 % avant).

Ce que la simulation donne (victoires, avant → après) :

| Cas | Avant | Après |
|---|---|---|
| Guerrier, chapitre 6 (deux Abyssaux), niveaux 2 / 3 : dague | 86 / 97 % | 86 / 97 % |
| … épée longue | 57 / 82 % | 82 / 94 % |
| … épée trempée | 72 / 89 % | 91 / 97 % |
| … marteau de forge | 72 / 89 % | 93 / 97 % |
| Archer à l'arbalète, chapitre 6, niveau 2 | 80 % | 90 % |
| Parleur + Liane, chapitre 5, niveaux 1 / 2 / 3 | 31 / 46 / 48 % | 42 / 49 / 57 % |
| Guerrier à l'épée, chapitre 2, niveau 6 : PV restants après la victoire | 81 % | 56 % |
| Parleur + Liane, chapitre 2, niveau 6 | 79 % | 1 % : il passe par la parole |

Un guerrier à son niveau gagne toujours presque tout : la tension vient désormais de ce qu'il perd (PV restants 54 à
73 % aux chapitres 3 à 6), puisque le repos dehors ne rend plus que la moitié des PV (`temps.md`).

