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
      className={`card p-5 shadow-card-light dark:shadow-card-dark ${
        hover ? 'card-hover cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

