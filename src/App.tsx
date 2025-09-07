import { useState, useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { CharacterSelection } from './components/CharacterSelection';
import { GameScreen } from './components/GameScreen';
import { MainMenu } from './components/MainMenu';
import { getAllPregeneratedCharacters } from './data/pregenerated/pregeneratedCharacters';

// Mode DEV : skip menus et preload character
const DEV_MODE = true; // ← Changez ça pour activer/désactiver

function App() {
  const activeCharacter = useGameStore(state => state.character.activeCharacter);
  const currentScene = useGameStore(state => state.game.currentScene);
  const { resetGame, setActiveCharacter, transitionToScene } = useGameStore(state => state.actions);
  const [gameState, setGameState] = useState<'menu' | 'character-select' | 'playing'>('menu');
  const [devInitialized, setDevInitialized] = useState(false);
  
  // MODE DEV : Preload Aldric + reset scène à chaque refresh (UNE SEULE FOIS)
  useEffect(() => {
    if (DEV_MODE && !devInitialized) {
      console.log('🔧 DEV MODE: Auto-setup Aldric le Sage');
      
      // Reset tout (pas de persistence en dev)
      resetGame();
      
      // Preload Aldric depuis les données statiques
      const characters = getAllPregeneratedCharacters();
      const aldric = characters.find(char => char.name === 'Aldric le Sage');
      if (aldric) {
        setActiveCharacter(aldric);
        console.log('👤 DEV: Aldric préchargé');
      } else {
        console.warn('⚠️ DEV: Aldric non trouvé, utilisation du premier personnage');
        if (characters[0]) {
          setActiveCharacter(characters[0]);
        }
      }
      
      // Force scene_intro (pas de persistence)
      setTimeout(() => {
        transitionToScene('scene_intro');
        setGameState('playing');
        console.log('🎬 DEV: Scene intro forcée');
      }, 100);
      
      // Marquer comme initialisé pour éviter la boucle
      setDevInitialized(true);
    }
  }, []); // Pas de dépendances - s'exécute UNE SEULE FOIS au mount
  
  // LOGIQUE NORMALE : Auto-navigation si on a une sauvegarde (seulement si pas dev mode)
  useEffect(() => {
    if (!DEV_MODE) {
      if (activeCharacter && currentScene) {
        console.log('🎮 Sauvegarde détectée - Passage direct au jeu');
        setGameState('playing');
      } else if (activeCharacter && !currentScene) {
        console.log('👤 Personnage détecté - Chargement de la première scène');
        setGameState('playing');
      }
    }
  }, [activeCharacter, currentScene]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Indicateur DEV MODE */}
      {DEV_MODE && (
        <div className="fixed top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold z-50">
          🔧 DEV MODE
        </div>
      )}
      {gameState === 'menu' && (
        <MainMenu 
          onNewGame={() => {
            resetGame(); // Reset la sauvegarde
            setGameState('character-select');
          }} 
          onContinue={() => setGameState('playing')}
        />
      )}
      
      {gameState === 'character-select' && (
        <CharacterSelection onCharacterSelected={() => setGameState('playing')} />
      )}
      
      {gameState === 'playing' && activeCharacter && (
        <GameScreen />
      )}
    </div>
  );
}

export default App;