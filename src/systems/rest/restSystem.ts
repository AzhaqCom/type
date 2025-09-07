import type { Character } from '../../core/types/character';
import type { DnDClass, HitDie } from '../../core/types/base';
import type { 
  ShortRest, 
  LongRest, 
  RestLocation, 
  RestResult,
  RestInterruption,
  HitDiceRoll,
  ClassAbilityRecovery,
  LongRestRecovery,
  SpellPreparation,
  RestQuality
} from '../../core/types/rest';
import { REST_CONSTANTS } from '../../core/types/rest';
import type { SpellLevel } from '../../core/types/spells';
import { hasSpellbook, hasKi } from '../../core/types/classData';
import { getAbilityModifier } from '../../core/types/base';

/**
 * Système de Repos D&D 5e
 * Implémente toutes les mécaniques de récupération selon les règles officielles
 */

export class RestSystem {
  
  // === REPOS COURT ===
  
  /**
   * Traite un repos court selon les règles D&D 5e
   */
  static processShortRest(
    character: Character,
    location: RestLocation,
    hitDiceToUse: HitDie[] = []
  ): Promise<RestResult> {
    
    const shortRest: ShortRest = {
      type: 'short',
      duration: REST_CONSTANTS.SHORT_REST_DURATION,
      location,
      startTime: new Date(),
      hitDiceUsed: [],
      classAbilitiesRecovered: [],
      completed: false
    };
    
    // 1. Vérifier les interruptions
    const interruption = this.rollForInterruption(location, 'short');
    if (interruption) {
      shortRest.interruption = interruption;
      if (interruption.severity === 'catastrophic') {
        return Promise.resolve({
          success: false,
          rest: shortRest,
          finalState: this.getCurrentState(character)
        });
      }
    }
    
    // 2. Utiliser les Hit Dice pour récupérer HP
    const healingRolls = this.useHitDice(character, hitDiceToUse);
    shortRest.hitDiceUsed = healingRolls;
    
    // Calculer les HP récupérés (mais pas les appliquer ici)
    // const totalHealing = healingRolls.reduce((sum, roll) => sum + roll.totalHealing, 0);
    
    // 3. Récupérer les capacités de classe
    const classRecovery = this.recoverShortRestAbilities(character);
    shortRest.classAbilitiesRecovered = classRecovery;
    
    // 4. Appliquer les récupérations
    this.applyShortRestRecovery(character, shortRest);
    
    shortRest.completed = true;
    
    return Promise.resolve({
      success: true,
      rest: shortRest,
      finalState: this.getCurrentState(character)
    });
  }
  
  /**
   * Utilise les Hit Dice pour récupérer des HP
   */
  private static useHitDice(
    character: Character,
    hitDiceToUse: HitDie[]
  ): HitDiceRoll[] {
    const rolls: HitDiceRoll[] = [];
    const conModifier = getAbilityModifier(character.stats.base.constitution);
    
    for (const hitDie of hitDiceToUse) {
      // Vérifier qu'on a encore des Hit Dice de ce type
      // TODO: Ajouter tracking des Hit Dice dans Character
      
      const dieSize = parseInt(hitDie.substring(1)); // 'd6' -> 6
      const rolled = Math.floor(Math.random() * dieSize) + 1;
      const totalHealing = Math.max(1, rolled + conModifier); // Minimum 1 HP
      
      rolls.push({
        hitDie,
        rolled,
        constitutionBonus: conModifier,
        totalHealing
      });
    }
    
    return rolls;
  }
  
