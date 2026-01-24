import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  createOpportunity,
  getStudentFeed,
} from "../controllers/opportunity.controller.js";

const router = express.Router();

router.post("/", protect, authorize("recruiter"), createOpportunity);
router.get("/student-feed", protect, authorize("student"), getStudentFeed);

export default router;
