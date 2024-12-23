import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <main>
      <section class="tasks-counter">
        <span>╔═══════════════╗</span>
        <div>
          <span>║</span>
          <span
            ><span>{{ tasks.length | number : '3.0-0' }}</span> task(s).</span
          >
          <span>║</span>
        </div>
        <span>╚═══════════════╝</span>
      </section>
      <section class="add-task">
        <input #newTask type="text" placeholder="Task description" />
        <button (click)="addTask(newTask.value)">+</button>
      </section>
      <section class="tasks-list">
        <ul>
          @for (task of tasks; track task.id) {
          <li>
            <input type="text" [value]="task.description" />
            <button (click)="deleteTask(task.id)">×</button>
          </li>
          }
        </ul>
      </section>
    </main>
  `,
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5038/api/';
  tasks: any[] = [];

  ngOnInit() {
    this.refreshTasks();
  }

  refreshTasks() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    this.http.get<any[]>(this.apiUrl + 'tasks', { headers }).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  addTask(task: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    this.http
      .post<any>(this.apiUrl + 'add', { description: task }, { headers })
      .subscribe({ next: () => this.refreshTasks() });
  }

  deleteTask(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    this.http
      .delete<any>(this.apiUrl + 'delete/' + id, { headers })
      .subscribe({ next: () => this.refreshTasks() });
  }
}
