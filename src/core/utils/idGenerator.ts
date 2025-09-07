/**
 * Générateur d'IDs uniques pour les entités du jeu
 */

let idCounter = 1;

export function generateId(): string {
  const timestamp = Date.now();
  const counter = idCounter++;
  return `char_${timestamp}_${counter}`;
}

export function generateCompanionId(): string {
  const timestamp = Date.now();
  const counter = idCounter++;
  return `comp_${timestamp}_${counter}`;
}

export function generateItemId(): string {
  const timestamp = Date.now();
  const counter = idCounter++;
  return `item_${timestamp}_${counter}`;
}

export function generateSpellId(): string {
  const timestamp = Date.now();
  const counter = idCounter++;
  return `spell_${timestamp}_${counter}`;
}

export function resetIdCounter(): void {
  idCounter = 1;
}