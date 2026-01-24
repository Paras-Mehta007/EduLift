import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createRecruiterProfile,
  getRecruiterDashboard,
} from "../controllers/recruiter.controller.js";

const router = express.Router();

router.use(protect, authorize("recruiter"));

router.post("/profile", createRecruiterProfile);
router.get("/dashboard", getRecruiterDashboard);

export default router;
