// src/components/RoleListPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RoleListPage() {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/roles/")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Roles</h2>

      <button
        style={styles.addBtn}
        onClick={() => navigate("/admin/roles/new")}
      >
        ➕ Add Role
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Role Name</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id} style={styles.row}>
              <td
                style={styles.roleCell}
                onClick={() => navigate(`/admin/roles/${role.id}`)}
              >
                {role.name}
              </td>
              <td style={styles.actionCell}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/admin/roles/${role.id}`)}
                >
                  ✏ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  title: { color: "#90ee90", marginBottom: "15px" },
  addBtn: {
    background: "#000",
    color: "#90ee90",
    border: "1px solid #90ee90",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    background: "#141414",
    borderCollapse: "collapse",
    color: "#E0FFE4",
  },
  th: {
    borderBottom: "1px solid #333",
    padding: "10px",
    textAlign: "left",
    color: "#90ee90",
  },
  row: {
    borderBottom: "1px solid #333",
    cursor: "pointer",
  },
  roleCell: {
    padding: "10px",
    fontWeight: "bold",
  },
  actionCell: {
    padding: "10px",
    textAlign: "center",
  },
  editBtn: {
    background: "transparent",
    border: "1px solid #90ee90",
    color: "#90ee90",
    padding: "4px 10px",
    borderRadius: "3px",
    cursor: "pointer",
  },
};
