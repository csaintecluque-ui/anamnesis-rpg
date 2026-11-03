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

- _(sans repère « indice-aiguillage »)_ _(sans repère « mecanisme-rate »)_ **🎲 Investigation 12** « Examiner le mécanisme. » → goupille, ✗ → mecanisme-rien
- _(sans repère « indice-aiguillage »)_ _(sans repère « carter-rate »)_ **🎲 Artisanat 12** « Démonter le carter. » → goupille, ✗ → carter-coince
- _(sans repère « pilleurs-vaincus »)_ _(sans repère « pilleurs-suivis »)_ « Attendre la nuit, caché près du levier. » → veille _(attend la nuit)_
- « Laisser le levier. » → **fin**

### carter-coince

_Effet : retient « carter-rate » pour 1 jours._

> Les vis sont rondes d’usure ; ta lame ripe, et le carter ne bouge pas d’un doigt. Il te faudrait de meilleurs outils, ou un autre jour.

- « Revenir au levier. » → levier-quete
- « Laisser le levier. » → **fin**

### mecanisme-rien

_Effet : retient « mecanisme-rate » pour 1 jours._

> Ressorts, tringles, une goupille couverte de graisse noire. Tout a l’air en ordre, et c’est peut-être ce qui cloche. Tu n’arrives pas à dire pourquoi, pas aujourd’hui.

- « Revenir au levier. » → levier-quete
- « Laisser le levier. » → **fin**

### veille

_Effet : retient « veille-aiguillage »._

> La nuit tombe sur le triage. Vers trois heures, deux silhouettes en manteau de cendre abaissent le levier de l’embranchement, sans effort. Au loin approche un cliquetis de cristal, sans un souffle de vapeur.

- « Les arrêter ! » → **fin** _(lance le combat « aiguillage-cendres »)_
- **🎲 Discrétion 12** « Les laisser faire, et suivre le convoi. » → suivre, ✗ → veille-rate
- **🎲 Athlétisme 13** « Sauter sur le dernier wagon quand il passe. » → wagon, ✗ → wagon-rate

### suivre

_Effet : retient « pilleurs-suivis », retient « cendriere-ouverte », +15 XP._

> Une machine trapue, sans cabine ni conducteur, attelle trois wagons et quitte la grande voie. Tu la suis dans l’ombre, par l’embranchement, jusque sous les terrils.

- « Suivre jusqu’au bout. » → **fin** _(mène à « Ironheart — La Cendrière »)_

### veille-rate

> Un caillou roule sous ta botte. Les silhouettes se retournent : — On nous guette ! Elles lâchent le levier et foncent sur toi.

- « Se défendre ! » → **fin** _(lance le combat « aiguillage-cendres »)_
- « Fuir dans l’ombre des wagons. » → **fin**

### wagon

_Effet : retient « pilleurs-suivis », retient « cendriere-ouverte », +15 XP._

> Une machine trapue, sans cabine ni conducteur, attelle trois wagons. Au passage du dernier, tu sautes : le fer froid, le vent, et l’embranchement qui file sous les terrils.

- « S’accrocher jusqu’au bout. » → **fin** _(mène à « Ironheart — La Cendrière »)_

### wagon-rate

_Effet : −3 PV._

> Tes doigts glissent sur le fer. Tu roules sur le ballast, et le convoi disparaît sous les terrils sans t’avoir vu.

- « Se relever. » → **fin**

## Aïlis Feuillevent

_Grand-mère de Malo_

Commence par : « flute » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Flûte d’Anselme »)_, sinon « inquiete » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « voix » _(si repère « voix-anselme »)_ _(sans repère « ailis-reconfortee »)_, sinon « apres-chant » _(si quête « Le chant d’Anselme » terminée)_, sinon « accueil »

### accueil

> Entre, entre. Tu as croisé mon petit-fils, je parie ? Malo court partout ; ses pieds ne touchent jamais les planches. Moi, je ne vais plus bien loin : jusqu’au Bosquet des Échos, chaque soir, pour parler à mon Anselme.

- « Parler à un arbre ? » → arbre
- « Au revoir, Aïlis. » → **fin**

### arbre

_Effet : retient « anselme-connu »._

> Anselme repose au pied d’un jeune arbre, en bas, comme le veut le Rite du Retour. Et j’ai gravé son nom au Bosquet. Je lui raconte ma journée ; parfois, le bois est tiède sous ma main. Les savants disent que c’est le soleil. Moi, je sais que c’est lui.

- « Merci de me l’avoir raconté. » → accueil

### voix

> Tu reviens du Bosquet ? Tes yeux brillent.

- « J’ai touché le nom d’Anselme, au Bosquet. J’ai entendu quelqu’un fredonner. » → reconfort _(retient « ailis-reconfortee », +15 XP)_
- « Ce n’est rien. » → accueil

### reconfort

> Aïlis pose sa main sur la tienne. — La chanson des cerfs-lucioles. C’est elle que je fredonnais en gravant son nom. Alors le Bosquet la garde. Merci : tu viens de me rendre un petit morceau de lui.

- « Il veille sur vous deux. » → **fin**

### flute

> Qu’est-ce que tu tiens là, mon enfant ? Une flûte ? Elle sent le bois d’en bas, le bois de la mousse.

- _(si repère « flute-fidele »)_ « Elouan l’a taillée dans une branche de l’arbre d’Anselme. Pour vous. » → chant-fidele _(reprend 1 × « Flûte d’Anselme », termine la quête « Le chant d’Anselme », retient le Récit « Le chant d’Anselme », +40 XP)_
- _(sans repère « flute-fidele »)_ « Elouan l’a taillée dans une branche de l’arbre d’Anselme. Pour vous. » → chant-carnet _(reprend 1 × « Flûte d’Anselme », termine la quête « Le chant d’Anselme », retient le Récit « Le chant d’Anselme », +30 XP)_
- « Ce n’est rien. Je repasserai. » → **fin**

### chant-fidele

> 🌙 Aïlis porte la flûte à ses lèvres. Les premières notes tremblent, puis la chanson des cerfs-lucioles monte, exactement comme elle la fredonnait en gravant le nom. Elle s’arrête, la main sur le bois. — Il est tiède. Il est là.

- « Il veille sur vous deux. » → merci

### chant-carnet

> 🌙 Aïlis joue la chanson du carnet, puis s’arrête et sourit. — Ce n’est pas tout à fait la mienne. Ilyane a toujours eu sa façon. Elle reprend, change une note, puis deux. Cette fois, c’est la sienne : elle vient de s’en souvenir.

- « Elle était là, tout près. » → merci

### merci

> Je jouerai pour lui chaque soir, au Bosquet. Et quand Malo sera grand, je lui apprendrai. Merci, toi qui viens de si loin pour une vieille femme et son arbre.

- « Merci à vous, Aïlis. » → **fin**

### apres-chant

> Entre, entre ! Tu entends ? Non, bien sûr, c’est le soir que je joue. Malo dit que les oiseaux répondent. Moi, je dis que c’est Anselme qui les fait chanter.

- « Parlez-moi encore d’Anselme. » → arbre
- « Au revoir, Aïlis. » → **fin**

### inquiete

> Je suis allée au Bosquet hier soir. J’ai posé la main sur le nom d’Anselme. Rien. Le bois était froid. Comme s’il était parti une seconde fois.

- _(si quête « Le chant d’Anselme » terminée)_ « Vous avez encore sa chanson. » → chanson-reste
- « Parlez-moi de l’arbre où il repose. » → arbre
- « Le Triumvirat m’a demandé de comprendre. Je trouverai. » → **fin**

### chanson-reste

> Aïlis serre la flûte contre elle. — Oui. Oui, c’est vrai. Le bois du Bosquet a oublié, mais la flûte, elle, n’a rien oublié. Va, mon enfant. Trouve ce qui lui fait mal, à notre forêt.

- « Je trouverai. » → **fin**

## Ambroise Encrelune

_Conservateur de la Grande Bibliothèque_

Commence par : « denonce » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_ _(si repère « main-edda-fausse »)_ _(sans repère « edda-reglee »)_, sinon « registre » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « hesper-vue »)_ _(sans repère « registre-lu »)_, sinon « demande » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « fonds-muet-ouvert »)_, sinon « accueil »

### accueil

> Un homme en robe d’encre, les doigts tachés. — Grande Bibliothèque, guichet du Registre des Mains. On enregistre, on ne cherche pas. Que voulez-vous savoir, et de qui ?

- « Qu’est-ce que le Registre des Mains ? » → mains
- « Et le Fonds Muet ? » → muet
- « Au revoir. » → **fin**

### mains

> — Depuis 640, chaque pièce entrée ici : de qui, à quelle date, contre combien, et ce que le vendeur affirmait. Onze millions six cent mille lignes. Pas une opinion.

- « Je vois. » → accueil

### muet

> — Les pièces dont la chaîne passe par une main qu’a touchée Nakh-Rim, le faussaire. Il s’est dénoncé lui-même, en 2519. On les garde, on les classe, on les restaure. On ne les cite pas.

- « Je vois. » → accueil

### registre

> Il ouvre un registre de la taille d’une porte. — Vous cherchez une chaîne ? Dites-moi l’objet, je vous lis les mains.

_Si Boulon voyage avec toi :_ Boulon lit par-dessus ton épaule, sans bouger les lèvres. — Tout s’écrit, ici. Même ce qui n’est pas arrivé.

- _(sans repère « cle-vendue »)_ « Une clé de rouille bleue, et le carnet du dernier train. » → chaine
- _(si repère « cle-vendue »)_ « Une clé de rouille bleue, que j’ai vendue aux Marches, et le carnet du dernier train. » → chaine-vendue
- « Je reviendrai. » → **fin**

### chaine

> Il tourne les pages sans hâte. — Le carnet : jamais entré. Mais l’an dernier, une page recopiée, « la ligne que Ferros a grattée », vendue quarante Fers. Sa chaîne passe par une maison qu’a touchée Nakh-Rim : elle dort au Fonds Muet. On ne la cite pas.

- « Et personne d’autre ne l’a demandée ? » → edda-demande

### edda-demande

_Effet : retient « registre-lu »._

> — Il y a trois jours. Une demande de consultation, au nom d’Edda Varn. Refusée. Nous ne motivons pas les refus.

- « Et si c’est moi qui la demande ? » → demande
- _(si repère « echo-voie-halte-fougeres »)_ « Le dernier train tirait un fourgon plombé. Personne ne l’a écrit : je l’ai vu passer. » → fourgon
- _(si repère « echo-voie-depot-sept »)_ « Voie sept. Le nom commençait par Alta. » → alta
- « Une main contre une main : déposer une de mes histoires au Registre. » → edda-demande 📖 donner un Récit : autres → depot

### fourgon

> Ambroise cesse d’écrire. — Un fourgon plombé. Cela ne se lit dans aucun livre d’ici : c’était sur un quai. Vous ne citez pas ce que vous avez vu.

- « Alors, cette page ? » → convaincu

### alta

> Ambroise pose sa plume, très lentement. — Ce mot-là n’est sorti du Fonds Muet pour personne. Si vous l’avez, c’est qu’un mur vous l’a dit, et les murs ne citent pas.

- « Alors, cette page ? » → convaincu

### demande

> — Le Fonds Muet ne se cite pas. Il ne se cache pas non plus : rien ne se cache à Sept-Portes. Convainquez-moi qu’un lecteur n’est pas un citeur.

- _(si Récit « Kael, le Premier Chroniqueur » connu)_ « Kael a bâti cette bibliothèque sur une seule règle. Il a lu, lui, avant de la poser. » → convaincu
- _(sans repère « ambroise-parole-refusee »)_ **🎲 Diplomatie 14** « « On ne cache rien », dites-vous. Alors ne me cachez pas cette page. » → convaincu, ✗ → demande-parole
- _(sans repère « ambroise-savoir-refuse »)_ **🎲 Érudition 14** « Une provenance n’est pas une vérité. Je ne la citerai pas : je la lirai. » → convaincu, ✗ → demande-savoir
- « Je reviendrai. » → **fin**

### demande-savoir

_Effet : retient « ambroise-savoir-refuse »._

> — Lire sans citer. Ambroise pose sa plume. — Tout le monde le promet ; personne ne le tient, une fois la page en tête. Vous n’êtes pas encore ce lecteur-là.

- « Autre chose. » → demande
- « Je reviendrai. » → **fin**

### demande-parole

_Effet : retient « ambroise-parole-refusee »._

> — Joli retournement. Ambroise sourit. — Je l’ai entendu cent fois, et chaque fois de quelqu’un qui voulait citer. Non.

- « Autre chose. » → demande
- « Je reviendrai. » → **fin**

### convaincu

_Effet : retient « fonds-muet-ouvert », retient « fonds-muet-parole »._

> Ambroise te regarde longtemps, puis décroche une clé de son cou. — Un lecteur n’est pas quelqu’un qui comprend. C’est quelqu’un qui sacrifie tout le reste. La porte basse, au fond. Ne citez rien.

- « Merci. » → **fin**

### denonce

> — Vous déposez contre une main ? Déposez. Ici, c’est la seule chose qu’on écoute jusqu’au bout.

- _(sans repère « faux-registre »)_ « Edda Varn est morte il y a trente ans. La dame en gris emprunte sa main. » → denonce-ok
- _(si repère « faux-registre »)_ « Edda Varn est morte il y a trente ans. La dame en gris emprunte sa main. » → denonce-faux
- « Je reviendrai. » → **fin**

### denonce-ok

_Effet : retient « edda-raccompagnee », retient « edda-reglee », retient « edda-partie », +30 XP._

> Ambroise ouvre le registre des consultations, compare, et referme. — Falsifier une main, ici, c’est le seul crime. Il n’y aura pas de coup. Il y aura une voiture.

- « C’est juste. » → **fin**

### denonce-faux

_Effet : retient « edda-raccompagnee », retient « edda-reglee », retient « edda-partie »._

> Ambroise compare, longtemps. Puis il pose le doigt sur une autre ligne : ta demande de consultation. — Celle-ci non plus n’est pas à vous. « Si ce n’est pas moi, la méthode est dehors. » Vous partirez ensemble.

- « Monter dans la voiture. » → racc

### racc

_Effet : retient « raccompagne »._

> Deux agents en gris clair. Personne ne te touche : on t’ouvre une portière. La voiture roule une journée, jusqu’au cent unième kilomètre, et l’on te pose sur le bas-côté. Il te faut deux jours pour revenir.

- « Revenir à Sept-Portes, à pied. » → **fin** _(fait passer 8 moments, mène à « Sept-Portes — la place des Sept Portes »)_

### depot

_Effet : retient « fonds-muet-ouvert », retient « fonds-muet-parole », +10 XP._

> Ambroise ouvre un registre neuf, t’écoute sans rien noter, puis écrit tout, d’une main égale. — De qui : de vous. Contre quoi : la porte basse. Ce que vous affirmiez : vous le saurez moins bien demain. Au fond, la porte basse. Ne citez rien.

- « Merci. » → **fin**

### chaine-vendue

> Il tourne les pages. — La clé : entrée il y a trois jours, d’une main gantée, qui l’a achetée aux Marches des Cendres. Le carnet : une page recopiée, vendue quarante Fers l’an dernier. Sa chaîne dort au Fonds Muet. On ne la cite pas.

- « Et personne d’autre ne l’a demandée ? » → edda-demande

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

_Si Liane voyage avec toi :_ Liane pose la main près de la tienne, sur les noms. — Eux, ils gardent leurs morts dans le bois. Chez nous, on les enterre et on se tait.

- « Partir. » → **fin**

### silence

> Le très vieil arbre gravé. Sous ta main, les signes restent froids : ni voix ni souvenir ne montent du bois.

- **[Mémoire 3]** _(sans repère « piste-racines »)_ « Écouter plus profond. » → pente _(retient « piste-racines », +10 XP)_
- _(sans repère « piste-racines »)_ _(sans repère « pied-arbre-rate »)_ **🎲 Investigation 11** « Examiner le pied de l’arbre. » → seve, ✗ → pied-rien _(retient « piste-racines », +10 XP)_
- _(sans repère « piste-racines »)_ « Confier une de tes histoires au vieil arbre. » → silence 📖 donner un Récit : autres → confie
- « Partir. » → **fin**

### pied-rien

_Effet : retient « pied-arbre-rate » pour 1 jours._

> Tu fouilles la mousse au pied de l’arbre. De la terre, des racines, un scarabée qui s’enfuit. Rien qui parle, aujourd’hui.

- « Revenir à l’arbre. » → silence
- « Partir. » → **fin**

### pente

> Tout au fond du silence, une sensation : une racine qu’on tire, vers le bas, très loin sous la ville. Ce qui fait taire le Bosquet est en bas, sur le Sol des Racines.

- « Retirer la main. » → **fin**

### seve

> Au pied de l’arbre, une sève claire suinte entre les planches, comme d’une blessure. Les racines du Bosquet descendent jusqu’au sol, et, en bas, quelque chose les a tranchées.

- « Partir. » → **fin**

### confie

_Effet : retient « piste-racines », +10 XP._

> Tu poses la main sur l’écorce froide et tu racontes. Le bois boit ton histoire jusqu’au dernier mot. Un nom se réchauffe sous tes doigts, puis quelque chose tire, vers le bas, très loin sous la ville. L’histoire ne te revient pas.

- « Retirer la main. » → **fin**

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
- _(sans repère « branche-sourde »)_ **🎲 Artisanat 11** « Toquer sur les branches, pour trouver celle qui chante. » → chantante, ✗ → branche-sourde _(donne 1 × « Branche de l’arbre d’Anselme », retient « branche-prise », +10 XP)_
- « Poser la main sur l’écorce. » → chaleur
- « Partir. » → **fin**

### branche-sourde

_Effet : retient « branche-sourde »._

> Tu toques, branche après branche. Elles sonnent toutes pareil, sèches et sourdes. Celle qui chante, si elle existe, se tait pour toi.

- « Revenir au jeune arbre. » → arbre-quete
- « Partir. » → **fin**

### prise

> Tu choisis une branche sèche, droite et légère, et tu la glisses dans ta besace en murmurant un merci. On ne sait jamais qui écoute.

- « Remonter vers la nacelle. » → **fin**

### chantante

> Tu toques sur les branches, une à une. La plupart sonnent mat. Une seule répond, claire, presque une note : celle-là chante déjà. Tu la glisses dans ta besace en murmurant un merci.

- « Remonter vers la nacelle. » → **fin**

### chaleur

> L’écorce est tiède, comme une main qu’on vient de lâcher. Pas de voix, pas d’image : seulement cette chaleur, et un tour de main qu’on devine dans le pli des branches.

- « Retirer la main. » → **fin**

## Un jeune arbre lisse

_Bosquet des Échos_

Commence par : « grave » _(si repère « saule-grave »)_, sinon « lisse »

### lisse

> Un jeune arbre au tronc encore lisse, au bord du Bosquet. Personne n’y a gravé.

- _(si quête « Ce que Liane veut oublier » en cours)_ _(si repère « oubli-choix-graver »)_ _(si Liane suit le héros)_ « Laisser Liane graver le nom de Saule. » → graver
- « Partir. » → **fin**

### graver

_Effet : retient « saule-grave », termine la quête « Ce que Liane veut oublier », retient le Récit « Saule, le frère de Liane », +40 XP, avis de Liane +2._

> Liane grave lentement, en verdani, comme on le lui a appris. Quand elle pose la main sur l’écorce, elle pleure enfin, longtemps. Puis elle sourit. — Il riait trop fort. Le bois s’en souviendra. Moi aussi, maintenant, mais autrement.

- « Partir. » → **fin**

### grave

> Le nom de Saule, gravé de la main de Liane. Le bois a déjà commencé à refermer les entailles, sans les effacer.

- **[Mémoire 3]** « Poser la main sur le nom. » → toucher
- « Partir. » → **fin**

### toucher

> Sous tes doigts monte un souvenir qui n’est pas le tien : un garçon qui grimpe trop haut, et une sœur qui lui crie de redescendre, en riant.

- « Partir. » → **fin**

## Arlo

_Un des jumeaux_

Commence par : « accueil »

### accueil

> Un garçon aux cheveux presque blancs. — On a appris la doctrine, cette année ! « Si l’Anneau n’arrête pas, c’est permis. » Maman dit que c’est la phrase la plus triste du monde. Papa dit que c’est la plus juste. Ils se disputent, mais sans se taper.

- « Au revoir. » → **fin**

## Boulon

_Ferrôme, porteur à la gare de l’Ouest_

Commence par : « libre » _(si quête « Le contrat de Boulon » en cours)_ _(si repère « boulon-libre »)_, sinon « revient » _(si quête « Le contrat de Boulon » terminée)_, sinon « accueil-quete » _(si quête « L’audience » terminée)_ _(sans repère « boulon-accueilli »)_, sinon « accueil »

### accueil-quete

_Effet : lance la quête « La Clé de Rouille Bleue », retient « boulon-accueilli »._

> Un Ferrôme de deux mètres, tout en rivets, soulève trois malles d’une seule main. — Bienvenue à Ironheart. Je m’appelle Boulon. Un sceau d’émeraude à ta ceinture ? Les Verts ne viennent pas souvent. Tu cherches quelque chose, ou quelqu’un ?

- « Un certain Kaelis, des Marches des Cendres. » → kaelis
- « Parlons un peu. » → parler
- « Une caravane pour Gardebois ? » → caravane
- « Merci, Boulon. » → **fin**

### accueil

> — Bonjour. Boulon, porteur de la gare de l’Ouest. Je me souviens de chaque malle que j’ai portée : des milliers. Tu veux savoir quelque chose ?

- _(si quête « La Clé de Rouille Bleue » en cours)_ « Où trouver Kaelis, des Marches des Cendres ? » → kaelis
- « Parlons un peu. » → parler
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

- « Descendre du chariot. » → **fin** _(attend à midi, attend le soir, mène à « Gardebois — Marché des Lisières »)_

### parler

> — Parlons. Je porte, j’écoute, je me souviens. C’est tout ce que je fais.

- « Que faut-il savoir, ici ? » → regles
- _(si quête « Le contrat de Boulon » pas commencée)_ « Tu ne voyages jamais, toi ? » → voyage
- « Revenir. » → accueil

### voyage

> Boulon pose une malle, ce qui ne lui arrive jamais. — Je connais le nom de toutes les gares d’où viennent les malles. Je n’en ai vu aucune. Au registre des Archives, je suis « matériel de quai, gare de l’Ouest ». Le matériel ne voyage pas.

- « Et si tu venais avec moi ? » → contrat _(lance la quête « Le contrat de Boulon », retient « boulon-contrat »)_
- « Je comprends. » → **fin**

### contrat

> — Il faudrait qu’on me raye du matériel. L’archiviste Noam tient le registre des Ferrômes. Il classe tout. Moi, je suis une ligne. Je ne sais pas ce que vaut une ligne.

- « J’irai voir Noam. » → **fin**

### libre

_Effet : termine la quête « Le contrat de Boulon », +40 XP._

> Boulon lit le papier trois fois, puis le plie en quatre, très lentement. — Je ne suis plus du matériel. Alors je viens. Je porterai ce qu’il faut, et je me souviendrai de chaque endroit. Ce seront les miens.

- « En route, Boulon. » → **fin** _(Boulon se joint au héros)_
- « Attends-moi ici un peu. » → **fin**

### revient

> — Tu reviens me chercher ? Je suis libre de dire oui. Ou de dire non. C’est nouveau.

- _(avis de Boulon ≥ -4)_ « Viens, Boulon. » → **fin** _(Boulon se joint au héros)_
- « Une caravane pour Gardebois ? » → caravane
- « Pas maintenant. » → **fin**

## Brann Martelroux

_Apprenti de Tobias_

Commence par : « apres » _(si quête « La caisse égarée » terminée)_, sinon « rendu » _(si quête « La caisse égarée » en cours)_ _(si repère « caisse-recuperee »)_, sinon « attente » _(si quête « La caisse égarée » en cours)_, sinon « demande »

### demande

> Ah ! Pardon, je range. Enfin, j’essaie. J’ai perdu une caisse d’outils en tombant du chariot, sur la route de l’est. Si maître Cendrefer l’apprend, je suis mort. Et deux Rôdeurs-Épine tournent autour : je n’ose pas y retourner.

- « Je vais la chercher. » → merci _(lance la quête « La caisse égarée »)_
- « Tomber d’un chariot à l’arrêt, c’est un talent. » → ironie
- « Bon courage, Brann. » → **fin**

### merci

> Vraiment ? Elle est au sud de la route, après le pont. Les Rôdeurs n’aiment pas la fumée, à ce qu’on dit, ou alors on passe en douce. Moi, je cours vite, mais dans le mauvais sens.

- « J’y vais. » → **fin**

### attente

> La caisse ? Toujours là-bas, avec les Rôdeurs ?

- « Je m’en occupe. » → **fin**

### rendu

> Ma caisse ! Tous les outils sont là ! Tiens, c’est tout ce que j’ai. Et je dirai à maître Cendrefer de te faire un prix, promis.

- « Merci, Brann. » → **fin** _(termine la quête « La caisse égarée », +25 Fers, retient « remise-cendrefer », +25 XP)_

### apres

> Maître Cendrefer m’a laissé ranger tout seul, aujourd’hui. C’est une forme de confiance, je crois.

- « … » → **fin**

### ironie

> Brann rougit jusqu’aux oreilles. — Il roulait ! Un peu. Bon. Tu m’aides, ou tu te moques ?

- « Je vais la chercher. » → merci _(lance la quête « La caisse égarée »)_
- « Je me moque. » → **fin**

## Une boîte de fer

_Objet_

Commence par : « vide » _(si repère « rencontre-cache-ouverte »)_, sinon « boite »

### boite

> Sous une dalle fendue, une boîte de fer rouillée. Quelqu’un l’a cachée là, il y a longtemps, ou hier.

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
- **🎲 Discrétion 12** « Se glisser jusqu’à la caisse sans bruit. » → prise, ✗ → reperes
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

- _(sans repère « carnet-corvan »)_ « Lire l’histoire du savant Corvan. » → corvan
- « Refermer le carnet. » → **fin**

### corvan

_Effet : retient le Récit « Le Savant Corvan », retient « carnet-corvan »._

