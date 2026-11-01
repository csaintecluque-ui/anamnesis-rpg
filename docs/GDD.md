# Document de conception (GDD)

État : **deuxième jet, validé par Cyril le 2026-11-01**, ancré dans le canon (`docs/Lore/`). Les codes entre crochets renvoient aux sources listées dans `docs/LORE.md` §0. Les chiffres d'équilibrage pourront encore bouger après les tests de jeu.

**Principe** : partout où le canon fournit une règle, notamment le JDR de Cyril [JDR], on la reprend. Quand le jeu vidéo oblige à l'adapter, l'adaptation est signalée par **(adaptation)**.

## 0. Décisions validées (2026-11-01)

- Le héros est un **nouveau personnage**, pas une figure du canon.
- La magie existe, mais **n'est pas liée à la mémoire**.
- Le code est écrit en TypeScript ; le dépôt GitHub `anamnesis-rpg` est public.
- Les 7 attributs, les 12 compétences, la résolution au d20, les dons et l'origine Humain seule sont adoptés.
- La mécanique de mémoire combine les pistes **A et B** ; la piste C sert de fil moral à la quête principale.
- Le combat est non létal (public de 8 à 15 ans).
- La tranche verticale se déroule à Gardebois, avec la quête « Le Dernier Train ».

## 1. Attributs (7)

Ce sont les six attributs du JDR, plus **Mémoire**.

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
  - Pourquoi ne pas reprendre le JDR tel quel ? Il donne 27 points pour 6 attributs, soit 4,5 de moyenne, ce qui ne colle pas avec « 3 = moyenne ». C'est la zone floue n° 21.
- **Pourquoi Mémoire** : c'est le thème central de l'univers (les Gardiens de Mémoire) [E1] et une loi du monde (la Mémoire Vivante) [E2]. Ce n'est pas de la magie.

### Valeurs dérivées (personnage à 3 partout entre parenthèses)

| Valeur | Formule | Source |
|---|---|---|
| Points de vie | 20 + 4 × Vigueur (32) ; par niveau : +4 + mod. Vigueur | JDR, dé de vie fixé (adaptation) |
| Points de Résistance | Vigueur + mod. Présence (3) ; on en dépense 1 pour relancer un jet ; ils reviennent au repos | JDR |
| Défense | 10 + mod. Agilité + armure (10) | JDR |
| Initiative | d20 + mod. Agilité | JDR |
| Points d'action | 6 + mod. Agilité (6) | adaptation : le JDR fonctionne en actions, pas en PA |
| Charge | 30 + 10 × Corps kg (60) | adaptation |
| Récits retenus | Mémoire + 1 (4) | voir §4 |

## 2. Compétences (12)

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

### Résolution d'un test (JDR)

- **Formule** : d20 + modificateur d'attribut + rang ≥ difficulté.
- **Difficultés** : 5 (facile), 10 (moyen), 15 (difficile), 20 (très difficile), 25 (héroïque), 30 (légendaire).
- **Critiques** : un 20 naturel est un succès critique, un 1 naturel un échec critique.
- **Rang (adaptation)** : le JDR calcule le bonus comme « niveau × maîtrise ». Dans le jeu, chaque compétence a un **rang de 0 à 10**, qui progresse avec les points gagnés à chaque niveau, comme dans les CRPG de référence.
  - À la création : 6 points de rang à répartir, 3 au maximum par compétence.
  - À chaque niveau : 3 + mod. Intellect points (minimum 1).
- **Dans les dialogues** : on utilise des **seuils fixes**, sans dé (par exemple Présence ≥ 4, ou Diplomatie rang 3). L'option reste visible et grisée, avec la condition manquante affichée.
- **Pour les actions** (crocheter, se cacher, voler) : on lance le dé, et l'interface affiche la chance de réussite en %.

## 3. Origine et don (création)

- **Origine** : pour la tranche, je recommande **Humain uniquement** (JDR : +1 à deux attributs).
  - Plus tard : Enfant des Surgeons et Chasseur d'Orage, peuples présents dans toutes les nations [E7, GLO].
