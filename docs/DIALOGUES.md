# Dialogues — texte à relire

Document **généré** à partir de `src/data/dialogues/*.json` (`npm run dialogues`) : ne pas le modifier à la main.
Statut des textes (validé ou à valider) : voir `docs/univers/personnages/pnj.md`, `docs/univers/lieux/gare-engloutie.md`
et, pour Canopéa et les rencontres en voyage, `docs/univers/lieux/canopee.md` et `docs/gdd/carte-du-monde.md`.

Légende : **[Perception 4]** = test d’attribut ou de compétence (option visible mais grisée si le seuil manque) ;
_(si …)_ = option qui n’apparaît que dans cette situation ; → = où mène la réponse.
**🎲 Discrétion 10** = jet de dé (d20 + modificateur + rang contre 10) : → en cas de réussite, ✗ → en cas d’échec.
🌙 = scène de nuit (le fond s’assombrit).

## Le levier de l’embranchement

_Triage des Cendres_

Commence par : « levier-quete » _(si quête « Le Rail des Cendres » en cours)_, sinon « levier »

### levier

> Le levier de l’embranchement, peint en rouge. Une plaque : « Embranchement de la Cendrière — fermé au trafic ».

- « Laisser le levier. » → **fin**

### goupille

_Effet : retient « indice-aiguillage », +10 XP._

> Graissé de frais. Et la goupille de sécurité, qui bloque le levier la nuit, a été limée net : quelqu’un d’ici l’ouvre et le referme, sans forcer.

- « Noter ça. » → **fin**

### levier-quete

> Le levier de l’embranchement, peint en rouge : « Embranchement de la Cendrière — fermé au trafic ». Pourtant, ses rails brillent comme si l’on y roulait chaque nuit.

- _(sans repère « indice-aiguillage »)_ **[Investigation 2]** « Examiner le mécanisme. » → goupille
- _(sans repère « indice-aiguillage »)_ **[Artisanat 2]** « Démonter le carter. » → goupille
- _(sans repère « pilleurs-vaincus »)_ _(sans repère « pilleurs-suivis »)_ « Attendre la nuit, caché près du levier. » → veille _(+undefined XP)_
- « Laisser le levier. » → **fin**

### veille

_Effet : retient « veille-aiguillage »._

> La nuit tombe sur le triage. Vers trois heures, deux silhouettes en manteau de cendre forcent le levier de l’embranchement. Au loin approche un cliquetis de cristal, sans un souffle de vapeur.

- « Les arrêter ! » → **fin** _(lance le combat « aiguillage-cendres »)_
- **🎲 Discrétion 11** « Les laisser faire, et suivre le convoi. » → suivre, ✗ → veille-rate

### suivre

_Effet : retient « pilleurs-suivis », retient « cendriere-ouverte », +15 XP._

> Une machine trapue, sans cabine ni conducteur, attelle trois wagons et quitte la grande voie. Tu la suis dans l’ombre, par l’embranchement, jusque sous les terrils.

- « Suivre jusqu’au bout. » → **fin** _(mène à « Ironheart — La Cendrière »)_

### veille-rate

> Un caillou roule sous ta botte. Les silhouettes se retournent : — On nous guette ! Elles lâchent le levier et foncent sur toi.

- « Se défendre ! » → **fin** _(lance le combat « aiguillage-cendres »)_
- « Fuir dans l’ombre des wagons. » → **fin**

## Aïlis Feuillevent

_Grand-mère de Malo_

Commence par : « flute » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Flûte d’Anselme »)_, sinon « inquiete » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « voix » _(si repère « voix-anselme »)_ _(sans repère « ailis-reconfortee »)_, sinon « apres-chant » _(si quête « Le chant d’Anselme » terminée)_, sinon « accueil »

### accueil

> Entre, entre. Tu as croisé mon petit-fils, je parie ? Malo court partout comme un écureuil. Moi, je ne vais plus bien loin : jusqu’au Bosquet des Échos, chaque soir, pour parler à mon Anselme.

- « Parler à un arbre ? » → arbre
- « Au revoir, Aïlis. » → **fin**

### arbre

_Effet : retient « anselme-connu »._

> Anselme repose au pied d’un jeune arbre, en bas, comme le veut le Rite du Retour. Et j’ai gravé son nom au Bosquet. Je lui raconte ma journée ; parfois, le bois est tiède sous ma main. Les savants disent que c’est le soleil. Moi, je sais que c’est lui.

- « Merci de me l’avoir raconté. » → accueil

### voix

> Tu reviens du Bosquet ? Tes yeux brillent…

- « J’ai touché le nom d’Anselme, au Bosquet. J’ai entendu quelqu’un fredonner. » → reconfort _(retient « ailis-reconfortee », +15 XP)_
- « Ce n’est rien. » → accueil

### reconfort

> Aïlis pose sa main sur la tienne. — La chanson des cerfs-lucioles… C’est elle que je fredonnais en gravant son nom. Alors le Bosquet la garde. Merci : tu viens de me rendre un petit morceau de lui.

- « Il veille sur vous deux. » → **fin**

### flute

> Qu’est-ce que tu tiens là, mon enfant ? Une flûte… elle sent le bois d’en bas, le bois de la mousse.

- _(si repère « flute-fidele »)_ « Elouan l’a taillée dans une branche de l’arbre d’Anselme. Pour vous. » → chant-fidele _(reprend 1 × « Flûte d’Anselme », termine la quête « Le chant d’Anselme », retient le Récit « Le chant d’Anselme », +40 XP)_
- _(sans repère « flute-fidele »)_ « Elouan l’a taillée dans une branche de l’arbre d’Anselme. Pour vous. » → chant-carnet _(reprend 1 × « Flûte d’Anselme », termine la quête « Le chant d’Anselme », retient le Récit « Le chant d’Anselme », +30 XP)_
- « Ce n’est rien. Je repasserai. » → **fin**

### chant-fidele

> 🌙 Aïlis porte la flûte à ses lèvres. Les premières notes tremblent, puis la chanson des cerfs-lucioles monte, exactement comme elle la fredonnait en gravant le nom. Elle s’arrête, la main sur le bois. — Il est tiède. Il est là.

- « Il veille sur vous deux. » → merci

### chant-carnet

> 🌙 Aïlis joue la chanson du carnet, puis s’arrête et sourit. — Ce n’est pas tout à fait la mienne. Ilyane a toujours eu sa façon… Elle reprend, change une note, puis deux. Cette fois, c’est la sienne : elle vient de s’en souvenir.

- « Elle était là, tout près. » → merci

### merci

> Je jouerai pour lui chaque soir, au Bosquet. Et quand Malo sera grand, je lui apprendrai. Merci, toi qui viens de si loin pour une vieille femme et son arbre.

- « Merci à vous, Aïlis. » → **fin**

### apres-chant

> Entre, entre ! Tu entends ? Non, bien sûr, c’est le soir que je joue. Malo dit que les oiseaux répondent. Moi, je dis que c’est Anselme qui les fait chanter.

- « Parlez-moi encore d’Anselme. » → arbre
- « Au revoir, Aïlis. » → **fin**

### inquiete

> Je suis allée au Bosquet hier soir. J’ai posé la main sur le nom d’Anselme et… rien. Le bois était froid. Comme s’il était parti une seconde fois.

- _(si quête « Le chant d’Anselme » terminée)_ « Vous avez encore sa chanson. » → chanson-reste
- « Parlez-moi de l’arbre où il repose. » → arbre
- « Le Triumvirat m’a demandé de comprendre. Je trouverai. » → **fin**

### chanson-reste

> Aïlis serre la flûte contre elle. — Oui… Oui, c’est vrai. Le bois du Bosquet a oublié, mais la flûte, elle, n’a rien oublié. Va, mon enfant. Trouve ce qui lui fait mal, à notre forêt.

- « Je trouverai. » → **fin**

## Un très vieil arbre gravé

_Bosquet des Échos_

Commence par : « silence » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « arbre »

### arbre

> Un très vieil arbre, couvert de colonnes de signes gravés en verdani. En grandissant, le bois a fendu certains signes ; personne ne les corrige.

- **[Mémoire 3]** _(sans repère « recit-voix-ecorce-recu »)_ « Poser la main sur les signes gravés et écouter. » → voix _(retient « recit-voix-ecorce-recu », retient le Récit « Les voix du Bosquet », +10 XP)_
- **[Mémoire 3]** _(si repère « recit-voix-ecorce-recu »)_ « Écouter encore les voix. » → voix
- « Lire quelques noms. » → noms
- « Partir. » → **fin**

### voix

> Des souvenirs qui ne sont pas les tiens montent sous tes doigts : des mains qui gravent, des rires, une berceuse, un nom murmuré. Ceux qui ont gravé ici te parlent encore.

- « Laisser les voix se taire. » → **fin**

### noms

> Des noms, des légendes, de petits dessins de feuilles. Là où le bois a fendu un signe, la fente fait désormais partie du souvenir.

- « Partir. » → **fin**

### silence

> Le très vieil arbre gravé. Sous ta main, les signes restent froids : ni voix ni souvenir ne montent du bois.

- **[Mémoire 3]** _(sans repère « piste-racines »)_ « Écouter plus profond. » → pente _(retient « piste-racines », +10 XP)_
- **[Investigation 2]** _(sans repère « piste-racines »)_ « Examiner le pied de l’arbre. » → seve _(retient « piste-racines », +10 XP)_
- « Partir. » → **fin**

### pente

> Tout au fond du silence, une sensation : comme une racine qu’on tire, vers le bas, très loin sous la ville. Ce qui fait taire le Bosquet est en bas, sur le Sol des Racines.

- « Retirer la main. » → **fin**

### seve

> Au pied de l’arbre, une sève claire suinte entre les planches, comme d’une blessure. Les racines du Bosquet descendent jusqu’au sol… et, en bas, quelque chose les a tranchées.

- « Partir. » → **fin**

## Le nom d’Anselme

_Bosquet des Échos_

Commence par : « muet » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « arbre »

### arbre

> Un jeune arbre gravé d’un nom, en lettres de verdani encore nettes : Anselme Feuillevent. Quelqu’un a noué un ruban vert autour de son tronc.

- **[Mémoire 3]** « Poser la main sur le nom gravé. » → voix _(retient « voix-anselme »)_
- « Laisser l’arbre en paix. » → **fin**

### voix

> Sous tes doigts, un souvenir qui n’est pas le tien : une main de vieille femme qui grave, lettre après lettre, en fredonnant une chanson douce, une chanson de cerfs-lucioles. Puis plus rien, que le vent.

- « Retirer doucement la main. » → **fin**

### muet

> Le nom d’Anselme Feuillevent, net dans le bois. Sous ta main, l’écorce reste froide et muette. Même lui se tait.

- « Retirer la main. » → **fin**

## L’arbre d’Anselme

_Sol des Racines_

Commence par : « arbre-quete » _(si quête « Le chant d’Anselme » en cours)_ _(sans repère « branche-prise »)_, sinon « arbre »

### arbre

> Au pied d’un jeune arbre, la mousse est encore fraîche. Un ruban vert est noué autour du tronc, le même qu’au Bosquet, tout là-haut. Ici repose Anselme Feuillevent.

- « Poser la main sur l’écorce. » → chaleur
- « Partir. » → **fin**

### arbre-quete

> Au pied d’un jeune arbre, un ruban vert noué autour du tronc : ici repose Anselme Feuillevent. Des branches tombées jonchent la mousse.

- « Ramasser une branche sèche. » → prise _(donne 1 × « Branche de l’arbre d’Anselme », retient « branche-prise »)_
- **[Artisanat 2]** « Toquer sur les branches, pour trouver celle qui chante. » → chantante _(donne 1 × « Branche de l’arbre d’Anselme », retient « branche-prise », +10 XP)_
- « Poser la main sur l’écorce. » → chaleur
- « Partir. » → **fin**

### prise

> Tu choisis une branche sèche, droite et légère, et tu la glisses dans ta besace en murmurant un merci. On ne sait jamais qui écoute.

- « Remonter vers la nacelle. » → **fin**

### chantante

> Tu toques sur les branches, une à une. La plupart sonnent mat. Une seule répond, claire comme une goutte d’eau : celle-là chante déjà. Tu la glisses dans ta besace en murmurant un merci.

- « Remonter vers la nacelle. » → **fin**

### chaleur

> L’écorce est tiède, comme une main qu’on vient de lâcher. Pas de voix, pas d’image : seulement cette chaleur, et un tour de main qu’on devine dans le pli des branches.

- « Retirer la main. » → **fin**

## Boulon

_Ferrôme, porteur à la gare de l’Ouest_

Commence par : « accueil-quete » _(si quête « L’audience » terminée)_ _(sans repère « boulon-accueilli »)_, sinon « accueil »

### accueil-quete

_Effet : lance la quête « La Clé de Rouille Bleue », retient « boulon-accueilli »._

> Un Ferrôme lourd comme une locomotive soulève trois malles d’une seule main. — Bienvenue à Ironheart. Je m’appelle Boulon. Un sceau d’émeraude à ta ceinture ? Les Verts ne viennent pas souvent. Tu cherches quelque chose, ou quelqu’un ?

- « Un certain Kaelis, des Marches des Cendres. » → kaelis
- « Que faut-il savoir, ici ? » → regles
- « Une caravane pour Gardebois ? » → caravane
- « Merci, Boulon. » → **fin**

### accueil

> — Bonjour. Boulon, porteur de la gare de l’Ouest. Je me souviens de chaque malle que j’ai portée : des milliers. Tu veux savoir quelque chose ?

- _(si quête « La Clé de Rouille Bleue » en cours)_ « Où trouver Kaelis, des Marches des Cendres ? » → kaelis
- « Que faut-il savoir, ici ? » → regles
- « Une caravane pour Gardebois ? » → caravane
- « Au revoir, Boulon. » → **fin**

### regles

> — Garde ton laissez-passer sur toi : les visières rouges vérifient. Bois au Puits Trois, jamais au Un ni au Deux. Et on dit qu’il ne faut pas regarder un Ferrôme dans les yeux plus de deux secondes. Moi, tu peux. Je ne mords pas.

- « Merci, Boulon. » → **fin**

### kaelis

_Effet : retient « marche-cendres-indice »._

> — Kaelis ne tient boutique sur aucune carte. Les gens des forges disent : « Cherche le trou entre deux fonderies froides, et ne dis à personne que tu l’as trouvé. » À l’est, après le Puits Trois.

- « Merci, Boulon. » → **fin**

### caravane

> — La Compagnie des Lisières charge ici, entre deux trains : les caisses de l’atelier Cendrefer pour Gardebois. Quinze Fers ; rien pour les gens de la Compagnie. Je porte ta malle.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-gardebois
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-gardebois _(−15 Fers)_
- « Une autre fois. » → **fin**

### trajet-gardebois

> Boulon hisse ta malle d’une seule main. La caravane quitte la cendre de Ferros, passe la frontière, retrouve la forêt. Le soir, les lanternes du Marché des Lisières s’allument entre les arbres : Gardebois.

- « Descendre du chariot. » → **fin** _(+undefined XP, +undefined XP, mène à « Gardebois — Marché des Lisières »)_

## Brann Martelroux

_Apprenti de Tobias_

Commence par : « apres » _(si quête « La caisse égarée » terminée)_, sinon « rendu » _(si quête « La caisse égarée » en cours)_ _(si repère « caisse-recuperee »)_, sinon « attente » _(si quête « La caisse égarée » en cours)_, sinon « demande »

### demande

> Ah ! Pardon, je range. Enfin, j’essaie. J’ai perdu une caisse d’outils en tombant du chariot, sur la route de l’est. Si maître Cendrefer l’apprend… Et deux Rôdeurs-Épine tournent autour : je n’ose pas y retourner.

- « Je vais la chercher. » → merci _(lance la quête « La caisse égarée »)_
- « Bon courage, Brann. » → **fin**

### merci

> Vraiment ? Elle est au sud de la route, après le pont. Les Rôdeurs n’aiment pas la fumée, à ce qu’on dit… ou alors on passe en douce. Moi, je cours vite, mais dans le mauvais sens.

- « J’y vais. » → **fin**

### attente

> La caisse ? Toujours là-bas, avec les Rôdeurs ?

- « Je m’en occupe. » → **fin**

### rendu

> Ma caisse ! Tous les outils sont là ! Tiens, c’est tout ce que j’ai… Et je dirai à maître Cendrefer de te faire un prix, promis.

- « Merci, Brann. » → **fin** _(termine la quête « La caisse égarée », +25 Fers, retient « remise-cendrefer », +25 XP)_

### apres

> Maître Cendrefer m’a laissé ranger tout seul, aujourd’hui. C’est une forme de confiance, je crois.

- « … » → **fin**

## Une boîte de fer

_Objet_

Commence par : « vide » _(si repère « rencontre-cache-ouverte »)_, sinon « boite »

### boite

> Sous une dalle fendue, une boîte de fer rouillée. Quelqu’un l’a cachée là… il y a longtemps, ou hier.

- « L’ouvrir. » → ouverte _(retient « rencontre-cache-ouverte », +8 Fers, donne 1 × « Bandage »)_
- « La laisser. » → **fin**

### ouverte

> Quelques Fers et un bandage propre, enveloppés dans un vieux chiffon. Un petit mot dit seulement : « Pour qui en aura besoin. »

- « Merci, inconnu. » → **fin**

### vide

> La boîte est vide.

- « Partir. » → **fin**

## La caisse égarée

_Objet_

Commence par : « libre » _(si repère « rodeurs-caisse-vaincus »)_, sinon « libre » _(si repère « rodeurs-caisse-partis »)_, sinon « gardee » _(si quête « La caisse égarée » en cours)_, sinon « inconnue »

### inconnue

> Une caisse d’outils marquée du sceau Cendrefer, tombée dans l’herbe. Deux Rôdeurs-Épine tournent autour en grondant.

- « S’éloigner. » → **fin**

### gardee

> La caisse de Brann est là, dans l’herbe. Deux Rôdeurs-Épine la flairent en grondant, sans la quitter des yeux.

- **🎲 Survie 12** « Les éloigner avec une branche fumante. » → eloignes, ✗ → reperes
- **🎲 Discrétion 13** « Se glisser jusqu’à la caisse sans bruit. » → prise, ✗ → reperes
- « Les affronter. » → **fin** _(lance le combat « caisse-egaree »)_
- « Revenir plus tard. » → **fin**

### eloignes

_Effet : retient « rodeurs-caisse-partis »._

> La fumée âcre fait éternuer les Rôdeurs, qui détalent dans les fourrés. La caisse est à toi.

- « Prendre la caisse. » → **fin** _(retient « caisse-recuperee »)_

### prise

_Effet : retient « caisse-recuperee », retient « rodeurs-caisse-partis »._

> Pas après pas, tu tires la caisse jusqu’au chemin. Les Rôdeurs n’ont rien vu, et finissent par s’en aller.

- « … » → **fin**

### reperes

> Un Rôdeur-Épine relève la tête et gronde. Les deux bêtes se mettent en garde !

- « Se défendre. » → **fin** _(lance le combat « caisse-egaree »)_
- « Reculer prudemment. » → **fin**

### libre

> La caisse de Brann t’attend dans l’herbe, sans personne pour la garder.

- « Prendre la caisse. » → **fin** _(retient « caisse-recuperee »)_
- « Plus tard. » → **fin**

## Caisse de prospection

_Objet_

Commence par : « vide » _(si repère « caisse-prospection-ouverte »)_, sinon « pleine »

### pleine

> Une vieille caisse de prospection, abandonnée là par une équipe d’avant Brisefer. Sous des outils rouillés, une bourse oubliée, couverte de poussière.

- « Prendre la bourse. » → **fin** _(retient « caisse-prospection-ouverte », +25 Fers)_
- « La laisser. » → **fin**

### vide

> La caisse ne contient plus que des outils rouillés.

- « … » → **fin**

## Les carnets d’Ilyane

_Objet_

Commence par : « carnets »

### carnets

> Des dizaines de carnets couverts de l’écriture serrée d’Ilyane : des récits recueillis dans tout Verdantis. Sur la page ouverte : « Ce qu’on oublie ne disparaît pas tout à fait. Il attend qu’on revienne. »

- « Refermer le carnet. » → **fin**

## Cerfs-Lucioles

_Faune de Verdantis_

Commence par : « partis » _(si repère « rencontre-cerfs-vus »)_, sinon « cerfs »

### cerfs

> Une dizaine de cerfs traversent la clairière sans bruit. Leurs bois s’allument et s’éteignent, comme des lanternes qui respireraient.

- « Rester immobile et regarder. » → regard _(retient « rencontre-cerfs-vus », +10 XP)_
- **[Survie 2]** « Les suivre sans un bruit. » → suivre _(retient « rencontre-cerfs-vus », +10 XP, +10 PV)_
- « Les laisser passer. » → **fin**

