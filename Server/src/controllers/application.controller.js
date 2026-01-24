import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import StudentProfile from "../models/StudentProfile.js";
import { calculateEligibility } from "../utils/eligibilityEngine.js";

export const applyOpportunity = async (req, res) => {
  const student = await StudentProfile.findOne({ user: req.user._id });
  const opportunity = await Opportunity.findById(req.params.id);

  const result = calculateEligibility(student, opportunity);
  if (result.eligibilityStatus === "not-eligible") {
    return res.status(403).json({ message: "Not eligible" });
  }

  const application = await Application.create({
    student: req.user._id,
    opportunity: opportunity._id,
    ...result,
  });

  res.status(201).json(application);
};
