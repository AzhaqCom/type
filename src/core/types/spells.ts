import type { Level, DnDClass, DamageRoll } from './base';

export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SpellcastingAbility = 'intelligence' | 'wisdom' | 'charisma';
export type SpellId = `spell_${string}`;

export const SpellSchool = {
  ABJURATION: 'abjuration',
  CONJURATION: 'conjuration',
  DIVINATION: 'divination',
  ENCHANTMENT: 'enchantment',
  EVOCATION: 'evocation',
  ILLUSION: 'illusion',
  NECROMANCY: 'necromancy',
  TRANSMUTATION: 'transmutation'
} as const;

export type SpellSchool = typeof SpellSchool[keyof typeof SpellSchool];

export const SpellContext = {
  COMBAT_OFFENSIVE: 'combat_offensive',    // Sorts d'attaque
  COMBAT_DEFENSIVE: 'combat_defensive',    // Sorts défensifs en urgence
  PREPARATION: 'preparation',              // Optimal hors combat
  UTILITY: 'utility',                      // Sorts utilitaires
  RITUAL: 'ritual'                         // Sorts rituels
} as const;

export type SpellContext = typeof SpellContext[keyof typeof SpellContext];

export const SpellTarget = {
  SELF: 'self',                           // Lanceur uniquement
  TOUCH: 'touch',                         // Allié au contact (incluant soi)
  RANGED_SINGLE: 'ranged_single',         // Une créature à distance
  AREA: 'area',                           // Zone d'effet
  ENVIRONMENT: 'environment'              // Objet ou point dans l'environnement
} as const;

export type SpellTarget = typeof SpellTarget[keyof typeof SpellTarget];

export interface SpellComponent {
  verbal: boolean;
  somatic: boolean;
  material?: string;
}

export interface Spell {
  id: SpellId;
  name: string;
  level: SpellLevel;
  school: SpellSchool;
  castingTime: string;
  range: string;
  duration: string;
  components: SpellComponent;
  description: string;
  higherLevels?: string;
  damage?: DamageRoll;
  availableToClasses: DnDClass[];
  
  // Nouveaux champs pour la logique de jeu
  target: SpellTarget;                    // Type de cible selon D&D
  contexts: SpellContext[];               // Contextes d'utilisation possibles
}

export type SpellSlotsByLevel = {
  [K in SpellLevel as K extends 0 ? never : K]: number;
};

export type SpellcasterClass = 'bard' | 'cleric' | 'druid' | 'sorcerer' | 'warlock' | 'wizard' | 'paladin' | 'ranger';

export type HalfCasterClass = 'paladin' | 'ranger';
export type FullCasterClass = Exclude<SpellcasterClass, HalfCasterClass>;

export interface SpellProgression<T extends DnDClass> {
  castingAbility: SpellcastingAbility;
  spellcastingType: T extends FullCasterClass 
    ? 'full' 
    : T extends HalfCasterClass 
    ? 'half' 
    : never;
  
  spellSlots: {
    [K in Level]: SpellSlotsByLevel;
  };
  
  spellKnowledge: T extends 'wizard'
    ? { type: 'spellbook'; spells: Set<SpellId>; canPrepare: number }
    : T extends 'sorcerer' | 'bard' | 'warlock'
    ? { type: 'known'; spells: Set<SpellId>; maxKnown: number }
    : { type: 'prepared'; available: SpellId[]; prepared: Set<SpellId>; canPrepare: number };
  
  cantrips: {
    known: Set<SpellId>;
    maxKnown: number;
  };
}