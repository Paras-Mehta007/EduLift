import { useEffect, useState } from "react";
import api from "../api/axios";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data || []);
    } catch (err) {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">My Applications</h3>
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">My Applications</h3>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-center py-8">You haven't applied to any opportunities yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.opportunityId?.title || "Opportunity"}
                  </h4>
                  {app.opportunityId?.company && (
                    <p className="text-sm text-gray-600">{app.opportunityId.company}</p>
                  )}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(app.status)}`}>
                  {app.status || "Pending"}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-700">Applied Date</p>
                  <p>{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                {app.opportunityId?.type && (
                  <div>
                    <p className="font-semibold text-gray-700">Type</p>
                    <p className="capitalize">{app.opportunityId.type}</p>
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