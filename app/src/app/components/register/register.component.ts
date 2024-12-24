import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstname: string = '';
  lastname: string = '';
  phone: string = '';
  countryCode: string = '';
  birthdate: string = '';
  allowNewsletter: boolean = false;
  consent: boolean = false;
  avatar: File | null = null;
  error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onFileChange(event: any) {
    this.avatar = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('firstname', this.firstname);
    formData.append('lastname', this.lastname);
    formData.append('phone', `${this.countryCode}${this.phone}`);
    formData.append('birthdate', this.birthdate);
    formData.append('allowNewsletter', this.allowNewsletter.toString());
    formData.append('consent', this.consent.toString());
    if (this.avatar) {
      formData.append('avatar', this.avatar);
    }

    this.http
      .post<any>('http://localhost:5038/api/auth/register', formData)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          console.error('Error registering:', err);
          this.error = err.error.error || 'An error occurred';
        },
      });
  }
}
