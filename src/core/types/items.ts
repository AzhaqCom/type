import type { DamageType, AbilityScore, DamageRoll } from './base';

export type ItemId = `item_${string}`;

export const ItemType = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable',
  RESOURCE: 'resource',
  QUEST_ITEM: 'quest_item',
  SPELL_COMPONENT: 'spell_component',
  TOOL: 'tool'
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export const ItemRarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  VERY_RARE: 'very_rare',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact'
} as const;

export type ItemRarity = typeof ItemRarity[keyof typeof ItemRarity];

export const WeaponType = {
  // Simple Melee
  CLUB: 'club',
  DAGGER: 'dagger',
  DART: 'dart',
  JAVELIN: 'javelin',
  MACE: 'mace',
  QUARTERSTAFF: 'quarterstaff',
  SICKLE: 'sickle',
  SPEAR: 'spear',
  // Simple Ranged
  LIGHT_CROSSBOW: 'light_crossbow',
  SHORTBOW: 'shortbow',
  SLING: 'sling',
  // Martial Melee
  BATTLEAXE: 'battleaxe',
  FLAIL: 'flail',
  GLAIVE: 'glaive',
  GREATAXE: 'greataxe',
  GREATSWORD: 'greatsword',
  HALBERD: 'halberd',
  LANCE: 'lance',
  LONGSWORD: 'longsword',
  MAUL: 'maul',
  MORNINGSTAR: 'morningstar',
  PIKE: 'pike',
  RAPIER: 'rapier',
  SCIMITAR: 'scimitar',
  SHORTSWORD: 'shortsword',
  TRIDENT: 'trident',
  WAR_PICK: 'war_pick',
  WARHAMMER: 'warhammer',
  WHIP: 'whip',
  // Martial Ranged
  BLOWGUN: 'blowgun',
  HAND_CROSSBOW: 'hand_crossbow',
  HEAVY_CROSSBOW: 'heavy_crossbow',
  LONGBOW: 'longbow',
  NET: 'net'
} as const;

export type WeaponType = typeof WeaponType[keyof typeof WeaponType];

export const ArmorType = {
  // Light Armor
  PADDED: 'padded',
  LEATHER: 'leather',
  STUDDED_LEATHER: 'studded_leather',
  // Medium Armor
  HIDE: 'hide',
  CHAIN_SHIRT: 'chain_shirt',
  SCALE_MAIL: 'scale_mail',
  BREASTPLATE: 'breastplate',
  HALF_PLATE: 'half_plate',
  // Heavy Armor
  RING_MAIL: 'ring_mail',
  CHAIN_MAIL: 'chain_mail',
  SPLINT: 'splint',
  PLATE: 'plate',
  // Shield
  SHIELD: 'shield'
} as const;

export type ArmorType = typeof ArmorType[keyof typeof ArmorType];

export const WeaponProperty = {
  AMMUNITION: 'ammunition',
  FINESSE: 'finesse',
  HEAVY: 'heavy',
  LIGHT: 'light',
  LOADING: 'loading',
  RANGE: 'range',
  REACH: 'reach',
  SPECIAL: 'special',
  THROWN: 'thrown',
  TWO_HANDED: 'two_handed',
  VERSATILE: 'versatile'
} as const;

export type WeaponProperty = typeof WeaponProperty[keyof typeof WeaponProperty];

export interface BaseItem {
  readonly id: ItemId;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number; // En pièces d'or
  weight: number; // En livres
  stackable: boolean;
  maxStack?: number;
  attunementRequired?: boolean;
}

export interface Weapon extends BaseItem {
  type: typeof ItemType.WEAPON;
  weaponType: WeaponType;
  damage: DamageRoll;
  properties: WeaponProperty[];
  range?: {
    normal: number;
    long: number;
  };
  versatileDamage?: DamageRoll;
  enchantments?: WeaponEnchantment[];
}

export interface Armor extends BaseItem {
  type: typeof ItemType.ARMOR;
  armorType: ArmorType;
  armorClass: number;
  maxDexModifier?: number;
  stealthDisadvantage: boolean;
  strengthRequirement?: AbilityScore;
  enchantments?: ArmorEnchantment[];
}

export interface Consumable extends BaseItem {
  type: typeof ItemType.CONSUMABLE;
  consumableType: 'potion' | 'food' | 'scroll' | 'ammunition';
  effect: ItemEffect;
  usesRemaining?: number;
  maxUses?: number;
}

export interface Resource extends BaseItem {
  type: typeof ItemType.RESOURCE;
  resourceType: 'material' | 'gem' | 'coin' | 'art_object';
  craftingValue?: number;
}

export interface QuestItem extends BaseItem {
  type: typeof ItemType.QUEST_ITEM;
  questId?: string;
  canDrop: boolean;
  canSell: boolean;
}

export interface SpellComponent extends BaseItem {
  type: typeof ItemType.SPELL_COMPONENT;
  componentType: 'material' | 'focus' | 'pouch';
  spellsAffected?: string[];
  consumedOnUse: boolean;
}

export interface Tool extends BaseItem {
  type: typeof ItemType.TOOL;
  toolType: 'artisan' | 'gaming_set' | 'kit' | 'musical_instrument' | 'vehicle';
  proficiencyGranted?: string;
  skillBonus?: {
    skill: string;
    bonus: number;
  };
}

export interface WeaponEnchantment {
  id: string;
  name: string;
  description: string;
  bonusToHit?: number;
  bonusDamage?: number;
  damageType?: DamageType;
  properties?: WeaponProperty[];
  specialEffects?: ItemEffect[];
}

export interface ArmorEnchantment {
  id: string;
  name: string;
  description: string;
  bonusAC?: number;
  resistances?: DamageType[];
  specialEffects?: ItemEffect[];
}

export interface ItemEffect {
  type: 'heal' | 'damage' | 'buff' | 'debuff' | 'utility';
  value?: number;
  duration?: number; // En rounds/minutes/heures
  target: 'self' | 'ally' | 'enemy' | 'area';
  description: string;
  conditions?: string[];
}

// Union type pour tous les items
export type Item = Weapon | Armor | Consumable | Resource | QuestItem | SpellComponent | Tool;

// Type guards
export function isWeapon(item: Item): item is Weapon {
  return item.type === ItemType.WEAPON;
}

export function isArmor(item: Item): item is Armor {
  return item.type === ItemType.ARMOR;
}

export function isConsumable(item: Item): item is Consumable {
  return item.type === ItemType.CONSUMABLE;
}

export function isStackable(item: Item): boolean {
  return item.stackable;
}

export function canAttune(item: Item): boolean {
  return item.attunementRequired === true;
}