import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Timeline from './components/Timeline';
import VideoFeatureSection from './components/VideoFeatureSection';
import HoverBarChart from './components/HoverBarChart';
import AllFeaturesPage from './components/AllFeaturesPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import FormEditorPage from './components/FormEditorPage';
import AiChatPage from './components/AiChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- 1. NEW: Theme State (Default to 'dark') ---
  const [theme, setTheme] = useState('dark');

  // --- 2. NEW: Effect to apply the theme to the HTML body ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- 3. NEW: The Toggle Function ---
  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'));
  };

  // Existing scroll effect
  useEffect(() => {
    if (currentPage !== 'home') window.scrollTo(0, 0);
  }, [currentPage]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <main>
            <Hero setPage={setCurrentPage} />
            <Features />
            <Timeline />
            <VideoFeatureSection setCurrentPage={setCurrentPage} />
            <HoverBarChart />
          </main>
        );
      case 'signIn':
        return <AuthPage initialState={'signIn'} setPage={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'signUp':
        return <AuthPage initialState={'signUp'} setPage={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'features':
        return <AllFeaturesPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage setPage={setCurrentPage} onLogout={handleLogout} theme={theme} />;
      case 'profile':
        return <ProfilePage setPage={setCurrentPage} onLogout={handleLogout} />;
      case 'formEditor':
        return <FormEditorPage setPage={setCurrentPage} />;
      case 'aiChat':
        return <AiChatPage setPage={setCurrentPage} />;
      default:
        return <h2>Page Not Found</h2>;
    }
  };

  return (
    <div className="App">
      {/* Pass theme & toggleTheme to Header so the button works.
        (Header is only shown when NOT authenticated in your current logic) 
      */}
      {!isAuthenticated && (
        <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          setPage={setCurrentPage} 
          theme={theme}            // <--- Added
          toggleTheme={toggleTheme} // <--- Added
        />
      )}
      
      {renderPage()}
    </div>
  );
}

export default App;