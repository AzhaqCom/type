import { DnDClass } from './base';

export const BarbarianPath = {
  BERSERKER: 'berserker',
  TOTEM_WARRIOR: 'totem_warrior',
  ANCESTRAL_GUARDIAN: 'ancestral_guardian'
} as const;

export type BarbarianPath = typeof BarbarianPath[keyof typeof BarbarianPath];

export const BardCollege = {
  LORE: 'lore',
  VALOR: 'valor',
  GLAMOUR: 'glamour',
  WHISPERS: 'whispers'
} as const;

export type BardCollege = typeof BardCollege[keyof typeof BardCollege];

export const ClericDomain = {
  KNOWLEDGE: 'knowledge',
  LIFE: 'life',
  LIGHT: 'light',
  NATURE: 'nature',
  TEMPEST: 'tempest',
  TRICKERY: 'trickery',
  WAR: 'war'
} as const;

export type ClericDomain = typeof ClericDomain[keyof typeof ClericDomain];

export const DruidCircle = {
  LAND: 'land',
  MOON: 'moon',
  DREAMS: 'dreams',
  SHEPHERD: 'shepherd'
} as const;

export type DruidCircle = typeof DruidCircle[keyof typeof DruidCircle];

export const FighterArchetype = {
  CHAMPION: 'champion',
  BATTLE_MASTER: 'battle_master',
  ELDRITCH_KNIGHT: 'eldritch_knight'
} as const;

export type FighterArchetype = typeof FighterArchetype[keyof typeof FighterArchetype];

export const MonasticTradition = {
  OPEN_HAND: 'open_hand',
  SHADOW: 'shadow',
  FOUR_ELEMENTS: 'four_elements'
} as const;

export type MonasticTradition = typeof MonasticTradition[keyof typeof MonasticTradition];

export const SacredOath = {
  DEVOTION: 'devotion',
  ANCIENTS: 'ancients',
  VENGEANCE: 'vengeance'
} as const;

export type SacredOath = typeof SacredOath[keyof typeof SacredOath];

export const RangerArchetype = {
  HUNTER: 'hunter',
  BEAST_MASTER: 'beast_master',
  GLOOM_STALKER: 'gloom_stalker'
} as const;

export type RangerArchetype = typeof RangerArchetype[keyof typeof RangerArchetype];

export const RoguishArchetype = {
  THIEF: 'thief',
  ASSASSIN: 'assassin',
  ARCANE_TRICKSTER: 'arcane_trickster'
} as const;

export type RoguishArchetype = typeof RoguishArchetype[keyof typeof RoguishArchetype];

export const SorcerousOrigin = {
  DRACONIC_BLOODLINE: 'draconic_bloodline',
  WILD_MAGIC: 'wild_magic',
  STORM: 'storm'
} as const;

export type SorcerousOrigin = typeof SorcerousOrigin[keyof typeof SorcerousOrigin];

export const WarlockPatron = {
  FIEND: 'fiend',
  GREAT_OLD_ONE: 'great_old_one',
  ARCHFEY: 'archfey'
} as const;

export type WarlockPatron = typeof WarlockPatron[keyof typeof WarlockPatron];

export const WizardSchool = {
  ABJURATION: 'abjuration',
  CONJURATION: 'conjuration', 
  DIVINATION: 'divination',
  ENCHANTMENT: 'enchantment',
  EVOCATION: 'evocation',
  ILLUSION: 'illusion',
  NECROMANCY: 'necromancy',
  TRANSMUTATION: 'transmutation'
} as const;

export type WizardSchool = typeof WizardSchool[keyof typeof WizardSchool];

export type ClassSpecialization<T extends DnDClass> = 
  T extends 'barbarian' ? BarbarianPath :
  T extends 'bard' ? BardCollege :
  T extends 'cleric' ? ClericDomain :
  T extends 'druid' ? DruidCircle :
  T extends 'fighter' ? FighterArchetype :
  T extends 'monk' ? MonasticTradition :
  T extends 'paladin' ? SacredOath :
  T extends 'ranger' ? RangerArchetype :
  T extends 'rogue' ? RoguishArchetype :
  T extends 'sorcerer' ? SorcerousOrigin :
  T extends 'warlock' ? WarlockPatron :
  T extends 'wizard' ? WizardSchool :
  never;

export type SubclassChoiceLevel<T extends DnDClass> =
  T extends 'barbarian' ? 3 :
  T extends 'bard' ? 3 :
  T extends 'cleric' ? 1 :
  T extends 'druid' ? 2 :
  T extends 'fighter' ? 3 :
  T extends 'monk' ? 3 :
  T extends 'paladin' ? 3 :
  T extends 'ranger' ? 3 :
  T extends 'rogue' ? 3 :
  T extends 'sorcerer' ? 1 :
  T extends 'warlock' ? 1 :
  T extends 'wizard' ? 2 :
  never;