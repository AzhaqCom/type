import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { SimpleCombatEngine } from '../../systems/combat/SimpleCombatEngine';
import { EnemyFactory } from '../../data/enemies';
import { HealthBar } from './HealthBar';
import type { CombatScene } from '../../core/types/scenes';
import type { CombatEntity } from '../../core/types/combat';

interface CombatScreenProps {
  scene?: CombatScene;
}

export const CombatScreen = ({ scene }: CombatScreenProps) => {
  const character = useGameStore(state => state.character.activeCharacter);
  const { transitionToScene } = useGameStore(state => state.actions);
  const [combatEngine, setCombatEngine] = useState<SimpleCombatEngine | null>(null);
  const [combatState, setCombatState] = useState<any>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  
  // Initialize combat
  useEffect(() => {
    if (!character) return;
    
    // Create enemies from scene or use default
    let enemies: CombatEntity[] = [];
    if (scene?.enemies) {
      scene.enemies.forEach(enemyGroup => {
        const created = EnemyFactory.createMultiple(enemyGroup.templateId, enemyGroup.count);
        enemies.push(...created);
      });
    } else {
      // Default test enemies
      enemies = EnemyFactory.createMultiple('bandit', 2);
    }
    
    const engine = new SimpleCombatEngine(character, enemies);
    setCombatEngine(engine);
    setCombatState(engine.getCombatState());
  }, [character, scene]);
  
  // Handle player attack
  const handleAttack = () => {
    if (!combatEngine || !combatState.isPlayerTurn || combatState.combatOver) return;
    
    const enemies = combatEngine.getAliveEnemies();
    if (enemies.length === 0) return;
    
    // Attack first enemy or selected target
    const target = selectedTarget 
      ? enemies.find(e => e.name === selectedTarget) || enemies[0]
      : enemies[0];
    
    const player = combatEngine.getPlayerCharacter();
    if (player && target) {
      combatEngine.performAttack(player, target);
      combatEngine.nextTurn();
      setCombatState(combatEngine.getCombatState());
      
      // Process enemy turns
      setTimeout(() => processEnemyTurns(), 1000);
    }
  };
  
  // Process enemy turns automatically
  const processEnemyTurns = () => {
    if (!combatEngine) return;
    
    let state = combatEngine.getCombatState();
    
    const processNextEnemy = () => {
      if (!combatEngine.isEnemyTurn() || state.combatOver) {
        setCombatState(combatEngine.getCombatState());
        return;
      }
      
      const currentEnemy = combatEngine.getCurrentTurn() as CombatEntity;
      if (currentEnemy) {
        combatEngine.processEnemyTurn(currentEnemy);
        combatEngine.nextTurn();
        state = combatEngine.getCombatState();
        setCombatState(state);
        
        // Continue with next enemy after delay
        if (combatEngine.isEnemyTurn() && !state.combatOver) {
          setTimeout(processNextEnemy, 1500);
        }
      }
    };
    
    processNextEnemy();
  };
  
  // Handle combat end
  const handleCombatEnd = () => {
    if (combatState.result === 'victory') {
      // Return to narrative or next scene
      if (scene?.victoryScene) {
        transitionToScene(scene.victoryScene);
      } else {
        // Default: return to last narrative scene
        console.log('Combat victory! Returning to exploration...');
      }
    } else {
      // Handle defeat
      console.log('Combat defeat! Game over...');
    }
  };
  
  if (!combatState || !character) {
    return <div>Loading combat...</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-red-400 text-center mb-6">
        ⚔️ COMBAT ⚔️
      </h2>
      
      {/* Combat Arena */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Player Side */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-green-400">Heroes</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded border-2 ${
              combatState.isPlayerTurn ? 'border-yellow-400 bg-slate-700' : 'border-slate-600'
            }`}>
              <div className="font-bold mb-2">{character.name}</div>
              <HealthBar 
                current={character.combatStats.currentHitPoints} 
                max={character.combatStats.maxHitPoints}
                color="green"
              />
              <div className="text-sm text-gray-400 mt-2">
                AC: {10 + Math.floor((character.finalStats.dexterity - 10) / 2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Enemy Side */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-red-400">Enemies</h3>
          <div className="space-y-4">
            {combatState.combatants
              .filter((c: any) => !c.isPlayer)
              .map((enemy: any, index: number) => (
                <div 
                  key={index}
                  className={`p-4 rounded border-2 cursor-pointer transition-all ${
                    enemy.isCurrent ? 'border-yellow-400 bg-slate-700' : 
                    selectedTarget === enemy.name ? 'border-blue-400' :
                    !enemy.isAlive ? 'border-gray-600 opacity-50' :
                    'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => enemy.isAlive && setSelectedTarget(enemy.name)}
                >
                  <div className="font-bold mb-2">
                    {enemy.name}
                    {!enemy.isAlive && ' (Defeated)'}
                  </div>
                  <HealthBar 
                    current={enemy.currentHP} 
                    max={enemy.maxHP}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Action Panel */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        {combatState.combatOver ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {combatState.result === 'victory' ? (
                <span className="text-green-400">Victory!</span>
              ) : (
                <span className="text-red-400">Defeat...</span>
              )}
            </h3>
            <button
              onClick={handleCombatEnd}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <span className="text-lg font-semibold">
                {combatState.isPlayerTurn ? (
                  <span className="text-green-400">Your Turn!</span>
                ) : (
                  <span className="text-yellow-400">{combatState.currentTurn}'s Turn</span>
                )}
              </span>
            </div>
            
            {combatState.isPlayerTurn && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleAttack}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition-colors"
                  disabled={!selectedTarget || combatEngine?.getAliveEnemies().length === 0}
                >
                  ⚔️ Attack {selectedTarget || 'Select Target'}
                </button>
                <button
                  className="px-6 py-3 bg-gray-600 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                  disabled
                >
                  🛡️ Defend (Coming Soon)
                </button>
                <button
                  className="px-6 py-3 bg-gray-600 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                  disabled
                >
                  ✨ Cast Spell (Coming Soon)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Combat Log */}
      <div className="bg-slate-900 rounded-lg p-4 max-h-48 overflow-y-auto">
        <h4 className="font-bold mb-2 text-gray-400">Combat Log</h4>
        <div className="space-y-1 text-sm text-gray-300">
          {combatState.log.map((entry: string, index: number) => (
            <div key={index} className="font-mono">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};