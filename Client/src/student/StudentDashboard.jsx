import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Profile from "./Profile";
import Opportunities from "./Opportunities";
import Applications from "./Applications";

const StudentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "about");
  
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to EduLift</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5"></path>
                    </svg>
                    What is EduLift?
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    EduLift is a comprehensive platform designed to bridge the gap between students and recruiters. 
                    We empower students to discover exciting career opportunities while helping recruiters find talented candidates.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    Key Features
                  </h3>
                  <ul className="space-y-3 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Browse Opportunities:</strong> Explore internships, full-time jobs, and freelance projects from top companies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Build Your Profile:</strong> Showcase your skills, experience, and academic achievements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Track Applications:</strong> Monitor the status of all your job applications in one place</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Smart Matching:</strong> Get matched with opportunities based on your skills and eligibility</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM14.917 9h1.946a6.004 6.004 0 01-2.783-4.118c.454 1.148.748 2.572.837 4.118zM12.403 3.97c-.584 1.142-.956 2.465-1.087 3.97h2.172c-.131-1.505-.503-2.828-1.085-3.97zM8.084 9h2.172c-.131-1.505-.503-2.828-1.085-3.97-.584 1.142-.956 2.465-1.087 3.97z" clipRule="evenodd"></path>
                    </svg>
                    Getting Started
                  </h3>
                  <ol className="space-y-3 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">1.</span>
                      <span>Complete your profile with your academic and professional information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">2.</span>
                      <span>Browse available opportunities using the search and filter features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">3.</span>
                      <span>Apply to positions that match your interests and qualifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">4.</span>
                      <span>Track your applications and stay updated on their status</span>
                    </li>
                  </ol>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <p className="text-gray-700 text-lg">
                    <strong>Ready to explore opportunities?</strong> Click on the navigation items in the sidebar to get started with your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "profile":
        return <Profile />;
      case "opportunities":
        return <Opportunities />;
      case "applications":
        return <Applications />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 min-h-screen">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {activeTab === "about" ? "Learn about EduLift" : "Manage your profile and applications"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8">
          {activeTab === "about" ? (
            renderContent()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Sidebar Profile */}
              {(activeTab === "profile" || activeTab === "opportunities" || activeTab === "applications") && (
                <div className="lg:col-span-1">
                  <Profile />
                </div>
              )}

              {/* Main Content Area */}
              <div className={activeTab === "profile" ? "lg:col-span-2" : "lg:col-span-3"}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setSearchParams({ tab: "opportunities" })}
                      className={`flex-1 px-6 py-4 font-semibold border-b-4 transition-all flex items-center justify-center gap-2 min-w-max ${
                        activeTab === "opportunities"
                          ? "text-indigo-600 border-indigo-600 bg-white"
                          : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                      Opportunities
                    </button>
                    <button
                      onClick={() => setSearchParams({ tab: "applications" })}
                      className={`flex-1 px-6 py-4 font-semibold border-b-4 transition-all flex items-center justify-center gap-2 min-w-max ${
                        activeTab === "applications"
                          ? "text-indigo-600 border-indigo-600 bg-white"
                          : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.5 13a3 3 0 01.369-1.495 2 2 0 01.821-1.073A6 6 0 0113.5 13c.33 0 .659-.009.979-.025a2 2 0 01.21.1A2.97 2.97 0 0115 13.34V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1.05a7.001 7.001 0 00-11 7.25 7 7 0 0011-7.25v-1.05a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5V13z"></path>
                      </svg>
                      My Applications
                    </button>
                    <button
                      onClick={() => setSearchParams({ tab: "profile" })}
                      className={`flex-1 px-6 py-4 font-semibold border-b-4 transition-all flex items-center justify-center gap-2 min-w-max ${
                        activeTab === "profile"
                          ? "text-indigo-600 border-indigo-600 bg-white"
                          : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                      My Profile
                    </button>
                  </div>

                  <div className="p-6">
                    {activeTab === "opportunities" && <Opportunities />}
                    {activeTab === "applications" && <Applications />}
                    {activeTab === "profile" && <Profile />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
