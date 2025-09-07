import { useGameStore } from '../stores/gameStore';
import { SceneDisplay } from './SceneDisplay';
import { CombatScreen } from './Combat/CombatScreen';
import { CharacterHUD } from './HUD/CharacterHUD';
import { SceneType } from '../core/types/scenes';

export const GameScreen = () => {
  const currentScene = useGameStore(state => state.game.currentScene);
  
  // Check if current scene is a combat scene
  const isCombatScene = currentScene?.type === SceneType.COMBAT;
  
  return (
    <div className="h-screen flex flex-col">
      {/* Zone principale */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isCombatScene ? (
          <CombatScreen scene={currentScene} />
        ) : (
          <SceneDisplay scene={currentScene} />
        )}
      </div>
      
      {/* HUD du bas */}
      <div className="h-32 bg-slate-900 border-t border-gray-700 p-4">
        <CharacterHUD />
      </div>
    </div>
  );
};