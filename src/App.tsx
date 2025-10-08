import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

type User = {
  name: string;
  role: 'engineer' | 'manager' | 'director';
} | null;

type Page = 'home' | 'login' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User>(null);

  const handleLogin = (user: { name: string; role: 'engineer' | 'manager' | 'director' }) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const showLogin = () => {
    setCurrentPage('login');
  };

  const goHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        onLogin={showLogin}
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' && (
        <HomePage onLogin={showLogin} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onBack={goHome} />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard userRole={currentUser.role} />
      )}
    </div>
  );
}