> Une page d’une autre encre : un savant, après la Chute, qui rebâtit un réacteur de l’Ancien Monde, et la foudre qui l’attendait. Dans la marge, de la main d’Ilyane : « Après la Chute, on a cru que réussir suffisait. »

- « Refermer le carnet. » → **fin**

## Cerfs-Lucioles

_Faune de Verdantis_

Commence par : « partis » _(si repère « rencontre-cerfs-vus »)_, sinon « cerfs »

### cerfs

> Une dizaine de cerfs traversent la clairière sans bruit. Leurs bois s’allument et s’éteignent, des lanternes qui respireraient. Le dernier boite : une flèche lui sort du flanc.

- « Rester immobile et regarder. » → regard _(retient « rencontre-cerfs-vus », +10 XP)_
- **🎲 Survie 11** « Les suivre sans un bruit. » → suivre, ✗ → suivre-rate _(retient « rencontre-cerfs-vus », +10 XP, +10 PV)_
- **🎲 Médecine 11** « Retirer la flèche, doucement. » → fleche, ✗ → fleche-rate _(retient « rencontre-cerfs-vus », +15 XP)_
- « Les laisser passer. » → **fin**

### fleche-rate

_Effet : retient « rencontre-cerfs-vus »._

> Le cerf se cabre au premier contact. La flèche casse net dans la plaie, et la harde s’enfuit avec lui, ses bois éteints.

- « Reprendre la route. » → **fin**

### suivre-rate

_Effet : retient « rencontre-cerfs-vus »._

> Une branche craque sous ton pied. Tous les bois s’éteignent ensemble, et la clairière est vide.

- « Reprendre la route. » → **fin**

### regard

> Le plus grand s’arrête et te regarde un long moment, puis repart. Quand la dernière lumière disparaît, tu te rends compte que tu retenais ton souffle.

- « Reprendre son souffle. » → **fin**

### suivre

> Ils te mènent jusqu’à une source claire, puis s’évanouissent dans les fougères. L’eau est fraîche et douce ; tu te sens mieux.

- « Boire, puis repartir. » → **fin**

### partis

> La clairière est redevenue sombre et silencieuse.

- « Partir. » → **fin**

### fleche

> Le cerf se laisse faire, tremblant de tout son corps. La flèche porte une marque de Ferros. Quand tu relèves la tête, le troupeau t’attend à l’orée, puis s’éteint d’un coup, comme on souffle une bougie.

- « Garder la flèche, et repartir. » → **fin**

## Un vieux Champignon-Mémoire

_Près du chantier de la Gare Engloutie_

Commence par : « champi »

### champi

> Entre deux souches, près du chantier, un Champignon-Mémoire large d’une main, pâle, qui luit faiblement. On dit qu’il mange les souvenirs récents de ceux qui marchent près de lui.

- « Le cueillir pour Liane. » → cueilli _(donne 1 × « Vieux Champignon-Mémoire », retient « champignon-cueilli »)_
- « Le laisser. » → **fin**

### cueilli

> Il se détache avec un bruit mou. Ta tête tourne un instant : tu ne sais plus très bien par où tu es arrivé·e. Puis ça revient.

- « Partir. » → **fin**

## Le chef de caravane

_Compagnie des Lisières_

Commence par : « accueil »

### accueil

> Un homme au chapeau de cuir mâchonne un bout de viande séchée. — Le chef de caravane, c’est moi. On redescend vers Gardebois aujourd’hui, comme tous les jours. Tu en es ?

- « Pour Gardebois. » → gardebois
- « Pas aujourd’hui. » → **fin**

### gardebois

> — Quinze Fers. Rien si tu portes la marque de la Compagnie : on ne fait pas payer ceux qui nous ont rendu une sacoche.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-gardebois
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-gardebois _(−15 Fers)_
- « Une autre fois. » → accueil

### trajet-gardebois

> La caravane roule sans hâte, de borne en borne. Le soir, les lanternes du Marché des Lisières s’allument une à une entre les arbres : Gardebois.

- « Descendre du chariot. » → **fin** _(attend à midi, attend le soir, mène à « Gardebois — Marché des Lisières »)_

## La colporteuse

_Marchande ambulante_

Commence par : « accueil »

### accueil

> Bonne route à toi ! Bandages, cordes, baumes, et une ficelle rouge contre les loups. Elle ne marche pas, mais elle rassure. Un petit quelque chose pour le voyage ?

- « Voyons ta marchandise. » → **fin** _(ouvre le Troc)_
- « Quelles nouvelles des routes ? » → nouvelles
- « Ta ficelle rouge, elle marche contre les colporteuses ? » → ironie
- « Bonne route. » → **fin**

### nouvelles

> On dit que les Loups de Rouille descendent plus au sud cette année, du côté de la frontière. Et à Canopéa, le Conseil ne dort plus : tout le monde parle des forages de Ferros.

- « Merci. » → accueil

### ironie

> — Contre les colporteuses, non. Contre les gens qui n’achètent rien, j’y travaille.

- « Voyons ta marchandise. » → **fin** _(ouvre le Troc)_
- « Bonne route. » → **fin**

## Le commis de Ferros

_Compagnie des Lisières_

Commence par : « presse » _(si quête « La caravane de midi » pas commencée)_, sinon « attente » _(si quête « La caravane de midi » en cours)_ _(si l’on porte « Sacoche de la Compagnie »)_, sinon « rien »

### presse

> Pas le temps, pas le temps ! Enfin, si, maintenant : j’ai raté la caravane de midi. Et cette sacoche devait partir avec elle, pour Canopéa, avant ce soir ! Mon patron va me suspendre par les bretelles à un Arbre-Titan.

- « Je peux la porter à Canopéa. » → merci _(donne 1 × « Sacoche de la Compagnie », lance la quête « La caravane de midi »)_
- « Qu’y a-t-il dedans ? » → dedans
- « Bon courage. » → **fin**

### dedans

> Des lettres de change, des échantillons, et la viande séchée du chef de caravane. Il y tient plus qu’aux lettres, entre nous. Rien de dangereux, sauf pour les Loups de Rouille, qui ont du flair.

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

## Boulon

_Ferrôme, porteur à la gare de l’Ouest_

Commence par : « gare » _(à « Ironheart — Les Forges-Basses »)_, sinon « duo-1 » _(si Liane suit le héros)_ _(sans repère « duo-1 »)_, sinon « duo-2 » _(si Liane suit le héros)_ _(si repère « duo-1 »)_ _(sans repère « duo-2 »)_, sinon « duo-3-oublie » _(si Liane suit le héros)_ _(si repère « duo-2 »)_ _(sans repère « duo-3 »)_ _(si repère « liane-a-oublie »)_, sinon « duo-3 » _(si Liane suit le héros)_ _(si repère « duo-2 »)_ _(sans repère « duo-3 »)_, sinon « route-bon » _(avis de Boulon ≥ 3)_, sinon « route-froid » _(avis de Boulon ≤ -2)_, sinon « route »

### route

> Boulon marche derrière toi, et le sol tremble un peu à chaque pas. — Je retiens tout, tu sais. Les lieux, les gens. Ce que tu fais aussi.

- « Rentre à la gare, Boulon. » → adieu
- « On continue. » → **fin**

### route-bon

> — Je retiens ce que tu fais. Jusqu’ici, j’aime ce que je retiens. C’est une sensation nouvelle. Je la range à part.

- « Rentre à la gare, Boulon. » → adieu
- « On continue. » → **fin**

### route-froid

> Boulon ne te regarde pas. — Je retiens ce que tu fais. Je préférerais oublier certaines choses. Je ne sais pas oublier.

- « Rentre à la gare, Boulon. » → adieu
- « On continue. » → **fin**

### gare

> — La gare de l’Ouest. Le quai sent toujours la même huile. Tu veux la caravane pour Gardebois ? Je sais à qui parler.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer la caravane. » → trajet _(−15 Fers)_
- « Rentre à la gare, Boulon. » → adieu
- « On continue. » → **fin**

### trajet

> Boulon hisse ta malle sur le chariot, puis s’y hisse à son tour. La caravane quitte la cendre de Ferros, passe la frontière, retrouve la forêt. Le soir, les lanternes du Marché des Lisières.

- « Descendre du chariot. » → **fin** _(attend à midi, attend le soir, mène à « Gardebois — Marché des Lisières »)_

### adieu

_Effet : Boulon rentre chez soi._

> — Je retourne au quai. Les malles ne se porteront pas toutes seules, même libres. Tu sais où me trouver.

- « À bientôt, Boulon. » → **fin**

### duo-1

_Effet : retient « duo-1 »._

> Boulon se tourne vers Liane. — Tu mâches quelque chose, la nuit. Ça sent la cave. — Ça ne te regarde pas, Boulon. — Non, dit-il. Je le retiens quand même.

- « … » → **fin**

### duo-2

_Effet : retient « duo-2 »._

> — Tu retiens tout ? demande Liane. Même ce qui fait mal ? — Surtout ce qui fait mal. Le reste glisse. — Alors on est l’inverse, toi et moi. Elle rit, presque. Boulon range ce rire à part, avec soin.

- « … » → **fin**

### duo-3

_Effet : retient « duo-3 »._

> Liane marche un moment près de Boulon, sans rien dire. Puis : — Si un jour j’oublie mon frère pour de bon… tu me diras son nom ? — Saule, dit Boulon. Je te le dirai aussi souvent qu’il faudra.

- « … » → **fin**

### duo-3-oublie

_Effet : retient « duo-3 »._

> Liane marche un moment près de Boulon. — Boulon. Tu retiens tout. J’avais quelqu’un, avant ? Un frère, une sœur ? Boulon se tait longtemps. — Oui. Je te le dirai le jour où tu voudras vraiment le savoir.

- « … » → **fin**

## Liane Sève-Claire

_Herboriste_

Commence par : « marques » _(1 marque du cristal ou plus)_ _(sans repère « liane-a-vu-marques »)_, sinon « manger » _(si quête « Ce que Liane veut oublier » en cours)_ _(si l’on porte « Vieux Champignon-Mémoire »)_, sinon « nuit » _(si quête « Ce que Liane veut oublier » pas commencée)_ _(la nuit)_, sinon « legere » _(si repère « liane-a-oublie »)_, sinon « route-bon » _(avis de Liane ≥ 3)_, sinon « route-froid » _(avis de Liane ≤ -2)_, sinon « route »

### route

> Liane cueille au passage ce qui pousse au bord du chemin, et le fourre dans sa besace. — Alors ? On reste plantés là ?

- _(si quête « Ce que Liane veut oublier » en cours)_ _(sans repère « oubli-choix-oublier »)_ _(sans repère « oubli-choix-graver »)_ « Pour Saule : que veux-tu faire ? » → choix
- « Rentre à Gardebois, Liane. » → adieu
- « On continue. » → **fin**

### route-bon

> Liane te tend une feuille de menthe sans rien dire, puis sourit. — Tu fais les choses à peu près comme il faut. Ne le prends pas mal : venant de moi, c’est un compliment.

- _(si quête « Ce que Liane veut oublier » en cours)_ _(sans repère « oubli-choix-oublier »)_ _(sans repère « oubli-choix-graver »)_ « Pour Saule : que veux-tu faire ? » → choix
- « Rentre à Gardebois, Liane. » → adieu
- « On continue. » → **fin**

### route-froid

> Liane marche à trois pas, les lèvres pincées. — Ne me demande pas mon avis. Tu ne l’aimerais pas.

- _(si quête « Ce que Liane veut oublier » en cours)_ _(sans repère « oubli-choix-oublier »)_ _(sans repère « oubli-choix-graver »)_ « Pour Saule : que veux-tu faire ? » → choix
- « Rentre à Gardebois, Liane. » → adieu
- « On continue. » → **fin**

### legere

> Liane fredonne. Elle a l’air légère, presque trop. — Tu sais, j’ai rêvé d’un garçon qui riait fort et grimpait trop haut. Je ne sais pas qui c’était. Ça m’a fait du bien et du mal.

- _(si quête « Ce que Liane veut oublier » en cours)_ _(sans repère « oubli-choix-oublier »)_ _(sans repère « oubli-choix-graver »)_ « Pour Saule : que veux-tu faire ? » → choix
- « Rentre à Gardebois, Liane. » → adieu
- « On continue. » → **fin**

### nuit

> Le soir venu, Liane mâche quelque chose en silence, les yeux dans le vague. Une odeur de cave et de terre mouillée. — Quoi ? Ça m’aide à dormir.

- « Qu’est-ce que tu mâches ? » → aveu
- « Dors bien, Liane. » → **fin**

### aveu

_Effet : lance la quête « Ce que Liane veut oublier », retient « oubli-aveu »._

> — Du Champignon-Mémoire. Il mange les souvenirs récents. Les miens, c’est toujours le même : Saule, mon petit frère, sous les déblais du chantier de Brisefer. La maladie me le remontre chaque nuit. Ça, au moins, me laisse dormir.

- « Ça te ronge. Tu oublies d’autres choses. » → ronge
- « Tu as le droit de ne plus le revoir mourir. » → droit
- « Que veux-tu faire ? » → choix
- « Dors, Liane. » → **fin**

### ronge

> — Hier, j’ai oublié le nom de la sauge-lumière. Moi ! Je sais. Mais entre oublier un peu de tout et le revoir mourir chaque nuit, j’ai choisi.

- « Il y a peut-être un autre chemin. » → choix
- « Dors, Liane. » → **fin**

### choix

> Liane serre sa besace. — Près du chantier, à la Gare, pousse un vieux Champignon-Mémoire : un seul, et Saule s’en va pour de bon. Ou bien, au Bosquet des Échos, à Canopéa, on grave les morts dans le bois vivant. Le bois se souviendrait à ma place.

- « Allons chercher le vieux champignon. » → oublier-ok _(retient « oubli-choix-oublier »)_
- « Allons graver son nom au Bosquet. » → graver-ok _(retient « oubli-choix-graver »)_
- « Prends ton temps. » → **fin**

### oublier-ok

> — Là où il est mort, évidemment. Ça pousse sur ce qui pourrit. Merci de ne pas me faire la morale.

- « En route. » → **fin**

### graver-ok

> — Il faudra que je le touche, ce bois, après. Je ne sais pas si je pourrai.

- « Je serai là. » → **fin** _(avis de Liane +1)_
- « En route. » → **fin**

### manger

> Liane prend le champignon à deux mains. Il luit faiblement, d’un blanc de lune. — Après, je ne saurai même plus pourquoi je l’ai mangé. Tu ne me le diras pas, hein ?

- « Je ne te dirai rien. » → oublie _(reprend 1 × « Vieux Champignon-Mémoire », retient « liane-a-oublie », termine la quête « Ce que Liane veut oublier », +40 XP, avis de Liane +2)_
- _(sans repère « oubli-choix-graver »)_ « Non : allons plutôt graver son nom. » → graver-ok _(reprend 1 × « Vieux Champignon-Mémoire », retient « oubli-choix-graver »)_
- « Attends. Garde-le encore. » → **fin**

### oublie

> Elle mange. Longtemps, elle ne dit rien. Puis elle s’étire, et sourit comme tu ne l’as jamais vue sourire. — Bon. On y va ? … Pourquoi tu me regardes comme ça ? Quelqu’un est mort ?

- « Personne. On y va. » → **fin**

### adieu

_Effet : Liane rentre chez soi._

> — Bon. Mes malades m’attendent, de toute façon. Tu sais où me trouver : là où ça sent la menthe.

- « À bientôt, Liane. » → **fin**

### marques

_Effet : retient « liane-a-vu-marques »._

> Liane attrape ta main et la retourne, sans demander. — Tes veines. Tu forces ton cristal. J’ai vu des guérisseurs finir comme ça, à Gardebois : ils soignaient tout le monde, sauf eux. Vanel peut te les reprendre. Ne fais pas l’idiot·e.

- « Je ferai attention. » → **fin**
- « Je sais ce que je fais. » → **fin** _(avis de Liane −1)_

### droit

> Liane te regarde, prise de court. — Ilyane dit qu’oublier, c’est trahir. Les Gardiens disent tous ça. Toi aussi, tu en es un. Elle détourne les yeux. — Merci quand même.

- « Que veux-tu faire ? » → choix
- « Dors, Liane. » → **fin**

## La convoyeuse

_Compagnie des Lisières, la caravane de midi_

Commence par : « accueil »

### accueil

> Une femme en manteau de route vérifie les sangles d’un chariot. — Compagnie des Lisières ! La caravane part à midi, tous les jours que la forêt fait. Où vas-tu ?

- « À Canopéa. » → canopee
- _(si quête « L’audience » terminée)_ « À Ironheart. » → ironheart
- « Pas aujourd’hui. » → **fin**

### canopee

> — Quinze Fers, et tu dors sur les sacs de farine. Rien pour les gens de la Compagnie : on ne fait pas payer la famille.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-canopee
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-canopee _(−15 Fers)_
- « Une autre fois. » → accueil

### ironheart

> — Ironheart, par la frontière. Ton sauf-conduit du Triumvirat suffira aux douaniers. Quinze Fers, rien pour la Compagnie.

- _(si repère « membre-compagnie-lisieres »)_ « Montrer ta marque de la Compagnie. » → trajet-ironheart
- _(sans repère « membre-compagnie-lisieres »)_ **[15 Fers]** « Payer le voyage. » → trajet-ironheart _(−15 Fers)_
- « Une autre fois. » → accueil

### trajet-canopee

> La caravane suit la route des Lisières. Les chariots grincent ; on chante fort pour tenir les Loups de Rouille à distance. À la tombée du jour, au pied des Arbres-Titans, la Grande Nacelle te monte jusqu’aux cimes.

- « Monter jusqu’aux cimes. » → **fin** _(attend à midi, attend le soir, mène à « Canopéa — La Grande Nacelle »)_

### trajet-ironheart

> La caravane passe la frontière de Ferros. La forêt s’éclaircit, la terre devient cendre, et le ciel prend la couleur de la rouille. Au soir, la gare de l’Ouest d’Ironheart.

- « Descendre du chariot. » → **fin** _(attend à midi, attend le soir, mène à « Ironheart — Les Forges-Basses »)_

## Cristal de veille

_Objet_

Commence par : « cristal »

### cristal

> Le cristal de veille luit doucement. Ilyane dit qu’il tient les mauvais rêves à distance. En le regardant, tu sens ta fatigue s’apaiser.

- « Se reposer un instant. » → **fin** _(+40 PV)_
- « S’éloigner. » → **fin**

## Le technicien Dask

_Classe Technique, Manufactures-Moyennes_

Commence par : « apres » _(si repère « dask-parrain »)_, sinon « dossier » _(si quête « Le registre du Puits Trois » en cours)_, sinon « accueil »

### accueil

> Un homme en gris clair, des chiffres bleus tatoués au poignet, classe des fiches sans lever les yeux. — Classe Technique. Si vous n’avez rien à parrainer, vous avez déjà pris trop de mon temps.

- « Pardon. » → **fin**

### dossier

> Il lève enfin les yeux. — Orvel ? Le masque à filtre, je sais : l’inspecteur de zone m’en a parlé. Un Ouvrier transfère sous la responsabilité de son parrain. S’il déçoit, c’est mon nom qui rouille. Il me faut une raison.

_Si Boulon voyage avec toi :_ Boulon, d’une voix égale : — Matériel de quai. Riveteur. Assistant. Ils ont toujours un mot pour vous ranger.

- **[60 Fers]** « Soixante Fers, pour les mains à graisser. » → paye _(−60 Fers, retient « dask-parrain »)_
- _(sans repère « dask-refuse »)_ **🎲 Diplomatie 12** « Un Innovateur qui vous doit tout vous sera fidèle. » → convaincu, ✗ → dossier-refus _(retient « dask-parrain »)_
- « Que voulez-vous d’autre ? » → nom
- **🎲 Subterfuge 14** « Pendant qu’il cherche un formulaire, apposer son sceau sur le dossier. » → faux-ok, ✗ → faux-bancal

### dossier-refus

_Effet : retient « dask-refuse »._

> Dask sourit sans lever la plume. — Fidèle ? Un Innovateur est fidèle à qui l’a fait monter, jusqu’au jour où il monte plus haut. Une raison, j’ai dit.

- « Autre chose. » → dossier
- « Je reviendrai. » → **fin**

### nom

> — Le masque. Déclaré à mon nom : le masque Dask. Le garçon montera comme mon assistant, bien payé. Les Manufactures vendront le masque aux fonderies qui paient. C’est ainsi que le progrès monte : avec ceux qui savent le porter.

- « Marché conclu. » → nom-ok _(retient « dask-parrain », retient « dask-nom », avis de Boulon −1)_
- « Le progrès monte avec ceux qui savent le porter. Et toi, tu portes quoi, Dask ? Des gants ? » → nom-ironie
- « Non. » → dossier

### paye

> Les Fers disparaissent dans un tiroir. Dask signe d’une main, sans regarder. — Le nom d’Orvel sera au registre du Puits Trois demain. Le convoi part à l’aube. Qu’il ne soit pas en retard : ici, le retard s’écrit aussi.

- « Bien. » → **fin**

### convaincu

> Dask réfléchit, la plume en l’air. — Fidèle. Oui. On manque de gens fidèles, là-haut. Il signe. — Orvel au registre demain. S’il me déçoit, je saurai qui vous êtes : vous êtes dans les listes, vous aussi.

- « Bien. » → **fin**

### nom-ok

> Dask sourit pour la première fois, de toutes ses dents. — Vous comprenez Ferros mieux que la plupart des Ferriens. Le nom d’Orvel au registre demain. Le masque, lui, sera à la page Dask.

- « … » → **fin**

### faux-ok

_Effet : retient « dask-parrain »._

> Dask fouille un tiroir en maugréant. Le sceau est là, sur le bureau : tu l’appliques au bas du dossier, net, et tu reposes tout avant qu’il se retourne. — Revenez avec une raison, grogne-t-il. Tu as déjà ce qu’il te faut.

- « Je reviendrai. » → **fin**

### faux-bancal

_Effet : retient « dask-parrain », retient « faux-bancal »._

> Le sceau glisse sous ta main ; l’empreinte bave un peu. Tu reposes tout avant qu’il se retourne. — Revenez avec une raison. Le dossier est signé. À peu près. Personne ne regarde jamais d’aussi près… n’est-ce pas ?

- « Je reviendrai. » → **fin**

### apres

> — Le dossier Orvel est parti. Le reste ne me regarde plus. Circulez.

- « … » → **fin**

### nom-ironie

> Dask sourit sans chaleur. — Des responsabilités. Elles ne salissent pas les mains. Alors ?

- « Reprendre. » → nom

## Dorna Vissard

_Pension de la Bielle_

Commence par : « cristal » _(un cristal au cou)_ _(sans repère « dorna-cristal »)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> — Pension de la Bielle ! Lit de camp et soupe épaisse, comme à l’usine. Nom d’une gueuse, tu as l’air d’avoir marché des jours !

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « bielle »)_
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
- **[8 Fers]** « Un lit jusqu’au matin. » → dodo _(−8 Fers, dort jusqu’au matin)_
- **[8 Fers]** « Un lit jusqu’à la nuit. » → dodo _(−8 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### dodo

> Une soupe de grain, du pain noir, et un lit de camp qui grince. Au réveil, tes forces sont revenues.

- « Se lever. » → **fin**

### accueil-2

> — Pension de la Bielle ! Ce matin, le registre du Puits Trois a encore changé : deux transferts de plus vers les Manufactures. Assieds-toi, un registre, ça ne se mange pas.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « bielle »)_
- « Au revoir. » → **fin**

### accueil-3

> — Pension de la Bielle ! Les Litanies ont commencé avant l’aube, aujourd’hui : un contremaître pressé. Nom d’une gueuse, on n’entend plus ses propres pensées.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « bielle »)_
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
- **🎲 Érudition 10** « Noter les vers, un à un, sans en perdre un mot. » → retenue, ✗ → echappe
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
- « Lui donner une de tes histoires, pour qu’il te laisse entrer. » → approche 📖 donner un Récit : autres → don-entree
- « S’éloigner. » → **fin**

### interieur

_Effet : retient le Récit « Le savant du dernier quai »._

> Un instant, tu es sur ce quai disparu. Une voix te revient, celle d’un savant qu’on emmenait loin du danger : « Dis-leur que même réussir peut tout détruire. » Puis l’Écho se dissipe, apaisé pour un temps.

- _(sans repère « heros-enfant »)_ « Rester encore un instant. » → enfant
- « … » → **fin**

### enfant

_Effet : retient « heros-enfant »._

> À une fenêtre du dernier wagon, un enfant se retourne. Il ne regarde ni le savant ni le quai : il te regarde, toi. Ses lèvres bougent. « Tu es venu·e. Les autres n’ont pas entendu. » Puis la vitre se vide.

- « Rester là, sans comprendre. » → **fin**

### observe

> Tu restes en retrait. Les images s’effacent sans te livrer leurs secrets, mais tu as vu assez pour comprendre : ce train n’aurait pas dû partir, et pourtant il est parti.

- « … » → **fin**

### apaise

> L’Écho s’est apaisé, pour un temps. Sur le quai, les silhouettes ne sont plus qu’un frisson de lumière, et le sifflet un souffle lointain.

- **[Mémoire 4]** « Entrer dans l’Écho. » → interieur
- « Lui donner une de tes histoires, pour qu’il te laisse entrer. » → apaise 📖 donner un Récit : autres → don-entree
- « S’éloigner. » → **fin**

### don-entree

_Effet : retient « echo-dernier-train-vu », +15 XP._

> Tu racontes, à voix basse, sur le quai qui tremble. Les silhouettes s’arrêtent pour écouter ; à une fenêtre, une main d’enfant s’agite. Quand tu as fini, l’histoire n’est plus à toi : le train l’a prise, et l’Écho s’ouvre.

- « Entrer dans l’Écho. » → interieur

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

- _(si quête « Les Échos sous la Forge » en cours)_ **[Mémoire 3]** _(sans repère « echos-dechaines »)_ « Le suivre, là où il va. » → suivre _(retient « echos-suivis », termine la quête « Les Échos sous la Forge », +50 XP, donne 1 × « Oiseau de fer », avis de Boulon +1)_
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

