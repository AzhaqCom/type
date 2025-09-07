import { Skill, Ability } from './base';
import type { DnDClass, Level } from './base';

// Re-export des types de base pour la compatibilité
export type { DnDClass, Skill, Ability, AbilityScore } from './base';
import type { EvolvingStats, FinalStats, DerivedStats } from './stats';
import type { ClassProgression, LevelUpChoice } from './progression';
import type { SpellProgression, SpellcasterClass, SpellSlotsByLevel, SpellId } from './spells';
import type { InventoryState } from './inventory';
import type { CombatStats } from './combat';
import type { ClassSpecificData } from './classData';

export type CharacterId = `char_${string}`;

export interface Character<T extends DnDClass = DnDClass> {
  readonly id: CharacterId;
  name: string;
  
  class: T;
  level: Level;
  experience: number;
  progression: ClassProgression<T>;
  
  stats: EvolvingStats;
  readonly finalStats: FinalStats;
  readonly derivedStats: DerivedStats;
  
  combatStats: CombatStats;
  
  skills: {
    [K in Skill]: {
      proficient: boolean;
      expertise: boolean;
      bonus: number;
    };
  };
  
  spellcasting: T extends SpellcasterClass 
    ? SpellProgression<T> & {
        currentSlots: SpellSlotsByLevel;
        preparedSpells?: Set<SpellId>;
      }
    : undefined;
  
  inventory: InventoryState;
  
  // Données spécifiques à la classe (wizard spellbook, rogue sneak attack, etc.)
  classData: ClassSpecificData<T>;
  
  levelUpHistory: LevelUpChoice[];
  
  createdAt: Date;
  lastLevelUp?: Date;
}

export interface CreateCharacterParams {
  name: string;
  class: DnDClass;
  stats: EvolvingStats['base'];
}

export interface CharacterSheet<T extends DnDClass = DnDClass> {
  character: Character<T>;
  computed: {
    savingThrows: Record<Ability, number>;
    skillBonuses: Record<Skill, number>;
    armorClass: number;
    initiative: number;
    hitPointsMax: number;
    proficiencyBonus: number;
    spellSaveDC?: number;
    spellAttackBonus?: number;
  };
}