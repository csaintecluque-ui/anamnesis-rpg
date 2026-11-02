# Vérification qualité de tout le jeu (2026-11-02)

Demande de Cyril : « fais-moi une vérification et un test qualité de l'ensemble des éléments du jeu », après la mise
en ligne des étapes 4 et 5 du jalon 3. Version vérifiée : `main` au commit `4edc8e0`, puis les corrections ci-dessous.

## Ce qui a été vérifié, et le résultat

| Domaine | Comment | Résultat |
|---|---|---|
| Règles et contenu | 546 tests automatiques, dont le parcours complet d'affilée et ses variantes (`src/rules/parcours.test.ts`) : chaque quête finie, rien qui se gagne deux fois, aucune impasse, aucun nœud inaccessible | tout passe |
| Code | `npm run typecheck`, `npm run build` | au vert |
| Données | audit croisé : repères lus mais jamais posés, objets sans source, objets inconnus, PNJ ou dialogues orphelins | **aucun défaut** (les repères des veillées et des rencontres sont posés par le code) |
| Les 28 lieux | ouverts un à un dans Chromium, sur PC (1280 × 720) et sur téléphone en paysage (844 × 390), avec relevé des erreurs | **0 erreur**, tous s'affichent |
| Écrans | titre, création du personnage, journal, pause, carte du monde, une rencontre en route et son combat, l'inventaire avec les marques | corrects, sur PC et téléphone |
| Hors ligne | le jeu chargé une fois, puis rechargé sans réseau | il se relance (service worker actif) |
| Dépendances | `npm audit` | **0 faille** dans ce que le jeu embarque ; 10 alertes modérées dans les seuls outils de build (déjà notées) |
| Poids | build de production | 2,6 Mo, **502 Ko compressés** (Phaser et les cartes) ; mis en cache pour le hors ligne |
| Textes | relecture complète (agent) : les dialogues, les passants, les quêtes, les objets, les Récits, les Échos et les veillées | une vingtaine de corrections (ci-dessous) ; **charte du ton respectée** |

## Corrigé

- **Textes** :
  - fautes : la Lueur (« le tien s'allume »), « le sommeil efface la fatigue », Dask (« vendront le masque ») ;
  - Nell parle avec un tiret, comme les autres ; l'option de bluff du patrouilleur est écrite comme les autres
    bluffs ; « Quinze Fers » en lettres chez la convoyeuse et le chef de caravane ;
  - cohérence : la gardienne du grenier (Véline, comme la rumeur des veillées) ; les pilleurs « abaissent » le levier
    (Joss le laisse ouvert, rien n'est forcé) ; Liane n'a plus « les genoux » d'une vieille femme ;
  - Aïlis joue au Bosquet, pas sur le sol sacré (le Récit) ; « on ne l'entendait plus » ; le carnet est celui
    d'Ilyane ; Tobias est « le marchand de Gardebois » ; Garrik dit « le Marché des Cendres » ; Brann est
    « l'apprenti de Tobias » ;
  - le chef de caravane part « aujourd'hui » ; le commis a bien raté sa caravane ; l'Ours-Mousse traîne la sacoche
    « jusqu'à sa tanière » (au lieu d'un « nid bien douillet », trop enfantin).
- **Figurines** : Kerta, Tam et le technicien Dask ont leur propre figurine (ils avaient la silhouette par défaut).
- **`docs/DIALOGUES.md`** : le générateur savait mal écrire les conditions et effets récents (69 « undefined ») ; il
  les écrit tous, maintenant (moments, cristal, compagnons, avis, marques, veillées, sommeil, pouvoirs…).

## Laissé tel quel, à savoir

- **Le prix de l'arbalète** « tombée d'un convoi » : la rumeur dit « à moitié prix », Tobias en demande 35 Fers pour
  80 ; c'est le chiffre validé, et une rumeur arrondit.
- **L'amphithéâtre** : sur téléphone, les noms de Lyra, Thalorin et Kael Marchevent se touchent (l'estrade est
  étroite) ; lisible sur PC.
- **« caste » ou « Classe » Technique** : le roman emploie les deux ; le jeu aussi (zone floue 32).
- **La rencontre sur téléphone** : le combat part après l'annonce, comme sur PC (vérifié sur PC).

## Décisions de Cyril (2026-11-02, « Oui pour tout, mets en ligne »)

- Les corrections ci-dessus sont **mises en ligne**.
- **Corvan et le dernier train** (zone floue 32) : dans l'Écho du dernier train, le savant de la Chute ne nomme plus
  Corvan (« Dis-leur que même réussir peut tout détruire ») ; l'Écho donne toujours le Récit du savant Corvan.
