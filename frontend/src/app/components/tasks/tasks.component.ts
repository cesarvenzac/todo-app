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
  name: string;
  description: string | null;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  categories: string[] | null;
  tags: string[] | null;
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
  Math = Math;
  activeTaskId: string | null = null;

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
    dueDate: string,
    categories: string,
    tags: string
  ) {
    if (!name.trim()) return;

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    this.http
      .post<any>(
        this.apiUrl + 'tasks/add',
        {
          name,
          description,
          status: this.validateStatus(status),
          priority: this.validatePriority(priority),
          dueDate: this.formatDueDate(dueDate),
          categories: this.processCategories(categories),
          tags: this.processTags(tags),
        },
        { headers }
      )
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

    this.http
      .put<any>(
        this.apiUrl + 'tasks/update/' + task._id,
        {
          name: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          categories: task.categories,
          tags: task.tags,
        },
        { headers }
      )
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
      .delete<any>(this.apiUrl + 'tasks/delete/' + _id, { headers })
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

  private formatDueDate(dueDate: string): string {
    return dueDate ? new Date(dueDate + 'T00:00:00.000Z').toISOString() : '';
  }

  private formatDueDateForInput(dueDate: string): string {
    return dueDate ? new Date(dueDate).toISOString().split('T')[0] : '';
  }

  private formatDueDateForDisplay(dueDate: string): string {
    return dueDate ? new Date(dueDate).toLocaleDateString() : '';
  }

  private processCategories(categories: string): string[] {
    return categories
      .split(/[,\s]+/)
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);
  }

  private processTags(tags: string): string[] {
    return tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
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

      // Update the dropped task's status
      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id;
      if (task.status !== newStatus) {
        task.status = newStatus as 'to start' | 'in progress' | 'completed';
        this.updateTask(task, false);
      }
    }
  }
}
