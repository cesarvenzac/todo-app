import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CardComponent } from '../card/card.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface Task {
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

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    DecimalPipe,
    CommonModule,
    FormsModule,
    FilterPipe,
    CardComponent,
    DragDropModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5038/api/';
  tasks: Task[] = [];
  activeTaskId: string | null = null;
  Math = Math;

  ngOnInit() {
    this.activeTaskId = localStorage.getItem('activeTaskId');
    this.refreshTasks();
  }

  refreshTasks() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    this.http.get<Task[]>(this.apiUrl + 'tasks', { headers }).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  addTask(
    name: string,
    description: string,
    status: string,
    priority: string,
    categories: string,
    tags: string
  ) {
    if (!name.trim()) return;

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    const taskData = {
      name: name.trim(),
      description: description.trim() || undefined,
      status: this.validateStatus(status),
      priority: this.validatePriority(priority),
      categories: this.processCategories(categories),
      tags: this.processTags(tags),
    };

    this.http
      .post<Task>(this.apiUrl + 'tasks', taskData, { headers })
      .subscribe({
        next: () => {
          this.refreshTasks();
        },
        error: (error) => {
          console.error('Error adding task:', error);
        },
      });
  }

  updateTask(task: Task, openModal: boolean = false) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    // Prepare update data matching backend schema
    const taskData = {
      name: task.name,
      description: task.description || undefined,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? this.formatDueDate(task.dueDate) : undefined,
      categories: task.categories || [],
      tags: task.tags || [],
    };

    this.http
      .put<Task>(this.apiUrl + 'tasks/' + task._id, taskData, { headers })
      .subscribe({
        next: () => {
          if (openModal) {
            this.activeTaskId = task._id;
            localStorage.setItem('activeTaskId', task._id);
          }
          this.refreshTasks();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        },
      });
  }

  deleteTask(_id: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    this.http
      .delete<void>(this.apiUrl + 'tasks/' + _id, { headers })
      .subscribe({
        next: () => {
          this.refreshTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
  }

  trackById(index: number, task: Task): string {
    return task._id;
  }

  private validateStatus(status: string): TaskStatus {
    const validStatuses: TaskStatus[] = [
      'to start',
      'in progress',
      'completed',
    ];
    return validStatuses.includes(status as TaskStatus)
      ? (status as TaskStatus)
      : 'to start';
  }

  private validatePriority(priority: string): TaskPriority {
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];
    return validPriorities.includes(priority as TaskPriority)
      ? (priority as TaskPriority)
      : 'medium';
  }

  private formatDueDate(dueDate: string | null): string | undefined {
    if (!dueDate) return undefined;
    const date = new Date(dueDate);
    return date.toISOString();
  }

  private processCategories(categories: string): string[] {
    return categories
      ? categories
          .split(/[,\s]+/)
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0)
      : [];
  }

  private processTags(tags: string): string[] {
    return tags
      ? tags
          .split(/[,\s]+/)
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];
  }

  isTaskModalOpen(taskId: string): boolean {
    return this.activeTaskId === taskId;
  }

  onModalClose() {
    this.activeTaskId = null;
    localStorage.removeItem('activeTaskId');
    setTimeout(() => {
      this.refreshTasks();
    }, 0);
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id;
      if (task.status !== newStatus) {
        task.status = newStatus as TaskStatus;
        this.updateTask(task, false);
      }
    }
  }
}
