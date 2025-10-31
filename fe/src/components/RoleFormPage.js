import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, {getCookie} from "../api";

const PERMISSION_RESOURCES = ["project", "issue", "pull_request"];
const ACTIONS = ["view", "create", "update", "delete"];
const csrfToken = getCookie("csrftoken");

export default function RoleForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    project: { view: false, create: false, update: false, delete: false },
    issue: { view: false, create: false, update: false, delete: false },
    pull_request: {
      view: false,
      create: false,
      update: false,
      delete: false,
    },
  });

  useEffect(() => {
    if (id) {
      api.get(`/roles/${id}/`)
        .then((res) => {
          setRoleName(res.data.name);
          setPermissions(res.data.permissions || permissions);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleToggle = (resource, action) => {
    setPermissions((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [action]: !prev[resource][action],
      },
    }));
  };

  const handleSubmit = (e) => {
    const csrfToken = getCookie("csrftoken");
    e.preventDefault();

    const payload = {
      name: roleName,
      permissions: permissions,
    };

    const request = id
      ? api.put(`/roles/${id}/`, payload,{
      headers: {
        "X-CSRFToken": csrfToken, // include CSRF token
      },
    })
      : api.post(`/roles/`, payload,{
      headers: {
        "X-CSRFToken": csrfToken, // include CSRF token
      },
    });

    request
      .then(() => navigate("/admin/roles"))
      .catch((err) => console.error(err));
  };

  return (

    <div style={styles.container}>

    <div style={{
      background: "#060505ff",
      color: "lightgreen",
      padding: "25px",
      borderRadius: "8px",
      // width: "80%",
      margin: "30px auto"
    }}>
      <h2>{id ? "Edit Role" : "Create Role"}</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            background: "#222",
            color: "lightgreen",
            border: "1px solid lightgreen",
            borderRadius: "5px"
          }}
        />

        <table style={{ width: "100%", color: "lightgreen", marginBottom: "20px" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Resource</th>
              {ACTIONS.map((a) => (
                <th key={a}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_RESOURCES.map((resource) => (
              <tr key={resource}>
                <td style={{ padding: "8px 0" }}>{resource}</td>
                {ACTIONS.map((action) => (
                  <td key={action}>
                    <input
                      type="checkbox"
                      checked={permissions[resource][action]}
                      onChange={() => handleToggle(resource, action)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="submit"
          style={{
            background: "black",
            color: "lightgreen",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "1px solid lightgreen"
          }}
        >
          {id ? "Update Role" : "Create Role"}
        </button>
      </form>
    </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1E1E1E",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  }}