- « Pour les Archives : Noam saura le classer. » → archiver _(donne 1 × « Relevé d’un Écho », retient « echo-releve », avis de Boulon +1)_
- « Pour Ilyane, qui saura l’écouter. » → confier _(donne 1 × « Lettre pour Ilyane », retient « echo-lettre », avis de Liane +1, avis de Boulon +1)_
- « Réfléchir encore. » → choix

### archiver

> Tu notes tout, avec la précision qu’on t’a apprise. Noam, aux Archives Centrales, saura où le ranger, s’il existe un endroit pour ce qui n’est d’aucune époque.

- « Remonter. » → **fin**

### confier

> Tu recopies l’Écho dans une lettre pour Ilyane. À Gardebois, elle est loin ; mais Ragna, à l’atelier Cendrefer, fait partir des caisses vers son frère Tobias, au Marché des Lisières.

- « Remonter. » → **fin**

### frapper

> Hesk l’a dit : un Écho qu’on frappe se multiplie, et devient violent. Frapper quand même ?

- « Frapper. » → **fin** _(avis de Liane −1, avis de Boulon −2, retient « echos-dechaines », lance le combat « echos-furieux »)_
- « Non. » → choix

### apaise

> L’Écho rejoue sa promesse, plus doucement. « On se retrouvera. » Tu sais maintenant que tu la garderas, toi aussi.

- « Partir. » → **fin**

### ecrit-archives

> L’Écho rejoue sa promesse. Ton relevé est dans ta besace : il attend Noam, aux Archives Centrales.

- « Partir. » → **fin**

### ecrit-lettre

> L’Écho rejoue sa promesse. Ta lettre pour Ilyane est dans ta besace : Ragna, à l’atelier Cendrefer, la fera partir.

- « Partir. » → **fin**

## La dame en gris

_Une courtière de Ferros_

Commence par : « offre » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_ _(sans repère « edda-reglee »)_, sinon « accueil »

### accueil

> Une femme en manteau gris de Ferros, gants fins, ne lève pas les yeux de son thé. — Vous aussi, vous venez pour la Bibliothèque ? On y vend tout. Sauf des réponses.

_Si Boulon voyage avec toi :_ Boulon s’arrête net. — Je l’ai portée. Gare de l’Ouest, il y a une lune : deux malles très lourdes, pas un mot, un pourboire en Fers neufs. Elle allait vers les Portes.

- « Qui êtes-vous ? » → qui
- « Au revoir. » → **fin**

### qui

> — Une courtière. J’achète ce que les autres ont lu. C’est un métier honnête, à Sept-Portes : rien n’y est caché, tout y a un prix.

- « Au revoir. » → **fin**

### offre

> La dame en gris lève enfin les yeux. — Vous l’avez lue. Ça se voit à vos mains. Deux cents Fers pour ce que dit la ligne, et vous n’entendrez plus parler de moi.

_Si Liane voyage avec toi :_ Liane, à mi-voix : — Elle ne veut pas cette ligne pour l’argent. Regarde ses mains : elle cherche quelqu’un.

_Si Boulon voyage avec toi :_ Boulon : — Elle tient sa tasse comme on tient une poignée de malle. Pour ne pas la perdre.

- « La lui vendre, pour deux cents Fers. » → vendue _(+200 Fers, retient « ligne-vendue », retient « edda-reglee », retient « edda-partie », avis de Liane −2, avis de Boulon −1)_
- _(si repère « main-edda-fausse »)_ « Je sais qui vous êtes : Edda Varn est morte il y a trente ans. » → morte
- « Non. » → refus _(retient « edda-reglee », retient « edda-suit », retient « edda-partie »)_

### vendue

> Elle compte les Fers sans les regarder, écoute la ligne une fois et la répète sans faute. — Altavent. Merci. Les routes sont longues ; on ne se reverra pas.

- « … » → **fin**

### morte

> Elle sourit pour la première fois. — Et alors ? Ici, personne ne peut me toucher. Allez donc le dire au Conservateur. Il enregistrera.

- « Vous signez avec la main d’une morte. Elle ne réclame pas ses doigts ? » → morte-main
- « … » → **fin**

### refus

> — Comme vous voudrez. Elle repose sa tasse, laisse une pièce et se lève. — Les routes sont longues. On se reverra, quelque part entre ici et Altavent.

- « … » → **fin**

### morte-main

> Le sourire de la dame en gris ne bouge pas. — Elle me l’a prêtée. Là où elle est montée, elle n’en avait plus l’usage.

- « … » → **fin**

## Elouan Chante-Bois

_Luthier_

Commence par : « apres » _(si quête « Le chant d’Anselme » terminée)_, sinon « flute-prete » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Flûte d’Anselme »)_, sinon « branche » _(si quête « Le chant d’Anselme » en cours)_ _(si l’on porte « Branche de l’arbre d’Anselme »)_, sinon « attente » _(si quête « Le chant d’Anselme » en cours)_, sinon « proposition » _(si quête « Le chant d’Anselme » pas commencée)_ _(si repère « anselme-connu »)_, sinon « proposition » _(si quête « Le chant d’Anselme » pas commencée)_ _(si repère « voix-anselme »)_, sinon « accueil »

### accueil

> Chut, écoute. Ce bois-là chante quand le vent passe dedans. Je suis Elouan, luthier. Je ne taille que les branches tombées : à Canopéa, on ne coupe pas un arbre qui vit.

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

> 🌙 Elouan déchiffre la notation d’Ilyane en fronçant les sourcils, puis il taille, perce, souffle. Le soir tombe. La chanson des cerfs-lucioles sort enfin de la flûte. — C’est celle du carnet. Pas tout à fait celle d’Aïlis, peut-être. Porte-la-lui.

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

> Elvan Morelle, de la Compagnie des Lisières : tissus de Gardebois, cordes de Ferros. Je repars bientôt, alors si tu veux quelque chose, c’est maintenant, mais tout est déjà promis, j’en ai peur.

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

> Elvan s’assoit d’un coup. — Les Marches des Cendres paient trois fois le prix, à Ironheart. Trois fois ! Je me disais : quelques sacs, le Conseil ne verra rien. Il en reste six, là, dans le ballot.

- « Je vais le dire au Conseil. » → denonce _(retient « graines-denonce », termine la quête « Les graines qui manquent », +30 XP, avis de Liane +1)_
- _(sans repère « elvan-refuse »)_ **🎲 Diplomatie 13** « Rapporte-les toi-même au grenier, et la Compagnie gardera son honneur. » → rend, ✗ → aveu-refus _(retient « graines-rendues », termine la quête « Les graines qui manquent », +40 XP, avis de Liane +2, avis de Boulon +1)_
- « Partageons : quarante Fers, et je n’ai rien vu. » → part _(retient « graines-silence », +40 Fers, termine la quête « Les graines qui manquent », +10 XP, avis de Liane −2, avis de Boulon −1)_
- « Laisse-moi réfléchir. » → **fin**

### aveu-refus

_Effet : retient « elvan-refuse »._

> Elvan secoue la tête. — Entrer au grenier avec le ballot, pour qu’on me voie ? Non. Choisis : tu parles au Conseil, ou tu prends ta part.

- « Alors je choisis. » → aveu
- « Laisse-moi réfléchir. » → **fin**

### denonce

> Elvan blêmit. — Banni. Ils vont me bannir. Un Garde Vert l’emmène le soir même, ballot compris. Ici, on n’enferme pas : on retire les racines. Il partira sans nom, et la Compagnie ne le reconnaîtra plus.

- « Les graines rentreront au grenier. » → **fin**

### rend

> Il hésite longtemps, puis charge le ballot sur son épaule. — Je les rapporte ce soir, par la nacelle de Véline. Je dirai que je les ai retrouvées. Merci de m’avoir laissé ça.

- « Que la sève coule, Elvan. » → **fin**

### part

> Elvan compte quarante Fers, sans te regarder. — Pas un mot, hein ? À Ironheart, on te dirait que c’est du commerce.

- « Pas un mot. » → **fin**

### apres-rendu

> Elvan te salue d’un signe de tête. — Je n’ai jamais si bien dormi. La Compagnie m’a gardé, tu sais. Elle ne sait pas tout, mais moi, je sais.

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

- _(sans repère « marques-rate »)_ **🎲 Investigation 12** « Examiner les marques. » → marques, ✗ → marques-rien
- « Approcher la lueur d’un cristal. » → marques _(lance « Lueur »)_
- « Partir. » → **fin**

### marques-rien

_Effet : retient « marques-rate » pour 1 jours._

> Cinq mains, des doigts écartés, de la suie dans les creux. Tu les regardes longtemps, et l’Écho ne revient pas. Pas aujourd’hui.

- « Revenir à l’enclume. » → enclume
- « Partir. » → **fin**

### marques

> Gravées à froid, avec soin, comme on signe un serment. Sous les mains, un seul mot, presque effacé, dans la même langue inconnue que la berceuse.

- « Partir. » → **fin**

## La foreuse de Brisefer

_Objet_

Commence par : « explosee-pell » _(si repère « foreuse-explosee »)_ _(si repère « pell-sauve »)_, sinon « explosee » _(si repère « foreuse-explosee »)_, sinon « faussee » _(si repère « foreuse-sabotee »)_, sinon « arretee-golem » _(si repère « golem-vaincu »)_, sinon « arretee » _(si repère « chantier-arrete »)_, sinon « gardee » _(si repère « surpris-de-nuit »)_, sinon « jour »

### jour

> La foreuse de Brisefer mord la roche de la Faille dans un fracas de fer. Les ouvriers ne la quittent pas des yeux.

_Si Liane voyage avec toi :_ Liane s’est arrêtée au bord du quai. — Chaque coup de cette machine, mes malades le sentent dans les dents. Et Saule… Non. Plus tard.

- _(si quête « Le Dernier Train » en cours)_ « Attendre la nuit dans les ruines du quai. » → nuit _(attend la nuit)_
- « S’éloigner. » → **fin**

### nuit

> 🌙 La nuit tombe sur la Gare. Le chantier s’endort ; seule une lanterne veille encore, près de la tente de Brisefer.

- **🎲 Discrétion 10** « Se glisser jusqu’à la foreuse. » → au-pied, ✗ → repere
- **🎲 Athlétisme 11** « Escalader la palissade, côté ruines. » → au-pied, ✗ → palissade
- « Renoncer et attendre le jour. » → **fin**

### au-pied

> 🌙 Te voilà au pied de la foreuse, dans l’odeur d’huile et de pierre chaude. Personne n’a rien vu.

- **🎲 Artisanat 10** « Saboter le mécanisme. » → sabotee, ✗ → bruit
- « Ouvrir la chaudière en grand, et courir. » → chaudiere _(retient « foreuse-sabotee », retient « foreuse-explosee », retient « chantier-arrete », termine la quête « Le Dernier Train », +50 XP, +30 Fers, avis de Liane −2)_
- « Repartir sans rien toucher. » → **fin**

### sabotee

_Effet : retient « foreuse-sabotee », retient « chantier-arrete », termine la quête « Le Dernier Train », +70 XP, +30 Fers._

> 🌙 Une goupille retirée, un engrenage faussé : la foreuse ne repartira pas avant longtemps. Tu regagnes l’ombre sans un bruit.

_Si Liane voyage avec toi :_ Liane souffle enfin, dans le noir. — Sans un mort. Je ne pensais pas que ça se pouvait, ici.

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

### chaudiere

> 🌙 Tu ouvres la vanne en grand et tu cours. Derrière toi, la chaudière hurle, puis éclate. Le feu éclaire tout le quai. Sous la lanterne renversée, quelqu’un crie : le garçon qui veillait.

_Si Liane voyage avec toi :_ Liane court déjà vers le feu, la besace battant contre sa hanche. — Il y a quelqu’un ! Aide-moi, bon sang !

- **🎲 Médecine 12** « Revenir dans le feu : le tirer de là, serrer ses brûlures. » → pell-sauve, ✗ → pell-rate _(retient « pell-sauve », avis de Liane +1, +20 XP)_
- « Revenir dans le feu. » → pell-perdu
- « Courir, sans te retourner. » → pell-mort

### pell-rate

> 🌙 Tu le tires hors des flammes, tu serres, tu refroidis, tout ce que tu sais. Ça ne suffit pas : la brûlure est trop large. Il meurt avant l’aube, une main dans la tienne.

- « Attendre le jour. » → **fin**

### explosee

> La foreuse n’est plus qu’une carcasse noire, ouverte comme une fleur de fer. Au bord du quai, de la terre fraîche, et une lanterne éteinte posée dessus.

- « S’éloigner. » → **fin**

### palissade

_Effet : retient « surpris-de-nuit », −2 PV._

> 🌙 Une planche pourrie cède sous ton pied. Tu retombes dans les orties, avec un bruit de bois mort. Une lanterne se lève : « Qui va là ? » Brisefer saura qu’on a rôdé ici.

- « … » → **fin**

### pell-sauve

> 🌙 Tu le tires hors des flammes, tu coupes, tu serres, tu refroidis. Au matin, Brisefer le trouve sous sa tente, bandé jusqu’aux coudes. Il vivra. Ses mains, non.

- « Attendre le jour. » → **fin**

### pell-perdu

> 🌙 Tu le tires hors des flammes. Il respire encore quand tu le poses sur le quai, puis il ne respire plus. Tu ne savais pas quoi serrer, ni où.

- « Attendre le jour. » → **fin**

### pell-mort

> 🌙 Au matin, on compte : la foreuse est morte. Le garçon qui veillait sous la lanterne aussi.

- « Attendre le jour. » → **fin**

### explosee-pell

> La foreuse n’est plus qu’une carcasse noire, éventrée. Sous la tente de Brisefer, quelqu’un gémit dans son sommeil, les mains bandées jusqu’aux coudes.

- « S’éloigner. » → **fin**

### arretee-golem

> La foreuse est muette. Son câble d’alimentation pend dans la poussière, arraché au cœur du Golem qui la faisait tourner.

- « S’éloigner. » → **fin**

## La forge froide

_Forges-Basses_

Commence par : « scellee » _(si repère « echos-dissipes »)_, sinon « apres » _(si quête « Les Échos sous la Forge » terminée)_, sinon « trappe » _(si repère « trappe-vue »)_, sinon « jour »

### jour

> Une forge froide, la seule des Forges-Basses. Les ouvriers la contournent : « si une forge s’éteint d’elle-même, un esprit rouille rôde. » Pourtant, la pierre du foyer est tiède sous la main.

- « Revenir à la nuit tombée. » → nuit _(attend la nuit)_
- « Passer son chemin. » → **fin**

### nuit

_Effet : retient « trappe-vue », lance la quête « Les Échos sous la Forge »._

> À la nuit, la forge s’embrase sans feu : une lueur rouge, sans chaleur ni fumée. Elle respire. Au fond du foyer, la lueur dessine une trappe de fer. Des voix montent d’en bas, très loin.

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

_Si Liane voyage avec toi :_ Liane, tout bas : — Il a les mains d’un homme qu’on paie pour ne pas réfléchir. Mon père avait les mêmes.

- « Ce sol est sacré, et tu coupes les racines du Bosquet. » → defensif
- _(sans repère « garrik-defie »)_ **🎲 Commandement 11** « Pose cette pioche. Tout de suite. » → intimide, ✗ → intimide-rate
- **🎲 Subterfuge 12** « Kaelis m’envoie voir où tu en es. » → complice, ✗ → demasque
- « Je m’en vais. » → **fin**

### intimide-rate

_Effet : retient « garrik-defie »._

> Garrik ne pose rien du tout. Il serre le manche, et ses phalanges blanchissent. — Tu donnes des ordres, toi ? En bas ? Il lève la pioche.

- « Alors on va régler ça. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Reculer, les mains levées. » → **fin**

### defensif

> — Les racines ? Je creuse le long d’une voie, moi, pas dans les racines ! Bon, il y en avait sur le chemin. Écoute, je suis payé à la pelletée, pas aux questions.

- _(sans repère « garrik-ferme »)_ **🎲 Diplomatie 13** « Là-haut, des gens ne peuvent plus parler à leurs morts. À cause de ce trou. » → convaincu, ✗ → defensif-rate
- « Alors je vais te faire partir. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Je reviendrai. » → **fin**

### defensif-rate

_Effet : retient « garrik-ferme »._

> — Des gens, là-haut. Garrik crache dans ses mains et reprend sa pioche. — Moi aussi, j’ai des gens. Ils mangent ce que je creuse.

- « Alors je vais te faire partir. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Je reviendrai. » → **fin**

### intimide

> Le fouilleur lâche sa pioche. — Doucement ! Je ne suis qu’un ouvrier, moi. On m’a payé pour creuser le long de la vieille voie, c’est tout. Je n’ai rien trouvé, je le jure !

- « Qui t’a payé ? Et pour trouver quoi ? » → aveu

### convaincu

> Il baisse la pioche, longtemps. — Ma mère repose sous un chêne, chez nous, à la frontière. Je n’y avais pas pensé. Bon. Je vais te dire ce que je sais.

- « Je t’écoute. » → aveu

### complice

> — Kaelis ? Il pourrait payer plus vite, alors ! Dis-lui que je longe la voie depuis dix jours, et toujours pas de clé. Juste des racines, des racines, des racines. Il faut bien les couper pour passer.

- « Rappelle-moi ce qu’il cherche, exactement. » → aveu

### demasque

> — Kaelis n’envoie personne : il vient lui-même, ou il ne vient pas. Toi, tu es avec ceux d’en haut ! Il lève sa pioche.

- _(sans repère « garrik-ferme »)_ **🎲 Diplomatie 13** « Du calme. Personne n’a besoin de se battre. » → convaincu, ✗ → demasque-rate
- « Alors on va régler ça. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Reculer, les mains levées. » → **fin**

### demasque-rate

_Effet : retient « garrik-ferme »._

> — Le calme, c’est pour ceux d’en haut. La pioche siffle à un pouce de ta tête.

- « Se défendre. » → **fin** _(lance le combat « fouilleur-sol »)_
- « Reculer, les mains levées. » → **fin**

### aveu

_Effet : retient « cle-mentionnee », retient « fouille-marches »._

> — On est payés par les Marches des Cendres, au Marché des Cendres, à Ironheart : un certain Kaelis, qui achète les vieilles choses. Ils cherchent une clé de rouille bleue, le long des anciennes voies. Celle-ci passe sous vos arbres.

- _(sans repère « gris-garrik »)_ « Et Kaelis, qui le paie ? » → gris
- « Pars, et ne reviens jamais sur le sol sacré. » → depart _(retient « fouille-elucidee », +30 XP)_

### depart

> Il ramasse ses outils sans un mot de plus et s’éloigne entre les racines, vers l’est. Au bord du trou, la terre fraîche et les racines tranchées racontent le reste. Le Triumvirat voudra le savoir.

- « Remonter faire mon rapport. » → **fin**

### gris

_Effet : retient « gris-garrik »._

> — Kaelis ? Il ne paie jamais de sa poche. Une fois, au Marché des Cendres, j’ai vu une dame en gris lui compter des Fers neufs sans retirer ses gants. Elle a demandé si on avait trouvé la clé. Pas comment j’allais, moi.

- « Pars, et ne reviens jamais sur le sol sacré. » → depart

## Le Golem de Ferraille

_Objet_

Commence par : « garde »

### garde

> Le Golem de Ferraille ne bouge plus. Il garde la Faille, le cœur à demi éteint, et ses yeux te suivent. Derrière la palissade, Ingrid Brisefer a vu ta main sur ta lame : « Touchez-y, et je ne réponds plus de rien. »

- « Le frapper quand même. » → **fin** _(retient « golem-attaque-apres », avis de Liane −1, lance le combat « golem-gare »)_
- « Le laisser à sa garde. » → **fin**

## Sacs de graines-lumière

_Objet_

Commence par : « vide » _(si repère « vol-grenier »)_, sinon « sacs »

### sacs

> Des sacs de graines-lumière, alignés comme des soldats. Chacun porte le sceau du Conseil : ce sont les semences des futurs arbres de Canopéa.

- « Prendre un sac. » → pris _(donne 1 × « Graines-lumière », retient « vol-grenier », avis de Liane −2, avis de Boulon −1)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ _(sans repère « rangees-rate »)_ **🎲 Investigation 11** « Examiner les rangées. » → indice, ✗ → rangees-rien _(retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ « Faire luire un cristal entre les rangées. » → indice _(lance « Lueur », retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- « Les laisser où ils sont. » → **fin**

### rangees-rien

_Effet : retient « rangees-rate » pour 1 jours._

> Des sacs, des sceaux, des rangées. Tu comptes deux fois et tu perds le compte. La lumière baisse dans le grenier : il faudra revenir demain, avec des yeux frais.

- « Partir. » → **fin**

### pris

> Tu glisses un sac dans ta besace. Il est léger, bien plus léger que ta conscience.

- « Partir. » → **fin**

### vide

> Il manque un sac dans la rangée. Le trou se voit.

- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ _(sans repère « rangees-rate »)_ **🎲 Investigation 11** « Examiner les rangées. » → indice, ✗ → rangees-rien _(retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « preuve-sceau »)_ « Faire luire un cristal entre les rangées. » → indice _(lance « Lueur », retient « preuve-sceau », retient « indice-elvan », +10 XP)_
- « Partir. » → **fin**

### indice

> Entre les sacs, de la paille d’emballage de Ferros, et un éclat de cire brune : le sceau d’un marchand, une tête de cerf. Ceux de la Compagnie des Lisières en portent un. Celui-là, tu le reconnaîtras.

- « Partir. » → **fin**

## La greffière du Conseil

_Greffe du Conseil Œcuménique des Sept_

Commence par : « liste-edda » _(si repère « edda-raccompagnee »)_, sinon « accueil »

### accueil

> — Salle du Conseil Œcuménique. Sept sièges, sept nations, et un greffe. Je tiens la liste des raccompagnés : on n’y inscrit pas des criminels, seulement des noms.

- « Le Conseil siège souvent ? » → conseil
- « Au revoir. » → **fin**

### conseil

> — Quand il le faut. Il a signé une reddition, en 1861, et créé le Fonds Muet, en 2521. Pour le reste, il discute. C’est ce qu’on fait, quand on ne peut pas se battre.

- « Au revoir. » → **fin**

### liste-edda

> — Une main de plus, ce matin : « Se disant Edda Varn, de Ferros. » Raccompagnée. Personne ne l’a touchée. C’est écrit.

- « Au revoir. » → **fin**

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

- « Monter jusqu’aux cimes. » → **fin** _(fait passer 2 moments, mène à « Canopéa — La Grande Nacelle »)_

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

- « Descendre sur le quai. » → **fin** _(fait passer 2 moments, mène à « Ironheart — Les Forges-Basses »)_

## Ragna Cendrefer

_Atelier Cendrefer_

Commence par : « masques » _(si l’on porte « Plans du masque de Tam »)_ _(si quête « Le registre du Puits Trois » en cours)_, sinon « lettre » _(si l’on porte « Lettre pour Ilyane »)_ _(si quête « Les Échos sous la Forge » en cours)_, sinon « accueil-remise » _(si repère « remise-cendrefer »)_, sinon « accueil »

### accueil

> — Atelier Cendrefer ! Tu viens de Gardebois ? Alors tu as vu mon frère Tobias. Il vend toujours trop cher et parle trop fort ? Bien : il va bien.

- « Voyons tes lames. » → **fin** _(ouvre le Troc)_
- « Ton atelier : qu’as-tu de plus que ton frère ? » → forge
- « Un conseil, pour Ironheart ? » → conseil
- « Au revoir. » → **fin**

### conseil

> — Garde ton laissez-passer, ne traîne pas après le premier pont peint en rouge, et si tu entends sept coups de marteau, c’est l’heure des Litanies : on se tait. Ici, le travail est prière.

- « Merci, Ragna. » → accueil

### accueil-remise

> — Atelier Cendrefer ! Attends. Tobias m’a écrit : c’est toi qui as rendu sa caisse au petit Brann. Chez les Cendrefer, une dette se paie en prix : tu auras le même que chez lui.

- « Voyons tes lames. » → **fin** _(ouvre le Troc)_
- « Ton atelier : qu’as-tu de plus que ton frère ? » → forge
- « Un conseil, pour Ironheart ? » → conseil
- « Au revoir. » → **fin**

### forge

> — Tobias vend ce qui voyage bien. Moi, je forge ce qui pèse : un marteau des Forges-Basses, une arbalète réglée ici même, une cuirasse rivetée. Ça se paie, mais ça dure.

- « Voyons ça. » → **fin** _(ouvre le Troc)_
- « Améliorer une arme ou une armure, avec ce que j’ai récolté. » → **fin** _(ouvre l’atelier « forge »)_
- « Merci, Ragna. » → **fin**

### lettre

_Effet : reprend 1 × « Lettre pour Ilyane », retient « echos-confies », termine la quête « Les Échos sous la Forge », +40 XP._

> — Pour Ilyane, à Gardebois ? Tobias la lui portera, avec la prochaine caisse. Ragna soupèse la lettre. — Elle est lourde, pour une seule feuille.

- « Merci, Ragna. » → **fin**

### masques

_Effet : reprend 1 × « Plans du masque de Tam », retient « masques-forges », termine la quête « Le registre du Puits Trois », +50 XP._

> Ragna déplie le papier, le lit deux fois. — Du feutre, du charbon, trois lanières. Bête comme tout, et personne n’y avait pensé. Une Innovation non déclarée. Elle sourit de travers. — L’atelier est à la Compagnie des Lisières, pas à Ferros. J’en coudrai cent.

- « Merci, Ragna. » → **fin**

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

## Hesper Mille-Récits

_Doyenne des Gardiens de Mémoire_

Commence par : « fin-vendue » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « edda-reglee »)_ _(si repère « ligne-vendue »)_, sinon « fin-denonce » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « edda-reglee »)_ _(si repère « edda-raccompagnee »)_, sinon « fin-silence » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « edda-reglee »)_, sinon « page » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_, sinon « appel » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(sans repère « hesper-vue »)_, sinon « en-cours » _(si quête « Les Mémoires du Monde Perdu » en cours)_, sinon « apres » _(si quête « Les Mémoires du Monde Perdu » terminée)_, sinon « accueil »

### accueil

> Une vieille femme en cape couleur parchemin pose sa lanterne. — Un Gardien de Gardebois ? Ilyane t’a bien formé, à te voir. Repose-toi ici, et regarde le tableau : on y épingle ce qu’on nous demande.

