import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Scene, SceneId, ChoiceId, SceneReward, GameFlag, FlagName, SceneCondition, CombatScene } from '../core/types/scenes';
import { isCombatScene } from '../core/types/scenes';
import type { Character } from '../core/types/character';
import type { LevelUpChoice } from '../core/types/progression';
import type { CombatState, CombatEntity, CombatEntityId } from '../core/types/combat';
import type { GameAction } from '../core/types/gameActions';
import { SceneManager } from '../systems/scenes/sceneManager';

// === INTERFACES STORE ===

export interface SceneHistoryEntry {
  sceneId: SceneId;
  choiceId?: ChoiceId;
  timestamp: Date;
  rewards?: SceneReward[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  timestamp: Date;
}

export type ModalType = 
  | 'character_sheet'
  | 'inventory' 
  | 'spellbook'
  | 'companions'
  | 'rest'
  | 'level_up'
  | 'settings';

// Store principal avec slices
interface GameStore {
  // === DATA SLICES (sauvés) ===
  game: {
    currentScene: Scene | null;
    flags: Record<FlagName, GameFlag>;
    sceneHistory: SceneHistoryEntry[];
    playTime: number;
    version: string;
    lastSaveTime: Date | null;
  };
  
  character: {
    activeCharacter: Character | null;
    companions: Character[];
    totalXP: number;
    levelUpPending: boolean;
  };
  
  // === TEMPORARY SLICES (pas sauvés) ===
  combat: {
    inCombat: boolean;
    currentState: CombatState | null;
    playerEntity: CombatEntity | null;
    companionEntities: CombatEntity[];
    enemyEntities: CombatEntity[];
    turnOrder: CombatEntityId[];
    currentTurn: number;
    round: number;
  };
  
  ui: {
    activeModal: ModalType | null;
    notifications: Notification[];
    loading: boolean;
    debugMode: boolean;
  };
  
