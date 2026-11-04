# Le son

Étude du 2026-11-03, vague 3 (J1 à J3). Décision de Cyril (2026-11-04) : **les bruitages d'abord, fabriqués par le
code** ; les ambiances et la berceuse viendront **à la fin, de Higgsfield**, avec le reste des générations.

## Les bruitages (faits)

Fabriqués par `npm run sfx` (`scripts/generate-sfx.mjs`) : des synthèses (bruit filtré, sinusoïdes, enveloppes) à
graine fixe, toujours identiques ; fichiers WAV mono 22 050 Hz dans `public/audio/sfx/` (≈ 420 Ko), chargés au
démarrage (`src/audio/sfx.ts`), gardés hors ligne. Le volume des options s'applique à tous ; chacun a son niveau.

| Son | Quand | Niveau |
|---|---|---|
| `pas-1`, `pas-2` | chaque pas du héros sur la carte, un pied puis l'autre | très bas (0,16) |
| `coup` | un coup qui porte, au combat (héros, compagnons, ennemis) | 0,6 |
| `rate` | un coup qui manque | 0,45 |
| `soin` | un soin au combat (Liane, la rebouteuse, la Guérison du cristal) | 0,5 |
| `dialogue` | l'ouverture d'un dialogue : un froissement de parchemin | 0,3 |
| `objet` | un objet ou des Fers reçus (dialogue, butin d'un combat gagné) | 0,5 |
| `train` | **le train qu'on entend avant de le voir** : en arrivant à la Gare Engloutie, tant qu'on n'a pas rencontré l'Écho du dernier train ; un grondement lointain qui monte, la vapeur qui s'accélère, un sifflet au loin (7 s) | 0,55 |

## Plus tard : Higgsfield (≈ 80 crédits, à valider par Cyril au moment de générer)

Le connecteur sait faire de la musique (ElevenLabs Music) et des voix, **pas de bruitages** (son modèle de bruitages
est réservé à son outil de jeux). Prévu : quatre ambiances de 2 minutes en boucle (forêt, industrie, pierre,
souterrain ; ≈ 17,4 crédits chacune, coût vérifié sans générer) et la berceuse de Maëlis fredonnée (≈ 1 min, ≈ 9
crédits ; chantée, il faudrait ses paroles). Avant : une fiche de style sonore ; chaque génération consignée dans
`docs/ASSETS.md`.