### regard

> Le plus grand s’arrête et te regarde un long moment, puis repart. Quand la dernière lumière disparaît, tu te rends compte que tu retenais ton souffle.

- « Reprendre son souffle. » → **fin**

### suivre

> Ils te mènent jusqu’à une source claire, puis s’évanouissent dans les fougères. L’eau est fraîche et douce ; tu te sens mieux.

- « Boire, puis repartir. » → **fin**

### partis

> La clairière est redevenue sombre et silencieuse.

- « Partir. » → **fin**

## Le chef de caravane

_Compagnie des Lisières_

Commence par : « accueil »

### accueil

> Un homme au chapeau de cuir mâchonne un bout de viande séchée. — Le chef de caravane, c’est moi. On redescend vers Gardebois demain, et tous les jours d’après. Tu en es ?

- « Pour Gardebois. » → gardebois
- « Pas aujourd’hui. » → **fin**

### gardebois

> — 15 Fers. Rien si tu portes la marque de la Compagnie : on ne fait pas payer ceux qui nous ont rendu une sacoche.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-gardebois
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-gardebois _(−15 Fers)_
- « Une autre fois. » → accueil

### trajet-gardebois

> La caravane roule sans hâte, de borne en borne. Le soir, les lanternes du Marché des Lisières s’allument une à une entre les arbres : Gardebois.

- « Descendre du chariot. » → **fin** _(+undefined XP, +undefined XP, mène à « Gardebois — Marché des Lisières »)_

## La colporteuse

_Marchande ambulante_

Commence par : « accueil »

### accueil

> Bonne route à toi ! Je vais de village en village avec ma carriole. Bandages, cordes, baumes… Un petit quelque chose pour le voyage ?

- « Voyons ta marchandise. » → **fin** _(ouvre le Troc)_
- « Quelles nouvelles des routes ? » → nouvelles
- « Bonne route. » → **fin**

### nouvelles

> On dit que les Loups de Rouille descendent plus au sud cette année, du côté de la frontière. Et à Canopéa, le Conseil ne dort plus : tout le monde parle des forages de Ferros.

- « Merci. » → accueil

## Le commis de Ferros

_Compagnie des Lisières_

Commence par : « presse » _(si quête « La caravane de midi » pas commencée)_, sinon « attente » _(si quête « La caravane de midi » en cours)_ _(si l’on porte « Sacoche de la Compagnie »)_, sinon « rien »

### presse

> Pas le temps, pas le temps ! Enfin… si, maintenant : j’ai raté la caravane de midi. Et cette sacoche devait partir avec elle, pour Canopéa, avant ce soir ! Mon patron va me suspendre par les bretelles à un Arbre-Titan.

- « Je peux la porter à Canopéa. » → merci _(donne 1 × « Sacoche de la Compagnie », lance la quête « La caravane de midi »)_
- « Qu’y a-t-il dedans ? » → dedans
- « Bon courage. » → **fin**

### dedans

> Des lettres de change, des échantillons, et la viande séchée du chef de caravane. Il y tient plus qu’aux lettres, entre nous. Rien de dangereux… sauf pour les Loups de Rouille, qui ont du flair.

- « Je peux la porter à Canopéa. » → merci _(donne 1 × « Sacoche de la Compagnie », lance la quête « La caravane de midi »)_
- « Bon courage. » → **fin**

### merci

> Vrai de vrai ? Tiens ! À Canopéa, donne-la à Véline, à la Grande Nacelle : la caravane s’arrête au pied de sa nacelle. Prends la route de l’ouest, par la carte. Et gare aux Loups de Rouille, près de la frontière !

- « J’y vais. » → **fin**

### attente

> Tu es encore là ? Canopéa, la Grande Nacelle, Véline ! Vite, vite, avant que le chef de caravane ne mange ses bottes.

- « J’y vais. » → **fin**

### rien

> Pas le temps, pas le temps !

- « … » → **fin**

## La convoyeuse

_Compagnie des Lisières, la caravane de midi_

Commence par : « accueil »

### accueil

> Une femme en manteau de route vérifie les sangles d’un chariot. — Compagnie des Lisières ! La caravane part à midi, tous les jours que la forêt fait. Où vas-tu ?

- « À Canopéa. » → canopee
- _(si quête « L’audience » terminée)_ « À Ironheart. » → ironheart
- « Pas aujourd’hui. » → **fin**

### canopee

> — 15 Fers, et tu dors sur les sacs de farine. Rien pour les gens de la Compagnie : on ne fait pas payer la famille.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-canopee
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-canopee _(−15 Fers)_
- « Une autre fois. » → accueil

### ironheart

> — Ironheart, par la frontière. Ton sauf-conduit du Triumvirat suffira aux douaniers. 15 Fers, rien pour la Compagnie.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-ironheart
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-ironheart _(−15 Fers)_
- « Une autre fois. » → accueil

### trajet-canopee

> La caravane suit la route des Lisières. Les chariots grincent ; on chante fort pour tenir les Loups de Rouille à distance. À la tombée du jour, au pied des Arbres-Titans, la Grande Nacelle te monte jusqu’aux cimes.

- « Monter jusqu’aux cimes. » → **fin** _(+undefined XP, +undefined XP, mène à « Canopéa — La Grande Nacelle »)_

### trajet-ironheart

> La caravane passe la frontière de Ferros. La forêt s’éclaircit, la terre devient cendre, et le ciel prend la couleur de la rouille. Au soir, la gare de l’Ouest d’Ironheart.

- « Descendre du chariot. » → **fin** _(+undefined XP, +undefined XP, mène à « Ironheart — Les Forges-Basses »)_

## Cristal de veille

_Objet_

Commence par : « cristal »

### cristal

> Le cristal de veille luit doucement. Ilyane dit qu’il tient les mauvais rêves à distance. En le regardant, tu sens ta fatigue s’apaiser.

- « Se reposer un instant. » → **fin** _(+40 PV)_
- « S’éloigner. » → **fin**

## Dorna Vissard

_Pension de la Bielle_

Commence par : « cristal » _(si quête « undefined » undefined)_ _(sans repère « dorna-cristal »)_, sinon « accueil-2 » _(si quête « undefined » undefined)_, sinon « accueil-3 » _(si quête « undefined » undefined)_, sinon « accueil »

### accueil

> — Pension de la Bielle ! Lit de camp et soupe épaisse, comme à l’usine. Nom d’une gueuse, tu as l’air d’avoir marché des jours !

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Au revoir. » → **fin**

### nouvelles

> — On dit qu’un convoi sans conducteur passe encore sur la vieille ligne, la nuit. On dit que les Marches des Cendres paient cher les vieilleries des gares. Et on dit que les Archives veulent tout savoir. Moi, je dis : mange ta soupe.

- _(si quête « Le Rail des Cendres » pas commencée)_ « Et au triage des Cendres ? » → triage
- « Merci, Dorna. » → accueil

### triage

> — Au triage, à l’est, les convois de minerai partent seuls la nuit. Les cheminots ne roulent plus qu’au jour, et Varka, leur cheffe, fait la tête de quelqu’un qui cherche de l’aide.

- « Merci, Dorna. » → accueil

### soupe

> Une soupe épaisse, du pain noir : de quoi tenir jusqu’au soir.

- « Merci. » → accueil

### servir

> — Une soupe épaisse, ou un lit de camp ? Les lits grincent, mais ils tiennent. Comme les gens d’ici.

- **[8 Fers]** « Une soupe épaisse. » → soupe _(−8 Fers, +15 PV)_
- **[8 Fers]** « Un lit jusqu’au matin. » → dodo _(−8 Fers, +undefined XP)_
- **[8 Fers]** « Un lit jusqu’à la nuit. » → dodo _(−8 Fers, +undefined XP)_
- « Rien, merci. » → accueil

### dodo

> Une soupe de grain, du pain noir, et un lit de camp qui grince. Au réveil, tes forces sont revenues.

- « Se lever. » → **fin**

### accueil-2

> — Pension de la Bielle ! Ce matin, le registre du Puits Trois a encore changé : deux transferts de plus vers les Manufactures. Assieds-toi, un registre, ça ne se mange pas.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Au revoir. » → **fin**

### accueil-3

> — Pension de la Bielle ! Les Litanies ont commencé avant l’aube, aujourd’hui : un contremaître pressé. Nom d’une gueuse, on n’entend plus ses propres pensées.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Au revoir. » → **fin**

### cristal

_Effet : retient « dorna-cristal »._

> Dorna baisse la voix. — Range ce cristal sous ta chemise, tu veux ? Ici, on tient des listes. Les patrouilleurs notent qui en porte, et les pyromanciens n’aiment pas qu’on joue au feu sans eux.

- « Merci du conseil. » → accueil

## L’Écho de la berceuse

_Écho du Passé_

Commence par : « chant » _(si quête « La berceuse oubliée » en cours)_, sinon « lointain »

### lointain

> Au pied de l’Arbre-Titan, une silhouette translucide fredonne. Quand tu t’approches, la mélodie s’efface, comme si elle n’était pas pour toi.

- « S’éloigner. » → **fin**

### chant

> Une jeune femme translucide fredonne, les yeux fermés. C’est la voix de Maëlis, plus jeune. Les mots t’échappent à peine chantés.

- **[Mémoire 4]** « Entrer dans l’Écho et retenir la chanson. » → retenue
- **[Érudition 2]** « Noter les vers, un à un, sans en perdre un mot. » → retenue
- **🎲 Investigation 12** « Écouter encore, et encore. » → retenue, ✗ → echappe
- « S’éloigner. » → **fin**

### retenue

_Effet : retient « berceuse-recueillie », retient le Récit « La berceuse de Maëlis »._

> La chanson se dépose en toi, entière. L’Écho sourit, puis se dissout en poussière dorée, apaisé.

- « Retourner chez les Lunelierre. » → **fin**

### echappe

> Les mots glissent entre tes doigts comme de l’eau. L’Écho fredonne toujours : tu pourras réessayer.

- « … » → **fin**

## Un Écho

_Une voix qui fredonne_

Commence par : « ecoute »

### ecoute

_Effet : retient « echo-chanson-entendu »._

> Une silhouette bleu pâle, bordée d’or, se penche sur quelque chose qu’on ne voit pas, et fredonne une berceuse dans une langue qui n’existe pas encore. Sur la fin, la voix se casse, et reprend.

- **[Mémoire 3]** _(sans repère « melodie-retenue »)_ « Retenir la mélodie. » → melodie _(retient « melodie-retenue », +10 XP)_
- « Laisser la chanson finir. » → **fin**

### melodie

> La mélodie se pose en toi, note après note. Tu ne comprends pas les mots, mais tu sais pour qui on chante ainsi : pour quelqu’un qui s’endort, et qu’on ne veut pas quitter.

- « La garder. » → **fin**

## L’Écho du dernier train

_Écho du Passé_

Commence par : « apaise » _(si repère « echo-dernier-train-vu »)_, sinon « approche »

### approche

> Le quai tremble sous tes pieds. Des silhouettes de l’Ancien Monde se dessinent dans la lumière : une foule se presse vers un train, les mains levées. Des enfants rient à une fenêtre. Un sifflet déchire l’air, trois mille ans trop tôt.

- **[Mémoire 4]** « Entrer dans l’Écho. » → interieur _(retient « echo-dernier-train-vu », +15 XP)_
- « Observer sans s’approcher. » → observe _(retient « echo-dernier-train-vu », +10 XP)_
- « S’éloigner. » → **fin**

### interieur

_Effet : retient le Récit « Le Savant Corvan »._

> Un instant, tu es sur ce quai disparu. Une voix te revient, celle d’un savant qu’on emmenait loin du danger : « Dis-leur, pour Corvan. Dis-leur que même réussir peut tout détruire. » Puis l’Écho se dissipe, apaisé pour un temps.

- « … » → **fin**

### observe

> Tu restes en retrait. Les images s’effacent sans te livrer leurs secrets, mais tu as vu assez pour comprendre : ce train n’aurait pas dû partir, et pourtant il est parti.

- « … » → **fin**

### apaise

> L’Écho s’est apaisé, pour un temps. Sur le quai, les silhouettes ne sont plus qu’un frisson de lumière, et le sifflet un souffle lointain.

- **[Mémoire 4]** « Entrer dans l’Écho. » → interieur
- « S’éloigner. » → **fin**

## Un Écho

_Au fond de la galerie_

Commence par : « apaise » _(si quête « Les Échos sous la Forge » terminée)_, sinon « ecrit-archives » _(si repère « echo-releve »)_, sinon « ecrit-lettre » _(si repère « echo-lettre »)_, sinon « promesse »

### promesse

_Effet : retient « promesse-entendue »._

> Au fond de la galerie, un Écho plus net que les autres : quelqu’un se tient face au vide et parle à des gens qu’on ne voit pas. Une seule phrase, encore et encore : « On se retrouvera. » Puis l’Écho se tourne vers toi, comme s’il attendait.

- « L’écouter jusqu’au bout. » → choix
- _(si quête « Les Échos sous la Forge » en cours)_ _(sans repère « echos-dechaines »)_ « Laisser l’Écho à son silence. » → ignorer _(retient « echos-ignores », termine la quête « Les Échos sous la Forge », +10 XP)_
- « Partir. » → **fin**

### choix

_Effet : retient le Récit « On se retrouvera »._

> L’Écho répète sa promesse, jusqu’au bout cette fois, et ta mémoire la garde. Il attend quelque chose de toi : qu’on le suive, qu’on le garde, ou qu’on le laisse.

- _(si quête « Les Échos sous la Forge » en cours)_ **[Mémoire 3]** _(sans repère « echos-dechaines »)_ « Le suivre, là où il va. » → suivre _(retient « echos-suivis », termine la quête « Les Échos sous la Forge », +50 XP, donne 1 × « Oiseau de fer »)_
- _(si quête « Les Échos sous la Forge » en cours)_ _(sans repère « echos-dechaines »)_ « Le garder par écrit. » → garder
- _(si quête « Les Échos sous la Forge » en cours)_ « Le frapper pour le dissiper. » → frapper
- « Réfléchir encore. » → **fin**

### ignorer

> Tu laisses l’Écho à sa promesse. Il ne te retient pas. En remontant, tu l’entends encore, de plus en plus bas : « On se retrouvera. »

- « Remonter. » → **fin**

### suivre

> Tu suis l’Écho par une faille que tu n’avais pas vue, jusqu’à une niche creusée dans la roche. Il y pose quelque chose qui n’existe plus, et s’efface, apaisé. À sa place, bien réel : un petit oiseau de fer, plié à la main.

- « Le prendre. » → **fin**

### garder

> Garder l’Écho par écrit, pour qu’il ne se perde pas : la berceuse, les mains sur l’enclume, la promesse. Mais pour qui l’écrire ?

- « Pour les Archives : Noam saura le classer. » → archiver _(donne 1 × « Relevé d’un Écho », retient « echo-releve »)_
- « Pour Ilyane, qui saura l’écouter. » → confier _(donne 1 × « Lettre pour Ilyane », retient « echo-lettre »)_
- « Réfléchir encore. » → choix

### archiver

> Tu notes tout, avec la précision qu’on t’a apprise. Noam, aux Archives Centrales, saura où le ranger, s’il existe un endroit pour ce qui n’est d’aucune époque.

- « Remonter. » → **fin**

### confier

> Tu recopies l’Écho dans une lettre pour Ilyane. À Gardebois, elle est loin ; mais Hedda, à l’atelier Cendrefer, fait partir des caisses vers son frère Tobias, au Marché des Lisières.

- « Remonter. » → **fin**

### frapper

> Hesk l’a dit : un Écho qu’on frappe se multiplie, et devient violent. Frapper quand même ?

- « Frapper. » → **fin** _(retient « echos-dechaines », lance le combat « echos-furieux »)_
- « Non. » → choix

### apaise

> L’Écho rejoue sa promesse, plus doucement. « On se retrouvera. » Tu sais maintenant que tu la garderas, toi aussi.

- « Partir. » → **fin**

### ecrit-archives

> L’Écho rejoue sa promesse. Ton relevé est dans ta besace : il attend Noam, aux Archives Centrales.

- « Partir. » → **fin**

### ecrit-lettre

> L’Écho rejoue sa promesse. Ta lettre pour Ilyane est dans ta besace : Hedda, à l’atelier Cendrefer, la fera partir.

- « Partir. » → **fin**

## Elouan Chante-Bois

_Luthier_

Commence par : « apres » _(si quête « Le chant d’Anselme » terminée)_, sinon « flute-prete » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Flûte d’Anselme »)_, sinon « branche » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Branche de l’arbre d’Anselme »)_, sinon « attente » _(si quête « Le chant d’Anselme » en cours)_, sinon « proposition » _(si quête « Le chant d’Anselme » pas commencée)_ _(si repère « anselme-connu »)_, sinon « proposition » _(si quête « Le chant d’Anselme » pas commencée)_ _(si repère « voix-anselme »)_, sinon « accueil »

### accueil

> Chut… écoute. Ce bois-là chante quand le vent passe dedans. Je suis Elouan, luthier. Je ne taille que les branches tombées : à Canopéa, on ne coupe pas un arbre qui vit.

- « Tu peux jouer quelque chose ? » → musique
- « Pourquoi ne pas couper les arbres ? » → arbres
- « Au revoir. » → **fin**

### musique

> Elouan porte une flûte à ses lèvres. La mélodie monte, légère, et quelque part dans les branches, un oiseau lui répond. — Tu vois ? Le bois se souvient du vent.

- « C’était magnifique. » → accueil

### arbres

> Parce qu’ils portent nos aïeux, pardi ! Couper un arbre, ici, c’est un peu comme brûler une bibliothèque. Les gens de Ferros ont du mal à le comprendre.

- « Je comprends. » → accueil

### proposition

> Je suis Elouan, le luthier. Tu connais Aïlis Feuillevent ? Depuis qu’Anselme est parti, elle ne chante plus : sa voix tremble trop, dit-elle. Je voudrais lui tailler une flûte dans une branche tombée de l’arbre d’Anselme, en bas. Mais mes genoux ne descendent plus.

- « J’irai chercher la branche. » → explication _(lance la quête « Le chant d’Anselme »)_
- « Pourquoi une branche de son arbre ? » → pourquoi
- « Pas maintenant. » → **fin**

### pourquoi

> Le Rite du Retour : on met le défunt en terre au pied d’un arbre, et l’arbre garde de lui une chaleur, un tour de main. Une flûte taillée dans sa branche, c’est un peu d’Anselme qui jouera avec elle.

- _(si quête « Le chant d’Anselme » pas commencée)_ « J’irai chercher la branche. » → explication _(lance la quête « Le chant d’Anselme »)_
- « Je comprends. » → **fin**

### explication

> Véline, à la Grande Nacelle, te descendra sur le Sol des Racines. Ramène une branche tombée, rien d’autre. Il me faudra aussi la mélodie : Aïlis la fredonnait en gravant son nom, au Bosquet des Échos. Mirelle, au relais, garde aussi de vieux carnets de chansons.

- « J’y vais. » → **fin**

### attente

> Alors, cette branche ? Une branche tombée de l’arbre d’Anselme, sur le Sol des Racines : Véline te descendra. Et n’oublie pas la mélodie.

- « Rappelle-moi tout. » → explication
- « J’y retourne. » → **fin**

### branche

> Elouan prend la branche, la fait tourner, toque dessus du bout de l’ongle. — Bon bois. Il a déjà du vent dedans. Maintenant, la mélodie : sans elle, je taillerais une flûte muette.

- _(si repère « voix-anselme »)_ « Je l’ai entendue au Bosquet. Je peux te la fredonner. » → taille-fidele _(reprend 1 × « Branche de l’arbre d’Anselme », donne 1 × « Flûte d’Anselme », retient « flute-fidele », +15 XP, retient « flute-taillee »)_
- _(si repère « melodie-carnet »)_ « Mirelle m’a montré la chanson, dans le carnet d’Ilyane. » → taille-carnet _(reprend 1 × « Branche de l’arbre d’Anselme », donne 1 × « Flûte d’Anselme », retient « flute-taillee »)_
- « Où trouver la mélodie ? » → melodie
- « Je reviens. » → **fin**

### melodie

> Aïlis fredonnait en gravant le nom d’Anselme : le Bosquet des Échos a gardé ce souvenir, pour qui sait poser la main sur les signes. Sinon, demande à Mirelle, au relais du Bosquet : elle garde de vieux carnets de chansons.

- « Merci, Elouan. » → **fin**

### taille-fidele

> 🌙 Tu fredonnes ; Elouan écoute, les yeux fermés. Puis il taille, perce, souffle, retaille. Le soir tombe sur l’atelier. Enfin la flûte chante, et c’est la chanson du Bosquet, note pour note. — Elle est à Aïlis. Porte-la-lui.

- « J’y vais. » → **fin**

### taille-carnet

