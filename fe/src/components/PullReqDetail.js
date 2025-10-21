import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  box: {
    backgroundColor: "#2D2D2D",
    padding: "20px",
    borderRadius: "8px",
    border: "2px solid #90EE90",
  },
  title: { fontSize: "1.5em", marginBottom: "10px" },
  text: { color: "#90EE90", fontSize: "1em" },
  buttonBox: { marginTop: "20px", display: "flex", gap: "10px" },
  button: {
    backgroundColor: "#90EE90",
    color: "#1E1E1E",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default function PullReqDetail() {
  const { pullId } = useParams();
  const [pull, setPull] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/pullreqs/${pullId}/`)
      .then((res) => setPull(res.data))
      .catch(() => setPull(null));
  }, [pullId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this pull request?")) {
      try {
        await api.delete(`/pullreqs/${pullId}/`);
        navigate(-1);
      } catch (err) {
        console.error("Error deleting pull request:", err);
      }
    }
  };

  if (!pull) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>
          Projects
        </Link>
        {"  >  "}
        <span>{pull.project?.name || "Project"}</span>
        {"  >  "}
        <span>Pull Request Detail</span>
      </div>

      <div style={styles.box}>
        <h2 style={styles.title}>{pull.title}</h2>
        <p style={styles.text}>{pull.description}</p>
        <p style={styles.text}>
          <strong>Status:</strong> {pull.status}
        </p>
        <p style={styles.text}>
          <strong>Label:</strong> {pull.label || "None"}
        </p>
        {pull.issue && (
          <p style={styles.text}>
            <strong>Linked Issue:</strong> {pull.issue.title}
          </p>
        )}
        <div style={styles.buttonBox}>
          <button
            style={styles.button}
            onClick={() => navigate(`/pullreqs/${pull.id}/edit`)}
          >
            ✏️ Edit
          </button>
          <button style={styles.deleteButton} onClick={handleDelete}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
