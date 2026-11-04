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
  - **argent** `fers` (un repas à l'auberge) : comme un test, l'option reste visible et grisée (« [5 Fers] ») ;
  - **état de l'histoire** `flag`, `notFlag`, `quest` (`none` / `active` / `done`), `recit` (`docs/gdd/memoire.md`),
    `item` (+ `count` : on porte cet objet), `moment` et `tousLes` (`docs/gdd/temps.md`), `cristal` (un cristal est
    porté au cou, `docs/gdd/magie.md`), `marques` (+ `max` : les marques du cristal, `docs/gdd/passe-sombre.md`) :
    l'option est **masquée** tant que la condition est fausse.
  - **pouvoir** : une option qui a l'effet `lancer` affiche son coût (« [Lueur · 1 PR] ») et reste grisée sans le bon
    cristal au cou (« Il te faut porter un cristal de Vie. »).
- **Effets** (sur un nœud à l'affichage, ou sur une option choisie) : `setFlag`, `startQuest`, `completeQuest`,
  `giveXp`, `giveFers` (négatif pour payer), `giveItem` (+ `count`), `takeItem` (+ `count` : un objet de quête remis), `heal` (PV rendus), `learnRecit`
  (`docs/gdd/memoire.md`), `openTrade` (`docs/gdd/inventaire.md` : ouvre le Troc avec ce PNJ au lieu de refermer le
  dialogue), `startCombat` (referme le dialogue et lance sur la carte un combat de `src/data/encounters.json`),
  `goTo` (+ `arrivee` facultative : referme le dialogue et mène à un autre lieu, par exemple derrière une porte qu'on
  vient de crocheter), `attendre`, `avancer`, `dormir` (`docs/gdd/temps.md`), `lancer` (un pouvoir du cristal porté :
  PR dépensés, ou PV si l'on force) et `apprendre` (un rang de compétence) (`docs/gdd/magie.md`) ; `effacerMarques` (un Druide Vert reprend les marques
  du cristal, et un rang de Résonance avec elles, `docs/gdd/passe-sombre.md`).
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

## Étude du 3 novembre, vague 3 : les écrans à une seule réponse (D2)

Mesure (2026-11-04, 758 nœuds) : 51 % ont une seule réponse, mais **308 sont des fins de conversation** (la dernière
réplique, puis « Au revoir », « Partir »…) et la plupart des autres ramènent aux sujets (« Merci pour la nouvelle »).
Les écrans **sans choix au milieu d'une conversation** ne sont que 80 (11 %), et une seule suite en compte plus de
deux : l'audience de Kael Marchevent (quatre écrans), l'exemple de l'étude. Corrigée : après le récit de la Gare,
le héros demande qui payait, ou exige qu'on ferme la frontière (Kael approuve, Lyra calme « tous les deux ») ; puis
il demande ce mal qui fait oublier, ou promet des preuves (Thalorin l'envoie d'abord au Bosquet). La plus longue
suite sans choix fait maintenant deux écrans. Le reste n'est pas un défaut : on ne force pas un choix à chaque
« Merci ».
