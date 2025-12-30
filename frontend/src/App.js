import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
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
import FormViewerPage from './components/FormViewerPage';
import AnalyticsDashboardPage from './components/AnalyticsDashboardPage';
import AiChatPage from './components/AiChatPage';

/* ---------------- HOME PAGE ---------------- */

function HomePage() {
  const navigate = useNavigate();

  const bridgeSetPage = (page) => {
    if (page === 'signIn') navigate('/signin');
    if (page === 'signUp') navigate('/signup');
    if (page === 'features') navigate('/features');
    if (page === 'dashboard') navigate('/dashboard');
  };

  return (
    <main>
      <Hero setPage={bridgeSetPage} />
      <Features />
      <Timeline />
      <VideoFeatureSection setCurrentPage={bridgeSetPage} />
      <HoverBarChart />
    </main>
  );
}

/* ---------------- HEADER WRAPPER ---------------- */

function AppHeader({ isAuthenticated, onLogout, theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide header on form viewer page
  if (location.pathname.startsWith('/forms/view/')) return null;

  return (
    <Header
      isAuthenticated={isAuthenticated}
      onLogout={onLogout}
      theme={theme}
      toggleTheme={toggleTheme}
      setPage={(page) => {
        if (page === 'home') navigate('/');
        if (page === 'signIn') navigate('/signin');
        if (page === 'signUp') navigate('/signup');
        if (page === 'dashboard') navigate('/dashboard');
        if (page === 'profile') navigate('/profile');
      }}
    />
  );
}

/* ---------------- MAIN APP ---------------- */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAuthSuccess = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <AppHeader
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/signin"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthPage
                  initialState="signIn"
                  onAuthSuccess={handleAuthSuccess}
                />
              )
            }
          />

          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <AuthPage
                  initialState="signUp"
                  onAuthSuccess={handleAuthSuccess}
                />
              )
            }
          />

          <Route path="/features" element={<AllFeaturesPage />} />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage onLogout={handleLogout} theme={theme} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ProfilePage onLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />

          {/* Form Routes */}
          <Route path="/forms/new" element={<FormEditorPage />} />
          <Route path="/forms/:id/edit" element={<FormEditorPage />} />
          <Route path="/forms/:id" element={<FormViewerPage />} />
          <Route
            path="/forms/:id/analytics"
            element={<AnalyticsDashboardPage />}
          />

          <Route path="/aichat" element={<AiChatPage />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