- **Un don au choix** (les dons du JDR n'ont pas de contrepartie) :

| Don | Effet | Origine |
|---|---|---|
| Dur à Cuire | +2 Vigueur au calcul des PV, +2 PV par niveau | JDR (+2 Vigueur, +1d8 PV/niveau), adapté |
| Tireur d'Élite | portée doublée, +2 dégâts au Tir | JDR |
| Maître d'Armes | +1 au toucher et +1 aux dégâts en Mêlée | JDR |
| Mémoire de Kael | +2 rangs en Érudition, +1 Récit retenu | expression canon [E4] |
| Esprit d'Amira | +2 rangs en Survie, repère les lieux cachés sur la carte | expression canon [E4] |
| Fort comme Gorim | +1 Corps, +10 kg de charge | expression canon [E4] |

### Précisions d'implémentation (2026-11-01)

Ces points n'étaient pas tranchés ; voici ce qui est codé.

- **Bonus et plafond** : les points répartis plafonnent à 5. Le bonus humain (+1) et le don « Fort comme Gorim » s'ajoutent
  ensuite, jusqu'à **6** au maximum (le JDR prévoit le score 6, modificateur +3).
- **Tout dépenser** : on ne peut pas passer à l'étape suivante avec des points d'attribut, un bonus humain ou des rangs
  de compétence non utilisés.
- **Dons de combat** (Tireur d'Élite, Maître d'Armes) : choisis et enregistrés dès maintenant, mais sans effet tant que
  le combat n'existe pas. Même chose pour « repère les lieux cachés » d'Esprit d'Amira, en attendant la carte.
- **Nom** : de 1 à 24 caractères ; les espaces en trop sont retirés.
- **Écran** : assistant en 5 étapes (Nom, Attributs, Compétences, Don, Récapitulatif). Toucher le nom d'un attribut ou
  d'une compétence affiche sa description. Le texte du jeu reste neutre en genre
  (« en apprentissage chez les Gardiens de Mémoire »).

## 4. Mécanique signature : la mémoire (3 pistes ancrées dans le canon)

Les trois pistes reposent sur des lois et des phénomènes du monde, pas sur la magie.

### Piste A — Les Échos du Passé (lire les lieux)

- **Principe** : certains lieux rejouent un moment du passé [E2]. Le héros les perçoit selon son attribut Mémoire.
  - Un Écho **silencieux** ou **complet** se regarde : il révèle un indice, un passage, un mot de passe.
  - Un Écho **interactif** (rare) se traverse : on y fait un choix.
  - Un Écho **maudit** retient celui qui s'attarde : c'est l'« addiction à revivre le passé » du canon [E2].
- **Pour** : c'est du canon pur, cela offre des solutions d'enquête et une mise en scène forte.
- **Contre** : seul, cela reste surtout un outil d'information.

### Piste B — Le Carnet de Récits (transmettre)

- **Principe** : en Gardien de Mémoire, le héros recueille des **Récits** auprès des Échos, des PNJ et des livres. En dialogue, il peut **raconter** un Récit pour convaincre, apaiser ou instruire.
  - Exemple : raconter « Le savant Corvan » [E2] à une ingénieure qui force une faille.
  - Il ne retient qu'un nombre limité de Récits (Mémoire + 1).
  - Le Champignon-Mémoire [E8] peut lui en faire oublier un.
- **Pour** : cela incarne le thème central (« la transmission des histoires comme source de pouvoir ») [E1] et donne une voie pacifique à chaque quête.
- **Contre** : il faut écrire beaucoup de Récits.

### Piste C — Se souvenir ou laisser oublier (choix)

- **Principe** : aux moments clés, le héros choisit de préserver et transmettre un souvenir, ou de le laisser s'effacer.
  - Exemple : apaiser un Écho le dissipe, mais seulement temporairement [E2].
  - Ces choix pèsent sur la réputation (Gardiens de Mémoire, Réveilleurs, habitants) et sur la fin.
  - C'est la question centrale de l'univers : « Mémoire contre Oubli » [E1].
- **Pour** : des conséquences durables, avec une vraie portée morale.
- **Contre** : c'est surtout une couche narrative ; cela demande de suivre beaucoup d'états de jeu.

**Recommandation : A et B ensemble.** Les Échos fournissent les Récits, et raconter les Récits ouvre les solutions. La piste C devient le fil moral de la quête principale.

### Précisions d'implémentation (La Gare Engloutie)

- **Récits retenus** : `character.recits`, une liste d'identifiants. Le plafond (Mémoire + 1, dons compris) est déjà calculé par `talesRetained`. Au-delà du plafond, le Récit le plus ancien est oublié pour faire place au nouveau — une version simple du Champignon-Mémoire, en attendant qu'il existe vraiment.
- **Raconter un Récit** en dialogue : une condition `{ recit: id }`, masquée tant qu'on ne le connaît pas (comme un repère d'histoire).
- **Obtenir un Récit** : l'effet `{ learnRecit: id }`, posé sur un nœud d'Écho (voir `LORE.md` §11, Gare Engloutie).

