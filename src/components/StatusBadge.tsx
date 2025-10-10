import React from 'react';

type Status = 'not-submitted' | 'pending' | 'reviewed' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusColors = {
    'not-submitted': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    'reviewed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'success': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'warning': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    'error': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const defaultLabels = {
    'not-submitted': 'Не сдано',
    'pending': 'На проверке',
    'reviewed': 'Проверено',
    'success': 'Успешно',
    'warning': 'Внимание',
    'error': 'Ошибка',
  };

  const displayLabel = label || defaultLabels[status];

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[status]}`}>
      {displayLabel}
    </span>
  );
};

export default StatusBadge;

