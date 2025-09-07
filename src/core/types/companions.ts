import type { CombatEntity } from './combat';
import type { CharacterId } from './character';
import type { DnDClass, Level, GridPosition } from './base';
import type { ClassSpecificData } from './classData';
import type { SceneTransition } from './scenes';

/**
 * Système de Compagnons - D&D 5e
 * Gère les PNJ alliés qui accompagnent le joueur avec relations, IA et quêtes personnelles
 */

export type CompanionId = `companion_${string}`;

// === PERSONALITÉ ET BACKSTORY ===

export const CompanionPersonality = {
  BRAVE: 'brave',           // Courageux, prend des risques
  CAUTIOUS: 'cautious',     // Prudent, évite les dangers
  CHEERFUL: 'cheerful',     // Optimiste, remonte le moral
  GRUMPY: 'grumpy',         // Râleur, mais loyal
  WISE: 'wise',             // Sage, donne des conseils
  NAIVE: 'naive',           // Innocent, fait confiance
  CYNICAL: 'cynical',       // Méfiant, pessimiste
  LOYAL: 'loyal',           // Fidèle jusqu'à la mort
  AMBITIOUS: 'ambitious',   // Ambitieux, veut progresser
  MYSTERIOUS: 'mysterious'  // Énigmatique, cache des secrets
} as const;

export type CompanionPersonality = typeof CompanionPersonality[keyof typeof CompanionPersonality];

export interface CompanionBackstory {
  origin: string;           // Origine (village, noble, orphelin, etc.)
  motivation: string;       // Pourquoi suit le joueur
  secret?: string;          // Secret caché (optionnel)
  goal: string;             // Objectif personnel
  fear?: string;            // Plus grande peur
  idealValue: string;       // Valeur/idéal principal
}

// === RELATIONS ===

export const RelationshipStatus = {
  HOSTILE: 'hostile',       // -100 à -51: Hostile
  UNFRIENDLY: 'unfriendly', // -50 à -21: Hostile mais pas violent
  NEUTRAL: 'neutral',       // -20 à +20: Neutre
  FRIENDLY: 'friendly',     // +21 à +50: Amical
  ALLIED: 'allied',         // +51 à +80: Allié loyal
  DEVOTED: 'devoted'        // +81 à +100: Dévoué/Amoureux
} as const;

export type RelationshipStatus = typeof RelationshipStatus[keyof typeof RelationshipStatus];

export const RomanceStatus = {
  NONE: 'none',                    // Pas d'intérêt romantique
  POTENTIAL: 'potential',          // Intérêt possible
  INTERESTED: 'interested',        // Intéressé·e
  COURTING: 'courting',           // En cours de séduction
  COUPLE: 'couple',               // En couple
  MARRIED: 'married',             // Marié·e
  REJECTED: 'rejected',           // Rejeté définitivement
  COMPLICATED: 'complicated'       // C'est compliqué
} as const;

export type RomanceStatus = typeof RomanceStatus[keyof typeof RomanceStatus];

export interface CompanionRelationship {
  companionId: CompanionId;
  playerId: CharacterId;
  
  // Loyauté (-100 à +100)
  loyaltyLevel: number;
  relationshipStatus: RelationshipStatus;
  
  // Romance (optionnel)
  romanceStatus: RomanceStatus;
  romanceFlags: string[];        // Flags de progression romantique
  
  // Historique des relations
  relationshipHistory: RelationshipEvent[];
  
  // Quête personnelle
  personalQuest?: PersonalQuest;
}

export interface RelationshipEvent {
  id: string;
  timestamp: Date;
  type: 'approval' | 'disapproval' | 'romance' | 'quest' | 'betrayal' | 'sacrifice';
  description: string;
  loyaltyChange: number;
  context: string;              // Contexte de l'événement
}

export interface PersonalQuest {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'active' | 'completed' | 'failed' | 'abandoned';
  
  objectives: QuestObjective[];
  rewards: QuestReward[];
  
  // Impact sur la relation
  completionLoyaltyBonus: number;
  failureLoyaltyPenalty: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  optional: boolean;
}

export interface QuestReward {
  type: 'loyalty' | 'romance' | 'ability' | 'item' | 'story';
  value: string | number;
  description: string;
}

// === DIALOGUE SYSTEM ===

export interface CompanionDialogue {
  companionId: CompanionId;
  
