import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { first, tap } from 'rxjs';

import { ColorSchemeSwitcherComponent } from './components/theme/color-scheme-switcher.component';
import {
  IfLoggedDirective,
  IfNotLoggedDirective,
} from './directives/ if-logged.directive';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ColorSchemeSwitcherComponent,
    IfNotLoggedDirective,
    IfLoggedDirective,
  ],
  template: ` <header class="container pico">
      <nav>
        <ul>
          <li>
            <h1><a href="/">My Dashboard</a></h1>
          </li>
        </ul>
        <ul>
          <li><a href="/dashboards">Dashboards</a></li>
          <li><a href="/login" *ifNotLogged>Login</a></li>
          <li><a href="#signOut" (click)="signOut()" *ifLogged>Logout</a></li>
          <li><color-scheme-switcher /></li>
        </ul>
      </nav>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
    <footer class="container pico">
      <nav>
        <ul>
          <li>Copyright © 2025 MyDashboard. Licensed under MIT.</li>
        </ul>
        <ul>
          <li>
            <a
              target="_blank"
              href="https://github.com/site15/my-dashboard/tree/main/web"
              >Source code</a
            >
          </li>
          <li>
            <a target="_blank" href="https://t.me/site15_community"
              >Telegram group</a
            >
          </li>
        </ul>
      </nav>
    </footer>`,
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  signOut() {
    this.authService
      .signOut()
      .pipe(
        first(),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
  }
}
