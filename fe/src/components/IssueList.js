// src/components/IssueList.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function IssueList() {
  const { projectId } = useParams();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get(`/projects/${projectId}/issues/`).then((res) => setIssues(res.data));
  }, [projectId]);

  return (
    <div>
      <h2>Issues for Project {projectId}</h2>
      <Link to={`/projects/${projectId}/issues/new`}>➕ Add Issue</Link>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <Link to={`/projects/${projectId}/issues/${issue.id}`}>
              {issue.title} ({issue.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
