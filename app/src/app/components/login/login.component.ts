import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.http
      .post<any>('http://localhost:5038/api/auth/login', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error logging in:', err);
          this.error = err.error.error || 'An error occurred';
        },
      });
  }
}