- « Merci, Hesper. » → **fin**

### appel

_Effet : retient « hesper-vue »._

> Une vieille femme en cape couleur parchemin pose sa lanterne. — Te voilà. Ilyane m’a écrit que tu écoutais bien. À Sept-Portes, écouter ne suffit pas : il faut lire les mains. Tout ce qui passe par les Portes laisse une ligne au Registre : de qui, quand, contre combien.

_Si Liane voyage avec toi :_ Liane chuchote : — Elle a les yeux d’Ilyane, quand Ilyane cherche un mot qu’elle avait hier.

_Si Boulon voyage avec toi :_ Boulon s’incline, et le plancher grince. — On lit les mains, ici. Les miennes ne disent rien : on ne m’a jamais laissé signer.

- « Et la clé de rouille bleue ? » → cle
- « Encore une vieille qui parle par énigmes. » → appel-rude

### cle

> — La clé, je ne sais pas. Mais le carnet qu’elle ouvre a une ligne grattée, et ce qu’on gratte, quelqu’un l’a recopié un jour. Va au guichet du Registre, sur le parvis. Le Conservateur s’appelle Ambroise. Il enregistre ; il ne cherche pas. Toi, tu chercheras.

- « J’y vais. » → **fin**

### en-cours

> — Le Registre ne ment pas, et il ne dit pas vrai non plus : il dit qui. Cherche qui.

- « À plus tard. » → **fin**

### page

> — Tu l’as lue. Ça se voit : tu marches comme quelqu’un qui porte quelque chose. Une dame en gris loge aux Sept Routes, et elle cherche la même chose que toi. Va la voir, ou ne va pas la voir. Mais décide.

- « Bien. » → **fin**

### fin-vendue

_Effet : termine la quête « Les Mémoires du Monde Perdu », +60 XP, retient « piste-zephyria », avis de Liane −1._

> Hesper écoute, et sa lanterne baisse. — Tu as vendu une ligne. Ici, c’est un métier honnête. Chez les Gardiens, on transmet ; on ne vend pas. Altavent, sous les Hauts de Zephyria. Ils y seront avant toi. Alors cours.

- « Je pars pour Zephyria. » → **fin**

### fin-denonce

_Effet : termine la quête « Les Mémoires du Monde Perdu », +80 XP, retient « piste-zephyria »._

> — Raccompagnée. Personne ne l’a touchée, et elle est au cent unième kilomètre. C’est la seule justice qu’on ait ici : elle est propre, et elle est terrible. Altavent, sous les Hauts de Zephyria. La piste est à toi.

- « Je pars pour Zephyria. » → **fin**

### apres

> — Les Gardiens te gardent une chambre, ici, quand tu veux. Et le tableau a toujours besoin de bras.

- « Au revoir. » → **fin**

### fin-silence

_Effet : termine la quête « Les Mémoires du Monde Perdu », +80 XP, retient « piste-zephyria »._

> — Tu t’es tue, et elle te suivra : les routes sont longues. Altavent, sous les Hauts de Zephyria. La Porte de Zephyria ne s’ouvre qu’avec un sauf-conduit de la Confédération : il faudra le trouver.

- « Je pars pour Zephyria. » → **fin**

### appel-rude

> Hesper rit, sans se vexer. — Les vieilles parlent par énigmes parce que les jeunes n’écoutent que ça. Je recommence, plus simple : au Registre, quelqu’un ment. Trouve qui.

- « Et la clé de rouille bleue ? » → cle

## L’huissier du Conseil

_Huissier_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « retour » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_, sinon « lettre » _(si quête « L’audience » en cours)_ _(si l’on porte « Lettre d’Ilyane »)_, sinon « retour » _(si quête « L’audience » en cours)_, sinon « nouvelles » _(si quête « L’audience » pas commencée)_ _(si quête « Le Dernier Train » terminée)_, sinon « accueil »

### accueil

> Silence, s’il te plaît : là-haut, dans le grand amphithéâtre, le Conseil des Racines Profondes délibère. Les audiences se demandent par écrit, et la liste est longue, très longue.

- « De quoi parle le Conseil ? » → sujet
- **[réputation à canopee ≥ 10]** « Le Conseil accepterait-il de m’entendre ? » → estime
- « Je reviendrai. » → **fin**

### sujet

> De la frontière de l’Est, de ce que Ferros creuse sous nos racines, et de ce mal qui fait oublier. Je n’en dirai pas plus : un huissier qui parle ne reste pas huissier.

- « Merci quand même. » → **fin**

### estime

> L’huissier te regarde mieux. — Ton nom circule en bien dans les Ramures, à ce qu’on dit. Reviens quand le Conseil aura fini de délibérer : il voudra peut-être t’entendre.

- « Je reviendrai. » → **fin**

### lettre

> Une lettre au sceau des Gardiens de Mémoire de Gardebois ? L’huissier la tourne et la retourne, puis s’efface. — Le Conseil a fini de délibérer. Le Triumvirat Vert te recevra. Monte, et parle franchement : le Conseil déteste les détours.

- « Entrer dans l’amphithéâtre. » → **fin** _(mène à « Canopéa — Amphithéâtre du Conseil »)_
- « Un instant. » → **fin**

### nouvelles

> Silence, s’il te plaît : là-haut, le Conseil des Racines Profondes délibère. Les audiences se demandent par écrit, et la liste est longue, très longue.

- **[réputation à canopee ≥ 10]** « Je viens de Gardebois. J’ai vu ce que la foreuse a fait à la Gare Engloutie. » → admis _(lance la quête « L’audience »)_
- _(sans repère « huissier-liste »)_ **🎲 Diplomatie 13** « Le Conseil parle de ce mal qui fait oublier. Je l’ai vu de près, et je sais d’où il vient. » → admis, ✗ → nouvelles-liste _(lance la quête « L’audience »)_
- **🎲 Subterfuge 13** « Le Triumvirat m’attend. On a dû oublier de te prévenir. » → admis, ✗ → menteur _(lance la quête « L’audience »)_
- « Je reviendrai. » → **fin**

### nouvelles-liste

_Effet : retient « huissier-liste » pour 1 jours._

> — Tout le monde a vu ce mal de près, ces temps-ci. L’huissier trempe sa plume. — Votre nom ? Je l’inscris en bas de la liste. Repassez demain : elle aura bougé.

- « Autre chose. » → nouvelles
- « Je reviendrai. » → **fin**

### admis

> L’huissier te regarde longuement, puis s’efface. — Le Conseil a fini de délibérer. Le Triumvirat Vert te recevra. Monte, et parle franchement : le Conseil déteste les détours.

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

> Des Gardes Verts au Sol des Racines, des Voix des Arbres qui soignent le Bosquet, et d’Ironheart. Toujours Ironheart. Je n’en dirai pas plus : un huissier qui parle ne reste pas huissier.

- « Merci quand même. » → **fin**

## Ilyane Voix-d’Écorce

_Gardienne de Mémoire de Gardebois_

Commence par : « echo-lettre » _(si repère « echos-confies »)_ _(sans repère « ilyane-echo-lu »)_, sinon « carnet » _(si quête « Le carnet de chansons » en cours)_ _(si l’on porte « Carnet de chansons d’Ilyane »)_, sinon « appel-veilleuse » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-veilleuse »)_, sinon « appel-archives » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-archives »)_, sinon « appel-vendue » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-vendue »)_, sinon « appel-sept-portes » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_, sinon « oubli-3 » _(si repère « porte-sud-connue »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « oubli-2 » _(si quête « L’audience » terminée)_ _(sans repère « ilyane-oubli-2 »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « remarque-enfant » _(si repère « heros-enfant »)_ _(sans repère « ilyane-remarque-enfant »)_, sinon « remarque-vapeur » _(si repère « heros-fragment-vapeur »)_ _(sans repère « ilyane-remarque-vapeur »)_, sinon « remarque-main » _(si repère « heros-fragment-main »)_ _(sans repère « ilyane-remarque-main »)_, sinon « remarque-voix » _(si repère « heros-fragment-voix »)_ _(sans repère « ilyane-remarque-voix »)_, sinon « nouvelles-canopee » _(si quête « L’audience » terminée)_, sinon « pell-vivant » _(si repère « foreuse-explosee »)_ _(si repère « pell-sauve »)_ _(sans repère « ilyane-sait-pell »)_, sinon « pell » _(si repère « foreuse-explosee »)_ _(sans repère « ilyane-sait-pell »)_, sinon « oubli-1 » _(si quête « L’audience » en cours)_ _(sans repère « ilyane-oubli-1 »)_ _(sans repère « ilyane-oubli-2 »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « resolu » _(si quête « Le Dernier Train » terminée)_, sinon « en-cours » _(si quête « Le Dernier Train » en cours)_, sinon « accueil »

### resolu

> Depuis que la foreuse s’est tue, plus personne ne revit la Grande Chute. Tu as bien fait. Mais dis-moi : qui a payé cette prospection, à ton avis ? Les Réveilleurs, peut-être. Reste sur tes gardes.

_Si Liane voyage avec toi :_ Liane, à mi-voix : — Les Réveilleurs. On dit ça comme on dit l’orage. Personne ne leur a jamais vu la figure.

- _(si quête « L’audience » pas commencée)_ _(si quête « Le Dernier Train » terminée)_ « Et maintenant ? » → lettre _(donne 1 × « Lettre d’Ilyane », lance la quête « L’audience »)_
- « Je resterai sur mes gardes. » → **fin**

### accueil

> Te voilà. Les Gardiens de Mémoire m’ont annoncé ta venue. Bienvenue au Marché des Lisières, même si le moment est mal choisi pour un apprentissage tranquille.

- « Que se passe-t-il ? » → trouble
- « Je reviendrai plus tard. » → **fin**

### trouble

> Depuis trois nuits, des gens du marché revivent la Grande Chute en plein jour : des villes qui brûlent, des sirènes éteintes depuis trois mille ans. Hier, on a repêché un vieux passeur au fond du lavoir, dans un pied d’eau. Il fuyait un feu.

- **[Perception 4]** « Tes mains tremblent, Ilyane. Toi aussi, tu les vois. » → atteinte _(retient « ilyane-atteinte », +10 XP)_
- « D’où vient ce mal ? » → cause
- « Je reviendrai plus tard. » → **fin**

### atteinte

> Tu as de bons yeux. Ce matin, j’étais sur le quai d’une gare. J’ai vu partir un train plein d’enfants qui agitaient la main. Je n’ai jamais vu de train de l’Ancien Monde. Ce souvenir n’est pas le mien.

- « Que puis-je faire ? » → cause

### cause

> Une maladie mémorielle. Les anciens textes le disent : quand on abîme un Écho du Passé, la mémoire du lieu déborde sur les vivants. Or, à l’est, des prospecteurs de Ferros fouillent la Gare Engloutie, là où l’une des Trois Failles vient de s’ouvrir.

- _(sans repère « loi-oubliee »)_ **🎲 Érudition 10** « La loi de la Mémoire Vivante : un Écho qu’on déchire se multiplie. » → savant, ✗ → cause-oubli _(+10 XP)_
- « Pourquoi ne pas prévenir la garde ? » → garde
- « J’irai voir ce qui se passe à la Gare. » → mission

### cause-oubli

_Effet : retient « loi-oubliee »._

> Tu cherches la loi dans tes leçons. Elle t’échappe, à un mot près. Ilyane attend, puis sourit sans joie. — Tu la retrouveras. Les Gardiens oublient aussi, ces temps-ci.

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

> Les visions passent comme des nuages. Je tiendrai. Le marché a besoin de quelqu’un qui garde la tête froide, et toi, tu as une gare à écouter.

- « Je reviens vite. » → **fin**

### lettre

> Ilyane écrit longtemps, puis scelle la lettre d’une goutte de cire verte. — Porte-la au Conseil des Racines Profondes, à Canopéa. Là-haut, on ne m’écoute plus beaucoup. On m’écoutera peut-être à travers toi.

- « J’irai à Canopéa. » → **fin**

### nouvelles-canopee

> Mirelle m’a écrit par le courrier des Nacelliers : tu as parlé devant le Triumvirat Vert ! Et maintenant, Ironheart, et les Marches des Cendres. Prends garde à toi. Là-bas, on vend tout, même les souvenirs.

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

### pell

_Effet : retient « ilyane-sait-pell »._

> Ilyane ne te regarde pas tout de suite. — Le vent a porté la fumée jusqu’ici. Un garçon de Ferros est mort, à la Gare. La maladie recule ; personne ne revit plus la Chute. Mais lui, personne ne le revivra. Un Gardien se souvient aussi de ce qu’il a coûté.

_Si Liane voyage avec toi :_ Liane baisse les yeux. Ses doigts cherchent quelque chose dans sa poche, le trouvent, puis le lâchent.

- « Je m’en souviendrai. » → resolu

### appel-sept-portes

> Ilyane te tend une lettre cachetée de cire grise. — Hesper Mille-Récits, la doyenne des Gardiens, à Sept-Portes. Elle écrit : « Tout ce qui passe par Sept-Portes laisse une main au Registre. La clé a une chaîne. Envoie-moi ton Gardien. »

- « J’irai à Sept-Portes. » → porte-sud _(lance la quête « Les Mémoires du Monde Perdu », retient « porte-sud-connue »)_

### porte-sud

> — Prends la route de l’est, au-delà de la forêt : la Porte du sud ne se ferme jamais. De l’autre côté, personne ne pourra lever la main sur toi. Ce n’est pas la même chose que d’être en sécurité.

- « Merci, Ilyane. » → **fin**

### pell-vivant

_Effet : retient « ilyane-sait-pell »._

> Ilyane ne te regarde pas tout de suite. — Le vent a porté la fumée jusqu’ici. Un garçon de Ferros a brûlé, à la Gare ; il vivra, sans ses mains. La maladie recule. Un Gardien se souvient aussi de ce qu’il a coûté.

- « Je m’en souviendrai. » → resolu

### appel-vendue

> Ilyane te tend une lettre cachetée de cire grise, d’une main qui tremble. — Hesper, de Sept-Portes : « La clé est passée par le Marché des Cendres, puis entre des gants fins. Sa main est au Registre depuis trois jours. Envoie-moi ton Gardien, vite. »

- « J’irai à Sept-Portes. » → porte-sud _(lance la quête « Les Mémoires du Monde Perdu », retient « porte-sud-connue »)_

### appel-archives

> Ilyane te tend une lettre cachetée de cire grise. — Hesper, de Sept-Portes : « Ferros a classé la clé au Fonds Zéro. Mais ce qu’on classe, on le recopie : une copie de sa chaîne est arrivée au Registre, et quelqu’un l’a déjà lue. Envoie-moi ton Gardien. »

- « J’irai à Sept-Portes. » → porte-sud _(lance la quête « Les Mémoires du Monde Perdu », retient « porte-sud-connue »)_

### appel-veilleuse

> Ilyane te tend une lettre cachetée de cire grise. — Hesper, de Sept-Portes : « La clé chante encore sur la ligne de la Veilleuse, tant mieux. Mais une dame en gris a demandé sa chaîne au Registre. Elle viendra la chercher. Envoie-moi ton Gardien. »

- « J’irai à Sept-Portes. » → porte-sud _(lance la quête « Les Mémoires du Monde Perdu », retient « porte-sud-connue »)_

### oubli-1

_Effet : retient « ilyane-oubli-1 »._

> Ilyane feuillette son carnet et s’arrête sur une page. — Cette chanson-là, c’est ma main. Je ne sais plus l’air. … Depuis le quai, de petites choses s’en vont. Ce n’est rien.

_Si Liane voyage avec toi :_ Liane, tout bas : — Ça commence comme ça, chez mes malades. Par les chansons.

- « La maladie des souvenirs, Ilyane ? » → oubli-1-suite
- « Je reviendrai. » → **fin**

### oubli-1-suite

> — Peut-être. J’ai regardé ce train plus longtemps que les autres, sur le quai. Ne le dis pas aux Gardiens de Canopéa : ils m’enverraient me reposer, et je n’ai pas le temps.

- « Je ne dirai rien. » → **fin**

### oubli-2

_Effet : retient « ilyane-oubli-2 »._

> Ilyane cherche un nom, les doigts posés sur la table. — Celle qui tient le relais de Canopéa… mon ancienne apprentie, des mains de graveuse. Elle t’a reçu·e. Comment s’appelle-t-elle, déjà ?

- « Mirelle. » → oubli-2-nom
- « Ça te reviendra. » → oubli-2-attente

### oubli-2-nom

> — Mirelle. Bien sûr. Mirelle. Elle l’écrit dans la marge de son carnet, deux fois, et souligne. — Merci. Ne le répète à personne.

- « … » → **fin**

### oubli-2-attente

> — Non. Ça ne revient pas. Ça, au moins, je l’ai appris. Elle referme le carnet, doucement, comme on ferme une porte sur quelqu’un qui dort.

- « … » → **fin**

### oubli-3

_Effet : retient « ilyane-oubli-3 »._

> Ilyane lève les yeux et te sourit, du sourire poli qu’on fait aux voyageurs. — Bienvenue au relais. Vous venez de loin ? … Puis son visage se défait. — Toi. Pardon. Une seconde, j’ai… Assieds-toi.

_Si Liane voyage avec toi :_ Liane détourne les yeux, la mâchoire serrée.

_Si Boulon voyage avec toi :_ Boulon, très bas : — Je peux retenir pour elle. Je retiens bien. Il suffit qu’elle me demande.

- « Combien de temps, Ilyane ? » → oubli-3-temps
- « Bientôt, tu oublieras pourquoi tu m’as envoyé·e là-bas. » → oubli-3-cruel _(avis de Liane −1)_
- _(si repère « heros-enfant »)_ « Moi, des choses me reviennent, ces temps-ci. » → oubli-3-miroir
- « Je suis là. » → **fin**

### oubli-3-temps

> — Je ne sais pas. Moins que je voudrais. Écris-moi, depuis Sept-Portes. Et écris ton nom en haut de chaque lettre. Toujours.

- « Toujours. » → **fin**

### oubli-3-cruel

> Ilyane te regarde longtemps. — Peut-être. Alors tu me le rappelleras. Ou tu ne le feras pas, et ce jour-là, ce sera ton choix, plus ma maladie.

- « … » → **fin**

### remarque-enfant

_Effet : retient « ilyane-remarque-enfant »._

> Ilyane lève les yeux de son carnet. — Tu es pâle. Les Échos t’ont parlé ? À moi, ils ne parlent plus.

- « Un enfant m’a regardé·e. » → remarque-enfant-2
- « Rien. » → **fin**

### remarque-vapeur

_Effet : retient « ilyane-remarque-vapeur »._

> Ilyane pose la bouilloire sur le feu, puis s’arrête. — Tu la regardes comme si elle allait partir sans toi.

- « Je ne sais pas pourquoi. » → **fin**
- « Ce n’est rien. » → **fin**

### remarque-main

_Effet : retient « ilyane-remarque-main »._

> — Sylvan dit que tu serres le poing en dormant. Ilyane regarde ta main. — Sur quoi ?

- « Sur une main. » → **fin**
- « Sur rien. » → **fin**

### remarque-voix

_Effet : retient « ilyane-remarque-voix »._

> Ilyane compte les plis du relais à mi-voix, s’arrête à six, et perd le fil. — Sept, dis-tu sans y penser. Elle lève les yeux. — Comment le savais-tu ?

- « Je ne sais pas. » → **fin**

### remarque-enfant-2

> — Les Échos ne regardent personne : ils rejouent. Si l’un d’eux t’a regardé·e, c’est qu’il te connaissait.

- « Je ne le connais pas. » → **fin**

### oubli-3-miroir

> Ilyane te regarde longtemps, comme on relit une page. — Toi, tu reprends ce que je perds. C’est peut-être juste.

- « Je te le rendrai. » → **fin**
- « Ne dis pas ça. » → **fin**

## Ingrid Brisefer

_Ingénieure, prospection de Ferros_

Commence par : « apres-explosion-pell » _(si repère « foreuse-explosee »)_ _(si repère « pell-sauve »)_, sinon « apres-explosion » _(si repère « foreuse-explosee »)_, sinon « apres-sabotage » _(si repère « foreuse-sabotee »)_, sinon « apres-golem-trahie » _(si repère « golem-vaincu »)_ _(si repère « golem-attaque-apres »)_, sinon « apres-golem » _(si repère « golem-vaincu »)_, sinon « apres » _(si quête « Le Dernier Train » terminée)_, sinon « soupcon » _(si repère « surpris-de-nuit »)_, sinon « barriere » _(si quête « Le Dernier Train » en cours)_ _(sans repère « laissez-passer »)_, sinon « accueil »

### accueil

> Chantier privé, prospection pour le compte de Ferros. Qu’est-ce que les Gardiens de Mémoire viennent encore nous reprocher ?

_Si Liane voyage avec toi :_ Liane ne regarde pas l’ingénieure : elle regarde les déblais, derrière la tente. — C’est là. Ne lui dis pas qui je suis. Pas encore.

- « Ce chantier rend les gens malades, à Gardebois. » → cause
- _(si Liane suit le héros)_ _(sans repère « ingrid-sait-saule »)_ « Laisser parler Liane. » → saule
- _(sans repère « gris-ingrid »)_ « Qui paie vos papiers ? » → papiers
- « Je viens juste regarder. » → **fin**

### soupcon

> Alors c’est vous, l’ombre qui rôdait autour de ma foreuse cette nuit ? Mes gardes veillent, maintenant. Si vous avez quelque chose à me dire, dites-le en face.

- « Ce chantier rend les gens malades, à Gardebois. » → cause
- « Je n’ai rien à vous dire. » → **fin**

### cause

> La maladie mémorielle ? On en a entendu parler. Mais la Faille vaut de l’or en cristaux, et j’ai des papiers signés. Je ne m’arrête pas pour une rumeur de marché.

_Si Liane voyage avec toi :_ Liane, entre ses dents : — Une rumeur de marché. Mes malades tremblent toute la nuit, Brisefer. Et sous vos déblais, il y a un enfant que personne n’a compté.

- _(si quête « Le Dernier Train » en cours)_ _(sans repère « ingrid-braquee »)_ **🎲 Diplomatie 12** « Arrêtez le forage : à chaque coup, l’Écho se multiplie, et le mal avec lui. » → resiste, ✗ → cause-braquee
- _(si quête « Le Dernier Train » en cours)_ _(sans repère « ingrid-moquee »)_ **🎲 Commandement 12** « Je parle au nom des Gardiens de Mémoire : cessez, maintenant. » → resiste-ordre, ✗ → ordre-rire
- _(si quête « Le Dernier Train » en cours)_ « Lui raconter une histoire. » → recit-refus 📖 raconter un Récit : savant-corvan → convaincue-quai ; corvan → convaincue-recit ; autres → recit-refus
- « Je reviendrai. » → **fin**

### ordre-rire

_Effet : retient « ingrid-moquee »._

> Ingrid rit, et deux ouvriers rient avec elle. — Cessez ? Vous avez quel âge ? Allez jouer ailleurs, apprenti·e. Les Gardiens écoutent ; ils ne commandent pas.

- « Autre chose, alors. » → cause
- « Je reviendrai. » → **fin**

### cause-braquee

_Effet : retient « ingrid-braquee »._

> — Encore un Gardien qui prêche. Ingrid se détourne vers la foreuse. — Revenez avec autre chose qu’un sermon, ou ne revenez pas.

- « Autre chose, alors. » → cause
- « Je reviendrai. » → **fin**

### convaincue

_Effet : retient « chantier-arrete », retient « ingrid-rapport », termine la quête « Le Dernier Train », +80 XP, +30 Fers._

> Ingrid se tait longtemps, puis plie ses papiers en quatre. — J’écrirai à Ferros que la Faille est instable. C’est peut-être même vrai. J’arrête la foreuse. Dites à vos Gardiens que Ferros reviendra, avec ou sans moi.

- « Merci. » → **fin**

### convaincue-recit

_Effet : retient « chantier-arrete », termine la quête « Le Dernier Train », +90 XP, +30 Fers._

> — Corvan ? Je connais l’histoire, oui, et vous avez raison : il a réussi, et ça ne l’a pas sauvé. J’arrête la foreuse. On ne commet pas deux fois la même faute.

- « Merci. » → **fin**

### apres-sabotage

> Quelqu’un a faussé ma foreuse, cette nuit. Ferros m’enverra des pièces, dans des semaines. D’ici là, je ne creuse plus. Et personne n’a plus revu de train, à Gardebois, paraît-il.

- « Tant mieux. » → **fin**

### apres

> La foreuse est silencieuse, pour l’instant. Mes ouvriers n’aiment pas ça, mais personne n’a plus revu de train, à Gardebois.

- « Tant mieux. » → **fin**

### barriere

> Un contremaître en gilet de cuir te barre la route avant la tente de l’ingénieure. — Chantier privé. Sans laissez-passer de la Compagnie des Lisières, on ne passe pas le jour. Reviens avec un papier.

- « Où trouver un laissez-passer ? » → barriere-ou
- « Pousse-toi, ou je passe à travers toi. » → barriere-dur
- « Partir. » → **fin**

### barriere-ou

> — Au Marché des Lisières, chez les Cendrefer. Tobias en a toujours un dans sa manche, à son prix. Et ne traîne pas ici la nuit : le chantier dort, mais la lanterne veille.

- « Partir. » → **fin**

### apres-explosion

> Ingrid a les mains bandées et les yeux secs. — Pell. Vingt-deux ans. Il gardait la lanterne parce qu’il avait peur du noir. On l’a enterré ce matin, au bord du quai. La foreuse ne creusera plus. Si j’apprends qui a fait ça…

_Si Liane voyage avec toi :_ Liane regarde Ingrid longtemps, sans haine. — Maintenant, tu sais ce que c’est. Ça ne me console pas. Je croyais que ça me consolerait.

- « Je suis désolé·e. » → **fin**
- « Il ne fallait pas creuser ici. » → explosion-dur

### explosion-dur

> — Peut-être. La Faille rendait les gens malades, je le sais, maintenant. Mais ce n’est pas la Faille qui a tué Pell.

- « … » → **fin**

### apres-explosion-pell

> Ingrid a les mains bandées et les yeux secs. — Pell vit. Vingt-deux ans, et plus de mains pour tenir une lanterne. On dit qu’une ombre est revenue le chercher dans le feu. La même qui l’y avait mis, je suppose.

- « … » → **fin**

### saule

_Effet : retient « ingrid-sait-saule »._

> Liane s’avance. — Saule Sève-Claire. Il jouait sur les déblais de votre premier sondage, au printemps. Le talus a cédé. Vous ne savez même pas son nom. Ingrid ne baisse pas les yeux. — On m’a dit qu’un enfant jouait là où il ne fallait pas.

- « Et vous l’avez cru. » → saule-dur
- « Laisser le silence parler. » → saule-silence

### saule-dur

> — On m’a dit beaucoup de choses, ce printemps-là. Je n’ai rien vérifié : le sondage était en retard. Elle se tourne vers Liane. — Je ne vous demanderai pas pardon. Ça ne servirait qu’à moi.

- « Et la maladie, à Gardebois ? » → cause
- « Partir. » → **fin**

### saule-silence

_Effet : avis de Liane +1._

> Le silence dure. Le vent fait claquer la toile de la tente. Enfin, Ingrid enlève son gant, et le remet. — Saule, répète-t-elle. Je l’écrirai dans le cahier de chantier. C’est tout ce que je sais faire.

- « Et la maladie, à Gardebois ? » → cause
- « Partir. » → **fin**

### papiers

_Effet : retient « gris-ingrid »._

> Ingrid tapote une liasse sous son bras. — Ferros signe. Mais c’est une courtière qui paie, d’avance, en Fers tout neufs : une dame en gris, gants fins. Elle ne laisse pas de nom. Elle laisse toujours un peu plus que ce qu’on demande.

_Si Liane voyage avec toi :_ Liane, tout bas : — Quelqu’un qui paie plus qu’on ne demande achète autre chose que ce qu’elle dit.

- « Ce chantier rend les gens malades, à Gardebois. » → cause
- « Partir. » → **fin**

### barriere-dur

> Le contremaître ne bouge pas d’un pouce. Derrière lui, deux ouvriers posent leurs pelles pour mieux te regarder. — Essaie. Le chantier manque de remblai.

- « Partir. » → **fin**

### resiste

> — Un Écho qui se multiplie ? Prouvez-le. Mes ouvriers dorment à poings fermés, eux.

- _(sans repère « ingrid-preuve-ratee »)_ **🎲 Investigation 10** « Ils dorment, oui. Ils ne rêvent plus. Demandez-leur ce qu’ils ont fait hier. » → resiste-2, ✗ → resiste-rate
- _(si repère « liane-malades-vus »)_ « Les malades de Liane, à Gardebois : venez les entendre une nuit. » → resiste-2
- _(si repère « ingrid-sait-saule »)_ « Saule Sève-Claire, lui, ne rêve plus du tout. » → resiste-2
- « Je n’ai pas de preuve. Pas encore. » → **fin**

### resiste-rate

_Effet : retient « ingrid-preuve-ratee »._

> Tu cherches les mots, et les ouvriers haussent les épaules. — Des ouvriers fatigués, dit Ingrid. Vous en avez d’autres, des preuves ?

- « Peut-être. » → resiste
- « Pas encore. » → **fin**

### resiste-2

> Ingrid regarde la foreuse un long moment. — Admettons. Et si j’arrête ? Ferros envoie un autre ingénieur dans un mois, sans mes scrupules, et il creusera deux fois plus vite.

- _(sans repère « ingrid-refuse-lettre »)_ **🎲 Diplomatie 12** « Alors écrivez à Ferros que la Faille est instable. Vous, ils vous croiront. » → convaincue, ✗ → resiste-2-rate
- « Un mois de répit, c’est un mois de malades en moins. » → resiste-mois
- « Je reviendrai. » → **fin**

### resiste-2-rate

_Effet : retient « ingrid-refuse-lettre »._

> — Mentir à Ferros, sur votre parole ? Ingrid replie ses papiers. — Non. Si je dois perdre ma place, ce sera pour une raison que je comprends.

- « Un mois de répit, c’est un mois de malades en moins. » → resiste-mois
- « Je reviendrai. » → **fin**

### resiste-mois

> — Un mois de répit, et je perds ma place. Vos malades dormiront ; moi, je n’aurai plus de quoi manger. Trouvez mieux.

- « Je reviendrai. » → **fin**

### resiste-ordre

> — Au nom des Gardiens ? Les Gardiens n’ont ni garde, ni loi, ni foreuse. Moi, j’ai les trois.

- _(sans repère « ingrid-defie »)_ **🎲 Commandement 12** « Gardebois a une garde, et la frontière a des yeux. Je peux les tourner vers vous. » → convaincue-peur, ✗ → ordre-defi
- « Je reviendrai. » → **fin**

### ordre-defi

_Effet : retient « ingrid-defie »._

> — Tournez-les. Ingrid ne cille pas. — J’ai des papiers de Ferros. Votre garde les lira, et elle saluera.

- « Je reviendrai. » → **fin**

### convaincue-peur

_Effet : retient « chantier-arrete », retient « ingrid-rancune », avis de Liane −1, termine la quête « Le Dernier Train », +60 XP, +50 Fers._

> Ingrid te dévisage, et ses lèvres blanchissent. — Très bien. J’arrête. Elle te lance une bourse. — Pour votre garde. Qu’elle regarde ailleurs, le jour où Ferros reviendra.

- « … » → **fin**

### convaincue-quai

_Effet : retient « chantier-arrete », termine la quête « Le Dernier Train », +90 XP, +30 Fers._

> Ingrid écoute, les yeux sur la foreuse. — « Même réussir peut tout détruire. » Il savait de quoi il parlait, celui-là. Bien. J’arrête. Pour lui ; pas pour vos Gardiens.

- « Merci. » → **fin**

### recit-refus

> — Une belle histoire. Elle ne me dit pas pourquoi j’arrêterais.

- « Revenir à la maladie. » → cause
- « Partir. » → **fin**

### apres-golem

> — Vous avez abattu mon gardien. Ce Golem ne gardait pas seulement la Faille : son cœur de cristal tenait la foreuse sous tension. Sans lui, la machine est morte. Ferros m’enverra un autre cœur. Dans des mois.

- « Tant mieux. » → **fin**

### apres-golem-trahie

> — Je vous avais prévenu·e. J’ai arrêté ce chantier sur votre parole, et vous m’avez pris le seul gardien de la Faille. Ferros ne m’enverra pas d’autre cœur pour un chantier mort. Si elle s’ouvre, ce sera sur vous.

- « Il n’avait plus rien à garder. » → **fin**
- « Je sais. » → **fin**

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
- _(sans repère « joss-ferme-parole »)_ **🎲 Diplomatie 12** « Je ne suis pas du Bureau. Dis-moi ce qui te tient. » → aveu, ✗ → soupcon-ferme
- _(sans repère « joss-ferme-ordre »)_ **🎲 Commandement 12** « Parle-moi, ou tu parleras au contrôleur. » → aveu, ✗ → soupcon-menace
- « Je reviendrai. » → **fin**

### soupcon-menace

_Effet : retient « joss-ferme-ordre »._

> Joss rit, d’un rire sec. — Le contrôleur ? Il dîne chez Varka le jeudi. Va le chercher, toi.

- « Je reviendrai. » → **fin**

### soupcon-ferme

_Effet : retient « joss-ferme-parole »._

> — Tous ceux qui ne sont pas du Bureau disent ça. Joss lève sa lanterne entre vous deux. — Va-t’en.

- « Je reviendrai. » → **fin**

### aveu

_Effet : retient « joss-avoue », +15 XP._

> Il s’assoit sur un rail. — Ma dette. Les Marches l’ont rachetée au prêteur. « Laisse le levier ouvert les nuits de minerai, et ta dette fond. » Une machine vient seule, attelle les wagons, et part par l’embranchement, vers la vieille Cendrière.

_Si Boulon voyage avec toi :_ Boulon pose une main sur l’épaule de Joss, très doucement pour une main de fer. — Une dette, ça se porte. Pas tout seul.

_Si Liane voyage avec toi :_ Liane s’accroupit près de Joss. — Tu ne dors plus depuis quand ? Ça se voit. Ça se soigne, aussi.

- « Personne n’est blessé ? » → personne
- « Tu as vendu les tiens pour une dette. Dors mal, Joss. » → aveu-cruel _(avis de Liane −1, avis de Boulon −1)_
- « Merci, Joss. » → **fin**

### personne

> — Personne. Seulement le minerai, et la confiance. Varka m’appelle son frère. Je ne dors plus.

- _(sans repère « joss-sommeil »)_ _(sans repère « joss-sommeil-rate »)_ **🎲 Médecine 12** « Je peux te donner de quoi dormir. » → sommeil, ✗ → sommeil-rate
- « Merci, Joss. » → **fin**

### sommeil-rate

_Effet : retient « joss-sommeil-rate »._

> Tu lui décris les herbes, les doses, l’heure. Il t’écoute à peine. — Ce qui m’empêche de dormir ne s’avale pas.

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

### sommeil

_Effet : retient « joss-sommeil », +10 XP._

> Tu lui dis quelles herbes, combien, à quelle heure. Il écoute sans t’interrompre, les yeux baissés. — Dormir. Si je dors, je rêve du levier. Mais merci.

- « Bonne nuit, Joss. » → **fin**

### aveu-cruel

> Joss ne répond pas. Il serre sa lanterne jusqu’à ce que ses jointures blanchissent. — Je dors mal. Tu peux partir tranquille.

- « … » → **fin**

## Olmo Sept-Routes

_Aubergiste des Sept Routes_

Commence par : « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Un homme rond, au foulard de six couleurs. — Auberge des Sept Routes ! J’ai fait trois fois le tour du monde et je suis revenu ici trois fois : c’est le seul endroit où personne ne se bat pour la dernière chaise.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « sept-routes »)_
- « Au revoir. » → **fin**

### accueil-2

> — Sept Routes ! Ce matin, une caravane de la Communion a passé sa Porte avec un chameau de trop. Le contrôleur l’a enregistré, et le chameau dort dans ma cour.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « sept-routes »)_
- « Au revoir. » → **fin**

### accueil-3

> — Sept Routes ! Les Éprouveurs ont encore essayé de se frapper sur la place, ce matin. La main s’arrête toujours. Ils notent quand même.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « sept-routes »)_
- « Au revoir. » → **fin**

