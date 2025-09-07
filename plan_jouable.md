# 🎮 PLAN COMPLET POUR GAMEPLAY JOUABLE - D&D NEW ODYSSEY

## 📊 ANALYSE DE L'ÉTAT ACTUEL

### ✅ Forces du Projet (Déjà Implémenté)

#### **Système de Types & Architecture**
- **Types TypeScript complets** : Couverture exhaustive de D&D 5e (personnages, combat, sorts, objets)
- **Architecture Zustand solide** : Store centralisé avec persistence et slices bien organisés
- **Patterns de qualité** : Factory pattern, separation of concerns, hooks optimisés

#### **Données & Contenu**
- **12 personnages prégénérés** : Stats optimisées point-buy, personnalités détaillées
- **12 backgrounds complets** : Compétences, équipement, traits de personnalité
- **3 compagnons détaillés** : Fighter, Cleric, Rogue avec IA comportementale
- **Sorts niveau 1** : 4 sorts complets avec effets et ciblage
- **Factory fonctionnelle** : Création de personnages avec tous les calculs D&D 5e

#### **Systèmes Métier Avancés**
- **Système de repos** : Short/long rest avec récupération classe-spécifique
- **Système de compagnons** : Recrutement, loyauté, relations, romance
- **Calculs D&D 5e** : Modificateurs, jets de sauvegarde, stats dérivées
- **Validation** : Point-buy, compatibilité classe/background

### 📈 Niveau de Complétion Détaillé

| Couche | Pourcentage | Détail |
|--------|-------------|--------|
| **Types & Architecture** | 95% | Quasi-complet, excellente base |
| **Données de Base** | 85% | Personnages, sorts, backgrounds OK |
| **Logique Métier** | 60% | Repos/compagnons avancés, combat manquant |
| **Interface Utilisateur** | 0% | Rien d'implémenté |
| **Persistance & État** | 70% | Store OK, save/load partiel |
| **Intégration Systèmes** | 30% | Systèmes isolés |
| **Données de Contenu** | 20% | Manque scènes, objets, ennemis |

**📊 Estimation globale : 45% d'un jeu complet**

---

## 🚀 ROADMAP DÉTAILLÉE

### **PHASE 1 : INTERFACE UTILISATEUR FONDAMENTALE**
*Durée estimée : 3-4 semaines*
*Objectif : Pouvoir voir et interagir avec toutes les données existantes*

#### 1.1 - Architecture Interface (Semaine 1)

**Restructuration App.tsx**
```typescript
// src/App.tsx
import { GameRouter } from './components/GameRouter';
import { useGameStore } from './stores/gameStore';

function App() {
  const { activeCharacter } = useGameStore();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <GameRouter />
    </div>
  );
}
```

**Structure composants**
```
src/components/
├── GameRouter/
│   ├── GameRouter.tsx           // Navigation principale
│   └── GameStates.tsx           // États de jeu
├── CharacterCreation/
│   ├── CharacterSelector.tsx    // Sélection personnage prégénéré
│   ├── CharacterPreview.tsx     // Aperçu stats/background
│   ├── BackgroundDetails.tsx    // Détails background
│   └── ConfirmCharacter.tsx     // Validation choix
├── GameInterface/
│   ├── GameScreen.tsx           // Interface principale
│   ├── HUD/
│   │   ├── HealthBar.tsx        // Barre de vie
│   │   ├── ResourceTracker.tsx  // Spell slots, Ki, etc.
│   │   └── CompanionStatus.tsx  // État compagnons
│   ├── ActionPanel.tsx          // Panneau d'actions
│   └── QuickAccess.tsx          // Accès rapide inventaire/sorts
└── Common/
    ├── Modal.tsx                // Modal réutilisable
    ├── Button.tsx               // Boutons stylés
    ├── Card.tsx                 // Cartes d'information
    └── Tooltip.tsx              // Info-bulles
```

#### 1.2 - Écran de Sélection de Personnage (Semaine 2)

**Fonctionnalités détaillées :**
- **Grille de 12 personnages** avec portraits et noms
- **Aperçu détaillé** : classe, background, stats principales
- **Description narrative** : personnalité, motivation, histoire
- **Stats techniques** : HP, AC, modificateurs, compétences
- **Équipement de départ** affiché visuellement
- **Validation et confirmation** du choix

**Composants spécifiques :**
```typescript
// src/components/CharacterCreation/CharacterSelector.tsx
interface CharacterSelectorProps {
  onCharacterSelect: (characterId: string) => void;
}

// Affichage en grille 4x3
// Hover effects et animations
// Filtrage par classe si besoin
```

#### 1.3 - Interface Principale de Jeu (Semaine 3)

**Layout principal :**
```
┌─────────────────────────────────────────────────────┐
│ [Menu] [Inventory] [Character] [Rest] [Save]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│               ZONE DE JEU PRINCIPALE                │
│            (Scènes/Combat/Dialogues)                │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [HP: 45/52] [AC: 16] [Slots: ●●○] [Gold: 150]      │
│ [Compagnons] [Actions disponibles] [Notifications]  │
└─────────────────────────────────────────────────────┘
```

**Gestion des modales :**
- **Character Sheet** : Stats complètes, compétences, features
- **Inventory** : Équipement, objets, gestion du poids
- **Spellbook** : Sorts préparés, slots disponibles
- **Companions** : Gestion groupe, relations
- **Settings** : Options de jeu

#### 1.4 - Système de Modales Avancé (Semaine 4)

**Character Sheet Modal :**
```typescript
// src/components/Modals/CharacterSheet/
├── CharacterSheet.tsx           // Container principal
├── StatsPanel.tsx              // Caractéristiques et mods
├── SkillsPanel.tsx             // Compétences avec calculs
├── CombatStatsPanel.tsx        // HP, AC, Initiative
├── FeaturesPanel.tsx           // Class features et traits
├── ProficienciesPanel.tsx      // Armes, armures, outils
└── NotesPanel.tsx              // Background, personality
```

**Intégration store :**
```typescript
// Connexion directe avec useActiveCharacter()
// Mise à jour temps réel des stats
// Validation des modifications
```

---

### **PHASE 2 : BASE DE DONNÉES DE CONTENU**
*Durée estimée : 2-3 semaines*
*Objectif : Créer tout le contenu nécessaire au gameplay*

#### 2.1 - Objets et Équipements (Semaine 1)

