import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import { EngineerDashboard } from "./components/EngineerDashboard";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { DirectorDashboard } from "./components/DirectorDashboard";
import { ProjectProvider } from "./components/ProjectContext";
import { TestLogin } from "./components/TestLogin";
import { Toaster } from "./components/ui/sonner";

type AppState = 'home' | 'auth' | 'dashboard';
type UserRole = 'engineer' | 'manager' | 'director' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    const p = window.location.pathname;
    if (p === '/login') setCurrentPage('auth');
    if (p === '/test-login') setCurrentPage('auth');
    if (p === '/defects/new') setCurrentPage('home'); // keep home but we'll render modal via URL
  }, []);


  const handleGetStarted = () => {
    try {
      window.history.pushState({}, '', '/login');
    } catch (e) {
      // ignore history errors in some environments
    }
    setCurrentPage('auth');
  };

  const handleLogin = (role: string) => {
    setUserRole(role as UserRole);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'engineer':
        return <EngineerDashboard onLogout={handleLogout} />;
      case 'manager':
        return <ManagerDashboard onLogout={handleLogout} />;
      case 'director':
        return <DirectorDashboard onLogout={handleLogout} />;
      default:
        return <HomePage onGetStarted={handleGetStarted} />;
    }
  };
  const isPlaywright = typeof navigator !== 'undefined' && /Playwright/.test(navigator.userAgent);

  return (
    <ProjectProvider>
      {currentPage === 'home' && <HomePage onGetStarted={handleGetStarted} />}
      {currentPage === 'auth' && <TestLogin />}
      {currentPage === 'dashboard' && renderDashboard()}
      <Toaster />
    </ProjectProvider>
  );
}