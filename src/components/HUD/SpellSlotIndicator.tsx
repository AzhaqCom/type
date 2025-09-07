import type { SpellSlotsByLevel } from '../../core/types/spells';

interface SpellSlotIndicatorProps {
  slots: Partial<SpellSlotsByLevel>;
}

export const SpellSlotIndicator = ({ slots }: SpellSlotIndicatorProps) => {
  if (!slots) return null;
  
  return (
    <div className="flex gap-2">
      {Object.entries(slots).map(([level, count]) => (
        <div key={level} className="text-xs">
          <div className="text-gray-500">Niv {level}</div>
          <div className="flex gap-1">
            {Array.from({ length: count as number }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};