import type { 
  Companion, 
  CompanionId, 
  CompanionRelationship, 
  PartyComposition, 
  PartyBonus,
  PartySynergy,
  CompanionEvent,
  RelationshipEvent,
  RelationshipStatus,
  RomanceStatus
} from '../../core/types/companions';
import type { CharacterId } from '../../core/types/character';
import { COMPANION_CONSTANTS } from '../../core/types/companions';

/**
 * CompanionManager - Gestionnaire du système de compagnons D&D 5e
 * Gère le recrutement, les relations, les quêtes personnelles et la composition de groupe
 */

export class CompanionManager {
  
  // === RECRUTEMENT ===
  
  /**
   * Recrute un nouveau compagnon
   */
  static recruitCompanion(
    playerId: CharacterId,
    companion: Companion,
    currentParty: PartyComposition
  ): RecruitmentResult {
    
    // 1. Vérifier si le groupe n'est pas plein
    if (currentParty.companions.length >= currentParty.maxSize) {
      return {
        success: false,
        reason: 'party_full',
        message: `Votre groupe est déjà complet (${currentParty.maxSize} membres max).`,
        companion: null
      };
    }
    
    // 2. Vérifier si déjà recruté
    if (companion.isRecruited) {
      return {
        success: false,
        reason: 'already_recruited',
        message: `${companion.name} fait déjà partie d'un groupe.`,
        companion: null
      };
    }
    
    // 3. Marquer comme recruté
    const recruitedCompanion: Companion = {
      ...companion,
      isRecruited: true,
      joinedAt: new Date()
    };
    
    // 4. Créer la relation initiale
    const initialRelationship: CompanionRelationship = {
      companionId: companion.id,
      playerId,
      loyaltyLevel: this.calculateInitialLoyalty(companion),
      relationshipStatus: 'neutral',
      romanceStatus: 'none',
      romanceFlags: [],
      relationshipHistory: [
        {
          id: `recruit_${Date.now()}`,
          timestamp: new Date(),
          type: 'approval',
          description: `${companion.name} rejoint votre groupe`,
          loyaltyChange: 0,
          context: 'recruitment'
        }
      ]
    };
    
    // 5. Mettre à jour la composition du groupe
    const updatedParty: PartyComposition = {
      ...currentParty,
      companions: [...currentParty.companions, companion.id]
    };
    
    // 6. Recalculer les synergies
    const newSynergies = this.calculatePartySynergies(updatedParty, [recruitedCompanion]);
    updatedParty.activeSynergies = newSynergies;
    updatedParty.partyBonuses = this.calculatePartyBonuses(updatedParty);
    
    // 7. Déclencher événement
    const recruitmentEvent: CompanionEvent = {
      id: `recruit_${companion.id}_${Date.now()}`,
      companionId: companion.id,
      type: 'join',
      timestamp: new Date(),
      data: { playerId, loyalty: initialRelationship.loyaltyLevel }
    };
    
    return {
      success: true,
      reason: 'recruited',
      message: `${companion.name} rejoint votre groupe avec ${initialRelationship.loyaltyLevel} points de loyauté.`,
      companion: recruitedCompanion,
      relationship: initialRelationship,
      updatedParty,
      event: recruitmentEvent
    };
  }
  
