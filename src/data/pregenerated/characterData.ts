import type { DnDClass, Ability, AbilityScore } from '../../core/types/character';
import type { Background } from './backgrounds/backgroundData';

/**
 * Données pures des 12 personnages pré-générés D&D 5e
 * Un personnage par classe, optimisé pour son rôle avec personnalité unique
 */

// === INTERFACE DE BASE ===

export interface PregenCharacterData {
  // Identité
  name: string;
  class: DnDClass;
  background: Background;
  
  // Stats optimisées (Point-Buy 27)
  stats: Record<Ability, AbilityScore>;
  
  // Personnalité unique
  personality: {
    traits: string[];
    ideal: string;
    bond: string;
    flaw: string;
    motivation: string; // Pourquoi aventure-t-il ?
  };
  
  // Hints pour ClassSpecificData (utilisés par la factory)
  classSpecificHints: {
    // Pour Fighter
    fightingStyle?: 'archery' | 'defense' | 'dueling' | 'great_weapon' | 'protection' | 'two_weapon';
    
    // Pour Wizard
    preferredSchool?: 'abjuration' | 'conjuration' | 'divination' | 'enchantment' | 'evocation' | 'illusion' | 'necromancy' | 'transmutation';
    spellbookFocus?: string; // Thème des sorts choisis
    
    // Pour Cleric
    divineDomain?: 'life' | 'light' | 'nature' | 'tempest' | 'trickery' | 'war';
    clericDeity?: string;
    
    // Pour Rogue
    anticipatedArchetype?: 'thief' | 'assassin' | 'arcane_trickster';
    expertisePreference?: 'stealth' | 'social' | 'tools';
    
    // Pour Barbarian
    pathPreference?: 'berserker' | 'totem_warrior';
    tribalOrigin?: string;
    
    // Pour Bard
    collegePreference?: 'lore' | 'valor';
    instrumentType?: string;
    
    // Pour Druid
    circlePreference?: 'land' | 'moon';
    landType?: 'arctic' | 'coast' | 'desert' | 'forest' | 'grassland' | 'mountain' | 'swamp' | 'underdark';
    
    // Pour Monk
    monasticTradition?: 'open_hand' | 'shadow' | 'four_elements';
    philosophy?: string;
    
    // Pour Paladin
    sacredOath?: 'devotion' | 'ancients' | 'vengeance';
    paladinDeity?: string;
    
    // Pour Ranger
    favoredEnemy?: 'beasts' | 'humanoids' | 'monstrosities' | 'undead';
    naturalExplorer?: 'forest' | 'mountains' | 'swamp' | 'coast';
    archetypePreference?: 'hunter' | 'beast_master';
    
    // Pour Sorcerer
    sorceousOrigin?: 'draconic_bloodline' | 'wild_magic';
    dragonAncestor?: 'black' | 'blue' | 'brass' | 'bronze' | 'copper' | 'gold' | 'green' | 'red' | 'silver' | 'white';
    
    // Pour Warlock
    otherworldlyPatron?: 'archfey' | 'fiend' | 'great_old_one';
    pactPreference?: 'blade' | 'chain' | 'tome'; // Pour niveau 3
  };
}

// === LES 12 PERSONNAGES PRÉ-GÉNÉRÉS ===

