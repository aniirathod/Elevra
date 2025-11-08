import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the JWT payload structure
interface JwtPayload {
  userId: string;
}

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    console.error("Access Token Verification Error (Resume Service):", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
