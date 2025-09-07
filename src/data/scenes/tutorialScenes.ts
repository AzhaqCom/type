import type { NarrativeScene, CombatScene } from '../../core/types/scenes';
import { SceneType } from '../../core/types/scenes';

export const SCENE_INTRO: NarrativeScene = {
  id: 'scene_intro',
  type: SceneType.NARRATIVE,
  title: 'Le Début de l\'Aventure',
  description: `Vous vous réveillez dans une taverne poussiéreuse. 
  La dernière chose dont vous vous souvenez est d'avoir accepté 
  une mystérieuse mission d'un étranger encapuchonné.
  
  Un parchemin est posé devant vous avec une carte grossièrement 
  dessinée menant à des ruines anciennes.`,
  text: `Vous vous réveillez dans une taverne poussiéreuse. 
  La dernière chose dont vous vous souvenez est d'avoir accepté 
  une mystérieuse mission d'un étranger encapuchonné.
  
  Un parchemin est posé devant vous avec une carte grossièrement 
  dessinée menant à des ruines anciennes.`,
  
  choices: [
    {
      id: 'choice_examine_map',
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
      id: 'choice_ask_innkeeper',
      text: 'Interroger le tavernier',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_innkeeper_info'
      }]
    },
    {
      id: 'choice_leave_immediately',
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
  text: `En examinant la carte, vous remarquez plusieurs détails :
  - Les ruines sont à une demi-journée de marche au nord
  - Un symbole d'avertissement marque un pont sur la route
  - Des annotations mentionnent des "gardiens de pierre"
  
  Armé de ces informations, vous devez décider de votre approche.`,
  
  choices: [
    {
      id: 'choice_prepare_supplies',
      text: 'Acheter des provisions avant de partir',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_merchant'
      }]
    },
    {
      id: 'choice_go_ruins',
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
  text: `Votre hâte vous a rendu imprudent. 
  Sur la route, trois bandits surgissent des buissons !
  
  "Eh bien, eh bien... Un aventurier solitaire avec 
  une carte au trésor !" ricane leur chef.`,
  
  choices: [
    {
      id: 'choice_fight_bandits',
      text: 'Combattre les bandits',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_combat_bandits'
      }]
    },
    {
      id: 'choice_negotiate',
      text: 'Tenter de négocier',
      consequences: [], // Sera remplacé par skillCheck
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
      id: 'choice_flee',
      text: 'Fuir dans la forêt',
      consequences: [], // Sera remplacé par skillCheck
      skillCheck: {
        ability: 'dexterity',
        skill: 'stealth',
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
  
  enemies: [
    { templateId: 'bandit_leader', count: 1 },
    { templateId: 'bandit', count: 2 }
  ],
  
  victoryScene: 'scene_combat_victory',
  
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

// Scène de victoire après combat
export const SCENE_COMBAT_VICTORY: NarrativeScene = {
  id: 'scene_combat_victory',
  type: SceneType.NARRATIVE,
  title: 'Victoire contre les Bandits !',
  description: `Les bandits gisent au sol, vaincus. Vous essuyez la sueur de votre front et regardez autour de vous.
  
  Le combat a été rude, mais vous avez survécu. Les bandits transportaient quelques pièces d'or et provisions.
  
  La route vers les ruines est maintenant libre.`,
  text: `Les bandits gisent au sol, vaincus. Vous essuyez la sueur de votre front et regardez autour de vous.
  
  Le combat a été rude, mais vous avez survécu. Les bandits transportaient quelques pièces d'or et provisions.
  
  La route vers les ruines est maintenant libre.`,
  
  choices: [
    {
      id: 'choice_loot_bandits',
      text: 'Fouiller les corps des bandits',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_victory'
      }],
      rewards: [{
        type: 'gold',
        amount: 30,
        description: 'Butin des bandits'
      }]
    },
    {
      id: 'choice_continue_journey',
      text: 'Continuer vers les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_ruins_entrance'
      }]
    },
    {
      id: 'choice_rest_heal',
      text: 'Se reposer pour récupérer',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_intro' // Retour temporaire pour MVP
      }],
      rewards: [{
        type: 'xp',
        amount: 100,
        description: 'Combat victorieux'
      }]
    }
  ]
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
  text: `Les bandits sont vaincus ! 
  
  Vous trouvez sur eux :
  - 50 pièces d'or
  - Une potion de soin
  - Une note mentionnant qu'ils surveillaient les ruines pour quelqu'un...
  
  La route vers les ruines est maintenant libre.`,
  
  choices: [
    {
      id: 'choice_continue_ruins',
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
      id: 'choice_return_town',
      text: 'Retourner en ville pour se reposer',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_town_rest'
      }]
    }
  ]
};

export const SCENE_RUINS_ENTRANCE: NarrativeScene = {
  id: 'scene_ruins_entrance',
  type: SceneType.NARRATIVE,
  title: 'Entrée des Ruines',
  description: `Vous voici devant les ruines antiques mentionnées sur la carte.
  Des colonnes de pierre érodées s'élèvent vers le ciel, couvertes de mousse et de lierre.
  
  Une entrée sombre bâille devant vous, mais vous entendez un grondement sourd qui résonne depuis les profondeurs.`,
  text: `Vous voici devant les ruines antiques mentionnées sur la carte.
  Des colonnes de pierre érodées s'élèvent vers le ciel, couvertes de mousse et de lierre.
  
  Une entrée sombre bâille devant vous, mais vous entendez un grondement sourd qui résonne depuis les profondeurs.`,
  
  choices: [
    {
      id: 'choice_enter_ruins',
      text: 'Entrer prudemment dans les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_ruins_interior'
      }]
    },
    {
      id: 'choice_examine_exterior',
      text: 'Examiner l\'extérieur des ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_ruins_exterior'
      }],
      rewards: [{
        type: 'xp',
        amount: 25,
        description: 'Exploration minutieuse'
      }]
    }
  ]
};

export const SCENE_INNKEEPER_INFO: NarrativeScene = {
  id: 'scene_innkeeper_info',
  type: SceneType.NARRATIVE,
  title: 'Information du Tavernier',
  description: `Le tavernier, un homme bedonnant aux cheveux grisonnants, vous regarde avec méfiance.
  
  "Ces ruines ? Personne n'y va plus depuis des années. Trop de voyageurs n'en sont jamais revenus.
  Mais si vous y tenez vraiment, méfiez-vous des bandits sur la route du nord."`,
  text: `Le tavernier, un homme bedonnant aux cheveux grisonnants, vous regarde avec méfiance.
  
  "Ces ruines ? Personne n'y va plus depuis des années. Trop de voyageurs n'en sont jamais revenus.
  Mais si vous y tenez vraiment, méfiez-vous des bandits sur la route du nord."`,
  
  choices: [
    {
      id: 'choice_buy_supplies',
      text: 'Acheter des provisions',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_merchant'
      }]
    },
    {
      id: 'choice_ask_more_details',
      text: 'Demander plus de détails sur les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_detailed_info'
      }],
      rewards: [{
        type: 'flag',
        flagName: 'knows_about_dangers',
        flagValue: true,
        description: 'Informé des dangers'
      }]
    },
    {
      id: 'choice_leave_for_ruins',
      text: 'Partir vers les ruines',
      consequences: [{
        type: 'scene_transition',
        targetScene: 'scene_road_careful'
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
  SCENE_COMBAT_VICTORY,
  SCENE_VICTORY,
  SCENE_RUINS_ENTRANCE,
  SCENE_INNKEEPER_INFO
];