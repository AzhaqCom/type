import type { Spell } from '../../core/types/spells';
import { SpellSchool, SpellContext, SpellTarget } from '../../core/types/spells';
import { DnDClass, DamageType } from '../../core/types/base';

/**
 * Sorts de niveau 1 disponibles pour plusieurs classes
 */

// Sort offensif - Projectile Magique (Magic Missile)
export const projectileMagique: Spell = {
  id: 'spell_projectile_magique',
  name: 'Projectile Magique',
  level: 1,
  school: SpellSchool.EVOCATION,
  castingTime: '1 action',
  range: '36 mètres',
  duration: 'Instantanée',
  components: {
    verbal: true,
    somatic: true,
    material: undefined
  },
  description: `Vous créez trois fléchettes faites d'énergie magique brillante. Chacune touche une créature de votre choix, située à portée et dans votre champ de vision. Une fléchette inflige 1d4+1 dégâts de force à la cible. Toutes les fléchettes frappent leur cible en même temps, sachant que vous pouvez toutes les diriger contre une seule et même créature ou les répartir entre plusieurs.`,
  higherLevels: 'Lorsque vous lancez ce sort en utilisant un emplacement de sort de niveau 2 ou supérieur, le sort crée une fléchette supplémentaire par niveau d\'emplacement au-delà du niveau 1.',
  
  // Dégâts par projectile
  damage: {
    diceCount: 1,
    diceSize: 4,
    bonus: 1,
    type: DamageType.FORCE
  },
  
  // Configuration de jeu
  target: SpellTarget.RANGED_SINGLE,
  contexts: [SpellContext.COMBAT_OFFENSIVE],
  availableToClasses: [
    DnDClass.WIZARD,
    DnDClass.SORCERER,
    DnDClass.WARLOCK  // Via Patron spécifique
  ]
};

// Sort de préparation - Armure de Mage (Mage Armor)
export const armureDeMage: Spell = {
  id: 'spell_armure_de_mage',
  name: 'Armure de Mage',
  level: 1,
  school: SpellSchool.ABJURATION,
  castingTime: '1 action',
  range: 'Contact',
  duration: '8 heures',
  components: {
    verbal: true,
    somatic: true,
    material: 'un morceau de cuir tanné'
  },
  description: `Vous touchez une créature consentante qui ne porte pas d'armure, et une force magique protectrice l'entoure jusqu'à ce que le sort prenne fin. La CA de base de la cible devient 13 + son modificateur de Dextérité. Le sort prend fin si la cible enfile une armure ou si vous le révoquez par une action.`,
  
  // Pas de dégâts pour ce sort
  damage: undefined,
  
  // Configuration de jeu
  target: SpellTarget.TOUCH,
  contexts: [
    SpellContext.PREPARATION,      // Optimal hors combat
    SpellContext.COMBAT_DEFENSIVE  // Utilisable en urgence
  ],
  availableToClasses: [
    DnDClass.WIZARD,
    DnDClass.SORCERER
  ]
};

// Sort utilitaire - Lumière (Light)
export const lumiere: Spell = {
  id: 'spell_lumiere',
  name: 'Lumière',
  level: 0,  // Cantrip
  school: SpellSchool.EVOCATION,
  castingTime: '1 action',
  range: 'Contact',
  duration: '1 heure',
  components: {
    verbal: true,
    somatic: false,
    material: 'une luciole ou de la mousse phosphorescente'
  },
  description: `Vous touchez un objet dont aucune dimension ne dépasse 3 mètres. Jusqu'à la fin du sort, l'objet émet une lumière vive dans un rayon de 6 mètres et une lumière faible sur 6 mètres supplémentaires. La lumière peut être colorée comme vous le voulez. Recouvrir complètement l'objet avec quelque chose d'opaque bloque la lumière. Le sort prend fin si vous le lancez à nouveau ou si vous le révoquez par une action.`,
  
  // Pas de dégâts pour ce sort
  damage: undefined,
  
  // Configuration de jeu
  target: SpellTarget.ENVIRONMENT,  // Cible un objet dans l'environnement
  contexts: [
    SpellContext.UTILITY,
    SpellContext.PREPARATION
  ],
  availableToClasses: [
    DnDClass.WIZARD,
    DnDClass.CLERIC,
    DnDClass.SORCERER,
    DnDClass.BARD
  ]
};

// Sort offensif alternatif - Trait de Feu (Fire Bolt)
export const traitDeFeu: Spell = {
  id: 'spell_trait_de_feu',
  name: 'Trait de Feu',
  level: 0,  // Cantrip
  school: SpellSchool.EVOCATION,
  castingTime: '1 action',
  range: '36 mètres',
  duration: 'Instantanée',
  components: {
    verbal: true,
    somatic: true,
    material: undefined
  },
  description: `Vous lancez un trait enflammé sur une créature ou un objet à portée. Faites une attaque de sort à distance contre la cible. Si vous touchez, elle subit 1d10 dégâts de feu. Si le sort touche un objet inflammable qui n'est ni porté ni transporté, il s'embrase.`,
  higherLevels: 'Les dégâts du sort augmentent de 1d10 lorsque vous atteignez le niveau 5 (2d10), le niveau 11 (3d10) et le niveau 17 (4d10).',
  
  damage: {
    diceCount: 1,
    diceSize: 10,
    bonus: 0,
    type: DamageType.FIRE
  },
  
  // Configuration de jeu
  target: SpellTarget.RANGED_SINGLE,
  contexts: [SpellContext.COMBAT_OFFENSIVE],
  availableToClasses: [
    DnDClass.WIZARD,
    DnDClass.SORCERER
  ]
};

// Collection de tous les sorts de niveau 1
export const level1Spells: Spell[] = [
  projectileMagique,
  armureDeMage
];

// Collection de tous les cantrips
export const cantrips: Spell[] = [
  lumiere,
  traitDeFeu
];

// Export par défaut pour faciliter l'import
export default {
  level1: level1Spells,
  cantrips: cantrips
};