# Inventaire et troc

Règles : `src/rules/inventory.ts` ; écran : `TradeScene`.

- **Objets** (`src/data/items.json`) : nom, description, poids (kg), prix (en Fers, la monnaie de Ferros —
  `docs/univers/personnages/pnj.md`), et selon le cas un emplacement (`main` ou `armure`), un bonus de Défense (armures)
  ou des PV soignés (objets de soin).
  Catalogue de départ : Dague, Épée longue, Arc (les mêmes identifiants que les armes de combat,
  `src/data/weapons.json`), Armure de cuir, Armure de ferraille, Lampe à cristal, Corde, Bandage.
- **Kit de départ (validé le 2026-11-01)** : une Dague, déjà en main droite (`STARTING_WEAPON`).
- **Monnaie de départ** : 15 Fers (`STARTING_FERS`), volontairement **moins** que le laissez-passer de Tobias
  (cinquante Fers) : convaincre reste la voie la plus sûre tôt dans la tranche.
- **Gagner des Fers** (validé par Cyril le 2026-11-01) : chaque résolution de « Le Dernier Train » rapporte **30 Fers**
  (en plus des 70 XP), et une caisse de prospection abandonnée à la Gare Engloutie contient une bourse de **25 Fers**
  (une seule fois). Une partie complète dispose donc d'environ 70 Fers, de quoi acheter une armure. Effet de
  dialogue `giveFers`.
- **Poids** : chaque objet porté (équipé ou non) compte dans la Charge (`docs/gdd/attributs.md`). Acheter au-delà de la
  Charge est refusé.
- **Équipement** : deux mains, une armure et un cristal porté au cou (`character.equipment` ; le cristal :
  `docs/gdd/magie.md`, bouton « Porter »). Équiper un objet le retire de tout autre
  emplacement qu'il occupait. L'Armure équipée ajoute son bonus à la Défense — **y compris en combat** (`combat.ts`
  lit `armorBonus`). Les armes en main sont celles du combat (`docs/gdd/combat.md`, « Armes ») : une arme achetée
  mais rangée dans le sac ne sert pas.
