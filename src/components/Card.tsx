import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-800 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
        hover ? 'cursor-pointer hover:scale-[1.02]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

