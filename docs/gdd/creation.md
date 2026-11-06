# Création de personnage : origine et don

Écran : `src/scenes/CreationScene.ts` ; règles : `src/rules/character.ts` ; dons : `src/data/feats.json`.

- **Origine** : pour la tranche, je recommande **Humain uniquement** (JDR : +1 à deux attributs).
  - Plus tard : Enfant des Surgeons et Chasseur d'Orage, peuples présents dans toutes les nations [E7, GLO].
- **Un don au choix** (les dons du JDR n'ont pas de contrepartie) :

| Don | Effet | Origine |
|---|---|---|
| Dur à Cuire | +2 Vigueur au calcul des PV, +2 PV par niveau | JDR (+2 Vigueur, +1d8 PV/niveau), adapté |
| Tireur d'Élite | portée +2 cases (doublée avant le test du 2026-11-06), +2 dégâts au Tir | JDR, adapté |
| Maître d'Armes | +1 au toucher et +1 aux dégâts en Mêlée | JDR |
| Mémoire de Kael | +2 rangs en Érudition, +1 Récit retenu | expression canon [E4] |
| Esprit d'Amira | +2 rangs en Survie, repère les lieux cachés sur la carte | expression canon [E4] |
| Fort comme Gorim | +1 Corps, +10 kg de charge | expression canon [E4] |

## Précisions d'implémentation (2026-11-01)

Ces points n'étaient pas tranchés ; voici ce qui est codé.

- **Bonus et plafond** : les points répartis plafonnent à 5. Le bonus humain (+1) et le don « Fort comme Gorim » s'ajoutent
  ensuite, jusqu'à **6** au maximum (le JDR prévoit le score 6, modificateur +3).
- **Tout dépenser** : on ne peut pas passer à l'étape suivante avec des points d'attribut, un bonus humain ou des rangs
  de compétence non utilisés.
- **Dons de combat** (Tireur d'Élite, Maître d'Armes) : choisis et enregistrés dès maintenant, mais sans effet tant que
  le combat n'existe pas. Même chose pour « repère les lieux cachés » d'Esprit d'Amira, en attendant la carte.
- **Nom** : de 1 à 24 caractères ; les espaces en trop sont retirés.
- **Apparence** (jalon 2) : 6 avatars au choix (`src/data/avatars.json`), en haut de la première étape ; chacun a un
  portrait et une planche de marche ; enregistré dans `character.avatar` (sauvegarde v8).
- **Écran** : assistant en 5 étapes (Nom et apparence, Attributs, Compétences, Don, Récapitulatif). Toucher le nom d'un attribut ou
  d'une compétence affiche sa description. Le texte du jeu reste neutre en genre
  (« en apprentissage chez les Gardiens de Mémoire »).
