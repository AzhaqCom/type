# 🚀 MVP Version 0.5 - Plan d'Exécution Détaillé

## 📋 Objectif Global
**Créer un jeu D&D jouable minimal en 6-8 semaines**
- Boucle de gameplay complète
- Interface fonctionnelle
- Combat basique
- Progression simple
- **Cible : 30-45 minutes de gameplay**

## 📊 Principes du MVP
1. **Réutiliser l'existant** : Exploiter les systèmes déjà codés
2. **Simplicité avant tout** : Pas de features complexes
3. **Hardcoding accepté** : On optimisera plus tard
4. **Gameplay > Esthétique** : Fonctionnel d'abord, joli après
5. **Itération rapide** : Tester souvent, ajuster vite

---

## 📅 SEMAINE 1-2 : Interface Basique
*Objectif : Voir et interagir avec les données existantes*

### Jour 1-2 : Setup et Navigation

#### Tâche 1.1 : Restructurer App.tsx
```typescript
// src/App.tsx
import { useState } from 'react';
import { useGameStore } from './stores/gameStore';
import { CharacterSelection } from './components/CharacterSelection';
import { GameScreen } from './components/GameScreen';
import { MainMenu } from './components/MainMenu';

function App() {
  const { activeCharacter } = useGameStore();
  const [gameState, setGameState] = useState<'menu' | 'character-select' | 'playing'>('menu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {gameState === 'menu' && (
        <MainMenu onNewGame={() => setGameState('character-select')} />
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
```

#### Tâche 1.2 : Créer MainMenu.tsx
```typescript
// src/components/MainMenu.tsx
export const MainMenu = ({ onNewGame }: { onNewGame: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold mb-2">D&D New Odyssey</h1>
      <p className="text-xl text-gray-400 mb-8">Une aventure vous attend...</p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={onNewGame}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-xl font-semibold transition-colors"
        >
          Nouvelle Partie
        </button>
        
        <button 
          disabled
          className="px-8 py-3 bg-gray-700 opacity-50 rounded-lg text-xl"
        >
          Continuer (Bientôt)
        </button>
      </div>
    </div>
  );
};
```

### Jour 3-4 : Sélection de Personnage

#### Tâche 1.3 : Créer CharacterSelection.tsx
```typescript
// src/components/CharacterSelection.tsx
import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getAllPregeneratedCharacters } from '../data/pregenerated/pregeneratedCharacters';

export const CharacterSelection = ({ onCharacterSelected }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { actions } = useGameStore();
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
```

#### Tâche 1.4 : Créer CharacterCard.tsx
```typescript
// src/components/CharacterSelection/CharacterCard.tsx
interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}

export const CharacterCard = ({ character, isSelected, onClick }: CharacterCardProps) => {
  const classColors = {
    wizard: 'border-purple-500',
    fighter: 'border-red-500',
    rogue: 'border-gray-500',
    cleric: 'border-yellow-500',
    // ... autres classes
  };
  
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all
        ${isSelected ? classColors[character.class] : 'border-gray-600'}
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
```

### Jour 5-6 : Interface de Jeu Principale

#### Tâche 1.5 : Créer GameScreen.tsx
```typescript
// src/components/GameScreen.tsx
import { useGameStore } from '../stores/gameStore';
import { SceneDisplay } from './SceneDisplay';
import { CombatScreen } from './Combat/CombatScreen';
import { CharacterHUD } from './HUD/CharacterHUD';
import { ActionPanel } from './ActionPanel';

export const GameScreen = () => {
  const { combat, game } = useGameStore();
  
  return (
    <div className="h-screen flex flex-col">
      {/* Zone principale */}
      <div className="flex-1 p-4">
        {combat.inCombat ? (
          <CombatScreen />
        ) : (
          <SceneDisplay scene={game.currentScene} />
        )}
      </div>
      
      {/* HUD du bas */}
      <div className="h-32 bg-slate-900 border-t border-gray-700 p-4">
        <CharacterHUD />
      </div>
    </div>
  );
};
```

#### Tâche 1.6 : Créer CharacterHUD.tsx
```typescript
// src/components/HUD/CharacterHUD.tsx
export const CharacterHUD = () => {
  const character = useActiveCharacter();
  
  if (!character) return null;
  
  const hpPercent = (character.combatStats.currentHitPoints / character.combatStats.maxHitPoints) * 100;
  
  return (
    <div className="flex items-center justify-between">
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
          <SpellSlotIndicator slots={character.spellcasting.slotsRemaining} />
        )}
      </div>
      
      {/* Actions rapides */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Inventaire
        </button>
        <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Repos
        </button>
      </div>
    </div>
  );
};
```