**Structure des données :**
```typescript
// src/data/items/
├── weapons/
│   ├── simpleWeapons.ts         // Dagues, massues, arcs
│   ├── martialWeapons.ts        // Épées, haches, arbalètes
│   └── magicWeapons.ts          // Armes enchantées
├── armor/
│   ├── lightArmor.ts            // Cuir, cuir clouté
│   ├── mediumArmor.ts           // Cotte de mailles, écailles
│   ├── heavyArmor.ts            // Harnois, plate
│   └── shields.ts               // Boucliers et targes
├── consumables/
│   ├── potions.ts               // Potions de soin, mana
│   ├── scrolls.ts               // Parchemins de sorts
│   └── food.ts                  // Rations, provisions
└── treasures/
    ├── gems.ts                  // Pierres précieuses
    ├── artObjects.ts            // Objets d'art
    └── magicItems.ts            // Objets magiques mineurs
```

**Exemples d'implémentation :**
```typescript
// weapons/simpleWeapons.ts
export const SIMPLE_WEAPONS: Weapon[] = [
  {
    id: 'dagger',
    name: 'Dague',
    type: 'weapon',
    category: 'simple',
    weaponType: 'melee',
    damage: { dice: '1d4', type: 'piercing' },
    properties: ['finesse', 'light', 'thrown'],
    range: { normal: 20, max: 60 },
    weight: 1,
    value: 2,
    rarity: 'common'
  },
  // ... autres armes simples
];
```

#### 2.2 - Sorts Complets (Semaine 2)

**Extension système de sorts :**
```typescript
// src/data/spells/
├── cantrips/
│   ├── cantripsDamage.ts        // Fire Bolt, Eldritch Blast
│   ├── cantripsUtility.ts       // Light, Mage Hand
│   └── cantripsDebuff.ts        // Vicious Mockery
├── level1/
│   ├── level1Damage.ts          // Magic Missile, Burning Hands
│   ├── level1Healing.ts         // Cure Wounds, Healing Word
│   ├── level1Utility.ts         // Shield, Mage Armor
│   └── level1Control.ts         // Sleep, Charm Person
├── level2/
│   └── [sorts niveau 2...]
└── spellLists/
    ├── wizardSpells.ts          // Liste sorts par classe
    ├── clericSpells.ts
    └── [autres classes...]
```

**Mécaniques de sorts :**
```typescript
interface SpellEffect {
  onCast: (caster: Character, targets: CombatEntity[]) => Promise<SpellResult>;
  calculateDamage?: (casterLevel: number, spellLevel: number) => number;
  validateTargets: (targets: CombatEntity[]) => boolean;
  getAOETargets?: (center: GridPosition, range: number) => GridPosition[];
}
```

#### 2.3 - Ennemis et Créatures (Semaine 3)

**Bestiaire organisé :**
```typescript
// src/data/creatures/
├── beasts/
│   ├── lowLevel.ts              // Rats, loups, ours
│   └── midLevel.ts              // Owlbears, displacer beasts
├── humanoids/
│   ├── bandits.ts               // Brigands, cultistes
│   ├── guards.ts                // Gardes, soldats
│   └── nobles.ts                // Nobles, marchands
├── undead/
│   ├── skeletons.ts             // Squelettes, zombies
│   └── spirits.ts               // Spectres, fantômes
└── monsters/
    ├── goblins.ts               // Gobelins, hobgobelins
    ├── orcs.ts                  // Orcs, ogres
    └── dragons.ts               // Jeunes dragons
```

**Stats complètes D&D 5e :**
```typescript
interface CreatureData {
  // Stats de base
  id: EnemyId;
  name: string;
  size: CreatureSize;
  type: CreatureType;
  alignment: string;
  
  // Combat
  armorClass: number;
  hitPoints: number;
  hitDie: string;
  speed: Record<string, number>;
  
  // Caractéristiques
  abilities: Record<Ability, number>;
  savingThrows?: Record<Ability, number>;
  skills?: Record<Skill, number>;
  
  // Capacités spéciales
  actions: Action[];
  reactions?: Action[];
  legendaryActions?: Action[];
  
  // IA et comportement
  aiProfile: CombatAI;
  tactics: string[];
  
  // Récompenses
  experienceValue: number;
  loot?: LootTable;
}
```

---

### **PHASE 3 : SYSTÈME DE COMBAT COMPLET**
*Durée estimée : 4-5 semaines*
*Objectif : Combat tour par tour entièrement fonctionnel*

#### 3.1 - Moteur de Combat Core (Semaines 1-2)

**Architecture système :**
```typescript
// src/systems/combat/
├── engine/
│   ├── CombatEngine.ts          // Orchestrateur principal
│   ├── AttackResolver.ts        // Résolution attaques
│   ├── SpellResolver.ts         // Résolution sorts
│   ├── DamageCalculator.ts      // Calculs de dégâts
│   └── StatusEffectManager.ts   // Effets temporaires
├── turnManagement/
│   ├── TurnManager.ts           // Gestion tours
│   ├── InitiativeTracker.ts     // Initiative et ordre
│   └── ActionValidator.ts       // Validation actions
├── grid/
│   ├── CombatGrid.ts            // Grille de combat
│   ├── MovementSystem.ts        // Déplacements
│   ├── RangeCalculator.ts       // Calculs de portée
│   └── AreaOfEffect.ts          // Zones d'effet
└── ai/
    ├── AIDirector.ts            // IA ennemis
    ├── TacticalAnalyzer.ts      // Analyse tactique
    └── CompanionAI.ts           // IA compagnons
```

**Résolution des attaques :**
```typescript
// AttackResolver.ts
export class AttackResolver {
  static async resolveAttack(
    attacker: CombatEntity,
    target: CombatEntity,
    weapon: Weapon,
    attackType: 'normal' | 'advantage' | 'disadvantage' = 'normal'
  ): Promise<AttackResult> {
    
    // 1. Calcul du bonus d'attaque
    const attackBonus = this.calculateAttackBonus(attacker, weapon);
    
    // 2. Jet d'attaque (1d20 + bonus)
    const attackRoll = this.rollD20(attackType) + attackBonus;
    
    // 3. Vérification touche (vs AC cible)
    const hits = attackRoll >= target.armorClass;
    
    // 4. Critique (20 naturel)
    const isCritical = this.isCriticalHit(attackRoll - attackBonus);
    
    // 5. Calcul des dégâts si touche
    let damage = 0;
    if (hits) {
      damage = this.calculateDamage(attacker, weapon, isCritical);
    }
    
    return {
      attackRoll,
      hits,
      isCritical,
      damage,
      damageType: weapon.damage.type
    };
  }
  
  private static rollD20(type: 'normal' | 'advantage' | 'disadvantage'): number {
    if (type === 'advantage') {
      return Math.max(this.d20(), this.d20());
    } else if (type === 'disadvantage') {
      return Math.min(this.d20(), this.d20());
    }
    return this.d20();
  }
  
  private static d20(): number {
    return Math.floor(Math.random() * 20) + 1;
  }
}
```

