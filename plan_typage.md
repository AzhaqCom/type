# Plan de Typage - RPG Narratif D&D

## Objectif
Créer une architecture TypeScript complète, solide et scalable pour un RPG narratif basé sur D&D 5e.
**Aucun mock, aucun raccourci, aucun hardcode autorisé.**

## État Actuel
- ✅ Types de base (base.ts, character.ts, stats.ts)
- ✅ Système de sorts (spells.ts, level1Spells.ts)
- ✅ Combat IA (combatAI.ts)
- ✅ Actions de jeu (gameActions.ts)
- ✅ Wizard classe complète niveau 1-3
- ✅ Système de scènes (scenes.ts, transitions.ts)
- ✅ Inventaire et items (inventory.ts, items.ts)

---

## PHASE 1 : Système de Repos (1 semaine)
**Objectif :** Implémenter les mécaniques de repos court et long selon D&D 5e

### Fichier : `src/core/types/rest.ts`
- [x] Architecture finalisée (corrections incohérences + améliorations)
- [x] Créer interface `ShortRest`
  - [x] Récupération HP (Hit Dice)
  - [x] Récupération capacités spécifiques par classe
  - [x] Durée : 1 heure

- [x] Créer interface `LongRest`
  - [x] Récupération HP complète
  - [x] Récupération tous spell slots
  - [x] Récupération toutes capacités
  - [x] Reset des capacités "once per day"
  - [x] Durée : 8 heures

- [x] Créer interface `RestRequirements`
  - [x] Location safety (safe/unsafe)
  - [x] Supplies needed (rations, bedroll)
  - [x] Exhaustion levels

- [x] Créer interface `RestInterruption`
  - [x] Random encounter chance
  - [x] Types d'interruption (combat, theft, weather)
  - [x] Conséquences

### Fichier : `src/systems/rest/restSystem.ts`
- [x] Implémenter `processShortRest(character, location)`
- [x] Implémenter `processLongRest(character, location)`
- [x] Implémenter `rollForInterruption(location, time)`
- [x] Implémenter récupération par classe

### Tests
- [x] Test repos court Wizard (Arcane Recovery)
- [x] Test repos long avec récupération slots
- [x] Test interruption de repos

---

## PHASE 2 : Système de Compagnons (1 semaine)
**Objectif :** Gérer les PNJ alliés qui accompagnent le joueur

### Fichier : `src/core/types/companions.ts`
- [x] Créer interface `Companion extends CombatEntity`
  - [x] Personnalité unique
  - [x] Backstory
  - [x] Classe et niveau

- [x] Créer interface `CompanionRelationship`
  - [x] Loyalty level (-100 à +100)
  - [x] Friendship/Romance status
  - [x] Personal quest

- [x] Créer interface `CompanionDialogue`
  - [x] Dialogue trees
  - [x] Reaction to player choices
  - [x] Banter between companions

- [x] Créer interface `PartyComposition`
  - [x] Max party size (4 recommandé)
  - [x] Formation positions
  - [x] Party synergies

### Fichier : `src/systems/companions/companionManager.ts`
- [x] Implémenter `recruitCompanion(companion)`
- [x] Implémenter `dismissCompanion(companionId)`
- [x] Implémenter `updateRelationship(companionId, change)`
- [x] Implémenter `getPartyBonuses()`

### Fichier : `src/data/companions/`
- [x] Créer 3 compagnons de test
  - [x] Fighter tank
  - [x] Cleric healer
  - [x] Rogue DPS

---

## PHASE 3 : Personnages Pré-générés (1 semaine)
**Objectif :** 12 personnages jouables niveau 1, un par classe

### Fichier : `src/data/pregenerated/pregeneratedCharacters.ts`
- [ ] Créer fonction `createPregeneratedCharacter<T extends DnDClass>(class: T)`

### Personnages à créer
- [x] Wizard - "Aldric le Sage" (FAIT via wizard.ts)
- [ ] Fighter - "Gareth Portelame"
- [ ] Rogue - "Silvia Ombrevoile"
- [ ] Cleric - "Frère Aldwin"
- [ ] Barbarian - "Korg Briseur-d'Os"
- [ ] Bard - "Mélodie Chantelune"
- [ ] Druid - "Willow Murmurefeuille"
- [ ] Monk - "Maître Chen"
- [ ] Paladin - "Sir Roland"
- [ ] Ranger - "Tracker Flèche-Sûre"
- [ ] Sorcerer - "Pyra Cœur-de-Feu"
- [ ] Warlock - "Morgana Pacte-Sombre"

