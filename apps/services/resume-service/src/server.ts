import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4002;

// --- Core Middlewares ---
app.use(helmet()); // Basic security headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// --- Health Check Route ---
app.get("/api/v1/resume/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "Resume Service" });
});

// --- Placeholder for API Routes ---
// app.use('/api/v1/resumes', resumeRoutes); // We'll add this later

// --- Start Server Function ---
const startServer = async () => {
  try {
    await connectDB(); // 👈 Connect to DB first
    app.listen(PORT, () => {
      // 👈 Then start listening
      console.log(`🚀 Resume service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