#### 3.2 - Grille de Combat et Mouvement (Semaine 2)

**Système de grille hexagonale :**
```typescript
// grid/CombatGrid.ts
export class CombatGrid {
  private grid: GridTile[][];
  private entities: Map<CombatEntityId, GridPosition>;
  
  constructor(
    public width: number,
    public height: number,
    public terrain: TerrainType[][]
  ) {
    this.initializeGrid();
  }
  
  // Calcul de distance (hexagonale)
  calculateDistance(pos1: GridPosition, pos2: GridPosition): number {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return Math.max(dx, dy, Math.abs(dx - dy));
  }
  
  // Pathfinding simple
  findPath(start: GridPosition, end: GridPosition): GridPosition[] {
    // Implémentation A* ou Dijkstra
    return this.aStar(start, end);
  }
  
  // Validation mouvement
  canMoveTo(entityId: CombatEntityId, position: GridPosition): boolean {
    const tile = this.getTile(position);
    return tile && 
           !tile.blocked && 
           !this.isOccupied(position) &&
           this.isWithinRange(entityId, position);
  }
  
  // Zones d'effet (cercle, cône, ligne)
  getAreaOfEffect(
    center: GridPosition,
    shape: 'circle' | 'cone' | 'line',
    size: number
  ): GridPosition[] {
    switch (shape) {
      case 'circle':
        return this.getCircleArea(center, size);
      case 'cone':
        return this.getConeArea(center, size);
      case 'line':
        return this.getLineArea(center, size);
    }
  }
}
```

**Gestion du terrain :**
```typescript
interface GridTile {
  position: GridPosition;
  terrain: TerrainType;
  blocked: boolean;
  difficult: boolean;      // Terrain difficile (coût x2)
  cover: CoverType;        // Abri partiel/total
  hazard?: HazardType;     // Pièges, feu, etc.
}

enum TerrainType {
  FLOOR = 'floor',
  WALL = 'wall',
  WATER = 'water',
  FOREST = 'forest',
  MOUNTAIN = 'mountain',
  SWAMP = 'swamp'
}
```

#### 3.3 - Système de Sorts en Combat (Semaine 3)

**Résolution des sorts :**
```typescript
// SpellResolver.ts
export class SpellResolver {
  static async castSpell(
    caster: CombatEntity,
    spell: Spell,
    targets: CombatEntity[],
    spellLevel: number
  ): Promise<SpellResult> {
    
    // 1. Validation ciblage
    if (!this.validateTargets(spell, targets)) {
      throw new Error('Ciblage invalide');
    }
    
    // 2. Jet de sauvegarde si nécessaire
    const saveResults = await this.resolveSavingThrows(spell, targets, caster);
    
    // 3. Application des effets
    const effects: SpellEffect[] = [];
    
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const saved = saveResults[i];
      
      const effect = await this.applySpellEffect(
        spell, 
        caster, 
        target, 
        spellLevel, 
        saved
      );
      
      effects.push(effect);
    }
    
    // 4. Consommation slot de sort
    this.consumeSpellSlot(caster, spellLevel);
    
    return {
      spell,
      caster,
      targets,
      effects,
      success: true
    };
  }
  
  private static async resolveSavingThrows(
    spell: Spell,
    targets: CombatEntity[],
    caster: CombatEntity
  ): Promise<boolean[]> {
    
    if (!spell.savingThrow) return [];
    
    const DC = 8 + caster.proficiencyBonus + 
               caster.getAbilityModifier(spell.spellcastingAbility);
    
    return targets.map(target => {
      const saveRoll = this.rollD20() + 
                      target.getAbilityModifier(spell.savingThrow!.ability);
      return saveRoll >= DC;
    });
  }
}
```

**Effets de sorts spécifiques :**
```typescript
// Exemple : Magic Missile
const magicMissileEffect: SpellEffect = {
  onCast: async (caster, targets, level) => {
    const missiles = Math.min(level + 2, 5); // 3 au niveau 1, +1 par niveau
    const totalDamage = missiles * (this.rollDice('1d4') + 1);
    
    // Répartition automatique sur les cibles
    return this.distributeDamage(targets, totalDamage);
  }
};

// Exemple : Fireball
const fireballEffect: SpellEffect = {
  onCast: async (caster, targets, level) => {
    const damage = this.rollDice(`${level + 5}d6`); // 8d6 au niveau 3
    
    return targets.map(target => ({
      target,
      damage: target.savedAgainst ? Math.floor(damage / 2) : damage,
      type: 'fire'
    }));
  },
  
  getAOETargets: (center, range) => {
    return this.getCircleArea(center, 4); // Rayon 4 cases
  }
};
```

#### 3.4 - Intelligence Artificielle (Semaine 4)

**IA tactique avancée :**
```typescript
// ai/AIDirector.ts
export class AIDirector {
  static async planTurn(entity: CombatEntity): Promise<GameAction[]> {
    const aiProfile = entity.aiProfile;
    const context = this.analyzeContext(entity);
    
    switch (aiProfile.role) {
      case 'melee_dps':
        return this.planMeleeDPS(entity, context);
      case 'ranged_dps':
        return this.planRangedDPS(entity, context);
      case 'spellcaster':
        return this.planSpellcaster(entity, context);
      case 'tank':
        return this.planTank(entity, context);
      case 'support':
        return this.planSupport(entity, context);
    }
  }
  
  private static planMeleeDPS(
    entity: CombatEntity, 
    context: CombatContext
  ): GameAction[] {
    
    const actions: GameAction[] = [];
    
    // 1. Identifier la meilleure cible
    const target = this.selectTarget(entity, context, {
      priority: 'weakest',
      preferredRange: 'melee'
    });
    
    if (!target) return [{ type: 'dodge' }];
    
    // 2. Se rapprocher si nécessaire
    if (context.distanceToTarget > entity.reach) {
      const movePath = this.findOptimalMovement(entity, target);
      if (movePath.length > 0) {
        actions.push({
          type: 'move',
          path: movePath
        });
      }
    }
    
    // 3. Attaquer
    const weapon = entity.getMainHandWeapon();
    actions.push({
      type: 'attack',
      weapon,
      target
    });
    
    // 4. Action bonus si disponible
    if (entity.hasActionBonus) {
      const bonusAction = this.planBonusAction(entity, context);
      if (bonusAction) actions.push(bonusAction);
    }
    
    return actions;
  }
  
  private static analyzeContext(entity: CombatEntity): CombatContext {
    return {
      nearbyAllies: this.getNearbyEntities(entity, 'ally', 2),
      nearbyEnemies: this.getNearbyEntities(entity, 'enemy', 2),
      healthPercentage: entity.currentHitPoints / entity.maxHitPoints,
      distanceToNearestEnemy: this.getDistanceToNearestEnemy(entity),
      threateningEnemies: this.getThreateningEnemies(entity),
      advantageousPositions: this.findAdvantageousPositions(entity)
    };
  }
}
```

