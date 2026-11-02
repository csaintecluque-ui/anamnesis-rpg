# La passe sombre (jalon 3, étape 5) : construite le 2026-11-02, **validée par Cyril** (« Je dis oui pour tout »)

Demande de Cyril (2026-11-02) : « L'étape 4 est en cours, passe à la 5 » (les veillées se font dans une autre
session). Plan validé (`docs/gdd/jalon-3.md`) : réécrire Gardebois, Canopéa et Ironheart dans le ton adulte (morts
possibles, conséquences, castes du Puits Trois, prix de la magie). Charte : `docs/univers/ton.md`. Textes complets :
`docs/DIALOGUES.md`. Canon relu dans le Notion pour l'occasion (fiches Ferros et Verdantis, roman II.3, III.1, III.4,
III.7, IV.6, V.1, « Règles fondamentales du monde », « Les Treize Jours », « La Sève Éternelle ») : ce qui suit marque
[NOTION] ce qui en vient ; le reste est **proposé**, et validé par Cyril le 2026-11-02.

## 1. Le prix de la magie : les marques du cristal

Canon [NOTION, Règles fondamentales ; JDR] : forcer fait saigner du nez ; au-delà du repos, « risque de mutation » ;
les symptômes : « veines lumineuses », addiction (« besoin compulsif de lancer des sorts, syndrome de sevrage si privé
de cristaux »), mutation (« peau cristallisée »), folie arcanique ; les cristaux peuvent « se fissurer ou se briser ».
À Ferros, la magie mal utilisée est « rouille de l'âme » [NOTION, Forge du Dernier Souffle].

| Règle | Valeur |
|---|---|
| Quand | chaque fois qu'on **force** (des PV payés faute de PR), en combat, dans l'inventaire ou un dialogue |
| Le jet | d20 + Vigueur + rang de Résonance, contre **10 + 2 par PR manquant** (12 pour un point, 14 pour deux) |
| Raté | une marque de plus ; avec les trois, le cristal porté **se fend** : il est perdu, ses éclats restent au sac |
| 1. **Les veines** | sous le cristal, les veines s'allument de sa couleur ; cela se voit (réactions des PNJ) |
| 2. **Le manque** | sans cristal au cou, −1 aux jets (les dialogues), comme l'emprise des Échos |
| 3. **La peau de cristal** | une plaque de peau durcie, lisse et froide : −1 Point de Résonance au maximum |
| Le sommeil | rend PV et PR, **pas** les marques |
| Les reprendre | **Vanel** (Druides Verts : ils soignent gratuitement [NOTION]) : toutes, contre **un rang de Résonance** |