> 🌙 Elouan déchiffre la notation d’Ilyane en fronçant les sourcils, puis il taille, perce, souffle. Le soir tombe. La chanson des cerfs-lucioles sort enfin de la flûte. — C’est celle du carnet. Pas tout à fait celle d’Aïlis, peut-être… Porte-la-lui.

- « J’y vais. » → **fin**

### flute-prete

> La flûte attend Aïlis, pas moi ! La Maison Feuillevent est juste à côté, aux Hautes Ramures.

- « J’y vais. » → **fin**

### apres

> Chaque soir, j’entends la flûte d’Aïlis jusqu’ici. Les oiseaux se taisent pour l’écouter, puis ils répondent. Tu vois ? Le bois se souvient du vent.

- « Tu peux jouer quelque chose ? » → musique
- « Au revoir, Elouan. » → **fin**

## Elvan Morelle

_Marchand de la Compagnie des Lisières_

Commence par : « apres-rendu » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-rendues »)_, sinon « apres-silence » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-silence »)_, sinon « aveu » _(si quête « Les graines qui manquent » en cours)_ _(si repère « graines-elvan-avoue »)_, sinon « confrontation » _(si quête « Les graines qui manquent » en cours)_ _(si repère « indice-elvan »)_, sinon « accueil »

### accueil

> Elvan Morelle, de la Compagnie des Lisières : tissus de Gardebois, cordes de Ferros. Je repars bientôt, alors si tu veux quelque chose, c’est maintenant… mais tout est déjà promis, j’en ai peur.

- « Que transportes-tu ? » → ballots
- « Au revoir. » → **fin**

### ballots

> Du tissu. Beaucoup de tissu. Rien qui t’intéresse, crois-moi. Il pose la main sur un ballot, comme sans y penser.

- « Bien sûr. » → **fin**

### confrontation

> Elvan referme vite un ballot. — Des graines ? Je vends du tissu, moi. Demande à n’importe qui.

- _(si repère « preuve-sceau »)_ « Ce sceau à tête de cerf, entre les sacs du grenier, c’est le tien. » → aveu
- **[Perception 4]** « Ton ballot brille. Le tissu ne brille pas. » → aveu
- **🎲 Commandement 12** « Ouvre ce ballot. » → aveu, ✗ → refus
- « Je reviendrai. » → **fin**

### refus

> — Sûrement pas. Tu n’es pas de la garde, que je sache. Elvan croise les bras sur son ballot.

- « Je reviendrai. » → **fin**

### aveu

_Effet : retient « graines-elvan-avoue »._

> Elvan s’assoit d’un coup. — Les Marches des Cendres paient trois fois le prix, à Ironheart. Trois fois ! Je me disais : quelques sacs, le Conseil ne verra rien… Il en reste six, là, dans le ballot.

- « Je vais le dire au Conseil. » → denonce _(retient « graines-denonce », termine la quête « Les graines qui manquent », +30 XP)_
- **[Diplomatie 3]** « Rapporte-les toi-même au grenier, et la Compagnie gardera son honneur. » → rend _(retient « graines-rendues », termine la quête « Les graines qui manquent », +40 XP)_
- « Partageons : quarante Fers, et je n’ai rien vu. » → part _(retient « graines-silence », +40 Fers, termine la quête « Les graines qui manquent », +10 XP)_
- « Laisse-moi réfléchir. » → **fin**

### denonce

> Elvan blêmit. — La Compagnie ne me le pardonnera pas… ni à toi. Un Garde Vert l’emmène le soir même, ballot compris. À Canopéa, on n’aime pas ceux qui vendent l’avenir.

- « Les graines rentreront au grenier. » → **fin**

### rend

> Il hésite longtemps, puis charge le ballot sur son épaule. — Je les rapporte ce soir, par la nacelle de Véline. Je dirai que je les ai retrouvées. Merci… de m’avoir laissé ça.

- « Que la sève coule, Elvan. » → **fin**

### part

> Elvan compte quarante Fers, sans te regarder. — Pas un mot, hein ? À Ironheart, on te dirait que c’est du commerce.

- « Pas un mot. » → **fin**

### apres-rendu

> Elvan te salue d’un signe de tête. — Je n’ai jamais si bien dormi. La Compagnie m’a gardé, tu sais. Elle ne sait pas tout… mais moi, je sais.

- « Au revoir, Elvan. » → **fin**

### apres-silence

> Elvan détourne les yeux. — On n’a rien à se dire, toi et moi. C’est mieux comme ça.

- « … » → **fin**

## L’enclume

_Sous la forge froide_

Commence par : « enclume »

### enclume

_Effet : retient « enclume-vue »._

> Une vieille enclume, noire de suie. Sur le plat, des mains gravées, grandes et petites, cinq en tout, posées côte à côte. L’Écho les rejoue un instant : des rires, puis plus rien.

- **[Investigation 2]** « Examiner les marques. » → marques
- « Approcher la lueur d’un cristal. » → marques _(+undefined XP)_
- « Partir. » → **fin**

### marques

> Gravées à froid, avec soin, comme on signe un serment. Sous les mains, un seul mot, presque effacé, dans la même langue inconnue que la berceuse.

- « Partir. » → **fin**

## La foreuse de Brisefer

_Objet_

Commence par : « faussee » _(si repère « foreuse-sabotee »)_, sinon « arretee » _(si repère « chantier-arrete »)_, sinon « gardee » _(si repère « surpris-de-nuit »)_, sinon « jour »

### jour

> La foreuse de Brisefer mord la roche de la Faille dans un fracas de fer. Les ouvriers ne la quittent pas des yeux.

- _(si quête « Le Dernier Train » en cours)_ « Attendre la nuit dans les ruines du quai. » → nuit _(+undefined XP)_
- « S’éloigner. » → **fin**

### nuit

> 🌙 La nuit tombe sur la Gare. Le chantier s’endort ; seule une lanterne veille encore, près de la tente de Brisefer.

- **🎲 Discrétion 10** « Se glisser jusqu’à la foreuse. » → au-pied, ✗ → repere
- « Renoncer et attendre le jour. » → **fin**

### au-pied

> 🌙 Te voilà au pied de la foreuse, dans l’odeur d’huile et de pierre chaude. Personne n’a rien vu.

- **🎲 Artisanat 10** « Saboter le mécanisme. » → sabotee, ✗ → bruit
- « Repartir sans rien toucher. » → **fin**

### sabotee

_Effet : retient « foreuse-sabotee », retient « chantier-arrete », termine la quête « Le Dernier Train », +70 XP, +30 Fers._

> 🌙 Une goupille retirée, un engrenage faussé : la foreuse ne repartira pas avant longtemps. Tu regagnes l’ombre sans un bruit.

- « Attendre le jour. » → **fin**

### repere

_Effet : retient « surpris-de-nuit »._

> 🌙 Une lanterne se lève : « Qui va là ? » Deux ouvriers te reconduisent au bord du chantier. Brisefer saura qu’on a rôdé ici.

- « … » → **fin**

### bruit

_Effet : retient « surpris-de-nuit »._

> 🌙 Un engrenage t’échappe et sonne contre le fer. Le camp s’éveille ; tu n’as que le temps de fuir dans le noir. Brisefer saura qu’on a rôdé ici.

- « … » → **fin**

### gardee

> Depuis ta visite de nuit, un ouvrier veille près de la foreuse, de jour comme de nuit.

- « S’éloigner. » → **fin**

### arretee

> La foreuse est arrêtée. Le silence revient peu à peu sur la Gare.

- « S’éloigner. » → **fin**

### faussee

> La foreuse est muette, un engrenage faussé dans le ventre.

- « S’éloigner. » → **fin**

## La forge froide

_Forges-Basses_

Commence par : « scellee » _(si repère « echos-dissipes »)_, sinon « apres » _(si quête « Les Échos sous la Forge » terminée)_, sinon « trappe » _(si repère « trappe-vue »)_, sinon « jour »

### jour

> Une forge froide, la seule des Forges-Basses. Les ouvriers la contournent : « si une forge s’éteint d’elle-même, un esprit rouille rôde. » Pourtant, la pierre du foyer est tiède sous la main.

- « Revenir à la nuit tombée. » → nuit _(+undefined XP)_
- « Passer son chemin. » → **fin**

### nuit

_Effet : retient « trappe-vue », lance la quête « Les Échos sous la Forge »._

> À la nuit, la forge s’embrase sans feu : une lueur rouge, sans chaleur ni fumée, comme un souffle. Au fond du foyer, la lueur dessine une trappe de fer. Des voix montent d’en bas, très loin.

- « Ouvrir la trappe et descendre. » → **fin** _(mène à « Ironheart — Sous la forge froide »)_
- « Pas cette nuit. » → **fin**

### trappe

> La forge froide. Au fond du foyer, la trappe de fer, entrouverte. D’en bas monte une voix qui fredonne.

- « Descendre. » → **fin** _(mène à « Ironheart — Sous la forge froide »)_
- « Partir. » → **fin**

### apres

> Certaines nuits, la forge s’embrase encore sans feu. Personne n’y prend garde, sauf toi.

- « Descendre. » → **fin** _(mène à « Ironheart — Sous la forge froide »)_
- « Partir. » → **fin**

### scellee

> La forge est froide, et la trappe scellée de l’intérieur. On dit qu’on entend, la nuit, plus de voix sous les pavés qu’avant.

- « Partir. » → **fin**

## Garrik

_Fouilleur_

Commence par : « rencontre »

### rencontre

> Un homme trapu, pioche à l’épaule, sursaute. Une lanterne de Ferros pend à sa ceinture. — Qui va là ? Il n’y a rien à voir, ici. Passe ton chemin.

- « Ce sol est sacré, et tu coupes les racines du Bosquet. » → defensif
- **[Commandement 2]** « Pose cette pioche. Tout de suite. » → intimide
- **🎲 Subterfuge 12** « Kaelis m’envoie voir où tu en es. » → complice, ✗ → demasque
- « Je m’en vais. » → **fin**

### defensif

> — Les racines ? Je creuse le long d’une voie, moi, pas dans les racines ! Bon… il y en avait sur le chemin. Écoute, je suis payé à la pelletée, pas aux questions.

- **[Diplomatie 3]** « Là-haut, des gens ne peuvent plus parler à leurs morts. À cause de ce trou. » → convaincu
- « Alors je vais te faire partir. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Je reviendrai. » → **fin**

### intimide

> Le fouilleur lâche sa pioche. — Doucement ! Je ne suis qu’un ouvrier, moi. On m’a payé pour creuser le long de la vieille voie, c’est tout. Je n’ai rien trouvé, je le jure !

- « Qui t’a payé ? Et pour trouver quoi ? » → aveu

### convaincu

> Il baisse la pioche, longtemps. — Ma mère repose sous un chêne, chez nous, à la frontière. Je n’avais pas pensé… Bon. Je vais te dire ce que je sais.

- « Je t’écoute. » → aveu

### complice

> — Kaelis ? Il pourrait payer plus vite, alors ! Dis-lui que je longe la voie depuis dix jours, et toujours pas de clé. Juste des racines, des racines, des racines… Il faut bien les couper pour passer.

- « Rappelle-moi ce qu’il cherche, exactement. » → aveu

### demasque

> — Kaelis n’envoie personne : il vient lui-même, ou il ne vient pas. Toi, tu es avec ceux d’en haut ! Il lève sa pioche.

- **[Diplomatie 3]** « Du calme. Personne n’a besoin de se battre. » → convaincu
- « Alors on va régler ça. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Reculer, les mains levées. » → **fin**

### aveu

_Effet : retient « cle-mentionnee », retient « fouille-marches »._

> — On est payés par les Marches des Cendres, au Marché d’Ironheart : un certain Kaelis, qui achète les vieilles choses. Ils cherchent une clé de rouille bleue, le long des anciennes voies. Celle-ci passe sous vos arbres.

- « Pars, et ne reviens jamais sur le sol sacré. » → depart _(retient « fouille-elucidee », +30 XP)_

### depart

> Il ramasse ses outils sans un mot de plus et s’éloigne entre les racines, vers l’est. Au bord du trou, la terre fraîche et les racines tranchées racontent le reste. Le Triumvirat voudra le savoir.

- « Remonter faire mon rapport. » → **fin**

## Sacs de graines-lumière

_Objet_

Commence par : « vide » _(si repère « vol-grenier »)_, sinon « sacs »

### sacs

> Des sacs de graines-lumière, alignés comme des soldats. Chacun porte le sceau du Conseil : ce sont les semences des futurs arbres de Canopéa.