#### 3.5 - Interface de Combat (Semaine 5)

**Composants d'interface :**
```typescript
// src/components/Combat/
├── CombatScreen.tsx             // Container principal
├── CombatGrid/
│   ├── GridRenderer.tsx         // Rendu de la grille
│   ├── EntityToken.tsx          // Pions des entités
│   ├── MovementPreview.tsx      // Aperçu déplacement
│   └── SpellTargeting.tsx       // Ciblage sorts/AOE
├── CombatHUD/
│   ├── InitiativeTracker.tsx    // Ordre des tours
│   ├── ActionBar.tsx            // Actions disponibles
│   ├── TargetInfo.tsx           // Infos cible sélectionnée
│   └── CombatLog.tsx            // Journal de combat
├── ActionPanels/
│   ├── AttackPanel.tsx          // Options d'attaque
│   ├── SpellPanel.tsx           // Liste sorts disponibles
│   ├── MovementPanel.tsx        // Contrôles de déplacement
│   └── ItemPanel.tsx            // Objets utilisables
└── Animations/
    ├── AttackAnimation.tsx      // Animations d'attaque
    ├── SpellEffects.tsx         // Effets visuels sorts
    └── DamageNumbers.tsx        // Nombres de dégâts
```

**Interactivité de la grille :**
```typescript
// CombatGrid/GridRenderer.tsx
export const GridRenderer: React.FC<GridRendererProps> = ({ 
  grid, 
  entities, 
  selectedEntity,
  onTileClick,
  onEntitySelect 
}) => {
  
  const [hoveredTile, setHoveredTile] = useState<GridPosition | null>(null);
  const [targetingMode, setTargetingMode] = useState<TargetingMode | null>(null);
  
  // Affichage des zones de mouvement
  const movementRange = useMemo(() => {
    if (!selectedEntity) return new Set();
    return calculateMovementRange(selectedEntity, grid);
  }, [selectedEntity, grid]);
  
  // Affichage des portées d'attaque
  const attackRange = useMemo(() => {
    if (!selectedEntity || !targetingMode) return new Set();
    return calculateAttackRange(selectedEntity, targetingMode.weapon);
  }, [selectedEntity, targetingMode]);
  
  return (
    <div className="combat-grid">
      {grid.map((row, y) =>
        row.map((tile, x) => (
          <GridTile
            key={`${x}-${y}`}
            tile={tile}
            entity={entities.get(`${x}-${y}`)}
            isInMovementRange={movementRange.has(`${x}-${y}`)}
            isInAttackRange={attackRange.has(`${x}-${y}`)}
            isHovered={hoveredTile?.x === x && hoveredTile?.y === y}
            onClick={() => onTileClick(tile.position)}
            onMouseEnter={() => setHoveredTile({ x, y })}
            onMouseLeave={() => setHoveredTile(null)}
          />
        ))
      )}
    </div>
  );
};
```

---

### **PHASE 4 : SYSTÈME DE SCÈNES ET NARRATION**
*Durée estimée : 3-4 semaines*
*Objectif : Navigation narrative complète avec choix conséquents*

#### 4.1 - Données de Scènes (Semaines 1-2)

**Structure narrative :**
```typescript
// src/data/scenes/
├── chapters/
│   ├── chapter1_prologue.ts     // Introduction, choix classe
│   ├── chapter2_village.ts      // Premier village, PNJ
│   ├── chapter3_dungeon.ts      // Premier donjon
│   └── chapter4_resolution.ts   // Résolution arc narratif
├── encounters/
│   ├── combatEncounters.ts      // Rencontres de combat variées
│   ├── socialEncounters.ts      // Interactions sociales
│   ├── explorationEncounters.ts // Puzzles, pièges, découvertes
│   └── randomEvents.ts          // Événements aléatoires
├── locations/
│   ├── settlements/
│   │   ├── taverns.ts           // Tavernes, auberges
│   │   ├── shops.ts             // Marchands, forgerons
│   │   └── temples.ts           // Temples, guérisseurs
│   ├── wilderness/
│   │   ├── forests.ts           // Forêts, rencontres nature
│   │   ├── mountains.ts         // Montagnes, grottes
│   │   └── roads.ts             // Routes, voyages
│   └── dungeons/
│       ├── crypts.ts            // Cryptes, morts-vivants
│       ├── caves.ts             // Grottes, créatures
│       └── ruins.ts             // Ruines antiques, magie
└── npcs/
    ├── allies.ts                // Alliés potentiels
    ├── merchants.ts             // Marchands spécialisés
    ├── questGivers.ts          // Donneurs de quêtes
    └── villains.ts             // Antagonistes
```

