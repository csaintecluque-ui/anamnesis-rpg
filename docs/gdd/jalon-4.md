# Jalon 4 : l'histoire principale continue (ouvert par Cyril le 2026-11-03)

Cyril (2026-11-03) : « L'histoire principale doit continuer. Va pour le chapitre 4, puis j'attaque l'essai. » Sept-Portes
était confié à Codex ; rien n'étant arrivé sur le dépôt, Claude le reprend. Bilan du jalon 3 : `docs/gdd/jalon-3.md`.

| Étape | Contenu | État |
|---|---|---|
| 1. Chapitre 4, Sept-Portes | « Les Mémoires du Monde Perdu » : la ville de Kael, sans combat possible ; le Registre des Mains ; la page du dernier départ | en ligne et validé (2026-11-03) ; page Notion complétée |
| 2. L'essai de Cyril | ses remarques ; elles ont donné la feuille de route du 2026-11-03 (`feuille-de-route.md`) | fait |
| 3. Chapitre 5, Aetherhaven | la suite, dans l'ordre validé des villes | après les sept chantiers de la feuille de route (`feuille-de-route.md`) |

## Chapitre 4 : « Les Mémoires du Monde Perdu » (construit et validé le 2026-11-03)

Lore et propositions : `docs/univers/lieux/sept-portes.md`. **Aucun combat possible** (l'Anneau) : tout se joue par
la parole, la ruse ou la discrétion ; et ce qu'on y risque n'est pas un coup, c'est le **raccompagnement**.

1. **L'appel** : une fois « La Clé de Rouille Bleue » finie (n'importe quelle fin), Ilyane a reçu une lettre de Hesper
   Mille-Récits, doyenne des Gardiens à Sept-Portes : « Tout ce qui passe par Sept-Portes laisse une main au
   Registre. » La **Porte du sud** apparaît sur la carte du monde, à l'est de la forêt.
2. **Sept-Portes** : on arrive par la Porte du sud, sur la place des Sept Portes. Hesper explique le Registre des
   Mains et envoie au guichet de la Grande Bibliothèque.
3. **Le Registre des Mains** (Ambroise Encrelune, le Conservateur) : la page du dernier départ, la ligne grattée du
   carnet, recopiée et vendue l'an dernier, dort au **Fonds Muet** : on la garde, on ne la cite pas. Une consultation a
   été demandée il y a trois jours, au nom d'**Edda Varn**, et refusée sans motif.
4. **Entrer au Fonds Muet**, trois façons :
   - **la parole** : convaincre Ambroise (Diplomatie 3, Érudition 3, ou le Récit de Kael) ;
   - **la ruse** : inscrire une demande de consultation au registre sous une main qui n'est pas la tienne (Subterfuge,
     13) : c'est falsifier une provenance, le seul crime qui compte ici ;
   - **la discrétion** : la nuit, passer le portier (Discrétion, 14 ; 10 avec la rumeur de la veillée).
   Raté : le **raccompagnement** (deux agents, une voiture, le cent unième kilomètre, deux jours pour revenir) ; ce
   chemin-là se ferme.
5. **La page** : « Dernier départ, voie sept. Terminus : Altavent, sous les Hauts de Zephyria. Déchargé : sept caisses
   plombées. Reçu : personne. » Récit de l'histoire principale « La page du dernier départ ».
6. **Edda Varn**, la dame en gris de l'Auberge des Sept Routes, veut acheter ce qu'on a lu. Trois fins :
   - **lui vendre la ligne** (200 Fers) : ceux qui la paient auront un temps d'avance ;
   - **la dénoncer** au Conservateur : sa main est fausse (Investigation 13 au registre des consultations, ou la rumeur de
     la veillée) ; elle est raccompagnée ; si l'on a soi-même falsifié le registre, Ambroise le voit aussi : on l'est avec
     elle (« Si ce n'est pas moi, la méthode est dehors », canon) ;
   - **se taire** et partir le premier ; elle suivra.
7. **Fin** chez Hesper : la piste mène à Zephyria (chapitre 5). Réputation à Sept-Portes.

## Autour du chapitre

- Les trois quartiers, sept intérieurs, onze habitants nommés, des passants de toutes les nations (dont deux Éprouveurs
  qui tentent de se frapper) ; l'Écho des Trois Cents ; la veillée des Sept Routes et ses deux rumeurs ; un tableau de
  contrats à la maison mère ; la marchande des nations ; les six autres Portes, fermées sans sauf-conduit.
- À la première arrivée dans l'Anneau, un message : « Ici, aucune main ne se lèvera sur personne. » Aucune bête, aucun
  piège, aucun combat dans les dix lieux de la ville (vérifié par les tests).
- Le jour, Ambroise est au guichet ; la nuit, le portier de nuit fait sa ronde. Un raté (ruse ou nuit) : la voiture,
  deux jours de marche pour revenir, ce chemin-là fermé, −10 de réputation à Sept-Portes. La parole reste toujours
  ouverte (Diplomatie ou Érudition 3, que l'on peut gagner en montant de niveau, ou le Récit de Kael, chez Mirelle).

## Chiffres (validés le 2026-11-03)

| Quoi | Valeur |
|---|---|
| Jets | Subterfuge 13 (ruse), Discrétion 14 ou 10 avec la rumeur (nuit), Investigation 13 (la main d'Edda) |
| Expérience | la page 50 ; dénoncer Edda 30 ; fin chez Hesper 80 (60 si la ligne est vendue) |
| Fers | la ligne vendue 200 |
| Réputation à Sept-Portes | quête finie +15 ; Edda raccompagnée +10 ; être raccompagné −10 ; veillées +3 chacune |
| Compagnons | vendre la ligne : Liane −2, Boulon −1 ; Hesper, à la fin vendue : Liane −1 |

## Vérifications (2026-11-03)

- 612 tests : le chapitre joué en entier dans le parcours complet (parole, dénonciation) et dans une variante (nuit,
  ligne vendue) ; un fichier dédié (`src/rules/septPortes.test.ts`) pour les trois entrées, les raccompagnements, les
  trois fins, l'accès à chaque habitant et l'absence de combat.
- Corrigé grâce aux tests : un nœud de dialogue nommé « fin » (le mot qui clôt une conversation) terminait la quête au
  premier mot de Hesper ; le contrôle des dialogues refuse désormais ce nom. Vu sur les captures : la Porte du sud
  était cachée par l'enceinte, le héros par les maisons du bord est ; la Porte est passée dans l'enceinte, entre deux
  réverbères, et les arrivées ont reculé de trois pas.
- Pas faits (plan des villes) : les deux ambassades, la Réserve interdite, la Fête du Souvenir.
