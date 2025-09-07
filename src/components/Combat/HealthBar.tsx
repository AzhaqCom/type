interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  showNumbers?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'red' | 'green' | 'blue' | 'yellow';
}

export const HealthBar = ({ 
  current, 
  max, 
  label,
  showNumbers = true,
  size = 'medium',
  color = 'red'
}: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const sizeClasses = {
    small: 'h-4',
    medium: 'h-6',
    large: 'h-8'
  };
  
  const colorClasses = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  };
  
  const getHealthColor = () => {
    if (color !== 'red') return colorClasses[color];
    
    // Dynamic color based on health percentage for red
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-1">
      {label && (
        <div className="text-sm font-medium text-gray-300">{label}</div>
      )}
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${getHealthColor()} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showNumbers && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {current} / {max}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};