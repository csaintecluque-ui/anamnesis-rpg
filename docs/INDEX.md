# Index de la documentation

Une ligne par fichier. Ne lis que ce qui sert à la tâche du jour.

- `JOURNAL.md` : état actuel, jalon en cours, prochaine étape (court). Historique : `archive/journal-AAAA-MM.md`.
- `STYLE.md` : fiche de style des visuels de la phase 2 (direction, palette, formats, prompt commun) ; validée.
- `ASSETS.md` : plan des images de la phase 2 et journal de chaque génération (date, outil, prompt, coût, fichier).
- `DIALOGUES.md` : textes de tous les dialogues, générés par `npm run dialogues` (ne pas éditer à la main).
- `Lore/` : **lore canonique de Cyril, fait foi**, local seulement (jamais publié). Ouvrir le fichier précis
  indiqué par un code source ([E2], [N1]…) de `univers/sources.md`, pas le dossier entier.

## `univers/` : synthèse du lore, avec statuts (canon, à valider, à arbitrer, rejeté)

- `sources.md` : règle « `Lore/` fait foi », légende des statuts, table des codes sources → fichiers de `Lore/`.
- `monde.md` : concept, époque, continents, phénomènes, cinq lois, interdits, technologie.
- `magie.md` : cristaux, sources, limites (non liée à la mémoire).
- `memoire.md` : Mémoire Vivante, Échos, Gardiens de Mémoire, Kael, mémoire dans chaque culture.
- `lieux/nations.md` : 7 continents, nations, capitales, lieux notables.
- `lieux/gardebois.md` : Marché des Lisières, le hub (validé).
- `lieux/gare-engloutie.md` : l'extérieur de la quête ; contenu détaillé validé.
- `factions.md` : organisations, alliances, conflits en cours.
- `religions.md` : les sept religions.
- `peuples.md` : peuples par nation, faune utile à la tranche.
- `personnages/historiques.md` : figures historiques, entités légendaires, prophéties.
- `personnages/contemporains.md` : dirigeants et figures de l'AN 3000.
- `personnages/pnj.md` : héros, Ilyane, Tobias, Ingrid, ennemis (validés).
- `chronologie.md` : dates de référence.
- `ton.md` : ton, public 8–15 ans, sonorités des noms par nation.
- `zones-floues.md` : 21 contradictions du canon, décisions de Cyril.
- `propositions.md` : propositions sans autre fichier (quête, attribut Mémoire), propositions rejetées.

## `gdd/` : conception du jeu (systèmes, chiffres, équilibrage)

- `decisions.md` : état du GDD, principe d'adaptation du JDR, décisions validées.
- `cahier-des-charges.md` : brief initial de Cyril (systèmes attendus, 8 points du jalon 1).
- `attributs.md` : 7 attributs, valeurs dérivées (PV, Défense, PA, Charge, Récits).
- `competences.md` : 12 compétences, résolution des tests (d20, seuils de dialogue).
- `creation.md` : origine, dons, règles de l'écran de création.
- `memoire.md` : mécanique signature (Échos, Récits, choix) et son implémentation.
- `combat.md` : règles du combat, arène, IA, limites actuelles.
- `tranche-verticale.md` : déroulé de la quête « Le Dernier Train » et ses 4 résolutions.
- `exploration.md` : cartes Tiled, tuiles, déplacement, interactions.
- `dialogues.md` : format JSON, conditions, effets, contrôles.
- `inventaire.md` : objets, Fers, équipement, troc.
- `progression.md` : seuils d'XP, montée de niveau.
- `sauvegarde.md` : emplacements, format, export/import, versions v1 à v6.
- `interface.md` : HUD, menu pause, options, PC (netteté, raccourcis, plein écran).
