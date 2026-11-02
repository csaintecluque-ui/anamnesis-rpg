# Dialogues — texte à relire

Document **généré** à partir de `src/data/dialogues/*.json` (`npm run dialogues`) : ne pas le modifier à la main.
Statut des textes (validé ou à valider) : voir `docs/univers/personnages/pnj.md`, `docs/univers/lieux/gare-engloutie.md`
et, pour Canopéa et les rencontres en voyage, `docs/univers/lieux/canopee.md` et `docs/gdd/carte-du-monde.md`.

Légende : **[Perception 4]** = test d’attribut ou de compétence (option visible mais grisée si le seuil manque) ;
_(si …)_ = option qui n’apparaît que dans cette situation ; → = où mène la réponse.
**🎲 Discrétion 10** = jet de dé (d20 + modificateur + rang contre 10) : → en cas de réussite, ✗ → en cas d’échec.
🌙 = scène de nuit (le fond s’assombrit).

## Aïlis Feuillevent

_Grand-mère de Malo_

Commence par : « voix » _(si repère « voix-anselme »)_ _(sans repère « ailis-reconfortee »)_, sinon « accueil »

### accueil

> Entre, entre. Tu as croisé mon petit-fils, je parie ? Malo court partout comme un écureuil. Moi, je ne vais plus bien loin : jusqu’au Bois des Aïeux, chaque soir, pour parler à mon Anselme.

- « Parler à un arbre ? » → arbre
- « Au revoir, Aïlis. » → **fin**

### arbre

> Quand Anselme est parti, sa mémoire est passée dans un jeune arbre du Bois. Je lui raconte ma journée. Parfois, l’écorce est tiède sous ma main. Les savants disent que c’est le soleil. Moi, je sais que c’est lui.

- « Merci de me l’avoir raconté. » → accueil

### voix

> Tu reviens du Bois ? Tes yeux brillent…

- « J’ai entendu une voix, dans l’arbre d’Anselme. Quelqu’un fredonnait. » → reconfort _(retient « ailis-reconfortee », +15 XP)_
- « Ce n’est rien. » → accueil

### reconfort

> Aïlis pose sa main sur la tienne. — La chanson des cerfs-lucioles ? Oh… Alors il est bien là. Merci. Tu viens de me rendre un petit morceau de lui.

- « Il veille sur vous deux. » → **fin**

## Un très vieil Arbre-Souvenir

_Arbre-Souvenir_

Commence par : « arbre »

### arbre

> Un très vieil arbre, couvert de noms gravés les uns sur les autres. Des centaines de vies sont passées dans son bois.

- **[Mémoire 3]** _(sans repère « recit-voix-ecorce-recu »)_ « Poser la main sur l’écorce et écouter. » → voix _(retient « recit-voix-ecorce-recu », retient le Récit « Les voix de l’écorce », +10 XP)_
- **[Mémoire 3]** _(si repère « recit-voix-ecorce-recu »)_ « Écouter encore les voix. » → voix
- « Lire quelques noms. » → noms
- « Partir. » → **fin**

### voix

> Les voix montent ensemble, comme un chœur : des rires, des berceuses, des noms. Tu comprends soudain pourquoi, ici, on ne dit pas « il est mort », mais « il est passé dans l’arbre ».

- « Laisser les voix se taire. » → **fin**

### noms

> Des noms, des petits dessins de feuilles, des mots tendres. Certains sont si anciens que l’écorce les a presque refermés.

- « Partir. » → **fin**

## L’arbre d’Anselme

_Arbre-Souvenir_

Commence par : « arbre »

### arbre

> Un jeune arbre, encore fin, au tronc gravé d’un nom : Anselme Feuillevent. Quelqu’un a noué un ruban vert autour de ses racines.

- **[Mémoire 3]** « Poser la main sur l’écorce et écouter. » → voix _(retient « voix-anselme »)_
- « Laisser l’arbre en paix. » → **fin**

### voix

> Sous ta paume, l’écorce est tiède. Très loin, quelqu’un fredonne une chanson douce, une chanson de cerfs-lucioles et de nuits d’été. Puis plus rien, que le vent.

