import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
        <p>Already have an account? <a routerLink="/login">Login</a></p>
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
        background-color: #007bff;
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
export class RegisterComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => (this.error = err.error.error || 'An error occurred'),
    });
  }
}