  /**
   * Récupère les capacités de classe après repos court
   */
  private static recoverShortRestAbilities(
    character: Character
  ): ClassAbilityRecovery[] {
    const recoveries: ClassAbilityRecovery[] = [];
    const classData = character.classData;
    
    const recovery: ClassAbilityRecovery = {
      characterClass: character.class,
      abilitiesRecovered: {}
    };
    
    switch (character.class) {
      case 'fighter':
        // Second Wind récupère
        recovery.abilitiesRecovered.secondWind = true;
        break;
        
      case 'wizard':
        if (hasSpellbook(classData)) {
          // Arcane Recovery
          const wizardLevel = character.level;
          const slotsToRecover = Math.ceil(wizardLevel / 2);
          
          // Pour simplifier, récupère des slots niveau 1
          // TODO: Permettre le choix des slots
          const slotRecovery: Partial<Record<SpellLevel, number>> = {};
          slotRecovery[1] = Math.min(slotsToRecover, 3);
          recovery.abilitiesRecovered.arcaneRecovery = {
            slotsRecovered: slotRecovery,
            totalLevels: slotsToRecover
          };
        }
        break;
        
      case 'warlock':
        // Tous les Pact Magic slots récupèrent
        const warlockLevel = character.level;
        const pactSlots = warlockLevel >= 2 ? 2 : 1;
        recovery.abilitiesRecovered.pactMagicSlots = pactSlots;
        break;
        
      case 'monk':
        if (hasKi(classData)) {
          // Tous les points Ki récupèrent
          recovery.abilitiesRecovered.kiPoints = character.level;
        }
        break;
        
      case 'bard':
        // Bardic Inspiration récupère
        const chaModifier = getAbilityModifier(character.stats.base.charisma);
        recovery.abilitiesRecovered.bardicInspiration = Math.max(1, chaModifier);
        break;
    }
    
    recoveries.push(recovery);
    return recoveries;
  }
  
  // === REPOS LONG ===
  
  /**
   * Traite un repos long selon les règles D&D 5e
   */
  static processLongRest(
    character: Character,
    location: RestLocation,
    spellPreparation?: string[]
  ): Promise<RestResult> {
    
    const longRest: LongRest = {
      type: 'long',
      duration: REST_CONSTANTS.LONG_REST_DURATION,
      location,
      startTime: new Date(),
      recovery: {
        hitPointsRestored: 0,
        hitDiceRestored: {},
        spellSlotsRestored: {},
        dailyAbilitiesReset: [],
        conditionsRemoved: [],
        exhaustionReduced: false
      },
      interruptions: [],
      completed: false,
      restQuality: 'normal'
    };
    
    // 1. Vérifier interruptions multiples pendant 8h
    const interruptions = this.rollForMultipleInterruptions(location, 'long');
    longRest.interruptions = interruptions;
    
    // Si trop d'interruptions, repos échoue
    const majorInterruptions = interruptions.filter(interruption => interruption.severity !== 'minor').length;
    if (majorInterruptions > 1) {
      return Promise.resolve({
        success: false,
        rest: longRest,
        finalState: this.getCurrentState(character)
      });
    }
    
    // 2. Calculer la qualité du repos
    longRest.restQuality = this.calculateRestQuality(location, interruptions);
    
    // 3. Récupération complète
    const recovery = this.processLongRestRecovery(character, longRest.restQuality);
    longRest.recovery = recovery;
    
    // 4. Préparation de sorts si classe lanceur
    if (spellPreparation && this.canPrepareSpells(character)) {
      longRest.spellPreparation = this.processSpellPreparation(
        character,
        spellPreparation
      );
    }
    
    // 5. Appliquer la récupération
    this.applyLongRestRecovery(character, longRest);
    
    longRest.completed = true;
    
    return Promise.resolve({
      success: true,
      rest: longRest,
      finalState: this.getCurrentState(character)
    });
  }
  
  /**
   * Traite la récupération complète du repos long
   */
  private static processLongRestRecovery(
    character: Character,
    _quality: RestQuality
  ): LongRestRecovery {
    
    const recovery: LongRestRecovery = {
      hitPointsRestored: character.combatStats.maxHitPoints - character.combatStats.currentHitPoints,
      hitDiceRestored: this.calculateHitDiceRecovery(character),
      spellSlotsRestored: this.calculateSpellSlotRecovery(character),
      dailyAbilitiesReset: this.getDailyAbilitiesToReset(character),
      conditionsRemoved: this.getConditionsToRemove(character),
      exhaustionReduced: true // TODO: Vérifier si personnage a exhaustion
    };
    
    return recovery;
  }
  
