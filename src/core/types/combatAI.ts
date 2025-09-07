import type { CombatEntityId } from './combat';
import type { GameAction } from './gameActions';
import type { SpellId } from './spells';
import type { ItemId } from './items';
import type { GridPosition } from './base';

// Types de base pour l'IA de combat
export const AIPersonality = {
  AGGRESSIVE: 'aggressive',     // Attaque sans réfléchir
  DEFENSIVE: 'defensive',       // Prudent, privilégie la survie
  TACTICAL: 'tactical',         // Utilise la meilleure stratégie
  SUPPORT: 'support',           // Focus sur aider les alliés
  OPPORTUNIST: 'opportunist'    // Exploite les faiblesses
} as const;

export type AIPersonality = typeof AIPersonality[keyof typeof AIPersonality];

export const CombatRole = {
  TANK: 'tank',                 // Absorbe les dégâts, protège
  DPS: 'dps',                   // Dégâts principaux
  SUPPORT: 'support',           // Soins, buffs
  CONTROLLER: 'controller'      // Contrôle du champ de bataille
} as const;

export type CombatRole = typeof CombatRole[keyof typeof CombatRole];

export const AIState = {
  PLANNING: 'planning',         // Évalue les options
  EXECUTING: 'executing',       // Exécute une action
  WAITING: 'waiting',           // Attend son tour
  REACTING: 'reacting',         // Réaction à un événement
  DISABLED: 'disabled'          // KO, paralysé, etc.
} as const;

export type AIState = typeof AIState[keyof typeof AIState];

// IA spécialisée pour combat au corps à corps
export interface MeleeAI {
  aggressiveness: 'low' | 'medium' | 'high';
  targeting: 'closest' | 'weakest' | 'strongest' | 'random';
  fleeThreshold: number;        // % HP pour fuir
  flanking: boolean;            // Essaie de flanquer
  opportunityAttacks: boolean;  // Utilise les attaques d'opportunité
}

// IA spécialisée pour combat à distance
export interface RangedAI {
  preferredRange: number;       // Distance optimale
  targeting: 'closest' | 'weakest' | 'high_priority' | 'support_first';
  ammunition: number;           // Munitions disponibles
  kiting: boolean;              // Maintient la distance
  coverSeeking: boolean;        // Cherche les abris
}

// IA spécialisée pour lanceurs de sorts
export interface SpellcasterAI {
  decisionMaking: 'player' | 'companion' | 'enemy';
  tacticalPriority: 'offensive' | 'defensive' | 'support' | 'utility';
  spellUsagePattern: 'conservative' | 'aggressive' | 'optimal';
  
  // Gestion des ressources
  slotConservation: number;     // % slots à garder en réserve
  cantripsFirst: boolean;       // Utilise les cantrips avant les slots
  
  // Préférences tactiques
  areaSpellThreshold: number;   // Nombre d'ennemis pour sort de zone
  buffPriority: number;         // Priorité des buffs (0-100)
  healThreshold: number;        // % HP pour déclencher soins
}

// Options d'actions disponibles à chaque tour
export interface TurnOptions {
  // Actions de base
  meleeActions: MeleeAction[];
  rangedActions: RangedAction[];
  spellActions: SpellAction[];
  movementActions: MovementAction[];
  
  // Actions spéciales
  itemActions: ItemAction[];
  environmentActions: EnvironmentAction[];
}

export interface MeleeAction {
  type: 'attack' | 'grapple' | 'shove';
  weaponId?: ItemId;
  target: CombatEntityId;
  attackBonus: number;
  damageEstimate: number;
  criticalChance: number;
}

export interface RangedAction {
  type: 'shoot' | 'throw';
  weaponId: ItemId;
  target: CombatEntityId;
  range: number;
  attackBonus: number;
  damageEstimate: number;
  ammunitionCost: number;
}

export interface SpellAction {
  spellId: SpellId;
  spellName: string;
  level: number;
  targets: CombatEntityId[];
  targetPosition?: GridPosition;
  slotCost: number;
  damageEstimate?: number;
  utilityValue: number;         // Valeur tactique (0-100)
}

export interface MovementAction {
  type: 'move' | 'dash' | 'disengage';
  fromPosition: GridPosition;
  toPosition: GridPosition;
  cost: number;
  triggersOpportunityAttacks: boolean;
  tacticalAdvantage: number;    // Gain tactique de ce mouvement
}

export interface ItemAction {
  itemId: ItemId;
  itemName: string;
  type: 'consume' | 'activate' | 'throw';
  target?: CombatEntityId;
  estimatedBenefit: number;
}

export interface EnvironmentAction {
  type: 'interact' | 'hide' | 'search';
  position: GridPosition;
  description: string;
  successChance: number;
}

// Priorités pour les IA hybrides
export interface HybridPriority {
  preferSpells: boolean;        // Magie ou combat physique
  spellThreshold: number;       // Cast sort si slots > X%
  rangePreference: 'close' | 'medium' | 'distant';
  
  // Conditions de switch
  healthThreshold: number;      // Change de tactique si HP < X%
  outnumberedThreshold: number; // Change si ratio ennemis > X
}

// Interface principale pour l'IA de combat
export interface CombatAI {
  // Classification de base
  type: 'melee' | 'ranged' | 'spellcaster' | 'hybrid';
  personality: AIPersonality;
  combatRole: CombatRole;
  
  // Spécialisations optionnelles selon le type
  meleeAI?: MeleeAI;
  rangedAI?: RangedAI;
  spellcasterAI?: SpellcasterAI;
  
  // Pour les personnages hybrides uniquement
  hybridPriority?: HybridPriority;
  
  // État de l'IA
  currentState: AIState;
  currentPlan?: AIDecision[];
  lastAction?: GameAction;
  threatAssessment?: ThreatLevel[];
  
  // Temps de réflexion (pour l'immersion)
  thinkingTime?: number;  // ms
  confidence?: number;    // 0-100% confiance dans la décision
}

// Décision prise par l'IA
export interface AIDecision {
  action: GameAction;
  priority: number;             // Priorité de cette action (0-100)
  reasoning: string;            // Debug : pourquoi cette action
  alternatives: GameAction[];   // Autres actions considérées
}

// Évaluation des menaces
export interface ThreatLevel {
  entityId: CombatEntityId;
  threatScore: number;          // Score de menace (0-100)
  distance: number;
  canReachThisTurn: boolean;
  estimatedDamage: number;
}

// Fonctions utilitaires pour valider les capacités
export function canCastSpells(ai: CombatAI): boolean {
  return ai.type === 'spellcaster' || ai.type === 'hybrid';
}

export function canMeleeAttack(ai: CombatAI): boolean {
  return ai.type === 'melee' || ai.type === 'hybrid';
}

export function canRangedAttack(ai: CombatAI): boolean {
  return ai.type === 'ranged' || ai.type === 'hybrid';
}

// Type guards
export function isPlayerControlled(ai: CombatAI): boolean {
  return ai.spellcasterAI?.decisionMaking === 'player';
}

export function isCompanionAI(ai: CombatAI): boolean {
  return ai.spellcasterAI?.decisionMaking === 'companion';
}

export function isEnemyAI(ai: CombatAI): boolean {
  return ai.spellcasterAI?.decisionMaking === 'enemy';
}