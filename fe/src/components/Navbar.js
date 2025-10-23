// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { logout } from "../api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch current user info on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        // Uses api.js instance (baseURL = /api, withCredentials = true)
        const res = await api.get("/check-auth/");
        // JsonResponse: { user: username }
        setUser(res.data.user);
      } catch (err) {
        setUser(null); // not authenticated
      }
    }

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();   // Calls /api/logout/
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // If not logged in, don't render the navbar
  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>🏠 Home</Link>
      </div>
      <div style={styles.right}>
        <span style={styles.user}>Hello, {user}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#222",
    color: "white",
    padding: "10px 20px",
  },
  left: { display: "flex", alignItems: "center", gap: "15px" },
  right: { display: "flex", alignItems: "center", gap: "15px" },
  link: { color: "white", textDecoration: "none", fontWeight: "bold" },
  user: { fontSize: "0.9rem", color: "#ccc" },
  button: {
    background: "#ff5555",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
