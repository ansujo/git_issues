// src/components/IssueForm.js
import React, { useEffect, useState } from "react";
import api from "../api";

export default function IssueForm({ issue = {}, onSubmit }) {
  const [title, setTitle] = useState(issue.title || "");
  const [description, setDescription] = useState(issue.description || "");
  const [status, setStatus] = useState(issue.status || "open");
  const [label, setLabel] = useState(issue.label || "bug");
  const [assignee, setAssignee] = useState(issue.assignee?.id || "");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users/").then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSubmit) {
      console.error("onSubmit function not passed to IssueForm");
      return;
    }
    onSubmit({ title, description, status, label,
      assignee_id: assignee ? parseInt(assignee, 10) : null, });
  };

  const STATUS_CHOICES = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "closed", label: "Closed" },
  ];

  const LABEL_CHOICES = [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "ui", label: "UI" },
    { value: "enhancement", label: "Enhancement" },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#1E1E1E", padding: "20px", borderRadius: "5px", color: "white" }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#2D2D2D", color: "white" }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#2D2D2D", color: "white" }}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2D2D2D", color: "white", border: "1px solid #90EE90" }}>
        {STATUS_CHOICES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select value={label} onChange={(e) => setLabel(e.target.value)} style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2D2D2D", color: "white", border: "1px solid #90EE90" }}>
        {LABEL_CHOICES.map((l) => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>

      <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2D2D2D", color: "white", border: "1px solid #90EE90" }}>
        <option value="">Unassigned</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.username}</option>
        ))}
      </select>

      <button type="submit" style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#90EE90", color: "#1E1E1E", fontWeight: "600", cursor: "pointer" }}>
        Save
      </button>

    </form>
  );
}
