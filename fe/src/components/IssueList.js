import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api,{ getCookie } from "../api";


export default function IssueList() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);
  const [projectName, setProjectName] = useState("Loading...");
  const [denied,setDenied]=useState(false)
  const navigate = useNavigate();

  const fetchIssues = useCallback(() => {
    api
      .get(`/issues/?project=${projectId}`)
      .then((res) => setIssues(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setDenied(true);
        console.error("Error fetching issues:", err)});
  }, [projectId]);

  useEffect(() => {
    api
      .get(`/projects/${projectId}/`)
      .then((res) => setProjectName(res.data.name))
      .catch(() => setProjectName("Unknown Project"));

    fetchIssues();
  }, [projectId, fetchIssues]);

  const handleOpen = (issueId) =>
    navigate(`/projects/${projectId}/issues/${issueId}`);

  const handleDelete = async (issueId) => {
    const csrfToken = getCookie("csrftoken");
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {

        await api.delete(`/issues/${issueId}/`,{
      headers: {
        "X-CSRFToken": csrfToken, // include CSRF token
      },
    }
  );
        setIssues((prev) => prev.filter((i) => i.id !== issueId));
      } catch (error) {
        if (error.response?.status === 403) setDenied(true);
        console.error("Error deleting issue:", error);
      }
    }
  };

  return (
    <div style={styles.container}>


      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Projects</Link> {" > "}
        <Link to={`/projects/${projectId}/pdetails`} style={styles.breadcrumbLink}>
          {projectName}
        </Link> {" > "} <span>Issues</span>
      </div>
      




      {/* Top bar */}
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

    {denied ? (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <img
          src="/accessdenied.png"
          alt="Access Denied"
          style={{ width: "250px", marginBottom: "20px" }}
        />
        <h2>Access Denied</h2>
        <p>You don't have permission to view these issues.</p>
      </div>
    ) : (
        <>
          {issues.length === 0 ? (
            <p>No issues available.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Label</th>
                  <th style={styles.th}>Assignee</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} style={styles.tableRow}>
                    <td style={styles.td}>{issue.title}</td>
                    <td style={styles.td}>{issue.status}</td>
                    <td style={styles.td}>{issue.label || "No Label"}</td>
                    <td style={styles.td}>
                      {issue.assignee?.username || "Unassigned"}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleOpen(issue.id)}
                        style={styles.button}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        style={styles.deleteButton}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

      </>
      )}

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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #90EE90",
    backgroundColor: "#2D2D2D",
  },
  tableHeaderRow: {
    backgroundColor: "#111",
  },
  th: {
    border: "1px solid #90EE90",
    padding: "10px",
    textAlign: "left",
    color: "#90EE90",
  },
  td: {
    border: "1px solid #90EE90",
    padding: "10px",
  },
  tableRow: {
    transition: "background 0.2s",
  },
  button: {
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "8px",
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
