import type { Skill } from '../../../core/types/character';

/**
 * Système de Backgrounds D&D 5e
 * Données complètes pour les 12 backgrounds principaux
 */

// === ENUMS ET TYPES ===

export const Background = {
  ACOLYTE: 'acolyte',
  CHARLATAN: 'charlatan', 
  CRIMINAL: 'criminal',
  ENTERTAINER: 'entertainer',
  FOLK_HERO: 'folk_hero',
  GUILD_ARTISAN: 'guild_artisan',
  HERMIT: 'hermit',
  NOBLE: 'noble',
  OUTLANDER: 'outlander',
  SAGE: 'sage',
  SAILOR: 'sailor',
  SOLDIER: 'soldier'
} as const;

export type Background = typeof Background[keyof typeof Background];

// === TYPES POUR LES DONNÉES DE BACKGROUND ===

export interface BackgroundData {
  name: string;
  description: string;
  
  // Compétences (2 au choix ou fixes)
  skillProficiencies: Skill[];
  
  // Outils et langues
  toolProficiencies: string[];
  languages: number; // Nombre de langues supplémentaires
  
  // Équipement de départ
  equipment: BackgroundEquipment[];
  startingGold: number; // En pièces d'or
  
  // Feature unique du background
  feature: {
    name: string;
    description: string;
  };
  
  // Suggestions de personnalité
  suggestedPersonality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
}

export interface BackgroundEquipment {
  item: string; // ItemId ou description
  quantity: number;
  description?: string;
}

// === DONNÉES DES BACKGROUNDS ===

const ACOLYTE_DATA: BackgroundData = {
  name: 'Acolyte',
  description: 'Vous avez passé votre vie au service d\'un temple particulier d\'un dieu ou d\'un panthéon de dieux.',
  
  skillProficiencies: ['insight', 'religion'],
  toolProficiencies: [],
  languages: 2,
  
  equipment: [
    { item: 'holy_symbol', quantity: 1, description: 'Symbole sacré' },
    { item: 'prayer_book', quantity: 1, description: 'Livre de prières' },
    { item: 'incense', quantity: 5, description: 'Bâtons d\'encens' },
    { item: 'vestments', quantity: 1, description: 'Habits de cérémonie' },
    { item: 'common_clothes', quantity: 1, description: 'Vêtements ordinaires' },
    { item: 'belt_pouch', quantity: 1, description: 'Bourse avec 15 po' }
  ],
  startingGold: 15,
  
  feature: {
    name: 'Shelter of the Faithful',
    description: 'Vous pouvez recevoir soins gratuits dans tout temple de votre foi.'
  },
  
  suggestedPersonality: {
    traits: [
      'J\'idolâtre un héros particulier de ma foi et fais constamment référence aux actes et exemples de cette personne.',
      'Je trouve des présages dans tous les événements et actions. Les dieux tentent de nous parler, il suffit d\'écouter.',
      'Rien ne peut ébranler ma foi optimiste.',
      'Je cite (ou déforme) des textes sacrés et des proverbes dans presque toutes les situations.'
    ],
    ideals: [
      'Tradition. Les traditions ancestrales de culte et de sacrifice doivent être préservées et respectées.',
      'Charité. J\'aide toujours ceux dans le besoin, quoi qu\'il m\'en coûte.',
      'Foi. Je fais confiance à ma divinité pour me guider dans mes actions.',
      'Aspiration. Je cherche à me montrer digne de la faveur de ma divinité en respectant mes actions, mes paroles et mes actes.'
    ],
    bonds: [
      'Je mourrais pour récupérer un ancien relique de ma foi qui a été perdu il y a longtemps.',
      'Un jour je me vengerai de la hiérarchie corrompue du temple qui m\'a accusé d\'hérésie.',
      'Je dois ma vie au prêtre qui m\'a recueilli quand mes parents sont morts.',
      'Tout ce que je fais, c\'est pour les gens ordinaires.'
    ],
    flaws: [
      'Je juge les autres sévèrement et moi-même encore plus sévèrement.',
      'J\'ai trop confiance en ceux qui brandissent le pouvoir au sein de la hiérarchie de mon temple.',
      'Ma piété me conduit parfois à faire aveuglément confiance à ceux qui professent la foi dans ma divinité.',
      'Je suis inflexible dans ma pensée.'
    ]
  }
};

