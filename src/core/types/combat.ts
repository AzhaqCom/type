import type { AbilityScore, Ability, Skill, GridPosition, TerrainTile } from './base';
import type { InventoryState, EquippedItems } from './inventory';

export type CombatEntityId = `entity_${string}`;

// Types de base pour le combat
export const CreatureSize = {
  TINY: 'tiny',
  SMALL: 'small', 
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
  GARGANTUAN: 'gargantuan'
} as const;

export type CreatureSize = typeof CreatureSize[keyof typeof CreatureSize];

export const CreatureType = {
  BEAST: 'beast',
  HUMANOID: 'humanoid',
  DRAGON: 'dragon',
  UNDEAD: 'undead',
  FIEND: 'fiend',
  CELESTIAL: 'celestial',
  ELEMENTAL: 'elemental',
  FEY: 'fey',
  GIANT: 'giant',
  MONSTROSITY: 'monstrosity'
} as const;

export type CreatureType = typeof CreatureType[keyof typeof CreatureType];

export const EntityType = {
  PLAYER: 'player',
  ALLY: 'ally',
  FAMILIAR: 'familiar',
  ENEMY: 'enemy',
  BOSS: 'boss'
} as const;

export type EntityType = typeof EntityType[keyof typeof EntityType];

// Stats de combat en temps réel
export interface CombatStats {
  currentHitPoints: number;
  maxHitPoints: number;
  temporaryHitPoints: number;
  armorClass: number;
  initiative: number;
  speed: number;
  
  // Conditions D&D
  conditions: CombatCondition[];
  
  // Résistances/immunités 
  damageResistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
}

export const CombatCondition = {
  BLINDED: 'blinded',
  CHARMED: 'charmed',
  DEAFENED: 'deafened',
  FRIGHTENED: 'frightened',
  GRAPPLED: 'grappled',
  INCAPACITATED: 'incapacitated',
  INVISIBLE: 'invisible',
  PARALYZED: 'paralyzed',
  PETRIFIED: 'petrified',
  POISONED: 'poisoned',
  PRONE: 'prone',
  RESTRAINED: 'restrained',
  STUNNED: 'stunned',
  UNCONSCIOUS: 'unconscious'
} as const;

export type CombatCondition = typeof CombatCondition[keyof typeof CombatCondition];

// Interface commune pour toutes les entités de combat
export interface CombatEntity {
  readonly id: CombatEntityId;
  name: string;
  type: EntityType; // ← Ajouté !
  
  // Classification
  size: CreatureSize;
  creatureType: CreatureType;
  
  // Stats D&D
  abilityScores: Record<Ability, AbilityScore>;
  skillBonuses: Partial<Record<Skill, number>>;
  savingThrowBonuses: Partial<Record<Ability, number>>;
  
  // Combat
  combatStats: CombatStats;
  position?: GridPosition;
  
  // Équipement (optionnel pour les monstres)
  inventory?: InventoryState;
  equipment?: EquippedItems;
  
  // État
  isAlive: boolean;
  isConscious: boolean;
  canAct: boolean;
}

// Re-export ActionType from gameActions.ts
export type { ActionType } from './gameActions';

// Re-export GameAction from gameActions.ts for compatibility
export type { GameAction as CombatAction } from './gameActions';

// Tour de combat
export interface CombatTurn {
  entityId: CombatEntityId;
  initiative: number;
  actionsRemaining: number;
  bonusActionUsed: boolean;
  reactionUsed: boolean;
  movementRemaining: number;
}

// État général du combat
export interface CombatState {
  isActive: boolean;
  currentTurn: number;
  currentEntityId?: CombatEntityId;
  turnOrder: CombatTurn[];
  battleMap: {
    width: number;
    height: number;
    terrain: TerrainTile[][];
  };
}

