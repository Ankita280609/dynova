import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage({ onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="profile-page page-fade-in">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 0' }}>
          <h2>My Profile</h2>
          <button className="btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>

        <div className="profile-card" style={{ background: 'var(--bg-white)', padding: '2rem', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 12, background: 'var(--light-purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--light-purple-text)', fontSize: '24px' }}>
              {getInitials(user.name)}
            </div>
            <div>
              <h3 style={{ marginBottom: 4 }}>{user.name || 'Guest'}</h3>
              <p style={{ color: 'var(--text-medium)' }}>{user.email || 'No email'}</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h4>Account</h4>
            <p style={{ color: 'var(--text-medium)' }}>Manage your account settings and preferences here.</p>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-auth-submit" onClick={() => onLogout && onLogout()}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