### nouvelles

> — Une dame en gris, de Ferros, loue la chambre du fond depuis trois jours. Elle boit du thé, ne parle à personne, et paie en Fers tout neufs, frappés de l’année.

- « Merci. » → accueil

### servir

> — Une soupe des six pays, ou une chambre ? Je prends les Fers, les Feuilles et les sourires. Les sourires, à moitié prix.

- **[8 Fers]** « Une soupe des six pays. » → repas _(−8 Fers, +15 PV)_
- **[12 Fers]** « Une chambre jusqu’au matin. » → dodo _(−12 Fers, dort jusqu’au matin)_
- **[12 Fers]** « Une chambre jusqu’à la nuit. » → dodo _(−12 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### repas

> Une soupe où flottent des herbes de Verdantis, du poivre de la Communion et un poisson de Marisol. Ça ne devrait pas aller ensemble. Ça va.

- « Merci, Olmo. » → accueil

### dodo

> Une chambre étroite qui donne sur la place. Toute la nuit, les Portes bourdonnent doucement. Tu dors comme jamais.

- « Se lever. » → **fin**

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

_Si Liane voyage avec toi :_ Liane, au fond des gradins, serre sa besace contre elle. Elle n’a pas dit le nom de son frère. Personne ne l’a demandé.

- « Les papiers venaient de Ferros. Mais qui payait ? » → lyra

### lyra

> Lyra Cœur-de-Sève, la Première Racine, lève la main. — Doucement, Gardien. Quatre parts sur dix de notre commerce passent par Ferros. Fermer la frontière sur une rumeur, c’est affamer Gardebois. Il nous faut des preuves.

- « Et ce mal qui fait oublier ? » → thalorin

### thalorin

> Au centre, l’Ancien Thalorin n’a pas bougé. Sa voix ressemble au vent dans les feuilles. — Ce mal n’est pas seulement à Gardebois. Depuis peu, les noms gravés du Bosquet des Échos se taisent. On pose la main, et le bois reste froid.

- « Je peux chercher pourquoi. » → mission _(retient « audience-tenue », +20 XP)_

### mission

> Kael hoche la tête. — Alors cherche. Le Triumvirat t’ouvre le Bosquet et, s’il le faut, le Sol des Racines : Véline te descendra. Rapporte des faits. Le dernier qui a menti à ce Conseil plante encore des glands à la frontière.

- « J’y vais. » → **fin**

### attente

> Kael lève les yeux de ses cartes. — Alors ? Ce qui fait taire les noms du Bosquet. Des faits. Les rumeurs, j’en ai plein les Ramures.

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

> Lyra pâlit. — Une clé de l’Ancien Monde. Les Archives de Ferros en parlent à mi-voix depuis des années. Si les Marches la cherchent jusque sous nos racines, c’est qu’elle compte plus que tout le reste.

- « Que va faire le Conseil ? » → choix

### choix

> Kael veut fermer la frontière aux prospecteurs ; Lyra veut garder le commerce et surveiller les chantiers. Tous deux se tournent vers toi. — Tu étais en bas. Que conseilles-tu ?

- « Fermez la frontière aux prospecteurs. » → fin-frontiere _(retient « conseil-frontiere »)_
- « Gardez le commerce, mais surveillez chaque chantier. » → fin-commerce _(retient « conseil-commerce »)_
- **🎲 Diplomatie 13** « Le sol est sacré, la route ne l’est pas : fermez l’un, gardez l’autre. » → fin-accord, ✗ → choix-rate _(retient « conseil-accord », +15 XP)_

### choix-rate

> Kael hausse un sourcil ; Lyra sourit à peine. — Un compromis de Gardien, dit Kael. Joli. Mais un Conseil tranche, et c’est toi qu’on écoute : l’un ou l’autre.

- « Fermez la frontière aux prospecteurs. » → fin-frontiere _(retient « conseil-frontiere »)_
- « Gardez le commerce, mais surveillez chaque chantier. » → fin-commerce _(retient « conseil-commerce »)_

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

Commence par : « plaque » _(si quête « Ce qui se souvient » en cours)_ _(si l’on porte « Plaque émaillée »)_, sinon « offre » _(si l’on porte « Clé de rouille bleue »)_, sinon « apres-vente » _(si repère « cle-vendue »)_, sinon « apres » _(si quête « La Clé de Rouille Bleue » terminée)_, sinon « retour » _(si repère « kaelis-parle »)_, sinon « accueil-garrik » _(si repère « fouille-elucidee »)_, sinon « accueil »

### accueil

> Un homme maigre polit une mâchoire de Golem sous une lampe à huile. Autour de lui, des os de bêtes polis, des dents de loup en colliers. — Les os se souviennent mieux que les vivants, et ils ne marchandent jamais. Pose ta question, si c’est la bonne.

_Si Boulon voyage avec toi :_ Boulon regarde les os polis, les dents en colliers. — Il vend ce qui portait. Comme on m’aurait vendu, moi.

- « Je cherche la clé de rouille bleue. » → mauvaise
- **[Mémoire 3]** « Pourquoi certaines reliques se souviennent-elles des morts ? » → bonne
- _(si Récit « Les voix du Bosquet » connu)_ « Au Bosquet des Échos, le bois garde la main de qui a gravé. Et tes os ? » → bonne
- « Et toi, de quoi te souviens-tu ? » → refus

### mauvaise

> Kaelis sourit sans montrer les dents. — Tout le monde la cherche. Ce n’est pas la bonne question.

- « Essayer autre chose. » → accueil
- « Les os ne marchandent pas, as-tu dit. Toi, combien, la réponse ? » → prix
- _(si quête « Ce qui se souvient » pas commencée)_ _(sans repère « membre-archives-ferros »)_ _(sans repère « membre-travailleurs-rail »)_ « Les Marches prennent-elles des fournisseurs ? » → fournisseur
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
- _(sans repère « gris-kaelis »)_ « Pour qui l’achètes-tu ? » → acheteuse
- « J’y réfléchirai. » → **fin**

### ouvre

> — Une archive. Celle du dernier train : ce qu’il emportait, ce qu’il a laissé en route. Les Archives Centrales en gardent le coffre. Nous, nous avons les acheteurs.

- « Je vois. » → **fin**

### retour

> — Alors, cette Veilleuse ? Cent Fers, toujours. Je ne change jamais un prix.

- « Qu’ouvre-t-elle, déjà ? » → ouvre
- _(si quête « Ce qui se souvient » pas commencée)_ _(sans repère « membre-archives-ferros »)_ _(sans repère « membre-travailleurs-rail »)_ « Les Marches prennent-elles des fournisseurs ? » → fournisseur
- « À plus tard. » → **fin**

### offre

> — Elle est là, dans ta poche. Je l’entends rouiller d’ici. Cent Fers, et l’on n’en parle plus.

_Si Liane voyage avec toi :_ Liane recule d’un pas. — Si tu la lui vends, je rentre à Gardebois. Je te le dis avant, pour que tu saches.

_Si Boulon voyage avec toi :_ Boulon se place entre toi et le comptoir. — Une archive vivante ne se vend pas. C’est toi qui l’as dit, chez Noam. Je l’ai retenu.

- « La lui vendre, pour cent Fers. » → vendue _(reprend 1 × « Clé de rouille bleue », +100 Fers, retient « cle-vendue », termine la quête « La Clé de Rouille Bleue », +60 XP, avis de Boulon −2, avis de Liane −1)_
- « Qu’ouvre-t-elle ? » → ouvre
- « Cent Fers. Tu paies les souvenirs au prix des os. » → offre-ironie
- « Non, pas à toi. » → **fin**

### vendue

> Kaelis fait disparaître la clé dans un coffret doublé de velours noir. — Les Marches te remercient. Si un jour tu as quelque chose à vendre, même un souvenir, tu sais où me trouver.

- « Au revoir. » → **fin**

### apres-vente

> — Les acheteurs sont contents. Toi aussi, j’espère.

- _(si quête « Ce qui se souvient » pas commencée)_ _(sans repère « membre-archives-ferros »)_ _(sans repère « membre-travailleurs-rail »)_ « Les Marches prennent-elles des fournisseurs ? » → fournisseur
- « Au revoir. » → **fin**

### apres

> — Tu as choisi de ne pas me la vendre, à ce qu’on dit. Dommage. Les Marches n’oublient pas, mais elles ne se fâchent pas longtemps.

- _(si quête « Ce qui se souvient » pas commencée)_ _(sans repère « membre-archives-ferros »)_ _(sans repère « membre-travailleurs-rail »)_ « Les Marches prennent-elles des fournisseurs ? » → fournisseur
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

> Kaelis polit une mâchoire de Golem et lève à peine les yeux. — Ah. C’est toi qui as renvoyé Garrik de sous les arbres. Je ne suis pas rancunier : une fouille perdue, ça se paie aussi. Pose ta question, si c’est la bonne.

- « Je cherche la clé de rouille bleue. » → mauvaise
- **[Mémoire 3]** « Pourquoi certaines reliques se souviennent-elles des morts ? » → bonne
- _(si Récit « Les voix du Bosquet » connu)_ « Au Bosquet des Échos, le bois garde la main de qui a gravé. Et tes os ? » → bonne
- « Et toi, de quoi te souviens-tu ? » → refus

### fournisseur

> Kaelis pose sa mâchoire de Golem. — Toute relique a un prix. Le tien : une plaque émaillée, un nom de gare de l’Ancien Monde. Il en dort une au tunnel de la Combe, au deuxième niveau. Rapporte-la, et les Marches te connaîtront.

- « Marché conclu. » → **fin** _(lance la quête « Ce qui se souvient », retient « connait-tunnel-combe »)_
- « Non. » → **fin**

### plaque

_Effet : reprend 1 × « Plaque émaillée », +40 Fers, termine la quête « Ce qui se souvient », retient « membre-marches-cendres », +40 XP._

> Kaelis passe le doigt sur les lettres blanches, sans les lire. — Elle se souvient d’un quai, de dix mille départs, et d’un seul qui n’est pas arrivé. Quarante Fers, et ton nom chez les Marches.

- « Merci, Kaelis. » → **fin**

### acheteuse

_Effet : retient « gris-kaelis »._

> Kaelis sourit sans montrer les dents. — Une dame en gris m’en offre le double de ce que je t’offre. Elle ne marchande jamais. Les gens qui ne marchandent pas ont perdu quelque chose, et ils le cherchent partout.

_Si Boulon voyage avec toi :_ Boulon, très bas : — Gants fins, Fers neufs. Je la connais. Je l’ai portée.

- « Qu’ouvre-t-elle ? » → ouvre
- « J’y réfléchirai. » → **fin**

### offre-ironie

> Kaelis ne lève pas les yeux. — Les os ne protestent pas. Toi, si. C’est déjà quelque chose. Cent Fers, toujours.

- « Qu’ouvre-t-elle ? » → ouvre
- « Non, pas à toi. » → **fin**

## Kerta Orvel

_Fondeuse des Forges-Basses_

Commence par : « apres-arrete » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « tam-arrete »)_, sinon « apres-monte » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « tam-monte »)_, sinon « apres-masques » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « masques-forges »)_, sinon « attente » _(si quête « Le registre du Puits Trois » en cours)_, sinon « accueil »

### accueil

> Une femme aux avant-bras couturés de brûlures attend son tour au Puits Trois, un seau de fer à la main. La file ne parle pas. Elle, si, à voix basse : — Tu n’es pas d’ici. Tant mieux. Ici, personne ne m’aidera.

- « Qu’est-ce qui ne va pas ? » → probleme
- « Pourquoi la file se tait-elle ? » → file
- « Bonne journée. » → **fin**

### file

> — Parce que les seaux de cuivre passent devant, et que le gardien entend tout. Le Un et le Deux, c’est pour les castes d’en haut : un Ouvrier qui s’y risque, ça finit mal. Le Trois, c’est le nôtre. L’eau a le goût de la forge.

- « Et toi, qu’est-ce qui ne va pas ? » → probleme
- « Je vois. » → **fin**

### probleme

> — Mon fils, Tam. Dix-neuf ans, riveteur. Il crache noir, comme son père avant de mourir. Il a inventé un masque qui garde les poumons. Une Innovation, ça se déclare : alors on change de caste, on part aux Manufactures, où l’air se respire.

- « Où est le problème ? » → probleme2

### probleme2

_Effet : lance la quête « Le registre du Puits Trois »._

> — Il faut un parrain de Classe Technique, et personne ne parraine un Ouvrier pour rien. Et Tam ne veut pas monter : il veut que le masque reste en bas. Il va mourir pour une idée. Va voir Dask, le technicien, aux Manufactures. Fais-le monter.

- « J’irai voir Dask. » → **fin**
- « Et ce que veut Tam ? » → tam-veut

### tam-veut

> — Tam veut ce que voulait son père : changer les choses d’ici. Son père est mort à quarante et un ans ; aux Forges, on dit que c’est un bel âge. Moi, je dis que c’est mon fils. Il est là, près du registre. Parle-lui, puis va voir Dask.

- « D’accord. » → **fin**

### attente

> Kerta remplit son seau sans te regarder. — Dask, aux Manufactures-Moyennes, près des Archives. Il a les chiffres bleus au poignet. Il parraine quand ça lui rapporte. Tam, lui, est près du registre. Il tousse moins quand on ne le regarde pas.

- « J’y vais. » → **fin**

### apres-monte

> Kerta se tient seule dans la file. — Il a pris le convoi ce matin. Il ne s’est pas retourné ; je le lui avais demandé. Là-haut, l’air se respire. Ceux qui montent ne redescendent guère, et ne nous regardent plus pareil. C’est le prix.

- « Il respire. C’est l’essentiel. » → **fin**

### apres-masques

> Kerta porte un masque de feutre au cou, comme toute la file. — Tu lui as donné raison. Les autres respirent mieux, grâce à lui. Lui tousse encore. Tu ne seras pas là le jour où il crachera rouge. Moi, si.

- « … » → **fin**

### apres-arrete

> Kerta est dans la file. Son seau est vide ; elle ne le remplit pas. — Les visières rouges l’ont pris à l’inspection. « Faux d’Innovateur. » Un sceau qui bavait. Personne ne me dit où il est. Personne ne me le dira jamais. Va-t’en.

- « … » → **fin**

## Des lettres éparpillées

_Objet_

Commence par : « lettres »

### lettres

> Quelques lettres, éparpillées entre les racines, encore sèches. Des traces dans la mousse partent vers le nord-est, comme si quelque chose avait traîné la sacoche.

- « Ramasser les lettres. » → ramassees
- _(sans repère « traces-lettres-perdues »)_ **🎲 Survie 11** « Lire les traces. » → traces, ✗ → traces-perdues
- « Laisser les lettres. » → **fin**

### traces-perdues

_Effet : retient « traces-lettres-perdues » pour 1 jours._

> Les traces se mêlent à celles des cerfs, puis disparaissent sous la mousse. Tu les perds.

- « Ramasser les lettres. » → ramassees
- « Laisser les lettres. » → **fin**

### ramassees

_Effet : retient « lettres-ramassees »._

> Tu glisses les lettres dans ta besace. Plus loin, au nord-est, les traces s’enfoncent sous les fougères.

- « Suivre les traces. » → **fin**

### traces

> De larges empreintes rondes, et des touffes de mousse arrachées : un Ours-Mousse. Il a dû la traîner jusqu’à sa tanière.

- « Ramasser les lettres. » → ramassees
- « Partir. » → **fin**

## Liane Sève-Claire

_Herboriste_

Commence par : « apres » _(si quête « Les herbes de lisière » terminée)_, sinon « rendu » _(si quête « Les herbes de lisière » en cours)_ _(si repère « sauge-1-cueillie »)_ _(si repère « sauge-2-cueillie »)_ _(si repère « sauge-3-cueillie »)_, sinon « attente » _(si quête « Les herbes de lisière » en cours)_, sinon « demande »

### demande

> Tu marches sur ma menthe. Bon. L’apprenti·e d’Ilyane, c’est ça ? Alors rends-toi utile : il me faut de la sauge-lumière pour les malades, et ils ne me laissent pas une minute.

- « Où en trouver ? » → ou _(lance la quête « Les herbes de lisière »)_
- « Une autre fois. » → **fin**

