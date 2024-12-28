import { MongoClient, Db, Collection as MongoCollection, Filter, WithId, Document } from "mongodb";
import { DatabaseService, Collection, BaseDocument, FilterQuery } from "../types";

export class MongoDBService implements DatabaseService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(private uri: string, private dbName: string) {
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`Connected to database: ${this.dbName}`);
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.db = null;
  }

  collection<T extends BaseDocument>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error("Database not connected");
    }

    const collection: MongoCollection<T> = this.db.collection(name);

    return {
      async findOne(query: FilterQuery<T>): Promise<T | null> {
        const result = await collection.findOne(query as Filter<T>);
        return result as T | null;
      },

      async find(query: FilterQuery<T>): Promise<T[]> {
        const results = await collection.find(query as Filter<T>).toArray();
        return results as T[];
      },

      async insertOne(doc: Omit<T, "_id" | "createdAt" | "updatedAt">): Promise<T> {
        const now = new Date();
        const docWithTimestamps = {
          ...doc,
          createdAt: now,
          updatedAt: now,
        };
        const result = await collection.insertOne(docWithTimestamps as any);
        return { ...docWithTimestamps, _id: result.insertedId } as T;
      },

      async updateOne(query: FilterQuery<T>, update: Partial<T>): Promise<T | null> {
        const updateDoc = {
          $set: {
            ...update,
            updatedAt: new Date(),
          },
        };
        const result = await collection.findOneAndUpdate(query as Filter<T>, updateDoc, {
          returnDocument: "after",
        });
        return result as unknown as T | null;
      },

      async deleteOne(query: FilterQuery<T>): Promise<boolean> {
        const result = await collection.deleteOne(query as Filter<T>);
        return result.deletedCount === 1;
      },
    };
  }
}
