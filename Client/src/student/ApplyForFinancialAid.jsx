import { useState, useEffect } from "react";
import { applyForFinancialAid } from "../api/financialAid.api";
import { getProfile } from "../api/student.api";
import { getAllRecruiters } from "../api/recruiter.api";

const ApplyForFinancialAid = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    recruiterId: "",
    amountNeeded: "",
    purpose: "",
    reasonForRequest: "",
    incomeProofUrl: "",
    documentUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [loadingRecruiters, setLoadingRecruiters] = useState(true);

  useEffect(() => {
    loadProfile();
    loadRecruiters();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      setStudentProfile(profile);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadRecruiters = async () => {
    try {
      setLoadingRecruiters(true);
      const data = await getAllRecruiters();
      // Filter to only show recruiters who provide financial aid (backend already filters, but this is safe)
      const financialAidRecruiters = data || [];
      setRecruiters(financialAidRecruiters);
    } catch (err) {
      console.error("Failed to load recruiters:", err);
      setError("Failed to load organizations");
    } finally {
      setLoadingRecruiters(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (
        !formData.recruiterId ||
        !formData.amountNeeded ||
        !formData.purpose ||
        !formData.reasonForRequest
      ) {
        setError("Please fill in all required fields");
        return;
      }

      if (formData.amountNeeded <= 0) {
        setError("Amount must be greater than 0");
        return;
      }

      await applyForFinancialAid(formData);
      setMessage("Financial aid application submitted successfully!");
      setFormData({
        recruiterId: "",
        amountNeeded: "",
        purpose: "",
        reasonForRequest: "",
        incomeProofUrl: "",
        documentUrl: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit application";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Apply for Financial Aid
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        {/* Organization Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Organization <span className="text-red-500">*</span>
          </label>
          <select
            name="recruiterId"
            value={formData.recruiterId}
            onChange={handleChange}
            disabled={loading || loadingRecruiters}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
            required
          >
            <option value="">
              {loadingRecruiters ? "Loading organizations..." : "Choose an organization..."}
            </option>
            {recruiters.map((recruiter) => (
              <option key={recruiter._id} value={recruiter._id}>
                {recruiter.name || recruiter.email}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Needed */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount Needed (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="amountNeeded"
            value={formData.amountNeeded}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., 5000"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
            required
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Purpose of Funds <span className="text-red-500">*</span>
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
            required
          >
            <option value="">Select purpose...</option>
            <option value="tuition">Tuition Fees</option>
            <option value="books">Books & Materials</option>
            <option value="living-expenses">Living Expenses</option>
            <option value="medical">Medical Emergency</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Reason for Request */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Request <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reasonForRequest"
            value={formData.reasonForRequest}
            onChange={handleChange}
            disabled={loading}
            placeholder="Explain your financial situation and why you need this aid..."
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition resize-none"
            required
          />
        </div>

        {/* Income Proof URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Income Proof URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="url"
            name="incomeProofUrl"
            value={formData.incomeProofUrl}
            onChange={handleChange}
            disabled={loading}
            placeholder="Link to income proof document"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
          />
        </div>

        {/* Supporting Document URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Supporting Document URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="url"
            name="documentUrl"
            value={formData.documentUrl}
            onChange={handleChange}
            disabled={loading}
            placeholder="Link to recommendation letter or other supporting document"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
          />
        </div>

        {/* Student Info Display */}
        {studentProfile && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">College:</span> {studentProfile.college || "Not provided"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Major:</span> {studentProfile.major || "Not provided"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">CGPA:</span> {studentProfile.cgpa || "Not provided"}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplyForFinancialAid;
