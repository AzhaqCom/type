import type { SceneReward } from '../../core/types/scenes';
import { useGameStore } from '../../stores/gameStore';

export class RewardProcessor {
  static async applyRewards(rewards: SceneReward[]): Promise<void> {
    const store = useGameStore.getState();
    
    for (const reward of rewards) {
      try {
        await this.applyReward(reward, store);
      } catch (error) {
        console.error('Erreur lors de l\'application de la récompense:', reward, error);
      }
    }
  }
  
  private static async applyReward(reward: SceneReward, store: any): Promise<void> {
    const actions = store.actions;
    
    switch (reward.type) {
      case 'xp':
        if (reward.amount) {
          actions.addXP(reward.amount);
          this.showNotification(`+${reward.amount} XP`, reward.description, 'success');
        }
        break;
        
      case 'gold':
        if (reward.amount) {
          actions.addGold(reward.amount);
          this.showNotification(`+${reward.amount} or`, reward.description, 'success');
        }
        break;
        
      case 'item':
        if (reward.itemId) {
          // Pour le MVP, on log juste l'ajout d'objet
          console.log(`Objet ajouté: ${reward.itemId}`);
          this.showNotification(`Objet reçu`, reward.description, 'success');
        }
        break;
        
      case 'flag':
        if (reward.flagName && reward.flagValue !== undefined) {
          actions.setFlag(reward.flagName, reward.flagValue);
          if (reward.showPopup) {
            this.showNotification('Effet appliqué', reward.description, 'info');
          }
        }
        break;
        
      case 'companion':
        if (reward.companionId) {
          // Pour le MVP, pas encore implémenté
          console.log(`Compagnon ajouté: ${reward.companionId}`);
          this.showNotification('Nouveau compagnon', reward.description, 'success');
        }
        break;
        
      case 'relationship':
        if (reward.relationshipChange) {
          // Pour le MVP, pas encore implémenté
          console.log(`Relation modifiée: ${reward.relationshipChange}`);
        }
        break;
        
      default:
        console.warn(`Type de récompense non supporté: ${reward.type}`);
    }
  }
  
  private static showNotification(title: string, description: string, type: 'success' | 'info' | 'warning' | 'error'): void {
    // Pour le MVP, on utilise console.log
    // Plus tard, on pourrait utiliser un vrai système de notifications
    const emoji = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${emoji} ${title}: ${description}`);
    
    // TODO: Intégrer avec un vrai système de notifications UI
    // actions.addNotification(title, description, type);
  }
}