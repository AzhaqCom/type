import type { Character, DnDClass, Skill, Ability, CharacterId } from '../../core/types/character';
import type { EvolvingStats, FinalStats, DerivedStats } from '../../core/types/stats';
import type { ClassProgression } from '../../core/types/progression';
import type { SpellSlotsByLevel } from '../../core/types/spells';
import type { InventoryState } from '../../core/types/inventory';
import { EquipmentSlot } from '../../core/types/inventory';
import type { CombatStats } from '../../core/types/combat';
import { PREGENERATED_CHARACTERS, type PregenCharacterData } from './characterData';
import { BACKGROUND_DATA } from './backgrounds/backgroundData';
import { generateId } from '../../core/utils/idGenerator';

export function createCharacterFromData(data: PregenCharacterData): Character {
  const characterId = generateId() as CharacterId;
  
  // 1. Créer les stats évolutives
  const evolvingStats = createEvolvingStats(data.stats);
  
  // 2. Calculer les stats finales et dérivées
  const finalStats = calculateFinalStats(evolvingStats);
  const derivedStats = calculateDerivedStats(finalStats, 1);
  
  // 3. Créer la progression de classe
  const progression = createClassProgression(data.class);
  
  // 4. Créer les stats de combat
  const combatStats = createCombatStats(data.class, finalStats);
  
  // 5. Créer les compétences
  const backgroundData = BACKGROUND_DATA[data.background];
  const skills = createSkills(backgroundData.skillProficiencies, finalStats, data.class);
  
  // 6. Créer l'inventaire
  const inventory = createInventoryState(finalStats.strength, backgroundData.startingGold);
  
  // 7. Créer les données de classe
  const classData = createClassData(data.class, data.classSpecificHints);
  
  // 8. Créer le personnage de base
  const baseCharacter: any = {
    id: characterId,
    name: data.name,
    class: data.class,
    level: 1,
    experience: 0,
    progression,
    
    stats: evolvingStats,
    finalStats,
    derivedStats,
    
    combatStats,
    skills: skills as any, // Cast temporaire pour le type Skills complexe
    inventory,
    classData: classData as any, // Cast temporaire pour ClassSpecificData
    
    levelUpHistory: [],
    createdAt: new Date()
  };

  // 9. Ajouter le spellcasting si nécessaire
  if (isSpellcaster(data.class)) {
    (baseCharacter as any).spellcasting = createSpellcasting(data.class, finalStats);
    return baseCharacter as any;
  } else {
    (baseCharacter as any).spellcasting = undefined;
    return baseCharacter as any;
  }
}

// === FONCTIONS UTILITAIRES INTELLIGENTES ===

function createEvolvingStats(baseStats: Record<Ability, number>): EvolvingStats {
  return {
    base: baseStats as any, // Cast temporaire
    improvements: [],
    racialBonuses: {},
    itemBonuses: {},
    temporaryBonuses: {}
  };
}

function calculateFinalStats(evolvingStats: EvolvingStats): FinalStats {
  const finalStats: any = { ...evolvingStats.base };
  
  // Appliquer les bonus raciaux, d'objets, etc.
  Object.entries(evolvingStats.racialBonuses || {}).forEach(([ability, bonus]) => {
    if (bonus) finalStats[ability] += bonus;
  });
  
  // Calculer les modificateurs
  const modifiers: any = {};
  Object.entries(finalStats).forEach(([ability, score]) => {
    modifiers[ability] = Math.floor(((score as number) - 10) / 2);
  });
  
  return { ...finalStats, modifiers } as FinalStats;
}

function calculateDerivedStats(_finalStats: FinalStats, level: number): DerivedStats {
  const proficiencyBonus = Math.ceil(level / 4) + 1; // D&D 5e formula
  
  return {
    proficiencyBonus: proficiencyBonus as any,
    savingThrows: {} // Sera complété par les données de classe
  };
}

function createClassProgression(_characterClass: DnDClass): ClassProgression<any> {
  // Progression de base pour niveau 1
  return {
    class: _characterClass,
    features: [],
    levels: [{
      level: 1,
      features: [], // Features seront ajoutées selon la classe
      choices: [],
      timestamp: new Date()
    }],
    choices: [],
    availableChoices: []
  } as ClassProgression<any>;
}