  /**
   * Calcule la récupération des Hit Dice (50% arrondi au supérieur)
   */
  private static calculateHitDiceRecovery(character: Character): Partial<Record<HitDie, number>> {
    // TODO: Tracker les Hit Dice dans Character
    // Pour l'instant, assume qu'on récupère selon le niveau
    const hitDie = this.getClassHitDie(character.class);
    const totalHitDice = character.level;
    const recoveredCount = Math.ceil(totalHitDice * REST_CONSTANTS.HIT_DICE_RECOVERY_RATE);
    
    const recovery: Partial<Record<HitDie, number>> = {};
    recovery[hitDie] = recoveredCount;
    return recovery;
  }
  
  /**
   * Calcule la récupération des spell slots
   */
  private static calculateSpellSlotRecovery(character: Character): Partial<Record<SpellLevel, number>> {
    const recovery: Partial<Record<SpellLevel, number>> = {};
    
    if (character.spellcasting) {
      const progression = character.spellcasting;
      const slots = progression.spellSlots[character.level];
      
      // Récupère tous les slots
      Object.entries(slots).forEach(([level, count]) => {
        const spellLevel = parseInt(level) as SpellLevel;
        recovery[spellLevel] = count;
      });
    }
    
    return recovery;
  }
  
  /**
   * Liste des capacités "once per day" à reset
   */
  private static getDailyAbilitiesToReset(character: Character): string[] {
    const abilities: string[] = [];
    
    switch (character.class) {
      case 'wizard':
        abilities.push('arcane_recovery');
        break;
      case 'fighter':
        if (character.level >= 2) {
          abilities.push('action_surge');
        }
        break;
      case 'barbarian':
        abilities.push('rage_uses');
        break;
      // TODO: Ajouter autres classes
    }
    
    return abilities;
  }
  
  /**
   * Conditions supprimées par repos long
   */
  private static getConditionsToRemove(_character: Character): string[] {
    // TODO: Récupérer les conditions actuelles depuis character.combatStats.conditions
    return ['charmed', 'frightened']; // Exemples
  }
  
  // === UTILITAIRES ===
  
  /**
   * Calcule le risque d'interruption selon le lieu
   */
  private static rollForInterruption(
    location: RestLocation,
    restType: 'short' | 'long'
  ): RestInterruption | null {
    
    const baseChance = REST_CONSTANTS.INTERRUPTION_CHANCES[location.type];
    const roll = Math.random() * 100;
    
    if (roll > baseChance) {
      return null; // Pas d'interruption
    }
    
    // TODO: Générer interruption selon le type de lieu et danger
    return {
      id: `interruption_${Date.now()}`,
      type: 'environmental',
      timeOccurred: Math.random() * (restType === 'short' ? 60 : 480),
      severity: 'minor',
      title: 'Bruit suspect',
      description: 'Vous entendez des bruits étranges dans la nuit...',
      consequences: [],
      choices: [
        {
          id: 'investigate',
          text: 'Enquêter',
          consequences: []
        },
        {
          id: 'ignore',
          text: 'Ignorer et continuer à dormir',
          consequences: []
        }
      ],
      resolved: false
    };
  }
  
  /**
   * Gère les interruptions multiples pour repos long
   */
  private static rollForMultipleInterruptions(
    location: RestLocation,
    restType: 'long'
  ): RestInterruption[] {
    const interruptions: RestInterruption[] = [];
    
    // 3 checks pendant 8h (toutes les ~2.7h)
    for (let check = 0; check < 3; check++) {
      const interruption = this.rollForInterruption(location, restType);
      if (interruption) {
        interruptions.push(interruption);
      }
    }
    
    return interruptions;
  }
  
