import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
        <svg
          id="b"
          data-name="Calque 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1075.71 579.23"
        >
          <g id="c" data-name="Calque 1">
            <g>
              <path
                class="d"
                d="m82.75,165.5v248.24h165.5v82.75H82.75v82.75H0V0h82.75v82.75h165.5v82.75H82.75Zm165.5,82.75v-82.75h165.5v82.75h-165.5Zm165.5,165.5h-165.5v-82.75h165.5v82.75Zm82.75-165.5v82.75h-82.75v-82.75h82.75Z"
              />
              <path
                class="d"
                d="m1075.71,248.24v82.75h-82.75v82.75h-165.5v82.75h-165.5v82.75h-82.75V0h82.75v82.75h165.5v82.75h165.5v82.75h82.75Z"
              />
            </g>
          </g>
        </svg>
        <div *ngIf="authService.isAuthenticated$ | async">
          <span *ngIf="userInfo">Welcome {{ userInfo.firstname }}!</span>
          <img
            *ngIf="userInfo?.avatar"
            [src]="'http://localhost:5038/' + userInfo.avatar"
            alt="Avatar"
          />
          <button (click)="logout()">LOGOUT</button>
        </div>
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userInfo = this.authService.getUserInfo();
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.authService.isAuthenticated$.subscribe(() => {
      this.userInfo = this.authService.getUserInfo();
      this.cdr.markForCheck();
    });

    this.authService.userInfoUpdated.subscribe(() => {
      this.userInfo = this.authService.getUserInfo();
      this.cdr.markForCheck();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