const CRIMINAL_DATA: BackgroundData = {
  name: 'Criminal',
  description: 'Vous êtes un criminel expérimenté avec un historique de violations de la loi.',
  
  skillProficiencies: ['deception', 'stealth'],
  toolProficiencies: ['thieves_tools', 'gaming_set'],
  languages: 0,
  
  equipment: [
    { item: 'crowbar', quantity: 1 },
    { item: 'dark_clothes', quantity: 1, description: 'Vêtements sombres avec capuche' },
    { item: 'belt_pouch', quantity: 1, description: 'Bourse avec 15 po' }
  ],
  startingGold: 15,
  
  feature: {
    name: 'Criminal Contact',
    description: 'Vous avez un contact fiable dans un réseau criminel qui agit comme votre liaison.'
  },
  
  suggestedPersonality: {
    traits: [
      'J\'ai toujours un plan pour sortir de prison.',
      'Je reste calme et posé même dans les situations les plus dangereuses.',
      'La première chose que je fais dans un nouvel endroit est de repérer les objets de valeur.',
      'Je préférerais faire un nouvel ami plutôt qu\'un nouvel ennemi.'
    ],
    ideals: [
      'Honneur. Je ne vole pas mes autres criminels.',
      'Liberté. Les chaînes sont faites pour être brisées, comme ceux qui les forgent.',
      'Charité. Je vole aux riches pour que les pauvres puissent vivre.',
      'Avidité. Je ferai tout pour devenir riche.'
    ],
    bonds: [
      'Je dois rembourser une énorme dette à mon bienfaiteur généreux.',
      'Mes gains mal acquis ont servi à soutenir ma famille.',
      'Quelque chose d\'important m\'a été volé et je le récupérerai.',
      'Je sortirai de prison la personne qui compte le plus pour moi.'
    ],
    flaws: [
      'Quand je vois quelque chose de précieux, je ne peux pas penser à autre chose qu\'à la façon de le voler.',
      'Face à un choix entre l\'argent et mes amis, je choisis généralement l\'argent.',
      'Si un plan tourne mal, je suis le premier à fuir.',
      'J\'ai un "tic" qui révèle mes vrais sentiments quand je mens.'
    ]
  }
};

const FOLK_HERO_DATA: BackgroundData = {
  name: 'Folk Hero',
  description: 'Vous venez d\'une classe sociale modeste, mais vous êtes destiné à quelque chose de beaucoup plus grand.',
  
  skillProficiencies: ['animal_handling', 'survival'],
  toolProficiencies: ['vehicles_land', 'artisan_tools'],
  languages: 0,
  
  equipment: [
    { item: 'artisan_tools', quantity: 1, description: 'Un ensemble d\'outils d\'artisan' },
    { item: 'shovel', quantity: 1 },
    { item: 'iron_pot', quantity: 1 },
    { item: 'common_clothes', quantity: 1 },
    { item: 'belt_pouch', quantity: 1, description: 'Bourse avec 10 po' }
  ],
  startingGold: 10,
  
  feature: {
    name: 'Rustic Hospitality',
    description: 'Les gens ordinaires vous font confiance et vous hébergent gratuitement.'
  },
  
  suggestedPersonality: {
    traits: [
      'Je juge les gens par leurs actions, non par leurs paroles.',
      'Si quelqu\'un a des ennuis, je suis toujours prêt à donner un coup de main.',
      'Quand je me fixe un objectif, je fais tout pour l\'atteindre.',
      'Je travaille dur pour que les autres n\'aient pas à souffrir comme j\'ai souffert.'
    ],
    ideals: [
      'Respect. Les gens méritent d\'être traités avec dignité et respect.',
      'Equité. Personne ne doit avoir des privilèges préférentiels devant la loi.',
      'Liberté. Les tyrans ne doivent pas être autorisés à opprimer le peuple.',
      'Puissance. Si je deviens fort, je peux prendre ce que je veux.'
    ],
    bonds: [
      'J\'ai une famille, mais je n\'ai aucune idée d\'où ils sont. J\'espère un jour les revoir.',
      'J\'ai travaillé sur la terre, j\'aime la terre, et je protégerai la terre.',
      'Un noble fier m\'a donné une raclée, et je chercherai la vengeance contre tous les tyrans de son espèce.',
      'Mes outils sont des symboles de ma vie passée, et je les porte pour que je n\'oublie jamais mes racines.'
    ],
    flaws: [
      'Le tyran qui gouverne ma terre natale ne recule devant rien pour me voir mort.',
      'Je suis convaincu de l\'importance de mon destin, et aveugle à mes lacunes et au risque d\'échec.',
      'Les gens qui me connaissent quand j\'étais jeune savent un secret honteux de mon passé.',
      'J\'ai une faiblesse pour les vices de la ville, en particulier l\'alcool.'
    ]
  }
};

