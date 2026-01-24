import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getStudentProfile,
  updateStudentProfile,
  saveOpportunity,
} from "../controllers/student.controller.js";

const router = express.Router();

router.use(protect, authorize("student"));

router.get("/profile", getStudentProfile);
router.put("/profile", updateStudentProfile);
router.post("/save/:opportunityId", saveOpportunity);

export default router;