- **Qui les voit** : Vanel (au Bosquet), Liane (compagne : « Ne fais pas l'idiot·e »), la tailleuse du Marché des
  Cendres (« J'en ai connu un… à la fin, il ne parlait plus qu'à son cristal »), et le **patrouilleur** du
  funiculaire : « Rouille de l'âme. Ça, c'est un signalement » ; on s'en tire par un bluff (Subterfuge 13), vingt Fers
  glissés dans son gant, ou **une nuit au poste** (« le temps de vérifier », [NOTION, roman II.3]) : fiché·e à l'encre
  rouge (−5 à Ironheart ; le Veilleur de Rouille s'en souvient).
- **Les éclats de cristal** : Vanel les enterre au pied du grand arbre ; la tailleuse les rachète 20 Fers (« je les
  retaille en perles pour les riches »).
- **Écran** : l'option de dialogue qui force l'annonce (« nez qui saigne : −6 PV, risque de marque ») ; la ligne du
  jet s'écrit sous le nez qui saigne ; l'inventaire affiche les marques à côté du titre ; le
  mode développeur a « Marques : Aucune / +1 ».
- **Technique** : `src/rules/marques.ts` ; champ **facultatif** `character.marques` (0 à 3), absent des anciennes
  sauvegardes : **pas de nouvelle version de sauvegarde** (l'étape 4 se fait en parallèle) ; condition de dialogue
  `{ "marques": 1, "max": 2 }`, effet `{ "effacerMarques": true }`.
- **Pas encore** : la folie arcanique et la Dette Tellurique (canon), qu'on garde pour les cristaux des autres nations.

## 2. Les castes du Puits Trois : « Le registre du Puits Trois » (Ironheart)

Canon [NOTION, roman II.3, III.4, III.7, IV.6] : les **Ouvriers** boivent au Puits Trois ; « le Un et le Deux sont
réservés aux castes supérieures, et un Ouvrier qui s'y risque, ça finit mal » ; on change de caste par une
**Innovation** validée par un **inspecteur de zone**, avec un **parrain de Classe Technique** (« vous transférez sous ma
responsabilité ») ; le nom s'affiche au **registre des transferts** du Puits Trois, puis un **convoi** emmène le
transféré aux Manufactures-Moyennes ; « une fortune pour graisser les bonnes mains » ; ceux qui montent « ne vous
regardent plus pareil » ; on ne redescend guère des Manufactures-Hautes. La fiche Ferros, elle, ne parle pas de castes
(zone floue 29).

Quête **proposée** :
- **Kerta Orvel**, fondeuse, dans la file du Puits Trois : son fils **Tam** (dix-neuf ans, riveteur) crache noir,
  comme son père, mort à quarante et un ans. Tam a inventé un **masque** de feutre et de charbon de bois. Déclaré, le
  masque le ferait monter aux Manufactures, où l'air se respire ; mais il deviendrait une Innovation des Manufactures,
  vendue aux fonderies qui paient. Kerta veut qu'il monte ; Tam veut que le masque reste en bas.
- **Le technicien Dask** (Classe Technique, chiffres bleus au poignet, Manufactures-Moyennes) parraine : pour
  **60 Fers** (« les mains à graisser »), par **Diplomatie 3** (« un Innovateur qui vous doit tout vous sera fidèle »),
  si le masque est **déclaré à son nom** (« le masque Dask »), ou l'on appose son sceau en douce (**Subterfuge 14**).
- **Trois fins** :
  - **Tam monte** (50 XP ; Ironheart +5) : Kerta seule dans la file ; « c'est le prix » ;
  - **le masque reste en bas** (les plans portés à **Hedda Cendrefer**, dont l'atelier est à la Compagnie des
    Lisières, pas à Ferros : 50 XP ; Ironheart +10) : la moitié des Forges porte un masque, Tam tousse toujours, Kerta
    ne pardonne pas ; impossible si le masque est déjà à Dask ;
  - **le sceau a bavé** (Subterfuge raté, sans qu'on le dise) : Tam est pris à l'inspection, « faux d'Innovateur » ;
    personne ne dit à Kerta où il est (20 XP ; Ironheart −5).
- Boulon (s'il suit) aime qu'on laisse le masque en bas (+1), n'aime pas qu'on le vende à Dask (−1).
- Le panneau du registre : « Puits Un et Deux : castes supérieures. Tout Ouvrier qui s'y présente sera retenu. »

## 3. Les morts et les conséquences

| Où | Choix | Conséquence (proposée) |
|---|---|---|
| Gare Engloutie (« Le Dernier Train ») | nouvelle option au pied de la foreuse : **ouvrir la chaudière en grand** (pas de jet) | la foreuse explose ; **Pell**, vingt-deux ans, qui veillait sous la lanterne « parce qu'il avait peur du noir », meurt ; Ingrid l'a enterré au bord du quai ; Ilyane : « Un Gardien se souvient aussi de ce qu'il a coûté » ; la lavandière ; Liane −2 |
| Triage des Cendres (« Le Rail des Cendres ») | le silence vendu aux **Marches** | **Joss est tué** (« entre deux wagons, les mains encore noires de graisse ; les Marches ne laissent ni dette ouverte, ni témoin ») ; il disparaît du triage |
| idem | tout dire au **Bureau** | Joss est livré au tribunal : « sabotage d'un secteur stratégique » ; à Ferros, la trahison, c'est la mort [NOTION : peine de mort pour trahison ; grève interdite dans les secteurs stratégiques] |
| Canopéa (« Les graines qui manquent ») | dénoncer **Elvan** | il est **banni** : « ici, on n'enferme pas, on retire les racines » [NOTION : bannissement pour la corruption ; les Sans-Racines comptent des bannis] ; la fleuriste l'a vu partir, sans nom |
| idem | le héros a volé et **nie** | la gardienne du grenier, une Jeune-Pousse, est soupçonnée : on la bannira si elle paie pour un autre |
| Ironheart (le registre) | voir plus haut | Tam arrêté, ou monté, ou resté |

## 4. Le ton des trois villes

- **Passants réécrits** (`src/data/figurants.json`) avec des détails du canon : les Ferriens dont on se méfie à
  Gardebois [NOTION : « immigrants de Ferros méfiés »] ; une voisine qui revit la Chute et se jette au ruisseau [NOTION :
  la maladie mémorielle force à revivre les tragédies] ; les Jeunes-Pousses et leurs échelles de corde, les
  Citoyens-Arbres et leurs ascenseurs [NOTION] ; une pèlerine dont la mère « a choisi de partir » [NOTION : euthanasie
  légale à Verdantis] ; l'ouvrier dont le père est mort à quarante-huit ans [NOTION : les mineurs vivent de 45 à 60
  ans] ; la grève interdite ; la rouille de l'âme ; Joss et Tam dans la bouche des passants.
- **Répliques assombries** : Maëlis (« Ce matin, elle m'a appelée madame »), Vanel (le prix), Ostrik, Varka, Sorn,
  Véline.
- **Toujours dans la charte** : pas de torture, pas de gore gratuit ; les morts viennent de nos choix et se pleurent.

## Propositions validées par Cyril le 2026-11-02 (« Je dis oui pour tout, mets le tout en ligne »)

1. Le système des **marques** (trois marques, le cristal qui se fend, Vanel qui les reprend contre un rang) et ses
   noms (« les veines », « le manque », « la peau de cristal »).
2. La quête « **Le registre du Puits Trois** », **Kerta**, **Tam** et **Dask**, le masque de feutre, ses trois fins.
3. Les morts : **Pell** (la chaudière), **Joss** (tué par les Marches, ou condamné par le Bureau), **Elvan** banni.
4. La nuit au poste (« fiché·e à l'encre rouge ») et les vingt Fers glissés au patrouilleur.
