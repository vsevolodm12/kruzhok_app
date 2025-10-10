import React from 'react';

interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-surfaceSecondary-light dark:text-surfaceSecondary-dark"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary-light dark:text-primary-dark transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;

