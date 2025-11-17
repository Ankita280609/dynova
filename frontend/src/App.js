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
import AuthModal from './components/AuthModal';
import DashboardPage from './components/DashboardPage';
import FormEditorPage from './components/FormEditorPage';
import AiChatPage from './components/AiChatPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalState, setAuthModalState] = useState('closed');

  useEffect(() => {
    if (currentPage !== 'home') window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Header setAuthModalState={setAuthModalState} setPage={setCurrentPage} />
            <main>
              <Hero setAuthModalState={setAuthModalState} setPage={setCurrentPage} />
              <Features />
              <Timeline />
              <VideoFeatureSection setCurrentPage={setCurrentPage} />
              <HoverBarChart />
            </main>
          </>
        );
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

      {authModalState !== 'closed' && (
        <AuthModal initialState={authModalState} closeModal={() => setAuthModalState('closed')} setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
