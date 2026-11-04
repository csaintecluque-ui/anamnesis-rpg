# Mécanique signature : la mémoire (3 pistes ancrées dans le canon)

Les trois pistes reposent sur des lois et des phénomènes du monde, pas sur la magie. Canon correspondant : `docs/univers/memoire.md`.

## Piste A — Les Échos du Passé (lire les lieux)

- **Principe** : certains lieux rejouent un moment du passé [E2]. Le héros les perçoit selon son attribut Mémoire.
  - Un Écho **silencieux** ou **complet** se regarde : il révèle un indice, un passage, un mot de passe.
  - Un Écho **interactif** (rare) se traverse : on y fait un choix.
  - Un Écho **maudit** retient celui qui s'attarde : c'est l'« addiction à revivre le passé » du canon [E2].
- **Pour** : c'est du canon pur, cela offre des solutions d'enquête et une mise en scène forte.
- **Contre** : seul, cela reste surtout un outil d'information.

## Piste B — Le Carnet de Récits (transmettre)

- **Principe** : en Gardien de Mémoire, le héros recueille des **Récits** auprès des Échos, des PNJ et des livres. En dialogue, il peut **raconter** un Récit pour convaincre, apaiser ou instruire.
  - Exemple : raconter « Le savant Corvan » [E2] à une ingénieure qui force une faille.
  - Il ne retient qu'un nombre limité de Récits (Mémoire + 1).
  - Le Champignon-Mémoire [E8] peut lui en faire oublier un.
- **Pour** : cela incarne le thème central (« la transmission des histoires comme source de pouvoir ») [E1] et donne une voie pacifique à chaque quête.
- **Contre** : il faut écrire beaucoup de Récits.

## Piste C — Se souvenir ou laisser oublier (choix)

- **Principe** : aux moments clés, le héros choisit de préserver et transmettre un souvenir, ou de le laisser s'effacer.
  - Exemple : apaiser un Écho le dissipe, mais seulement temporairement [E2].
  - Ces choix pèsent sur la réputation (Gardiens de Mémoire, Réveilleurs, habitants) et sur la fin.
  - C'est la question centrale de l'univers : « Mémoire contre Oubli » [E1].
- **Pour** : des conséquences durables, avec une vraie portée morale.
- **Contre** : c'est surtout une couche narrative ; cela demande de suivre beaucoup d'états de jeu.

**Recommandation : A et B ensemble.** Les Échos fournissent les Récits, et raconter les Récits ouvre les solutions. La piste C devient le fil moral de la quête principale.

## Précisions d'implémentation (La Gare Engloutie)

- **Récits retenus** : `character.recits`, une liste d'identifiants. Le plafond (Mémoire + 1, dons compris, plus un par
  rang chez les Gardiens) est calculé par `recitCap`. Code : `src/rules/recits.ts`, `src/rules/oubli.ts`.
- **L'oubli choisi** (feuille de route, chantier 1, 2026-11-03) : au-delà du plafond, plus rien ne s'oublie tout seul.
  De retour sur la carte, l'écran « Ta mémoire est pleine » (`OubliScene`) fait choisir l'histoire à laisser partir ;
  chaque Récit y dit à quoi il sert : ses thèmes, les veillées qu'il ravit, divise ou fâche, et les gens chez qui il
  ouvre une réponse. On ne peut pas reculer. Les Récits de l'histoire principale ne s'oublient jamais.
- **Le Champignon-Mémoire** [E8] devient un oubli volontaire : 20 Fers chez Sévane, parfois dans une voie endormie ;
  dans l'inventaire, « Manger » : on choisit le Récit à oublier, et **l'emprise des Échos retombe à zéro**
  (`docs/gdd/echos.md`). On peut remettre à plus tard. Le vieux champignon de Liane reste celui de sa quête.
- **Raconter un Récit** en dialogue : une condition `{ recit: id }`, masquée tant qu'on ne le connaît pas (comme un repère d'histoire).
- **Obtenir un Récit** : l'effet `{ learnRecit: id }`, posé sur un nœud d'Écho (voir `docs/univers/lieux/gare-engloutie.md`).
- **Récits de l'histoire principale** (décision de Cyril, 2026-11-02) : marqués `principal` dans `src/data/recits.json`
  (le savant Corvan, le Triumvirat Vert, le carnet du dernier train) ; jamais oubliés, hors du plafond.

