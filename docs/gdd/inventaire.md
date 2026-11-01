# Inventaire et troc

Règles : `src/rules/inventory.ts` ; écran : `TradeScene`.

- **Objets** (`src/data/items.json`) : nom, description, poids (kg), prix (en Fers, la monnaie de Ferros —
  `docs/univers/personnages/pnj.md`), et selon le cas un emplacement (`main` ou `armure`), un bonus de Défense (armures)
  ou des PV soignés (objets de soin).
  Catalogue de départ : Dague, Épée longue, Arc (les mêmes identifiants que les armes de combat,
  `src/data/weapons.json`), Armure de cuir, Armure de ferraille, Lampe à cristal, Corde, Bandage.
- **Kit de départ (à valider)** : une Dague, déjà en main droite (`STARTING_WEAPON`).
- **Monnaie de départ** : 15 Fers (`STARTING_FERS`), volontairement **moins** que le laissez-passer de Tobias
  (cinquante Fers) : convaincre reste la voie la plus sûre tôt dans la tranche.
- **Gagner des Fers** (premier jet, à valider) : chaque résolution de « Le Dernier Train » rapporte **30 Fers**
  (en plus des 40 XP), et une caisse de prospection abandonnée à la Gare Engloutie contient une bourse de **25 Fers**
  (une seule fois). Une partie complète dispose donc d'environ 70 Fers, de quoi acheter une armure. Effet de
  dialogue `giveFers`.
- **Poids** : chaque objet porté (équipé ou non) compte dans la Charge (`docs/gdd/attributs.md`). Acheter au-delà de la
  Charge est refusé.
- **Équipement** : deux mains et une armure (`character.equipment`). Équiper un objet le retire de tout autre
  emplacement qu'il occupait. L'Armure équipée ajoute son bonus à la Défense — **y compris en combat** (`combat.ts`
  lit `armorBonus`). Les armes en main sont celles du combat (`docs/gdd/combat.md`, « Armes ») : une arme achetée
  mais rangée dans le sac ne sert pas.
- **Troc** : acheter dépense des Fers ; vendre rapporte la moitié du prix, arrondi à l'entier inférieur. Pour l'instant,
  **chaque marchand vend le même petit catalogue** (`ITEMS` en entier) — pas encore de catalogue propre à Tobias ; à
  valider avec Cyril si des objets doivent rester exclusifs à un lieu ou un PNJ.
- **Écran** : `TradeScene`, ouvert soit depuis le bouton « Inventaire » du HUD (pas d'achat possible, seulement
  consulter/équiper/utiliser/vendre ses propres objets), soit depuis un dialogue dont une option porte l'effet
  `openTrade` (Tobias : « Voir l'étal. »), avec achat en plus.
