import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function IssueDetail() {
  const { slug, pk } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || !pk) return;

    api.get(`/projects/${slug}/issues/${pk}/`)
      .then((res) => {
        setIssue(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue");
        setLoading(false);
      });
  }, [slug, pk]);

  if (loading) return <p>Loading issue...</p>;
  if (error) return <p>{error}</p>;
  if (!issue) return <p>Issue not found</p>;

  return (
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Status: {issue.status}</p>
      <p>Created: {new Date(issue.created_at).toLocaleString()}</p>
    </div>
  );
}