const SAGE_DATA: BackgroundData = {
  name: 'Sage',
  description: 'Vous avez passé des années à apprendre les traditions du multivers.',
  
  skillProficiencies: ['arcana', 'history'],
  toolProficiencies: [],
  languages: 2,
  
  equipment: [
    { item: 'ink', quantity: 1, description: 'Bouteille d\'encre' },
    { item: 'quill', quantity: 1, description: 'Plume d\'écriture' },
    { item: 'small_knife', quantity: 1, description: 'Petit couteau' },
    { item: 'letter', quantity: 1, description: 'Lettre d\'un collègue mort posant une question' },
    { item: 'common_clothes', quantity: 1 },
    { item: 'belt_pouch', quantity: 1, description: 'Bourse avec 10 po' }
  ],
  startingGold: 10,
  
  feature: {
    name: 'Researcher',
    description: 'Vous savez comment obtenir des informations et où trouver des sources fiables.'
  },
  
  suggestedPersonality: {
    traits: [
      'J\'utilise des mots polysyllabiques qui transmettent l\'impression de grande érudition.',
      'J\'ai lu tous les livres dans les plus grandes bibliothèques du monde.',
      'Je suis habitué à aider ceux qui ne sont pas aussi intelligents que moi.',
      'Il n\'y a rien que j\'aime plus qu\'un bon mystère.'
    ],
    ideals: [
      'Connaissance. Le chemin vers le pouvoir et l\'auto-amélioration passe par la connaissance.',
      'Beauté. Ce qui est beau nous montre au-delà de toute autre chose ce qui vaut la peine de vivre.',
      'Logique. Les émotions ne doivent pas obscurcir notre pensée logique.',
      'Pas de limites. Rien ne devrait entraver les possibilités infinies inhérentes à toute existence.'
    ],
    bonds: [
      'Il est de mon devoir de protéger mes étudiants.',
      'J\'ai un texte ancien qui contient de terribles secrets qui ne doivent pas tomber entre de mauvaises mains.',
      'Je travaille à préserver une bibliothèque, une université, un scriptorium ou un monastère.',
      'L\'œuvre de ma vie est une série de tomes liés à un domaine spécifique de la connaissance.'
    ],
    flaws: [
      'Je suis facilement distrait par la promesse d\'informations.',
      'La plupart des gens crient et courent quand ils voient un démon. Je m\'arrête et prends des notes sur son anatomie.',
      'Déverrouiller un mystère ancien vaut la peine de la civilisation.',
      'Je préfère les solutions aux problèmes plutôt que les gens.'
    ]
  }
};