### Jour 7-8 : Modal Character Sheet Simple

#### Tâche 1.7 : Créer CharacterSheet.tsx
```typescript
// src/components/Modals/CharacterSheet.tsx
export const CharacterSheet = ({ character, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <p className="text-gray-400">
              {character.race} {character.class} niveau {character.level}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        
        {/* Caractéristiques */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(character.finalStats).map(([ability, score]) => (
            <div key={ability} className="text-center p-3 bg-slate-700 rounded">
              <div className="text-xs text-gray-400 uppercase">{ability}</div>
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm">
                {score >= 10 ? '+' : ''}{Math.floor((score - 10) / 2)}
              </div>
            </div>
          ))}
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
            {Object.entries(character.skills).map(([skill, bonus]) => (
              <div key={skill} className="flex justify-between text-sm">
                <span className="capitalize">{skill.replace('_', ' ')}</span>
                <span>{bonus >= 0 ? '+' : ''}{bonus}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Livrable Semaine 1-2
✅ Menu principal fonctionnel  
✅ Sélection de personnage avec aperçu  
✅ Interface de jeu avec HUD  
✅ Modal de feuille de personnage  
✅ Navigation entre écrans  

---

## 📅 SEMAINE 3 : Scènes Narratives Simples
*Objectif : Créer un flux narratif basique avec choix*

### Jour 1-2 : Système de Scènes

#### Tâche 2.1 : Créer les données de scènes
```typescript
// src/data/scenes/tutorialScenes.ts
import { NarrativeScene, SceneType } from '../../core/types/scenes';

export const SCENE_INTRO: NarrativeScene = {
  id: 'scene_intro',
  type: SceneType.NARRATIVE,
  title: 'Le Début de l\'Aventure',
  description: `Vous vous réveillez dans une taverne poussiéreuse. 
  La dernière chose dont vous vous souvenez est d'avoir accepté 
  une mystérieuse mission d'un étranger encapuchonné.
  
  Un parchemin est posé devant vous avec une carte grossièrement 
  dessinée menant à des ruines anciennes.`,
  
  choices: [
    {
      id: 'examine_map',
      text: 'Examiner la carte attentivement',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_map_details'
      }],
      rewards: [{
        type: 'xp',
        amount: 10,
        description: 'Observation minutieuse'
      }]
    },
    {
      id: 'ask_innkeeper',
      text: 'Interroger le tavernier',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_innkeeper_info'
      }]
    },
    {
      id: 'leave_immediately',
      text: 'Partir immédiatement vers les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_road_ambush'
      }]
    }
  ]
};

export const SCENE_MAP_DETAILS: NarrativeScene = {
  id: 'scene_map_details',
  type: SceneType.NARRATIVE,
  title: 'Étude de la Carte',
  description: `En examinant la carte, vous remarquez plusieurs détails :
  - Les ruines sont à une demi-journée de marche au nord
  - Un symbole d'avertissement marque un pont sur la route
  - Des annotations mentionnent des "gardiens de pierre"
  
  Armé de ces informations, vous devez décider de votre approche.`,
  
  choices: [
    {
      id: 'prepare_supplies',
      text: 'Acheter des provisions avant de partir',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_merchant'
      }]
    },
    {
      id: 'go_ruins',
      text: 'Se diriger vers les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_road_careful'
      }],
      rewards: [{
        type: 'flag',
        flagName: 'knows_about_guardians',
        flagValue: true,
        description: 'Averti des dangers'
      }]
    }
  ]
};

export const SCENE_ROAD_AMBUSH: NarrativeScene = {
  id: 'scene_road_ambush',
  type: SceneType.NARRATIVE,
  title: 'Embuscade !',
  description: `Votre hâte vous a rendu imprudent. 
  Sur la route, trois bandits surgissent des buissons !
  
  "Eh bien, eh bien... Un aventurier solitaire avec 
  une carte au trésor !" ricane leur chef.`,
  
  choices: [
    {
      id: 'fight_bandits',
      text: 'Combattre les bandits',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_combat_bandits'
      }]
    },
    {
      id: 'negotiate',
      text: 'Tenter de négocier',
      skillCheck: {
        ability: 'charisma',
        skill: 'persuasion',
        difficultyClass: 15,
        consequences: {
          success: [{
            type: 'scene_transition',
            targetScene: 'scene_bandits_allied'
          }],
          failure: [{
            type: 'scene_transition',
            targetScene: 'scene_combat_bandits'
          }]
        }
      }
    },
    {
      id: 'flee',
      text: 'Fuir dans la forêt',
      skillCheck: {
        ability: 'dexterity',
        skill: 'athletics',
        difficultyClass: 12,
        consequences: {
          success: [{
            type: 'scene_transition',
            targetScene: 'scene_forest_escape'
          }],
          failure: [{
            type: 'scene_transition',
            targetScene: 'scene_combat_disadvantage'
          }]
        }
      }
    }
  ]
};

