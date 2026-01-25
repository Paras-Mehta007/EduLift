import { useState, useEffect } from "react";
import { getRecruiterProfile, updateRecruiterProfile } from "../api/recruiter.api";

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "NGO",
    providesFinancialAid: false,
    financialAidDetails: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecruiterProfile();
      setProfile(data);
      setFormData({
        organizationName: data.organizationName || "",
        organizationType: data.organizationType || "NGO",
        providesFinancialAid: data.providesFinancialAid || false,
        financialAidDetails: data.financialAidDetails || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    if (!formData.organizationName) {
      setError("Organization name is required");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await updateRecruiterProfile(formData);
      setProfile(updatedProfile);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Organization Profile</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6">
        {/* Organization Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Organization Name
          </label>
          {!editing ? (
            <p className="text-gray-900 text-lg">{profile?.organizationName || "Not set"}</p>
          ) : (
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Enter organization name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10"
            />
          )}
        </div>

        {/* Organization Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Organization Type
          </label>
          {!editing ? (
            <p className="text-gray-900 text-lg">{profile?.organizationType || "Not set"}</p>
          ) : (
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10"
            >
              <option value="Company">Company</option>
              <option value="NGO">NGO</option>
              <option value="Institution">Institution</option>
            </select>
          )}
        </div>

        {/* Financial Aid Toggle */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Provide Financial Aid
              </label>
              <p className="text-sm text-gray-600">
                Enable this if your organization wants to provide financial assistance to students
              </p>
            </div>
            {!editing ? (
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  profile?.providesFinancialAid
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {profile?.providesFinancialAid ? "Enabled" : "Disabled"}
              </div>
            ) : (
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="providesFinancialAid"
                  checked={formData.providesFinancialAid}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            )}
          </div>
        </div>

        {/* Financial Aid Details */}
        {(editing || formData.providesFinancialAid) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Financial Aid Details
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Describe the types of financial aid your organization provides (e.g., scholarships, grants, emergency funds)
            </p>
            {!editing ? (
              <p className="text-gray-900 text-sm bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {profile?.financialAidDetails || "No details provided"}
              </p>
            ) : (
              <textarea
                name="financialAidDetails"
                value={formData.financialAidDetails}
                onChange={handleChange}
                placeholder="Describe your financial aid programs..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10"
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6 flex gap-3">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 px-6 py-2 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  saving
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    organizationName: profile?.organizationName || "",
                    organizationType: profile?.organizationType || "NGO",
                    providesFinancialAid: profile?.providesFinancialAid || false,
                    financialAidDetails: profile?.financialAidDetails || "",
                  });
                }}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Info Box */}
        {formData.providesFinancialAid && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">✓ Enabled for Financial Aid</span><br/>
              Your organization will appear in the financial aid dropdown. Students can submit applications directly to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfile;
