import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 active:scale-95',
    secondary: 'bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark text-primary hover:opacity-90 active:scale-95',
    danger: 'bg-red-500 dark:bg-red-600 text-white hover:opacity-90 active:scale-95',
    ghost: 'text-primary hover:bg-surfaceSecondary-light dark:hover:bg-surfaceSecondary-dark active:scale-95',
  };

  const sizeClasses = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