## 5. Combat (adaptation du JDR)

- **Déroulement** : tour par tour sur grille iso, dans l'ordre d'initiative. Se déplacer coûte 1 PA par case ; attaquer, 3 PA.
- **Toucher** : d20 + mod. (Corps en mêlée, Agilité à distance) + rang ≥ Défense de la cible. [JDR]
- **Dégâts** : selon l'arme, avec les valeurs du JDR (dague 1d4 + Corps, épée longue 1d8 + Corps, arc 1d8 + Agilité).
  - Armes de la tranche : lames, arcs, arbalètes.
  - La poudre reste rare et réglementée [E9]. Les armes du JDR comme le fusil d'assaut sont écartées (zone floue n° 18).
- **Visée par zone** : tête −4, bras −2, jambes −2, avec des effets propres (étourdi, désarmé, ralenti).
- **Couverture** : +2 ou +4 en Défense.
- **Fuite** : on peut fuir en atteignant le bord de la zone.
- **Ton** : public de 8 à 15 ans [E1].
  - Les ennemis sont **mis hors de combat** : les créatures fuient, les golems s'éteignent, les humains se rendent.
  - Pas de gore. Le combat est toujours évitable dans la quête principale.

### Précisions d'implémentation (premier combat : Golem de Ferraille, 2 Rôdeurs-Épine)

- **Armes** : en attendant l'inventaire, le héros se bat avec les deux meilleures armes de sa classe,
  Épée longue (Corps, 1d8) et Arc (Agilité, 1d8), choisies comme deux actions de combat plutôt qu'un équipement.
  La Dague reste dans `src/data/weapons.json` pour plus tard.
- **Zone** : un coup à la tête, aux bras ou aux jambes qui ne met pas hors de combat applique son effet
  (étourdi, désarmé, ralenti) jusqu'au **prochain tour de la cible** ; un coup au corps n'a pas d'effet.
- **Couverture** : le calcul existe (`resolveAttack(… , coverBonus)`), mais rien sur la carte ne la fournit
  encore automatiquement — à faire quand le terrain portera cette information.
- **Arène** : le combat ne se déroule pas sur un fragment de la carte explorée, mais sur une petite arène dédiée
  (9 × 7, iso, même palette), pour rester simple tant que les cartes ne portent pas de zones de couverture ou
  de limites de combat. Visuel provisoire, comme le reste de la phase 1.
