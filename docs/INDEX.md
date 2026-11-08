# Index de la documentation

Une ligne par fichier. Ne lis que ce qui sert à la tâche du jour.

- `../AGENTS.md` : consignes pour Codex et les autres agents (renvoie à `CLAUDE.md`, qui fait foi ; ce que Canopéa laisse à Ironheart).

- `JOURNAL.md` : état actuel, jalon en cours, prochaine étape (court). Historique : `archive/journal-AAAA-MM.md`.
- `a-essayer.md` : la liste de Cyril, ce qu'il aura à essayer sur PC, chantier par chantier.
- `qualite.md` : vérification qualité de tout le jeu (2026-11-02) : ce qui a été testé, corrigé, laissé, à trancher.
- `STYLE.md` : fiche de style des visuels de la phase 2 (direction, palette, formats, prompt commun) ; validée.
- `ASSETS.md` : plan des images de la phase 2 et journal de chaque génération (date, outil, prompt, coût, fichier) ; la musique (2026-11-08) ; le plan des images de la mise en beauté (2026-11-08).
- `DIALOGUES.md` : textes de tous les dialogues, générés par `npm run dialogues` (ne pas éditer à la main).
- `Lore/` : ancienne version du lore de Cyril (le Notion « ANAMNESIS » fait foi), local seulement (jamais publié). Ouvrir le fichier précis
  indiqué par un code source ([E2], [N1]…) de `univers/sources.md`, pas le dossier entier.

## `univers/` : synthèse du lore, avec statuts (canon, à valider, à arbitrer, rejeté)

- `sources.md` : règle « le Notion fait foi », publication dans « Anamnesis — le jeu », statuts, codes sources.
- `monde.md` : concept, époque, continents, phénomènes, cinq lois, interdits, technologie.
- `magie.md` : cristaux, sources, limites (non liée à la mémoire) ; la magie dans le jeu.
- `memoire.md` : Mémoire Vivante, Échos, Gardiens de Mémoire, Kael, mémoire dans chaque culture.
- `lieux/nations.md` : 7 continents, nations, capitales, lieux notables.
- `lieux/gardebois.md` : Marché des Lisières, le hub (validé).
- `lieux/gare-engloutie.md` : l'extérieur de la quête ; contenu détaillé validé.
- `lieux/villes.md` : dix grandes villes sur les sept continents (quartiers, maisons, personnages) ; plan validé.
- `lieux/canopee.md` : Canopéa, première ville construite (provisoire) ; validé.
- `lieux/ironheart.md` : Ironheart (chapitre 3), canon résumé et ville construite ; validé.
- `lieux/voies-endormies.md` : les trois voies endormies à explorer, leurs Échos, les tableaux des contrats ; validé.
- `lieux/sept-portes.md` : Sept-Portes, la cité de Kael (chapitre 4) : canon résumé, propositions ; validé.
- `lieux/aetherhaven.md` : Aetherhaven, la cité flottante (chapitre 5) : canon relu (voiles, Calme, Ailes Noires), lieux, habitants, guildes ; validé, construit.
- `lieux/coralia.md` : Coralia, la cité du corail (chapitre 6) : canon relu (Thalassocratie, légendes, Profondeurs Chuchotantes), lieux, habitants, guildes ; validé, construit.
- `lieux/marche-mere.md` : Marche-Mère, la ville qui marche (chapitre 7) : canon relu (fiche de la Communion, légendes, Thryn'vek), lieux, habitants, guildes, les haltes ; validé, construit.
- `lieux/khrysos.md` : Khrysos, le Cœur de Cristal (chapitre 8) : canon relu (fiche de Glacialis, les trois légendes), lieux, habitants, guildes, le froid et les faces ; validé, construit.
- `factions.md` : organisations, alliances, conflits en cours ; factions et guildes du jeu (validées).
- `objets.md` : ce qu'on dit des objets (lignes de lore de l'inventaire) ; validé.
- `quetes.md` : histoire principale « Les voies endormies » et quêtes des villes ; validé.
- `religions.md` : les sept religions.
- `peuples.md` : peuples par nation, faune utile à la tranche.
- `personnages/historiques.md` : figures historiques, entités légendaires, prophéties.
- `personnages/contemporains.md` : dirigeants et figures de l'AN 3000.
- `personnages/pnj.md` : héros, Ilyane, Tobias, Ingrid, ennemis (validés).
- `personnages/heros.md` : la mémoire du héros, son Écho personnel (deux pistes) ; à valider.
- `chronologie.md` : dates de référence.
- `ton.md` : ton du corpus, ton du jeu (dark fantasy pour adultes, charte), sonorités des noms par nation.
- `zones-floues.md` : 37 contradictions du canon, décisions de Cyril.
- `propositions.md` : propositions sans autre fichier (quête, attribut Mémoire), propositions rejetées.

## `gdd/` : conception du jeu (systèmes, chiffres, équilibrage)

