import type { Character } from '../../core/types/character';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}

export const CharacterCard = ({ character, isSelected, onClick }: CharacterCardProps) => {
  const classColors: Record<string, string> = {
    wizard: 'border-purple-500',
    fighter: 'border-red-500',
    rogue: 'border-gray-500',
    cleric: 'border-yellow-500',
    barbarian: 'border-orange-500',
    bard: 'border-pink-500',
    druid: 'border-green-500',
    monk: 'border-blue-500',
    paladin: 'border-amber-500',
    ranger: 'border-emerald-500',
    sorcerer: 'border-violet-500',
    warlock: 'border-indigo-500'
  };
  
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        ${isSelected ? classColors[character.class] || 'border-gray-400' : 'border-gray-600'}
        ${isSelected ? 'bg-slate-700' : 'bg-slate-800'}
        hover:bg-slate-700
      `}
    >
      <div className="text-center">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-600" />
        
        <h3 className="font-bold">{character.name}</h3>
        <p className="text-sm text-gray-400 capitalize">{character.class}</p>
        <p className="text-xs text-gray-500">Niveau {character.level}</p>
        
        {/* Stats rapides */}
        <div className="flex justify-around mt-2 text-xs">
          <span>HP: {character.combatStats.maxHitPoints}</span>
          <span>AC: {character.combatStats.armorClass}</span>
        </div>
      </div>
    </div>
  );
};