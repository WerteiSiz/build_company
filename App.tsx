import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import { EngineerDashboard } from "./components/EngineerDashboard";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { DirectorDashboard } from "./components/DirectorDashboard";
import { ProjectProvider } from "./components/ProjectContext";
import { Toaster } from "./components/ui/sonner";

type AppState = 'home' | 'auth' | 'dashboard';
type UserRole = 'engineer' | 'manager' | 'director' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleGetStarted = () => {
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

  return (
    <ProjectProvider>
      {currentPage === 'home' && <HomePage onGetStarted={handleGetStarted} />}
      {currentPage === 'auth' && <AuthPage onLogin={handleLogin} onBack={handleBackToHome} />}
      {currentPage === 'dashboard' && renderDashboard()}
      <Toaster />
    </ProjectProvider>
  );
}