- « Prendre un sac. » → pris _(donne 1 × « Graines-lumière », retient « vol-grenier »)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ **[Investigation 2]** « Examiner les rangées. » → indice _(retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ « Faire luire un cristal entre les rangées. » → indice _(+undefined XP, retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- « Les laisser où ils sont. » → **fin**

### pris

> Tu glisses un sac dans ta besace. Il est léger… bien plus léger que ta conscience.

- « Partir. » → **fin**

### vide

> Il manque un sac dans la rangée. Le trou se voit.

- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ **[Investigation 2]** « Examiner les rangées. » → indice _(retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ « Faire luire un cristal entre les rangées. » → indice _(+undefined XP, retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- « Partir. » → **fin**

### indice

> Entre les sacs, de la paille d’emballage de Ferros, et un éclat de cire brune : le sceau d’un marchand, une tête de cerf. Ceux de la Compagnie des Lisières en portent un. Celui-là, tu le reconnaîtras.

- « Partir. » → **fin**

## Le guichet du fond

_Archives, caste Technique_

Commence par : « guichet »

### guichet

> Au fond de la caverne, un guichet d’archives. Un employé aux chiffres bleus tatoués au poignet range des fiches sans lever les yeux. — Caste Technique uniquement. Les autres, circulez.

- « Que fait un guichet d’archives ici ? » → pourquoi
- « Circuler. » → **fin**

### pourquoi

> — L’administration va partout. Même là où elle n’a rien à faire. Il tamponne une fiche, toujours sans te regarder.

- « Partir. » → **fin**

## Le guichet de la ligne de l’Ouest

_Gare de l’Ouest, Ironheart_

Commence par : « guichet »

### guichet

> Guichet de la ligne de l’Ouest. Une employée en gris clair tamponne sans lever les yeux. « Halte de Canopéa, puis les ports : quatorze heures. » — Un billet pour Canopéa ?

- _(si quête « L’audience » terminée)_ _(sans repère « rail-travailleurs »)_ _(sans repère « rail-marches »)_ **[40 Fers]** « Prendre un billet. » → train-canopee _(−40 Fers)_
- _(si quête « L’audience » terminée)_ _(si repère « rail-travailleurs »)_ **[30 Fers]** « Prendre un billet : les cheminots te font un prix. » → train-canopee _(−30 Fers)_
- _(si quête « L’audience » terminée)_ _(si repère « rail-marches »)_ **[50 Fers]** « Prendre un billet : les convois ne sont plus sûrs, il faut payer l’assurance. » → train-canopee _(−50 Fers)_
- « Pas aujourd’hui. » → **fin**

### train-canopee

> Le train quitte Ironheart dans un souffle de vapeur cristalline. Puis la forêt : quarante minutes sous une canopée de deux cents mètres, dans une voiture à toit de verre. À la halte, la Grande Nacelle te monte jusqu’aux cimes.

- « Monter jusqu’aux cimes. » → **fin** _(+undefined XP, mène à « Canopéa — La Grande Nacelle »)_

## La halte de la ligne de l’Ouest

_Au pied de la Grande Nacelle_

Commence par : « halte »

### halte

> Un panneau de bois vivant, au pied de la Grande Nacelle : « Ligne de l’Ouest — halte de Canopéa. Train pour Ferros chaque soir. » En dessous, plus petit : « Sauf-conduit exigé à la frontière. »

- « Prendre le train pour Ironheart. » → billet
- « Partir. » → **fin**

### billet

> La préposée de la halte compte sur ses doigts. — Ironheart, gare de l’Ouest : une nuit de train. Le sauf-conduit du Triumvirat t’ouvrira la frontière ; sans lui, on ne passe pas.

- _(si quête « L’audience » terminée)_ _(sans repère « rail-travailleurs »)_ _(sans repère « rail-marches »)_ **[40 Fers]** « Prendre un billet. » → train-ironheart _(−40 Fers)_
- _(si quête « L’audience » terminée)_ _(si repère « rail-travailleurs »)_ **[30 Fers]** « Prendre un billet : les cheminots te font un prix. » → train-ironheart _(−30 Fers)_
- _(si quête « L’audience » terminée)_ _(si repère « rail-marches »)_ **[50 Fers]** « Prendre un billet : les convois ne sont plus sûrs, il faut payer l’assurance. » → train-ironheart _(−50 Fers)_
- « Pas aujourd’hui. » → **fin**

### train-ironheart

> La Grande Nacelle te descend à la halte. Le train file sous la canopée, voitures à toit de verre ; puis la forêt s’arrête net, et commence la cendre. Une demi-journée plus tard, la gare de l’Ouest d’Ironheart.

- « Descendre sur le quai. » → **fin** _(+undefined XP, mène à « Ironheart — Les Forges-Basses »)_

## Hedda Cendrefer

_Atelier Cendrefer_

Commence par : « lettre » _(si l’on porte « Lettre pour Ilyane »)_ _(si quête « Les Échos sous la Forge » en cours)_, sinon « accueil-remise » _(si repère « remise-cendrefer »)_, sinon « accueil »

### accueil

> — Atelier Cendrefer ! Tu viens de Gardebois ? Alors tu as vu mon frère Tobias. Il vend toujours trop cher et parle trop fort ? Bien : il va bien.

- « Voyons tes lames. » → **fin** _(ouvre le Troc)_
- « Qu’as-tu de plus que ton frère ? » → forge
- « Un conseil, pour Ironheart ? » → conseil
- « Au revoir. » → **fin**

### conseil

> — Garde ton laissez-passer, ne traîne pas après le premier pont peint en rouge, et si tu entends sept coups de marteau, c’est l’heure des Litanies : on se tait. Ici, le travail est prière.

- « Merci, Hedda. » → accueil

### accueil-remise

> — Atelier Cendrefer ! Attends… Tobias m’a écrit : c’est toi qui as rendu sa caisse au petit Brann. Chez les Cendrefer, une dette se paie en prix : tu auras le même que chez lui.

- « Voyons tes lames. » → **fin** _(ouvre le Troc)_
- « Qu’as-tu de plus que ton frère ? » → forge
- « Un conseil, pour Ironheart ? » → conseil
- « Au revoir. » → **fin**

### forge

> — Tobias vend ce qui voyage bien. Moi, je forge ce qui pèse : un marteau des Forges-Basses, une arbalète réglée ici même, une cuirasse rivetée. Ça se paie, mais ça dure.

- « Voyons ça. » → **fin** _(ouvre le Troc)_
- « Merci, Hedda. » → **fin**

### lettre

_Effet : reprend 1 × « Lettre pour Ilyane », retient « echos-confies », termine la quête « Les Échos sous la Forge », +40 XP._

> — Pour Ilyane, à Gardebois ? Tobias la lui portera, avec la prochaine caisse. Hedda soupèse la lettre. — Elle est lourde, pour une seule feuille.

- « Merci, Hedda. » → **fin**

## Hesk

_Peuple des Cendres Noires, gardienne du dessous_

Commence par : « colere » _(si repère « echos-dissipes »)_, sinon « apres » _(si quête « Les Échos sous la Forge » terminée)_, sinon « accueil »

### accueil

> Une mineuse au visage poudré de suie noire lève sa lampe. — Peu de gens trouvent la trappe. Je suis Hesk, du Peuple des Cendres Noires : nous gardons le dessous. Le souffle de Kharos fait parfois remonter ce que la terre a gardé.

- « Ce que la terre a gardé ? » → echos
- « Qui sont ces voix ? » → voix
- « Je repars. » → **fin**

### echos

> — Des Échos. Mais pas les nôtres. Les forgerons d’ici, je les connais tous, d’hier et d’aujourd’hui. Ceux-là parlent une langue qu’aucune forge n’a jamais chantée, comme s’ils venaient d’une autre époque.

- « Et qu’en faites-vous ? » → garde
- « Merci, Hesk. » → **fin**

### garde

> — Rien. On les garde. Un Écho ne s’efface pas : on le dissipe un temps, et il revient. Et qui frappe un Écho le voit se multiplier. Écoute-les, si tu veux. Puis décide.

- « Merci, Hesk. » → **fin**

### voix

> — Une voix qui fredonne. Des mains qui gravent l’enclume. Et au fond, quelqu’un qui promet. Je ne sais pas à qui elles sont. Je sais seulement qu’elles se cherchent.

- « Je vais les écouter. » → **fin**

### apres

> — Le dessous est calme. Merci d’avoir écouté, là où d’autres auraient eu peur.

- « Au revoir, Hesk. » → **fin**

### colere

> Hesk ne lève pas sa lampe. — Tu les as frappés. Ils reviendront plus nombreux, et moins doux. La terre n’oublie rien. Remonte, maintenant.

- « Remonter. » → **fin**

## L’huissier du Conseil

_Huissier_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « retour » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_, sinon « lettre » _(si quête « L’audience » en cours)_ _(si l’on porte « Lettre d’Ilyane »)_, sinon « retour » _(si quête « L’audience » en cours)_, sinon « nouvelles » _(si quête « L’audience » pas commencée)_ _(si quête « Le Dernier Train » terminée)_, sinon « accueil »

### accueil

> Silence, s’il te plaît : là-haut, dans le grand amphithéâtre, le Conseil des Racines Profondes délibère. Les audiences se demandent par écrit, et la liste est longue… très longue.

- « De quoi parle le Conseil ? » → sujet
- **[réputation à canopee ≥ 10]** « Le Conseil accepterait-il de m’entendre ? » → estime
- « Je reviendrai. » → **fin**

### sujet

> De la frontière de l’Est, de ce que Ferros creuse sous nos racines, et de ce mal qui fait oublier. Je n’en dirai pas plus : je suis huissier, pas bavard.

- « Merci quand même. » → **fin**

### estime

> L’huissier te regarde mieux. — Ton nom circule en bien dans les Ramures, à ce qu’on dit. Reviens quand le Conseil aura fini de délibérer : il voudra peut-être t’entendre.

- « Je reviendrai. » → **fin**

### lettre

> Une lettre au sceau des Gardiens de Mémoire de Gardebois ? L’huissier la tourne et la retourne, puis s’efface. — Le Conseil a fini de délibérer. Le Triumvirat Vert te recevra. Monte, et parle franchement : ici, on n’aime pas les détours.

- « Entrer dans l’amphithéâtre. » → **fin** _(mène à « Canopéa — Amphithéâtre du Conseil »)_
- « Un instant. » → **fin**

### nouvelles

> Silence, s’il te plaît : là-haut, le Conseil des Racines Profondes délibère. Les audiences se demandent par écrit, et la liste est longue… très longue.

- **[réputation à canopee ≥ 10]** « Je viens de Gardebois. J’ai vu ce que la foreuse a fait à la Gare Engloutie. » → admis _(lance la quête « L’audience »)_
- **[Diplomatie 3]** « Le Conseil parle de ce mal qui fait oublier. Je l’ai vu de près, et je sais d’où il vient. » → admis _(lance la quête « L’audience »)_
- **🎲 Subterfuge 13** « Le Triumvirat m’attend. On a dû oublier de te prévenir. » → admis, ✗ → menteur _(lance la quête « L’audience »)_
- « Je reviendrai. » → **fin**

### admis

> L’huissier te regarde longuement, puis s’efface. — Le Conseil a fini de délibérer. Le Triumvirat Vert te recevra. Monte, et parle franchement : ici, on n’aime pas les détours.

- « Entrer dans l’amphithéâtre. » → **fin** _(mène à « Canopéa — Amphithéâtre du Conseil »)_
- « Un instant. » → **fin**

### menteur

_Effet : retient « mensonge-huissier »._

> — Personne n’oublie rien, au Conseil : tout y est écrit. L’huissier fronce les sourcils. — À Canopéa, on ne ment pas aux Racines. Reviens avec une lettre, ou avec un nom que la ville respecte.

- « … » → **fin**

### retour

> Le Triumvirat t’attend. Monte, et que la sève coule.

- « Entrer dans l’amphithéâtre. » → **fin** _(mène à « Canopéa — Amphithéâtre du Conseil »)_
- « Plus tard. » → **fin**

### apres

> Racines profondes ! Le Conseil parle encore de ton audience. Tu peux monter saluer le Triumvirat, si tu veux : il te recevra.

- « Entrer dans l’amphithéâtre. » → **fin** _(mène à « Canopéa — Amphithéâtre du Conseil »)_
- « De quoi parle le Conseil ? » → sujet-apres
- « Au revoir. » → **fin**

### sujet-apres

> Des Gardes Verts au Sol des Racines, des Voix des Arbres qui soignent le Bosquet, et d’Ironheart. Toujours Ironheart. Je n’en dirai pas plus : je suis huissier, pas bavard.

- « Merci quand même. » → **fin**

## Ilyane Voix-d’Écorce

_Gardienne de Mémoire de Gardebois_

Commence par : « echo-lettre » _(si repère « echos-confies »)_ _(sans repère « ilyane-echo-lu »)_, sinon « carnet » _(si quête « Le carnet de chansons » en cours)_ _(si l’on porte « Carnet de chansons d’Ilyane »)_, sinon « nouvelles-canopee » _(si quête « L’audience » terminée)_, sinon « resolu » _(si quête « Le Dernier Train » terminée)_, sinon « en-cours » _(si quête « Le Dernier Train » en cours)_, sinon « accueil »

### resolu

> Depuis que la foreuse s’est tue, plus personne ne revit la Grande Chute. Tu as bien fait. Mais dis-moi : qui a payé cette prospection, à ton avis ? Les Réveilleurs, peut-être. Reste sur tes gardes.

- _(si quête « L’audience » pas commencée)_ _(si quête « Le Dernier Train » terminée)_ « Et maintenant ? » → lettre _(donne 1 × « Lettre d’Ilyane », lance la quête « L’audience »)_
- « Je resterai sur mes gardes. » → **fin**

### accueil

> Te voilà. Les Gardiens de Mémoire m’ont annoncé ta venue. Bienvenue au Marché des Lisières… même si le moment est mal choisi pour un apprentissage tranquille.

- « Que se passe-t-il ? » → trouble
- « Je reviendrai plus tard. » → **fin**

### trouble

> Depuis trois nuits, des gens du marché revivent la Grande Chute en plein jour. Ils voient des villes brûler, entendent des sirènes que personne n’a entendues depuis trois mille ans. Puis tout s’efface, et ils pleurent sans savoir pourquoi.

- **[Perception 4]** « Tes mains tremblent, Ilyane. Toi aussi, tu les vois. » → atteinte _(retient « ilyane-atteinte », +10 XP)_
- « D’où vient ce mal ? » → cause
- « Je reviendrai plus tard. » → **fin**

### atteinte

> … Tu as de bons yeux. Ce matin, j’étais sur le quai d’une gare. J’ai vu partir un train plein d’enfants qui agitaient la main. Je n’ai jamais vu de train de l’Ancien Monde. Ce souvenir n’est pas le mien.

- « Que puis-je faire ? » → cause

### cause

> Une maladie mémorielle. Les anciens textes le disent : quand on abîme un Écho du Passé, la mémoire du lieu déborde sur les vivants. Or, à l’est, des prospecteurs de Ferros fouillent la Gare Engloutie, là où l’une des Trois Failles vient de s’ouvrir.

- **[Érudition 2]** « La loi de la Mémoire Vivante : un Écho qu’on déchire se multiplie. » → savant _(+10 XP)_
- « Pourquoi ne pas prévenir la garde ? » → garde
- « J’irai voir ce qui se passe à la Gare. » → mission

### savant

> Tu as bien appris. Alors tu sais aussi qu’on ne détruit pas un Écho : on peut seulement l’apaiser, pour un temps. C’est notre métier, à nous, Gardiens : écouter ce que le passé essaie de dire.

- « J’irai à la Gare Engloutie. » → mission

### garde

> La garde surveille la frontière, pas les souvenirs. Et les prospecteurs ont des papiers en règle, signés à Ferros. Il faut quelqu’un qui sache écouter les Échos. Quelqu’un comme toi.

- « Alors j’irai à la Gare. » → mission

### mission

_Effet : lance la quête « Le Dernier Train »._

> Va à la Gare Engloutie, après le pont, à l’est. Écoute l’Écho avant qu’ils ne le déchirent davantage, et trouve qui dirige le chantier. Tobias, le marchand de Ferros, connaît sûrement les prospecteurs : il vend de tout à tout le monde.

- « En route. » → **fin**

### en-cours

> La Gare Engloutie est à l’est, après le pont. Tobias, au marché, en sait peut-être plus sur le chantier.

- _(si repère « ilyane-atteinte »)_ « Comment te sens-tu ? » → sante
- « J’y vais. » → **fin**

### sante

> Les visions passent comme des nuages. Je tiendrai. Le marché a besoin de quelqu’un qui garde la tête froide… et toi, tu as une gare à écouter.

- « Je reviens vite. » → **fin**

### lettre

> Ilyane écrit longtemps, puis scelle la lettre d’une goutte de cire verte. — Porte-la au Conseil des Racines Profondes, à Canopéa. Là-haut, on ne m’écoute plus beaucoup… On m’écoutera peut-être à travers toi.

- « J’irai à Canopéa. » → **fin**

### nouvelles-canopee

> Mirelle m’a écrit par le courrier des Nacelliers : tu as parlé devant le Triumvirat Vert ! Et maintenant, Ironheart, et les Marches des Cendres… Prends garde à toi. Là-bas, on vend tout, même les souvenirs.

- « Je reviendrai te raconter. » → **fin**

### carnet

> Qu’est-ce que… Mon carnet de chansons ! Mirelle l’a gardé tout ce temps ? Elle t’a dit laquelle chanter, je parie. La dix-sept.

- « La dix-sept. Elle a dit que tu saurais pourquoi. » → dix-sept _(reprend 1 × « Carnet de chansons d’Ilyane », termine la quête « Le carnet de chansons », retient le Récit « Les deux apprenties », +25 XP)_

### dix-sept

> 🌙 Ilyane chante, et c’est vrai qu’elle chante faux. Mais c’est la chanson de deux apprenties qui se juraient de tout écouter et de tout écrire, et sa voix tremble au bon endroit. — Elle avait raison, Mirelle. Il fallait l’écrire.

- « C’était beau. Même faux. » → **fin**

### echo-lettre

_Effet : retient « ilyane-echo-lu », +10 XP._

> Ilyane tient ta lettre contre elle. — Je ne sais pas à qui sont ces voix. Mais je reconnais des gens qui s’aiment, même à travers les siècles. Garde leur promesse. Un jour, quelqu’un saura l’entendre.

- « Je la garderai. » → **fin**

## Ingrid Brisefer

_Ingénieure, prospection de Ferros_

Commence par : « apres-sabotage » _(si repère « foreuse-sabotee »)_, sinon « apres » _(si quête « Le Dernier Train » terminée)_, sinon « soupcon » _(si repère « surpris-de-nuit »)_, sinon « barriere » _(si quête « Le Dernier Train » en cours)_ _(sans repère « laissez-passer »)_, sinon « accueil »

### accueil

> Chantier privé, prospection pour le compte de Ferros. Qu’est-ce que les Gardiens de Mémoire viennent encore nous reprocher ?

- « Ce chantier rend les gens malades, à Gardebois. » → cause
- « Je viens juste regarder. » → **fin**

### soupcon

> Alors c’est vous, l’ombre qui rôdait autour de ma foreuse cette nuit ? Mes gardes veillent, maintenant. Si vous avez quelque chose à me dire, dites-le en face.

- « Ce chantier rend les gens malades, à Gardebois. » → cause
- « Je n’ai rien à vous dire. » → **fin**

### cause

> La maladie mémorielle ? On en a entendu parler. Mais la Faille vaut de l’or en cristaux, et j’ai des papiers signés. Je ne m’arrête pas pour une rumeur de marché.

- **[Diplomatie 3]** _(si quête « Le Dernier Train » en cours)_ « Arrêtez le forage : à chaque coup, l’Écho se multiplie, et le mal avec lui. » → convaincue _(retient « chantier-arrete », termine la quête « Le Dernier Train », +70 XP, +30 Fers)_
- **[Commandement 3]** _(si quête « Le Dernier Train » en cours)_ « Je parle au nom des Gardiens de Mémoire : cessez, maintenant. » → convaincue _(retient « chantier-arrete », termine la quête « Le Dernier Train », +70 XP, +30 Fers)_
- _(si Récit « Le Savant Corvan » connu)_ _(si quête « Le Dernier Train » en cours)_ « Je connais l’histoire du savant Corvan. Écoutez-la avant de creuser plus loin. » → convaincue-recit _(retient « chantier-arrete », termine la quête « Le Dernier Train », +70 XP, +30 Fers)_
- « Je reviendrai. » → **fin**

### convaincue

> … Bon. J’arrête la foreuse, pour l’instant. Mais dites bien à vos Gardiens que Ferros reviendra, avec ou sans moi.

- « Merci. » → **fin**

### convaincue-recit

> Corvan ? Je connais l’histoire, oui… et vous avez raison : il a réussi, et ça ne l’a pas sauvé. J’arrête la foreuse. On ne commet pas deux fois la même faute.

- « Merci. » → **fin**

### apres-sabotage

> Quelqu’un a faussé ma foreuse, cette nuit. Ferros m’enverra des pièces… dans des semaines. D’ici là, je ne creuse plus. Et personne n’a plus revu de train, à Gardebois, paraît-il.

- « Tant mieux. » → **fin**

### apres

> La foreuse est silencieuse, pour l’instant. Mes ouvriers n’aiment pas ça, mais personne n’a plus revu de train, à Gardebois.

- « Tant mieux. » → **fin**

### barriere

> Un contremaître en gilet de cuir te barre la route avant la tente de l’ingénieure. — Chantier privé. Sans laissez-passer de la Compagnie des Lisières, on ne passe pas le jour. Reviens avec un papier.

- « Où trouver un laissez-passer ? » → barriere-ou
- « Partir. » → **fin**

### barriere-ou

> — Au Marché des Lisières, chez les Cendrefer. Tobias en a toujours un dans sa manche, à son prix. Et ne traîne pas ici la nuit : le chantier dort, mais la lanterne veille.

- « Partir. » → **fin**

## Joss Brakel

_Aiguilleur de nuit_

Commence par : « merci » _(si repère « dette-joss-payee »)_, sinon « apres » _(si quête « Le Rail des Cendres » terminée)_, sinon « avoue » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « joss-avoue »)_, sinon « soupcon » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « indice-registre »)_, sinon « soupcon » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « indice-aiguillage »)_, sinon « accueil »

### accueil

> Un aiguilleur aux yeux cernés astique sa lanterne. — Joss Brakel, aiguilleur de nuit. De jour, maintenant : la nuit, plus personne ne roule.

- « Tu as vu partir les convois ? » → vu
- « Au revoir. » → **fin**

### vu

> Il détourne les yeux. — Je dormais. Tout le monde dort, à trois heures.

- « Au revoir. » → **fin**

### soupcon

> Joss serre sa lanterne. — Je fais mon travail. Qu’est-ce que tu veux ?

- _(si repère « indice-aiguillage »)_ _(si repère « indice-registre »)_ « La goupille limée, ta signature au registre : tout te désigne. » → aveu
- **[Diplomatie 2]** « Je ne suis pas du Bureau. Dis-moi ce qui te tient. » → aveu
- **[Commandement 3]** « Parle-moi, ou tu parleras au contrôleur. » → aveu
- « Je reviendrai. » → **fin**

### aveu

_Effet : retient « joss-avoue », +15 XP._

> Il s’assoit sur un rail. — Ma dette. Les Marches l’ont rachetée au prêteur. « Laisse le levier ouvert les nuits de minerai, et ta dette fond. » Une machine vient seule, attelle les wagons, et part par l’embranchement, vers la vieille Cendrière.

- « Personne n’est blessé ? » → personne
- « Merci, Joss. » → **fin**

### personne

> — Personne. Seulement le minerai, et la confiance. Varka me regarde comme un frère. Je ne dors plus.

- « Merci, Joss. » → **fin**

### avoue

> — Tu as parlé à Varka ? Fais ce que tu dois. Je ne dors plus, de toute façon.

- « Comment entrer dans le tunnel ? » → mot
- « À plus tard. » → **fin**

### mot

> — Le guetteur des Marches laisse passer qui dit : « Levier ouvert. » C’est tout. Ne lui dis pas que ça vient de moi.

- « Promis. » → **fin**

### merci

> — Ma dette est payée. Je n’arrive pas à y croire. Le levier reste fermé, maintenant : je le tiens moi-même, toute la nuit.

- « Bonne nuit, Joss. » → **fin**

### apres

> Joss astique sa lanterne, sans un mot. Il ne te regarde pas dans les yeux.

- « Au revoir. » → **fin**

## Kael Marchevent

_Gardien de la Canopée_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « rapport » _(si quête « L’audience » en cours)_ _(si repère « fouille-elucidee »)_, sinon « attente » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_, sinon « audience » _(si quête « L’audience » en cours)_, sinon « accueil »

### accueil

> Le Gardien de la Canopée lève les yeux de ses cartes. — Racines profondes. Le Conseil ne reçoit pas aujourd’hui.

- « Que la sève coule. » → **fin**

### audience

> Un homme d’une quarantaine d’années, cape de Garde Vert sur les épaules, se lève. — Racines profondes. Je suis Kael Marchevent, Gardien de la Canopée. On me dit que tu viens de Gardebois. Parle : qu’as-tu vu à la Gare Engloutie ?

- _(si l’on porte « Lettre d’Ilyane »)_ « Ilyane, la Gardienne de Mémoire de Gardebois, vous écrit. » → lettre _(reprend 1 × « Lettre d’Ilyane », retient « lettre-remise », +10 XP)_
- « Une foreuse de Ferros a déchiré l’Écho du dernier train. La maladie qui fait oublier est venue de là. » → recit-gare

### lettre

> Kael lit, puis tend la lettre à la Première Racine. — Ilyane ne dérange jamais le Conseil pour rien. Elle écrit que tu as écouté l’Écho, et qu’il s’est apaisé. Raconte-nous.

- « Une foreuse de Ferros a déchiré l’Écho du dernier train. La maladie qui fait oublier est venue de là. » → recit-gare

### recit-gare

> Tu racontes la Gare Engloutie, la foreuse, l’Écho du dernier train, les visions de la Grande Chute. Dans les gradins, des murmures. Kael serre les poings. — Des papiers de Ferros, sous nos frontières. Encore.

- « Les papiers venaient de Ferros. Mais qui payait ? » → lyra

### lyra

> Lyra Cœur-de-Sève, la Première Racine, lève la main. — Doucement, Gardien. Quatre parts sur dix de notre commerce passent par Ferros. Fermer la frontière sur une rumeur, c’est affamer Gardebois. Il nous faut des preuves.

- « Et ce mal qui fait oublier ? » → thalorin

### thalorin

> Au centre, l’Ancien Thalorin n’a pas bougé. Sa voix ressemble au vent dans les feuilles. — Ce mal n’est pas seulement à Gardebois. Depuis peu, les noms gravés du Bosquet des Échos se taisent. On pose la main, et le bois reste froid.

- « Je peux chercher pourquoi. » → mission _(retient « audience-tenue », +20 XP)_

### mission

> Kael hoche la tête. — Alors cherche. Le Triumvirat t’ouvre le Bosquet et, s’il le faut, le Sol des Racines : Véline te descendra. Reviens avec des faits, pas des rumeurs. Ici, on ne ment pas au Conseil.

- « J’y vais. » → **fin**

### attente

> Kael lève les yeux de ses cartes. — Alors ? Ce qui fait taire les noms du Bosquet. Des faits, pas des rumeurs.

- « Rappelez-moi ce que je cherche. » → mission
- « Je reviendrai. » → **fin**

### rapport

> — Tu reviens avec des faits, je le vois à ton visage. Parle : le Triumvirat t’écoute.

- « Des fouilleurs des Marches des Cendres creusent le sol sacré, le long d’une vieille voie. Ils ont coupé les racines du Bosquet. » → rapport-suite

### rapport-suite

> Un silence lourd tombe sur l’amphithéâtre. Thalorin ferme les yeux. — Les racines du Bosquet descendent jusqu’au sol. Coupées, elles ne portent plus les souvenirs. Les Voix des Arbres refermeront la blessure.

- _(si repère « cle-mentionnee »)_ « Ils cherchent une clé de rouille bleue. » → cle
- « Que va faire le Conseil ? » → choix

### cle

> Lyra pâlit. — Une clé de l’Ancien Monde… Les Archives de Ferros en parlent à mi-voix depuis des années. Si les Marches la cherchent jusque sous nos racines, c’est qu’elle compte plus que tout le reste.

- « Que va faire le Conseil ? » → choix

### choix

> Kael veut fermer la frontière aux prospecteurs ; Lyra veut garder le commerce et surveiller les chantiers. Tous deux se tournent vers toi. — Tu étais en bas. Que conseilles-tu ?

- « Fermez la frontière aux prospecteurs. » → fin-frontiere _(retient « conseil-frontiere »)_
- « Gardez le commerce, mais surveillez chaque chantier. » → fin-commerce _(retient « conseil-commerce »)_
- **[Diplomatie 3]** « Le sol est sacré, la route ne l’est pas : fermez l’un, gardez l’autre. » → fin-accord _(retient « conseil-accord », +15 XP)_

### fin-frontiere

> Kael approuve ; Lyra soupire, mais ne s’y oppose pas. — Les Gardes Verts tiendront la frontière, dit le Gardien. Que Gardebois sache que Canopéa ne l’oublie pas.

- « Et moi ? » → envoi

### fin-commerce

> Lyra sourit ; Kael serre les mâchoires, puis cède. — Des Gardes Verts surveilleront chaque chantier, dit-il. Au premier trou dans le sol sacré, on ferme tout.

- « Et moi ? » → envoi

### fin-accord

> Le Gardien et la Première Racine se regardent, surpris. Thalorin rit doucement, comme le vent. — Le sol est sacré, la route ne l’est pas. Voilà qui est sage. Le Conseil votera ainsi.

- « Et moi ? » → envoi

### envoi

_Effet : donne 1 × « Sauf-conduit du Triumvirat », termine la quête « L’audience », lance la quête « La Clé de Rouille Bleue », retient le Récit « Le Triumvirat Vert », +60 XP, reprend 1 × « Lettre d’Ilyane »._

> Kael te tend un sauf-conduit scellé d’une feuille d’émeraude. — Les Marches des Cendres tiennent marché à Ironheart, en Ferros. Va voir qui paie, et pourquoi. Le Triumvirat Vert te le demande.

- « Que la sève coule. » → **fin**

### apres

> — Racines profondes. Ironheart t’attend, et nous attendons de tes nouvelles. Montre le sauf-conduit aux Gardes Verts de la frontière : ils te laisseront passer.

- « Que la sève coule. » → **fin**

## Kaelis

_Marchand d’ossements, Marches des Cendres_

Commence par : « offre » _(si l’on porte « Clé de rouille bleue »)_, sinon « apres-vente » _(si repère « cle-vendue »)_, sinon « apres » _(si quête « La Clé de Rouille Bleue » terminée)_, sinon « retour » _(si repère « kaelis-parle »)_, sinon « accueil-garrik » _(si repère « fouille-elucidee »)_, sinon « accueil »

### accueil

> Un homme maigre polit une mâchoire de Golem sous une lampe à huile. Autour de lui, des os de bêtes polis, des dents de loup en colliers. — Tout se vend, ici. Même ce qui se souvient. Pose ta question… si c’est la bonne.

- « Je cherche la clé de rouille bleue. » → mauvaise
- **[Mémoire 3]** « Pourquoi certaines reliques se souviennent-elles des morts ? » → bonne
- _(si Récit « Les voix du Bosquet » connu)_ « Au Bosquet des Échos, le bois garde la main de qui a gravé. Et tes os ? » → bonne
- « Et toi, de quoi te souviens-tu ? » → refus

### mauvaise

> Kaelis sourit sans montrer les dents. — Tout le monde la cherche. Ce n’est pas la bonne question.

- « Essayer autre chose. » → accueil
- « Tout se vend, as-tu dit. Combien, la réponse ? » → prix
- « Je reviendrai. » → **fin**

### refus

> — Je vends des souvenirs. Je ne donne pas les miens. Il reprend son polissage.

- « Pardon. » → accueil
- « Au revoir. » → **fin**

### bonne

_Effet : retient « kaelis-parle », +15 XP._

> Il pose la mâchoire. — Parce qu’on les a tenues longtemps, avec amour ou avec peur : le métal garde la main. Toi, tu sais écouter. Alors écoute : la clé, je l’ai vue au cou de la Veilleuse du Rail, au bout de la ligne qu’on dit maudite.

- « Pourquoi ne pas la prendre toi-même ? » → pourquoi
- « Merci, Kaelis. » → **fin**

### pourquoi

> — On ne prend rien à la Veilleuse : les cheminots veillent sur elle. Rapporte-moi la clé, et je te la paie cent Fers. Les Marches paient toujours leurs dettes.

- « Qu’ouvre-t-elle ? » → ouvre
- « J’y réfléchirai. » → **fin**

### ouvre

> — Une archive. Celle du dernier train : ce qu’il emportait, ce qu’il a laissé en route. Les Archives Centrales en gardent le coffre. Nous, nous avons les acheteurs.

- « Je vois. » → **fin**

### retour

> — Alors, cette Veilleuse ? Cent Fers, toujours. Je ne change jamais un prix.

- « Qu’ouvre-t-elle, déjà ? » → ouvre
- « À plus tard. » → **fin**

### offre

> — Elle est là, dans ta poche. Je l’entends rouiller d’ici. Cent Fers, et l’on n’en parle plus.

- « La lui vendre, pour cent Fers. » → vendue _(reprend 1 × « Clé de rouille bleue », +100 Fers, retient « cle-vendue », termine la quête « La Clé de Rouille Bleue », +60 XP)_
- « Qu’ouvre-t-elle ? » → ouvre
- « Non, pas à toi. » → **fin**

### vendue

> Kaelis fait disparaître la clé dans un coffret doublé de velours noir. — Les Marches te remercient. Si un jour tu as quelque chose à vendre, même un souvenir, tu sais où me trouver.

- « Au revoir. » → **fin**

### apres-vente

> — Les acheteurs sont contents. Toi aussi, j’espère.

- « Au revoir. » → **fin**

### apres

> — Tu as choisi de ne pas me la vendre, à ce qu’on dit. Dommage. Les Marches n’oublient pas… mais elles ne se fâchent pas longtemps.

- « Au revoir. » → **fin**

### prix

> Kaelis lève enfin les yeux. — Vingt-cinq Fers. Les bonnes questions coûtent moins cher, mais tout le monde n’a pas de quoi les poser.

- **[25 Fers]** « Payer vingt-cinq Fers. » → achetee _(−25 Fers)_
- « Trop cher pour moi. » → **fin**

### achetee

_Effet : retient « kaelis-parle »._

> Il compte les pièces sans les regarder. — La clé, je l’ai vue au cou de la Veilleuse du Rail, au bout de la ligne qu’on dit maudite. Une réponse vendue, une question payée : nous sommes quittes.

- « Pourquoi ne pas la prendre toi-même ? » → pourquoi
- « Merci, Kaelis. » → **fin**

### accueil-garrik

> Kaelis polit une mâchoire de Golem et lève à peine les yeux. — Ah. C’est toi qui as renvoyé Garrik de sous les arbres. Je ne suis pas rancunier : une fouille perdue, c’est un prix comme un autre. Pose ta question… si c’est la bonne.

- « Je cherche la clé de rouille bleue. » → mauvaise
- **[Mémoire 3]** « Pourquoi certaines reliques se souviennent-elles des morts ? » → bonne
- _(si Récit « Les voix du Bosquet » connu)_ « Au Bosquet des Échos, le bois garde la main de qui a gravé. Et tes os ? » → bonne
- « Et toi, de quoi te souviens-tu ? » → refus

## Des lettres éparpillées

_Objet_

Commence par : « lettres »

### lettres

> Quelques lettres, éparpillées entre les racines, encore sèches. Des traces dans la mousse partent vers le nord-est, comme si quelque chose avait traîné la sacoche.

- « Ramasser les lettres. » → ramassees
- **[Survie 2]** « Lire les traces. » → traces
- « Laisser les lettres. » → **fin**

### ramassees

_Effet : retient « lettres-ramassees »._

> Tu glisses les lettres dans ta besace. Plus loin, au nord-est, les traces s’enfoncent sous les fougères.

- « Suivre les traces. » → **fin**

### traces

> De larges empreintes rondes, et des touffes de mousse arrachées : un Ours-Mousse. Il a dû prendre la sacoche pour un nid bien douillet.

- « Ramasser les lettres. » → ramassees
- « Partir. » → **fin**

## Liane Sève-Claire

_Herboriste_

Commence par : « apres » _(si quête « Les herbes de lisière » terminée)_, sinon « rendu » _(si quête « Les herbes de lisière » en cours)_ _(si repère « sauge-1-cueillie »)_ _(si repère « sauge-2-cueillie »)_ _(si repère « sauge-3-cueillie »)_, sinon « attente » _(si quête « Les herbes de lisière » en cours)_, sinon « demande »

### demande

> Tu marches sur ma menthe. … Bon. L’apprenti·e d’Ilyane, c’est ça ? Alors rends-toi utile : il me faut de la sauge-lumière pour les malades, et mes genoux ne valent plus rien.

- « Où en trouver ? » → ou _(lance la quête « Les herbes de lisière »)_
- « Une autre fois. » → **fin**

### ou

> Trois touffes. Une vers le bas du village, une autre un peu plus à gauche, au bout du chemin. La troisième se cache sous une pierre moussue, tout à gauche, au bord de la forêt : il faut l’œil, ou du flair.

- « Je m’en occupe. » → **fin**

### attente

> Alors, cette sauge ? Trois touffes, pas deux.

- « J’y retourne. » → **fin**

### rendu

> Trois belles touffes… Tu as la main douce, pour un·e apprenti·e. Tiens : de quoi te rafistoler, et une fiole de ma sève. Ne la gaspille pas.

- « Merci, Liane. » → **fin** _(termine la quête « Les herbes de lisière », donne 2 × « Bandage », donne 1 × « Fiole de sève », +20 XP)_

### apres

> Mes malades vont un peu mieux. Reviens si tu croises d’autres herbes étranges.

- « … » → **fin**

## Lisandre Ramelune

_Aubergiste du Nid_

Commence par : « vote » _(si quête « L’audience » terminée)_ _(si repère « conseil-frontiere »)_ _(sans repère « lisandre-vote-dit »)_, sinon « vote-commerce » _(si quête « L’audience » terminée)_ _(si repère « conseil-commerce »)_ _(sans repère « lisandre-vote-commerce-dit »)_, sinon « vote-accord » _(si quête « L’audience » terminée)_ _(si repère « conseil-accord »)_ _(sans repère « lisandre-vote-accord-dit »)_, sinon « elvan-parti » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-denonce »)_ _(sans repère « lisandre-elvan-parti-dit »)_, sinon « tournee » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-silence »)_ _(sans repère « lisandre-tournee-dit »)_, sinon « flute » _(si quête « Le chant d’Anselme » terminée)_ _(sans repère « lisandre-flute-dit »)_, sinon « accueil-2 » _(si quête « undefined » undefined)_, sinon « accueil-3 » _(si quête « undefined » undefined)_, sinon « accueil »

