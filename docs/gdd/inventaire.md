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
- **Équipement** : deux mains et une armure (`character.equipment`). Équiper un objet le retire de tout autre
  emplacement qu'il occupait. L'Armure équipée ajoute son bonus à la Défense — **y compris en combat** (`combat.ts`
  lit `armorBonus`). Les armes en main sont celles du combat (`docs/gdd/combat.md`, « Armes ») : une arme achetée
  mais rangée dans le sac ne sert pas.
- **Troc** : acheter dépense des Fers ; vendre rapporte la moitié du prix, arrondi à l'entier inférieur.
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
  consulter/équiper/utiliser/vendre), soit depuis un dialogue dont une option porte l'effet
  `openTrade` (Tobias : « Voir l'étal. »), avec achat en plus.

## Les pièces de Hedda (Ironheart, accord de Cyril le 2026-11-02)

À Ironheart, on gagne beaucoup (Kaelis paie 100 Fers, Sorn 80, Ostrik 60) et l'étal de Tobias ne suffisait plus.
Hedda Cendrefer vend aussi ses propres pièces, entre 70 et 120 Fers :

| Objet | Prix | Effet |
|---|---|---|
| Marteau de forge | 70 | arme de mêlée, 1d10 (Épée longue : 1d8), 5 kg |
| Arbalète de Ferros | 80 | arme de tir, portée 6, 1d10 (Arc : 1d8), 4 kg |
| Cuirasse rivetée | 120 | armure, +3 en Défense (ferraille : +2), 18 kg |

## Le laissez-passer de Tobias (décision de Cyril, 2026-11-02)

Le jour, un contremaître d'Ingrid barre l'accès au chantier de la Gare Engloutie sans le laissez-passer (50 Fers chez
Tobias, ou gratuit par la parole : Diplomatie 2). Sans lui, il reste la nuit (se glisser jusqu'à la foreuse) ou le
Golem. Les Récits de l'histoire principale (le savant Corvan, le Triumvirat Vert, le carnet du dernier train) ne
s'oublient jamais et ne comptent pas dans le plafond de Mémoire + 1 (`docs/gdd/memoire.md`).
