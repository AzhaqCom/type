import type { Character } from '../../core/types/character';

interface CharacterSheetProps {
  character: Character;
  onClose: () => void;
}

const StatBlock = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-slate-700 rounded p-2">
    <div className="text-xs text-gray-400">{label}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

export const CharacterSheet = ({ character, onClose }: CharacterSheetProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <p className="text-gray-400">
              {character.class} niveau {character.level}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ✕
          </button>
        </div>
        
        {/* Caractéristiques */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(character.finalStats)
            .filter(([ability]) => ability !== 'modifiers')
            .map(([ability, score]) => {
              const numericScore = typeof score === 'number' ? score : 10; // Fallback pour le MVP
              return (
                <div key={ability} className="text-center p-3 bg-slate-700 rounded">
                  <div className="text-xs text-gray-400 uppercase">{ability}</div>
                  <div className="text-2xl font-bold">{numericScore}</div>
                  <div className="text-sm">
                    {numericScore >= 10 ? '+' : ''}{Math.floor((numericScore - 10) / 2)}
                  </div>
                </div>
              );
            })}
        </div>
        
        {/* Combat Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBlock label="Points de Vie" value={`${character.combatStats.currentHitPoints}/${character.combatStats.maxHitPoints}`} />
          <StatBlock label="Classe d'Armure" value={character.combatStats.armorClass} />
          <StatBlock label="Initiative" value={`+${character.combatStats.initiative}`} />
          <StatBlock label="Vitesse" value={`${character.combatStats.speed} ft`} />
        </div>
        
        {/* Compétences */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Compétences</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(character.skills).map(([skill, skillData]) => {
              const bonus = typeof skillData === 'object' ? skillData.bonus : 0;
              return (
                <div key={skill} className="flex justify-between text-sm bg-slate-700 rounded px-2 py-1">
                  <span className="capitalize">{skill.replace('_', ' ')}</span>
                  <span className="font-mono">{bonus >= 0 ? '+' : ''}{bonus}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Informations */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Informations</h3>
          <p className="text-gray-400">Aventurier niveau {character.level}</p>
        </div>
      </div>
    </div>
  );
};