- `decisions.md` : état du GDD, principe d'adaptation du JDR, décisions validées.
- `cahier-des-charges.md` : brief initial de Cyril (systèmes attendus, 8 points du jalon 1).
- `attributs.md` : 7 attributs, valeurs dérivées (PV, Défense, PA, Charge, Récits).
- `economie.md` : le chantier 6 : usure et réparations, cristal à réaccorder, laissez-passer d'une semaine, voies qui s'épuisent, réputation au-delà de 25, dons et traits, bilan des Fers.
- `ecriture.md` : les règles d'écriture du chantier 5 : tics comptés, monnaie, voix des marchands et du héros, scènes reprises.
- `competences.md` : 12 compétences et la Résonance, résolution des tests (d20, seuils de dialogue), la courbe des tests par chapitre et le rôle de chaque compétence (chantier 2).
- `creation.md` : origine, dons, règles de l'écran de création.
- `memoire.md` : mécanique signature (Échos, Récits, choix) et son implémentation.
- `combat.md` : règles du combat, arène, IA ; mort réelle, effets, ennemis variés, butin, bestiaire, compagnons ; le combat refait du chantier 3 (PA, visée, résistance, capacités, IA, force par chapitre) et sa simulation.
- `tranche-verticale.md` : déroulé de la quête « Le Dernier Train » et ses 4 résolutions.
- `exploration.md` : cartes Tiled, tuiles, déplacement, interactions.
- `dialogues.md` : format JSON, conditions, effets, contrôles.
- `inventaire.md` : objets, Fers, équipement, troc ; le sac en onglets et la fiche de chaque objet.
- `progression.md` : seuils d'XP, montée de niveau.
- `sauvegarde.md` : emplacements, format, export/import, sauvegarde à chaque lieu, versions v1 à v16, la mort à deux boutons.
- `interface.md` : HUD, menu pause, options, PC (netteté, raccourcis, plein écran).
- `animation.md` : marche animée des personnages, méthodes 2D et 3D, comparaison du pilote.
- `temps.md` : le temps (calendrier du canon, matin/midi/soir/nuit), la nuit, les auberges, le repos gratuit ; validé.
- `magie.md` : la magie (cristaux au cou, compétence Résonance, PR, trois pouvoirs, « Un prêt de la Terre ») ; validée.
- `jalon-2.md` : le jalon 2 (phase 2, animation, avatars, contenu) ; fait et en ligne.
- `jeu-complet.md` : le jeu complet (ligne directrice, factions, ennemis, quêtes, activités, feuille de route) ; validé.
- `fil-directeur.md` : le fil directeur de Sept-Portes à la fin (sept caisses, la dame en gris, l'urgence) ; validé.
- `jalon-3.md` : le jalon 3, le cœur du jeu complet (combat, compagnons, Échos, veillées, ruines, contrats…) et son bilan ; fait et en ligne.
- `jalon-4.md` : le jalon 4, l'histoire principale continue ; chapitre 4 (Sept-Portes) en ligne.
- `chapitre-5.md` : chapitre 5, Aetherhaven : « Les noms qui montent », sept quêtes de ville, deux guildes ; validé, complet et en ligne.
- `chapitre-6.md` : chapitre 6, Coralia : « Ce que la mer rend », six quêtes de ville, deux guildes, les marées ; validé, complet et en ligne.
- `chapitre-7.md` : chapitre 7, Marche-Mère : « Ce qui n'a plus lieu », six quêtes de ville, deux guildes, la Marche et ses haltes ; validé, complet et en ligne.
- `chapitre-8.md` : chapitre 8, Khrysos : « Ce que la glace a pris » (la septième caisse), six quêtes de ville, deux guildes ; validé, complet et en ligne ; inventions validées.
- `chapitre-9.md` : la fin du jeu, « La voie sept » (le quai sept, Altavent, quatre fins, l'épilogue) ; tranchée par délégation de Cyril, construite, en ligne. **À ne pas lire avant d'avoir joué.**
- `histoire-prenante.md` : rendre l'histoire prenante (diagnostic, sept leviers, questions à Cyril) ; nourrit les chantiers 1 et 4.
- `feuille-de-route.md` : analyse et feuille de route de Cyril (2026-11-03) : sept chantiers avant tout nouveau chapitre ; en ligne.
- `test-2026-11-06.md` : le test en navigateur du 2026-11-06 : quinze bogues vérifiés et corrigés, cinq décisions pour Cyril (repos, dés, combat, rythme, le fil).
- `etude-2026-11-03.md` : l'étude complète de Cyril (87 améliorations, trois vagues) vérifiée contre le code ; la vague 1 faite, l'ordre de la vague 2, les questions ; en cours.
- `compagnons.md` : les compagnons (suivi, avis, départ), Liane et Boulon, leurs quêtes ; validé ; les apartés et les échanges du chantier 4.
- `veillees.md` : les veillées du conteur (publics, goûts, jet, chapeau, renommée, rumeurs et secrets) ; validé.
- `voies.md` : les voies endormies à explorer (plans, niveaux, bêtes, caisses, pièges) et les contrats des Gardiens ; validé ; la voie pacifiste (chantier 3).
- `echos.md` : le Livre des Échos (douze Échos cachés, types, emprise) ; textes à valider.
- `passe-sombre.md` : la passe sombre (marques du cristal, « Le registre du Puits Trois », morts et conséquences) ; validée.
- `villes.md` : gabarit d'une grande ville, systèmes communs, mécanique par ville, coûts, ordre ; validé.
- `carte-du-monde.md` : carte du monde, voyages, rencontres aléatoires en route ; validé.
- `figurants.md` : passants qui marchent et habitants à une ou deux répliques ; validé.
- `reputation.md` : réputation par ville (paliers, prix, conditions de dialogue) ; paliers validés.
- `factions.md` : réputation de faction, adhésion aux guildes ; rangs, sommets, rivalités, quêtes d'adhésion de Ferros, rangs des Gardiens (étape 7) ; validé.
- `son.md` : le son : les bruitages fabriqués par le code ; **la musique** (36 morceaux Higgsfield, faite et en ligne le 2026-11-08) : réduction, cache à la première écoute, chef d'orchestre, réglage, notes courtes, page d'écoute.
- `artisanat.md` : la forge de Ragna et les herbes de Sévane, les recettes ; validé.
