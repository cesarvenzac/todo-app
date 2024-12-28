import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onSubmit(): void {
    this.http
      .post<any>('http://localhost:5038/api/auth/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          const user = response.user;
          this.authService.setToken(response.token);
          this.authService.setUserInfo({
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatarPath,
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error logging in:', err);
          this.error = err.error.message || 'An error occurred';
        },
      });
  }
}
