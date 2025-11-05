import React from "react";
import { Link, useLocation } from "react-router-dom";


export default function AdminNavbar() {
  const location = useLocation();
  if (!location.pathname.startsWith("/admin")) return null;

  return (
    <nav style={styles.nav}>
      <Link to="/admin/roles/new" style={styles.link}>➕ Create Role</Link>
      <Link to="/admin/roles" style={styles.link}>🛠 Roles</Link>
      <Link to="/admin/assign-role" style={styles.link}>👤 Assign Role</Link>
      <Link to="/admin/create-user" style={styles.link}>➕ Create User</Link>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "25px",
    padding: "8px 20px",
    background: "#141414",
    borderBottom: "1px solid #333",
  },
  link: {
    color: "#90ee90",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
