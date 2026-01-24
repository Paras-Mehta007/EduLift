// controllers/upload.controller.js
import cloudinary from "../config/cloudinary.js";
import StudentProfile from "../models/StudentProfile.js";

export const uploadDocuments = async (req, res) => {
  const { type } = req.body; // resume | income
  if (!req.file) return res.status(400).json({ message: "File missing" });

  const result = await cloudinary.uploader.upload_stream(
    { resource_type: "raw" },
    async (error, uploadResult) => {
      if (error) throw error;

      const updateField =
        type === "resume"
          ? { resumeUrl: uploadResult.secure_url }
          : { incomeProofUrl: uploadResult.secure_url };

      const profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        updateField,
        { new: true }
      );

      res.json(profile);
    }
  );

  result.end(req.file.buffer);
};