  // Dialogues contextuels
  contextualDialogues: Record<DialogueContext, DialogueNode[]>;
  
  // Banter entre compagnons
  banterTargets: Record<CompanionId, DialogueNode[]>;
  
  // Réactions aux choix du joueur
  choiceReactions: ChoiceReaction[];
}

export const DialogueContext = {
  GREETING: 'greeting',
  COMBAT_START: 'combat_start',
  COMBAT_END: 'combat_end',
  LEVEL_UP: 'level_up',
  DEATH: 'death',
  ROMANCE: 'romance',
  QUEST_PROGRESS: 'quest_progress',
  STORY_MOMENT: 'story_moment',
  CAMP: 'camp',
  SHOPPING: 'shopping'
} as const;

export type DialogueContext = typeof DialogueContext[keyof typeof DialogueContext];

export interface DialogueNode {
  id: string;
  text: string;
  conditions?: DialogueCondition[];
  responses?: DialogueResponse[];
  effects?: DialogueEffect[];
  oneTime?: boolean;           // Dialogue unique
  weight: number;              // Poids pour sélection aléatoire
}

export interface DialogueCondition {
  type: 'loyalty' | 'romance' | 'quest' | 'flag' | 'level' | 'location';
  value: string | number;
  operator: 'equals' | 'greater' | 'less' | 'contains';
}

export interface DialogueResponse {
  id: string;
  text: string;
  requirements?: DialogueCondition[];
  loyaltyChange?: number;
  romanceChange?: boolean;
  sceneTransition?: SceneTransition;
}

export interface DialogueEffect {
  type: 'loyalty' | 'romance' | 'flag' | 'item' | 'scene';
  value: string | number | boolean;
}

export interface ChoiceReaction {
  choiceId: string;             // ID du choix fait par le joueur
  reactionType: 'approve' | 'disapprove' | 'neutral' | 'surprised';
  dialogue: DialogueNode;
  loyaltyChange: number;
}

// === PARTY COMPOSITION ===

export interface PartyComposition {
  playerId: CharacterId;
  companions: CompanionId[];
  maxSize: number;              // Taille maximale (généralement 4)
  
  // Formation tactique
  formation: PartyFormation;
  
  // Synergies entre compagnons
  activeSynergies: PartySynergy[];
  
  // Bonus globaux
  partyBonuses: PartyBonus[];
}

export interface PartyFormation {
  name: string;
  positions: Record<CompanionId | CharacterId, FormationPosition>;
  description: string;
}

export interface FormationPosition {
  row: 'front' | 'middle' | 'back';
  side: 'left' | 'center' | 'right';
  gridPosition?: GridPosition;   // Position exacte sur la grille
}

export interface PartySynergy {
  id: string;
  name: string;
  description: string;
  participants: (CompanionId | CharacterId)[];
  requirements: SynergyRequirement[];
  bonuses: SynergyBonus[];
}

export interface SynergyRequirement {
  type: 'class_combination' | 'relationship' | 'equipment' | 'level';
  value: string | number;
}

export interface SynergyBonus {
  type: 'combat' | 'skill' | 'magic' | 'survival';
  effect: string;
  value: number;
}

export interface PartyBonus {
  id: string;
  name: string;
  description: string;
  source: 'synergy' | 'leadership' | 'loyalty' | 'romance';
  effect: BonusEffect;
}

export interface BonusEffect {
  type: 'attack_bonus' | 'damage_bonus' | 'skill_bonus' | 'save_bonus' | 'spell_bonus';
  value: number;
  duration?: 'combat' | 'day' | 'permanent';
}

// === COMPANION INTERFACE PRINCIPALE ===

export interface Companion extends Omit<CombatEntity, 'id'> {
  // Identification
  readonly id: CompanionId;
  type: 'ally';                 // Always 'ally' for companions
  
  // Données de classe (comme Character)
  class: DnDClass;
  level: Level;
  classData: ClassSpecificData<DnDClass>;
  
  // Personnalité et histoire
  personality: CompanionPersonality[];  // Un compagnon peut avoir plusieurs traits
  backstory: CompanionBackstory;
  
  // État du compagnion
  isRecruited: boolean;
  joinedAt?: Date;              // Quand a-t-il rejoint
  canLeave: boolean;            // Peut-il partir de lui-même
  
