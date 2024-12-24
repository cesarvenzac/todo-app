// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe],
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
        @if (authService.isAuthenticated$ | async) {
        <button (click)="logout()">LOGOUT</button>
        }
      </nav>
    </header>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
