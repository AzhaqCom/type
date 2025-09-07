import type { Ability, Skill, GridPosition, TerrainTile } from './base';
import type { ItemId } from './items';
import type { CharacterId } from './character';
import type { CombatAI } from './combatAI';
import type { CompanionId } from './companions';
import type { CombatEntityId } from './combat';

export type SceneId = `scene_${string}`;
export type ChoiceId = `choice_${string}`;
export type EnemyId = `enemy_${string}`;
export type FlagName = string;

// Basic transition type (detailed version in transitions.ts)
export interface SceneTransition {
  type: string;
  targetScene?: SceneId;
  delay?: number;
  animation?: string;
  effects?: any[];
}

export const SceneType = {
  NARRATIVE: 'narrative',
  COMBAT: 'combat',
  MERCHANT: 'merchant',
  REST: 'rest',
  LOOT: 'loot',
  CHARACTER_CREATION: 'character_creation',
  LEVEL_UP: 'level_up',
  CAMP: 'camp'
} as const;

export type SceneType = typeof SceneType[keyof typeof SceneType];

export interface BaseScene {
  id: SceneId;
  type: SceneType;
  title: string;
  description: string;
  background?: string;
  music?: string;
  lighting?: 'bright' | 'dim' | 'dark';
  environment?: string;
  visited?: boolean;
  prerequisites?: SceneCondition[];
  
  // Sauvegarde automatique
  autoSave?: boolean; // true par défaut
  savePointName?: string;
  
  // Récompenses d'entrée (optionnelles)
  entryRewards?: SceneReward[];
}

export interface NarrativeScene extends BaseScene {
  type: typeof SceneType.NARRATIVE;
  text: string;
  speaker?: {
    name: string;
    portrait?: string;
    voice?: string;
  };
  choices: Choice[];
  autoProgress?: {
    delay: number; // En millisecondes
    targetChoice: ChoiceId;
  };
  cinematicElements?: {
    showPortrait?: boolean;
    textAnimation?: 'typewriter' | 'fade' | 'instant';
    backgroundEffects?: string[];
  };
}

export interface CombatScene extends BaseScene {
  type: typeof SceneType.COMBAT;
  enemies: EnemyGroup[];
  battleMap: {
    width: number;
    height: number;
    terrain: TerrainTile[][];
    startingPositions: {
      player: GridPosition[];
      allies: GridPosition[];
      enemies: GridPosition[];
    };
  };
  victoryConditions: VictoryCondition[];
  defeatConditions: DefeatCondition[];
  rewards: CombatReward;
  victoryScene?: SceneId; // Scene to transition to on victory
  defeatScene?: SceneId; // Scene to transition to on defeat
  backgroundMusic?: string;
  ambientSounds?: string[];
  
  // IA complexe pour chaque entité
  enemyAIProfiles?: Record<CombatEntityId, CombatAI>;
  companionAIProfiles?: Record<CharacterId, CombatAI>;
  
  // Comportements de groupe et renforts
  enemyBehavior?: {
    coordination: 'independent' | 'pack' | 'formation' | 'tactical';
    reinforcements?: ReinforcementWave[];
  };
}

export interface MerchantScene extends BaseScene {
  type: typeof SceneType.MERCHANT;
  merchantId: string;
  merchantName: string;
  merchantPortrait?: string;
  inventory: MerchantItem[];
  buybackItems?: ItemId[];
  services?: MerchantService[];
  disposition: 'friendly' | 'neutral' | 'hostile' | 'suspicious';
  haggling?: {
    enabled: boolean;
    skillCheck: Ability;
    difficultyClass: number;
    maxDiscount: number;
  };
}

export interface RestScene extends BaseScene {
  type: typeof SceneType.REST;
  restType: 'short' | 'long';
  interruptions?: RestInterruption[];
  healingMultiplier?: number;
  spellSlotRecovery?: boolean;
  safeRest?: boolean;
  campfireEvents?: CampfireEvent[];
}

export interface LootScene extends BaseScene {
  type: typeof SceneType.LOOT;
  lootSource: 'chest' | 'corpse' | 'hidden' | 'reward';
  items: LootItem[];
  trapped?: {
    detectDC: number;
    disarmDC: number;
    trapType: string;
    damage?: string;
    effect?: string;
  };
  locked?: {
    lockDC: number;
    keyRequired?: ItemId;
    canBash?: boolean;
    bashDC?: number;
  };
}

export interface CampScene extends BaseScene {
  type: typeof SceneType.CAMP;
  availableActions: CampAction[];
  companions: CharacterId[];
  campfireEvents?: CampfireEvent[];
  randomEvents?: RandomEvent[];
}

// Types de support pour les scènes

export interface EnemyGroup {
  templateId: string;
  count: number;
}

export interface Choice {
  id: ChoiceId;
  text: string;
  requirements?: ChoiceRequirement[];
  consequences: SceneTransition[];  // Navigation
  rewards?: SceneReward[];          // Récompenses immédiates
  skillCheck?: SkillCheck;
  hidden?: boolean;
  oneTime?: boolean;
  cost?: {
    gold?: number;
    items?: { itemId: ItemId; quantity: number }[];
  };
}

