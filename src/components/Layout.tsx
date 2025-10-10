import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { useViewMode } from '../contexts/ViewModeContext';
import { useSidebar } from '../contexts/SidebarContext';

const Layout: React.FC = () => {
  const { isDesktop } = useViewMode();
  const { isCollapsed } = useSidebar();

  return (
    <div className="page-container min-h-screen">
      {isDesktop ? (
        <div className="desktop-layout">
          <Sidebar />
          <div 
            className="desktop-content"
            style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
          >
            <Header />
            <main className="desktop-wrapper py-8 pb-8">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="content-wrapper">
            <Outlet />
          </main>
          <Navigation />
        </>
      )}
    </div>
  );
};

export default Layout;

