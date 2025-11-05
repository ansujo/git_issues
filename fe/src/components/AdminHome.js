import React from "react";
import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <p style={styles.subtext}>Manage access, users & project permissions</p>

      <div style={styles.cardContainer}>
        <Link to="/admin/roles/new" style={styles.card}>
          ➕ Create Role
        </Link>
        <Link to="/admin/roles" style={styles.card}>
          🛠 Edit Roles
        </Link>
        <Link to="/admin/assign-role" style={styles.card}>
          👤 Assign Role
        </Link>
        <Link to="/admin/create-user" style={styles.card}>
          ➕ Create User
        </Link>
      </div>
    </div>
  );
}

const styles = {

  container: {
    backgroundColor: '#1E1E1E',
    color: 'white',
    minHeight: '100vh',
    padding: '20px',
  },
  // container: {
  //   padding: "20px",
  //   color: "#ddd",
  // },
  heading: {
    fontSize: "1.6rem",
    marginBottom: "10px",
    color: "#90ee90",
  },
  subtext: {
    fontSize: "0.9rem",
    marginBottom: "20px",
    color: "#aaa",
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    background: "#1a1a1a",
    padding: "14px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    color: "#90ee90",
    border: "1px solid #333",
    width: "180px",
    textAlign: "center",
  },
};
