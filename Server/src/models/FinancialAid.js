import mongoose from "mongoose";

const financialAidSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // NGO/Organization recruiter
  
  // Personal Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Education Information
  college: String,
  major: String,
  cgpa: Number,
  graduationYear: Number,
  
  // Financial Aid Details
  amountNeeded: { type: Number, required: true }, // In currency (e.g., USD)
  purpose: { 
    type: String, 
    enum: ["tuition", "books", "living-expenses", "medical", "other"],
    required: true 
  },
  reasonForRequest: { type: String, required: true }, // Detailed explanation
  
  // Supporting Documents
  incomeProofUrl: String, // URL to uploaded proof of income/financial need
  documentUrl: String, // URL to any supporting document (recommendation letter, etc)
  
  // Application Status
  status: {
    type: String,
    enum: ["pending", "under-review", "approved", "rejected", "on-hold"],
    default: "pending",
  },
  approvedAmount: Number, // Amount approved by recruiter
  rejectionReason: String, // If rejected, why?
  reviewNotes: String, // Recruiter's notes
  
  // Timestamps
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
}, { timestamps: true });

export default mongoose.model("FinancialAid", financialAidSchema);
