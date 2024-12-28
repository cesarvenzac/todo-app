import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export const createAuthRouter = (authController: AuthController) => {
  const router = Router();

  router.post(
    "/register",
    authController.uploadAvatar,
    validate(registerSchema),
    authController.register
  );

  router.post("/login", validate(loginSchema), authController.login);

  return router;
};
