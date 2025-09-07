import type { Character } from '../../core/types/character';

interface CharacterPreviewProps {
  character: Character;
  onConfirm: () => void;
}

export const CharacterPreview = ({ character, onConfirm }: CharacterPreviewProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{character.name}</h3>
          <p className="text-gray-400 mb-4">
            {character.class} niveau {character.level}
          </p>
          
          {/* Caractéristiques */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.entries(character.finalStats)
              .filter(([ability]) => ability !== 'modifiers')
              .map(([ability, score]) => {
                const numericScore = typeof score === 'number' ? score : 10; // Fallback pour le MVP
                return (
                  <div key={ability} className="text-center">
                    <div className="text-xs text-gray-500 uppercase">{ability.slice(0, 3)}</div>
                    <div className="text-xl font-bold">{numericScore}</div>
                    <div className="text-sm text-gray-400">
                      {numericScore >= 10 ? '+' : ''}{Math.floor((numericScore - 10) / 2)}
                    </div>
                  </div>
                );
              })}
          </div>
          
          {/* Stats de combat */}
          <div className="text-sm text-gray-400">
            <p><span className="text-gray-500">HP:</span> {character.combatStats.maxHitPoints}</p>
            <p><span className="text-gray-500">AC:</span> {character.combatStats.armorClass}</p>
            <p><span className="text-gray-500">Initiative:</span> +{character.combatStats.initiative}</p>
          </div>
        </div>
        
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-semibold transition-colors"
        >
          Choisir ce Héros
        </button>
      </div>
    </div>
  );
};