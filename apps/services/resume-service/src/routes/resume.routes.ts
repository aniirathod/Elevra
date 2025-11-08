import { Router } from "express";
import { protect, AuthRequest } from "../middlewares/auth.middleware.js";
import {
  getResumes,
  createResume,
  getResumeById,
  updateResume,
  deleteResume,
  savePdfUrlController,
} from "../controllers/resume.controller.js";

const router = Router();

// --- Apply protect middleware to all routes ---
router.use(protect);

// Define Resume CRUD routes using controllers
router.get("/", getResumes);
router.post("/", createResume);
router.get("/:resumeId", getResumeById);
router.put("/:resumeId", updateResume);
router.delete("/:resumeId", deleteResume);
router.put("/:resumeId/save-pdf", savePdfUrlController);

export default router;
