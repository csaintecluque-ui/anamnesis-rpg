# L'artisanat (jalon 3, étape 7 ; construit le 2026-11-03, validé et mis en ligne par Cyril le 2026-11-03)

Plan : `docs/gdd/jalon-3.md` ; idée validée dans `docs/gdd/jeu-complet.md` (activité 8 : « la forge d'Ironheart, l'herboristerie
de Canopéa »). Code : `src/rules/artisanat.ts`, écran `src/scenes/AtelierScene.ts` ; données : `src/data/recettes.json`.

## Le principe

- **Deux ateliers** : **la forge de l'atelier Cendrefer**, à Ironheart (Hedda : « Qu'as-tu de plus que ton frère ? »,
  puis « Améliorer une arme ou une armure ») ; **les herbes du Comptoir de la Sève**, à Canopéa (Sévane : « D'où viennent
  tes herbes ? », puis « Préparer des remèdes »).
- **Les matières viennent du butin des bêtes** (`docs/gdd/combat.md`) : jusqu'ici elles ne servaient qu'à être vendues.
  Chaque recette coûte aussi quelques Fers.
- **L'écran de l'atelier** : une ligne par recette, ce qu'elle donne, ce qu'il faut (ce qu'on a sur ce qu'il faut),
  et le bouton « Forger » ou « Préparer », grisé tant qu'il manque quelque chose. Une arme ou une armure portée,
  améliorée, reste portée.

## Les recettes

| Atelier | Donne | Il faut | Fers | Effet |
|---|---|---|---|---|
| Forge | Épée trempée | une épée longue, 2 crocs de Loup de Rouille | 30 | 1d10 au lieu de 1d8 |
| Forge | Dague dentelée | une dague, 3 dards de Guêpe-Rouille | 15 | 1d6 au lieu de 1d4 |
| Forge | Armure de cuir clouté | une armure de cuir, 2 crocs, une fourrure d'Ours-Mousse | 25 | armure +2 au lieu de +1 |
| Forge | Cuirasse au cœur de ferraille | une cuirasse rivetée, un cœur de ferraille | 50 | armure +4 au lieu de +3 |
| Forge | 10 carreaux d'arbalète | 2 dards de Guêpe-Rouille | 5 | |
| Herbes | 2 baumes de mousse | une fourrure d'Ours-Mousse | 4 | 12 PV chacun |
| Herbes | Fiole de sève | 2 épines de Rôdeur | 6 | 20 PV |
| Herbes | **Sève de Résonance** | des griffes de Griffe-Sylve, une épine de Rôdeur | 12 | rend 3 Points de Résonance (inventaire : « Boire ») |
| Herbes | 3 bandages | une glande de Gecko-Soudeur | 3 | 8 PV chacun |

Toutes les matières du butin servent à quelque chose.

## Plus tard

La taille des cristaux (la tailleuse du Marché des Cendres) ; des plantes à cueillir sur les routes (le canon en compte
soixante-dix) ; des recettes réservées aux rangs des guildes.
