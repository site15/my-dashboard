import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { first, forkJoin, merge, tap } from 'rxjs';
import { ColorSchemeSwitcherComponent } from './components/theme/color-scheme-switcher.component';
import {
  IfLoggedDirective,
  IfNotLoggedDirective,
} from './directives/ if-logged.directive';
import { AuthService } from './services/auth.service';
import { TelegramService } from './services/telegram.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ColorSchemeSwitcherComponent,
    IfNotLoggedDirective,
    IfLoggedDirective,
  ],
  template: ` <header class="container">
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
    <footer class="container">
      <nav>
        <ul>
          <li>Copyright © 2025 MyDashboard. Licensed under MIT.</li>
        </ul>
        <ul>
          <li><a href="#">Source code</a></li>
          <li><a href="#">Telegram group</a></li>
        </ul>
      </nav>
    </footer>`,
})
export class AppComponent {
  private authService = inject(AuthService);
  private telegramService = inject(TelegramService);

  constructor() {
    forkJoin([this.authService.profile(), this.telegramService.getSettings()])
      .pipe(first())
      .subscribe();
  }

  private router = inject(Router);

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
