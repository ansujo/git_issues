import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function IssueForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slug) {
      setError("Invalid project slug");
      return;
    }

    api.post(`/projects/${slug}/issues/`, { title, description, status })
      .then(() => navigate(`/projects/${slug}/issues`))
      .catch((err) => {
        console.error("Error creating issue:", err);
        setError("Failed to create issue");
      });
  };

  return (
    <div>
      <h2>Add New Issue</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit">Add Issue</button>
      </form>
    </div>
  );
}
