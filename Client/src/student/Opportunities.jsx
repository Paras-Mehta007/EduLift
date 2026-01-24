import { useEffect, useState } from "react";
import { getStudentFeed, applyToOpportunity } from "../api/opportunity.api";

const Opportunities = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    getStudentFeed()
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (opportunityId) => {
    try {
      await applyToOpportunity(opportunityId);
      setList(list.filter((op) => op._id !== opportunityId));
    } catch (err) {
      alert("Failed to apply. Please try again.");
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Opportunities</h3>
        <p className="text-gray-600">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Opportunities</h3>

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
        <p className="text-gray-600 text-center py-8">
          {list.length === 0 ? "No opportunities available yet." : "No opportunities match your search."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((op) => (
            <div
              key={op._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
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
                      op.eligibilityStatus === "Eligible"
                        ? "bg-green-100 text-green-700"
                        : op.eligibilityStatus === "Partially Eligible"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {op.eligibilityStatus}
                  </span>
                )}
                {op.matchScore !== undefined && (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">
                    Match: {op.matchScore}%
                  </span>
                )}
              </div>

              <button
                onClick={() => handleApply(op._id)}
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;
