import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface payload {
  userId: string;
  name: string;
  email: string;
}
export interface AuthRequest extends Request {
  user?: payload;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as payload;

    req.user = decoded;
    next();
  } catch (error) {
    // Token is invalid (expired, wrong signature, etc.)
    if (error instanceof Error) {
      console.error("Access Token Error:", error.message);
    } else {
      console.error("Access Token Error:", String(error));
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
