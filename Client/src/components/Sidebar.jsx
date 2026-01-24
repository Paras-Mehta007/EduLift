import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!auth.token) return null;

  const isStudent = auth.role === "student";
  const navItems = isStudent
    ? [
        { label: "About", path: "/student", icon: "grid" },
        { label: "Opportunities", path: "/student?tab=opportunities", icon: "search" },
        { label: "Applications", path: "/student?tab=applications", icon: "file" },
        { label: "Profile", path: "/student?tab=profile", icon: "user" },
      ]
    : [
        { label: "About", path: "/recruiter", icon: "grid" },
        { label: "Create Job", path: "/recruiter?tab=create", icon: "plus" },
        { label: "Applicants", path: "/recruiter?tab=applicants", icon: "users" },
      ];

  const getInitials = () => {
    const email = auth.email || "";
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-20"
        } shadow-2xl`}
      >
        {/* Header with Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          {isOpen && (
            <h1 className="text-xl font-bold text-white">EduLift</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-indigo-600 rounded-lg transition-colors duration-200"
            title={isOpen ? "Collapse" : "Expand"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        </div>

        {/* User Info Card */}
        <div className="px-4 py-6 border-b border-indigo-600">
          <div className={`flex items-center gap-3 ${!isOpen && "justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              {getInitials()}
            </div>
            {isOpen && (
              <div>
                <p className="text-sm font-semibold capitalize">{auth.role}</p>
                <p className="text-xs text-indigo-200 truncate">{auth.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="py-6 px-2 space-y-2">
          {navItems.map((item) => {
            const isActive = item.path.includes("?") 
              ? location.pathname + location.search === item.path
              : location.pathname === item.path && !location.search;
            
            return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "hover:bg-indigo-600 text-indigo-100 hover:text-white"
              } ${!isOpen && "justify-center"}`}
              title={!isOpen ? item.label : ""}
            >
              <span className="w-5 h-5 flex-shrink-0">
                {item.icon === "grid" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
                    <path d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
                  </svg>
                )}
                {item.icon === "search" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                  </svg>
                )}
                {item.icon === "file" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3 3 0 01.369-1.495 2 2 0 01.821-1.073A6 6 0 0113.5 13c.33 0 .659-.009.979-.025a2 2 0 01.21.1A2.97 2.97 0 0015 13.34V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1.05a7.001 7.001 0 00-11 7.25 7 7 0 0011-7.25v-1.05a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5V13z"></path>
                  </svg>
                )}
                {item.icon === "user" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                )}
                {item.icon === "plus" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                )}
                {item.icon === "users" && (
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM1 16a4 4 0 014-4h8a4 4 0 014 4v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2z"></path>
                  </svg>
                )}
              </span>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl ${
              !isOpen && "justify-center"
            }`}
            title={!isOpen ? "Logout" : ""}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
            </svg>
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
