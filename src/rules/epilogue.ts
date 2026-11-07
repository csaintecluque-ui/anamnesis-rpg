import type { GameState } from '../state/gameState';
import { eddaScore, EDDA_TURNS_AT, ilyaneState, missingAtCall, piecesPrises } from './fin';

/**
 * L'épilogue (chapitre 9, docs/gdd/chapitre-9.md) : une page par fil, composée de tout le jeu. Le texte suit les
 * repères : la fin de « La voie sept », le sort de chaque caisse, la dame en gris, Ilyane, Liane et Boulon, le héros.
 */

export type Ending = 'monte' | 'recu' | 'jetee' | 'dechiree';
export const ENDINGS: Ending[] = ['monte', 'recu', 'jetee', 'dechiree'];

export interface EpiloguePage {
  titre: string;
  texte: string;
}

export function endingOf(state: Pick<GameState, 'flags'>): Ending | null {
  return ENDINGS.find((e) => state.flags[`fin-voie-sept-${e}`]) ?? null;
}

const VOIE: Record<Ending, string> = {
  monte:
    'Le train est reparti d’Altavent complet, pour la première fois depuis la Chute. Il lui manquait un passager. Cette nuit-là, à la Gare Engloutie, il n’est pas passé : le quai sept n’est plus qu’un quai, mouillé, où l’on entend l’eau goutter des voûtes.',
  recu:
    'Le train est reparti d’Altavent vide, pour la dernière fois. Sur le registre, sous « Reçu : personne », il y a ton nom. Dans les haltes de la voie sept, les Échos des enfants se sont tus l’un après l’autre, avec la douceur d’un enfant qui s’endort quand quelqu’un est enfin venu.',
  jetee:
    'La machine est au fond de la Faille, avec ses sept morceaux de silence. Certaines nuits, à la Gare Engloutie, le train passe encore, les vitres pleines de mains, et ne s’arrête pas. Personne ne l’appellera plus : ni les Réveilleurs, ni toi.',
  dechiree:
    'Les Réveilleurs ont appelé le train avec la Faille. Il est passé sans s’arrêter : il ne les attendait pas. La Faille, forcée, a pris ce qui manquait dans les Échos de la voie sept, de la Lisière aux Hauts de Zephyria. Des haltes entières ont oublié qu’elles avaient été des haltes.',
};

