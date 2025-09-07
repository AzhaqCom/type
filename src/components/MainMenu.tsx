import { useGameStore } from '../stores/gameStore';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
}

export const MainMenu = ({ onNewGame, onContinue }: MainMenuProps) => {
  const activeCharacter = useGameStore(state => state.character.activeCharacter);
  const currentScene = useGameStore(state => state.game.currentScene);
  const hasSaveGame = activeCharacter && currentScene;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold mb-2">D&D New Odyssey</h1>
      <p className="text-xl text-gray-400 mb-8">Une aventure vous attend...</p>
      
      <div className="flex flex-col gap-4">
        {hasSaveGame && (
          <button 
            onClick={onContinue}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-xl font-semibold transition-colors"
          >
            🎮 Continuer la Partie
          </button>
        )}
        
        <button 
          onClick={onNewGame}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-xl font-semibold transition-colors"
        >
          ✨ Nouvelle Partie
        </button>
      </div>
      
      {hasSaveGame && (
        <p className="text-sm text-gray-500 mt-4">
          Sauvegarde: {activeCharacter?.name} niveau {activeCharacter?.level}
        </p>
      )}
    </div>
  );
};