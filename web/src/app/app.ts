import { RouteMeta } from '@analogjs/router';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { concatMap, first, tap } from 'rxjs';

import { AppInitializerService } from './app.initializer';
import { ColorSchemeSwitcherComponent } from './components/theme/color-scheme-switcher.component';
import {
  IfLoggedDirective,
  IfNotLoggedDirective,
} from './directives/if-logged.directive';
import { IfNavShownDirective } from './directives/if-nav.directive';
import { ShowNavGuard } from './guards/nav.guard';
import { AuthService } from './services/auth.service';
import { LayoutService } from './services/layout.service';

export const routeMeta: RouteMeta = {
  canActivate: [ShowNavGuard],
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ColorSchemeSwitcherComponent,
    IfNotLoggedDirective,
    IfLoggedDirective,
    IfNavShownDirective,
  ],
  template: `
    <header *ifNavShown class="container pico">
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
    <footer *ifNavShown class="container pico">
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
    </footer>
  `,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly appInitializerService = inject(AppInitializerService);
  private readonly layoutService = inject(LayoutService);

  ngOnInit(): void {
    this.router.events
      .pipe(
        concatMap(async event => {
          if (event instanceof NavigationEnd) {
            console.log('Навигация завершена:', event);

            return await this.appInitializerService.init();
          }
        })
      )
      .subscribe();
  }

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
