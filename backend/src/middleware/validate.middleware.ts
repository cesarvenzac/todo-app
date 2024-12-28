import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert FormData boolean strings to actual booleans
      const parsedBody = {
        ...req.body,
        allowNewsletter: req.body.allowNewsletter === "true",
        consent: req.body.consent === "true",
      };

      const validated = await schema.parseAsync(parsedBody);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