function createCombatStats(characterClass: DnDClass, finalStats: FinalStats): CombatStats {
  const conModifier = finalStats.modifiers.constitution;
  const dexModifier = finalStats.modifiers.dexterity;
  
  let baseHP = conModifier;
  switch (characterClass) {
    case 'barbarian': baseHP += 12; break;
    case 'fighter': case 'paladin': case 'ranger': baseHP += 10; break;
    case 'bard': case 'cleric': case 'druid': case 'monk': case 'rogue': case 'warlock': baseHP += 8; break;
    case 'sorcerer': case 'wizard': baseHP += 6; break;
  }
  
  return {
    maxHitPoints: Math.max(1, baseHP),
    currentHitPoints: Math.max(1, baseHP),
    temporaryHitPoints: 0,
    armorClass: 10 + dexModifier,
    speed: 30,
    initiative: dexModifier,
    conditions: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    // inspiration: false // Pas dans CombatStats de base
  };
}

function createClassData(characterClass: DnDClass, hints: any) {
  const baseData = {
    hitDie: getHitDie(characterClass),
    primaryAbility: getPrimaryAbility(characterClass),
    savingThrows: getSavingThrows(characterClass)
  };

  switch (characterClass) {
    case 'barbarian':
      return {
        ...baseData,
        rageUsesPerDay: 2,
        currentRageUses: 2,
        rageDamageBonus: 2,
        unarmoredDefense: true,
        path: hints?.pathPreference || null,
        pathLevel: 1
      };
      
    case 'bard':
      return {
        ...baseData,
        inspirationDie: 'd6',
        inspirationUses: 1,
        currentInspirationUses: 1,
        ritualCasting: true,
        college: hints?.collegePreference || null,
        collegeLevel: 1
      };
      
    case 'cleric':
      return {
        ...baseData,
        channelDivinityUses: 1,
        currentChannelDivinityUses: 1,
        ritualCasting: true,
        domain: hints?.divineDomain || 'life',
        domainLevel: 1
      };
      
    case 'druid':
      return {
        ...baseData,
        ritualCasting: true,
        wildShapeUses: 2,
        currentWildShapeUses: 2,
        circle: hints?.circlePreference || null,
        circleLevel: 1
      };
      
    case 'fighter':
      return {
        ...baseData,
        secondWind: true,
        secondWindUsed: false,
        actionSurge: true,
        actionSurgeUsed: false,
        fightingStyle: hints?.fightingStyle || 'defense',
        archetype: hints?.archetypePreference || null,
        archetypeLevel: 1
      };
      
    case 'monk':
      return {
        ...baseData,
        kiPoints: 1,
        currentKiPoints: 1,
        unarmoredDefense: true,
        unarmoredMovement: 0,
        martialArts: 'd4',
        tradition: hints?.monasticTradition || null,
        traditionLevel: 1
      };
      
    case 'paladin':
      return {
        ...baseData,
        layOnHandsPool: 5,
        currentLayOnHandsPool: 5,
        divineSense: 4,
        currentDivineSense: 4,
        oath: hints?.sacredOath || null,
        oathLevel: 1
      };
      
    case 'ranger':
      return {
        ...baseData,
        favoredEnemies: hints?.favoredEnemy ? [hints.favoredEnemy] : ['beasts'],
        naturalExplorer: hints?.naturalExplorer || 'forest',
        archetype: hints?.archetypePreference || null,
        archetypeLevel: 1
      };
      
    case 'rogue':
      return {
        ...baseData,
        sneakAttackDice: 1,
        thievesTools: true,
        archetype: hints?.anticipatedArchetype || null,
        archetypeLevel: 1
      };
      
    case 'sorcerer':
      return {
        ...baseData,
        sorceryPoints: 1,
        currentSorceryPoints: 1,
        origin: hints?.sorceousOrigin || 'draconic_bloodline',
        originLevel: 1
      };
      
    case 'warlock':
      return {
        ...baseData,
        invocationsKnown: [],
        patron: hints?.otherworldlyPatron || 'fiend',
        patronLevel: 1
      };
      
    case 'wizard':
      return {
        ...baseData,
        spellbook: new Set(hints?.spellbook || ['magic_missile', 'shield']),
        arcaneRecoveryUsed: false,
        school: hints?.preferredSchool || null,
        schoolLevel: 1
      };
  }
}