### ou

> Trois touffes. Une vers le bas du village, une autre un peu plus à gauche, au bout du chemin. La troisième se cache sous une pierre moussue, tout à gauche, au bord de la forêt : il faut l’œil, ou du flair.

- « Je m’en occupe. » → **fin**

### attente

> Alors, cette sauge ? Trois touffes. Je sais compter, moi.

- _(sans repère « liane-malades-vus »)_ _(sans repère « liane-malades-rate »)_ **🎲 Médecine 10** « Laisse-moi voir tes malades. » → malades, ✗ → malades-rate
- « J’y retourne. » → **fin**

### malades-rate

_Effet : retient « liane-malades-rate »._

> La vieille Brune te prend pour sa fille, puis ne te reconnaît plus. Tu prends le pouls, tu regardes les yeux : rien que tu saches lire. Liane : — Personne ne trouve. C’est ce qui me rend folle.

- « Je reviendrai. » → **fin**

### rendu

> Trois belles touffes. Tu as la main douce, pour un·e apprenti·e. Tiens : de quoi te rafistoler, et une fiole de ma sève. Ne la gaspille pas.

- « Merci, Liane. » → **fin** _(termine la quête « Les herbes de lisière », donne 2 × « Bandage », donne 1 × « Fiole de sève », +20 XP)_

### apres

> Mes malades vont un peu mieux. Reviens si tu croises d’autres herbes étranges.

- _(avis de Liane ≥ -4)_ « Viens avec moi, Liane. » → recrue
- _(sans repère « liane-malades-vus »)_ _(sans repère « liane-malades-rate »)_ **🎲 Médecine 10** « Laisse-moi voir tes malades. » → malades, ✗ → malades-rate
- « … » → **fin**

### recrue

> Liane te dévisage longtemps. — Mes malades. Sylvan les nourrira, et la sauge repousse sans moi. Mais je ne me bats pas pour les causes perdues, et je ne vole rien à personne. Compris ?

- « Compris. » → **fin** _(Liane se joint au héros)_
- « Je reviendrai. » → **fin**

### malades

_Effet : retient « liane-malades-vus », avis de Liane +1, +10 XP._

> Liane te regarde faire, bras croisés. — Le pouls, les yeux, la langue : tu sais lire un malade. Ils n’ont pas de fièvre. Ils revivent quelque chose. Mes herbes calment le corps ; le reste vient de la Gare.

- « Je reviendrai. » → **fin**

## Lior Rose-des-Vents

_Cartographe_

Commence par : « altavent » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_ _(sans repère « altavent-situe »)_, sinon « accueil »

### accueil

> Un homme maigre, un rouleau sous le bras, une boussole au cou. — Lior Rose-des-Vents, cartographe. Les Sept Portes mènent partout, et aucune carte ne le dit bien. Je les dessine, moi.

- « Où mènent-elles ? » → portes
- « Un cartographe qui ne sait pas où mène la septième Porte. Rassurant. » → ironie
- « Au revoir. » → **fin**

### portes

> — Une par pays d’en face : Verdantis par la Porte du sud, Ferros, Zephyria, Marisol, Glacialis, Solarix. Et la septième. Les contrôleurs n’en disent rien, et je n’ai jamais pu la dessiner.

- « Merci, Lior. » → **fin**

### altavent

_Effet : retient « altavent-situe », +15 XP._

> — Altavent ? Lior déroule trois cartes, puis une quatrième, très vieille. — Là. Une gare de l’Ancien Monde, sous les Hauts de Zephyria. Aujourd’hui, au-dessus, à trois mille mètres, flotte Aetherhaven.

- « Merci, Lior. » → **fin**

### ironie

> — Rassurant, oui. Les cartes qui savent tout mentent. La mienne a un blanc au milieu : c’est la seule chose vraie qu’elle dise.

- « Où mènent-elles ? » → portes
- « Au revoir. » → **fin**

## Lisandre Ramelune

_Aubergiste du Nid_

Commence par : « vote » _(si quête « L’audience » terminée)_ _(si repère « conseil-frontiere »)_ _(sans repère « lisandre-vote-dit »)_, sinon « vote-commerce » _(si quête « L’audience » terminée)_ _(si repère « conseil-commerce »)_ _(sans repère « lisandre-vote-commerce-dit »)_, sinon « vote-accord » _(si quête « L’audience » terminée)_ _(si repère « conseil-accord »)_ _(sans repère « lisandre-vote-accord-dit »)_, sinon « elvan-parti » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-denonce »)_ _(sans repère « lisandre-elvan-parti-dit »)_, sinon « tournee » _(si quête « Les graines qui manquent » terminée)_ _(si repère « graines-silence »)_ _(sans repère « lisandre-tournee-dit »)_, sinon « nouvelles-vol » _(si repère « vol-grenier »)_ _(sans repère « lisandre-vol-dit »)_, sinon « flute » _(si quête « Le chant d’Anselme » terminée)_ _(sans repère « lisandre-flute-dit »)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Bienvenue au Nid ! On dort en hamac, on mange des soupes de fleurs, et on ne fait jamais de feu : une braise, et tout le quartier y passe. Ce sont nos cristaux qui chauffent les bols.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nid »)_
- « Au revoir. » → **fin**

### soupe

> Pétales de lune, racine douce et une pincée de mousse dorée. Ça réchauffe jusqu’au bout des orteils, tu verras.

- « Merci, Lisandre. » → accueil

### nouvelles

> Le Conseil des Racines Profondes se réunit beaucoup, ces temps-ci : on parle de la frontière, de Ferros, de ces forages. Et deux Jeunes-Pousses ont été bannis pour une branche cassée. Une branche. Le petit Malo, lui, court toujours sur la passerelle du Bois.

- _(si quête « Les graines qui manquent » en cours)_ _(sans repère « indice-elvan »)_ « Il manque des graines au grenier. As-tu vu passer quelque chose ? » → graines _(retient « indice-elvan »)_
- « Merci. » → accueil

### nouvelles-vol

_Effet : retient « lisandre-vol-dit »._

> Tu as entendu ? Quelqu’un a forcé le grenier des semences, dans les Hautes Ramures. Voler des graines à Canopéa, c’est comme voler l’avenir. Le Conseil est furieux.

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

> Tu sais la nouvelle ? Le sol sacré est fermé, les routes restent ouvertes : tout le monde est content, pour une fois ! On dit que c’est une idée venue d’en bas, de quelqu’un qui y est descendu.

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
- **[10 Fers]** « Un hamac jusqu’au matin. » → dodo _(−10 Fers, dort jusqu’au matin)_
- **[10 Fers]** « Un hamac jusqu’à la nuit. » → dodo _(−10 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### dodo

> Le hamac se balance au vent des cimes. Tu t’endors avant d’avoir compté les feuilles.

- « Se lever. » → **fin**

### accueil-2

> Bienvenue au Nid ! Ce matin, une nacelle a grincé si fort que tout le marché a levé la tête. Véline dit que ce n’est rien. Véline dit toujours que ce n’est rien.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nid »)_
- « Au revoir. » → **fin**

### accueil-3

> Bienvenue au Nid ! Les cristaux de veille ont brillé toute la nuit au Bosquet : Mirelle dit que les noms gravés parlaient plus fort. Une soupe de fleurs, pour fêter ça ?

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nid »)_
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

> — Le Gardien veut des faits ; moi aussi. Si ce sont des gens de Ferros, apporte-moi des noms. Des colères, j’en ai assez.

- « Je trouverai des noms. » → **fin**
- « Le commerce avec Ferros vous inquiète ? » → commerce

### apres

> — Grâce à toi, le Conseil a décidé avec des faits. C’est rare, et précieux. Que la sève coule pour toi.

- « Que la sève coule. » → **fin**

## Maëlis Lunelierre

_Mère de Nell_

Commence par : « apres » _(si quête « La berceuse oubliée » terminée)_, sinon « retour » _(si quête « La berceuse oubliée » en cours)_ _(si repère « berceuse-recueillie »)_, sinon « attente » _(si quête « La berceuse oubliée » en cours)_, sinon « demande »

### demande

> Tu es l’apprenti·e d’Ilyane ? Ma fille, Nell… depuis trois nuits, elle ne reconnaît plus la berceuse que je lui chante. Ce matin, elle m’a appelée « madame ». Elle m’écoute comme on écoute une étrangère.

- « Je vais t’aider. Que puis-je faire ? » → piste _(lance la quête « La berceuse oubliée »)_
- « Une berceuse. Ailleurs, des enfants meurent. » → cruel _(avis de Liane −1)_
- « Je suis désolé·e. Je dois partir. » → **fin**

### piste

> Ilyane dit que les souvenirs perdus laissent parfois un Écho. Hier soir, au pied de l’Arbre-Titan, j’ai cru entendre ma propre voix. Si seulement quelqu’un pouvait rapporter la berceuse à Nell.

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

### cruel

> Maëlis recule d’un pas, puis se redresse. — Ailleurs, oui. Ici, c’est ma fille. Va-t’en.

- « Partir. » → **fin**

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

> Quand quelqu’un meurt, on le met en terre au pied d’un arbre, tout en bas. Mon grand-père Anselme repose là. Mamie Aïlis a gravé son nom au Bosquet et va lui parler chaque soir. Moi, je n’entends rien, mais je crois qu’il m’écoute quand même.

- « Il t’écoute, c’est certain. » → accueil

### peur

> Tomber ? Jamais ! Bon, une fois. Mais un filet de lianes m’a rattrapé. Tilo, lui, est tombé à côté du filet. Mamie dit que la forêt n’aime pas qu’on lui jette des enfants. Sur Tilo, elle ne dit rien.

- « Elle a bien raison. » → accueil

### souci

> Salut. Je suis Malo, coursier des passerelles. Enfin, coursier. Je viens de laisser tomber la sacoche des Nacelliers. Toutes les lettres de la semaine, dans le feuillage ! Si Véline l’apprend, je balaie les passerelles jusqu’à l’hiver.

- « Je peux t’aider à la retrouver. » → aide _(lance la quête « Les lettres de Malo »)_
- « Montre-moi plutôt la ville. » → ville
- « Courage, Malo. » → **fin**

### aide

> C’est vrai ? Elle est tombée tout en bas, sur le Sol des Racines. Mais le sol est sacré : personne n’y descend sans l’accord des Nacelliers. Demande à Véline, à la Grande Nacelle. Si elle dit oui, elle te descendra.

- « J’y vais. » → **fin**

### attente

> Alors ? La sacoche est en cuir brun, avec le fermoir de cuivre des Nacelliers. Si tu vois des lettres par terre, c’est que tu chauffes !

- « Je la cherche encore. » → **fin**
- « Rappelle-moi ce qu’il faut faire. » → aide
- « Montre-moi la ville. » → ville

### retour

> La sacoche ! Tu l’as retrouvée ! Toutes les lettres sont là, presque toutes. Merci, merci ! Tiens, ce n’est pas grand-chose, mais c’est de bon cœur.

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

> Mamie joue de la flûte ! Tous les soirs, au Bosquet. Elle dit que c’est grâce à toi, et à Papi. Elle va m’apprendre. Je serai coursier ET musicien.

- _(si quête « Les lettres de Malo » pas commencée)_ « Merci pour la nouvelle. » → souci
- _(si quête « Les lettres de Malo » terminée)_ « Merci pour la nouvelle, Malo. » → ami
- « À bientôt, Malo. » → **fin**

## La marchande des nations

_Marché des nations_

Commence par : « accueil »

### accueil

> — Des baumes de Verdantis, des carreaux de Ferros, des cristaux de partout ! Fers, Feuilles, coquillages : je change tout, au cours du jour, et toujours à mon avantage.

- « Voyons ça. » → **fin** _(ouvre le Troc)_
- « Au revoir. » → **fin**

## Mina

_Une des jumeaux_

Commence par : « accueil »

### accueil

> — Moi, je sais ce que c’est, le raccompagnement : deux agents, une voiture, et on te pose au cent unième kilomètre. On y joue, dans la cour. C’est toujours Arlo qu’on raccompagne.

- « Au revoir. » → **fin**

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

> Les hamacs du relais sont à tous les Gardiens. Dors un peu : la mémoire travaille mieux quand le corps se repose. Au réveil, tes forces sont revenues.

- « Merci, Mirelle. » → accueil

### ilyane

> Nous avons fait notre apprentissage ensemble, il y a bien longtemps. Elle voulait tout entendre ; moi, tout écrire. Dis-lui que je garde encore son carnet de chansons, et qu’elle chante toujours aussi faux, j’en suis sûre.

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

> Bienvenue au relais. Tu as l’air de chercher quelque chose. Une histoire ? Une chanson ?

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

> Nell serre son oiseau de bois et regarde la fenêtre. — Maman chante, mais je ne connais pas cette chanson. Avant, je la connaissais… je crois.

- « … » → **fin**

### chanson

> Nell lève les yeux vers toi. — Tu connais une chanson ?

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