  // IA de compagnon (différente de l'IA ennemie)
  companionAI: CompanionAI;
  
  // Équipement personnel (ne peut pas être volé)
  personalItems: string[];      // IDs d'items qui lui appartiennent
}

// === IA COMPAGNON ===

export interface CompanionAI {
  // Préférences tactiques
  combatRole: 'tank' | 'dps' | 'support' | 'utility';
  aggressiveness: 'defensive' | 'balanced' | 'aggressive';
  
  // Comportement hors combat
  campBehavior: CampBehavior;
  explorationBehavior: ExplorationBehavior;
  
  // Prise de décision autonome
  autonomyLevel: 'full_control' | 'suggestions' | 'player_control';
  
  // Réactions émotionnelles
  emotionalState: EmotionalState;
}

export interface CampBehavior {
  prefersWatch: boolean;        // Aime monter la garde
  socialWith: CompanionId[];    // Compagnons avec qui il interagit
  soloActivities: string[];     // Activités qu'il fait seul
  helpfulness: number;          // Aide aux tâches (0-100)
}

export interface ExplorationBehavior {
  scoutingRole: boolean;        // Fait de l'éclairage
  collectsItems: boolean;       // Ramasse des objets
  makesComments: boolean;       // Commente l'environnement
  prefersLeading: boolean;      // Préfère mener le groupe
}

export interface EmotionalState {
  currentMood: 'happy' | 'neutral' | 'sad' | 'angry' | 'excited' | 'worried';
  stressLevel: number;          // 0-100
  homesickness: number;         // 0-100
  confidence: number;           // 0-100
}

// === UTILITY TYPES ===

export interface CompanionRecruitment {
  companionId: CompanionId;
  location: string;             // Où le recruter
  requirements: RecruitmentRequirement[];
  cost?: {
    gold?: number;
    items?: string[];
    reputation?: number;
  };
  dialogue: DialogueNode[];
}

export interface RecruitmentRequirement {
  type: 'level' | 'class' | 'quest' | 'reputation' | 'item' | 'choice';
  value: string | number;
  description: string;
}

// === EVENTS ET TRIGGERS ===

export interface CompanionEvent {
  id: string;
  companionId: CompanionId;
  type: 'join' | 'leave' | 'loyalty_change' | 'romance_progress' | 'quest_start' | 'quest_complete';
  timestamp: Date;
  data: Record<string, any>;
}

export interface CompanionTrigger {
  id: string;
  condition: TriggerCondition;
  effect: TriggerEffect;
  oneTime: boolean;
}

export interface TriggerCondition {
  type: 'time' | 'location' | 'event' | 'loyalty' | 'party_composition';
  value: any;
}

export interface TriggerEffect {
  type: 'dialogue' | 'quest' | 'leave' | 'loyalty_change' | 'scene';
  parameters: Record<string, any>;
}

// === TYPE GUARDS ===

export function isCompanion(entity: CombatEntity | Companion): entity is Companion {
  return entity.type === 'ally' && 'personality' in entity;
}

export function hasRomancePotential(companion: Companion): boolean {
  return companion.companionAI.emotionalState.currentMood !== 'angry' &&
         companion.personality.includes(CompanionPersonality.LOYAL);
}

export function canRecruit(companion: Companion, requirements: RecruitmentRequirement[]): boolean {
  return !companion.isRecruited && 
         requirements.every(_req => {
           // Logique de vérification des requirements
           // TODO: Implémenter selon le type
           return true;
         });
}

// === CONSTANTES ===

export const COMPANION_CONSTANTS = {
  MAX_PARTY_SIZE: 4,
  MIN_LOYALTY_TO_STAY: -50,
  MAX_LOYALTY_FOR_BETRAYAL: -80,
  
  // Bonus de loyauté
  LOYALTY_BONUS: {
    DAILY_INTERACTION: 1,
    HELP_IN_COMBAT: 5,
    COMPLETE_PERSONAL_QUEST: 25,
    ROMANCE_MILESTONE: 10,
    BETRAY_TRUST: -20,
    IGNORE_REPEATEDLY: -5
  },
  
  // Conditions de romance
  ROMANCE_REQUIREMENTS: {
    MIN_LOYALTY: 40,
    MIN_TIME_TOGETHER: 7, // jours
    MIN_INTERACTIONS: 10
  }
} as const;