### Pour chaque personnage
- [ ] Stats optimisées pour la classe
- [ ] Background approprié
- [ ] Équipement de départ
- [ ] 2-3 traits de personnalité
- [ ] Motivation/But

---

## PHASE 4 : Moteur de Scènes (2 semaines)
**Objectif :** Système de navigation entre scènes sans retour arrière

### Fichier : `src/core/types/sceneGraph.ts`
- [ ] Créer interface `SceneNode`
  - [ ] Scene data
  - [ ] Available choices
  - [ ] Requirements

- [ ] Créer interface `SceneEdge`
  - [ ] From scene
  - [ ] To scene
  - [ ] Transition conditions

- [ ] Créer interface `SceneHistory`
  - [ ] Visited scenes
  - [ ] Choices made
  - [ ] No backtrack enforcement

### Fichier : `src/systems/scenes/sceneEngine.ts`
- [ ] Implémenter `SceneLoader`
  - [ ] Load scene from data
  - [ ] Validate scene structure
  - [ ] Check prerequisites

- [ ] Implémenter `ChoiceValidator`
  - [ ] Check requirements
  - [ ] Check resources (gold, items)
  - [ ] Check party composition

- [ ] Implémenter `ConsequenceApplier`
  - [ ] Apply XP rewards
  - [ ] Apply item rewards
  - [ ] Update flags/quest state

- [ ] Implémenter `SceneNavigator`
  - [ ] Track current scene
  - [ ] Execute transitions
  - [ ] Prevent backtracking

### Tests
- [ ] Test navigation simple (A→B→C)
- [ ] Test choix avec requirements
- [ ] Test rewards application

---

## PHASE 5 : Les 11 Classes Restantes (3 semaines)
**Objectif :** Données complètes niveau 1-3 pour chaque classe

### Fighter - `src/data/classes/fighter.ts`
- [ ] Stats de base (d10 HD, saves STR/CON)
- [ ] Fighting Style (niveau 1)
- [ ] Second Wind (niveau 1)
- [ ] Action Surge (niveau 2)
- [ ] Martial Archetype (niveau 3)
  - [ ] Champion
  - [ ] Battle Master
  - [ ] Eldritch Knight

### Rogue - `src/data/classes/rogue.ts`
- [ ] Stats de base (d8 HD, saves DEX/INT)
- [ ] Sneak Attack (niveau 1)
- [ ] Thieves' Cant (niveau 1)
- [ ] Cunning Action (niveau 2)
- [ ] Roguish Archetype (niveau 3)
  - [ ] Thief
  - [ ] Assassin
  - [ ] Arcane Trickster

### Cleric - `src/data/classes/cleric.ts`
- [ ] Stats de base (d8 HD, saves WIS/CHA)
- [ ] Divine Domain (niveau 1)
  - [ ] Life
  - [ ] Light
  - [ ] War
- [ ] Channel Divinity (niveau 2)
- [ ] Domain features

### Barbarian - `src/data/classes/barbarian.ts`
- [ ] Stats de base (d12 HD, saves STR/CON)
- [ ] Rage (niveau 1)
- [ ] Unarmored Defense (niveau 1)
- [ ] Reckless Attack (niveau 2)
- [ ] Primal Path (niveau 3)
  - [ ] Berserker
  - [ ] Totem Warrior

### Bard - `src/data/classes/bard.ts`
- [ ] Stats de base (d8 HD, saves DEX/CHA)
- [ ] Bardic Inspiration (niveau 1)
- [ ] Jack of All Trades (niveau 2)
- [ ] Bard College (niveau 3)
  - [ ] Lore
  - [ ] Valor

### Druid - `src/data/classes/druid.ts`
- [ ] Stats de base (d8 HD, saves INT/WIS)
- [ ] Druidic (niveau 1)
- [ ] Wild Shape (niveau 2)
- [ ] Druid Circle (niveau 2)
  - [ ] Land
  - [ ] Moon

### Monk - `src/data/classes/monk.ts`
- [ ] Stats de base (d8 HD, saves STR/DEX)
- [ ] Martial Arts (niveau 1)
- [ ] Ki (niveau 2)
- [ ] Monastic Tradition (niveau 3)
  - [ ] Open Hand
  - [ ] Shadow

### Paladin - `src/data/classes/paladin.ts`
- [ ] Stats de base (d10 HD, saves WIS/CHA)
- [ ] Divine Sense (niveau 1)
- [ ] Lay on Hands (niveau 1)
- [ ] Fighting Style (niveau 2)
- [ ] Divine Smite (niveau 2)
- [ ] Sacred Oath (niveau 3)
  - [ ] Devotion
  - [ ] Vengeance

