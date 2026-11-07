# Le son

Étude du 2026-11-03, vague 3 (J1 à J3). Décision de Cyril (2026-11-04) : **les bruitages d'abord, fabriqués par le
code** ; les ambiances et la berceuse viendront **à la fin, de Higgsfield**, avec le reste des générations.

## Les bruitages (faits)

Fabriqués par `npm run sfx` (`scripts/generate-sfx.mjs`) : des synthèses (bruit filtré, sinusoïdes, enveloppes) à
graine fixe, toujours identiques ; fichiers WAV mono 22 050 Hz dans `public/audio/sfx/` (≈ 420 Ko), chargés au
démarrage (`src/audio/sfx.ts`), gardés hors ligne. Le volume des options s'applique à tous ; chacun a son niveau.

| Son | Quand | Niveau |
|---|---|---|
| `pas-1` à `pas-4` | chaque pas du héros sur la carte, tirés tour à tour, jamais deux fois le même de suite | très bas (0,16) |
| `coup` | un coup qui porte, au combat (héros, compagnons, ennemis) | 0,6 |
| `rate` | un coup qui manque | 0,45 |
| `soin` | un soin au combat (Liane, la rebouteuse, la Guérison du cristal) | 0,5 |
| `dialogue` | l'ouverture d'un dialogue : un froissement de parchemin | 0,3 |
| `objet` | un objet ou des Fers reçus (dialogue, butin d'un combat gagné) | 0,5 |
| `train` | **le train qu'on entend avant de le voir** : en arrivant à la Gare Engloutie, tant qu'on n'a pas rencontré l'Écho du dernier train ; un grondement lointain qui monte, la vapeur qui s'accélère, un sifflet au loin (7 s) | 0,55 |

## Plus tard : Higgsfield — le plan (2026-11-05, **à valider par Cyril** ; rien n'est généré)

Le connecteur fait de la musique (ElevenLabs Music) et des voix, **pas de bruitages** (son modèle de bruitages est
réservé à son outil de jeux) : les ambiances seront de la **musique d'ambiance**, avec des textures (vent, eau, cloches),
pas des prises de son. Le premier plan (quatre ambiances et la berceuse, ≈ 80 crédits) date d'avant les chapitres 5 à
8 ; il en faut maintenant une par famille de lieux.

| Ambiance (boucle de 2 min) | Lieux | Ce qu'on entend |
|---|---|---|
| La forêt | Gardebois, Canopéa, le Sol des Racines, la route | flûte de bois, cordes graves, oiseaux lointains |
| Les forges | Ironheart | enclumes au loin, cuivres graves, battement lent |
| La pierre | Sept-Portes | cloches, harpe, rumeur de ville |
| Le souterrain | la Gare Engloutie, les voies endormies, la Cendrière, les cryptes | drone grave, gouttes, résonance de métal |
| Le ciel | Aetherhaven | vent, carillons, cordes aériennes |
| La mer | Coralia | ressac, violoncelle, cloche de bouée |
| Le désert | Marche-Mère | cordes pincées, flûte grave, vent de sable |
| La glace | Khrysos | verre frotté, harmoniques de cristal, drone froid |
| **La berceuse de Maëlis** (1 min) | Gardebois, l'Écho de la berceuse | fredonnée par une voix de femme, sans paroles |

**Style commun** (la fiche de style sonore, reprise dans chaque prompt) : lent, sombre et chaleureux ; instruments
acoustiques ; aucune voix (sauf la berceuse) ; aucune percussion forte ; une boucle sans début ni fin marqués ; mixé
discret, sous les dialogues. Aucune musique d'une culture réelle reconnaissable (`docs/univers/ton.md`).

**Coût vérifié sans générer** (le 2026-11-05, en crédits) :

| | ElevenLabs Music v2 | ElevenLabs Music v2.5 |
|---|---|---|
| Une ambiance de 2 min | 7,68 | 17,44 |
| Les huit ambiances | 61,44 | 139,52 |
| La berceuse (1 min) | 3,84 | 8,72 |
| **Total** | **65,28** | **148,24** |
| Marge : trois reprises d'ambiance | + 23,04 | + 52,32 |

**Recommandation** : d'abord la forêt dans les deux modèles (25,12 crédits), Cyril écoute et choisit ; puis le reste
dans le modèle choisi. **Le compte Higgsfield est à 0 crédit** (formule gratuite) : il faut acheter des crédits avant
toute génération.

**Ce que fait le code ensuite (sans crédits)** : un lecteur de musique qui enchaîne en fondu l'ambiance de la famille
du lieu ; un réglage « Musique » à part dans les Options ; les fichiers réduits en mono 96 kbit/s par ffmpeg (≈ 1,4 Mo
par boucle), **mis en cache à la première écoute** plutôt qu'à l'installation (le cache hors ligne fait déjà 14 Mo) ;
chaque génération consignée dans `docs/ASSETS.md`.

## Le plan « max » (demande de Cyril, 2026-11-06 : « je veux le max, pour que ce soit fou ») — **prix à valider**

Le meilleur modèle (ElevenLabs Music v2.5), des boucles de 3 minutes (moins de répétition), chaque lieu **le jour et la
nuit**, des thèmes pour les grands moments, des notes courtes pour les récompenses, et **quatre variantes par morceau**
(le maximum par demande) pour garder la meilleure. Prix vérifiés sans générer : 0,1453 crédit la seconde, une variante.

| Lot | Contenu | Durée | 1 variante | 4 variantes |
|---|---|---|---|---|
| A · Les lieux, jour et nuit | Gardebois, Canopéa, Ironheart, Sept-Portes, Aetherhaven, Coralia, Marche-Mère, Khrysos, le souterrain (la Gare, les voies, les cryptes), la route (carte du monde) : 20 boucles de 3 min | 60 min | 523,20 | 2 092,80 |
| B · Les thèmes | le thème principal (écran titre, 3 min) ; le combat ; le combat contre un gardien (le Golem) ; la veillée ; les Échos ; la dame en gris ; les sept caisses (2 min chacun) ; la chute (1 min) | 16 min | 139,52 | 558,08 |
| C · Les notes courtes | quête terminée, Récit retenu, niveau gagné, Écho recueilli, caisse trouvée, veillée réussie (10 s chacune) | 1 min | 8,72 | 34,88 |
| D · La berceuse de Maëlis | fredonnée (1 min) ; chantée (1 min, avec les paroles ci-dessous) | 2 min | 17,44 | 69,76 |
| **Total** | **34 morceaux** | **79 min** | **688,88** | **2 755,52** |

**Les paroles de la berceuse** (Cyril : « je ne suis pas bon en paroles de berceuse » ; écrites par Claude le
2026-11-07, sur délégation). Le premier couplet est celui que le jeu donne déjà (le Récit « La berceuse de Maëlis ») ;
Nell chante « le deuxième couplet » chez elle : les voici, avec un troisième pour la minute chantée. Une voix de femme,
douce, lente, presque parlée, sans instrument ou avec une seule corde pincée :

> Dors sous la feuille, dors sous le vent,
> la lanterne veille et le bois t'entend.
> Si tu t'égares au bout du chemin,
> suis ma voix : je te tiens la main.
>
> Dors sous la mousse, dors sous la pluie,
> une luciole garde la nuit.
> Si le sommeil te prend en chemin,
> je dirai ton nom jusqu'au matin.
>
> Dors sous l'écorce, dors sous le temps,
> l'Arbre se souvient de tous ses enfants.
> Si tu m'oublies au bout du chemin,
> chante encore : je te tiens la main.

Le troisième couplet répond à l'histoire de la quête : Nell a oublié la berceuse de sa mère, et c'est en la chantant
qu'elle la retrouve.

Le compte est à 0 crédit : il faut le pack de 4 000 crédits (les packs : 500, 1 000, 2 000, 4 000). Entre les deux :
deux variantes par morceau, 1 377,76 crédits. Avec quatre variantes, 136 morceaux à écouter : une page d'écoute dans le
jeu (mode test) pour comparer et choisir vite. Côté code, sans crédits : un chef d'orchestre (le lieu, le moment, le
combat, les fondus), un réglage « Musique », les notes courtes sur les récompenses, la musique mise en cache à la
première écoute (≈ 55 Mo en mono 96 kbit/s, trop pour l'installation hors ligne).

## Sur téléphone (essai de Cyril, 2026-11-04 : « sur le tel, je n'ai pas entendu de son »)

Le site servait bien les sons (vérifié) ; deux causes possibles côté téléphone, corrigées (`src/audio/mobile.ts`) :

- **l'interrupteur silencieux de l'iPhone** coupe l'audio des pages web : le jeu se déclare désormais lecteur
  (`navigator.audioSession.type = 'playback'`, Safari 16.4 et plus) ; il suit alors les boutons de volume, comme une
  vidéo, et le volume des options reste le moyen de le faire taire ;
- **l'audio en veille** : chaque toucher, clic ou touche le réveille, et le retour du jeu au premier plan aussi.

Vérifié en émulation de téléphone dans Chromium (audio en veille avant le premier toucher, actif après) ; le
comportement propre à l'iPhone ne peut se vérifier que sur l'appareil.

## Deuxième essai (Cyril, 2026-11-04 : « les pas font juste un bruit métallique », « en combat, un bruit comme si on récupérait une pièce »)

Mesuré par le calcul (un haut-parleur de téléphone ne joue presque rien sous 300 Hz) : les pas et le coup porté
n'avaient que 13 à 17 % de leur énergie au-dessus de 300 Hz : sur le téléphone, il ne restait qu'un claquement, et
en combat on n'entendait guère que le soin, deux notes de clochette montantes, le son d'une pièce ramassée.

- **Les pas** : le talon puis la pointe, dans les médiums (380 à 520 Hz), quelques craquements de brindilles ; quatre
  variantes ; 77 à 82 % de l'énergie au-dessus de 300 Hz.
- **Le coup porté** : un claquement sec (1,1 kHz), un choc qui descend de 320 à 170 Hz, un peu de grain ; 55 %.
- **Le soin** : plus de clochette ; un accord chaud qui monte et s'éteint, un souffle de feuilles.
- **Le train** : le roulement des roues sur les joints des rails (« ta-dam ») et la vapeur plus présents ; 53 %.
- Un test (`src/audio/sfx.test.ts`) garde chaque son de pas, de coup, de soin et de dialogue audible sur un téléphone
  (plus de la moitié de l'énergie au-dessus de 300 Hz).

