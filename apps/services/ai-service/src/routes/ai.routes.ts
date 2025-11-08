import { Router } from "express";
import {
  analyzeStructuredResume,
  rewriteBulletPoint,
  structureResume,
} from "../controllers/ai.controller.js";

const router = Router();

router.post("/structure", structureResume);
router.post("/analyze", analyzeStructuredResume);
router.post("/rewrite/bullet", rewriteBulletPoint);

export default router;
