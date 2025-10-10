import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  label, 
  showPercentage = true,
  className = ''
}) => {
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-primary">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-secondary">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-light dark:bg-primary-dark rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

