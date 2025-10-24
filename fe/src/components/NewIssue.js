// src/components/NewIssue.js
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
// import api, { getCookie } from "../api";
import IssueForm from "./IssueForm";

export default function NewIssue() {
  const navigate = useNavigate();
  const { projectId } = useParams();

const handleCreate = (data) => {
  api.post("/issues/", { ...data, project: projectId })
    .then((res) => {
      navigate(`/projects/${projectId}/issues`);
    })
    .catch((err) => {
      console.error("Error creating issue:", err);
    });
};

  return (
    <div style={{ backgroundColor: "#1E1E1E", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ color: "white" }}>Create New Issue</h2>
      <IssueForm onSubmit={handleCreate} />
    </div>
  );
}