**Exemple de scène complexe :**
```typescript
// chapters/chapter2_village.ts
export const VILLAGE_ARRIVAL: NarrativeScene = {
  id: 'village_arrival',
  type: SceneType.NARRATIVE,
  title: 'Arrivée au Village de Boisvert',
  description: `Après plusieurs heures de marche sur la route poussiéreuse, vous apercevez enfin les toits de chaume du village de Boisvert. La fumée s'élève paisiblement des cheminées, et vous entendez le bruit familier de la forge qui résonne dans l'air du soir.
  
  En approchant de l'entrée du village, vous remarquez deux gardes postés près de la palissade en bois. Ils semblent nerveux et scrutent attentivement chaque voyageur qui passe.`,
  
  background: '/images/scenes/village_entrance.jpg',
  music: 'village_peaceful',
  lighting: 'dim', // Début de soirée
  
  autoSave: true,
  savePointName: 'Arrivée à Boisvert',
  
  choices: [
    {
      id: 'approach_guards',
      text: 'S\'approcher des gardes et demander des informations',
      requirements: [],
      skillCheck: {
        ability: 'charisma',
        skill: 'persuasion',
        difficultyClass: 12,
        consequences: {
          success: [
            {
              type: 'scene_transition',
              targetScene: 'guards_helpful',
              delay: 1000,
              effects: [
                { type: 'set_flag', flagName: 'guards_trust', value: true }
              ]
            }
          ],
          failure: [
            {
              type: 'scene_transition',
              targetScene: 'guards_suspicious',
              effects: [
                { type: 'set_flag', flagName: 'guards_suspicious', value: true }
              ]
            }
          ]
        }
      },
      rewards: [
        {
          type: 'xp',
          amount: 25,
          description: 'Interaction sociale réussie',
          showPopup: true
        }
      ]
    },
    
    {
      id: 'sneak_around',
      text: 'Contourner discrètement le village par les bois',
      requirements: [
        { type: 'skill', value: 'stealth', comparison: 'greater', minValue: 3 }
      ],
      skillCheck: {
        ability: 'dexterity',
        skill: 'stealth',
        difficultyClass: 15,
        advantage: false,
        consequences: {
          success: [
            {
              type: 'scene_transition',
              targetScene: 'village_backdoor',
              effects: [
                { type: 'set_flag', flagName: 'entered_secretly', value: true }
              ]
            }
          ],
          failure: [
            {
              type: 'scene_transition',
              targetScene: 'caught_sneaking',
              effects: [
                { type: 'set_flag', flagName: 'village_reputation', value: -1 }
              ]
            }
          ]
        }
      }
    },
    
    {
      id: 'make_camp',
      text: 'Établir un campement à l\'extérieur et attendre le matin',
      requirements: [],
      consequences: [
        {
          type: 'rest_opportunity',
          restType: 'long',
          interruptions: [
            {
              probability: 0.3,
              type: 'combat',
              description: 'Des bandits attaquent votre campement !',
              consequences: [
                { type: 'scene_transition', targetScene: 'bandit_ambush' }
              ]
            }
          ]
        }
      ],
      rewards: [
        {
          type: 'flag',
          flagName: 'cautious_approach',
          flagValue: true,
          description: 'Vous avez fait preuve de prudence'
        }
      ]
    },
    
    {
      id: 'intimidate_entry',
      text: 'Exiger l\'entrée avec autorité',
      requirements: [
        { type: 'ability', value: 'strength', comparison: 'greater', minValue: 14 },
        { type: 'class', value: ['fighter', 'barbarian', 'paladin'] }
      ],
      skillCheck: {
        ability: 'charisma',
        skill: 'intimidation',
        difficultyClass: 14,
        consequences: {
          success: [
            {
              type: 'scene_transition',
              targetScene: 'intimidation_success',
              effects: [
                { type: 'set_flag', flagName: 'reputation_feared', value: true }
              ]
            }
          ],
          failure: [
            {
              type: 'scene_transition',
              targetScene: 'guards_hostile',
              effects: [
                { type: 'combat_encounter', enemyGroup: 'village_guards' }
              ]
            }
          ]
        }
      }
    }
  ],
  
  // Évènements conditionnels
  conditionalEvents: [
    {
      condition: { type: 'flag', flagName: 'met_refugees', operator: 'equal', value: true },
      text: 'En vous approchant, vous reconnaissez l\'un des gardes - c\'est l\'homme qui accompagnait les réfugiés que vous avez rencontrés sur la route.',
      effects: [
        { type: 'add_choice', choiceId: 'mention_refugees' }
      ]
    }
  ]
};
```

#### 4.2 - Moteur de Scènes (Semaine 3)

**Système de navigation :**
```typescript
// src/systems/scenes/
├── SceneEngine.ts               // Orchestrateur principal
├── SceneLoader.ts               // Chargement scènes
├── ChoiceValidator.ts           // Validation choix
├── ConditionEvaluator.ts        // Évaluation conditions
├── RewardProcessor.ts           // Application récompenses
├── TransitionManager.ts         // Gestion transitions
└── SkillCheckResolver.ts        // Résolution jets
```

**Moteur principal :**
```typescript
// SceneEngine.ts
export class SceneEngine {
  private currentScene: Scene | null = null;
  private sceneHistory: SceneHistoryEntry[] = [];
  private gameStore: GameStore;
  
  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;
  }
  
  async loadScene(sceneId: SceneId): Promise<Scene> {
    // 1. Charger les données de la scène
    const sceneData = await SceneLoader.loadScene(sceneId);
    
    // 2. Évaluer les prérequis
    const meetsPrerequisites = this.evaluatePrerequisites(sceneData);
    if (!meetsPrerequisites) {
      throw new Error(`Prerequisites not met for scene: ${sceneId}`);
    }
    
    // 3. Traiter les évènements d'entrée
    if (sceneData.entryRewards) {
      await RewardProcessor.applyRewards(sceneData.entryRewards);
    }
    
    // 4. Évaluer les évènements conditionnels
    const processedScene = this.processConditionalContent(sceneData);
    
    // 5. Ajouter à l'historique
    this.addToHistory(sceneId);
    
    // 6. Auto-sauvegarde si nécessaire
    if (sceneData.autoSave) {
      await this.gameStore.actions.autoSave();
    }
    
    this.currentScene = processedScene;
    return processedScene;
  }
  
  async makeChoice(choiceId: ChoiceId): Promise<void> {
    if (!this.currentScene) {
      throw new Error('No active scene');
    }
    
    const choice = this.findChoice(choiceId);
    if (!choice) {
      throw new Error(`Choice not found: ${choiceId}`);
    }
    
    // 1. Vérifier les prérequis du choix
    const canMakeChoice = ChoiceValidator.validateChoice(choice);
    if (!canMakeChoice) {
      throw new Error('Choice requirements not met');
    }
    
    // 2. Résoudre les jets de compétence si nécessaire
    let skillCheckResult: SkillCheckResult | null = null;
    if (choice.skillCheck) {
      skillCheckResult = await SkillCheckResolver.resolve(choice.skillCheck);
    }
    
    // 3. Appliquer les récompenses immédiates
    if (choice.rewards) {
      await RewardProcessor.applyRewards(choice.rewards);
    }
    
    // 4. Déterminer les conséquences
    const consequences = this.determineConsequences(choice, skillCheckResult);
    
    // 5. Exécuter les transitions
    for (const consequence of consequences) {
      await TransitionManager.executeTransition(consequence);
    }
  }
  
  private evaluatePrerequisites(scene: Scene): boolean {
    if (!scene.prerequisites) return true;
    
    return scene.prerequisites.every(condition => 
      ConditionEvaluator.evaluate(condition)
    );
  }
  
  private processConditionalContent(scene: Scene): Scene {
    // Traitement des évènements conditionnels
    // Ajout/suppression de choix selon l'état du jeu
    const processedScene = { ...scene };
    
    if (isNarrativeScene(scene) && scene.conditionalEvents) {
      for (const event of scene.conditionalEvents) {
        if (ConditionEvaluator.evaluate(event.condition)) {
          // Appliquer les effets de l'évènement
          processedScene.description += `\n\n${event.text}`;
          
          if (event.effects) {
            for (const effect of event.effects) {
              this.applySceneEffect(processedScene, effect);
            }
          }
        }
      }
    }
    
    return processedScene;
  }
}
```

#### 4.3 - Système de Jets de Compétence (Semaine 4)

**Résolution complète :**
```typescript
// SkillCheckResolver.ts
export class SkillCheckResolver {
  static async resolve(skillCheck: SkillCheck): Promise<SkillCheckResult> {
    const character = this.gameStore.getState().character.activeCharacter;
    if (!character) throw new Error('No active character');
    
    // 1. Calculer le modificateur total
    const abilityMod = character.getAbilityModifier(skillCheck.ability);
    const skillMod = skillCheck.skill ? 
      character.skills[skillCheck.skill] : 0;
    const proficiencyBonus = character.proficiencyBonus;
    
    const totalModifier = abilityMod + 
      (character.isProficient(skillCheck.skill) ? proficiencyBonus : 0) + 
      skillMod;
    
    // 2. Effectuer le jet
    const rollType = this.determineRollType(skillCheck);
    const diceRoll = this.rollD20(rollType);
    const totalRoll = diceRoll + totalModifier;
    
    // 3. Déterminer le résultat
    const success = totalRoll >= skillCheck.difficultyClass;
    const criticalSuccess = diceRoll === 20;
    const criticalFailure = diceRoll === 1;
    
    // 4. Créer le résultat détaillé
    const result: SkillCheckResult = {
      skillCheck,
      diceRoll,
      totalModifier,
      totalRoll,
      success,
      criticalSuccess,
      criticalFailure,
      margin: totalRoll - skillCheck.difficultyClass
    };
    
    // 5. Afficher les résultats à l'utilisateur
    await this.displaySkillCheckResult(result);
    
    return result;
  }
  
