import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <a routerLink="/register">Register</a></p>
        @if (error) {
        <p class="error">{{ error }}</p>
        }
      </form>
    </div>
  `,
  styles: [
    `
      .auth-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
      }
      input {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
      }
      button {
        width: 100%;
        padding: 0.5rem;
        margin: 1rem 0;
        background-color: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
      }
      .error {
        color: red;
        margin-top: 1rem;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => (this.error = err.error.error || 'An error occurred'),
    });
  }
}
