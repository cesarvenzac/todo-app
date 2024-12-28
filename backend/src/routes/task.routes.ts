import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { taskSchema } from "../schemas/task.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";

export const createTaskRouter = (taskController: TaskController, authService: AuthService) => {
  const router = Router();

  // Apply auth middleware to all task routes
  router.use(authMiddleware(authService));

  router.get("/", taskController.getTasks);

  router.post("/", validate(taskSchema), taskController.createTask);

  router.put("/:id", validate(taskSchema), taskController.updateTask);

  router.delete("/:id", taskController.deleteTask);

  return router;
};
