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
- **Contenu actuel de l'état** : lieu, position, temps de jeu. Il grandira avec le jeu (personnage, inventaire,
  quêtes, mémoire, Récits). Chaque changement de forme passera par une nouvelle version et sa migration.
