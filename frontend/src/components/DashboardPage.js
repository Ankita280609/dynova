import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, FileIcon, ChartIcon, HelpIcon, SearchIcon, BellIcon, PlusIcon, BarChartIcon, MoreHorizontalIcon, AiBotIcon, ArrowRightIcon, StarIcon, SunIcon, MoonIcon } from './Icons';
import EmailModal from './EmailModal';
import { API_BASE_URL } from '../config';

const DashboardPage = ({ onLogout, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchForms();
  }, [activeTab]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          // userData.bookmarks should be an array of IDs
          setBookmarkedIds(userData.bookmarks || []);
          // Update local storage to keep it fresh (optional)
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    }
  };

  const fetchForms = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let url = `${API_BASE_URL}/forms`;
      if (activeTab === 'bookmarked') {
        url = `${API_BASE_URL}/forms/bookmarked`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch forms');
      const data = await res.json();
      setForms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (e, formId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    // Optimistic update
    const isCurrentlyBookmarked = bookmarkedIds.includes(formId);
    let newBookmarks = [...bookmarkedIds];
    if (isCurrentlyBookmarked) {
      newBookmarks = newBookmarks.filter(id => id !== formId);
    } else {
      newBookmarks.push(formId);
    }
    setBookmarkedIds(newBookmarks);

    try {
      const res = await fetch(`${API_BASE_URL}/forms/${formId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Backend returns the full updated bookmarks array usually
        if (data.bookmarks) setBookmarkedIds(data.bookmarks);

        // If we are in "Bookmarked" tab and we removed it, we should maybe remove it from the list
        if (activeTab === 'bookmarked' && isCurrentlyBookmarked) {
          setForms(prev => prev.filter(f => f._id !== formId));
        }
      } else {
        // Revert on failure
        setBookmarkedIds(bookmarkedIds);
      }
    } catch (err) {
      console.error(err);
      setBookmarkedIds(bookmarkedIds);
    }
  };

  const handleAskTeamClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="dashboard-layout page-fade-in">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo"><Logo />dynova</div>
          <div className="sidebar-user" onClick={() => navigate('/profile')}>
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className="active"><a href="#"><FileIcon /> My Forms</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}><ChartIcon /> Analytics</a></li>
              <li><a href="#" onClick={handleAskTeamClick}><HelpIcon /> Ask Our Team</a></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-left">
              <h2>My Forms</h2>
              <div className="search-bar">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="header-right">
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <button className="notification-btn"><BellIcon /></button>
              <button className="btn-create-form" onClick={() => navigate('/forms/new')}><PlusIcon /> Create New Form</button>
              {onLogout && (
                <button className="btn-logout" onClick={onLogout}>Logout</button>
              )}
            </div>
          </header>

          <div className="dashboard-tabs">
            <a href="#" className={activeTab === 'active' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('active'); }}>Active Forms</a>
            <a href="#" className={activeTab === 'bookmarked' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('bookmarked'); }}>Bookmarked Forms</a>
            <a href="#" className={activeTab === 'previous' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('previous'); }}>Previous Forms</a>
          </div>

          <div className="form-grid">
            {loading ? (
              <p>Loading forms...</p>
            ) : filteredForms.length === 0 ? (
              <div className="empty-state">
                <p>No forms found. Create one to get started!</p>
              </div>
            ) : (
              filteredForms.map(form => (
                <div className="form-card" key={form._id} onClick={() => navigate(`/forms/${form._id}/edit`)}>
                  <div className={`form-card-thumbnail thumb-${(form._id.charCodeAt(0) % 3) + 1}`}></div>
                  <div className="form-card-content">
                    <h3>{form.title}</h3>
                    <p>Last updated: {new Date(form.updatedAt).toLocaleDateString()}</p>
                    <p>{form._count?.responses || 0} Submissions</p>
                    <div className="form-card-actions">
                      <button className="btn-card-view" onClick={(e) => { e.stopPropagation(); navigate(`/forms/${form._id}/edit`); }}>View</button>
                      <button className="btn-card-icon" onClick={(e) => { e.stopPropagation(); navigate(`/forms/${form._id}/analytics`); }}><BarChartIcon /></button>
                      <button className="btn-card-icon" onClick={(e) => handleBookmark(e, form._id)}>
                        <StarIcon filled={bookmarkedIds.includes(form._id)} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <section className="ai-bot-section">
            <div className="ai-bot-icon-wrapper"><AiBotIcon /></div>
            <div className="ai-bot-content">
              <h2>Let AI Build Your Form Smarter</h2>
              <p>Let our AI bot help you brainstorm the right questions for your form in seconds.</p>
            </div>
            <button className="btn-try-now" onClick={() => navigate('/aichat')}>Try Now <ArrowRightIcon /></button>
          </section>
        </main>
      </div>
      {isModalOpen && <EmailModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default DashboardPage;
