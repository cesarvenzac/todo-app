import { Collection, BaseDocument } from "../types";
import { DatabaseService } from "../types";

export abstract class BaseService<T extends BaseDocument> {
  protected collection: Collection<T>;

  constructor(protected db: DatabaseService, protected collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  async findOne(query: any): Promise<T | null> {
    try {
      console.log("findOne query:", query);
      const result = await this.collection.findOne(query);
      console.log("findOne result:", result);
      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async find(query: Partial<T>): Promise<T[]> {
    return await this.collection.find(query);
  }

  async create(data: Omit<T, "_id" | "createdAt" | "updatedAt">): Promise<T> {
    return await this.collection.insertOne(data);
  }

  async update(query: Partial<T>, data: Partial<T>): Promise<T | null> {
    return await this.collection.updateOne(query, data);
  }

  async delete(query: Partial<T>): Promise<boolean> {
    return await this.collection.deleteOne(query);
  }
}
