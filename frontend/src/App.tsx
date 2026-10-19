import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import MeuBotequimDashboard from './pages/Dashboard';
import { authService } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#dashboard') {
      return 'dashboard';
    }
    return 'landing';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToDashboard = () => {
    window.location.hash = '#dashboard';
    setCurrentView('dashboard');
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const navigateToLanding = () => {
    window.location.hash = '';
    setCurrentView('landing');
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigateToLanding();
  };

  if (currentView === 'dashboard') {
    return <MeuBotequimDashboard onNavigateToLanding={navigateToLanding} />;
  }

  return (
    <LandingPage
      onNavigateToDashboard={navigateToDashboard}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />
  );
};

export default App;