  /**
   * Renvoie un compagnon du groupe
   */
  static dismissCompanion(
    companionId: CompanionId,
    currentParty: PartyComposition,
    relationship: CompanionRelationship,
    reason: DismissalReason = 'player_choice'
  ): DismissalResult {
    
    // 1. Vérifier que le compagnon est dans le groupe
    if (!currentParty.companions.includes(companionId)) {
      return {
        success: false,
        reason: 'not_in_party',
        message: 'Ce compagnon ne fait pas partie de votre groupe.',
        updatedParty: currentParty
      };
    }
    
    // 2. Vérifier si le compagnon peut partir (certains sont liés par l'histoire)
    const companion = this.getCompanionById(companionId);
    if (companion && !companion.canLeave && reason === 'player_choice') {
      return {
        success: false,
        reason: 'cannot_leave',
        message: `${companion.name} ne peut pas quitter le groupe pour le moment.`,
        updatedParty: currentParty
      };
    }
    
    // 3. Calculer impact sur la loyauté selon la raison
    let loyaltyPenalty = 0;
    let message = '';
    
    switch (reason) {
      case 'player_choice':
        loyaltyPenalty = -10;
        message = `${companion?.name} quitte le groupe, légèrement déçu·e.`;
        break;
      case 'betrayal':
        loyaltyPenalty = -50;
        message = `${companion?.name} vous quitte, se sentant trahi·e !`;
        break;
      case 'low_loyalty':
        loyaltyPenalty = 0; // Déjà bas
        message = `${companion?.name} décide de partir, votre relation s'étant dégradée.`;
        break;
      case 'story_required':
        loyaltyPenalty = 0;
        message = `${companion?.name} doit partir pour des raisons personnelles.`;
        break;
    }
    
    // 4. Mettre à jour la relation
    const updatedRelationship: CompanionRelationship = {
      ...relationship,
      loyaltyLevel: Math.max(-100, relationship.loyaltyLevel + loyaltyPenalty),
      relationshipHistory: [
        ...relationship.relationshipHistory,
        {
          id: `dismiss_${Date.now()}`,
          timestamp: new Date(),
          type: reason === 'betrayal' ? 'betrayal' : 'disapproval',
          description: `${companion?.name} quitte le groupe (${reason})`,
          loyaltyChange: loyaltyPenalty,
          context: 'dismissal'
        }
      ]
    };
    
    // 5. Mettre à jour la composition du groupe
    const updatedParty: PartyComposition = {
      ...currentParty,
      companions: currentParty.companions.filter(id => id !== companionId)
    };
    
    // 6. Recalculer les synergies
    updatedParty.activeSynergies = this.calculatePartySynergies(updatedParty, []);
    updatedParty.partyBonuses = this.calculatePartyBonuses(updatedParty);
    
    // 7. Déclencher événement
    const dismissalEvent: CompanionEvent = {
      id: `dismiss_${companionId}_${Date.now()}`,
      companionId,
      type: 'leave',
      timestamp: new Date(),
      data: { reason, loyaltyChange: loyaltyPenalty }
    };
    
    return {
      success: true,
      reason: 'dismissed',
      message,
      updatedParty,
      updatedRelationship,
      event: dismissalEvent
    };
  }
  
  // === GESTION DES RELATIONS ===
  
  /**
   * Met à jour la loyauté d'un compagnon
   */
  static updateRelationship(
    companionId: CompanionId,
    relationship: CompanionRelationship,
    change: RelationshipChange
  ): RelationshipUpdateResult {
    
    const previousLoyalty = relationship.loyaltyLevel;
    const newLoyalty = Math.max(-100, Math.min(100, previousLoyalty + change.loyaltyChange));
    
    // Déterminer nouveau statut de relation
    const newStatus = this.calculateRelationshipStatus(newLoyalty);
    
    // Vérifier progression romantique
    let newRomanceStatus = relationship.romanceStatus;
    const newRomanceFlags = [...relationship.romanceFlags];
    
    if (change.romanceProgress && this.canProgressRomance(relationship, newLoyalty)) {
      newRomanceStatus = this.progressRomance(relationship.romanceStatus);
      newRomanceFlags.push(change.romanceFlag || `romance_${Date.now()}`);
    }
    
    // Créer événement relationnel
    const relationshipEvent: RelationshipEvent = {
      id: `rel_${companionId}_${Date.now()}`,
      timestamp: new Date(),
      type: change.loyaltyChange > 0 ? 'approval' : 'disapproval',
      description: change.reason,
      loyaltyChange: change.loyaltyChange,
      context: change.context
    };
    
    // Relation mise à jour
    const updatedRelationship: CompanionRelationship = {
      ...relationship,
      loyaltyLevel: newLoyalty,
      relationshipStatus: newStatus,
      romanceStatus: newRomanceStatus,
      romanceFlags: newRomanceFlags,
      relationshipHistory: [...relationship.relationshipHistory, relationshipEvent]
    };
    
    // Vérifier si le compagnon veut partir
    const wantsToLeave = newLoyalty <= COMPANION_CONSTANTS.MIN_LOYALTY_TO_STAY;
    const willBetray = newLoyalty <= COMPANION_CONSTANTS.MAX_LOYALTY_FOR_BETRAYAL;
    
    return {
      success: true,
      previousLoyalty,
      newLoyalty,
      loyaltyChange: change.loyaltyChange,
      statusChanged: newStatus !== relationship.relationshipStatus,
      romanceProgressed: newRomanceStatus !== relationship.romanceStatus,
      updatedRelationship,
      event: relationshipEvent,
      warnings: {
        wantsToLeave,
        willBetray,
        message: this.getRelationshipWarning(newLoyalty, newStatus)
      }
    };
  }
  
  // === BONUS ET SYNERGIES ===
  
