import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../contexts/SidebarContext';

const Layout: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <Sidebar />
        <div 
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
        >
          <Header />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 px-4 py-4 pb-20">
          <Outlet />
        </main>
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;

