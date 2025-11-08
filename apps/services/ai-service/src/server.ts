import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import aiRoutes from "./routes/ai.routes.js";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4003; // Use port 4003

// --- Core Middlewares ---
app.use(helmet()); // Basic security headers
app.use(
  cors({
    // CORS configuration
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Rate Limiter ---
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/", aiLimiter);

// --- Health Check Route ---
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "AI Service" });
});

// --- API Routes ---
app.use("/", aiRoutes);

// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke in AI Service!" });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 AI service is running on port ${PORT}`);
});
