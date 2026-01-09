import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UserIcon, EmailIcon, ShieldIcon, CalendarIcon, EditIcon } from "./Icons";
import { API_BASE_URL } from "../config";

const ProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch fresh user data from server
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          }
        })
        .catch(err => console.error("Error fetching user:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/signin");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ profileImage: base64String })
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          alert(data.message || "Failed to upload image");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Error uploading image");
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="profile-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="profile-page page-fade-in">
      <div className="profile-header-bg"></div>

      <div className="profile-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeftIcon /> Back to Dashboard
        </button>

        <div className="profile-content-wrapper">
          {/* Left Column: User Card */}
          <div className="profile-sidebar-card">
            <div className="profile-avatar-large" onClick={() => document.getElementById('profile-upload').click()} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getInitials(user.name)
              )}
              <div className="avatar-hover-overlay">
                <EditIcon />
              </div>
            </div>
            <input
              type="file"
              id="profile-upload"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <div className="profile-role-badge">{user.role || "User"}</div>

            <button className="btn-logout-full" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Right Column: Details */}
          <div className="profile-details-card">
            <div className="profile-section-header">
              <h3>Account Details</h3>
              <button className="btn-edit-profile" onClick={() => alert("Edit feature coming soon!")}>
                <EditIcon /> Edit
              </button>
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label><UserIcon /> Full Name</label>
                <div className="field-value">{user.name}</div>
              </div>

              <div className="profile-field">
                <label><EmailIcon /> Email Address</label>
                <div className="field-value">{user.email}</div>
              </div>

              <div className="profile-field">
                <label><ShieldIcon /> Account ID</label>
                <div className="field-value mono">{user.id || user._id || "N/A"}</div>
              </div>

              <div className="profile-field">
                <label><CalendarIcon /> Member Since</label>
                <div className="field-value">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                    : "January 2026"}
                </div>
              </div>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-section-header">
              <h3>Preferences</h3>
            </div>

            <div className="preferences-list">
              <div className="preference-item">
                <span>Email Notifications</span>
                <div className="toggle-switch on"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background-color: var(--bg-app);
          position: relative;
          color: var(--text-dark);
          font-family: 'Inter', sans-serif;
        }

        .profile-header-bg {
          height: 200px;
          background: linear-gradient(135deg, var(--primary-purple) 0%, #9059ff 100%);
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
        }

        .profile-container {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 500;
          margin-bottom: 2rem;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .profile-content-wrapper {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        @media (max-width: 800px) {
          .profile-content-wrapper {
            grid-template-columns: 1fr;
          }
        }

        .profile-sidebar-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid var(--border-color);
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: var(--light-purple-bg);
          color: var(--primary-purple);
          font-size: 2.5rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          border: 4px solid var(--bg-card);
          box-shadow: 0 0 0 2px var(--primary-purple);
        }

        .profile-name {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .avatar-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .profile-avatar-large:hover .avatar-hover-overlay {
          opacity: 1;
        }

        .profile-email {
          margin: 0.5rem 0 1.5rem;
          color: var(--text-medium);
        }

        .profile-role-badge {
          background: rgba(138, 79, 255, 0.1);
          color: var(--primary-purple);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2rem;
        }

        .btn-logout-full {
          width: 100%;
          padding: 0.8rem;
          border-radius: 10px;
          background: transparent;
          border: 1px solid #ff4757;
          color: #ff4757;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout-full:hover {
          background: #ff4757;
          color: white;
        }

        /* Details Card */
        .profile-details-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid var(--border-color);
        }

        .profile-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .profile-section-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-white);
        }

        .btn-edit-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--light-purple-bg);
          color: var(--primary-purple);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: background 0.2s;
        }

        .btn-edit-profile:hover {
          background: rgba(138, 79, 255, 0.25);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        .profile-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .profile-field label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-medium);
          font-weight: 500;
        }

        .profile-field label svg {
          width: 16px;
          height: 16px;
          opacity: 0.7;
        }

        .field-value {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-white);
          padding: 0.8rem;
          background: var(--bg-light-gray);
          border-radius: 8px;
          border: 1px solid transparent;
        }

        .field-value.mono {
          font-family: monospace;
          letter-spacing: 0.5px;
        }

        .profile-divider {
          height: 1px;
          background: var(--border-color);
          margin: 2rem 0;
        }

        .preferences-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
        }

        .preference-item span {
          color: var(--text-white);
          font-weight: 500;
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: var(--bg-light-gray);
          border-radius: 12px;
          position: relative;
          cursor: pointer;
        }

        .toggle-switch.on {
          background: var(--primary-purple);
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
        }

        .toggle-switch.on::after {
          transform: translateX(20px);
        }
        
        .profile-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-app);
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top-color: var(--primary-purple);
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