export interface ChoiceRequirement {
  type: 'level' | 'class' | 'ability' | 'skill' | 'item' | 'quest' | 'companion' | 'flag';
  value: any;
  comparison?: 'equal' | 'greater' | 'less' | 'has' | 'not_has';
  flagName?: FlagName; // Pour type 'flag'
}

export interface SkillCheck {
  ability: Ability;
  skill?: Skill;
  difficultyClass: number;
  advantage?: boolean;
  disadvantage?: boolean;
  consequences: {
    success: SceneTransition[];
    failure: SceneTransition[];
    criticalSuccess?: SceneTransition[];
    criticalFailure?: SceneTransition[];
  };
}

export interface SkillCheckResult {
  skillCheck: SkillCheck;
}

export interface SceneCondition {
  type: 'level' | 'quest' | 'item' | 'scene_visited' | 'companion' | 'time' | 'flag';
  value: any;
  operator: 'equal' | 'greater' | 'less' | 'has' | 'completed';
  flagName?: FlagName; // Pour type 'flag'
}


export interface VictoryCondition {
  type: 'eliminate_all' | 'eliminate_target' | 'survive_turns' | 'reach_position' | 'protect_ally';
  target?: CombatEntityId | CharacterId;
  position?: GridPosition;
  turns?: number;
}

export interface DefeatCondition {
  type: 'player_death' | 'ally_death' | 'time_limit' | 'objective_failed';
  target?: CharacterId;
  timeLimit?: number;
}

export interface CombatReward {
  experience: number;
  gold: number;
  items?: LootItem[];
  storyRewards?: string[];
}

export interface MerchantItem {
  itemId: ItemId;
  price: number;
  quantity: number;
  condition?: 'new' | 'used' | 'damaged';
  availability?: 'always' | 'limited' | 'special';
}

export interface MerchantService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'repair' | 'identify' | 'enchant' | 'remove_curse' | 'training';
}

export interface RestInterruption {
  probability: number;
  type: 'combat' | 'theft' | 'discovery' | 'weather';
  description: string;
  consequences: SceneTransition[];
}

export interface CampfireEvent {
  id: string;
  title: string;
  description: string;
  participants: CharacterId[];
  trigger?: 'manual' | 'random' | 'scripted';
  effects?: {
    morale?: number;
    relationships?: { [characterId: string]: number };
    buffs?: string[];
  };
}

export interface LootItem {
  itemId: ItemId;
  quantity: number;
  probability: number; // 0-100%
  condition?: 'perfect' | 'good' | 'damaged';
}

export interface CampAction {
  id: string;
  name: string;
  description: string;
  type: 'talk' | 'craft' | 'study' | 'practice' | 'rest' | 'organize';
  timeRequired?: number;
  requirements?: ChoiceRequirement[];
  effects?: any;
}

export interface RandomEvent {
  id: string;
  name: string;
  description: string;
  probability: number;
  consequences: SceneTransition[];
  oneTime?: boolean;
}

// Union type pour toutes les scènes
export type Scene = NarrativeScene | CombatScene | MerchantScene | RestScene | LootScene | CampScene;

// Type guards
export function isNarrativeScene(scene: Scene): scene is NarrativeScene {
  return scene.type === SceneType.NARRATIVE;
}

export function isCombatScene(scene: Scene): scene is CombatScene {
  return scene.type === SceneType.COMBAT;
}

export function isMerchantScene(scene: Scene): scene is MerchantScene {
  return scene.type === SceneType.MERCHANT;
}

export function isRestScene(scene: Scene): scene is RestScene {
  return scene.type === SceneType.REST;
}

export function isLootScene(scene: Scene): scene is LootScene {
  return scene.type === SceneType.LOOT;
}

export function isCampScene(scene: Scene): scene is CampScene {
  return scene.type === SceneType.CAMP;
}

// ========== AJOUTS POUR SYSTÈME AVANCÉ ==========

// Système de flags global
export interface GameFlag {
  name: FlagName;
  type: 'boolean' | 'numeric' | 'string';
  value: boolean | number | string;
  description: string;
  category: 'story' | 'companion' | 'achievement' | 'unlock';
}

// Système de récompenses
export interface SceneReward {
  type: 'xp' | 'gold' | 'item' | 'companion' | 'flag' | 'relationship';
  
  // Valeurs numériques
  amount?: number;
  itemId?: ItemId;
  companionId?: CompanionId;
  
  // Flags
  flagName?: FlagName;
  flagValue?: boolean | number | string;
  
  // Relations avec compagnons
  relationshipChange?: number;
  
  // Interface utilisateur
  description: string;
  showPopup?: boolean;
}

// Renforts pour combats
export interface ReinforcementWave {
  triggerCondition: 'turn' | 'enemy_death' | 'player_hp' | 'position';
  triggerValue: number;
  enemies: CombatEntityId[];
  spawnPositions: GridPosition[];
  description?: string;
}