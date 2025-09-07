import type { CombatEntity } from '../../core/types/combat';
import type { Character } from '../../core/types/character';

// Utility function to calculate ability modifier
const calculateAbilityModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export interface AttackResult {
  attacker: string;
  target: string;
  attackRoll: number;
  toHit: number;
  hits: boolean;
  damage: number;
  isCritical: boolean;
}

export interface CombatTurn {
  entity: CombatEntity | Character;
  initiative: number;
}

export class SimpleCombatEngine {
  private combatants: (CombatEntity | Character)[] = [];
  private turnOrder: CombatTurn[] = [];
  private currentTurnIndex: number = 0;
  private combatLog: string[] = [];

  constructor(
    playerCharacter: Character,
    enemies: CombatEntity[]
  ) {
    this.combatants = [playerCharacter, ...enemies];
    this.initializeInitiative();
  }

  private initializeInitiative(): void {
    // Roll initiative for all combatants
    this.turnOrder = this.combatants.map(combatant => {
      const dexMod = this.getAbilityModifier(combatant, 'dexterity');
      const initiativeRoll = this.rollD20() + dexMod;
      
      return {
        entity: combatant,
        initiative: initiativeRoll
      };
    });

    // Sort by initiative (descending)
    this.turnOrder.sort((a, b) => b.initiative - a.initiative);
    
    this.logMessage('=== COMBAT INITIATED ===');
    this.turnOrder.forEach(turn => {
      this.logMessage(`${turn.entity.name}: Initiative ${turn.initiative}`);
    });
  }

  private getAbilityModifier(entity: CombatEntity | Character, ability: 'strength' | 'dexterity'): number {
    if ('combatStats' in entity && 'finalStats' in entity) {
      // Character
      return calculateAbilityModifier(entity.finalStats[ability]);
    } else if ('abilityScores' in entity) {
      // CombatEntity
      return calculateAbilityModifier(entity.abilityScores[ability]);
    }
    return 0;
  }

  private getArmorClass(entity: CombatEntity | Character): number {
    return entity.combatStats.armorClass;
  }

  private getCurrentHP(entity: CombatEntity | Character): number {
    return entity.combatStats.currentHitPoints;
  }

  private getMaxHP(entity: CombatEntity | Character): number {
    return entity.combatStats.maxHitPoints;
  }

  private setCurrentHP(entity: CombatEntity | Character, hp: number): void {
    entity.combatStats.currentHitPoints = Math.max(0, Math.min(hp, entity.combatStats.maxHitPoints));
    if ('isAlive' in entity) {
      entity.isAlive = entity.combatStats.currentHitPoints > 0;
      entity.isConscious = entity.combatStats.currentHitPoints > 0;
    }
  }

  private rollD20(): number {
    return Math.floor(Math.random() * 20) + 1;
  }

  private rollDamage(diceString: string): number {
    // Parse dice string like "1d8" or "2d6"
    const match = diceString.match(/(\d+)d(\d+)/);
    if (!match) return 0;
    
    const numDice = parseInt(match[1]);
    const dieSize = parseInt(match[2]);
    
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * dieSize) + 1;
    }
    return total;
  }

  public performAttack(attacker: CombatEntity | Character, target: CombatEntity | Character): AttackResult {
    // For MVP, assume simple melee attack
    const strMod = this.getAbilityModifier(attacker, 'strength');
    const proficiencyBonus = 2; // Simplified for MVP
    
    // Attack roll
    const d20Roll = this.rollD20();
    const attackRoll = d20Roll + strMod + proficiencyBonus;
    const targetAC = this.getArmorClass(target);
    const hits = attackRoll >= targetAC;
    const isCritical = d20Roll === 20;
    
    let damage = 0;
    if (hits) {
      // Roll damage (1d8 for basic weapon + str modifier)
      damage = this.rollDamage(isCritical ? '2d8' : '1d8') + strMod;
      damage = Math.max(1, damage); // Minimum 1 damage
      
      // Apply damage
      const currentHP = this.getCurrentHP(target);
      this.setCurrentHP(target, currentHP - damage);
      
      this.logMessage(
        `${attacker.name} attacks ${target.name}: ${d20Roll}+${strMod + proficiencyBonus}=${attackRoll} vs AC ${targetAC} - ${hits ? `HIT for ${damage} damage${isCritical ? ' (CRITICAL!)' : ''}` : 'MISS'}`
      );
      
      if (this.getCurrentHP(target) <= 0) {
        this.logMessage(`${target.name} is defeated!`);
      }
    } else {
      this.logMessage(
        `${attacker.name} attacks ${target.name}: ${d20Roll}+${strMod + proficiencyBonus}=${attackRoll} vs AC ${targetAC} - MISS`
      );
    }
    
    return {
      attacker: attacker.name,
      target: target.name,
      attackRoll,
      toHit: strMod + proficiencyBonus,
      hits,
      damage,
      isCritical
    };
  }

  public getCurrentTurn(): CombatEntity | Character | null {
    if (this.turnOrder.length === 0) return null;
    return this.turnOrder[this.currentTurnIndex].entity;
  }

  public nextTurn(): void {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
    const current = this.getCurrentTurn();
    if (current) {
      this.logMessage(`--- ${current.name}'s turn ---`);
    }
  }

  public isEnemyTurn(): boolean {
    const current = this.getCurrentTurn();
    return current !== null && 'combatStats' in current;
  }

  public getAliveEnemies(): CombatEntity[] {
    return this.combatants.filter(
      c => 'isAlive' in c && c.isAlive
    ) as CombatEntity[];
  }

  public getPlayerCharacter(): Character | null {
    const player = this.combatants.find(c => !('isAlive' in c));
    return player as Character | undefined || null;
  }

  public isCombatOver(): boolean {
    const aliveEnemies = this.getAliveEnemies();
    const player = this.getPlayerCharacter();
    
    if (!player) return true;
    if (aliveEnemies.length === 0) return true;
    if (this.getCurrentHP(player) <= 0) return true;
    
    return false;
  }

  public getCombatResult(): 'victory' | 'defeat' | 'ongoing' {
    if (!this.isCombatOver()) return 'ongoing';
    
    const player = this.getPlayerCharacter();
    if (!player || this.getCurrentHP(player) <= 0) return 'defeat';
    
    return 'victory';
  }

  public processEnemyTurn(enemy: CombatEntity): AttackResult | null {
    // Simple AI: attack the player
    const player = this.getPlayerCharacter();
    if (!player || !enemy.isAlive) return null;
    
    return this.performAttack(enemy, player);
  }

  public getCombatLog(): string[] {
    return [...this.combatLog];
  }

  private logMessage(message: string): void {
    this.combatLog.push(message);
    console.log(`[COMBAT] ${message}`);
  }

  public getTurnOrder(): CombatTurn[] {
    return this.turnOrder;
  }

  public getCurrentTurnIndex(): number {
    return this.currentTurnIndex;
  }

  // Get combat state for UI
  public getCombatState() {
    return {
      combatants: this.combatants.map(c => ({
        name: c.name,
        currentHP: this.getCurrentHP(c),
        maxHP: this.getMaxHP(c),
        isPlayer: !('isAlive' in c),
        isAlive: 'isAlive' in c ? c.isAlive : this.getCurrentHP(c) > 0,
        isCurrent: c === this.getCurrentTurn()
      })),
      currentTurn: this.getCurrentTurn()?.name || '',
      turnIndex: this.currentTurnIndex,
      isPlayerTurn: !this.isEnemyTurn(),
      combatOver: this.isCombatOver(),
      result: this.getCombatResult(),
      log: this.getCombatLog()
    };
  }
}