function createSkills(backgroundSkills: Skill[], finalStats: FinalStats, characterClass: DnDClass) {
  const skills: Record<string, { proficient: boolean; expertise: boolean; bonus: number }> = {};
  
  const allSkills: Skill[] = [
    'acrobatics', 'animal_handling', 'arcana', 'athletics', 'deception',
    'history', 'insight', 'intimidation', 'investigation', 'medicine',
    'nature', 'perception', 'performance', 'persuasion', 'religion',
    'sleight_of_hand', 'stealth', 'survival'
  ];
  
  const skillAbilityMap: Record<Skill, Ability> = {
    acrobatics: 'dexterity',
    animal_handling: 'wisdom',
    arcana: 'intelligence',
    athletics: 'strength',
    deception: 'charisma',
    history: 'intelligence',
    insight: 'wisdom',
    intimidation: 'charisma',
    investigation: 'intelligence',
    medicine: 'wisdom',
    nature: 'intelligence',
    perception: 'wisdom',
    performance: 'charisma',
    persuasion: 'charisma',
    religion: 'intelligence',
    sleight_of_hand: 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom'
  };
  
  allSkills.forEach(skill => {
    const ability = skillAbilityMap[skill];
    const abilityModifier = finalStats.modifiers[ability];
    const proficient = backgroundSkills.includes(skill) || getClassSkills(characterClass).includes(skill);
    const proficiencyBonus = proficient ? 2 : 0; // Niveau 1 = +2
    
    skills[skill] = {
      proficient,
      expertise: false,
      bonus: abilityModifier + proficiencyBonus
    };
  });
  
  return skills;
}

function createInventoryState(_strength: number, startingGold: number): InventoryState {
  return {
    inventory: {
      slots: [],
      maxSlots: 20,
      weightCapacity: _strength * 15, // D&D 5e carrying capacity
      currentWeight: 0,
      currency: {
        copper: 0,
        silver: 0,
        electrum: 0,
        gold: startingGold,
        platinum: 0
      }
    },
    equipment: {
      [EquipmentSlot.MAIN_HAND]: undefined,
      [EquipmentSlot.OFF_HAND]: undefined,
      [EquipmentSlot.ARMOR]: undefined,
      [EquipmentSlot.HELMET]: undefined,
      [EquipmentSlot.BOOTS]: undefined,
      [EquipmentSlot.GLOVES]: undefined,
      [EquipmentSlot.CLOAK]: undefined,
      [EquipmentSlot.BELT]: undefined,
      // necklace: undefined, // Pas dans EquippedItems de base
      [EquipmentSlot.RING_1]: undefined,
      [EquipmentSlot.RING_2]: undefined
    },
    attunedItems: new Set(),
    bonuses: {} as any,
    history: []
  };
}