// Scène de combat
export const SCENE_COMBAT_BANDITS: CombatScene = {
  id: 'scene_combat_bandits',
  type: SceneType.COMBAT,
  title: 'Combat contre les Bandits',
  description: 'Les bandits attaquent !',
  
  enemies: ['bandit_leader', 'bandit_1', 'bandit_2'],
  
  // Pour le MVP, pas de grille
  battleMap: {
    width: 8,
    height: 8,
    terrain: [], // Vide pour le MVP
    startingPositions: {
      player: [{ x: 1, y: 4 }],
      allies: [],
      enemies: [{ x: 6, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 5 }]
    }
  },
  
  victoryConditions: [{ type: 'eliminate_all' }],
  defeatConditions: [{ type: 'player_death' }],
  
  rewards: {
    experience: 150,
    gold: 50,
    items: []
  }
};

export const SCENE_VICTORY: NarrativeScene = {
  id: 'scene_victory',
  type: SceneType.NARRATIVE,
  title: 'Victoire !',
  description: `Les bandits sont vaincus ! 
  
  Vous trouvez sur eux :
  - 50 pièces d'or
  - Une potion de soin
  - Une note mentionnant qu'ils surveillaient les ruines pour quelqu'un...
  
  La route vers les ruines est maintenant libre.`,
  
  choices: [
    {
      id: 'continue_ruins',
      text: 'Continuer vers les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_ruins_entrance'
      }],
      rewards: [{
        type: 'xp',
        amount: 150,
        description: 'Combat remporté'
      }, {
        type: 'gold',
        amount: 50,
        description: 'Butin des bandits'
      }]
    },
    {
      id: 'return_town',
      text: 'Retourner en ville pour se reposer',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_town_rest'
      }]
    }
  ]
};

// Export toutes les scènes
export const TUTORIAL_SCENES = [
  SCENE_INTRO,
  SCENE_MAP_DETAILS,
  SCENE_ROAD_AMBUSH,
  SCENE_COMBAT_BANDITS,
  SCENE_VICTORY
];
```

### Jour 3-4 : Affichage des Scènes

#### Tâche 2.2 : Créer SceneDisplay.tsx
```typescript
// src/components/SceneDisplay.tsx
import { Scene, isNarrativeScene, isCombatScene } from '../core/types/scenes';
import { useGameActions } from '../stores/gameStore';