- **Fuite** : bouton toujours disponible, qui referme le combat sans conséquence (pas encore liée à une position
  précise sur l'arène).
- **Défaite du héros** : non létale, comme pour les ennemis. Le héros est ramené à 1 PV à l'entrée de Gardebois.
- **Victoire** : mêmes effets que les résolutions par la parole (`chantier-arrete`, quête terminée, 40 XP),
  pour que les trois résolutions restent équilibrées.
- **IA ennemie** : simple — se rapproche si hors de portée, attaque sinon, jusqu'à épuisement des PA.

## 6. Tranche verticale : déroulé (validé)

**Contexte canon** : une des Trois Failles vient de s'ouvrir près de la frontière Ferros–Verdantis [E10]. Selon la loi de la Mémoire Vivante, abîmer un Écho le fait se multiplier et provoque une **maladie mémorielle** [E2].

1. **Création du personnage** : un apprenti Gardien de Mémoire arrive à Gardebois [N1], au **Marché des Lisières**.
2. **Ilyane Voix-d'Écorce**, Gardienne de Mémoire, explique que des habitants revivent la Grande Chute en plein jour.
   - **Test d'attribut** : avec Perception ≥ 4, on remarque qu'Ilyane elle-même en est atteinte.
3. **Tobias Cendrefer**, marchand de Ferros, vend du matériel et des rumeurs.
   - **Test de compétence** : avec Diplomatie rang ≥ 2, on obtient le laissez-passer du chantier au lieu de le payer.
   - Troc et inventaire.
4. **La Gare Engloutie** : l'équipe de l'ingénieure **Ingrid Brisefer** fore sous la gare pour atteindre la faille.
   - Le forage déchire un Écho : la foule du « dernier train » de l'Ancien Monde, celui qui a pu partir.
5. **Résolutions** :
   - **Parole** : convaincre Brisefer (Diplomatie ou Commandement), ou lui raconter le Récit du savant Corvan (piste B).
   - **Combat** : le forage a réveillé un Golem de Ferraille [E2] ; deux Rôdeurs-Épine [E8] rôdent autour. Les vaincre et arrêter la foreuse.
   - **Discrétion** : entrer de nuit (Discrétion) et saboter la foreuse (Artisanat).
   - **Mémoire** : entrer dans l'Écho interactif, recueillir son Récit et l'apaiser (piste A).
6. **Retour à Gardebois** : la maladie recule, ou non. On gagne un niveau.
   - Révélation optionnelle : les Réveilleurs [E10] financent la prospection.

## 7. Sauvegarde

- **Emplacements** : 3 manuels (Emplacement 1 à 3) et 1 sauvegarde automatique, écrite quand on revient au titre.
  Plus tard, elle sera aussi écrite à chaque changement de carte.
- **Stockage** : `localStorage` de l'appareil, en JSON. Le jeu demande au navigateur de ne pas effacer ces données
  (`navigator.storage.persist`). Si le stockage est bloqué (certains modes privés), le jeu fonctionne quand même,
  mais les sauvegardes ne durent que jusqu'à la fermeture, et un message le signale.
- **Format** : `{ game: "anamnesis", version, savedAt, state }`, versionné. Une sauvegarde plus ancienne est mise à jour
  étape par étape ; une sauvegarde plus récente que le jeu est refusée avec un message clair.
  Tout fichier est validé avant d'écraser quoi que ce soit.
- **Export** : sur écran tactile, la feuille de partage (iPhone : « Enregistrer dans Fichiers ») ;
  ailleurs, un téléchargement. Nom du fichier : `anamnesis-emplacement-1-AAAA-MM-JJ-HHMM.json`.
- **Import** : sélecteur de fichiers, dans l'emplacement choisi.
- **Confirmations** : écraser, importer par-dessus ou supprimer une sauvegarde demande un second appui
  (« Confirmer ? », 3 secondes).
- **Version 2 (actuelle)** : l'état contient aussi le personnage. Une sauvegarde v1 (sans personnage) est convertie :
  au chargement, le joueur crée son personnage, puis la partie reprend au même endroit.
- **Contenu actuel de l'état** : personnage, lieu, position, temps de jeu. Il grandira avec le jeu (personnage, inventaire,
  quêtes, mémoire, Récits). Chaque changement de forme passera par une nouvelle version et sa migration.

## 8. Exploration