// 1. FIGHTER - Tank Protection
export const GARETH_FIGHTER_DATA: PregenCharacterData = {
  name: 'Gareth Portelame',
  class: 'fighter',
  background: 'soldier',
  
  // Point-Buy optimisé Tank (STR-based)
  stats: {
    strength: 15,     // +2 racial = 17 (+3) - Attaques et dégâts
    dexterity: 13,    // +1 (+1) - AC et initiative correctes  
    constitution: 14, // +1 racial = 15 (+2) - HP et résistance
    intelligence: 8,  // -1 - Non prioritaire pour fighter
    wisdom: 12,       // +1 - Perception et sagesse
    charisma: 10      // +0 - Base
  },
  
  personality: {
    traits: [
      'Je suis hanté par une bataille où j\'ai fui, abandonnant mes camarades.',
      'Je polis obsessionnellement mes armes et armure chaque soir.'
    ],
    ideal: 'Rédemption. Chaque jour est une chance de racheter mes erreurs passées.',
    bond: 'Je porte l\'épée de mon ancien commandant tombé au combat. Je dois honorer sa mémoire.',
    flaw: 'Je doute de mon courage dans les moments critiques, malgré mes prouesses au combat.',
    motivation: 'Prouver qu\'il n\'est pas un lâche et retrouver l\'honneur perdu de sa compagnie.'
  },
  
  classSpecificHints: {
    fightingStyle: 'protection',
    // Martial Archetype à niveau 3 : Champion (simple et efficace pour tank)
  }
};

// 2. WIZARD - Évocation Spécialisé  
export const ALDRIC_WIZARD_DATA: PregenCharacterData = {
  name: 'Aldric le Sage',
  class: 'wizard',
  background: 'sage',
  
  // Point-Buy optimisé Caster (INT-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire
    dexterity: 14,    // +2 - AC (Mage Armor) et initiative
    constitution: 13,  // +1 - HP et concentration
    intelligence: 15, // +2 racial = 17 (+3) - Sorts et spellbook
    wisdom: 12,       // +1 - Perception et saves WIS
    charisma: 10      // +0 - Interactions sociales de base
  },
  
  personality: {
    traits: [
      'Je prends des notes détaillées sur tout ce que j\'observe, même en plein combat.',
      'J\'explique patiemment les concepts magiques complexes à ceux qui s\'y intéressent.'
    ],
    ideal: 'Connaissance. La magie est la clé pour comprendre l\'univers et ses mystères.',
    bond: 'Mon mentor a disparu en explorant une ruine ancienne. Je dois découvrir ce qui lui est arrivé.',
    flaw: 'Je suis si fasciné par la magie que je sous-estime parfois les dangers physiques.',
    motivation: 'Maîtriser l\'école d\'Évocation pour retrouver et secourir son mentor disparu.'
  },
  
  classSpecificHints: {
    preferredSchool: 'evocation',
    spellbookFocus: 'sorts_de_combat_et_utilitaire', // Magic Missile, Shield, Burning Hands, Detect Magic, etc.
  }
};

// 3. CLERIC - Domaine Life Healer
export const MARCUS_CLERIC_DATA: PregenCharacterData = {
  name: 'Frère Marcus',
  class: 'cleric',
  background: 'acolyte',
  
  // Point-Buy optimisé Healer (WIS-based)
  stats: {
    strength: 13,     // +1 - Port d'armure et combat au corps à corps
    dexterity: 10,    // +0 - AC avec armure lourde
    constitution: 14, // +2 - HP et concentration 
    intelligence: 8,  // -1 - Non prioritaire
    wisdom: 15,       // +2 racial = 17 (+3) - Sorts et Channel Divinity
    charisma: 12      // +1 - Interactions sociales et Turn Undead
  },
  
  personality: {
    traits: [
      'Je vois les blessures et souffrances des autres avant les miennes.',
      'Je murmure des prières de guérison même pour mes ennemis vaincus.'
    ],
    ideal: 'Compassion. Soulager la souffrance est le plus noble des appels.',
    bond: 'L\'orphelinat où j\'ai grandi manque cruellement de ressources. Je dois les aider.',
    flaw: 'Je me sacrifie pour les autres au point de mettre la mission en danger.',
    motivation: 'Collecter des fonds et ressources pour sauver l\'orphelinat de son enfance.'
  },
  
  classSpecificHints: {
    divineDomain: 'life',
    clericDeity: 'Pelor', // Dieu de la guérison et du soleil
  }
};

