// src/components/IssueDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import IssueForm from "./IssueForm";

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get(`/issues/${id}/`).then((res) => setIssue(res.data));
  }, [id]);

  const handleUpdate = (data) => {
    api.patch(`/issues/${id}/`, data).then((res) => {
      setIssue(res.data);
      setEditing(false);
    });
  };

  if (!issue) return <div style={{ color: "white", padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", color: "white", backgroundColor: "#1E1E1E", minHeight: "100vh" }}>
      {editing ? (
        <IssueForm issue={issue} onSubmit={handleUpdate} />
      ) : (
        <>
          <h2>{issue.title}</h2>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
          <p>Label: {issue.label}</p>
          <p>Assignee: {issue.assignee?.username || "Unassigned"}</p>
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "8px 15px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#90EE90",
              color: "#1E1E1E",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
