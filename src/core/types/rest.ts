import type { CharacterId } from './character';
import type { HitDie, DnDClass } from './base';
import type { SpellLevel } from './spells';
import type { SceneTransition } from './scenes';

/**
 * Système de Repos D&D 5e
 * Gère les repos courts (1 heure) et longs (8 heures) selon les règles officielles
 */

// === REPOS COURT (Short Rest) ===

export interface ShortRest {
  // Métadonnées
  type: 'short';
  duration: number;        // Durée en minutes (60 par défaut)
  location: RestLocation;
  startTime: Date;
  
  // Récupération Hit Points via Hit Dice
  hitDiceUsed: HitDiceRoll[];
  
  // Récupération des capacités par classe
  classAbilitiesRecovered: ClassAbilityRecovery[];
  
  // Interruptions possibles
  interruption?: RestInterruption;
  completed: boolean;
}

export interface HitDiceRoll {
  hitDie: HitDie;          // 'd6', 'd8', 'd10', 'd12'
  rolled: number;          // Résultat du dé
  constitutionBonus: number; // Modificateur CON ajouté
  totalHealing: number;    // rolled + constitutionBonus
}

export interface ClassAbilityRecovery {
  characterClass: DnDClass;
  abilitiesRecovered: {
    // Fighter
    secondWind?: boolean;
    
    // Wizard  
    arcaneRecovery?: {
      slotsRecovered: Partial<Record<SpellLevel, number>>;
      totalLevels: number; // Niveaux de slots récupérés
    };
    
    // Warlock
    pactMagicSlots?: number;
    
    // Monk
    kiPoints?: number;
    
    // Bard
    bardicInspiration?: number;
    
    // Autres capacités "per short rest"
    other?: Record<string, number | boolean>;
  };
}

// === REPOS LONG (Long Rest) ===

export interface LongRest {
  // Métadonnées
  type: 'long';
  duration: number;        // Durée en minutes (480 = 8h par défaut)
  location: RestLocation;
  startTime: Date;
  
  // Récupération complète
  recovery: LongRestRecovery;
  
  // Interruptions possibles
  interruptions: RestInterruption[];
  
  // Préparation de sorts (si applicable)
  spellPreparation?: SpellPreparation;
  
  completed: boolean;
  restQuality: RestQuality;
}

export interface LongRestRecovery {
  // Hit Points - récupération complète
  hitPointsRestored: number;
  
  // Hit Dice - récupère la moitié (arrondi au supérieur)
  hitDiceRestored: Partial<Record<HitDie, number>>;
  
  // Spell Slots - récupération complète
  spellSlotsRestored: Partial<Record<SpellLevel, number>>;
  
  // Capacités "once per day"
  dailyAbilitiesReset: string[];
  
  // Conditions supprimées
  conditionsRemoved: string[];
  
  // Exhaustion réduite (1 niveau)
  exhaustionReduced: boolean;
}

export interface SpellPreparation {
  characterId: CharacterId;
  characterClass: DnDClass;
  
  // Sorts disponibles dans le spellbook/liste de classe
  availableSpells: string[];
  
  // Sorts sélectionnés pour la journée
  preparedSpells: string[];
  
  // Limite de préparation
  maxPrepared: number;
  
  // Validation
  isValid: boolean;
  errors?: string[];
}

// === LOCATION ET SÉCURITÉ ===

export const RestLocationType = {
  SAFE_INDOOR: 'safe_indoor',       // Auberge, maison sécurisée
  SAFE_OUTDOOR: 'safe_outdoor',     // Campement protégé
  UNSAFE_OUTDOOR: 'unsafe_outdoor', // Campement en nature
  DANGEROUS: 'dangerous',           // Donjon, territoire hostile
  MAGICAL: 'magical'                // Zone magique (effets spéciaux)
} as const;

export type RestLocationType = typeof RestLocationType[keyof typeof RestLocationType];

export interface RestLocation {
  type: RestLocationType;
  name: string;
  description: string;
  
  // Sécurité (0-100%)
  safetyLevel: number;
  
  // Confort (0-100%) - affecte la qualité du repos
  comfortLevel: number;
  
  // Ressources disponibles
  amenities: RestAmenity[];
  
  // Risques
  dangers: RestDanger[];
}

export const RestAmenity = {
  BEDROLL: 'bedroll',
  CAMPFIRE: 'campfire',
  SHELTER: 'shelter',
  WATER: 'water',
  FOOD: 'food',
  GUARD: 'guard',           // Quelqu'un monte la garde
  HEALING_HERBS: 'healing_herbs',
  MAGICAL_WARD: 'magical_ward'
} as const;

export type RestAmenity = typeof RestAmenity[keyof typeof RestAmenity];

export const RestDanger = {
  RANDOM_ENCOUNTER: 'random_encounter',
  THEFT: 'theft',
  WEATHER: 'weather',
  MAGICAL_DISTURBANCE: 'magical_disturbance',
  DISEASE: 'disease',
  EXHAUSTION: 'exhaustion'
} as const;

export type RestDanger = typeof RestDanger[keyof typeof RestDanger];

// === INTERRUPTIONS ===

export interface RestInterruption {
  id: string;
  type: RestInterruptionType;
  timeOccurred: number;    // Minutes après le début du repos
  