// 4. ROGUE - Thief Furtif
export const SHADE_ROGUE_DATA: PregenCharacterData = {
  name: 'Shade Ombrelame',
  class: 'rogue',
  background: 'criminal',
  
  // Point-Buy optimisé Stealth/Skills (DEX-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire  
    dexterity: 15,    // +2 racial = 17 (+3) - AC, attaques, stealth
    constitution: 13, // +1 - HP amélioré
    intelligence: 13, // +1 - Investigation et outils
    wisdom: 12,       // +1 - Perception cruciale
    charisma: 12      // +1 - Interactions améliorées
  },
  
  personality: {
    traits: [
      'Je reste dans l\'ombre et observe avant d\'agir.',
      'Je collectionne les petits objets brillants que personne ne remarquera.'
    ],
    ideal: 'Liberté. Les règles et lois ne s\'appliquent qu\'à ceux qui se font prendre.',
    bond: 'Ma sœur cadette croit que je suis mort. Je dois le rester pour sa sécurité.',
    flaw: 'Je ne peux pas résister à un défi de voleur, même si c\'est dangereux.',
    motivation: 'Accumuler assez d\'argent pour offrir une nouvelle vie à sa sœur, loin du crime.'
  },
  
  classSpecificHints: {
    anticipatedArchetype: 'thief',
    expertisePreference: 'stealth', // Stealth + Sleight of Hand
  }
};

// 5. BARBARIAN - Berserker Tribal
export const GROK_BARBARIAN_DATA: PregenCharacterData = {
  name: 'Grok Brisécrâne',
  class: 'barbarian', 
  background: 'outlander',
  
  // Point-Buy optimisé Berserker (STR/CON-based)
  stats: {
    strength: 15,     // +2 racial = 17 (+3) - Attaques et dégâts
    dexterity: 13,    // +1 - AC sans armure et initiative
    constitution: 14, // +1 racial = 15 (+2) - HP et résistance Rage
    intelligence: 8,  // -1 - Non prioritaire
    wisdom: 12,       // +1 - Perception et survie
    charisma: 10      // +0 - Interactions basiques
  },
  
  personality: {
    traits: [
      'Je règle les disputes par des défis physiques plutôt que par les mots.',
      'Je collectionne les dents et griffes de mes ennemis les plus féroces.'
    ],
    ideal: 'Force. La nature enseigne que seuls les forts survivent et prospèrent.',
    bond: 'Mon clan a été massacré par des géants. Je traque leur chef pour me venger.',
    flaw: 'Je ne recule jamais d\'un combat, même quand c\'est tactiquement stupide.',
    motivation: 'Venger son clan détruit et prouver que les "civilisés" peuvent compter sur sa force.'
  },
  
  classSpecificHints: {
    pathPreference: 'berserker',
    tribalOrigin: 'Tribus des Montagnes Gelées',
  }
};

// 6. BARD - College of Lore
export const MELODIE_BARD_DATA: PregenCharacterData = {
  name: 'Mélodie Chantelune',
  class: 'bard',
  background: 'entertainer',
  
  // Point-Buy optimisé Support/Social (CHA-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire
    dexterity: 14,    // +2 - AC et initiative
    constitution: 13, // +1 - HP et concentration
    intelligence: 11, // +0 - Connaissances diverses
    wisdom: 11,       // +0 - Perception base
    charisma: 15      // +2 racial = 17 (+3) - Sorts et interactions sociales
  },
  
  personality: {
    traits: [
      'Je transforme chaque histoire en chanson ou poème épique.',
      'Je ne peux pas résister à un public, même hostile.'
    ],
    ideal: 'Inspiration. Les histoires et chansons peuvent changer les cœurs et changer le monde.',
    bond: 'Une vieille chanteuse m\'a enseigné l\'art bardique. Je répandrai ses histoires perdues.',
    flaw: 'Je promets parfois plus que je ne peux tenir pour impressionner mon audience.',
    motivation: 'Rassembler les légendes perdues et devenir l\'archiviste des héros d\'autrefois.'
  },
  
  classSpecificHints: {
    collegePreference: 'lore',
    instrumentType: 'luth', // Classique et polyvalent
  }
};

