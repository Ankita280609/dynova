import React, { useState, useEffect } from "react";

export default function ProfilePage({ setPage, userName, userEmail }) {
  const [photo, setPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    id: Math.floor(Math.random() * 9000000000) + 1000000000,
    fullName: userName || "", // dynamic from sign-in
    displayName: userName || "",
    email: userEmail || "", // dynamic from sign-in
    gender: "I’d prefer not to say",
    country: "India",
    state: "Haryana",
    language: "English",
    timeZone: "(GMT +05:30) IST (Asia/Kolkata)",
    phone: "",
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSignOut = () => {
    alert("Signed out successfully!");
    setPage("auth");
  };

  // Update profile name/email if props change
  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      fullName: userName || prev.fullName,
      displayName: userName || prev.displayName,
      email: userEmail || prev.email,
    }));
  }, [userName, userEmail]);

  return (
    <>
      <style>{`
        body {
          background-color: #000;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
        }
        .profile-container {
          max-width: 700px;
          margin: 60px auto;
          padding: 30px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .profile-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .edit-btn {
          background: #8e44ad;
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          font-weight: bold;
          transition: 0.3s;
        }
        .edit-btn:hover {
          background: #a55eea;
        }
        .profile-photo-box {
          position: relative;
          width: 140px;
          height: 140px;
          margin-bottom: 20px;
        }
        .profile-photo-box img {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #fff;
        }
        .profile-photo-box span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #555;
          font-size: 50px;
          color: #fff;
        }
        .photo-edit-icon {
          position: absolute;
          bottom: 5px;
          right: 5px;
          cursor: pointer;
          font-size: 20px;
          background: #fff;
          color: #000;
          padding: 4px;
          border-radius: 50%;
          border: 2px solid #000;
          transition: 0.3s;
        }
        .photo-edit-icon:hover {
          background: #ffcc00;
        }
        .profile-basic-info h3 {
          margin: 0;
          font-size: 22px;
        }
        .profile-id {
          font-size: 14px;
          opacity: 0.7;
          margin-top: 4px;
        }
        .profile-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          width: 100%;
          margin-top: 20px;
        }
        .profile-details-grid .label {
          opacity: 0.7;
          margin-bottom: 5px;
        }
        .profile-details-grid .value,
        .profile-input {
          color: #fff;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 6px;
          padding: 6px 10px;
          outline: none;
        }
        .profile-input:focus {
          border-color: #8e44ad;
        }
        .back-btn {
          margin-top: 30px;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          background: #555;
          cursor: pointer;
          color: #fff;
          transition: 0.3s;
        }
        .back-btn:hover {
          background: #666;
        }
        .signout-btn {
          background: #ff3b3b;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: #fff;
          font-size: 16px;
          margin-top: 30px;
          position: relative;
          transition: 0.3s;
        }
        .signout-btn:hover {
          background: #ff5959;
        }
        .signout-btn:hover::after {
          content: "Don't go, we'll miss you ❤️";
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #ffcc00;
        }
      `}</style>

      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <h2>Profile</h2>
          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        {/* Photo + Basic Info */}
        <div className="profile-left">
          <div className="profile-photo-box">
            {photo ? <img src={photo} alt="profile" /> : <span>A</span>}
            <label className="photo-edit-icon">
              ✏️
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="profile-basic-info">
            <h3>{profile.fullName}</h3>
            <p className="profile-id">User ID: {profile.id}</p>
            <p className="profile-id">Email: {profile.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="profile-details-grid">
          {[
            { label: "Full Name", key: "fullName" },
            { label: "Display Name", key: "displayName" },
            { label: "Phone Number", key: "phone" },
            { label: "Gender", key: "gender" },
            { label: "Country", key: "country" },
            { label: "State", key: "state" },
            { label: "Language", key: "language" },
            { label: "Time Zone", key: "timeZone" },
          ].map((item) => (
            <div key={item.key}>
              <p className="label">{item.label}</p>
              {editMode ? (
                <input
                  className="profile-input"
                  name={item.key}
                  value={profile[item.key]}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profile[item.key]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Back button */}
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back
        </button>

        {/* Sign out button below */}
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </>
  );
}
