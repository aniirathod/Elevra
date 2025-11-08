import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js"; // Use extended request type
import Resume from "../models/Resume.model.js";
import mongoose from "mongoose";

// Get all resumes for the current user
export const getResumes = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const resumes = await Resume.find({ userId: req.user.userId }).select(
      "-content"
    );
    res.status(200).json({ resumes });
  } catch (error) {
    console.error("Get Resumes Error:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

// Create a new resume
export const createResume = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { title, content } = req.body;
    const newResume = new Resume({
      userId: req.user.userId,
      title: title || "Untitled Resume", // Use provided title or default
      content: content || {}, // Use provided content or default
    });
    await newResume.save();
    res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    console.error("Create Resume Error:", error);
    res.status(500).json({ message: "Error creating resume" });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { resumeId } = req.params;

  // Validate the resumeId format
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return res.status(400).json({ message: "Invalid Resume ID format" });
  }

  try {
    // Find the resume by ID and ensure it belongs to the logged-in user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or user does not have permission" });
    }

    res.status(200).json({ resume }); // Return the full resume content
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    res.status(500).json({ message: "Error fetching resume" });
  }
};

// --- Update a specific resume by ID ---
export const updateResume = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { resumeId } = req.params;
  const { title, content } = req.body; // Get updated title and content

  // Validate the resumeId format
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return res.status(400).json({ message: "Invalid Resume ID format" });
  }
  // Basic validation for content
  if (!content && !title) {
    return res
      .status(400)
      .json({ message: "Either title or content must be provided for update" });
  }

  try {
    const updateData: { title?: string; content?: any } = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    // Find the resume by ID, ensure it belongs to the user, and update it
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.user.userId }, // Find criteria
      { $set: updateData }, // Update data
      { new: true, runValidators: true } // Options: return updated doc, run schema validation
    );

    if (!updatedResume) {
      return res.status(404).json({
        message: "Resume not found or user does not have permission to update",
      });
    }

    res
      .status(200)
      .json({ message: "Resume updated successfully", resume: updatedResume });
  } catch (error) {
    console.error("Update Resume Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Error updating resume" });
  }
};

// --- Delete a specific resume by ID ---
export const deleteResume = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const { resumeId } = req.params;

  // Validate the resumeId format
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return res.status(400).json({ message: "Invalid Resume ID format" });
  }

  try {
    // Find the resume by ID, ensure it belongs to the user, and delete it
    const result = await Resume.deleteOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (result.deletedCount === 0) {
      // If nothing was deleted, the resume didn't exist or didn't belong to the user
      return res.status(404).json({
        message: "Resume not found or user does not have permission to delete",
      });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    res.status(500).json({ message: "Error deleting resume" });
  }
};
// Save PDF URL
// --- Save PDF URL ---
export const savePdfUrlController = async (req: AuthRequest, res: Response) => {
  // Ensure user is authenticated (already done by 'protect' middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { resumeId } = req.params; // Get the ID of the resume to update
  const { pdfUrl } = req.body; // Get the URL from the request body

  // Basic validation
  if (!pdfUrl) {
    return res
      .status(400)
      .json({ message: "pdfUrl is required in the request body" });
  }
  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    return res.status(400).json({ message: "Invalid Resume ID format" });
  }

  try {
    // Find the resume by ID AND ensure it belongs to the logged-in user
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.user.userId }, // Match both ID and user ID
      { $set: { pdfUrl: pdfUrl } }, // Set the pdfUrl field
      { new: true } // Return the updated document
    ).select("-passwordHash -refreshToken"); // Exclude sensitive fields just in case

    if (!updatedResume) {
      // If no resume found matching the ID and userId
      return res
        .status(404)
        .json({ message: "Resume not found or user does not have permission" });
    }

    res
      .status(200)
      .json({ message: "PDF URL saved successfully", resume: updatedResume });
  } catch (error) {
    console.error("Save PDF URL Error:", error);
    res.status(500).json({ message: "Error saving PDF URL" });
  }
};
