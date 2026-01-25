import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import financialAidRoutes from "./routes/financialAid.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(helmet());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "EduLift API is running", status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/financial-aid", financialAidRoutes);

app.use(errorHandler);

export default app;
