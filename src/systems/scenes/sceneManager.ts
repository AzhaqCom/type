import type { Scene, SceneId, NarrativeScene } from '../../core/types/scenes';
import { TUTORIAL_SCENES } from '../../data/scenes/tutorialScenes';

export interface SceneTransitionResult {
  nextSceneId: SceneId;
  rewards: any[];
  effects: any[];
}

export class SceneManager {
  private static scenes = new Map<SceneId, Scene>();
  
  static {
    // Charger toutes les scènes au démarrage
    TUTORIAL_SCENES.forEach(scene => {
      this.scenes.set(scene.id, scene);
    });
  }
  
  static async loadScene(sceneId: SceneId): Promise<Scene> {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new Error(`Scene not found: ${sceneId}`);
    }
    return scene;
  }
  
  static async processChoice(
    scene: NarrativeScene, 
    choiceId: string
  ): Promise<SceneTransitionResult> {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice not found: ${choiceId}`);
    }
    
    // Si c'est un skill check, on le traite séparément (sera implémenté plus tard)
    if (choice.skillCheck) {
      return this.processSkillCheck(choice);
    }
    
    // Pour le MVP, pas de skill checks complexes
    // On prend juste la première conséquence
    const consequence = choice.consequences[0];
    if (!consequence) {
      throw new Error(`No consequences defined for choice: ${choiceId}`);
    }
    
    // Appliquer les récompenses
    const rewards = choice.rewards || [];
    
    return {
      nextSceneId: consequence.targetScene!,
      rewards,
      effects: consequence.effects || []
    };
  }
  
  private static async processSkillCheck(choice: any): Promise<SceneTransitionResult> {
    // Pour le MVP, on simule toujours une réussite
    // La vraie logique de skill check sera implémentée plus tard
    const skillCheck = choice.skillCheck;
    const consequences = skillCheck.consequences.success;
    
    if (!consequences || consequences.length === 0) {
      throw new Error('No success consequences for skill check');
    }
    
    const consequence = consequences[0];
    const rewards = choice.rewards || [];
    
    return {
      nextSceneId: consequence.targetScene!,
      rewards,
      effects: consequence.effects || []
    };
  }
  
  static getAllScenes(): Scene[] {
    return Array.from(this.scenes.values());
  }
  
  static getSceneById(sceneId: SceneId): Scene | undefined {
    return this.scenes.get(sceneId);
  }
}