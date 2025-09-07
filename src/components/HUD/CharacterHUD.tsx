import { useActiveCharacter } from '../../stores/gameStore';
import { SpellSlotIndicator } from './SpellSlotIndicator';

export const CharacterHUD = () => {
  const character = useActiveCharacter();
  
  if (!character) return null;
  
  const hpPercent = (character.combatStats.currentHitPoints / character.combatStats.maxHitPoints) * 100;
  
  return (
    <div className="flex items-center justify-between h-full">
      {/* Info personnage */}
      <div className="flex items-center gap-4">
        <div>
          <p className="font-bold">{character.name}</p>
          <p className="text-sm text-gray-400">
            {character.class} Niveau {character.level}
          </p>
        </div>
      </div>
      
      {/* Barres de stats */}
      <div className="flex-1 mx-8">
        {/* Barre de vie */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>PV</span>
            <span>{character.combatStats.currentHitPoints}/{character.combatStats.maxHitPoints}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
        
        {/* Spell Slots si caster */}
        {character.spellcasting && (
          <SpellSlotIndicator slots={character.spellcasting.currentSlots} />
        )}
      </div>
      
      {/* Actions rapides */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
          Inventaire
        </button>
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
          Repos
        </button>
      </div>
    </div>
  );
};