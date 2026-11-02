# Passants et habitants « de remplissage »

Demande de Cyril (2026-11-02) : des passants qui marchent dans les rues, et des PNJ qui n'ont qu'une ou deux
interactions, sans utilité, « pour combler ». **Fait le 2026-11-02, en visuels provisoires.**
Code : `src/scenes/Figurants.ts` (sur la carte), `src/rules/figurants.ts` ; données : `src/data/figurants.json`.

## Règles

- Un figurant a un nom de rôle (« Une marchande de fleurs »), une tuile, un trajet et **une ou deux répliques**.
- **Trajet** : une boucle de points de passage ; il marche de l'un à l'autre (chemin le plus court), s'arrête un peu
  à chaque point, puis repart. Un trajet d'un seul point : il reste sur place.
- **Toucher** un figurant : il s'arrête, se tourne vers le héros et dit sa réplique dans une bulle (environ 4 s). Au
  toucher suivant, la réplique suivante, et ainsi de suite.
- Ceux qui marchent **ne bloquent jamais** le héros (ils évitent sa case) ; ceux qui restent sur place bloquent, comme
  les PNJ. Pas de quête, pas d'effet, rien à sauvegarder.
- **Visuels provisoires** : silhouettes dessinées par code, avec un accessoire (panier, bâton, lettre…) et un petit
  saut à chaque pas, faute d'animation de marche.
- Tests (`src/engine/figurants.test.ts`) : trajets sur des cases libres et reliées, personne devant une porte, une sortie
  ou une arrivée, une ou deux répliques courtes.

## Les quatorze figurants (proposition du 2026-11-02, à valider)

| Lieu | Figurant | Marche ? | En deux mots |
|---|---|---|---|
| Canopéa, Grande Nacelle | Une marchande de fleurs | oui | fleurs de lune ; « une sur trois reste à l'arbre » |
| Canopéa, Grande Nacelle | Un porteur de paniers | oui | des baies pour le Nid ; « ne rien laisser tomber » |
| Canopéa, Grande Nacelle | Une petite fille qui joue | oui, vite | le jeu « rien ne touche le sol » |
| Canopéa, Grande Nacelle | Un vieil homme | non | trois générations de nacelles ; regarder les nuages |
| Canopéa, Hautes Ramures | Une tisseuse de feuilles | non | voiles de feuilles ; « c'est de la patience » |
| Canopéa, Hautes Ramures | Un messager du Conseil | oui | message urgent ; « une audience ? un coussin » |
| Canopéa, Bois des Aïeux | Une pèlerine du Bois | oui, lentement | vient voir sa mère, « passée dans le grand arbre » |
| Canopéa, Bois des Aïeux | Un soigneur d'écorce | non | soigne l'écorce, ne touche jamais aux noms |
| Gardebois | Un commis de Ferros pressé | oui | la caravane de midi ; « payé en Fers, remercié en chansons » |
| Gardebois | Une lavandière | non | l'eau du ruisseau descend de la canopée |
| Gardebois | Un garçon curieux | oui, vite | veut une histoire de dragon gentil ; le « buisson très méchant » |
| Gardebois | Un vieux joueur de pipeau | non | « les chansons sont des souvenirs qui ont appris à voler » (mot prêté à Ilyane) |
| Auberge de la Racine | Un client somnolent | non | « je réfléchis avec les yeux fermés » ; la soupe de Sylvan |
| Auberge du Nid | Une voyageuse fourbue | non | trois jours de marche ; le plus beau hamac du monde |

Les textes complets sont dans `src/data/figurants.json`.

## Images peintes (à décider avec Cyril)

Gardebois est déjà peint : ses cinq figurants (avec le client de l'auberge) y détonnent en provisoire. Proposition :
les peindre avec la méthode 2D validée (`docs/gdd/animation.md`) : en pied 0,5 crédit, planche de marche 2,5 ;
soit 2 marcheurs × 3 + 3 immobiles × 0,5 = **≈ 7,5 crédits** sur 19. Ceux de Canopéa attendront la peinture de la ville.