// 7. DRUID - Circle of the Land (Forest)
export const WILLOW_DRUID_DATA: PregenCharacterData = {
  name: 'Willow Murmurefeuille',
  class: 'druid',
  background: 'hermit',
  
  // Point-Buy optimisé Nature Caster (WIS-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire
    dexterity: 14,    // +2 - AC et initiative  
    constitution: 13, // +1 - HP et concentration
    intelligence: 12, // +1 - Connaissances nature
    wisdom: 15,       // +2 racial = 17 (+3) - Sorts et perception animale
    charisma: 10      // +0 - Interactions limitées avec civilisation
  },
  
  personality: {
    traits: [
      'Je parle aux plantes et animaux comme s\'ils étaient de vieux amis.',
      'Les bruits de la civilisation me mettent mal à l\'aise.'
    ],
    ideal: 'Harmonie. Il faut préserver l\'équilibre naturel entre toutes les créatures.',
    bond: 'Une forêt sacrée brûle à cause de l\'expansion urbaine. Je dois la sauver.',
    flaw: 'Je fais plus confiance aux animaux qu\'aux humains, parfois à tort.',
    motivation: 'Arrêter la destruction de la nature par la civilisation et restaurer l\'équilibre.'
  },
  
  classSpecificHints: {
    circlePreference: 'land',
    landType: 'forest', // Milieu naturel de prédilection
  }
};

// 8. MONK - Way of the Open Hand
export const CHEN_MONK_DATA: PregenCharacterData = {
  name: 'Maître Chen',
  class: 'monk',
  background: 'hermit',
  
  // Point-Buy optimisé Martial Arts (DEX/WIS-based)
  stats: {
    strength: 12,     // +1 - Grappling et porter des choses
    dexterity: 15,    // +2 racial = 17 (+3) - AC, attaques et AC
    constitution: 13, // +1 - HP
    intelligence: 10, // +0 - Base
    wisdom: 14,       // +1 racial = 15 (+2) - AC, Ki et perception
    charisma: 8       // -1 - Peu social
  },
  
  personality: {
    traits: [
      'Je médite chaque matin et soir, même en situation dangereuse.',
      'Je communique souvent par métaphores et enseignements zen.'
    ],
    ideal: 'Perfection. L\'amélioration constante de soi mène à l\'illumination.',
    bond: 'Mon monastère a été détruit par des bandits. Je cherche les survivants.',
    flaw: 'Ma quête de perfection me rend critique envers les faiblesses des autres.',
    motivation: 'Retrouver les techniques martiales perdues de son monastère et reconstruire l\'ordre.'
  },
  
  classSpecificHints: {
    monasticTradition: 'open_hand',
    philosophy: 'Voie de la Main Vide - harmonie entre corps et esprit',
  }
};

// 9. PALADIN - Oath of Devotion
export const VALERIA_PALADIN_DATA: PregenCharacterData = {
  name: 'Dame Valeria Lumièredivine',
  class: 'paladin',
  background: 'noble',
  
  // Point-Buy optimisé Tank/Healer (STR/CHA-based)
  stats: {
    strength: 15,     // +2 racial = 17 (+3) - Attaques et port d'armure
    dexterity: 10,    // +0 - AC avec armure lourde
    constitution: 14, // +2 - HP et résistance
    intelligence: 8,  // -1 - Non prioritaire
    wisdom: 12,       // +1 - Perception et sagesse
    charisma: 13      // +1 racial = 14 (+2) - Sorts et aura
  },
  
  personality: {
    traits: [
      'Je vois le bien potentiel en chaque personne, même mes ennemis.',
      'Je ne mens jamais, même si la vérité peut blesser.'
    ],
    ideal: 'Justice. Les innocents méritent protection, les coupables méritent rédemption.',
    bond: 'J\'ai juré de protéger un village orphelin après la mort de ses défenseurs.',
    flaw: 'Mon code d\'honneur m\'empêche parfois de faire des choix pragmatiques.',
    motivation: 'Établir un ordre de paladins pour protéger les petites communautés sans défense.'
  },
  
  classSpecificHints: {
    sacredOath: 'devotion',
    paladinDeity: 'Bahamut', // Dragon de platine, justice et protection
  }
};

