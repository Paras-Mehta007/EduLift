import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  applyForFinancialAid,
  getStudentFinancialAidApplications,
  getRecruiterFinancialAidApplications,
  updateFinancialAidStatus,
  getFinancialAidApplicationById,
  deleteFinancialAidApplication,
} from "../controllers/financialAid.controller.js";

const router = express.Router();

// Student routes
router.post(
  "/apply",
  protect,
  authorize("student"),
  applyForFinancialAid
);

router.get(
  "/student/applications",
  protect,
  authorize("student"),
  getStudentFinancialAidApplications
);

router.delete(
  "/:applicationId",
  protect,
  authorize("student"),
  deleteFinancialAidApplication
);

// Recruiter routes
router.get(
  "/recruiter/applications",
  protect,
  authorize("recruiter"),
  getRecruiterFinancialAidApplications
);

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateFinancialAidStatus
);

// Common routes
router.get(
  "/:applicationId",
  protect,
  getFinancialAidApplicationById
);

export default router;
