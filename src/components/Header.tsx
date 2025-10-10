import React from 'react';
import { Sun, Moon, GraduationCap, BookOpen, Shield, Monitor, Smartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/RoleContext';
import { useViewMode } from '../contexts/ViewModeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRole();
  const { viewMode, setViewMode, isDesktop } = useViewMode();

  const cycleViewMode = () => {
    const modes: Array<'auto' | 'desktop' | 'mobile'> = ['auto', 'desktop', 'mobile'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const getViewModeIcon = () => {
    if (viewMode === 'desktop') return <Monitor className="w-5 h-5" />;
    if (viewMode === 'mobile') return <Smartphone className="w-5 h-5" />;
    return isDesktop ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />;
  };

  const getViewModeLabel = () => {
    if (viewMode === 'auto') return 'Авто';
    if (viewMode === 'desktop') return 'Desktop';
    return 'Mobile';
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
      <div className={`${isDesktop ? 'desktop-content' : 'max-w-2xl mx-auto'} px-4 lg:px-8 py-3 flex items-center justify-between`}>
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
          {/* View Mode Toggle (dev only) */}
          <div className="p-1 rounded-xl bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark">
            <button
              onClick={cycleViewMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
              title={`Режим: ${getViewModeLabel()}`}
            >
              {getViewModeIcon()}
              <span className="text-xs font-medium text-primary hidden sm:inline">
                {getViewModeLabel()}
              </span>
            </button>
          </div>

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

