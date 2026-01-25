import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  applyOpportunity,
  getStudentApplications,
  getRecruiterApplicants,
  updateApplicationStatus,
  checkIfApplied,
} from "../controllers/application.controller.js";

const router = express.Router();

// Student routes
router.post("/:id", protect, authorize("student"), applyOpportunity);
router.get("/student/applications", protect, authorize("student"), getStudentApplications);
router.get("/check/:opportunityId", protect, authorize("student"), checkIfApplied);

// Recruiter routes
router.get("/recruiter/applicants", protect, authorize("recruiter"), getRecruiterApplicants);

// Common routes
router.patch("/:id", protect, updateApplicationStatus);

export default router;
