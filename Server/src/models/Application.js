import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" },
  status: {
    type: String,
    enum: ["applied", "reviewing", "approved", "rejected"],
    default: "applied",
  },
  eligibilityStatus: String,
  matchScore: Number,
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
