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
      <section class="counter">
        <span>╔═══════════════════════╗</span>
        <span> There are {{ tasks.length | number : '3.0-0' }} tasks. </span>
        <span>╚═══════════════════════╝</span>
      </section>
      <section>
        <input #newTask type="text" placeholder="Task description" />
        <button (click)="addTask(newTask.value)">+</button>
      </section>
      <section>
        <ul>
          @for (task of tasks; track task.id) {
          <li>
            <input type="text" [value]="task.description" readonly />
            <button (click)="deleteTask(task.id)">×</button>
          </li>
          }
        </ul>
      </section>
    </main>
  `,
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
