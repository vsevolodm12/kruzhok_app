import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookOpen, TrendingUp, MessageCircle, CheckSquare, BarChart3, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar: React.FC = () => {
  const { role } = useRole();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  const studentLinks = [
    { to: '/', icon: Home, label: 'Главная' },
    { to: '/schedule', icon: Calendar, label: 'Расписание' },
    { to: '/homework', icon: BookOpen, label: 'Домашки' },
    { to: '/progress', icon: TrendingUp, label: 'Прогресс' },
    { to: '/contact', icon: MessageCircle, label: 'Связь' },
  ];

  const curatorLinks = [
    { to: '/', icon: BookOpen, label: 'Домашки' },
    { to: '/submissions', icon: CheckSquare, label: 'Сдачи' },
    { to: '/reports', icon: BarChart3, label: 'Отчёты' },
  ];

  const adminLinks = [
    { to: '/', icon: Shield, label: 'Админ-панель' },
  ];

  const links = role === 'student' ? studentLinks : role === 'curator' ? curatorLinks : adminLinks;

  return (
    <aside 
      className={`hidden lg:flex desktop-sidebar bg-surface-light dark:bg-surface-dark flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className={`p-6 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">К</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-primary">Кружок</h1>
              <p className="text-xs text-secondary capitalize">
                {role === 'student' ? 'Студент' : role === 'curator' ? 'Куратор' : 'Админ'}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={isCollapsed ? label : ''}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-light dark:bg-primary-dark text-white shadow-lg'
                    : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-surfaceSecondary-light dark:hover:bg-surfaceSecondary-dark'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={toggleCollapsed}
          className="w-full p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-primary" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-primary" />
              <span className="text-xs text-secondary">Свернуть</span>
            </>
          )}
        </button>
        {!isCollapsed && (
          <div className="mt-4 p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl">
            <p className="text-xs text-secondary text-center">
              © 2025 Кружок Станкевича
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

