import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'todo-app';
  readonly apiUrl = 'http://localhost:5038/api/';

  constructor(private http: HttpClient) {}

  tasks: any[] = [];

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

  ngOnInit() {
    this.refreshTasks();
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
