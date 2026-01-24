import StudentProfile from "../models/StudentProfile.js";

export const getStudentProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });
  res.json(profile);
};

export const updateStudentProfile = async (req, res) => {
  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    req.body,
    { new: true, upsert: true }
  );
  res.json(profile);
};

export const saveOpportunity = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile.savedOpportunities.includes(req.params.opportunityId)) {
    profile.savedOpportunities.push(req.params.opportunityId);
    await profile.save();
  }

  res.json({ message: "Saved" });
};