/** One line per caisse, by the end of its quest. */
const CAISSES: { continent: string; quest: string; lines: Record<string, string> }[] = [
  {
    continent: 'Verdantis',
    quest: 'sous-la-faille',
    lines: {
      gardee: 'la pièce du quai sept, que l’eau avait gardée, puis toi. Les noms, l’eau les a bus : il reste six âges.',
      gardiens: 'la pièce a dormi sous le lit d’Ilyane, avec ses carnets, jusqu’au dernier soir.',
      laissee: 'la caisse attendait sous la Faille, à deux mètres de la foreuse, depuis le premier jour.',
    },
  },
  {
    continent: 'Ferros',
    quest: 'caisse-cendriere',
    lines: {
      gardee: 'Oda, Tilo, Mara, Jens, Ruth, Anouk. La cendre les a couverts ; toi, tu les as lus.',
      archives: 'Oda, Tilo, Mara, Jens, Ruth, Anouk : classés au Fonds Zéro bis, entre deux registres de fonte. Noam les relit, dit-on.',
      laissee: 'la caisse est restée sous la cendre de la Cendrière. Les trieurs l’appellent la caisse aux six noms, et ne la touchent pas.',
      prise: 'les gants fins sont passés avant toi. Six noms sont partis dans une voiture fermée.',
    },
  },
  {
    continent: 'Terminus',
    quest: 'caisse-sans-main',
    lines: {
      gardee: 'Aldo, Nour, Tess, Sven, Lou, Mirko. Une caisse sans main, jusqu’à la tienne.',
      confiee: 'Ambroise a écrit « Reçu : le Fonds Muet », la première main de la caisse depuis trois mille ans.',
      laissee: 'la caisse sans main dort au Fonds Muet, où l’on ne signe rien.',
      prise: 'le monte-charge a été forcé par en dessous. Quelqu’un avait vendu la ligne.',
    },
  },
  {
    continent: 'Zephyria',
    quest: 'noms-qui-montent',
    lines: {
      partage: 'Ama, Joran, Sefi, Nilo, Brune, Hélie : le rouleau à la dame en gris, la pièce à toi. Les bandes de tissu ne montent plus.',
      tout: 'Ama, Joran, Sefi, Nilo, Brune, Hélie : tu as tout pris, le rouleau et la pièce. Aetherhaven a cessé de voir monter les noms.',
      lache: 'Ama, Joran, Sefi, Nilo, Brune, Hélie : lâchés au vent sous les nuages. On dit que les Sylphes les répètent.',
      laissee: 'la dame en gris a tout emporté de la Halte des Cendres. Les noms montent encore, certains soirs.',
    },
  },
  {
    continent: 'Marisol',
    quest: 'mer-rend',
    lines: {
      rendue: 'Ilan, Naïs, Corin, Sela, Timo, Rhéa : rendus à la mer, qui les avait rendus une fois. Elle ne les rendra plus.',
      gardee: 'Ilan, Naïs, Corin, Sela, Timo, Rhéa. La pièce a quitté Coralia avec toi, et la mer n’a rien dit.',
      amiraute: 'l’Amirauté a classé la caisse, puis l’a rendue sans un mot quand on la lui a demandée.',
      edda: 'la caisse est partie une nuit de marée basse, par la cale que tu avais laissée ouverte.',
    },
  },
  {
    continent: 'La Communion',
    quest: 'plus-lieu',
    lines: {
      halte: 'Inès, Pavel, Lila, Oren, Nadia, Sacha. La halte a de nouveau lieu ; la Marche s’y arrête, une nuit par an.',
      gardee: 'Inès, Pavel, Lila, Oren, Nadia, Sacha. Tu as porté leur caisse hors du sable.',
      'longue-ombre': 'Longue-Ombre a porté la caisse sur son dos, d’une halte à l’autre, jusqu’à ce qu’on la lui redemande.',
      edda: 'la caisse est partie vers le sud, sur le dos de la dame en gris, vers des silhouettes derrière la dune.',
    },
  },
  {
    continent: 'Glacialis',
    quest: 'glace-pris',
    lines: {
      prise: 'Aksel, Mira, Tove, Elio, Ysé, Noam : laissés dans la glace claire, au bout de la voie sept. Personne ne les aura.',
      brisee: 'Aksel, Mira, Tove, Elio, Ysé, Noam. Tu as brisé la prise ; Khrysos t’appelle encore le Briseur d’Échos.',
      college: 'le Collège des 9 Miroirs a consigné la caisse : une face neuve, à la suite de la lacune.',
      edda: 'la caisse est partie dans les bras de la dame en gris, le cristal ouvert derrière elle.',
    },
  },
];

function caissesPage(state: Pick<GameState, 'flags'>): string {
  const lines = CAISSES.map(({ continent, quest, lines: byFin }) => {
    const fin = Object.keys(byFin).find((id) => state.flags[`fin-${quest}-${id}`]);
    return fin ? `${continent} : ${byFin[fin]}` : null;
  }).filter((l): l is string => !!l);
  return lines.join('\n');
}

function eddaPage(state: Pick<GameState, 'flags'>, ending: Ending): string {
  const allied = eddaScore(state) >= EDDA_TURNS_AT;
  if (ending === 'dechiree')
    return 'La dame en gris a regardé passer le train sans qu’il s’arrête. Elle a compris avant eux. Elle est remontée par l’échelle de Ferros et personne ne l’a revue à Ferros, ni ailleurs.';
  if (state.flags['edda-altavent'])
    return 'À Altavent, au bas du registre, de la main de sa mère, il y avait un quarante-troisième nom : le sien. Elle l’a lu, longtemps. Elle est remontée par la Voie du Bas sans ses gants. On dit qu’à Sept-Portes, une courtière de Ferros a rendu ses Fers neufs à ceux qui la payaient.';
  if (allied)
    return 'La dame en gris est restée sur le quai sept, avec la liste. « Ma mère a écrit leurs noms parce qu’elle avait peur de les perdre. Moi, j’ai eu peur de la perdre, elle. » Elle n’a pas voulu monter.';
  return 'La dame en gris est partie avant l’aube, avec ses gants et sans la liste. Elle n’a jamais su qu’au bas du registre d’Altavent, de la main de sa mère, il y avait son nom.';
}

