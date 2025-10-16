// src/components/ProjectList.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

// Define main styles as constants for cleaner JSX
const styles = {
  container: {
    backgroundColor: '#1E1E1E', // Dark/Blackish background
    color: 'white',             // White text for the overall container
    minHeight: '100vh',         // Ensure the background covers the whole screen height
    padding: '20px',
  },
  projectItemBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    margin: '10px 0',
    border: '2px solid #90EE90', // Light green border
    borderRadius: '5px',         // Slightly rounded corners
    backgroundColor: '#2D2D2D',  // A slightly lighter dark for the box background
  },
  projectText: {
    fontWeight: 'bold',
    fontSize: '1.1em',
  },
  button: {
    backgroundColor: '#90EE90', // Light green background for the button
    color: '#1E1E1E',           // Dark text on the button
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  }
};

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/projects/").then((res) => setProjects(res.data));
  }, []);
  
  const handleOpen = (projectId) => {
    navigate(`/projects/${projectId}/issues`);
  };

  return (
    // Apply the main dark theme style to the outer div
    <div style={styles.container}>
      <h2>Projects</h2>
      {projects.map((project) => (
        // Apply the project item box style
        <div 
          key={project.id} 
          style={styles.projectItemBox}
        >
          {/* Apply the project text style */}
          <span style={styles.projectText}>{project.name}</span>
          
          {/* Apply the button style */}
          <button 
            onClick={() => handleOpen(project.id)}
            style={styles.button}
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}


// // src/components/ProjectList.js
// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { useNavigate, Link } from "react-router-dom";

// const styles = {
//   container: {
//     backgroundColor: "#1E1E1E",
//     color: "white",
//     minHeight: "100vh",
//     padding: "20px",
//   },
//   projectItemBox: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px",
//     margin: "10px 0",
//     border: "2px solid #90EE90",
//     borderRadius: "5px",
//     backgroundColor: "#2D2D2D",
//   },
//   projectText: {
//     fontWeight: "bold",
//     fontSize: "1.1em",
//   },
//   buttonGroup: {
//     display: "flex",
//     gap: "10px",
//   },
//   button: {
//     backgroundColor: "#90EE90",
//     color: "#1E1E1E",
//     border: "none",
//     padding: "8px 15px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
//   deleteButton: {
//     backgroundColor: "#ff4d4d",
//     color: "white",
//     border: "none",
//     padding: "8px 15px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
//   addButton: {
//     display: "inline-block",
//     marginBottom: "15px",
//     backgroundColor: "#90EE90",
//     color: "#1E1E1E",
//     border: "none",
//     padding: "8px 15px",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontWeight: "600",
//     textDecoration: "none",
//   },
// };

// export default function ProjectList() {
//   const [projects, setProjects] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = () => {
//     api
//       .get("/projects/")
//       .then((res) => setProjects(res.data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   };

//   const handleOpen = (projectId) => {
//     navigate(`/projects/${projectId}/issues`); // ✅ must match your route definition
//   };

//   const handleDelete = async (projectId) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       try {
//         await api.delete(`/projects/${projectId}/`);
//         setProjects(projects.filter((p) => p.id !== projectId));
//       } catch (error) {
//         console.error("Error deleting project:", error);
//       }
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Projects</h2>

//       {/* ✅ Add project button */}
//       <Link to="/projects/new" style={styles.addButton}>
//         ➕ Add Project
//       </Link>

//       {projects.length === 0 ? (
//         <p>No projects available.</p>
//       ) : (
//         projects.map((project) => (
//           <div key={project.id} style={styles.projectItemBox}>
//             <span style={styles.projectText}>{project.name}</span>
//             <div style={styles.buttonGroup}>
//               <button onClick={() => handleOpen(project.id)} style={styles.button}>
//                 Open
//               </button>
//               <button onClick={() => handleDelete(project.id)} style={styles.deleteButton}>
//                 🗑 Delete
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
