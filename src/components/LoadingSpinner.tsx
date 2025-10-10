import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', fullscreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} border-4 border-surfaceSecondary-light dark:border-surfaceSecondary-dark border-t-primary-light dark:border-t-primary-dark rounded-full animate-spin`} />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background-light dark:bg-background-dark flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;