### Ranger - `src/data/classes/ranger.ts`
- [ ] Stats de base (d10 HD, saves STR/DEX)
- [ ] Favored Enemy (niveau 1)
- [ ] Natural Explorer (niveau 1)
- [ ] Fighting Style (niveau 2)
- [ ] Ranger Archetype (niveau 3)
  - [ ] Hunter
  - [ ] Beast Master

### Sorcerer - `src/data/classes/sorcerer.ts`
- [ ] Stats de base (d6 HD, saves CON/CHA)
- [ ] Sorcerous Origin (niveau 1)
  - [ ] Draconic Bloodline
  - [ ] Wild Magic
- [ ] Font of Magic (niveau 2)
- [ ] Metamagic (niveau 3)

### Warlock - `src/data/classes/warlock.ts`
- [ ] Stats de base (d8 HD, saves WIS/CHA)
- [ ] Otherworldly Patron (niveau 1)
  - [ ] Fiend
  - [ ] Great Old One
  - [ ] Archfey
- [ ] Pact Magic
- [ ] Eldritch Invocations (niveau 2)
- [ ] Pact Boon (niveau 3)

---

## PHASE 6 : State Management Global (1 semaine)
**Objectif :** Stores Zustand pour gérer l'état global

### Fichier : `src/stores/gameStore.ts`
- [ ] Créer store principal
  - [ ] Current scene
  - [ ] Scene history
  - [ ] Party composition
  - [ ] Global flags
  - [ ] Quest states

### Fichier : `src/stores/combatStore.ts`
- [ ] Créer store de combat
  - [ ] Active combat state
  - [ ] Turn order
  - [ ] Entity positions
  - [ ] Combat log
  - [ ] Action queue

### Fichier : `src/stores/uiStore.ts`
- [ ] Créer store UI
  - [ ] Active modals
  - [ ] Notification queue
  - [ ] Tooltip state
  - [ ] Selected entity

### Fichier : `src/stores/characterStore.ts`
- [ ] Créer store personnage
  - [ ] Active character
  - [ ] Character progression
  - [ ] Inventory state
  - [ ] Spell preparation

---

## PHASE 7 : Système de Mort/Inconscience (3 jours)
**Objectif :** Règles D&D pour mort et stabilisation

### Fichier : `src/core/types/death.ts`
- [ ] Créer interface `DeathSaves`
  - [ ] Successes (0-3)
  - [ ] Failures (0-3)
  - [ ] Stabilized state

- [ ] Créer interface `UnconsciousState`
  - [ ] Cause (damage, sleep, etc.)
  - [ ] Duration
  - [ ] Can be woken

- [ ] Créer interface `ReviveOptions`
  - [ ] Healing magic
  - [ ] Medicine check
  - [ ] Healer's kit

### Fichier : `src/systems/death/deathSystem.ts`
- [ ] Implémenter `rollDeathSave(character)`
- [ ] Implémenter `stabilizeCharacter(character, method)`
- [ ] Implémenter `reviveCharacter(character, method)`

---

## PHASE 8 : UI State pour Modals (3 jours)
**Objectif :** Types pour gérer les modals de l'interface

### Fichier : `src/core/types/ui.ts`
- [ ] Créer enum `ModalType`
  - [ ] CHARACTER_SHEET
  - [ ] INVENTORY
  - [ ] SPELLBOOK
  - [ ] COMPANIONS
  - [ ] REST
  - [ ] LEVEL_UP

- [ ] Créer interface `ModalState`
  - [ ] Type
  - [ ] Is open
  - [ ] Data context
  - [ ] Previous modal (for stacking)

- [ ] Créer interface `NotificationQueue`
  - [ ] Message
  - [ ] Type (info, warning, error, success)
  - [ ] Duration
  - [ ] Actions

### Fichier : `src/systems/ui/modalManager.ts`
- [ ] Implémenter `openModal(type, data)`
- [ ] Implémenter `closeModal()`
- [ ] Implémenter `stackModal(type, data)`
- [ ] Implémenter `showNotification(message, type)`

---

## Validation Finale
- [ ] Tous les types compilent sans erreur
- [ ] Aucun `any` non justifié
- [ ] Tests unitaires pour chaque système
- [ ] Documentation TSDoc complète
- [ ] Pas de dépendances circulaires

## Notes
- **Temps estimé total :** 10 semaines
- **Priorité :** Qualité > Rapidité
- **Principe :** Aucun raccourci, tout doit être scalable
- **Revue :** Chaque phase doit être validée avant de passer à la suivante