- **Cartes** : format Tiled (JSON, isométrique, tuiles de 64 × 32) dans `src/data/maps/`.
  - Elles sont générées par `npm run maps` (`scripts/build-maps.mjs`) et restent éditables dans Tiled.
  - Trois calques : `sol`, `obstacles` et `objets`.
  - Objets du calque `objets` : arrivées (`arrivee`), sorties (`sortie`, avec une `cible`), PNJ (`pnj`) et panneaux
    (`panneau`, avec un `texte`).
- **Tuiles** : planche provisoire `public/tiles/placeholder.png`, générée par `npm run tiles`.
  Une propriété `bloquant` sur la tuile rend la case infranchissable.
- **Déplacement** : on touche ou on clique une case, et le personnage trouve son chemin (A*, 8 directions, sans couper
  un coin bloqué). Un nouveau toucher en chemin le redirige.
- **Interactions** : toucher un PNJ ou un panneau (sur toute son image) fait marcher jusqu'à côté de lui, puis déclenche
  l'interaction. Pour l'instant, c'est un message ; les dialogues viendront ensuite.
- **Caméra** : zoom × 1,5, qui suit le personnage. Le HUD (lieu, nom, PV, Titre, Sauvegarder, messages) est une scène
  séparée, donc lisible quel que soit le zoom.
- **Sauvegarde v3** : l'état contient une `entrance` facultative (arrivée nommée). Les sauvegardes du terrain d'essai
  (supprimé) reprennent à l'entrée de Gardebois.

## 9. Dialogues

- **Données** : un fichier JSON par PNJ dans `src/data/dialogues/`, référencé dans `src/data/dialogues/index.ts`.
  - Chaque fichier contient des *entrées* : la première dont les conditions sont vraies choisit le nœud de départ ;
    la dernière n'a pas de condition.
  - Il contient aussi des *nœuds* : un texte de 300 caractères au maximum, 4 options au maximum, et toujours au moins
    une option sans condition.
