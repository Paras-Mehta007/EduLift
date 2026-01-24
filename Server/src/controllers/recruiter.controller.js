import RecruiterProfile from "../models/RecruiterProfile.js";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";

export const createRecruiterProfile = async (req, res) => {
  const profile = await RecruiterProfile.create({
    user: req.user._id,
    ...req.body,
  });
  res.status(201).json(profile);
};

export const getRecruiterDashboard = async (req, res) => {
  const opportunities = await Opportunity.find({ recruiter: req.user._id });
  const ids = opportunities.map(o => o._id);

  const applications = await Application.find({ opportunity: { $in: ids } });

  res.json({
    totalOpportunities: opportunities.length,
    totalApplicants: applications.length,
    approved: applications.filter(a => a.status === "approved").length,
  });
};
