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

  // Fetch related issues and users
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
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {isEdit ? "✏️ Edit Pull Request" : "➕ New Pull Request"}
      </h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.select}
        >
          {STATUS_CHOICES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={styles.select}
        >
          {LABEL_CHOICES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <select
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Issue (optional)</option>
          {issues.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title}
            </option>
          ))}
        </select>

        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          style={styles.select}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          {isEdit ? "💾 Update" : "➕ Create"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    minHeight: "100px",
  },
  select: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};
