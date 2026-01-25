import { useEffect, useState } from "react";
import { getRecruiterFinancialAidApplications, updateFinancialAidStatus } from "../api/financialAid.api";

const FinancialAidRequests = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Form state for updating status
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: "",
    approvedAmount: "",
    rejectionReason: "",
    reviewNotes: ""
  });

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterStatus = statusFilter === "all" ? null : statusFilter;
      const data = await getRecruiterFinancialAidApplications(filterStatus);
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId) => {
    if (!statusUpdateForm.status) {
      alert("Please select a status");
      return;
    }

    if (statusUpdateForm.status === "approved" && !statusUpdateForm.approvedAmount) {
      alert("Please enter approved amount for approval");
      return;
    }

    if (statusUpdateForm.status === "rejected" && !statusUpdateForm.rejectionReason) {
      alert("Please provide a rejection reason");
      return;
    }

    setUpdatingId(applicationId);
    try {
      await updateFinancialAidStatus(applicationId, {
        status: statusUpdateForm.status,
        approvedAmount: statusUpdateForm.status === "approved" ? parseFloat(statusUpdateForm.approvedAmount) : undefined,
        rejectionReason: statusUpdateForm.status === "rejected" ? statusUpdateForm.rejectionReason : undefined,
        reviewNotes: statusUpdateForm.reviewNotes || undefined
      });

      // Update local state
      setApplications(applications.map(app => 
        app._id === applicationId 
          ? { 
              ...app, 
              status: statusUpdateForm.status,
              approvedAmount: statusUpdateForm.approvedAmount,
              rejectionReason: statusUpdateForm.rejectionReason,
              reviewNotes: statusUpdateForm.reviewNotes,
              reviewedAt: new Date()
            }
          : app
      ));

      setExpandedId(null);
      setStatusUpdateForm({ status: "", approvedAmount: "", rejectionReason: "", reviewNotes: "" });
      alert("Status updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const openUpdateForm = (app) => {
    setExpandedId(app._id);
    setStatusUpdateForm({
      status: app.status,
      approvedAmount: app.approvedAmount || "",
      rejectionReason: app.rejectionReason || "",
      reviewNotes: app.reviewNotes || ""
    });
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
        return "Pending";
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

  const countByStatus = (status) => {
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-5 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Financial Aid Requests</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto pb-4">
        {[
          { value: "all", label: "All", count: applications.length },
          { value: "pending", label: "Pending", count: countByStatus("pending") },
          { value: "under-review", label: "Under Review", count: countByStatus("under-review") },
          { value: "approved", label: "Approved", count: countByStatus("approved") },
          { value: "rejected", label: "Rejected", count: countByStatus("rejected") },
          { value: "on-hold", label: "On Hold", count: countByStatus("on-hold") }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors rounded-t-lg ${
              statusFilter === tab.value
                ? "bg-indigo-600 text-white border-b-2 border-indigo-600"
                : "text-gray-700 hover:text-indigo-600"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No financial aid requests in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
            >
              {/* Application Summary */}
              <div
                onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{app.student?.name}</h4>
                    <p className="text-sm text-gray-600">{app.student?.email}</p>
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">College:</span> {app.college}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">CGPA:</span> {app.cgpa}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Amount Requested:</span>{" "}
                        <span className="text-indigo-600 font-bold">${app.amountNeeded}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Purpose:</span> <span className="capitalize">{app.purpose.replace("-", " ")}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${expandedId === app._id ? "transform rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {/* Applied Date */}
                <div className="text-xs text-gray-500">
                  Applied on {new Date(app.appliedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === app._id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
                  {/* Student Details */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <h5 className="font-semibold text-gray-900 mb-3">Student Information</h5>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Full Name:</span> {app.fullName}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {app.email}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Phone:</span> {app.phone}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Major:</span> {app.major}</p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">Graduation Year:</span> {app.graduationYear}</p>
                  </div>

                  {/* Request Details */}
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <h5 className="font-semibold text-gray-900 mb-3">Request Details</h5>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Reason:</span>
                    </p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.reasonForRequest}</p>
                    
                    {app.incomeProofUrl && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Income Proof:</p>
                        <a href={app.incomeProofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 underline">
                          View Document
                        </a>
                      </div>
                    )}
                    
                    {app.documentUrl && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Supporting Document:</p>
                        <a href={app.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-700 underline">
                          View Document
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Status Update Form */}
                  <div className="bg-white rounded-lg p-4 space-y-4">
                    <h5 className="font-semibold text-gray-900">Update Status</h5>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={statusUpdateForm.status}
                        onChange={(e) => setStatusUpdateForm({...statusUpdateForm, status: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select a status</option>
                        <option value="under-review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                    </div>

                    {statusUpdateForm.status === "approved" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Approved Amount ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={statusUpdateForm.approvedAmount}
                          onChange={(e) => setStatusUpdateForm({...statusUpdateForm, approvedAmount: e.target.value})}
                          placeholder="Enter approved amount"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    {statusUpdateForm.status === "rejected" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason</label>
                        <textarea
                          value={statusUpdateForm.rejectionReason}
                          onChange={(e) => setStatusUpdateForm({...statusUpdateForm, rejectionReason: e.target.value})}
                          placeholder="Explain why the application is being rejected"
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Review Notes (Optional)</label>
                      <textarea
                        value={statusUpdateForm.reviewNotes}
                        onChange={(e) => setStatusUpdateForm({...statusUpdateForm, reviewNotes: e.target.value})}
                        placeholder="Add any notes for the student"
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusUpdate(app._id)}
                        disabled={updatingId === app._id}
                        className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                          updatingId === app._id
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {updatingId === app._id && (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {updatingId === app._id ? "Updating..." : "Update Status"}
                      </button>
                      <button
                        onClick={() => {
                          setExpandedId(null);
                          setStatusUpdateForm({ status: "", approvedAmount: "", rejectionReason: "", reviewNotes: "" });
                        }}
                        className="flex-1 px-4 py-2 font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialAidRequests;
