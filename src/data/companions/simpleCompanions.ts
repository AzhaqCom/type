import type { Companion } from '../../core/types/companions';
import { CompanionPersonality } from '../../core/types/companions';

/**
 * Compagnons simplifiés pour Phase 2 - Version qui compile
 */

// === GARETH PORTELAME - FIGHTER TANK ===

export const garethPortelame: Companion = {
  // Identification CombatEntity
  id: 'companion_gareth',
  name: 'Gareth Portelame',
  type: 'ally',
  
  // Classification
  size: 'medium',
  creatureType: 'humanoid',
  
  // Stats D&D optimisées pour tank Fighter
  abilityScores: {
    strength: 16,
    dexterity: 12,
    constitution: 15,
    intelligence: 10,
    wisdom: 13,
    charisma: 14
  },
  
  skillBonuses: {
    athletics: 5,
    intimidation: 4,
    perception: 3
  },
  
  savingThrowBonuses: {
    strength: 5,
    constitution: 4
  },
  
  // Combat optimisé tank niveau 2
  combatStats: {
    maxHitPoints: 18,
    currentHitPoints: 18,
    temporaryHitPoints: 0,
    armorClass: 18,
    initiative: 1,
    speed: 25,
    conditions: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: []
  },
  
  position: { x: 0, y: 0 },
  
  // Données de classe Fighter
  class: 'fighter',
  level: 2,
  classData: {
    fightingStyle: 'protection',
    secondWindUsed: false,
    secondWindHealing: '1d10+2',
    actionSurgeUsed: false,
    actionSurgeUses: 1,
    martialArchetype: undefined
  },
  
  // État
  isAlive: true,
  isConscious: true,
  canAct: true,
  
  // Spécifique Companion
  personality: [CompanionPersonality.BRAVE, CompanionPersonality.LOYAL, CompanionPersonality.GRUMPY],
  
  backstory: {
    origin: 'Ancien garde royal déchu',
    motivation: 'Racheter son honneur perdu',
    secret: 'A abandonné son poste pendant une bataille cruciale',
    goal: 'Retrouver sa place parmi les nobles guerriers',
    fear: 'Être à nouveau lâche quand ça compte',
    idealValue: 'Le courage se mesure dans l\'adversité'
  },
  
  isRecruited: false,
  canLeave: true,
  
  companionAI: {
    combatRole: 'tank',
    aggressiveness: 'defensive',
    
    campBehavior: {
      prefersWatch: true,
      socialWith: [],
      soloActivities: ['weapon_maintenance', 'training'],
      helpfulness: 85
    },
    
    explorationBehavior: {
      scoutingRole: false,
      collectsItems: false,
      makesComments: true,
      prefersLeading: true
    },
    
    autonomyLevel: 'suggestions',
    
    emotionalState: {
      currentMood: 'neutral',
      stressLevel: 30,
      homesickness: 20,
      confidence: 60
    }
  },
  
  personalItems: ['longsword', 'shield', 'family_crest']
};

// === SŒUR LYANNA - CLERIC HEALER ===

