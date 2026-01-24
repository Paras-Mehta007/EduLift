// routes/upload.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadDocuments } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/documents",
  protect,
  authorize("student"),
  upload.single("file"),
  uploadDocuments
);

export default router;