  private static rollD20(type: 'normal' | 'advantage' | 'disadvantage'): number {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    
    if (type === 'normal') return roll1;
    
    const roll2 = Math.floor(Math.random() * 20) + 1;
    return type === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
  }
  
  private static async displaySkillCheckResult(result: SkillCheckResult): Promise<void> {
    const { skillCheck, diceRoll, totalModifier, totalRoll, success } = result;
    
    const message = `
      **${skillCheck.skill ? skillCheck.skill.toUpperCase() : skillCheck.ability.toUpperCase()} Check**
      
      🎲 Dé: ${diceRoll}
      ➕ Modificateur: +${totalModifier}
      🎯 Total: ${totalRoll}
      
      DC ${skillCheck.difficultyClass} - ${success ? '✅ RÉUSSIE' : '❌ ÉCHEC'}
      ${result.criticalSuccess ? '🌟 RÉUSSITE CRITIQUE!' : ''}
      ${result.criticalFailure ? '💥 ÉCHEC CRITIQUE!' : ''}
    `;
    
    // Affichage modal ou notification
    await this.gameStore.actions.addNotification(message, success ? 'success' : 'error');
  }
}
```

---

### **PHASE 5 : SYSTÈME D'INVENTAIRE ET ÉQUIPEMENT**
*Durée estimée : 2-3 semaines*
*Objectif : Gestion complète des objets et équipements*

#### 5.1 - Moteur d'Inventaire (Semaine 1)

**Système complet :**
```typescript
// src/systems/inventory/
├── InventoryManager.ts          // Gestion inventaire principal
├── EquipmentHandler.ts          // Équipement/déséquipement
├── WeightCalculator.ts          // Calculs de poids et encombrement
├── ItemValidator.ts             // Validation objets
├── TradeSystem.ts               // Achats/ventes
├── CraftingSystem.ts            // Création d'objets
└── LootDistributor.ts           // Distribution butin
```

**Gestionnaire d'inventaire :**
```typescript
// InventoryManager.ts
export class InventoryManager {
  private gameStore: GameStore;
  
  constructor(gameStore: GameStore) {
    this.gameStore = gameStore;
  }
  
  async addItem(itemId: ItemId, quantity: number = 1): Promise<boolean> {
    const character = this.gameStore.getState().character.activeCharacter;
    if (!character) throw new Error('No active character');
    
    const item = await this.loadItem(itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);
    
    // 1. Vérifier l'espace disponible
    const availableSlots = this.getAvailableSlots(character.inventoryState);
    if (availableSlots < this.calculateRequiredSlots(item, quantity)) {
      this.gameStore.actions.addNotification(
        'Inventaire plein!', 
        'warning'
      );
      return false;
    }
    
    // 2. Vérifier le poids
    const currentWeight = this.calculateTotalWeight(character.inventoryState);
    const itemWeight = item.weight * quantity;
    const maxWeight = this.calculateCarryingCapacity(character);
    
    if (currentWeight + itemWeight > maxWeight) {
      this.gameStore.actions.addNotification(
        'Trop lourd à porter!', 
        'warning'
      );
      return false;
    }
    
    // 3. Empiler avec objets existants si possible
    const existingStack = this.findStackableItem(character.inventoryState, item);
    if (existingStack && this.canStack(item, quantity, existingStack)) {
      existingStack.quantity += quantity;
    } else {
      // Créer nouvelle pile
      const newStack: ItemStack = {
        item,
        quantity,
        equipped: false,
        attuned: false
      };
      character.inventoryState.inventory.slots.push(newStack);
    }
    
    // 4. Mettre à jour le poids total
    character.inventoryState.inventory.currentWeight = 
      this.calculateTotalWeight(character.inventoryState);
    
    // 5. Historique
    const action: InventoryAction = {
      type: 'add',
      itemId,
      quantity,
      timestamp: new Date()
    };
    character.inventoryState.history.push(action);
    
    // 6. Notification
    this.gameStore.actions.addNotification(
      `${item.name} x${quantity} ajouté à l'inventaire`,
      'success'
    );
    
    return true;
  }
  
