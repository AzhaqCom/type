import type { CombatEntity, EntityType, CreatureSize, CreatureType, CombatEntityId } from '../core/types/combat';
import type { Ability, AbilityScore } from '../core/types/base';

// Template d'ennemi (sans ID spécifique)
export interface EnemyTemplate {
  templateId: string;
  name: string;
  type: EntityType;
  size: CreatureSize;
  creatureType: CreatureType;
  abilityScores: Record<Ability, AbilityScore>;
  skillBonuses: Record<string, number>;
  savingThrowBonuses: Record<string, number>;
  combatStats: Omit<CombatEntity['combatStats'], 'currentHitPoints'>;
}

// Factory pour créer des instances d'ennemis
export class EnemyFactory {
  private static instanceCounter = 0;

  static createEntity(templateId: string): CombatEntity {
    const template = ENEMY_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`Template d'ennemi introuvable: ${templateId}`);
    }

    this.instanceCounter++;
    const entityId = `entity_${template.templateId}_${this.instanceCounter}` as CombatEntityId;

    return {
      id: entityId,
      name: template.name,
      type: template.type,
      size: template.size,
      creatureType: template.creatureType,
      abilityScores: { ...template.abilityScores },
      skillBonuses: { ...template.skillBonuses },
      savingThrowBonuses: { ...template.savingThrowBonuses },
      combatStats: {
        ...template.combatStats,
        currentHitPoints: template.combatStats.maxHitPoints // HP max au début
      },
      isAlive: true,
      isConscious: true,
      canAct: true
    };
  }

  static createMultiple(templateId: string, count: number): CombatEntity[] {
    return Array.from({ length: count }, () => this.createEntity(templateId));
  }

  static resetCounter(): void {
    this.instanceCounter = 0;
  }
}

// Base de données centralisée des ennemis - UN SEUL EXPORT
export const ENEMY_TEMPLATES: Record<string, EnemyTemplate> = {
  // === HUMANOIDS ===
  bandit_leader: {
    templateId: 'bandit_leader',
    name: 'Chef Bandit',
    type: 'enemy',
    size: 'medium',
    creatureType: 'humanoid',
    abilityScores: {
      strength: 14,
      dexterity: 14,
      constitution: 12,
      intelligence: 10,
      wisdom: 10,
      charisma: 12
    },
    skillBonuses: {},
    savingThrowBonuses: {},
    combatStats: {
      maxHitPoints: 22,
      temporaryHitPoints: 0,
      armorClass: 14,
      initiative: 2,
      speed: 30,
      conditions: [],
      damageResistances: [],
      damageImmunities: [],
      conditionImmunities: []
    }
  },

  bandit: {
    templateId: 'bandit',
    name: 'Bandit',
    type: 'enemy',
    size: 'medium',
    creatureType: 'humanoid',
    abilityScores: {
      strength: 11,
      dexterity: 12,
      constitution: 12,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skillBonuses: {},
    savingThrowBonuses: {},
    combatStats: {
      maxHitPoints: 11,
      temporaryHitPoints: 0,
      armorClass: 12,
      initiative: 1,
      speed: 30,
      conditions: [],
      damageResistances: [],
      damageImmunities: [],
      conditionImmunities: []
    }
  },

  // === BEASTS ===
  wolf: {
    templateId: 'wolf',
    name: 'Loup',
    type: 'enemy',
    size: 'medium',
    creatureType: 'beast',
    abilityScores: {
      strength: 12,
      dexterity: 15,
      constitution: 12,
      intelligence: 3,
      wisdom: 12,
      charisma: 6
    },
    skillBonuses: {},
    savingThrowBonuses: {},
    combatStats: {
      maxHitPoints: 11,
      temporaryHitPoints: 0,
      armorClass: 13,
      initiative: 2,
      speed: 40,
      conditions: [],
      damageResistances: [],
      damageImmunities: [],
      conditionImmunities: []
    }
  },

  // === UNDEAD ===
  skeleton: {
    templateId: 'skeleton',
    name: 'Squelette',
    type: 'enemy',
    size: 'medium',
    creatureType: 'undead',
    abilityScores: {
      strength: 10,
      dexterity: 14,
      constitution: 15,
      intelligence: 6,
      wisdom: 8,
      charisma: 5
    },
    skillBonuses: {},
    savingThrowBonuses: {},
    combatStats: {
      maxHitPoints: 13,
      temporaryHitPoints: 0,
      armorClass: 13,
      initiative: 2,
      speed: 30,
      conditions: [],
      damageResistances: [],
      damageImmunities: ['poison'],
      conditionImmunities: ['poisoned', 'exhaustion']
    }
  }

  // Plus facile d'ajouter de nouveaux ennemis ici...
};