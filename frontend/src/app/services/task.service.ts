import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id: string;
  userId: string;
  name: string;
  description?: string | null;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  categories: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5038/api/tasks';
  private readonly headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('authToken') || ''}`
  );

  constructor(private http: HttpClient) {}

  /**
   * Fetch all tasks for the current user.
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.headers });
  }

  /**
   * Fetch a single task by its ID.
   * @param taskId The ID of the task to retrieve.
   */
  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`, {
      headers: this.headers,
    });
  }

  /**
   * Create a new task.
   * @param task The task data to create.
   */
  createTask(task: Omit<Task, '_id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.headers });
  }

  /**
   * Update an existing task.
   * @param task The task data to update.
   */
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task._id}`, task, {
      headers: this.headers,
    });
  }

  /**
   * Delete a task by ID.
   * @param taskId The ID of the task to delete.
   */
  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, {
      headers: this.headers,
    });
  }
}
