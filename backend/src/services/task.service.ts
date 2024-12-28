import { BaseService } from "./base.service";
import { Task } from "../types";
import { DatabaseService } from "../types";
import { TaskInput } from "../schemas/task.schema";
import { ObjectId } from "mongodb";

export class TaskService extends BaseService<Task> {
  constructor(db: DatabaseService) {
    super(db, "tasks");
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return await this.find({ userId });
  }

  async createTask(userId: string, taskData: TaskInput): Promise<Task> {
    const task = await this.create({
      userId,
      name: taskData.name,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      categories: taskData.categories ?? [],
      tags: taskData.tags ?? [],
    });

    return task;
  }

  async updateTask(
    userId: string,
    taskId: string,
    taskData: Partial<TaskInput>
  ): Promise<Task | null> {
    const objectId = new ObjectId(taskId);
    const task = await this.findOne({ _id: objectId, userId });
    if (!task) {
      throw new Error("Task not found");
    }

    const updateData: Partial<Task> = {};

    if (taskData.name !== undefined) updateData.name = taskData.name;
    if (taskData.description !== undefined) updateData.description = taskData.description;
    if (taskData.status !== undefined) updateData.status = taskData.status;
    if (taskData.priority !== undefined) updateData.priority = taskData.priority;
    if (taskData.dueDate !== undefined) updateData.dueDate = taskData.dueDate;
    if (taskData.categories !== undefined) updateData.categories = taskData.categories;
    if (taskData.tags !== undefined) updateData.tags = taskData.tags;

    return await this.update({ _id: objectId }, updateData);
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const objectId = new ObjectId(taskId);
    const task = await this.findOne({ _id: objectId, userId });
    if (!task) {
      throw new Error("Task not found");
    }

    return await this.delete({ _id: objectId });
  }
}