// 10. RANGER - Hunter
export const TRACKER_RANGER_DATA: PregenCharacterData = {
  name: 'Tracker Œilvif',
  class: 'ranger',
  background: 'outlander',
  
  // Point-Buy optimisé Scout/Archery (DEX/WIS-based)
  stats: {
    strength: 12,     // +1 - Port équipement et corps à corps occasionnel
    dexterity: 15,    // +2 racial = 17 (+3) - Attaques à distance et AC
    constitution: 13, // +1 - HP et résistance
    intelligence: 10, // +0 - Base
    wisdom: 14,       // +1 racial = 15 (+2) - Sorts, Perception, Survival
    charisma: 8       // -1 - Peu social
  },
  
  personality: {
    traits: [
      'Je peux rester immobile et silencieux pendant des heures à observer.',
      'Je préfère la compagnie des animaux à celle des humains.'
    ],
    ideal: 'Protection. La nature et ceux qui la respectent méritent d\'être défendus.',
    bond: 'Une meute de loups m\'a sauvé enfant. Je protège leur territoire.',
    flaw: 'J\'ai du mal à faire confiance aux "civilisés" et à leurs motivations.',
    motivation: 'Empêcher l\'expansion de la civilisation dans les territoires sauvages sacrés.'
  },
  
  classSpecificHints: {
    favoredEnemy: 'humanoids', // Braconniers, bandits qui menacent la nature
    naturalExplorer: 'forest',
    archetypePreference: 'hunter',
  }
};

// 11. SORCERER - Draconic Bloodline (Red)
export const PYRA_SORCERER_DATA: PregenCharacterData = {
  name: 'Pyra Cœur-de-Feu',
  class: 'sorcerer',
  background: 'folk_hero',
  
  // Point-Buy optimisé Blaster (CHA/CON-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire
    dexterity: 13,    // +1 - AC et initiative
    constitution: 14, // +2 - HP et concentration importante
    intelligence: 12, // +1 - Connaissances magiques
    wisdom: 10,       // +0 - Base
    charisma: 15      // +2 racial = 17 (+3) - Sorts et force de personnalité
  },
  
  personality: {
    traits: [
      'Mes émotions se manifestent par des étincelles ou de la fumée.',
      'Je ressens une connexion instinctive avec tout ce qui est ardent ou passionné.'
    ],
    ideal: 'Liberté. Ma magie vient du cœur, pas de règles strictes ou d\'études.',
    bond: 'Ma magie s\'est éveillée pour sauver mon village d\'un incendie. Je lui dois tout.',
    flaw: 'Mes pouvoirs magiques sont instables quand je suis émotionnellement perturbée.',
    motivation: 'Comprendre et maîtriser ses pouvoirs draconiques pour protéger les innocents.'
  },
  
  classSpecificHints: {
    sorceousOrigin: 'draconic_bloodline',
    dragonAncestor: 'red', // Dragon rouge - feu et passion
  }
};