  async equipItem(itemStackIndex: number, equipmentSlot: EquipmentSlot): Promise<boolean> {
    const character = this.gameStore.getState().character.activeCharacter;
    if (!character) throw new Error('No active character');
    
    const itemStack = character.inventoryState.inventory.slots[itemStackIndex];
    if (!itemStack) throw new Error('Item stack not found');
    
    // 1. Vérifier si l'objet peut être équipé
    const validation = this.validateEquipment(character, itemStack.item, equipmentSlot);
    if (!validation.canEquip) {
      this.gameStore.actions.addNotification(
        `Impossible d'équiper: ${validation.reasons.join(', ')}`,
        'error'
      );
      return false;
    }
    
    // 2. Déséquiper l'objet actuellement dans le slot
    const currentlyEquipped = character.inventoryState.equipment[equipmentSlot];
    if (currentlyEquipped) {
      await this.unequipItem(equipmentSlot);
    }
    
    // 3. Équiper le nouvel objet
    character.inventoryState.equipment[equipmentSlot] = itemStack.item;
    itemStack.equipped = true;
    
    // 4. Gérer l'harmonisation si nécessaire
    if (this.requiresAttunement(itemStack.item)) {
      const attunedCount = character.inventoryState.attunedItems.size;
      if (attunedCount >= 3) {
        // Demander quel objet désharmoniser
        const deattunedItem = await this.promptDeattunement(character);
        if (deattunedItem) {
          character.inventoryState.attunedItems.delete(deattunedItem);
        } else {
          return false; // Annulation
        }
      }
      
      character.inventoryState.attunedItems.add(itemStack.item.id);
      itemStack.attuned = true;
    }
    
    // 5. Recalculer les bonus
    this.recalculateEquipmentBonuses(character);
    
    // 6. Historique et notification
    const action: InventoryAction = {
      type: 'equip',
      itemId: itemStack.item.id,
      targetSlot: equipmentSlot,
      timestamp: new Date()
    };
    character.inventoryState.history.push(action);
    
    this.gameStore.actions.addNotification(
      `${itemStack.item.name} équipé`,
      'success'
    );
    
    return true;
  }
  
