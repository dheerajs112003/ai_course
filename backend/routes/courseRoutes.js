import express from "express";
import { generateCourse } from "../controllers/courseController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/generate", clerkAuth, generateCourse);

export default router;