import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  type: { type: String, enum: ["internship", "scholarship", "financial-aid"] },
  eligibility: {
    minCGPA: Number,
    requiredSkills: [String],
    incomeLimit: Number,
  },
  deadline: Date,
}, { timestamps: true });

export default mongoose.model("Opportunity", opportunitySchema);
