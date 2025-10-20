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
  issueItemBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "2px solid #90EE90",
    borderRadius: "5px",
    backgroundColor: "#2D2D2D",
  },
  issueText: { fontWeight: "bold", fontSize: "1em" },
  issueInfo: { fontSize: "0.9em", color: "#90EE90", marginLeft: "10px" },
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

export default function IssueList() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [projectName, setProjectName] = useState("Loading...");
  const navigate = useNavigate();

  const fetchIssues = useCallback(() => {
    api
      .get(`/issues/?project=${projectId}`)
      .then((res) => setIssues(res.data))
      .catch((err) => console.error("Error fetching issues:", err));
  }, [projectId]);

  useEffect(() => {
    api
      .get(`/projects/${projectId}/`)
      .then((res) => setProjectName(res.data.name))
      .catch(() => setProjectName("Unknown Project"));

    fetchIssues();
  }, [projectId, fetchIssues]);

  const handleOpen = (issueId) => navigate(`/issues/${issueId}`);

  const handleDelete = async (issueId) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await api.delete(`/issues/${issueId}/`);
        setIssues((prev) => prev.filter((i) => i.id !== issueId));
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
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
        <span>Issues</span>
      </div>


      <div style={styles.topBar}>
        <button
          style={styles.backButton}
          onClick={() => navigate(`/projects/${projectId}/pdetails`)}
        >
          ⬅ Back to Project
        </button>

        <Link to={`/projects/${projectId}/issues/new`} style={styles.addButton}>
          ➕ Add Issue
        </Link>
      </div>

      <h2>Issues for Project: {projectName}</h2>

      {issues.length === 0 ? (
        <p>No issues available.</p>
      ) : (
        issues.map((issue) => (
          <div key={issue.id} style={styles.issueItemBox}>
            <div>
              <span style={styles.issueText}>{issue.title}</span>
              <span style={styles.issueInfo}>
                ({issue.status} | {issue.label || "No Label"} |{" "}
                {issue.assignee?.username || "Unassigned"})
              </span>
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleOpen(issue.id)} style={styles.button}>
                Open
              </button>
              <button
                onClick={() => handleDelete(issue.id)}
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
