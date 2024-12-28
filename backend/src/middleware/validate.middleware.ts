import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "./error.middleware";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(new AppError(400, "Validation error"));
    }
  };
};
