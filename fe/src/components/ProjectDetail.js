// src/components/ProjectDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProjectDetail() {
  const { projectId } = useParams();   //param names shoud match name in app.js
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/`);
        setProject(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load project details 😢");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>{project.name}</h2>
      <p><strong>Description:</strong> {project.description || "No description"}</p>
      <p><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
      <p><strong>Owner:</strong> {project.owner || "N/A"}</p>
      <p><strong>Total Issues:</strong> {project.issue_count || 0}</p>

      <div style={styles.buttonBox}>
        <button
          style={styles.button}
          onClick={() => navigate(`/projects/${projectId}/issues`)}
        >
          View Issues
        </button>

        <button
          style={{ ...styles.button, backgroundColor: "#333", color: "#90EE90" }}
          onClick={() => navigate(`/`)}
        >
          ← Back to Projects
        </button>
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
  },
  buttonBox: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
