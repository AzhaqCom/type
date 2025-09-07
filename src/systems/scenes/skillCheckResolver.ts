import type { SkillCheck, SkillCheckResult } from '../../core/types/scenes';
import type { Character } from '../../core/types/character';
import { useGameStore } from '../../stores/gameStore';

// Extension de l'interface pour le résultat détaillé
export interface DetailedSkillCheckResult extends SkillCheckResult {
  diceRoll: number;
  totalModifier: number;
  totalRoll: number;
  success: boolean;
  criticalSuccess: boolean;
  criticalFailure: boolean;
  margin: number;
}

export class SkillCheckResolver {
  static async resolve(skillCheck: SkillCheck): Promise<DetailedSkillCheckResult> {
    const store = useGameStore.getState();
    const character = store.character.activeCharacter;
    
    if (!character) {
      throw new Error('No active character for skill check');
    }
    
    // 1. Calculer le modificateur total
    const abilityMod = this.getAbilityModifier(character, skillCheck.ability);
    const skillMod = skillCheck.skill ? 
      this.getSkillModifier(character, skillCheck.skill) : 0;
    const proficiencyBonus = Math.ceil(character.level / 4) + 1; // Calcul proficiency bonus D&D 5e
    
    // Vérifier si le personnage est proficient dans cette compétence
    const isProficient = skillCheck.skill ? 
      this.isProficient(character, skillCheck.skill) : false;
    
    const totalModifier = abilityMod + skillMod + (isProficient ? proficiencyBonus : 0);
    
    // 2. Effectuer le jet
    const rollType = this.determineRollType(skillCheck);
    const diceRoll = this.rollD20(rollType);
    const totalRoll = diceRoll + totalModifier;
    
    // 3. Déterminer le résultat
    const success = totalRoll >= skillCheck.difficultyClass;
    const criticalSuccess = diceRoll === 20;
    const criticalFailure = diceRoll === 1;
    const margin = totalRoll - skillCheck.difficultyClass;
    
    // 4. Créer le résultat détaillé
    const result: DetailedSkillCheckResult = {
      skillCheck,
      diceRoll,
      totalModifier,
      totalRoll,
      success,
      criticalSuccess,
      criticalFailure,
      margin
    };
    
    // 5. Afficher les résultats à l'utilisateur (pour le MVP)
    await this.displaySkillCheckResult(result);
    
    return result;
  }
  
  private static getAbilityModifier(character: Character, ability: string): number {
    const score = character.finalStats[ability as keyof typeof character.finalStats];
    if (typeof score !== 'number') return 0;
    return Math.floor((score - 10) / 2);
  }
  
  private static getSkillModifier(character: Character, skill: string): number {
    const skillData = character.skills[skill as keyof typeof character.skills];
    if (typeof skillData === 'object' && skillData?.bonus) {
      return skillData.bonus;
    }
    return 0;
  }
  
  private static isProficient(character: Character, skill: string): boolean {
    const skillData = character.skills[skill as keyof typeof character.skills];
    if (typeof skillData === 'object') {
      return skillData.proficient || false;
    }
    return false;
  }
  
  private static determineRollType(skillCheck: SkillCheck): 'normal' | 'advantage' | 'disadvantage' {
    if (skillCheck.advantage) return 'advantage';
    if (skillCheck.disadvantage) return 'disadvantage';
    return 'normal';
  }
  
  private static rollD20(type: 'normal' | 'advantage' | 'disadvantage'): number {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    
    if (type === 'normal') return roll1;
    
    const roll2 = Math.floor(Math.random() * 20) + 1;
    return type === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  }
  
  private static async displaySkillCheckResult(result: DetailedSkillCheckResult): Promise<void> {
    const { skillCheck, diceRoll, totalModifier, totalRoll, success, criticalSuccess, criticalFailure } = result;
    
    const skillName = skillCheck.skill ? 
      skillCheck.skill.charAt(0).toUpperCase() + skillCheck.skill.slice(1) :
      skillCheck.ability.toUpperCase();
    
    const message = `
🎲 **${skillName} Check**

Dé: ${diceRoll} ${criticalSuccess ? '(CRITIQUE!)' : ''} ${criticalFailure ? '(ÉCHEC CRITIQUE!)' : ''}
Modificateur: +${totalModifier}
Total: ${totalRoll}

DC ${skillCheck.difficultyClass} - ${success ? '✅ RÉUSSIE' : '❌ ÉCHEC'}
${criticalSuccess ? '🌟 RÉUSSITE CRITIQUE!' : ''}
${criticalFailure ? '💥 ÉCHEC CRITIQUE!' : ''}
    `.trim();
    
    // Pour le MVP, on log le résultat
    console.log(message);
    
    // TODO: Intégrer avec un vrai système de modal/notification
    // await showSkillCheckModal(message, success);
  }
}