- « Retirer doucement la main. » → **fin**

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

## Cristal de veille

_Objet_

Commence par : « cristal »

### cristal

> Le cristal de veille luit doucement. Ilyane dit qu’il tient les mauvais rêves à distance. En le regardant, tu sens ta fatigue s’apaiser.

- « Se reposer un instant. » → **fin** _(+40 PV)_
- « S’éloigner. » → **fin**

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

## L’Écho du dernier train

_Écho du Passé_

Commence par : « approche »

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

## Elouan Chante-Bois

_Luthier_

Commence par : « accueil »

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

## La foreuse de Brisefer

_Objet_

Commence par : « faussee » _(si repère « foreuse-sabotee »)_, sinon « arretee » _(si repère « chantier-arrete »)_, sinon « gardee » _(si repère « surpris-de-nuit »)_, sinon « jour »

### jour

> La foreuse de Brisefer mord la roche de la Faille dans un fracas de fer. Les ouvriers ne la quittent pas des yeux.

- _(si quête « Le Dernier Train » en cours)_ « Attendre la nuit dans les ruines du quai. » → nuit
- « S’éloigner. » → **fin**

### nuit

> 🌙 La nuit tombe sur la Gare. Le chantier s’endort ; seule une lanterne veille encore, près de la tente de Brisefer.

- **🎲 Discrétion 10** « Te glisser jusqu’à la foreuse. » → au-pied, ✗ → repere
- « Renoncer et attendre le jour. » → **fin**

### au-pied

> 🌙 Te voilà au pied de la foreuse, dans l’odeur d’huile et de pierre chaude. Personne n’a rien vu.

- **🎲 Artisanat 10** « Saboter le mécanisme. » → sabotee, ✗ → bruit
- « Repartir sans rien toucher. » → **fin**

### sabotee

_Effet : retient « foreuse-sabotee », retient « chantier-arrete », termine la quête « Le Dernier Train », +40 XP, +30 Fers._

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

## Sacs de graines-lumière

_Objet_

Commence par : « vide » _(si repère « vol-grenier »)_, sinon « sacs »

### sacs

> Des sacs de graines-lumière, alignés comme des soldats. Chacun porte le sceau du Conseil : ce sont les semences des futurs arbres de Canopéa.

- « Prendre un sac. » → pris _(donne 1 × « Graines-lumière », retient « vol-grenier »)_
- « Les laisser où ils sont. » → **fin**

### pris

> Tu glisses un sac dans ta besace. Il est léger… bien plus léger que ta conscience.

- « Partir. » → **fin**

### vide

> Il manque un sac dans la rangée. Le trou se voit.

- « Partir. » → **fin**

## L’huissier du Conseil

_Huissier_

Commence par : « accueil »

### accueil

> Silence, s’il te plaît : le Conseil des Racines Profondes délibère. Les audiences se demandent par écrit, et la liste est longue… très longue.

- « De quoi parle le Conseil ? » → sujet
- **[réputation à canopee ≥ 10]** « Le Conseil accepterait-il de m’entendre ? » → estime
- « Je reviendrai. » → **fin**

### sujet

> De la frontière de l’Est, de ce que Ferros creuse sous nos racines, et de ce mal qui fait oublier. Je n’en dirai pas plus : je suis huissier, pas bavard.

- « Merci quand même. » → **fin**

### estime

> L’huissier te regarde mieux. — Ton nom circule en bien dans les Ramures, à ce qu’on dit. Reviens quand le Conseil aura fini de délibérer : il voudra peut-être t’entendre.

- « Je reviendrai. » → **fin**

## Ilyane Voix-d’Écorce

_Gardienne de Mémoire de Gardebois_

Commence par : « resolu » _(si quête « Le Dernier Train » terminée)_, sinon « en-cours » _(si quête « Le Dernier Train » en cours)_, sinon « accueil »

### resolu

> Depuis que la foreuse s’est tue, plus personne ne revit la Grande Chute. Tu as bien fait. Mais dis-moi : qui a payé cette prospection, à ton avis ? Les Réveilleurs, peut-être. Reste sur tes gardes.

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

