export type AbilityScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type Modifier = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
export type HitDie = 'd6' | 'd8' | 'd10' | 'd12';
export type ProficiencyBonus = 2 | 3 | 4 | 5 | 6;

export const DnDClass = {
  BARBARIAN: 'barbarian',
  BARD: 'bard',  
  CLERIC: 'cleric',
  DRUID: 'druid',
  FIGHTER: 'fighter',
  MONK: 'monk',
  PALADIN: 'paladin',
  RANGER: 'ranger',
  ROGUE: 'rogue',
  SORCERER: 'sorcerer',
  WARLOCK: 'warlock',
  WIZARD: 'wizard'
} as const;

export type DnDClass = typeof DnDClass[keyof typeof DnDClass];

export const Ability = {
  STRENGTH: 'strength',
  DEXTERITY: 'dexterity', 
  CONSTITUTION: 'constitution',
  INTELLIGENCE: 'intelligence',
  WISDOM: 'wisdom',
  CHARISMA: 'charisma'
} as const;

export type Ability = typeof Ability[keyof typeof Ability];

export const Skill = {
  ACROBATICS: 'acrobatics',
  ANIMAL_HANDLING: 'animal_handling',
  ARCANA: 'arcana',
  ATHLETICS: 'athletics',
  DECEPTION: 'deception',
  HISTORY: 'history',
  INSIGHT: 'insight',
  INTIMIDATION: 'intimidation',
  INVESTIGATION: 'investigation',
  MEDICINE: 'medicine',
  NATURE: 'nature',
  PERCEPTION: 'perception',
  PERFORMANCE: 'performance',
  PERSUASION: 'persuasion',
  RELIGION: 'religion',
  SLEIGHT_OF_HAND: 'sleight_of_hand',
  STEALTH: 'stealth',
  SURVIVAL: 'survival'
} as const;

export type Skill = typeof Skill[keyof typeof Skill];

export const SKILL_TO_ABILITY: Record<Skill, Ability> = {
  [Skill.ACROBATICS]: Ability.DEXTERITY,
  [Skill.ANIMAL_HANDLING]: Ability.WISDOM,
  [Skill.ARCANA]: Ability.INTELLIGENCE,
  [Skill.ATHLETICS]: Ability.STRENGTH,
  [Skill.DECEPTION]: Ability.CHARISMA,
  [Skill.HISTORY]: Ability.INTELLIGENCE,
  [Skill.INSIGHT]: Ability.WISDOM,
  [Skill.INTIMIDATION]: Ability.CHARISMA,
  [Skill.INVESTIGATION]: Ability.INTELLIGENCE,
  [Skill.MEDICINE]: Ability.WISDOM,
  [Skill.NATURE]: Ability.INTELLIGENCE,
  [Skill.PERCEPTION]: Ability.WISDOM,
  [Skill.PERFORMANCE]: Ability.CHARISMA,
  [Skill.PERSUASION]: Ability.CHARISMA,
  [Skill.RELIGION]: Ability.INTELLIGENCE,
  [Skill.SLEIGHT_OF_HAND]: Ability.DEXTERITY,
  [Skill.STEALTH]: Ability.DEXTERITY,
  [Skill.SURVIVAL]: Ability.WISDOM
};

export const PROFICIENCY_BONUS_BY_LEVEL: Record<Level, ProficiencyBonus> = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6
};

export const EXPERIENCE_TABLE: Record<Level, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000
};

export const DamageType = {
  ACID: 'acid',
  BLUDGEONING: 'bludgeoning',
  COLD: 'cold',
  FIRE: 'fire',
  FORCE: 'force',
  LIGHTNING: 'lightning',
  NECROTIC: 'necrotic',
  PIERCING: 'piercing',
  POISON: 'poison',
  PSYCHIC: 'psychic',
  RADIANT: 'radiant',
  SLASHING: 'slashing',
  THUNDER: 'thunder'
} as const;

export type DamageType = typeof DamageType[keyof typeof DamageType];

// Interface unifiée pour tous les dégâts (armes, sorts, effets)
export interface DamageRoll {
  diceCount: number;
  diceSize: 4 | 6 | 8 | 10 | 12 | 20;
  bonus: number;
  type: DamageType;
}

// Types géométriques centralisés
export interface GridPosition {
  x: number;
  y: number;
}

export interface TerrainTile {
  type: 'floor' | 'wall' | 'difficult' | 'hazard' | 'cover';
  passable: boolean;
  coverBonus?: number;
  movementCost?: number;
  effects?: string[];
}

export function getAbilityModifier(score: AbilityScore): Modifier {
  return Math.floor((score - 10) / 2) as Modifier;
}