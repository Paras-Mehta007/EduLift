import { useEffect, useState } from "react";
import api from "../api/axios";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await api.get("/applications");
      setApplicants(response.data || []);
    } catch (err) {
      console.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}`, { status });
      setApplicants(
        applicants.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredApplicants = applicants.filter(
    (app) => filter === "all" || app.status === filter
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Applicants</h3>
        <p className="text-gray-600">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Applicants</h3>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 transition bg-white"
        >
          <option value="all">All Applicants</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApplicants.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          {applicants.length === 0
            ? "No applications received yet."
            : "No applicants with this status."}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.studentId?.name || "Student"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{app.studentId?.email}</p>
                  <p className="text-sm text-gray-600">
                    Applied to: <span className="font-semibold">{app.opportunityId?.title}</span>
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(app.status)}`}>
                  {app.status || "Pending"}
                </span>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Applied on:</span>{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateApplicationStatus(app._id, "accepted")}
                  disabled={app.status === "accepted"}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateApplicationStatus(app._id, "rejected")}
                  disabled={app.status === "rejected"}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => updateApplicationStatus(app._id, "pending")}
                  disabled={app.status === "pending"}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  Mark as Pending
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