import React from 'react';
import { Sun, Moon, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/RoleContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRole();

  return (
    <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-2xl mx-auto lg:max-w-none px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="w-10 h-10 bg-primary-light dark:bg-primary-dark rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">К</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary">Кружок</h1>
            <p className="text-xs text-secondary capitalize">
              {role === 'student' ? 'Студент' : role === 'curator' ? 'Куратор' : 'Админ'}
            </p>
          </div>
        </div>

        <div className="hidden lg:block flex-1"></div>
        
        <div className="flex items-center gap-3">
          {/* Role Switcher Icons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark">
            <button
              onClick={() => setRole('student')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                role === 'student' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white shadow-lg scale-105' 
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:scale-105 hover:shadow-md'
              }`}
              title="Студент"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRole('curator')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                role === 'curator' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white shadow-lg scale-105' 
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:scale-105 hover:shadow-md'
              }`}
              title="Куратор"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                role === 'admin' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white shadow-lg scale-105' 
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:scale-105 hover:shadow-md'
              }`}
              title="Админ"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="p-1 rounded-xl bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
              title="Переключить тему"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

