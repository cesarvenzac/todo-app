import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../middleware/error.middleware";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import multer from "multer";
import { config } from "../config";
import path from "path";

// Define interface for RegisterRequest to include file
interface RegisterRequest extends Request {
  file?: Express.Multer.File;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.directory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterInput & { avatarPath?: string } = req.body;
      if (req.file) {
        userData.avatarPath = req.file.path;
      }

      const user = await this.authService.register(userData);
      res.status(201).json(user);
    } catch (error) {
      next(new AppError(400, "Registration failed"));
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginInput = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(new AppError(401, "Invalid credentials"));
    }
  };

  uploadAvatar = upload.single("avatar");
}