- **Conditions** (`requires`, toutes nécessaires) :
  - **tests** `attribute` / `skill` avec un `min` (valeur de l'attribut, rang de la compétence) : l'option reste
    **visible et grisée**, précédée de « [Perception 4] » et suivie de « — Il te faut Perception 4. » ;
  - **état de l'histoire** `flag`, `notFlag`, `quest` (`none` / `active` / `done`) : l'option est **masquée** tant que
    la condition est fausse.
- **Effets** (sur un nœud à l'affichage, ou sur une option choisie) : `setFlag`, `startQuest`, `completeQuest`,
  `giveXp`, `learnRecit` (§4), `openTrade` (§10 : ouvre le Troc avec ce PNJ au lieu de refermer le dialogue).
  Les messages (« Nouvelle quête : … », « +25 points d'expérience », « Récit retenu : … ») s'affichent en haut du panneau.
- **Contrôles automatiques** (tests) : nœuds et quêtes connus, aucune impasse, aucun nœud inaccessible, longueurs
  respectées, et chaque PNJ de la carte a son dialogue.
- **Relecture** : `npm run dialogues` régénère `docs/DIALOGUES.md`, une version lisible pour relire les textes.
- **Écran** : panneau en bas de l'écran ; la carte est en pause et rien ne passe au travers.
- **Sauvegarde v4** : l'état contient `flags` (repères d'histoire) et `quests`.
- **Expérience** : elle s'accumule (`character.xp`) ; la montée de niveau est décrite au §11.

## 10. Inventaire et troc (GDD §3)

- **Objets** (`src/data/items.json`) : nom, description, poids (kg), prix (en Fers, la monnaie de Ferros — LORE.md §11),
  et selon le cas un emplacement (`main` ou `armure`), un bonus de Défense (armures) ou des PV soignés (objets de soin).
  Catalogue de départ : Dague, Épée longue, Arc (les mêmes armes que le combat — voir la limite ci-dessous), Armure de
  cuir, Armure de ferraille, Lampe à cristal, Corde, Bandage.
- **Monnaie de départ** : 15 Fers (`STARTING_FERS`), volontairement **moins** que le laissez-passer de Tobias
  (cinquante Fers) : convaincre reste la voie la plus sûre tôt dans la tranche.
- **Gagner des Fers** (premier jet, à valider) : chaque résolution de « Le Dernier Train » rapporte **30 Fers**
  (en plus des 40 XP), et une caisse de prospection abandonnée à la Gare Engloutie contient une bourse de **25 Fers**
  (une seule fois). Une partie complète dispose donc d'environ 70 Fers, de quoi acheter une armure. Nouvel effet de
  dialogue `giveFers`.
- **Poids** : chaque objet porté (équipé ou non) compte dans la Charge (§1). Acheter au-delà de la Charge est refusé.
- **Équipement** : deux mains et une armure (`character.equipment`). Équiper un objet le retire de tout autre
  emplacement qu'il occupait. L'Armure équipée ajoute son bonus à la Défense — **y compris en combat** (`combat.ts`
  lit `armorBonus`). Les armes équipées n'ont pas encore d'effet en combat : voir §5, « Précisions d'implémentation ».
- **Troc** : acheter dépense des Fers ; vendre rapporte la moitié du prix, arrondi à l'entier inférieur. Pour l'instant,
  **chaque marchand vend le même petit catalogue** (`ITEMS` en entier) — pas encore de catalogue propre à Tobias ; à
  valider avec Cyril si des objets doivent rester exclusifs à un lieu ou un PNJ.
- **Écran** : `TradeScene`, ouvert soit depuis le bouton « Inventaire » du HUD (pas d'achat possible, seulement
  consulter/équiper/utiliser/vendre ses propres objets), soit depuis un dialogue dont une option porte l'effet
  `openTrade` (Tobias : « Voir l'étal. »), avec achat en plus.
- **Sauvegarde v6** : l'état du personnage contient `fers`, `inventory` (objets possédés et leur quantité) et
  `equipment` (ce qui est équipé dans chaque emplacement).

## 11. Montée de niveau

- **Seuils d'expérience** (premier jet d'équilibrage, à valider) : `50 × niveau × (niveau − 1)` XP cumulés pour
  atteindre un niveau — niveau 2 à 100 XP, niveau 3 à 300, niveau 4 à 600…
- **À chaque niveau** : `3 + mod. Intellect` points de compétence à répartir (GDD §2), un repos complet
  (les PV reviennent au maximum). Pas de point d'attribut supplémentaire : seules les compétences progressent.
- **Plusieurs niveaux d'un coup** (XP gagnée en une fois qui franchit deux seuils) : traités un par un, chacun avec
  sa propre répartition de points.
- **Écran** : `LevelUpScene`, ouvert depuis un bouton « ✦ Montée de niveau ! » qui apparaît sur le HUD dès que le
  seuil est franchi (pas de montée automatique ou forcée : le joueur choisit son moment). Répartition des points
  comme à la création, sans plafond à 3 : jusqu'à 10 par compétence.

## 12. Menu pause, options et HUD

- **HUD** : bouton « Menu » à gauche, « Inventaire » à droite ; le nom du lieu et la ligne d'état (nom, PV, niveau,
  Fers) occupent tout le centre et se mettent à jour en direct.
- **Menu pause** (`PauseScene`, depuis « Menu ») : Reprendre, Sauvegarder, Options, Retour au titre (avec sauvegarde
  auto). La carte est figée tant qu'il est ouvert.
- **Options** (`OptionsScene`, depuis l'écran titre ou le menu pause) :
  - **Volume** de 0 à 100 %, par pas de 10. Le jeu n'a pas encore de sons : le réglage est enregistré et appliqué
    au moteur audio, il servira dès leur arrivée.
  - **Taille du texte** : Normale ou Grande (× 1,15). S'applique aux dialogues (texte, options, nom du PNJ, messages)
    et aux messages du HUD. En taille Grande, le panneau de dialogue remonte jusque sous la barre du HUD, et chaque
    option prend la hauteur que son texte demande.
- **Enregistrement** : les options sont propres à l'appareil (`localStorage`), pas à la sauvegarde : une sauvegarde
  importée sur un autre appareil garde les options de cet appareil.
