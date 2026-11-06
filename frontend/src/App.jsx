import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { NotificationProvider } from './context/NotificationContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AttendancePage from './pages/attendance/AttendancePage';
import TimetablePage from './pages/timetable/TimetablePage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import AIAssistantPage from './pages/assistant/AIAssistantPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';

import './App.css';

function MainAppShell() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (isLoading) {
    return <LoadingSpinner fullPage label="Initializing StudentAI Portal..." size={36} />;
  }

  // Unauthenticated user -> Show Login or Registration
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onNavigateToLogin={() => setAuthView('login')}
          onRegisterSuccess={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onNavigateToRegister={() => setAuthView('register')}
        onLoginSuccess={() => setActivePage('Dashboard')}
      />
    );
  }

  // Render role-specific or generic page
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'Dashboard':
        if (role === 'faculty') return <FacultyDashboard onNavigate={setActivePage} />;
        if (role === 'parent') return <ParentDashboard onNavigate={setActivePage} />;
        if (role === 'admin') return <AdminDashboard onNavigate={setActivePage} />;
        return <StudentDashboard onNavigate={setActivePage} />;

      case 'Attendance':
        return <AttendancePage />;

      case 'Timetable':
        return <TimetablePage />;

      case 'Assignments':
        return <AssignmentsPage />;

      case 'AI Assistant':
        return <AIAssistantPage />;

      case 'Reports':
        return <ReportsPage />;

      case 'Settings':
        return <SettingsPage />;

      case 'Students':
      case 'Faculty':
        return <FacultyDashboard onNavigate={setActivePage} />;

      case 'Universities':
        return <AdminDashboard onNavigate={setActivePage} />;

      default:
        return <StudentDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        searchFilter={searchQuery}
      />

      <div className="main-panel">
        <Topbar
          activePage={activePage}
          onOpenSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigate={setActivePage}
        />

        <main className="page-content">
          {renderCurrentPage()}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <MainAppShell />
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