  // === ACTIONS ===
  actions: {
    // === SCENE MANAGEMENT ===
    transitionToScene: (sceneId: SceneId, choiceId?: ChoiceId) => Promise<void>;
    applyRewards: (rewards: SceneReward[]) => void;
    
    // === CHARACTER MANAGEMENT ===
    setActiveCharacter: (character: Character) => void;
    addXP: (amount: number) => void;
    addGold: (amount: number) => void;
    addItem: (itemId: string, quantity: number) => void;
    levelUpCharacter: (choices: LevelUpChoice[]) => void;
    
    // === COMPANION MANAGEMENT ===
    addCompanion: (companion: Character) => void;
    removeCompanion: (companionId: string) => void;
    
    // === COMBAT MANAGEMENT ===
    startCombat: (scene: CombatScene) => void;
    endCombat: (result: 'victory' | 'defeat', rewards?: SceneReward[]) => void;
    executePlayerAction: (action: GameAction) => Promise<void>;
    processAITurn: (entityId: CombatEntityId) => Promise<void>;
    
    // === FLAG SYSTEM ===
    setFlag: (name: FlagName, value: boolean | number | string, description?: string) => void;
    getFlag: (name: FlagName) => GameFlag | undefined;
    checkCondition: (condition: SceneCondition) => boolean;
    
    // === UI MANAGEMENT ===
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
    addNotification: (message: string, type?: Notification['type']) => void;
    removeNotification: (id: string) => void;
    setLoading: (loading: boolean) => void;
    
    // === SAVE/LOAD ===
    autoSave: () => void;
    manualSave: (slotName?: string) => void;
    loadGame: (saveData: any) => void;
    resetGame: () => void;
  };
}

// === ÉTAT INITIAL ===

const initialGameState = {
  currentScene: null,
  flags: {} as Record<FlagName, GameFlag>,
  sceneHistory: [] as SceneHistoryEntry[],
  playTime: 0,
  version: '1.0.0',
  lastSaveTime: null,
};

const initialCharacterState = {
  activeCharacter: null,
  companions: [] as Character[],
  totalXP: 0,
  levelUpPending: false,
};

const initialCombatState = {
  inCombat: false,
  currentState: null,
  playerEntity: null,
  companionEntities: [] as CombatEntity[],
  enemyEntities: [] as CombatEntity[],
  turnOrder: [] as CombatEntityId[],
  currentTurn: 0,
  round: 1,
};

const initialUIState = {
  activeModal: null,
  notifications: [] as Notification[],
  loading: false,
  debugMode: false,
};

// === CRÉATION DU STORE ===

export const useGameStore = create<GameStore>()(
  persist(
    immer((set, get) => ({
      // === SLICES INITIAUX ===
      game: initialGameState,
      character: initialCharacterState,
      combat: initialCombatState,
      ui: initialUIState,
      
      // === ACTIONS IMPLÉMENTATION ===
      actions: {
        // --- SCENE MANAGEMENT ---
        transitionToScene: async (sceneId: SceneId, choiceId?: ChoiceId) => {
          set((state) => {
            state.ui.loading = true;
          });
          
          try {
            // Charger la scène depuis le SceneManager (import statique propre)
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
            
            // Auto-save après transition
            get().actions.autoSave();
            
          } catch (error) {
            console.error('Erreur transition scène:', error);
            set((state) => {
              state.ui.loading = false;
            });
            get().actions.addNotification('Erreur lors du changement de scène', 'error');
          }
        },
        
        applyRewards: (rewards: SceneReward[]) => {
          set((state) => {
            rewards.forEach(reward => {
              switch (reward.type) {
                case 'xp':
                  if (reward.amount) {
                    state.character.totalXP += reward.amount;
                  }
                  break;
                case 'gold':
                  if (reward.amount) {
                    // TODO: Add gold to character inventory when inventory structure is finalized
                    console.log(`Adding ${reward.amount} gold`);
                  }
                  break;
                case 'flag':
                  if (reward.flagName && reward.flagValue !== undefined) {
                    get().actions.setFlag(reward.flagName, reward.flagValue, reward.description);
                  }
                  break;
                // TODO: Implémenter autres types de rewards
              }
              
              // Notification utilisateur
              if (reward.showPopup) {
                get().actions.addNotification(reward.description, 'success');
              }
            });
          });
        },
        
        // --- CHARACTER MANAGEMENT ---
        setActiveCharacter: (character: Character) => {
          set((state) => {
            state.character.activeCharacter = character;
          });
        },
        
        addXP: (amount: number) => {
          set((state) => {
            state.character.totalXP += amount;
            
            // Vérifier level up
            if (state.character.activeCharacter) {
              const currentLevel = state.character.activeCharacter.level;
              const requiredXP = currentLevel * 1000; // Formule simple
              
              if (state.character.totalXP >= requiredXP) {
                state.character.levelUpPending = true;
              }
            }
          });
          
          get().actions.addNotification(`+${amount} XP`, 'success');
        },
        
        addGold: (amount: number) => {
          set((_state) => {
            // TODO: Add gold to character inventory when inventory structure is finalized
            console.log(`Adding ${amount} gold`);
          });
          
          if (amount > 0) {
            get().actions.addNotification(`+${amount} or`, 'success');
          }
        },
        
        addItem: (itemId: string, quantity: number) => {
          set((_state) => {
            // TODO: Ajouter item à l'inventaire
            console.log(`Adding ${quantity}x ${itemId} to inventory`);
          });
          
          get().actions.addNotification(`Objet reçu: ${itemId} (x${quantity})`, 'success');
        },
        
        levelUpCharacter: (choices: LevelUpChoice[]) => {
          set((state) => {
            if (state.character.activeCharacter) {
              state.character.activeCharacter.level += 1;
              state.character.levelUpPending = false;
              
              // TODO: Appliquer les choix de level up
              console.log('Level up choices:', choices);
            }
          });
          
          get().actions.addNotification('Niveau supérieur atteint!', 'success');
          get().actions.autoSave();
        },
        
        // --- COMPANION MANAGEMENT ---
        addCompanion: (companion: Character) => {
          set((state) => {
            state.character.companions.push(companion);
          });
          
          get().actions.addNotification(`${companion.name} rejoint le groupe`, 'success');
        },
        
        removeCompanion: (companionId: string) => {
          set((state) => {
            state.character.companions = state.character.companions.filter(
              c => c.id !== companionId
            );
          });
        },
        
        // --- COMBAT MANAGEMENT ---
        startCombat: (_scene: CombatScene) => {
          set((state) => {
            state.combat.inCombat = true;
            // TODO: Initialiser état combat depuis scene
            state.combat.round = 1;
            state.combat.currentTurn = 0;
          });
          
          get().actions.addNotification('Combat commencé!', 'info');
        },
        
        endCombat: (result: 'victory' | 'defeat', rewards?: SceneReward[]) => {
          set((state) => {
            state.combat.inCombat = false;
            state.combat.currentState = null;
            state.combat.turnOrder = [];
          });
          
          if (result === 'victory' && rewards) {
            get().actions.applyRewards(rewards);
          }
          
          get().actions.addNotification(
            result === 'victory' ? 'Victoire!' : 'Défaite...', 
            result === 'victory' ? 'success' : 'error'
          );
        },
        
        executePlayerAction: async (action: GameAction) => {
          // TODO: Implémenter exécution action joueur
          console.log('Player action:', action);
        },
        
        processAITurn: async (entityId: CombatEntityId) => {
          // TODO: Implémenter tour IA
          console.log('AI turn for:', entityId);
        },
        
        // --- FLAG SYSTEM ---
        setFlag: (name: FlagName, value: boolean | number | string, description?: string) => {
          set((state) => {
            const flagType: 'boolean' | 'numeric' | 'string' = 
              typeof value === 'number' ? 'numeric' : typeof value as 'boolean' | 'string';
            
            state.game.flags[name] = {
              name,
              type: flagType,
              value,
              description: description || `Flag: ${name}`,
              category: 'story', // Default category
            };
          });
        },
        
        getFlag: (name: FlagName) => {
          return get().game.flags[name];
        },
        
        checkCondition: (condition: SceneCondition) => {
          const state = get();
          
          switch (condition.type) {
            case 'flag':
              if (!condition.flagName) return false;
              const flag = state.game.flags[condition.flagName];
              if (!flag) return false;
              
              switch (condition.operator) {
                case 'equal': return flag.value === condition.value;
                case 'greater': return flag.value > condition.value;
                case 'less': return flag.value < condition.value;
                case 'has': return flag.value !== undefined;
                default: return false;
              }
              
            case 'level':
              const character = state.character.activeCharacter;
              if (!character) return false;
              
              switch (condition.operator) {
                case 'equal': return character.level === condition.value;
                case 'greater': return character.level > condition.value;
                case 'less': return character.level < condition.value;
                default: return false;
              }
              
            // TODO: Implémenter autres conditions
            default:
              return false;
          }
        },
        
        // --- UI MANAGEMENT ---
        openModal: (modal: ModalType) => {
          set((state) => {
            state.ui.activeModal = modal;
          });
        },
        
        closeModal: () => {
          set((state) => {
            state.ui.activeModal = null;
          });
        },
        
        addNotification: (message: string, type: Notification['type'] = 'info') => {
          const notification: Notification = {
            id: `notif_${Date.now()}`,
            message,
            type,
            duration: type === 'error' ? 5000 : 3000,
            timestamp: new Date(),
          };
          
          set((state) => {
            state.ui.notifications.push(notification);
            
            // Limiter à 5 notifications max
            if (state.ui.notifications.length > 5) {
              state.ui.notifications.shift();
            }
          });
          
          // Auto-remove après duration
          if (notification.duration) {
            setTimeout(() => {
              get().actions.removeNotification(notification.id);
            }, notification.duration);
          }
        },
        
        removeNotification: (id: string) => {
          set((state) => {
            state.ui.notifications = state.ui.notifications.filter(n => n.id !== id);
          });
        },
        
        setLoading: (loading: boolean) => {
          set((state) => {
            state.ui.loading = loading;
          });
        },
        
        // --- SAVE/LOAD ---
        autoSave: () => {
          set((state) => {
            state.game.lastSaveTime = new Date();
          });
          // La persistence Zustand s'occupe automatiquement de sauver
          console.log('Auto-save effectué');
        },
        
        manualSave: (slotName?: string) => {
          get().actions.autoSave();
          get().actions.addNotification(
            `Jeu sauvegardé${slotName ? ` (${slotName})` : ''}`, 
            'success'
          );
        },
        
        loadGame: (saveData: any) => {
          set(() => ({
            game: saveData.game || initialGameState,
            character: saveData.character || initialCharacterState,
            combat: initialCombatState, // Always reset combat
            ui: initialUIState, // Always reset UI
          }));
          
          get().actions.addNotification('Jeu chargé', 'success');
        },
        
        resetGame: () => {
          set(() => ({
            game: initialGameState,
            character: initialCharacterState,
            combat: initialCombatState,
            ui: initialUIState,
          }));
          
          get().actions.addNotification('Jeu réinitialisé', 'info');
        },
      },
    })),
    {
      name: 'odyssey-game-save',
      version: 1,
      
      // Ne sauver que les données persistantes
      partialize: (state) => ({
        game: state.game,
        character: state.character,
        // combat et ui sont temporaires
      }),
      
      // Migration en cas de changement de structure
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration depuis version 0 vers 1
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);

// === HOOKS UTILITAIRES ===

// Sélecteurs optimisés pour éviter les re-renders
export const useCurrentScene = () => useGameStore(state => state.game.currentScene);
export const useActiveCharacter = () => useGameStore(state => state.character.activeCharacter);
export const useInCombat = () => useGameStore(state => state.combat.inCombat);
export const useNotifications = () => useGameStore(state => state.ui.notifications);
export const useActiveModal = () => useGameStore(state => state.ui.activeModal);
export const useLoading = () => useGameStore(state => state.ui.loading);

// Actions groupées
export const useGameActions = () => useGameStore(state => state.actions);
export const useSceneActions = () => useGameStore(state => ({
  transitionToScene: state.actions.transitionToScene,
  applyRewards: state.actions.applyRewards,
  checkCondition: state.actions.checkCondition,
}));
export const useCharacterActions = () => useGameStore(state => ({
  addXP: state.actions.addXP,
  addGold: state.actions.addGold,
  addItem: state.actions.addItem,
  levelUp: state.actions.levelUpCharacter,
}));
export const useUIActions = () => useGameStore(state => ({
  openModal: state.actions.openModal,
  closeModal: state.actions.closeModal,
  addNotification: state.actions.addNotification,
}));