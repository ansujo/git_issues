import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState({});
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/auth/my-permissions/");
      setPermissions(res.data.permissions || {});
      setRole(res.data.role || null);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions(); // ✅ Load once after login
  }, []);

  return (
    <PermissionContext.Provider value={{ permissions, role, loading }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);
