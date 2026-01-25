import FinancialAid from "../models/FinancialAid.js";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import RecruiterProfile from "../models/RecruiterProfile.js";

export const applyForFinancialAid = async (req, res) => {
  try {
    const {
      recruiterId,
      amountNeeded,
      purpose,
      reasonForRequest,
      incomeProofUrl,
      documentUrl,
    } = req.body;

    // Validation
    if (!recruiterId || !amountNeeded || !purpose || !reasonForRequest) {
      return res.status(400).json({
        message: "Missing required fields: recruiterId, amountNeeded, purpose, reasonForRequest",
      });
    }

    if (amountNeeded <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Verify recruiter exists and is NGO/Organization
    const recruiter = await User.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Organization not found" });
    }
    if (recruiter.role !== "recruiter") {
      return res.status(400).json({ message: "Invalid organization" });
    }

    // Check if recruiter has enabled financial aid
    const recruiterProfile = await RecruiterProfile.findOne({ user: recruiterId });
    if (!recruiterProfile || !recruiterProfile.providesFinancialAid) {
      return res.status(400).json({ 
        message: "This organization does not currently accept financial aid applications" 
      });
    }

    // Get student's profile information
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Check if already applied to this recruiter for financial aid
    const existingApplication = await FinancialAid.findOne({
      student: req.user._id,
      recruiter: recruiterId,
      status: { $in: ["pending", "under-review"] },
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You already have a pending application with this organization",
      });
    }

    // Get student's user data
    const student = await User.findById(req.user._id);

    // Create financial aid application
    const application = await FinancialAid.create({
      student: req.user._id,
      recruiter: recruiterId,
      fullName: student.name || "",
      email: student.email,
      phone: student.phone || "",
      college: studentProfile.college || "",
      major: studentProfile.major || "",
      cgpa: studentProfile.cgpa || 0,
      graduationYear: studentProfile.graduationYear || 0,
      amountNeeded,
      purpose,
      reasonForRequest,
      incomeProofUrl,
      documentUrl,
      status: "pending",
      appliedAt: new Date(),
    });

    const populatedApp = await FinancialAid.findById(application._id)
      .populate("student", "email name phone")
      .populate("recruiter", "name email");

    res.status(201).json({
      message: "Financial aid application submitted successfully",
      application: populatedApp,
    });
  } catch (error) {
    console.error("Apply for financial aid error:", error);
    res.status(500).json({ message: "Failed to submit financial aid application" });
  }
};

export const getStudentFinancialAidApplications = async (req, res) => {
  try {
    const applications = await FinancialAid.find({ student: req.user._id })
      .populate("recruiter", "name email")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get student financial aid applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getRecruiterFinancialAidApplications = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { recruiter: req.user._id };
    if (status) {
      query.status = status;
    }

    const applications = await FinancialAid.find(query)
      .populate("student", "email name phone")
      .populate("recruiter", "name email")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get recruiter financial aid applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const updateFinancialAidStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, approvedAmount, rejectionReason, reviewNotes } = req.body;

    // Validate status
    const validStatuses = ["pending", "under-review", "approved", "rejected", "on-hold"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Validate approved amount if approving
    if (status === "approved" && (!approvedAmount || approvedAmount <= 0)) {
      return res.status(400).json({
        message: "Approved amount is required and must be greater than 0",
      });
    }

    const application = await FinancialAid.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify recruiter owns this application
    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this application" });
    }

    // Update application
    application.status = status;
    if (approvedAmount) application.approvedAmount = approvedAmount;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    if (reviewNotes) application.reviewNotes = reviewNotes;
    application.reviewedAt = new Date();

    await application.save();

    const updatedApp = await FinancialAid.findById(applicationId)
      .populate("student", "email name phone")
      .populate("recruiter", "name email");

    res.json({
      message: `Application status updated to ${status}`,
      application: updatedApp,
    });
  } catch (error) {
    console.error("Update financial aid status error:", error);
    res.status(500).json({ message: "Failed to update application status" });
  }
};

export const getFinancialAidApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await FinancialAid.findById(applicationId)
      .populate("student", "email name phone")
      .populate("recruiter", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization - student or recruiter who owns the application
    if (
      application.student._id.toString() !== req.user._id.toString() &&
      application.recruiter._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to view this application" });
    }

    res.json(application);
  } catch (error) {
    console.error("Get financial aid application error:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

export const deleteFinancialAidApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await FinancialAid.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only student can delete their own application if it's not approved/rejected
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this application" });
    }

    if (["approved", "rejected"].includes(application.status)) {
      return res.status(400).json({
        message: "Cannot delete applications that have been reviewed",
      });
    }

    await FinancialAid.findByIdAndDelete(applicationId);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete financial aid application error:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};
