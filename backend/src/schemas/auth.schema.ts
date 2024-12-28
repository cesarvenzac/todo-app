import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  phone: z.string().optional(),
  birthdate: z
    .string()
    .transform((str) => (str ? new Date(str) : undefined))
    .optional(),
  allowNewsletter: z.boolean(),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