## Ingrid Brisefer

_Ingénieure, prospection de Ferros_

Commence par : « apres-sabotage » _(si repère « foreuse-sabotee »)_, sinon « apres » _(si quête « Le Dernier Train » terminée)_, sinon « soupcon » _(si repère « surpris-de-nuit »)_, sinon « accueil »

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

- **[Diplomatie 3]** « Arrêtez le forage : à chaque coup, l’Écho se multiplie, et le mal avec lui. » → convaincue _(retient « chantier-arrete », termine la quête « Le Dernier Train », +40 XP, +30 Fers)_
- **[Commandement 3]** « Je parle au nom des Gardiens de Mémoire : cessez, maintenant. » → convaincue _(retient « chantier-arrete », termine la quête « Le Dernier Train », +40 XP, +30 Fers)_
- _(si Récit « Le Savant Corvan » connu)_ « Je connais l’histoire du savant Corvan. Écoutez-la avant de creuser plus loin. » → convaincue-recit _(retient « chantier-arrete », termine la quête « Le Dernier Train », +40 XP, +30 Fers)_
- « Je reviendrai. » → **fin**

### convaincue

> … Bon. J’arrête la foreuse, pour l’instant. Mais dites bien à vos Gardiens que Ferros reviendra, avec ou sans moi.

- « Merci. » → **fin**

### convaincue-recit

> Corvan ? Je connais l’histoire, oui… et vous avez raison : il a réussi, et ça ne l’a pas sauvé. J’arrête la foreuse. On ne force pas deux fois la même faute.

- « Merci. » → **fin**

### apres-sabotage

> Quelqu’un a faussé ma foreuse, cette nuit. Ferros m’enverra des pièces… dans des semaines. D’ici là, je ne creuse plus. Et personne n’a plus revu de train, à Gardebois, paraît-il.

- « Tant mieux. » → **fin**

### apres

> La foreuse est silencieuse, pour l’instant. Mes ouvriers n’aiment pas ça, mais personne n’a plus revu de train, à Gardebois.

- « Tant mieux. » → **fin**

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

Commence par : « accueil »

### accueil

> Bienvenue au Nid ! Ici, on dort en hamac et on mange des soupes de fleurs. Pas de feu chez nous : les braises et les branches ne font pas bon ménage. Ce sont nos cristaux qui chauffent les bols.

