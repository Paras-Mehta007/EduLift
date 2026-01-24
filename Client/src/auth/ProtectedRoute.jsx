import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { auth, loading } = useAuth();

  if (loading) return null; // wait until auth is ready

  if (!auth?.token) return <Navigate to="/login" />;

  if (role && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