### accueil

> Bienvenue au Nid ! Ici, on dort en hamac et on mange des soupes de fleurs. Pas de feu chez nous : les braises et les branches ne font pas bon ménage. Ce sont nos cristaux qui chauffent les bols.

- « Manger ou dormir ? » → servir
- _(sans repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles
- _(si repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles-vol
- « Au revoir. » → **fin**

### soupe

> Pétales de lune, racine douce et une pincée de mousse dorée. Ça réchauffe jusqu’au bout des orteils, tu verras.

- « Merci, Lisandre. » → accueil

### nouvelles

> Le Conseil des Racines Profondes se réunit beaucoup, ces temps-ci : on parle de la frontière, de Ferros, de ces forages… Et le petit Malo a encore traversé la passerelle du Bois en courant. Un jour, il s’envolera.

- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « indice-elvan »)_ « Il manque des graines au grenier. As-tu vu passer quelque chose ? » → graines _(retient « indice-elvan »)_
- « Merci. » → accueil

### nouvelles-vol

> Tu as entendu ? Quelqu’un a forcé le grenier des semences, dans les Hautes Ramures. Voler des graines à Canopéa… c’est comme voler l’avenir. Le Conseil est furieux.

- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « indice-elvan »)_ « Il manque des graines au grenier. As-tu vu passer quelque chose ? » → graines _(retient « indice-elvan »)_
- « Merci. » → accueil

### graines

> Lisandre baisse la voix. — Un marchand de la Compagnie des Lisières a pris pension ici : Elvan Morelle. Il paie en Fers tout neufs, et repart chaque semaine avec des ballots bien lourds pour du tissu. Il est là, au fond.

- « Merci, Lisandre. » → accueil

### vote

_Effet : retient « lisandre-vote-dit »._

> Tu sais la nouvelle ? Le Conseil ferme la frontière aux prospecteurs ! Les marchands de Ferros font la tête, ici. Moi, je leur sers double ration de soupe : la politique, ça creuse.

- « Merci pour la nouvelle. » → accueil

### vote-commerce

_Effet : retient « lisandre-vote-commerce-dit »._

> Tu sais la nouvelle ? Le Conseil garde le commerce avec Ferros, mais des Gardes Verts surveilleront chaque chantier. Les marchands respirent ; les druides, beaucoup moins.

- « Merci pour la nouvelle. » → accueil

### vote-accord

_Effet : retient « lisandre-vote-accord-dit »._

> Tu sais la nouvelle ? Le sol sacré est fermé, les routes restent ouvertes : tout le monde est content, pour une fois ! On dit que c’est une idée venue d’en bas… de quelqu’un qui y est descendu.

- « Merci pour la nouvelle. » → accueil

### elvan-parti

_Effet : retient « lisandre-elvan-parti-dit »._

> Le marchand du fond, Elvan ? Les Gardes Verts l’ont emmené, ballots et tout. Des graines du Conseil, dans du tissu ! Je change ses draps, et je ne veux plus en entendre parler.

- « Merci pour la nouvelle. » → accueil

### tournee

_Effet : retient « lisandre-tournee-dit »._

> Elvan, le marchand du fond, a payé une tournée à tout le Nid l’autre soir. Lui qui comptait chaque Fer ! Drôle d’homme. Tu en veux, de sa générosité ? Il en reste.

- « Merci pour la nouvelle. » → accueil

### flute

_Effet : retient « lisandre-flute-dit »._

> Tu as entendu, hier soir ? Une flûte, au Bosquet. C’était Aïlis Feuillevent. Toute l’auberge s’est tue pour l’écouter. Même les marchands de Ferros.

- « Merci pour la nouvelle. » → accueil

### servir

> — Une soupe, ou un hamac ? Les hamacs du Nid bercent au vent des cimes : on n’a jamais aussi bien dormi.

- **[8 Fers]** « Une soupe de fleurs. » → soupe _(−8 Fers, +15 PV)_
- **[10 Fers]** « Un hamac jusqu’au matin. » → dodo _(−10 Fers, +undefined XP)_
- **[10 Fers]** « Un hamac jusqu’à la nuit. » → dodo _(−10 Fers, +undefined XP)_
- « Rien, merci. » → accueil

### dodo

> Le hamac se balance au vent des cimes. Tu t’endors avant d’avoir compté les feuilles.

- « Se lever. » → **fin**

### accueil-2

> Bienvenue au Nid ! Ce matin, une nacelle a grincé si fort que tout le marché a levé la tête. Véline dit que ce n’est rien. Véline dit toujours que ce n’est rien.

