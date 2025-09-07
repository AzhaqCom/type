import type { CombatScene } from '../../core/types/scenes';

interface CombatInitiatorProps {
  scene: CombatScene;
}

export const CombatInitiator = ({ scene }: CombatInitiatorProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-400">
        {scene.title}
      </h2>
      
      <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
        <p className="text-lg leading-relaxed whitespace-pre-wrap mb-4">
          {scene.description}
        </p>
        
        <div className="text-center">
          <p className="text-yellow-400 mb-4">
            ⚔️ Combat à venir ! ⚔️
          </p>
          <p className="text-gray-400 text-sm">
            Le système de combat sera implémenté en Semaines 4-5
          </p>
          
          {/* Debug info pour le MVP */}
          <div className="mt-4 p-3 bg-gray-900 rounded text-xs text-gray-500">
            <strong>Ennemis prévus:</strong>
            <ul className="mt-2 space-y-1">
              {scene.enemies.map((enemyGroup, index) => (
                <li key={index}>
                  {enemyGroup.count}x {enemyGroup.templateId}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bouton temporaire pour continuer */}
      <div className="text-center">
        <button 
          onClick={() => {
            // Pour le MVP, on simule une victoire
            console.log('Combat simulé - victoire !');
            // TODO: Implémenter vraie logique de combat plus tard
          }}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-colors"
        >
          🏆 Simuler Victoire (MVP)
        </button>
      </div>
    </div>
  );
};