import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5038/api/';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isAuthenticatedSubject.next(!!this.getToken());
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(this.apiUrl + 'login', { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(email: string, password: string) {
    return this.http.post(this.apiUrl + 'register', { email, password });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  getToken() {
    const token = localStorage.getItem('token');
    // console.log('Retrieved token:', token);
    return token;
  }
}
