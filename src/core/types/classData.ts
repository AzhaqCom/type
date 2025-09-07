import type { DnDClass, Skill, Level } from './base';
import type { SpellId } from './spells';
import type { ItemId } from './items';
import type { WizardSchool, FighterArchetype, RoguishArchetype, ClericDomain } from './subclasses';

/**
 * Données spécifiques à chaque classe D&D
 * Utilise une union discriminée pour le type safety
 */

// Type discriminé pour les données spécifiques selon la classe
export type ClassSpecificData<T extends DnDClass> = 
  T extends 'wizard' ? WizardData :
  T extends 'fighter' ? FighterData :
  T extends 'rogue' ? RogueData :
  T extends 'cleric' ? ClericData :
  T extends 'barbarian' ? BarbarianData :
  T extends 'bard' ? BardData :
  T extends 'druid' ? DruidData :
  T extends 'monk' ? MonkData :
  T extends 'paladin' ? PaladinData :
  T extends 'ranger' ? RangerData :
  T extends 'sorcerer' ? SorcererData :
  T extends 'warlock' ? WarlockData :
  BaseClassData;

// Données de base communes à toutes les classes
export interface BaseClassData {
  // Niveau où la sous-classe est choisie (pour faciliter les calculs)
  subclassLevel?: Level;
  
  // État des features de sous-classe (pas les définitions)
  subclassFeatureState?: Record<string, any>;
}

// ===== WIZARD =====
export interface WizardData extends BaseClassData {
  // Spellbook contient TOUS les sorts connus (pas les cantrips)
  spellbook: Set<SpellId>;
  
  // Sorts préparés aujourd'hui (INT mod + wizard level)
  preparedSpells: Set<SpellId>;
  
  // Cantrips connus
  knownCantrips: Set<SpellId>;
  
  // Arcane Recovery (1x par long rest)
  arcaneRecoveryUsed: boolean;
  arcaneRecoverySlots: number; // = Math.ceil(wizardLevel / 2)
  
  // Tradition Arcanique choisie au niveau 2
  arcaneTradition?: WizardSchool;
  
  // === Features de sous-classe ===
  
  // École d'Abjuration - Arcane Ward
  arcaneWard?: {
    maxHP: number;      // 2 × wizard level + INT modifier
    currentHP: number;
    active: boolean;
  };
  
  // École d'Évocation - Sculpt Spells
  sculptSpells?: {
    protectedTargets: number; // 1 + spell level
    usedThisTurn: boolean;
  };
  
  // École de Divination - Portent (niveau 2)
  portentDice?: {
    rolls: number[];    // 2 dés au niveau 2, 3 au niveau 14
    used: boolean[];
  };
}

// ===== FIGHTER =====
export interface FighterData extends BaseClassData {
  // Fighting Style (niveau 1)
  fightingStyle?: 'archery' | 'defense' | 'dueling' | 'great_weapon' | 'protection' | 'two_weapon';
  
  // Second Wind (niveau 1)
  secondWindUsed: boolean;
  secondWindHealing: string; // "1d10 + fighter level"
  
  // Action Surge (niveau 2)
  actionSurgeUsed: boolean;
  actionSurgeUses: number; // 1 au niveau 2, 2 au niveau 17
  
  // Archétype martial (niveau 3)
  martialArchetype?: FighterArchetype;
  
  // === Features de sous-classe ===
  
  // Champion - Improved Critical (niveau 3)
  improvedCritical?: {
    criticalRange: number; // 19-20 au lieu de 20
  };
  
  // Battle Master - Maneuvers (niveau 3)
  battleMaster?: {
    maneuvers: Set<string>;
    superiorityDice: number; // 4d8 au niveau 3
    superiorityDiceUsed: number;
  };
  
  // Eldritch Knight - Spellcasting (niveau 3)
  // Géré via spellcasting dans Character
}

// ===== ROGUE =====
export interface RogueData extends BaseClassData {
  // Sneak Attack (niveau 1)
  sneakAttackDice: number; // 1d6 au niveau 1, +1d6 tous les 2 niveaux
  
  // Thieves' Cant (niveau 1) 
  thievesCant: boolean;
  
  // Expertise (niveau 1 et 6)
  expertiseSkills: Set<Skill>;
  
  // Cunning Action (niveau 2)
  cunningActionAvailable: boolean;
  
  // Archétype de roublard (niveau 3)
  roguishArchetype?: RoguishArchetype;
  
  // === Features de sous-classe ===
  
  // Thief - Fast Hands (niveau 3)
  fastHands?: boolean;
  
  // Assassin - Assassinate (niveau 3)
  assassinate?: {
    hasAdvantageVsSurprised: boolean;
    critOnSurprise: boolean;
  };
  
  // Arcane Trickster - Spellcasting (niveau 3)
  // Géré via spellcasting dans Character
}

// ===== CLERIC =====
export interface ClericData extends BaseClassData {
  // Domaine divin (niveau 1)
  divineDomain: ClericDomain;
  
  // Channel Divinity (niveau 2)
  channelDivinityUses: number; // 1 au niveau 2, 2 au niveau 6
  channelDivinityUsed: number;
  
  // === Features de domaine ===
  
  // Life Domain - Disciple of Life
  discipleOfLife?: {
    bonusHealing: number; // 2 + spell level
  };
  
