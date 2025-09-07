import { Ability } from './base';
import type { AbilityScore, Modifier, ProficiencyBonus, Level } from './base';

export interface BaseStats {
  [Ability.STRENGTH]: AbilityScore;
  [Ability.DEXTERITY]: AbilityScore;
  [Ability.CONSTITUTION]: AbilityScore;
  [Ability.INTELLIGENCE]: AbilityScore;
  [Ability.WISDOM]: AbilityScore;
  [Ability.CHARISMA]: AbilityScore;
}

export interface StatImprovement {
  level: Level;
  source: 'abilityScoreImprovement' | 'feat' | 'classFeature' | 'racial';
  improvements: Partial<BaseStats>;
  timestamp: Date;
}

export interface EvolvingStats {
  base: BaseStats;
  improvements: StatImprovement[];
  racialBonuses: Partial<BaseStats>;
  itemBonuses: Partial<BaseStats>;
  temporaryBonuses: Partial<BaseStats>;
}

export type FinalStats = {
  readonly [K in keyof BaseStats]: AbilityScore;
} & {
  modifiers: {
    readonly [K in keyof BaseStats]: Modifier;
  };
};

export interface DerivedStats {
  proficiencyBonus: ProficiencyBonus;
  savingThrows: Partial<Record<Ability, number>>;
}

export interface HealthProgression {
  level: Level;
  hitPointsGained: number;
  source: 'levelUp' | 'constitution' | 'item' | 'spell';
  timestamp: Date;
}