// Base types
export * from './base';
export * from './stats';
export * from './subclasses';
export * from './progression';
export * from './character';

// Game systems  
export * from './items';
export * from './inventory';

// Spells - avoiding naming conflicts
export type {
  SpellLevel,
  SpellcastingAbility,
  SpellId,
  SpellSchool,
  SpellComponent as MagicalSpellComponent,
  Spell,
  SpellSlotsByLevel,
  SpellcasterClass,
  HalfCasterClass,
  FullCasterClass,
  SpellProgression
} from './spells';

// Scenes - avoiding naming conflicts  
export type {
  SceneId,
  ChoiceId,
  EnemyId,
  SceneTransition,
  SceneType,
  BaseScene,
  NarrativeScene,
  CombatScene,
  MerchantScene,
  RestScene,
  LootScene,
  CampScene,
  Choice,
  ChoiceRequirement as SceneChoiceRequirement,
  SkillCheck,
  SceneCondition,
  Scene
} from './scenes';

// Transitions
export * from './transitions';

// Utility types
export type ID = string;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NonEmptyArray<T> = [T, ...T[]];

// Type guards
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}