import React, { useState } from 'react';
import { Logo, FileIcon, ChartIcon, HelpIcon, SearchIcon, BellIcon, PlusIcon, BarChartIcon, MoreHorizontalIcon, AiBotIcon, ArrowRightIcon } from './Icons';
import EmailModal from './EmailModal';

const DashboardPage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const forms = [
    { id: 1, title: 'Customer Feedback Survey', updated: '2 days ago', submissions: 128 },
    { id: 2, title: 'Event Registration Form', updated: '1 week ago', submissions: 312 },
    { id: 3, title: 'Website Contact Form', updated: '3 weeks ago', submissions: 88 },
  ];

  const handleAskTeamClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="dashboard-layout page-fade-in">
        <aside className="dashboard-sidebar">
          <div className="sidebar-logo"><Logo />dynova</div>
          <div className="sidebar-user"><div className="user-avatar">AV</div><span className="user-name">Alex Volkov</span></div>
          <nav className="sidebar-nav">
            <ul>
              <li className="active"><a href="#"><FileIcon /> My Forms</a></li>
              <li><a href="#"><ChartIcon /> Analytics</a></li>
              <li><a href="#" onClick={handleAskTeamClick}><HelpIcon /> Ask Our Team</a></li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-left">
              <h2>My Forms</h2>
              <div className="search-bar"><SearchIcon /><input type="text" placeholder="Search forms..." /></div>
            </div>
            <div className="header-right">
              <button className="notification-btn"><BellIcon /></button>
              <button className="btn-create-form" onClick={() => setPage && setPage('formEditor')}><PlusIcon /> Create New Form</button>
            </div>
          </header>

          <div className="dashboard-tabs">
            <a href="#" className={activeTab === 'active' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('active'); }}>Active Forms</a>
            <a href="#" className={activeTab === 'bookmarked' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('bookmarked'); }}>Bookmarked Forms</a>
            <a href="#" className={activeTab === 'previous' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('previous'); }}>Previous Forms</a>
          </div>

          <div className="form-grid">
            {forms.map(form => (
              <div className="form-card" key={form.id}>
                <div className={`form-card-thumbnail thumb-${form.id}`}></div>
                <div className="form-card-content">
                  <h3>{form.title}</h3>
                  <p>Last updated: {form.updated}</p>
                  <p>{form.submissions} Submissions</p>
                  <div className="form-card-actions">
                    <button className="btn-card-view" onClick={() => setPage && setPage('formEditor')}>View</button>
                    <button className="btn-card-icon"><BarChartIcon /></button>
                    <button className="btn-card-icon"><MoreHorizontalIcon /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="ai-bot-section">
            <div className="ai-bot-icon-wrapper"><AiBotIcon /></div>
            <div className="ai-bot-content">
              <h2>Let AI Build Your Form Smarter</h2>
              <p>Let our AI bot help you brainstorm the right questions for your form in seconds.</p>
            </div>
            <button className="btn-try-now" onClick={() => setPage && setPage('aiChat')}>Try Now <ArrowRightIcon /></button>
          </section>
        </main>
      </div>
      {isModalOpen && <EmailModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default DashboardPage;
