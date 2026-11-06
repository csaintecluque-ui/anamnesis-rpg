# Dialogues — texte à relire

Document **généré** à partir de `src/data/dialogues/*.json` (`npm run dialogues`) : ne pas le modifier à la main.
Statut des textes (validé ou à valider) : voir `docs/univers/personnages/pnj.md`, `docs/univers/lieux/gare-engloutie.md`
et, pour Canopéa et les rencontres en voyage, `docs/univers/lieux/canopee.md` et `docs/gdd/carte-du-monde.md`.

Légende : **[Perception 4]** = test d’attribut ou de compétence (option visible mais grisée si le seuil manque) ;
_(si …)_ = option qui n’apparaît que dans cette situation ; → = où mène la réponse.
**🎲 Discrétion 10** = jet de dé (d20 + modificateur + rang contre 10) : → en cas de réussite, ✗ → en cas d’échec.
🌙 = scène de nuit (le fond s’assombrit).

## Les Abyssaux

_La grotte du Grand Reflux_

Commence par : « abyssaux »

### abyssaux

> Trois Abyssaux, des masques de coquillage noir, entourent un garçon à genoux au bord d’une faille où l’eau respire. Le plus grand récite : « Mère-Abysse, reprends tout. » Ils veulent que le novice le dise à leur place.

- « Attaquer. » → **fin** _(lance le combat « abyssaux-grotte »)_
- **🎲 Diplomatie 16** « « Tout », c’est vague. L’Abysse donne exactement ce qu’on lui demande. » → parole, ✗ → force
- **🎲 Discrétion 16** « Profiter de la prière pour emmener Lio. » → discret, ✗ → force
- « Reculer. » → **fin**

### parole

_Effet : retient « abyssaux-partis »._

> Le grand se tait au milieu du mot. Les deux autres le regardent. — Tout, ça veut dire nous aussi, dit l’un d’eux. Personne ne répond. Ils remettent leurs masques et sortent dans la marée, sans Lio.

- « Aller voir Lio. » → **fin**

### discret

_Effet : retient « lio-libre »._

> Tu te glisses le long des rochers, une main sur l’épaule de Lio, et vous reculez ensemble dans le bruit de la prière. Quand ils se retournent, la faille respire toute seule.

- « Ressortir. » → **fin**

### force

> Le grand se retourne. — Un témoin ? La Mère-Abysse aime les témoins.

- « Se battre. » → **fin** _(lance le combat « abyssaux-grotte »)_

## Des caisses marquées « E. V. »

_La soute_

Commence par : « caisses »

### caisses

_Effet : retient « achats-edda-vus »._

> Trois caisses marquées « E. V. ». Deux masques de toile, des cordes neuves, des vivres pour quatre jours. Une liste de sa main : six prénoms, six âges. Et, dans un coffret capitonné, un second cristal azur, jamais gréé.

- « Prendre le cristal. » → vol _(donne 1 × « Second cristal azur », retient « cristal-edda-vole »)_
- « Tout laisser en place. » → **fin**

### vol

> Tu glisses le cristal dans ton sac. Le coffret vide garde sa forme dans le velours. Quelqu’un le remarquera.

- « Partir. » → **fin**

## Un commis de Ferros

_Le Quai des Dirigeables_

Commence par : « accueil »

### accueil

> Un commis de Ferros, gris de la tête aux pieds, un registre sous le bras. — Holger Brandt a volé un bien de l’Empire. La Confédération rend les voleurs ; elle ne rend pas les persécutés. Je suis ici pour qu’elle fasse la différence.

- « Que contient la page ? » → page
- « Au revoir. » → **fin**

### page

> — Un registre de transferts. Rien qui vous regarde. Ferros classe tout, et ce qui est classé ne sort pas. Il sourit, sans les yeux. — Ferros n’oublie pas ceux qui l’aident. Ferros n’oublie rien.

- « Au revoir. » → **fin**

## Ahm’Ras

_Nomade pur_

Commence par : « choix » _(si quête « Les deux nombres » en cours)_ _(si repère « ahm-yel »)_, sinon « attend » _(si quête « Les deux nombres » en cours)_, sinon « apres » _(si quête « Les deux nombres » terminée)_, sinon « accueil »

### accueil

> Un homme au manteau de route usé, assis seul près du feu, les yeux plissés comme au grand vent. — Tu as entendu Thryn’vek ? Il y manque deux nombres. Moi, je les ai.

- « Comment ça ? » → chaine
- « Bonne nuit. » → **fin**

### chaine

> — Une école de la Marche des Os Blancs dit que Neth’Sara les a dits une fois, à une seule personne. Cette personne a eu une fille, qui a eu une fille. Ma grand-mère me les a mis dans la bouche, à sept ans.

- « Pourquoi les dire maintenant ? » → pourquoi

### pourquoi

_Effet : lance la quête « Les deux nombres », retient « deux-nombres-commence »._

> — J’ai soixante ans et pas d’enfant. Je veux les dire à la huitième halte, le soir où Ish’Lenne la dit. Yel’Dara ne veut pas. Va la voir, à la Tente de l’Eau, si tu veux comprendre pourquoi.

- « J’irai. » → **fin**

### attend

> — Tu as vu Yel’Dara ? Elle te dira que je mens, ou que j’ai raison, et que dans les deux cas il vaut mieux me taire.

- « Pas encore. » → **fin**

### choix

> — Alors, l’étranger. Je les dis, à la huitième halte, ou je les garde ? Tu n’es pas d’ici : c’est pour ça que je te le demande à toi.

- « Dis-les, à la huitième halte. » → dits _(termine la quête « Les deux nombres », retient « fin-deux-nombres-dits », +40 XP)_
- **🎲 Diplomatie 16** « Garde-les. Ils sont morts avec elle. » → gardes, ✗ → tetu _(termine la quête « Les deux nombres », retient « fin-deux-nombres-gardes », +40 XP)_
- _(si repère « yel-propose »)_ « Donne-les à Yel’Dara, à elle seule. » → yel _(termine la quête « Les deux nombres », retient « fin-deux-nombres-yel », +40 XP)_
- **🎲 Investigation 16** « Comment sais-tu qu’ils sont vrais ? » → doute, ✗ → vexe

### vexe

> — Tu me traites de menteur ? — Il serre les mâchoires, puis se calme. — Tu as le droit. Moi aussi, je me le demande, la nuit.

- « Pardon. » → choix

### doute

> — Je ne le sais pas. Ma grand-mère ne mentait pas. Elle se trompait, parfois. — Il hausse les épaules. — Cela ne prouve rien, comme dit la halte. Rien du tout.

- « Je comprends. » → choix

### tetu

> — Non. Tu n’es pas d’ici, et ce n’est pas toi qui les portes depuis cinquante ans.

- « Alors dis-les, à la huitième halte. » → dits _(termine la quête « Les deux nombres », retient « fin-deux-nombres-dits », +40 XP)_
- _(si repère « yel-propose »)_ « Donne-les à Yel’Dara, à elle seule. » → yel _(termine la quête « Les deux nombres », retient « fin-deux-nombres-yel », +40 XP)_

### dits

> Le soir venu, il les dit, debout devant le feu d’Ish’Lenne. Deux nombres. Personne ne les répète. Yel’Dara ferme les yeux. Ish’Lenne dit seulement : « Cela ne prouve rien. » Tu ne les retiens pas : ils ne sont pas à toi.

- « Rester près du feu. » → **fin**

### gardes

> Il se tait longtemps. — Ils mourront avec moi, alors. Comme avec elle. — Il a l’air soulagé, et il s’en veut de l’être.

- « Bonne nuit, Ahm’Ras. » → **fin**

### yel

> Au matin, pendant la distribution, il va les lui dire à l’oreille. Yel’Dara hoche la tête, une fois. Deux nombres sont rentrés dans une tête, sans passer par l’air.

- « C’est bien. » → **fin**

### apres

> Ahm’Ras, près du feu, te fait un signe de tête. Il n’en dit pas plus. Il n’a plus rien à dire, et ça lui va.

- « Bonne nuit. » → **fin**

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
- _(sans repère « raconte-ailis »)_ « Je peux te raconter une histoire, Aïlis. » → raconte-neutre 📖 raconter un Récit : saule → raconte-saule ; familles, arbres → raconte-touche ; autres → raconte-neutre
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
- _(sans repère « raconte-ailis »)_ « Je peux te raconter une histoire, Aïlis. » → raconte-neutre 📖 raconter un Récit : saule → raconte-saule ; familles, arbres → raconte-touche ; autres → raconte-neutre
- « Au revoir, Aïlis. » → **fin**

### inquiete

> Je suis allée au Bosquet hier soir. J’ai posé la main sur le nom d’Anselme. Rien. Le bois était froid. Comme s’il était parti une seconde fois.

- _(si quête « Le chant d’Anselme » terminée)_ « Vous avez encore sa chanson. » → chanson-reste
- « Parlez-moi de l’arbre où il repose. » → arbre
- « Le Triumvirat m’a demandé de comprendre. Je trouverai. » → **fin**

### chanson-reste

> Aïlis serre la flûte contre elle. — Oui. Oui, c’est vrai. Le bois du Bosquet a oublié, mais la flûte, elle, n’a rien oublié. Va, mon enfant. Trouve ce qui lui fait mal, à notre forêt.

- « Je trouverai. » → **fin**

### raconte-neutre

_Effet : retient « raconte-ailis », +5 XP._

> Aïlis écoute en tricotant, sans perdre une maille. — Tu racontes vite, comme Malo court. Ralentis : une histoire, ça se pose, ça ne se livre pas.

- « Au revoir, Aïlis. » → **fin**

### raconte-touche

_Effet : retient « raconte-ailis », +10 XP._

> Aïlis pose son tricot. — Anselme me racontait celle-là autrement. Il mettait l’arbre au début, pas à la fin. Mais la tienne est bien aussi.

- « Au revoir, Aïlis. » → **fin**

### raconte-saule

_Effet : retient « raconte-ailis », +15 XP._

> Aïlis ferme les yeux. — Un garçon sous les déblais, et une sœur qui ne dort plus. Quand Anselme est parti, je ne dormais plus non plus. On redort, un jour. Dis-le-lui de ma part.

- « Au revoir, Aïlis. » → **fin**

## Aïo Coquelune

_Plongeur de perles, dix ans_

Commence par : « lune » _(si quête « Sous une lune rouge » pas commencée)_ _(à « Coralia — la maison Coquelune »)_, sinon « accueil »

### accueil

> Un garçon de dix ans, un panier vide sous le bras. — T’as déjà plongé ? Moi, je tiens deux minutes. Ondine dit que c’est rien. Ondine en tient dix, mais elle a des branchies : c’est de la triche.

- _(si quête « Le Don rendu » en cours)_ _(sans repère « don-rendu-indice »)_ « Les plongeurs remontent ce qu’on donne à la mer ? » → bagues
- _(sans repère « raconte-aio »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-special ; familles → raconte-touche ; autres → raconte-neutre
- « Au revoir, Aïo. » → **fin**

### bagues

_Effet : retient « don-rendu-indice »._

> — Pas moi ! Je le jure sur Marethis. Mais Tadéo, aux Canaux, il a des bagues à vendre, des fois. Il dit qu’il les trouve.

- « Merci, Aïo. » → **fin**

### lune

_Effet : lance la quête « Sous une lune rouge »._

> Aïo remplit un sac de pierres pour descendre plus vite. — Cette nuit, la lune sera rouge. Les perles noires remontent sous la lune rouge. Une seule, et maman a son remède. Tu ne le diras pas, hein ?

- **🎲 Diplomatie 16** « « Ne plonge jamais seul sous une lune rouge. » » → empeche, ✗ → obstine
- **🎲 Athlétisme 16** « Je plonge avec toi. Tu ne seras pas seul. » → ensemble, ✗ → ensemble-dur
- « Combien coûte le remède ? » → prix
- « C’est ton choix. » → seul

### obstine

> — Tu parles comme Ondine. Il resserre son sac.

- **🎲 Athlétisme 16** « Je plonge avec toi. » → ensemble, ✗ → ensemble-dur
- « Combien coûte le remède ? » → prix
- « C’est ton choix. » → seul

### prix

> — Soixante Fers. Maman dit que c’est le prix d’un bateau. C’est pas vrai, mais presque.

- **[60 Fers]** « Les voilà. » → paye _(−60 Fers, +30 XP, termine la quête « Sous une lune rouge », retient « fin-lune-rouge-paye »)_
- **🎲 Athlétisme 16** « Je plonge avec toi. » → ensemble, ✗ → ensemble-dur
- « C’est ton choix. » → seul

### empeche

_Effet : +30 XP, termine la quête « Sous une lune rouge », retient « fin-lune-rouge-empeche »._

> Aïo vide son sac, pierre par pierre, sans te regarder. — D’accord. Mais demain, tu m’apprends à tenir trois minutes.

- « Promis. » → **fin**

### ensemble

_Effet : +40 XP, termine la quête « Sous une lune rouge », retient « fin-lune-rouge-ensemble »._

> Sous la lune rouge, la mer est noire et tiède. Aïo descend vite, lesté de ses pierres ; tu le suis. Au fond, une huître entrouverte. Il remonte en riant, une perle noire dans le poing, et toi, tu remontes en comptant.

- « Rentrer. » → **fin**

### ensemble-dur

_Effet : −5 PV, +30 XP, termine la quête « Sous une lune rouge », retient « fin-lune-rouge-ensemble »._

> La mer te serre la poitrine. Tu remontes trop tôt, et Aïo avec toi, sans perle. Sur le quai, il crache de l’eau et rit quand même. — Demain, on recommence ? Il voit ta tête. — D’accord, non.

- « Rentrer. » → **fin**

### paye

> Aïo regarde les Fers, puis toi, et ne sait plus quoi faire de ses mains. — Je te rembourserai. En perles. Plus tard. Beaucoup plus tard.

- « Rentrer. » → **fin**

### seul

_Effet : retient « aio-oublie », fait passer 2 moments, termine la quête « Sous une lune rouge », retient « fin-lune-rouge-seul »._

> Aïo sourit, et file vers le port. Au matin, les Murmureurs le ramènent, vivant, une perle noire dans le poing. Il ne se souvient plus du nom de sa mère. L’Abysse prend toujours quelque chose.

- « Partir. » → **fin**

### raconte-special

_Effet : retient « raconte-aio », +15 XP._

> Aïo ne dit rien pendant longtemps. Puis : — Moi, je tombe pas. Je plonge. C’est pas pareil. Il serre son panier contre lui. — Pim, elle avait des rubans. Moi, j’ai des perles.

- « Merci, Aïo. » → **fin**

### raconte-touche

_Effet : retient « raconte-aio », +10 XP._

> Aïo écoute la bouche ouverte. — Encore ! Une autre !

- « Merci, Aïo. » → **fin**

### raconte-neutre

_Effet : retient « raconte-aio », +5 XP._

> — C’est bien. Mais il manquait un requin.

- « Merci, Aïo. » → **fin**

## Amande

_Une veuve, devant l’autel_

Commence par : « apres » _(si quête « Le Don rendu » terminée)_, sinon « choix » _(si quête « Le Don rendu » en cours)_ _(si repère « tadeo-avoue »)_, sinon « attente » _(si quête « Le Don rendu » en cours)_, sinon « bague »

### bague

> Une femme en noir, les mains serrées. — L’alliance de mon mari. Je l’avais donnée à la mer, à la Marée des Ancêtres, avec son corps. Elle me l’a rendue. Ça veut dire qu’il ne veut pas partir. Ou que je l’ai mal donnée.

- « Je vais chercher pourquoi. » → **fin** _(lance la quête « Le Don rendu »)_
- **🎲 Investigation 16** « Regarder la bague de près. » → marques, ✗ → rien
- « Je suis désolé·e. » → **fin**

### marques

_Effet : lance la quête « Le Don rendu », retient « don-rendu-indice »._

> Sur l’anneau, deux rayures fraîches, bien droites : la lame d’un couteau de plongeur. La mer ne fait pas ça.

- « Je vais chercher qui. » → **fin**

### rien

> L’argent est usé, poli par l’eau. Tu n’y lis rien. Amande reprend son attente, comme si tu n’étais pas là.

- « Je vais chercher pourquoi. » → **fin** _(lance la quête « Le Don rendu »)_
- « Partir. » → **fin**

### attente

> Amande n’a pas bougé. — Certains disent que c’est le Grand Reflux. D’autres, que c’est moi.

- « Partir. » → **fin**

### choix

> Amande lève les yeux vers toi. Elle a compris que tu sais quelque chose.

- « La mer ne l’a pas rendue. Un plongeur l’avait remontée, puis reposée. » → verite _(+30 XP, termine la quête « Le Don rendu », retient « fin-don-rendu-verite »)_
- « C’est un présage. Il vous attend. » → presage _(+10 XP, termine la quête « Le Don rendu », retient « fin-don-rendu-presage »)_
- _(si repère « tadeo-denonce »)_ « Le plongeur s’est dénoncé aux Murmureurs. » → denonce _(+20 XP, termine la quête « Le Don rendu », retient « fin-don-rendu-denonce »)_

### verite

> Amande ferme les yeux, longtemps. — Alors elle l’avait prise. Alors il est parti. Elle pleure, enfin, et elle rit aussi. — Merci. Je vais pouvoir le laisser tranquille.

- « Partir. » → **fin**

### presage

> — Je le savais. Je viendrai tous les jours, alors. Elle s’assoit au pied de l’autel. Elle y sera encore demain, et après-demain. « Ne mens jamais en mer », dit le commandement.

- « Partir. » → **fin**

### denonce

> — Un plongeur. Amande regarde la bague, puis la mer. — Je la redonnerai moi-même, demain, plus loin. Là où personne ne plonge.

- « Partir. » → **fin**

### apres

> Amande n’est plus devant l’autel que pour y poser des fleurs de corail, le matin.

- « Partir. » → **fin**

## Ambroise Encrelune

_Conservateur de la Grande Bibliothèque_

Commence par : « sans-main » _(si quête « Les noms qui montent » terminée)_ _(sans repère « fin-memoires-monde-perdu-vendue »)_ _(si quête « La caisse sans main » pas commencée)_, sinon « sans-main-vide » _(si quête « Les noms qui montent » terminée)_ _(si repère « fin-memoires-monde-perdu-vendue »)_ _(si quête « La caisse sans main » pas commencée)_, sinon « denonce » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_ _(si repère « main-edda-fausse »)_ _(sans repère « edda-reglee »)_, sinon « registre » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « hesper-vue »)_ _(sans repère « registre-lu »)_, sinon « demande » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « registre-lu »)_ _(sans repère « fonds-muet-ouvert »)_, sinon « accueil »

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

### sans-main

> Ambroise ferme le Registre. — Vous revenez de Zephyria, de la cendre aux semelles. Alors vous savez ce qu’est une caisse plombée. Il y en a une au Fonds Muet. Elle n’a pas de main.

- « Pas de main ? » → sans-main-2

### sans-main-2

> — Arrivée par le monte-charge des archives, la nuit du dernier départ, dit le registre. Personne ne l’a signée. Ce qui n’a pas de main ne se classe pas ; ce qui ne se classe pas ne s’ouvre pas. Mais vous, vous n’êtes pas d’ici.

- « Je descends la voir. » → **fin** _(lance la quête « La caisse sans main », retient « caisse-terminus-cherchee »)_
- « Autre chose. » → accueil

### sans-main-vide

> Ambroise ferme le Registre. — Il y avait une caisse au Fonds Muet, sans main. Il y a deux semaines, le monte-charge a été forcé par en dessous. Ceux qui l’ont prise savaient où chercher : quelqu’un leur avait vendu une ligne.

- « Je sais qui. » → sans-main-vide-2

### sans-main-vide-2

> — Moi aussi. Il ne dit pas ton nom. Il n’en a pas besoin. — Le Registre l’écrira : « Sortie : par en dessous. Main : aucune. » C’est la première fois qu’une ligne me fait honte.

- « Partir. » → **fin** _(lance la quête « La caisse sans main », retient « caisse-terminus-prise », +10 XP, termine la quête « La caisse sans main », retient « fin-caisse-sans-main-prise »)_

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

- _(sans repère « raconte-arlo »)_ « Tu veux une histoire, Arlo ? » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-pim ; mysteres, ancien-monde → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### raconte-neutre

_Effet : retient « raconte-arlo », +5 XP._

> Arlo écoute en se balançant d’un pied sur l’autre. — Elle est longue. Mina la racontera mieux, elle invente la fin.

- « À bientôt, Arlo. » → **fin**

### raconte-touche

_Effet : retient « raconte-arlo », +10 XP._

> Arlo ouvre de grands yeux. — Et personne ne sait pourquoi ? C’est la meilleure sorte d’histoire. Je la vendrai à l’école.

- « À bientôt, Arlo. » → **fin**

### raconte-pim

_Effet : retient « raconte-arlo », +15 XP._

> Arlo fronce les sourcils. — Chez nous, la main s’arrête. Mais l’Anneau n’arrête pas les barreaux qui cassent, hein ? Maman dit que c’est ça, la phrase dangereuse.

- « À bientôt, Arlo. » → **fin**

## Assel Nuée-Douce

_Aubergiste du Nid des Nuées_

Commence par : « lettre-prise » _(si quête « Les noms qui montent » terminée)_ _(si repère « caisse-zephyria-prise »)_ _(sans repère « assel-lettre »)_, sinon « lettre » _(si quête « Les noms qui montent » terminée)_ _(sans repère « assel-lettre »)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Une vieille Aérienne au châle crème verse un thé tiède : à trois mille mètres, l’eau bout avant d’être chaude. — Le Nid des Nuées. Des hamacs, du thé, et du pain, quand le convoi d’en bas est arrivé.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nuees »)_
- « Au revoir. » → **fin**

### servir

> — Du pain d’en bas, du thé d’en haut, ou un hamac. Le pain coûte plus cher que le hamac : il a voyagé plus loin que vous.

- **[12 Fers]** « Du pain et du thé. » → mange _(−12 Fers, +15 PV)_
- **[10 Fers]** « Un hamac jusqu’au matin. » → dodo _(−10 Fers, dort jusqu’au matin)_
- **[10 Fers]** « Un hamac jusqu’à la nuit. » → dodo _(−10 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### mange

> Le pain est rassis, le thé à peine chaud, et c’est le meilleur repas que tu aies fait depuis longtemps. Assel te regarde manger sans rien dire.

- « Merci, Assel. » → accueil

### dodo

> Le hamac tangue au vent. Dehors, les cristaux chantent tout bas, et tu t’endors sur leur note.

- « Se lever. » → **fin**

### nouvelles

> — Le convoi d’en bas est passé hier, sans pirates pour une fois. Et au Registre, Ysolde a reçu une bande sans auteur de plus. Elle les range comme si on allait venir les chercher.

- _(si quête « Les noms qui montent » en cours)_ _(sans repère « edda-halte-reglee »)_ « Une dame en gris a dormi ici ? » → edda
- _(sans repère « raconte-assel »)_ « Je voudrais vous raconter une histoire, à vous seule. » → raconte-neutre 📖 raconter un Récit : berceuse-de-maelis → raconte-special ; chansons, familles → raconte-touche ; autres → raconte-neutre
- « Merci, Assel. » → accueil

### edda

_Effet : retient « edda-liste-recopiee »._

> — Trois nuits, au fond. Elle payait d’avance, en Fers de Ferros, et ne mangeait presque pas. Le soir, elle recopiait la même liste, encore et encore. Je lui ai demandé si c’était une prière. — Non, m’a-t-elle dit. C’est pour ne pas les perdre.

- « Merci, Assel. » → accueil

### lettre

> — Une lettre pour toi, montée avec le courrier de Verdantis. Elle a fait trois villes avant de te trouver.

- « L’ouvrir. » → lettre-texte

### lettre-texte

_Effet : retient « assel-lettre »._

> L’écriture d’Ilyane, qui tremble un peu plus. « Tu m’écris d’en haut ? Je garde tes lettres. Je ne sais plus qui me les envoie, mais je les garde. Ton nom est en haut de chacune : je le lis à voix haute, et pendant un moment, je sais. »

- « Plier la lettre. » → **fin**

### lettre-prise

_Effet : retient « assel-lettre »._

> — Une lettre pour toi, montée avec le courrier de Verdantis. Assel te la tend, et détourne les yeux. L’écriture d’Ilyane tremble beaucoup. Trois lignes. « Je garde tes lettres. Il y a un nom en haut. Je ne sais plus le dire. »

- « Plier la lettre. » → **fin**

### raconte-special

_Effet : retient « raconte-assel », +15 XP._

> Assel fredonne l’air, faux, puis juste. — On la chantait ici aussi, sur d’autres mots. Les berceuses montent plus haut que les gens. Personne ne leur demande d’où elles viennent.

- « Merci, Assel. » → **fin**

### raconte-touche

_Effet : retient « raconte-assel », +10 XP._

> Assel ressert du thé, sans qu’on lui demande. — Celle-là, je la raconterai à la veillée. Je dirai qu’elle est de vous.

- « Merci, Assel. » → **fin**

### raconte-neutre

_Effet : retient « raconte-assel », +5 XP._

> — Merci. Elle remue le thé tiède. — Les histoires d’en bas sont toujours un peu lourdes. On s’y fait.

- « Merci, Assel. » → **fin**

### accueil-2

> Assel verse un thé tiède. — Le Nid des Nuées. Ce matin, une machine des Ailes Noires a frôlé la Tour des Vents ; le Conseil a voté d’en débattre. Asseyez-vous, ça va durer.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nuees »)_
- « Au revoir. » → **fin**

### accueil-3

> Assel ferme une fenêtre que le vent rouvre aussitôt. — Le Nid des Nuées. La nuit dernière, les cristaux ont chanté si fort que personne n’a dormi. Zélie dit que le Courant passait bas.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « nuees »)_
- « Au revoir. » → **fin**

## Auréo Brisevague

_Charpentier de marine_

Commence par : « accueil »

### accueil

> Un charpentier torse nu, du sel dans la barbe, cogne une cheville dans une coque. — Auréo Brisevague, Chantier naval. Pour un bateau, il faut deux saisons. Pour une rame, revenez demain.

- « Les marées ? » → marees
- _(sans repère « raconte-aureo »)_ « Je peux vous raconter une histoire, pendant que vous cognez ? » → raconte-neutre 📖 raconter un Récit : machine-vers-ouest → raconte-special ; machines → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### marees

> — Deux fois par jour, le matin et le soir, la mer se retire du port. On voit alors les rails qui descendent dedans. Mon grand-père disait qu’avant, les trains allaient jusqu’à la mer, et que la mer est venue à leur rencontre.

- « Au revoir. » → **fin**

### raconte-special

_Effet : retient « raconte-aureo », +15 XP._

> Auréo pose son maillet. — Une machine qui roule seule vers l’ouest, sans personne pour lui dire où s’arrêter. Il regarde la coque. — Les bateaux aussi, si on les laisse. C’est pour ça qu’on les amarre.

- « Merci, Auréo. » → **fin**

### raconte-touche

_Effet : retient « raconte-aureo », +10 XP._

> Auréo hoche la tête au rythme du maillet. — Une bonne histoire, c’est une bonne coque : ça tient, et ça flotte.

- « Merci, Auréo. » → **fin**

### raconte-neutre

_Effet : retient « raconte-aureo », +5 XP._

> — Hm. Il cogne une cheville. — Ça manque d’eau.

- « Merci, Auréo. » → **fin**

## Un autel de corail

_Le Grand Port_

Commence par : « bague » _(si quête « Le Don rendu » pas commencée)_, sinon « autel »

### autel

> Un autel de corail rose, au bout du quai. On y pose ce qu’on rend à la mer : un collier, une lettre pliée, une dent de lait. La mer les prend à la marée suivante.

- « Le laisser. » → **fin**

### bague

> Sur l’autel, une bague d’argent, mouillée, posée comme si la mer venait de la rendre. Une femme en noir la regarde, sans oser y toucher.

- « La laisser. » → **fin**

## Un banc d’huîtres perlières

_Le Grand Port, à marée basse_

Commence par : « banc »

### banc

> Le banc d’huîtres, découvert à moitié par la marée. Plus loin, là où l’eau reste, les grosses dorment.

- _(si quête « La première perle » en cours)_ _(sans repère « perle-trouvee »)_ **🎲 Athlétisme 16** « Plonger là où l’eau reste. » → perle, ✗ → rate
- « Laisser le banc. » → **fin**

### perle

_Effet : donne 1 × « Une perle blanche », retient « perle-trouvee », +10 XP._

> Tu remontes, le souffle court, une huître dans la main. Dedans, une perle blanche, ronde, sans tache.

- « La garder pour Ondine. » → **fin**

### rate

_Effet : −2 PV._

> Le froid te serre la poitrine avant le fond. Tu remontes les mains vides et les paumes coupées par les coquilles.

- « Réessayer. » → banc
- « Partir. » → **fin**

## Basile Chante-Creux

_Un vieux marin_

Commence par : « chant » _(si repère « oaina-muette »)_ _(sans repère « basile-recit »)_, sinon « accueil »

### accueil

> Un vieux marin, assis au pied de l’autel, regarde la mer revenir. — La mer se souvient que j’étais jeune. Et moi, moins bien.

- « Bonne nuit. » → **fin**

### chant

> Basile ne se retourne pas. — Ma conque s’est tue ? Je sais. Moi aussi, j’ai oublié. Je l’ai chanté une fois, en mer, il y a quarante ans, et je l’ai confié à la conque pour ne jamais le chanter à terre.

- « Ça vous fait de la peine ? » → chant-2

### chant-2

_Effet : retient « basile-recit », retient le Récit « Le chant qu’on ne chante pas », +15 XP._

> — Non. Un chant qu’on ne chante pas doit pouvoir se perdre ; sinon, ce serait un livre. Il rit tout bas. — Raconte-le, toi, si tu veux. Pas le chant : l’histoire du vieux qui l’a perdu.

- « Bonne nuit, Basile. » → **fin**

## Bastien Basse-Corniche

_Descendant d’une vigie_

Commence par : « liste » _(si quête « Les voiles dormantes » en cours)_ _(si l’on porte « La liste de l’an cinquante »)_, sinon « nuit »

### nuit

_Effet : retient « bastien-rencontre »._

> Un vieil homme, une longue-vue en bandoulière, noue une voile neuve au garde-fou. Il sursaute. — Je ne fais rien de mal. Elle s’use, alors je la change. Tous les deux ans, depuis quarante ans.

- « Pourquoi celle-là ? » → pourquoi
- « Je ne dirai rien. » → **fin**

### pourquoi

> — C’est le début de la quatrième liste de la Pluie : les noms de l’an cinquante. Mon aïeule était vigie à Basse-Corniche ; elle a compté ceux-là. Personne ne recopie plus la liste. Alors je garde le début, pour qu’on sache qu’elle existe.

- « Et la liste entière ? » → entiere
- « Je ne dirai rien. » → **fin**

### entiere

_Effet : retient « bastien-entiere »._

> — Le Registre n’en garde que les quatre premiers mots. Le reste, si une copie dort encore quelque part, c’est chez quelqu’un qui ne sait pas ce qu’il a. Moi, je suis trop vieux pour la chercher.

- _(si quête « Les voiles dormantes » pas commencée)_ « Je la chercherai. » → **fin** _(lance la quête « Les voiles dormantes »)_
- « Bonne nuit, Bastien. » → **fin**

### liste

> Bastien voit le tissu dans tes mains, et la longue-vue lui glisse de l’épaule. — L’an cinquante. Tu l’as trouvée. Il ne la touche pas. — Trois cent douze. Mon aïeule les a comptés un par un, depuis sa corniche.

- « Gardez-la. » → garde _(reprend 1 × « La liste de l’an cinquante », +30 XP, termine la quête « Les voiles dormantes », retient « fin-voiles-dormantes-bastien »)_
- « Je vais la recopier et la lâcher. » → lacher-annonce

### garde

> Il la plie contre sa poitrine. — Je la garderai. Je n’ai plus l’âge de la lâcher, et pas le cœur de la laisser partir. Quand je mourrai, quelqu’un la trouvera dans ma malle. Peut-être qu’il saura quoi en faire, lui.

- « Bonne nuit, Bastien. » → **fin**

### lacher-annonce

> — Recopier trois cent douze noms ? Il rit, pour la première fois. — Ça prend une journée, et un tissu neuf. Fais-le au garde-fou, que je te regarde. Ça fait quarante ans que j’attends de voir ça.

- « Bonne nuit, Bastien. » → **fin**

## Bjorn Glaceforge

_Le Cristal du Peuple_

Commence par : « accueil »

### accueil

> Un forgeron, les bras nus malgré le froid, une barbe rousse prise de givre. Il se tient à l’écart des cristaux du Conseil. — Bjorn Glaceforge. Le Cristal du Peuple : on m’a élu pour qu’il y ait au Conseil quelqu’un qui sache ce que coûte le bois.

- « Et ça change quelque chose ? » → change
- _(si quête « Ceux qu’on laisse dehors » en cours)_ _(sans repère « oskarsen-reglee »)_ _(sans repère « bjorn-refus »)_ « Une famille attend dehors, aux Portes. Les Oskarsen. » → oskarsen
- « Au revoir. » → **fin**

### oskarsen

> Bjorn regarde ses mains. — La loi de 2995. J’ai voté contre, et j’ai perdu, six voix à trois. Si je porte une famille devant le Conseil, je perds encore, et ils restent dehors quand même, avec mon nom en plus.

- _(si Récit « Le Premier Tri » connu)_ « Le tabou de l’abandon a été écrit contre Vaelor. Contre votre fondateur. » → oui
- **🎲 Commandement 18** « Vous êtes le Cristal du Peuple. Alors soyez-le. » → oui, ✗ → non
- **🎲 Diplomatie 18** « Une voix sur neuf suffit pour dire non. Dites-le. » → oui, ✗ → non
- « Je comprends. » → **fin**

### oui

_Effet : retient « oskarsen-reglee », termine la quête « Ceux qu’on laisse dehors », retient « fin-laisses-dehors-bjorn », +60 XP._

> Bjorn se lève. Le lendemain, il parle quatre heures devant le Conseil des Neuf Cristaux. On lui accorde une exception : une famille, une fois. La Primus fait noter : un précédent. Les Oskarsen dorment au chaud, leur nom au registre des Portes.

- « Merci, Bjorn. » → **fin**

### non

_Effet : retient « bjorn-refus »._

> — Non. Je ne gagnerai pas, et ce sont eux qui paieront ma défaite. Trouvez autre chose, ou laissez-moi tranquille.

- « Au revoir. » → **fin**

### change

> — Une voix sur neuf. Assez pour qu’on m’entende dire non. Trop peu pour que mon non l’emporte. Mais quand je dis non, ceux d’en bas savent qu’il y a eu un non.

- _(sans repère « raconte-bjorn »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : puits-trois → raconte-special ; puissants, familles → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### raconte-special

_Effet : retient « raconte-bjorn », +15 XP._

> Bjorn écoute le Puits Trois les poings fermés. — Ferros fait la queue pour l’eau, et Khrysos pour le bois. On compte les castes autrement. On les compte quand même.

- « Au revoir, Bjorn. » → **fin**

### raconte-touche

_Effet : retient « raconte-bjorn », +10 XP._

> — Des gens d’en bas, et ceux d’en haut qui décident. Je la connais, cette histoire. Je la vis six voix contre trois.

- « Au revoir, Bjorn. » → **fin**

### raconte-neutre

_Effet : retient « raconte-bjorn », +5 XP._

> — Merci. Une voix sur neuf, et une histoire : ça ne pèse pas lourd, mais ça pèse.

- « Au revoir, Bjorn. » → **fin**

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

- _(sans repère « raconte-brann »)_ « Tu veux une histoire, Brann ? » → raconte-neutre 📖 raconter un Récit : savant-corvan → raconte-savant ; machines, trains → raconte-touche ; autres → raconte-neutre
- « … » → **fin**

### ironie

> Brann rougit jusqu’aux oreilles. — Il roulait ! Un peu. Bon. Tu m’aides, ou tu te moques ?

- « Je vais la chercher. » → merci _(lance la quête « La caisse égarée »)_
- « Je me moque. » → **fin**

### raconte-neutre

_Effet : retient « raconte-brann », +5 XP._

> Brann écoute la bouche ouverte, puis se gratte la nuque. — J’ai pas tout compris. Mais je la redirai à Maître Cendrefer : il aime quand je retiens des choses.

- « Bon courage, Brann. » → **fin**

### raconte-touche

_Effet : retient « raconte-brann », +10 XP._

> Brann en oublie ses caisses. — Des machines plus grandes que des maisons ? Un jour, j’en ferai une. Une petite. Qui range les clous.

- « Bon courage, Brann. » → **fin**

### raconte-savant

_Effet : retient « raconte-brann », +15 XP._

> Brann répète tout bas : « Même réussir peut tout détruire. » Il regarde ses mains noires de graisse. — Moi, je veux juste réussir une serrure. Maître Cendrefer dit que c’est déjà beaucoup.

- « Bon courage, Brann. » → **fin**

## Brodd Facettier

_Tailleur de cristal_

Commence par : « froid » _(si repère « fin-cristal-ecoute-denonce »)_, sinon « accueil »

### accueil

> Un homme trapu, une loupe vissée à l’œil, taille une facette sans te regarder. Autour de lui, des cristaux, et des manteaux pendus aux poutres. — Un cristal se taille selon son fil. Un client aussi. Tu viens pour quoi ?

- « Voir ce que tu vends. » → **fin** _(ouvre le Troc)_
- « Et ces manteaux ? » → manteaux
- _(si quête « Le cristal qui écoute » pas commencée)_ « Et ce cristal, au plafond du marché ? » → espion
- « Au revoir. » → **fin**

### manteaux

> — Fourrure dehors, laine dedans, et le col qui monte jusqu’au nez. Sans ça, la surface te mange. Soixante Fers. Le froid, lui, ne fait pas crédit.

- « Voir ce que tu vends. » → **fin** _(ouvre le Troc)_
- « Au revoir. » → **fin**

### espion

_Effet : lance la quête « Le cristal qui écoute », retient « ecoute-commencee »._

> Brodd baisse sa loupe. — Un cristal espion. Loi de 2998 : il rend ce qui se dit au marché, à qui le Conseil veut. Depuis qu’il est là, on vend en silence. L’Alliance pour la Justice Glaciale veut qu’il tombe. Moi, je suis tailleur : je sais où passe son fil.

- « Et tu veux que je le brise. » → demande

### demande

> — Il me voit, moi. Toi, il ne te connaît pas encore. Un coup sec, à l’endroit du fil, et il se fend sans bruit. On dit que casser de la glace bleue porte malheur sept ans. Sept ans, ça se porte.

- « J’y penserai. » → **fin**

### froid

> Brodd ne lève pas sa loupe. Au-dessus de sa porte pend un cristal espion neuf. — Tu viens acheter, ou tu viens écouter ?

- « Voir ce que tu vends. » → **fin** _(ouvre le Troc)_
- « Au revoir. » → **fin**

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

## La caisse de la halte morte

_Hors de la Marche_

Commence par : « vide » _(si repère « caisse-communion-reglee »)_, sinon « occupee » _(si quête « Ce qui n’a plus lieu » en cours)_, sinon « fermee »

### fermee

> Une caisse de plomb à demi enfouie, le couvercle soudé par le sable. Près d’elle, un jalon. Tu n’as aucune raison de l’ouvrir. Pas encore.

- « La laisser. » → **fin**

### occupee

> La caisse est ouverte. Contre elle, la dame en gris, qui ne bouge pas. C’est à elle qu’il faut parler d’abord.

- « La laisser. » → **fin**

### vide

> La caisse, ouverte, mangée de sable. Le vent y entre et en ressort. Plus rien dedans ne t’attend.

- « La laisser. » → **fin**

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

## Un coin de plomb dans la cendre

_La Cendrière_

Commence par : « tas »

### tas

> Sous le troisième tas de cendre, un coin de plomb dépasse. La clé de rouille bleue, si tu l’avais, chanterait ici. Il faut dégager la cendre à mains nues, et elle est encore tiède.

- **🎲 Athlétisme 13** « Dégager la caisse. » → caisse, ✗ → etouffe
- « Plus tard. » → **fin**

### etouffe

_Effet : −2 PV._

> La cendre s’effondre sur tes bras et dans ta gorge. Tu recules, en toussant noir. Le coin de plomb est toujours là.

- « Réessayer. » → tas
- « Plus tard. » → **fin**

### caisse

> Une caisse plombée, intacte : Ferros ne jette rien, même ce qu’il oublie. Dedans, une pièce lourde et froide, et une liste, de la même main que le rouleau de Zephyria : Oda, sept ans ; Tilo, six ans ; Mara, huit ans ; Jens, cinq ans ; Ruth, neuf ans ; Anouk, sept ans.

- « Prendre la pièce. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-ferros-trouvee », retient « caisse-ferros-reglee », +40 XP, termine la quête « Sous la cendre », retient « fin-caisse-cendriere-gardee »)_
- « Faire classer la caisse aux Archives, par Noam. » → archives _(retient « caisse-ferros-trouvee », retient « caisse-ferros-reglee », +40 XP, termine la quête « Sous la cendre », retient « fin-caisse-cendriere-archives »)_
- « La laisser sous la cendre. » → laissee _(retient « caisse-ferros-trouvee », retient « caisse-ferros-reglee », +40 XP, termine la quête « Sous la cendre », retient « fin-caisse-cendriere-laissee »)_

### gardee

> Tu charges la pièce sur ton dos. La liste, tu la lis une fois encore, et tu la remets au fond de la caisse. Six noms de plus. Tu les comptes sans le vouloir.

- « Partir. » → **fin**

### archives

> Le lendemain, deux archivistes descendent l’embranchement avec un chariot. Noam inscrit la caisse lui-même : « Fonds Zéro bis (voir : vous). Contenu : non classé. Motif : on ne sait pas ce que c’est. »

- « Partir. » → **fin**

### laissee

> Tu repousses la cendre sur le plomb. Ferros ne jette rien ; il oublie très bien. La caisse attendra encore.

- « Partir. » → **fin**

## La caisse prise

_La voie sept_

Commence par : « vide » _(si repère « caisse-glacialis-reglee »)_, sinon « liste » _(si repère « caisse-glacialis-vue »)_, sinon « caisse »

### caisse

_Effet : retient « caisse-glacialis-vue »._

> Au bout du quai, un cristal de crypte plus large que les autres. Dedans, à la place d’un mort, une caisse de plomb, prise debout. Les Glaciens l’ont prise il y a longtemps, puisque personne n’était venu la chercher. À travers la glace, on lit une liste.

- « Lire la liste. » → liste

### liste

> Six noms, de la même main que sur les autres. Aksel, sept ans ; Mira, cinq ans ; Tove, huit ans ; Elio, six ans ; Ysé, neuf ans ; Noam, quatre ans. La glace a monté jusqu’au dernier nom, et l’a gardé.

_Si Liane voyage avec toi :_ Liane pose deux doigts sur la glace, à hauteur du dernier nom. — Quatre ans. Il n’a pas eu le temps d’avoir froid, lui.

_Si Boulon voyage avec toi :_ Boulon tapote le cristal. — Densité anormale. Cette glace est plus vieille que la ville. Il ne faudrait pas la casser.

- « La laisser prise. Le froid la gardera. » → prise _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-prise », +60 XP, retient « caisse-glacialis-trouvee »)_
- **🎲 Athlétisme 18** « Briser la prise et emporter la pièce. » → brisee, ✗ → tient _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-brisee », +60 XP, retient « caisse-glacialis-trouvee », retient « briseur-echos », donne 1 × « Une pièce de la machine »)_
- « La confier au Collège des 9 Miroirs. » → college _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-college », +60 XP, retient « caisse-glacialis-trouvee »)_
- _(si repère « descendu-edda »)_ « La laisser à la dame en gris. » → edda _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-edda », +60 XP, retient « caisse-glacialis-prise »)_

### tient

> Tu frappes. Le cristal sonne, longtemps, et ne cède pas. Une prise de crypte est faite pour durer plus longtemps que ceux qui la regardent.

- « La laisser prise. Le froid la gardera. » → prise _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-prise », +60 XP, retient « caisse-glacialis-trouvee »)_
- « La confier au Collège des 9 Miroirs. » → college _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-college », +60 XP, retient « caisse-glacialis-trouvee »)_
- _(si repère « descendu-edda »)_ « La laisser à la dame en gris. » → edda _(retient « caisse-glacialis-reglee », termine la quête « Ce que la glace a pris », retient « fin-glace-pris-edda », +60 XP, retient « caisse-glacialis-prise »)_

### prise

> Tu poses la main sur le cristal, longtemps. Le froid monte dans ton bras. Personne ne l’aura : ni les Réveilleurs, ni le Collège, ni toi. La glace a pris ce que le quai n’a pas voulu rendre.

- « Remonter. » → **fin**

### brisee

> Tu frappes là où la glace est la plus mince. Le cristal se fend avec un bruit de cloche, et tout le Niveau Douze l’entend. Tu tires la pièce de la caisse : lourde, froide. Pour Khrysos, tu es un Briseur d’Échos, désormais.

- « Remonter avant qu’ils arrivent. » → **fin**

### college

> Le lendemain, Hrolda descend avec deux greffiers. Elle lit la liste à voix haute, puis signe au bas d’une face neuve : « Une caisse de plomb, prise au niveau douze, voie sept. Six noms. » La lacune a trente ans ; elle a une suite, maintenant.

- « Remonter avec eux. » → **fin** _(fait passer 2 moments)_

### edda

> La dame en gris sort un fil de cuivre, le chauffe à sa lampe, et l’appuie contre la glace, longtemps. Le cristal pleure, s’ouvre. Elle prend la caisse dans ses bras, sans un regard pour toi. Pour Khrysos, la Briseuse, ce sera elle. Elle le sait.

- « La regarder remonter. » → **fin**

### vide

> Au bout du quai, le grand cristal de crypte. Ce que tu y as laissé, ou la place de ce que tu as pris. La glace, déjà, recommence à monter.

- « S’éloigner. » → **fin**

## La caisse que la mer a rendue

_L’Entrepôt des douanes_

Commence par : « caisse »

### caisse

> Une caisse de plomb, mouillée, des algues encore prises dans les sangles. Le plomb a tenu ; le sel a mangé le bois. Sur le couvercle, frappé : 7.

- « L’ouvrir. » → ouverte
- « La laisser. » → **fin**

### ouverte

> Dedans, une pièce lourde et froide, et une liste que l’eau a gardée, dans une boîte de verre : Ilan, sept ans ; Naïs, six ans ; Corin, huit ans ; Sela, cinq ans ; Timo, neuf ans ; Rhéa, six ans. La même main, encore.

- _(si repère « euria-don »)_ « La rendre à la mer, avec les Murmureurs. » → rendue _(retient « caisse-marisol-trouvee », fait passer 2 moments, retient « caisse-marisol-reglee », termine la quête « Ce que la mer rend », retient « fin-mer-rend-rendue », +60 XP)_
- « Prendre la pièce. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-marisol-trouvee », retient « caisse-marisol-reglee », termine la quête « Ce que la mer rend », retient « fin-mer-rend-gardee », +60 XP)_
- « La laisser à l’Amirauté. » → amiraute _(retient « caisse-marisol-trouvee », retient « caisse-marisol-reglee », termine la quête « Ce que la mer rend », retient « fin-mer-rend-amiraute », +60 XP)_
- _(si repère « edda-conque-vue »)_ « La laisser à la dame en gris. » → edda _(retient « caisse-marisol-prise », retient « caisse-marisol-reglee », termine la quête « Ce que la mer rend », retient « fin-mer-rend-edda », +60 XP)_

### rendue

> À la marée basse suivante, Euria et deux Murmureurs portent la caisse jusqu’au bout de la voie qui entre dans la mer. Euria chante sans répéter un seul mot. La mer monte, et la prend. Personne ne l’a, maintenant.

- « Partir. » → **fin**

### gardee

> Tu charges la pièce sur ton dos et tu refermes le plomb sur la liste. Personne, à Coralia, ne saura ce qu’il y avait dedans. La mer, si.

- « Partir. » → **fin**

### amiraute

> Tu refermes le couvercle. Demain, la capitaine Mérande l’ouvrira devant témoins et la classera : pièce à conviction, provenance inconnue, « pas Ferros ». La Grande Amiral sera déçue.

- « Partir. » → **fin**

### edda

> Le soir, à marée basse, tu laisses la cale ouverte. Au matin, la caisse n’est plus là. Sur le sable mouillé, une conque, posée, que tu ne portes pas à ton oreille.

- « Partir. » → **fin**

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

## Une caisse sans main

_Le Fonds Muet_

Commence par : « caisse »

### caisse

> Une caisse plombée, intacte, sous une housse de toile grise. Ni étiquette ni main. Le plomb ne porte qu’un chiffre, frappé : 7.

- « Rompre le plomb. » → ouverte
- « Laisser la caisse. » → **fin**

### ouverte

> Une pièce lourde et froide, et une liste de six noms, de la même écriture encore : Aldo, huit ans ; Nour, six ans ; Tess, sept ans ; Sven, cinq ans ; Lou, six ans ; Mirko, neuf ans.

- « Prendre la pièce. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-terminus-trouvee », retient « caisse-terminus-reglee », +40 XP, termine la quête « La caisse sans main », retient « fin-caisse-sans-main-gardee »)_
- « La confier à Ambroise. » → confiee _(retient « caisse-terminus-trouvee », retient « caisse-terminus-reglee », +40 XP, termine la quête « La caisse sans main », retient « fin-caisse-sans-main-confiee »)_
- « Refermer la housse, et la laisser. » → laissee _(retient « caisse-terminus-trouvee », retient « caisse-terminus-reglee », +40 XP, termine la quête « La caisse sans main », retient « fin-caisse-sans-main-laissee »)_

### gardee

> Tu sors du Fonds Muet avec la pièce. Le portier ne dit rien : elle n’a pas de main. Elle n’existe pas, ici.

- « Partir. » → **fin**

### confiee

> Ambroise descend lui-même, et inscrit la caisse au Registre, de sa main : « Reçu : le Fonds Muet. » Il pose la plume. — Trois mille ans qu’elle attendait quelqu’un pour la recevoir. Ce sera nous.

- « Partir. » → **fin**

### laissee

> Tu refermes la housse sur le plomb rompu. Le Fonds Muet garde ce qu’on ne cite pas. Il gardera ça aussi.

- « Partir. » → **fin**

## La caisse de Zephyria

_Halte des Cendres_

Commence par : « vide » _(si repère « caisse-zephyria-reglee »)_, sinon « pleine »

### pleine

> Une caisse plombée, ouverte depuis longtemps : le plomb a cédé, le bois a gonflé. Dedans, une forme lourde, emballée de toile. Le rouleau qui en sortait n’y est plus : la dame en gris l’a sur les genoux.

- « Soulever la toile. » → toile
- « Laisser la caisse. » → **fin**

### toile

> Froid, lourd, et rien que tu reconnaisses. Ni marque, ni mot, ni vis. Une chose faite pour être portée, et pour ne rien dire.

- « Laisser la caisse. » → **fin**

### vide

> La caisse est vide. Au fond, la cendre garde la forme de ce qui y dormait.

- « Laisser la caisse. » → **fin**

## La cale de l’Entrepôt

_Le Grand Port, à marée basse_

Commence par : « cale »

### cale

> La cale de l’Entrepôt des douanes, découverte par la marée : une porte basse de bois noir, des algues sur le verrou. À marée haute, elle sera sous l’eau.

- _(si quête « Ce que la mer rend » en cours)_ _(sans repère « cale-guettee »)_ **🎲 Discrétion 16** « Passer par la cale. » → dedans, ✗ → surpris
- _(si quête « Ce que la mer rend » en cours)_ _(si repère « rumeur-cale-algues »)_ _(sans repère « cale-guettee »)_ **🎲 Discrétion 13** « Soulever le verrou rongé, d’une main. » → dedans, ✗ → surpris
- « La laisser. » → **fin**

### dedans

> Le verrou cède sous les algues. Tu te glisses dans l’Entrepôt, mouillé jusqu’aux genoux.

- « Entrer. » → **fin** _(mène à « Coralia — l’Entrepôt des douanes »)_

### surpris

_Effet : retient « cale-guettee » pour 1 jours._

> Une lanterne se penche au-dessus du quai. — Encore un de Ferros ? Ah, non. Pire : un curieux. La capitaine Mérande ne crie pas. Elle attend que tu remontes.

- « Remonter. » → **fin**

## Une carcasse de machine

_L’îlot du vent_

Commence par : « carcasse »

### carcasse

> Une vieille machine à deux cristaux, posée là depuis des années. La toile est partie, le cadre a blanchi. Sous le siège, dans un étui de cuir durci, un cristal azur, fendu, intact.

- « Le prendre. » → pris _(donne 1 × « Second cristal azur », retient « carcasse-fouillee », +15 XP)_
- « Le laisser. » → **fin**

### pris

> Le cristal chante un peu quand tu le sors de l’étui. Sur l’îlot du vent, le vent ne s’arrête jamais.

- « Partir. » → **fin**

## Le carnet du Perchoir

_Le Perchoir_

Commence par : « carnet »

### carnet

> Un carnet de cuir noir, sur la table, gras de doigts. Chaque traversée du Calme, la vitesse qu’on avait en tête, et une croix pour ceux qui ne sont pas revenus. Ravel ne le quitte jamais des yeux, le jour.

- _(si quête « Les onze états » en cours)_ _(la nuit)_ _(sans repère « perchoir-guette »)_ **🎲 Discrétion 15** « Le prendre, quand tout le monde dort. » → pris, ✗ → surpris
- _(si quête « Les onze états » en cours)_ _(la nuit)_ _(si repère « rumeur-perchoir-sommeil »)_ _(sans repère « perchoir-guette »)_ **🎲 Discrétion 12** « Le prendre à la troisième rafale, quand tout le Perchoir dort. » → pris, ✗ → surpris
- « Le laisser. » → **fin**

### pris

_Effet : donne 1 × « Le carnet du Perchoir », retient « onze-carnet », retient « carnet-vole »._

> Les hamacs ronflent. Tu glisses le carnet sous ta chemise. Demain, Ravel verra la table vide, et il saura. Le Perchoir ne pose pas de questions ; il se souvient.

- « Partir. » → **fin**

### surpris

_Effet : retient « perchoir-guette » pour 1 jours._

> Une Aile Noire ouvre un œil, dans un hamac. — Le carnet reste sur la table. Va dormir ailleurs.

- « Partir. » → **fin**

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

## Céleste Fend-l’Air

_Apprentie des Ailes Noires_

Commence par : « apres » _(si quête « Le second cristal » terminée)_, sinon « avant » _(si quête « Le second cristal » en cours)_, sinon « accueil »

### accueil

> Une jeune femme en cuir noir resserre une sangle sur une machine légère. Un seul cristal, sous le cadre. — Tu regardes ma machine ? Demain, je passe le Calme avec. Et après, je suis des Ailes Noires.

- « Bonne chance. » → **fin**

### avant

> Céleste ne lève pas les yeux de sa sangle. — Ma mère t’envoie. Elle envoie tout le monde. Je passe à l’aube. Ravel dit que si je reviens, je suis des leurs.

- **🎲 Diplomatie 15** « Prends un second cristal. Ça n’enlève rien au vol. » → persuadee, ✗ → braquee
- _(si l’on porte « Second cristal azur »)_ « Tiens. Un second cristal. » → donne _(reprend 1 × « Second cristal azur »)_
- _(si l’on porte « La septième voile, l’état juste »)_ « Voici l’état juste de la septième voile. » → voile
- « C’est ton vol. » → partie

### braquee

> — Toi aussi ? Rien ne doit entraver le vent. Va le répéter à ma mère, si ça te chante.

- _(si l’on porte « Second cristal azur »)_ « Tiens. Un second cristal. » → donne _(reprend 1 × « Second cristal azur »)_
- _(si l’on porte « La septième voile, l’état juste »)_ « Voici l’état juste de la septième voile. » → voile
- « C’est ton vol. » → partie

### persuadee

_Effet : retient « celeste-deux », +30 XP, termine la quête « Le second cristal », retient « fin-second-cristal-persuadee »._

> Elle se tait longtemps. — Ravel va rire. Elle fixe quand même un second cristal, de travers, en jurant. — S’il rit, je lui dirai que c’est ma mère. Ce n’est pas vrai. Ne le dis à personne.

- « Bon vol, Céleste. » → **fin**

### donne

_Effet : retient « celeste-deux », +30 XP, termine la quête « Le second cristal », retient « fin-second-cristal-cristal »._

> Elle tourne le cristal dans ses doigts. — Tu le donnes, comme ça ? Elle le fixe sous le cadre. — Ne le dis pas à Ravel. Dis-lui que je l’ai trouvé.

- « Bon vol, Céleste. » → **fin**

### voile

_Effet : retient « celeste-voile », +30 XP, termine la quête « Le second cristal », retient « fin-second-cristal-voile »._

> Elle lit la voile deux fois, les lèvres serrées, et la recopie sur son avant-bras, à l’encre. — Un cristal, mais la bonne vitesse. Ça, Ravel ne pourra pas dire que c’est une entrave.

- « Bon vol, Céleste. » → **fin**

### partie

> Elle sourit. — Merci. Tu es la première à le dire. À l’aube, sa machine quitte le Quai, file vers le bas, et disparaît dans les nuages.

- « Attendre. » → partie-2

### partie-2

_Effet : retient « celeste-tombee », fait passer 2 moments, termine la quête « Le second cristal », retient « fin-second-cristal-tombee »._

> Le soir, la Gardienne du Ciel passe au Nid : on a repêché Céleste au-dessus du Calme, vivante, les deux jambes brisées. Elle ne volera plus. Au marché, Odile ne t’en veut pas. Elle te remercie même d’avoir parlé à sa fille.

- « Partir. » → **fin**

### apres

> Céleste, des plumes noires cousues à l’épaule, te salue d’un geste de pilote. — Le Calme, c’est rien. C’est le silence avant qui fait peur. Personne ne te le dit, ça.

- « Au revoir. » → **fin**

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

## Un chariot renversé

_Hors de la Marche_

Commence par : « chariot » _(si quête « Le chariot perdu » en cours)_ _(sans repère « chariot-ramene »)_, sinon « vide »

### chariot

> Un chariot couché sur le flanc, une roue cassée, des lentilles éparpillées qui brûlent au soleil. Dessous, à l’ombre, un convoyeur aux lèvres fendues. — Je me suis endormi. Les bœufs ont suivi une odeur d’eau qui n’existait pas.

- **🎲 Artisanat 16** « Réparer la roue. » → repare, ✗ → laisse
- _(si l’on porte « L’eau de l’Année Errante »)_ « Lui donner ta gourde. » → abreuve _(reprend 1 × « L’eau de l’Année Errante »)_
- « Le ramener à pied, sans le chariot. » → laisse

### repare

_Effet : retient « chariot-ramene »._

> Une cheville de bois, une corde, la roue tiendra jusqu’au camp. Le convoyeur rit, d’un rire de soif. Vous rattrapez la Marche à la nuit, le chariot grinçant derrière vous.

- « Rentrer. » → **fin** _(mène à « Marche-Mère — le Camp »)_

### abreuve

_Effet : retient « chariot-ramene »._

> Il boit ta gourde en trois gorgées et se relève. À deux, vous redressez le chariot. Il te devra de l’eau toute sa vie, dit-il, et dans la Communion, c’est une dette sérieuse.

- « Rentrer. » → **fin** _(mène à « Marche-Mère — le Camp »)_

### laisse

_Effet : retient « chariot-ramene », retient « chariot-laisse »._

> Le chariot restera là, pour le sable. Tu soutiens le convoyeur jusqu’à la piste, et la piste jusqu’au camp. Les lentilles, on les comptera perdues.

- « Rentrer. » → **fin** _(mène à « Marche-Mère — le Camp »)_

### vide

> Les traces d’un chariot, que le vent efface déjà.

- « Passer. » → **fin**

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
- _(sans repère « membre-compagnie-lisieres »)_ « Je n’ai pas quinze Fers. » → sans-fers
- « Une autre fois. » → accueil

### trajet-gardebois

> La caravane roule sans hâte, de borne en borne. Le soir, les lanternes du Marché des Lisières s’allument une à une entre les arbres : Gardebois.

- « Descendre du chariot. » → **fin** _(attend à midi, attend le soir, mène à « Gardebois — Marché des Lisières »)_

### sans-fers

> Il hausse les épaules. — Alors la Grande Nacelle te redescend pour rien, juste là, au bord de la plate-forme. En bas, la route est à toi : un jour de marche jusqu’à Gardebois, si les Loups n’ont pas faim. Sévane, au Comptoir de la Sève, paie bien pour des herbes.

- « Merci. » → **fin**

## Le Coffre des routes

_La tente des guides_

Commence par : « coffre-quete » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « halte-trouvee »)_ _(sans repère « coffre-surpris »)_, sinon « coffre »

### coffre

> Un coffre de bois clouté. Dedans, pas un papier : des pierres d’eau, une par puits du cercle, rangées dans l’ordre de la route. Les guides lisent la Marche avec leurs doigts.

- « Refermer le coffre. » → **fin**

### coffre-quete

> Les pierres d’eau, une par puits, dans l’ordre du cercle ; quelque part là-dedans, la piste de demain, et le jalon qu’elle frôle. À trois pas, Daru’Khen somnole, son bâton sur les genoux.

- _(si repère « rumeur-coffre-guides »)_ **🎲 Discrétion 13** « Soulever le couvercle pendant qu’il dort. » → lu, ✗ → surpris
- **🎲 Discrétion 16** « Les lire du bout des doigts, sans un bruit. » → lu, ✗ → surpris
- **🎲 Artisanat 16** « Défaire le nœud du coffre sans le trahir. » → lu, ✗ → surpris
- « Refermer le coffre. » → **fin**

### lu

_Effet : retient « halte-trouvee », retient « coffre-lu »._

> Tu comptes les pierres. La quatrième n’est pas une pierre : un éclat de verre, poli. Un jalon. Demain, la piste passera au plus près de lui, à neuf kilomètres, plein sud. Tu refermes le coffre comme tu l’as trouvé.

- « S’éloigner. » → **fin**

### surpris

_Effet : retient « coffre-surpris »._

> — Ce coffre n’est pas à toi. — Daru’Khen rabat le couvercle sur tes doigts, sans brutalité. — Dans la Marche, on demande. Tout le camp le saura demain.

- « S’éloigner. » → **fin**

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

## Une conque muette

_Salle des Conques_

Commence par : « muette »

### muette

> Une conque sur son pied, une étiquette au nom de Basile Chante-Creux. Tu la portes à ton oreille. Rien. Pas même le bruit de la mer.

- **[Mémoire 4]** « Écouter plus longtemps. » → loin
- « La reposer. » → **fin**

### loin

_Effet : retient « conque-muette-entendue »._

> Au fond du silence, une voix d’homme, très loin, chante un chant qu’elle n’achève pas. Puis plus rien. La conque n’est pas vide : elle oublie.

- « La reposer. » → **fin**

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

## Un cristal d’archive

_Cent Jours_

Commence par : « neuf » _(si repère « fin-cristal-hesite-scelle »)_, sinon « rend »

### rend

> Un cristal d’archive. L’étiquette : « Cent Jours. Sept faces, complètes. » Le seul grand récit de Glacialis dont aucune face ne manque. La lueur monte, plus lente que celle des autres. « Le cristal rend. »

- « Et ne juge pas. » → c1
- « Reculer. » → **fin**

### neuf

> Un cristal d’archive plus jeune, à la place de l’autre, la même étiquette : « Cent Jours. Sept faces, complètes. » Il rend la face cinquième sans s’arrêter : « Encore ceux-là. Puis fermez. » Il n’hésite pas. Pas encore.

- « Reculer. » → **fin**

### c1

> « Face première. En 2750, le soleil ne s’est pas levé sur Glacialis pendant cent jours. Quatre-vingt-quatorze degrés sous zéro à la surface. Et quelque chose est monté du nord. Je ne l’ai pas vu, dit Skarn Hal’vek. J’ai vu ce que ça laissait. »

- « Face suivante. » → c2
- « Reculer. » → **fin**

### c2

> « Face deuxième. Skarn Hal’vek, Géante des Glaces, Cristal Guerrier, prit la surface avec onze mille soldats et la tint cent jours dans le noir. Ce qui montait laissait des corps vidés de leur chaleur, debout. Au quarante-sixième jour, elle tua le Dragon. »

- « Face suivante. » → c3
- « Reculer. » → **fin**

### c3

> « Face troisième. L’Heure d’Hal’vek : un Dragon du Givre de quarante mètres, une lance de cristal plantée sous la mâchoire. Trente-quatre des quarante sont morts ; elle y laissa un bras et la moitié du visage. La nation hurla de joie. Le silence dura onze jours. »

- « Face suivante. » → c4
- « Reculer. » → **fin**

### c4

> « Face quatrième. Au soixante-dixième jour, la ligne du nord n’existait plus. Le Dragon ne descendait pas sur Glacialis : il occupait le nord, il retenait ce qui montait. J’ai eu raison avec ce que je savais. Je n’avais pas assez. Notez-le. »

- « Face suivante. » → c5
- « Reculer. » → **fin**

### c5

_Effet : retient « hesitation-entendue »._

> « Face cinquième. Il restait dehors quarante à soixante mille personnes. Elle fit murer les trois portes nord, du bon côté, et nota les noms. Trois fois, elle fit arrêter les maçons. Sa seule phrase, à la porte : Encore ceux-là. Puis » La voix s’arrête. Longtemps. « ouvrez. »

- _(sans repère « cent-jours-erreur »)_ _(sans repère « cent-jours-flou »)_ **🎲 Investigation 17** « Faire rendre la face une seconde fois, et comparer. » → c5-bis, ✗ → c5-flou
- _(sans repère « cent-jours-erreur »)_ **[Mémoire 6]** « Retenir chaque mot, et redemander la face. » → c5-bis
- « Face suivante. » → c6
- « Reculer. » → **fin**

### c5-bis

_Effet : retient « cent-jours-erreur », +20 XP._

> Tu demandes la face cinquième, encore. La lueur monte. Cette fois, la voix ne s’arrête pas : « Encore ceux-là. Puis fermez. » Le même cristal, la même face, et deux mots différents. Un cristal rend, ou il est brisé. Celui-ci n’est pas brisé.

- « Face suivante. » → c6
- « Reculer. » → **fin**

### c5-flou

_Effet : retient « cent-jours-flou » pour 1 jours._

> Tu fais rendre la face une seconde fois. La voix est la même, la lueur aussi, et tu ne sais plus ce qu’elle avait dit la première fois. Il faudrait revenir demain, l’oreille fraîche.

- « Face suivante. » → c6
- « Reculer. » → **fin**

### c6

> « Face sixième. Le cent unième jour, le soleil s’est levé. On ne sait pas pourquoi. On a rouvert deux portes nord. La troisième, jamais. Les colonnes envoyées au nord n’ont trouvé personne. Le nord était propre et vide. »

- « Face suivante. » → c7
- « Reculer. » → **fin**

### c7

> « Face septième. À soixante-dix-sept ans, on lui demanda ce qu’elle regrettait. D’avoir demandé qu’on s’arrête trois fois. C’était pour moi. C’est la seule chose de ces cent jours dont j’aie honte. » La lueur s’éteint.

- « Reculer. » → **fin**

## Un cristal d’archive

_L’Affaire des Cryptes_

Commence par : « rend »

### rend

> Un cristal d’archive. L’étiquette : « L’Affaire des Cryptes. Onze faces ; quatre subsistent. Les sept autres, brisées par l’accusé lui-même, une par nuit, pendant son procès. » La lueur monte. « Le cristal rend. »

- « Et ne juge pas. » → a1
- « Reculer. » → **fin**

### a1

> « Face première. À Glacialis, on ne brûle pas les morts et on ne les enterre pas : on les prend. Le cristal se referme sur le corps en quelques heures, et il reste ainsi, intact, pour toujours. Personne, en deux mille ans, n’y avait rien trouvé à redire. »

- « Face suivante. » → a2
- « Reculer. » → **fin**

### a2

> « Face deuxième. Nher-Khal, Tisseur de Givre, demanda au Collège : un cristal de crypte reçoit un corps entier, cerveau compris. Quelqu’un a-t-il déjà établi qu’il ne fait pas ce que fait un cristal d’archive ? Il n’y eut pas de réponse. »

- « Faces troisième à neuvième. » → a3
- « Reculer. » → **fin**

### a3

> Sept silences. Puis la voix rend seulement les intitulés : Les quatorze années de mesures. Ce que rendit la première crypte ouverte. Le second protocole, et les neuf témoins. Le refus du Collège. La nuit du niveau douze. Le compte des cristaux brisés. Les familles.

- « Face suivante. » → a10
- « Reculer. » → **fin**

### a10

> « Face dixième. Si je me trompe, j’ai profané quatre mille six cent onze tombes. Si j’ai raison, chacun de vous a un parent éveillé dans le noir depuis deux cents ans. Dites-moi lequel des deux risques vous auriez pris. » Un juge s’est levé et est sorti.

- « Face suivante. » → a11
- « Reculer. » → **fin**

### a11

> « Face onzième. Pourquoi avoir brisé vos mesures ? Elles étaient tout ce qui pouvait vous convaincre. Si vous êtes convaincus, vous ouvrirez les onze millions de prises, mal, et toutes. Je préfère qu’on me tienne pour un fou. » La lueur s’éteint.

- « Reculer. » → **fin**

## Un cristal espion

_Les Galeries Chaudes_

Commence par : « fil » _(si quête « Le cristal qui écoute » en cours)_, sinon « voit »

### voit

> Sur une potence de fer, contre le plafond de glace, un œil de cristal taillé, une pointe rouge au cœur. Il ne bouge pas. Il n’a pas besoin de bouger.

- « S’éloigner. » → **fin**

### fil

> L’œil de cristal, sur sa potence. De près, on voit le fil dont parlait Brodd : une ligne plus claire, de biais, à deux doigts de la pointe rouge. Le marché, en dessous, vend en silence.

- **🎲 Artisanat 18** « Le frapper à l’endroit du fil. » → brise, ✗ → fracas _(termine la quête « Le cristal qui écoute », retient « fin-cristal-ecoute-brise », +60 XP, retient « malheur-sept-ans »)_
- « Le laisser. Ce n’est pas mon pays. » → laisse _(termine la quête « Le cristal qui écoute », retient « fin-cristal-ecoute-laisse », +20 XP)_
- « Dire à la garde qui veut le briser. » → denonce _(termine la quête « Le cristal qui écoute », retient « fin-cristal-ecoute-denonce », +40 XP)_
- « Plus tard. » → **fin**

### brise

> Un coup sec, là où Brodd l’a dit. Le cristal se fend en deux, sans un bruit, et la pointe rouge s’éteint. Le lendemain, au marché, quelqu’un rit fort pour la première fois depuis deux ans. Sept ans de malheur, dit-on. On verra.

- « Partir. » → **fin**

### fracas

_Effet : termine la quête « Le cristal qui écoute », retient « fin-cristal-ecoute-brise », +40 XP, retient « malheur-sept-ans », retient « espion-fracas »._

> Le cristal éclate d’un coup, en mille éclats, avec un bruit de cloche fêlée. Tout le marché se retourne. La garde arrive ; tu es déjà loin, mais elle a vu ton manteau. Il est brisé quand même. Sept ans de malheur.

- « Partir vite. » → **fin**

### laisse

> Tu le laisses à son plafond. Brodd ne te reparle plus de rien, et te vend ses manteaux sans un mot de trop.

- « Partir. » → **fin**

### denonce

> Tu dis à la garde des Portes qui veut briser le cristal des Galeries. Elle note, sans te regarder. Le lendemain, Brodd paie trois mois de ventes d’amende, et un second cristal espion pend au-dessus de sa porte.

- « Partir. » → **fin**

## Un cristal d’archive

_La Marche de Vaelor_

Commence par : « rend »

### rend

> Un cristal d’archive sur son socle. L’étiquette, de la main du Collège : « La Marche de Vaelor. Neuf faces, la sixième manque. » Quand tu approches, une lueur monte en lui. « Le cristal rend. »

- « Et ne juge pas. » → f1
- « Reculer. » → **fin**

### f1

> « Face première. Il y eut un hiver qui ne s’arrêta pas : onze ans sans dégel. Au septième, on comptait les vivants d’un pouce, comme on compte des outils. Et il y avait Vaelor. Il portait les autres, deux à la fois, sur des lieues, dans la neige. »

- « Face suivante. » → f2
- « Reculer. » → **fin**

### f2

> « Face deuxième. Au neuvième hiver, Vaelor descendit dans les Grottes. Il y resta trente et un jours. Il remonta sans manteau, torse nu, par quarante degrés sous zéro, sans trembler. Le froid ne le trouvait plus. »

- **[Mémoire 5]** « Écouter la face troisième : trente et un jours, ligne après ligne. » → f3
- « Passer à la face quatrième. » → f4
- « Reculer. » → **fin**

### f3

_Effet : retient « face-trois-entendue »._

> « Face troisième. » Ce que Vaelor a vu dans le cristal, trente et un jours, ligne après ligne, sans un seul événement. Ta mémoire tient jusqu’au bout. Tu comprends pourquoi les initiés la récitent pendant la Veille du Givre : elle ne se laisse pas résumer.

- « Face suivante. » → f4
- « Reculer. » → **fin**

### f4

> « Face quatrième. Onze mille personnes : c’est ce qu’il ramena vivant. Il perça une paroi de glace à mains nues ; il fit reculer un Colosse Hivernal : reculer, le cristal insiste sur le mot. Chacun de nous descend de quelqu’un qu’il a porté. »

- « Continuer, au-delà de la Veille du Givre. » → f5
- « Reculer. » → **fin**

### f5

> « Face cinquième. À la fin du dixième hiver, il commença à trier. Un convoi de trois cents ; quarante et un qui ne tiendraient pas. Il fit le calcul à voix haute, exact. Ceux-là restent. Je ne les tuerai pas. Je ne les porterai pas. Tous les autres arrivèrent. »

- « Face suivante. » → f6
- « Reculer. » → **fin**

### f6

> « Face sixième. » Rien. Puis un fragment, quatorze mots : « … la troisième fois, et cette fois-là personne ne demanda plus rien, parce que … » Une lacune plus vieille que le Collège. Personne ne sait qui l’a brisée.

- « Face suivante. » → f7
- « Reculer. » → **fin**

### f7

> « Face septième. La fonte revint ; on creusa ce qui allait devenir Khrysos, et Vaelor repartait vers le nord. Une femme qu’il avait portée enfant dit : Il nous regarde comme on regarde un chargement. Il a raison chaque fois. Je ne veux plus qu’il me touche. »

- « Face suivante. » → f8
- « Reculer. » → **fin**

### f8

> « Face huitième. Ils ont voté. Il a parlé : Vous êtes onze mille. J’ai laissé quatre cents. Faites le compte, et dites-moi lequel d’entre vous voulait le faire à ma place. À une voix près, on l’a figé. Il a trouvé leur calcul correct. »

- « Face suivante. » → f9
- « Reculer. » → **fin**

### f9

> « Face neuvième. La statue est aux Grottes de Nörvath. Elle mesure ce qu’il mesurait. Elle est intacte après trente siècles. Il n’a pas fermé les yeux. » La lueur s’éteint. Le cristal a tout rendu, et ne juge pas.

- _(sans repère « vaelor-entendu »)_ « Garder la légende en mémoire. » → **fin** _(retient le Récit « Le Premier Tri », retient « vaelor-entendu », +30 XP)_
- « Reculer. » → **fin**

## Cristal de veille

_Objet_

Commence par : « cristal »

### cristal

> Le cristal de veille luit doucement. Ilyane dit qu’il tient les mauvais rêves à distance. En le regardant, tu sens ta fatigue s’apaiser.

- « Se reposer un instant. » → **fin** _(+40 PV)_
- « S’éloigner. » → **fin**

## Les cristaux scellés

_Le Caveau_

Commence par : « scelles »

### scelles

_Effet : retient « caveau-vu »._

> Cinq cristaux d’archive, alignés dans le froid. Sous chacun, une étiquette de la main du Collège : « A hésité. Scellé. Ne pas rendre. » La plus ancienne date de l’automne dernier. La plus récente, de la semaine passée. Elles se rapprochent.

- « En faire rendre un. » → rendre
- « Partir. » → **fin**

### rendre

_Effet : retient « maladie-cristaux »._

> Tu dis la formule. La lueur monte, retombe, remonte. « Le cristal rend. Le cristal. Le. » Puis rien. Ce qui ne pouvait pas oublier commence à oublier. La maladie des souvenirs est descendue jusqu’ici, sous trois cents mètres de glace.

- « Partir. » → **fin**

## La Primus Crysta Frostborn

_Conseil des Neuf Cristaux_

Commence par : « accueil »

### accueil

> Une Elfe de Givre, la peau bleutée, les cheveux plus blancs que la neige. Cinq siècles et demi te regardent par ses yeux. — Un Gardien de Mémoire. Il en vient peu. Dites ce que vous voulez de Glacialis, et dites-le clairement.

- « Je cherche ce que la glace garde. » → garde
- « Rien, Primus. Je regardais. » → **fin**

### garde

> — Elle garde tout. C’est sa vertu et son crime. Le Collège vous dira ce qui manque ; moi, je vous dirai ce qui reste, si vous savez le demander. Revenez quand vous aurez une question qui mérite le Conseil.

- « Merci, Primus. » → **fin**

## Dagny Ferme-Givre

_Des 4 611_

Commence par : « carnet » _(si quête « Les quatorze années de mesures » en cours)_, sinon « apres » _(si quête « Les quatorze années de mesures » terminée)_, sinon « accueil »

### accueil

> Une femme en manteau de deuil, un brassard noir, attend devant le Palais avec un rouleau de pétitions. — Dagny Ferme-Givre, des 4 611 : les familles dont il a brisé les morts. Nous demandons qu’on le juge une seconde fois, et qu’on le condamne, enfin.

- « Au revoir. » → **fin**

### carnet

_Effet : retient « dagny-vue »._

> — Ennir vous a parlé du carnet. Ses mesures. Rapportez-le-moi. Avec ça, le Conseil ne pourra plus dire que c’était un fou : il faudra dire que c’était un profanateur, et qu’il savait ce qu’il faisait.

- _(sans repère « dagny-ferme »)_ **🎲 Investigation 18** « Ou que c’était un savant, et qu’il avait raison ? » → courant, ✗ → ferme
- « J’y réfléchirai. » → **fin**

### courant

_Effet : retient « dagny-courant »._

> Elle se tait une seconde de trop. — Il y a deux courants, chez les 4 611. Ceux qui veulent qu’on le condamne, et ceux qui veulent savoir. Les seconds paient les pétitions des premiers. Je suis des seconds. Ma mère est dans une prise, section quatre.

- « Je comprends. » → **fin**

### ferme

_Effet : retient « dagny-ferme »._

> — Il avait tort. C’est tout ce qu’il y a à savoir. Elle reprend ses pétitions, et ne te regarde plus.

- « Au revoir. » → **fin**

### apres

> Dagny compte ses pétitions, une à une, comme on compte des noms. — Les morts ne se plaignent pas. C’est pour ça qu’il faut quelqu’un pour le faire à leur place.

- « Au revoir. » → **fin**

## Daru’Khen

_Premier guide_

Commence par : « adhesion » _(si quête « Le chariot perdu » en cours)_ _(si repère « chariot-ramene »)_, sinon « halte-q » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « halte-trouvee »)_ _(sans repère « daru-refus »)_, sinon « chariot-attend » _(si quête « Le chariot perdu » en cours)_, sinon « accueil »

### accueil

> Un homme sec, un chèche couleur de sable, un bâton couvert d’encoches. — Les guides ne choisissent rien, l’étranger. L’eau choisit, nous la suivons. Tu voulais savoir autre chose ?

- « Où va la Marche ? » → route
- « Les jalons, au loin ? » → jalons
- _(si quête « Le chariot perdu » pas commencée)_ _(sans repère « membre-matriarches-cristaux »)_ « Je veux entrer chez les Guides de l’Eau. » → guide
- « Rien. » → **fin**

### route

> — Au point d’eau suivant, puis au suivant. Le cercle a un sens, et ses fenêtres ont des dates. On ne revient pas : une Marche qui rebrousse chemin arrive en retard partout.

- « Les jalons, au loin ? » → jalons
- « Rien. » → **fin**

### jalons

> — Des haltes mortes. La route a changé, un jour, parce qu’un puits a séché, et ce qui est tombé hors de la route est tombé hors du récit. Y aller, c’est quitter la Marche : l’Année Errante. Cinq sur cent n’en reviennent pas.

- « Où va la Marche ? » → route
- « Rien. » → **fin**

### halte-q

> — Une halte morte avec un quai dessous ? Les guides savent où passe la piste, pas ce qui dort sous les jalons. Et ce qui dort sous les jalons ne regarde pas les étrangers.

- **🎲 Diplomatie 16** « Dis-moi seulement où passe la piste, demain. » → dit, ✗ → refus
- _(si repère « membre-guides-eau »)_ « Je suis des Guides de l’Eau. » → dit
- « Plus tard. » → **fin**

### dit

_Effet : retient « halte-trouvee »._

> Il trace un trait dans le sable avec son bâton. — Demain, au milieu du jour, la piste passera à neuf kilomètres d’un jalon qui n’a plus d’épisode. Plein sud. Pars à l’aube, avec de l’eau, et ne compte pas sur nous pour t’attendre.

- « Merci, Daru’Khen. » → **fin**

### refus

_Effet : retient « daru-refus »._

> — Non. La dernière à qui j’ai montré la piste est partie seule vers le sud, et je n’ai pas dormi depuis. Demande au désert.

- « Tant pis. » → **fin**

### guide

_Effet : lance la quête « Le chariot perdu », retient « chariot-perdu-commence »._

> — Les Guides de l’Eau ? Un chariot de lentilles s’est écarté de la piste cette nuit, côté sud, avant la crête de dunes. Son convoyeur n’a pas rejoint. Ramène-le, et on parlera.

- « J’y vais. » → **fin**

### chariot-attend

> — Le chariot. Côté sud, avant la crête. Le sable aura déjà mangé ses traces, à cette heure. Lis-le quand même.

- « J’y vais. » → **fin**

### adhesion

_Effet : termine la quête « Le chariot perdu », retient « membre-guides-eau », donne 1 × « Une pierre d’eau », donne 1 × « L’eau de l’Année Errante », +40 XP._

> Daru’Khen te tend une pierre ronde, polie par des doigts. — Une pierre d’eau, du Coffre. Porteur·se des Guides de l’Eau. Tu ne choisiras rien, toi non plus : tu suivras l’eau.

- « La prendre. » → **fin**

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

## La doublure du dôme

_Temple du Grand Courant_

Commence par : « doublure » _(si repère « dome-indice »)_ _(sans repère « liste-trouvee »)_, sinon « ordinaire »

### ordinaire

> Au-dessus de la stèle, des dizaines de vieux tissus cousus ensemble tapissent le dôme, bleus d’âge. Le vent les fait respirer.

- « Laisser la doublure. » → **fin**

### doublure

> Des dizaines de vieux tissus cousus ensemble, au-dessus de la stèle. Des prières, des listes, des poèmes, des voiles de deuil. Les coutures ont cinq siècles, ou plus.

- **🎲 Érudition 14** « Chercher « Et pour l’an cinquante ». » → trouvee, ✗ → rien
- _(si repère « rumeur-doublure »)_ **🎲 Érudition 11** « Chercher tout en haut, là où le bleu est le plus pâle. » → trouvee, ✗ → rien
- « Laisser la doublure. » → **fin**

### rien

_Effet : −1 PV._

> Des noms, des noms, des noms. Tes yeux se brouillent avant d’avoir tout lu. Il faudra revenir avec un regard frais.

- « Laisser la doublure. » → **fin**

### trouvee

_Effet : donne 1 × « La liste de l’an cinquante », retient « liste-trouvee », +20 XP._

> Entre deux voiles de prière, un tissu plus long que les autres, couturé de noms en colonnes serrées. En haut : « Et pour l’an cinquante ». Trois cent douze noms. Zélie le décout pour toi, sans un mot.

- « Le prendre. » → **fin**

## Doucenet

_Armateur_

Commence par : « paie » _(si quête « La paie des Brisants » en cours)_ _(sans repère « doucenet-paye »)_, sinon « accueil »

### accueil

> Un armateur aux bagues d’or compte des pièces sur un tonneau. — Doucenet, armement et fret. Si vous cherchez un bateau, j’en ai. Un équipage aussi : il coûte trop cher.

- « Au revoir. » → **fin**

### paie

> — Le Bel-Écart ? L’équipage a perdu une cargaison. Je ne paie pas les pertes.

- _(sans repère « doucenet-ferme »)_ **🎲 Diplomatie 16** « Les Sept Lois : secours et partage en mer. Payez. » → paye, ✗ → refus
- _(sans repère « doucenet-ferme »)_ **🎲 Commandement 16** « Si vous ne payez pas, aucun bateau ne sort du port demain. » → paye, ✗ → refus
- _(si repère « rumeur-bel-ecart »)_ _(sans repère « doucenet-ferme »)_ **🎲 Commandement 13** « Vous avez vendu la cargaison à Terminus, Doucenet. » → paye, ✗ → refus
- « Plus tard. » → **fin**

### paye

_Effet : retient « doucenet-paye », +15 XP._

> Doucenet pâlit, puis compte. — Trois mois. Dites à Matteo que je m’en souviendrai. Il recompte, et ajoute un Fer, pour le principe.

- « Partir. » → **fin**

### refus

_Effet : retient « doucenet-ferme » pour 1 jours._

> — Allez-vous-en. Revenez demain : j’aurai peut-être oublié votre tête.

- « Partir. » → **fin**

## Dova’Ren

_Sa mère_

Commence par : « choix » _(si quête « Sept nuits le même rêve » en cours)_, sinon « apres » _(si quête « Sept nuits le même rêve » terminée)_, sinon « accueil »

### accueil

> Une femme se tient entre toi et le fond de la tente, où une adolescente dort, un foulard noué sur les avant-bras. — Elle dort. Elle dort mal. Ne la réveille pas.

- « Qu’est-ce qu’elle a ? » → mal
- « Pardon. » → **fin**

### mal

_Effet : lance la quête « Sept nuits le même rêve », retient « sept-nuits-commence »._

> — Rien. — Elle ment mal, et elle le sait. — Sept nuits le même rêve. Et la peau des bras qui luit. Les signes de l’Appel. Six sur dix meurent dans la Mer de Verre. Je ne la donnerai pas au Désert.

- « Que veux-tu que je fasse ? » → aide

### aide

> — Rien. Qu’on ne sache pas. Nes’Mira a un baume qui ralentit le verre, dit-on : pour les plaques des Léviathans. Sur une peau, personne n’a essayé.

- « Je reviendrai. » → **fin**

### choix

> Dova’Ren te regarde, les bras croisés. — Alors ? Tu vas le dire au Temple, comme les autres le feraient ?

- « Le dire au Temple. » → temple _(termine la quête « Sept nuits le même rêve », retient « fin-sept-nuits-temple », +40 XP)_
- **🎲 Médecine 16** « Le baume de Nes’Mira, pour cacher le verre. » → cachee, ✗ → rate _(termine la quête « Sept nuits le même rêve », retient « fin-sept-nuits-cachee », +40 XP)_
- _(si repère « ysha-parle »)_ « Qu’elle choisisse, elle. » → choisit _(termine la quête « Sept nuits le même rêve », retient « fin-sept-nuits-choisit », +40 XP)_
- « Pas encore. » → **fin**

### rate

> Le baume brûle la peau d’Ysha’Ren sans rien ralentir. Elle serre les dents. Dova’Ren t’arrache le pot des mains. — Assez.

- « Le dire au Temple. » → temple _(termine la quête « Sept nuits le même rêve », retient « fin-sept-nuits-temple », +40 XP)_
- _(si repère « ysha-parle »)_ « Qu’elle choisisse, elle. » → choisit _(termine la quête « Sept nuits le même rêve », retient « fin-sept-nuits-choisit », +40 XP)_

### temple

> La Marcheuse du Souffle vient le soir même. Les Anciens-Dragons la reconnaîtront, ou non. Dova’Ren ne te regarde plus. Tu ne sauras pas ce que le verre aura fait d’Ysha’Ren.

- « Partir. » → **fin**

### cachee

> Le baume ralentit le verre. Sous le foulard, la peau luira moins, un an, deux peut-être. Le rêve, lui, ne s’arrête pas. Dova’Ren te serre la main sans un mot.

- « Partir. » → **fin**

### choisit

> Ysha’Ren se lève, et dit à sa mère, très calmement, qu’elle ira. Pas parce que le Désert l’a choisie : parce qu’on lui a demandé, une fois. Dova’Ren pleure. Elle ne dit pas non.

- « Les laisser. » → **fin**

### apres

> Dova’Ren plie des toiles, sans lever les yeux. — Ce qui est fait est fait. Va.

- « Partir. » → **fin**

## Un dragonnet

_Le Nid des dragonnets_

Commence par : « nourrir » _(si quête « Le dragonnet » en cours)_, sinon « dragonnet »

### dragonnet

> Un dragonnet rouge, la taille d’un chien, roulé en boule dans le sable du Nid. Il ne lève pas la tête. Ses écailles sont ternes, et sa gamelle est pleine.

- « Le laisser tranquille. » → **fin**

### nourrir

> Le dragonnet ne lève pas la tête. Kéo’Sa te regarde, et attend que tu fasses quelque chose.

- **🎲 Survie 16** « L’aider à manger, avec Kéo’Sa. » → keo, ✗ → refuse _(retient « nid-ami », termine la quête « Le dragonnet », retient « fin-dragonnet-keo », +40 XP)_
- _(si repère « saal-dragonnet »)_ « Le confier aux Liens-Dragons du Cœur. » → liens _(termine la quête « Le dragonnet », retient « fin-dragonnet-liens », +40 XP)_
- **🎲 Diplomatie 16** « Lui parler chaque jour, en attendant ses quinze ans. » → attendre, ✗ → refuse _(retient « nid-ami », termine la quête « Le dragonnet », retient « fin-dragonnet-attendre », +40 XP)_
- « Plus tard. » → **fin**

### refuse

> Il détourne la tête, et souffle un peu de sable sur tes mains. Pas aujourd’hui. Kéo’Sa soupire, à la façon des grandes personnes.

- « Plus tard. » → **fin**

### keo

> Tu tiens la gamelle, Kéo’Sa tient sa tête. Il mange une bouchée, puis tout. Il s’endort la tête sur ses genoux. Le lien est fait. Personne ne pourra le défaire, et Saal’Ema le sait déjà.

- « Les laisser dormir. » → **fin**

### liens

> Une femme des Liens-Dragons vient le chercher le soir. Il la suit, lentement, en se retournant deux fois. Kéo’Sa ne pleure pas devant toi.

- « Partir. » → **fin**

### attendre

> Kéo’Sa promet, la main sur le cœur. Le dragonnet mange un peu quand elle lui parle. Pas de lien : une amitié, en attendant. — Si tu te perds dans le désert, siffle. Il viendra peut-être.

- « Je sifflerai. » → **fin**

## L’échelle de corde

_Sous les nuages_

Commence par : « attente » _(sans repère « caisse-zephyria-reglee »)_, sinon « calme-deux » _(si repère « descente-compagnie »)_ _(sans repère « calme-passe »)_, sinon « calme-deux » _(si repère « descente-vessin »)_ _(sans repère « calme-passe »)_, sinon « calme-un » _(sans repère « calme-passe »)_, sinon « apres »

### attente

> L’échelle de corde pend des nuages. Là-haut, la machine attend, ancrée au-dessus de la cendre. Tu n’es pas descendu·e jusqu’ici pour remonter les mains vides.

- « Suivre les rails, d’abord. » → **fin**

### calme-deux

_Effet : retient « calme-passe »._

> La machine monte. La cendre s’éclaircit, le ciel blanchit. Vers sept cents mètres, le vent tombe d’un coup : le Calme. Le premier cristal se tait. Le second prend le relais, et la machine passe sans un frisson.

- « Regarder en bas. » → edda-calme

### calme-un

> Ravel tient la barre, les yeux mi-clos. — Dis-moi quand. La cendre s’éclaircit. Le vent faiblit, puis faiblit encore. Tu écoutes.

- _(si repère « septieme-juste »)_ **🎲 Survie 14** « Écouter, comme l’écrit la septième voile. » → calme-passe, ✗ → calme-chute
- **🎲 Survie 16** « Écouter le vent. » → calme-passe, ✗ → calme-chute

### calme-chute

_Effet : −3 PV, fait passer 1 moment._

> Trop tard. Le cristal se tait, la machine s’arrête, et redescend, lentement, et il n’y a rien à faire. En bas, Ravel te tend sa gourde sans un mot. — On réessaie quand tu veux.

- « Réessayer. » → calme-un
- « Attendre un peu. » → **fin**

### calme-passe

_Effet : retient « calme-passe », +25 XP._

> — Maintenant ! Ravel pousse la machine avant que le vent ne meure. Le cristal se tait une seconde, puis la machine sort du Calme de l’autre côté, sur sa lancée. Ravel rit, pour la première fois. — Tu l’as entendu.

- « Regarder en bas. » → edda-calme

### edda-calme

> Plus bas, une machine noire ne monte plus. Un seul cristal, éteint. Dedans, deux pilotes qui jurent, et la dame en gris, immobile. Elle redescend, lentement, et il n’y a rien à faire. Sauf toi.

- **🎲 Athlétisme 15** « Lui lancer une corde. » → edda-sauvee, ✗ → edda-manquee
- _(si l’on porte « Second cristal azur »)_ _(sans repère « cristal-edda-vole »)_ « Lui lancer ton second cristal. » → edda-cristal _(reprend 1 × « Second cristal azur »)_
- _(si l’on porte « Second cristal azur »)_ _(si repère « cristal-edda-vole »)_ « Lui lancer le cristal pris dans sa soute. » → edda-sien _(reprend 1 × « Second cristal azur »)_
- « La laisser aux Gardiens du Ciel. » → edda-laissee

### edda-sauvee

_Effet : retient « edda-sauvee-calme », +20 XP._

> La corde se tend. La machine noire remonte dans ton sillage et sort du Calme. La dame en gris lève les yeux vers toi. Elle ne dit pas merci. Elle hoche la tête, une fois, et ne te quitte plus du regard jusqu’au quai.

- « Rentrer au quai. » → arrivee

### edda-cristal

_Effet : retient « edda-sauvee-calme », +20 XP._

> Tu lances le cristal. Un des pilotes l’attrape au vol, le grée de travers, et la machine noire reprend sa montée en tremblant. La dame en gris regarde le cristal, puis toi, longtemps.

- « Rentrer au quai. » → arrivee

### edda-sien

_Effet : retient « edda-sauvee-calme », +20 XP._

> Tu lances le cristal. Un pilote l’attrape, le grée, et la machine noire remonte. La dame en gris le reconnaît : le sien, celui de sa soute. Elle te regarde, et tu ne sais pas si c’est de la colère ou autre chose.

- « Rentrer au quai. » → arrivee

### edda-manquee

_Effet : retient « edda-laissee-calme »._

> La corde file dans le vide, trop courte. La machine noire s’enfonce dans la cendre, lentement. Les Gardiens du Ciel la repêcheront, s’ils arrivent à temps.

- « Rentrer au quai. » → arrivee

### edda-laissee

_Effet : retient « edda-laissee-calme »._

> Tu regardes la machine noire s’enfoncer dans la cendre. Les Gardiens du Ciel la repêcheront, s’ils arrivent à temps. Ils arrivent souvent à temps.

- « Rentrer au quai. » → arrivee

### arrivee

> Le quai, les mâts, le vent. Les gens d’Aetherhaven ne demandent pas d’où tu viens. Ils voient la cendre sur tes vêtements, et ils s’écartent un peu.

- « Descendre de la machine. » → **fin** _(mène à « Aetherhaven — le Quai des Dirigeables », fait passer 1 moment, retient « remonte-du-bas »)_

### apres

> L’échelle de corde pend des nuages. Il n’y a plus rien à chercher en bas.

- « Remonter. » → **fin** _(mène à « Aetherhaven — le Quai des Dirigeables », fait passer 1 moment, retient « remonte-du-bas »)_
- « Rester encore un peu. » → **fin**

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

_Salle des Conques_

Commence par : « apres » _(si repère « edda-conque-vue »)_, sinon « conque »

### conque

_Effet : retient « edda-conque-vue »._

> La dame en gris tient une conque contre son oreille. Elle l’écarte quand tu approches, comme on cache une lettre. — Elle ne parle pas de moi. Pas une fois.

- « Votre mère ? » → mere
- « Vous voulez la caisse ? » → caisse

### mere

> — Elle est passée par Coralia il y a trente ans, en allant au train. Elle a laissé sa voix dans une conque, comme font les marins. Elle y parle de six enfants, de leurs âges, du froid qu’il fait la nuit sur les quais. De moi, rien.

- **🎲 Diplomatie 16** « Laissez-moi l’écouter. » → ecoute, ✗ → non
- « Vous voulez la caisse ? » → caisse

### ecoute

_Effet : retient « conque-ecoutee », +15 XP._

> Elle hésite, puis te tend la conque. Une voix de femme, fatiguée, très calme : « Ilan, sept ans. Naïs, six ans. Corin, huit ans. Sela, cinq ans. Timo, neuf ans. Rhéa, six ans. Je les compte encore. Si je m’arrête, je les perds. »

- « Lui rendre la conque. » → rendue

### rendue

> Elle reprend la conque sans te regarder, et la serre contre elle. — Vous voyez. Pas une fois.

- « Partir. » → **fin**

### non

> — Non. C’est la seule chose qu’elle ait laissée qui ne soit pas à eux.

- « Vous voulez la caisse ? » → caisse
- « Partir. » → **fin**

### caisse

> — Ceux qui me paient la veulent. L’Amirauté ne vendra rien à quelqu’un de Ferros, pas depuis le Cargo Noir. Elle te regarde. — Moi, je veux la liste. Si la porte de cet entrepôt s’ouvre pour vous, pensez à moi.

- « Je verrai. » → **fin**

### apres

> La dame en gris écoute sa conque. Elle ne lève pas les yeux. — Toujours pas.

- « Partir. » → **fin**

## La dame en gris

_Halte des Cendres_

Commence par : « halte-vaincue » _(si repère « escorte-edda-vaincue »)_ _(sans repère « edda-halte-reglee »)_, sinon « halte-choix » _(si repère « edda-ecriture »)_ _(sans repère « edda-halte-reglee »)_, sinon « halte »

### halte

_Effet : retient « edda-ecriture »._

> La dame en gris est assise au bord du quai, le rouleau déroulé sur les genoux, jusqu’à ses pieds, jusque dans la cendre. Elle ne lève pas les yeux. — Ce n’est pas son nom. C’est son écriture.

- « Votre mère ? » → halte-mere
- « Qu’y a-t-il dans la caisse ? » → halte-caisse

### halte-mere

> — Les six mêmes noms, sur toute la longueur. Elle les a écrits, et réécrits. Elle faisait ça avec nos noms à nous, quand j’étais petite, les soirs où elle avait peur de les perdre. Je croyais que c’était un jeu.

- « Qu’y a-t-il dans la caisse ? » → halte-caisse
- « Et maintenant ? » → halte-choix

### halte-caisse

> — Une pièce. Lourde, froide. Ceux qui me paient la veulent ; ils ne m’ont jamais dit pour quoi faire, et je n’ai jamais demandé. Moi, je voulais la liste. Je l’ai.

- « Votre mère ? » → halte-mere
- « Et maintenant ? » → halte-choix

### halte-choix

> Elle roule le tissu lentement, sans le serrer. Derrière elle, les deux Ailes Noires attendent, la main près de la ceinture. — Alors. Qu’est-ce que vous voulez, vous ?

- « Gardez le rouleau. Je prends la pièce. » → halte-partage
- « Je prends tout. » → halte-tout
- « Prenez tout. Je n’en veux pas. » → halte-laissee
- « Personne ne gardera ces noms. » → halte-lache

### halte-partage

_Effet : donne 1 × « Une pièce de la machine », retient « caisse-zephyria-trouvee », retient « edda-partage », retient « caisse-zephyria-reglee », retient « edda-halte-reglee », termine la quête « Les noms qui montent », retient « fin-noms-qui-montent-partage », +60 XP._

> Elle te regarde longtemps, puis pousse la pièce vers toi du bout du pied, sans lâcher le rouleau. — Ceux qui me paient seront déçus. Je leur dirai que vous étiez là avant moi. C’est presque vrai.

- « La regarder partir. » → **fin**

### halte-tout

> Elle sourit pour la première fois, sans joie. — Tout. Bien sûr.

- **🎲 Diplomatie 15** « Vous n’en ferez rien de bon. Donnez-les-moi. » → halte-cede, ✗ → halte-refus
- **🎲 Commandement 15** « Je ne vous le demande pas. » → halte-cede, ✗ → halte-refus
- « Alors on se bat. » → **fin** _(lance le combat « escorte-edda »)_
- « Non. Oublions ça. » → halte-choix

### halte-refus

> — Non. Elle se lève, le rouleau contre elle. Derrière elle, les deux Ailes Noires se redressent. — La pièce, venez la prendre, si vous voulez. Le rouleau, jamais.

- « Alors on se bat. » → **fin** _(lance le combat « escorte-edda »)_
- « Gardez le rouleau. Je prends la pièce. » → halte-partage
- « Prenez tout, alors. » → halte-laissee

### halte-cede

_Effet : donne 1 × « Une pièce de la machine », retient « caisse-zephyria-trouvee », donne 1 × « Le rouleau des six noms », retient « edda-depouillee », retient « caisse-zephyria-reglee », retient « edda-halte-reglee », termine la quête « Les noms qui montent », retient « fin-noms-qui-montent-tout », +60 XP._

> Elle tend le rouleau, et ses doigts ne le lâchent qu’au dernier moment. Puis la pièce. — Vous ne savez même pas ce que c’est. Moi non plus. Ça fait au moins une chose qu’on partage.

- « La regarder partir. » → **fin**

### halte-vaincue

_Effet : donne 1 × « Une pièce de la machine », retient « caisse-zephyria-trouvee », donne 1 × « Le rouleau des six noms », retient « edda-depouillee », retient « caisse-zephyria-reglee », retient « edda-halte-reglee », termine la quête « Les noms qui montent », retient « fin-noms-qui-montent-tout », +60 XP._

> Les deux Ailes Noires ont reculé jusqu’à leur machine. La dame en gris n’a pas bougé. Elle tend le rouleau, puis la pièce. — Vous avez gagné. Je ne sais pas quoi, mais vous avez gagné.

- « La regarder partir. » → **fin**

### halte-laissee

_Effet : retient « caisse-zephyria-prise », retient « edda-tout », retient « caisse-zephyria-reglee », retient « edda-halte-reglee », termine la quête « Les noms qui montent », retient « fin-noms-qui-montent-laissee », +40 XP._

> — Vraiment ? Elle charge la pièce sur l’épaule d’un des pilotes et garde le rouleau contre elle. — Ceux qui me paient vous remercieraient, s’ils savaient remercier. Moi, je vous remercie.

- « La regarder partir. » → **fin**

### halte-lache

_Effet : retient « rouleau-lache »._

> Tu prends le bout du rouleau. Elle ne te retient pas. Le vent du Bas l’emporte d’un coup, et les six noms montent vers les nuages, vers la ville, vers qui voudra les attraper.

- « Regarder la dame en gris. » → halte-lache-2

### halte-lache-2

_Effet : donne 1 × « Une pièce de la machine », retient « caisse-zephyria-trouvee », retient « edda-lache », retient « caisse-zephyria-reglee », retient « edda-halte-reglee », termine la quête « Les noms qui montent », retient « fin-noms-qui-montent-lache », +60 XP._

> Elle regarde le tissu disparaître. — C’était tout ce que j’avais d’elle. Elle se lève, et époussette son manteau. — Prenez la pièce. Je n’ai plus rien à porter.

- « La regarder partir. » → **fin**

## La dame en gris

_Le Niveau Douze_

Commence par : « quai » _(à « Sous les cryptes — la voie sept »)_, sinon « nom » _(si quête « Ce que la glace a pris » en cours)_ _(sans repère « edda-khrysos-vue »)_, sinon « attend » _(si quête « Ce que la glace a pris » en cours)_, sinon « apres »

### nom

_Effet : retient « edda-khrysos-vue »._

> La dame en gris est assise sur un banc de glace, devant le Puits, une fourrure jetée sur son manteau gris. Elle ne se lève pas. — J’ai lu la lacune, moi aussi. Le nom, à la place de l’auteur, c’est celui de ma mère. Elle a brisé un écho. Elle savait ce qu’on en ferait.

- « Briser un écho ? » → echo
- « Que faisait-elle ici ? » → ici
- « Ce qu’on en ferait ? Tes Réveilleurs, par exemple ? » → reveilleurs
- « Et maintenant ? » → attend

### echo

> — C’est ce qu’ils disent, ici, quand quelqu’un détruit la preuve qui l’aurait sauvé, pour qu’on ne s’en serve pas. Elle a cassé la face qui disait où dormait la caisse. Puis elle est allée le dire au Collège, et elle a signé.

- « Que faisait-elle ici ? » → ici
- « Et maintenant ? » → attend

### ici

> — La même chose que moi. Elle suivait les caisses. Celle-ci, elle l’a trouvée, et elle l’a laissée. Elle a tout fait pour que personne ne la trouve après elle. Et me voilà, trente ans plus tard, à la chercher quand même.

- « Et maintenant ? » → attend

### reveilleurs

> Elle te regarde enfin. — Par exemple. Ou toi. Ou le Collège, qui la consignerait et la laisserait pourrir dans un cahier. Ma mère ne faisait confiance à personne. Je commence à comprendre pourquoi.

- « Et maintenant ? » → attend

### attend

> — On ne descend pas seul aux cryptes. Je n’ai personne d’autre que toi à qui le demander, et je déteste demander. Descends avec moi. Tu regarderas mes mains ; je regarderai les tiennes.

- _(sans repère « caisse-glacialis-reglee »)_ « Descendons ensemble. » → descente
- « Pas avec toi. » → pas-toi
- « Plus tard. » → **fin**

### descente

_Effet : retient « cryptes-ouvertes » pour 1 jours, retient « descendu-edda »._

> Le gardien des cryptes vous compte, deux fois, et tourne la clé. La dame en gris passe la première. Elle ne regarde pas les cristaux. Elle compte les allées, à voix basse, jusqu’à sept.

- « Descendre. » → **fin** _(mène à « Khrysos — les cryptes »)_

### pas-toi

> — Comme tu voudras. Elle croise les bras. — Trouve-toi un autre second, alors. Les Vigiles Blancs aiment rendre ce genre de service. Moi, j’attendrai que la grille reste ouverte assez longtemps.

- « Au revoir. » → **fin**

### quai

> La dame en gris s’est arrêtée devant le grand cristal, les mains dans les poches. — Elle l’a vue, elle aussi. Elle est restée là, à l’endroit où tu es. Et elle est remontée sans elle. Je ne sais pas si j’en serais capable.

- « Je te laisse un moment. » → **fin**

### apres

> La dame en gris ne lève pas les yeux. — Il fait trop froid pour parler, Gardien. Et nous n’avons plus rien à nous dire, ici.

- « Au revoir. » → **fin**

## La dame en gris

_La halte morte_

Commence par : « soif » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « edda-marche-vue »)_, sinon « caisse »

### soif

_Effet : retient « edda-marche-vue »._

> La dame en gris est assise contre une caisse ouverte, les lèvres fendues, une gourde vide à ses pieds. Elle lève les yeux vers toi. — Elle est venue jusqu’ici, elle aussi. Les Gardiennes l’ont comptée. Le lendemain matin, elle était dans un nombre.

- _(si l’on porte « L’eau de l’Année Errante »)_ « Lui tendre ta gourde. » → boit _(reprend 1 × « L’eau de l’Année Errante », retient « edda-eau »)_
- _(si l’on porte « L’eau de l’Année Errante »)_ « Ta gourde contre la caisse. » → marchandee _(reprend 1 × « L’eau de l’Année Errante », retient « edda-marchandee »)_
- « Je n’ai pas d’eau à te donner. » → sans-eau

### boit

> Elle boit sans fierté, à longues gorgées, et te rend la gourde vide. — Merci. Je m’en souviendrai : je me souviens de tout, c’est bien mon malheur. Regarde ce qu’elle a laissé.

- « Regarder dans la caisse. » → caisse

### marchandee

> Elle te regarde longtemps. — Dans la Communion, ce que tu fais là s’appelle un sacrilège. — Elle prend la gourde quand même, boit, et se lève. — La caisse est à toi. Je n’oublierai pas le prix.

- « Regarder dans la caisse. » → caisse

### sans-eau

> — Alors assieds-toi un moment. Il n’y a rien d’autre à faire, à la halte, que regarder ce qu’elle a laissé.

- « Regarder dans la caisse. » → caisse

### caisse

> Dans la caisse, une pièce de la machine, emballée dans une toile que le sable n’a pas mangée, et une liste : Inès, six ans ; Pavel, huit ans ; Lila, cinq ans ; Oren, sept ans ; Nadia, neuf ans ; Sacha, six ans. La même main que sur les autres.

- « La laisser ici, à sa halte. » → halte _(retient « caisse-communion-trouvee », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-halte », +60 XP)_
- « Prendre la pièce. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-communion-trouvee », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-gardee », +60 XP)_
- **🎲 Athlétisme 16** « La rapporter à la Marche, à Longue-Ombre. » → longue-ombre, ✗ → trop-lourde _(retient « caisse-communion-trouvee », fait passer 2 moments, retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-longue-ombre », +60 XP)_
- _(sans repère « edda-marchandee »)_ « La laisser à la dame en gris. » → edda _(retient « caisse-communion-prise », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-edda », +60 XP)_

### trop-lourde

> Tu la soulèves d’un pouce, et tu la reposes. Neuf kilomètres de sable, avec ça sur le dos : tu ne les feras pas. La dame en gris te regarde sans rien dire.

- _(si repère « membre-guides-eau »)_ « Les guides ont des chariots. » → longue-ombre _(retient « caisse-communion-trouvee », fait passer 2 moments, retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-longue-ombre », +60 XP)_
- « La laisser ici, à sa halte. » → halte _(retient « caisse-communion-trouvee », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-halte », +60 XP)_
- « Prendre la pièce, seulement. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-communion-trouvee », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-gardee », +60 XP)_
- _(sans repère « edda-marchandee »)_ « La laisser à la dame en gris. » → edda _(retient « caisse-communion-prise », retient « caisse-communion-reglee », termine la quête « Ce qui n’a plus lieu », retient « fin-plus-lieu-edda », +60 XP)_

### halte

> Tu refermes le plomb sur la liste. La dame en gris se lève, regarde le jalon, puis toi. — Personne ne l’aura, alors. C’est peut-être ce qu’elle voulait. — Elle repart vers la piste, sans se retourner.

- « Rester encore un peu. » → **fin**

### gardee

> Tu charges la pièce sur ton dos ; elle est lourde et froide. La dame en gris recopie la liste dans le sable, de mémoire, avec son doigt, un nom après l’autre. Le vent les efface derrière elle.

- « Partir. » → **fin**

### longue-ombre

> Le soir, la caisse sur le dos, tu rattrapes la Marche. Nes’Mira t’aide à la hisser sur la carapace, entre deux plaques. Longue-Ombre ne bronche pas. Elle marchera avec la ville, maintenant.

- « Souffler. » → **fin** _(mène à « Marche-Mère — le dos de Longue-Ombre »)_

### edda

> Tu t’écartes. Elle charge la caisse sur son dos, sans un mot, et part vers le sud, pas vers la Marche. Derrière la dune, des silhouettes l’attendaient.

- « La regarder partir. » → **fin**

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
- _(sans repère « raconte-elouan »)_ « Je connais une chanson, si tu veux l’entendre. » → raconte-neutre 📖 raconter un Récit : berceuse-de-maelis → raconte-berceuse ; chansons, arbres → raconte-touche ; autres → raconte-neutre
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
- _(sans repère « raconte-elouan »)_ « Je connais une chanson, si tu veux l’entendre. » → raconte-neutre 📖 raconter un Récit : berceuse-de-maelis → raconte-berceuse ; chansons, arbres → raconte-touche ; autres → raconte-neutre
- « Au revoir, Elouan. » → **fin**

### raconte-neutre

_Effet : retient « raconte-elouan », +5 XP._

> Elouan écoute en caressant le bois d’une flûte inachevée. — Il manque une musique à ton histoire. Ça viendra : les histoires finissent toujours par en trouver une.

- « Au revoir, Elouan. » → **fin**

### raconte-touche

_Effet : retient « raconte-elouan », +10 XP._

> Elouan ferme les yeux et marque la mesure du doigt sur l’établi. — Celle-là chante déjà toute seule. Je n’aurai qu’à lui tailler un instrument.

- « Au revoir, Elouan. » → **fin**

### raconte-berceuse

_Effet : retient « raconte-elouan », +15 XP._

> Elouan prend une flûte de saule et rejoue la berceuse d’un trait, juste du premier coup. — Les berceuses voyagent mieux que les gens : personne ne leur demande de papiers.

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

## Maître Ennir

_Tisseur de Givre_

Commence par : « choix » _(si quête « Les quatorze années de mesures » en cours)_ _(si repère « dagny-vue »)_, sinon « accueil »

### accueil

> Un homme maigre aux longs gants, du givre aux manches, penché sur un cristal qu’il fait chanter d’un doigt mouillé. — Maître Ennir, Tisseur de Givre. Je tisse le froid, pour qu’il tienne une forme. Ne touchez à rien de ce qui sonne.

- « Qu’est-ce que tu tisses ? » → tisse
- _(sans repère « raconte-ennir »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : corvan → raconte-special ; ancien-monde, machines → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### tisse

> — Des voûtes, des ponts de glace, des cristaux d’archive qui tiennent droit. J’ai appris d’un homme qui avait appris d’un autre. On ne prononce plus le nom du premier. Il était le meilleur de nous tous.

- _(si quête « Les quatorze années de mesures » pas commencée)_ « Le premier, c’était Nher-Khal ? » → carnet
- « Au revoir. » → **fin**

### carnet

_Effet : lance la quête « Les quatorze années de mesures », retient « carnet-connu »._

> Ennir pose un doigt mouillé sur le cristal, qui se tait. — Mon maître avait appris de son élève. Il a laissé ceci. Un petit cristal de mesures : des températures, des dates, des numéros de prise. Quatorze ans. Tout va dans le même sens. Rien ne conclut.

- « Qui le veut ? » → dagny-q

### dagny-q

> — Dagny Ferme-Givre, des 4 611 : les familles dont il a brisé les morts. Elle vient chaque semaine. Elle dit qu’elle veut le faire condamner pour de bon. Elle est bien riche, pour quelqu’un qui veut seulement une condamnation.

- « Je vais lui parler. » → **fin**

### choix

> — Vous l’avez vue. Ennir tient le petit cristal dans son gant, sans le serrer. — Je ne peux pas le garder toute ma vie, ni le donner à n’importe qui. Il a brisé les siennes pour qu’on n’ouvre pas les prises. Décidez, vous : moi, je n’y arrive pas.

- « Le donner à Dagny. » → donne _(termine la quête « Les quatorze années de mesures », retient « fin-quatorze-annees-dagny », +60 XP)_
- « Le cacher. Personne ne doit l’avoir. » → cache _(termine la quête « Les quatorze années de mesures », retient « fin-quatorze-annees-garde », +60 XP)_
- « Le briser, comme il a brisé les siennes. » → brise _(termine la quête « Les quatorze années de mesures », retient « fin-quatorze-annees-brise », +60 XP)_
- « Je ne sais pas encore. » → **fin**

### donne

> Ennir enveloppe le cristal dans un gant et te le confie. Le soir, Dagny le reçoit sans un mot, et sourit pour la première fois. Chez les 4 611, il y a ceux qui veulent une condamnation, et ceux qui veulent ouvrir les prises pour savoir.

- « Partir. » → **fin**

### cache

> Ennir glisse le cristal sous une dalle de son atelier, et pousse l’établi dessus. — Il attendra. Les mesures ne pourrissent pas. Un jour, quelqu’un saura peut-être les lire sans ouvrir personne.

- « Partir. » → **fin**

### brise

> Ennir hésite, puis te tend le cristal. Tu le poses sur l’établi et tu frappes une fois. Quatorze ans de mesures, en éclats. — Il aurait compris, dit Ennir. C’est ce qu’il a fait, lui aussi. Briser un écho.

- « Partir. » → **fin**

### raconte-special

_Effet : retient « raconte-ennir », +15 XP._

> Ennir arrête son cristal. — Un savant que tout le monde a pris pour un fou. Je sais ce que c’est. Mon maître en connaissait un, et il a passé sa vie à ne pas prononcer son nom.

- « Au revoir. » → **fin**

### raconte-touche

_Effet : retient « raconte-ennir », +10 XP._

> — Une histoire de choses qui marchent sans qu’on sache pourquoi. Le givre aussi, quand on le tisse. Merci.

- « Au revoir. » → **fin**

### raconte-neutre

_Effet : retient « raconte-ennir », +5 XP._

> — Merci. Il retourne à son cristal, qui recommence à chanter.

- « Au revoir. » → **fin**

## Eskil Kolm

_De Ferros, caché dans le convoi_

Commence par : « choix » _(si quête « Le Forage Noir » en cours)_ _(si repère « hiran-eskil »)_, sinon « attend » _(si quête « Le Forage Noir » en cours)_, sinon « apres-marcheur » _(si repère « fin-forage-noir-marcheur »)_, sinon « accueil »

### accueil

> Un homme pâle sous une toile de Marcheur, des mains d’ouvrier. Il parle bas, avec l’accent d’Ironheart. — Ne dis pas mon nom trop fort. Eskil Kolm. J’étais sur la foreuse, en 2995. Le seul qui n’était pas dedans quand les dragons sont arrivés.

- « Et depuis ? » → depuis
- _(sans repère « raconte-eskil »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : matricule-4-17 → raconte-special ; machines, familles → raconte-touche ; autres → raconte-neutre
- « Je n’ai rien entendu. » → **fin**

### depuis

_Effet : lance la quête « Le Forage Noir », retient « forage-commence »._

> — Depuis, je marche. Cinq ans. Les Gardiennes me donnent l’eau, comme à tout le monde. La Matriarche des cristaux m’a reconnu la semaine dernière. Elle veut me rendre à Ferros, par Terminus, contre un meilleur prix sur le verre.

- « Que veux-tu, toi ? » → veut

### veut

> — Rester. Devenir Marcheur, si on veut de moi. Ou rentrer, si on ne veut pas. Mais pas être vendu. Pas encore une fois : Ferros m’a déjà vendu une fois, à une foreuse.

- « Je vais parler à la Matriarche. » → **fin**

### attend

> — Tu as vu la Matriarche ? Elle sourit beaucoup, pour quelqu’un qui compte en Fers.

- « Pas encore. » → **fin**

### choix

> Eskil se ronge l’ongle du pouce jusqu’au sang. — Alors ? Qu’est-ce qu’on fait de moi ?

- _(si repère « hiran-cede »)_ « Tu peux rester : la Matriarche a cédé. » → marcheur _(termine la quête « Le Forage Noir », retient « fin-forage-noir-marcheur », +40 XP)_
- « Je t’emmène à Sept-Portes, avec la caravane. » → rentre _(termine la quête « Le Forage Noir », retient « fin-forage-noir-rentre », +40 XP)_
- « La Matriarche fera ce qu’elle veut. » → livre _(termine la quête « Le Forage Noir », retient « fin-forage-noir-livre », +20 XP)_

### marcheur

> Eskil s’assoit dans le sable et pleure, sans bruit. — Cinq ans que je marche sans savoir si j’en avais le droit. — Le lendemain, il a retiré sa veste de Ferros, et il ne l’a pas remise.

- « Bonne route, Eskil. » → **fin**

### rentre

> Il part avec la caravane des verriers, caché entre deux caisses de lentilles. À Sept-Portes, il prendra le train d’Ironheart. — Ils me demanderont où j’étais. Je leur dirai : je marchais.

- « Bon retour, Eskil. » → **fin**

### livre

> Deux jours plus tard, la caravane part pour Terminus avec un homme de plus, les mains liées dans le dos. Il ne se retourne pas vers toi. La Matriarche, elle, te salue.

- « Détourner les yeux. » → **fin**

### apres-marcheur

> Eskil porte une toile de Marcheur, sans rien dessous qui rappelle Ferros. Il marche à côté des chariots, pieds nus, et il a appris à ne plus compter les kilomètres.

- « Bonne route. » → **fin**

### raconte-special

_Effet : retient « raconte-eskil », +15 XP._

> Eskil écoute sans bouger. À la fin : — Quatre-dix-sept. Chez nous, j’étais un numéro de foreuse. Ici, personne ne m’en a donné. Il essuie ses yeux avec le pouce. — Merci.

- « Merci, Eskil. » → **fin**

### raconte-touche

_Effet : retient « raconte-eskil », +10 XP._

> — Une histoire de chez moi. Ça fait du bien, et ça fait mal. Les deux.

- « Merci, Eskil. » → **fin**

### raconte-neutre

_Effet : retient « raconte-eskil », +5 XP._

> — Merci. Parle doucement, quand même.

- « Merci, Eskil. » → **fin**

## Euria Sel-Doux

_Murmureuse des Profondeurs Chuchotantes_

Commence par : « don » _(si quête « Ce que la mer rend » en cours)_ _(sans repère « euria-don »)_, sinon « retour-combat » _(si quête « La grotte du Grand Reflux » en cours)_ _(si repère « lio-libre »)_ _(si repère « abyssaux-vaincus »)_, sinon « retour-parole » _(si quête « La grotte du Grand Reflux » en cours)_ _(si repère « lio-libre »)_ _(si repère « abyssaux-partis »)_, sinon « retour-discret » _(si quête « La grotte du Grand Reflux » en cours)_ _(si repère « lio-libre »)_, sinon « lio » _(si quête « La grotte du Grand Reflux » pas commencée)_ _(si quête « Ce que la mer rend » terminée)_, sinon « accueil »

### accueil

> Une Murmureuse au masque de coquillage écoute, une main à plat sur l’autel. — La mer se souvient que nous sommes venus, dit-elle. Et nous, moins bien. Asseyez-vous, si vous voulez écouter.

- « Écouter. » → ecoute
- « Au revoir. » → **fin**

### ecoute

_Effet : +5 PV._

> Tu écoutes. Sous le temple, quelque chose de très grand respire, lentement. Le masque d’Euria vibre avec. Tu ne sais pas combien de temps passe.

- « Remercier Euria. » → **fin**

### don

> Euria Sel-Doux lève son masque. — La caisse. Nous l’avions donnée à la mer, il y a longtemps, au bout de la voie qui entre dans l’eau. La mer l’a rendue. Une offrande rendue, c’est un présage, et celui-là est mauvais.

- « Que faut-il faire ? » → don-2

### don-2

_Effet : retient « euria-don »._

> — La rendre encore, à marée basse, là où elle avait été donnée. Mais quelqu’un a demandé à la Mère-Abysse de la faire remonter. Tant que cette demande court, la mer la rendra. Va à la Salle des Conques : Oaïna sait qui.

- « J’y vais. » → **fin**

### lio

> Euria ne porte pas son masque. — Lio, mon novice, n’est pas rentré. Les Abyssaux le voulaient : un novice entend la Mère-Abysse sans savoir lui parler. Ils l’ont emmené dans la grotte du Grand Reflux, qui ne s’ouvre qu’à marée basse.

- « J’y vais. » → **fin** _(lance la quête « La grotte du Grand Reflux »)_
- « Plus tard. » → **fin**

### retour-combat

_Effet : +40 XP, termine la quête « La grotte du Grand Reflux », retient « fin-grotte-reflux-combat »._

> Euria serre Lio contre elle, sans un mot pour les morts de la grotte. Puis, à voix basse : — La mer les prendra. Elle les voulait tant.

- « Partir. » → **fin**

### retour-parole

_Effet : +50 XP, termine la quête « La grotte du Grand Reflux », retient « fin-grotte-reflux-parole »._

> — Tu leur as rendu leurs mots ? Euria remet son masque, et tu ne vois plus que ses yeux. — C’est la seule arme qui compte, ici. Ils ne reviendront pas avant d’avoir trouvé une meilleure phrase.

- « Partir. » → **fin**

### retour-discret

_Effet : +45 XP, termine la quête « La grotte du Grand Reflux », retient « fin-grotte-reflux-discretion »._

> Euria pose la main sur la tête de Lio. — Ils prieront toute la nuit, sans s’apercevoir de rien. La Mère-Abysse ne répond pas à ceux qui parlent tout seuls.

- « Partir. » → **fin**

## Évrard Tiédevent

_Aéromancien de Cumulus_

Commence par : « compare » _(si quête « Les onze états » en cours)_ _(si l’on porte « Le carnet du Perchoir »)_, sinon « choix » _(si quête « Les onze états » en cours)_ _(si repère « septieme-juste »)_, sinon « accueil »

### accueil

> Un homme en manteau gris perle compare deux tissus à la loupe, en marmonnant des chiffres. — Neuf pour cent. Neuf ! Pardon. Évrard Tiédevent, aéromancien, de Cumulus. Vous savez lire une vitesse minimale ?

- « Neuf pour cent de quoi ? » → neuf
- « Le Calme, c’est quoi, au juste ? » → calme
- _(si quête « Les onze états » pas commencée)_ « Je peux vous aider ? » → aide
- « Au revoir. » → **fin**

### neuf

> — Trois des onze états de la septième voile donnent des vitesses minimales trop basses de neuf pour cent. Ce sont les trois plus recopiés, parce que ce sont les plus courts. J’ai demandé au Conseil des Vents d’arrêter une version.

- « Et alors ? » → conseil
- « Au revoir. » → **fin**

### conseil

> — Six ans. Cinq, peut-être, si je crie assez fort. Il range la voile dans un étui de cuir, avec un soin de notaire. — Au moins, il y aura une version sur leur table. Quelqu’un finira par la lire.

- « Au revoir. » → **fin**

### calme

> — Une couche sans vent, vers sept cents mètres. Elle se déplace, on ne la voit pas. Un cristal ne porte qu’à proportion de l’air qui passe : dans le Calme, il se tait. Avec un seul cristal, il faut l’avoir traversé avant qu’il se taise.

- « Comment on sait qu’on y entre ? » → oreille
- « Au revoir. » → **fin**

### oreille

> — À l’oreille. Le cristal change de note juste avant. La septième voile le dit, et c’est là que les états ne s’accordent pas. Mauvaise note, mauvais moment.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### aide

_Effet : lance la quête « Les onze états », retient « onze-carnet-demande »._

> — Les Ailes Noires tiennent un carnet, au Perchoir : chaque traversée du Calme, la vitesse en tête, et qui est revenu. Avec lui, je saurai quel état ramène les gens. Ravel ne me le prêtera jamais : pour lui, je suis une règle qui marche.

- « Je vais le chercher. » → **fin**
- « Je verrai. » → **fin**

### compare

_Effet : reprend 1 × « Le carnet du Perchoir », donne 1 × « La septième voile, l’état juste », retient « septieme-juste », +30 XP._

> Évrard ouvre le carnet comme un livre saint et compare, ligne à ligne, les traversées et les onze états. Il pâlit, puis sourit. — Le neuvième. Ceux qui l’avaient en tête sont revenus. Les trois courts, eux, ont des croix.

- « Et maintenant ? » → choix

### choix

> — J’ai recopié l’état juste sur une voile, pour vous. Le Conseil en débattrait six ans, mais il saurait. Ou vous la lâchez au garde-fou du Lâcher, à la manière d’Aerys. Ou vous la gardez. Je rendrai le carnet moi-même, sans un mot.

- « Au Conseil des Vents. » → conseil _(retient « onze-conseil », termine la quête « Les onze états », retient « fin-onze-etats-conseil »)_
- « Je la lâcherai au vent. » → lache _(retient « onze-a-lacher »)_
- « Je la garde. » → garde _(termine la quête « Les onze états », retient « fin-onze-etats-garde »)_

### lache

> — Au garde-fou du Lâcher, alors. Quiconque l’attrapera l’aura, et personne ne la lui aura imposée. Évrard rit, un peu faux. — Aerys serait contente. Moi, je préfère les livres. C’est sans doute pour ça qu’on ne m’écoute pas.

- « Au revoir. » → **fin**

### garde

> Évrard ne dit rien, longtemps. — Elle est à vous. Aerys aurait dit pareil. Je ne suis pas sûr qu’elle aurait eu raison.

- « Au revoir. » → **fin**

## La Faille

_Gare Engloutie_

Commence par : « bord » _(si quête « Ce que cherchait la foreuse » en cours)_, sinon « faille »

### faille

> La Faille, au pied de la foreuse. Elle respire, froide, et l’on entend de l’eau tout au fond.

- « S’éloigner du bord. » → **fin**

### bord

> La Faille s’ouvre au pied de la foreuse arrêtée. En bas, à quelques mètres, un quai : le quai sept, enfoui sous la gare. Une corde de Ferros pend encore, oubliée par les foreurs.

- **🎲 Athlétisme 12** « Descendre par la corde. » → bas, ✗ → glisse
- « Descendre le long des racines. » → bas _(−3 PV)_
- « Plus tard. » → **fin**

### glisse

_Effet : −2 PV._

> La corde file entre tes mains, brûle tes paumes, et tu remontes comme tu peux. La Faille n’a pas bougé.

- « Réessayer. » → bord
- « Plus tard. » → **fin**

### bas

_Effet : retient « faille-quai-sept »._

> Le quai sept, sous la Gare Engloutie. L’eau du ruisseau suinte des voûtes. Contre le butoir, une caisse plombée, prise dans la boue : la foreuse s’est arrêtée à deux mètres d’elle. Le plomb a tenu ; le bois, non.

- « L’ouvrir. » → ouverte

### ouverte

> Dedans, une pièce lourde et froide, emballée de toile, et une liste. L’eau a bu les noms : il ne reste que des traînées d’encre, et des âges. Sept, six, huit, cinq, six, neuf.

- « Prendre la pièce. » → gardee _(donne 1 × « Une pièce de la machine », retient « caisse-verdantis-trouvee », +40 XP, termine la quête « Ce que cherchait la foreuse », retient « fin-sous-la-faille-gardee »)_
- « La confier à Ilyane, au relais des Gardiens. » → gardiens _(retient « caisse-verdantis-trouvee », +40 XP, termine la quête « Ce que cherchait la foreuse », retient « fin-sous-la-faille-gardiens »)_
- « La laisser sous la Faille. » → laissee _(retient « caisse-verdantis-trouvee », +40 XP, termine la quête « Ce que cherchait la foreuse », retient « fin-sous-la-faille-laissee »)_

### gardee

> Tu remontes avec la pièce sur le dos. Elle est froide, et elle le reste, même contre toi.

- « Remonter. » → **fin**

### gardiens

> Tu remontes la pièce jusqu’au relais. Ilyane la range sous son lit, avec ses carnets. — Je ne saurai pas ce que c’est. Je saurai que tu me l’as confiée. Pour l’instant, c’est assez.

- « Merci, Ilyane. » → **fin**

### laissee

> Tu refermes ce qui reste du bois sur la pièce. La Faille l’a gardée jusqu’ici ; elle la gardera encore. Tu remontes sans elle.

- « Remonter. » → **fin**

## Un Ferrôme au rebut

_Contre le mur de l’atelier Cendrefer_

Commence par : « apres » _(si repère « ferrome-reveille »)_, sinon « regard »

### regard

> Contre le mur de l’atelier Cendrefer, sous des tôles et des tuyaux rangés, une main de métal dépasse. Ses doigts bougent encore, lentement : ils comptent jusqu’à quatre, puis recommencent.

- _(sans repère « ferrome-etincelle »)_ **🎲 Artisanat 12** « Ouvrir sa plaque de poitrine et rebrancher sa voix. » → voix, ✗ → etincelle
- « Le laisser compter. » → **fin**

### etincelle

_Effet : −2 PV, retient « ferrome-etincelle » pour 1 jours._

> Un fil mal isolé crache une étincelle bleue : ta main s’engourdit jusqu’au coude. Les doigts de métal n’ont pas cessé de compter. Il te faudra reprendre à froid, demain.

- « Reculer. » → **fin**

### voix

> Une voix grésille, très polie : « Matricule quatre-dix-sept, porteur. En attente de : Irma Kessel, riveteuse, Équipe Six. Elle a dit : attends-moi ici, je redescends. » Les doigts s’arrêtent de compter.

_Si Boulon voyage avec toi :_ Boulon pose sa main sur l’épaule de métal. « On ne fond pas un Ferrôme : on le range. Moi, j’ai eu de la chance. »

- « Depuis quand attends-tu ? » → attente

### attente

_Effet : retient « ferrome-reveille », retient le Récit « Quatre-dix-sept », +20 XP._

> « Quatorze mille six cents relèves. » Une relève par jour : quarante ans. « Elle est montée aux Manufactures, avec son Innovation. Ceux qui montent ne redescendent pas. Je le sais. J’attends quand même. »

- « Je dirai qu’on t’attend, toi aussi. » → **fin**
- « Refermer la plaque. » → **fin**

### apres

> Quatre-dix-sept ne compte plus sur ses doigts. Quand tu passes, sa voix grésille : « Toujours en attente. Merci de demander. »

- « À bientôt, quatre-dix-sept. » → **fin**

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
- « Ouvrir la chaudière en grand, et courir. » → chaudiere _(retient « foreuse-sabotee », retient « foreuse-explosee », retient « chantier-arrete », termine la quête « Le Dernier Train », retient « fin-dernier-train-chaudiere », +50 XP, +30 Fers, avis de Liane −2)_
- « Repartir sans rien toucher. » → **fin**

### sabotee

_Effet : retient « foreuse-sabotee », retient « chantier-arrete », termine la quête « Le Dernier Train », retient « fin-dernier-train-sabotage », +70 XP, +30 Fers._

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

## La garde des Portes

_Les Portes de Glace_

Commence par : « face » _(si quête « Une lacune à signer » en cours)_ _(si repère « face-portes-vue »)_ _(sans repère « garde-avoue »)_ _(sans repère « garde-nie »)_, sinon « preuve » _(si quête « Le yéti des Portes » en cours)_ _(si repère « traces-bottes »)_, sinon « yeti » _(si quête « Le yéti des Portes » en cours)_, sinon « accueil »

### accueil

> Une garde en manteau gris-bleu, une lance de fer à pointe de glace. Elle te regarde des bottes jusqu’au col. — Vous venez du train. Bien. Ceux qui arrivent à pied, par la surface, je dois les renvoyer. La loi de 2995.

- « Les renvoyer où ? » → ou
- « Et la surface ? » → surface
- « Je passe. » → **fin**

### ou

> — Dehors. Vers le sud, vers ce qui reste de chez eux. La Loi de Survie dit le contraire : refuser l’abri, c’est un crime. Alors on leur donne une nuit au tunnel chaud, et au matin on referme. Tout le monde a raison, et personne ne dort.

- « Et la surface ? » → surface
- « Je passe. » → **fin**

### surface

> — Moins soixante. Sans manteau, on y perd une main en une heure, et le reste dans la journée. Brodd Facettier en vend aux Galeries Chaudes. Et ne sifflez jamais dans le blizzard : ça appelle ce qu’on n’a pas envie de voir.

- « Les renvoyer où ? » → ou
- « Je passe. » → **fin**

### yeti

> — Le Yéti ? Le marchand de Ferros jure que c’est lui. Personne n’a rien vu. J’ai ordre de le renvoyer demain : un Yéti aux Portes, ça se soupçonne mieux que ça ne se voit.

- _(sans repère « fin-cristal-ecoute-brise »)_ « Faites rendre le cristal espion des Galeries : il a vu le marché. » → espion _(termine la quête « Le yéti des Portes », retient « fin-yeti-portes-espion », +50 XP, retient « yeti-portes-reglee »)_
- _(si repère « rumeur-cocher-suif »)_ **🎲 Diplomatie 13** « Le cocher du marchand vend des bougies de suif au marché, à moitié prix. » → preuve-cocher, ✗ → cocher-non
- « Je reviens avec mieux. » → **fin**
- « Et la surface ? » → surface

### espion

> Elle hésite, puis envoie un garde. Le cristal espion rend la nuit du marché : le cocher du marchand, qui vend des bougies de suif à moitié prix. Korvek est libre. Le cristal a servi, et ce qui sert, on en pose d’autres.

- « Bien. » → **fin**

### preuve

_Effet : termine la quête « Le yéti des Portes », retient « fin-yeti-portes-innocent », +60 XP, retient « yeti-portes-reglee »._

> Tu lui montres les bottes, sous les autres. Elle s’accroupit, longtemps. — Ferros. Le cocher du marchand. Elle se relève. — Le Yéti reste. Je n’aime pas avoir eu tort, et j’aime encore moins le dire à un Yéti.

- « Merci. » → **fin**

### face

> Tu parles de la face brisée du registre. La garde ne bouge pas. — Une face qui manque, ça arrive. Le froid, la fatigue du cristal.

- **[Perception 6]** « Il y a de la poussière de cristal sur vos gants. » → avoue
- **🎲 Investigation 18** « Vous étiez seule de garde, cette nuit-là. » → avoue, ✗ → nie
- « Je me suis trompé·e. » → **fin**

### avoue

_Effet : retient « garde-avoue »._

> Elle retire ses gants, lentement. — Cette nuit-là, j’ai renvoyé une famille. Une mère, un enfant. Le registre l’a rendu en entier, et j’ai entendu ma voix leur dire de partir. Alors j’ai brisé la face. Signez mon nom. Je ne me cacherai pas.

- « Je le dirai au Collège. » → **fin**

### nie

_Effet : retient « garde-nie » pour 1 jours._

> — Je ne sais pas de quoi vous parlez. Revenez demain si vous voulez : je dirai la même chose.

- « À demain. » → **fin**

### preuve-cocher

_Effet : termine la quête « Le yéti des Portes », retient « fin-yeti-portes-innocent », +60 XP, retient « yeti-portes-reglee »._

> La garde envoie quelqu’un au marché. Il revient avec une bougie de suif et un cocher de Ferros aux bottes ferrées, qui ne dit rien. — Le Yéti reste, dit-elle. Je n’aime pas avoir eu tort.

- « Merci. » → **fin**

### cocher-non

> — Des bougies au marché ? Il y en a toujours. Ce n’est pas une preuve, c’est une rumeur de veillée. Apportez-moi mieux.

- « Au revoir. » → **fin**

## Gardienne du Ciel

_Le Quai des Dirigeables_

Commence par : « asile » _(si quête « L’asile » en cours)_, sinon « accueil »

### accueil

> Une femme en uniforme bleu d’orage, un brassard turquoise ; sa peau luit un peu, d’un reflet de foudre. — Bienvenue à Aetherhaven. Je ne demanderai pas d’où vous venez : ça ne se fait pas, chez nous. Il vous faut quelque chose ?

- « Qui êtes-vous ? » → gardiens
- _(si repère « page-lue »)_ « Une dame en gris est passée par ici ? » → dame
- « Comment descend-on sous les nuages ? » → bas
- « Au revoir. » → **fin**

### gardiens

> — Gardienne du Ciel. On règle le trafic, on repêche ceux qui tombent, quand on arrive à temps. Le reste, la Charte s’en charge, ou personne.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### dame

_Effet : retient « perchoir-indique »._

> — Je ne demande pas. Mais je regarde. Un manteau gris, des gants de Ferros. Elle a voulu savoir qui descend sous les nuages. Les compagnies ont dit non. Elle est montée au Perchoir, sur l’îlot du nord-est.

- « Autre chose. » → accueil
- « Merci. » → **fin**

### bas

> — On n’y descend pas. Les routes déclarées s’arrêtent à la mer de nuages, et le Code de l’Air réserve les altitudes. Ceux qui descendent quand même partent du Perchoir. Ceux qui remontent, on les compte.

- « Autre chose. » → accueil
- « Merci. » → **fin**

### asile

> La Gardienne soupire. — Holger Brandt. Le commis dit voleur, Brandt dit persécuté. La Charte me demande de choisir sans savoir. Si vous savez quelque chose, dites-le.

- _(si repère « page-vue »)_ « Lisez la page vous-même. » → defendu
- **🎲 Diplomatie 15** « Il est persécuté : il a sorti des noms volés. » → defendu, ✗ → doute
- « C’est un voleur. » → livre
- « Autre chose. » → accueil

### doute

> — Des mots. J’en entends toute la journée, et des deux côtés. Apportez-moi quelque chose que je puisse lire.

- _(si repère « page-vue »)_ « Lisez la page vous-même. » → defendu
- « Je reviendrai. » → **fin**

### defendu

_Effet : retient « holger-defendu », retient « asile-reglee », +40 XP, termine la quête « L’asile », retient « fin-asile-defendu »._

> La Gardienne lit, longtemps. — Droit d’asile. Le commis repartira par le prochain dirigeable, sans lui. Elle te rend la page. — Ferros s’en souviendra. Nous aussi.

- « Merci. » → **fin**

### livre

_Effet : retient « holger-livre », retient « asile-reglee », +50 Fers, +20 XP, termine la quête « L’asile », retient « fin-asile-livre »._

> — Bien. Elle fait signe au commis. Le soir, deux Gardiens du Ciel montent au Nid des Nuées et en redescendent avec un homme maigre qui serre une sacoche. Il ne se débat pas. Le commis te glisse cinquante Fers.

- « Partir. » → **fin**

## Le gardien des cryptes

_Le Niveau Douze_

Commence par : « briseur » _(si repère « briseur-echos »)_, sinon « accueil »

### accueil

> Un vieil homme en robe longue, une lampe de cristal à la main, assis devant la grille. — Les cryptes. Onze millions de prises. On n’y descend plus seul, depuis 2857 : il faut être deux, et que l’autre regarde ce que tu fais de tes mains.

- « Pourquoi 2857 ? » → pourquoi
- « Je n’ai personne. » → personne
- « Au revoir. » → **fin**

### pourquoi

> — Le Briseur d’Échos. Nher-Khal. Il descendait seul, la nuit, avec un maillet de son invention qui ne faisait presque pas de bruit. Quatre mille six cent onze cristaux, parce que les morts y sont peut-être conscients. On l’a pris. Section neuf, sans nom.

- « Il avait raison ? » → raison
- « Au revoir. » → **fin**

### raison

> Il te regarde longtemps. — Le cristal rend, et ne juge pas. Moi non plus.

- « Au revoir. » → **fin**

### personne

> — Alors tu attendras quelqu’un. Les Vigiles Blancs descendent, parfois. Et il y a toujours une famille qui cherche un second pour la Longue Nuit.

- « Au revoir. » → **fin**

### briseur

> Le gardien se lève quand tu approches, et met sa lampe entre vous deux. — Le Briseur d’Échos est revenu. Il a changé de visage. Ne descends plus, même à deux. Personne ne voudra être le second d’un Briseur.

- « S’éloigner. » → **fin**

## La Gardienne de l’Eau

_Celle qui verse_

Commence par : « accueil »

### accueil

> Une femme voilée de bleu, les mains mouillées jusqu’aux poignets, verse sans lever les yeux. — Ta ration. La même pour tout le monde, la même pour l’étranger.

- « La boire. » → boire _(+5 PV)_
- _(si quête « Ce qui n’a plus lieu » en cours)_ « L’eau de l’Année Errante. » → errance
- « Qui t’a donné ce pouvoir ? » → veto
- « Merci. » → **fin**

### boire

> L’eau est tiède et sent la jarre. Elle se tourne déjà vers la suivante.

- « Qui t’a donné ce pouvoir ? » → veto
- « Merci. » → **fin**

### veto

> — « Celle qui donne l’eau peut arrêter la Marche. » Samyr l’a dit, une phrase, il y a vingt-neuf siècles. Nous sommes cent dix-huit depuis. Aucune ne l’a dit. Elle verse encore.

- « Tu comptes, aussi ? » → compte
- « Merci. » → **fin**

### compte

> — Je verse, donc je sais combien ne viennent plus. Yel’Dara m’entend, elle ne verse pas. Depuis Neth’Sara, le compte a deux têtes. Pour qu’on ne puisse plus demander.

- « Qui t’a donné ce pouvoir ? » → veto
- « Merci. » → **fin**

### errance

_Effet : donne 1 × « L’eau de l’Année Errante »._

> Elle te tend une gourde de peau, pleine, sans poser de question. — On ne refuse pas l’eau. Si tu ne reviens pas, demain matin, tu seras dans mon compte, avec les autres. Alors reviens.

- « Je reviendrai. » → **fin**

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

Commence par : « quete » _(si quête « Le Dernier Train » en cours)_ _(sans repère « chantier-arrete »)_, sinon « garde »

### garde

> Le Golem de Ferraille ne bouge plus. Il garde la Faille, le cœur à demi éteint, et ses yeux te suivent. Derrière la palissade, Ingrid Brisefer a vu ta main sur ta lame : « Touchez-y, et je ne réponds plus de rien. »

- « Le frapper quand même. » → **fin** _(retient « golem-attaque-apres », avis de Liane −1, lance le combat « golem-gare »)_
- « Le laisser à sa garde. » → **fin**

### quete

> Le Golem de Ferraille garde la Faille : trois mètres de métal rapiécé, un cœur de cristal qui gronde dans sa poitrine. Dans les fougères, deux Rôdeurs-Épine attendent qu’il se batte. Le frapper, c’est un combat très dur pour qui débute.

- « L’attaquer quand même. » → **fin** _(lance le combat « golem-gare-quete »)_
- « Reculer, et chercher une autre façon d’arrêter le chantier. » → **fin**

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

## La grille des cryptes

_Le Niveau Douze_

Commence par : « ferme »

### ferme

> Une grille de fer noir, et derrière, des allées de cristal à perte de vue. Une plaque : « On ne descend plus seul aux cryptes. An 2857. » Le gardien lève sa lampe vers toi, puis vers qui t’accompagne.

- « Descendre avec quelqu’un. » → second
- _(la nuit)_ _(sans repère « grille-surprise »)_ **🎲 Discrétion 17** « Passer seul·e, cette nuit, quand le gardien dort. » → seul, ✗ → surpris
- _(si repère « rumeur-gardien-dort »)_ _(la nuit)_ _(sans repère « grille-surprise »)_ **🎲 Discrétion 13** « Passer à la deuxième heure, pendant qu’il dort assis. » → seul, ✗ → surpris
- « S’éloigner. » → **fin**

### deux

_Effet : retient « cryptes-ouvertes » pour 1 jours._

> Le gardien vous compte, deux fois, puis tourne la clé. — Deux. Que l’un regarde les mains de l’autre. La grille reste ouverte jusqu’au soir ; après, il faudra être deux de nouveau.

- « Descendre. » → **fin** _(mène à « Khrysos — les cryptes »)_

### seul

_Effet : retient « cryptes-ouvertes » pour 1 jours, retient « descendu-seul »._

> 🌙 Le gardien dort assis, la lampe sur les genoux. Le cadenas cède à la troisième tentative, sans un bruit. Personne ne regarde tes mains. C’est exactement ce que la règle voulait empêcher.

- « Descendre. » → **fin** _(mène à « Khrysos — les cryptes »)_

### surpris

_Effet : retient « grille-surprise » pour 1 jours, retient « surpris-cryptes »._

> 🌙 Le cadenas grince. La lampe du gardien se lève d’un coup. — Seul·e. De nuit. Tu sais ce que ça veut dire, à Khrysos ? Ça veut dire que demain, tout le Douze le saura. Remonte.

- « Remonter. » → **fin**

### second

> Le gardien attend, la lampe levée. — Qui regardera tes mains ?

- _(si Liane suit le héros)_ « Liane descendra avec moi. » → deux
- _(si Boulon suit le héros)_ « Boulon descendra avec moi. » → deux
- _(si repère « membre-vigiles-blancs »)_ « Un Vigile Blanc descendra avec moi. » → deux
- « Personne, finalement. » → **fin**

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

## Le guichetier de la ligne du Nord

_La gare d’Ironheart_

Commence par : « guichet » _(si quête « Ce qui n’a plus lieu » terminée)_, sinon « ferme »

### ferme

> Un guichet neuf, une affiche : « Ligne du Nord. Khrysos. » Le guichetier ne lève pas les yeux. — Le Dominion ne laisse plus monter que ceux qu’on attend là-haut. Une lettre, une invitation. Sinon, la loi de 2995 vous renvoie par le premier train.

- « Pourquoi ? » → loi
- « Au revoir. » → **fin**

### loi

> — Les réfugiés du climat. Ils montaient par wagons entiers, et Glacialis a fermé ses Portes. Nous, on vend les billets. Ce n’est pas nous qui refusons, c’est le froid qui décide, à ce qu’ils disent.

- « Au revoir. » → **fin**

### guichet

> Guichet de la ligne du Nord. Le guichetier souffle dans ses mains. « Khrysos : un jour de voyage, des voitures chauffées, et au bout, trois cents mètres de descente sous la glace. » — Un billet ?

- _(sans repère « premier-train-nord »)_ « Le billet que Hesper a payé. » → train _(retient « premier-train-nord »)_
- _(si repère « premier-train-nord »)_ _(sans repère « rail-travailleurs »)_ **[45 Fers]** « Prendre un billet. » → train _(−45 Fers)_
- _(si repère « premier-train-nord »)_ _(si repère « rail-travailleurs »)_ **[22 Fers]** « Prendre un billet : les cheminots te font un prix. » → train _(−22 Fers)_
- « Pas aujourd’hui. » → **fin**

### train

> Le train du Nord quitte Ironheart à l’aube. La forêt s’éclaircit, puis disparaît ; il ne reste que la neige, et le soir, une bouche de glace où le train s’enfonce. Il descend longtemps. Quand les portes s’ouvrent, l’air a le goût du métal froid.

- « Descendre sur le quai. » → **fin** _(fait passer 4 moments, mène à « Khrysos — les Portes de Glace »)_

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

## Gunnar

_Second du Cargo Noir, sur parole_

Commence par : « apres » _(si quête « Le Cargo Noir » terminée)_, sinon « journal » _(si quête « Le Cargo Noir » en cours)_ _(si l’on porte « Le journal de bord du Cargo Noir »)_, sinon « refus » _(si quête « Le Cargo Noir » en cours)_ _(si repère « gunnar-refus »)_, sinon « accueil »

### accueil

> Un homme de Ferros, en vareuse grise, regarde le Cargo Noir pourrir à l’ancre. — Gunnar, second. Sur parole, ils disent : ça veut dire sans bateau. Depuis trois ans, j’attends que Ferros paie, ou que Marisol pende quelqu’un.

- « Que s’est-il passé ? » → passe
- « Au revoir. » → **fin**

### passe

_Effet : lance la quête « Le Cargo Noir »._

> — On a vidé les cuves en mer. Ordre écrit. Le capitaine a obéi ; il est mort l’hiver dernier, de honte, ou de rhum. L’ordre, je l’ai gardé, dans le journal de bord. Personne ne me l’a jamais demandé.

- **🎲 Diplomatie 16** « Montrez-moi le journal. » → montre, ✗ → non
- « Au revoir. » → **fin**

### non

_Effet : retient « gunnar-refus »._

> — Pour que Marisol le brandisse devant l’Empire ? Non. Gunnar remonte son col.

- « Partir. » → **fin**

### refus

> Gunnar ne te regarde pas. — Toujours non.

- _(si repère « membre-confrerie-brisants »)_ « Matteo vous fait dire que la Confrérie paiera votre retour. » → montre
- « Partir. » → **fin**

### montre

_Effet : donne 1 × « Le journal de bord du Cargo Noir », retient « journal-cargo-lu », +15 XP._

> Il sort le journal de sa vareuse. À la date du déversement, une ligne, et une signature : « Ordre de la Compagnie de la Fonte Grise, Ironheart. » — Pas l’Empire. Une compagnie. Ça change tout, ou rien, selon qui le lit.

- « Le prendre. » → **fin**

### journal

> Gunnar regarde le journal dans ta main. — Alors ? Qui va le lire ?

- « Je vous le rends. Brûlez-le. » → brule _(reprend 1 × « Le journal de bord du Cargo Noir », +30 XP, termine la quête « Le Cargo Noir », retient « fin-cargo-noir-brule »)_
- « Pas encore. » → **fin**

### brule

> Gunnar le jette dans le brasero du quai et regarde les pages se tordre. — Ferros paiera, ou ne paiera pas. Au moins, ce ne sera pas grâce à moi.

- « Partir. » → **fin**

### apres

> Gunnar regarde toujours le Cargo Noir. — Un jour, ils me laisseront remonter à bord. Ce jour-là, je le coulerai moi-même.

- « Partir. » → **fin**

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

## Halvard Neigeclaire

_Des Vigiles Blancs_

Commence par : « perdue » _(si repère « sigrun-perdue »)_ _(si quête « L’égaré » en cours)_, sinon « perdue-2 » _(si repère « sigrun-perdue »)_, sinon « veilleur » _(si quête « L’égaré » en cours)_ _(si repère « sigrun-ramenee »)_, sinon « quai » _(à « Sous les cryptes — la voie sept »)_, sinon « accueil »

### accueil

> Un homme en manteau blanc, une corde enroulée à l’épaule, recoud un gant. — Halvard Neigeclaire. Vigiles Blancs. On ramène les égarés de la surface, vivants quand on peut. Tu t’es perdu·e, ou tu cherches quelqu’un ?

- « Ni l’un ni l’autre. » → vigiles
- « Que croient les Vigiles ? » → croient
- _(si quête « Ce que la glace a pris » en cours)_ _(si repère « glace-lacune »)_ _(sans repère « halvard-refus »)_ _(sans repère « caisse-glacialis-reglee »)_ **🎲 Diplomatie 17** « Descends aux cryptes avec moi. » → second, ✗ → refus
- « Au revoir. » → **fin**

### vigiles

> — Ça viendra. Tout le monde finit par perdre quelqu’un dans le blizzard, ou par s’y perdre. Ce jour-là, viens me voir. Le Collège, lui, notera seulement la date.

- « Que croient les Vigiles ? » → croient
- _(sans repère « raconte-halvard »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : thryn-vek → raconte-special ; morts, familles → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### croient

> — Que la clarté n’est pas une vertu. C’est un outil, et on peut s’en servir pour ne rien faire. Les héros des légendes y voyaient clair ; il leur manquait une passion. Nous, on compte nos années en vies sauvées.

- _(si quête « L’égaré » pas commencée)_ _(sans repère « membre-college-miroirs »)_ _(sans repère « sigrun-perdue »)_ « Je veux entrer chez les Vigiles Blancs. » → adhesion
- « Au revoir. » → **fin**

### second

_Effet : retient « cryptes-ouvertes » pour 1 jours, retient « descendu-halvard »._

> Halvard pose son gant à moitié recousu. — Les cryptes. On y descend pour les morts, d’habitude. Mais on n’y descend pas seul, et tu as l’air d’y aller quand même. Allons-y. Je regarderai tes mains.

- « Descendre. » → **fin** _(mène à « Khrysos — les cryptes »)_

### refus

_Effet : retient « halvard-refus »._

> — Non. Les Vigiles ramènent les vivants de la surface. Les morts ont le Collège, et le Collège a ses cahiers. Trouve-toi un autre second.

- « Au revoir. » → **fin**

### quai

> Halvard reste au bord du quai, la lampe levée. — Je regarde tes mains. Ce que tu en fais, c’est ton affaire ; ce que je verrai, c’est la mienne.

- « Je sais. » → **fin**

### adhesion

_Effet : lance la quête « L’égaré », lance la quête « L’Épreuve du Blizzard », retient « blizzard-commencee »._

> — Les Vigiles prennent qui a ramené quelqu’un. Il y a une fille dehors, justement, depuis trop longtemps : Sigrun, la sœur de la petite Torka. Ramène-la vivante, et tu seras des nôtres.

- « J’y vais. » → **fin**

### veilleur

_Effet : termine la quête « L’égaré », retient « membre-vigiles-blancs », +40 XP._

> Halvard pose son gant. — Sigrun. Vivante. Il te tend un brassard blanc. — Veilleur·se des Vigiles Blancs. On ne compte pas ce qu’on laisse : on compte ce qu’on ramène. Un. C’est un bon début.

- « Le prendre. » → **fin**

### perdue

_Effet : termine la quête « L’égaré »._

> Halvard ne lève pas la tête de son gant. — Les Vigiles l’ont ramenée, debout dans la neige. Ils ont trouvé tes traces à côté des siennes. Ne reviens pas ici.

- « Partir. » → **fin**

### perdue-2

> Halvard ne lève pas la tête de son gant. — La fille de l’Épreuve. Les Vigiles l’ont ramenée, debout dans la neige, et tes traces à côté des siennes. Les Vigiles ne parlent pas à ceux qui laissent.

- « Partir. » → **fin**

### raconte-special

_Effet : retient « raconte-halvard », +15 XP._

> Halvard pose son gant. — Une Gardienne qui comptait les morts, chaque matin, à voix haute. Nous, on compte les vivants. Il faudrait peut-être quelqu’un pour faire les deux.

- « Merci, Halvard. » → **fin**

### raconte-touche

_Effet : retient « raconte-halvard », +10 XP._

> — Tu racontes ça avec une passion. C’est rare, au nord. Ne la perds pas en route : il fait froid, et elle part la première.

- « Merci, Halvard. » → **fin**

### raconte-neutre

_Effet : retient « raconte-halvard », +5 XP._

> — Merci. Les Vigiles écoutent tout, dehors : ça aide à rester éveillé.

- « Merci, Halvard. » → **fin**

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

- _(sans repère « raconte-hesper »)_ « Je voudrais vous confier une histoire. » → raconte-neutre 📖 raconter un Récit : odon-passe-rive → raconte-odon ; ancien-monde, mysteres, familles → raconte-touche ; autres → raconte-neutre
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

_Effet : termine la quête « Les Mémoires du Monde Perdu », retient « fin-memoires-monde-perdu-vendue », +60 XP, retient « piste-zephyria », avis de Liane −1._

> Hesper écoute, et sa lanterne baisse. — Tu as vendu une ligne. Ici, c’est un métier honnête. Chez les Gardiens, on transmet ; on ne vend pas. Altavent, sous les Hauts de Zephyria. Ils y seront avant toi. Alors cours.

- « Je pars pour Zephyria. » → **fin**

### fin-denonce

_Effet : termine la quête « Les Mémoires du Monde Perdu », retient « fin-memoires-monde-perdu-denoncee », +80 XP, retient « piste-zephyria »._

> — Raccompagnée. Personne ne l’a touchée, et elle est au cent unième kilomètre. C’est la seule justice qu’on ait ici : elle est propre, et elle est terrible. Altavent, sous les Hauts de Zephyria. La piste est à toi.

- « Je pars pour Zephyria. » → **fin**

### apres

> — Les Gardiens te gardent une chambre, ici, quand tu veux. Et le tableau a toujours besoin de bras.

- _(sans repère « raconte-hesper »)_ « Je voudrais vous confier une histoire. » → raconte-neutre 📖 raconter un Récit : odon-passe-rive → raconte-odon ; ancien-monde, mysteres, familles → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### fin-silence

_Effet : termine la quête « Les Mémoires du Monde Perdu », retient « fin-memoires-monde-perdu-silence », +80 XP, retient « piste-zephyria »._

> — Tu t’es tue, et elle te suivra : les routes sont longues. Altavent, sous les Hauts de Zephyria. La Porte de Zephyria ne s’ouvre qu’avec un sauf-conduit de la Confédération : il faudra le trouver.

- « Je pars pour Zephyria. » → **fin**

### appel-rude

> Hesper rit, sans se vexer. — Les vieilles parlent par énigmes parce que les jeunes n’écoutent que ça. Je recommence, plus simple : au Registre, quelqu’un ment. Trouve qui.

- « Et la clé de rouille bleue ? » → cle

### raconte-neutre

_Effet : retient « raconte-hesper », +5 XP._

> Hesper écoute, les mains jointes sur sa lanterne. — Bien dite. Une histoire bien dite, c’est déjà une histoire gardée.

- « Merci, Hesper. » → **fin**

### raconte-touche

_Effet : retient « raconte-hesper », +10 XP._

> Hesper ferme les yeux pour mieux l’entendre. — Celle-là, je la ferai recopier pour la maison mère. Avec ton nom en haut, comme Ilyane te l’a appris.

- « Merci, Hesper. » → **fin**

### raconte-odon

_Effet : retient « raconte-hesper », +15 XP._

> Hesper écrit le nom d’Odon dans un registre de cuir. — Les Gardiens gardent aussi ceux qui faisaient passer. Il n’avait pas de papiers à donner : il avait des noms. C’est la même chose.

- « Merci, Hesper. » → **fin**

## Hiran’Amra

_Matriarche de Cristaux_

Commence par : « adhesion » _(si quête « Le verre de la Mer » en cours)_ _(si repère « lot-trie »)_, sinon « eskil » _(si quête « Le Forage Noir » en cours)_ _(sans repère « hiran-eskil »)_, sinon « accueil »

### accueil

> Une femme aux cristaux-bijoux, au front et au cou, qui pèse des éclats d’ambre sur une balance de verre. — Le cristal fait vivre la Marche, l’étranger. Sept chariots sur dix qui roulent, c’est lui qui les paie. Tu achètes, tu vends, tu regardes ?

- « La Mer de Verre ? » → mer
- « Et Ferros ? » → ferros
- _(si quête « Le verre de la Mer » pas commencée)_ _(sans repère « membre-guides-eau »)_ « Je veux entrer chez les Matriarches. » → tailleur
- « Je regarde. » → **fin**

### mer

> — Je voudrais que la route y passe plus souvent. Les guides disent que l’eau décide. L’eau n’a jamais payé une lentille de serre.

- « Et Ferros ? » → ferros
- « Je regarde. » → **fin**

### ferros

> — Ferros paierait le double, par Terminus. Ferros a aussi planté une foreuse dans un cimetière. Je n’oublie ni l’un ni l’autre, et je ne les mélange pas.

- « La Mer de Verre ? » → mer
- « Je regarde. » → **fin**

### eskil

_Effet : retient « hiran-eskil »._

> — L’homme de Ferros ? Ferros réclame des réparations pour sa foreuse. Un survivant, rendu par nous avec courtoisie, c’est un geste. Les taxes de Terminus baissent, la Marche mange mieux. Tout le monde y gagne.

- « Lui, il y perd. » → perd
- **🎲 Diplomatie 16** « Laissez-le rester dans la Marche. » → cede, ✗ → non

### perd

> — Il a foré un cimetière. Il a déjà beaucoup perdu, c’est vrai. Il nous a fait perdre davantage.

- **🎲 Diplomatie 16** « Laissez-le rester dans la Marche. » → cede, ✗ → non
- « Je verrai avec lui. » → **fin**

### cede

_Effet : retient « hiran-cede »._

> Elle repose sa balance. — Soit. La Marche le gardera, s’il le veut. Mais si Ferros le réclame un jour, ce n’est plus à moi qu’on le demandera.

- « Merci, Matriarche. » → **fin**

### non

> — Non. Je ne vends pas un homme. Je fais un geste. La différence te paraît mince ; ici, elle compte.

- « Je verrai avec lui. » → **fin**

### tailleur

_Effet : lance la quête « Le verre de la Mer », retient « verre-mer-commence »._

> — Les Matriarches ? Un lot de la Mer de Verre attend d’être trié avant la caravane : là, contre le mur. Un tailleur sait reconnaître un éclat d’un autre. Montre-moi que tu sais.

- « Je m’y mets. » → **fin**

### adhesion

_Effet : termine la quête « Le verre de la Mer », retient « membre-matriarches-cristaux », +40 XP._

> Hiran’Amra regarde ton tri, éclat par éclat. — Tailleur·se des Matriarches de Cristaux. Le verre fait vivre la Marche ; maintenant, il te fait vivre aussi.

- « Merci, Matriarche. » → **fin**

## Holger Brandt

_Archiviste de Ferros en fuite_

Commence par : « defendu » _(si quête « L’asile » terminée)_, sinon « accueil »

### accueil

> Un homme maigre, en manteau d’encre râpé, serre une sacoche contre lui. — Vous venez de Ferros ? Non ? Tant mieux. Holger Brandt. J’étais archiviste, Niveau Trois. Un commis de Ferros attend au Quai que la Gardienne me rende.

- « Pourquoi vous rendre ? » → pourquoi
- « Au revoir. » → **fin**

### pourquoi

_Effet : lance la quête « L’asile »._

> — J’ai pris une page. Une seule. Le registre des Innovations du Puits Trois : les plans qu’ont inventés des Ouvriers, et les Techniciens qui les ont signés à leur place. Vingt ans de noms échangés. Ferros appelle ça un vol.

- « Montrez-la-moi. » → page
- « La Charte vous protège. » → charte
- « Au revoir. » → **fin**

### page

> Il hésite, puis ouvre la sacoche. Une page de registre, au sceau de Ferros. Deux colonnes : « inventé par », « signé par ». À gauche, des noms d’Ouvriers. À droite, d’autres noms. Tout en bas, une Innovation : « masque de feutre et de charbon ».

- « Je parlerai à la Gardienne. » → **fin** _(retient « page-vue »)_

### charte

> — La Charte protège les persécutés. Le commis dit que je suis un voleur. La Gardienne doit trancher, et elle écoute ceux qui parlent fort. Je n’ai jamais su parler fort. J’étais archiviste.

- « Montrez-moi la page. » → page
- « Au revoir. » → **fin**

### defendu

> Holger range ses papiers sur la table du Nid, comme s’il ouvrait un bureau. — Ysolde m’a proposé une place au Registre. Compter les passages. Je crois que je vais aimer ça : ici, personne ne signe à la place de personne.

- « Au revoir, Holger. » → **fin**

## Hrolda Rochebrume

_Du Collège des 9 Miroirs, gardienne de la Bibliothèque_

Commence par : « signer » _(si quête « Une lacune à signer » en cours)_ _(si repère « garde-avoue »)_, sinon « choix » _(si quête « Le cristal qui hésite » en cours)_ _(si repère « hesite-confirme »)_ _(si repère « caveau-vu »)_, sinon « erreur » _(si quête « Le cristal qui hésite » en cours)_ _(si repère « cent-jours-erreur »)_ _(sans repère « hesite-confirme »)_, sinon « hesite » _(si repère « formule-dite »)_ _(si quête « Le cristal qui hésite » pas commencée)_, sinon « retour » _(si repère « formule-dite »)_, sinon « accueil »

### accueil

> Une femme grise, droite, neuf éclats de miroir cousus au col. Elle ne te salue pas : elle termine sa ligne, puis lève les yeux. — Le cristal rend. Vous répondez : « et ne juge pas ». Ensuite, nous pourrons parler.

- « Et ne juge pas. » → parle
- « Pourquoi cette formule ? » → formule
- « Je reviendrai. » → **fin**

### formule

> — Parce qu’un cristal restitue mot pour mot ce qu’on lui a confié, sans rien ajouter, sans rien ôter. Ce que vous en pensez vous appartient ; ce qu’il rend appartient à tout le monde.

- « Et ne juge pas. » → parle
- « Je reviendrai. » → **fin**

### parle

_Effet : retient « formule-dite »._

> — Bien. Ici dort ce que Glacialis se rappelle, découpé en faces. Quand une face manque, ce n’est jamais un oubli : quelqu’un a brisé quelque chose. Le Collège des 9 Miroirs consigne la lacune, sa date, et son auteur quand il le peut.

- « Qui brise une face ? » → brise
- « Et Khrys ? » → khrys
- _(si quête « Ce qui n’a plus lieu » terminée)_ _(sans repère « glace-lacune »)_ « Je cherche une lacune : « Ce qui dort sur le quai du niveau douze ». » → registre _(lance la quête « Ce que la glace a pris », retient « glace-pris-commencee »)_
- « Merci. » → **fin**

### brise

> — Des lâches, des amants, des héritiers. Parfois quelqu’un qui savait ce qu’on ferait de la vérité. Nous ne jugeons pas, nous signons. Une lacune signée vaut mieux qu’un récit reconstitué.

- « Et Khrys ? » → khrys
- _(si quête « Une lacune à signer » pas commencée)_ _(sans repère « membre-vigiles-blancs »)_ « Je veux entrer au Collège des 9 Miroirs. » → adhesion
- « Merci. » → **fin**

### khrys

> — L’Entité. Un cristal plus ancien que la ville, assez ancien pour rendre sans erreur. Il ne converse pas. Posez-lui une question : il vous rendra ce qu’on lui a confié, ou rien.

- « Qui brise une face ? » → brise
- « Merci. » → **fin**

### retour

> Hrolda lève les yeux de sa ligne. — Le cristal rend. — Et ne juge pas, réponds-tu. Elle hoche la tête, une fois.

- « Qui brise une face ? » → brise
- « Et Khrys ? » → khrys
- _(si quête « Ce qui n’a plus lieu » terminée)_ _(sans repère « glace-lacune »)_ « Je cherche une lacune : « Ce qui dort sur le quai du niveau douze ». » → registre _(lance la quête « Ce que la glace a pris », retient « glace-pris-commencee »)_
- « Merci. » → **fin**

### registre

> Hrolda se lève et va jusqu’à Khrys. — Rends le registre des prises du niveau douze. La lueur monte. La voix sans souffle égrène des noms, des sections, des années. Puis elle s’arrête au milieu d’une phrase, et reprend plus loin, sans s’excuser.

- « Qu’est-ce qui manque ? » → lacune

### lacune

_Effet : retient « glace-lacune », +20 XP._

> Hrolda ouvre un cahier de cuir gris à une page cornée. « Face manquante : Ce qui dort sur le quai du niveau douze. Brisée l’an 2970. Auteur : une étrangère, qui a dit son nom. » Le nom est là, de la main du Collège. Il ne te dit rien.

- « Elle a dit son nom ? » → nom
- « Qu’est-ce qui dort sur ce quai ? » → quai

### nom

> — Ceux qui brisent une face se cachent, d’habitude. Elle, non. Elle est venue au Collège le lendemain et elle a dit : j’ai brisé la face, voici mon nom, signez. Personne n’avait jamais demandé qu’on le signe.

- « Qu’est-ce qui dort sur ce quai ? » → quai

### quai

> — La face le disait, et la face n’est plus. Il reste le niveau douze, et un quai. Il n’y a pas de quai au niveau douze : il y a des cryptes, et au bout des cryptes, la glace. Vous descendrez ? On n’y descend pas seul.

- « Merci, Hrolda. » → **fin**

### hesite

_Effet : lance la quête « Le cristal qui hésite », retient « hesite-commencee »._

> Hrolda ne termine pas sa ligne, cette fois. — Le cristal rend. — Et ne juge pas. — Un cristal a hésité. Cent Jours, le seul récit complet du pays : il s’est arrêté au milieu d’une face, puis il a repris. Un cristal ne s’arrête pas. Écoutez-le, Gardien.

- « J’écouterai. » → **fin**
- _(si quête « Ce qui n’a plus lieu » terminée)_ _(sans repère « glace-lacune »)_ « Je cherche une lacune : « Ce qui dort sur le quai du niveau douze ». » → registre _(lance la quête « Ce que la glace a pris », retient « glace-pris-commencee »)_
- « Qui brise une face ? » → brise

### erreur

_Effet : retient « hesite-confirme », +20 XP._

> — Deux mots différents ? Hrolda va jusqu’à Khrys. « Rends Cent Jours, face cinquième. » Khrys rend : fermez, sans s’arrêter. — Le Collège va chercher l’auteur de cette lacune. Il n’y en a pas. Il n’y a personne à signer.

- « Ça s’est déjà produit ? » → deja

### deja

> Elle hésite, elle aussi. — Le Collège scelle les cristaux fêlés au Caveau, au Niveau Douze. On m’a demandé, cet automne, d’y faire descendre trois cristaux de la Bibliothèque. Je n’ai pas demandé pourquoi. Le gardien des cryptes a la clé ; il ne l’ouvre à personne.

- « J’irai voir. » → **fin**

### choix

> Hrolda t’écoute jusqu’au bout, puis referme son cahier. — Si on le dit, plus personne à Glacialis ne croira ce que rend un cristal. Si on se tait, je signe des faces que je sais fausses. Que feriez-vous, Gardien ?

- « Signer la lacune : sans auteur. Que tout le monde le sache. » → signee _(termine la quête « Le cristal qui hésite », retient « fin-cristal-hesite-signee », +60 XP)_
- « Sceller celui-ci avec les autres. Personne n’a besoin de savoir. » → scelle _(termine la quête « Le cristal qui hésite », retient « fin-cristal-hesite-scelle », +60 XP)_
- « Le briser, avant qu’il ne rende une face fausse à un enfant. » → brise-hrolda _(termine la quête « Le cristal qui hésite », retient « fin-cristal-hesite-brise », +60 XP)_
- « Je ne sais pas encore. » → **fin**

### signee

> Hrolda trempe sa plume. « Lacune : Cent Jours, face cinquième, un mot. Auteur : personne. La maladie des souvenirs. » Elle souffle sur l’encre. — Demain, tout Khrysos le saura, et ne saura pas quoi en faire. Ce n’est pas notre affaire. Notre affaire, c’est de signer.

- « Merci, Hrolda. » → **fin**

### scelle

> Le soir même, Hrolda descend le cristal au Caveau et colle l’étiquette : « A hésité. Scellé. Ne pas rendre. » Elle remonte sans te regarder. Un cristal plus jeune rendra Cent Jours, à la Bibliothèque, jusqu’à ce qu’il hésite à son tour.

- « Au revoir. » → **fin**

### brise-hrolda

> Hrolda frappe une fois, du plat de la main, là où passe le fil. Le cristal se fend. Elle signe la lacune de son nom, de la date, et du motif : « Pour qu’on ne s’en serve pas. » — J’ai brisé un écho. Celui-là, au moins, je sais pourquoi.

- « Au revoir. » → **fin**

### adhesion

_Effet : lance la quête « Une lacune à signer »._

> — Le Collège prend qui sait trouver un auteur. Une lacune récente : le registre des Portes, une face, il y a trois nuits. Sans auteur. Trouvez qui, et signez. Au Collège, c’est celui qui trouve qui signe.

- « J’y vais. » → **fin**

### signer

> — Vous avez un nom ? Hrolda trempe la plume et te la tend. Le cahier est ouvert à la page du registre des Portes. Il reste une ligne.

- « Signer : la garde des Portes, de sa main, pour ne plus s’entendre. » → lecteur _(termine la quête « Une lacune à signer », retient « membre-college-miroirs », +40 XP)_
- « Je ne signerai pas son nom. » → pas-signer

### lecteur

> Hrolda signe sous ta ligne, puis détache un éclat de miroir de son col et te le donne. — Lecteur·rice du Collège des 9 Miroirs. Vous ne jugerez pas. Vous signerez. Le reste n’est pas notre affaire.

- « Merci, Hrolda. » → **fin**

### pas-signer

> — Alors vous n’êtes pas des nôtres. Le Collège ne protège personne, pas même par pitié. Revenez quand vous saurez signer ce qui vous déplaît.

- « Au revoir. » → **fin**

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

Commence par : « echo-lettre » _(si repère « echos-confies »)_ _(sans repère « ilyane-echo-lu »)_, sinon « carnet » _(si quête « Le carnet de chansons » en cours)_ _(si l’on porte « Carnet de chansons d’Ilyane »)_, sinon « appel-veilleuse » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-veilleuse »)_, sinon « appel-archives » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-archives »)_, sinon « appel-vendue » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_ _(si repère « cle-vendue »)_, sinon « appel-sept-portes » _(si quête « La Clé de Rouille Bleue » terminée)_ _(si quête « Les Mémoires du Monde Perdu » pas commencée)_, sinon « papiers-prospection » _(si quête « Les noms qui montent » terminée)_ _(si quête « Ce que cherchait la foreuse » pas commencée)_, sinon « oubli-3 » _(si repère « porte-sud-connue »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « oubli-2 » _(si quête « L’audience » terminée)_ _(sans repère « ilyane-oubli-2 »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « remarque-enfant » _(si repère « heros-enfant »)_ _(sans repère « ilyane-remarque-enfant »)_, sinon « remarque-vapeur » _(si repère « heros-fragment-vapeur »)_ _(sans repère « ilyane-remarque-vapeur »)_, sinon « remarque-main » _(si repère « heros-fragment-main »)_ _(sans repère « ilyane-remarque-main »)_, sinon « remarque-voix » _(si repère « heros-fragment-voix »)_ _(sans repère « ilyane-remarque-voix »)_, sinon « nouvelles-canopee » _(si quête « L’audience » terminée)_, sinon « pell-vivant » _(si repère « foreuse-explosee »)_ _(si repère « pell-sauve »)_ _(sans repère « ilyane-sait-pell »)_, sinon « pell » _(si repère « foreuse-explosee »)_ _(sans repère « ilyane-sait-pell »)_, sinon « oubli-1 » _(si quête « L’audience » en cours)_ _(sans repère « ilyane-oubli-1 »)_ _(sans repère « ilyane-oubli-2 »)_ _(sans repère « ilyane-oubli-3 »)_, sinon « resolu » _(si quête « Le Dernier Train » terminée)_, sinon « en-cours » _(si quête « Le Dernier Train » en cours)_, sinon « accueil »

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

### papiers-prospection

> Ilyane te tend une liasse de papiers tachés. — Je les ai trouvés dans mon coffre. Ceux de la prospection, qu’Ingrid avait laissés. Il y a une ligne que je n’avais pas comprise. Je ne sais plus pourquoi je les ai gardés.

- « Lire la ligne. » → papiers-ligne

### papiers-ligne

> « Objectif : une caisse plombée, sous la Faille, quai sept. Commanditaire : E. V. » Ilyane te regarde. — E. V. Tu sais qui c’est, toi ? Moi, je crois que je l’ai su.

- « Oui. Je vais à la Gare. » → **fin** _(lance la quête « Ce que cherchait la foreuse »)_
- « Plus tard, Ilyane. » → **fin**

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

_Effet : retient « chantier-arrete », retient « ingrid-rapport », termine la quête « Le Dernier Train », retient « fin-dernier-train-rapport », +80 XP, +30 Fers._

> Ingrid se tait longtemps, puis plie ses papiers en quatre. — J’écrirai à Ferros que la Faille est instable. C’est peut-être même vrai. J’arrête la foreuse. Dites à vos Gardiens que Ferros reviendra, avec ou sans moi.

- « Merci. » → **fin**

### convaincue-recit

_Effet : retient « chantier-arrete », termine la quête « Le Dernier Train », retient « fin-dernier-train-corvan », +90 XP, +30 Fers._

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

_Effet : retient « chantier-arrete », retient « ingrid-rancune », avis de Liane −1, termine la quête « Le Dernier Train », retient « fin-dernier-train-menace », +60 XP, +50 Fers._

> Ingrid te dévisage, et ses lèvres blanchissent. — Très bien. J’arrête. Elle te lance une bourse. — Pour votre garde. Qu’elle regarde ailleurs, le jour où Ferros reviendra.

- « … » → **fin**

### convaincue-quai

_Effet : retient « chantier-arrete », termine la quête « Le Dernier Train », retient « fin-dernier-train-quai », +90 XP, +30 Fers._

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

## Iris Coquelune

_La mère d’Aïo_

Commence par : « oubli » _(si repère « aio-oublie »)_, sinon « accueil »

### accueil

> Une femme pâle, dans le lit, tousse doucement. — Aïo ? Il est sorti ? Il sort toujours. Il croit que je ne sais pas.

- « Reposez-vous. » → **fin**

### oubli

> Iris caresse les cheveux de son fils, qui dort. — Il m’appelle « madame ». Il est poli, c’est déjà ça. Il a eu sa perle, j’ai mon remède. Je n’ai plus de nom.

- « Partir. » → **fin**

## Ish’Lenne

_Conteuse de la Tente des Mille Pas_

Commence par : « merci » _(si repère « episode-dit »)_ _(sans repère « ish-merci »)_, sinon « caisse » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « ish-mots »)_, sinon « caisse-debut » _(si quête « Ce que la mer rend » terminée)_ _(si quête « Ce qui n’a plus lieu » pas commencée)_, sinon « thryn-demain » _(le soir)_ _(si repère « thryn-soir »)_, sinon « thryn-1a » _(le soir)_ _(sans repère « thryn-1 »)_, sinon « thryn-2a » _(le soir)_ _(si repère « thryn-1 »)_ _(sans repère « thryn-2 »)_, sinon « thryn-3-rendu » _(le soir)_ _(si repère « thryn-2 »)_ _(sans repère « thryn-3 »)_ _(si repère « muette-keo »)_ _(si repère « muette-saal »)_ _(si repère « muette-yel »)_, sinon « thryn-3a » _(le soir)_ _(si repère « thryn-2 »)_ _(sans repère « thryn-3 »)_ _(sans repère « muette-commencee »)_, sinon « thryn-3-attend » _(le soir)_ _(si repère « muette-commencee »)_ _(sans repère « thryn-3 »)_, sinon « accueil »

### accueil

> Une conteuse aux cheveux blancs, des rubans de route aux poignets, assise devant un brasero. — Le soir, à la halte, je dis l’épisode qui lui appartient. Ailleurs, je me tais : un épisode dit ailleurs que chez lui, c’est du bavardage.

- « Et les haltes mortes ? » → mortes
- « Pourquoi ne rien écrire ? » → ecrire
- _(sans repère « raconte-ish-lenne »)_ « Je voudrais vous dire une histoire de chez moi. » → raconte-neutre 📖 raconter un Récit : la-septieme-voile → raconte-special ; familles, morts → raconte-touche ; autres → raconte-neutre
- « Je reviendrai à la halte. » → **fin**

### mortes

> — Je garde leurs mots. Je ne les dis pas. Ce qui se perd, à Solarix, ne se perd pas de la mémoire, l’étranger : ça se perd de la route.

- « Pourquoi ne rien écrire ? » → ecrire
- « Je reviendrai à la halte. » → **fin**

### ecrire

> — On n’emporte pas de bibliothèque à cinq kilomètres à l’heure, et on ne bâtit pas d’archives quand on ne bâtit rien. Nos légendes ont lieu. Tu les entendras là où elles se sont passées, ou tu ne les entendras pas.

- « Et les haltes mortes ? » → mortes
- « Je reviendrai à la halte. » → **fin**

### caisse-debut

_Effet : lance la quête « Ce qui n’a plus lieu », retient « plus-lieu-commencee »._

> — Tu viens pour « La caisse que personne n’est venu chercher ». Je connais ses mots. Je ne les dirai qu’à sa halte, et sa halte est morte : la route est passée ailleurs il y a des siècles. Moi, je ne quitte pas la Marche. Toi, tu n’es pas d’ici.

- **🎲 Diplomatie 16** « Donne-moi les mots : je les dirai là-bas. » → mots, ✗ → pas-encore
- _(si repère « halte-trouvee »)_ « Je sais où est sa halte. » → mots
- « Où est-elle, cette halte ? » → ou
- « Plus tard. » → **fin**

### caisse

> — « La caisse que personne n’est venu chercher. » Ses mots ne se disent qu’au pied de son jalon. Je ne quitte pas la Marche. Toi, tu peux.

- **🎲 Diplomatie 16** « Donne-moi les mots : je les dirai là-bas. » → mots, ✗ → pas-encore
- _(si repère « halte-trouvee »)_ « Je sais où est sa halte. » → mots
- « Où est-elle, cette halte ? » → ou
- « Plus tard. » → **fin**

### ou

> — Je ne sais pas. Les guides savent où passe la piste ; Longue-Ombre le sait aussi, dit-on. La dame en gris m’a posé la même question. Je ne lui ai pas donné les mots : c’est la caisse qu’elle voulait, et l’épisode l’ennuyait.

- « Je comprends. » → caisse

### mots

_Effet : retient « ish-mots »._

> Elle te dit l’épisode une fois, à voix basse, puis te le fait répéter, mot pour mot, jusqu’à ce que tu l’aies. — Ne le dis nulle part ailleurs qu’au pied de son jalon. Ailleurs, ce ne serait que du bruit.

- « Je le dirai là-bas. » → **fin**

### pas-encore

> — Tu le dirais au premier feu de camp venu, pour faire rire. Reviens quand tu sauras où il faut le dire.

- « Je reviendrai. » → **fin**

### merci

_Effet : retient « ish-merci »._

> Ish’Lenne te regarde entrer, et pose sa main à plat sur ton bras. — Tu l’as dit là-bas. Je l’ai senti, je crois. Ou j’ai voulu le sentir. Ça revient au même, à mon âge.

- « Il a de nouveau lieu. » → accueil

### thryn-demain

> — Une halte par soir, l’étranger. Demain, la Marche sera plus loin, et l’épisode aussi. Reviens demain soir.

- « À demain soir. » → **fin**

### thryn-1a

_Effet : retient « thryn-1 », retient « thryn-soir » pour 1 jours._

> — Tu tombes bien : cette saison, la Marche-Mère passe sur Thryn’vek, neuf haltes, et aucune n’est morte. Ce soir, la première. — Elle ferme les yeux. — Thryn’vek était le meilleur puits du cercle. Au sixième mois de 2148, il rendait onze litres l’heure.

- « Et ensuite ? » → thryn-1b

### thryn-1b

> — Il n’y avait pas eu de signe. Huit cent mille personnes, douze Léviathans, et onze litres l’heure. Les guides sont partis le soir même, sur des scorpions de course, dans quatre directions. Ils sont revenus en neuf jours.

- « Et ensuite ? » → thryn-1c

### thryn-1c

> — En arrière, c’était la mort en quatre mois. Tout droit, huit sur dix. Par le sud, quarante et un jours, sur ce que quelqu’un avait entendu dire. Et une Gardienne qui pouvait tout arrêter d’un mot. — Elle rouvre les yeux. — Demain soir, la suite.

- « Demain soir. » → **fin**

### thryn-2a

_Effet : retient « thryn-2 », retient « thryn-soir » pour 1 jours._

> — Ce soir, la quatrième halte. Neth’Sara avait quarante-sept ans. Elle n’était ni sage, ni aimée, ni liée à un dragon. Elle versait bien, elle comptait juste. Et chaque matin, elle savait combien ne venaient plus.

- « Et ensuite ? » → thryn-2b

### thryn-2b

> — La Marche est partie par le sud. Personne n’a décidé : une Marche qui a fini d’attendre part. Neth’Sara était en tête de la distribution, avec son mot. Elle ne l’a pas dit. Elle a eu raison, et elle a passé trente et un ans là-dessus.

- « Et ensuite ? » → thryn-2c

### thryn-2c

> — Au troisième matin, elle a dit le nombre à voix haute. Les morts de la nuit. Personne n’avait le droit de la faire taire. Il a traversé la Marche en une heure et demie. Puis tous les matins. — Demain soir, la Sèche.

- « Demain soir. » → **fin**

### thryn-3a

_Effet : lance la quête « La halte muette », retient « muette-commencee »._

> — Ce soir, la septième halte : la Sèche. On met un pas entre chaque nombre. Le troisième jour, quatre. Le neuvième, quarante et — Ish’Lenne s’arrête. Ses lèvres bougent. Rien ne vient. Autour du feu, plus personne ne respire.

- « Ish’Lenne ? » → thryn-muette

### thryn-muette

> — Je les ai dits quarante ans. Ils ne viennent plus. — Elle regarde ses mains. — Une halte ne meurt que par l’eau, d’habitude. Les nombres, on les apprend aux enfants à sept ans. Ils sont encore quelque part, dans d’autres bouches.

- « Je vais les chercher. » → **fin**

### thryn-3-attend

> Ish’Lenne est assise devant le feu éteint, les mains ouvertes. — Les nombres. Tant qu’ils ne sont pas revenus, la septième halte se tait. Elle n’a jamais attendu personne, avant toi.

- « Je les cherche encore. » → **fin**

### thryn-3-rendu

_Effet : retient « thryn-3 », retient « thryn-soir » pour 1 jours, termine la quête « La halte muette », +50 XP._

> Tu lui dis ce que la chaîne t’a rendu, un nombre après l’autre, avec un pas entre chacun, et deux pas sans rien aux deux jours vides. Elle répète avec toi. Au troisième nombre, sa voix reprend la tienne, et ne la lâche plus.

- « Et ensuite ? » → thryn-3b

### thryn-3b

> — Le soir du vingt-neuvième, Orr’Dahn est venu lui demander de se taire deux matins, pour voir si la Marche marcherait mieux. Elle s’est tue. Deux nombres ne sont pas passés dans une autre tête. Ils n’existent plus.

- « Et ensuite ? » → thryn-3c

### thryn-3c

_Effet : retient le Récit « Thryn’vek »._

> — Au point vingt-quatre, elle a obtenu que le compte ait deux têtes : une qui verse, une qui entend. Son motif tient en six mots. « Pour qu’on ne puisse plus demander. » — Ish’Lenne te regarde. — Tu l’as entendu à sa place. Il est à toi, maintenant.

- « Merci, Ish’Lenne. » → **fin**

### raconte-special

_Effet : retient « raconte-ish-lenne », +15 XP._

> Ish’Lenne t’écoute les yeux fermés. — Une femme qui recopie la septième voile, chaque jour, sans rien imposer. Elle sourit. — Neth’Sara lui aurait plu. Les deux ont dit ce qu’il fallait, et laissé les autres décider.

- « Merci, Ish’Lenne. » → **fin**

### raconte-touche

_Effet : retient « raconte-ish-lenne », +10 XP._

> — Une histoire sans halte. Elle tient debout toute seule, c’est rare. Je la garderai, sans la dire.

- « Merci, Ish’Lenne. » → **fin**

### raconte-neutre

_Effet : retient « raconte-ish-lenne », +5 XP._

> — Merci. Ailleurs qu’à son lieu, une histoire reste une histoire. Ce n’est pas rien.

- « Merci, Ish’Lenne. » → **fin**

## Un jalon

_La halte morte_

Commence par : « vivant » _(si repère « episode-dit »)_, sinon « dire » _(si repère « ish-mots »)_, sinon « jalon »

### jalon

> Un jalon de verre, debout depuis des siècles, sans un mot. Le sable l’a poli jusqu’à le rendre presque invisible. Personne n’est venu le voir depuis que la route a changé.

- « Le laisser debout. » → **fin**

### dire

> Un jalon de verre, debout depuis des siècles, sans un mot. Les mots, c’est toi qui les as, ceux qu’Ish’Lenne t’a fait répéter. Ici, et nulle part ailleurs.

- « Dire l’épisode, au pied du jalon. » → dit
- « Pas maintenant. » → **fin**

### dit

_Effet : retient « episode-dit », +30 XP._

> Tu le dis à voix haute, mot pour mot : « Au quai sans nom, une caisse de plomb, et personne. Les Marcheurs ont attendu un jour. Personne n’est venu. Ils ont planté le verre, pour qu’on sache que c’était là. » Le vent tombe. La halte a de nouveau lieu.

- « Rester un moment. » → **fin**

### vivant

> Le jalon. Le vent tourne autour, et le sable chante un peu contre le verre. La halte a de nouveau lieu, pour quelqu’un au moins.

- « Le laisser debout. » → **fin**

## Joss Brakel

_Aiguilleur de nuit_

Commence par : « merci » _(si repère « dette-joss-payee »)_, sinon « apres » _(si quête « Le Rail des Cendres » terminée)_, sinon « avoue » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « joss-avoue »)_, sinon « soupcon » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « indice-registre »)_, sinon « soupcon » _(si quête « Le Rail des Cendres » en cours)_ _(si repère « indice-aiguillage »)_, sinon « accueil »

### accueil

> Un aiguilleur aux yeux cernés astique sa lanterne. — Joss Brakel, aiguilleur de nuit. De jour, maintenant : la nuit, plus personne ne roule.

- « Tu as vu partir les convois ? » → vu
- _(sans repère « raconte-joss »)_ « Une histoire, pour la relève ? » → raconte-neutre 📖 raconter un Récit : convoi-sans-conducteur → raconte-convoi ; trains, mysteres → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-joss », +5 XP._

> Joss écoute en astiquant sa lanterne. — Pas mal. La nuit, ce genre d’histoire, ça tient éveillé. Le jour, ça endort.

- « Bonne relève, Joss. » → **fin**

### raconte-touche

_Effet : retient « raconte-joss », +10 XP._

> Joss pose sa lanterne. — Celle-là, je la connais presque. Les aiguilleurs se la racontent depuis toujours, chacun avec sa fin.

- « Bonne relève, Joss. » → **fin**

### raconte-convoi

_Effet : retient « raconte-joss », +15 XP._

> Joss ne rit pas. — Un convoi sans conducteur. À l’aiguillage, on a une règle : on ne rit pas des trains qu’on n’a pas vus passer. On les note quand même, au cas où.

- « Bonne relève, Joss. » → **fin**

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
- « Alors fermez la frontière, avant qu’ils creusent ailleurs. » → lyra-presse

### lyra

> Lyra Cœur-de-Sève, la Première Racine, lève la main. — Doucement, Gardien. Quatre parts sur dix de notre commerce passent par Ferros. Fermer la frontière sur une rumeur, c’est affamer Gardebois. Il nous faut des preuves.

- « Et ce mal qui fait oublier ? » → thalorin
- « Des preuves, j’en trouverai. » → thalorin-preuves

### lyra-presse

> Kael approuve d’un signe de tête. Lyra Cœur-de-Sève, la Première Racine, lève la main. — Doucement, tous les deux. Quatre parts sur dix de notre commerce passent par Ferros. Fermer la frontière sur une rumeur, c’est affamer Gardebois. Il nous faut des preuves.

- « Et ce mal qui fait oublier ? » → thalorin
- « Des preuves, j’en trouverai. » → thalorin-preuves

### thalorin

> Au centre, l’Ancien Thalorin n’a pas bougé. Sa voix ressemble au vent dans les feuilles. — Ce mal n’est pas seulement à Gardebois. Depuis peu, les noms gravés du Bosquet des Échos se taisent. On pose la main, et le bois reste froid.

- « Je peux chercher pourquoi. » → mission _(retient « audience-tenue », +20 XP)_

### thalorin-preuves

> Au centre, l’Ancien Thalorin n’a pas bougé. Sa voix ressemble au vent dans les feuilles. — Commence par le Bosquet des Échos. Depuis peu, ses noms gravés se taisent : on pose la main, et le bois reste froid. Ce mal n’est pas seulement à Gardebois.

- « Je peux chercher pourquoi. » → mission

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

Commence par : « gants-cendriere » _(si quête « Les noms qui montent » terminée)_ _(si repère « cle-vendue »)_ _(si quête « Sous la cendre » pas commencée)_, sinon « plaque » _(si quête « Ce qui se souvient » en cours)_ _(si l’on porte « Plaque émaillée »)_, sinon « offre » _(si l’on porte « Clé de rouille bleue »)_, sinon « apres-vente » _(si repère « cle-vendue »)_, sinon « apres » _(si quête « La Clé de Rouille Bleue » terminée)_, sinon « retour » _(si repère « kaelis-parle »)_, sinon « accueil-garrik » _(si repère « fouille-elucidee »)_, sinon « accueil »

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

- « La lui vendre, pour cent Fers. » → vendue _(reprend 1 × « Clé de rouille bleue », +100 Fers, retient « cle-vendue », termine la quête « La Clé de Rouille Bleue », retient « fin-cle-rouille-bleue-vendue », +60 XP, avis de Boulon −2, avis de Liane −1)_
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

### gants-cendriere

> Kaelis compte des os sans les regarder. — Mes gants fins sont revenus de la Cendrière, la semaine dernière, avec une caisse de plomb. Ils ne m’ont pas dit ce qu’il y avait dedans. Ils ne m’ont pas payée non plus.

- « Ils avaient la clé. » → gants-cle
- « Autre chose. » → apres-vente

### gants-cle

> — Ta clé, oui. Celle que tu m’as vendue. Kaelis sourit, sans méchanceté. — Toute relique a un prix. Le tien, tu l’as touché il y a longtemps.

- « Partir. » → **fin** _(lance la quête « Sous la cendre », retient « caisse-ferros-prise », +10 XP, termine la quête « Sous la cendre », retient « fin-caisse-cendriere-prise »)_

## Kéo’Sa

_Neuf ans, apprend à parler aux dragonnets_

Commence par : « nombres » _(si quête « La halte muette » en cours)_ _(sans repère « muette-keo »)_, sinon « nid » _(si quête « Le dragonnet » en cours)_, sinon « accueil »

### accueil

> Une fillette de neuf ans, une écaille rouge au cou, accroupie devant un dragonnet qui ne la regarde pas. — Chut. Il ne mange plus depuis que son Lien est mort. Moi, je lui parle quand même. On n’a pas le droit de se lier avant quinze ans. Lui, il ne le sait pas.

- « Comment tu lui parles ? » → parler
- _(sans repère « raconte-keo-sa »)_ « Tu veux une histoire ? » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-special ; familles → raconte-touche ; autres → raconte-neutre
- _(si quête « Le dragonnet » pas commencée)_ « Je peux t’aider ? » → aider
- « Je te laisse. » → **fin**

### parler

> — Pas avec la bouche. Avec le ventre. Grand-mère Saal’Ema dit que c’est pareil avec Longue-Ombre, en plus gros. Quand il a mal, j’ai mal ici. — Elle montre sous ses côtes.

- « Je te laisse. » → **fin**

### nombres

_Effet : retient « muette-keo »._

> — Les dix jours ? On les apprend à sept ans ! Avec un pas entre chacun. — Elle se lève, et marche. — Troisième, quatre. Neuvième, quarante et un. Dix-septième, deux cent six. Vingt-quatrième, six cent dix-neuf. — Elle s’arrête. — Après, je me trompe toujours.

- « C’est déjà beaucoup. Merci. » → **fin**

### aider

_Effet : lance la quête « Le dragonnet », retient « dragonnet-commence »._

> — Il faut qu’il mange. Grand-mère dit qu’il ne mangera qu’avec un Lien, et que je suis trop petite pour en être un. Lui, il ne sait pas compter jusqu’à quinze.

- « Je vais voir ce qu’on peut faire. » → **fin**

### nid

> Kéo’Sa caresse le dragonnet du bout des doigts. — Tu as vu grand-mère ? Elle dit toujours non, d’abord. Après, elle réfléchit.

- « Je reviens. » → **fin**

### raconte-special

_Effet : retient « raconte-keo-sa », +15 XP._

> Kéo’Sa ne dit rien pendant longtemps. Puis, au dragonnet, tout bas : — Elle est tombée, Pim. Mais elle avait des rubans. Moi, j’aurai des écailles.

- « Merci, Kéo’Sa. » → **fin**

### raconte-touche

_Effet : retient « raconte-keo-sa », +10 XP._

> Kéo’Sa écoute en grattant le dragonnet entre les yeux. — Encore une ! Il aime bien, lui aussi.

- « Merci, Kéo’Sa. » → **fin**

### raconte-neutre

_Effet : retient « raconte-keo-sa », +5 XP._

> — Elle était bien. Mais il n’y avait pas de dragon dedans.

- « Merci, Kéo’Sa. » → **fin**

## Kerta Orvel

_Fondeuse des Forges-Basses_

Commence par : « apres-arrete » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « tam-arrete »)_, sinon « apres-monte » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « tam-monte »)_, sinon « apres-masques » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « masques-forges »)_, sinon « attente » _(si quête « Le registre du Puits Trois » en cours)_, sinon « accueil »

### accueil

> Une femme aux avant-bras couturés de brûlures attend son tour au Puits Trois, un seau de fer à la main. La file ne parle pas. Elle, si, à voix basse : — Tu n’es pas d’ici. Tant mieux. Ici, personne ne m’aidera.

- « Qu’est-ce qui ne va pas ? » → probleme
- « Pourquoi la file se tait-elle ? » → file
- _(sans repère « raconte-kerta »)_ « Je peux te raconter une histoire, en attendant ton tour. » → raconte-neutre 📖 raconter un Récit : saule → raconte-saule ; familles → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-kerta », +5 XP._

> Kerta écoute sans quitter la file des yeux. — Merci. Ça fait passer le temps. Ici, le temps, c’est tout ce qu’on a en trop.

- « Bon courage, Kerta. » → **fin**

### raconte-touche

_Effet : retient « raconte-kerta », +10 XP._

> Kerta pose son seau. — Une famille qui tient. Je la raconterai à Tam, ce soir, s’il ne tousse pas trop pour écouter.

- « Bon courage, Kerta. » → **fin**

### raconte-saule

_Effet : retient « raconte-kerta », +15 XP._

> Kerta serre l’anse de son seau. — Un garçon parti gagner des Fers sur un chantier. C’est pour ça que je veux que Tam monte. Là-haut, au moins, on ne meurt pas sous les déblais. On y meurt autrement, peut-être.

- « Bon courage, Kerta. » → **fin**

## Khrys

_L’Entité de la Bibliothèque_

Commence par : « rend »

### rend

> Le cristal, haut comme deux hommes, ne bouge pas. Quand tu approches, une lueur monte en lui, puis une voix sans souffle, qui ne vient de nulle part : « Le cristal rend. »

- « Et ne juge pas. » → rend2
- « Lui poser une question. » → question
- « Reculer. » → **fin**

### rend2

> « Et ne juge pas. » La voix te rend ta réponse, exactement, avec ta propre voix. Puis la lueur s’éteint. Khrys rend ce qu’on lui confie, et tu ne lui as rien confié d’autre.

- « Reculer. » → **fin**

### question

> Tu poses ta question. La lueur monte, retombe. Rien. Khrys ne converse pas : il rend ce qu’on lui a confié, et personne ne lui a confié la réponse.

- « Reculer. » → **fin**

## Korvek

_Yéti, guide des glaces_

Commence par : « merci » _(si quête « Le yéti des Portes » terminée)_, sinon « accuse-attend » _(si quête « Le yéti des Portes » en cours)_, sinon « accuse » _(si repère « glace-pris-commencee »)_ _(si quête « Le yéti des Portes » pas commencée)_, sinon « accueil »

### accueil

> Un Yéti, deux têtes de plus que toi, la fourrure blanche grise de suie aux chevilles. Des cordes en bandoulière, un bâton de guide. Il parle bas, et lentement. — Korvek. Guide. Toucher mon bras pour la chance, c’est un Fer.

- **[1 Fers]** « Un Fer pour la chance. » → chance _(−1 Fers)_
- « Pourquoi un Fer ? » → pourquoi
- _(si quête « L’Épreuve du Blizzard » en cours)_ _(sans repère « sigrun-reperee »)_ « Il y a une fille dehors, Sigrun. Tu peux la trouver ? » → guide
- « Je te laisse. » → **fin**

### chance

> Tu poses la main sur son bras. La fourrure est raide de givre, et dessous, très chaude. — Voilà. Croiser un Yéti porte chance, disent-ils. M’embaucher, beaucoup moins : ils préfèrent un guide humain, qui se perd plus souvent.

- « Pourquoi un Fer ? » → pourquoi
- « Merci, Korvek. » → **fin**

### pourquoi

> — Parce qu’ils me touchent quand même, alors autant que ça rapporte. Depuis 2990, on a le droit de demander. Avant, on avait le droit de se taire.

- _(sans repère « raconte-korvek »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : premier-tri → raconte-special ; morts, familles → raconte-touche ; autres → raconte-neutre
- « Je te laisse. » → **fin**

### accuse

_Effet : lance la quête « Le yéti des Portes », retient « yeti-commence »._

> Korvek ne tend pas le bras, cette fois. — Un traîneau de Ferros a été vidé cette nuit, devant les Portes. Le marchand dit que c’est moi. Personne n’a rien vu. Mais un Yéti, ça se voit toujours, même quand il n’est pas là. La garde me renvoie demain.

- « Je vais trouver qui c’est. » → **fin**
- « Pars avant qu’ils te renvoient. » → parti _(termine la quête « Le yéti des Portes », retient « fin-yeti-portes-parti », +20 XP, retient « yeti-portes-reglee »)_
- _(si quête « L’Épreuve du Blizzard » en cours)_ _(sans repère « sigrun-reperee »)_ « Il y a une fille dehors, Sigrun. Tu peux la trouver ? » → guide
- « Je te laisse. » → **fin**

### accuse-attend

> — La garde attend que je parte. Le traîneau est toujours là, vide, devant les Portes. Les sangles pendent.

- « Je vais trouver qui c’est. » → **fin**
- « Pars avant qu’ils te renvoient. » → parti _(termine la quête « Le yéti des Portes », retient « fin-yeti-portes-parti », +20 XP, retient « yeti-portes-reglee »)_
- _(si quête « L’Épreuve du Blizzard » en cours)_ _(sans repère « sigrun-reperee »)_ « Il y a une fille dehors, Sigrun. Tu peux la trouver ? » → guide
- « Je te laisse. » → **fin**

### guide

> — Sigrun ? La grande sœur des renards de glace. Dix Fers. Personne ne paie un Yéti, alors je fais payer. Il prend son bâton et sa corde.

- **[10 Fers]** « Dix Fers. Allons-y. » → **fin** _(−10 Fers, retient « sigrun-reperee », retient « korvek-guide », mène à « Glacialis — la surface »)_
- « Pas maintenant. » → **fin**

### parti

> — Tu as raison. Il ramasse ses cordes. — Croiser un Yéti porte chance. Le garder, beaucoup moins. Il passe la Porte sans se retourner, vers les Terres Sauvages, au nord, où personne ne demande rien à personne.

- « Le regarder partir. » → **fin**

### merci

> Korvek te tend le bras, cette fois. — Pour la chance. Gratuit, pour toi. Ne le dis à personne : ça ferait baisser les prix.

- _(si quête « L’Épreuve du Blizzard » en cours)_ _(sans repère « sigrun-reperee »)_ « Il y a une fille dehors, Sigrun. Tu peux la trouver ? » → guide
- « Merci, Korvek. » → **fin**

### raconte-special

_Effet : retient « raconte-korvek », +15 XP._

> Korvek t’écoute jusqu’au bout sans bouger. — Vaelor. Il portait deux personnes à la fois. Un Yéti en porte trois. Personne n’a jamais gravé de cristal pour un Yéti qui portait.

- « Merci, Korvek. » → **fin**

### raconte-touche

_Effet : retient « raconte-korvek », +10 XP._

> — Une histoire de gens qui restent. Il hoche sa grosse tête. — Chez nous, on les raconte en marchant, pour ne pas geler. Celle-là marche bien.

- « Merci, Korvek. » → **fin**

### raconte-neutre

_Effet : retient « raconte-korvek », +5 XP._

> — Merci. Il te tend le bras. — Pour la chance. Celle-là, je ne la fais pas payer.

- « Merci, Korvek. » → **fin**

## Kresh’Tal

_Le dragon de la Reine_

Commence par : « perchoir »

### perchoir

> Un dragon rouge, très ancien, couché sur un perchoir de cristal. Un œil s’ouvre, te pèse, et se referme. Tu n’existes plus pour lui. Plus loin, quelqu’un murmure : « Kresh’Tal. Six cents ans. Ne le réveille pas pour rien. »

- « Passer sans bruit. » → **fin**

## Le Lâcher

_La Haute-Île_

Commence par : « bord »

### bord

> Le bord de la Haute-Île. Le vent monte de la mer de nuages, assez fort pour qu’on s’y appuie. Pour lâcher une voile, il faut l’avoir attrapée, et un tissu neuf pour la recopier.

- _(si l’on porte « Une voile attrapée »)_ _(si l’on porte « Tissu à voile »)_ _(sans repère « voiles-lachees-1 »)_ « Recopier une voile sur un tissu neuf, et la lâcher. » → lachee _(reprend 1 × « Une voile attrapée », reprend 1 × « Tissu à voile », fait passer 1 moment, retient « voiles-lachees-1 », +10 XP)_
- _(si l’on porte « Une voile attrapée »)_ _(si l’on porte « Tissu à voile »)_ _(si repère « voiles-lachees-1 »)_ _(sans repère « voiles-lachees-2 »)_ « Recopier une voile sur un tissu neuf, et la lâcher. » → lachee _(reprend 1 × « Une voile attrapée », reprend 1 × « Tissu à voile », fait passer 1 moment, retient « voiles-lachees-2 », +10 XP)_
- _(si l’on porte « Une voile attrapée »)_ _(si l’on porte « Tissu à voile »)_ _(si repère « voiles-lachees-2 »)_ « Recopier une voile sur un tissu neuf, et la lâcher. » → lachee _(reprend 1 × « Une voile attrapée », reprend 1 × « Tissu à voile », fait passer 1 moment)_
- « Regarder le vent. » → **fin**

### lachee

> Tu recopies la voile mot pour mot, en t’appliquant. Puis tu ouvres la main. Le vent la prend tout de suite, et elle monte, et elle part. Quelque part, quelqu’un l’attrapera. Le Registre la comptera.

- « Rester encore un peu. » → **fin**

## Des lettres éparpillées

_Objet_

Commence par : « lettres »

### lettres

> Quelques lettres, éparpillées entre les racines, encore sèches. Des traces dans la mousse partent vers la vieille voie, à l’est, comme si quelque chose avait traîné la sacoche.

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

> De larges empreintes rondes, et des touffes de mousse arrachées : un Ours-Mousse. Il a dû la traîner jusqu’à l’entrée de la fouille, entre les racines, et s’y coucher.

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
- _(sans repère « raconte-liane »)_ « Tu veux entendre une histoire ? » → raconte-neutre 📖 raconter un Récit : voix-ecorce → raconte-bosquet ; arbres, familles → raconte-touche ; autres → raconte-neutre
- « … » → **fin**

### recrue

> Liane te dévisage longtemps. — Mes malades. Sylvan les nourrira, et la sauge repousse sans moi. Mais je ne me bats pas pour les causes perdues, et je ne vole rien à personne. Compris ?

- « Compris. » → **fin** _(Liane se joint au héros)_
- « Je reviendrai. » → **fin**

### malades

_Effet : retient « liane-malades-vus », avis de Liane +1, +10 XP._

> Liane te regarde faire, bras croisés. — Le pouls, les yeux, la langue : tu sais lire un malade. Ils n’ont pas de fièvre. Ils revivent quelque chose. Mes herbes calment le corps ; le reste vient de la Gare.

- « Je reviendrai. » → **fin**

### raconte-neutre

_Effet : retient « raconte-liane », +5 XP._

> Liane hausse les épaules, mais elle a écouté jusqu’au bout. — Mes malades aimeraient. Moi, je préfère les plantes : elles ne racontent rien, mais elles guérissent.

- « À bientôt, Liane. » → **fin**

### raconte-touche

_Effet : retient « raconte-liane », +10 XP, avis de Liane +1._

> Liane sourit en coin. — Tu racontes mieux que tu ne cueilles. Reviens quand tu veux.

- « À bientôt, Liane. » → **fin**

### raconte-bosquet

_Effet : retient « raconte-liane », +15 XP, avis de Liane +1._

> Liane écoute sans bouger. — Les noms gravés se souviennent à notre place ? Alors il y a un nom que je n’ai jamais osé y porter. Un jour, peut-être.

- « À bientôt, Liane. » → **fin**

## Lio

_Novice des Murmureurs_

Commence par : « libre » _(si repère « abyssaux-vaincus »)_, sinon « libre » _(si repère « abyssaux-partis »)_, sinon « prisonnier »

### prisonnier

> Le novice ne lève pas les yeux. Il récite quelque chose, très bas, pour ne pas entendre les autres.

- « Partir. » → **fin**

### libre

_Effet : retient « lio-libre »._

> Lio tremble. — Ils voulaient que je dise « tout ». Je ne l’ai pas dit. Je ne l’ai pas dit, hein ?

- « Non. Viens, on rentre. » → **fin**

## Lior Rose-des-Vents

_Cartographe_

Commence par : « altavent » _(si quête « Les Mémoires du Monde Perdu » en cours)_ _(si repère « page-lue »)_ _(sans repère « altavent-situe »)_, sinon « accueil »

### accueil

> Un homme maigre, un rouleau sous le bras, une boussole au cou. — Lior Rose-des-Vents, cartographe. Les Sept Portes mènent partout, et aucune carte ne le dit bien. Je les dessine, moi.

- « Où mènent-elles ? » → portes
- « Un cartographe qui ne sait pas où mène la septième Porte. Rassurant. » → ironie
- _(sans repère « raconte-lior »)_ « J’ai une histoire, si elle vaut une carte. » → raconte-neutre 📖 raconter un Récit : jeudi-ordinaire → raconte-jeudi ; ancien-monde, mysteres → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-lior », +5 XP._

> Lior écoute en roulant et déroulant une carte. — Elle n’a pas de nord, ton histoire. Ce n’est pas un reproche : les meilleures n’en ont pas.

- « Merci, Lior. » → **fin**

### raconte-touche

_Effet : retient « raconte-lior », +10 XP._

> Lior sort une plume. — Attends, je note où elle se passe. Une histoire sans lieu, ça se perd ; avec un lieu, ça devient une carte.

- « Merci, Lior. » → **fin**

### raconte-jeudi

_Effet : retient « raconte-lior », +15 XP._

> Lior déroule une vieille carte où toutes les voies s’arrêtent net. — Un jeudi. Sur mes cartes, toutes les lignes de l’Ancien Monde s’arrêtent le même jour. Je n’avais jamais pensé à demander quel temps il faisait.

- « Merci, Lior. » → **fin**

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

## Un recueil sur un lutrin

_Grande Bibliothèque_

Commence par : « relu » _(si repère « dedicace-lue »)_, sinon « lutrin »

### lutrin

> Sur un lutrin public, un vieux recueil de poèmes venu de Marisol, ouvert à sa dédicace : « À Maryse, qui m’attendra. » Dans la marge, une trace de crayon gommée : quelqu’un a écrit autre chose, et quelqu’un l’a effacé.

- _(sans repère « dedicace-floue »)_ **🎲 Investigation 13** « Déchiffrer ce qui a été gommé. » → nom, ✗ → floue
- « Le laisser. » → **fin**

### floue

_Effet : retient « dedicace-floue » pour 1 jours._

> Le papier est usé à cet endroit, doux à force d’avoir été gommé. Tu ne lis rien. Avec un œil reposé, demain, peut-être.

- « Le laisser. » → **fin**

### nom

_Effet : retient « dedicace-lue », +10 XP._

> Penché sous la lampe, tu lis le fantôme d’un mot : « Mariza ». Écrit, gommé, réécrit, tant de fois que le papier en est devenu doux. Quelqu’un corrige cette dédicace. À la Grande Bibliothèque, c’est interdit.

- « Le laisser. » → **fin**

### relu

> La dédicace dit toujours « Maryse ». Dans la marge, le crayon gommé a laissé une ombre que tu sais lire, maintenant : « Mariza ».

- « Le laisser. » → **fin**

## Longue-Ombre

_La plus vieille des douze_

Commence par : « tete »

### tete

> La tête de Longue-Ombre, plus haute qu’une tente. Un œil d’ambre, mi-clos, qui ne te regarde pas : il regarde le désert, au sud. Sous ta main, la carapace est tiède, et elle bat, très lentement.

- « Retirer ta main. » → **fin**

## Un lot de cristaux

_Le comptoir des Matriarches_

Commence par : « lot » _(si quête « Le verre de la Mer » en cours)_ _(sans repère « lot-trie »)_, sinon « trie »

### lot

> Une trentaine d’éclats de la Mer de Verre, ambrés, laiteux, certains presque noirs. À trier par pureté avant la caravane.

- **🎲 Artisanat 16** « Les trier, éclat par éclat. » → vivant, ✗ → rate
- « Plus tard. » → **fin**

### rate

> Tu te trompes deux fois ; Hiran’Amra, de loin, corrige d’un geste sans rien dire. Puis, sous tes doigts, un éclat tiède, qui bat. Un cristal vivant.

- « Le mettre à part, pour qu’il retourne à la Mer de Verre. » → **fin** _(retient « lot-trie », retient « cristal-vivant-rendu »)_
- « Le classer avec les autres. » → **fin** _(retient « lot-trie », retient « cristal-vivant-vendu »)_

### vivant

> Le tri se fait vite. Puis, sous tes doigts, un éclat tiède, qui bat. Un cristal vivant, que quelqu’un a ramassé avec les autres. La Communion dit qu’ils ont une conscience, et qu’on ne les vend pas.

- « Le mettre à part, pour qu’il retourne à la Mer de Verre. » → **fin** _(retient « lot-trie », retient « cristal-vivant-rendu »)_
- « Le classer avec les autres. » → **fin** _(retient « lot-trie », retient « cristal-vivant-vendu »)_

### trie

> Le lot, trié et emballé pour la caravane.

- « Passer. » → **fin**

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

- _(sans repère « raconte-maelis »)_ « Je peux te raconter une histoire, pour Nell. » → raconte-neutre 📖 raconter un Récit : saule → raconte-saule ; familles, chansons → raconte-touche ; autres → raconte-neutre
- « Prends soin d’elle. » → **fin**

### cruel

> Maëlis recule d’un pas, puis se redresse. — Ailleurs, oui. Ici, c’est ma fille. Va-t’en.

- « Partir. » → **fin**

### raconte-neutre

_Effet : retient « raconte-maelis », +5 XP._

> Maëlis écoute jusqu’au bout, les mains serrées sur son tablier. — Je la lui raconterai ce soir. Si elle s’en souvient demain, ce sera grâce à toi.

- « Prends soin d’elle. » → **fin**

### raconte-touche

_Effet : retient « raconte-maelis », +10 XP._

> Maëlis sourit pour la première fois depuis longtemps. — Celle-là, Nell la gardera. Les histoires de famille tiennent mieux que les autres : on les raconte trop souvent pour les perdre.

- « Prends soin d’elle. » → **fin**

### raconte-saule

_Effet : retient « raconte-maelis », +15 XP._

> Maëlis porte la main à sa bouche. — Saule ? Il portait Nell sur ses épaules, les jours de foire. Elle l’appelait « l’arbre qui rit ». Dis à Liane qu’on se souvient de lui, au marché aussi.

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
- _(sans repère « raconte-malo »)_ « J’ai une histoire, si tu as une minute. » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-pim ; mysteres, familles → raconte-touche ; autres → raconte-neutre
- « À plus tard, Malo. » → **fin**

### flute

_Effet : retient « malo-flute-dit »._

> Mamie joue de la flûte ! Tous les soirs, au Bosquet. Elle dit que c’est grâce à toi, et à Papi. Elle va m’apprendre. Je serai coursier ET musicien.

- _(si quête « Les lettres de Malo » pas commencée)_ « Merci pour la nouvelle. » → souci
- _(si quête « Les lettres de Malo » terminée)_ « Merci pour la nouvelle, Malo. » → ami
- « À bientôt, Malo. » → **fin**

### raconte-neutre

_Effet : retient « raconte-malo », +5 XP._

> Malo trépigne jusqu’à la fin, puis repart en courant. — Je l’ai ! Je la porterai aux Ramures avec le courrier.

- « À bientôt, Malo. » → **fin**

### raconte-touche

_Effet : retient « raconte-malo », +10 XP._

> Malo s’assoit, pour une fois. — Encore une comme ça et je deviens conteur, pas coursier. Grand-mère dirait que c’est pareil, en plus lent.

- « À bientôt, Malo. » → **fin**

### raconte-pim

_Effet : retient « raconte-malo », +15 XP._

> Malo baisse les yeux. — Pim ? Il me courait après sur les passerelles. Il voulait être coursier, plus tard. Sa sœur noue un ruban à l’échelle chaque matin, avant le marché.

- « À bientôt, Malo. » → **fin**

## Des Mantes-ailes

_La Voie du Bas_

Commence par : « mantes »

### mantes

> Deux Mantes-ailes sont posées sur les wagons, en travers de la voie. Leurs ailes repliées font un bruit de lames qu’on aiguise. Elles ne t’ont pas encore vu·e.

- « Attaquer. » → **fin** _(lance le combat « mantes-voie »)_
- **🎲 Discrétion 15** « Passer sous les wagons, sans bruit. » → passe, ✗ → repere
- _(si l’on porte « Masque de toile »)_ « Attendre qu’elles s’envolent, le masque sur la bouche. » → attente
- « Reculer. » → **fin**

### passe

_Effet : retient « mantes-voie-passees », +15 XP._

> Tu passes sous le premier wagon sur les coudes. Une aile se déplie au-dessus de toi, se replie. Tu ressors de l’autre côté, gris de la tête aux pieds.

- « Continuer. » → **fin**

### repere

> Une rafale soulève la cendre. Les deux têtes se tournent ensemble vers toi.

- « Se battre. » → **fin** _(lance le combat « mantes-voie »)_

### attente

_Effet : fait passer 2 moments, retient « mantes-voie-passees »._

> Tu t’assois dans la cendre, le masque serré. Les heures passent. Puis, d’un coup, les deux Mantes s’envolent ensemble, vers le haut, et la voie est libre.

- « Continuer. » → **fin**

## La marchande des nations

_Marché des nations_

Commence par : « accueil »

### accueil

> — Des baumes de Verdantis, des carreaux de Ferros, des cristaux de partout ! Fers, Feuilles, coquillages : je change tout, au cours du jour, et toujours à mon avantage.

- « Voyons ça. » → **fin** _(ouvre le Troc)_
- « Au revoir. » → **fin**

## Une Marcheuse du Souffle

_Temple du Désert-Vivant_

Commence par : « accueil »

### accueil

> Une femme pieds nus, la tête rasée, assise entre trois jalons. — Chaque pas laisse une trace. C’est le sixième principe, et c’est tout ce que je t’enseignerai : le reste, tu le marcheras.

- « Une trace de quoi ? » → trace
- « Aq’Shara, c’est votre dieu ? » → aqshara
- « Je te laisse. » → **fin**

### trace

> — Une trace est ce qu’on laisse derrière soi. Et derrière soi est le seul endroit où l’on ne va pas. Le clergé ne commente jamais cette phrase. Moi non plus.

- « Aq’Shara, c’est votre dieu ? » → aqshara
- « Je te laisse. » → **fin**

### aqshara

> — Le Désert. Ni juge, ni créateur, ni dieu. Il marche ; nous marchons. Il ne nous doit rien, et c’est reposant.

- « Une trace de quoi ? » → trace
- « Je te laisse. » → **fin**

## Marina Azurios

_Grande Amiral de Marisol_

Commence par : « audience » _(si quête « Ce que la mer rend » en cours)_ _(sans repère « ordre-donne »)_ _(sans repère « ordre-refuse »)_, sinon « accueil »

### accueil

> La Grande Amiral Marina Azurios, en uniforme blanc, lit un rapport sans s’asseoir. — Un voyageur. Bienvenue à Coralia. Je n’ai que peu de temps : Ferros a reçu notre ultimatum, et Ferros ne répond pas.

- _(si quête « Le Cargo Noir » en cours)_ _(si l’on porte « Le journal de bord du Cargo Noir »)_ « Le déversement venait d’une compagnie de Ferros, pas de l’Empire. » → journal
- « Au revoir. » → **fin**

### audience

> La Grande Amiral lève les yeux de son rapport. — La caisse que la mer a rendue ? Mes douanes y voient Ferros. Le Synode y voit un présage. Et vous, qu’y voyez-vous ?

- **🎲 Diplomatie 15** « Ce n’est pas Ferros. C’est plus vieux que Ferros. » → ordre, ✗ → sec
- _(si repère « caisse-zephyria-reglee »)_ « Une pièce d’une machine que d’autres cherchent, et des noms d’enfants. » → ordre
- « Rien de précis. Je suis curieux. » → sec

### ordre

_Effet : donne 1 × « Un ordre de l’Amirauté », retient « ordre-donne »._

> Elle signe sans se rasseoir, à gauche du sceau. — Pour un Gardien de Mémoire. Mes douanes vous ouvriront. Si c’est Ferros, vous me le direz. Si ce n’est pas Ferros, vous me le direz aussi.

- « Merci, Grande Amiral. » → **fin**

### sec

_Effet : retient « ordre-refuse »._

> — Alors elle restera où elle est, jusqu’à ce que quelqu’un sache. Bonne journée.

- « Partir. » → **fin**

### journal

_Effet : reprend 1 × « Le journal de bord du Cargo Noir », +30 XP, termine la quête « Le Cargo Noir », retient « fin-cargo-noir-amiraute »._

> La Grande Amiral lit, longtemps. — Une compagnie. L’Empire peut payer sans perdre la face, et nous, obtenir réparation sans guerre. Ou je brandis ce journal à l’Assemblée des Marées, et l’embargo passe à l’unanimité. Je choisirai.

- « Partir. » → **fin**

## Matteo Marée-Haute

_Confrérie des Brisants_

Commence par : « paie-faite » _(si quête « La paie des Brisants » en cours)_ _(si repère « doucenet-paye »)_, sinon « accueil »

### accueil

> Un marin en vareuse, la casquette sur l’oreille. — Matteo Marée-Haute, de la Confrérie des Brisants. Le syndicat des marins marchands : si un équipage est mal payé, c’est nous qui le savons d’abord.

- « Et Ferros ? » → ferros
- _(si quête « La paie des Brisants » pas commencée)_ _(sans repère « membre-plongeurs-perles »)_ « Je veux entrer à la Confrérie. » → paie
- _(si quête « Le Cargo Noir » en cours)_ _(si l’on porte « Le journal de bord du Cargo Noir »)_ « La Confrérie en fera meilleur usage. » → journal-confrerie
- « Au revoir. » → **fin**

### ferros

> — Ferros pollue, et Ferros paie. Sans son métal, nos coques pourrissent. L’Amirauté parle d’embargo, les Plongeurs de Perles applaudissent. Nous, on compte ce qu’on mangera l’hiver.

- « Au revoir. » → **fin**

### paie

> — La Confrérie ne prend pas les gens : elle prend ceux qui font payer. L’armateur Doucenet doit trois mois de solde à l’équipage du Bel-Écart. Fais-le payer, et tu es Mousse.

- « J’y vais. » → **fin** _(lance la quête « La paie des Brisants »)_
- « Plus tard. » → **fin**

### paie-faite

_Effet : termine la quête « La paie des Brisants », retient « membre-confrerie-brisants », +40 XP._

> — Trois mois, rubis sur l’ongle. Matteo te tend un anneau de corde tressée. — Mousse de la Confrérie des Brisants. Ce n’est pas grand-chose. C’est plus que ce que Doucenet a jamais donné.

- « Le prendre. » → **fin**

### journal-confrerie

_Effet : reprend 1 × « Le journal de bord du Cargo Noir », +30 XP, termine la quête « Le Cargo Noir », retient « fin-cargo-noir-confrerie »._

> — Avec ça, on négocie avec les marchands de Ferros directement, par Terminus : des réparations contre du commerce, sans l’Assemblée. Matteo sourit. — La mer ne fait pas de politique. Les marins, si.

- « Partir. » → **fin**

## Mérande Fond-de-Cale

_Capitaine des douanes_

Commence par : « garde » _(si quête « Ce que la mer rend » en cours)_ _(sans repère « entrepot-ouvert »)_, sinon « accueil »

### accueil

> Une capitaine en veste azur, galons d’or, compte des caisses sur une ardoise. — Douanes de l’Amirauté. Rien à déclarer, j’espère ? Ne mentez jamais en mer : le quai, c’est déjà la mer.

- « Au revoir. » → **fin**

### garde

> La capitaine Mérande Fond-de-Cale ne quitte pas la porte des yeux. — La caisse ? Rendue par la mer il y a dix jours. Du plomb de l’Ancien Monde, ou de Ferros : depuis le Cargo Noir, tout ce qui flotte sans pavillon est une pièce à conviction.

- _(sans repère « merande-refus »)_ _(sans repère « merande-mefiante »)_ **🎲 Diplomatie 16** « Je suis des Gardiens de Mémoire. Laissez-moi voir ce qu’elle contient. » → ouverte, ✗ → refus
- _(sans repère « merande-mefiante »)_ **🎲 Subterfuge 16** « L’Amirauté m’envoie. Ordre de la Grande Amiral. » → ouverte-ruse, ✗ → mensonge
- _(si l’on porte « Un ordre de l’Amirauté »)_ « Voici un ordre de l’Amirauté. » → ouverte
- « Je reviendrai. » → **fin**

### ouverte

_Effet : retient « entrepot-ouvert »._

> Elle hésite, puis décroche une clé de sa ceinture. — Regardez. Ne touchez pas au plomb. Si c’est Ferros, je veux pouvoir le prouver.

- « Entrer. » → **fin** _(mène à « Coralia — l’Entrepôt des douanes »)_
- « Plus tard. » → **fin**

### ouverte-ruse

_Effet : retient « entrepot-ouvert », retient « ruse-amiraute »._

> Elle lit le papier que tu n’as pas, à la manière dont tu le tiens. — La Grande Amiral signe à gauche, d’habitude. Elle hausse les épaules, et ouvre. — Je vérifierai demain.

- « Entrer. » → **fin** _(mène à « Coralia — l’Entrepôt des douanes »)_
- « Plus tard. » → **fin**

### refus

_Effet : retient « merande-refus »._

> — Les Gardiens de Mémoire gardent des souvenirs. Moi, je garde des preuves. Revenez avec un ordre de l’Amirauté : le Palais est à l’est, après les Canaux.

- « Partir. » → **fin**

### mensonge

_Effet : retient « merande-mefiante »._

> — Ne mentez jamais en mer : Marethis entend chaque mot. Et moi aussi. Elle se plante devant la porte. — Revenez avec un vrai ordre, ou ne revenez pas.

- « Partir. » → **fin**

## Mina

_Une des jumeaux_

Commence par : « accueil »

### accueil

> — Moi, je sais ce que c’est, le raccompagnement : deux agents, une voiture, et on te pose au cent unième kilomètre. On y joue, dans la cour. C’est toujours Arlo qu’on raccompagne.

- _(sans repère « raconte-mina »)_ « Tu veux une histoire, Mina ? » → raconte-neutre 📖 raconter un Récit : berceuse-de-maelis → raconte-berceuse ; chansons, mysteres → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### raconte-neutre

_Effet : retient « raconte-mina », +5 XP._

> Mina écoute jusqu’au bout, sérieuse. — Je changerais la fin. Mais c’est la tienne, alors je ne dis rien.

- « Merci, Mina. » → **fin**

### raconte-touche

_Effet : retient « raconte-mina », +10 XP._

> Mina tape dans ses mains. — Encore ! Non : demain. Il faut garder les bonnes pour demain.

- « Merci, Mina. » → **fin**

### raconte-berceuse

_Effet : retient « raconte-mina », +15 XP, +2 Fers._

> Mina chante avec toi, très faux, puis s’arrête net. — Les grands disent que les légendes, ça s’achète. Je te l’achète : tiens. Elle te tend deux Fers tout chauds de sa main.

- « Merci, Mina. » → **fin**

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

## La glace claire

_Au bout des cryptes_

Commence par : « claire » _(si repère « glace-lacune »)_, sinon « ferme »

### ferme

> Au bout de la dernière allée, la glace s’éclaircit. Derrière, très loin, une ombre droite : un rail, peut-être. La paroi a plusieurs mètres d’épaisseur, et rien ne dit qu’il y ait quelque chose à chercher.

- « S’éloigner. » → **fin**

### claire

> Au bout de la dernière allée, la glace s’éclaircit. Derrière, très loin, une ombre droite : un rail. Quelqu’un a taillé un passage, il y a longtemps, et la glace l’a refermé à moitié. Il reste de quoi passer de profil.

- « Passer de profil. » → passe
- « Pas maintenant. » → **fin**

### passe

_Effet : retient « voie-sept-ouverte »._

> Tu te glisses dans la fente. La glace te touche les deux épaules à la fois, et pendant un long moment tu n’entends que ton souffle. Puis l’air change. Un quai.

- « Avancer. » → **fin** _(mène à « Sous les cryptes — la voie sept »)_

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

- _(sans repère « raconte-nell »)_ « Tu veux une histoire, Nell ? » → raconte-neutre 📖 raconter un Récit : berceuse-de-maelis → raconte-berceuse ; chansons → raconte-touche ; autres → raconte-neutre
- « … » → **fin**

### raconte-neutre

_Effet : retient « raconte-nell », +5 XP._

> Nell écoute en serrant son oiseau de bois contre elle. À la fin, elle hoche la tête, très sérieuse. — Elle est triste. Tu en as une avec une chanson ?

- « Merci, Nell. » → **fin**

### raconte-touche

_Effet : retient « raconte-nell », +10 XP._

> Au deuxième couplet, Nell chante avec toi, faux et très fort. Puis elle repart en courant le chanter à sa mère.

- « Merci, Nell. » → **fin**

### raconte-berceuse

_Effet : retient « raconte-nell », +15 XP._

> Nell te coupe : « Dors sous la feuille, dors sous le vent ! » Elle la sait par cœur, maintenant. Elle te la chante en entier, lentement, pour être sûre que toi, tu ne l’oublieras pas.

- « Merci, Nell. » → **fin**

## Nes’Mira

_Soigneuse de Longue-Ombre_

Commence par : « porte » _(si repère « fin-plus-lieu-longue-ombre »)_ _(sans repère « nes-porte »)_, sinon « tete » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « halte-trouvee »)_ _(sans repère « nes-tente »)_, sinon « oss » _(si quête « Celui qui voulait s’arrêter » en cours)_ _(sans repère « nes-oss »)_, sinon « accueil »

### accueil

> Une femme pieds nus sur la carapace, les avant-bras gris de sable, frotte un baume entre deux plaques. — Doucement. Elle sent tes pas. Elle sent tout. Aujourd’hui, elle est lasse.

- « Elle te parle ? » → lien
- « Lasse de quoi ? » → lasse
- « Je te laisse. » → **fin**

### lien

> — Pas avec des mots. Avec ce qui me serre le ventre quand elle a mal, et qui se desserre quand elle mange. Le lien, ça s’appelle. Le rompre, c’est la pire chose qu’on puisse faire, ici ou ailleurs.

- « Lasse de quoi ? » → lasse
- « Je te laisse. » → **fin**

### lasse

> — De porter. Elle porte un clan, des tentes, des vieux, et depuis plus longtemps que personne ne s’en souvient. Elle ne s’en plaint pas. C’est moi qui m’en plains, pour elle.

- « Elle te parle ? » → lien
- « Je te laisse. » → **fin**

### tete

> — Tu veux savoir ce qu’elle regarde, à chaque tour, au même endroit ? Pose ta main sur sa tête, près de l’œil, et ne pense à rien. Si elle te laisse entrer, tu le sauras. Si elle ne veut pas, n’insiste pas.

- _(si repère « rumeur-longue-ombre-boit »)_ **🎲 Survie 13** « Attendre qu’elle ait bu, puis poser la main. » → vision, ✗ → refus
- **🎲 Survie 16** « Poser la main près de son œil. » → vision, ✗ → refus
- « Plus tard. » → **fin**

### vision

_Effet : retient « halte-trouvee », retient « lien-longue-ombre »._

> Une chaleur te monte dans le bras, lente, énorme. Tu vois avec des yeux trop grands : une plaine blanche, un trait de verre debout, et au pied, quelque chose de lourd, posé, que personne n’est venu prendre. Demain, la Marche passera à neuf kilomètres.

- « Retirer ta main. » → vision-2

### vision-2

> Nes’Mira te regarde, les yeux mouillés. — Elle t’a laissé entrer. Elle ne fait jamais ça. Si tu te perds, là-bas, écoute-la : elle gronde, tu entendras d’où vient le grondement.

- « Merci, Nes’Mira. » → **fin**

### refus

_Effet : retient « nes-tente »._

> Rien. La carapace est tiède, l’œil reste mi-clos. Nes’Mira secoue la tête. — Elle est lasse. Demande aux guides : ils savent où passe la piste, eux.

- « Je comprends. » → **fin**

### porte

_Effet : retient « nes-porte »._

> — Elle la porte, ta caisse, entre deux plaques, près du cou. Elle ne s’est pas plainte. Cette nuit, elle a dormi d’un sommeil que je ne lui connaissais plus.

- « Tant mieux. » → accueil

### oss

_Effet : retient « nes-oss »._

> — Oss’Amar ? Les Léviathans portent ceux qui ne marchent plus, il le sait. Il ne veut pas être porté : il veut rester avec elle. Mais si tu le lui proposes au nom de Longue-Ombre, il ne dira peut-être pas non. Elle l’aimait bien, sa femme.

- « Je le lui dirai. » → **fin**

## L’archiviste Noam

_Archives Centrales de Ferros_

Commence par : « carnet-cendriere » _(si quête « Les noms qui montent » terminée)_ _(si repère « cle-archives »)_ _(si quête « Sous la cendre » pas commencée)_, sinon « releve » _(si l’on porte « Relevé d’un Écho »)_ _(si quête « Les Échos sous la Forge » en cours)_, sinon « cle » _(si l’on porte « Clé de rouille bleue »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « registre » _(si quête « Le contrat de Boulon » en cours)_ _(sans repère « boulon-libre »)_, sinon « fonds » _(si quête « Le fonds des Échos » en cours)_ _(5 Échos recueillis ou plus)_, sinon « apres-archives » _(si repère « cle-archives »)_, sinon « accueil »

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

- « La lui confier. » → ouverture _(reprend 1 × « Clé de rouille bleue », retient « cle-archives », termine la quête « La Clé de Rouille Bleue », retient « fin-cle-rouille-bleue-confiee », +70 XP, retient le Récit « Le carnet du dernier train »)_
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

### carnet-cendriere

> Noam ouvre un dossier avant que tu parles. — Le carnet de bord du dernier train, page quatorze (voir : Cendrière). « Embranchement de la Cendrière : déchargé une caisse plombée. Reçu : personne. » Je l’ai classé. Classer, c’est déjà agir, à Ferros.

- « Je vais à la Cendrière. » → **fin** _(lance la quête « Sous la cendre », retient « caisse-ferros-cherchee »)_
- « Autre chose. » → apres-archives

## Noéa Perlemer

_Aubergiste de la Conque Rieuse_

Commence par : « lettre-prise » _(si quête « Ce que la mer rend » terminée)_ _(si repère « caisse-marisol-prise »)_ _(sans repère « noea-lettre »)_, sinon « lettre » _(si quête « Ce que la mer rend » terminée)_ _(sans repère « noea-lettre »)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Une Maréenne à la peau dorée, des perles aux oreilles, essuie des chopes en chantant faux, exprès. — La Conque Rieuse ! On mange, on dort, et le soir on chante, jamais deux fois pareil. Qu’est-ce qui vous ferait plaisir ?

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Chanter un Récit à la veillée. » → **fin** _(ouvre la veillée « conque »)_
- « Au revoir. » → **fin**

### servir

> — Du poisson grillé, du pain de Verdantis, ou un hamac au-dessus du canal. Le pain coûte plus que le poisson : ici, c’est la terre qui est rare.

- **[10 Fers]** « Du poisson et du pain. » → mange _(−10 Fers, +15 PV)_
- **[10 Fers]** « Un hamac jusqu’au matin. » → dodo _(−10 Fers, dort jusqu’au matin)_
- **[10 Fers]** « Un hamac jusqu’à la nuit. » → dodo _(−10 Fers, dort jusqu’à la nuit)_
- « Rien, merci. » → accueil

### mange

> Le poisson est grillé à la braise de bois flotté, le pain a voyagé deux semaines. Noéa s’assoit en face de toi, sans te demander la permission, et mange ta croûte.

- « Merci, Noéa. » → accueil

### dodo

> Le hamac se balance au-dessus du canal. L’eau clapote contre les piliers, et tu t’endors avant d’avoir compté jusqu’à sept.

- « Se lever. » → **fin**

### nouvelles

> — L’Amirauté a saisi une caisse que la mer a rendue. Les Murmureurs ne dorment plus. Et une dame en gris passe ses journées à la Salle des Conques, une conque contre l’oreille. On parie sur ce qu’elle écoute.

- _(sans repère « raconte-noea »)_ « Je voudrais vous raconter une histoire, à vous seule. » → raconte-neutre 📖 raconter un Récit : on-se-retrouvera → raconte-special ; chansons, familles → raconte-touche ; autres → raconte-neutre
- « Merci, Noéa. » → accueil

### lettre

> — Une lettre pour toi, arrivée par le navire de Verdantis. Elle a pris l’eau, un peu.

- « L’ouvrir. » → lettre-texte

### lettre-texte

_Effet : retient « noea-lettre »._

> L’écriture d’Ilyane, qui tremble. « Tu es au bord de la mer ? Je n’ai jamais vu la mer. Ou je l’ai vue, et je l’ai oubliée. Écris-moi comment elle est. Je relirai ta lettre tous les soirs, et chaque soir, ce sera la première fois. »

- « Plier la lettre. » → **fin**

### lettre-prise

_Effet : retient « noea-lettre »._

> — Une lettre pour toi, arrivée par le navire. Noéa te la tend, et détourne les yeux. Deux lignes, d’une écriture qui tremble beaucoup. « La mer. Qu’est-ce que c’est, déjà ? »

- « Plier la lettre. » → **fin**

### raconte-special

_Effet : retient « raconte-noea », +15 XP._

> Noéa pose sa chope. — Celle-là, je la chanterai ce soir, et je la changerai un peu, pour qu’elle reste vraie. À Coralia, les promesses qu’on se fait sur un quai se chantent toujours au présent.

- « Merci, Noéa. » → **fin**

### raconte-touche

_Effet : retient « raconte-noea », +10 XP._

> Noéa fredonne déjà. — Elle a un air, ton histoire. Tu ne l’entends pas ? Moi si.

- « Merci, Noéa. » → **fin**

### raconte-neutre

_Effet : retient « raconte-noea », +5 XP._

> — Bien raconté. Mais trop d’un bloc : il faut laisser un bout au fond, pour la mer.

- « Merci, Noéa. » → **fin**

### accueil-2

> Noéa essuie une chope en chantant faux, exprès. — La Conque Rieuse ! Ce matin, la marée a laissé un requin-dragon sur le sable du port. Mort, heureusement. Les enfants l’ont pesé : trois Aïo.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Chanter un Récit à la veillée. » → **fin** _(ouvre la veillée « conque »)_
- « Au revoir. » → **fin**

### accueil-3

> Noéa a les yeux rouges. — La Conque Rieuse. Cette nuit, une conque de plus s’est tue, à la Salle. Celle d’une grand-mère du canal. On a chanté pour elle, sans les mots.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Chanter un Récit à la veillée. » → **fin** _(ouvre la veillée « conque »)_
- « Au revoir. » → **fin**

## Le nom de Pim

_Bosquet des Échos_

Commence par : « apres » _(si repère « pim-touche »)_, sinon « nom »

### nom

> Bas sur le tronc, à hauteur d’enfant, un nom tout petit : PIM. Le bois est encore clair autour des lettres, et le dernier trait a dérapé, comme si la main qui gravait avait tremblé.

- **[Mémoire 3]** « Poser la main sur le nom. » → souvenir
- « Le laisser dormir. » → **fin**

### souvenir

_Effet : retient « pim-touche », retient le Récit « L’échelle de Pim », +20 XP._

> Une chaleur monte dans ta paume, et ce n’est pas la tienne. Une fille de quinze ans grave à la lueur d’un cristal, en se mordant la lèvre. Elle pense : « Ils ont réparé leur garde-corps. Le nôtre, c’était une échelle. » Puis le dernier trait lui échappe.

- « Retirer la main. » → **fin**

### apres

> Le nom de Pim, bas sur le tronc. Le bois a gardé un peu de chaleur, à l’endroit où ta main s’est posée.

- « Le laisser dormir. » → **fin**

## Oaïna

_Gardienne de la Salle des Conques_

Commence par : « qui » _(si quête « Ce que la mer rend » en cours)_ _(si repère « euria-don »)_ _(sans repère « oaina-dit »)_, sinon « muette » _(si repère « conque-muette-entendue »)_ _(sans repère « oaina-muette »)_, sinon « accueil »

### accueil

> Une Sélénide aux yeux luminescents, les cheveux en mouvement comme dans l’eau, veille sur les conques. — La Salle des Conques. Les marins y confient ce qu’ils ne veulent pas perdre. Approchez une conque de votre oreille : la mer vous le rendra.

- « « La mer se souvient que » ? » → formule
- _(sans repère « oaina-muette »)_ « Certaines conques se taisent ? » → muette
- _(sans repère « raconte-oaina »)_ « Je voudrais confier une histoire à une conque. » → raconte-neutre 📖 raconter un Récit : chant-anselme → raconte-special ; chansons, morts → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### formule

> — Et nous, moins bien. Oaïna sourit. — Vous connaissez la réponse. Alors vous savez déjà ce qu’il faut savoir de Coralia.

- « Au revoir. » → **fin**

### qui

_Effet : retient « oaina-dit »._

> Oaïna regarde la dame en gris, au fond de la salle, une conque contre l’oreille. — Il y a dix jours, elle a demandé aux Murmureurs de prier la Mère-Abysse : « Rends-moi ce que ma mère a laissé. » La mer a rendu la caisse.

- « Elle aurait dû demander sa mère. » → qui-2
- « Merci, Oaïna. » → **fin**

### qui-2

> — L’Abysse donne exactement ce qu’on lui demande. Elle le sait, maintenant. C’est pour ça qu’elle écoute cette conque depuis dix jours.

- « Merci, Oaïna. » → **fin**

### muette

_Effet : retient « oaina-muette »._

> — Une conque, puis trois, puis neuf, depuis un mois. La maladie des souvenirs est arrivée jusqu’ici. Celle de Basile Chante-Creux s’est tue la première. Il y avait confié le chant qu’on ne chante pas.

- « Le chant qu’on ne chante pas ? » → muette-2
- « Merci, Oaïna. » → **fin**

### muette-2

> — Chaque légende de Marisol en a un : il manque toujours. Basile disait connaître celui de la légende de Naïra. Il l’avait confié à sa conque, pour ne jamais le chanter à terre. La nuit, il est sur le port, devant l’autel.

- « Merci, Oaïna. » → **fin**

### raconte-special

_Effet : retient « raconte-oaina », +15 XP._

> Oaïna ferme ses yeux luminescents. — Un chant pour les morts qu’on n’a pas fini. Chez nous, on le laisserait au fond. Elle approche une conque vide de tes lèvres. — Redis-le là-dedans. Elle le gardera, tant qu’elle pourra.

- « Merci, Oaïna. » → **fin**

### raconte-touche

_Effet : retient « raconte-oaina », +10 XP._

> Oaïna écoute, la main sur une conque. — Elle a frémi. Les conques aiment les histoires qui chantent.

- « Merci, Oaïna. » → **fin**

### raconte-neutre

_Effet : retient « raconte-oaina », +5 XP._

> — Merci. Elle est entrée. Les conques ne trient pas.

- « Merci, Oaïna. » → **fin**

## Odile

_Mère de Céleste_

Commence par : « merci-tombee » _(si quête « Le second cristal » terminée)_ _(si repère « celeste-tombee »)_, sinon « merci » _(si quête « Le second cristal » terminée)_, sinon « attente » _(si quête « Le second cristal » en cours)_, sinon « demande »

### demande

> Une femme en laine crème serre ses mains l’une contre l’autre. — Vous allez vers le Quai ? Ma fille, Céleste. Dix-sept ans. Demain, elle passe le Calme avec un seul cristal, pour entrer aux Ailes Noires. Je ne peux pas le lui interdire. Personne ne peut.

- « Je vais lui parler. » → merci-avant _(lance la quête « Le second cristal », retient « odile-parlee »)_
- « Ce n’est pas mon affaire. » → **fin**

### merci-avant

> — Elle ne vous écoutera pas. Elle n’écoute personne, c’est de mon côté. Parlez-lui quand même. Sur le Quai, près de la passerelle du Perchoir.

- « J’y vais. » → **fin**

### attente

> Odile regarde vers le Quai sans le voir. — Elle part à l’aube. Vous lui avez parlé ?

- « Pas encore. » → **fin**

### merci

> — Elle est rentrée. Elle a dit que c’était facile. Odile rit, et pleure en même temps, ce qui ne lui ressemble pas. — Merci. Je ne sais pas ce que vous lui avez dit, et je ne veux pas le savoir.

- « Au revoir, Odile. » → **fin**

### merci-tombee

> Odile tricote, au marché, comme avant. Elle lève les yeux. — Elle est vivante. Elle ne volera plus. Elle dit que c’est sa faute, et je lui dis que non, et c’est la première fois qu’on se parle depuis des mois. Merci d’avoir essayé.

- « Au revoir, Odile. » → **fin**

## Un oiseleur

_Les Îles-Marchés_

Commence par : « pointe » _(si quête « L’hirondelle de Siffrin » en cours)_ _(sans repère « pointe-libre »)_, sinon « accueil »

### accueil

> Un homme aux doigts bagués, des cages pendues partout. — Des hirondelles du Zénith, toutes fraîches : elles disent le temps. Trente Fers la pièce. Je ne demande pas d’où vous venez, si vous ne me demandez pas d’où elles viennent.

- « Au revoir. » → **fin**

### pointe

> Dans une cage du fond, une hirondelle porte une bague bleue à la patte. — Celle-là ? Trente Fers, comme les autres. Une bague, des bagues, elles en ont toutes.

- **[30 Fers]** « Payer trente Fers. » → rachetee _(−30 Fers)_
- **🎲 Commandement 15** « Rends-la, ou la Gardienne saura d’où elles viennent. » → cede, ✗ → refus
- **🎲 Discrétion 15** « Ouvrir la cage pendant qu’il compte ses Fers. » → volee, ✗ → refus
- « Partir. » → **fin**

### refus

> — Dehors. Et ne revenez qu’avec vos Fers. Il se plante devant la cage, les bras croisés.

- **[30 Fers]** « Payer trente Fers. » → rachetee _(−30 Fers)_
- « Partir. » → **fin**

### rachetee

_Effet : retient « pointe-libre », retient « raid-annonce », +10 XP._

> Il ouvre la cage, et l’hirondelle saute sur ton doigt. Sous le papier de la cage, un mot plié, qu’il n’a pas vu : « Nuit. Quai. Grêle. »

- « Garder le mot. » → **fin**

### cede

_Effet : retient « pointe-libre », retient « raid-annonce », +10 XP._

> Il pâlit, ouvre la cage, et l’hirondelle saute sur ton doigt. — Je ne savais pas qu’elle était à quelqu’un. Sous le papier de la cage, un mot plié tombe : « Nuit. Quai. Grêle. » Il fait semblant de ne pas le voir.

- « Garder le mot. » → **fin**

### volee

_Effet : retient « pointe-libre », retient « raid-annonce », +10 XP._

> Le loquet cède sans bruit. L’hirondelle file dans ta manche. Sous le papier de la cage, un mot plié : « Nuit. Quai. Grêle. » L’oiseleur compte toujours ses Fers.

- « Garder le mot. » → **fin**

## Ondine Perle-Noire

_Doyenne des Plongeurs de Perles_

Commence par : « perle-apportee » _(si quête « La première perle » en cours)_ _(si l’on porte « Une perle blanche »)_, sinon « accueil »

### accueil

> Une vieille Semi-Abyssale, un collier de perles noires, des branchies fines sous les oreilles. — Ondine Perle-Noire, des Plongeurs de Perles. Au nord des Atolls, on ne remonte plus rien : Ferros y a laissé ses eaux noires, et les huîtres y meurent ouvertes.

- _(si quête « La première perle » pas commencée)_ _(sans repère « membre-confrerie-brisants »)_ « Je veux plonger avec vous. » → perle
- _(sans repère « raconte-ondine »)_ « Je vous raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : odon-passe-rive → raconte-special ; familles, morts → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### perle

> — Un plongeur, on le reconnaît à ce qu’il remonte. À marée basse, devant le Grand Port, le banc d’huîtres se découvre à moitié. Va. Et ne remonte pas avec n’importe quoi.

- « J’y vais. » → **fin** _(lance la quête « La première perle »)_
- « Plus tard. » → **fin**

### perle-apportee

_Effet : reprend 1 × « Une perle blanche », termine la quête « La première perle », retient « membre-plongeurs-perles », +40 XP._

> Ondine fait rouler la perle dans sa paume. — Ronde. Propre. Pas des eaux noires. Elle te passe au cou un fil de perles grises. — Apnée : le premier rang. On y meurt rarement.

- « Merci, Ondine. » → **fin**

### raconte-special

_Effet : retient « raconte-ondine », +15 XP._

> Ondine touche ses perles noires, une à une. — Un passeur qui cochait les enfants. Nous, on compte les plongeurs qui remontent. C’est le même carnet. Personne ne veut le tenir, et quelqu’un doit.

- « Merci, Ondine. » → **fin**

### raconte-touche

_Effet : retient « raconte-ondine », +10 XP._

> Ondine sourit, ce qui ne lui arrive pas souvent. — Celle-là, je la raconterai aux novices, avant leur première plongée.

- « Merci, Ondine. » → **fin**

### raconte-neutre

_Effet : retient « raconte-ondine », +5 XP._

> — Bien. Courte, et sans mensonge. Ça me suffit.

- « Merci, Ondine. » → **fin**

## Les Oskarsen

_Réfugiés, devant la Porte de Glace_

Commence par : « dehors » _(si quête « Ceux qu’on laisse dehors » pas commencée)_, sinon « attend »

### dehors

_Effet : lance la quête « Ceux qu’on laisse dehors », retient « oskarsen-vus »._

> Une femme, un enfant contre elle, sous trois couvertures, adossés à la glace près de la Porte. Ils ne tremblent plus, ce qui est mauvais signe. — Les Oskarsen. On vient du sud, de ce qui fondait. La loi nous a donné une nuit au tunnel chaud. Il y a trois nuits.

- « Je vais parler pour vous au Conseil. » → **fin**
- _(sans repère « cache-rate »)_ **🎲 Discrétion 18** « Vous cacher au Foyer, chez Ulga. » → cache, ✗ → renvoyes _(termine la quête « Ceux qu’on laisse dehors », retient « fin-laisses-dehors-ulga », +60 XP, retient « oskarsen-reglee »)_
- « Vous donner de quoi repartir vers le sud. » → sud-q
- « Je reviendrai. » → **fin**

### attend

> Les Oskarsen n’ont pas bougé. L’enfant dort, ou fait semblant. La mère te regarde arriver sans espoir, ce qui lui épargne la déception. — Alors ?

- « Je vais parler pour vous au Conseil. » → **fin**
- _(sans repère « cache-rate »)_ **🎲 Discrétion 18** « Vous cacher au Foyer, chez Ulga. » → cache, ✗ → renvoyes _(termine la quête « Ceux qu’on laisse dehors », retient « fin-laisses-dehors-ulga », +60 XP, retient « oskarsen-reglee »)_
- « Vous donner de quoi repartir vers le sud. » → sud-q
- « Je reviendrai. » → **fin**

### sud-q

> — Le sud ? Neuf jours de traîneau jusqu’à ce qui reste de chez nous. Sans manteau pour le petit, on n’en fera pas trois.

- _(si l’on porte « Manteau de fourrure de Khrysos »)_ **[30 Fers]** « Mon manteau pour l’enfant, et trente Fers. » → sud _(termine la quête « Ceux qu’on laisse dehors », retient « fin-laisses-dehors-sud », +40 XP, reprend 1 × « Manteau de fourrure de Khrysos », −30 Fers, retient « oskarsen-reglee »)_
- « Je n’ai rien à vous donner. » → attend

### cache

> La nuit, par le tunnel de service, derrière les traîneaux. Ulga ouvre sa porte sans poser de question, et la referme. Au Foyer, il y a un mur chaud, et derrière le mur chaud, une remise. La loi de 2995 ne sait pas qu’elle existe.

- « Repartir. » → **fin**

### renvoyes

_Effet : retient « cache-rate » pour 2 jours, retient « surpris-portes »._

> La garde des Portes vous voit au coin du tunnel. Elle ne crie pas. Elle raccompagne les Oskarsen à la Porte, et toi avec. — Pas comme ça. La prochaine fois, je devrai le noter.

- « Attendre. » → **fin**

### sud

> La mère prend le manteau sans te remercier, et le boutonne sur l’enfant. Les trente Fers, elle les compte. Ils partent vers le sud, sur la piste des traîneaux. Tu ne sauras jamais s’ils sont arrivés.

- « Les regarder partir. » → **fin**

## Oss’Amar

_Quatre-vingts ans, en deuil_

Commence par : « choix » _(si quête « Celui qui voulait s’arrêter » en cours)_, sinon « apres » _(si quête « Celui qui voulait s’arrêter » terminée)_, sinon « accueil »

### accueil

_Effet : lance la quête « Celui qui voulait s’arrêter », retient « arreter-commence »._

> Un vieil homme en manteau de deuil gris, du henné noir aux joues, assis dans le sable. Il ne se lève pas quand on passe. — C’est ici qu’elle est morte. Il y a dix-huit mois, à cette halte. Demain, la Marche repart. Moi, je reste.

- « Si tu restes, tu meurs. » → meurs
- « Personne ne peut t’en empêcher ? » → tabou

### meurs

> — Je sais. Qui s’arrête meurt. C’est même pour ça que je m’arrête.

- « Personne ne peut t’en empêcher ? » → tabou
- « Je reviendrai. » → **fin**

### tabou

> — S’arrêter, c’est un tabou. Mais personne n’empêche un vieux de s’asseoir. On le compte, le lendemain matin, c’est tout.

- « Je reviendrai. » → **fin**

### choix

> Oss’Amar regarde la piste, devant, puis le jalon de la halte, derrière. — Tu reviens me faire marcher, toi aussi ?

- **🎲 Diplomatie 16** « Marche encore. Pour elle. » → marche, ✗ → non _(termine la quête « Celui qui voulait s’arrêter », retient « fin-arreter-marche », +40 XP)_
- _(si repère « nes-oss »)_ « Longue-Ombre te portera. » → porte _(termine la quête « Celui qui voulait s’arrêter », retient « fin-arreter-porte », +40 XP)_
- « Reste, si c’est ton choix. » → reste _(termine la quête « Celui qui voulait s’arrêter », retient « fin-arreter-reste », +20 XP)_
- « Pas encore. » → **fin**

### non

> — Tu ne l’as pas connue. Elle, elle m’aurait laissé m’asseoir.

- _(si repère « nes-oss »)_ « Longue-Ombre te portera. » → porte _(termine la quête « Celui qui voulait s’arrêter », retient « fin-arreter-porte », +40 XP)_
- « Reste, si c’est ton choix. » → reste _(termine la quête « Celui qui voulait s’arrêter », retient « fin-arreter-reste », +20 XP)_
- « Je reviendrai. » → **fin**

### marche

> Il se lève, lentement, en s’appuyant sur ton épaule. — Pour elle, alors. Elle détestait que je m’assoie.

- « Marcher avec lui. » → **fin**

### porte

> Le soir, Nes’Mira et toi le hissez sur la carapace. Il s’assoit face à l’arrière, pour voir la halte s’éloigner le plus longtemps possible.

- « Le laisser regarder. » → **fin**

### reste

> Quand la Marche repart, il reste assis près du jalon, les mains sur les genoux. Le lendemain matin, la Gardienne compte une ration de moins. Elle ne dit pas son nom.

- « Partir. » → **fin**

### apres

> La place où Oss’Amar s’asseyait est vide. Le sable n’y garde plus rien.

- « Passer. » → **fin**

## Ossiane Vire-Nuée

_Capitaine de la Compagnie Vire-Nuée_

Commence par : « raid-perdu » _(si quête « Le convoi de pain » en cours)_ _(si repère « raid-laisse »)_, sinon « raid-merci » _(si quête « Le convoi de pain » en cours)_ _(si repère « raid-regle »)_ _(si repère « membre-ailes-noires »)_, sinon « raid-quart » _(si quête « Le convoi de pain » en cours)_ _(si repère « raid-negocie »)_, sinon « raid-sauve » _(si quête « Le convoi de pain » en cours)_ _(si repère « raid-regle »)_, sinon « prete » _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « ossiane-accepte »)_, sinon « accueil »

### accueil

> Une Aérienne en veste bleu nuit relève ses lunettes de vent. — Ossiane Vire-Nuée, Compagnie Vire-Nuée. Routes déclarées, deux cristaux par machine, et personne ne tombe. Vous voyagez ?

- « Deux cristaux, toujours ? » → cristaux
- _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « tiroir-vu »)_ _(sans repère « ossiane-refus »)_ « Je dois descendre sous les nuages. » → bas
- _(si repère « raid-annonce »)_ _(si quête « Le convoi de pain » pas commencée)_ « Les pirates frappent votre convoi cette nuit. » → raid
- « Au revoir. » → **fin**

### cristaux

> — Toujours. La septième voile le dit, et la Charte ne l’impose pas. Alors c’est nous qui l’imposons, à nos pilotes. Les Ailes Noires appellent ça une entrave. Moi, j’appelle ça rentrer le soir.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### bas

> Ossiane te regarde longtemps. — Le Bas n’est pas une route déclarée. Si je descends et que je ne remonte pas, ce n’est pas moi qui paie : ce sont tous ceux qui croyaient au contrat.

- **🎲 Diplomatie 15** « Une fois. Pour six enfants dont personne ne se souvient. » → accepte, ✗ → refus
- « Je comprends. » → **fin**

### accepte

_Effet : retient « ossiane-accepte »._

> Elle remet ses lunettes. — Une fois. Deux cristaux, vous ne touchez à rien à bord, et nous remontons avant la nuit. Je ne le fais pas pour vous. Six noms, ça fait six familles qui n’ont jamais su.

- « Partir maintenant. » → **fin** _(retient « descente-compagnie », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Pas tout de suite. » → **fin**

### refus

_Effet : retient « ossiane-refus »._

> — Non. Si je romps un contrat pour une bonne raison, demain quelqu’un le rompra pour une mauvaise. Allez voir le Perchoir. Ils ne demandent rien, eux. C’est bien leur problème.

- « Merci quand même. » → **fin**

### prete

> — On part quand vous voulez. Deux cristaux, et retour avant la nuit.

- « Partir maintenant. » → **fin** _(retient « descente-compagnie », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Pas encore. » → **fin**

### raid

> Ossiane pose ses lunettes. — Le convoi de pain. Deux tonnes de farine d’en bas, pour tout le Marché. Si vous dites vrai, je veux quelqu’un sur le quai cette nuit, en plus de mes pilotes. Si vous êtes encore là demain, vous êtes de la Compagnie.

- « J’y serai. » → **fin** _(lance la quête « Le convoi de pain », retient « convoi-attendu »)_
- « Pas moi. » → **fin**

### raid-sauve

_Effet : retient « membre-compagnie-vire-nuee », +40 XP, termine la quête « Le convoi de pain », retient « fin-convoi-pain-sauve »._

> — La farine est là, et personne de chez moi n’est blessé. Ossiane te tend une broche de cuivre : une plume dans un cercle. — Passager de la Compagnie Vire-Nuée. C’est le premier rang. Les autres se méritent.

- « La prendre. » → **fin**

### raid-quart

_Effet : retient « membre-compagnie-vire-nuee », +30 XP, termine la quête « Le convoi de pain », retient « fin-convoi-pain-quart »._

> — Un quart. Ossiane fait le compte, les lèvres serrées. — C’est un quart de trop, et personne n’est mort. Je ne sais pas quoi en penser. Elle te tend quand même la broche. — Passager. Ne refaites pas ça.

- « La prendre. » → **fin**

### raid-merci

_Effet : +40 XP, termine la quête « Le convoi de pain », retient « fin-convoi-pain-sauve »._

> — La farine est là. Ossiane regarde la plume noire à ton épaule. — Une Aile Noire qui garde un convoi de la Compagnie. On racontera ça au Nid, et personne ne le croira. Merci.

- « Au revoir. » → **fin**

### raid-perdu

_Effet : +10 XP, termine la quête « Le convoi de pain », retient « fin-convoi-pain-perdu »._

> — Tout ? Ossiane ne crie pas. — Alors vous n’êtes pas de la Compagnie. Le pain coûtera le double au Marché, et ce sera votre faute autant que la leur.

- « Partir. » → **fin**

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

## Les pilleurs des sables

_Hors de la Marche_

Commence par : « barre »

### barre

> Trois hommes au chèche noir, assis dans le col entre les dunes, des pelles en travers des genoux. — Demi-tour. On nous paie pour que personne n’approche du jalon. Quelqu’un est déjà là-bas, et elle paie mieux que toi.

- _(si l’on porte « L’eau de l’Année Errante »)_ « Vous avez soif ? » → eau _(reprend 1 × « L’eau de l’Année Errante », retient « pilleurs-partis », retient « pilleurs-abreuves »)_
- **🎲 Commandement 16** « Partez. Maintenant. » → partis, ✗ → combat
- **🎲 Discrétion 16** « (Passer par la crête, sans qu’ils te voient.) » → contournes, ✗ → combat
- « (Les attaquer.) » → **fin** _(lance le combat « pilleurs-desert »)_

### eau

> Ils boivent ta gourde à trois, jusqu’au fond, sans un merci. — On nous a payés en Fers. Pas en eau. — Ils ramassent leurs pelles et repartent vers la piste, en titubant un peu.

- « Continuer vers le jalon. » → **fin**

### partis

_Effet : retient « pilleurs-partis »._

> Ils se regardent. Le plus vieux crache dans le sable. — Elle ne nous paie pas assez pour mourir. — Ils s’en vont vers la piste, sans se retourner.

- « Continuer vers le jalon. » → **fin**

### contournes

_Effet : retient « pilleurs-contournes »._

> Tu passes par la crête, à plat ventre, le sable dans la bouche. En bas, ils se disputent la dernière gorgée de leur outre. Personne ne lève les yeux.

- « Continuer vers le jalon. » → **fin**

### combat

> — Tu l’auras voulu. — Ils se lèvent, les pelles et les lames à la main.

- « Se défendre. » → **fin** _(lance le combat « pilleurs-desert »)_

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

## Les traces de la Marche

_Hors de la Marche_

Commence par : « rattraper »

### rattraper

> Les traces de la Marche, larges de plusieurs kilomètres, filent vers l’est. Elle est déjà loin : on ne revient pas, c’est à toi de la rejoindre. Le sable se souvient de chaque pas ; encore faut-il savoir les lire.

- **🎲 Survie 16** « Suivre les traces. » → rejointe, ✗ → perdu
- _(si repère « lien-longue-ombre »)_ « Écouter le grondement de Longue-Ombre. » → rejointe
- _(si repère « nid-ami »)_ « Siffler, comme Kéo’Sa te l’a appris. » → taxi
- « Pas encore. » → **fin**

### rejointe

_Effet : fait passer 1 moment._

> Tu marches dans les traces jusqu’au milieu de l’après-midi. D’abord la poussière, puis les chariots, puis les douze Léviathans, qui avancent au pas comme si de rien n’était.

- « Rejoindre la Marche. » → **fin** _(mène à « Marche-Mère — le Camp »)_

### perdu

_Effet : −6 PV, fait passer 3 moments._

> Tu suis des traces qui ne sont pas les bonnes, jusqu’au soir. La nuit tombe, froide, et tu la passes dans le creux d’une dune. Au matin, tu retrouves la Marche de loin, à la poussière qu’elle lève.

- « La rejoindre, enfin. » → **fin** _(mène à « Marche-Mère — le Camp »)_

### taxi

> Un dragon des sables se pose dans un nuage de poussière, une femme des Liens-Dragons sur le dos. — Kéo’Sa m’a dit qu’un étranger sifflait faux, quelque part au sud. Monte.

- « Monter. » → **fin** _(mène à « Marche-Mère — le Camp »)_

## Le Caveau des cristaux scellés

_Le Niveau Douze_

Commence par : « ferme »

### ferme

> Une porte de glace épaisse, cerclée de fer, sans poignée. Une serrure à trois gorges, et le sceau du Collège des 9 Miroirs, intact. Rien n’est écrit dessus. À Khrysos, ce qui n’est pas écrit est souvent le mieux gardé.

- _(sans repère « caveau-rate »)_ **🎲 Artisanat 18** « Crocheter la serrure. » → ouvert, ✗ → rate
- _(sans repère « caveau-bluff-rate »)_ **🎲 Subterfuge 18** « Dire au gardien que le Collège t’envoie chercher un cristal. » → bluff, ✗ → bluff-rate
- _(sans repère « caveau-vol-rate »)_ **🎲 Discrétion 18** « Prendre la clé à la ceinture du gardien, pendant qu’il somnole. » → cle, ✗ → vol-rate
- « S’éloigner. » → **fin**

### ouvert

_Effet : retient « caveau-ouvert », retient « sceau-caveau-brise »._

> La première gorge cède, puis la deuxième. La troisième résiste, gelée ; tu la réchauffes de ton souffle, longtemps. Le sceau du Collège se fend sans bruit. La porte s’ouvre sur un froid plus vieux que celui du couloir.

- « Entrer. » → **fin** _(mène à « Khrysos — le Caveau des cristaux scellés »)_

### rate

_Effet : retient « caveau-rate » pour 1 jours._

> La troisième gorge est prise dans la glace. Ton crochet casse net à l’intérieur. Il faudra en tailler un autre, et attendre que le fer se réchauffe : demain.

- « S’éloigner. » → **fin**

### bluff

_Effet : retient « caveau-ouvert »._

> Le gardien fronce les sourcils, cherche dans sa mémoire un ordre du Collège qu’il aurait oublié, et finit par en trouver un. — Ils ne préviennent jamais. Il sort une clé de glace noire, ouvre, et retourne à sa lampe.

- « Entrer. » → **fin** _(mène à « Khrysos — le Caveau des cristaux scellés »)_

### bluff-rate

_Effet : retient « caveau-bluff-rate »._

> — Le Collège n’envoie plus personne au Caveau, depuis qu’il l’a scellé. Il y fait descendre des cristaux, et personne ne remonte avec. Le gardien se tait, comprend ce qu’il vient de dire, et ne te regarde plus.

- « S’éloigner. » → **fin**

### cle

_Effet : retient « caveau-ouvert »._

> La clé pend à une lanière de cuir, contre la robe. Tu la décroches entre deux souffles du gardien, tu ouvres, et tu la remets. Elle est restée tiède dans ta main : la seule chose tiède du Niveau Douze.

- « Entrer. » → **fin** _(mène à « Khrysos — le Caveau des cristaux scellés »)_

### vol-rate

_Effet : retient « caveau-vol-rate »._

> La lanière résiste. Le gardien ouvre les yeux, voit ta main, et la regarde sans colère. — Personne n’entre là. Même pas moi. Il serre la clé dans son poing, et ne la lâchera plus.

- « S’éloigner. » → **fin**

## L’Entrepôt des douanes

_Le Grand Port_

Commence par : « avis » _(si quête « Ce que la mer rend » pas commencée)_, sinon « porte »

### avis

_Effet : lance la quête « Ce que la mer rend », retient « mer-rend-commencee »._

> Une porte épaisse, au sceau de l’Amirauté. Un avis cloué, que le sel commence à manger : « Saisie : une caisse de plomb, rendue par la mer. Suspicion de déversement (voir : Cargo Noir). Accès sur ordre de l’Amirauté. »

- « Une caisse de plomb. » → porte

### porte

> La porte de l’Entrepôt des douanes, fermée à clé. La capitaine des douanes la surveille du coin de l’œil, à quelques pas.

- _(si l’on porte « Un ordre de l’Amirauté »)_ « Montrer l’ordre de l’Amirauté. » → ouverte
- « Partir. » → **fin**

### ouverte

_Effet : retient « entrepot-ouvert »._

> Le douanier de garde lit l’ordre deux fois, et ouvre.

- « Entrer. » → **fin** _(mène à « Coralia — l’Entrepôt des douanes »)_

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

## La soute d’un dirigeable gris

_Le Quai des Dirigeables_

Commence par : « verrouillee »

### verrouillee

> Un dirigeable gris, sans pavillon, au bout du quai. Sous la nacelle, la trappe de la soute est fermée par un cadenas neuf. Un homme d’équipage dort sur un rouleau de cordes.

- **🎲 Artisanat 14** « Crocheter le cadenas. » → ouverte, ✗ → echec
- _(la nuit)_ _(sans repère « soute-guettee »)_ **🎲 Discrétion 14** « Attendre la nuit, et passer derrière lui. » → ouverte, ✗ → reveil
- « Laisser la soute. » → **fin**

### echec

> Le cadenas résiste, et l’homme d’équipage remue dans son sommeil.

- « Réessayer. » → verrouillee
- « Partir. » → **fin**

### reveil

_Effet : retient « soute-guettee » pour 1 jours._

> L’homme ouvre un œil. — La soute est louée. Repasse quand elle ne le sera plus. Il ne se rendort pas.

- « Partir. » → **fin**

### ouverte

_Effet : retient « soute-ouverte »._

> La trappe s’ouvre sur une odeur de toile neuve et de goudron.

- « Entrer. » → **fin** _(mène à « Aetherhaven — la soute d’un dirigeable »)_
- « Plus tard. » → **fin**

## Le portier de nuit

_Gardien de la Bibliothèque, la nuit_

Commence par : « accueil »

### accueil

> Un homme à la lanterne sourde. — La Bibliothèque dort, et les livres aussi. Revenez quand le Conservateur sera au guichet.

- _(si repère « dedicace-lue »)_ _(sans repère « portier-aveu »)_ « Qui écrit « Mariza » dans la marge du lutrin ? » → aveu
- « Au revoir. » → **fin**

### aveu

> Le portier baisse sa lanterne. — Ma mère s’appelait Mariza. Mon père lui a écrit ces poèmes, et le copiste s’est trompé de nom. Il est interdit de corriger une dédicace d’origine : je l’écris quand même, à la troisième cloche.

- « Et le matin, quelqu’un l’efface. » → aveu-2

### aveu-2

_Effet : retient « portier-aveu », retient le Récit « La dédicace », +20 XP._

> — Un Chroniqueur, toujours le même. Il efface au crayon, jamais à l’encre, et toujours en dernier, après ses autres pages. Nous ne nous sommes jamais parlé. Chacun fait son métier.

- « Je n’ai rien vu. » → **fin**
- « Bonne ronde. » → **fin**

## La Prêtresse de l’Hiver Éveillé

_Le Temple de l’Hiver Éveillé_

Commence par : « accueil »

### accueil

> Une prêtresse en étole bleue, devant un cristal qui ne rend rien : on le dit vide. — La Voie de l’Hiver Éveillé. Le froid n’endort pas, il garde. Nörvath est le principe de la mémoire, et chaque cristal en porte un éclat.

- « Et ce cristal vide ? » → vide
- « Au revoir. » → **fin**

### vide

> — Il ne l’est pas : on ne lui a encore rien confié. C’est le seul cristal de Khrysos qui puisse encore tout recevoir. Certains viennent lui dire ce qu’ils n’ont dit à personne. Il ne le rendra qu’à qui saura le demander.

- _(sans repère « raconte-pretresse-hiver »)_ « Je te raconte une histoire ? » → raconte-neutre 📖 raconter un Récit : chant-qu-on-ne-chante-pas → raconte-special ; morts, mysteres → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### raconte-special

_Effet : retient « raconte-pretresse-hiver », +15 XP._

> La prêtresse se tait longtemps. — Une conque qui se tait. Ici, ce sont les cristaux, maintenant. Ce qui ne pouvait pas oublier commence à oublier. Le froid ne garde plus.

- « Merci. » → **fin**

### raconte-touche

_Effet : retient « raconte-pretresse-hiver », +10 XP._

> — Le cristal vide l’a entendue, elle aussi. Il ne la rendra qu’à qui saura la demander. Merci de la lui avoir confiée.

- « Merci. » → **fin**

### raconte-neutre

_Effet : retient « raconte-pretresse-hiver », +5 XP._

> — Merci. Le cristal vide n’en retient rien. Il attendra une autre histoire.

- « Merci. » → **fin**

## Une prise sans nom

_Les cryptes, section neuf_

Commence par : « prise »

### prise

> Un cristal de crypte, pareil aux autres. Sous lui, à hauteur de main, la glace est lisse : un numéro seul, et aucun nom. Dedans, un elfe maigre, les yeux ouverts, les mains vides. On l’a pris vivant, le lendemain de son procès.

- « Poser la main sur le cristal. » → main
- « S’éloigner. » → **fin**

### main

> Le cristal est froid, comme les autres. Rien ne bouge derrière. Tu ne sauras pas si l’homme te voit ; personne, à Khrysos, ne le sait, et c’est pour cela qu’on descend à deux.

- « S’éloigner. » → **fin**

## Le Puits d’Ascension

_Khrysos_

Commence par : « portes » _(à « Khrysos — les Portes de Glace »)_, sinon « galeries » _(à « Khrysos — les Galeries Chaudes »)_, sinon « royal » _(à « Khrysos — le Niveau Royal »)_, sinon « douze »

### portes

> La cage du Puits d’Ascension, du cuivre et des câbles ; la vapeur siffle par en dessous. La machiniste, une clé à molette à la main, attend que tu choisisses. — Les Portes. On monte ou on descend ?

- « Les Galeries Chaudes. » → **fin** _(mène à « Khrysos — les Galeries Chaudes »)_
- « Le Niveau Royal. » → **fin** _(mène à « Khrysos — le Niveau Royal »)_
- « Le Niveau Douze. » → **fin** _(mène à « Khrysos — le Niveau Douze »)_
- « Rester ici. » → **fin**

### galeries

> La cage du Puits d’Ascension, du cuivre et des câbles ; la vapeur siffle par en dessous. La machiniste, une clé à molette à la main, attend que tu choisisses. — Les Galeries. Où ça ?

- « Les Portes de Glace. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_
- « Le Niveau Royal. » → **fin** _(mène à « Khrysos — le Niveau Royal »)_
- « Le Niveau Douze. » → **fin** _(mène à « Khrysos — le Niveau Douze »)_
- « Rester ici. » → **fin**

### royal

> La cage du Puits d’Ascension, du cuivre et des câbles ; la vapeur siffle par en dessous. La machiniste, une clé à molette à la main, attend que tu choisisses. — Le Royal. On redescend ?

- « Les Portes de Glace. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_
- « Les Galeries Chaudes. » → **fin** _(mène à « Khrysos — les Galeries Chaudes »)_
- « Le Niveau Douze. » → **fin** _(mène à « Khrysos — le Niveau Douze »)_
- « Rester ici. » → **fin**

### douze

> La cage du Puits d’Ascension, du cuivre et des câbles ; la vapeur siffle par en dessous. La machiniste, une clé à molette à la main, attend que tu choisisses. — Le Douze. Il fait plus chaud qu’en haut, et personne n’aime y rester. On remonte ?

- « Les Portes de Glace. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_
- « Les Galeries Chaudes. » → **fin** _(mène à « Khrysos — les Galeries Chaudes »)_
- « Le Niveau Royal. » → **fin** _(mène à « Khrysos — le Niveau Royal »)_
- « Rester ici. » → **fin**

## Le quai du train du Nord

_Les Portes de Glace_

Commence par : « quai »

### quai

> Le quai du train du Nord, au fond d’une Porte de Glace. Un employé de Ferros, emmitouflé jusqu’aux yeux, vend les billets du retour. — Ironheart : un jour. Le train remonte chaque matin.

- _(sans repère « rail-travailleurs »)_ **[45 Fers]** « Prendre un billet pour Ironheart. » → retour _(−45 Fers)_
- _(si repère « rail-travailleurs »)_ **[22 Fers]** « Prendre un billet : les cheminots te font un prix. » → retour _(−22 Fers)_
- « Pas encore. » → **fin**

### retour

> Le train remonte la longue pente, sort de la glace dans un éblouissement, et file vers le sud. Au soir, les cheminées d’Ironheart.

- « Descendre. » → **fin** _(fait passer 4 moments, mène à « Ironheart — Les Forges-Basses »)_

## Ravel Sans-Fil

_Des Ailes Noires_

Commence par : « course-close » _(si quête « La course des îlots » pas commencée)_ _(si repère « membre-compagnie-vire-nuee »)_ _(si repère « ravel-course-demandee »)_, sinon « carnet » _(si quête « Les onze états » en cours)_ _(sans repère « onze-carnet »)_ _(sans repère « onze-carnet-refus »)_, sinon « prete » _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « ravel-paye »)_, sinon « accueil »

### accueil

> Un homme en cuir noir, un seul cristal au cou, les pieds sur la table. — Le Perchoir. On vole sans contrat, sans second cristal, sans rien demander à personne. Si tu viens nous dire que c’est dangereux, la porte est derrière toi.

- « Pourquoi un seul cristal ? » → un
- _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « tiroir-vu »)_ « Je dois descendre sous les nuages. » → bas
- _(si quête « La course des îlots » pas commencée)_ _(sans repère « course-perdue »)_ _(sans repère « membre-compagnie-vire-nuee »)_ « Je veux entrer aux Ailes Noires. » → course
- « Au revoir. » → **fin**

### un

> — Parce que le second, c’est quelqu’un d’autre qui te dit comment voler. « Rien ne doit entraver le vent » : première phrase de la Charte. Aerys l’a écrite. Elle savait ce qu’elle disait.

- « Elle a aussi écrit la septième voile. » → aerys
- « Au revoir. » → **fin**

### aerys

> Ravel sourit, sans gaieté. — Et elle ne l’a jamais imposée. Tu vois ? Même elle.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### bas

> — En bas ? Tu es la deuxième cette semaine. La dame en gris a payé deux des miens, hier. Soixante Fers, et je t’emmène moi-même. Un cristal, une machine légère, et tu me dis quand on entre dans le Calme. Si tu sais l’entendre.

- **[60 Fers]** « Soixante Fers. Allons-y. » → **fin** _(−60 Fers, retient « ravel-paye », retient « descente-ailes », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- _(si repère « membre-ailes-noires »)_ « Je suis une Plume. Le vent paie. » → bas-membre
- « Que voulait la dame en gris ? » → edda
- « Pas maintenant. » → **fin**

### edda

_Effet : retient « soute-connue »._

> — Descendre, remonter, et qu’on ne pose pas de questions. On n’en pose jamais. Elle avait un second cristal dans ses bagages ; mes pilotes ont refusé de le gréer. Il dort dans la soute de son dirigeable, au bout du quai.

- **[60 Fers]** « Soixante Fers. Allons-y. » → **fin** _(−60 Fers, retient « ravel-paye », retient « descente-ailes », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Pas maintenant. » → **fin**

### prete

> Ravel décroise les pieds. — On redescend ? La machine est dehors. Toujours un seul cristal.

- « Partir maintenant. » → **fin** _(retient « descente-ailes », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Pas encore. » → **fin**

### carnet

> — Le carnet ? Pour qu’un aéromancien en fasse une loi ? Ce carnet, ce sont nos morts, et ceux qui sont revenus. Il ne sort pas d’ici.

- **🎲 Diplomatie 15** « Personne n’imposera rien. Évrard veut que la bonne vitesse circule, c’est tout. » → carnet-prete, ✗ → carnet-non
- _(si repère « membre-ailes-noires »)_ « Je suis des vôtres. Prête-le-moi. » → carnet-prete
- « Autre chose. » → accueil
- « Tant pis. » → **fin**

### carnet-prete

_Effet : donne 1 × « Le carnet du Perchoir », retient « onze-carnet », +10 XP._

> Ravel pousse le carnet sur la table, du bout de sa botte. — Qu’il le lise. Qu’il le rende. Et s’il en tire une règle, qu’il ne vienne pas me l’apprendre.

- « Merci, Ravel. » → **fin**

### carnet-non

_Effet : retient « onze-carnet-refus »._

> — Non. Et ne reviens pas me le demander.

- « Partir. » → **fin**

### course

_Effet : retient « ravel-course-demandee »._

> Ravel se lève, pour la première fois. — Les Ailes Noires ne prennent personne. Le vent prend qui il veut. Une course : du Perchoir au Nid des Nuées, d’îlot en îlot, sans les ponts. Arrive avant moi, et tu as une plume.

- « Courir. » → saut-1 _(lance la quête « La course des îlots »)_
- « Pas aujourd’hui. » → **fin**

### saut-1

> Vous partez ensemble. Le premier vide arrive vite : trois pas de nuages entre le Perchoir et le Quai. Ravel saute sans regarder.

- **🎲 Athlétisme 15** « Sauter. » → saut-2, ✗ → course-perdue

### saut-2

> Tu retombes sur le Quai en roulant. Ravel est déjà au pont, qu’il ne prend pas : il saute par-dessus la corde, vers les Îles-Marchés. Le vide est plus large, ici.

- **🎲 Athlétisme 15** « Sauter encore. » → course-gagnee, ✗ → course-perdue

### course-gagnee

_Effet : termine la quête « La course des îlots », retient « membre-ailes-noires », +40 XP._

> Tu touches l’îlot du Nid une seconde avant lui. Ravel s’assoit dans l’herbe pâle et rit, essoufflé. Il détache une plume noire de sa manche et te la tend. — Plume des Ailes Noires. Rien ne doit entraver le vent : surtout pas toi.

- « La prendre. » → **fin**

### course-perdue

_Effet : −3 PV, retient « course-perdue » pour 1 jours._

> Ton pied manque le bord. Tu te rattrapes à une corde de pont, et tu remontes, les paumes en sang, pendant que Ravel attend de l’autre côté sans rien dire. — Demain, si tu veux. Le vent est patient.

- « Demain. » → **fin**

### course-close

> Ravel regarde la broche de cuivre à ton col. — Vire-Nuée. On ne court pas avec les gens à contrat. Tu peux boire, si tu veux. Le vin n’a pas de contrat.

- « Au revoir. » → **fin**

### bas-membre

> — Une Plume qui veut descendre ? Ravel décroise les pieds. — Pour toi, c’est le vent qui paie. La machine est dehors.

- « Partir maintenant. » → **fin** _(retient « ravel-paye », retient « descente-ailes », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Pas encore. » → **fin**

## Sous le pont

_Quelque chose brille dans l’eau_

Commence par : « regard »

### regard

> Sous l’arche du pont, entre deux pierres du lit, quelque chose renvoie la lumière : du métal, une boîte peut-être. L’eau n’est pas profonde, mais le courant est vif et le fond, couvert de mousse.

- _(sans repère « reflet-glisse »)_ **🎲 Athlétisme 11** « Descendre dans l’eau et l’attraper. » → boite, ✗ → glisse
- « Laisser ça au ruisseau. » → **fin**

### glisse

_Effet : −2 PV, retient « reflet-glisse » pour 1 jours._

> L’eau te saisit jusqu’aux genoux, glacée. Ton pied part sur la mousse, tu tombes assis·e dans le courant, et la boîte reste où elle est. Demain, l’eau sera peut-être plus basse.

- « Remonter, trempé·e. » → **fin**

### boite

_Effet : donne 1 × « La boîte du passeur », retient « boite-odon-prise », +10 XP._

> Ta main se referme sur une boîte de fer-blanc, bosselée, fermée d’une ficelle. Dedans, au sec dans une toile cirée, un carnet : des dates, des prénoms d’enfants, et une croix devant chacun. La dernière page s’arrête au milieu d’un nom.

- « Garder la boîte. » → **fin**

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

## Le registre des Portes

_Les Portes de Glace_

Commence par : « nuit » _(si quête « Une lacune à signer » en cours)_, sinon « registre »

### registre

> Le registre des Portes : un cristal sur un socle, près de la garde. Il rend qui entre, qui sort, et qui est renvoyé, nuit après nuit, mot pour mot.

- « Passer. » → **fin**

### nuit

_Effet : retient « face-portes-vue »._

> Tu fais rendre les nuits, une à une. La veille, intacte ; le lendemain, intact. Entre les deux, rien : une face manque. Sur le socle, une poussière de cristal que personne n’a balayée.

- « Regarder la garde. » → **fin**

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

## L’échelle aux rubans

_Grande Nacelle_

Commence par : « regard »

### regard

_Effet : retient « rubans-vus »._

> Au bord du marché, une échelle de corde descend vers les étages des Jeunes-Pousses. Des dizaines de rubans sont noués à ses barreaux, délavés ou neufs. Sur le plus récent, quelqu’un a brodé trois lettres : PIM.

- _(sans repère « ruban-noue »)_ « Nouer un ruban, toi aussi. » → noue
- « Laisser l’échelle. » → **fin**

### noue

_Effet : retient « ruban-noue », +5 XP._

> Tu n’as qu’un bout de cordelette : tu le noues au barreau du haut. En bas, une Jeune-Pousse qui montait s’arrête, te regarde un moment, puis reprend sa montée sans rien dire.

- « Laisser l’échelle. » → **fin**

## Saal’Ema

_Doyenne de son clan_

Commence par : « nombres » _(si quête « La halte muette » en cours)_ _(sans repère « muette-saal »)_, sinon « dragonnet » _(si quête « Le dragonnet » en cours)_ _(sans repère « saal-dragonnet »)_, sinon « accueil »

### accueil

> Une très vieille femme, un bâton de route en travers des genoux. — Assieds-toi, petit pied. Sur Longue-Ombre, on ne marche plus : on est porté. J’ai marché quatre-vingts ans. Maintenant, la bête marche pour moi.

- « Parle-moi de Longue-Ombre. » → bete
- « Ça ne te manque pas, de marcher ? » → marcher
- _(sans repère « raconte-saal-ema »)_ « Je vous raconte une histoire d’ailleurs ? » → raconte-neutre 📖 raconter un Récit : odon-passe-rive → raconte-special ; familles, morts → raconte-touche ; autres → raconte-neutre
- « Je te laisse. » → **fin**

### bete

> — La plus vieille des douze. Elle était déjà vieille quand ma grand-mère était petite. À chaque tour du cercle, au même endroit, elle tourne la tête vers le désert, au sud. Personne ne sait ce qu’elle regarde.

- « Ça ne te manque pas, de marcher ? » → marcher
- « Je te laisse. » → **fin**

### marcher

> — Si. Le soir, je descends au camp, et je fais trois pas dans le sable, pour qu’il se souvienne encore de moi. Le sable se souvient de chaque pas, tu sais. Moi, de moins en moins.

- « Parle-moi de Longue-Ombre. » → bete
- « Je te laisse. » → **fin**

### nombres

_Effet : retient « muette-saal »._

> Saal’Ema ferme les yeux. — La fin, je l’ai, la petite a le début. Vingt-neuvième, neuf cent huit. Puis deux pas sans rien. Trente-deuxième, mille quarante-quatre, le plus haut. Trente-huitième, trois cent douze. Quarante et unième, vingt-six.

- « Merci, Saal’Ema. » → **fin**

### dragonnet

_Effet : retient « saal-dragonnet »._

> — Un lien à neuf ans, c’est un lien qu’on portera toute sa vie, et qu’on ne choisit pas encore. S’il casse, elle cassera avec. Les Liens-Dragons du Cœur pourraient le prendre, un adulte. Mais lui ne voudra peut-être pas.

- « Je comprends. » → **fin**

### raconte-special

_Effet : retient « raconte-saal-ema », +15 XP._

> Saal’Ema hoche la tête longtemps. — Un passeur qui comptait les enfants. Chez nous, ce sont les Gardiennes qui comptent. Elle pose la main sur la carapace. — Personne ne compte les vieux qu’on porte. La bête, peut-être.

- « Merci, Saal’Ema. » → **fin**

### raconte-touche

_Effet : retient « raconte-saal-ema », +10 XP._

> — Une histoire qui n’a pas de lieu. Je l’aime bien quand même. À mon âge, on n’a plus de lieu non plus.

- « Merci, Saal’Ema. » → **fin**

### raconte-neutre

_Effet : retient « raconte-saal-ema », +5 XP._

> — Merci, petit pied. Elle était courte : c’est une qualité.

- « Merci, Saal’Ema. » → **fin**

## La sacoche des Nacelliers

_Objet_

Commence par : « ours » _(sans repère « ours-sol-vaincu »)_ _(sans repère « ours-sol-eloigne »)_ _(sans repère « ours-sol-roule »)_, sinon « libre »

### ours

> La sacoche est là, sous la patte d’un Ours-Mousse endormi en travers de l’entrée de la fouille, roulé dans la mousse comme dans un édredon.

- **🎲 Discrétion 11** « Glisser la main sous sa patte, tout doucement. » → prise-roule, ✗ → reveil _(retient « ours-sol-roule »)_
- _(sans repère « ours-baies-rate »)_ **🎲 Survie 11** « L’attirer plus loin avec une poignée de baies. » → eloigne, ✗ → baies-rate
- « Le réveiller et l’affronter. » → **fin** _(lance le combat « ours-sacoche »)_
- « Reculer sans bruit. » → **fin**

### prise-roule

_Effet : retient « sacoche-retrouvee »._

> Tes doigts trouvent le cuir. L’ours grogne dans son sommeil, roule sur le flanc et libère l’entrée de la fouille, sans se réveiller. La sacoche est à toi.

- « Partir sans bruit. » → **fin**

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

## Le bord de l’îlot du vent

_Les Îles-Marchés_

Commence par : « bord »

### bord

> Deux pas de vide entre l’îlot du vent et le bord du Nid. Le vent pousse dans le dos, cette fois.

- **🎲 Athlétisme 14** « Sauter. » → reussi, ✗ → rate
- « Ne pas sauter. » → **fin**

### reussi

> Tu cours, tu sautes, et le vent te pousse dans le dos. Tu roules sur l’herbe pâle de l’autre côté.

- « Se relever. » → **fin** _(mène à « Aetherhaven — les Îles-Marchés »)_

### rate

_Effet : −2 PV._

> Ton pied touche le bord d’en face et glisse. Tu te rattrapes à une racine du tien, et tu t’écorches les paumes sur la pierre. En dessous, la mer de nuages n’a rien vu.

- « Réessayer. » → bord
- « Renoncer. » → **fin**

## Le bord de l’îlot

_Les Îles-Marchés_

Commence par : « bord »

### bord

> Deux pas de vide entre le bord et l’îlot du vent. Dessous, la mer de nuages, et plus bas, rien qu’on puisse voir.

- **🎲 Athlétisme 14** « Sauter. » → reussi, ✗ → rate
- « Ne pas sauter. » → **fin**

### reussi

> Tu cours, tu sautes, et le vent te pousse dans le dos. Tu roules sur l’herbe pâle de l’autre côté.

- « Se relever. » → **fin** _(mène à « Aetherhaven — les Îles-Marchés »)_

### rate

_Effet : −2 PV._

> Ton pied touche le bord d’en face et glisse. Tu te rattrapes à une racine du tien, et tu t’écorches les paumes sur la pierre. En dessous, la mer de nuages n’a rien vu.

- « Réessayer. » → bord
- « Renoncer. » → **fin**

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

## La Reine Shal’Vera

_Reine des Sables_

Commence par : « accueil »

### accueil

> Une femme dont on voit les veines d’or sous la peau, et la lumière à travers les mains. Ses yeux d’ambre te regardent comme on regarde une route. — Quelqu’un de loin. Le Désert t’a senti avant les guides. Que viens-tu chercher, qui ne se trouve pas en marchant ?

- « Qui décide, dans la Marche ? » → pouvoir
- « Ferros ? » → ferros
- « La Mer de Verre ? » → verre
- « Rien, Majesté. » → **fin**

### pouvoir

> — Les Neuf Voix proposent, les Marches votent, et quand elles ne s’entendent pas, je tranche, après avoir écouté le Désert. Je ne commande rien. On me croit plus forte que je ne suis.

- « Ferros ? » → ferros
- « La Mer de Verre ? » → verre
- « Merci, Majesté. » → **fin**

### ferros

> — Ferros a planté une foreuse dans un cimetière. Nous l’avons détruite ; deux cents des leurs sont morts. Je ne m’en réjouis pas. Je ne le regrette pas non plus.

- « Qui décide, dans la Marche ? » → pouvoir
- « La Mer de Verre ? » → verre
- « Merci, Majesté. » → **fin**

### verre

> — J’y ai marché sept jours et sept nuits, sans eau, pour devenir ce que tu vois. Six sur dix y meurent, et deviennent des statues. Je n’y retourne qu’en rêve, et je me réveille avec du sable sous les ongles.

- « Qui décide, dans la Marche ? » → pouvoir
- « Ferros ? » → ferros
- « Merci, Majesté. » → **fin**

## Shass

_Une Sylphe du Temple_

Commence par : « accueil »

### accueil

> Une silhouette de lumière pâle, à demi là. Quand elle parle, le vent parle avec elle. — Tu portes de la cendre. Même quand tu n’en portes pas. Tu viens d’en bas, ou tu vas y aller.

- « Qui es-tu ? » → qui
- « Tu sens la cendre ? » → cendre
- « Au revoir. » → **fin**

### qui

> — Shass. Je chante pour le Temple, en Vent-Cantique. Les Aériens volent avec des cristaux ; moi, avec rien. Mais je ne descends jamais : sous le Calme, je m’éteins.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### cendre

> — Je sens ce qui a traversé le Calme. Tout ce qui est passé dessous garde un silence sur lui. Toi, tu as un silence plus ancien. Il ne vient pas d’ici.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

## Siffrin Plume-Vive

_Guetteur du Quai_

Commence par : « retour » _(si quête « L’hirondelle de Siffrin » en cours)_ _(si repère « pointe-libre »)_, sinon « pointe » _(si quête « L’hirondelle de Siffrin » pas commencée)_ _(si repère « bande-vue »)_ _(sans repère « siffle-avec-siffrin-triste »)_, sinon « oiseau » _(si quête « Les noms qui montent » pas commencée)_ _(si quête « Les Mémoires du Monde Perdu » terminée)_, sinon « accueil »

### oiseau

> Un garçon siffle deux notes, et une hirondelle se pose sur son poing. Elle tient dans le bec un bout de tissu gris. — Encore une ! Celle-là vient d’en bas. Regarde : il y a un nom dessus.

- « Montre-moi. » → bande _(lance la quête « Les noms qui montent », retient « bande-vue », donne 1 × « Une bande de tissu »)_
- « Pas maintenant, Siffrin. » → **fin**

### bande

> « Ama, six ans. » L’encre a bu la cendre, on lit encore. — Il en monte depuis toujours, de sous les nuages. Grand-mère dit que c’est le Bas qui se souvient. Garde-la. Ysolde, au Registre, en a un plein tiroir.

- « Le Bas ? » → le-bas
- « Où est le Registre ? » → registre
- « Merci, Siffrin. » → **fin**

### le-bas

> — Le pays d’en bas. Personne n’y va. Avant, on vivait là, dans la cendre, et puis on est montés. Grand-mère dit qu’il faut commencer par le sol, puisque tout le monde l’oublie. C’est dans une voile, ça.

- « Où est le Registre ? » → registre
- « Merci, Siffrin. » → **fin**

### registre

> — Dans les Îles-Marchés, sur l’îlot du sud. Tu passes le pont, tu descends, tu ne peux pas le rater : c’est la maison où tout le monde entre avec un bout de tissu à la main.

- « Merci, Siffrin. » → **fin**

### accueil

> Siffrin guette le ciel, deux doigts entre les lèvres. — Tu veux voir une hirondelle du Zénith ? Elles disent le temps qu’il fera. Celle-là dit : beau, et du vent.

- « Comment tu les appelles ? » → sifflet
- _(si quête « Les noms qui montent » en cours)_ « D’autres bandes sont montées ? » → bandes
- _(si repère « siffle-avec-siffrin-triste »)_ _(si quête « L’hirondelle de Siffrin » pas commencée)_ « Pointe est revenue ? » → pointe
- « À bientôt. » → **fin**

### sifflet

> — En sifflant. Les Sylphes parlent comme ça, au Temple, en Vent-Cantique. Moi, je ne connais que quatre mots. Essaie : deux notes courtes, et puis une longue.

- _(sans repère « siffle-avec-siffrin »)_ « Siffler avec lui. » → essai
- _(sans repère « raconte-siffrin »)_ « En échange, je te raconte une histoire. » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-special ; chansons, familles → raconte-touche ; autres → raconte-neutre
- « Une autre fois. » → **fin**

### essai

_Effet : retient « siffle-avec-siffrin », +5 XP._

> Tu siffles. C’est faux. Une hirondelle passe, te regarde, et s’en va. Siffrin rit si fort qu’il manque de tomber de la vigie. — Elle a dit : pas encore.

- « Pas encore. » → **fin**

### bandes

> — Pas depuis la tienne. Elles viennent avec le vent du couchant, toujours au même endroit, au-dessus de la Colonne, le grand courant qui monte. Les vieux disent qu’en dessous il y a une voie.

- « Merci, Siffrin. » → **fin**

### pointe

> Siffrin ne siffle pas. — Pointe ne revient plus. Ma meilleure, celle qui sent les tempêtes. Trois jours. Les vieux disent que les pirates attrapent les hirondelles du Zénith, pour savoir quand frapper les convois. Au marché, un oiseleur en vend, des fois.

- « Je vais voir l’oiseleur. » → **fin** _(lance la quête « L’hirondelle de Siffrin »)_
- « Elle reviendra. » → **fin** _(retient « siffle-avec-siffrin-triste »)_

### retour

_Effet : termine la quête « L’hirondelle de Siffrin », +20 XP._

> Siffrin siffle deux notes. L’hirondelle quitte ta main et se pose sur son épaule, comme si elle n’était jamais partie. Il ne dit rien. Il pleure un peu, et il fait semblant que c’est le vent.

- « Au revoir, Siffrin. » → **fin**

### raconte-special

_Effet : retient « raconte-siffrin », +15 XP._

> Siffrin regarde le bas de sa vigie, longtemps. — Moi, j’ai une corde. Grand-mère l’a nouée elle-même, deux fois. Elle dit qu’on n’est jamais trop léger pour tomber.

- « Merci, Siffrin. » → **fin**

### raconte-touche

_Effet : retient « raconte-siffrin », +10 XP._

> Siffrin siffle l’air de ton histoire, faux d’abord, puis juste. — Je la raconterai aux hirondelles. Elles la porteront.

- « Merci, Siffrin. » → **fin**

### raconte-neutre

_Effet : retient « raconte-siffrin », +5 XP._

> Siffrin écoute en surveillant le ciel. — C’est bien. Mais il manquait un oiseau.

- « Merci, Siffrin. » → **fin**

## Sigrun

_Seize ans, la sœur de Torka_

Commence par : « maison » _(si repère « sigrun-ramenee »)_, sinon « trouvee »

### trouvee

> Une fille de seize ans, assise contre un rocher, dans un manteau d’homme. Les lèvres bleues. — C’est pas fini. Vingt-quatre heures. Je compte. Elle compte mal : elle est dehors depuis trente heures, et elle ne sent plus ses mains.

_Si Liane voyage avec toi :_ Liane est déjà à genoux dans la neige, les mains de la fille entre les siennes. — Ne discute pas avec elle. Ramène-la.

- _(si l’on porte « Manteau de fourrure de Khrysos »)_ « Lui donner ton manteau. » → manteau _(reprend 1 × « Manteau de fourrure de Khrysos », −5 PV, retient « sigrun-ramenee », termine la quête « L’Épreuve du Blizzard », retient « fin-epreuve-blizzard-vivante », +60 XP)_
- **🎲 Médecine 18** « Lui frictionner les mains, la soigner ici. » → soignee, ✗ → doigts _(retient « sigrun-ramenee », termine la quête « L’Épreuve du Blizzard », retient « fin-epreuve-blizzard-vivante », +60 XP)_
- **🎲 Athlétisme 18** « La porter jusqu’à la Porte. » → portee, ✗ → doigts _(retient « sigrun-ramenee », termine la quête « L’Épreuve du Blizzard », retient « fin-epreuve-blizzard-vivante », +60 XP)_
- « La laisser. C’est son Épreuve. » → abandonnee _(retient « sigrun-perdue », retient « abandon-froid », termine la quête « L’Épreuve du Blizzard », retient « fin-epreuve-blizzard-abandonnee », +0 XP, avis de Liane −3, avis de Boulon −2)_

### manteau

> Tu lui passes ton manteau par-dessus le sien. Elle proteste, puis plus. Le retour jusqu’à la Porte, toi sans manteau, prend une heure et te prend quelque chose. Elle marche. Elle rentre.

- « Rentrer. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_

### soignee

> Tu frottes ses mains dans la neige, puis contre ta peau, longtemps, jusqu’à ce qu’elle crie de douleur : bon signe. Elle se lève. Vous rentrez ensemble, au pas, en comptant pour de vrai.

- « Rentrer. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_

### portee

> Tu la charges sur ton dos. Elle ne pèse rien, ce qui t’inquiète. Une heure de vent de face, la perche, puis la Porte. Elle vit.

- « Rentrer. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_

### doigts

_Effet : retient « sigrun-ramenee », termine la quête « L’Épreuve du Blizzard », retient « fin-epreuve-blizzard-doigts », +40 XP._

> Tu la ramènes, mais trop tard pour deux doigts de sa main gauche. À la Porte, le médecin des Vigiles les lui prend, proprement. Elle ne pleure pas. Elle dit : j’ai réussi l’Épreuve, alors.

- « Rentrer. » → **fin** _(mène à « Khrysos — les Portes de Glace »)_

### abandonnee

> Tu repars vers la perche. Derrière toi, elle compte encore, à voix basse. Le lendemain, les Vigiles Blancs la ramènent, debout dans un bloc de neige. À Khrysos, ce que tu as fait a un nom : l’abandon dans le froid.

- « Rentrer. » → **fin**

### maison

> Sigrun, roulée dans trois couvertures devant la cheminée. — Je comptais mal. Je croyais qu’il restait deux heures. Tu sais ce qui est bête ? Je n’avais plus froid. C’est ça qui aurait dû me faire peur.

- « Repose-toi. » → **fin**

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
- _(si l’on porte « La boîte du passeur »)_ « J’ai repêché cette boîte sous le pont. » → odon
- « Merci. » → accueil

### liane

> Liane ? Toujours au bord du ruisseau, près du marché, le nez dans ses herbes. Elle est brusque, mais personne ne soigne mieux qu’elle.

- « Merci. » → accueil

### odon

> Sylvan s’essuie les mains avant de la toucher. — La boîte d’Odon Passe-Rive. Trente ans qu’il faisait passer la Lisière, la nuit, à ceux qui n’avaient pas de papiers, et qu’il cochait chaque enfant de l’autre côté. C’est lui qu’on a repêché au lavoir.

- « Que dit la dernière page ? » → odon-fin

### odon-fin

_Effet : reprend 1 × « La boîte du passeur », retient le Récit « Odon Passe-Rive », +20 XP._

> Sylvan lit, longtemps. — Il s’est arrêté au milieu d’un nom : le feu de la Chute l’a repris avant. Garde-le, toi, ce carnet, dans ta tête de Gardien·ne. Au marché, on l’aura oublié avant l’hiver.

- « Je m’en souviendrai. » → accueil

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

## Tadéo

_Plongeur, aux Canaux_

Commence par : « aveu » _(si quête « Le Don rendu » en cours)_ _(si repère « don-rendu-indice »)_ _(sans repère « tadeo-avoue »)_, sinon « accueil »

### accueil

> Un plongeur maigre, les mains abîmées par le corail, recoud un filet. — Tadéo. Je remonte ce qui se vend. Le reste, la mer peut le garder.

- « Au revoir. » → **fin**

### aveu

> Tadéo voit ta question avant que tu la poses. — La bague ? Oui. Je l’ai remontée. Je voulais la vendre.

- « Et ? » → aveu-2

### aveu-2

_Effet : retient « tadeo-avoue »._

> — Je n’ai pas pu. Je l’ai reposée sur l’autel, la nuit. Je ne savais pas que la veuve la trouverait là. Je ne savais pas qu’elle croirait que la mer la lui rendait.

- « Je ne dirai rien. » → **fin**
- « Les Murmureurs doivent le savoir. » → denonce

### denonce

_Effet : retient « tadeo-denonce »._

> Tadéo baisse la tête. — « Rends toujours aux eaux ce qu’elle t’a offert. » Je sais. J’irai moi-même.

- « Partir. » → **fin**

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

## Tam’Ruu

_Tient la Halte_

Commence par : « lettre-prise » _(si quête « Ce qui n’a plus lieu » terminée)_ _(si repère « caisse-communion-prise »)_ _(sans repère « tam-lettre »)_, sinon « lettre » _(si quête « Ce qui n’a plus lieu » terminée)_ _(sans repère « tam-lettre »)_, sinon « dame » _(si quête « Ce que la mer rend » terminée)_ _(si quête « Ce qui n’a plus lieu » pas commencée)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Un homme large, un tablier de cuir, une louche à la main ; derrière lui, une jarre plus haute que lui. — La Halte ! Ce soir elle est là, demain elle sera plus loin, et la soupe sera la même. Qu’est-ce qu’il te faut ?

- « Manger ou dormir ? » → servir
- « Comment vit la Marche ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « halte »)_
- « Au revoir. » → **fin**

### accueil-2

> Tam’Ruu goûte sa soupe, grimace, ajoute du sel. — Tu reviens ! La Halte aussi, tu vois : elle t’a suivi·e de trente kilomètres.

- « Manger ou dormir ? » → servir
- « Comment vit la Marche ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « halte »)_
- « Au revoir. » → **fin**

### accueil-3

> — Les pieds ? Tout le monde a mal aux pieds le premier mois. Après, on a mal ailleurs. Assieds-toi.

- « Manger ou dormir ? » → servir
- « Comment vit la Marche ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « halte »)_
- « Au revoir. » → **fin**

### servir

> — Une soupe de lentilles des serres, ou une natte jusqu’au matin. L’eau, tu la prends à la Tente de l’Eau, comme tout le monde : je ne la vends pas, personne ne la vend.

- **[8 Fers]** « Une soupe. » → mange _(−8 Fers, +15 PV)_
- **[8 Fers]** « Une natte jusqu’au matin. » → dodo _(−8 Fers, dort jusqu’au matin)_
- **[8 Fers]** « Une natte jusqu’au soir. » → dodo _(−8 Fers, dort jusqu’à le soir)_
- « Rien, merci. » → accueil

### mange

> Une soupe épaisse, qui sent le cumin et la toile chaude. Autour de toi, des gens mangent debout : on mange vite, le soir, avant que la halte commence.

- « Merci, Tam’Ruu. » → accueil

### dodo

> Une natte, une couverture qui sent le chameau, et le grondement lent des Léviathans qui dorment tout autour du camp.

- « Bonne nuit. » → **fin**

### nouvelles

> — Trois choses. Le matin, l’eau : chacun sa ration, à la Tente de l’Eau, et personne ne la refuse à personne. Le soir, la halte : Ish’Lenne dit l’épisode qui appartient à l’endroit. Entre les deux, on marche.

- « Pourquoi ne jamais s’arrêter ? » → arreter
- « Et les Léviathans ? » → leviathans
- « Merci. » → accueil

### arreter

> — L’eau qui stagne pourrit, le sable qui bouge vit. Une Marche qui s’arrête arrive en retard au point d’eau suivant. Et qui arrive en retard à l’eau ne repart pas.

- « Et les Léviathans ? » → leviathans
- « Merci. » → accueil

### leviathans

> — Douze. Ils portent les clans-souches, les sanctuaires, et ceux qui ne marchent plus. Nous, on marche autour. Une Marche n’est pas embarquée, l’étranger : retiens ça, tu vexeras moins de monde.

- « Pourquoi ne jamais s’arrêter ? » → arreter
- « Merci. » → accueil

### dame

_Effet : lance la quête « Ce qui n’a plus lieu », retient « plus-lieu-commencee »._

> — Toi, tu cherches la même chose que la dame en gris. Ça se voit aux chaussures. Elle est passée il y a quatre jours. Elle a demandé l’eau de l’Année Errante, et on la lui a donnée : on ne refuse pas l’eau. Puis elle est partie vers le sud. À pied.

- « Vers quoi ? » → dame-quoi
- « Manger ou dormir ? » → servir
- « Merci. » → **fin**

### dame-quoi

> — Une halte morte, à ce qu’on dit. Va voir Ish’Lenne, à la Tente des Mille Pas : elle garde les mots de ces endroits-là. Elle ne te les dira pas, mais elle te dira pourquoi.

- « Merci, Tam’Ruu. » → accueil

### lettre

> — Un pli pour toi, arrivé avec la caravane des verriers. Il a fait trois semaines de route, et ça se sent.

- « L’ouvrir. » → lettre-texte

### lettre-texte

_Effet : retient « tam-lettre »._

> L’écriture d’Ilyane, qui tremble. « Tu marches avec une ville ? Moi, je marche jusqu’au puits, le matin, et en arrivant je ne sais plus pourquoi je suis venue. Alors j’y retourne le lendemain. Le puits, lui, se souvient de moi. »

- « Plier la lettre. » → **fin**

### lettre-prise

_Effet : retient « tam-lettre »._

> — Un pli pour toi, arrivé avec la caravane. Tam’Ruu te le tend, et regarde ailleurs. Trois lignes, presque illisibles. « Je suis allée au puits. Je ne sais plus pourquoi. Il y avait quelqu’un avec moi, je crois. »

- « Plier la lettre. » → **fin**

## Tam Orvel

_Riveteur des Forges-Basses_

Commence par : « apres-masques » _(si quête « Le registre du Puits Trois » terminée)_ _(si repère « masques-forges »)_, sinon « decision » _(si quête « Le registre du Puits Trois » en cours)_ _(si repère « dask-parrain »)_, sinon « parle » _(si quête « Le registre du Puits Trois » en cours)_, sinon « accueil »

### accueil

> Un jeune homme maigre tousse dans sa manche, près du registre, puis cache vite la manche. — Tu lis le registre ? Personne ne le lit vraiment. On y cherche son nom, ou celui d’un autre, et on se tait.

- « Pourquoi caches-tu ta manche ? » → toux
- _(sans repère « raconte-tam »)_ « Tu veux une histoire ? Ça repose la toux. » → raconte-neutre 📖 raconter un Récit : savant-corvan → raconte-savant ; machines, familles → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-tam », +5 XP._

> Tam écoute en retenant sa toux jusqu’à la fin, par politesse. Puis il tousse longtemps. — Pardon. Elle était bien.

- « Prends soin de toi, Tam. » → **fin**

### raconte-touche

_Effet : retient « raconte-tam », +10 XP._

> Les yeux de Tam s’allument. — Une machine, avec des gens dedans. C’est ça que je veux faire : des choses qui servent à ceux d’en bas.

- « Prends soin de toi, Tam. » → **fin**

### raconte-savant

_Effet : retient « raconte-tam », +15 XP._

> Tam répète, la voix râpeuse : « Même réussir peut tout détruire. » Il regarde son masque de feutre. — Si mon masque réussit, ils le prendront là-haut et nous laisseront la toux. C’est ça qu’il voulait dire ?

- « Prends soin de toi, Tam. » → **fin**

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

## Le tiroir des voiles sans auteur

_Registre des Voiles_

Commence par : « ouvert » _(si repère « tiroir-vu »)_, sinon « ferme »

### ferme

> Un tiroir long, fermé à clé, sous le lutrin. Ysolde garde la clé à la ceinture.

- « Laisser le tiroir. » → **fin**

### ouvert

> Des dizaines de bandes grises. Ama, six ans. Joran, huit ans. Sefi, cinq ans. Nilo, sept ans. Brune, neuf ans. Hélie, six ans. Puis de nouveau Ama, et Joran, jusqu’au fond du tiroir.

- « Refermer le tiroir. » → **fin**

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

- _(sans repère « raconte-tiven »)_ « Tu veux une histoire, pour la prochaine montée ? » → raconte-neutre 📖 raconter un Récit : odon-passe-rive → raconte-odon ; familles, mysteres → raconte-touche ; autres → raconte-neutre
- « Bon courage. » → **fin**

### panse-medecine

> Tu rinces, tu graisses, tu serres. Tiven grimace, puis souffle. — Ça tire, mais ça ne brûle plus. Où est-ce qu’on apprend ça ?

- « Ménage-toi. » → **fin**

### raconte-neutre

_Effet : retient « raconte-tiven », +5 XP._

> Tiven écoute en enroulant une corde autour de son coude. — Je la raconterai aux autres, ce soir, en haut. Si je m’en souviens jusque-là.

- « Bon courage, Tiven. » → **fin**

### raconte-touche

_Effet : retient « raconte-tiven », +10 XP._

> Tiven sourit. — Celle-là, je la garde pour les nuits de vent. Là-haut, quand la nacelle grince, il faut quelque chose à se dire.

- « Bon courage, Tiven. » → **fin**

### raconte-odon

_Effet : retient « raconte-tiven », +15 XP._

> Tiven ne dit rien un moment. — Un passeur. Nous aussi, on fait passer : des paniers, des gens, des lettres. Personne n’écrit nos noms quand on tombe. Lui, au moins, il écrivait ceux des autres.

- « Bon courage, Tiven. » → **fin**

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

- « Parlons d’autre chose. » → accueil
- _(sans repère « raconte-tobias »)_ « Une histoire contre une rumeur ? » → raconte-neutre 📖 raconter un Récit : jeudi-ordinaire → raconte-jeudi ; machines, trains → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-tobias », +5 XP._

> Tobias écoute en rangeant ses cordes, poliment. — Joli. Ça ne fera pas vendre une lampe, mais joli.

- « Parlons d’autre chose. » → accueil
- « Au revoir. » → **fin**

### raconte-touche

_Effet : retient « raconte-tobias », +10 XP, +10 Fers._

> Tobias pose ses cordes. — Des rails, des machines : tu parles ma langue. À Ferros, les vieux racontent ça aux apprentis pour qu’ils respectent l’acier. Tiens, pour l’histoire : au marché, elle vaut bien ça.

- « Parlons d’autre chose. » → accueil
- « Au revoir. » → **fin**

### raconte-jeudi

_Effet : retient « raconte-tobias », +15 XP, +20 Fers._

> Tobias ne sourit plus. — Un jeudi. Ma mère n’ouvrait jamais boutique le jeudi, et elle n’a jamais su dire pourquoi. Elle disait que le monde était tombé un jour où personne ne faisait attention. Celle-là, je te la paie double.

- « Parlons d’autre chose. » → accueil
- « Au revoir. » → **fin**

## Torka

_Dix ans, sculpte des animaux dans la glace_

Commence par : « perdue » _(si repère « sigrun-perdue »)_, sinon « doigts » _(si repère « fin-epreuve-blizzard-doigts »)_, sinon « rentree » _(si quête « L’Épreuve du Blizzard » terminée)_, sinon « attend » _(si quête « L’Épreuve du Blizzard » en cours)_, sinon « sigrun » _(si quête « L’Épreuve du Blizzard » pas commencée)_, sinon « accueil »

### accueil

> Une petite fille en bonnet rouge, à genoux devant un bloc de glace, gratte avec un couteau à lame courbe. Un renard en sort, puis un lièvre. — Ne marche pas sur la queue. Elle m’a pris deux jours.

- « C’est beau. Qui t’a appris ? » → appris
- « Tu en fais beaucoup ? » → beaucoup
- « Je te laisse. » → **fin**

### appris

> — Ma sœur, Sigrun. Elle fait les ours, moi les renards. Elle dit que la glace sait déjà ce qu’il y a dedans, qu’il faut seulement enlever le reste.

- « Tu en fais beaucoup ? » → beaucoup
- « Je te laisse. » → **fin**

### beaucoup

> — Un par jour. Ils fondent pas : il fait moins cinq. Alors il y en a partout, dans la maison. Maman dit qu’on n’a plus de place pour s’asseoir.

- « C’est beau. Qui t’a appris ? » → appris
- « Je te laisse. » → **fin**

### sigrun

_Effet : lance la quête « L’Épreuve du Blizzard », retient « blizzard-commencee »._

> Une petite fille en bonnet rouge, à genoux devant un ours de glace à moitié taillé. Elle ne gratte plus. — C’est l’ours de Sigrun. Elle devait le finir en rentrant de l’Épreuve du Blizzard. Vingt-quatre heures seule dehors. Ça fait trente.

- « Je vais la chercher. » → **fin**
- « Les Vigiles Blancs ne la cherchent pas ? » → vigiles
- « Qui t’a appris à sculpter ? » → appris

### vigiles

> — Ils cherchent au nord. Sigrun est partie à l’est. Elle me l’a dit, à moi, et à personne d’autre : elle voulait voir la perche des guides, en sortant par la Porte.

- « Je vais la chercher. » → **fin**

### attend

> Torka gratte l’ours de Sigrun, sans le finir. — À l’est. La perche des guides. Elle a pris le manteau de Papa, il est trop grand pour elle.

- « Je vais la chercher. » → **fin**
- « Je te laisse. » → **fin**

### rentree

> — Sigrun est rentrée ! Elle dort depuis deux jours. Maman dit qu’elle a raté l’Épreuve. Sigrun dit que non, qu’elle a appris ce qu’il fallait apprendre. Torka a fini l’ours. Il sourit, ce qui ne se fait pas pour un ours.

- « Je te laisse. » → **fin**

### doigts

> Torka a fini l’ours. Il a une patte de travers. — C’est Sigrun qui l’a fini, avec sa main d’après. Elle dit que l’ours lui ressemble, maintenant. Moi, je trouve qu’il est mieux.

- « Je te laisse. » → **fin**

### perdue

> Torka ne sculpte plus. Un bloc de glace intact devant elle. — On dit que tu l’as vue. Que tu es reparti·e. Elle ne lève pas les yeux. — À Khrysos, il y a un mot pour ça. Maman ne veut pas que je le dise.

- « Partir. » → **fin**

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

## Des traces dans la neige

_La surface_

Commence par : « traces » _(sans repère « sigrun-reperee »)_, sinon « vide »

### traces

> Sous la neige fraîche, des pas de bottes trop grandes pour celle qui les porte, vers l’est. Le vent les efface à mesure qu’on les regarde.

- _(sans repère « traces-rate »)_ **🎲 Survie 18** « Les suivre avant qu’elles disparaissent. » → suivies, ✗ → perdues
- « Aller chercher Korvek, aux Portes. » → **fin**

### suivies

_Effet : retient « sigrun-reperee »._

> Tu suis les pas, de creux en creux, la tête baissée contre le vent. Puis, entre deux rafales, une silhouette assise contre un rocher, à l’est.

- « Y aller. » → **fin**

### perdues

_Effet : retient « traces-rate » pour 1 jours._

> Les pas se perdent dans une congère, puis plus rien. Le vent a gagné. Demain, la neige aura bougé ; ou demande à un guide qui sait lire le blizzard.

- « Rentrer. » → **fin**

### vide

> Des pas, à moitié effacés.

- « Passer. » → **fin**

## Un traîneau de Ferros

_Les Portes de Glace_

Commence par : « vide » _(si quête « Le yéti des Portes » en cours)_ _(sans repère « traces-bottes »)_, sinon « traineau »

### traineau

> Un traîneau de Ferros, des caisses de bougies de suif sanglées dessus.

- « Passer. » → **fin**

### vide

> Le traîneau du marchand de Ferros, vidé : les sangles coupées, les caisses parties. Autour, la neige tassée par cent pieds et dix traîneaux.

- _(sans repère « traineau-rate »)_ **🎲 Investigation 18** « Examiner les traces, sous les autres. » → bottes, ✗ → pietine
- « Laisser. » → **fin**

### bottes

_Effet : retient « traces-bottes »._

> Les sangles ont été coupées net, au couteau, à hauteur d’homme. Dans la neige, sous les autres, des bottes ferrées de Ferros. Un Yéti n’en porte pas : il n’en trouve pas à sa taille.

- « Aller voir la garde. » → **fin**

### pietine

_Effet : retient « traineau-rate » pour 1 jours._

> Trop de pieds, trop de traîneaux. Demain, la neige fraîche aura recouvert le reste, ou montré autre chose.

- « Laisser. » → **fin**

## Le guetteur du tunnel

_Marches des Cendres_

Commence par : « guetteur » _(si quête « Le Rail des Cendres » en cours)_, sinon « guetteur » _(si quête « La Clé de Rouille Bleue » en cours)_ _(sans repère « cle-obtenue »)_, sinon « ferme »

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

## Ulga Brasegel

_Tient le Foyer_

Commence par : « lettre-prise » _(si quête « Ce que la glace a pris » terminée)_ _(si repère « caisse-glacialis-prise »)_ _(sans repère « ulga-lettre »)_, sinon « lettre » _(si quête « Ce que la glace a pris » terminée)_ _(sans repère « ulga-lettre »)_, sinon « dame » _(si quête « Ce qui n’a plus lieu » terminée)_ _(si quête « Ce que la glace a pris » pas commencée)_, sinon « accueil-2 » _(un jour sur 3, le 2e)_, sinon « accueil-3 » _(un jour sur 3, le 3e)_, sinon « accueil »

### accueil

> Une salle basse, une cheminée où l’on ferait rôtir un traîneau. Une femme aux joues rouges essuie une chope. — Le Foyer ! Assieds-toi près du feu, le temps de retrouver tes doigts. On mange, on dort, et on parle bas : il y a des gens qui dorment assis.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « foyer »)_
- « Au revoir. » → **fin**

### accueil-2

> Ulga Brasegel remet une bûche, une vraie, montée d’Ironheart par le train. — Le bois coûte plus cher que la viande. Mais le feu, tout le monde y a droit, chez moi.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « foyer »)_
- « Au revoir. » → **fin**

### accueil-3

> — Tu as encore de la neige dans les cils. Approche. Personne n’a jamais gelé dans mon Foyer, et ce n’est pas toi qui commenceras.

- « Manger ou dormir ? » → servir
- « Quelles nouvelles ? » → nouvelles
- « Raconter un Récit à la veillée. » → **fin** _(ouvre la veillée « foyer »)_
- « Au revoir. » → **fin**

### servir

> — Un bouillon de racines de serre, du poisson de la Mer Gelée quand le train en monte, et des couchettes contre le mur chaud. Dix Fers le bol, dix Fers la nuit.

- **[10 Fers]** « Un bouillon. » → mange _(−10 Fers, +15 PV)_
- **[10 Fers]** « Une couchette jusqu’au matin. » → dodo _(−10 Fers, dort jusqu’au matin)_
- **[10 Fers]** « Une couchette jusqu’au soir. » → dodo _(−10 Fers, dort jusqu’à le soir)_
- « Rien, merci. » → accueil

### mange

> Un bouillon brûlant, salé, qui sent la racine et la fumée. À la table d’à côté, un Géant des Glaces mange assis par terre, pour ne pas casser le banc.

- « Merci, Ulga. » → accueil

### dodo

> Une couchette contre le mur où passe la chaleur de la terre. Au-dessus de toi, trois cents mètres de glace, et le silence qu’ils font.

- « Bonne nuit. » → **fin**

### nouvelles

> — La loi de 2995 renvoie encore des familles aux Portes. La Loi de Survie dit qu’on ne refuse pas l’abri à un voyageur ; le Conseil dit qu’un réfugié n’est pas un voyageur. Et au Douze, on ne descend plus seul aux cryptes.

- « Pourquoi pas seul ? » → seul
- « Et toi, qu’en penses-tu ? » → pense
- « Merci. » → accueil

### seul

> — À cause du Briseur d’Échos. Il descendait seul, lui. Il a brisé quatre mille six cent onze cristaux de crypte avant qu’on le prenne. Depuis, on y va à deux, et l’autre regarde ce que tu fais de tes mains.

- « Et toi, qu’en penses-tu ? » → pense
- « Merci. » → accueil

### pense

> — Moi ? Je tiens un feu. Un feu ne demande pas d’où tu viens. Ce que je pense du Conseil, je le dis à ma cheminée, et elle garde tout.

- « Merci. » → accueil

### dame

_Effet : lance la quête « Ce que la glace a pris », retient « glace-pris-commencee »._

> — Toi, tu viens pour la même chose que la dame en gris. Ça se voit au manteau : trop léger. Elle a dormi ici il y a trois nuits. Elle a demandé le Collège des 9 Miroirs, et une lacune de trente ans. Je ne sais pas ce que c’est. Elle non plus, je crois.

- « Où trouver le Collège ? » → dame-ou
- « Manger ou dormir ? » → servir
- « Merci. » → **fin**

### dame-ou

> — À la Bibliothèque de Glace, au Niveau Royal : prends le Puits d’Ascension. Et dis bien la formule à Hrolda Rochebrume, sinon elle te laissera debout jusqu’au soir.

- « Merci, Ulga. » → accueil

### lettre

> — Un pli pour toi, monté d’Ironheart avec le train. Il est froid : tout ce qui arrive ici est froid.

- « L’ouvrir. » → lettre-texte

### lettre-texte

_Effet : retient « ulga-lettre »._

> L’écriture d’Ilyane, plus grande qu’avant, pour ne pas se perdre entre les lignes. « Il a neigé à Gardebois. Je crois que c’est la première fois. Nell dit que non, qu’il neige chaque hiver. Je la crois. Je crois tout le monde, maintenant. Reviens. »

- « Plier la lettre. » → **fin**

### lettre-prise

_Effet : retient « ulga-lettre »._

> — Un pli pour toi, monté avec le train. Ulga te le tend, et retourne à son feu. Trois lignes, d’une main qui tremble. « J’ai trouvé ton nom dans mes carnets. Je ne sais plus ton visage. Écris-moi qui tu es : je l’écrirai en grand. »

- « Plier la lettre. » → **fin**

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
- _(sans repère « raconte-varka »)_ « J’ai une histoire pour le brasero. » → raconte-neutre 📖 raconter un Récit : echelle-de-pim → raconte-pim ; trains, machines → raconte-touche ; autres → raconte-neutre
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

### raconte-neutre

_Effet : retient « raconte-varka », +5 XP._

> Varka écoute en tendant les mains au feu. — Ça se raconte bien. Ça ne fait pas rouler un convoi, mais ça se raconte bien.

- « Bonne nuit, Varka. » → **fin**

### raconte-touche

_Effet : retient « raconte-varka », +10 XP._

> Varka hoche la tête, lentement. — Des rails, du fer, des gens qui tiennent. Celle-là, les gars la voudront ce soir. Reviens la leur dire quand tu veux.

- « Bonne nuit, Varka. » → **fin**

### raconte-pim

_Effet : retient « raconte-varka », +15 XP._

> Varka crache dans le brasero. — Un garde-corps pour ceux d’en haut, une échelle pour les petits. Chez nous, c’est pareil, en fer. Un jour, on la racontera au triage, ton histoire, et tout le monde saura de quoi on parle.

- « Bonne nuit, Varka. » → **fin**

## Varo’Ssin

_Maître verrier, Homme-de-Verre_

Commence par : « accueil »

### accueil

> Un homme dont la peau, par plaques, est devenue du verre ; on voit dessous la lueur du four. — Je coule les jalons. Un mètre vingt, du verre de la Mer de Verre, rien d’écrit dessus. Un jalon ne dit pas ce qui s’est passé : il dit que c’était là.

- « Tu as soif, parfois ? » → soif
- _(sans repère « raconte-varo-ssin »)_ « Je vous raconte une histoire, pendant que le four chauffe ? » → raconte-neutre 📖 raconter un Récit : jeudi-ordinaire → raconte-special ; ancien-monde → raconte-touche ; autres → raconte-neutre
- « La Mer de Verre ? » → mer
- « Je te laisse travailler. » → **fin**

### soif

> — Je vais à la distribution une fois la semaine. Ne me demande pas si c’est pour boire : je ne l’ai jamais su moi-même. La Gardienne me sert sans rien dire. C’est une forme de politesse, des deux côtés.

- « La Mer de Verre ? » → mer
- « Je te laisse travailler. » → **fin**

### mer

> — Le cimetière de l’Ancien Monde. Des villes entières, vitrifiées. On y prend le verre des jalons, un peu, une fois l’an. Ferros a voulu y forer : la foreuse n’existe plus, et deux cents des leurs non plus.

- « Tu as soif, parfois ? » → soif
- « Je te laisse travailler. » → **fin**

### raconte-special

_Effet : retient « raconte-varo-ssin », +15 XP._

> Varo’Ssin pose sa canne de verrier. — Un jour comme les autres, dans l’Ancien Monde, juste avant. Il regarde ses mains de verre. — La Mer de Verre, c’était ça aussi, un jeudi. Je coulerai un jalon pour ton histoire. Sans rien dessus.

- « Merci, Varo’Ssin. » → **fin**

### raconte-touche

_Effet : retient « raconte-varo-ssin », +10 XP._

> — Elle a de la tenue, ton histoire. Elle refroidirait droit.

- « Merci, Varo’Ssin. » → **fin**

### raconte-neutre

_Effet : retient « raconte-varo-ssin », +5 XP._

> — Hm. Le verre écoute mieux que moi.

- « Merci, Varo’Ssin. » → **fin**

## La Veilleuse du Rail

_Travailleurs du Rail_

Commence par : « cle-cendriere » _(si quête « Les noms qui montent » terminée)_ _(si repère « cle-veilleuse »)_ _(si quête « Sous la cendre » pas commencée)_, sinon « avec-cle » _(si l’on porte « Clé de rouille bleue »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « rendue-apres » _(si repère « cle-veilleuse »)_, sinon « apres » _(si repère « cle-obtenue »)_, sinon « question-cle » _(si repère « kaelis-parle »)_ _(si quête « La Clé de Rouille Bleue » en cours)_, sinon « accueil »

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

- « Te la rendre : sa place est sur la ligne. » → rendue _(reprend 1 × « Clé de rouille bleue », retient « cle-veilleuse », termine la quête « La Clé de Rouille Bleue », retient « fin-cle-rouille-bleue-rendue », +60 XP)_
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

- « Te la rendre. » → rendue _(reprend 1 × « Clé de rouille bleue », retient « cle-veilleuse », termine la quête « La Clé de Rouille Bleue », retient « fin-cle-rouille-bleue-rendue », +60 XP)_
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

### cle-cendriere

> La Veilleuse ouvre la main sur la clé. — Elle chante, la nuit, quand je passe l’aiguillage de la Cendrière. Elle n’a jamais chanté que pour les trains. Jamais pour un endroit. Va voir. Et reviens me dire.

- « J’y vais. » → **fin** _(lance la quête « Sous la cendre », retient « caisse-ferros-cherchee »)_
- « Autre chose. » → rendue-apres

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

## Vessin Clairvol

_Voilier_

Commence par : « prete » _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « machine-vessin »)_, sinon « accueil »

### accueil

> Un homme aux mains pleines de fil coud une toile tendue sur un cadre. Il ne lève pas l’aiguille. — Voilerie Clairvol. Des voiles, des cordes, des masques, et des machines, quand on m’apporte de quoi les faire monter.

- « Voir ce que vous vendez. » → **fin** _(ouvre le Troc)_
- _(si quête « Les noms qui montent » en cours)_ _(sans repère « caisse-zephyria-reglee »)_ _(si repère « tiroir-vu »)_ « Une machine, pour descendre sous les nuages ? » → machine
- _(sans repère « raconte-vessin »)_ « Je peux vous raconter une histoire, pendant que vous cousez ? » → raconte-neutre 📖 raconter un Récit : matricule-4-17 → raconte-special ; machines → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### machine

> Vessin pose enfin l’aiguille. — J’ai un cadre et un cristal. Pour le Bas, il en faut deux : le Calme ne pardonne pas. Apportez-moi un second cristal et je grée la machine. Vous la piloterez vous-même : elle est docile.

- _(si l’on porte « Second cristal azur »)_ « Voici un second cristal. » → grement _(reprend 1 × « Second cristal azur »)_
- « Où trouver un second cristal ? » → ou
- « Plus tard. » → **fin**

### ou

> — Ici, cent vingt Fers. Ou sur l’îlot du vent, à l’est du Nid : une vieille machine s’y est posée il y a des années, et personne n’ose sauter jusque-là. Les Ailes Noires jurent qu’il reste un cristal dans la carcasse.

- _(si l’on porte « Second cristal azur »)_ « Voici un second cristal. » → grement _(reprend 1 × « Second cristal azur »)_
- « Voir ce que vous vendez. » → **fin** _(ouvre le Troc)_
- « Plus tard. » → **fin**

### grement

_Effet : retient « machine-vessin », +10 XP._

> Il fixe le cristal sous le cadre, de biais, face au courant de la fenêtre, et la toile se tend toute seule. — Voilà. Deux cristaux, un cadre, et le vent. Elle vous attend au quai.

- « Partir maintenant. » → **fin** _(retient « descente-vessin », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Plus tard. » → **fin**

### prete

> — Votre machine vous attend au quai. Deux cristaux, un cadre, et le vent.

- « Partir maintenant. » → **fin** _(retient « descente-vessin », retient « au-bas », fait passer 1 moment, mène à « Sous les nuages — le pays de cendre »)_
- « Voir ce que vous vendez. » → **fin** _(ouvre le Troc)_
- « Pas encore. » → **fin**

### raconte-special

_Effet : retient « raconte-vessin », +15 XP._

> Vessin lâche son aiguille. — Quarante ans à compter jusqu’à quatre. J’ai un cadre, au fond, que personne n’est revenu chercher. Je le graisse quand même, tous les printemps.

- « Merci, Vessin. » → **fin**

### raconte-touche

_Effet : retient « raconte-vessin », +10 XP._

> Vessin hoche la tête au rythme de l’aiguille. — Une machine qui attend, ça se respecte. Ça ne se plaint jamais.

- « Merci, Vessin. » → **fin**

### raconte-neutre

_Effet : retient « raconte-vessin », +5 XP._

> Vessin coud sans lever les yeux. — Hm. Elle tient. C’est tout ce qu’on demande à une couture.

- « Merci, Vessin. » → **fin**

## La Veuve Grêle

_Pirate de l’air_

Commence par : « quai »

### quai

> Une femme sèche, un manteau de toile cirée, des grêlons de fer cousus aux manches. Derrière elle, deux pirates sur le pont du convoi. — Tiens. Quelqu’un qui ne dort pas. On prend la farine, et personne ne saigne. Ou l’inverse.

- « Alors l’inverse. » → **fin** _(lance le combat « raid-quai »)_
- **🎲 Diplomatie 15** « Vous avez faim. Prenez le quart, pour vos familles, et partez. » → negocie, ✗ → refus
- **🎲 Subterfuge 15** « La Gardienne du Ciel arrive. Elle est juste derrière moi. » → fuite, ✗ → refus
- « Prenez tout. » → laisse

### refus

> — Le quart ? On n’a pas monté jusqu’ici pour un quart. Elle fait tourner une chaîne de grêlons au bout de son bras.

- « Alors on se bat. » → **fin** _(lance le combat « raid-quai »)_
- « Prenez tout. » → laisse

### negocie

_Effet : retient « raid-regle », retient « raid-negocie », +30 XP._

> Elle te regarde comme on regarde le temps qu’il fera. — Le quart. Elle siffle ; ses pirates chargent quatre sacs, pas un de plus, et leur machine noire s’éloigne sous le quai. — Dis à Vire-Nuée que la Grêle a été polie, cette fois.

- « Les regarder partir. » → **fin**

### fuite

_Effet : retient « raid-regle », retient « raid-fuite », +30 XP._

> « La Gardienne ! » Ils ne vérifient pas. Ils sautent dans leur machine et filent sous le quai. La farine est sauve. Personne n’a vu ta main trembler.

- « Respirer. » → **fin**

### laisse

_Effet : retient « raid-regle », retient « raid-laisse »._

> Ils chargent tout, sans se presser. La Veuve Grêle te salue en passant. Demain, le pain coûtera le double au Marché.

- « Les regarder partir. » → **fin**

## La vieille machine

_Ligne qu’on dit maudite_

Commence par : « absente » _(si quête « La Clé de Rouille Bleue » en cours)_ _(sans repère « cle-obtenue »)_, sinon « machine »

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

### absente

> La locomotive est astiquée de frais ; la lampe de la Veilleuse attend, éteinte, sur le marchepied. À la craie, sur la cabine : « Partie écouter l’embranchement. Le convoi passe par la Cendrière, ces nuits-ci. »

- « La Cendrière : le tunnel du triage. » → **fin**

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Je ne suis pas sûre d’avoir eu raison. Je suis sûre de ce que j’aurais fait si j’avais eu tort dans l’autre sens. » La phrase d’Aerys que la Charte ne cite pas. Elle circule toute seule, recopiée par ceux qui doutent.

- « La garder, pour la recopier. » → **fin** _(retient « voile-haute-1-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-haute-1-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Le vent n’a pas de mémoire, alors il emporte la nôtre, et la dépose ailleurs, chez des gens qui ne savaient pas qu’ils l’attendaient. » Au dos, quatorze petits traits : quatorze mains l’ont recopiée avant toi.

- « La garder, pour la recopier. » → **fin** _(retient « voile-haute-2-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-haute-2-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> Un dessin d’enfant : une machine, deux cristaux, un soleil. Dessous, en lettres énormes : « PAPA REVIENT AVANT LA NUIT. » Le tissu a deux ans, au moins. On ne sait pas s’il est revenu.

- « La garder, pour la recopier. » → **fin** _(retient « voile-haute-3-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-haute-3-attrapee »)_

## Une voile au garde-fou

_Le Lâcher_

Commence par : « voile »

### voile

> Une voile accrochée au garde-fou, que personne ne détache : rien ne doit entraver le vent. Quatre mots, d’une écriture ancienne recopiée avec soin : « Et pour l’an cinquante ».

- **🎲 Investigation 14** « Regarder le tissu de près. » → indice, ✗ → rien
- _(si l’on porte « La septième voile, l’état juste »)_ _(si repère « onze-a-lacher »)_ _(si quête « Les onze états » en cours)_ « Lâcher l’état juste de la septième voile. » → etat
- _(si l’on porte « La liste de l’an cinquante »)_ _(si l’on porte « Tissu à voile »)_ _(si quête « Les voiles dormantes » en cours)_ « Recopier la liste de l’an cinquante, et la lâcher. » → liste-lachee
- « La laisser au vent. » → **fin**

### rien

> Un tissu, quatre mots, un nœud. Le vent te pique les yeux, et la voile claque contre le garde-fou. Tu n’en tires rien de plus, pour l’instant.

- « La laisser au vent. » → **fin**

### indice

_Effet : retient « voile-lacher-indice »._

> Le tissu est neuf, le nœud aussi. Une voile vit deux ans ; celle-ci n’en a pas un. Quelqu’un la remplace, et la recopie à l’identique. De nuit, sans doute : le jour, on le verrait.

- « La laisser au vent. » → **fin**

### etat

_Effet : reprend 1 × « La septième voile, l’état juste », retient « onze-lache », +20 XP, termine la quête « Les onze états », retient « fin-onze-etats-lache »._

> Tu attaches l’état juste au garde-fou, à côté de la voile de Bastien, et tu ouvres le nœud. Le vent l’arrache d’un coup. Quelque part, un pilote la lira avant de passer le Calme. Personne ne la lui aura imposée.

- « Rester un peu. » → **fin**

### liste-lachee

_Effet : reprend 1 × « La liste de l’an cinquante », reprend 1 × « Tissu à voile », fait passer 4 moments, retient « liste-lachee », +40 XP, termine la quête « Les voiles dormantes », retient « fin-voiles-dormantes-lachee »._

> Tu recopies les trois cent douze noms, un par un, toute une journée. Bastien te regarde faire, sans un mot. Puis tu ouvres la main, et la liste de l’an cinquante part avec le vent. Demain, le Registre la comptera : elle ne dort plus.

- « Rester un peu. » → **fin**

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Pain de nuage : farine d’en bas, levain d’en haut, et beaucoup de patience, parce qu’ici rien ne cuit comme il faut. » Dessous, d’une autre main : « Menteuse. Il ne lève jamais. »

- « La garder, pour la recopier. » → **fin** _(retient « voile-marches-1-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-marches-1-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Si je les attache, je fais un livre. Un livre a une couverture, une couverture a un propriétaire. » Une des quatre réponses d’Aerys, recopiée par une main d’enfant, avec une faute à « propriétaire ».

- « La garder, pour la recopier. » → **fin** _(retient « voile-marches-2-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-marches-2-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Le Conseil des Vents a voté hier. Sur quoi ? Personne ne sait. Pour ou contre ? Ils ont voté de revoter. » Signé : un citoyen libre, et fatigué.

- « La garder, pour la recopier. » → **fin** _(retient « voile-marches-3-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-marches-3-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> En Common, d’une main de Ferros : « Je cherche ma sœur, montée ici il y a six ans. Elle s’appelle Ilse. Elle avait peur du vide. » Dessous, une autre main : « Elle n’en a plus peur. Elle vole à Mistral. »

- « La garder, pour la recopier. » → **fin** _(retient « voile-marches-4-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-marches-4-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> Une bande grise, toute neuve, qui vient d’en bas : « Joran, huit ans. » Tu sais d’où elle vient. Tu l’as lâchée toi-même.

- « La garder, pour la recopier. » → **fin** _(retient « voile-nom-1-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-nom-1-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> Une bande grise, qui vient d’en bas : « Hélie, six ans. » Un enfant d’Aetherhaven court derrière, et s’arrête quand tu la prends.

- « La garder, pour la recopier. » → **fin** _(retient « voile-nom-2-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-nom-2-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> Quatre mots, d’une main appliquée, sur un tissu bleu : « Ceci n’est pas beau. » Le reste a été coupé. Quelqu’un a gardé le début de la septième voile, et rien d’autre.

- « La garder, pour la recopier. » → **fin** _(retient « voile-quai-1-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-quai-1-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> « Si tu attrapes ceci au-dessus de Cloudrest, c’est que le vent t’aime autant que moi. Reviens jeudi. » Aucun nom. Il y a beaucoup de jeudis.

- « La garder, pour la recopier. » → **fin** _(retient « voile-quai-2-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-quai-2-attrapee »)_

## Une voile

_Dans le vent d’Aetherhaven_

Commence par : « voile »

### voile

> Un tissu de pilote, couvert de chiffres : des vitesses, des masses, des heures. En bas, au crayon : « Le Calme est mince à l’aube. Monte à l’aube. » Le crayon a appuyé si fort qu’il a troué la toile.

- « La garder, pour la recopier. » → **fin** _(retient « voile-quai-3-attrapee », donne 1 × « Une voile attrapée »)_
- « La laisser repartir. » → **fin** _(retient « voile-quai-3-attrapee »)_

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

## Yel’Dara

_La seconde tête du compte_

Commence par : « edda » _(si quête « Ce qui n’a plus lieu » en cours)_ _(sans repère « yel-edda »)_, sinon « total » _(si quête « La halte muette » en cours)_ _(sans repère « muette-yel »)_, sinon « ahm » _(si quête « Les deux nombres » en cours)_ _(sans repère « ahm-yel »)_, sinon « accueil »

### accueil

> Une vieille femme voilée de bleu, assise près des jarres, les mains vides sur les genoux. Ses lèvres remuent sans bruit. — Je ne verse pas. J’entends. Chaque matin, le nombre de la Gardienne, et je le garde dans une seconde tête.

- « Combien de jours gardes-tu ? » → jours
- « Pourquoi deux têtes ? » → deux
- « Je te laisse compter. » → **fin**

### jours

> — Mille quatre cents de mémoire ferme. Au-delà, je récite ce que ma devancière m’a récité, qui récitait la sienne. Au jour le jour, c’est exact. Au siècle, ça s’effrite.

- « Pourquoi deux têtes ? » → deux
- « Je te laisse compter. » → **fin**

### deux

> — Parce qu’une fois, pendant la Sèche, quelqu’un a demandé à la Gardienne de se taire deux matins. Elle s’est tue. Deux nombres sont morts avec elle. Depuis, on est deux à les porter.

- « Combien de jours gardes-tu ? » → jours
- « Je te laisse compter. » → **fin**

### edda

_Effet : retient « yel-edda »._

> — La dame en gris est venue me demander un matin. Un seul. Il y a trente ans, une étrangère seule a quitté la Marche à pied, vers une halte morte. Elle voulait le compte du matin d’après.

- « Quel nombre ? » → nombre

### nombre

> Yel’Dara ferme les yeux et descend les jours, un par un, jusqu’à celui-là. — Onze. Dix des nôtres, et la ration de l’étrangère. Je le lui ai dit. Elle est restée assise longtemps. Puis elle a demandé l’eau de l’errance.

- « Merci, Yel’Dara. » → **fin**

### total

_Effet : retient « muette-yel »._

> — Le total ? Onze mille quatre cents, dit à l’arrivée au point vingt-quatre. Il est faux : il manque deux jours. Ça, personne ne l’oublie. C’est même tout ce qu’on retient, quand on oublie le reste.

- « Merci, Yel’Dara. » → **fin**

### ahm

> — Ahm’Ras. Il croit les avoir. Peut-être. Neth’Sara a voulu deux têtes pour qu’on ne puisse plus demander. Si ces nombres reviennent, on demandera encore qui avait raison, elle ou Orr’Dahn. On ne le saura pas mieux. On souffrira plus.

- « Et s’il te les donnait, à toi seule ? » → confier
- « Je comprends. » → **fin** _(retient « ahm-yel »)_

### confier

_Effet : retient « ahm-yel », retient « yel-propose »._

> — Je les entendrais. Je ne les dirais pas. Une seconde tête, c’est fait pour ça.

- « Je le lui dirai. » → **fin**

## Ysha’Ren

_Seize ans_

Commence par : « parle » _(si quête « Sept nuits le même rêve » en cours)_ _(sans repère « ysha-parle »)_, sinon « accueil »

### accueil

> L’adolescente remonte son foulard sur ses avant-bras. — Tu es l’étranger qui pose des questions. Pose-les à ma mère : c’est elle qui répond, ici.

- « Je te laisse. » → **fin**

### parle

> Elle se redresse ; le foulard glisse, et sa peau, aux avant-bras, est claire et dépolie, presque du verre. — Le rêve, c’est toujours le même. Je marche dans le verre, seule, et je n’ai pas soif.

- « Et toi, que veux-tu ? » → veut

### veut

_Effet : retient « ysha-parle »._

> — Je ne sais pas. Personne ne me l’a demandé. Ma mère veut que je me cache. La Marcheuse du Souffle voudrait que j’y aille. Moi, je voudrais que quelqu’un me le demande. Toi, tu viens de le faire.

- « Je le dirai à ta mère. » → **fin**

## Ysolde Cent-Plis

_Greffière du Registre des Voiles_

Commence par : « liste » _(si quête « Les voiles dormantes » en cours)_ _(si l’on porte « La liste de l’an cinquante »)_, sinon « bande » _(si quête « Les noms qui montent » en cours)_ _(si repère « bande-vue »)_ _(sans repère « tiroir-vu »)_, sinon « accueil »

### accueil

> Une femme aux cheveux pâles, qui flottent un peu, plie un tissu en quatre sans le regarder. — Le Registre des Voiles. On compte ce qui passe : combien de fois une voile a été attrapée, recopiée, relâchée. Vous en apportez une ?

- « Que comptez-vous, au juste ? » → compter
- _(si repère « tiroir-vu »)_ « Revoir le tiroir des voiles sans auteur. » → questions
- _(si repère « bastien-rencontre »)_ _(sans repère « ysolde-aerys »)_ « Racontez-moi Aerys. » → aerys
- « Au revoir. » → **fin**

### aerys

> Ysolde pose son tissu. — Aerys Haute-Foudre a trouvé comment fendre le cristal, et elle a écrit le Lever en sept voiles. Les six premières disent comment monter. La septième, comment redescendre vivant. Elle commence par « Ceci n’est pas beau ».

- « Et ensuite ? » → aerys-2

### aerys-2

_Effet : retient « ysolde-aerys », retient le Récit « La septième voile », +10 XP._

> — On a recopié les six belles, pas la septième. Il est tombé neuf mille quatre cents personnes en trente et un ans. Quatre fois, on lui a demandé de l’imposer. Quatre fois, elle a refusé, et elle l’a recopiée à la main, chaque jour, jusqu’à sa mort.

- « Merci, Ysolde. » → **fin**

### compter

> — Les passages. Une voile vit deux ans, le temps d’un tissu. Si personne ne la recopie, elle tombe et pourrit dans un jardin. Si on la recopie, elle repart. Certaines passent quarante mille fois par an. D’autres dorment.

- « Elles dorment ? » → dorment
- _(sans repère « raconte-ysolde »)_ « Je voudrais vous confier une histoire. » → raconte-neutre 📖 raconter un Récit : la-dedicace → raconte-special ; mysteres, familles → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### dorment

> — Quatre voiles ne sont plus recopiées depuis 2659 : les listes de la Pluie, des noms, par années. Nous n’en gardons que les premiers mots. La quatrième commence par « Et pour l’an cinquante ».

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### bande

> Ysolde voit la bande grise dans ta main, et pose son tissu. — Ama, six ans. Vous l’avez aussi. Venez.

- « La suivre. » → tiroir

### tiroir

_Effet : retient « tiroir-vu », reprend 1 × « Une bande de tissu »._

> Elle ouvre un tiroir long, sous le lutrin, et glisse ta bande avec les autres : des dizaines, rangées par date. — Les voiles sans auteur. Six noms, toujours les mêmes, qui reviennent : Ama, Joran, Sefi, Nilo, Brune, Hélie.

- « D’où viennent-elles ? » → origine
- « Qui les a écrites ? » → main
- « Quelqu’un d’autre les a vues ? » → premiere
- « Qui descend en bas ? » → descendre

### questions

> Ysolde rouvre le tiroir et attend, une bande entre les doigts.

- « D’où viennent-elles ? » → origine
- « Qui les a écrites ? » → main
- « Quelqu’un d’autre les a vues ? » → premiere
- « Qui descend en bas ? » → descendre

### origine

> — D’un seul point. Les vigies notent où on les attrape : toujours au-dessus de la Colonne, le grand courant qui monte du couchant. Dessous, d’après les vieilles cartes, passe une voie de l’Ancien Monde. Personne n’est allé voir.

- « Autre chose. » → questions
- « Merci, Ysolde. » → **fin**

### main

> — On ne sait pas. L’encre a bu la cendre : on lit les noms, plus la main. Six enfants, et personne pour les réclamer. Je les range quand même. On ne sait jamais qui viendra les chercher.

- « Autre chose. » → questions
- « Merci, Ysolde. » → **fin**

### premiere

_Effet : retient « edda-registre-voiles »._

> Elle tourne vers toi le registre des consultations : « E. Varn », d’une écriture serrée. — Une dame en gris. Elle a recopié les six noms, très vite, et elle a demandé qui descend. Je lui ai dit la vérité : personne.

- « Autre chose. » → questions
- « Merci, Ysolde. » → **fin**

### descendre

> — La Compagnie Vire-Nuée a une route déclarée, et le Bas n’en est pas une. Les Ailes Noires descendent quand on les paie, au Perchoir. Et Vessin, le voilier, a un cadre qui n’attend qu’un cristal de plus.

- « Autre chose. » → questions
- « Merci, Ysolde. » → **fin**

### liste

> Ysolde déplie la liste avec des gants. — L’an cinquante. Le Registre la gardera à l’abri. Elle ne passera plus, mais elle ne s’effacera pas non plus. C’est ce que nous savons faire de mieux.

- « La lui confier. » → liste-gardee _(reprend 1 × « La liste de l’an cinquante », +30 XP, termine la quête « Les voiles dormantes », retient « fin-voiles-dormantes-registre »)_
- « Pas encore. » → accueil

### liste-gardee

> Elle la range dans un tiroir à part, sans étiquette. — Je n’écrirai rien dessus. Ceux qui la chercheront sauront.

- « Merci, Ysolde. » → **fin**

### raconte-special

_Effet : retient « raconte-ysolde », +15 XP._

> Ysolde pose son tissu. — Chez nous, on ne l’effacerait pas. On la compterait. Une correction par nuit, depuis des années : c’est une voile qui passe. Je l’inscris.

- « Merci, Ysolde. » → **fin**

### raconte-touche

_Effet : retient « raconte-ysolde », +10 XP._

> Ysolde écrit en même temps que tu parles, sans regarder sa main. — Elle passera. Je le sens aux histoires qui ont des noms dedans.

- « Merci, Ysolde. » → **fin**

### raconte-neutre

_Effet : retient « raconte-ysolde », +5 XP._

> — Bien dite. Ysolde la note quand même, dans la marge d’un registre. — Tout ce qui passe ici est compté.

- « Merci, Ysolde. » → **fin**

## Zélie Chantebrise

_Aéroprêtresse du Grand Courant_

Commence par : « listes » _(si quête « Les voiles dormantes » en cours)_ _(sans repère « dome-indice »)_, sinon « accueil »

### accueil

> Une prêtresse en robe blanche, des rubans bleus aux poignets, écoute le vent passer sous le dôme. — Le Temple du Grand Courant. Ceux qui partent y entrent ; ceux qui restent viennent écouter. Vous écoutez ?

- « Le Grand Courant ? » → courant
- _(si repère « tiroir-vu »)_ « Ceux qui tombent, aussi ? » → tombent
- « Écouter un moment. » → ecoute
- « Au revoir. » → **fin**

### courant

> — Le vent qui fait le tour du monde et ne s’arrête jamais. Les morts y entrent, et voyagent. Les Aériens disent qu’on les entend, les soirs de grand vent, dans les cristaux.

- « Autre chose. » → accueil
- _(sans repère « raconte-zelie »)_ « Je voudrais vous confier une histoire. » → raconte-neutre 📖 raconter un Récit : voix-ecorce → raconte-special ; morts → raconte-touche ; autres → raconte-neutre
- « Au revoir. » → **fin**

### tombent

> Zélie baisse la voix. — Ceux qui tombent aussi. Pendant la Pluie, neuf mille sont entrés dans le Courant ; moins que la cendre n’en aurait pris en bas. C’est vrai, et je ne le dis jamais devant les familles. Ça ne console personne.

- « Autre chose. » → accueil
- « Au revoir. » → **fin**

### ecoute

_Effet : +5 PV._

> Tu écoutes. Le vent passe sous le dôme, fait chanter les cristaux, et repart. Pendant un instant, tu ne penses à rien. C’est rare.

- « Remercier Zélie. » → **fin**

### listes

_Effet : retient « dome-indice »._

> Zélie lève les yeux vers le dôme. — Les listes de la Pluie ? On les lisait, autrefois, les soirs de grand vent, pour que chaque nom entre dans le Courant. On a cessé quand les familles ont cessé de venir. Les tissus usés, on les cousait dans la doublure.

- « Je peux chercher ? » → chercher

### chercher

> — Rien ne se jette, sous le vent. Cherchez. Au-dessus de la stèle, là où le tissu est le plus vieux.

- « Merci, Zélie. » → **fin**

### raconte-special

_Effet : retient « raconte-zelie », +15 XP._

> — Chez vous, les morts restent dans les arbres ; chez nous, ils voyagent dans le vent. Zélie sourit. — Je me demande s’ils se croisent, quand le vent passe dans les feuilles.

- « Merci, Zélie. » → **fin**

### raconte-touche

_Effet : retient « raconte-zelie », +10 XP._

> Zélie ferme les yeux. — Celle-là, je la dirai au Courant, ce soir. Il la portera.

- « Merci, Zélie. » → **fin**

### raconte-neutre

_Effet : retient « raconte-zelie », +5 XP._

> Zélie écoute, les mains ouvertes. — Merci. Le vent l’a entendue aussi.

- « Merci, Zélie. » → **fin**
