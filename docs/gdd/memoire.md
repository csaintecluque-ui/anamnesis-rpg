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

- **Récits retenus** : `character.recits`, une liste d'identifiants. Le plafond (Mémoire + 1, dons compris) est déjà calculé par `talesRetained`. Au-delà du plafond, le Récit le plus ancien est oublié pour faire place au nouveau — une version simple du Champignon-Mémoire, en attendant qu'il existe vraiment. Code : `src/rules/recits.ts`.
- **Raconter un Récit** en dialogue : une condition `{ recit: id }`, masquée tant qu'on ne le connaît pas (comme un repère d'histoire).
- **Obtenir un Récit** : l'effet `{ learnRecit: id }`, posé sur un nœud d'Écho (voir `docs/univers/lieux/gare-engloutie.md`).
- **Récits de l'histoire principale** (décision de Cyril, 2026-11-02) : marqués `principal` dans `src/data/recits.json`
  (le savant Corvan, le Triumvirat Vert, le carnet du dernier train) ; jamais oubliés, hors du plafond.