const SOLDIER_DATA: BackgroundData = {
  name: 'Soldier',
  description: 'Guerre a été votre vie aussi loin que vous vous en souvenez.',
  
  skillProficiencies: ['athletics', 'intimidation'],
  toolProficiencies: ['vehicles_land', 'gaming_set'],
  languages: 0,
  
  equipment: [
    { item: 'insignia', quantity: 1, description: 'Insignes de rang' },
    { item: 'trophy', quantity: 1, description: 'Trophée d\'un ennemi tombé' },
    { item: 'playing_cards', quantity: 1, description: 'Jeu de cartes' },
    { item: 'common_clothes', quantity: 1 },
    { item: 'belt_pouch', quantity: 1, description: 'Bourse avec 10 po' }
  ],
  startingGold: 10,
  
  feature: {
    name: 'Military Rank',
    description: 'Vous avez un rang militaire de votre carrière de soldat.'
  },
  
  suggestedPersonality: {
    traits: [
      'Je suis toujours poli et respectueux.',
      'Je suis hanté par les souvenirs de guerre. Je ne peux pas sortir les images de violence de mon esprit.',
      'J\'ai perdu trop d\'amis et je suis lent à en créer de nouveaux.',
      'Je suis plein d\'histoires inspirantes et édifiantes de victoire militaire.'
    ],
    ideals: [
      'Plus grand bien. Nos lots sont liés ensemble, et nous nous élevons et nous tombons en tant qu\'un.',
      'Responsabilité. Je fais ce que je dois et obéis à l\'autorité légitime.',
      'Indépendance. Quand les gens suivent aveuglément les ordres, ils embrassent une forme de tyrannie.',
      'Puissance. Dans la vie comme dans la guerre, la plus forte force gagne.'
    ],
    bonds: [
      'Je donnerais ma vie pour les gens avec qui j\'ai servi.',
      'Quelqu\'un m\'a sauvé la vie sur le champ de bataille. A ce jour, je ne laisserai jamais un ami derrière.',
      'Mon honneur est ma vie.',
      'Je ne reculerai jamais devant mes ennemis.'
    ],
    flaws: [
      'L\'ennemi monstrueux que nous avons affronté au combat me remplit encore d\'horreur.',
      'J\'ai peu de respect pour quiconque n\'est pas un guerrier éprouvé.',
      'J\'ai commis une terrible erreur au combat qui a coûté beaucoup de vies, et je ferai n\'importe quoi pour garder ce fait secret.',
      'Ma haine de mes ennemis est aveugle et déraisonnable.'
    ]
  }
};

// === DONNÉES CONSOLIDÉES ===

