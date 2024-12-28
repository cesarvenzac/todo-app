import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["to start", "in progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z
    .string()
    .transform((str) => (str ? new Date(str) : undefined))
    .optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
