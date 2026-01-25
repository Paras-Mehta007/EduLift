import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createRecruiterProfile,
  getRecruiterDashboard,
  getAllRecruiters,
  getRecruiterProfile,
  updateRecruiterProfile,
} from "../controllers/recruiter.controller.js";

const router = express.Router();

// Public route to get all recruiters (for financial aid dropdown)
router.get("/list", getAllRecruiters);

// Protected routes for recruiter-only access
router.use(protect, authorize("recruiter"));

router.post("/profile", createRecruiterProfile);
router.get("/dashboard", getRecruiterDashboard);
router.get("/profile/me", getRecruiterProfile);
router.patch("/profile/me", updateRecruiterProfile);

export default router;