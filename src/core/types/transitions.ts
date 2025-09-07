import type { SceneId, SceneTransition } from './scenes';
import type { ItemId } from './items';
import type { CharacterId } from './character';
import type { SpellId } from './spells';
import type { Ability } from './base';

// Extended scene transition with more details
export interface DetailedSceneTransition extends SceneTransition {
  type: TransitionType;
  conditions?: TransitionCondition[];
  effects?: GameStateChange[];
}

export const TransitionType = {
  SCENE: 'scene',
  COMBAT: 'combat',
  LOOT: 'loot',
  REST: 'rest',
  LEVEL_UP: 'level_up',
  MERCHANT: 'merchant',
  DEATH: 'death',
  VICTORY: 'victory',
  GAME_OVER: 'game_over',
  MENU: 'menu',
  SAVE: 'save',
  LOAD: 'load'
} as const;

export type TransitionType = typeof TransitionType[keyof typeof TransitionType];

export interface TransitionCondition {
  type: 'probability' | 'stat_check' | 'item_check' | 'quest_check' | 'companion_check';
  value: any;
  operator?: 'equal' | 'greater' | 'less' | 'has' | 'not_has';
  probability?: number; // 0-100%
}

export interface GameStateChange {
  type: GameStateChangeType;
  target?: string;
  value?: any;
  description?: string;
}

export const GameStateChangeType = {
  // Character changes
  GAIN_EXPERIENCE: 'gain_experience',
  GAIN_LEVEL: 'gain_level',
  MODIFY_HEALTH: 'modify_health',
  MODIFY_STAT: 'modify_stat',
  LEARN_SPELL: 'learn_spell',
  GAIN_SKILL: 'gain_skill',
  
  // Inventory changes
  ADD_ITEM: 'add_item',
  REMOVE_ITEM: 'remove_item',
  ADD_GOLD: 'add_gold',
  REMOVE_GOLD: 'remove_gold',
  EQUIP_ITEM: 'equip_item',
  UNEQUIP_ITEM: 'unequip_item',
  
  // Quest & Story
  START_QUEST: 'start_quest',
  COMPLETE_QUEST: 'complete_quest',
  UPDATE_QUEST: 'update_quest',
  SET_FLAG: 'set_flag',
  CLEAR_FLAG: 'clear_flag',
  
  // Companions
  ADD_COMPANION: 'add_companion',
  REMOVE_COMPANION: 'remove_companion',
  MODIFY_RELATIONSHIP: 'modify_relationship',
  
  // World state
  UNLOCK_SCENE: 'unlock_scene',
  LOCK_SCENE: 'lock_scene',
  MODIFY_WORLD_STATE: 'modify_world_state',
  
  // UI & System
  SHOW_MESSAGE: 'show_message',
  PLAY_SOUND: 'play_sound',
  SHOW_CUTSCENE: 'show_cutscene',
  TRIGGER_EVENT: 'trigger_event'
} as const;

export type GameStateChangeType = typeof GameStateChangeType[keyof typeof GameStateChangeType];

// Specific state change interfaces
export interface ExperienceReward extends GameStateChange {
  type: typeof GameStateChangeType.GAIN_EXPERIENCE;
  value: number;
  source?: string;
}

export interface ItemReward extends GameStateChange {
  type: typeof GameStateChangeType.ADD_ITEM;
  value: {
    itemId: ItemId;
    quantity: number;
    quality?: 'poor' | 'normal' | 'superior' | 'exceptional';
  };
}

export interface GoldReward extends GameStateChange {
  type: typeof GameStateChangeType.ADD_GOLD;
  value: number;
}

export interface StatModification extends GameStateChange {
  type: typeof GameStateChangeType.MODIFY_STAT;
  target: Ability;
  value: number;
  duration?: number; // Permanent si undefined
  source?: string;
}

export interface HealthModification extends GameStateChange {
  type: typeof GameStateChangeType.MODIFY_HEALTH;
  value: number; // Positif = heal, négatif = damage
  healingType?: 'magical' | 'natural' | 'potion' | 'rest';
  canExceedMax?: boolean;
}

export interface SpellReward extends GameStateChange {
  type: typeof GameStateChangeType.LEARN_SPELL;
  value: {
    spellId: SpellId;
    spellLevel: number;
    source: 'levelup' | 'scroll' | 'training' | 'quest';
  };
}

export interface QuestUpdate extends GameStateChange {
  type: typeof GameStateChangeType.START_QUEST | typeof GameStateChangeType.COMPLETE_QUEST | typeof GameStateChangeType.UPDATE_QUEST;
  target: string; // Quest ID
  value?: {
    objectiveId?: string;
    newStatus?: 'active' | 'completed' | 'failed' | 'paused';
    progress?: number;
  };
}

export interface CompanionChange extends GameStateChange {
  type: typeof GameStateChangeType.ADD_COMPANION | typeof GameStateChangeType.REMOVE_COMPANION;
  target: CharacterId;
  value?: {
    permanent?: boolean;
    reason?: string;
  };
}

export interface RelationshipChange extends GameStateChange {
  type: typeof GameStateChangeType.MODIFY_RELATIONSHIP;
  target: CharacterId;
  value: number; // -100 à +100
}

export interface FlagChange extends GameStateChange {
  type: typeof GameStateChangeType.SET_FLAG | typeof GameStateChangeType.CLEAR_FLAG;
  target: string; // Flag name
  value?: any; // Flag value (si SET_FLAG)
}

export interface MessageDisplay extends GameStateChange {
  type: typeof GameStateChangeType.SHOW_MESSAGE;
  value: {
    text: string;
    title?: string;
    duration?: number;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    sound?: string;
  };
}

export interface SceneUnlock extends GameStateChange {
  type: typeof GameStateChangeType.UNLOCK_SCENE;
  target: SceneId;
  value?: {
    permanent?: boolean;
    notifyPlayer?: boolean;
  };
}

export interface CutsceneTrigger extends GameStateChange {
  type: typeof GameStateChangeType.SHOW_CUTSCENE;
  value: {
    cutsceneId: string;
    skippable?: boolean;
    voiceOver?: boolean;
    subtitles?: boolean;
  };
}

// Types pour les conditions de transition complexes
export interface ConditionalTransition {
  conditions: TransitionCondition[];
  operator: 'and' | 'or';
  transition: DetailedSceneTransition;
  priority: number; // Plus haut = priorité plus élevée
}

export interface MultipleChoiceOutcome {
  choices: {
    [choiceId: string]: DetailedSceneTransition[];
  };
  defaultTransition?: DetailedSceneTransition;
  randomWeight?: number; // Pour les choix aléatoires
}

export interface TimedTransition {
  transition: DetailedSceneTransition;
  delay: number; // En millisecondes
  canCancel?: boolean;
  warningMessage?: string;
  countdownDisplay?: boolean;
}

export interface ProgressiveTransition {
  stages: {
    progress: number; // 0-100%
    transition: DetailedSceneTransition;
    description?: string;
  }[];
  currentProgress: number;
  progressSource: 'time' | 'actions' | 'external';
}

// Union types pour type safety
export type SpecificGameStateChange = 
  | ExperienceReward
  | ItemReward  
  | GoldReward
  | StatModification
  | HealthModification
  | SpellReward
  | QuestUpdate
  | CompanionChange
  | RelationshipChange
  | FlagChange
  | MessageDisplay
  | SceneUnlock
  | CutsceneTrigger;

export type ComplexTransition = 
  | ConditionalTransition
  | MultipleChoiceOutcome
  | TimedTransition
  | ProgressiveTransition;