import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookOpen, TrendingUp, MessageCircle, CheckSquare, BarChart3, Shield } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';

const Navigation: React.FC = () => {
  const { role } = useRole();

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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe z-40">
      <div className="max-w-2xl mx-auto px-2 py-2 flex justify-around items-center">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-primary-light dark:text-primary-dark bg-primary-light/10 dark:bg-primary-dark/10'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-surfaceSecondary-light dark:hover:bg-surfaceSecondary-dark'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

