import { useEffect, useState } from "react";
import { getStudentFinancialAidApplications, deleteFinancialAidApplication } from "../api/financialAid.api";

const FinancialAidApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentFinancialAidApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    setDeletingId(applicationId);
    try {
      await deleteFinancialAidApplication(applicationId);
      setApplications(applications.filter(app => app._id !== applicationId));
      alert("Application deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "under-review":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "on-hold":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "under-review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "on-hold":
        return "On Hold";
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
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">My Financial Aid Applications</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">You haven't applied for financial aid yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.recruiter?.name || "Organization"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{app.recruiter?.email}</p>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Amount Requested:</span>{" "}
                      <span className="text-indigo-600 font-bold">${app.amountNeeded}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Purpose:</span>{" "}
                      <span className="capitalize">{app.purpose.replace("-", " ")}</span>
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </div>

              {app.status === "approved" && app.approvedAmount && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Approved Amount:</span> ${app.approvedAmount}
                  </p>
                </div>
              )}

              {app.status === "rejected" && app.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Reason:</span> {app.rejectionReason}
                  </p>
                </div>
              )}

              {app.reviewNotes && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Review Notes:</span> {app.reviewNotes}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4 mb-4">
                <div>
                  <p className="font-semibold text-gray-700">Applied</p>
                  <p>{new Date(app.appliedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}</p>
                </div>
                {app.reviewedAt && (
                  <div>
                    <p className="font-semibold text-gray-700">Reviewed</p>
                    <p>{new Date(app.reviewedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}</p>
                  </div>
                )}
              </div>

              {app.status === "pending" && (
                <button
                  onClick={() => handleDelete(app._id)}
                  disabled={deletingId === app._id}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    deletingId === app._id
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  {deletingId === app._id && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {deletingId === app._id ? "Deleting..." : "Delete Application"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialAidApplications;
