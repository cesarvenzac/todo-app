import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
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
      .post<any>('http://localhost:5038/api/auth/register', {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          console.error('Error registering:', err);
          this.error = err.error.error || 'An error occurred';
        },
      });
  }
}