- **[5 Fers]** « Une soupe de fleurs. » → soupe _(−5 Fers, +15 PV)_
- _(sans repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles
- _(si repère « vol-grenier »)_ « Quelles nouvelles ? » → nouvelles-vol
- « Au revoir. » → **fin**

### soupe

> Pétales de lune, racine douce et une pincée de mousse dorée. Ça réchauffe jusqu’au bout des orteils, tu verras.

- « Merci, Lisandre. » → accueil

### nouvelles

> Le Conseil des Racines Profondes se réunit beaucoup, ces temps-ci : on parle de la frontière, de Ferros, de ces forages… Et le petit Malo a encore traversé la passerelle du Bois en courant. Un jour, il s’envolera.

- « Merci. » → accueil

### nouvelles-vol

> Tu as entendu ? Quelqu’un a forcé le grenier des semences, dans les Hautes Ramures. Voler des graines à Canopéa… c’est comme voler l’avenir. Le Conseil est furieux.

- « Merci. » → accueil

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

Commence par : « accueil »

### accueil

> Salut ! Je suis Malo, coursier des passerelles. Je connais tous les chemins de Canopéa, même ceux qui n’existent pas encore !

- « Montre-moi la ville. » → ville
- « Tu n’as jamais peur de tomber ? » → peur
- « À plus tard, Malo. » → **fin**

### ville

> Facile ! Ici, c’est le marché. La petite nacelle, près du grand tronc, monte aux Hautes Ramures : le Conseil, l’atelier du luthier, et chez moi. La longue passerelle à l’est mène au Bois des Aïeux, là où les arbres se souviennent.

- « Les arbres se souviennent ? » → arbres
- « Merci, Malo. » → **fin**

### arbres

> Quand quelqu’un meurt, sa mémoire passe dans un arbre. Mon grand-père Anselme est dans l’un d’eux. Mamie Aïlis va lui parler tous les soirs. Moi, je n’entends rien… mais je crois qu’il m’écoute quand même.

- « Il t’écoute, c’est certain. » → accueil

### peur

> Tomber ? Jamais ! Bon… une fois. Mais un filet de lianes m’a rattrapé. Mamie dit que la forêt n’aime pas qu’on lui jette des enfants.

- « Elle a bien raison. » → accueil

## Mirelle Doucebranche

_Gardienne de Mémoire de Canopéa_

Commence par : « accueil »

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

- « Je le lui dirai. » → accueil

### ordre

> Nous recueillons les histoires, et nous les transmettons. Tout a commencé avec Kael, le Premier Chroniqueur. Veux-tu que je te raconte ?

- _(sans repère « recit-kael-recu »)_ « Oui, raconte. » → kael _(retient « recit-kael-recu », retient le Récit « Kael, le Premier Chroniqueur », +10 XP)_
- _(si repère « recit-kael-recu »)_ « Raconte-moi encore. » → kael
- « Une autre fois. » → accueil

### kael

> Après la Grande Chute, Kael écrivit tout ce dont il se souvenait du monde perdu. Il fonda la première bibliothèque, à Convergence. Chaque Gardien porte un peu de son carnet. Un jour, tu iras voir sa bibliothèque, toi aussi.

- « J’aimerais beaucoup. » → accueil

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
- « Au revoir. » → **fin**

### herbes

> Des branches hautes, là où le soleil touche en premier. On ne cueille jamais tout : une feuille sur trois reste à l’arbre. C’est la règle de la Sève.

- « Une belle règle. » → accueil

## Sylvan Mousserelle

_Aubergiste de la Racine_

Commence par : « accueil »

### accueil

> Bienvenue à la Racine ! Ici, on mange chaud et on parle fort. Assieds-toi : chez Sylvan, les Gardiens de Mémoire sont toujours bien reçus.

- **[5 Fers]** « Un repas chaud. » → repas _(−5 Fers, +15 PV)_
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

- « Je n’ai pas cette somme. » → chantier
- « Au revoir. » → **fin**

### convaincu

> … Tu parles comme un marchand de Ferros, toi. Tiens, prends-le. Et si Brisefer te pose la question, tu ne l’as pas eu de moi.

- « Promis. » → **fin**

### merci

> Fais-en bon usage. Et si tu croises Brisefer, dis-lui que l’étal Cendrefer vend des lampes qui ne s’éteignent pas sous terre.

- « Au revoir. » → **fin**

## Véline Nacelière

_Passeuse de la Grande Nacelle_

Commence par : « vol » _(si repère « vol-grenier »)_ _(sans repère « veline-vol-dit »)_, sinon « retour » _(si repère « canopee-accueillie »)_, sinon « accueil »

### accueil

> Bienvenue à Canopéa ! Je suis Véline, passeuse de la Grande Nacelle. Ici, rien ne touche le sol, pas même les bavards. Je demande à chaque personne qui monte : qui es-tu ?

- « Je suis en apprentissage chez les Gardiens de Mémoire, à Gardebois. » → gardien _(retient « canopee-accueillie »)_
- « Juste quelqu’un qui voyage. » → voyageur _(retient « canopee-accueillie »)_
- « Comment marche ta nacelle ? » → nacelle

### gardien

> Une élève d’Ilyane ? Alors tu es ici chez toi. Va voir Mirelle, au relais du Bois des Aïeux : elle a appris le métier avec Ilyane, il y a bien longtemps. La longue passerelle, à l’est du marché, y mène.

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

- « À plus tard, Véline. » → **fin**
- « Rappelle-moi le fonctionnement de la nacelle. » → nacelle

### vol

> Tu sais la nouvelle ? Quelqu’un a forcé le grenier des semences, là-haut. Voler des graines à Canopéa… c’est voler les arbres de demain. Si tu vois quelque chose, préviens le Conseil.

- « Je garderai les yeux ouverts. » → **fin** _(retient « veline-vol-dit »)_

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
