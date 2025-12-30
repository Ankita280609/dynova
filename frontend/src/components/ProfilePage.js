import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/signin");
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="profile-card"
        style={{
          background: "#ffffff",
          padding: "2.5rem",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "1.4rem",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 600 }}>
          Your Profile
        </h2>

        <div>
          <p style={{ margin: "0.25rem 0", color: "#666" }}>Name</p>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {user.name || "—"}
          </p>
        </div>

        <div>
          <p style={{ margin: "0.25rem 0", color: "#666" }}>Email</p>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {user.email || "—"}
          </p>
        </div>

        <div>
          <p style={{ margin: "0.25rem 0", color: "#666" }}>Account Type</p>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {user.role || "User"}
          </p>
        </div>

        <button
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "10px",
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => alert("Edit profile coming soon")}
        >
          Edit Profile
        </button>

        <button
          style={{
            padding: "0.7rem",
            borderRadius: "10px",
            border: "1px solid #ddd",
            background: "#fff",
            color: "#333",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