- **Troc** : acheter dépense des Fers ; vendre rapporte la moitié du prix, arrondi à l'entier inférieur, et jamais autant que
  ce que le marchand le revend lui-même (test du 2026-11-06 : acheter puis revendre créait des Fers). On ne vend qu'à un
  marchand ; ce qu'on porte demande un second appui.
  Les **objets de quête** (`quest: true` : la branche et la flûte d'Anselme…) ne se vendent pas ; un dialogue les reprend
  (`takeItem`) quand on les remet.
- **Catalogue par marchand** (depuis le 2026-11-01) : chaque marchand a sa liste (`sells` dans `src/data/npcs.json`,
  `merchantCatalogue`). L'étal montre ce qu'il vend, plus ce que le héros porte (pour pouvoir le vendre : un
  marchand rachète tout). « Acheter » n'apparaît que sur les objets de son catalogue. Stock illimité.
  - **Tobias** vend les 8 objets actuels (outils de Ferros, cordes, lampes à cristal, armes et armures : son
    dialogue validé et la description de l'Épée longue, « de l'atelier Cendrefer »).
  - **Décision de Cyril (2026-11-01)** : pas d'objets réservés ni de stock limité tant qu'il n'y a qu'un marchand ;
    à revoir à l'arrivée du deuxième.
  - **Sévane Mielvert** (Comptoir de la Sève, Canopéa) vend bandages, Baume de mousse (12 Fers, soigne 12 PV) et corde ;
    **la colporteuse** (rencontre de voyage) y ajoute la lampe à cristal. Avec ces deux marchands, la question des
    stocks se pose : pour l'instant, toujours illimités (à revoir avec Cyril).
  - **Réputation** (`docs/gdd/reputation.md`) : les prix des marchands d'une ville suivent son opinion du héros
    (+20 % à −15 %), cumulés avec leur remise propre.
  - **Graines-lumière** (30 Fers) : le sac qu'on peut voler au grenier des semences de Canopéa
    (`docs/univers/lieux/canopee.md`).
- **Écran** : `TradeScene`, ouvert soit depuis le bouton « Inventaire » du HUD (seulement les objets portés, sans achat :
  consulter/équiper/utiliser ; plus de vente sans marchand depuis le test du 2026-11-06), soit depuis un dialogue dont une option porte l'effet
  `openTrade` (Tobias : « Voir l'étal. »), avec achat en plus.

## Le sac rangé (demande de Cyril, 2026-11-03)

Après son premier essai : « il faudrait des onglets, et des descriptions permettant de connaître l'utilité, et pour
certains objets un bout de lore ; là, tous les objets se suivent ». Règles : `src/rules/objets.ts` ; écran : `TradeScene`.

- **Cinq onglets**, avec leur compte (un onglet vide est grisé) : **Équipement** (armes, armures, cristaux, même prêtés),
  **Remèdes** (soins, sèves), **Matières** (ce qui entre dans une recette de la forge de Ragna ou des herbes de Sévane,
  et les éclats de cristal), **Quête** (ce qu'on porte pour quelqu'un), **Divers** (le reste : corde, lampe, carreaux,
  graines). Le rangement se déduit des règles ; `categorie` dans `items.json` le force si besoin.
- **La liste à gauche** (◆ : porté), **la fiche à droite** : le nom ; l'onglet, combien on en a, où il est porté ; **à quoi
  il sert**, tiré des règles (dégâts et compétence d'une arme, Défense d'une armure, pouvoirs d'un cristal, PV ou PR
  rendus, recettes où il entre, atelier qui le fabrique, « objet de quête : il ne se vend pas ») ; poids et valeur ; sa
  description ; parfois **ce qu'on en dit**, en italique (`lore`, `docs/univers/objets.md`, validé) ; ses boutons
  (Utiliser, Boire, Soigner, Équiper, Porter, Retirer, Vendre, Acheter).
- À un étal, l'écran s'ouvre sur l'onglet de ce que vend le marchand ; son prix est à droite de chaque ligne.
- Clavier : ← → changent d'onglet, ↑ ↓ d'objet, 1 à 4 les boutons de la fiche.
- **Munitions et lampe** (demande de Cyril, 2026-11-03) : flèches et carreaux rangés dans « Équipement »
  (`docs/gdd/combat.md`, « Munitions ») ; la lampe éclaire les voies endormies (`docs/gdd/voies.md`, « La lampe ») ;
  `usage` dans `items.json` dit ce que les règles ne peuvent pas déduire. La corde ne sert encore à rien.

## Les pièces de Ragna (Ironheart, accord de Cyril le 2026-11-02)

À Ironheart, on gagne beaucoup (Kaelis paie 100 Fers, Sorn 80, Ostrik 60) et l'étal de Tobias ne suffisait plus.
Ragna Cendrefer vend aussi ses propres pièces, entre 70 et 120 Fers :

| Objet | Prix | Effet |
|---|---|---|
| Marteau de forge | 70 | arme de mêlée, 1d10 + 4 (Épée longue : 1d8 + 2, trempée : 1d10 + 3), 5 kg |
| Arbalète de Ferros | 80 | arme de tir, portée 6, 1d10 + 2 (Arc : 1d8 + 1), 4 kg |
| Cuirasse rivetée | 120 | armure, +3 en Défense (ferraille : +2), 18 kg |

## Le laissez-passer de Tobias (décision de Cyril, 2026-11-02)

Le jour, un contremaître d'Ingrid barre l'accès au chantier de la Gare Engloutie sans le laissez-passer (50 Fers chez
Tobias, ou gratuit par la parole : Diplomatie 2). Sans lui, il reste la nuit (se glisser jusqu'à la foreuse) ou le
Golem. Les Récits de l'histoire principale (le savant Corvan, le Triumvirat Vert, le carnet du dernier train) ne
s'oublient jamais et ne comptent pas dans le plafond de Mémoire + 1 (`docs/gdd/memoire.md`).

## La vitrine de chaque ville (étude du 2026-11-03, G1)

Une économie qui s'équilibre ne fait rien désirer : chaque marchand de ville met en avant **une pièce**, hors de
portée au début, avec ce qu'il en dit (`vitrine` dans `src/data/npcs.json`, `merchantShowcase`). L'étal s'ouvre
dessus, et sa fiche commence par le mot du marchand.

| Ville | Marchand | Vitrine | Prix |
|---|---|---|---|
| Gardebois | Tobias | la lampe à cristal (« Sous terre, elle te montre les pièges à deux pas ») | 15 |
| Canopéa | Sévane | le cristal de Vie (« il referme les plaies, les tiennes et celles des autres ») | 250 |
| Ironheart | Ragna | la cuirasse rivetée (« trois points de Défense, ce qui sépare un blessé d'un mort ») | 120 |

Sept-Portes, ville sans combat, n'en a pas.
