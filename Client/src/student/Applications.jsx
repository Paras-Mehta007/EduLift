import { useEffect, useState } from "react";
import { getStudentApplications } from "../api/opportunity.api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "reviewing":
        return "bg-blue-100 text-blue-700";
      case "applied":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">My Applications</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600">You haven't applied to any opportunities yet.</p>
          <p className="text-gray-500 text-sm mt-2">Browse the Opportunities tab to find jobs that match your profile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.opportunity?.title || "Opportunity"}
                  </h4>
                  {app.opportunity?.company && (
                    <p className="text-sm text-gray-600 mb-2">{app.opportunity.company}</p>
                  )}
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
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <div>
                  <p className="font-semibold text-gray-700">Applied Date</p>
                  <p>{new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}</p>
                </div>
                {app.matchScore !== undefined && (
                  <div>
                    <p className="font-semibold text-gray-700">Match Score</p>
                    <p className="flex items-center gap-2">
                      <span>{Math.round(app.matchScore)}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${app.matchScore}%` }}
                        ></div>
                      </div>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;