  // Light Domain - Warding Flare
  wardingFlare?: {
    uses: number; // WIS modifier fois par long rest
    usedToday: number;
  };
  
  // Destruction de morts-vivants (niveau 2)
  turnUndeadDC: number; // 8 + prof + WIS
}

// ===== BARBARIAN =====
export interface BarbarianData extends BaseClassData {
  // Rage (niveau 1)
  rageUses: number;      // 2 au niveau 1, 3 au niveau 3
  ragesUsed: number;
  currentlyRaging: boolean;
  rageDamageBonus: number; // +2 au niveau 1
  
  // Unarmored Defense (niveau 1)
  unarmoredDefenseAC: number; // 10 + DEX + CON
  
  // Reckless Attack (niveau 2)
  recklessAttackThisTurn: boolean;
  
  // Danger Sense (niveau 2)
  dangerSenseActive: boolean;
  
  // Path (niveau 3)
  primalPath?: string;
}

// ===== BARD =====
export interface BardData extends BaseClassData {
  // Bardic Inspiration (niveau 1)
  bardicInspirationDice: string; // "1d6" au niveau 1
  bardicInspirationUses: number; // CHA modifier
  bardicInspirationUsed: number;
  
  // Jack of All Trades (niveau 2)
  jackOfAllTrades: boolean; // +half prof to non-proficient
  
  // Song of Rest (niveau 2)
  songOfRestDice: string; // "1d6" au niveau 2
  
  // Expertise (niveau 3)
  expertiseSkills: Set<Skill>;
  
  // College (niveau 3)
  bardCollege?: string;
}

// ===== DRUID =====
export interface DruidData extends BaseClassData {
  // Druidic language (niveau 1)
  druidic: boolean;
  
  // Wild Shape (niveau 2)
  wildShapeUses: number; // 2 par repos
  wildShapeUsed: number;
  wildShapeCR: number; // 1/4 au niveau 2
  currentWildShape?: {
    beast: string;
    hp: number;
  };
  
  // Druid Circle (niveau 2)
  druidCircle?: string;
}

// ===== MONK =====
export interface MonkData extends BaseClassData {
  // Martial Arts (niveau 1)
  martialArtsDice: string; // "1d4" au niveau 1
  
  // Ki (niveau 2)
  kiPoints: number; // = monk level
  kiPointsUsed: number;
  
  // Unarmored Movement (niveau 2)
  unarmoredMovementBonus: number; // +10ft au niveau 2
  
  // Monastic Tradition (niveau 3)
  monasticTradition?: string;
}

// ===== PALADIN =====
export interface PaladinData extends BaseClassData {
  // Divine Sense (niveau 1)
  divineSenseUses: number; // 1 + CHA modifier
  divineSenseUsed: number;
  
  // Lay on Hands (niveau 1)
  layOnHandsPool: number; // 5 × paladin level
  layOnHandsUsed: number;
  
  // Fighting Style (niveau 2)
  fightingStyle?: string;
  
  // Divine Smite (niveau 2)
  // Géré via spell slots
  
  // Sacred Oath (niveau 3)
  sacredOath?: string;
}

// ===== RANGER =====
export interface RangerData extends BaseClassData {
  // Favored Enemy (niveau 1)
  favoredEnemies: Set<string>;
  
  // Natural Explorer (niveau 1)
  favoredTerrains: Set<string>;
  
  // Fighting Style (niveau 2)
  fightingStyle?: string;
  
  // Ranger Archetype (niveau 3)
  rangerArchetype?: string;
  
  // Primeval Awareness (niveau 3)
  primevalAwarenessUsed: boolean;
}

// ===== SORCERER =====
export interface SorcererData extends BaseClassData {
  // Sorcerous Origin (niveau 1)
  sorcerousOrigin: string;
  
  // Font of Magic (niveau 2)
  sorceryPoints: number; // = sorcerer level
  sorceryPointsUsed: number;
  
  // Metamagic (niveau 3)
  metamagicOptions: Set<string>;
  
  // === Features d'origine ===
  
  // Draconic Bloodline
  draconicResilience?: {
    bonusHP: number; // 1 par niveau
    naturalArmor: number; // 13 + DEX
  };
}

// ===== WARLOCK =====
export interface WarlockData extends BaseClassData {
  // Otherworldly Patron (niveau 1)
  otherworldlyPatron: string;
  
  // Pact Magic - Géré différemment
  pactSlots: number; // Toujours 1 au niveau 1
  pactSlotLevel: number; // Niveau des slots
  
  // Eldritch Invocations (niveau 2)
  invocations: Set<string>;
  invocationsKnown: number;
  
  // Pact Boon (niveau 3)
  pactBoon?: 'blade' | 'chain' | 'tome';
  
  // Pact-specific
  pactWeapon?: ItemId; // Si Pact of the Blade
  familiar?: string; // Si Pact of the Chain
  bookOfShadows?: Set<SpellId>; // Si Pact of the Tome
}

// === Fonctions utilitaires ===

export function hasSpellbook(
  classData: any
): classData is WizardData {
  return classData && 'spellbook' in classData;
}

export function hasRage(
  classData: any
): classData is BarbarianData {
  return classData && 'rageUses' in classData;
}

export function hasSneakAttack(
  classData: any
): classData is RogueData {
  return classData && 'sneakAttackDice' in classData;
}

export function hasKi(
  classData: any
): classData is MonkData {
  return classData && 'kiPoints' in classData;
}