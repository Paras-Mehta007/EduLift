import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";
import StudentDashboard from "./student/StudentDashboard";
import RecruiterDashboard from "./recruiter/RecruiterDashboard";
import { useAuth } from "./context/AuthContext";

const HomeRedirect = () => {
  const { auth, loading } = useAuth();

  if (loading) return null;

  if (!auth?.token) return <Navigate to="/login" />;

  return auth.role === "student"
    ? <Navigate to="/student" />
    : <Navigate to="/recruiter" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
