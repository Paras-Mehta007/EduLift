import Opportunity from "../models/Opportunity.js";
import StudentProfile from "../models/StudentProfile.js";
import { calculateEligibility } from "../utils/eligibilityEngine.js";

export const createOpportunity = async (req, res) => {
  const opportunity = await Opportunity.create({
    recruiter: req.user._id,
    ...req.body,
  });
  res.status(201).json(opportunity);
};

export const getStudentFeed = async (req, res) => {
  const student = await StudentProfile.findOne({ user: req.user._id });
  const opportunities = await Opportunity.find();

  const data = opportunities.map(op => ({
    ...op.toObject(),
    ...calculateEligibility(student, op),
  }));

  res.json(data);
};
