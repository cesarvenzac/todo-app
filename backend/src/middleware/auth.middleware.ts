import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "./error.middleware";
import { AuthService } from "../services/auth.service";
import { ObjectId } from "mongodb";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
    }
  }
}

export const authMiddleware = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log("Auth header:", authHeader); // Add this

      if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError(401, "No token provided");
      }

      const token = authHeader.split(" ")[1];
      console.log("Token extracted:", token.substring(0, 10) + "..."); // Add this

      const user = await authService.validateToken(token);
      console.log("Validated user:", user ? "User found" : "No user"); // Add this

      if (!user) {
        throw new AppError(401, "Invalid token");
      }

      req.user = user;
      req.userId = user._id?.toString();
      next();
    } catch (error) {
      console.error("Auth middleware error:", error); // Add this
      next(new AppError(401, "Authentication failed"));
    }
  };
};
