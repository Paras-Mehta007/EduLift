import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/student.api";

const Profile = () => {
  const [profile, setProfile] = useState({
    college: "",
    cgpa: "",
    graduationYear: "",
    major: "",
    skills: "",
    experience: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data || {});
      } catch (err) {
        console.error(err);
        setProfile({});
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(profile);
      setMessage("Profile saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
          My Profile
        </h3>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border-l-4 ${
          message.includes("success")
            ? "bg-green-50 border-green-500 text-green-700"
            : "bg-red-50 border-red-500 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            College/University
          </label>
          <input
            type="text"
            placeholder="e.g., MIT, Stanford"
            value={profile.college || ""}
            onChange={(e) => setProfile({ ...profile, college: e.target.value })}
            disabled={saving}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Major/Field of Study
          </label>
          <input
            type="text"
            placeholder="e.g., Computer Science"
            value={profile.major || ""}
            onChange={(e) => setProfile({ ...profile, major: e.target.value })}
            disabled={saving}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              placeholder="3.8"
              value={profile.cgpa || ""}
              onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Graduation Year
            </label>
            <input
              type="number"
              placeholder="2025"
              value={profile.graduationYear || ""}
              onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skills (comma-separated)
          </label>
          <textarea
            placeholder="Python, JavaScript, React, Node.js"
            rows="3"
            value={profile.skills || ""}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            disabled={saving}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition font-inherit"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Experience
          </label>
          <textarea
            placeholder="Describe your work experience, internships, or projects"
            rows="4"
            value={profile.experience || ""}
            onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            disabled={saving}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:bg-gray-50 transition font-inherit"
          ></textarea>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

export default Profile;
