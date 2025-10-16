// src/components/IssueList.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

const styles = {
  container: { backgroundColor: "#1E1E1E", color: "white", minHeight: "100vh", padding: "20px" },
  issueItemBox: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", margin: "10px 0", border: "2px solid #90EE90", borderRadius: "5px", backgroundColor: "#2D2D2D" },
  issueText: { fontWeight: "bold", fontSize: "1em" },
  issueInfo: { fontSize: "0.9em", color: "#90EE90", marginLeft: "10px" },
  buttonGroup: { display: "flex", gap: "10px" },
  button: { backgroundColor: "#90EE90", color: "#1E1E1E", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  deleteButton: { backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" },
  addButton: { display: "inline-block", marginBottom: "15px", backgroundColor: "#90EE90", color: "#1E1E1E", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer", fontWeight: "600", textDecoration: "none" },
};

export default function IssueList() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, [projectId]);

  const fetchIssues = () => {
    api.get(`/issues/?project=${projectId}`)
      .then((res) => setIssues(res.data))
      .catch((err) => console.error("Error fetching issues:", err));
  };

  const handleOpen = (issueId) => {
    navigate(`/issues/${issueId}`);
  };

  const handleDelete = async (issueId) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await api.delete(`/issues/${issueId}/`);
        setIssues(issues.filter((i) => i.id !== issueId));
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Issues for Project {projectId}</h2>

      <Link to={`/projects/${projectId}/issues/new`} style={styles.addButton}>
        ➕ Add Issue
      </Link>

      {issues.length === 0 ? (
        <p>No issues available.</p>
      ) : (
        issues.map((issue) => (
          <div key={issue.id} style={styles.issueItemBox}>
            <div>
              <span style={styles.issueText}>{issue.title}</span>
              <span style={styles.issueInfo}>
                ({issue.status} | {issue.label || "No Label"} | {issue.assignee?.username || "Unassigned"})
              </span>
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleOpen(issue.id)} style={styles.button}>
                Open
              </button>
              <button onClick={() => handleDelete(issue.id)} style={styles.deleteButton}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
