import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";
import { AppError } from "../middleware/error.middleware";
import { TaskInput } from "../schemas/task.schema";

export class TaskController {
  constructor(private taskService: TaskService) {}

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getUserTasks(req.userId!);
      res.json(tasks);
    } catch (error) {
      next(new AppError(400, "Failed to fetch tasks"));
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskData: TaskInput = req.body;
      const task = await this.taskService.createTask(req.userId!, taskData);
      res.status(201).json(task);
    } catch (error) {
      next(new AppError(400, "Failed to create task"));
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id;
      const taskData: Partial<TaskInput> = req.body;
      const task = await this.taskService.updateTask(req.userId!, taskId, taskData);
      res.json(task);
    } catch (error) {
      next(new AppError(400, "Failed to update task"));
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.id;
      await this.taskService.deleteTask(req.userId!, taskId);
      res.status(204).send();
    } catch (error) {
      next(new AppError(400, "Failed to delete task"));
    }
  };
}
