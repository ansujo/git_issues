// src/components/IssueForm.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function IssueForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post(`/projects/${projectId}/issues/`, {
      title,
      description,
      status: "open",
    }).then(() => {
      navigate(`/projects/${projectId}/issues`);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Issue</h2>
      <input
        type="text"
        placeholder="Issue Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <br />
      <button type="submit">Add</button>
    </form>
  );
}
