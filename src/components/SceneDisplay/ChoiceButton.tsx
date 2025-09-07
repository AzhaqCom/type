import { useMemo } from 'react';
import type { Choice } from '../../core/types/scenes';
import { useActiveCharacter } from '../../stores/gameStore';

interface ChoiceButtonProps {
  choice: Choice;
  onSelect: () => void;
}

export const ChoiceButton = ({ choice, onSelect }: ChoiceButtonProps) => {
  const character = useActiveCharacter();
  
  // Vérifier si le choix peut être fait
  const canChoose = useMemo(() => {
    if (!choice.requirements || !character) return true;
    
    return choice.requirements.every(req => {
      switch (req.type) {
        case 'level':
          return character.level >= req.value;
          
        case 'class':
          return req.value.includes(character.class);
          
        case 'ability':
          const abilityScore = character.finalStats[req.value as keyof typeof character.finalStats];
          const comparison = req.comparison || 'greater';
          const targetValue = typeof req.value === 'number' ? req.value : 10;
          
          if (typeof abilityScore !== 'number') return false;
          if (comparison === 'greater') return abilityScore >= targetValue;
          if (comparison === 'less') return abilityScore <= targetValue;
          if (comparison === 'equal') return abilityScore === targetValue;
          return true;
          
        case 'skill':
          // Pour le MVP, on considère qu'on peut faire le skill check
          return true;
          
        case 'item':
          // Pour le MVP, on skip la vérification d'items
          return true;
          
        case 'quest':
        case 'companion':
        case 'flag':
          // Pour le MVP, pas encore implémenté
          return true;
          
        default:
          return true;
      }
    });
  }, [choice, character]);
  
  const getChoiceStyle = () => {
    if (!canChoose) {
      return 'bg-slate-800 opacity-50 cursor-not-allowed border-gray-600';
    }
    
    // Style par défaut
    let baseStyle = 'bg-slate-700 hover:bg-slate-600 cursor-pointer border-gray-500 transition-all duration-200';
    
    // Style spécial pour les skill checks
    if (choice.skillCheck) {
      baseStyle += ' ring-1 ring-yellow-500/30 hover:ring-yellow-400/50';
    }
    
    return baseStyle;
  };
  
  const getChoiceIcon = () => {
    if (choice.skillCheck) {
      return '🎲'; // Dé pour les skill checks
    }
    
    if (choice.cost?.gold || choice.cost?.items) {
      return '💰'; // Argent pour les achats
    }
    
    return '▶️'; // Flèche par défaut
  };
  
  return (
    <button
      onClick={canChoose ? onSelect : undefined}
      disabled={!canChoose}
      className={`
        w-full text-left p-4 rounded-lg border-2 
        ${getChoiceStyle()}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icône du choix */}
        <span className="text-xl mt-1 flex-shrink-0">
          {getChoiceIcon()}
        </span>
        
        {/* Contenu du choix */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg font-medium">{choice.text}</span>
            
            {/* Indicateurs spéciaux */}
            <div className="flex gap-2 text-sm">
              {choice.skillCheck && (
                <span className="text-yellow-400 px-2 py-1 bg-yellow-900/30 rounded">
                  Jet de {choice.skillCheck.skill || choice.skillCheck.ability}
                </span>
              )}
              
              {choice.cost?.gold && (
                <span className="text-yellow-300 px-2 py-1 bg-yellow-900/20 rounded">
                  {choice.cost.gold} or
                </span>
              )}
            </div>
          </div>
          
          {/* Prérequis non remplis */}
          {!canChoose && choice.requirements && (
            <div className="text-sm text-red-400 mt-2">
              <span className="font-medium">Prérequis non remplis:</span>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {choice.requirements.map((req, index) => (
                  <li key={index}>
                    {getRequirementText(req)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Récompenses potentielles */}
          {choice.rewards && choice.rewards.length > 0 && (
            <div className="text-sm text-green-400 mt-2 flex gap-2">
              {choice.rewards.map((reward, index) => (
                <span key={index} className="px-2 py-1 bg-green-900/20 rounded">
                  {getRewardText(reward)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

// Fonctions utilitaires pour affichage
function getRequirementText(req: any): string {
  switch (req.type) {
    case 'level':
      return `Niveau ${req.value} requis`;
    case 'class':
      return `Classes autorisées: ${req.value.join(', ')}`;
    case 'ability':
      const value = typeof req.value === 'number' ? req.value : 10;
      return `${req.value.toString().toUpperCase()} ${value}+ requis`;
    case 'skill':
      return `Compétence ${req.value} requise`;
    case 'item':
      return `Objet requis: ${req.value}`;
    default:
      return `Prérequis: ${req.type}`;
  }
}

function getRewardText(reward: any): string {
  switch (reward.type) {
    case 'xp':
      return `+${reward.amount} XP`;
    case 'gold':
      return `+${reward.amount} or`;
    case 'item':
      return `Objet: ${reward.itemId}`;
    case 'flag':
      return `Effet: ${reward.description}`;
    default:
      return reward.description || 'Récompense';
  }
}