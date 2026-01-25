import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  college: String,
  degree: String,
  cgpa: Number,
  skills: [String],
  incomeRange: Number,
  resumeLink: String,
  linkedinUrl: String,
  githubUrl: String,
  portfolioLink: String,
  incomeProofUrl: String,
  savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],
}, { timestamps: true });

export default mongoose.model("StudentProfile", studentProfileSchema);
