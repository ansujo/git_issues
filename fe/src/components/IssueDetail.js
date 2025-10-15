// src/components/IssueDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function IssueDetail() {
  const { projectId, issueId } = useParams();
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    api.get(`/projects/${projectId}/issues/${issueId}/`).then((res) => setIssue(res.data));
  }, [projectId, issueId]);

  if (!issue) return <p>Loading...</p>;

  return (
    <div>
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p>Status: {issue.status}</p>
      <p>Created: {new Date(issue.created_at).toLocaleString()}</p>
    </div>
  );
}
