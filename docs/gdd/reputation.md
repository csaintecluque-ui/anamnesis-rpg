# Réputation par ville

Demande de Cyril (2026-11-02) : « attaque la réputation ». **Fait et en ligne le 2026-11-02 ; paliers validés par Cyril.**
Code : `src/rules/reputation.ts` ; données : `src/data/reputation.json`. Plan des villes : `docs/gdd/villes.md`.

## Principe

- Chaque ville a son opinion du héros, **déduite de ce qu'il y a fait** : quêtes terminées et repères d'histoire
  (`reputation.json` : une liste de sources par ville, avec leurs points). Rien de plus à sauvegarder : une ancienne
  partie retrouve aussitôt sa réputation.
- **Paliers** :

| Palier | Score | Ce que dit le jeu | Prix de ses marchands |
|---|---|---|---|
| Méfiance | moins de 0 | « on se méfie de toi » | +20 % |
| Neutre | 0 à 9 | « on ne te connaît pas encore » | — |
| Estime | 10 à 24 | « on t'apprécie » | −10 % |
| Amitié | 25 et plus | « la ville te fait confiance » | −15 % |

- **Effets** :
  - prix des marchands **de la ville** (`place` dans `npcs.json` : Tobias à Gardebois, Sévane à Canopéa), cumulés avec
    une remise propre (Tobias après « La caisse égarée ») ; la colporteuse, qui voyage, n'en tient pas compte ;
    l'étal affiche le palier et le pourcentage, chaque prix « prix d'ami » ou « prix fort » ;
  - une **condition de dialogue** `{ "reputation": "<ville>", "min": <score> }`, affichée comme un test (option grisée
    avec « Réputation à Canopéa : on t'apprécie » tant qu'elle n'est pas atteinte) ;
  - un **message** quand une ville change de palier (« Réputation à Canopéa : on se méfie de toi »).

## Sources actuelles (à valider)

| Ville | Source | Points |
|---|---|---|
| Gardebois | « Le Dernier Train » terminée | +15 |
| Gardebois | « La berceuse oubliée » terminée | +10 |
| Gardebois | « Les herbes de lisière » terminée | +5 |
| Gardebois | « La caisse égarée » terminée | +5 |
| Canopéa | Aïlis réconfortée (la voix d'Anselme) | +10 |
| Canopéa | Un sac volé au grenier des semences | −20 |

Premier usage d'une condition : l'huissier du Conseil, à Canopéa, laisse entendre une audience à partir de l'estime.
Les quêtes des villes ajouteront leurs propres sources.

## Plus tard

- Être **vu** en train de voler ou de crocheter (gardes, témoins), plutôt que tout vol connu de la ville.
- Des portes ou des services réservés à l'amitié ; des gardes plus regardants en cas de méfiance.
