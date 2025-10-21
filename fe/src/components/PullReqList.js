import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

const styles = {
  container: {
    backgroundColor: "#1E1E1E",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },
  breadcrumb: {
    fontSize: "0.9em",
    color: "#90EE90",
    marginBottom: "15px",
  },
  breadcrumbLink: {
    color: "#90EE90",
    textDecoration: "none",
    cursor: "pointer",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    padding: "8px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    padding: "8px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
  },
  itemBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "2px solid #90EE90",
    borderRadius: "5px",
    backgroundColor: "#2D2D2D",
  },
  itemText: { fontWeight: "bold", fontSize: "1em" },
  itemInfo: { fontSize: "0.9em", color: "#90EE90", marginLeft: "10px" },
  buttonGroup: { display: "flex", gap: "10px" },
  button: {
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default function PullReqList() {
  const { projectId } = useParams();
  const [pullReqs, setPullReqs] = useState([]);
  const [projectName, setProjectName] = useState("Loading...");
  const navigate = useNavigate();

  // ✅ Fetch pull requests
  const fetchPullReqs = useCallback(() => {
    api
      .get(`/pullreqs/?project=${projectId}`)
      .then((res) => setPullReqs(res.data))
      .catch((err) => console.error("Error fetching pull requests:", err));
  }, [projectId]);

  // ✅ Fetch project name
  useEffect(() => {
    api
      .get(`/projects/${projectId}/`)
      .then((res) => setProjectName(res.data.name))
      .catch(() => setProjectName("Unknown Project"));

    fetchPullReqs();
  }, [projectId, fetchPullReqs]);

  // ✅ Navigation and delete handlers
  const handleOpen = (pullId) => navigate(`/pullreqs/${pullId}`);

  const handleDelete = async (pullId) => {
    if (window.confirm("Are you sure you want to delete this pull request?")) {
      try {
        await api.delete(`/pullreqs/${pullId}/`);
        setPullReqs((prev) => prev.filter((p) => p.id !== pullId));
      } catch (error) {
        console.error("Error deleting pull request:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* ✅ Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Projects</Link>
        {"  >  "}
        <Link
          to={`/projects/${projectId}/pdetails`}
          style={styles.breadcrumbLink}
        >
          {projectName}
        </Link>
        {"  >  "}
        <span>Pull Requests</span>
      </div>

      {/* ✅ Top Bar */}
      <div style={styles.topBar}>
        <button
          style={styles.backButton}
          onClick={() => navigate(`/projects/${projectId}/pdetails`)}
        >
          ⬅ Back to Project
        </button>

        <Link
          to={`/projects/${projectId}/pullreqs/new`}
          style={styles.addButton}
        >
          ➕ Add Pull Request
        </Link>
      </div>

      {/* ✅ Title */}
      <h2>Pull Requests for Project: {projectName}</h2>

      {/* ✅ Pull Request List */}
      {pullReqs.length === 0 ? (
        <p>No pull requests available.</p>
      ) : (
        pullReqs.map((pr) => (
          <div key={pr.id} style={styles.itemBox}>
            <div>
              <span style={styles.itemText}>{pr.title}</span>
              <span style={styles.itemInfo}>
                ({pr.status} | {pr.label || "No Label"} |{" "}
                {pr.assignee?.username || "Unassigned"})
              </span>
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => handleOpen(pr.id)}
                style={styles.button}
              >
                Open
              </button>
              <button
                onClick={() => handleDelete(pr.id)}
                style={styles.deleteButton}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
