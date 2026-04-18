import express from "express";
import multer from "multer";
import { askAI } from "../controllers/askController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", clerkAuth, upload.single("file"), askAI);

export default router;
