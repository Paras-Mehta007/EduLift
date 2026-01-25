import RecruiterProfile from "../models/RecruiterProfile.js";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

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

export const getAllRecruiters = async (req, res) => {
  try {
    // Get all users with recruiter role
    const recruiters = await User.find({ role: "recruiter" })
      .select("_id name email")
      .sort({ name: 1 });
    
    // If filter=financial-aid is passed, only return recruiters who provide financial aid
    const filterType = req.query.filter;
    
    if (filterType === "financial-aid") {
      // Filter to only recruiters with financial aid enabled
      const recruiterIds = recruiters.map(r => r._id);
      const recruiterProfiles = await RecruiterProfile.find({
        user: { $in: recruiterIds },
        providesFinancialAid: true
      });
      
      const financialAidRecruiterIds = recruiterProfiles.map(p => p.user.toString());
      const filteredRecruiters = recruiters.filter(r => 
        financialAidRecruiterIds.includes(r._id.toString())
      );
      
      return res.json(filteredRecruiters);
    }
    
    res.json(recruiters);
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    res.status(500).json({ message: "Failed to fetch recruiters" });
  }
};

export const getRecruiterProfile = async (req, res) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id }).populate("user", "name email");
    
    // If profile doesn't exist, create a default one
    if (!profile) {
      profile = await RecruiterProfile.create({
        user: req.user._id,
        organizationName: "",
        organizationType: "NGO",
        providesFinancialAid: false,
        financialAidDetails: ""
      });
      profile = await profile.populate("user", "name email");
    }
    
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateRecruiterProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
