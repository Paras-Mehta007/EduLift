import { useState, useEffect } from "react";
import { updatePortfolioLinks } from "../api/upload.api";
import { getProfile } from "../api/student.api";

const ResumeUpload = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [resumeLink, setResumeLink] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setResumeLink(data.resumeLink || "");
      setLinkedinUrl(data.linkedinUrl || "");
      setGithubUrl(data.githubUrl || "");
      setPortfolioLink(data.portfolioLink || "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllLinks = async (e) => {
    e.preventDefault();
    
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await updatePortfolioLinks({
        resumeLink: resumeLink || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioLink: portfolioLink || null
      });
      
      setProfile(updatedProfile);
      setSuccess("All links updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update links");
    } finally {
      setUpdating(false);
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Resume & Professional Links</h3>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <form onSubmit={handleUpdateAllLinks} className="space-y-5">
          {/* Resume Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a3 3 0 013 3v7a3 3 0 01-3 3h2a1 1 0 100-2H4a1 1 0 100 2h2a3 3 0 003-3V7a1 1 0 100-2 2 2 0 00-2-2h5a2 2 0 012 2v5a1 1 0 102 0V7a4 4 0 00-4-4H6z"></path>
                </svg>
                Resume (Google Drive Link)
              </span>
            </label>
            <textarea
              placeholder="https://drive.google.com/file/d/..."
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              disabled={updating}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-gray-600 mt-2">
              <strong>How to share from Google Drive:</strong> Right-click file → Share → Copy link → Paste here (Make sure it's set to "Anyone with the link" can view)
            </p>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
                LinkedIn
              </span>
            </label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/yourprofile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </span>
            </label>
            <input
              type="text"
              placeholder="https://github.com/yourprofile"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-8V4c0-1.1-.9-2-2-2s-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                </svg>
                Portfolio Website
              </span>
            </label>
            <input
              type="text"
              placeholder="https://yourportfolio.com"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className={`w-full px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              updating
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {updating && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {updating ? "Saving..." : "Save All Links"}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📌 Tip:</strong> All links are visible to recruiters when they review your application. Make sure your Google Drive link is accessible!
        </p>
      </div>
    </div>
  );
};

export default ResumeUpload;
