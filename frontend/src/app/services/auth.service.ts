import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  birthdate: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken';
  private readonly userInfoKey = 'userInfo';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    Boolean(localStorage.getItem(this.tokenKey))
  );
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly userInfoSubject = new BehaviorSubject<UserInfo | null>(
    this.loadUserInfo()
  );
  readonly userInfo$ = this.userInfoSubject.asObservable();

  private loadUserInfo(): UserInfo | null {
    const stored = localStorage.getItem(this.userInfoKey);
    return stored ? JSON.parse(stored) : null;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  getUserInfo(): UserInfo | null {
    return this.userInfoSubject.getValue();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userInfoKey);
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null);
  }
}