- « Manger ou dormir ? » → servir
- _(sans repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles
- _(si repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles-vol
- « Au revoir. » → **fin**

### accueil-3

> Bienvenue au Nid ! Les cristaux de veille ont brillé toute la nuit au Bosquet : Mirelle dit que les noms gravés parlaient plus fort. Une soupe de fleurs, pour fêter ça ?

- « Manger ou dormir ? » → servir
- _(sans repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles
- _(si repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles-vol
- « Au revoir. » → **fin**

## Lyra Cœur-de-Sève

_Première Racine_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « enquete » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_, sinon « accueil »

### accueil

> Une elfe aux longs cheveux tressés de lianes t’observe. — Je suis Lyra Cœur-de-Sève, Première Racine : le pays, ses greniers, son commerce. Parle d’abord au Gardien : c’est lui qui reçoit les voyageurs.

- « Le commerce avec Ferros vous inquiète ? » → commerce
- « Bien, Première Racine. » → **fin**

### commerce

> Ferros nous vend le métal que nos forêts ne donnent pas ; nous lui vendons cristaux et remèdes. Une rumeur de trop, et ce sont les Lisières qui ont faim. Je n’aime pas Ferros. J’aime encore moins la faim.

- « Je comprends. » → **fin**

### enquete

> — Le Gardien veut des faits ; moi aussi. Si ce sont des gens de Ferros, apporte-moi des noms, pas des colères.

- « Je trouverai des noms. » → **fin**
- « Le commerce avec Ferros vous inquiète ? » → commerce

### apres

> — Grâce à toi, le Conseil a décidé avec des faits. C’est rare, et précieux. Que la sève coule pour toi.

- « Que la sève coule. » → **fin**

## Maëlis Lunelierre

_Mère de Nell_

Commence par : « apres » _(si quête « La berceuse oubliée » terminée)_, sinon « retour » _(si quête « La berceuse oubliée » en cours)_ _(si repère « berceuse-recueillie »)_, sinon « attente » _(si quête « La berceuse oubliée » en cours)_, sinon « demande »

### demande

> Tu es l’apprenti·e d’Ilyane ? Ma fille, Nell… depuis trois nuits, elle ne reconnaît plus la berceuse que je lui chante. Elle m’écoute comme on écoute une étrangère.

- « Je vais t’aider. Que puis-je faire ? » → piste _(lance la quête « La berceuse oubliée »)_
- « Je suis désolé·e. Je dois partir. » → **fin**

### piste

> Ilyane dit que les souvenirs perdus laissent parfois un Écho. Hier soir, au pied de l’Arbre-Titan, j’ai cru entendre ma propre voix… Si tu pouvais rapporter la berceuse à Nell…

- « J’y vais. » → **fin**

### attente

> Tu es allé·e au pied de l’Arbre-Titan ? On dit que l’Écho ne chante que pour ceux qui savent écouter.

- « Pas encore. J’y retourne. » → **fin**

### retour

> Tu as entendu l’Écho, je le vois à ton regard. Va voir Nell, je t’en prie. Chante-lui ce que tu as retenu.

- « J’y vais. » → **fin**

### apres

> Elle s’est endormie en chantonnant. Merci. Gardebois n’oubliera pas ce que tu as fait pour nous.

- « Prends soin d’elle. » → **fin**

## Malo Feuillevent

_Coursier des passerelles_

Commence par : « retour » _(si quête « Les lettres de Malo » en cours)_ _(si repère « sacoche-retrouvee »)_, sinon « attente » _(si quête « Les lettres de Malo » en cours)_, sinon « flute » _(si quête « Le chant d’Anselme » terminée)_ _(sans repère « malo-flute-dit »)_, sinon « ami » _(si quête « Les lettres de Malo » terminée)_, sinon « souci »

### accueil

> Salut ! Je suis Malo, coursier des passerelles. Je connais tous les chemins de Canopéa, même ceux qui n’existent pas encore !

- « Montre-moi la ville. » → ville
- « Tu n’as jamais peur de tomber ? » → peur
- « À plus tard, Malo. » → **fin**

### ville

> Facile ! Ici, c’est le marché. La petite nacelle, près du grand tronc, monte aux Hautes Ramures : le Conseil, l’atelier du luthier, et chez moi. La longue passerelle à l’est mène au Bosquet des Échos, là où l’on grave et où l’on parle à ses morts.

- « On parle à ses morts ? » → arbres
- « Merci, Malo. » → **fin**

### arbres

> Quand quelqu’un meurt, on le met en terre au pied d’un arbre, tout en bas. Mon grand-père Anselme repose là. Mamie Aïlis a gravé son nom au Bosquet et va lui parler chaque soir. Moi, je n’entends rien… mais je crois qu’il m’écoute quand même.

- « Il t’écoute, c’est certain. » → accueil

### peur

> Tomber ? Jamais ! Bon… une fois. Mais un filet de lianes m’a rattrapé. Mamie dit que la forêt n’aime pas qu’on lui jette des enfants.

- « Elle a bien raison. » → accueil

### souci

> Salut… Je suis Malo, coursier des passerelles. Enfin, coursier… Je viens de laisser tomber la sacoche des Nacelliers. Toutes les lettres de la semaine, dans le feuillage ! Si Véline l’apprend…

- « Je peux t’aider à la retrouver. » → aide _(lance la quête « Les lettres de Malo »)_
- « Montre-moi plutôt la ville. » → ville
- « Courage, Malo. » → **fin**

### aide

> C’est vrai ? Elle est tombée tout en bas, sur le Sol des Racines. Mais le sol est sacré : personne n’y descend sans l’accord des Nacelliers. Demande à Véline, à la Grande Nacelle. Si elle dit oui… elle te descendra.

- « J’y vais. » → **fin**

### attente

> Alors ? La sacoche est en cuir brun, avec le fermoir de cuivre des Nacelliers. Si tu vois des lettres par terre, c’est que tu chauffes !

- « Je la cherche encore. » → **fin**
- « Rappelle-moi ce qu’il faut faire. » → aide
- « Montre-moi la ville. » → ville

### retour

> La sacoche ! Tu l’as retrouvée ! Toutes les lettres sont là… presque toutes. Merci, merci ! Tiens, ce n’est pas grand-chose, mais c’est de bon cœur.

- « La voici, Malo. » → remerciements _(termine la quête « Les lettres de Malo », +30 XP, +10 Fers, retient « nacelliers-amis »)_

### remerciements

> Véline dit que tu as « le pied sûr ». Chez les Nacelliers, c’est le plus beau compliment. Si un jour tu as une lettre à faire porter, viens nous voir !

- « Avec plaisir, Malo. » → **fin**

### ami

> Salut, toi ! Grâce à toi, toutes les lettres sont arrivées. Les Nacelliers disent que tu as « le pied sûr ». Tu veux que je te montre un raccourci ?

- « Montre-moi la ville. » → ville
- « Tu n’as jamais peur de tomber ? » → peur
- « À plus tard, Malo. » → **fin**

### flute

_Effet : retient « malo-flute-dit »._

> Mamie joue de la flûte ! Tous les soirs, au Bosquet. Elle dit que c’est grâce à toi… et à Papi. Elle va m’apprendre. Je serai coursier ET musicien.

- _(si quête « Les lettres de Malo » pas commencée)_ « Merci pour la nouvelle. » → souci
- _(si quête « Les lettres de Malo » terminée)_ « Merci pour la nouvelle, Malo. » → ami
- « À bientôt, Malo. » → **fin**

## Mirelle Doucebranche

_Gardienne de Mémoire de Canopéa_

Commence par : « chanson » _(si quête « Le chant d’Anselme » en cours)_ _(sans repère « melodie-carnet »)_ _(si quête « Le carnet de chansons » pas commencée)_, sinon « chanson-copie » _(si quête « Le chant d’Anselme » en cours)_ _(sans repère « melodie-carnet »)_, sinon « bosquet » _(si quête « L’audience » terminée)_ _(sans repère « mirelle-bosquet-dit »)_, sinon « accueil »

### accueil

> Bienvenue au relais des Gardiens de Mémoire. Tu viens de Gardebois, n’est-ce pas ? Ça se voit à ta façon de tout regarder, comme si chaque chose avait une histoire. Je suis Mirelle.

- « Je peux me reposer ici ? » → repos _(+100 PV)_
- « Tu connais Ilyane ? » → ilyane
- « Parle-moi des Gardiens de Mémoire. » → ordre
- « Au revoir, Mirelle. » → **fin**

### repos

> Les hamacs du relais sont à tous les Gardiens. Dors un peu : la mémoire travaille mieux quand le corps se repose. … Au réveil, tes forces sont revenues.

- « Merci, Mirelle. » → accueil

### ilyane

> Nous avons fait notre apprentissage ensemble, il y a bien longtemps. Elle voulait tout entendre ; moi, tout écrire. Dis-lui que je garde encore son carnet de chansons… et qu’elle chante toujours aussi faux, j’en suis sûre.

- _(si quête « Le carnet de chansons » pas commencée)_ « Je peux le lui rapporter, si tu veux. » → carnet-confie _(donne 1 × « Carnet de chansons d’Ilyane », lance la quête « Le carnet de chansons »)_
- _(si quête « Le carnet de chansons » terminée)_ « Je le lui ai rendu. » → carnet-rendu
- « Je le lui dirai. » → accueil

### ordre

> Nous recueillons les histoires, et nous les transmettons. Tout a commencé avec Kael, le Premier Chroniqueur. Veux-tu que je te raconte ?

- _(sans repère « recit-kael-recu »)_ « Oui, raconte. » → kael _(retient « recit-kael-recu », retient le Récit « Kael, le Premier Chroniqueur », +10 XP)_
- _(si repère « recit-kael-recu »)_ « Raconte-moi encore. » → kael
- « Une autre fois. » → accueil

### kael

> Après la Grande Chute, Kael écrivit tout ce dont il se souvenait du monde perdu. Il fonda la première bibliothèque, à Sept-Portes. Chaque Gardien porte un peu de son carnet. Un jour, tu iras voir sa bibliothèque, toi aussi.

- « J’aimerais beaucoup. » → accueil

### chanson

> Bienvenue au relais. Tu as l’air de chercher quelque chose… une histoire, une chanson ?

- « Connais-tu la chanson des cerfs-lucioles ? » → carnet
- « Rien de particulier. » → accueil

### carnet

_Effet : retient « melodie-carnet »._

> Mirelle rit et sort un vieux carnet relié de ficelle. — Le carnet de chansons d’Ilyane. Elle chantait faux, mais elle écrivait juste. Tiens : la chanson des cerfs-lucioles, notée de sa main. Montre-la à Elouan, il saura la lire.

- « Merci, Mirelle. » → accueil

### carnet-confie

> Tu ferais ça ? Tiens. Il a voyagé avec moi trente ans ; il est temps qu’il rentre. Dis-lui de chanter la chanson de la page dix-sept. Elle saura pourquoi.

- « Je le lui porterai. » → **fin**

### carnet-rendu

> Elle a chanté la dix-sept ? Faux, j’imagine. Mirelle rit, puis s’essuie les yeux. — Merci. Certains souvenirs ont besoin de voyager pour rester vivants.

- « Elle a chanté faux. » → accueil

### chanson-copie

_Effet : retient « melodie-carnet »._

> La chanson des cerfs-lucioles ? Je l’ai recopiée avant de confier le carnet d’Ilyane : la voici. Montre-la à Elouan, il saura la lire.

- « Merci, Mirelle. » → accueil

### bosquet

_Effet : retient « mirelle-bosquet-dit »._

> Les noms se réchauffent, au Bosquet. Les plus jeunes d’abord ; les vieux prendront leur temps. J’ai tout écrit à Ilyane : tu lui as donné de quoi être fière.

- « Merci pour la nouvelle. » → accueil

## Nell Lunelierre

_Fille de Maëlis_

Commence par : « apres » _(si quête « La berceuse oubliée » terminée)_, sinon « chanson » _(si quête « La berceuse oubliée » en cours)_ _(si repère « berceuse-recueillie »)_, sinon « silence »

### silence

> Nell serre son oiseau de bois et regarde la fenêtre. « Maman chante, mais je ne connais pas cette chanson. Avant, je la connaissais… je crois. »

- « … » → **fin**

### chanson

> Nell lève les yeux vers toi. « Tu connais une chanson ? »

- « Lui chanter la berceuse de l’Écho. » → souvenir _(termine la quête « La berceuse oubliée », +30 XP)_
- « Pas encore. » → **fin**

### souvenir

> Dès les premiers mots, Nell chante avec toi : « Dors sous la feuille, dors sous le vent… » Elle court vers sa mère en riant. Dans la pièce, quelque chose se remet en place.

- « … » → **fin**

### apres

> « Dors sous la feuille… » Nell chantonne en faisant voler son oiseau de bois.

- « … » → **fin**

## L’archiviste Noam

_Archives Centrales de Ferros_

Commence par : « releve » _(si l’on porte « Relevé d’un Écho »)_ _(si quête « Les Échos sous la Forge » en cours)_, sinon « cle » _(si l’on porte « Clé de rouille bleue »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « apres-archives » _(si repère « cle-archives »)_, sinon « accueil »

### accueil

> — Archives Centrales de Ferros, comptoir public (voir : règlement, article quatre). Fonds ordinaires : consultation libre. Fonds scellés : Niveau Trois (voir : une autorisation, un motif, un patron).

- « Je cherche ce qui concerne le dernier train. » → train
- « Vous gardez tout ? » → tout
- _(si quête « L’audience » terminée)_ « Classez-vous aussi les nouvelles de Verdantis ? » → verdantis
- « Au revoir. » → **fin**

### tout

> — Ferros ne brûle rien : Ferros classe (voir : devise officieuse). Ce qui n’est pas classé n’existe pas encore.

- « Je vois. » → accueil

### train

_Effet : retient « fonds-zero-connu »._

> Noam ajuste ses lunettes. — Fonds Zéro (voir : coffre de fer scellé, arrivé avec les premiers habitants de la vallée). Contenu : non classé. Motif : clé manquante. La seule pièce de ces Archives que nous n’ayons jamais pu ranger.

- _(si quête « La Clé de Rouille Bleue » en cours)_ « Et si je trouvais cette clé ? » → si
- « Merci. » → **fin**

### si

> — Alors vous auriez rendu à Ferros un service considérable (voir : reconnaissance des Archives, article premier).

- « Je verrai. » → **fin**

### cle

> Noam ôte ses lunettes. Pour la première fois, il parle sans note. — Donnez-la-moi. Je vous ouvre le Fonds Zéro, et vos yeux seront les premiers à voir ce qu’il contient depuis la fondation de la ville.

- « La lui confier. » → ouverture _(reprend 1 × « Clé de rouille bleue », retient « cle-archives », termine la quête « La Clé de Rouille Bleue », +70 XP, retient le Récit « Le carnet du dernier train »)_
- « Pas encore. » → **fin**

### ouverture

> Dans la salle des fonds scellés, le coffre s’ouvre en grinçant. Dedans : le carnet de bord du dernier train, et la carte de toutes les voies endormies. Une ligne a été grattée, avec soin. Noam pâlit et referme vite le carnet.

- « Qui a gratté cette ligne ? » → gratte
- « Merci, Noam. » → **fin**

### gratte

> — Classé. (Voir : plus tard.) Il ne te regarde pas. — Vous avez rendu service aux Archives. Elles s’en souviendront : c’est leur métier.

- « Au revoir. » → **fin**

### apres-archives

> — Le Fonds Zéro est classé, enfin (voir : vous). Pour le reste, revenez quand vous aurez le Niveau Trois. Ou une très bonne raison.

- « Au revoir. » → **fin**

### verdantis

> — Tout télégramme est classé (voir : règlement, article neuf). Verdantis, dernier reçu : séance du Conseil de Canopéa.

- _(si repère « conseil-frontiere »)_ « Le lire. » → tg-frontiere
- _(si repère « conseil-commerce »)_ « Le lire. » → tg-commerce
- _(si repère « conseil-accord »)_ « Le lire. » → tg-accord
- « Une autre fois. » → accueil

### tg-frontiere

> — « Verdantis ferme sa frontière aux prospecteurs de Ferros. Les Gardes Verts la tiennent. » Classé (voir : incidents diplomatiques). Au Bureau des Permis, on ne parle que de ça.

- « Merci. » → accueil

### tg-commerce

> — « Verdantis garde le commerce ouvert ; chaque chantier sera surveillé. » Classé (voir : accords commerciaux). Les marchands de la Lisière ont respiré, paraît-il.

- « Merci. » → accueil

### tg-accord

> — « Le sol sacré est fermé, la route reste ouverte. » Classé (voir : accords, catégorie rare : ceux qui satisfont tout le monde). Je l’ai relu deux fois.

- « Merci. » → accueil

### releve

_Effet : reprend 1 × « Relevé d’un Écho », retient « echos-archives », termine la quête « Les Échos sous la Forge », +40 XP._

> Noam lit le relevé deux fois, sans un mot. — Écho, Forges-Basses, sous la forge froide (voir : superstitions). Langue : inconnue. Période : impossible. Il trempe sa plume. — Je le classe quand même. Ferros ne brûle rien.

- « Où le rangerez-vous ? » → releve-ou
- « Merci, Noam. » → **fin**

### releve-ou

> — Fonds ordinaire, section des Échos, sous-section « non attribués ». Elle est plus fournie qu’on ne croit (voir : registre). Ce qui n’a pas d’époque finit toujours par en trouver une.

- « Merci, Noam. » → **fin**

## Le contrôleur Ostrik

_Bureau des Transports_

Commence par : « apres » _(si repère « rail-bureau »)_, sinon « rapport » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « verite-rail »)_, sinon « accueil »

### accueil

> Un homme en gris clair note tout sur une planchette. — Contrôleur Ostrik, Bureau des Transports. Trois convois perdus : vol ou négligence, j’écrirai lequel.

- « Remplacer les cheminots par des machines ? » → machines
- « Au revoir. » → **fin**

### machines

> — Ferros a déjà fait rouler des machines sans hommes, du temps de la Guerre du Rail. Elles ne dorment pas, ne s’endettent pas, et ne font jamais grève. Un rapport de plus, et le Bureau tranchera.

- « Au revoir. » → **fin**

### rapport

> Ostrik lève sa planchette. — Vous avez quelque chose pour le Bureau ?

- « Tout : l’aiguilleur, les Marches, la machine sans homme. » → fin-bureau _(retient « rail-bureau », +60 Fers, termine la quête « Le Rail des Cendres », +40 XP)_
- « Rien encore. » → **fin**

### fin-bureau

> — Parfait. Les visières rouges descendront à la Cendrière cette nuit. L’aiguilleur sera classé : renvoyé. La machine ira aux Manufactures : si elle conduit seule, elle conduira pour l’Empire. Votre prime : soixante Fers.

- « … » → **fin**

### apres

> — Affaire classée (dossier Cendrière). Le Bureau étudie la machine. Les cheminots, eux, devront s’y faire.

- « Au revoir. » → **fin**

## Le patrouilleur à visière rouge

_Funiculaire des Manufactures-Moyennes_

Commence par : « liste » _(si quête « undefined » undefined)_ _(sans repère « liste-ferros »)_, sinon « passe » _(si repère « laissez-passer-ironheart »)_, sinon « controle »

### controle

> Un patrouilleur en armure noircie lève sa visière rouge. — Funiculaire des Manufactures-Moyennes. Laissez-passer.

- _(si l’on porte « Sauf-conduit du Triumvirat »)_ « Montrer le sauf-conduit du Triumvirat. » → sauf
- **[10 Fers]** « Acheter un laissez-passer de visiteur. » → achat _(−10 Fers)_
- **🎲 Subterfuge 13** « Bluffer : « Je livre pour l’atelier Cendrefer. » » → bluff-ok, ✗ → bluff-rate
- « Je repasserai. » → **fin**

### sauf

_Effet : retient « laissez-passer-ironheart »._

> Il fait tourner le sceau d’émeraude entre ses gros doigts. — Laissez-passer diplomatique de Verdantis. Pas d’histoires là-haut, compris ?

- « Monter. » → **fin** _(mène à « Ironheart — Les Manufactures-Moyennes »)_
- « Plus tard. » → **fin**

### achat

_Effet : retient « laissez-passer-ironheart »._

> — Dix Fers. Visite d’une semaine, Manufactures-Moyennes seulement. Il tamponne un carton gris et te le tend.

- « Monter. » → **fin** _(mène à « Ironheart — Les Manufactures-Moyennes »)_
- « Plus tard. » → **fin**

### bluff-ok

_Effet : retient « laissez-passer-ironheart »._

> — Cendrefer ? Bon. Dépêche-toi, et pas de détours.

- « Monter. » → **fin** _(mène à « Ironheart — Les Manufactures-Moyennes »)_
- « Plus tard. » → **fin**

### bluff-rate

> — Sans bon de livraison ? Circule, avant que je te garde au poste le temps de vérifier.

- « Circuler. » → **fin**

### passe

> — Laissez-passer en règle. Le funiculaire part quand il part.

- « Monter. » → **fin** _(mène à « Ironheart — Les Manufactures-Moyennes »)_
- « Plus tard. » → **fin**

### liste

_Effet : retient « liste-ferros »._

> Le patrouilleur pointe ton cou du menton. — Un cristal. Nom, provenance. Il griffonne dans un carnet noir. — Ferros tient des listes : qui porte un cristal, on aime savoir où il dort. Rien de personnel.

- « C’est interdit ? » → liste-pourquoi
- _(sans repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → controle
- _(si repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → passe
- « Bon. » → **fin**

### liste-pourquoi

> — Interdit, non. Surveillé. Les technomanciens, on les surveille de près, et qui joue au feu sans être pyromancien aussi. Garde-le sous ta chemise, et tout ira bien.

- _(sans repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → controle
- _(si repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → passe
- « Compris. » → **fin**

## La patrouilleuse des Manufactures

_Funiculaire des Manufactures-Hautes_

Commence par : « ferme »

### ferme

> — Manufactures-Hautes. Accès réservé, sur convocation. Personne ne monte sans y être appelé, et ceux qui y montent ne redescendent guère.

- « Qu’y a-t-il, là-haut ? » → haut
- « Je comprends. » → **fin**

### haut

> — Là-haut ? Des gens qui ne donnent plus de nouvelles. Je n’en sais pas plus, et ça me va très bien.

- « Merci. » → **fin**

## La machine sans homme

_Au dépôt de la Veilleuse_

Commence par : « dort »

### dort

> La machine sans homme dort au dépôt de la Veilleuse. Ses cristaux battent lentement, comme un cœur au repos. Quelqu’un a peint sur sa plaque : « Arrivée. »

- « La laisser dormir. » → **fin**

## La machine sans homme

_Au bout de l’embranchement_

Commence par : « machine »

### machine

_Effet : retient « verite-rail »._

> Une machine trapue, sans cabine ni siège, montée sur des roues de convoi. Deux cristaux bleus battent lentement à l’avant. Elle frémit, comme si elle voulait repartir.

- « Lire la plaque. » → plaque
- **[Mémoire 3]** _(sans repère « pilote-ecoute »)_ « Poser la main sur le métal et écouter. » → memoire
- « S’éloigner. » → **fin**

### plaque

> Une plaque de cuivre, presque effacée : « CHANTIER OUEST — MACHINE SANS HOMME — 1388 ». Une machine du temps de la Guerre du Rail, que les Marches ont trouvée et remise en marche.

- **[Érudition 2]** « Se souvenir de ce qu’on raconte du Chantier Ouest. » → chantier
- « S’éloigner. » → **fin**

### chantier

> Pendant la Guerre du Rail, Ferros envoya vers l’ouest des machines sans hommes, les premières de l’Empire, pour poser la voie à travers la forêt. La forêt les démonta, boulon par boulon. Celle-ci est revenue.

- « S’éloigner. » → **fin**

### memoire

_Effet : retient « pilote-ecoute », retient le Récit « La machine qui roulait vers l’ouest », +15 XP._

> Sous ta main, un ordre très ancien, répété sans fin : « Vers l’ouest. Rejoindre le chantier. » Le chantier n’existe plus depuis des siècles. La machine ne vole rien : elle obéit. Les pilleurs n’ont fait que l’atteler.

- « Retirer la main. » → **fin**

## Porte du grenier des semences

_Objet_

Commence par : « verrouillee »

### verrouillee

> Une porte ronde, fermée par une serrure de bois et de cuivre. Une plaque indique : « Grenier des semences — propriété du Conseil ».

- **🎲 Artisanat 12** « Crocheter la serrure. » → ouverte, ✗ → echec
- « Laisser la porte tranquille. » → **fin**

### ouverte

_Effet : retient « grenier-deverrouille »._

> Un petit déclic, et la porte s’entrouvre sur une odeur de graines sèches.

- « Entrer. » → **fin** _(mène à « Canopéa — Grenier des semences »)_
- « Ne pas entrer pour l’instant. » → **fin**

### echec

> La serrure résiste. Une passerelle grince non loin : mieux vaut ne pas s’acharner trop longtemps.

- « Réessayer. » → verrouillee
- « Partir. » → **fin**

## Le registre des départs

_Triage des Cendres_

Commence par : « registre »

### registre

_Effet : retient « indice-registre »._

> Le registre des départs. Trois nuits du mois, la même ligne : « Convoi de minerai, trois wagons — parti sans conducteur. » Et chaque fois, en bas, la signature de l’aiguilleur de nuit : J. Brakel.

- « Refermer le registre. » → **fin**

## Un renfoncement sans enseigne

_Entre deux fonderies éteintes_

Commence par : « mur »

### mur

> Entre deux fonderies éteintes, un renfoncement sans enseigne. Un mur noirci de suie, et rien d’autre… en apparence.

- _(si repère « marche-cendres-indice »)_ « Chercher le passage, comme on te l’a dit. » → trouve
- **[Investigation 2]** « Examiner le mur. » → trouve
- « Faire luire un cristal le long du mur. » → trouve _(+undefined XP)_
- « Passer son chemin. » → **fin**

### trouve

_Effet : retient « marche-cendres-connu »._

> Derrière une tôle mal fixée, un tunnel s’enfonce sous les fondations, éclairé à l’huile. Une odeur de cendre monte d’en bas.

- « Descendre. » → **fin** _(mène à « Ironheart — Le Marché des Cendres »)_
- « Pas maintenant. » → **fin**

## Rika Martelroux

_Chaudronnière, mère de Brann_

Commence par : « accueil »

### accueil

> Une chaudronnière aux bras couverts de suie lève les yeux. — Gardebois ? Tu connais mon Brann ? Il travaille chez Tobias Cendrefer… Il mange bien ? Il ne fait pas trop de bêtises ?

- « Brann va bien. Il est honnête et travailleur. » → brann
- _(si quête « La caisse égarée » terminée)_ _(sans repère « rika-merci »)_ « J’ai rapporté sa caisse d’outils, sur la route de l’est. » → caisse
- « Le Marché des Cendres, ça te dit quelque chose ? » → marche
- « Au revoir. » → **fin**

### brann

> Rika sourit pour la première fois. — Maladroit, je parie, comme son père. Dis-lui que sa mère est fière de lui. Et qu’il écrive, de temps en temps.

- « Je le lui dirai. » → **fin**

### marche

_Effet : retient « marche-cendres-indice »._

> Elle baisse la voix. — Cherche le trou entre deux fonderies froides, à l’est, et ne dis à personne que tu l’as trouvé. Les gens bien n’y vont pas. Les gens bien ont tort, parfois.

- « Merci, Rika. » → **fin**

### caisse

_Effet : retient « rika-merci », +10 XP._

> Rika pose son marteau. — C’était toi ? Il m’a écrit une lettre entière pour le raconter, sans une seule faute. Il ne m’écrit jamais ! Merci. Et si tu cherches quelque chose, ici, demande-moi d’abord.

- « Il est fier de toi aussi. » → **fin**
- « Je m’en souviendrai. » → accueil

## Rocher moussu

_Objet_

Commence par : « vide » _(si repère « sauge-3-cueillie »)_, sinon « chercher » _(si quête « Les herbes de lisière » en cours)_, sinon « rocher »

### rocher

> Un gros rocher couvert de mousse.

- « … » → **fin**

### chercher

> Un gros rocher couvert de mousse. Liane parlait d’une lueur sous une pierre…

- **[Perception 4]** « Repérer la lueur sous la mousse. » → trouve
- **🎲 Survie 11** « Suivre l’odeur poivrée de la sauge. » → trouve, ✗ → rien
- « Laisser tomber. » → **fin**

### trouve

_Effet : retient « sauge-3-cueillie »._

> Sous le rebord du rocher, une touffe de sauge-lumière brille dans l’ombre. Tu la cueilles avec soin.

- « … » → **fin**

### rien

> Tu tournes autour du rocher sans rien trouver. Peut-être en revenant plus tard…

- « … » → **fin**

### vide

> Le creux sous le rocher, où poussait la sauge-lumière.

- « … » → **fin**

## La sacoche des Nacelliers

_Objet_

Commence par : « ours » _(sans repère « ours-sol-vaincu »)_ _(sans repère « ours-sol-eloigne »)_, sinon « libre »

### ours

> La sacoche est là, sous la patte d’un Ours-Mousse endormi, roulé dans la mousse comme dans un édredon.

- **🎲 Discrétion 11** « Glisser la main sous sa patte, tout doucement. » → prise, ✗ → reveil
- **[Survie 2]** « L’attirer plus loin avec une poignée de baies. » → eloigne
- « Le réveiller et l’affronter. » → **fin** _(lance le combat « ours-sacoche »)_
- « Reculer sans bruit. » → **fin**

### reveil

> L’ours ouvre un œil, puis deux. Il grogne et se dresse de toute sa hauteur, la sacoche toujours sous lui.

- « Se défendre ! » → **fin** _(lance le combat « ours-sacoche »)_
- « Reculer vers la nacelle. » → **fin**

### eloigne

_Effet : retient « ours-sol-eloigne »._

> L’ours renifle, se lève en bâillant et suit la piste de baies en grognant de plaisir. La voie est libre.

- « Prendre la sacoche. » → prise

### libre

> La sacoche des Nacelliers, en cuir brun, est restée dans la mousse. Le fermoir de cuivre a tenu : les lettres sont là.

- « La prendre. » → prise

### prise

_Effet : retient « sacoche-retrouvee »._

> Tu passes la sacoche à ton épaule. Il est temps de remonter par la nacelle et de rendre ses lettres à Malo.

- « Partir. » → **fin**

## Sauge-lumière

_Plante_

Commence par : « cueillir » _(si quête « Les herbes de lisière » en cours)_, sinon « plante »

### plante

> Une petite plante aux feuilles argentées, qui luit doucement. L’herboriste saurait sans doute à quoi elle sert.

- « La laisser. » → **fin**

### cueillir

> De la sauge-lumière, bien vivante. Ses feuilles tiédissent au creux de ta main.

- « La cueillir. » → **fin** _(retient « sauge-1-cueillie »)_
- « La laisser. » → **fin**

## Sauge-lumière

_Plante_

Commence par : « cueillir » _(si quête « Les herbes de lisière » en cours)_, sinon « plante »

### plante

> Une petite plante aux feuilles argentées, qui luit doucement. L’herboriste saurait sans doute à quoi elle sert.

- « La laisser. » → **fin**

### cueillir

> De la sauge-lumière, bien vivante. Ses feuilles tiédissent au creux de ta main.

- « La cueillir. » → **fin** _(retient « sauge-2-cueillie »)_
- « La laisser. » → **fin**

## Sévane Mielvert

_Herboriste du Comptoir de la Sève_

Commence par : « accueil »

### accueil

> Le Comptoir de la Sève, bonjour ! Herbes de la canopée, baumes de mousse, bandages… Tout ce qui soigne pousse ici, ou presque.

- « Voyons ce que tu vends. » → **fin** _(ouvre le Troc)_
- « D’où viennent tes herbes ? » → herbes
- « Tu vends des cristaux ? » → cristaux
- « Au revoir. » → **fin**

### herbes

> Des branches hautes, là où le soleil touche en premier. On ne cueille jamais tout : une feuille sur trois reste à l’arbre. C’est la règle de la Sève.

- « Une belle règle. » → accueil

### cristaux

> — Des cristaux de Vie, oui : deux cent cinquante Fers le petit. Mais si tu veux apprendre, va voir le druide Vanel, au Bosquet des Échos : les Druides Verts prêtent et enseignent pour rien. C’est leur loi.

- « Voyons ce que tu vends. » → **fin** _(ouvre le Troc)_
- « Merci, Sévane. » → accueil

## Sorn

_Marches des Cendres, à la Cendrière_

Commence par : « apres » _(si repère « rail-marches »)_, sinon « accueil »

### accueil

_Effet : retient « verite-rail »._

> Un homme au manteau de cendre compte des caisses de minerai. — De la visite. Les visites coûtent cher, ici. Je suis Sorn, et je rachète ce que Ferros oublie : les vieilles machines, et les dettes.

- « Ces convois appartiennent au rail. » → rail
- _(si quête « Le Rail des Cendres » en cours)_ « Combien pour mon silence ? » → marche
- « Au revoir. » → **fin**

### rail

> — Le rail ? Il a laissé ses aiguilleurs aux prêteurs bien avant nous. Nous, on rachète leurs dettes. Et la machine roule toute seule : personne n’est blessé. Toute relique a un prix, même une locomotive.

- _(si quête « Le Rail des Cendres » en cours)_ « Combien pour mon silence ? » → marche
- « Au revoir. » → **fin**

### marche

> — Quatre-vingts Fers, et tu n’as rien vu. Un convoi sur dix, pas plus : le Bureau ne s’en apercevra même pas.

- « Marché conclu. » → conclu _(+80 Fers, retient « rail-marches », termine la quête « Le Rail des Cendres », +30 XP)_
- « Non. » → **fin**

### conclu

> Sorn compte les pièces une à une dans ta main. — Les Marches n’oublient pas leurs amis. Ni ceux qui ne le sont pas.

- « … » → **fin**

### apres

> — Tiens, une tête connue. La machine roule, les wagons arrivent. Tout le monde y gagne… presque.

- « Au revoir. » → **fin**

## Sylvan Mousserelle

_Aubergiste de la Racine_

Commence par : « ilyane-chante » _(si quête « Le carnet de chansons » terminée)_ _(sans repère « sylvan-ilyane-chante-dit »)_, sinon « triumvirat » _(si quête « L’audience » terminée)_ _(sans repère « sylvan-triumvirat-dit »)_, sinon « accueil-2 » _(si quête « undefined » undefined)_, sinon « accueil-3 » _(si quête « undefined » undefined)_, sinon « accueil »

### accueil

> Bienvenue à la Racine ! Ici, on mange chaud et on parle fort. Assieds-toi : chez Sylvan, les Gardiens de Mémoire sont toujours bien reçus.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Au revoir. » → **fin**

### repas

> Soupe de racines, pain de mousse et une part de tarte aux baies. Ça remet d’aplomb, pas vrai ?

- « Merci, Sylvan. » → accueil

### rumeurs

> On dit que la maladie des souvenirs vient de la Gare, depuis que Ferros y creuse. La petite Nell, chez les Lunelierre, ne reconnaît plus sa propre berceuse… Et Brann, le gamin de Tobias, a perdu une caisse sur la route de l’est.

- « Et l’herboriste, Liane ? » → liane
- « Merci. » → accueil

### liane

> Liane ? Toujours au bord du ruisseau, près du marché, le nez dans ses herbes. Elle est brusque, mais personne ne soigne mieux qu’elle.

- « Merci. » → accueil

### ilyane-chante

_Effet : retient « sylvan-ilyane-chante-dit »._

> Ilyane a chanté au cercle des lanternes, hier soir ! Avec un vieux carnet revenu de Canopéa. Elle chante faux comme une casserole, mais j’ai pleuré dans ma tarte.

- « Merci pour la nouvelle. » → accueil

### triumvirat

_Effet : retient « sylvan-triumvirat-dit »._

> Les nouvelles vont vite, par le courrier des Nacelliers : tu as parlé devant le Triumvirat Vert ! À la Racine, on boit à ta santé. Enfin, au jus de baies. Tu veux un verre ?

- « Merci pour la nouvelle. » → accueil

### servir

> — Une soupe, ou une chambre ? La chambre du fond est calme : on n’y entend que le ruisseau.

- **[8 Fers]** « Un repas chaud. » → repas _(−8 Fers, +15 PV)_
- **[6 Fers]** « Une chambre jusqu’au matin. » → dodo _(−6 Fers, +undefined XP)_
- **[6 Fers]** « Une chambre jusqu’à la nuit. » → dodo _(−6 Fers, +undefined XP)_
- « Rien, merci. » → accueil

### dodo

> Un lit de mousse, une couverture qui sent la fumée de bois. Tu dors d’une traite.

- « Se lever. » → **fin**

### accueil-2

> Bienvenue à la Racine ! Aujourd’hui, la caravane de midi est partie en retard : un essieu, paraît-il. Assieds-toi, la soupe, elle, est à l’heure.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Au revoir. » → **fin**

### accueil-3

> Bienvenue à la Racine ! Ce matin, Tobias a vendu trois lampes à cristal avant même d’ouvrir. Il dit que les nuits rallongent. Moi, je dis qu’il parle trop.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Au revoir. » → **fin**

## La tailleuse de cristaux

_Marché des Cendres_

Commence par : « accueil »

### accueil

> Sous une tente basse, une femme aux mains noircies taille un cristal rouge veiné de noir. — Cristaux de forge, taillés ici, sous terre. Là-haut, qui en achète, on l’inscrit : Ferros tient des listes. Ici, rien ne s’écrit.

- « Voyons tes cristaux. » → **fin** _(ouvre le Troc)_
- « Que fait un cristal de forge ? » → forge
- « Au revoir. » → **fin**

### forge

> — Il chauffe, il mord, il brûle : les Flammes forgées. Les pyromanciens en font des prières, les technomanciens des machines. Toi, fais-en ce que tu veux, mais pas sous le nez d’un patrouilleur.

- « Voyons tes cristaux. » → **fin** _(ouvre le Troc)_
- « Merci. » → **fin**

## L’Ancien Thalorin

_Voix de Gaïa_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « enquete » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « accueil »

### accueil

> La dryade ressemble à un jeune arbre qui aurait décidé de s’asseoir ; ses cheveux sont des feuilles. — Je suis Thalorin, Voix de Gaïa. J’écoute les arbres pour ceux qui n’ont plus le temps de le faire.

- « Qu’est-ce que la Voix de Gaïa ? » → role
- « Que la sève coule. » → **fin**

### role

> La forêt, l’esprit, l’arbitrage. Quand le Gardien et la Première Racine ne s’entendent pas, c’est vers moi qu’ils se tournent. Ce n’est pas toujours confortable.

- « Je comprends. » → **fin**

### enquete

> — Les arbres ne parlent pas avec des mots, mais ils disent où ils ont mal. Touche les plus vieux signes du Bosquet. Et si le bois se tait, regarde vers le bas : les racines descendent loin.

- « Merci, Ancien. » → **fin**

### apres

> — Les Voix des Arbres soignent les racines du Bosquet. Déjà, les plus jeunes noms se réchauffent. Les plus vieux prendront plus de temps : ils ont toujours pris leur temps.

- « Que la sève coule. » → **fin**

## Tiven

_Jeune Nacellier_

Commence par : « gueri » _(si repère « tiven-soigne »)_, sinon « quete » _(si quête « Un prêt de la Terre » en cours)_, sinon « blesse »

### blesse

> Un jeune Nacellier souffle sur ses paumes rougies. — Une corde a filé entre mes mains. Ça brûle… Demain, je dois monter la nacelle, et je ne peux même pas fermer le poing.

- _(si l’on porte « Bandage »)_ _(sans repère « tiven-panse »)_ « Panser ses mains avec un bandage. » → panse _(reprend 1 × « Bandage », retient « tiven-panse », +5 XP)_
- « Courage, Tiven. » → **fin**

### quete

> Tiven tend ses paumes rougies. — C’est Vanel qui t’envoie ? Il dit que les cristaux écoutent mieux que les herboristes. Moi, je veux juste pouvoir fermer le poing demain.

- « Poser le cristal de Vie sur ses mains. » → soin _(+undefined XP, retient « tiven-soigne », +15 XP)_
- _(si l’on porte « Bandage »)_ _(sans repère « tiven-panse »)_ « Panser ses mains avec un bandage. » → panse _(reprend 1 × « Bandage », retient « tiven-panse », +5 XP)_
- « Je reviens. » → **fin**

### soin

> Le cristal tiédit sous tes doigts, puis verdit comme une feuille au soleil. Une chaleur passe de tes mains aux siennes. Tiven ferme le poing, l’ouvre, le referme. — Ça ne brûle plus ! Va le dire à Vanel.

- « Prends soin de tes mains. » → **fin**

### panse

> Tu serres le bandage avec soin. — Merci. Ça brûle encore, mais je pourrai tenir une corde.

- « Ménage-toi. » → **fin**

### gueri

> Tiven te montre des paumes roses et neuves. — Regarde ! Aujourd’hui, j’ai déjà monté trois nacelles. Remercie Vanel pour moi.

- « Bon courage. » → **fin**

## Tobias Cendrefer

_Marchand de Ferros_

Commence par : « accueil »

### accueil

> Bienvenue à l’étal Cendrefer ! Outils de Ferros, cordes, lampes à cristal… et les meilleures rumeurs du marché, pour qui sait les écouter.

- _(si quête « Le Dernier Train » en cours)_ _(sans repère « laissez-passer »)_ « Je dois entrer sur le chantier de la Gare Engloutie. » → chantier
- _(si repère « laissez-passer »)_ « Merci encore pour le laissez-passer. » → merci
- « Que racontent les gens, au marché ? » → rumeurs
- « Au revoir. » → **fin**

### rumeurs

> Que des gens voient des trains et des flammes. Les Verdantins disent que c’est la faute de Ferros, forcément. Moi, je dis que la peur fait vendre les rumeurs… et pas les lampes.

- « Voir l’étal. » → **fin** _(ouvre le Troc)_
- « Parlons d’autre chose. » → accueil
- « Au revoir. » → **fin**

### chantier

> Le chantier ? C’est l’ingénieure Ingrid Brisefer qui le dirige. Personne n’y entre sans laissez-passer. Il se trouve que j’en ai un… qui m’a coûté cher.

- **[Diplomatie 2]** « Si ce chantier rend le marché malade, tes clients partiront. M’aider, c’est aider tes affaires. » → convaincu _(retient « laissez-passer », +25 XP)_
- « Combien en veux-tu ? » → prix
- « Je trouverai un autre moyen. » → **fin**

### prix

> Cinquante Fers, et c’est un prix d’ami. Ne fais pas cette tête : à Ferros, tout se paie, même l’amitié.

- **[50 Fers]** « Payer cinquante Fers. » → achete _(−50 Fers, retient « laissez-passer »)_
- « Je n’ai pas cette somme. » → chantier
- « Au revoir. » → **fin**

### convaincu

> … Tu parles comme un marchand de Ferros, toi. Tiens, prends-le. Et si Brisefer te pose la question, tu ne l’as pas eu de moi.

- « Promis. » → **fin**

### merci

> Fais-en bon usage. Et si tu croises Brisefer, dis-lui que l’étal Cendrefer vend des lampes qui ne s’éteignent pas sous terre.

- « Au revoir. » → **fin**

### achete

> Tobias compte les pièces deux fois. — Prix d’ami. Et si Brisefer te pose la question, tu ne l’as pas eu de moi.

- « Merci, Tobias. » → **fin**

## Un trou de fouille

_Objet_

Commence par : « trou »

### trou

> Un trou carré, étayé de planches neuves, au bord d’une vieille voie à demi enfouie sous les racines. Des outils de Ferros traînent encore à côté.

- « Regarder au fond. » → fond
- **[Investigation 2]** « Examiner les outils. » → outils
- « Éclairer le fond du trou d’un cristal. » → outils _(+undefined XP)_
- « Partir. » → **fin**

### fond

_Effet : retient « fouille-vue »._

> Au fond, un tronçon de rail rouillé, et des marques de pioche toutes fraîches. Quelqu’un fouille le sol sacré, et pas pour y planter des graines.

- « Partir. » → **fin**

### outils

_Effet : retient « fouille-vue », retient « fouille-marches »._

> Des pelles de Ferros, et une étiquette de marchand, à l’encre : « Lot douze, reliques. À livrer au Marché des Cendres. »

- « Garder ça en mémoire. » → **fin**

## Le guetteur du tunnel

_Marches des Cendres_

Commence par : « guetteur » _(si quête « Le Rail des Cendres » en cours)_, sinon « ferme »

### ferme

> Le tunnel de l’embranchement s’enfonce sous les terrils. Un guetteur en manteau de cendre fume à l’entrée. — Rien à voir, ici. Circule.

- « Circuler. » → **fin**

### guetteur

> Le tunnel de l’embranchement s’enfonce sous les terrils. Un guetteur en manteau de cendre fume à l’entrée. — Rien à voir, ici.

- _(si repère « joss-avoue »)_ « « Levier ouvert. » » → passe
- _(si repère « pilleurs-vaincus »)_ « « Tes deux amis de l’aiguillage ne viendront pas. » » → passe
- **🎲 Discrétion 12** « Se glisser dans l’ombre des wagons. » → passe, ✗ → repere
- « Faire demi-tour. » → **fin**

### passe

_Effet : retient « cendriere-ouverte »._

> Le guetteur hausse les épaules et s’écarte. Le tunnel sent la suie et le cristal chaud. Au bout, une lueur orange.

- « Entrer. » → **fin** _(mène à « Ironheart — La Cendrière »)_

### repere

> — Hé ! Le guetteur te pousse dehors. — La prochaine fois, j’appelle les autres.

- « Reculer. » → **fin**

## Vanel Lentefeuille

_Druide Vert, au Bosquet des Échos_

Commence par : « apres » _(si quête « Un prêt de la Terre » terminée)_, sinon « retour » _(si quête « Un prêt de la Terre » en cours)_ _(si repère « tiven-soigne »)_, sinon « attente » _(si quête « Un prêt de la Terre » en cours)_, sinon « accueil »

### accueil

> Un druide en robe verte pose la main sur l’écorce du grand arbre, comme on prend un pouls. — Racines profondes. Je suis Vanel, Druide Vert. La magie est un prêt de la Terre : on ne la prend pas, on l’emprunte.

- _(si quête « Un prêt de la Terre » pas commencée)_ « Apprends-moi. » → apprendre
- « Qu’est-ce qu’un cristal de Résonance ? » → cristal
- « Que la sève coule. » → **fin**

### cristal

> — Une pierre qui écoute la Terre depuis trois mille ans. Sa couleur dit son pouvoir : le vert guérit, le rouge brûle. Tout le monde peut s’en servir, en théorie. Certains l’entendent mieux que d’autres.

- _(si quête « Un prêt de la Terre » pas commencée)_ « Apprends-moi. » → apprendre
- « Merci, Vanel. » → **fin**

### apprendre

_Effet : lance la quête « Un prêt de la Terre », donne 1 × « Cristal de Vie prêté », retient « cristal-prete »._

> Il décroche de son cou un petit cristal émeraude. — Je te le prête. Porte-le au cou, et va voir Tiven, à la Grande Nacelle : un jeune Nacellier s’est brûlé les mains aux cordes. Pose le cristal sur ses mains, et écoute.

- « J’y vais. » → **fin**
- « Et si je force trop ? » → prix

### prix

> — Alors tu sauras ce que coûte la magie. Quand le cristal n’a plus rien à donner, c’est toi qui paies : la fatigue, le nez qui saigne. Ne force jamais longtemps. Une bonne nuit de sommeil rend tout.

- « Compris. » → **fin**

### attente

> Vanel ne quitte pas l’arbre des yeux. — Tiven t’attend à la Grande Nacelle, près du débarcadère. Le cristal au cou, d’abord : on n’entend pas une pierre qui dort au fond d’un sac.

- « Et si je force trop ? » → prix
- « J’y vais. » → **fin**

### retour

_Effet : termine la quête « Un prêt de la Terre », +40 XP, +undefined XP._

> Vanel sourit avant que tu parles. — Je l’ai entendu d’ici, et l’arbre aussi. Garde le cristal : ce n’est pas un don, c’est un prêt. Tu le rendras en soignant à ton tour.

- « Qu’apprend-on ensuite ? » → lueur
- « Et à Ferros ? » → ferros
- « Merci, Vanel. » → **fin**

### lueur

> — La Lueur. Tous les cristaux savent briller : pense à une lanterne, et il s’allume de sa couleur. Dans le noir, il montre ce que l’ombre cache. Pour le feu, il faut un cristal de forge… et ce n’est pas un druide qui te l’apprendra.

- « Et à Ferros ? » → ferros
- « Merci, Vanel. » → **fin**

### ferros

> — À Ferros, la magie est « l’étincelle du Souffle ». On l’y respecte, mais on tient des listes de ceux qui portent un cristal. Là-bas, garde-le sous ta chemise.

- _(si quête « Un prêt de la Terre » terminée)_ « Qu’apprend-on ensuite ? » → lueur
- « Merci, Vanel. » → **fin**

### apres

> — Racines profondes. Le cristal te parle encore ? Écoute-le. Et n’oublie pas : un prêt de la Terre se rend en soignant.

- « Parle-moi de la Lueur. » → lueur
- « Et à Ferros ? » → ferros
- « Et si je force trop ? » → prix
- « Que la sève coule. » → **fin**

## Varka

_Cheffe d’équipe, Travailleurs du Rail_

Commence par : « apres-rail » _(si repère « rail-travailleurs »)_, sinon « apres-bureau » _(si repère « rail-bureau »)_, sinon « apres-marches » _(si repère « rail-marches »)_, sinon « verdict » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « verite-rail »)_, sinon « enquete » _(si quête « Le Rail des Cendres » en cours)_, sinon « accueil »

### accueil

> Une femme en bleu de chauffe se réchauffe les mains au brasero. — Le triage ne roule plus la nuit. Pas une grève : la grève est interdite, ici. On a peur, c’est tout. La peur, elle, n’est pas encore interdite.

- « Peur de quoi ? » → convois
- « Au revoir. » → **fin**

### convois

> — Trois convois de minerai partis seuls, ce mois-ci. Personne aux commandes, personne au retour. Les anciens disent que la ligne est maudite. Le Bureau dit qu’on vole. Et il parle de nous remplacer par des machines.

- « Je vais trouver ce qui fait partir vos convois. » → accord
- « Bonne chance. » → **fin**

### accord

_Effet : lance la quête « Le Rail des Cendres »._

> — Toi ? Pourquoi pas : personne d’autre ne s’en mêle. Je suis Varka, cheffe d’équipe. Regarde l’aiguillage de l’embranchement, et le registre des départs. Et si tu veux voir de tes yeux, monte la garde avec nous, une nuit.

- « Compte sur moi. » → **fin**

### enquete

> Varka tisonne le brasero. — Alors ? Les cheminots attendent. Le contrôleur Ostrik aussi, avec sa planchette.

- _(sans repère « pilleurs-vaincus »)_ _(sans repère « pilleurs-suivis »)_ « Monter la garde cette nuit, à l’aiguillage. » → garde
- « Qui est de nuit, à l’aiguillage ? » → joss-info
- « À plus tard. » → **fin**

### joss-info

> — Joss Brakel. Un bon gars. Endetté jusqu’au cou, comme la moitié du triage : les prêteurs des Forges ne dorment jamais, eux.

- « Merci. » → enquete

### verdict

> Varka écoute jusqu’au bout. — Une machine sans homme, des pilleurs des Marches, et l’un des nôtres qui ouvre le levier… Que fait-on ?

- « Les cheminots reprennent leurs convois : réglez ça entre vous. » → fin-rail _(retient « rail-travailleurs », termine la quête « Le Rail des Cendres », +40 XP)_
- _(si repère « joss-avoue »)_ **[30 Fers]** « Et je rachète la dette de Joss : trente Fers. » → fin-dette _(−30 Fers, retient « dette-joss-payee », retient « rail-travailleurs », termine la quête « Le Rail des Cendres », +50 XP)_
- « Le contrôleur doit savoir. » → vers-ostrik
- « J’y réfléchis. » → **fin**

### vers-ostrik

> — Le Bureau ? Fais comme tu crois. Mais le Bureau ne rend jamais ce qu’il prend.

- « Je reviendrai. » → **fin**

### fin-rail

> — Le rail est une promesse collective. On la tiendra. Les cheminots iront chercher la machine : la Veilleuse saura lui parler. Et Joss travaillera de nuit, en équipe, jusqu’à ce que sa dette soit payée.

- « Bonne route, Varka. » → **fin**

### fin-dette

> Varka te regarde longtemps. — Personne ne paie pour un cheminot, d’habitude. Merci. Joss reprendra son levier, et cette fois, il le tiendra fermé. Les cheminots iront chercher la machine.

- « Bonne route, Varka. » → **fin**

### apres-rail

> — Les convois partent à l’heure, et ils arrivent. La Veilleuse a remisé la machine sans homme dans son dépôt. Elle dit qu’elle dort.

- « Au revoir. » → **fin**

### apres-bureau

> Varka ne lève pas les yeux du brasero. — Le Bureau a pris la machine, et renvoyé Joss. On dit qu’il en veut d’autres, des machines, pour la ligne. Merci quand même.

- « Au revoir. » → **fin**

### apres-marches

> — Un convoi sur dix part encore seul. On sait que tu sais. Passe ton chemin.

- « … » → **fin**

### garde

> — Cache-toi près du levier de l’embranchement, à la nuit tombée. Mes gars resteront au dépôt : s’il y a du grabuge, crie fort. Et pas d’imprudence.

- « Entendu. » → enquete

## La Veilleuse du Rail

_Travailleurs du Rail_

Commence par : « avec-cle » _(si l’on porte « Clé de rouille bleue »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « rendue-apres » _(si repère « cle-veilleuse »)_, sinon « apres » _(si repère « cle-obtenue »)_, sinon « question-cle » _(si repère « kaelis-parle »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « accueil »

### accueil

> Une femme en veste de cheminot, une lampe à la main, compte à mi-voix : — … sept, huit, neuf wagons. Elle se tourne vers toi. — Le neuvième n’existe pas. Pas encore. Tu l’entends, toi aussi ?

- « Tu entends les trains ? » → trains
- « Qui es-tu ? » → qui
- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Au revoir. » → **fin**

### qui

> — Ici, on m’appelle la Veilleuse. Je garde la vieille ligne et sa machine, pour les Travailleurs du Rail. Tout le monde la dit maudite. Moi, je dis qu’elle attend.

- « Elle attend quoi ? » → trains
- « Au revoir. » → **fin**

### trains

> — Toujours le même convoi, sans conducteur. Je l’entends avant qu’il passe. Mes parents l’ont pris, un soir, quand j’étais petite, et ne sont jamais revenus. Je garde la machine. Au cas où il les ramènerait.

- **[Mémoire 3]** « Laisse-moi écouter avec toi. » → ecoute
- « Merci de me l’avoir dit. » → **fin**

### ecoute

_Effet : retient le Récit « Le convoi sans conducteur »._

> Vous écoutez ensemble. Un convoi passe, translucide, bleu pâle bordé d’or. Aux fenêtres, des visages tranquilles ; aucun n’a peur. La Veilleuse serre ton bras. — Tu les as vus sourire ? Alors ils ne souffrent pas.

- _(si repère « kaelis-parle »)_ _(si quête « La Clé de Rouille Bleue » en cours)_ « Et la clé, à ton cou ? » → don
- « Merci de m’avoir laissé écouter. » → **fin**

### question-cle

> La Veilleuse compte ses wagons à mi-voix. Au creux de sa main, une clé couverte d’une rouille bleue, douce comme de la mousse. — Elle chante quand le convoi approche. Kaelis t’envoie ? Il n’aura pas ma clé.

- _(si Récit « Le Savant Corvan » connu)_ « J’ai vu le dernier train, moi aussi, dans l’Écho de la Gare Engloutie. » → don
- **[Mémoire 3]** « Laisse-moi écouter le convoi avec toi. » → ecoute
- « Lui parler de ce que la clé ouvre. » → ouvre
- « Je reviendrai. » → **fin**

### don

_Effet : donne 1 × « Clé de rouille bleue », retient « cle-obtenue », +25 XP._

> La Veilleuse ouvre la main. — Prends-la. Elle te parlera mieux qu’à moi. Mais si tu découvres ce qu’elle ouvre, reviens me le dire. Promis ?

- « Promis. » → **fin**

### avec-cle

> — Alors, cette clé ? Elle chante encore ?

- « Te la rendre : sa place est sur la ligne. » → rendue _(reprend 1 × « Clé de rouille bleue », retient « cle-veilleuse », termine la quête « La Clé de Rouille Bleue », +60 XP)_
- **[Érudition 3]** _(sans repère « cle-etudiee »)_ « L’étudier d’abord avec toi. » → etude
- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Pas encore. » → **fin**

### etude

_Effet : retient « cle-etudiee », +10 XP._

> Sous la rouille bleue, à la loupe de la Veilleuse, un numéro apparaît : un sceau des Archives de Ferros, et deux mots, « Fonds Zéro ». La clé ouvre un coffre des Archives Centrales.

- « Te la rendre. » → rendue _(reprend 1 × « Clé de rouille bleue », retient « cle-veilleuse », termine la quête « La Clé de Rouille Bleue », +60 XP)_
- « La garder encore un peu. » → **fin**

### rendue

> Elle referme la main sur la clé. — Alors elle restera sur la ligne, là où elle chante. Les Travailleurs du Rail n’oublieront pas ce que tu as fait.

- « Prends soin d’elle. » → **fin**

### rendue-apres

> — La clé chante toujours, la nuit. Je compte les wagons, et je ne me sens plus seule.

- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « À bientôt. » → **fin**

### apres

> — Tu as fait ton choix, avec la clé. Je l’entends parfois, loin d’ici… Elle chante encore. Prends soin de toi.

- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Au revoir. » → **fin**

### ouvre

> — Ce qu’elle ouvre ? Tout le monde veut le savoir. Personne ne veut l’écouter.

- **[Diplomatie 3]** « Kaelis la vendrait. Moi, je veux savoir ce qu’elle ouvre, et pourquoi on fouille vos gares. » → don
- _(si repère « fonds-zero-connu »)_ « Aux Archives, un coffre de fer attend sa clé depuis la fondation : le Fonds Zéro. » → don
- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Je reviendrai. » → **fin**

### convois-triage

_Effet : retient « indice-veilleuse », +5 XP._

> — Ce ne sont pas mes trains. Mes trains chantent. Ceux-là ne respirent pas : pas de vapeur, juste un cliquetis de cristal. Une machine sans homme, comme on en envoyait vers l’ouest, au temps de la Guerre du Rail.

- « Merci. » → **fin**

## Véline Nacelière

_Passeuse de la Grande Nacelle_

Commence par : « vol » _(si repère « vol-grenier »)_ _(sans repère « veline-vol-dit »)_, sinon « soupcon » _(si repère « vol-grenier »)_ _(si repère « veline-vol-dit »)_ _(si quête « Les graines qui manquent » pas commencée)_, sinon « caravane » _(si quête « La caravane de midi » en cours)_ _(si l’on porte « Sacoche de la Compagnie »)_, sinon « descente-conseil » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « descente » _(si quête « Les lettres de Malo » en cours)_ _(sans repère « sacoche-retrouvee »)_, sinon « descente-anselme » _(si quête « Le chant d’Anselme » en cours)_ _(sans repère « branche-prise »)_, sinon « graines-merci » _(si quête « Les graines qui manquent » terminée)_ _(sans repère « veline-graines-dit »)_ _(sans repère « graines-silence »)_, sinon « graines-tant-pis » _(si quête « Les graines qui manquent » terminée)_ _(sans repère « veline-graines-dit »)_ _(si repère « graines-silence »)_, sinon « retour » _(si repère « canopee-accueillie »)_, sinon « accueil »

### accueil

> Bienvenue à Canopéa ! Je suis Véline, passeuse de la Grande Nacelle. Ici, rien ne touche le sol, pas même les bavards. Je demande à chaque personne qui monte : qui es-tu ?

- « Je suis en apprentissage chez les Gardiens de Mémoire, à Gardebois. » → gardien _(retient « canopee-accueillie »)_
- « Juste quelqu’un qui voyage. » → voyageur _(retient « canopee-accueillie »)_
- « Comment marche ta nacelle ? » → nacelle

### gardien

> Tu apprends auprès d’Ilyane ? Alors tu es ici chez toi. Va voir Mirelle, au relais du Bosquet des Échos : elle a appris le métier avec Ilyane, il y a bien longtemps. La longue passerelle, à l’est du marché, y mène.

- « Merci, Véline. » → **fin**
- « Et ta nacelle ? » → nacelle

### voyageur

> Alors bienvenue, simplement. Un conseil : regarde où tu mets les pieds, et ne laisse rien tomber. Ce qui tombe d’ici, la forêt le garde.

- « Je ferai attention. » → **fin**
- « Et ta nacelle ? » → nacelle

### nacelle

> Un contrepoids d’eau, des cordes tressées et mes deux bras ! Pour redescendre en forêt, monte simplement dedans. La petite nacelle du marché, près du grand tronc, grimpe jusqu’aux Hautes Ramures, où siège le Conseil.

- « Merci. » → **fin**

### retour

> Encore toi ! La nacelle t’attend quand tu veux redescendre. Et si tu te perds, demande au petit Malo : il connaît chaque planche de la ville.

- _(si quête « Les graines qui manquent » pas commencée)_ _(sans repère « vol-grenier »)_ « Quoi de neuf, à la nacelle ? » → graines-souci _(lance la quête « Les graines qui manquent »)_
- « À plus tard, Véline. » → **fin**
- « Rappelle-moi le fonctionnement de la nacelle. » → nacelle

### vol

> Tu sais la nouvelle ? Quelqu’un a forcé le grenier des semences, là-haut. Voler des graines à Canopéa… c’est voler les arbres de demain. Si tu vois quelque chose, préviens le Conseil.

- « Je garderai les yeux ouverts. » → **fin** _(retient « veline-vol-dit »)_

### descente

> Malo t’a parlé de la sacoche, n’est-ce pas ? Je l’ai vue tomber… Descendre sur le Sol des Racines, ce n’est pas rien : le sol est sacré.

- _(sans repère « descente-autorisee »)_ « Je peux la chercher, si tu me descends. » → permission
- _(si repère « descente-autorisee »)_ « Redescends-moi, s’il te plaît. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Pas maintenant. » → **fin**

### permission

_Effet : retient « descente-autorisee »._

> Les lettres des Nacelliers, c’est sacré aussi, à sa façon. Bon. Je te descends. Ne prends rien d’autre que la sacoche, ne grave rien, et remonte par la même nacelle.

- « Allons-y. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Un instant. » → **fin**

### descente-anselme

> Une branche de l’arbre d’Anselme, pour une flûte ? Aïlis sera heureuse… Le sol est sacré, mais une branche tombée, la forêt la donne. Je te descends. Ne prends que celle-là.

- « Allons-y. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Pas maintenant. » → **fin**

### descente-conseil

> Le Gardien de la Canopée m’a fait porter un mot : tu peux descendre autant qu’il le faudra. Je n’aime pas ça… Le sol sacré qui fait taire le Bosquet, ça ne s’est jamais vu.

- « Descends-moi. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- _(si quête « Les graines qui manquent » pas commencée)_ _(sans repère « vol-grenier »)_ « Quoi de neuf, à la nacelle ? » → graines-souci _(lance la quête « Les graines qui manquent »)_
- « Pas maintenant. » → **fin**

### graines-souci

> Rien de bon. Il manque une dizaine de sacs au grenier des semences, depuis une lune. Et je crois qu’ils sont passés par ma nacelle, sous les bâches d’un marchand. Je n’ai rien vu… ou pas assez. Trouve qui, s’il te plaît.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### graines-piste

> Lisandre, au Nid : tous les marchands y dorment, et elle entend tout. Et le grenier lui-même, aux Hautes Ramures… s’il te laisse entrer.

- « Merci, Véline. » → **fin**

### soupcon

> Je repense au grenier. Il y manque bien plus qu’un sac : une dizaine, depuis une lune. Et on a vu ta silhouette là-haut, le jour où la porte a été forcée. Dis-moi que je me trompe.

- _(si l’on porte « Graines-lumière »)_ « C’était moi. Voici le sac. » → pardon _(reprend 1 × « Graines-lumière », retient « graines-rapportees », lance la quête « Les graines qui manquent », +10 XP)_
- « C’était moi, et je le regrette. » → aveu-vol _(retient « vol-avoue », lance la quête « Les graines qui manquent »)_
- « Tu te trompes. » → doute _(lance la quête « Les graines qui manquent »)_

### pardon

> Véline reprend le sac, longuement. — À Canopéa, on dit : « racines ouvertes ». Tu viens de l’être. Mais les autres sacs ? Ce n’est pas toi, ça. Ils sont passés par ma nacelle, sous des bâches de marchand. Aide-moi à trouver qui.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### aveu-vol

> Véline soupire. — Au moins, tu ne mens pas. Les autres sacs, ce n’est pas toi : ils sont passés par ma nacelle, sous des bâches de marchand. Aide-moi à les retrouver, et la ville oubliera peut-être.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### doute

> Véline te regarde un long moment. — Bien. Alors aide-moi à trouver qui. Une dizaine de sacs sont passés par ma nacelle, sous des bâches de marchand. Ça vaudra mieux pour tout le monde.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### graines-merci

> Les sacs sont revenus au grenier ! La ville en parle à chaque passerelle. Tu as rendu à Canopéa ses arbres de demain.

- « Que la sève coule. » → **fin** _(retient « veline-graines-dit »)_

### graines-tant-pis

> Les sacs ne sont jamais revenus. Tant pis… Merci d’avoir cherché. On dit au Nid qu’un marchand a payé une tournée à tout le monde, l’autre soir. Drôle de hasard.

- « Drôle de hasard. » → **fin** _(retient « veline-graines-dit »)_

### caravane

> La sacoche de la Compagnie ! Le chef de caravane tournait en rond depuis midi. Donne : je la lui remets, il attend au pied de ma nacelle.

- « La voici. » → caravane-fin _(reprend 1 × « Sacoche de la Compagnie », termine la quête « La caravane de midi », retient « membre-compagnie-lisieres », +30 XP, +15 Fers)_

### caravane-fin

> Il te fait dire merci, et ceci : « Qui porte nos sacoches quand personne ne le fait est des nôtres. » Te voilà membre de la Compagnie des Lisières : chez Tobias, à Gardebois, tu auras les prix de membre.

- « Merci, Véline. » → **fin**

## La vieille machine

_Ligne qu’on dit maudite_

Commence par : « machine »

### machine

> Une locomotive de l’Ancien Monde, rouge de rouille, et pourtant astiquée comme un jour de fête. Sur la cabine, quelqu’un a peint neuf petits wagons.

- **[Mémoire 4]** « Poser la main sur le métal. » → souvenir
- « Partir. » → **fin**

### souvenir

> Le métal se souvient d’une main : celle d’une femme qui chante en conduisant, très loin d’ici, il y a très longtemps.

- « Retirer la main. » → **fin**

## Un voyageur égaré

_Voyageur_

Commence par : « merci » _(si repère « rencontre-voyageur-aide »)_, sinon « accueil »

### accueil

> Ah, enfin quelqu’un ! Je cherche Gardebois depuis deux jours. Cette carte dit que c’est par là… ou par là ?

- « Ta carte est à l’envers. » → aide _(retient « rencontre-voyageur-aide », +5 Fers, +10 XP)_
- « Je ne peux pas t’aider. » → **fin**

### aide

> Il retourne sa carte, rougit, puis éclate de rire. — Tant de chemin pour rien ! Merci. Tiens, ce n’est pas grand-chose, mais c’est de bon cœur.

- « Bonne route ! » → **fin**

### merci

> Le voyageur te fait un grand signe. — Cette fois, je tiens la carte dans le bon sens !

- « Bonne route ! » → **fin**
