import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!auth.token) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg border-b border-indigo-800">
      <div className="max-w-full px-8 py-4 flex items-center justify-between">
        <Link
          to={auth.role === "student" ? "/student" : "/recruiter"}
          className="text-2xl font-bold text-white hover:text-indigo-100 transition-colors"
        >
          EduLift
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm">
                {auth.role === "student" ? "Student" : "Recruiter"}
              </p>
              <p className="text-indigo-100 text-xs">{auth.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;