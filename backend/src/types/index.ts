import { ObjectId } from "mongodb";

// Shared interfaces
export interface BaseDocument {
  _id?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends BaseDocument {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone?: string;
  birthdate?: Date;
  avatarPath?: string;
  allowNewsletter: boolean;
  consent: boolean;
}

export interface Task extends BaseDocument {
  userId: string | ObjectId;
  name: string;
  description?: string;
  status: "to start" | "in progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  categories: string[];
  tags: string[];
}

// Database service interfaces
export interface DatabaseService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  collection<T extends BaseDocument>(name: string): Collection<T>;
}

export interface Collection<T extends BaseDocument> {
  findOne(query: FilterQuery<T>): Promise<T | null>;
  find(query: FilterQuery<T>): Promise<T[]>;
  insertOne(doc: Omit<T, "_id" | "createdAt" | "updatedAt">): Promise<T>;
  updateOne(query: FilterQuery<T>, update: Partial<T>): Promise<T | null>;
  deleteOne(query: FilterQuery<T>): Promise<boolean>;
}

export type FilterQuery<T> = {
  [P in keyof T]?: T[P] | { $eq: T[P] } | { $in: T[P][] };
};
