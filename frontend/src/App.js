import React, { useState, useEffect } from 'react';
import './App.css';

// Components (moved to separate files)
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Timeline from './components/Timeline';
import VideoFeatureSection from './components/VideoFeatureSection';
import HoverBarChart from './components/HoverBarChart';
import AllFeaturesPage from './components/AllFeaturesPage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import FormEditorPage from './components/FormEditorPage';
import AiChatPage from './components/AiChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} setPage={setCurrentPage} />
            <main>
              <Hero setPage={setCurrentPage} />
              <Features />
              <Timeline />
              <VideoFeatureSection setCurrentPage={setCurrentPage} />
              <HoverBarChart />
            </main>
          </>
        );
      case 'signIn':
        return <AuthPage initialState={'signIn'} setPage={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'signUp':
        return <AuthPage initialState={'signUp'} setPage={setCurrentPage} onAuthSuccess={handleAuthSuccess} />;
      case 'features':
        return <AllFeaturesPage setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage setPage={setCurrentPage} />;
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
      {renderPage()}

      {/* Auth modal removed: sign-in / sign-up are full pages now */}
    </div>
  );
}

export default App;
