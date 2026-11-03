# Les voies endormies et les contrats (jalon 3, étape 6 ; construite le 2026-11-02, validée et mise en ligne par Cyril le 2026-11-02)

Plan : `docs/gdd/jalon-3.md` ; idée validée dans `docs/gdd/jeu-complet.md` (activités 4 et 5). Code :
`src/rules/voies.ts`, `src/rules/contrats.ts`, écran `src/scenes/ContratsScene.ts` ; données : `src/data/voies.json`,
`src/data/contrats.json`, les sites dans `src/data/world.json` ; plans : `scripts/build-maps.mjs` (`voie-*`). Lore
proposé : `docs/univers/lieux/voies-endormies.md`. Sauvegarde v15 (`docs/gdd/sauvegarde.md`).

Cyril (2026-11-02) : « Oui pour tout, mets en ligne » : noms, Échos, mur de la Bielle (en attendant le relais
d'Ironheart), chiffres validés ; l'escorte reste pour plus tard.

## Les voies endormies à explorer

- **Trois sites** sur la carte du monde, marqués d'une bouche noire et de deux rails, sans route tracée :
  la **halte des Fougères** (danger 1, connue dès le début), le **tunnel de la Combe** (danger 2, après « Le Dernier
  Train »), le **Dépôt Sept** (danger 3, après « La Clé de Rouille Bleue »). On y va à pied ; on y « descend ».
- **Trois niveaux** par voie ; le troisième est **le terminus**. Une descente (un trou dans le sol) mène au niveau
  suivant et prend un moment de la journée. On remonte à la surface par l'entrée, à tout moment.
- **Une réserve de plans** : le quai, le tunnel, le dépôt, le poste d'aiguillage. Chaque niveau en tire un (jamais le
  même deux fois de suite), puis le **garnit au hasard** : c'est la graine de la visite. **Chaque visite tire une
  autre voie** : rejouable à l'infini. Une sauvegarde reprend le même niveau, tel quel.
- **Le danger** d'un niveau = danger du site + profondeur − 1 (de 1 à 5) : il choisit les bêtes et le butin.

| Ce qu'on y trouve | Combien | Détail |
|---|---|---|
| **Bêtes** | 1 ou 2 groupes au niveau 1, 2 ou 3 plus bas | elles attaquent quand on passe à deux cases ; on les combat sur place ; XP : la moitié de leur valeur |
| **Caisses** | 1 ou 2, plus le **coffre du chef de gare** au terminus | elles luisent ; Fers (4 + 4 × danger à 10 + 6 × danger) et souvent un objet ; parfois un cadenas : Artisanat (9 + danger), ou forcer (−3 PV) ; au terminus : double, et parfois un cristal |
| **Pièges** cachés | de 0 à 4, plus nombreux en profondeur | sur un passage : Investigation (9 + danger) pour les voir à temps (+5 XP), sinon 2 + 2 × danger PV ; avec la lampe, voir plus bas |
| **Un Écho** | un niveau sur deux | un moment ordinaire de l'Ancien Monde (six scènes) : 10 XP |

| Danger | Bêtes (une au hasard) |
|---|---|
| 1 | 2 Loups de Rouille · 3 Guêpes-Rouille · 2 Rôdeurs-Épine |
| 2 | 2 Geckos-Soudeurs · 3 Loups de Rouille · un pilleur et un arbalétrier des Marches · une Griffe-Sylve |
| 3 | 2 pilleurs et une rebouteuse · un Gecko et 2 Guêpes · 2 Échos furieux · une Griffe-Sylve et un Loup |
| 4 | arbalétrier, pilleur et rebouteuse · 3 Échos furieux · 2 Griffes-Sylves |
| 5 | un Golem de Ferraille et un Gecko · 2 arbalétriers, un pilleur et une rebouteuse |

## La lampe (demande de Cyril, 2026-11-03 ; validé : « Oui mets en ligne »)

La **lampe à cristal** (15 Fers chez Tobias, Ragna, la colporteuse et la marchande des nations ; parfois dans une
caisse) sert enfin sous terre. Règles : `carriesLamp`, `lightTraps` dans `src/rules/voies.ts`.

- **Sans lampe**, une voie endormie est sombre (le moment du jour n'y compte plus) ; en arrivant : « Il fait sombre :
  une lampe à cristal te montrerait les pièges. »
- **Avec la lampe dans le sac** (rien à équiper), la voie est éclairée, et **les pièges se voient à deux pas** tout
  autour du héros : marqués d'un losange rouge, ils le restent jusqu'au niveau suivant. Le chemin les contourne quand
  il le peut ; marcher dessus quand même, c'est les enjamber, sans jet, sans dégâts (et sans les 5 XP du jet).

## Les contrats des Gardiens

- **Un tableau dans chaque relais** : le relais de Gardebois (chez Ilyane), le relais de Canopéa (chez Mirelle), et,
  faute de relais à Ironheart, **le mur de la Bielle**, où Dorna laisse les Gardiens épingler leurs demandes.
- **Trois offres**, renouvelées **tous les trois jours** : un pli, une recherche, une chasse (quand c'est possible).
  **Un contrat à la fois** ; on peut l'abandonner. Le contrat en cours s'affiche en tête du journal (onglet Quêtes),
  avec ce qu'il reste à faire.

| Contrat | Ce qu'il demande | Où il se paie | Récompense |
|---|---|---|---|
| **Le pli** | porter un pli scellé à un autre relais (une ville connue) | au relais d'arrivée | 10 Fers + 1 par 15 de distance (≈ 28 à 45), 15 XP |
| **La recherche** | rapporter un objet de l'Ancien Monde (lanterne de chef de gare, plaque émaillée, registre de quai) d'un niveau précis d'une voie : il y attend, luisant, dans les gravats | au tableau d'origine | 20 + 15 × niveau + 5 × danger Fers, 15 + 10 × niveau XP |
| **La chasse** | chasser les bêtes qui nichent au premier niveau d'une voie (elles s'ajoutent aux autres) | au tableau d'origine | 25 + 10 × danger Fers, 25 XP |

Le compte des contrats remplis est gardé : il servira aux rangs des Gardiens (étape 7).

## Outils de dev

Onglet « Lieux » : descendre dans chaque voie, au niveau voulu ; révéler les trois voies sur la carte.

## Plus tard

- L'escorte d'une caravane (le quatrième contrat du plan) ; des contrats d'un continent à l'autre.
- Des voies endormies dans chaque nouveau pays, et la grande voie de chaque chapitre.
- Une vraie image de tableau d'annonces (le panneau sert de repère provisoire).

## La voie pacifiste (chantier 3, 2026-11-03)

Un groupe qui va voir le héros (à deux cases) ouvre une rencontre au lieu d'un combat (`groupDialogue`,
`src/rules/voies.ts`) : **passer dans son ombre** (Discrétion, 9 + le danger du niveau ; réussi, le groupe ne l'arrête
plus de tout le niveau, demi-XP), **attaquer**, ou **reculer**. Repéré : **fuir en courant** (Athlétisme, même
difficulté) ou se battre. Face à des Échos furieux, **leur raconter un Récit** les apaise (XP entière, le Récit est
gardé). Les bêtes et les bandes gagnent en force avec l'histoire (`strengthen`, `docs/gdd/combat.md`, « Chantier 3 »).
Un personnage pacifiste peut finir les voies : la descente n'est jamais gardée ; seuls les contrats de chasse demandent
de se battre.