  private validateEquipment(
    character: Character, 
    item: Item, 
    slot: EquipmentSlot
  ): EquipmentValidation {
    const reasons: string[] = [];
    
    // Vérifier le type d'objet vs slot
    if (!this.isCompatibleSlot(item, slot)) {
      reasons.push('Type d\'objet incompatible avec ce slot');
    }
    
    // Vérifier les prérequis de niveau
    if (item.requirements?.minimumLevel && character.level < item.requirements.minimumLevel) {
      reasons.push(`Niveau ${item.requirements.minimumLevel} requis`);
    }
    
    // Vérifier les prérequis de classe
    if (item.requirements?.requiredClass && 
        !item.requirements.requiredClass.includes(character.class)) {
      reasons.push('Classe non autorisée');
    }
    
    // Vérifier les caractéristiques requises
    if (item.requirements?.requiredAbilityScores) {
      for (const [ability, required] of Object.entries(item.requirements.requiredAbilityScores)) {
        const current = character.finalStats[ability as Ability];
        if (current < required) {
          reasons.push(`${ability.toUpperCase()} ${required} requis (actuel: ${current})`);
        }
      }
    }
    
    // Vérifier les maîtrises
    if (item.requirements?.requiredProficiency) {
      const hasProficiency = item.requirements.requiredProficiency.some(prof => 
        character.proficiencies?.weapons?.includes(prof) ||
        character.proficiencies?.armor?.includes(prof)
      );
      
      if (!hasProficiency) {
        reasons.push('Maîtrise requise non possédée');
      }
    }
    
    return {
      canEquip: reasons.length === 0,
      reasons,
      requirements: item.requirements
    };
  }
}
```

#### 5.2 - Interface Inventaire (Semaine 2)

**Composants d'inventaire :**
```typescript
// src/components/Inventory/
├── InventoryScreen.tsx          // Écran principal
├── InventoryGrid.tsx            // Grille d'objets
├── ItemSlot.tsx                 // Slot individuel
├── EquipmentPaper.tsx           // "Poupée" d'équipement
├── ItemDetails.tsx              // Détails d'objet
├── ItemTooltip.tsx              // Info-bulle
├── WeightIndicator.tsx          // Indicateur de poids
├── FilterPanel.tsx              // Filtres et recherche
└── TradeInterface.tsx           // Interface d'échange
```

**Interface drag & drop :**
```typescript
// InventoryGrid.tsx
export const InventoryGrid: React.FC<InventoryGridProps> = ({ 
  inventory, 
  onItemMove, 
  onItemUse,
  onItemEquip 
}) => {
  
  const [draggedItem, setDraggedItem] = useState<ItemStack | null>(null);
  const [filter, setFilter] = useState<ItemFilter>({});
  
  // Filtrage des objets
  const filteredItems = useMemo(() => {
    return inventory.slots.filter(stack => {
      if (filter.type && !filter.type.includes(stack.item.type)) return false;
      if (filter.rarity && !filter.rarity.includes(stack.item.rarity)) return false;
      if (filter.equipped !== undefined && stack.equipped !== filter.equipped) return false;
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        return stack.item.name.toLowerCase().includes(searchLower) ||
               stack.item.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [inventory.slots, filter]);
  
  const handleDragStart = (item: ItemStack, sourceIndex: number) => {
    setDraggedItem(item);
  };
  
  const handleDrop = (targetIndex: number) => {
    if (!draggedItem) return;
    
    onItemMove(draggedItem, targetIndex);
    setDraggedItem(null);
  };
  
  return (
    <div className="inventory-grid">
      
      {/* Filtres et recherche */}
      <FilterPanel filter={filter} onFilterChange={setFilter} />
      
      {/* Indicateur de poids */}
      <WeightIndicator 
        current={inventory.currentWeight}
        maximum={inventory.weightCapacity}
      />
      
      {/* Grille d'objets */}
      <div className="grid grid-cols-8 gap-2 p-4">
        {Array.from({ length: inventory.maxSlots }, (_, index) => {
          const stack = filteredItems[index];
          
          return (
            <ItemSlot
              key={index}
              stack={stack}
              index={index}
              isDraggedOver={/* logic */}
              onDragStart={() => stack && handleDragStart(stack, index)}
              onDrop={() => handleDrop(index)}
              onDoubleClick={() => stack && onItemUse(stack)}
              onRightClick={() => stack && showContextMenu(stack)}
            />
          );
        })}
      </div>
      
      {/* Menu contextuel */}
      {contextMenu && (
        <ItemContextMenu
          item={contextMenu.item}
          position={contextMenu.position}
          onEquip={() => onItemEquip(contextMenu.item)}
          onUse={() => onItemUse(contextMenu.item)}
          onDrop={() => onItemDrop(contextMenu.item)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
```

#### 5.3 - Système de Commerce (Semaine 3)

**Interface de commerce :**
```typescript
// TradeSystem.ts
export class TradeSystem {
  static async initiateTrade(merchantId: string): Promise<TradeSession> {
    const merchant = await this.loadMerchant(merchantId);
    const character = this.gameStore.getState().character.activeCharacter;
    
    return {
      merchant,
      playerItems: character.inventoryState.inventory.slots,
      merchantItems: merchant.inventory,
      playerGold: this.getPlayerGold(character),
      disposition: merchant.disposition,
      haggling: merchant.haggling
    };
  }
  
  static async attemptPurchase(
    item: MerchantItem, 
    quantity: number = 1
  ): Promise<PurchaseResult> {
    
    const totalCost = item.price * quantity;
    const character = this.gameStore.getState().character.activeCharacter;
    const playerGold = this.getPlayerGold(character);
    
    // 1. Vérifier les fonds
    if (playerGold < totalCost) {
      return {
        success: false,
        reason: 'Fonds insuffisants',
        cost: totalCost,
        playerGold
      };
    }
    
    // 2. Vérifier la disponibilité
    if (item.quantity < quantity) {
      return {
        success: false,
        reason: 'Stock insuffisant',
        available: item.quantity
      };
    }
    
    // 3. Vérifier l'espace d'inventaire
    const canFit = await InventoryManager.canAddItem(item.itemId, quantity);
    if (!canFit) {
      return {
        success: false,
        reason: 'Inventaire plein'
      };
    }
    
    // 4. Effectuer la transaction
    await this.deductGold(character, totalCost);
    await InventoryManager.addItem(item.itemId, quantity);
    
    // 5. Mettre à jour le stock marchand
    item.quantity -= quantity;
    
    // 6. Améliorer la réputation si applicable
    this.improveReputation(merchantId, totalCost);
    
    return {
      success: true,
      item,
      quantity,
      totalCost,
      newPlayerGold: this.getPlayerGold(character)
    };
  }
  
  static async attemptHaggling(
    item: MerchantItem,
    merchant: MerchantData
  ): Promise<HagglingResult> {
    
    if (!merchant.haggling?.enabled) {
      return { success: false, reason: 'Marchandage non autorisé' };
    }
    
    const character = this.gameStore.getState().character.activeCharacter;
    
    // Jet de Persuasion vs DC du marchand
    const skillCheck: SkillCheck = {
      ability: merchant.haggling.skillCheck,
      skill: 'persuasion',
      difficultyClass: merchant.haggling.difficultyClass
    };
    
    const result = await SkillCheckResolver.resolve(skillCheck);
    
    if (result.success) {
      // Calculer la remise (basée sur la marge de réussite)
      const margin = Math.max(0, result.margin);
      const discountPercent = Math.min(
        merchant.haggling.maxDiscount,
        5 + margin * 2 // 5% base + 2% par point de marge
      );
      
      const originalPrice = item.price;
      const newPrice = Math.ceil(originalPrice * (100 - discountPercent) / 100);
      
      return {
        success: true,
        originalPrice,
        newPrice,
        discountPercent,
        discountAmount: originalPrice - newPrice
      };
    } else {
      // Échec : peut empirer les relations
      if (result.criticalFailure) {
        this.worsenReputation(merchant.id, 'haggling_failure');
        return { 
          success: false, 
          reason: 'Marchandage raté - réputation dégradée' 
        };
      }
      
      return { success: false, reason: 'Marchandage sans effet' };
    }
  }
}
```

---

### **PHASE 6 : PERSISTANCE ET OPTIMISATION**
*Durée estimée : 1-2 semaines*
*Objectif : Sauvegarde complète et optimisations*

#### 6.1 - Système de Sauvegarde Avancé (Semaine 1)

**Gestionnaire de sauvegardes :**
```typescript
// src/systems/save/
├── SaveManager.ts               // Gestionnaire principal
├── GameStateSerializer.ts       // Sérialisation état
├── MigrationManager.ts          // Migrations versions
├── BackupManager.ts             // Sauvegardes automatiques
└── CloudSaveIntegration.ts      // Sync cloud (optionnel)
```

#### 6.2 - Optimisations Performance (Semaine 2)

**Optimisations React :**
- Mémoisation composants lourds
- Lazy loading des modales
- Virtualisation grilles importantes
- Debouncing recherches/filtres

**Optimisations Store :**
- Sélecteurs optimisés
- Splitting des états volumineux
- Cleanup automatique historiques

---

## 🎯 RÉSUMÉ PRIORITÉS

### **Version 1.0 - Gameplay Complet (12-15 semaines)**

1. **Interface Utilisateur** (3-4 sem) - *Critique*
2. **Base de Données** (2-3 sem) - *Haute*
3. **Système Combat** (4-5 sem) - *Critique*
4. **Système Scènes** (3-4 sem) - *Critique*
5. **Inventaire** (2-3 sem) - *Moyenne*
6. **Persistance** (1-2 sem) - *Haute*

### **Version 0.5 - MVP Jouable (6-8 semaines)**

1. **Interface basique** (2 sem)
2. **3-5 scènes narratives** (1 sem)
3. **Combat simple** (2 sem)
4. **Inventaire minimal** (1 sem)

---

## 🔧 ARCHITECTURE TECHNIQUE

### **Nouvelles Dépendances Recommandées**
```json
{
  "@dnd-kit/core": "^6.0.8",         // Drag & drop moderne
  "@dnd-kit/sortable": "^7.0.2",     // Tri drag & drop
  "framer-motion": "^10.16.0",       // Animations fluides
  "react-hotkeys-hook": "^4.4.1",    // Raccourcis clavier
  "react-window": "^1.8.8",          // Virtualisation listes
  "fuse.js": "^6.6.2",               // Recherche floue
  "react-spring": "^9.7.0",          // Animations avancées
  "workbox-webpack-plugin": "^7.0.0" // Cache et PWA
}
```

### **Structure Finale du Projet**
```
src/
├── components/           # Interface utilisateur
├── systems/             # Logique métier
├── data/               # Données de jeu
├── stores/             # État global
├── hooks/              # Hooks réutilisables
├── utils/              # Utilitaires
├── assets/             # Images, sons
└── types/              # Types (existant)
```

---

## 📈 MÉTRIQUES DE SUCCÈS

### **Gameplay Jouable Minimum :**
- ✅ Création personnage (sélection prégénéré)
- ✅ 10+ scènes narratives interconnectées
- ✅ Combat fonctionnel (attaque, sorts basiques)
- ✅ Inventaire utilisable (équiper/utiliser objets)
- ✅ Système de repos opérationnel
- ✅ Sauvegarde/chargement
- ✅ 2-3 heures de contenu

### **Gameplay Complet :**
- ✅ Tout le minimum +
- ✅ 50+ scènes avec embranchements
- ✅ Combat tactique avancé (grille, IA)
- ✅ Système de compagnons intégré
- ✅ Commerce et artisanat
- ✅ Progression et level-up
- ✅ 10+ heures de contenu

---

**Votre projet a une base exceptionnelle. Avec ce plan, vous aurez un vrai jeu D&D 5e jouable et extensible !** 🎲🎮