import type { CombatEntityId } from './combat';
import type { ItemId } from './items';
import type { DamageType, GridPosition } from './base';

// Types d'actions possibles
export const ActionType = {
  ATTACK: 'attack',
  CAST_SPELL: 'cast_spell',
  MOVE: 'move',
  DASH: 'dash',
  DODGE: 'dodge',
  HELP: 'help',
  HIDE: 'hide',
  READY: 'ready',
  SEARCH: 'search',
  USE_ITEM: 'use_item'
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

// Interface de base pour toutes les actions (combat et hors-combat)
export interface BaseGameAction {
  id: string;
  type: ActionType;
  actorId: CombatEntityId;
  timestamp: Date;
  description: string;
}

// Action de lancement de sort (combat et hors-combat)
export interface SpellCastAction extends BaseGameAction {
  type: typeof ActionType.CAST_SPELL;
  
  spellName: string;           // "Projectile Magique"
  castAtLevel: number;         // Niveau de cast pour scaling
  
  // Ciblage flexible selon le type de sort
  targets?: CombatEntityId[];  // Cibles entités (créatures)
  targetPosition?: GridPosition; // Position pour sorts de zone  
  targetItemId?: ItemId;       // Objet ciblé (ex: Lumière sur une torche)
  
  // Informations calculées/validées
  spellSlotUsed?: number;      // Slot de sort consommé
  range: string;               // "36 mètres"
  duration?: string;           // Pour les sorts à durée
}

// Action d'attaque au corps à corps
export interface MeleeAttackAction extends BaseGameAction {
  type: typeof ActionType.ATTACK;
  
  weaponId?: ItemId;           // undefined = unarmed attack
  targets: CombatEntityId[];   // Généralement 1 cible
  
  // Calculés par le système
  attackBonus?: number;
  damageRoll?: string;         // "1d8+3"
  damageType?: DamageType;
  criticalRange?: number;      // 20 par défaut, 19-20 pour certaines armes
}

// Action d'attaque à distance
export interface RangedAttackAction extends BaseGameAction {
  type: typeof ActionType.ATTACK;
  
  weaponId: ItemId;            // Arc, arbalète, etc.
  targets: CombatEntityId[];
  range: number;               // Portée en pieds/mètres
  
  // Spécifique au tir
  ammunitionUsed?: ItemId;     // Flèche, carreau
  disadvantage?: boolean;      // Tir en mêlée, cible à couvert
  advantage?: boolean;         // Cible prone, flanking
}

// Action de mouvement
export interface MoveAction extends BaseGameAction {
  type: typeof ActionType.MOVE;
  
  fromPosition: GridPosition;
  toPosition: GridPosition;
  movementCost: number;        // Cases de mouvement consommées
  
  // Mouvement spéciaux
  isDash?: boolean;            // Mouvement double
  triggersOpportunityAttacks?: boolean; // Sort de zone de contrôle
}

// Action de dodge (esquive)
export interface DodgeAction extends BaseGameAction {
  type: typeof ActionType.DODGE;
  // Pas de propriétés spécifiques, donne advantage aux attaques contre l'acteur
}

// Action d'aide
export interface HelpAction extends BaseGameAction {
  type: typeof ActionType.HELP;
  
  target: CombatEntityId;      // Allié aidé
  assistType: 'attack' | 'ability_check'; // Type d'aide
  nextAction?: string;         // Action suivante de l'allié qui bénéficiera
}

// Action de se cacher
export interface HideAction extends BaseGameAction {
  type: typeof ActionType.HIDE;
  
  stealthRoll: number;         // Résultat du jet de Stealth
  visibility: 'hidden' | 'lightly_obscured' | 'heavily_obscured';
}

// Action d'utilisation d'objet
export interface UseItemAction extends BaseGameAction {
  type: typeof ActionType.USE_ITEM;
  
  itemId: ItemId;
  targets?: CombatEntityId[];  // Pour potions de soin sur allié
  
  // Spécifique à l'objet
  consumesItem?: boolean;      // Potion vs objet réutilisable
  activationTime: 'action' | 'bonus_action' | 'reaction';
}

// Action de préparation (ready action)
export interface ReadyAction extends BaseGameAction {
  type: typeof ActionType.READY;
  
  trigger: string;             // "Quand l'ennemi approche"
  preparedAction: GameAction; // Action à déclencher
  triggerRange?: number;       // Portée du trigger
}

// Action de recherche
export interface SearchAction extends BaseGameAction {
  type: typeof ActionType.SEARCH;
  
  searchType: 'hidden_enemies' | 'traps' | 'secrets' | 'items';
  perceptionRoll: number;      // Jet de Perception
  investigationRoll?: number;  // Jet d'Investigation si applicable
  areaSearched: GridPosition[]; // Zones fouillées
}

// Union type pour toutes les actions (combat et hors-combat)
export type GameAction = 
  | SpellCastAction
  | MeleeAttackAction 
  | RangedAttackAction
  | MoveAction
  | DodgeAction
  | HelpAction
  | HideAction
  | UseItemAction
  | ReadyAction
  | SearchAction;

// Note: CombatEffect system removed - effects are now handled 
// directly by the game engine based on action types and spell definitions

// Type guards pour les actions
export function isSpellAction(action: GameAction): action is SpellCastAction {
  return action.type === ActionType.CAST_SPELL;
}

export function isAttackAction(action: GameAction): action is MeleeAttackAction | RangedAttackAction {
  return action.type === ActionType.ATTACK;
}

export function isMoveAction(action: GameAction): action is MoveAction {
  return action.type === ActionType.MOVE;
}