  severity: 'minor' | 'major' | 'catastrophic';
  
  // Description de l'événement
  title: string;
  description: string;
  
  // Conséquences
  consequences: RestConsequence[];
  
  // Choix possibles du joueur
  choices: RestChoice[];
  
  // Résolution
  resolved: boolean;
  choiceMade?: string;
}

export const RestInterruptionType = {
  COMBAT: 'combat',
  SOCIAL: 'social',         // Voyageurs, marchands
  ENVIRONMENTAL: 'environmental', // Orage, froid
  THEFT: 'theft',
  DISCOVERY: 'discovery',   // Trouver quelque chose
  NIGHTMARE: 'nightmare',   // Rêves perturbants
  MAGICAL: 'magical'        // Événement surnaturel
} as const;

export type RestInterruptionType = typeof RestInterruptionType[keyof typeof RestInterruptionType];

export interface RestConsequence {
  type: 'hp_loss' | 'exhaustion' | 'item_loss' | 'time_loss' | 'spell_slot_loss';
  value: number;
  description: string;
  
  // Peut être évité par certaines conditions
  avoidableBy?: string[];   // ['guard', 'shelter', 'perception_check']
}

export interface RestChoice {
  id: string;
  text: string;
  requirements?: {
    skills?: string[];
    items?: string[];
    classFeatures?: string[];
  };
  
  consequences: RestConsequence[];
  sceneTransition?: SceneTransition;
}

// === QUALITÉ DU REPOS ===

export const RestQuality = {
  POOR: 'poor',           // -1 niveau exhaustion non supprimé
  NORMAL: 'normal',       // Récupération standard
  GOOD: 'good',           // +1 Hit Die supplémentaire
  EXCELLENT: 'excellent'  // +1 HD + bonus temporaire
} as const;

export type RestQuality = typeof RestQuality[keyof typeof RestQuality];

export interface RestQualityBonus {
  quality: RestQuality;
  bonuses: {
    extraHitDice?: number;
    temporaryHP?: number;
    bonusToChecks?: number;  // Bonus aux jets pendant la prochaine journée
    inspiration?: boolean;   // Donne de l'inspiration
  };
}

// === REQUIREMENTS ET RESSOURCES ===

export interface RestRequirements {
  // Temps minimum (peut être interrompu)
  minimumDuration: number; // minutes
  
  // Ressources nécessaires
  requiredSupplies: RestSupply[];
  
  // Conditions d'environnement
  environmentalRequirements: {
    maxNoiseLevel: number;
    maxTemperatureVariation: number;
    requiresShelter: boolean;
  };
}

export interface RestSupply {
  type: 'rations' | 'water' | 'bedroll' | 'blanket' | 'torch' | 'firewood';
  quantity: number;
  consumed: boolean;       // Consommé pendant le repos
  essential: boolean;      // Repos impossible sans cet objet
}

// === EFFETS SPÉCIAUX ===

export interface RestEffect {
  id: string;
  name: string;
  description: string;
  
  // Conditions d'activation
  triggers: RestEffectTrigger[];
  
  // Effets sur le repos
  modifiers: RestModifier[];
  
  // Durée
  duration?: number; // En jours, undefined = permanent
}

export interface RestEffectTrigger {
  type: 'location' | 'item' | 'class_feature' | 'spell' | 'condition';
  value: string;
}

export interface RestModifier {
  type: 'healing_bonus' | 'time_reduction' | 'safety_bonus' | 'spell_recovery_bonus';
  value: number;
  description: string;
}

// === TYPES D'UNION PRINCIPAUX ===

export type Rest = ShortRest | LongRest;

export type RestResult = {
  success: boolean;
  rest: Rest;
  finalState: {
    hitPointsAfter: number;
    hitDiceAfter: Partial<Record<HitDie, number>>;
    spellSlotsAfter: Partial<Record<SpellLevel, number>>;
    conditionsAfter: string[];
    exhaustionLevel: number;
  };
  experience?: number; // XP gagné si événement résolu
  storyProgress?: string[]; // Flags de progression débloqués
};

// === TYPE GUARDS ===

export function isShortRest(rest: Rest): rest is ShortRest {
  return rest.type === 'short';
}

export function isLongRest(rest: Rest): rest is LongRest {
  return rest.type === 'long';
}

// === CONSTANTES D&D ===

export const REST_CONSTANTS = {
  SHORT_REST_DURATION: 60,      // 1 heure en minutes
  LONG_REST_DURATION: 480,      // 8 heures en minutes
  
  // Probabilités d'interruption par type de lieu (%)
  INTERRUPTION_CHANCES: {
    [RestLocationType.SAFE_INDOOR]: 5,
    [RestLocationType.SAFE_OUTDOOR]: 15,
    [RestLocationType.UNSAFE_OUTDOOR]: 35,
    [RestLocationType.DANGEROUS]: 60,
    [RestLocationType.MAGICAL]: 25
  },
  
  // Récupération Hit Dice lors du repos long
  HIT_DICE_RECOVERY_RATE: 0.5,  // 50% des Hit Dice
  
  // Exhaustion
  EXHAUSTION_RECOVERY_PER_LONG_REST: 1
} as const;