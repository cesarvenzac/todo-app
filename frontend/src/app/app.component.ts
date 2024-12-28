import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, NgIf],
  template: `
    <header>
      <nav>
        <svg>...</svg>
        <div *ngIf="authService.isAuthenticated$ | async">
          <ng-container *ngIf="authService.userInfo$ | async as userInfo">
            <span>Welcome {{ userInfo.firstname }}!</span>
            <img
              *ngIf="userInfo.avatar"
              [src]="'http://localhost:5038/' + userInfo.avatar"
              alt="Avatar"
            />
          </ng-container>
          <button (click)="logout()">LOGOUT</button>
          <button (click)="logUser()">PRINT</button>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logUser(): void {
    this.authService.userInfo$.subscribe((userInfo) =>
      console.log('UserInfo:', userInfo)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