export const sœurLyanna: Companion = {
  id: 'companion_lyanna',
  name: 'Sœur Lyanna',
  type: 'ally',
  
  size: 'medium',
  creatureType: 'humanoid',
  
  abilityScores: {
    strength: 10,
    dexterity: 12,
    constitution: 14,
    intelligence: 13,
    wisdom: 16,
    charisma: 15
  },
  
  skillBonuses: {
    medicine: 5,
    insight: 5,
    religion: 3,
    persuasion: 4
  },
  
  savingThrowBonuses: {
    wisdom: 5,
    charisma: 4
  },
  
  combatStats: {
    maxHitPoints: 14,
    currentHitPoints: 14,
    temporaryHitPoints: 0,
    armorClass: 15,
    initiative: 1,
    speed: 30,
    conditions: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: []
  },
  
  position: { x: 2, y: 0 },
  
  class: 'cleric',
  level: 2,
  classData: {
    divineDomain: 'life',
    channelDivinityUses: 1,
    channelDivinityUsed: 0,
    turnUndeadDC: 13,
    discipleOfLife: {
      bonusHealing: 2
    }
  },
  
  isAlive: true,
  isConscious: true,
  canAct: true,
  
  personality: [CompanionPersonality.WISE, CompanionPersonality.CHEERFUL, CompanionPersonality.LOYAL],
  
  backstory: {
    origin: 'Prêtresse d\'un temple isolé',
    motivation: 'Répandre la lumière dans les ténèbres',
    secret: 'Doute parfois de sa foi face à tant de souffrance',
    goal: 'Fonder un sanctuaire pour les nécessiteux',
    fear: 'Perdre quelqu\'un qu\'elle ne peut pas sauver',
    idealValue: 'La compassion guérit plus que la magie'
  },
  
  isRecruited: false,
  canLeave: true,
  
  companionAI: {
    combatRole: 'support',
    aggressiveness: 'defensive',
    
    campBehavior: {
      prefersWatch: false,
      socialWith: [],
      soloActivities: ['prayer', 'herb_gathering', 'healing'],
      helpfulness: 95
    },
    
    explorationBehavior: {
      scoutingRole: false,
      collectsItems: true,
      makesComments: true,
      prefersLeading: false
    },
    
    autonomyLevel: 'suggestions',
    
    emotionalState: {
      currentMood: 'happy',
      stressLevel: 15,
      homesickness: 25,
      confidence: 85
    }
  },
  
  personalItems: ['holy_symbol', 'prayer_book', 'healing_herbs']
};

// === SHADE - ROGUE DPS ===

export const shade: Companion = {
  id: 'companion_shade',
  name: 'Shade',
  type: 'ally',
  
  size: 'medium',
  creatureType: 'humanoid',
  
  abilityScores: {
    strength: 10,
    dexterity: 16,
    constitution: 13,
    intelligence: 14,
    wisdom: 12,
    charisma: 11
  },
  
  skillBonuses: {
    stealth: 7,
    sleight_of_hand: 7,
    perception: 3,
    investigation: 4,
    acrobatics: 5
  },
  
  savingThrowBonuses: {
    dexterity: 5,
    intelligence: 4
  },
  
  combatStats: {
    maxHitPoints: 12,
    currentHitPoints: 12,
    temporaryHitPoints: 0,
    armorClass: 14,
    initiative: 3,
    speed: 30,
    conditions: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: []
  },
  
  position: { x: 1, y: 1 },
  
  class: 'rogue',
  level: 2,
  classData: {
    sneakAttackDice: 1,
    thievesCant: true,
    expertiseSkills: new Set<'stealth' | 'sleight_of_hand'>(['stealth', 'sleight_of_hand']),
    cunningActionAvailable: true,
    roguishArchetype: undefined
  },
  
  isAlive: true,
  isConscious: true,
  canAct: true,
  
  personality: [CompanionPersonality.CYNICAL, CompanionPersonality.MYSTERIOUS, CompanionPersonality.CAUTIOUS],
  
  backstory: {
    origin: 'Orphelin des rues d\'une grande cité',
    motivation: 'Survivre et prospérer dans un monde hostile',
    secret: 'Ancien membre d\'une guilde de voleurs qu\'il a trahie',
    goal: 'Accumuler assez de richesses pour disparaître',
    fear: 'Que son passé le rattrape',
    idealValue: 'Ne faire confiance qu\'à soi-même'
  },
  
  isRecruited: false,
  canLeave: true,
  
  companionAI: {
    combatRole: 'dps',
    aggressiveness: 'aggressive',
    
    campBehavior: {
      prefersWatch: true,
      socialWith: [],
      soloActivities: ['weapon_maintenance', 'scouting', 'lock_practice'],
      helpfulness: 45
    },
    
    explorationBehavior: {
      scoutingRole: true,
      collectsItems: true,
      makesComments: false,
      prefersLeading: false
    },
    
    autonomyLevel: 'full_control',
    
    emotionalState: {
      currentMood: 'neutral',
      stressLevel: 50,
      homesickness: 0,
      confidence: 75
    }
  },
  
  personalItems: ['thieves_tools', 'lucky_coin', 'hidden_dagger']
};

export function getAllSimpleCompanions(): Companion[] {
  return [garethPortelame, sœurLyanna, shade];
}