Commence par : « releve » _(si l’on porte « Relevé d’un Écho »)_ _(si quête « Les Échos sous la Forge » en cours)_, sinon « cle » _(si l’on porte « Clé de rouille bleue »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « registre » _(si quête « Le contrat de Boulon » en cours)_ _(sans repère « boulon-libre »)_, sinon « fonds » _(si quête « Le fonds des Échos » en cours)_ _(5 Échos recueillis ou plus)_, sinon « apres-archives » _(si repère « cle-archives »)_, sinon « accueil »

### accueil

> — Archives Centrales de Ferros, comptoir public (voir : règlement, article quatre). Fonds ordinaires : consultation libre. Fonds scellés : Niveau Trois (voir : une autorisation, un motif, un patron).

- « Je cherche ce qui concerne le dernier train. » → train
- « Vous gardez tout ? » → tout
- _(si quête « L’audience » terminée)_ « Classez-vous aussi les nouvelles de Verdantis ? » → verdantis
- « Au revoir. » → **fin**

### tout

> — Ferros ne brûle rien : Ferros classe (voir : devise officieuse). Ce qui n’est pas classé n’existe pas encore.

- _(si repère « rumeur-fiche-archives »)_ _(sans repère « fiche-lue »)_ « Et ma fiche ? L’article onze vous oblige à la montrer. » → fiche
- _(si quête « Le fonds des Échos » pas commencée)_ _(sans repère « membre-marches-cendres »)_ « Les Archives prennent-elles des correspondants ? » → correspondant
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

- _(si quête « Le fonds des Échos » pas commencée)_ _(sans repère « membre-marches-cendres »)_ « Les Archives prennent-elles des correspondants ? » → correspondant
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

### registre

> Noam tire un registre épais et pose le doigt sur une ligne. — « Boulon. Ferrôme. Matériel de quai, gare de l’Ouest. Rachat : cent vingt Fers. » Un bien, ou une mémoire ? La loi ne tranche pas (voir : article non rédigé). Moi, je classe.

- **[120 Fers]** « Racheter son contrat. » → rachete _(−120 Fers, retient « boulon-libre »)_
- _(sans repère « noam-refuse-archive »)_ **🎲 Érudition 12** « Il se souvient de chaque voyageur : c’est une archive, pas un outil. » → reclasse, ✗ → reclasse-refus _(retient « boulon-libre », retient « boulon-archive »)_
- **🎲 Discrétion 13** « Arracher la page, quand il aura le dos tourné. » → arrache, ✗ → surpris _(retient « boulon-libre », retient « registre-arrache »)_
- « Autre chose. » → accueil

### reclasse-refus

_Effet : retient « noam-refuse-archive »._

> Noam repose le doigt sur la ligne. — Une archive se consulte. Celle-ci porte des malles. Bel argument ; mauvais article. Il me faut un texte, une conviction ne se classe pas.

- « Revenir au registre. » → registre
- « Autre chose. » → accueil

### rachete

> Noam compte les Fers, tamponne, raye. — Rayé du matériel (voir : vente). Il ne vous appartient pas pour autant. Il ne s’appartenait pas : il s’appartient. Classé.

- « Merci, Noam. » → **fin**

### reclasse

> Noam se tait longtemps. — … Une archive vivante ne se vend pas (voir : règlement, article premier). Je le reclasse : « Fonds Boulon, consultable partout où il va. » Les Archives s’en souviendront, de vous.

- « Merci, Noam. » → **fin**

### arrache

> Une page de moins dans un registre de mille. Personne ne la cherchera, sauf Noam, un jour, qui cherche toujours tout.

- « Partir vite. » → **fin**

### surpris

_Effet : retient « registre-surpris »._

> — Je vous prie de lâcher ce registre (voir : délits, article six). Noam ne crie pas. Il note. Il note votre nom.

- « Partir. » → **fin**

### fiche

_Effet : retient « fiche-lue », +20 XP._

> Noam se fige, puis tire un carton gris d’un tiroir. — Article onze. Exact. « Gardien·ne de Mémoire, arrivé·e par la gare de l’Ouest. Pose des questions. Fréquente la Pension de la Bielle. À surveiller. Signalé·e par : » Le nom est rayé.

- « Qui m’a signalé·e ? » → fiche-qui
- « Merci, Noam. » → **fin**

### fiche-qui

> — Rayé (voir : article douze). Il range le carton. Pour la première fois, il a l’air de s’excuser.

- « Au revoir. » → **fin**

### correspondant

> — Correspondant (voir : règlement, article dix-neuf) : quiconque fait classer ici cinq Échos recueillis de sa main. Vous tenez un Livre des Échos ? Remplissez-le. Le reste, je le classe.

- « Je reviendrai avec cinq Échos. » → **fin** _(lance la quête « Le fonds des Échos »)_
- « Une autre fois. » → accueil

### fonds

_Effet : termine la quête « Le fonds des Échos », retient « membre-archives-ferros », +40 XP._

> Noam lit ton Livre des Échos page à page et recopie chaque Écho sur une fiche grise. — Classé (voir : fonds des Échos, cinq entrées ; correspondant : vous). Les Archives de Ferros vous comptent parmi les leurs.

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

> — Parfait. Les visières rouges descendront à la Cendrière cette nuit. L’aiguilleur sera classé : sabotage d’un secteur stratégique, au tribunal de dire trahison. La machine ira aux Manufactures : elle conduira pour l’Empire. Votre prime : soixante Fers.

- « … » → **fin**

### apres

> — Affaire classée (dossier Cendrière). Le Bureau étudie la machine. Les cheminots, eux, devront s’y faire.

- « Au revoir. » → **fin**

## La page du dernier départ

_Fonds Muet_

Commence par : « relue » _(si repère « page-lue »)_, sinon « page »

### page

_Effet : retient le Récit « La page du dernier départ », retient « page-lue », +50 XP._

> Sur le lutrin, une feuille recopiée d’une main patiente. Une seule ligne, celle que Ferros a grattée : « Dernier départ, voie sept. Terminus : Altavent, sous les Hauts de Zephyria. Déchargé : sept caisses plombées. Reçu : personne. »

_Si Liane voyage avec toi :_ Liane relit la ligne en silence. — « Reçu : personne. » Ilyane a vu des enfants sur ce quai. Qui les attendait, à Altavent ?

_Si Boulon voyage avec toi :_ Boulon pose une main sur le lutrin. — Sept caisses plombées, reçues par personne. Quand une malle n’est reçue par personne, c’est que quelqu’un l’attend encore.

- « Refermer le Fonds. » → **fin**

### relue

> La page du dernier départ. Altavent. Sept caisses. Personne pour les recevoir.

- « … » → **fin**

## Le patrouilleur à visière rouge

_Funiculaire des Manufactures-Moyennes_

Commence par : « rouille » _(1 marque du cristal ou plus)_ _(sans repère « rouille-ame »)_, sinon « liste » _(un cristal au cou)_ _(sans repère « liste-ferros »)_, sinon « passe » _(si repère « laissez-passer-ironheart »)_, sinon « controle »

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

_Effet : retient « laissez-passer-ironheart » pour 7 jours._

> — Dix Fers. Visite d’une semaine, Manufactures-Moyennes seulement. Il tamponne un carton gris et te le tend. — Sept jours. Après, tu repasses à la caisse, comme tout le monde.

- « Monter. » → **fin** _(mène à « Ironheart — Les Manufactures-Moyennes »)_
- « Plus tard. » → **fin**

### bluff-ok

_Effet : retient « laissez-passer-ironheart » pour 1 jours._

> — Cendrefer ? Bon. Pour aujourd’hui. Dépêche-toi, et pas de détours.

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

### rouille

> Il te saisit le poignet. Sous la peau, tes veines luisent de la couleur du cristal. Il lâche aussitôt. — Rouille de l’âme. Ça, ce n’est plus une liste : c’est un signalement. À moins que tu aies une bonne raison.

- **🎲 Subterfuge 13** « Bluffer : « Une brûlure de forge, rien d’autre. » » → rouille-bluff, ✗ → rouille-cellule
- **[20 Fers]** « Lui glisser vingt Fers. » → rouille-payee _(−20 Fers)_
- _(sans repère « patrouilleur-defie »)_ **🎲 Commandement 14** « Lâche ce poignet. Tu n’as rien vu. » → rouille-ordre, ✗ → rouille-ordre-rate
- « Je n’ai rien à cacher. » → rouille-cellule

### rouille-ordre-rate

_Effet : retient « patrouilleur-defie »._

> Il ne lâche pas. Il serre. — Rien vu ? J’ai vu un porteur de cristal donner des ordres à une patrouille. Ça aussi, ça s’écrit.

- **[20 Fers]** « Lui glisser vingt Fers. » → rouille-payee _(−20 Fers)_
- « Je n’ai rien à cacher. » → rouille-cellule

### rouille-bluff

_Effet : retient « rouille-ame »._

> — Une brûlure. Il te fixe trois secondes de trop. — Alors soigne-la, et couvre-la : le prochain sera moins myope que moi.

- _(sans repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → controle
- _(si repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → passe
- « Bon. » → **fin**

### rouille-payee

_Effet : retient « rouille-ame »._

> Les Fers disparaissent dans son gant. Il n’écrit rien. — Inspecté. Couvre ça, que je n’aie pas à le revoir. Ici, ce qu’on te laisse passer, ça se paie. Toujours.

- _(sans repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → controle
- _(si repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → passe
- « Bon. » → **fin**

### rouille-cellule

_Effet : retient « rouille-ame », retient « rouille-signalee », fait passer 1 moment, attend le matin._

> 🌙 Le poste : une cellule de fer, un banc, un seau. On t’y garde « le temps de vérifier ton statut ». Au matin, un Veilleur de Rouille note tes veines, ton nom, ta pension, et l’on te relâche. Te voilà fiché·e, à l’encre rouge.

- « Sortir. » → **fin**

### rouille-ordre

_Effet : retient « rouille-ame »._

> Il lâche ton poignet comme un fer trop chaud et recule d’un pas, sans savoir pourquoi. — Je n’ai rien vu. Mais couvre ça : le prochain n’obéira peut-être pas.

- _(sans repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → controle
- _(si repère « laissez-passer-ironheart »)_ « Et le funiculaire ? » → passe
- « Bon. » → **fin**

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

- _(sans repère « chantier-ouest-oublie »)_ **🎲 Érudition 12** « Se souvenir de ce qu’on raconte du Chantier Ouest. » → chantier, ✗ → chantier-oublie
- « S’éloigner. » → **fin**

### chantier-oublie

_Effet : retient « chantier-ouest-oublie »._

> Tu as lu ce nom quelque part, dans un livre des Gardiens. La page, elle, t’échappe.

- « S’éloigner. » → **fin**

### chantier

> Pendant la Guerre du Rail, Ferros envoya vers l’ouest des machines sans hommes, les premières de l’Empire, pour poser la voie à travers la forêt. La forêt les démonta, boulon par boulon. Celle-ci est revenue.

- « S’éloigner. » → **fin**

### memoire

_Effet : retient « pilote-ecoute », retient le Récit « La machine qui roulait vers l’ouest », +15 XP._

> Sous ta main, un ordre très ancien, répété sans fin : « Vers l’ouest. Rejoindre le chantier. » Le chantier n’existe plus depuis des siècles. La machine ne vole rien : elle obéit. Les pilleurs n’ont fait que l’atteler.

- « Retirer la main. » → **fin**

## La porte du Fonds Muet

_Grande Bibliothèque_

Commence par : « fermee »

### fermee

> Une porte basse, sans serrure visible. Une plaque : « Fonds Muet. On garde, on classe, on restaure. On ne cite pas. » Le jour, le Conservateur veille au guichet ; la nuit, un portier.

- _(la nuit)_ _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « raccompagne-nuit »)_ **🎲 Discrétion 14** « Passer quand le portier tourne le dos. » → passe, ✗ → surpris
- _(la nuit)_ _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(si repère « rumeur-portier-nuit »)_ _(sans repère « raccompagne-nuit »)_ **🎲 Discrétion 10** « Attendre la troisième cloche, et sa ronde des étages (la rumeur). » → passe, ✗ → surpris
- _(la nuit)_ _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « raccompagne-nuit »)_ **🎲 Athlétisme 14** « Par le toit : la gouttière, puis la verrière du Fonds. » → verriere, ✗ → gouttiere
- « Partir. » → **fin**

### passe

_Effet : retient « fonds-muet-ouvert »._

> La porte cède sans un bruit : elle n’était pas fermée, seulement gardée.

- « Entrer. » → **fin** _(mène à « Sept-Portes — le Fonds Muet »)_

### surpris

_Effet : retient « raccompagne-nuit »._

> Une lanterne sourde s’allume derrière toi. Le portier ne te touche pas ; il ne le pourrait pas. — Je vais chercher la voiture.

- « … » → racc

### racc

_Effet : retient « raccompagne »._

> Deux agents en gris clair. Personne ne te touche : on t’ouvre une portière. La voiture roule une journée, jusqu’au cent unième kilomètre, et l’on te pose sur le bas-côté. Il te faut deux jours pour revenir.

- « Revenir à Sept-Portes, à pied. » → **fin** _(fait passer 8 moments, mène à « Sept-Portes — la place des Sept Portes »)_

### verriere

_Effet : retient « fonds-muet-ouvert »._

> Trois étages de pierre froide, une verrière mal jointe. Tu te laisses glisser entre deux rayonnages, sans un bruit. Ici, personne n’a pensé à garder le ciel.

- « Descendre dans le Fonds. » → **fin** _(mène à « Sept-Portes — le Fonds Muet »)_

### gouttiere

_Effet : −4 PV._

> La gouttière cède sous ta main. Tu tombes dans la cour, deux étages plus bas, au pied du portier.

- « … » → surpris

## Porte du grenier des semences

_Objet_

Commence par : « verrouillee »

### verrouillee

> Une porte ronde, fermée par une serrure de bois et de cuivre. Une plaque indique : « Grenier des semences — propriété du Conseil ».

- **🎲 Artisanat 12** « Crocheter la serrure. » → ouverte, ✗ → echec
- _(si repère « rumeur-cle-nichoir »)_ « Chercher la clé dans le nichoir, au-dessus de la porte. » → nichoir
- **🎲 Athlétisme 12** « Grimper jusqu’à la lucarne, par la grosse branche. » → lucarne, ✗ → branche
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

### nichoir

_Effet : retient « grenier-deverrouille »._

> Sous la paille du nichoir, tes doigts trouvent une petite clé de cuivre, encore tiède. La serrure tourne sans un bruit.

- « Entrer. » → **fin** _(mène à « Canopéa — Grenier des semences »)_
- « Remettre la clé, et partir. » → **fin**

### lucarne

_Effet : retient « grenier-deverrouille »._

> La branche tient. Tu te glisses par la lucarne et tu tires le verrou de l’intérieur : la porte ronde s’ouvre sur une odeur de graines sèches.

- « Entrer. » → **fin** _(mène à « Canopéa — Grenier des semences »)_
- « Ne pas entrer pour l’instant. » → **fin**

### branche

_Effet : −2 PV._

> La branche ploie, puis plie. Tu redescends plus vite que prévu, et une passerelle grince non loin.

- « Réessayer. » → verrouillee
- « Partir. » → **fin**

## Le portier de nuit

_Gardien de la Bibliothèque, la nuit_

Commence par : « accueil »

### accueil

> Un homme à la lanterne sourde. — La Bibliothèque dort, et les livres aussi. Revenez quand le Conservateur sera au guichet.

- « Au revoir. » → **fin**

## Le registre des consultations

_Grande Bibliothèque_

Commence par : « registre »

### registre

> Un grand livre ouvert sur un lutrin, à la vue de tous : les demandes de consultation, chacune signée d’une main.

- _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « fonds-muet-ouvert »)_ _(sans repère « raccompagne-ruse »)_ **🎲 Subterfuge 14** « Inscrire une demande au nom d’un Chroniqueur. » → faux-ok, ✗ → faux-rate
- _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(si repère « rumeur-main-grise »)_ _(sans repère « main-edda-fausse »)_ « Chercher, plus haut, la main d’Edda Varn (la rumeur). » → main-fausse
- _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « main-edda-fausse »)_ **🎲 Investigation 14** « Examiner la demande d’Edda Varn. » → main-fausse, ✗ → rien
- « Laisser le registre. » → **fin**

### faux-ok

_Effet : retient « fonds-muet-ouvert », retient « faux-registre »._

> Tu signes d’une main qui n’est pas la tienne. Personne ne regarde : le Registre enregistre, il ne vérifie pas. Une heure plus tard, la demande est accordée, sans motif, comme les refus.

- « … » → **fin**

### faux-rate

_Effet : retient « raccompagne-ruse »._

> Ta plume hésite sur la dernière lettre. Derrière toi, une voix calme : — Cette main n’est pas la vôtre. Nous ne crions pas. Nous appelons une voiture.

- « … » → racc

### main-fausse

_Effet : retient « main-edda-fausse »._

> Plus haut dans le Registre, trente ans plus tôt : « Edda Varn, de Ferros. Main close : décédée. » La dame en gris signe d’une main morte.

- « … » → **fin**

### rien

> Une écriture appliquée, sans une rature. Tu ne vois rien d’autre.

- « … » → **fin**

### racc

_Effet : retient « raccompagne »._

> Deux agents en gris clair. Personne ne te touche : on t’ouvre une portière. La voiture roule une journée, jusqu’au cent unième kilomètre, et l’on te pose sur le bas-côté. Il te faut deux jours pour revenir.

- « Revenir à Sept-Portes, à pied. » → **fin** _(fait passer 8 moments, mène à « Sept-Portes — la place des Sept Portes »)_

## Le registre des départs

_Triage des Cendres_

Commence par : « registre »

### registre

_Effet : retient « indice-registre »._

> Le registre des départs. Trois nuits du mois, la même ligne : « Convoi de minerai, trois wagons — parti sans conducteur. » Et chaque fois, en bas, la signature de l’aiguilleur de nuit : J. Brakel.

- « Refermer le registre. » → **fin**

## Le Registre des Mains

_Grande Bibliothèque_

Commence par : « livre »

### livre

> Le Registre des Mains, ouvert à la page du jour. Des lignes serrées, sans une rature : de qui, à quelle date, contre combien, et ce que le vendeur affirmait. Seul le Conservateur lit pour les visiteurs.

- « … » → **fin**

## Un renfoncement sans enseigne

_Entre deux fonderies éteintes_

Commence par : « mur »

### mur

> Entre deux fonderies éteintes, un renfoncement sans enseigne. Un mur noirci de suie, et rien d’autre, en apparence.

- _(si repère « marche-cendres-indice »)_ « Chercher le passage, comme on te l’a dit. » → trouve
- _(sans repère « mur-rate »)_ **🎲 Investigation 12** « Examiner le mur. » → trouve, ✗ → mur-rien
- « Faire luire un cristal le long du mur. » → trouve _(lance « Lueur »)_
- « Passer son chemin. » → **fin**

### mur-rien

_Effet : retient « mur-rate » pour 1 jours._

> Suie, briques, suie. Ta main glisse sur le mur sans rien accrocher. Si un passage existe, il ne se montre pas aujourd’hui.

- « Revenir au mur. » → mur
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

> Une chaudronnière aux bras couverts de suie lève les yeux. — Gardebois ? Tu connais mon Brann ? Il travaille chez Tobias Cendrefer. Il mange bien ? Il ne fait pas trop de bêtises ?

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

- _(si repère « rumeur-cache-passeurs »)_ _(sans repère « cache-passeurs-prise »)_ « Glisser la main sous le rebord, là où cachent les passeurs. » → cache
- « … » → **fin**

### chercher

> Un gros rocher couvert de mousse. Liane parlait d’une lueur sous une pierre.

- **[Perception 4]** « Repérer la lueur sous la mousse. » → trouve
- **🎲 Survie 11** « Suivre l’odeur poivrée de la sauge. » → trouve, ✗ → rien
- _(si repère « rumeur-cache-passeurs »)_ _(sans repère « cache-passeurs-prise »)_ « Glisser la main sous le rebord, là où cachent les passeurs. » → cache
- « Laisser tomber. » → **fin**

### trouve

_Effet : retient « sauge-3-cueillie »._

> Sous le rebord du rocher, une touffe de sauge-lumière brille dans l’ombre. Tu la cueilles avec soin.

- « … » → **fin**

### rien

> Tu tournes autour du rocher sans rien trouver. Peut-être en revenant plus tard.

- « … » → **fin**

### vide

> Le creux sous le rocher, où poussait la sauge-lumière.

- _(si repère « rumeur-cache-passeurs »)_ _(sans repère « cache-passeurs-prise »)_ « Glisser la main sous le rebord, là où cachent les passeurs. » → cache
- « … » → **fin**

### cache

> Derrière la mousse, un paquet ciré : une bourse de Fers, une fiole de sève, et un mot plié en quatre, d’une écriture appliquée : « Pour la petite, si je ne reviens pas de la Lisière. »

- « Tout prendre. » → cache-prise _(+30 Fers, donne 1 × « Fiole de sève », retient « cache-passeurs-prise », avis de Liane −1)_
- « Remettre la mousse, et tout laisser. » → **fin**

### cache-prise

> Tu remets la mousse en place, et le mot avec. Un soir, quelqu’un la soulèvera et ne trouvera que de la terre.

- « … » → **fin**

## La sacoche des Nacelliers

_Objet_

Commence par : « ours » _(sans repère « ours-sol-vaincu »)_ _(sans repère « ours-sol-eloigne »)_, sinon « libre »

### ours

> La sacoche est là, sous la patte d’un Ours-Mousse endormi, roulé dans la mousse comme dans un édredon.

- **🎲 Discrétion 11** « Glisser la main sous sa patte, tout doucement. » → prise, ✗ → reveil
- _(sans repère « ours-baies-rate »)_ **🎲 Survie 11** « L’attirer plus loin avec une poignée de baies. » → eloigne, ✗ → baies-rate
- « Le réveiller et l’affronter. » → **fin** _(lance le combat « ours-sacoche »)_
- « Reculer sans bruit. » → **fin**

### baies-rate

_Effet : retient « ours-baies-rate »._

> L’ours renifle les baies, ouvre un œil, puis l’autre. Il se lève, et il est plus grand debout.

- « Se défendre. » → **fin** _(lance le combat « ours-sacoche »)_
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

> Entre doucement, les fioles dorment. Herbes de la canopée, baumes de mousse, bandages. Ce qui guérit pousse ici. Ce qui guérit trop, je le garde sous le comptoir.

- « Voyons ce que tu vends. » → **fin** _(ouvre le Troc)_
- « D’où viennent tes herbes ? » → herbes
- « Tu vends des cristaux ? » → cristaux
- « Au revoir. » → **fin**

### herbes

> Des branches hautes, là où le soleil touche en premier. On ne cueille jamais tout : une feuille sur trois reste à l’arbre. C’est la règle de la Sève.

- _(si repère « rumeur-seve-aieux »)_ « Et la sève qu’on tire au pied des arbres des morts ? » → aieux
- « Préparer des remèdes, avec ce que j’ai récolté. » → **fin** _(ouvre l’atelier « herbes »)_
- « Une belle règle. » → accueil

### cristaux

> — Des cristaux de Vie, oui : deux cent cinquante Fers le petit. Mais si tu veux apprendre, va voir le druide Vanel, au Bosquet des Échos : les Druides Verts prêtent et enseignent pour rien. C’est leur loi.

- « Voyons ce que tu vends. » → **fin** _(ouvre le Troc)_
- « Merci, Sévane. » → accueil

### aieux

> Sévane pâlit, et regarde la porte. — Qui t’a dit ça ? Trente Fers la fiole. Une gorgée à la fois, et jamais deux soirs de suite : on finit par ne plus vouloir que leurs voix.

- **[30 Fers]** « Payer trente Fers. » → aieux-achetee _(−30 Fers, donne 1 × « Sève des aïeux »)_
- « Laisser ça. » → accueil

### aieux-achetee

> Elle glisse la fiole dans ta main sans la regarder. — Tu ne l’as pas eue ici. Et tu ne l’as pas eue du tout.

- « Merci, Sévane. » → **fin**

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

> — Tiens, une tête connue. La machine roule, les wagons arrivent. L’aiguilleur ? Il savait compter, c’est tout. Ceux qui savent compter finissent toujours par parler.

- « Au revoir. » → **fin**

## Sylvan Mousserelle

_Aubergiste de la Racine_

Commence par : « ilyane-chante » _(si quête « Le carnet de chansons » terminée)_ _(sans repère « sylvan-ilyane-chante-dit »)_, sinon « triumvirat » _(si quête « L’audience » terminée)_ _(sans repère « sylvan-triumvirat-dit »)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Bienvenue à la Racine ! On mange chaud, on parle fort, et on ne demande à personne ce qu’il a vu la nuit dernière. Chez Sylvan, les Gardiens de Mémoire sont toujours bien reçus.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « racine »)_
- « Au revoir. » → **fin**

### repas

> Soupe de racines, pain de mousse et une part de tarte aux baies. Ça remet d’aplomb, pas vrai ?

- « Merci, Sylvan. » → accueil

### rumeurs

> On dit que la maladie des souvenirs vient de la Gare, depuis que Ferros y creuse. La petite Nell, chez les Lunelierre, ne reconnaît plus sa propre berceuse. Et Brann, l’apprenti de Tobias, a perdu une caisse sur la route de l’est.

- « Et l’herboriste, Liane ? » → liane
- « Merci. » → accueil

### liane

> Liane ? Toujours au bord du ruisseau, près du marché, le nez dans ses herbes. Elle est brusque, mais personne ne soigne mieux qu’elle.

- « Merci. » → accueil

### ilyane-chante

_Effet : retient « sylvan-ilyane-chante-dit »._

> Ilyane a chanté au cercle des lanternes, hier soir ! Avec un vieux carnet revenu de Canopéa. Elle chante faux à faire fuir les cerfs, et j’ai pleuré dans ma tarte.

- « Merci pour la nouvelle. » → accueil

### triumvirat

_Effet : retient « sylvan-triumvirat-dit »._

> Les nouvelles vont vite, par le courrier des Nacelliers : tu as parlé devant le Triumvirat Vert ! À la Racine, on boit à ta santé. Enfin, au jus de baies. Tu veux un verre ?

- « Merci pour la nouvelle. » → accueil

### servir

> — Une soupe, ou une chambre ? La chambre du fond est calme : on n’y entend que le ruisseau.

- **[8 Fers]** « Un repas chaud. » → repas _(−8 Fers, +15 PV)_
- **[6 Fers]** « Une chambre jusqu’au matin. » → dodo _(−6 Fers, dort jusqu’au matin)_
- **[6 Fers]** « Une chambre jusqu’à la nuit. » → dodo _(−6 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### dodo

> Un lit de mousse, une couverture qui sent la fumée de bois. Tu dors d’une traite.

- « Se lever. » → **fin**

### accueil-2

> Bienvenue à la Racine ! Aujourd’hui, la caravane de midi est partie en retard : un essieu, paraît-il. Assieds-toi, la soupe, elle, est à l’heure.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « racine »)_
- « Au revoir. » → **fin**

### accueil-3

> Bienvenue à la Racine ! Ce matin, Tobias a vendu trois lampes à cristal avant même d’ouvrir. Il dit que les nuits rallongent. Moi, je dis qu’il parle trop.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → rumeurs
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « racine »)_
- « Au revoir. » → **fin**

## La tailleuse de cristaux

_Marché des Cendres_

Commence par : « usure » _(si le cristal porté a servi 6 fois ou plus sans être réaccordé)_, sinon « accueil »

### accueil

> Sous une tente basse, une femme aux mains noircies taille un cristal rouge veiné de noir. — Cristaux de forge, taillés ici, sous terre. Là-haut, qui en achète, on l’inscrit : Ferros tient des listes. Ici, rien ne s’écrit.

- « Voyons tes cristaux. » → **fin** _(ouvre le Troc)_
- « Que fait un cristal de forge ? » → forge
- _(si repère « rumeur-part-de-dorna »)_ _(sans repère « cristal-dorna-achete »)_ « Je viens de la part de Dorna. » → dorna
- « Au revoir. » → **fin**

### forge

> — Il chauffe, il mord, il brûle : les Flammes forgées. Les pyromanciens en font des prières, les technomanciens des machines. Toi, fais-en ce que tu veux, mais pas sous le nez d’un patrouilleur.

- « Voyons tes cristaux. » → **fin** _(ouvre le Troc)_
- _(1 marque du cristal ou plus)_ « Tu regardes mes veines. » → veines
- _(si l’on porte « Éclats de cristal »)_ « Tu rachètes des éclats ? » → eclats
- « Merci. » → **fin**

### eclats

> Elle fait rouler les éclats dans sa paume noire. — Un cristal forcé jusqu’à la fente. Celui qui le portait a les veines qui brillent, je parie. Moi, je ne pose pas de questions : vingt Fers, et je les retaille en perles pour les riches.

- « Vendus. » → **fin** _(reprend 1 × « Éclats de cristal », +20 Fers)_
- « Je les garde. » → **fin**

### veines

> — Tu forces. Ça se voit d’ici. J’en ai connu un, aux Forges, qui forçait chaque soir pour tenir sa cadence. À la fin, sa peau sonnait comme du verre, et il ne parlait plus qu’à son cristal. Les Druides Verts savent reprendre ça. Pas nous.

- « Voyons tes cristaux. » → **fin** _(ouvre le Troc)_
- « Merci. » → **fin**

### dorna

> La tailleuse pose son burin, longtemps. — Dorna. … Un cristal de forge, alors : cent vingt-cinq Fers, la moitié du prix. Et tu ne le portes pas devant les visières rouges.

- **[125 Fers]** « Payer cent vingt-cinq Fers. » → dorna-achete _(−125 Fers, donne 1 × « Cristal de forge », retient « cristal-dorna-achete »)_
- « Pas maintenant. » → accueil

### dorna-achete

> Elle enveloppe le cristal dans un chiffon noir. — Dis à Dorna que la tente est toujours là. Elle comprendra.

- « Merci. » → **fin**

### usure

> Elle prend ton cristal entre deux doigts noirs et le fait sonner contre son ongle. — Il chante faux. Tu l’as trop fait travailler. Vingt Fers, et je te le réaccorde : une heure de burin.

- **[20 Fers]** « Le faire réaccorder. » → reaccorde _(−20 Fers, réaccorde le cristal porté)_
- « Autre chose. » → accueil

### reaccorde

> Le burin tinte, longtemps. Quand elle te le rend, le cristal est tiède, et il chante juste. — Ménage-le. Les cristaux, c’est comme les gens d’en bas : ça s’use sans se plaindre, puis ça casse.

- « Merci. » → **fin**

## Tam Orvel

_Riveteur des Forges-Basses_

Commence par : « apres-masques » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « masques-forges »)_, sinon « decision » _(si quête « Le registre du Puits Trois » en cours)_ _(si repère « dask-parrain »)_, sinon « parle » _(si quête « Le registre du Puits Trois » en cours)_, sinon « accueil »

### accueil

> Un jeune homme maigre tousse dans sa manche, près du registre, puis cache vite la manche. — Tu lis le registre ? Personne ne le lit vraiment. On y cherche son nom, ou celui d’un autre, et on se tait.

- « Pourquoi caches-tu ta manche ? » → toux
- « Bonne journée. » → **fin**

### toux

> — Parce qu’il y a du noir dedans. Tout le monde en a, ici, au bout de quelques années. Moi, j’ai trouvé comment en avoir moins. Personne n’a rien demandé.

_Si Liane voyage avec toi :_ Liane écoute la toux, le front plissé. — Du noir dans les poumons. Mes herbes n’y peuvent rien ; l’air d’en haut, peut-être.

_Si Boulon voyage avec toi :_ Boulon : — Je porte des malles depuis la gare jusqu’aux Manufactures. Là-haut, personne ne tousse. Je l’avais remarqué. Je ne savais pas que c’était une injustice.

- _(sans repère « tam-ausculte »)_ _(sans repère « tam-ausculte-rate »)_ **🎲 Médecine 12** « Montre-moi. Et respire. » → ausculte, ✗ → ausculte-rate
- « Bonne journée. » → **fin**

### ausculte-rate

_Effet : retient « tam-ausculte-rate »._

> Tam respire, tu écoutes. Ça siffle, ça grince, ça racle, et tu ne sais pas lire ce bruit-là. — Pas grave, dit-il. Personne ne sait.

- « Bonne journée. » → **fin**

### parle

_Effet : retient « tam-ecoute »._

> — Ma mère t’a parlé. Évidemment. Le masque : du feutre, du charbon de bois, trois lanières. Si je le déclare, il monte avec moi : une Innovation des Manufactures, vendue aux fonderies, qui n’en achèteront jamais pour des Ouvriers.

- « Et si tu restes ? » → reste
- « Ta mère veut que tu vives. » → vivre
- « Je reviendrai. » → **fin**

### reste

> — Si je reste, je donne les plans à qui saura les coudre, et toute la file respire mieux. Moi, peut-être pas assez longtemps. Mon père disait : « Un rivet tient parce qu’il est tout en bas. » Je ne veux pas devenir un de ceux qui regardent d’en haut.

- _(sans repère « plans-confies »)_ _(sans repère « dask-nom »)_ « Ragna Cendrefer pourrait les coudre. » → hedda
- « Je comprends. » → **fin**

### vivre

> — Ma mère veut que je respire. Moi aussi, figure-toi. Mais je ne vois pas la différence entre monter et partir. Elle non plus, et elle le sait. Va voir Dask, si tu veux. Je déciderai quand il y aura quelque chose à décider.

- « Monte ou pars : là-haut, au moins, tu cracheras moins noir. » → vivre-dur
- « Bien. » → **fin**

### hedda

> — Cendrefer ? L’atelier de la Compagnie, la sœur du marchand de Gardebois ? Elle n’est d’aucune de nos castes. Elle coudrait, peut-être. Mais une Innovation non déclarée, c’est une faute : c’est toi qui porterais les plans.

- « Donne-les-moi. » → plans _(donne 1 × « Plans du masque de Tam », retient « plans-confies », avis de Boulon +1)_
- « Pas encore. » → **fin**

### plans

> Il sort de sa veste un papier plié en quatre, gris de suie. — Les plans. Si on te les trouve, dis que tu les as volés. Ça vaudra mieux pour ma mère.

- « Je les porte à Ragna. » → **fin**

### decision

> — Dask signe, alors. Mon nom au registre, le convoi de l’aube, l’air qui se respire. Et le masque devient le sien, ou celui des Manufactures. Dis-moi ce que tu ferais. Je t’écoute ; mais c’est moi qui monte, ou pas.

- _(sans repère « faux-bancal »)_ « Monte. Pour ta mère, et pour tes poumons. » → monte _(retient « tam-monte », termine la quête « Le registre du Puits Trois », +50 XP)_
- _(si repère « faux-bancal »)_ « Monte. Pour ta mère, et pour tes poumons. » → monte _(retient « tam-arrete », termine la quête « Le registre du Puits Trois », +20 XP)_
- _(sans repère « dask-nom »)_ « Reste, et donne le masque à ceux d’en bas. » → masques-choix _(avis de Boulon +1)_
- « Je ne sais pas. » → **fin**

### monte

> Tam regarde longtemps la file, puis le registre. — D’accord. Pour elle. Il crache dans la poussière, noir, et sourit presque. — Là-haut, je penserai à vous. Au début, en tout cas. C’est ce qu’ils disent tous.

- « Bonne route, Tam. » → **fin**

### masques-choix

> — Alors c’est dit. Il te tend un papier plié en quatre, gris de suie. — Les plans, pour Cendrefer. Ma mère ne te le pardonnera pas. Moi, je te remercierai chaque fois que je tousserai.

- _(sans repère « plans-confies »)_ « J’y vais. » → **fin** _(donne 1 × « Plans du masque de Tam », retient « plans-confies »)_
- _(si repère « plans-confies »)_ « J’ai déjà les plans. J’y vais. » → **fin**
- « Attends, je réfléchis encore. » → decision

### apres-masques

> Tam porte un masque de feutre, comme toute la file. Il tousse toujours, mais il rit. — La moitié des Forges en porte. L’inspecteur de zone a demandé d’où ça venait. Tout le monde a répondu : « De nulle part. » C’est beau, nulle part.

- « Prends soin de toi. » → **fin**

### ausculte

_Effet : retient « tam-ausculte », +10 XP._

> Tu écoutes son dos. Ça siffle, tout en bas, comme une forge qu’on étouffe. — Alors ? Tu peux le dire, tout le monde le sait, ici. Le masque ralentit le noir. Il ne le chasse pas.

- « Bonne journée. » → **fin**

### vivre-dur

> Tam rit, et tousse. — C’est le meilleur argument qu’on m’ait fait. Et le plus laid.

- « Bien. » → **fin**

## L’Ancien Thalorin

_Voix de Gaïa_

Commence par : « apres » _(si quête « L’audience » terminée)_, sinon « enquete » _(si quête « L’audience » en cours)_ _(si repère « audience-tenue »)_ _(sans repère « fouille-elucidee »)_, sinon « accueil »

### accueil

> La dryade ressemble à un jeune arbre qui aurait décidé de s’asseoir ; ses cheveux sont des feuilles. — Je suis Thalorin, Voix de Gaïa. J’écoute les arbres pour ceux qui n’ont plus le temps de le faire.

- « Qu’est-ce que la Voix de Gaïa ? » → role
- « Un arbre qui arbitre. Et quand vous n’êtes pas d’accord avec vous-même ? » → ironie
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

### ironie

> La dryade rit, et ses feuilles bruissent. — Alors je pousse de travers, pendant cent ans. Le Bosquet est plein de mes hésitations.

- « Qu’est-ce que la Voix de Gaïa ? » → role
- « Que la sève coule. » → **fin**

## Tiven

_Jeune Nacellier_

Commence par : « gueri » _(si repère « tiven-soigne »)_, sinon « quete » _(si quête « Un prêt de la Terre » en cours)_, sinon « blesse »

### blesse

> Un jeune Nacellier souffle sur ses paumes rougies. — Une corde a filé entre mes mains. Ça brûle. Demain, je dois monter la nacelle, et je ne peux même pas fermer le poing.

- _(si l’on porte « Bandage »)_ _(sans repère « tiven-panse »)_ « Panser ses mains avec un bandage. » → panse _(reprend 1 × « Bandage », retient « tiven-panse », +5 XP)_
- _(sans repère « tiven-panse »)_ _(sans repère « tiven-brulure-rate »)_ **🎲 Médecine 13** « Soigner la brûlure : de l’eau froide, de la graisse propre, un linge serré. » → panse-medecine, ✗ → panse-rate _(retient « tiven-panse », +10 XP, avis de Liane +1)_
- « Courage, Tiven. » → **fin**

### panse-rate

_Effet : retient « tiven-brulure-rate »._

> Tu serres le linge trop tôt, sur une peau trop chaude. Tiven grimace et retire ses mains. — Laisse. Ça ira.

- « Courage, Tiven. » → **fin**

### quete

> Tiven tend ses paumes rougies. — C’est Vanel qui t’envoie ? Il dit que les cristaux écoutent mieux que les herboristes. Moi, je veux juste pouvoir fermer le poing demain.

