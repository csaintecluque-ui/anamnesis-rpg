# Tranche verticale : déroulé (validé)

Cahier des charges du jalon 1 : `docs/gdd/cahier-des-charges.md`. Lieux : `docs/univers/lieux/gardebois.md`, `docs/univers/lieux/gare-engloutie.md`.

**Contexte canon** : une des Trois Failles vient de s'ouvrir près de la frontière Ferros–Verdantis [E10]. Selon la loi de la Mémoire Vivante, abîmer un Écho le fait se multiplier et provoque une **maladie mémorielle** [E2].

1. **Création du personnage** : un apprenti Gardien de Mémoire arrive à Gardebois [N1], au **Marché des Lisières**.
2. **Ilyane Voix-d'Écorce**, Gardienne de Mémoire, explique que des habitants revivent la Grande Chute en plein jour.
   - **Test d'attribut** : avec Perception ≥ 4, on remarque qu'Ilyane elle-même en est atteinte.
3. **Tobias Cendrefer**, marchand de Ferros, vend du matériel et des rumeurs.
   - **Test de compétence** : avec Diplomatie rang ≥ 2, on obtient le laissez-passer du chantier au lieu de le payer.
   - Troc et inventaire.
4. **La Gare Engloutie** : l'équipe de l'ingénieure **Ingrid Brisefer** fore sous la gare pour atteindre la faille.
   - Le forage déchire un Écho : la foule du « dernier train » de l'Ancien Monde, celui qui a pu partir.
5. **Résolutions** :
   - **Parole** : convaincre Brisefer (Diplomatie ou Commandement), ou lui raconter le Récit du savant Corvan (piste B).
   - **Combat** : le forage a réveillé un Golem de Ferraille [E2] ; deux Rôdeurs-Épine [E8] rôdent autour. Les vaincre et arrêter la foreuse.
   - **Discrétion** : entrer de nuit (Discrétion) et saboter la foreuse (Artisanat).
   - **Mémoire** : entrer dans l'Écho interactif, recueillir son Récit et l'apaiser (piste A).
6. **Retour à Gardebois** : la maladie recule, ou non. On gagne un niveau.
   - Révélation optionnelle : les Réveilleurs [E10] financent la prospection.

État au 2026-11-01 : les quatre résolutions sont jouables.

**Discrétion (validé par Cyril le 2026-11-01 : textes, difficulté 10, fermeture de la voie après un échec)** : on touche la foreuse (dialogue `src/data/dialogues/foreuse.json`), on choisit
d'attendre la nuit, puis deux jets de dé, difficulté 10 (moyen) : **Discrétion** pour atteindre la foreuse,
**Artisanat** pour la saboter. Réussite : la quête se termine, même récompense que les autres voies (40 XP, 30 Fers).
Échec à l'un des deux jets : on est surpris, cette voie se ferme (la foreuse est gardée) et Ingrid le sait quand on
lui parle ; la parole, le Récit et le combat restent ouverts. Chance des deux jets pour un personnage sans
entraînement (attribut 3, rang 0) : 55 % chacun, soit 30 % en tout ; pour un spécialiste (attribut 4, rang 3) :
75 % chacun, soit 56 %.
