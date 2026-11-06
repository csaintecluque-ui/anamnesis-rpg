# Le fil directeur, de Sept-Portes à la fin (proposition du 2026-11-04, **validée par Cyril** le 2026-11-04 : « 2 oui, 3 c, 4 oui »)

Demande de Cyril (2026-11-04) : « Pour la fin, on va attendre toutes les villes. Mais il faut un vrai fil
directeur. » Le plan validé (`docs/gdd/jeu-complet.md`) donne la ligne (« Les voies endormies », les Réveilleurs, la
finale à la Faille) ; il manque ce que le joueur **poursuit** de ville en ville, et pourquoi c'est pressant.

Tout est construit sur du validé : la page du dernier départ (« Dernier départ, voie sept. Terminus : Altavent, sous
les Hauts de Zephyria. Déchargé : sept caisses plombées. Reçu : personne. »), la voix qui compte jusqu'à sept, les
sept continents [canon] et les Sept Portes, la dame en gris qui court après sa mère, Ilyane qui oublie, et la vérité
du héros (Cyril) : rien ne s'en dit avant Altavent. Le pourquoi des Surgeons reste un mystère.

## La question que le joueur porte

**« Où sont les sept caisses du dernier train, et qui les attend ? »** Puis, en dessous, la sienne : « Qui était
l'enfant à la fenêtre ? »

## Trois fils tressés

