import type { DnDClass, Ability, AbilityScore } from './base';
import type { Item, ItemId, Weapon, Armor, Tool } from './items';

export interface ItemStack {
  item: Item;
  quantity: number;
  equipped?: boolean;
  attuned?: boolean;
}

export interface Inventory {
  slots: ItemStack[];
  maxSlots: number;
  weightCapacity: number;
  currentWeight: number;
  currency: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
}

export const EquipmentSlot = {
  MAIN_HAND: 'main_hand',
  OFF_HAND: 'off_hand',
  ARMOR: 'armor',
  HELMET: 'helmet',
  BOOTS: 'boots',
  GLOVES: 'gloves',
  CLOAK: 'cloak',
  AMULET: 'amulet',
  RING_1: 'ring_1',
  RING_2: 'ring_2',
  BELT: 'belt'
} as const;

export type EquipmentSlot = typeof EquipmentSlot[keyof typeof EquipmentSlot];

export interface EquippedItems {
  [EquipmentSlot.MAIN_HAND]?: Weapon | Tool;
  [EquipmentSlot.OFF_HAND]?: Weapon | Armor | Tool; // Shield ou arme légère
  [EquipmentSlot.ARMOR]?: Armor;
  [EquipmentSlot.HELMET]?: Armor;
  [EquipmentSlot.BOOTS]?: Armor;
  [EquipmentSlot.GLOVES]?: Armor;
  [EquipmentSlot.CLOAK]?: Item;
  [EquipmentSlot.AMULET]?: Item;
  [EquipmentSlot.RING_1]?: Item;
  [EquipmentSlot.RING_2]?: Item;
  [EquipmentSlot.BELT]?: Item;
}

export interface EquipmentRequirement {
  minimumLevel?: number;
  requiredClass?: DnDClass[];
  requiredAbilityScores?: Partial<Record<Ability, AbilityScore>>;
  requiredProficiency?: string[];
  forbiddenClasses?: DnDClass[];
}

export interface EquipmentBonuses {
  abilityScores: Partial<Record<Ability, number>>;
  armorClass: number;
  hitPoints: number;
  savingThrows: Partial<Record<Ability, number>>;
  skills: Record<string, number>;
  damageResistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
  specialAbilities: string[];
}

export interface ItemFilter {
  type?: string[];
  rarity?: string[];
  minValue?: number;
  maxValue?: number;
  equipped?: boolean;
  attuned?: boolean;
  searchText?: string;
}

export interface InventoryAction {
  type: 'add' | 'remove' | 'move' | 'equip' | 'unequip' | 'use' | 'drop' | 'sort';
  itemId: ItemId;
  quantity?: number;
  sourceSlot?: number;
  targetSlot?: number | EquipmentSlot;
  timestamp: Date;
}

export interface InventoryState {
  inventory: Inventory;
  equipment: EquippedItems;
  attunedItems: Set<ItemId>;
  bonuses: EquipmentBonuses;
  history: InventoryAction[];
}

// Fonctions utilitaires pour la validation d'équipement
export interface EquipmentValidation {
  canEquip: boolean;
  reasons: string[];
  requirements?: EquipmentRequirement;
}

// Types pour le crafting
export interface CraftingRecipe {
  id: string;
  name: string;
  result: {
    itemId: ItemId;
    quantity: number;
  };
  materials: {
    itemId: ItemId;
    quantity: number;
  }[];
  toolRequired?: string;
  skillRequired?: {
    skill: string;
    dc: number;
  };
  time: number; // En minutes
  experience?: number;
}

export interface CraftingSession {
  recipeId: string;
  progress: number;
  timeRemaining: number;
  materialsConsumed: boolean;
  canCancel: boolean;
}

// Helper types pour les contraintes D&D
export type WeaponProficiency = 
  | 'simple_weapons'
  | 'martial_weapons'
  | 'specific_weapon'
  | string;

export type ArmorProficiency =
  | 'light_armor'
  | 'medium_armor'
  | 'heavy_armor'
  | 'shields'
  | string;

export interface CharacterProficiencies {
  weapons: WeaponProficiency[];
  armor: ArmorProficiency[];
  tools: string[];
  languages: string[];
}