- « Poser le cristal de Vie sur ses mains. » → soin _(lance « Guérison naturelle », retient « tiven-soigne », +15 XP, avis de Liane +2)_
- _(si l’on porte « Bandage »)_ _(sans repère « tiven-panse »)_ « Panser ses mains avec un bandage. » → panse _(reprend 1 × « Bandage », retient « tiven-panse », +5 XP)_
- _(sans repère « tiven-panse »)_ _(sans repère « tiven-brulure-rate »)_ **🎲 Médecine 13** « Soigner la brûlure : de l’eau froide, de la graisse propre, un linge serré. » → panse-medecine, ✗ → panse-rate _(retient « tiven-panse », +10 XP, avis de Liane +1)_
- « Je reviens. » → **fin**

### soin

> Le cristal tiédit sous tes doigts, puis verdit, d’un vert de jeune feuille. Une chaleur passe de tes mains aux siennes. Tiven ferme le poing, l’ouvre, le referme. — Ça ne brûle plus ! Va le dire à Vanel.

- « Prends soin de tes mains. » → **fin**

### panse

> Tu serres le bandage avec soin. — Merci. Ça brûle encore, mais je pourrai tenir une corde.

- « Ménage-toi. » → **fin**

### gueri

> Tiven te montre des paumes roses et neuves. — Regarde ! Aujourd’hui, j’ai déjà monté trois nacelles. Remercie Vanel pour moi.

- « Bon courage. » → **fin**

### panse-medecine

> Tu rinces, tu graisses, tu serres. Tiven grimace, puis souffle. — Ça tire, mais ça ne brûle plus. Où est-ce qu’on apprend ça ?

- « Ménage-toi. » → **fin**

## Tobias Cendrefer

_Marchand de Ferros_

Commence par : « accueil-passe » _(si repère « laissez-passer »)_, sinon « accueil »

### accueil

> Approche, approche ! Étal Cendrefer : outils de Ferros, cordes, lampes à cristal, tout au prix juste. Le juste, c’est le mien. Les rumeurs, je les donne : elles font vendre les lampes.

- _(si quête « Le Dernier Train » en cours)_ _(sans repère « laissez-passer »)_ « Je dois entrer sur le chantier de la Gare Engloutie. » → chantier
- « Voir l’étal. » → **fin** _(ouvre le Troc)_
- « Que racontent les gens, au marché ? » → rumeurs
- « Au revoir. » → **fin**

### accueil-passe

> Approche, approche ! Étal Cendrefer : outils de Ferros, cordes, lampes à cristal, tout au prix juste. Le juste, c’est le mien. Les rumeurs, je les donne : elles font vendre les lampes.

- « Merci encore pour le laissez-passer. » → merci
- « Voir l’étal. » → **fin** _(ouvre le Troc)_
- « Que racontent les gens, au marché ? » → rumeurs
- « Au revoir. » → **fin**

### rumeurs

> Que des gens voient des trains et des flammes. La veuve du meunier a mis le feu à sa grange pour éteindre celui qu’elle voyait. Les Verdantins accusent Ferros, forcément. Moi, je dis que la peur fait vendre les rumeurs, et pas les lampes.

- « Voir l’étal. » → **fin** _(ouvre le Troc)_
- « Parlons d’autre chose. » → accueil
- _(si repère « rumeur-arbalete-convoi »)_ _(sans repère « arbalete-convoi-achetee »)_ « Et ces arbalètes « tombées d’un convoi » ? » → arbalete
- « Au revoir. » → **fin**

### chantier

> Le chantier ? C’est l’ingénieure Ingrid Brisefer qui le dirige. Personne n’y entre sans laissez-passer. Il se trouve que j’en ai un, qui m’a coûté cher.

- _(sans repère « tobias-sourire »)_ **🎲 Diplomatie 10** « Si ce chantier rend le marché malade, tes clients partiront. M’aider, c’est aider tes affaires. » → convaincu, ✗ → prix-sourire _(retient « laissez-passer », +25 XP)_
- « Combien en veux-tu ? » → prix
- _(si repère « tobias-sourire »)_ « Trente-cinq Fers, tu avais dit. » → prix-sourire
- « Je trouverai un autre moyen. » → **fin**

### prix-sourire

_Effet : retient « tobias-sourire »._

> Tobias rit, franchement. — Joli. Tu as presque la voix de ma sœur. Pas tout à fait. Trente-cinq Fers, pour le sourire, et pas un de moins.

- **[35 Fers]** « Payer trente-cinq Fers. » → achete _(−35 Fers, retient « laissez-passer »)_
- « Je reviendrai avec la somme. » → **fin**

### prix

> Cinquante Fers, et c’est un prix d’ami. Ne fais pas cette tête : à Ferros, tout se paie, même l’amitié.

- **[50 Fers]** « Payer cinquante Fers. » → achete _(−50 Fers, retient « laissez-passer »)_
- « Je n’ai pas cette somme. » → chantier
- « Au revoir. » → **fin**

### convaincu

> Tu marchandes en Ferrien, toi. Tiens, prends-le. Et si Brisefer te pose la question, tu ne l’as pas eu de moi.

- « Promis. » → **fin**

### merci

> Fais-en bon usage. Et si tu croises Brisefer, dis-lui que l’étal Cendrefer vend des lampes qui ne s’éteignent pas sous terre.

- « Au revoir. » → **fin**

### achete

> Tobias compte les pièces deux fois. — Prix d’ami. Et si Brisefer te pose la question, tu ne l’as pas eu de moi.

- « Merci, Tobias. » → **fin**

### arbalete

> Tobias regarde à droite, à gauche, puis soulève une toile sous l’étal. — Trente-cinq Fers. Elle est neuve, elle tire droit, et elle n’a jamais existé.

- **[35 Fers]** « Payer trente-cinq Fers. » → arbalete-achetee _(−35 Fers, donne 1 × « Arbalète de Ferros », retient « arbalete-convoi-achetee »)_
- « Non merci. » → accueil

### arbalete-achetee

> — Et si ma sœur te demande d’où elle vient, tu l’as trouvée sur la route.

- « Promis. » → **fin**

## Un trou de fouille

_Objet_

Commence par : « trou »

### trou

> Un trou carré, étayé de planches neuves, au bord d’une vieille voie à demi enfouie sous les racines. Des outils de Ferros traînent encore à côté.

- « Regarder au fond. » → fond
- _(sans repère « outils-rate »)_ **🎲 Investigation 11** « Examiner les outils. » → outils, ✗ → outils-rien
- « Éclairer le fond du trou d’un cristal. » → outils _(lance « Lueur »)_
- « Partir. » → **fin**

### outils-rien

_Effet : retient « outils-rate » pour 1 jours._

> Des pelles, une pioche, une lanterne éteinte. De Ferros, sans doute. Rien de plus, pour aujourd’hui.

- « Regarder au fond. » → fond
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

- **🎲 Athlétisme 13** « Le bousculer, et filer dans le noir du tunnel. » → force-passage, ✗ → rattrape
- « Reculer. » → **fin**

### force-passage

_Effet : retient « cendriere-ouverte »._

> Tu passes sous son bras et tu cours. Derrière toi, des jurons, un sifflet, puis plus rien : le tunnel avale tout.

- « Entrer. » → **fin** _(mène à « Ironheart — La Cendrière »)_

### rattrape

_Effet : −3 PV._

> Il te rattrape par le col et te jette sur le ballast. — La prochaine fois, j’appelle les autres.

- « Reculer. » → **fin**

## Vanel Lentefeuille

_Druide Vert, au Bosquet des Échos_

Commence par : « retour » _(si quête « Un prêt de la Terre » en cours)_ _(si repère « tiven-soigne »)_, sinon « eclats » _(si l’on porte « Éclats de cristal »)_ _(sans repère « vanel-eclats-vus »)_, sinon « marques » _(1 marque du cristal ou plus)_ _(sans repère « vanel-a-vu-marques »)_, sinon « usure » _(si le cristal porté a servi 6 fois ou plus sans être réaccordé)_, sinon « apres » _(si quête « Un prêt de la Terre » terminée)_, sinon « attente » _(si quête « Un prêt de la Terre » en cours)_, sinon « accueil »

### accueil

> Un druide en robe verte pose la main sur l’écorce du grand arbre, comme on prend un pouls. — Racines profondes. Je suis Vanel, Druide Vert. La magie est un prêt de la Terre : on ne la prend pas, on l’emprunte.

- _(si quête « Un prêt de la Terre » pas commencée)_ « Apprends-moi. » → apprendre
- « Qu’est-ce qu’un cristal de Résonance ? » → cristal
- _(1 marque du cristal ou plus)_ « Mes veines brillent, sous le cristal. » → marques
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

> — Alors tu sauras ce que coûte la magie. Quand le cristal n’a plus rien à donner, c’est toi qui paies : le nez qui saigne, d’abord. Force souvent, et il te marque : les veines qui s’allument, le manque, la peau qui durcit. Le sommeil efface la fatigue. Pas les marques.

- _(1 marque du cristal ou plus)_ « Reprends mes marques. » → marques
- « Compris. » → **fin**

### attente

> Vanel ne quitte pas l’arbre des yeux. — Tiven t’attend à la Grande Nacelle, près du débarcadère. Le cristal au cou, d’abord : on n’entend pas une pierre qui dort au fond d’un sac.

- « Et si je force trop ? » → prix
- « J’y vais. » → **fin**

### retour

_Effet : termine la quête « Un prêt de la Terre », +40 XP, apprend un rang de Résonance._

> Vanel sourit avant que tu parles. — Je l’ai entendu d’ici, et l’arbre aussi. Garde le cristal : ce n’est pas un don, c’est un prêt. Tu le rendras en soignant à ton tour.

- « Qu’apprend-on ensuite ? » → lueur
- « Et à Ferros ? » → ferros
- « Merci, Vanel. » → **fin**

### lueur

> — La Lueur. Tous les cristaux savent briller : pense à une lanterne, et le tien s’allume de sa couleur. Dans le noir, il montre ce que l’ombre cache. Pour le feu, il faut un cristal de forge, et ce n’est pas un druide qui te l’apprendra.

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

### marques

_Effet : retient « vanel-a-vu-marques »._

> Vanel prend ton poignet et le tourne vers la lumière. Sous la peau, les veines luisent. — Tu as forcé. La Terre peut reprendre ce que tu lui as trop pris ; elle reprendra aussi un peu de ce que tu sais faire. C’est le prix, et personne ne le paie à ta place.

- « Reprends-les. » → effacees _(efface les marques du cristal (et un rang de Résonance))_
- « Je les garde. » → gardees

### effacees

> Il pose une main sur le cristal, l’autre sur ta poitrine. Une chaleur, puis un froid : la sève qui redescend. — Voilà. Tu en sais un peu moins ; tu vivras un peu plus longtemps. Que la sève coule.

- « Merci, Vanel. » → **fin**

### gardees

> — Comme tu veux. Mais écoute : j’ai connu des Guérisseurs Verts qui forçaient chaque soir, pour sauver un malade de plus. À la fin, ils ne parlaient plus qu’à leur pierre. Reviens avant.

- « Je reviendrai. » → **fin**

### eclats

_Effet : retient « vanel-eclats-vus »._

> Vanel regarde les éclats dans ta main, longtemps. — Un cristal qui se fend, c’est un cristal qu’on a trop serré. La Terre ne prête pas deux fois la même pierre. Donne-les-moi : je les rendrai au pied de l’arbre.

- « Les lui donner. » → eclats-rendus _(reprend 1 × « Éclats de cristal »)_
- « Je les garde. » → **fin**

### eclats-rendus

> Il creuse entre deux racines avec les doigts, y couche les éclats, referme la terre. — Sévane vend des cristaux, au Comptoir. Mais va doucement, cette fois.

- « Merci, Vanel. » → **fin**

### usure

> Vanel pose l’oreille contre ton cristal, les yeux fermés. — Il est fatigué, pas cassé. La Terre ne vend pas ses soins. Reste la nuit au Bosquet, près des noms gravés : au matin, il chantera juste.

- « Rester la nuit au Bosquet. » → reaccorde _(attend le matin, réaccorde le cristal porté)_
- « Autre chose. » → accueil

### reaccorde

> Tu dors mal, entre les racines, avec des voix qui ne sont pas les tiennes. Au matin, ton cristal est tiède, et il chante juste. Vanel est déjà parti.

- « Repartir. » → **fin**

## Varka

_Cheffe d’équipe, Travailleurs du Rail_

Commence par : « lanterne » _(si quête « La lanterne du triage » en cours)_ _(si l’on porte « Lanterne de chef de gare »)_, sinon « apres-rail » _(si repère « rail-travailleurs »)_, sinon « apres-bureau » _(si repère « rail-bureau »)_, sinon « apres-marches » _(si repère « rail-marches »)_, sinon « verdict » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « verite-rail »)_, sinon « enquete » _(si quête « Le Rail des Cendres » en cours)_, sinon « accueil »

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

> Varka écoute jusqu’au bout. — Une machine sans homme, des pilleurs des Marches, et l’un des nôtres qui ouvre le levier. Que fait-on ?

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

- _(si quête « La lanterne du triage » pas commencée)_ _(sans repère « membre-marches-cendres »)_ « Je voudrais être des vôtres. » → serment
- « Au revoir. » → **fin**

### apres-bureau

> Varka ne lève pas les yeux du brasero. — Le Bureau a pris la machine, et Joss avec. « Sabotage d’un secteur stratégique. » Ici, ça s’appelle trahison, et la trahison, c’est la mort. Merci quand même.

- « Au revoir. » → **fin**

### apres-marches

> — Joss. On l’a trouvé à l’aube entre deux wagons, les mains encore noires de graisse. Les Marches ne laissent ni dette ouverte, ni témoin. Toi, tu as pris leur argent. Passe ton chemin.

- « … » → **fin**

### garde

> — Cache-toi près du levier de l’embranchement, à la nuit tombée. Mes gars resteront au dépôt : s’il y a du grabuge, crie fort. Et pas d’imprudence.

- « Entendu. » → enquete

### serment

> Varka te regarde longtemps. — Chez nous, on n’entre pas avec des mots. Le triage a perdu sa lanterne de chef de ligne le jour où le dernier est mort sous un convoi. Il en dort une au Dépôt Sept, au deuxième niveau. Rapporte-la : elle brillera au poste.

- « J’irai la chercher. » → **fin** _(lance la quête « La lanterne du triage », retient « connait-depot-sept »)_
- « Pas maintenant. » → **fin**

### lanterne

_Effet : reprend 1 × « Lanterne de chef de gare », termine la quête « La lanterne du triage », retient « membre-travailleurs-rail », +40 XP._

> Varka prend la lanterne à deux mains, comme on porte un enfant, et l’accroche au poste d’aiguillage. — Le rail est une promesse collective. Te voilà Graisseur, comme tout le monde au début.

- « Merci, Varka. » → **fin**

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

> — On m’appelle la Veilleuse. Je garde la vieille ligne et sa machine, pour les Travailleurs du Rail. Tout le monde la dit maudite. Moi, je dis qu’elle attend.

- « Elle attend quoi ? » → trains
- « Au revoir. » → **fin**

### trains

> — Toujours le même convoi, sans conducteur. Je l’entends avant qu’il passe. Mes parents l’ont pris, un soir, quand j’étais petite, et ne sont jamais revenus. Je garde la machine. Au cas où il les ramènerait.

_Si Boulon voyage avec toi :_ Boulon, très bas : — Moi aussi, je compte. Les voyageurs. Chacun a un poids différent, même ceux qui ne reviennent pas.

- **[Mémoire 3]** « Laisse-moi écouter avec toi. » → ecoute
- _(si repère « echo-voie-tunnel-combe »)_ _(si quête « La Clé de Rouille Bleue » en cours)_ _(sans repère « cle-obtenue »)_ « Dans la Combe, des hommes ont entendu ton train, avant la Chute. » → combe
- « Merci de me l’avoir dit. » → **fin**

### combe

> La Veilleuse cesse de compter. — Avant la Chute ? Alors il roulait déjà, et d’autres l’entendaient. Je ne suis pas folle, ou nous sommes plusieurs à l’être. Elle ouvre la main sur la clé.

- « Prendre la clé. » → don

### ecoute

_Effet : retient le Récit « Le convoi sans conducteur »._

> Vous écoutez ensemble. Un convoi passe, translucide, bleu pâle bordé d’or. Aux fenêtres, des visages tranquilles ; aucun n’a peur. La Veilleuse serre ton bras. — Tu les as vus sourire ? Alors ils ne souffrent pas.

- _(si repère « kaelis-parle »)_ _(si quête « La Clé de Rouille Bleue » en cours)_ « Et la clé, à ton cou ? » → don
- « Merci de m’avoir laissé écouter. » → **fin**

### question-cle

> La Veilleuse compte ses wagons à mi-voix. Au creux de sa main, une clé couverte d’une rouille bleue, douce comme de la mousse. — Elle chante quand le convoi approche. Kaelis t’envoie ? Il n’aura pas ma clé.

_Si Liane voyage avec toi :_ Liane, doucement : — Elle attend ce train depuis qu’elle est petite. Ne lui prends pas ça pour cent Fers.

_Si Boulon voyage avec toi :_ Boulon se penche vers la clé ; ses yeux de verre clignent, lentement. — Une clé de malle. J’en ai porté dix mille. Celle-là, on l’a tenue longtemps, et on a eu peur de la lâcher.

- _(si Récit « Le savant du dernier quai » connu)_ « J’ai vu le dernier train, moi aussi, dans l’Écho de la Gare Engloutie. » → don
- **[Mémoire 3]** « Laisse-moi écouter le convoi avec toi. » → ecoute
- « Lui parler de ce que la clé ouvre. » → ouvre
- « Et si je te laissais une histoire, contre la clé ? » → echange

### don

_Effet : donne 1 × « Clé de rouille bleue », retient « cle-obtenue », +25 XP._

> La Veilleuse ouvre la main. — Prends-la. Elle te parlera mieux qu’à moi. Mais si tu découvres ce qu’elle ouvre, reviens me le dire. Promis ?

- « Promis. » → **fin**

### avec-cle

> — Alors, cette clé ? Elle chante encore ?

- « Te la rendre : sa place est sur la ligne. » → rendue _(reprend 1 × « Clé de rouille bleue », retient « cle-veilleuse », termine la quête « La Clé de Rouille Bleue », +60 XP)_
- _(sans repère « cle-etudiee »)_ _(sans repère « cle-etude-ratee »)_ **🎲 Érudition 12** « L’étudier d’abord avec toi. » → etude, ✗ → etude-ratee
- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Pas encore. » → **fin**

### etude-ratee

_Effet : retient « cle-etude-ratee »._

> Vous penchez la tête sur la clé, longtemps. Elle chante une note, toujours la même, et tu n’en tires rien que tu saches écrire. La Veilleuse hausse les épaules. — Elle parle aux trains. À nous, elle ne doit rien.

- « Revenir à la clé. » → avec-cle
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

> — Tu as fait ton choix, avec la clé. Je l’entends parfois, loin d’ici. Elle chante encore. Prends soin de toi.

- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Au revoir. » → **fin**

### ouvre

> — Ce qu’elle ouvre ? Tout le monde veut le savoir. Personne ne veut l’écouter.

- _(sans repère « veilleuse-mefiante »)_ **🎲 Diplomatie 12** « Kaelis la vendrait. Moi, je veux savoir ce qu’elle ouvre, et pourquoi on fouille vos gares. » → don, ✗ → ouvre-mefiance
- _(si repère « fonds-zero-connu »)_ « Aux Archives, un coffre de fer attend sa clé depuis la fondation : le Fonds Zéro. » → don
- _(si quête « Le Rail des Cendres » en cours)_ _(sans repère « indice-veilleuse »)_ « Les convois du triage, qui partent seuls la nuit ? » → convois-triage
- « Je reviendrai. » → **fin**

### ouvre-mefiance

_Effet : retient « veilleuse-mefiante »._

> — Savoir, toujours savoir. La Veilleuse referme la main sur la clé. — Kaelis aussi voulait savoir. Il a fini par donner un prix.

- « Autre chose. » → ouvre
- « Je reviendrai. » → **fin**

### convois-triage

_Effet : retient « indice-veilleuse », +5 XP._

> — Ce ne sont pas mes trains. Mes trains chantent. Ceux-là ne respirent pas : pas de vapeur, juste un cliquetis de cristal. Une machine sans homme, comme on en envoyait vers l’ouest, au temps de la Guerre du Rail.

- « Merci. » → **fin**

### echange

> — Une histoire contre ma clé ? Ça dépend de l’histoire. Il faut qu’il y passe un train.

- « Lui laisser une de tes histoires. » → echange 📖 donner un Récit : trains → don-histoire ; autres → pas-trains (refusé)
- « Je reviendrai. » → **fin**

### don-histoire

> La Veilleuse écoute les yeux fermés, en comptant tout bas. À la fin, elle répète la dernière phrase, deux fois, pour la garder. — Celle-là, je la raconterai au convoi. Elle ouvre la main : la clé est là.

- « Prendre la clé. » → don

### pas-trains

> — Elle est belle. Mais il n’y passe aucun train, et c’est un train que j’attends.

- « Une autre, alors. » → echange
- « Je reviendrai. » → **fin**

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

> Alors bienvenue, simplement. Regarde où tu mets les pieds : ce qui tombe d’ici, la forêt le garde. L’an dernier, c’était un petit des Jeunes-Pousses. On a gravé son nom, puis réparé un garde-corps : celui des Citoyens-Arbres.

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

> Tu sais la nouvelle ? Quelqu’un a forcé le grenier des semences, là-haut. Voler des graines à Canopéa, c’est voler les arbres de demain. Si tu vois quelque chose, préviens le Conseil.

- « Je garderai les yeux ouverts. » → **fin** _(retient « veline-vol-dit »)_

### descente

> Malo t’a parlé de la sacoche, n’est-ce pas ? Je l’ai vue tomber. Descendre sur le Sol des Racines, ce n’est pas rien : le sol est sacré.

- _(sans repère « descente-autorisee »)_ « Je peux la chercher, si tu me descends. » → permission
- _(si repère « descente-autorisee »)_ « Redescends-moi, s’il te plaît. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Pas maintenant. » → **fin**

### permission

_Effet : retient « descente-autorisee »._

> Les lettres des Nacelliers, c’est sacré aussi, à sa façon. Bon. Je te descends. Ne prends rien d’autre que la sacoche, ne grave rien, et remonte par la même nacelle.

- « Allons-y. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Un instant. » → **fin**

### descente-anselme

> Une branche de l’arbre d’Anselme, pour une flûte ? Aïlis sera heureuse. Le sol est sacré, mais une branche tombée, la forêt la donne. Je te descends. Ne prends que celle-là.

- « Allons-y. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- « Pas maintenant. » → **fin**

### descente-conseil

> Le Gardien de la Canopée m’a fait porter un mot : tu peux descendre autant qu’il le faudra. Je n’aime pas ça. Le sol sacré qui fait taire le Bosquet, ça ne s’est jamais vu.

- « Descends-moi. » → **fin** _(mène à « Canopéa — Le Sol des Racines »)_
- _(si quête « Les graines qui manquent » pas commencée)_ _(sans repère « vol-grenier »)_ « Quoi de neuf, à la nacelle ? » → graines-souci _(lance la quête « Les graines qui manquent »)_
- « Pas maintenant. » → **fin**

### graines-souci

> Rien de bon. Il manque une dizaine de sacs au grenier des semences, depuis une lune. Et je crois qu’ils sont passés par ma nacelle, sous les bâches d’un marchand. Je n’ai rien vu, ou pas assez. Trouve qui, s’il te plaît.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### graines-piste

> Lisandre, au Nid : tous les marchands y dorment, et elle entend tout. Et le grenier lui-même, aux Hautes Ramures, s’il te laisse entrer.

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

> Véline te regarde un long moment. — Bien. Alors aide-moi à trouver qui. En attendant, c’est la gardienne du grenier qu’on soupçonne : une Jeune-Pousse qui dort sur une échelle de corde. Si elle paie pour un autre, on la bannira.

- « Je vais chercher. » → **fin**
- « Qui pourrait savoir ? » → graines-piste

### graines-merci

> Les sacs sont revenus au grenier ! La ville en parle à chaque passerelle. Tu as rendu à Canopéa ses arbres de demain.

- « Que la sève coule. » → **fin** _(retient « veline-graines-dit »)_

### graines-tant-pis

> Les sacs ne sont jamais revenus. Tant pis. Merci d’avoir cherché. On dit au Nid qu’un marchand a payé une tournée à tout le monde, l’autre soir. Drôle de hasard.

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

> Une locomotive de l’Ancien Monde, rouge de rouille, et pourtant astiquée pour une fête qui ne vient pas. Sur la cabine, quelqu’un a peint neuf petits wagons.

- **[Mémoire 4]** « Poser la main sur le métal. » → souvenir
- _(sans repère « capot-vu »)_ _(sans repère « capot-rate »)_ **🎲 Artisanat 12** « Ouvrir le capot. » → capot, ✗ → capot-coince _(retient « capot-vu », +10 XP)_
- « Partir. » → **fin**

### capot-coince

_Effet : retient « capot-rate » pour 1 jours._

> Le capot tient par trois boulons soudés de rouille. Tu forces ; ton outil cède avant eux.

- « Revenir à la machine. » → machine
- « Partir. » → **fin**

### souvenir

> Le métal se souvient d’une main : celle d’une femme qui chante en conduisant, très loin d’ici, il y a très longtemps.

- « Retirer la main. » → **fin**

### capot

> Des joints neufs, de l’huile du jour, des boulons serrés à la main. Quelqu’un l’entretient en secret, comme on soigne un cheval qu’on n’a plus le droit de monter.

- « Refermer le capot. » → **fin**

## Un voyageur égaré

_Voyageur_

Commence par : « merci » _(si repère « rencontre-voyageur-aide »)_, sinon « accueil »

### accueil

> Ah, enfin quelqu’un ! Je cherche Gardebois depuis deux jours. Cette carte dit que c’est par là, ou par là ?

- « Ta carte est à l’envers. » → aide _(retient « rencontre-voyageur-aide », +5 Fers, +10 XP)_
- « Je ne peux pas t’aider. » → **fin**

### aide

> Il retourne sa carte, rougit, puis éclate de rire. — Tant de chemin pour rien ! Merci. Tiens, ce n’est pas grand-chose, mais c’est de bon cœur.

- « Bonne route ! » → **fin**

### merci

> Le voyageur te fait un grand signe. — Cette fois, je tiens la carte dans le bon sens !

- « Bonne route ! » → **fin**
