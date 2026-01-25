import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  organizationName: String,
  organizationType: { type: String, enum: ["Company", "NGO", "Institution"] },
  providesFinancialAid: { type: Boolean, default: false },
  financialAidDetails: String,
}, { timestamps: true });

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);