## Raconter le soir : les veillées (2026-11-02)

La piste B a sa scène à elle : le soir, à l'auberge, on raconte un Récit à un public qui a ses goûts (Fers,
renommée, rumeurs qui ouvrent des secrets). Chaque Récit porte ses thèmes (`themes` dans `recits.json`) :
`docs/gdd/veillees.md`.

## Raconter et donner un Récit en dialogue (feuille de route, chantier 1, 2026-11-03)

- **La mécanique** (`raconter` sur une option, `src/rules/dialogue.ts`) : le héros choisit lequel de ses Récits il
  raconte ; l'interlocuteur réagit à ce Récit-là (`recits`), à ce dont il parle (`aime`, les thèmes des veillées), ou
  l'écoute sans plus (`neutre`) ; certains n'acceptent que ce qu'ils aiment (`refus`). L'option n'apparaît que si le
  héros a un Récit à dire.
- **Donner un Récit** (`donne`) : accepté, il est **oublié** ; l'interlocuteur le garde. Les Récits de l'histoire
  principale ne se donnent jamais. C'est le choix de mémoire qui coûte, un par chapitre :
  - **ch. 1**, l'Écho du dernier train : une histoire contre l'entrée (le Récit du savant Corvan sans Mémoire 4) ;
  - **ch. 2**, le vieil arbre du Bosquet muet : il boit l'histoire et montre la piste des racines ;
  - **ch. 3**, la Veilleuse : la clé contre une histoire où passe un train ; les autres, elle les rend ;
  - **ch. 4**, Ambroise : « une main contre une main », un Récit déposé au Registre ouvre le Fonds Muet.
- **Reste à faire** (chantier 1, puis la passe d'écriture du chantier 5) : une option « raconter » dans chaque quête,
  avec des réactions propres au Récit choisi.

## Étude du 3 novembre, vague 3, bloc B : les habitants écoutent (D3, F4)

- **Raconter à un habitant** (le mécanisme `raconter` des dialogues) : une fois par habitant, le héros lui raconte un
  de ses Récits. Une réponse pour un Récit précis (la meilleure : 15 XP, parfois des Fers), une pour ce qu'il aime
  (10 XP), une pour le reste (5 XP). Le Récit n'est pas oublié. À Gardebois : Tobias (rails et machines ; « Un jeudi
  ordinaire » : 20 Fers), Maëlis (familles, chansons ; « Saule »), Nell (chansons ; la berceuse), Brann (machines ;
  « Le savant du dernier quai »), Liane (arbres, familles ; « Les voix du Bosquet », +1 d'avis).
- À Canopéa : Elouan (chansons, arbres ; la berceuse de Maëlis), Aïlis (familles, arbres ; « Saule »), Tiven
  (familles, mystères ; « Odon Passe-Rive »), Malo (mystères, familles ; « L'échelle de Pim »).
- **Un Récit par ville hors quête** (F4) : à Gardebois, « Odon Passe-Rive », par le mystère du pont et Sylvan ; à
  Canopéa, « L'échelle de Pim », par l'échelle aux rubans et le nom gravé au Bosquet (Mémoire 3) ; à Ironheart,
  « Quatre-dix-sept », par le Ferrôme au rebut des Forges-Basses (Artisanat) ; à Sept-Portes, « La dédicace », par
  le lutrin de la Grande Bibliothèque (Investigation) et le portier de nuit.
- À Ironheart : Varka (trains, machines ; « L'échelle de Pim »), Kerta (familles ; « Saule »), Tam (machines,
  familles ; « Le savant du dernier quai »), Joss (trains, mystères ; « Le convoi sans conducteur »).
- À Sept-Portes : Arlo (mystères, Ancien Monde ; « L'échelle de Pim »), Mina (chansons, mystères ; la berceuse :
  deux Fers), Hesper (Ancien Monde, mystères, familles ; « Odon Passe-Rive »), Lior (Ancien Monde, mystères ; « Un
  jeudi ordinaire »). Chaque nouveau Récit plaît à au moins un public de veillée (test).
- **Le plafond reste Mémoire + 1** (l'étude proposait + 2 ; décision de Cyril, 2026-11-04) : avec plus de Récits à
  gagner, c'est le plafond qui rend l'oubli réel.
