import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoleProvider, useRole } from './contexts/RoleContext';
import { SidebarProvider } from './contexts/SidebarContext';
import Layout from './components/Layout';

// Student pages
import StudentHome from './pages/student/Home';
import Schedule from './pages/student/Schedule';
import Homework from './pages/student/Homework';
import Progress from './pages/student/Progress';
import Contact from './pages/student/Contact';

// Curator pages
import CuratorHomework from './pages/curator/CuratorHomework';
import Submissions from './pages/curator/Submissions';
import Reports from './pages/curator/Reports';

// Admin pages
import AdminPanel from './pages/admin/AdminPanel';

const AppRoutes: React.FC = () => {
  const { role } = useRole();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {role === 'student' ? (
          <>
            <Route index element={<StudentHome />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="homework" element={<Homework />} />
            <Route path="progress" element={<Progress />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : role === 'curator' ? (
          <>
            <Route index element={<CuratorHomework />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route index element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RoleProvider>
        <SidebarProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SidebarProvider>
      </RoleProvider>
    </ThemeProvider>
  );
};

export default App;
