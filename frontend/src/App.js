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

import Footer from './components/Footer';

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
      <Footer />
    </main>
  );
}

/* ---------------- HEADER WRAPPER ---------------- */

function ThemeManager({ theme }) {
  const location = useLocation();

  useEffect(() => {
    const darkRoutes = ['/', '/signin', '/signup'];
    if (darkRoutes.includes(location.pathname)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, location.pathname]);

  return null;
}

function AppHeader({ isAuthenticated, onLogout, theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide global header on specialized pages that have their own headers
  const hideHeaderRegex = /^\/(forms|analytics|aichat|dashboard|profile)/;
  if (hideHeaderRegex.test(location.pathname)) return null;

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <Header
      isAuthenticated={isAuthenticated}
      onLogout={onLogout}
      theme={theme}
      toggleTheme={toggleTheme}
      isHomePage={isHomePage}
      isAuthPage={isAuthPage}
      setPage={(page) => {
        if (page === 'home') navigate('/');
        if (page === 'signIn') navigate('/signin');
        if (page === 'signUp') navigate('/signup');
        if (page === 'dashboard') navigate('/dashboard');
        if (page === 'profile') navigate('/profile');
        if (page === 'analytics') navigate('/analytics');
      }}
    />
  );
}

/* ---------------- MAIN APP ---------------- */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const [theme, setTheme] = useState('light');

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
        <ThemeManager theme={theme} />
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
                <DashboardPage
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
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
          <Route path="/forms/new" element={<FormEditorPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/forms/:id/edit" element={<FormEditorPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/forms/:id" element={<FormViewerPage theme={theme} toggleTheme={toggleTheme} setTheme={setTheme} />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route
            path="/forms/:id/analytics"
            element={<AnalyticsDashboardPage theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route path="/aichat" element={<AiChatPage theme={theme} toggleTheme={toggleTheme} />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