function ilyanePage(state: Pick<GameState, 'flags'>, ending: Ending): string {
  if (ending === 'monte')
    return 'Ilyane s’est réveillée le lendemain en se souvenant de tout : l’air de la chanson, le nom de Mirelle, ton visage. Elle l’a écrit en grand sur la première page de son carnet, pour ne jamais avoir à le chercher. Elle ne sait pas pourquoi elle a pleuré en l’écrivant.';
  const state3 = ilyaneState(state);
  if (state3 === 'intacte')
    return 'La maladie des souvenirs s’est arrêtée là où elle en était. Ilyane a perdu un air, un nom, un matin ; elle a gardé le reste, et toi. Elle dit que c’est assez pour une vieille Gardienne.';
  if (state3 === 'entamee')
    return 'Il manque à Ilyane des pans entiers de sa vie. Elle les remplace par tes lettres, qu’elle relit à voix haute au relais, devant qui veut bien écouter. Elle dit que ce sont de belles histoires, et qu’elle aurait aimé les vivre.';
  return 'Ilyane ne te reconnaît plus. Elle te sourit quand tu passes au relais, avec la politesse qu’on a pour un voyageur, et te demande d’où tu viens. Tu lui racontes. Chaque fois, elle trouve que c’est une belle histoire.';
}

function companionsPage(state: Pick<GameState, 'flags'>): string | null {
  const lines: string[] = [];
  if (state.flags['oubli-choix-graver']) lines.push('Liane a gravé le nom de Saule au Bosquet des Échos, à côté de ceux du train. Elle y passe en revenant de la lisière.');
  else if (state.flags['liane-a-oublie']) lines.push('Liane a oublié Saule. Elle cueille toujours au même endroit, sans savoir pourquoi, et rentre plus légère.');
  else if (state.flags['oubli-choix-oublier']) lines.push('Liane cherche encore le vieux champignon. Elle dit qu’elle n’est plus pressée.');
  if (state.flags['boulon-libre']) lines.push('Boulon, rayé du matériel, se souvient de chaque voyageur. Il a ajouté quarante-deux noms à sa mémoire, et un de plus : le tien.');
  else if (state.flags['boulon-accueilli']) lines.push('Boulon est retourné à ses rails. Il compte les trains qui passent ; il n’en manque aucun.');
  return lines.length ? lines.join('\n') : null;
}

const TOI: Record<Ending, string> = {
  monte:
    'Tu as rendu la main. L’autre enfant l’a prise sans un mot, comme s’il ne l’avait jamais lâchée. Le train est parti. Dans le relais de Gardebois, il y a une chambre que personne n’ose donner, et un Livre des Échos ouvert sur une page : « Ce qui n’est pas à moi ».',
  recu:
    'Tu es resté·e. Tu sais maintenant ce que tu avais effacé : un quai, une nuit, une main que tu as lâchée. Tu le portes. Les Gardiens disent que c’est le seul travail qu’ils aient jamais fait : recevoir. Tu as reçu.',
  jetee:
    'Tu ne sauras jamais tout. Certaines nuits, à la Gare Engloutie, un enfant se retourne vers toi derrière une vitre. Tu lèves la main. Le train ne s’arrête pas.',
  dechiree:
    'Tu as donné ce que tu portais, et le train ne s’est pas arrêté. L’enfant à la fenêtre ne s’est pas retourné, cette fois. Il reste de lui une odeur de vapeur, et un poing qui se ferme sur rien.',
};

/** The pages of the epilogue, in order; empty before an ending of « La voie sept ». */
export function epiloguePages(state: Pick<GameState, 'flags'>): EpiloguePage[] {
  const ending = endingOf(state);
  if (!ending) return [];
  const pages: EpiloguePage[] = [{ titre: 'La voie sept', texte: VOIE[ending] }];
  const missing = missingAtCall(state);
  if (missing > 0 && ending !== 'dechiree')
    pages[0].texte += ` Pour l’appeler, la Faille a pris ${missing === 1 ? 'une pièce' : `${missing} pièces`} dans les Échos de la Lisière : des souvenirs sont partis avec.`;
  if (piecesPrises(state) > 0 && ending !== 'dechiree')
    pages[0].texte += ' Les Réveilleurs sont retournés à l’ombre, sans visage, avec la honte de ceux qui ont payé pour rien.';
  pages.push({ titre: 'Les sept caisses', texte: caissesPage(state) });
  pages.push({ titre: 'La dame en gris', texte: eddaPage(state, ending) });
  pages.push({ titre: 'Ilyane', texte: ilyanePage(state, ending) });
  const companions = companionsPage(state);
  if (companions) pages.push({ titre: 'Ceux qui ont marché avec toi', texte: companions });
  pages.push({ titre: ending === 'monte' ? 'Le dernier passager' : 'Toi', texte: TOI[ending] });
  return pages;
}
