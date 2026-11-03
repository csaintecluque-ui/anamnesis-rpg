# Le Livre des Échos (jalon 3, étape 3 ; construite le 2026-11-02, textes à valider)

Plan : `docs/gdd/jalon-3.md`. Code : `src/rules/echos.ts` ; données : `src/data/echos.json` (les Échos),
`src/data/recits.json` (leurs Récits). Canon : `docs/univers/memoire.md` [E2].

## Le principe

- **Douze Échos cachés** dans les lieux déjà construits. Ils se voient comme des silhouettes à demi transparentes ;
  **certains ne viennent que la nuit** (ou que le jour) : la carte se reconstruit quand le moment change.
- **Les recueillir** : on touche l'Écho, on l'écoute jusqu'au bout. XP (10 à 20), une page du **Livre des Échos**
  (onglet « Échos » du journal : le texte, le lieu, le moment, le type), et parfois un **Récit**.
- **Les quatre types du canon** [E2] : silencieux, complet, interactif, maudit. **Un Écho maudit piège les vivants** :
  pour l'écouter jusqu'au bout, un jet d'Érudition (12) ; raté, sa main ne lâche pas : −8 PV, puis on s'arrache.
- **L'emprise** (canon : le danger, c'est « l'addiction à revivre le passé ») : un Écho recueilli peut être **revécu**.
  Depuis le chantier 1 de la feuille de route (2026-11-03), c'est une vraie tentation : un **souvenir vif**, **+3 aux
  jets de la compétence de l'Écho** jusqu'au prochain sommeil (un seul à la fois, le dernier revécu) ; mais un quart de
  journée perdu, et **l'emprise monte de 2**, quand une nuit ne la desserre que d'un cran. **À 3, −1 à tous les jets de
  dé ; à 5, −2.** Revivre une fois par jour, c'est gagner aujourd'hui et payer dans trois jours. Le Champignon-Mémoire
  la remet à zéro (`docs/gdd/memoire.md`). Liane, qui sait ce qu'oublier coûte, désapprouve.
- **Chaque Écho, sa compétence** (`don` dans `echos.json`, une par Écho, les treize compétences) : le jeudi ordinaire,
  Investigation ; la lumière, Résonance ; le voyageur, Survie ; la graveuse, Artisanat ; les premiers Nacelliers,
  Athlétisme ; le vote sous la pluie, Diplomatie ; le Puits Trois, Médecine ; le marché d'avant, Subterfuge ; la ligne
  effacée, Érudition ; les soixante-douze heures, Discrétion ; la Cendrière, Mêlée ; le train qui ne s'arrête pas, Tir ;
  les Trois Cents, Commandement.
- **Des Échos qu'on ne voit qu'avec une bonne mémoire** (`memoire`) : Mémoire 4 pour la ligne effacée, le marché
  d'avant et la première graveuse ; Mémoire 5 pour le train qui ne s'arrête pas et le vote sous la pluie.
- **Le pourquoi des Surgeons reste un mystère** : les Échos montrent le jeudi ordinaire, la lumière, les soixante-douze
  heures (« Ils ont répondu »), jamais la cause.

## Les douze Échos

| Écho | Lieu | Moment | Type | Récit |
|---|---|---|---|---|
| Un jeudi ordinaire | Gare Engloutie, le quai | jour | complet | « Un jeudi ordinaire » |
| La lumière | Gare Engloutie, le quai | nuit | silencieux | — |
| Le voyageur sans visage | Gardebois, le chemin de l'est | nuit | interactif | — |
| La première graveuse | Bosquet des Échos | jour | complet | — |
| Les premiers Nacelliers | La Grande Nacelle | jour | complet | — |
| Le vote sous la pluie | Hautes Ramures | nuit | complet | — |
| Le Puits Trois | Forges-Basses, le puits | jour | complet | « Le Puits Trois » |
| Le marché d'avant | Marché des Cendres | nuit | complet | — |
| La ligne effacée | Manufactures-Moyennes | nuit | silencieux | — |
| Les soixante-douze heures | Triage des Cendres | nuit | complet | « Les soixante-douze heures » |
| La dernière chanson de la Cendrière | la Cendrière | toujours | maudit | — |
| Le train qui ne s'arrête pas | Forges-Basses, la vieille ligne | nuit | complet | — |

## Ancrages et propositions

- Canon : le 14 mars 2024, « un jeudi ordinaire », les Surgeons ouverts sans cause, puis le feu nucléaire « par
  réaction », soixante-douze heures [NOTION, Canon §2] ; le Puits Trois et ses castes [NOTION] ; le Bosquet des Échos
  [NOTION] ; le Marché des Cendres « érigé sur les ruines » ; un secret de Noam (un nom effacé) [NOTION, Studio].
- **À valider** : les scènes elles-mêmes (la première graveuse, les premiers Nacelliers, le vote sous la pluie, le
  voyageur sans visage, la Cendrière, le train qui ne s'arrête pas) et les trois Récits.

## Plus tard

D'autres Échos avec chaque nouvelle ville ; une récompense quand le livre d'une région est complet.
