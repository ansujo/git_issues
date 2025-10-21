import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function PullReqForm({ isEdit = false }) {
  const params = useParams();
  const [projectId, setProjectId] = useState(params.projectId || "");
  const { pullId } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [label, setLabel] = useState("enhancement");
  const [issue, setIssue] = useState("");
  const [assignee, setAssignee] = useState("");
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch pull request details if editing
  useEffect(() => {
    if (isEdit && pullId) {
      api.get(`/pullreqs/${pullId}/`).then((res) => {
        const data = res.data;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setStatus(data.status || "open");
        setLabel(data.label || "enhancement");
        setIssue(data.issue ? data.issue.id : "");
        setAssignee(data.assignee ? data.assignee.id : "");
        if (!projectId && data.project) setProjectId(data.project);
      });
    }
  }, [isEdit, pullId, projectId]);

  // Fetch related issues
  useEffect(() => {
    if (!projectId) return;
    api.get(`/issues/?project=${projectId}`).then((res) => setIssues(res.data));
    api.get("/users/").then((res) => setUsers(res.data));
  }, [projectId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      status,
      label,
      project: Number(projectId),
      issue: issue ? Number(issue) : null,
      assignee: assignee ? Number(assignee) : null,
    };
    console.log("Submitting payload:", payload);

    try {
      if (isEdit) {
        await api.put(`/pullreqs/${pullId}/`, payload);
      } else {
        await api.post("/pullreqs/", payload);
      }
      navigate(`/projects/${projectId}/pullreqs`);
    } catch (err) {
      console.error("Error saving pull request:", err);
    }
  };

  const STATUS_CHOICES = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "closed", label: "Closed" },
  ];

  const LABEL_CHOICES = [
    { value: "bug", label: "Bug" },
    { value: "development", label: "Development" },
    { value: "ui", label: "UI" },
    { value: "documentation", label: "Documentation" },
    { value: "feature", label: "Feature" },
  ];

  return (
    <div style={{ backgroundColor: "#1E1E1E", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "1.5em", marginBottom: "20px" }}>
        {isEdit ? "✏️ Edit Pull Request" : "➕ New Pull Request"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#2D2D2D", padding: "20px", borderRadius: "8px", border: "2px solid #90EE90" }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white", height: "100px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white" }}
        >
          {STATUS_CHOICES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white" }}
        >
          {LABEL_CHOICES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        <select
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white" }}
        >
          <option value="">Select Issue (optional)</option>
          {issues.map((i) => (
            <option key={i.id} value={i.id}>{i.title}</option>
          ))}
        </select>

        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #90EE90", backgroundColor: "#1E1E1E", color: "white" }}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>

        <button
          type="submit"
          style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#90EE90", color: "#1E1E1E", fontWeight: "600", cursor: "pointer" }}
        >
          {isEdit ? "💾 Update" : "➕ Create"}
        </button>
      </form>
    </div>
  );
}
