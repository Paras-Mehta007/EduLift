// controllers/upload.controller.js
import cloudinary from "../config/cloudinary.js";
import StudentProfile from "../models/StudentProfile.js";

export const uploadDocuments = async (req, res) => {
  try {
    const type = req.query.type || req.body.type; // resume | income | portfolio
    if (!req.file) return res.status(400).json({ message: "File missing" });

    // Upload to Cloudinary using upload_stream with buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: "auto",
          folder: `edulift/${type}`,
          original_filename: req.file.originalname,
          public_id: `${req.user._id}-${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(req.file.buffer);
    });

    let updateField = {};
    
    if (type === "resume") {
      updateField = { resumeUrl: uploadResult.secure_url };
    } else if (type === "income") {
      updateField = { incomeProofUrl: uploadResult.secure_url };
    } else if (type === "portfolio") {
      updateField = { portfolioUrl: uploadResult.secure_url };
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      updateField,
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const getStudentResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.params.userId })
      .select("resumeLink linkedinUrl githubUrl portfolioLink");
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      resumeLink: profile.resumeLink || null,
      linkedinUrl: profile.linkedinUrl || null,
      githubUrl: profile.githubUrl || null,
      portfolioLink: profile.portfolioLink || null
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

export const updatePortfolioLinks = async (req, res) => {
  try {
    const { resumeLink, linkedinUrl, githubUrl, portfolioLink } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { 
        resumeLink: resumeLink || undefined,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
        portfolioLink: portfolioLink || undefined
      },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    console.error("Error updating social links:", error);
    res.status(500).json({ message: "Failed to update social links" });
  }
};
