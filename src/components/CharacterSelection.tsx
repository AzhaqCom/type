import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getAllPregeneratedCharacters } from '../data/pregenerated/pregeneratedCharacters';
import { CharacterCard } from './CharacterSelection/CharacterCard';
import { CharacterPreview } from './CharacterSelection/CharacterPreview';

interface CharacterSelectionProps {
  onCharacterSelected: () => void;
}

export const CharacterSelection = ({ onCharacterSelected }: CharacterSelectionProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const actions = useGameStore(state => state.actions);
  const characters = getAllPregeneratedCharacters();
  
  const handleConfirm = () => {
    if (selectedIndex !== null) {
      const character = characters[selectedIndex];
      actions.setActiveCharacter(character);
      onCharacterSelected();
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold text-center mb-8">
        Choisissez votre Héros
      </h2>
      
      {/* Grille 4x3 de personnages */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {characters.map((char, index) => (
          <CharacterCard
            key={char.id}
            character={char}
            isSelected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>
      
      {/* Détails du personnage sélectionné */}
      {selectedIndex !== null && (
        <CharacterPreview 
          character={characters[selectedIndex]} 
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};