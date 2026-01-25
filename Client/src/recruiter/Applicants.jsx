import { useEffect, useState } from "react";
import { getRecruiterApplicants, updateApplicationStatus } from "../api/opportunity.api";
import { getStudentResume } from "../api/upload.api";

const Applicants = ({ refresh }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    fetchApplicants();
  }, [refresh]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecruiterApplicants();
      setApplicants(data || []);
      
      // Fetch social links for each applicant
      if (data && data.length > 0) {
        const linksData = {};
        for (const app of data) {
          try {
            const links = await getStudentResume(app.student._id);
            linksData[app.student._id] = links;
          } catch (err) {
            console.error(`Failed to fetch links for ${app.student._id}:`, err);
          }
        }
        setSocialLinks(linksData);
      }
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
      setError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      
      // Update local state immediately
      setApplicants(
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Failed to update application status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "reviewing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "applied":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "applied":
        return "Applied";
      case "reviewing":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const filteredApplicants = applicants.filter(
    (app) => filter === "all" || app.status === filter
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Applicants</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 transition bg-white font-semibold text-gray-700"
        >
          <option value="all">All Applicants ({applicants.length})</option>
          <option value="applied">Applied ({applicants.filter(a => a.status === "applied").length})</option>
          <option value="reviewing">Under Review ({applicants.filter(a => a.status === "reviewing").length})</option>
          <option value="approved">Approved ({applicants.filter(a => a.status === "approved").length})</option>
          <option value="rejected">Rejected ({applicants.filter(a => a.status === "rejected").length})</option>
        </select>
      </div>

      {filteredApplicants.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3.75A2.75 2.75 0 011 18.25V5.75A2.75 2.75 0 013.75 3H15m6 0h4.25A2.75 2.75 0 0123 5.75v12.5A2.75 2.75 0 0120.25 21H15" />
          </svg>
          <p className="text-gray-600">
            {applicants.length === 0
              ? "No applications received yet."
              : "No applicants with this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.student?.email?.split("@")[0] || "Student"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{app.student?.email}</p>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Applied to:</span> {app.opportunity?.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {app.opportunity?.type && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize font-semibold">
                        {app.opportunity.type}
                      </span>
                    )}
                    {app.eligibilityStatus && (
                      <span
                        className={`text-xs px-2 py-1 rounded font-semibold ${
                          app.eligibilityStatus === "eligible"
                            ? "bg-green-100 text-green-700"
                            : app.eligibilityStatus === "partially-eligible"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {app.eligibilityStatus === "eligible" ? "Eligible" :
                         app.eligibilityStatus === "partially-eligible" ? "Partially Eligible" : "Not Eligible"}
                      </span>
                    )}
                    {app.matchScore !== undefined && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                        Match: {Math.round(app.matchScore)}%
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize border ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Applied on:</span>{" "}
                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* Social Links Section */}
              {socialLinks[app.student._id] && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Professional Links</p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks[app.student._id].resumeLink && (
                      <a
                        href={socialLinks[app.student._id].resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition text-sm font-semibold text-red-700"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a3 3 0 013 3v7a3 3 0 01-3 3h2a1 1 0 100-2H4a1 1 0 100 2h2a3 3 0 003-3V7a1 1 0 100-2 2 2 0 00-2-2h5a2 2 0 012 2v5a1 1 0 102 0V7a4 4 0 00-4-4H6z"></path>
                        </svg>
                        Resume
                      </a>
                    )}
                    {socialLinks[app.student._id].linkedinUrl && (
                      <a
                        href={socialLinks[app.student._id].linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition text-sm font-semibold text-blue-700"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {socialLinks[app.student._id].githubUrl && (
                      <a
                        href={socialLinks[app.student._id].githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-900 rounded-lg transition text-sm font-semibold text-white"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {socialLinks[app.student._id].portfolioLink && (
                      <a
                        href={socialLinks[app.student._id].portfolioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition text-sm font-semibold text-purple-700"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.5 1.5H19a1 1 0 011 1v15a1 1 0 01-1 1h-9m0-18H1a1 1 0 00-1 1v15a1 1 0 001 1h9m0-18v18m0-18l8 8m-8 0l-8 8" strokeWidth="2" stroke="currentColor" fill="none"/>
                        </svg>
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(app._id, "reviewing")}
                  disabled={updatingId === app._id || app.status === "reviewing"}
                  className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm flex items-center gap-2 ${
                    app.status === "reviewing"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : updatingId === app._id
                      ? "bg-blue-600 text-white opacity-75"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {updatingId === app._id && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>}
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(app._id, "approved")}
                  disabled={updatingId === app._id || app.status === "approved"}
                  className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm flex items-center gap-2 ${
                    app.status === "approved"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : updatingId === app._id
                      ? "bg-green-600 text-white opacity-75"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {updatingId === app._id && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>}
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(app._id, "rejected")}
                  disabled={updatingId === app._id || app.status === "rejected"}
                  className={`px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm flex items-center gap-2 ${
                    app.status === "rejected"
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : updatingId === app._id
                      ? "bg-red-600 text-white opacity-75"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {updatingId === app._id && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;