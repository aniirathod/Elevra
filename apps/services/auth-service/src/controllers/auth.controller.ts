import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { hashPassword, comparePassword } from "../utils/hashing.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await hashPassword(password);

    const newUser = new User({ name, email, passwordHash });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- User Login ---
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordCorrect = await comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // --- Credentials are correct, generate tokens ---
    const userDetails = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    };
    // 4. Generate a short-lived Access Token
    const accessToken = generateAccessToken(userDetails);

    // 5. Generate a long-lived Refresh Token
    const refreshToken = generateRefreshToken(userDetails);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/v1/auth",
      // sameSite: 'strict', // Consider adding SameSite attribute for extra CSRF protection
    });

    // 8. Send the Access Token and basic user info in the response body
    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        // Send non-sensitive user info
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// --- User Logout ---
export const logoutUser = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
      };

      await User.findByIdAndUpdate(decoded.userId, {
        $unset: { refreshToken: 1 },
      });
    } catch (err) {
      if (err instanceof Error) {
        console.warn(
          "Logout attempt with potentially invalid refresh token:",
          err.message
        );
      } else {
        console.warn(
          "Logout attempt with potentially invalid refresh token:",
          err
        );
      }
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/api/v1/auth",
    // sameSite: 'strict', // Match the sameSite setting if used during login
  });

  // Send a success response
  res.status(200).json({ message: "Logout successful" });
};

// --- Refresh Access Token ---
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required: No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/api/v1/auth",
      });
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid refresh token" });
    }

    const userDetails = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    };

    // 5. If valid, issue a new short-lived access token ✨
    const accessToken = generateAccessToken(userDetails);
    res.status(200).json({ accessToken });
  } catch (error) {
    // If JWT verification fails (expired, invalid signature, etc.)
    console.error("Refresh Token Error:", error);
    // Clear the potentially invalid cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/api/v1/auth",
    });
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid refresh token" });
  }
};

// --- Get Current User (Protected Route) ---
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.userId).select(
      "-passwordHash -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error while fetching user" });
  }
};
