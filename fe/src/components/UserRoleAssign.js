import React, { useEffect, useState } from "react";
import api ,{ getCookie } from "../api";
import { useNavigate } from "react-router-dom";

export default function UserRoleAssign() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const csrfToken = getCookie("csrftoken");
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = () => {
    api.get("/users/")
      .then(res => setUsers(res.data))
      .catch(() => setMessage("Failed to load users"));
  };

  const fetchRoles = () => {
    
    api.get("/roles/",)
      .then(res => setRoles(res.data))
      .catch(() => setMessage("Failed to load roles"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    api.post("/user-roles/", {
      user_id: selectedUser,
      role_id: selectedRole,
      },{
        headers: {
          "X-CSRFToken": csrfToken, // include CSRF token
        },
      }
    )
    .then(() => {
      setMessage("✅ Role assigned successfully!");
      setSelectedUser("");
      setSelectedRole("");
      setTimeout(() => navigate("/admin/roles"), 1500);
    })
    .catch(() => {
      setMessage("❌ Failed to assign role");
    })
    .finally(() => setLoading(false));
  };

  return (
    <div style={{
      backgroundColor: '#1E1E1E',
      color: 'white',
      minHeight: '100vh',
      // padding: '20px',
      // backgroundColor: "#111",
      // color: "#0f0",
      padding: "20px",
      // borderRadius: "10px",
      // width: "400px",
      // margin: "auto",
      // marginTop: "40px"
    }}>
      <h2 style={{ color: "lightgreen" }}>Assign Role to User</h2>

      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          required
        >
          <option value="">-- Select User --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
