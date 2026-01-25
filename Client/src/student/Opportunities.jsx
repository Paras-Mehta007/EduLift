import { useEffect, useState } from "react";
import { getStudentFeed, applyToOpportunity } from "../api/opportunity.api";

const Opportunities = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getStudentFeed();
      setList(data || []);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      alert("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId) => {
    setApplyingId(opportunityId);
    try {
      await applyToOpportunity(opportunityId);
      
      // Update UI immediately
      setAppliedIds(prev => new Set(prev).add(opportunityId));
      setList(list.filter(op => op._id !== opportunityId));
      
      // Show success message
      alert("Applied successfully!");
    } catch (err) {
      console.error("Apply error:", err);
      const errorMsg = err.response?.data?.message || "Failed to apply. Please try again.";
      alert(errorMsg);
    } finally {
      setApplyingId(null);
    }
  };

  const filteredList = list.filter((op) => {
    const matchesSearch = op.title.toLowerCase().includes(search.toLowerCase()) ||
      (op.company && op.company.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === "all" || op.type === filterType;
    return matchesSearch && matchesType;
  });

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
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Available Opportunities</h3>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 transition"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 transition bg-white"
        >
          <option value="all">All Types</option>
          <option value="internship">Internship</option>
          <option value="job">Full-time Job</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600">
            {list.length === 0 ? "No opportunities available yet." : "No opportunities match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((op) => (
            <div
              key={op._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{op.title}</h4>
                  {op.company && (
                    <p className="text-sm text-gray-600 mb-2">{op.company}</p>
                  )}
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full capitalize">
                  {op.type}
                </span>
              </div>

              {op.description && (
                <p className="text-gray-600 text-sm mb-3">{op.description.substring(0, 150)}...</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {op.eligibilityStatus && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      op.eligibilityStatus === "eligible"
                        ? "bg-green-100 text-green-700"
                        : op.eligibilityStatus === "partially-eligible"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {op.eligibilityStatus === "eligible" ? "Eligible" : 
                     op.eligibilityStatus === "partially-eligible" ? "Partially Eligible" : "Not Eligible"}
                  </span>
                )}
                {op.matchScore !== undefined && (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">
                    Match: {Math.round(op.matchScore)}%
                  </span>
                )}
              </div>

              <button
                onClick={() => handleApply(op._id)}
                disabled={applyingId === op._id || op.eligibilityStatus === "not-eligible"}
                className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 ${
                  op.eligibilityStatus === "not-eligible"
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : applyingId === op._id
                    ? "bg-indigo-600 text-white opacity-75"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {applyingId === op._id ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Applying...
                  </>
                ) : op.eligibilityStatus === "not-eligible" ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 2.476m8.59 11.209l2.546 2.546a1 1 0 01-1.414 1.414l-2.546-2.546m5.959-5.959a6 6 0 10-8.485 8.485m8.485-8.485A6 6 0 008.485 18.88" clipRule="evenodd" />
                    </svg>
                    Not Eligible
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Apply Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
