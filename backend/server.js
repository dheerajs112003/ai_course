import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import askRoutes from "./routes/askRoutes.js";   

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Clerk auth middleware
app.use(ClerkExpressWithAuth());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);

// 🧠 AI Chat (link + file + question)
app.use("/api/course/ask", askRoutes);

// ================= HEALTH =================

app.get("/", (req, res) => {
  res.send("AI Course Generator API is running 🚀");
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