function createSpellcasting(characterClass: DnDClass, finalStats: FinalStats): any {
  const castingAbility = getSpellcastingAbility(characterClass);
  const abilityModifier = finalStats.modifiers[castingAbility];
  
  // Slots niveau 1 selon la classe
  let level1Slots = 0;
  switch (characterClass) {
    case 'bard':
    case 'cleric':
    case 'druid':
    case 'sorcerer':
    case 'wizard':
      level1Slots = 2;
      break;
    case 'warlock':
      level1Slots = 1;
      break;
  }
  
  const currentSlots: SpellSlotsByLevel = { 1: level1Slots, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  return {
    spellcastingType: 'full', // Simplifié pour niveau 1
    castingAbility,
    spellAttackBonus: 2 + abilityModifier,
    spellSaveDC: 8 + 2 + abilityModifier,
    spellKnowledge: 'prepared', // Ou 'known' selon la classe
    cantrips: { known: getCantripsKnown(characterClass, 1), maxKnown: getCantripsKnown(characterClass, 1) },
    spells: { maxPrepared: Math.max(1, 1 + abilityModifier) },
    currentSlots,
    preparedSpells: new Set()
  };
}

// Helper functions
function getHitDie(characterClass: DnDClass): string {
  const hitDieMap: Record<DnDClass, string> = {
    barbarian: 'd12',
    fighter: 'd10', paladin: 'd10', ranger: 'd10',
    bard: 'd8', cleric: 'd8', druid: 'd8', monk: 'd8', rogue: 'd8', warlock: 'd8',
    sorcerer: 'd6', wizard: 'd6'
  };
  return hitDieMap[characterClass];
}

function getPrimaryAbility(characterClass: DnDClass): string {
  const primaryAbilityMap: Record<DnDClass, string> = {
    barbarian: 'strength',
    bard: 'charisma',
    cleric: 'wisdom',
    druid: 'wisdom',
    fighter: 'strength',
    monk: 'dexterity',
    paladin: 'strength',
    ranger: 'dexterity',
    rogue: 'dexterity',
    sorcerer: 'charisma',
    warlock: 'charisma',
    wizard: 'intelligence'
  };
  return primaryAbilityMap[characterClass];
}

function getSavingThrows(characterClass: DnDClass): string[] {
  const savingThrowsMap: Record<DnDClass, string[]> = {
    barbarian: ['strength', 'constitution'],
    bard: ['dexterity', 'charisma'],
    cleric: ['wisdom', 'charisma'],
    druid: ['intelligence', 'wisdom'],
    fighter: ['strength', 'constitution'],
    monk: ['strength', 'dexterity'],
    paladin: ['wisdom', 'charisma'],
    ranger: ['strength', 'dexterity'],
    rogue: ['dexterity', 'intelligence'],
    sorcerer: ['constitution', 'charisma'],
    warlock: ['wisdom', 'charisma'],
    wizard: ['intelligence', 'wisdom']
  };
  return savingThrowsMap[characterClass];
}

function getSpellcastingAbility(characterClass: DnDClass): Ability {
  const spellcastingAbilityMap: Partial<Record<DnDClass, Ability>> = {
    bard: 'charisma' as Ability,
    cleric: 'wisdom' as Ability,
    druid: 'wisdom' as Ability,
    paladin: 'charisma' as Ability,
    ranger: 'wisdom' as Ability,
    sorcerer: 'charisma' as Ability,
    warlock: 'charisma' as Ability,
    wizard: 'intelligence' as Ability
  };
  return spellcastingAbilityMap[characterClass] || 'intelligence' as Ability;
}

function isSpellcaster(characterClass: DnDClass): boolean {
  return ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'].includes(characterClass);
}

// Fonctions utilitaires supplémentaires
function getClassSkills(characterClass: DnDClass): Skill[] {
  const classSkills: Record<DnDClass, Skill[]> = {
    barbarian: ['animal_handling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
    bard: ['deception', 'history', 'investigation', 'persuasion', 'performance', 'sleight_of_hand'],
    cleric: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    druid: ['arcana', 'animal_handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
    fighter: ['acrobatics', 'animal_handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    monk: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    paladin: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
    ranger: ['animal_handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    rogue: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight_of_hand', 'stealth'],
    sorcerer: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
    warlock: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
    wizard: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion']
  };
  return classSkills[characterClass] || [];
}

function getCantripsKnown(characterClass: DnDClass, level: number): number {
  if (level === 1) {
    switch (characterClass) {
      case 'bard': case 'druid': case 'sorcerer': case 'warlock': case 'wizard': return 2;
      case 'cleric': return 3;
      default: return 0;
    }
  }
  return 0;
}

export function getAllPregeneratedCharacters(): Character[] {
  return Object.values(PREGENERATED_CHARACTERS).map(createCharacterFromData);
}

export function getPregeneratedCharacterByClass(characterClass: DnDClass): Character {
  const data = Object.values(PREGENERATED_CHARACTERS).find(char => char.class === characterClass);
  if (!data) {
    throw new Error(`No pregenerated character found for class: ${characterClass}`);
  }
  return createCharacterFromData(data);
}

export function getPregeneratedCharacterByName(name: string): Character {
  const data = Object.values(PREGENERATED_CHARACTERS).find(char => char.name === name);
  if (!data) {
    throw new Error(`No pregenerated character found with name: ${name}`);
  }
  return createCharacterFromData(data);
}