  /**
   * Calcule les bonus actuels du groupe
   */
  static getPartyBonuses(_party: PartyComposition, _companions: Companion[]): PartyBonus[] {
    const bonuses: PartyBonus[] = [];
    
    // Bonus de loyauté (compagnons très loyaux donnent des bonus)
    _companions.forEach((_companion: Companion) => {
      if (_companion.isRecruited) {
        // TODO: Récupérer la loyauté depuis le système de relations
        // const loyalty = getCompanionLoyalty(companion.id);
        // if (loyalty > 80) {
        //   bonuses.push(createLoyaltyBonus(companion));
        // }
      }
    });
    
    // Bonus de synergies actives
    _party.activeSynergies.forEach((synergy: PartySynergy) => {
      synergy.bonuses.forEach((synergyBonus: any) => {
        bonuses.push({
          id: `synergy_${synergy.id}`,
          name: `Synergie: ${synergy.name}`,
          description: synergyBonus.effect,
          source: 'synergy',
          effect: {
            type: 'attack_bonus', // TODO: Mapper depuis synergyBonus.type
            value: synergyBonus.value
          }
        });
      });
    });
    
    return bonuses;
  }
  
  // === UTILITAIRES PRIVÉS ===
  
  private static calculateInitialLoyalty(companion: Companion): number {
    let baseLoyalty = 0;
    
    // Bonus selon personnalité
    companion.personality.forEach(trait => {
      switch (trait) {
        case 'loyal': baseLoyalty += 10; break;
        case 'cynical': baseLoyalty -= 5; break;
        case 'naive': baseLoyalty += 5; break;
        case 'mysterious': baseLoyalty -= 10; break;
        default: break;
      }
    });
    
    return Math.max(-20, Math.min(20, baseLoyalty));
  }
  
  private static calculateRelationshipStatus(loyalty: number): RelationshipStatus {
    if (loyalty <= -51) return 'hostile';
    if (loyalty <= -21) return 'unfriendly';
    if (loyalty <= 20) return 'neutral';
    if (loyalty <= 50) return 'friendly';
    if (loyalty <= 80) return 'allied';
    return 'devoted';
  }
  
  private static canProgressRomance(relationship: CompanionRelationship, loyalty: number): boolean {
    return loyalty >= COMPANION_CONSTANTS.ROMANCE_REQUIREMENTS.MIN_LOYALTY &&
           relationship.romanceStatus !== 'rejected' &&
           relationship.romanceStatus !== 'married';
  }
  
  private static progressRomance(currentStatus: RomanceStatus): RomanceStatus {
    switch (currentStatus) {
      case 'none': return 'potential';
      case 'potential': return 'interested';
      case 'interested': return 'courting';
      case 'courting': return 'couple';
      case 'couple': return 'married';
      default: return currentStatus;
    }
  }
  
  private static calculatePartySynergies(_party: PartyComposition, _companions: Companion[]): PartySynergy[] {
    // TODO: Implémenter logique de calcul des synergies
    // Vérifier combinaisons de classes, relations, etc.
    return [];
  }
  
  private static calculatePartyBonuses(_party: PartyComposition): PartyBonus[] {
    // TODO: Calculer bonus basés sur composition et synergies
    return [];
  }
  
  private static getCompanionById(_companionId: CompanionId): Companion | null {
    // TODO: Récupérer depuis store/base de données
    return null;
  }
  
  private static getRelationshipWarning(loyalty: number, _status: RelationshipStatus): string | null {
    if (loyalty <= COMPANION_CONSTANTS.MAX_LOYALTY_FOR_BETRAYAL) {
      return "Ce compagnon pourrait vous trahir !";
    }
    if (loyalty <= COMPANION_CONSTANTS.MIN_LOYALTY_TO_STAY) {
      return "Ce compagnon envisage de partir.";
    }
    if (loyalty >= 80) {
      return "Ce compagnon vous est totalement dévoué.";
    }
    return null;
  }
}

// === TYPES POUR LES RÉSULTATS ===

export interface RecruitmentResult {
  success: boolean;
  reason: 'recruited' | 'party_full' | 'already_recruited' | 'requirements_not_met';
  message: string;
  companion: Companion | null;
  relationship?: CompanionRelationship;
  updatedParty?: PartyComposition;
  event?: CompanionEvent;
}

export type DismissalReason = 'player_choice' | 'betrayal' | 'low_loyalty' | 'story_required';

export interface DismissalResult {
  success: boolean;
  reason: 'dismissed' | 'not_in_party' | 'cannot_leave';
  message: string;
  updatedParty: PartyComposition;
  updatedRelationship?: CompanionRelationship;
  event?: CompanionEvent;
}

export interface RelationshipChange {
  loyaltyChange: number;
  reason: string;
  context: string;
  romanceProgress?: boolean;
  romanceFlag?: string;
}

export interface RelationshipUpdateResult {
  success: boolean;
  previousLoyalty: number;
  newLoyalty: number;
  loyaltyChange: number;
  statusChanged: boolean;
  romanceProgressed: boolean;
  updatedRelationship: CompanionRelationship;
  event: RelationshipEvent;
  warnings: {
    wantsToLeave: boolean;
    willBetray: boolean;
    message: string | null;
  };
}