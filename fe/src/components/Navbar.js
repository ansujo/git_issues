// // src/components/Navbar.js
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api, { logout } from "../api";

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await api.get("/check-auth/");
//         setUser(res.data.user);
//       } catch (err) {
//         setUser(null); // not authenticated
//       }
//     }
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logout();   // Calls /api/logout/
//       setUser(null);
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   if (!user) return null;

//   return (
//     <nav style={styles.nav}>
//       <div style={styles.left}>
//         <Link to="/" style={styles.link}>🏠 Home</Link>
//       </div>
//       <div style={styles.right}>
//         <span style={styles.user}>Hello, {user}</span>
//         <button onClick={handleLogout} style={styles.button}>Logout</button>
//       </div>
//     </nav>
//   );
// }
// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#222",
//     color: "white",
//     padding: "10px 20px",
//   },
//   left: { display: "flex", alignItems: "center", gap: "15px" },
//   right: { display: "flex", alignItems: "center", gap: "15px" },
//   link: { color: "white", textDecoration: "none", fontWeight: "bold" },
//   user: { fontSize: "0.9rem", color: "#ccc" },
//   button: {
//     background: "#ff5555",
//     border: "none",
//     color: "white",
//     padding: "6px 12px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };
// 

// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api, { logout } from "../api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/check-auth/");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Fetch project name if inside a project route
  useEffect(() => {
    async function fetchProject() {
      if (location.pathname.includes("/projects/")) {
        const projectId = location.pathname.split("/projects/")[1]?.split("/")[0];
        if (projectId) {
          try {
            const res = await api.get(`/projects/${projectId}/`);
            setProjectName(res.data.name || "");
          } catch {
            setProjectName("");
          }
        }
      } else {
        setProjectName("");
      }
    }
    fetchProject();
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>🏠 Home</Link>

        {/* Show project-related links when inside a project */}
        {projectName && (
          <>
            <span style={styles.projectName}>| {projectName}</span>
            <Link to={`/projects/${params.projectId || location.pathname.split("/")[2]}/issues`} style={styles.link}>
              Issues
            </Link>
            <Link to={`/projects/${params.projectId || location.pathname.split("/")[2]}/pullreqs`} style={styles.link}>
              Pull Requests
            </Link>
          </>
        )}
      </div>

      <div style={styles.right}>
        <span style={styles.user}>Hello, {user}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#111",
    color: "white",
    padding: "10px 20px",
    borderBottom: "1px solid #2f2f2f",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "#90ee90",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
  },
  linkHover: {
    color: "#66ff66",
  },
  projectName: {
    color: "#bbb",
    fontWeight: "500",
  },
  user: { fontSize: "0.9rem", color: "#ccc" },
  button: {
    background: "#ff5555",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
