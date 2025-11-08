import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4001;

// --- Core MiddlewaSres ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(cookieParser());
app.use(express.json());

// A simple health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "Auth Service" });
});

// --- API Routes ---
app.use("/", authRoutes);

// Function to start the server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Auth service is running on port ${PORT}`);
  });
};

// Start the application
startServer();
