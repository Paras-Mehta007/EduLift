import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { applyOpportunity } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/:id", protect, authorize("student"), applyOpportunity);

export default router;
