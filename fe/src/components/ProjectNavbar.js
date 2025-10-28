// src/components/ProjectNavbar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../api";

export default function ProjectNavbar() {
  const [projectName, setProjectName] = useState("");
  const { projectId } = useParams();
  const location = useLocation();

  useEffect(() => {
    async function fetchProject() {
      if (projectId) {
        try {
          const res = await api.get(`/projects/${projectId}/`);
          setProjectName(res.data.name || "");
        } catch {
          setProjectName("");
        }
      }
    }
    fetchProject();
  }, [projectId]);

  // Show only if inside a project route
  if (!location.pathname.includes("/projects/")) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.projectName}>{projectName}</span>
        <Link to={`/projects/${projectId}/issues`} style={styles.link}>
          Issues
        </Link>
        <Link to={`/projects/${projectId}/pullreqs`} style={styles.link}>
          Pull Requests
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "#1a1a1a",
    color: "white",
    padding: "8px 20px",
    borderBottom: "1px solid #333",
  },
  left: { display: "flex", alignItems: "center", gap: "20px" },
  link: {
    color: "#90ee90",
    textDecoration: "none",
    fontWeight: "bold",
  },
  projectName: {
    color: "#bbb",
    fontWeight: "500",
    fontSize: "1rem",
  },
};
