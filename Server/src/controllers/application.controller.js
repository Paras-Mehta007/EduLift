import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import StudentProfile from "../models/StudentProfile.js";
import { calculateEligibility } from "../utils/eligibilityEngine.js";

export const applyOpportunity = async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    const opportunity = await Opportunity.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      student: req.user._id,
      opportunity: req.params.id,
    });
    if (existingApplication) {
      return res.status(409).json({ message: "Already applied to this opportunity" });
    }

    const result = calculateEligibility(student, opportunity);
    if (result.eligibilityStatus === "not-eligible") {
      return res.status(403).json({ message: "Not eligible for this opportunity" });
    }

    const application = await Application.create({
      student: req.user._id,
      opportunity: opportunity._id,
      status: "applied",
      ...result,
    });

    const populatedApp = await Application.findById(application._id)
      .populate("student", "email name")
      .populate("opportunity", "title company type");

    res.status(201).json(populatedApp);
  } catch (error) {
    console.error("Apply opportunity error:", error);
    res.status(500).json({ message: "Failed to apply for opportunity" });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("opportunity", "title company type salary deadline")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getRecruiterApplicants = async (req, res) => {
  try {
    // Get all opportunities created by this recruiter
    const opportunities = await Opportunity.find({ recruiter: req.user._id });
    const opportunityIds = opportunities.map((op) => op._id);

    // Get all applications for these opportunities
    const applicants = await Application.find({ opportunity: { $in: opportunityIds } })
      .populate("student", "email")
      .populate("opportunity", "title company type")
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (error) {
    console.error("Get applicants error:", error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["applied", "reviewing", "approved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate("student", "email")
      .populate("opportunity", "title company type");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

export const checkIfApplied = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const application = await Application.findOne({
      student: req.user._id,
      opportunity: opportunityId,
    });

    res.json({ applied: !!application, application });
  } catch (error) {
    console.error("Check applied error:", error);
    res.status(500).json({ message: "Failed to check application status" });
  }
};
