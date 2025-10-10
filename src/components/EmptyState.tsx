import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2 text-center">{title}</h3>
      <p className="text-secondary text-center mb-6 max-w-sm">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

