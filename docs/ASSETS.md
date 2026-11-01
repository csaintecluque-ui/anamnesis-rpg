# Visuels générés — plan et journal

Style imposé à chaque prompt : `docs/STYLE.md`. Aucune génération sans le feu vert de Cyril (`CLAUDE.md` §5).

## Plan de la phase 2 (proposition du 2026-11-01, en attente du feu vert)

Les visuels provisoires actuels (`scripts/tiles-def.mjs`, `public/tiles/placeholder.png`) sont remplacés un par un ;
le jeu reste jouable à chaque étape.

| Lot | Contenu | Images |
|---|---|---|
| **0. Pilote** | Herbe (tuile), Arbre (décor), Héros (personnage), Ilyane (portrait). Sert à valider le style, la découpe et la réduction à 64 px avant de lancer le reste | 4 |
| 1. Sols | Herbe sombre, chemin, planches, eau, pont, fleurs, rail, quai | 8 |
| 2. Décors | Tronc d'Arbre-Titan, maison sur pilotis, étal, caisses, lanterne, rocher, panneau, wagon, foreuse, faille, tente, Écho (sur la carte) | 12 |
| 3. Personnages | Ilyane, Tobias, Ingrid, Golem de Ferraille, Rôdeur-Épine (le héros est dans le pilote) | 5 |
| 4. Portraits de dialogue | Tobias, Ingrid, l'Écho du dernier train (Ilyane est dans le pilote) | 3 |
| 5. Illustrations | Écran titre ; intérieur de l'Écho du dernier train | 2 |
| **Total** | | **34 images** |

- **Essais** : en comptant environ deux essais par image retenue, prévoir **70 générations environ**.
- **Outil** : Higgsfield, en ligne de commande (`higgsfield`, installé le 2026-11-01 dans `~/.local`), espace
  « Private », formule Plus, **110 crédits** au 2026-11-01. **Compte en période d'essai** : Higgsfield n'y autorise
  que le connecteur MCP (`only_mcp_usage_on_trial_is_available`, 2026-11-01, aucun crédit débité). Il faut donc
  ajouter le connecteur `https://mcp.higgsfield.ai/mcp` dans Claude (Paramètres → Connecteurs), ou sortir de l'essai.
- **Images brutes** : gardées en local dans `assets/raw/` (exclu du dépôt) ; seules les versions réduites sont publiées.
- **Modèle** : **GPT Image 2.5** (`gpt_image_2_5`) : fond **transparent natif** (pas de détourage), le moins cher.
  Qualité moyenne en 1k pour ce qui finit en 64 px ; haute qualité pour les portraits et les illustrations.
- **Coût estimé** (`higgsfield generate cost`, 2026-11-01), essais compris :

| Lot | Réglage | Prix par essai | Essais | Crédits |
|---|---|---|---|---|
| 0. Pilote | 3 images en qualité moyenne 1k, 1 portrait en haute qualité 1k | 0,5 / 1,5 | 6 + 2 | **6** |
| 1 à 3. Sols, décors, personnages | qualité moyenne 1k | 0,5 | 50 | 25 |
| 4. Portraits | haute qualité 1k | 1,5 | 6 | 9 |
| 5. Illustrations | haute qualité 2k | 2,75 | 4 | 11 |
| **Total** | | | **70** | **≈ 51 crédits** (sur 110) |

- **Code à prévoir** : un script de découpe et de réduction (images → planche de tuiles), et l'affichage d'un portrait
  dans le panneau de dialogue (lot 4).
- **Hors plan** : animations (marche, attaque), sons, autres lieux ; à proposer après ce lot.

## Journal des générations

| Date | Outil | Prompt | Coût | Fichier produit |
|---|---|---|---|---|
| — | — | — | — | — |