export const BACKGROUND_DATA: Record<Background, BackgroundData> = {
  [Background.ACOLYTE]: ACOLYTE_DATA,
  [Background.CHARLATAN]: {
    ...ACOLYTE_DATA, // Template de base
    name: 'Charlatan',
    description: 'Vous avez toujours eu un don pour tromper les gens.',
    skillProficiencies: ['deception', 'sleight_of_hand'],
    toolProficiencies: ['forgery_kit', 'disguise_kit'],
    feature: {
      name: 'False Identity',
      description: 'Vous avez créé une seconde identité avec documentation et contacts.'
    }
  },
  [Background.CRIMINAL]: CRIMINAL_DATA,
  [Background.ENTERTAINER]: {
    ...ACOLYTE_DATA, // Template
    name: 'Entertainer', 
    description: 'Vous prospérez devant un public.',
    skillProficiencies: ['performance', 'acrobatics'],
    toolProficiencies: ['disguise_kit', 'musical_instrument'],
    feature: {
      name: 'By Popular Demand',
      description: 'Vous pouvez toujours trouver un endroit pour performer.'
    }
  },
  [Background.FOLK_HERO]: FOLK_HERO_DATA,
  [Background.GUILD_ARTISAN]: {
    ...ACOLYTE_DATA,
    name: 'Guild Artisan',
    description: 'Vous êtes membre d\'une guilde d\'artisans.',
    skillProficiencies: ['insight', 'persuasion'],
    toolProficiencies: ['artisan_tools'],
    feature: {
      name: 'Guild Membership',
      description: 'Votre guilde vous offre certains avantages.'
    }
  },
  [Background.HERMIT]: {
    ...ACOLYTE_DATA,
    name: 'Hermit',
    description: 'Vous avez vécu dans l\'isolement pendant une période formative.',
    skillProficiencies: ['medicine', 'religion'],
    toolProficiencies: ['herbalism_kit'],
    languages: 1,
    feature: {
      name: 'Discovery',
      description: 'Vous avez découvert une vérité puissante et terrifiante.'
    }
  },
  [Background.NOBLE]: {
    ...ACOLYTE_DATA,
    name: 'Noble',
    description: 'Vous comprenez la richesse, le pouvoir et les privilèges.',
    skillProficiencies: ['history', 'persuasion'],
    toolProficiencies: ['gaming_set'],
    languages: 1,
    feature: {
      name: 'Position of Privilege',
      description: 'Grâce à votre noble naissance, les gens sont enclins à penser le meilleur de vous.'
    }
  },
  [Background.OUTLANDER]: {
    ...ACOLYTE_DATA,
    name: 'Outlander',
    description: 'Vous avez grandi dans la nature, loin de la civilisation.',
    skillProficiencies: ['athletics', 'survival'],
    toolProficiencies: ['musical_instrument'],
    languages: 1,
    feature: {
      name: 'Wanderer',
      description: 'Vous avez une excellente mémoire pour les cartes et la géographie.'
    }
  },
  [Background.SAGE]: SAGE_DATA,
  [Background.SAILOR]: {
    ...ACOLYTE_DATA,
    name: 'Sailor',
    description: 'Vous avez navigué sur un navire de mer pendant des années.',
    skillProficiencies: ['athletics', 'perception'],
    toolProficiencies: ['navigator_tools', 'vehicles_water'],
    feature: {
      name: 'Ship\'s Passage',
      description: 'Vous pouvez obtenir un passage gratuit sur un navire de mer.'
    }
  },
  [Background.SOLDIER]: SOLDIER_DATA
};

// === FONCTIONS UTILITAIRES ===

/**
 * Récupère les données d'un background spécifique
 */
export function getBackgroundData(background: Background): BackgroundData {
  const data = BACKGROUND_DATA[background];
  if (!data) {
    throw new Error(`Background data not found for: ${background}`);
  }
  return data;
}

/**
 * Récupère tous les backgrounds disponibles
 */
export function getAllBackgrounds(): Background[] {
  return Object.values(Background);
}

/**
 * Récupère les backgrounds recommandés pour une classe
 */
export function getRecommendedBackgrounds(characterClass: string): Background[] {
  const recommendations: Record<string, Background[]> = {
    fighter: [Background.SOLDIER, Background.FOLK_HERO, Background.NOBLE],
    wizard: [Background.SAGE, Background.HERMIT, Background.NOBLE],
    cleric: [Background.ACOLYTE, Background.HERMIT, Background.FOLK_HERO],
    rogue: [Background.CRIMINAL, Background.CHARLATAN, Background.ENTERTAINER],
    barbarian: [Background.OUTLANDER, Background.FOLK_HERO, Background.SOLDIER],
    bard: [Background.ENTERTAINER, Background.NOBLE, Background.CHARLATAN],
    druid: [Background.HERMIT, Background.OUTLANDER, Background.FOLK_HERO],
    monk: [Background.HERMIT, Background.ACOLYTE, Background.OUTLANDER],
    paladin: [Background.NOBLE, Background.ACOLYTE, Background.SOLDIER],
    ranger: [Background.OUTLANDER, Background.FOLK_HERO, Background.HERMIT],
    sorcerer: [Background.FOLK_HERO, Background.HERMIT, Background.NOBLE],
    warlock: [Background.HERMIT, Background.CHARLATAN, Background.NOBLE]
  };
  
  return recommendations[characterClass] || [Background.FOLK_HERO];
}

/**
 * Valide qu'un background est compatible avec une classe
 */
export function validateBackgroundForClass(background: Background, characterClass: string): boolean {
  const recommended = getRecommendedBackgrounds(characterClass);
  return recommended.includes(background);
}