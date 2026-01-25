import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateOpportunity from "./CreateOpportunity";
import Applicants from "./Applicants";
import FinancialAidRequests from "./FinancialAidRequests";
import RecruiterProfile from "./RecruiterProfile";

const RecruiterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "create");
  const [refresh, setRefresh] = useState(false);
  
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateOpportunity onSuccess={() => setRefresh(!refresh)} />;
      case "applicants":
        return <Applicants refresh={refresh} />;
      case "financial-aid":
        return <FinancialAidRequests />;
      case "profile":
        return <RecruiterProfile />;
      default:
        return <CreateOpportunity onSuccess={() => setRefresh(!refresh)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
        {/* Tabs Navigation */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 bg-white rounded-t-lg p-4 overflow-x-auto">
          <button
            onClick={() => setSearchParams({ tab: "create" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "create"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5a.5.5 0 00-.5.5v1h-1V2a.5.5 0 00-1 0v1H7V2a.5.5 0 00-1 0v1H5V2a.5.5 0 00-1 0v1H3.5A2.5 2.5 0 001 5.5v11A2.5 2.5 0 003.5 19h13a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0016.5 2H15V1a.5.5 0 00-1 0v1h-1V1a.5.5 0 00-1 0v1h-1V1a.5.5 0 00-.5-.5zm0 3h6v1h-6v-1z"></path>
            </svg>
            Create Opportunity
          </button>
          <button
            onClick={() => setSearchParams({ tab: "applicants" })}
            className={`px-6 py-3 font-semibold border-b-4 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "applicants"
                ? "text-indigo-600 border-indigo-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM8 15a4 4 0 00-8 0v2h8v-2z"></path>
            </svg>
            View Applicants
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
            Financial Aid Requests
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
            Organization Profile
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

export default RecruiterDashboard;
