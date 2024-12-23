import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FilterPipe } from '../../pipes/filter.pipe';
import { CardComponent } from '../card/card.component';

interface Task {
  id: number;
  name: string;
  description: string;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

type TaskStatus = Task['status'];
type TaskPriority = Task['priority'];

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DecimalPipe, CommonModule, FormsModule, FilterPipe, CardComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5038/api/';
  tasks: Task[] = [];

  ngOnInit() {
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

  addTask(name: string, description: string, priority: string) {
    if (!name.trim()) return;

    const validPriority = this.validatePriority(priority);

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
          priority: validPriority,
          status: 'to start' as TaskStatus,
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

  updateTask(task: Task) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    this.http
      .put<any>(
        this.apiUrl + 'tasks/update/' + task.id,
        {
          name: task.name,
          description: task.description,
          status: task.status,
          priority: task.priority,
        },
        { headers }
      )
      .subscribe({
        next: () => {
          this.refreshTasks();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        },
      });
  }

  deleteTask(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    this.http
      .delete<any>(this.apiUrl + 'tasks/delete/' + id, { headers })
      .subscribe({
        next: () => {
          this.refreshTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }

  private validatePriority(priority: string): TaskPriority {
    const validPriorities: TaskPriority[] = ['low', 'medium', 'high'];
    return validPriorities.includes(priority as TaskPriority)
      ? (priority as TaskPriority)
      : 'medium';
  }
}
