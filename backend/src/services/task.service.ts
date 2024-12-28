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
    // Ensure all required fields are present
    const task = await this.create({
      userId,
      name: taskData.name,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      categories: taskData.categories || [],
      tags: taskData.tags || [],
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

    // Only update provided fields
    const updateData: Partial<Task> = {
      ...(taskData.name && { name: taskData.name }),
      ...(taskData.description !== undefined && { description: taskData.description }),
      ...(taskData.status && { status: taskData.status }),
      ...(taskData.priority && { priority: taskData.priority }),
      ...(taskData.dueDate !== undefined && { dueDate: taskData.dueDate }),
      ...(taskData.categories && { categories: taskData.categories }),
      ...(taskData.tags && { tags: taskData.tags }),
    };

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