1. **Les sept caisses** (le monde). À Altavent, personne n'a signé pour elles. En trois mille ans, elles ont quitté
   le quai et se sont dispersées : **une par continent**, enfouie au bout d'une voie endormie. Le Registre des Mains
   de Sept-Portes en garde les chaînes, rompues. Les **Réveilleurs** [canon : ils veulent restaurer les technologies
   de l'Ancien Monde] les suivent, ville après ville, avec l'argent qu'ils confient à la dame en gris.
2. **La dame en gris** (le visage de l'adversaire). Edda Varn n'est pas une Réveilleuse : elle les utilise pour
   retrouver sa mère, montée dans ce train. On la croise dans chaque ville, avant ou après le héros : rivale, parfois
   alliée, jamais méchante. Les Réveilleurs restent derrière elle, sans visage (validé).
3. **Ce qui n'est pas à moi** (le héros). Un fragment de plus par ville, dans l'ordre inverse de l'oubli ; l'enfant
   à la fenêtre revient dans certains Échos, toujours sans un mot de plus.

**L'urgence** : chaque voie que les Réveilleurs rouvrent déchire ses Échos, et la maladie des souvenirs s'étend
(c'est elle qui a commencé à la Gare Engloutie). **Ilyane** en est le visage : elle oublie un peu plus à chaque caisse
qu'ils prennent avant le héros.

## Ce que chaque ville donne (dans l'ordre qu'on veut, pilier « liberté »)

Pour chacune des six villes à venir (Aetherhaven, Windspire, Porto-Lumina, Coralia, Marche-Mère, Khrysos ou
Auroraheim) :

- **une trace de caisse** : une rumeur, une chaîne du Registre, une voie endormie, et au terminus la caisse, ouverte
  ou non ; ce qu'on en fait (la garder, la confier aux Gardiens, à l'Ordre de l'Équilibre, la vendre, la laisser
  aux Réveilleurs) pèse sur la fin ;
- **un pas de la dame en gris** : ce qu'elle a trouvé de sa mère dans cette ville ;
- **un fragment** pour le héros, et une réplique d'Ilyane au retour ;
- le reste de la ville (quêtes secondaires, guildes, passants) **sans dépendre** du fil.

Les trois caisses des continents déjà joués (Verdantis, Ferros, Terminus) se rattachent à ce qui existe : la Gare
Engloutie (ce que la prospection cherchait sous la Faille), la clé de rouille bleue, la page du Fonds Muet. Une
courte quête au retour dans chaque ville le dirait (à écrire).

## La fin (on attend toutes les villes, décision de Cyril)

Quand le sort des sept caisses est connu, la voie sept s'ouvre jusqu'à **Altavent** : le train s'arrête pour le héros
une dernière fois (monter, ou rester et porter ce qu'il sait). Puis la **finale à la Faille** (plan validé), où ce qui
reste des caisses et des alliances décide. Les fins sont celles de Cyril.

## Comment le jeu le montre

- **Une page « Le fil » au journal** : la question, ce qu'on sait (une ligne de plus à chaque pas), les sept caisses
  (trouvée par toi, prise par les Réveilleurs, inconnue), la piste suivante.
- **La carte du monde** marque les villes où une trace attend.
- Les passants en parlent : « Une dame en gris a demandé la voie sept. »

## Décisions de Cyril (2026-11-04)

1. La structure (sept caisses, une par continent, la course contre les Réveilleurs, la dame en gris en visage) : **oui**.
2. **Ce que contiennent les caisses : (c)** : chaque caisse, une pièce de la machine que l'Ancien Monde a éloignée de
   la Chute (ce que veulent les Réveilleurs) **et** la liste de ceux qui voyageaient avec elle (des enfants). Ce
   qu'est la machine, et ce qu'elle fait, reste à Cyril ; le jeu ne l'explique pas avant la fin.
3. L'urgence (la maladie s'étend à chaque voie rouverte ; Ilyane oublie plus vite) : **oui**.
4. La page « Le fil » au journal et les marques sur la carte du monde, avant Aetherhaven : **oui**.

## Construit (2026-11-04)

- **La page « Le fil »**, deuxième onglet du journal (`src/rules/fil.ts`, données `src/data/fil.json`) : la question
  (une fois la page du dernier départ lue), « Ce que je sais » (une ligne par pas de l'histoire : la foreuse, les
  fouilleurs, la clé et son sort, la main d'Edda Varn, la page, les caisses dispersées), « La piste », et les sept
  caisses (○ sur sa trace, ● trouvée, ✕ prise par d'autres). Avant tout : « Ilyane t'a envoyé·e à la Gare Engloutie… ».
  **Depuis le test du 2026-11-06 (décision de Cyril)**, une caisse n'apparaît qu'une fois **sa trace connue** : la
  quête qui y mène commencée (`trace` dans `fil.json` : « Sous la Faille », « La Cendrière », « La caisse sans main »,
  « Les noms qui montent », « La mer rend », « Ce qui n'a plus lieu », « Ce que la glace a pris »), ou son sort écrit.
  La page du dernier départ lue, le titre devient « Les sept caisses » et les autres sont comptées (« 6 autres : on ne
  sait où. ») ; avant, ni titre ni liste. Le testeur voyait les sept continents dès la première minute.
- **La carte du monde** entoure la piste d'un anneau cuivré qui respire (« La piste ») : le lieu de la quête
  principale en cours, puis « Zephyria · Aetherhaven » après Sept-Portes.
- Les caisses ont leurs repères (`trouvee`, `prise`) à écrire avec chaque ville.

## Les trois caisses des continents déjà joués (construites et **validées par Cyril** le 2026-11-04 : « 1 oui, 2 oui, 3 oui, 4 oui » ; en ligne)

Cyril (2026-11-04, « 4 oui ») : les trois quêtes de retour d'abord. Courtes, après « Les noms qui montent » ; ce qu'on
a fait de la clé de rouille bleue et de la page du dernier départ décide.

| Caisse | Quête | Où | Ce que les choix d'avant changent |
|---|---|---|---|
| Verdantis | « Ce que cherchait la foreuse » | Ilyane a gardé les papiers de la prospection : « Objectif : une caisse plombée, sous la Faille, quai sept. Commanditaire : E. V. » Sous la Faille de la Gare Engloutie, le quai sept ; la foreuse s'est arrêtée à deux mètres. L'eau a bu les noms, il reste les âges | toujours trouvée (tous les chemins du chapitre 1 arrêtent la foreuse) |
| Ferros | « Sous la cendre » | la Cendrière, sous le troisième tas ; six noms de la même main que le rouleau de Zephyria : Oda, Tilo, Mara, Jens, Ruth, Anouk | la clé confiée à Noam : le carnet de bord (page quatorze) ; rendue à la Veilleuse : elle chante à l'aiguillage ; **vendue à Kaelis : les gants fins l'ont déjà prise** |
| Terminus | « La caisse sans main » | au Fonds Muet, arrivée par le monte-charge des archives la nuit du dernier départ, jamais signée ; six noms encore : Aldo, Nour, Tess, Sven, Lou, Mirko | **la ligne vendue à la dame en gris : le monte-charge a été forcé par en dessous** |

Pour chacune : garder la pièce, la confier (à Ilyane, aux Archives par Noam, à Ambroise, qui écrit enfin « Reçu : le Fonds
Muet »), ou la laisser. La page « Le fil » les compte ; la piste montre la ville quand la quête est en cours.
