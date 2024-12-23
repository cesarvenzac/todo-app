// src/app/components/tasks/tasks.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

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
  private readonly apiUrl = 'http://localhost:5038/api/';
  tasks: any[] = [];

  ngOnInit() {
    this.refreshTasks();
  }

  refreshTasks() {
    this.http.get<any[]>(this.apiUrl + 'tasks').subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  addTask(task: string) {
    this.http
      .post<any>(this.apiUrl + 'add', { description: task })
      .subscribe({ next: () => this.refreshTasks() });
  }

  deleteTask(id: number) {
    this.http
      .delete<any>(this.apiUrl + 'delete/' + id)
      .subscribe({ next: () => this.refreshTasks() });
  }
}
