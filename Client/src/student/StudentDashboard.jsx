import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Profile from "./Profile";
import Opportunities from "./Opportunities";
import Applications from "./Applications";
import ApplyForFinancialAid from "./ApplyForFinancialAid";
import FinancialAidApplications from "./FinancialAidApplications";
import ResumeUpload from "./ResumeUpload";

const StudentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "opportunities");
  const [financialAidSubTab, setFinancialAidSubTab] = useState("apply");
  
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "resume":
        return <ResumeUpload />;
      case "opportunities":
        return <Opportunities />;
      case "applications":
        return <Applications />;
      case "financial-aid":
        return (
          <div>
            <div className="mb-6 flex gap-2 border-b border-gray-200 pb-4">
              <button
                onClick={() => setFinancialAidSubTab("apply")}
                className={`px-4 py-2 font-semibold transition-colors ${
                  financialAidSubTab === "apply"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Apply for Aid
              </button>
              <button
                onClick={() => setFinancialAidSubTab("applications")}
                className={`px-4 py-2 font-semibold transition-colors ${
                  financialAidSubTab === "applications"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                My Applications
              </button>
            </div>
            {financialAidSubTab === "apply" && <ApplyForFinancialAid onSuccess={() => setFinancialAidSubTab("applications")} />}
            {financialAidSubTab === "applications" && <FinancialAidApplications />}
          </div>
        );
      default:
        return <Opportunities />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* Tabs Navigation */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 bg-white rounded-t-lg p-4 overflow-x-auto">
          <button
            onClick={() => setSearchParams({ tab: "opportunities" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "opportunities"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            Opportunities
          </button>
          <button
            onClick={() => setSearchParams({ tab: "applications" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "applications"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3 3 0 01.369-1.495 2 2 0 01.821-1.073A6 6 0 0113.5 13c.33 0 .659-.009.979-.025a2 2 0 01.21.1A2.97 2.97 0 0115 13.34V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1.05a7.001 7.001 0 00-11 7.25 7 7 0 0011-7.25v-1.05a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5V13z"></path>
            </svg>
            My Applications
          </button>
          <button
            onClick={() => setSearchParams({ tab: "resume" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "resume"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3 3 0 01.369-1.495 2 2 0 01.821-1.073A6 6 0 0113.5 13c.33 0 .659-.009.979-.025a2 2 0 01.21.1A2.97 2.97 0 0115 13.34V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5v1.05a7.001 7.001 0 00-11 7.25 7 7 0 0011-7.25v-1.05a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5V13z"></path>
            </svg>
            Resume & Portfolio
          </button>
          <button
            onClick={() => setSearchParams({ tab: "financial-aid" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "financial-aid"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z"></path>
            </svg>
            Financial Aid
          </button>
          <button
            onClick={() => setSearchParams({ tab: "profile" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            My Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