// 12. WARLOCK - The Fiend
export const MORGANA_WARLOCK_DATA: PregenCharacterData = {
  name: 'Morgana Pacte-Sombre',
  class: 'warlock',
  background: 'hermit',
  
  // Point-Buy optimisé Eldritch Blast (CHA-based)
  stats: {
    strength: 8,      // -1 - Non prioritaire
    dexterity: 13,    // +1 - AC et initiative
    constitution: 13, // +1 - HP et concentration
    intelligence: 13, // +1 - Connaissances occultes et investigation
    wisdom: 11,       // +0 - Résistance aux illusions
    charisma: 15      // +2 racial = 17 (+3) - Sorts et négociation avec patron
  },
  
  personality: {
    traits: [
      'Je parle parfois à voix basse à un interlocuteur invisible.',
      'Mes yeux brillent d\'une lueur étrange quand j\'utilise ma magie.'
    ],
    ideal: 'Connaissance. Il existe des vérités cachées que seuls les plus déterminés découvrent.',
    bond: 'Ma sœur aînée a disparu en étudiant la magie interdite. Mon patron connaît son sort.',
    flaw: 'Je suis prête à sacrifier beaucoup pour obtenir plus de pouvoir de mon patron.',
    motivation: 'Découvrir le sort de sa sœur et acquérir assez de pouvoir pour la sauver ou la venger.'
  },
  
  classSpecificHints: {
    otherworldlyPatron: 'fiend',
    pactPreference: 'tome', // Pour niveau 3 - accès à plus de sorts
  }
};

// === DONNÉES CONSOLIDÉES ===

/**
 * Tous les personnages pré-générés
 */
export const ALL_PREGENERATED_DATA: PregenCharacterData[] = [
  GARETH_FIGHTER_DATA,
  ALDRIC_WIZARD_DATA,
  MARCUS_CLERIC_DATA,
  SHADE_ROGUE_DATA,
  GROK_BARBARIAN_DATA,
  MELODIE_BARD_DATA,
  WILLOW_DRUID_DATA,
  CHEN_MONK_DATA,
  VALERIA_PALADIN_DATA,
  TRACKER_RANGER_DATA,
  PYRA_SORCERER_DATA,
  MORGANA_WARLOCK_DATA
];

/**
 * Export alias pour compatibilité avec les factory functions
 */
export const PREGENERATED_CHARACTERS = ALL_PREGENERATED_DATA;

/**
 * Index par classe pour recherche rapide
 */
export const CHARACTERS_BY_CLASS: Record<DnDClass, PregenCharacterData> = {
  fighter: GARETH_FIGHTER_DATA,
  wizard: ALDRIC_WIZARD_DATA,
  cleric: MARCUS_CLERIC_DATA,
  rogue: SHADE_ROGUE_DATA,
  barbarian: GROK_BARBARIAN_DATA,
  bard: MELODIE_BARD_DATA,
  druid: WILLOW_DRUID_DATA,
  monk: CHEN_MONK_DATA,
  paladin: VALERIA_PALADIN_DATA,
  ranger: TRACKER_RANGER_DATA,
  sorcerer: PYRA_SORCERER_DATA,
  warlock: MORGANA_WARLOCK_DATA
};

// === FONCTIONS UTILITAIRES ===

/**
 * Récupère un personnage par classe
 */
export function getCharacterDataByClass(characterClass: DnDClass): PregenCharacterData {
  const data = CHARACTERS_BY_CLASS[characterClass];
  if (!data) {
    throw new Error(`No pregenerated character found for class: ${characterClass}`);
  }
  return data;
}

/**
 * Valide que les stats respectent le point-buy (27 points)
 */
export function validatePointBuy(stats: Record<Ability, AbilityScore>): boolean {
  // Point-buy D&D 5e : coût par stat
  // 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9
  const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  
  const totalCost = Object.values(stats).reduce((sum, stat) => {
    const cost = costs[stat as keyof typeof costs];
    if (cost === undefined) {
      throw new Error(`Invalid stat value: ${stat}. Must be 8-15 for point-buy.`);
    }
    return sum + cost;
  }, 0);
  
  return totalCost === 27;
}

/**
 * Valide tous les personnages pré-générés
 */
export function validateAllCharacters(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const character of ALL_PREGENERATED_DATA) {
    try {
      if (!validatePointBuy(character.stats)) {
        errors.push(`${character.name}: Invalid point-buy (not 27 points)`);
      }
    } catch (error) {
      errors.push(`${character.name}: ${error}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}