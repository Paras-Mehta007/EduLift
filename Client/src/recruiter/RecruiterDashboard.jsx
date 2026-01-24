import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CreateOpportunity from "./CreateOpportunity";
import Applicants from "./Applicants";

const RecruiterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "about");
  const [refresh, setRefresh] = useState(false);
  
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to EduLift Recruiter</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM8 15a4 4 0 00-8 0v2h8v-2z"></path>
                    </svg>
                    Recruit Top Talent
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    EduLift connects you with exceptional students and professionals. Post your opportunities, 
                    browse qualified candidates, and build your dream team all in one platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5"></path>
                    </svg>
                    Recruiter Features
                  </h3>
                  <ul className="space-y-3 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Create Opportunities:</strong> Post internships, full-time jobs, and freelance projects with detailed requirements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Set Eligibility Criteria:</strong> Define CGPA requirements, skills, and education level for automatic candidate matching</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Manage Applicants:</strong> Review applications and track candidate status throughout the hiring process</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold mt-1">•</span>
                      <span><strong>Smart Matching:</strong> Automatically filter candidates based on your eligibility criteria</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM14.917 9h1.946a6.004 6.004 0 01-2.783-4.118c.454 1.148.748 2.572.837 4.118zM12.403 3.97c-.584 1.142-.956 2.465-1.087 3.97h2.172c-.131-1.505-.503-2.828-1.085-3.97zM8.084 9h2.172c-.131-1.505-.503-2.828-1.085-3.97-.584 1.142-.956 2.465-1.087 3.97z" clipRule="evenodd"></path>
                    </svg>
                    How to Get Started
                  </h3>
                  <ol className="space-y-3 text-gray-700 text-lg">
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">1.</span>
                      <span>Navigate to "Create Opportunity" tab</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">2.</span>
                      <span>Fill in job details including title, description, salary, and eligibility criteria</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">3.</span>
                      <span>Review incoming applications in the "My Applicants" section</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-indigo-600 font-bold">4.</span>
                      <span>Update candidate status (pending, accepted, rejected) to manage your hiring pipeline</span>
                    </li>
                  </ol>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <p className="text-gray-700 text-lg">
                    <strong>Ready to find talent?</strong> Click on "Create Opportunity" in the sidebar to post your first job or internship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case "create":
        return <CreateOpportunity onSuccess={() => setRefresh(!refresh)} />;
      case "applicants":
        return <Applicants refresh={refresh} />;
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
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {activeTab === "about" ? "Learn about recruiting on EduLift" : "Create and manage your opportunities"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-8">
          {activeTab === "about" ? (
            renderContent()
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSearchParams({ tab: "create" })}
                  className={`flex-1 px-6 py-4 font-semibold border-b-4 transition-all flex items-center justify-center gap-2 min-w-max ${
                    activeTab === "create"
                      ? "text-indigo-600 border-indigo-600 bg-white"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM8 15a4 4 0 00-8 0v2h8v-2z"></path>
                  </svg>
                  Create Opportunity
                </button>
                <button
                  onClick={() => setSearchParams({ tab: "applicants" })}
                  className={`flex-1 px-6 py-4 font-semibold border-b-4 transition-all flex items-center justify-center gap-2 min-w-max ${
                    activeTab === "applicants"
                      ? "text-indigo-600 border-indigo-600 bg-white"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  View Applicants
                </button>
              </div>

              <div className="p-6">
                {activeTab === "create" && <CreateOpportunity onSuccess={() => setRefresh(!refresh)} />}
                {activeTab === "applicants" && <Applicants refresh={refresh} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
