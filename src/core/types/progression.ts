import { Skill, Ability } from './base';
import type { Level, DnDClass } from './base';
import type { StatImprovement } from './stats';
import type { ClassSpecialization } from './subclasses';
import type { SpellId } from './spells';
import type { ItemId } from './items';

export interface ClassFeature {
  id: string;
  name: string;
  description: string;
  level: Level;
}

export type ClassFeatureType = 
  | { type: 'passive'; name: string; description: string }
  | { type: 'active'; name: string; description: string; uses: UsagePattern }
  | { type: 'choice'; name: string; options: FeatureChoice[]; chosen?: string }
  | { type: 'spellcasting'; spellcastingType: 'full' | 'half' | 'third' }
  | { type: 'expertise'; skillCount: number; chosen?: Skill[] }
  | { type: 'abilityScoreImprovement'; chosen?: StatImprovement | Feat };

export interface UsagePattern {
  type: 'shortRest' | 'longRest' | 'perDay' | 'unlimited';
  count?: number;
}

export interface FeatureChoice {
  id: string;
  name: string;
  description: string;
  requirements?: ChoiceRequirement[];
}

// Type pour les valeurs de prérequis
export type RequirementValue = number | string | ItemId | Skill | Ability;

export interface ChoiceRequirement {
  type: 'level' | 'ability' | 'skill' | 'feature';
  value: RequirementValue;
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  prerequisites?: FeatureChoice['requirements'];
  benefits: {
    abilityScoreIncrease?: Partial<Record<Ability, 1>>;
    features?: ClassFeature[];
  };
}

export interface LevelUpChoice {
  level: Level;
  featureId: string;
  choice: string | StatImprovement | Feat | Skill[];
  timestamp: Date;
}

export interface ClassProgression<T extends DnDClass> {
  class: T;
  subclass?: ClassSpecialization<T>;
  subclassChosenAt?: Level;
  
  features: {
    [K in Level]?: ClassFeature[];
  };
  
  choices: LevelUpChoice[];
}

export interface LevelUpOptions<T extends DnDClass> {
  hitPointIncrease: number;
  automaticFeatures: ClassFeature[];
  choices: LevelUpChoiceOption[];
  subclassChoice?: ClassSpecialization<T> extends never 
    ? never 
    : ClassSpecialization<T>[];
}

export type LevelUpChoiceOption =
  | { type: 'abilityScoreImprovement'; availableStats: Ability[] }
  | { type: 'feat'; availableFeats: Feat[] }
  | { type: 'spells'; canLearn: number; available: SpellId[] }
  | { type: 'skills'; canChoose: number; available: Skill[] }
  | { type: 'subclassFeature'; options: FeatureChoice[] };

export interface LevelUpChange {
  type: 'hitPoints' | 'feature' | 'spell' | 'skill' | 'subclass';
  description: string;
  value: any;
}

export interface LevelUpResult {
  newLevel: Level;
  changes: LevelUpChange[];
}

export const ABILITY_SCORE_IMPROVEMENT_LEVELS: Level[] = [4, 8, 12, 16, 19];