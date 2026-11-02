# La magie (demande de Cyril, 2026-11-02 ; proposition validée le 2026-11-02 : « Oui pour tout »)

Code : `src/rules/magic.ts` ; données : `src/data/powers.json`, cristaux dans `src/data/items.json` ; canon relu :
`docs/univers/magie.md`. Ce qui reste « à valider » est signalé en fin de page.

## Le principe (validé)

- **La magie passe par un cristal porté au cou, pas par le héros.** Le héros reste un Gardien de Mémoire sans pouvoir
  propre. Canon [NOTION] : la magie vient des cristaux de Résonance, et « tout humain peut théoriquement » s'en servir.
- **Une nouvelle compétence, la Résonance**, plutôt qu'un nouvel attribut : la création du personnage ne change pas.
  Elle s'apprend en route : on ne peut pas y mettre de rang à la création (douze compétences, comme avant), mais à
  chaque niveau, et le druide Vanel en enseigne un.
- **Le coût** (canon : fatigue, nez qui saigne) : chaque pouvoir coûte des **Points de Résonance (PR)**. S'il en manque,
  on peut forcer : chaque point manquant coûte **3 PV** (« Ton nez saigne »). Pas de mutation ni de folie, pour le
  public de 8 à 15 ans. On ne peut jamais forcer jusqu'à son dernier PV.
- **La récupération** (canon : « 8 à 12 h de sommeil ») : une nuit à l'auberge rend tous les PR, comme les PV.

## Les chiffres

| Élément | Valeur |
|---|---|
| Points de Résonance | 3 + rang de Résonance (un héros neuf en a 3) |
| Attribut de la Résonance | Vigueur (proposition : la magie fatigue le corps ; c'est l'attribut sans compétence) |
| Forcer le cristal | 3 PV par point manquant, jamais le dernier PV |
| Cristal de Vie / de forge | 250 Fers (canon : « Cristal émeraude (petit) : ⓕ 500 ») ; se revend 125 |

| Pouvoir | Cristal | Coût | Effet |
|---|---|---|---|
| **Guérison naturelle** (nom du JDR) | de Vie (vert, Verdantis) | 2 PR, 3 PA en combat | rend 5 PV + 2 par rang ; dans l'inventaire (« Soigner »), en combat, et dans les dialogues (soigner quelqu'un) |
| **Flammes forgées** (nom du JDR) | de forge (rouge veiné de noir, Ferros) | 2 PR, 3 PA | en combat : d20 + Vigueur + rang de Résonance contre la Défense, 2d6 (+ Vigueur) dégâts, jusqu'à 5 cases |
| **Lueur** | tous | 1 PR | hors combat : le cristal s'allume de sa couleur et montre ce que l'ombre cache |

## Où la magie sert

- **Combat** : un bouton en haut à droite, sous le nom du pouvoir (« Flammes forgées · 2 PR »), avec les PR restants ;
  au clavier, la touche qui suit les armes (3 avec une seule arme en main). Les Flammes visent comme une arme (portée, chance de toucher, « · 2 PR » sur la cible) ;
  la Guérison soigne tout de suite. Les PV rendus en combat restent après le combat.
- **Inventaire** : « Porter » met un cristal au cou (un seul à la fois), « Retirer » l'enlève ; le cristal de Vie
  porté a un bouton « Soigner (2 PR) ». La ligne du haut donne les PR (« Résonance 3 / 3 PR »).
- **En-tête** : « PR 3 / 3 » à côté des PV, dès qu'un cristal est porté.
- **Dialogues** : une option qui lance un pouvoir affiche son coût (« [Lueur · 1 PR] ») ; sans le bon cristal au cou,
  elle reste grisée (« Il te faut porter un cristal de Vie. »). La Lueur est toujours une **autre façon** de réussir,
  jamais la seule :
  - le renfoncement sans enseigne d'Ironheart (au lieu de l'indice ou d'Investigation 2) ;
  - l'enclume aux mains gravées, sous la forge (« Les Échos sous la Forge ») ;
  - le trou de fouille du Sol des Racines (l'étiquette du Marché des Cendres) ;
  - le grenier des semences de Canopéa (« Les graines qui manquent » : le sceau de cire).
- **Ironheart tient des listes** (canon, *Chroniques Familiales*) : avec un cristal au cou, le patrouilleur du
  funiculaire inscrit le héros dans son carnet noir, et Dorna conseille de le cacher sous sa chemise. Les pyromanciens
  y sont « semi-sacrés » et les technomanciens « surveillés étroitement » [NOTION, Ferros].

## Trouver un cristal

- **« Un prêt de la Terre »** (quête courte, Canopéa) : au Bosquet des Échos, le druide Vanel prête un cristal de Vie
  (« La magie est un prêt de la Terre », canon) et envoie le héros soigner Tiven, un jeune Nacellier aux mains brûlées
  par les cordes, à la Grande Nacelle. De retour : 40 XP, un rang de Résonance, et Vanel laisse le cristal (« ce n'est
  pas un don, c'est un prêt : tu le rendras en soignant »). Il parle aussi de la Lueur et de Ferros. Tiven : 15 XP ;
  un bandage le soulage aussi (5 XP), sans terminer la quête. Le cristal prêté ne se vend pas.
- **Sévane** (Comptoir de la Sève, Canopéa) vend des cristaux de Vie et renvoie vers Vanel : les Druides Verts
  « prêtent et enseignent pour rien » (canon : ils doivent enseigner gratuitement).
- **La tailleuse de cristaux** (Marché des Cendres, Ironheart) vend des cristaux de forge : « Là-haut, qui en achète,
  on l'inscrit : Ferros tient des listes. Ici, rien ne s'écrit. »
- **Mode développeur** : le perso surpuissant porte le cristal de forge et a le cristal de Vie dans son sac ; boutons
  « PR au max » et « PR à 0 ».

## Format des données

- Objet cristal : `"slot": "cristal"`, `"pouvoir": "guerison" | "flammes"` (la Lueur vient avec tout cristal).
- Dialogues : effet `{ "lancer": "lueur" }` (dépense les PR, ou des PV si l'on force ; le reste des effets de
  l'option dit ce que fait le pouvoir) ; effet `{ "apprendre": "resonance" }` (un rang) ; condition
  `{ "cristal": true }` (un cristal est porté, condition d'histoire, masquée).
- Sauvegarde v11 : `character.resonance` (PR restants), `skills.resonance`, `equipment.cristal`.

## À valider par Cyril (propositions inventées pour le jeu)

- Les noms et personnages : **Vanel Lentefeuille** (Druide Vert), **Tiven** (jeune Nacellier), **la tailleuse de
  cristaux** (Marché des Cendres) ; le titre « Un prêt de la Terre » (tiré du canon).
- La Vigueur comme attribut de la Résonance ; les chiffres ci-dessus.
- Le cristal porté « au cou » ; la Lueur commune à tous les cristaux.

## Plus tard

- D'autres cristaux (Vent, Eau, Sable, Glace, Feu : un par nation, canon) avec les villes qui viendront.
- Les potions (canon : la méditation et les potions aident à récupérer) ; les Surgeons, qui ne sont pas de la magie.
