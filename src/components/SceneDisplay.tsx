import { useEffect } from 'react';
import type { Scene } from '../core/types/scenes';
import { isNarrativeScene, isCombatScene } from '../core/types/scenes';
import { useGameActions } from '../stores/gameStore';
import { ChoiceButton } from './SceneDisplay/ChoiceButton';
import { CombatInitiator } from './Combat/CombatInitiator';
import { SceneManager } from '../systems/scenes/sceneManager';
import { RewardProcessor } from '../systems/scenes/rewardProcessor';
import { SkillCheckResolver } from '../systems/scenes/skillCheckResolver';

interface SceneDisplayProps {
  scene: Scene | null;
}

export const SceneDisplay = ({ scene }: SceneDisplayProps) => {
  const { transitionToScene } = useGameActions();
  
  useEffect(() => {
    if (!scene) {
      // Charger la première scène du tutorial
      transitionToScene('scene_intro');
    }
  }, [scene, transitionToScene]);
  
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Chargement...</h2>
          <p className="text-gray-400">Initialisation de l'aventure...</p>
        </div>
      </div>
    );
  }
  
  // Combat Scene : déléguer au système de combat
  if (isCombatScene(scene)) {
    return <CombatInitiator scene={scene} />;
  }
  
  // Scène non-narrative non supportée pour le MVP
  if (!isNarrativeScene(scene)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-400">
          <h2 className="text-2xl font-bold mb-4">Type de scène non supporté</h2>
          <p>Type: {scene.type}</p>
        </div>
      </div>
    );
  }
  
  const handleChoice = async (choiceId: string) => {
    if (!isNarrativeScene(scene)) return;
    
    try {
      console.log('🎯 Traitement du choix:', choiceId);
      
      const choice = scene.choices.find(c => c.id === choiceId);
      if (!choice) {
        console.error('Choix non trouvé:', choiceId);
        return;
      }
      
      // Si c'est un skill check, le résoudre d'abord
      if (choice.skillCheck) {
        console.log('🎲 Résolution du skill check...');
        const skillResult = await SkillCheckResolver.resolve(choice.skillCheck);
        
        // Déterminer les conséquences selon le résultat
        const consequences = skillResult.success ? 
          choice.skillCheck.consequences.success :
          choice.skillCheck.consequences.failure;
          
        if (consequences.length === 0) {
          console.error('Pas de conséquences définies pour ce résultat');
          return;
        }
        
        const consequence = consequences[0];
        
        // Appliquer les récompenses si succès
        if (skillResult.success && choice.rewards) {
          await RewardProcessor.applyRewards(choice.rewards);
        }
        
        // Transition vers la prochaine scène
        if (consequence.targetScene) {
          transitionToScene(consequence.targetScene);
        }
        
      } else {
        // Choix simple sans skill check
        const result = await SceneManager.processChoice(scene, choiceId);
        
        // Appliquer les récompenses
        if (result.rewards.length > 0) {
          await RewardProcessor.applyRewards(result.rewards);
        }
        
        // Transition vers la prochaine scène
        transitionToScene(result.nextSceneId);
      }
      
    } catch (error) {
      console.error('Erreur lors du traitement du choix:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Titre de la scène */}
      <h2 className="text-3xl font-bold mb-6 text-center text-amber-400">
        {scene.title}
      </h2>
      
      {/* Description narrative */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {scene.description}
        </p>
      </div>
      
      {/* Choix disponibles */}
      {scene.choices && scene.choices.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Que faites-vous ?
          </h3>
          
          {scene.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              onSelect={() => handleChoice(choice.id)}
            />
          ))}
        </div>
      )}
      
      {/* Debug info (MVP only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-900 rounded text-xs text-gray-500">
          <strong>Debug MVP:</strong> Scene ID: {scene.id}, Type: {scene.type}
        </div>
      )}
    </div>
  );
};