  /**
   * Calcule la qualité du repos selon lieu et interruptions
   */
  private static calculateRestQuality(
    location: RestLocation,
    interruptions: RestInterruption[]
  ): RestQuality {
    
    let qualityScore = location.comfortLevel;
    
    // Pénalité pour interruptions
    interruptions.forEach(interruption => {
      switch (interruption.severity) {
        case 'minor': qualityScore -= 10; break;
        case 'major': qualityScore -= 25; break;
        case 'catastrophic': qualityScore -= 50; break;
      }
    });
    
    if (qualityScore >= 80) return 'excellent';
    if (qualityScore >= 60) return 'good';
    if (qualityScore >= 30) return 'normal';
    return 'poor';
  }
  
  /**
   * Vérifie si le personnage peut préparer des sorts
   */
  private static canPrepareSpells(character: Character): boolean {
    return character.spellcasting !== undefined && 
           (character.class === 'wizard' || 
            character.class === 'cleric' || 
            character.class === 'druid' ||
            character.class === 'paladin');
  }
  
  /**
   * Traite la préparation de sorts
   */
  private static processSpellPreparation(
    character: Character,
    spellIds: string[]
  ): SpellPreparation {
    
    const maxPrepared = this.calculateMaxPreparedSpells(character);
    
    return {
      characterId: character.id,
      characterClass: character.class,
      availableSpells: [], // TODO: Récupérer selon la classe
      preparedSpells: spellIds,
      maxPrepared,
      isValid: spellIds.length <= maxPrepared
    };
  }
  
  /**
   * Calcule le nombre max de sorts préparables
   */
  private static calculateMaxPreparedSpells(character: Character): number {
    const castingAbility = character.spellcasting?.castingAbility;
    if (!castingAbility) return 0;
    
    const abilityScore = character.stats.base[castingAbility];
    const modifier = getAbilityModifier(abilityScore);
    
    return Math.max(1, character.level + modifier);
  }
  
  /**
   * Récupère le Hit Die de la classe
   */
  private static getClassHitDie(characterClass: DnDClass): HitDie {
    const hitDieByClass: Record<DnDClass, HitDie> = {
      barbarian: 'd12',
      fighter: 'd10', paladin: 'd10', ranger: 'd10',
      bard: 'd8', cleric: 'd8', druid: 'd8', monk: 'd8', rogue: 'd8', warlock: 'd8',
      sorcerer: 'd6', wizard: 'd6'
    };
    
    return hitDieByClass[characterClass];
  }
  
  /**
   * Applique la récupération du repos court
   */
  private static applyShortRestRecovery(
    character: Character,
    shortRest: ShortRest
  ): void {
    // Appliquer HP
    const totalHealing = shortRest.hitDiceUsed.reduce((sum, roll) => sum + roll.totalHealing, 0);
    character.combatStats.currentHitPoints = Math.min(
      character.combatStats.currentHitPoints + totalHealing,
      character.combatStats.maxHitPoints
    );
    
    // TODO: Appliquer récupération des capacités
  }
  
  /**
   * Applique la récupération du repos long
   */
  private static applyLongRestRecovery(
    character: Character,
    _longRest: LongRest
  ): void {
    // HP complet
    character.combatStats.currentHitPoints = character.combatStats.maxHitPoints;
    
    // TODO: Appliquer spell slots, conditions, etc.
    // Note: _longRest.recovery contient toutes les info de récupération
  }
  
  /**
   * Récupère l'état actuel du personnage
   */
  private static getCurrentState(character: Character) {
    const hitDie = this.getClassHitDie(character.class);
    const hitDiceAfter: Record<HitDie, number> = {
      'd6': 0, 'd8': 0, 'd10': 0, 'd12': 0
    };
    hitDiceAfter[hitDie] = character.level; // TODO: Tracker réel des Hit Dice
    
    return {
      hitPointsAfter: character.combatStats.currentHitPoints,
      hitDiceAfter,
      spellSlotsAfter: character.spellcasting?.currentSlots || {} as Record<SpellLevel, number>,
      conditionsAfter: character.combatStats.conditions || [],
      exhaustionLevel: 0 // TODO: Tracker exhaustion
    };
  }
}