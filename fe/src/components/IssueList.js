import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function IssueList() {
  const { slug } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    api.get(`/projects/${slug}/issues/`)
      .then((res) => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setError("Failed to load issues");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Issues for Project: {slug}</h2>

      {/* 🔹 Add Issue button */}
      <Link
        to={`/projects/${slug}/issues/new`}
        style={{
          display: "inline-block",
          margin: "10px 0",
          padding: "8px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold",
        }}
      >
        ➕ Add Issue
      </Link>

      {issues.length === 0 ? (
        <p>No issues found for this project.</p>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue.id} style={{ marginBottom: "8px" }}>
              <Link to={`/projects/${slug}/issues/${issue.id}`} style={{ textDecoration: "none", color: "#333" }}>
                {issue.title} ({issue.status})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
