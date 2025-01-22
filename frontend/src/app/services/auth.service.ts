import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define the structure of user information.
export interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  birthdate?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Local storage keys for token and user information.
  private readonly tokenKey = 'authToken';
  private readonly userInfoKey = 'userInfo';

  // Observable to track authentication state.
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    Boolean(localStorage.getItem(this.tokenKey))
  );
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Observable to track user information.
  private readonly userInfoSubject = new BehaviorSubject<UserInfo | null>(
    this.loadUserInfo()
  );
  readonly userInfo$ = this.userInfoSubject.asObservable();

  /**
   * Load user information from local storage.
   * @returns The parsed user information or null if not available.
   */
  private loadUserInfo(): UserInfo | null {
    const stored = localStorage.getItem(this.userInfoKey);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Set the authentication token.
   * @param token The token to be stored in local storage.
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Get the authentication token.
   * @returns The token from local storage, or null if not set.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set user information.
   * @param userInfo The user information to store.
   */
  setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  /**
   * Get the current user information.
   * @returns The current user information or null if not set.
   */
  getUserInfo(): UserInfo | null {
    return this.userInfoSubject.getValue();
  }

  /**
   * Logout the user by clearing token and user information.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userInfoKey);
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null);
  }
}
