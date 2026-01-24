import { useState } from "react";
import api from "../api/axios";

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "internship",
    description: "",
    salary: "",
    location: "",
    deadline: "",
    eligibility: {
      minCGPA: "",
      requiredSkills: "",
      educationLevel: "Bachelors",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("eligibility_")) {
      const field = name.replace("eligibility_", "");
      setFormData({
        ...formData,
        eligibility: { ...formData.eligibility, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.title || !formData.company) {
      setMessage("Title and company are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/opportunities", formData);
      setMessage("Opportunity created successfully");
      setFormData({
        title: "",
        company: "",
        type: "internship",
        description: "",
        salary: "",
        location: "",
        deadline: "",
        eligibility: {
          minCGPA: "",
          requiredSkills: "",
          educationLevel: "Bachelors",
        },
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to create opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create Opportunity</h3>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 border-l-4 ${
            message.includes("success")
              ? "bg-green-50 border-green-500 text-green-600"
              : "bg-red-50 border-red-500 text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Software Engineer"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
              Company Name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="e.g., Google"
              value={formData.company}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
            >
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g., San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the opportunity, responsibilities, and benefits"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition font-inherit"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="salary" className="block text-sm font-semibold text-gray-900 mb-2">
              Salary/Stipend
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              placeholder="e.g., $50,000 - $70,000"
              value={formData.salary}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-gray-900 mb-2">
              Application Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minCGPA" className="block text-sm font-semibold text-gray-900 mb-2">
                Minimum CGPA
              </label>
              <input
                id="minCGPA"
                name="eligibility_minCGPA"
                type="number"
                step="0.1"
                min="0"
                max="4"
                placeholder="e.g., 3.0"
                value={formData.eligibility.minCGPA}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div>
              <label htmlFor="educationLevel" className="block text-sm font-semibold text-gray-900 mb-2">
                Education Level
              </label>
              <select
                id="educationLevel"
                name="eligibility_educationLevel"
                value={formData.eligibility.educationLevel}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white"
              >
                <option value="High School">High School</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="requiredSkills" className="block text-sm font-semibold text-gray-900 mb-2">
              Required Skills (comma-separated)
            </label>
            <textarea
              id="requiredSkills"
              name="eligibility_requiredSkills"
              placeholder="e.g., Python, JavaScript, React"
              rows="3"
              value={formData.eligibility.requiredSkills}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed transition font-inherit"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          {loading ? "Creating..." : "Create Opportunity"}
        </button>
      </form>
    </div>
  );
};

export default CreateOpportunity;