export const SceneDisplay = ({ scene }: { scene: Scene | null }) => {
  const { transitionToScene } = useGameActions();
  
  if (!scene) {
    // Charger la première scène
    useEffect(() => {
      transitionToScene('scene_intro');
    }, []);
    
    return <div>Chargement...</div>;
  }
  
  if (isCombatScene(scene)) {
    // Déléguer au système de combat
    return <CombatInitiator scene={scene} />;
  }
  
  if (!isNarrativeScene(scene)) {
    return <div>Type de scène non supporté</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Titre de la scène */}
      <h2 className="text-3xl font-bold mb-4">{scene.title}</h2>
      
      {/* Description */}
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <p className="text-lg whitespace-pre-wrap">
          {scene.description}
        </p>
      </div>
      
      {/* Choix disponibles */}
      <div className="space-y-3">
        {scene.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            onSelect={() => handleChoice(choice.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

#### Tâche 2.3 : Créer ChoiceButton.tsx
```typescript
// src/components/SceneDisplay/ChoiceButton.tsx
export const ChoiceButton = ({ choice, onSelect }: Props) => {
  const character = useActiveCharacter();
  const canChoose = useMemo(() => {
    // Vérifier les prérequis simples
    if (!choice.requirements) return true;
    
    return choice.requirements.every(req => {
      switch (req.type) {
        case 'level':
          return character.level >= req.value;
        case 'class':
          return req.value.includes(character.class);
        case 'item':
          // Pour le MVP, on skip la vérification d'items
          return true;
        default:
          return true;
      }
    });
  }, [choice, character]);
  
  return (
    <button
      onClick={onSelect}
      disabled={!canChoose}
      className={`
        w-full text-left p-4 rounded-lg transition-all
        ${canChoose 
          ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer' 
          : 'bg-slate-800 opacity-50 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg">{choice.text}</span>
        
        {/* Indicateurs spéciaux */}
        {choice.skillCheck && (
          <span className="text-sm text-yellow-400">
            [Jet de {choice.skillCheck.skill || choice.skillCheck.ability}]
          </span>
        )}
      </div>
      
      {/* Prérequis non remplis */}
      {!canChoose && (
        <p className="text-sm text-red-400 mt-1">
          Prérequis non remplis
        </p>
      )}
    </button>
  );
};
```

### Jour 5-6 : Système de Choix et Transitions

#### Tâche 2.4 : Implémenter la logique des choix
```typescript
// src/systems/scenes/sceneManager.ts
export class SceneManager {
  private static scenes = new Map<SceneId, Scene>();
  
  static {
    // Charger toutes les scènes au démarrage
    TUTORIAL_SCENES.forEach(scene => {
      this.scenes.set(scene.id, scene);
    });
  }
  
  static async loadScene(sceneId: SceneId): Promise<Scene> {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new Error(`Scene not found: ${sceneId}`);
    }
    return scene;
  }
  
  static async processChoice(
    scene: NarrativeScene, 
    choiceId: ChoiceId
  ): Promise<SceneTransitionResult> {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice not found: ${choiceId}`);
    }
    
    // Pour le MVP, pas de skill checks complexes
    // On prend juste la première conséquence
    const consequence = choice.consequences[0];
    
    // Appliquer les récompenses
    const rewards = choice.rewards || [];
    
    return {
      nextSceneId: consequence.targetScene,
      rewards,
      effects: consequence.effects || []
    };
  }
}
```

#### Tâche 2.5 : Connecter au store
```typescript
// Modifier gameStore.ts - transitionToScene
transitionToScene: async (sceneId: SceneId, choiceId?: ChoiceId) => {
  set((state) => {
    state.ui.loading = true;
  });
  
  try {
    // Charger la nouvelle scène
    const newScene = await SceneManager.loadScene(sceneId);
    
    // Ajouter à l'historique
    const historyEntry: SceneHistoryEntry = {
      sceneId,
      choiceId,
      timestamp: new Date(),
    };
    
    set((state) => {
      state.game.currentScene = newScene;
      state.game.sceneHistory.push(historyEntry);
      state.ui.loading = false;
    });
    
    // Si c'est une scène de combat, démarrer le combat
    if (isCombatScene(newScene)) {
      get().actions.startCombat(newScene);
    }
    
  } catch (error) {
    console.error('Erreur transition scène:', error);
    set((state) => {
      state.ui.loading = false;
    });
  }
}
```

### Livrable Semaine 3
✅ 5+ scènes narratives interconnectées  
✅ Système de choix fonctionnel  
✅ Transitions entre scènes  
✅ Récompenses basiques (XP, gold)  
✅ Début d'histoire jouable  

---

## 📅 SEMAINE 4-5 : Combat Simple
*Objectif : Combat tour par tour sans grille*

### Jour 1-2 : Structure de Combat

#### Tâche 3.1 : Créer les données d'ennemis
```typescript
// src/data/creatures/bandits.ts
import { CombatEntity } from '../../core/types/combat';

export const BANDIT_LEADER: CombatEntity = {
  id: 'bandit_leader',
  name: 'Chef Bandit',
  type: 'enemy',
  
  // Stats de base
  maxHitPoints: 22,
  currentHitPoints: 22,
  armorClass: 14,
  
  // Caractéristiques
  abilities: {
    strength: 14,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 10,
    charisma: 12
  },
  
  // Combat
  attacks: [{
    name: 'Épée courte',
    attackBonus: 4,
    damage: '1d6+2',
    damageType: 'slashing'
  }],
  
  // IA simple
  aiProfile: {
    role: 'melee_dps',
    aggression: 0.7,
    targeting: 'weakest'
  }
};

export const BANDIT: CombatEntity = {
  id: 'bandit_1',
  name: 'Bandit',
  type: 'enemy',
  
  maxHitPoints: 11,
  currentHitPoints: 11,
  armorClass: 12,
  
  abilities: {
    strength: 11,
    dexterity: 12,
    constitution: 12,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  },
  
  attacks: [{
    name: 'Gourdin',
    attackBonus: 2,
    damage: '1d4',
    damageType: 'bludgeoning'
  }]
};
```

### Jour 3-4 : Moteur de Combat Simplifié

#### Tâche 3.2 : Créer SimpleCombatEngine.ts
```typescript
// src/systems/combat/SimpleCombatEngine.ts
export class SimpleCombatEngine {
  private combatants: CombatEntity[] = [];
  private currentTurnIndex = 0;
  private round = 1;
  
  constructor(
    player: Character,
    enemies: CombatEntity[]
  ) {
    // Convertir le joueur en CombatEntity
    const playerEntity = this.characterToCombatEntity(player);
    
    // Initialiser les combattants
    this.combatants = [playerEntity, ...enemies];
    
    // Trier par initiative (simplifié : basé sur DEX)
    this.rollInitiative();
  }
  
  private rollInitiative() {
    this.combatants.sort((a, b) => {
      const rollA = Math.floor(Math.random() * 20) + 1 + this.getModifier(a.abilities.dexterity);
      const rollB = Math.floor(Math.random() * 20) + 1 + this.getModifier(b.abilities.dexterity);
      return rollB - rollA;
    });
  }
  
  getCurrentTurn(): CombatEntity {
    return this.combatants[this.currentTurnIndex];
  }
  
  async executeAttack(
    attacker: CombatEntity, 
    target: CombatEntity
  ): Promise<AttackResult> {
    // Jet d'attaque
    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const attack = attacker.attacks[0]; // Première attaque par défaut
    const totalAttack = attackRoll + attack.attackBonus;
    
    const hit = totalAttack >= target.armorClass;
    const critical = attackRoll === 20;
    const fumble = attackRoll === 1;
    
    let damage = 0;
    if (hit && !fumble) {
      // Calculer les dégâts
      damage = this.rollDamage(attack.damage);
      if (critical) damage *= 2;
      
      // Appliquer les dégâts
      target.currentHitPoints = Math.max(0, target.currentHitPoints - damage);
    }
    
    return {
      attacker: attacker.name,
      target: target.name,
      attackRoll,
      totalAttack,
      hit,
      critical,
      fumble,
      damage,
      targetHP: target.currentHitPoints,
      targetMaxHP: target.maxHitPoints
    };
  }
  
  private rollDamage(damageString: string): number {
    // Parser "1d6+2" format
    const match = damageString.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) return 0;
    
    const numDice = parseInt(match[1]);
    const dieSize = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    
    let total = modifier;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * dieSize) + 1;
    }
    
    return Math.max(1, total);
  }
  
  nextTurn() {
    this.currentTurnIndex++;
    if (this.currentTurnIndex >= this.combatants.length) {
      this.currentTurnIndex = 0;
      this.round++;
    }
  }
  
  checkVictory(): 'player' | 'enemy' | null {
    const playerAlive = this.combatants.some(
      c => c.type === 'player' && c.currentHitPoints > 0
    );
    const enemiesAlive = this.combatants.some(
      c => c.type === 'enemy' && c.currentHitPoints > 0
    );
    
    if (!playerAlive) return 'enemy';
    if (!enemiesAlive) return 'player';
    return null;
  }
  
  // IA simple pour les ennemis
  async executeAITurn(enemy: CombatEntity): Promise<AttackResult> {
    // Toujours attaquer le joueur pour le MVP
    const player = this.combatants.find(c => c.type === 'player');
    if (!player) throw new Error('Player not found');
    
    return this.executeAttack(enemy, player);
  }
  
  private getModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }
}
```

### Jour 5-6 : Interface de Combat

#### Tâche 3.3 : Créer CombatScreen.tsx
```typescript
// src/components/Combat/CombatScreen.tsx
import { useState, useEffect } from 'react';
import { SimpleCombatEngine } from '../../systems/combat/SimpleCombatEngine';
import { useGameStore } from '../../stores/gameStore';

export const CombatScreen = () => {
  const { character, combat, actions } = useGameStore();
  const [engine, setEngine] = useState<SimpleCombatEngine | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<CombatEntity | null>(null);
  
  // Initialiser le combat
  useEffect(() => {
    if (combat.currentState && character.activeCharacter) {
      const newEngine = new SimpleCombatEngine(
        character.activeCharacter,
        combat.enemyEntities
      );
      setEngine(newEngine);
      setCurrentTurn(newEngine.getCurrentTurn());
      
      addToLog('⚔️ Le combat commence !');
    }
  }, []);
  
  const handlePlayerAttack = async (targetId: string) => {
    if (!engine || !currentTurn || currentTurn.type !== 'player') return;
    
    const target = combat.enemyEntities.find(e => e.id === targetId);
    if (!target) return;
    
    // Exécuter l'attaque
    const result = await engine.executeAttack(currentTurn, target);
    
    // Ajouter au log
    if (result.critical) {
      addToLog(`💥 COUP CRITIQUE ! ${result.attacker} inflige ${result.damage} dégâts à ${result.target} !`);
    } else if (result.hit) {
      addToLog(`⚔️ ${result.attacker} touche ${result.target} pour ${result.damage} dégâts`);
    } else {
      addToLog(`❌ ${result.attacker} rate son attaque contre ${result.target}`);
    }
    
    // Vérifier la victoire
    const victory = engine.checkVictory();
    if (victory) {
      handleCombatEnd(victory);
      return;
    }
    
    // Tour suivant
    engine.nextTurn();
    setCurrentTurn(engine.getCurrentTurn());
    
    // Si c'est un ennemi, déclencher l'IA
    if (engine.getCurrentTurn().type === 'enemy') {
      setTimeout(() => executeAITurn(), 1000);
    }
  };
  
  const executeAITurn = async () => {
    if (!engine) return;
    
    const enemy = engine.getCurrentTurn();
    const result = await engine.executeAITurn(enemy);
    
    if (result.hit) {
      addToLog(`🗡️ ${result.attacker} attaque et inflige ${result.damage} dégâts !`);
    } else {
      addToLog(`✨ ${result.attacker} rate son attaque`);
    }
    
    // Vérifier défaite
    const victory = engine.checkVictory();
    if (victory) {
      handleCombatEnd(victory);
      return;
    }
    
    // Tour suivant
    engine.nextTurn();
    setCurrentTurn(engine.getCurrentTurn());
    
    // Continuer avec l'IA si nécessaire
    if (engine.getCurrentTurn().type === 'enemy') {
      setTimeout(() => executeAITurn(), 1000);
    }
  };
  
  const handleCombatEnd = (result: 'player' | 'enemy') => {
    if (result === 'player') {
      addToLog('🎉 VICTOIRE ! Vous avez vaincu vos ennemis !');
      
      // Appliquer les récompenses
      const rewards = combat.currentState?.rewards;
      if (rewards) {
        actions.addXP(rewards.experience);
        actions.addGold(rewards.gold);
      }
      
      // Transition vers scène de victoire
      setTimeout(() => {
        actions.endCombat('victory', rewards);
        actions.transitionToScene('scene_victory');
      }, 2000);
      
    } else {
      addToLog('💀 DÉFAITE... Vous avez été vaincu.');
      
      setTimeout(() => {
        actions.endCombat('defeat');
        actions.transitionToScene('scene_defeat');
      }, 2000);
    }
  };
  
  const addToLog = (message: string) => {
    setCombatLog(prev => [...prev, message]);
  };
  
  return (
    <div className="flex h-full">
      {/* Zone principale de combat */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Combat !</h2>
        
        {/* Affichage des combattants */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Joueur */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="font-bold text-green-400 mb-2">
              {character.activeCharacter?.name}
            </h3>
            <HealthBar 
              current={currentTurn?.type === 'player' ? currentTurn.currentHitPoints : 0}
              max={currentTurn?.type === 'player' ? currentTurn.maxHitPoints : 1}
            />
            <p className="text-sm mt-2">
              AC: {character.activeCharacter?.combatStats.armorClass}
            </p>
          </div>
          
          {/* Ennemis */}
          <div className="space-y-4">
            {combat.enemyEntities.map(enemy => (
              <div 
                key={enemy.id}
                className={`
                  bg-slate-800 rounded-lg p-4 cursor-pointer
                  ${enemy.currentHitPoints <= 0 ? 'opacity-50' : ''}
                  ${currentTurn?.type === 'player' && enemy.currentHitPoints > 0 
                    ? 'hover:bg-slate-700 ring-2 ring-red-500' 
                    : ''
                  }
                `}
                onClick={() => handlePlayerAttack(enemy.id)}
              >
                <h3 className="font-bold text-red-400 mb-2">
                  {enemy.name}
                </h3>
                <HealthBar 
                  current={enemy.currentHitPoints}
                  max={enemy.maxHitPoints}
                />
                <p className="text-sm mt-2">AC: {enemy.armorClass}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions du joueur */}
        {currentTurn?.type === 'player' && (
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="mb-4 text-yellow-400">
              C'est votre tour ! Cliquez sur un ennemi pour l'attaquer.
            </p>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">
                ⚔️ Attaquer
              </button>
              <button 
                disabled
                className="px-4 py-2 bg-gray-600 rounded opacity-50"
              >
                🛡️ Défendre (Bientôt)
              </button>
              <button 
                disabled
                className="px-4 py-2 bg-gray-600 rounded opacity-50"
              >
                🧪 Objet (Bientôt)
              </button>
            </div>
          </div>
        )}
        
        {/* Tour ennemi */}
        {currentTurn?.type === 'enemy' && (
          <div className="bg-slate-700 rounded-lg p-4">
            <p className="text-orange-400">
              Tour de {currentTurn.name}...
            </p>
          </div>
        )}
      </div>
      
      {/* Journal de combat */}
      <div className="w-80 bg-slate-900 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Journal de Combat</h3>
        <div className="space-y-2 text-sm">
          {combatLog.map((log, index) => (
            <div key={index} className="text-gray-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### Tâche 3.4 : Créer HealthBar.tsx
```typescript
// src/components/Combat/HealthBar.tsx
export const HealthBar = ({ 
  current, 
  max 
}: { 
  current: number; 
  max: number 
}) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const getColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>PV</span>
        <span>{current}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${getColor()} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
```

### Livrable Semaine 4-5
✅ Combat tour par tour fonctionnel  
✅ Initiative et ordre des tours  
✅ Système d'attaque avec jets de dés  
✅ IA ennemie basique  
✅ Interface de combat claire  
✅ Journal de combat  
✅ Conditions de victoire/défaite  

---

## 📅 SEMAINE 6 : Inventaire Minimal et Polish
*Objectif : Gestion basique des objets et finalisation*

### Jour 1-2 : Inventaire Simple

#### Tâche 4.1 : Interface Inventaire Basique
```typescript
// src/components/Inventory/SimpleInventory.tsx
export const SimpleInventory = ({ onClose }: { onClose: () => void }) => {
  const character = useActiveCharacter();
  const { actions } = useGameStore();
  
  if (!character) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full">
        
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Inventaire</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        
        {/* Or */}
        <div className="mb-4 text-yellow-400">
          💰 Or: {character.inventoryState?.inventory.currency.gold || 0}
        </div>
        
        {/* Équipement actuel */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Équipé</h3>
          <div className="grid grid-cols-2 gap-4">
            <EquipmentSlot 
              label="Arme principale" 
              item={character.inventoryState?.equipment.main_hand}
            />
            <EquipmentSlot 
              label="Armure" 
              item={character.inventoryState?.equipment.armor}
            />
          </div>
        </div>
        
        {/* Objets dans l'inventaire */}
        <div>
          <h3 className="text-lg font-bold mb-2">Sac à dos</h3>
          <div className="grid grid-cols-6 gap-2">
            {character.inventoryState?.inventory.slots.map((stack, index) => (
              <ItemSlot 
                key={index}
                stack={stack}
                onUse={() => handleUseItem(stack)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Jour 3-4 : Système de Repos

#### Tâche 4.2 : Interface de Repos Simple
```typescript
// src/components/Rest/RestModal.tsx
export const RestModal = ({ onClose }: { onClose: () => void }) => {
  const character = useActiveCharacter();
  const [restType, setRestType] = useState<'short' | 'long'>('short');
  
  const handleRest = async () => {
    const result = restType === 'short' 
      ? await RestSystem.shortRest(character)
      : await RestSystem.longRest(character);
    
    // Afficher résultats
    alert(`Repos terminé ! HP récupérés: ${result.hitPointsRecovered}`);
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Se Reposer</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => setRestType('short')}
            className={`w-full p-4 rounded-lg ${
              restType === 'short' ? 'bg-slate-600' : 'bg-slate-700'
            }`}
          >
            <h3 className="font-bold">Repos Court (1 heure)</h3>
            <p className="text-sm text-gray-400">
              Utilisez des dés de vie pour récupérer des PV
            </p>
          </button>
          
          <button
            onClick={() => setRestType('long')}
            className={`w-full p-4 rounded-lg ${
              restType === 'long' ? 'bg-slate-600' : 'bg-slate-700'
            }`}
          >
            <h3 className="font-bold">Repos Long (8 heures)</h3>
            <p className="text-sm text-gray-400">
              Récupérez tous vos PV et slots de sorts
            </p>
          </button>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleRest}
            className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          >
            Se Reposer
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Jour 5-6 : Tests et Polish

#### Tâche 4.3 : Créer un Test Complet
```typescript
// src/tests/mvpPlaythrough.test.ts
describe('MVP Playthrough', () => {
  it('should complete a full game loop', async () => {
    // 1. Sélectionner un personnage
    const character = getPregeneratedCharacterByClass('fighter');
    gameStore.actions.setActiveCharacter(character);
    
    // 2. Charger première scène
    await gameStore.actions.transitionToScene('scene_intro');
    expect(gameStore.getState().game.currentScene?.id).toBe('scene_intro');
    
    // 3. Faire un choix
    await gameStore.actions.makeChoice('examine_map');
    
    // 4. Vérifier récompenses
    expect(gameStore.getState().character.totalXP).toBeGreaterThan(0);
    
    // 5. Déclencher combat
    await gameStore.actions.transitionToScene('scene_combat_bandits');
    expect(gameStore.getState().combat.inCombat).toBe(true);
    
    // 6. Simuler victoire
    gameStore.actions.endCombat('victory', {
      experience: 150,
      gold: 50,
      items: []
    });
    
    // 7. Vérifier état final
    expect(gameStore.getState().character.activeCharacter?.experience).toBeGreaterThan(0);
  });
});
```

### Livrable Semaine 6
✅ Inventaire affichable  
✅ Équipement d'armes/armures  
✅ Système de repos fonctionnel  
✅ Tests de bout en bout  
✅ **MVP COMPLET ET JOUABLE**  

---

## 🎮 RÉSULTAT FINAL DU MVP

### Fonctionnalités Disponibles
- ✅ **12 personnages jouables** prégénérés
- ✅ **5-10 scènes** interconnectées avec choix
- ✅ **Combat tour par tour** avec IA basique
- ✅ **Inventaire simple** avec équipement
- ✅ **Système de repos** (court/long)
- ✅ **Progression** (XP et gold)
- ✅ **Interface complète** et fonctionnelle

### Gameplay Loop
1. **Démarrer** → Menu principal
2. **Choisir** un personnage parmi 12
3. **Explorer** les scènes narratives
4. **Combattre** des ennemis
5. **Gagner** XP et équipement
6. **Se reposer** pour récupérer
7. **Continuer** l'aventure

### Métriques de Succès
- **Durée de jeu** : 30-45 minutes
- **Contenu** : 5+ scènes, 2-3 combats
- **Rejouabilité** : 12 personnages différents
- **Stabilité** : Pas de bugs bloquants
- **Performance** : Interface réactive

---

## 🚀 PROCHAINES ÉTAPES (Post-MVP)

### Version 0.6 - Combat Avancé
- Grille de combat hexagonale
- Sorts et capacités spéciales
- IA tactique améliorée

### Version 0.7 - Système de Scènes Complet
- 20+ scènes interconnectées
- Embranchements narratifs
- Conséquences à long terme

### Version 0.8 - Inventaire Complet
- Drag & drop
- Commerce avec marchands
- Crafting basique

### Version 0.9 - Compagnons
- Recrutement de compagnons
- Gestion des relations
- Combat en équipe

### Version 1.0 - Polish Final
- Sauvegarde/chargement
- Sons et musique
- Animations
- Optimisations

---

## 📝 NOTES IMPORTANTES

### Ce qu'on NE fait PAS dans le MVP
- ❌ Grille de combat complexe
- ❌ Tous les sorts D&D
- ❌ Système de compagnons
- ❌ Sauvegarde/chargement
- ❌ Animations sophistiquées
- ❌ Son/musique
- ❌ Création de personnage custom

### Raccourcis Acceptables
- ✅ Scènes hardcodées
- ✅ Combat sans grille
- ✅ IA très basique
- ✅ Pas de pathfinding
- ✅ Interface minimaliste
- ✅ Données limitées

### Focus Absolu
1. **Fonctionnalité > Esthétique**
2. **Simplicité > Complexité**
3. **Jouable > Parfait**
4. **Itération > Perfection**

---

## ✅ CHECKLIST DE VALIDATION MVP

### Semaine 1-2
- [ ] Menu principal fonctionnel
- [ ] Sélection de personnage avec 12 options
- [ ] Affichage des stats de base
- [ ] Navigation entre écrans
- [ ] HUD avec HP et stats

### Semaine 3
- [ ] 5+ scènes narratives
- [ ] Système de choix
- [ ] Transitions fluides
- [ ] Récompenses (XP/Gold)

### Semaine 4-5
- [ ] Combat tour par tour
- [ ] Initiative et ordre
- [ ] IA ennemie basique
- [ ] Victoire/défaite
- [ ] Journal de combat

### Semaine 6
- [ ] Inventaire affichable
- [ ] Équipement basique
- [ ] Système de repos
- [ ] Tests complets
- [ ] **BUILD FINAL MVP**

---

**🎉 À la fin de ces 6 semaines, vous aurez un vrai jeu D&D jouable !**

Ce MVP servira de base solide pour toutes les améliorations futures. L'important est d'avoir quelque chose de concret et fonctionnel rapidement, puis d'itérer dessus.

**Prochaine étape recommandée : Commencer par le setup de base (App.tsx et navigation) !**