# Dialogues

Moteur : `src/rules/dialogue.ts` ; écran : `DialogueScene`. Textes à relire : `docs/DIALOGUES.md`.

- **Données** : un fichier JSON par PNJ dans `src/data/dialogues/`, référencé dans `src/data/dialogues/index.ts`.
  - Chaque fichier contient des *entrées* : la première dont les conditions sont vraies choisit le nœud de départ ;
    la dernière n'a pas de condition.
  - Il contient aussi des *nœuds* : un texte de 300 caractères au maximum, 4 options au maximum, et toujours au moins
    une option sans condition.
- **Conditions** (`requires`, toutes nécessaires) :
  - **tests** `attribute` / `skill` avec un `min` (valeur de l'attribut, rang de la compétence) : l'option reste
    **visible et grisée**, précédée de « [Perception 4] » et suivie de « — Il te faut Perception 4. » ;
  - **état de l'histoire** `flag`, `notFlag`, `quest` (`none` / `active` / `done`), `recit` (`docs/gdd/memoire.md`) :
    l'option est **masquée** tant que la condition est fausse.
- **Effets** (sur un nœud à l'affichage, ou sur une option choisie) : `setFlag`, `startQuest`, `completeQuest`,
  `giveXp`, `giveFers`, `learnRecit` (`docs/gdd/memoire.md`), `openTrade` (`docs/gdd/inventaire.md` : ouvre le Troc
  avec ce PNJ au lieu de refermer le dialogue).
  Les messages (« Nouvelle quête : … », « +25 points d'expérience », « Récit retenu : … ») s'affichent en haut du panneau.
- **Jets de dé** (`roll` sur une option) : une action risquée (se cacher, saboter, crocheter) se joue au d20,
  selon `docs/gdd/competences.md` (d20 + mod. d'attribut + rang ≥ difficulté). L'option affiche sa chance de réussite
  (« [Discrétion 75 %] ») ; après le choix, le résultat du dé s'écrit au-dessus du texte suivant
  (« Jet de Discrétion : 11 + 4 = 15 contre 10, réussi »). `next` mène à la suite en cas de réussite, `failNext`
  en cas d'échec (obligatoire). Les conséquences sont portées par les effets des nœuds d'arrivée.
- **Nuit** (`night` sur un nœud) : le fond derrière le panneau s'assombrit en bleu nuit, le temps de la scène.
- **Contrôles automatiques** (tests) : nœuds et quêtes connus, chaque jet a sa suite d'échec, aucune impasse, aucun nœud inaccessible, longueurs
  respectées, et chaque PNJ de la carte a son dialogue.
- **Relecture** : `npm run dialogues` régénère `docs/DIALOGUES.md`, une version lisible pour relire les textes.
- **Écran** : panneau en bas de l'écran ; la carte est en pause et rien ne passe au travers.
- **Expérience** : elle s'accumule (`character.xp`) ; la montée de niveau est décrite dans `docs/gdd/progression.md`.
