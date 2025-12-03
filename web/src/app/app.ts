import { RouteMeta } from '@analogjs/router';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { concatMap, first, tap } from 'rxjs';

import { AppInitializerService } from './app.initializer';
import { ColorSchemeSwitcherComponent } from './components/theme/color-scheme-switcher.component';
import {
  IfLoggedDirective,
  IfNotLoggedDirective,
} from './directives/if-logged.directive';
import {
  IfNavHiddenDirective,
  IfNavShownDirective,
} from './directives/if-nav.directive';
import { ShowNavGuard } from './guards/nav.guard';
import { AuthService } from './services/auth.service';
import { ErrorHandlerService } from './services/error-handler.service';

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
    IfNavHiddenDirective,
    LucideAngularModule,
  ],
  template: `
    <!--header class="container pico">
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
      </header-->
    <div
      *ifNavShown
      id="dashboard-list"
      data-view="dashboard-list"
      class="min-h-screen flex"
    >
      <div
        class="w-16 lg:w-64 bg-white long-shadow p-4 flex flex-col items-center lg:items-start border-r border-gray-100 transition-all duration-300"
      >
        <a href="/" class="text-2xl font-bold text-pastel-blue mb-10 mt-2">
          <i-lucide name="layout-dashboard" class="w-8 h-8 lg:mr-2 inline-block align-middle"></i-lucide>
          <span class="hidden lg:inline align-middle">My Dashboards</span>
        </a>

        <nav class="flex flex-col space-y-4 w-full">
          <a
            href="/dashboards"
            class="flex items-center p-3 rounded-xl bg-pastel-blue/10 text-pastel-blue font-semibold transition-all duration-300 hover:bg-pastel-blue/20"
          >
            <i-lucide name="grid-3x3" class="w-6 h-6 mr-0 lg:mr-3"></i-lucide>
            <span class="hidden lg:inline">Dashboards</span>
          </a>

          <a
            class="flex items-center p-3 rounded-xl text-gray-600 font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-800"
            (click)="showError()"
          >
            <i-lucide
              name="chart-bar-big"
              class="w-6 h-6 mr-0 lg:mr-3"
            ></i-lucide>
            <span class="hidden lg:inline">Analytics</span>
          </a>

          <a
            (click)="showError()"
            class="flex items-center p-3 rounded-xl text-gray-600 font-medium transition-all duration-300 hover:bg-gray-100 hover:text-gray-800"
          >
            <i-lucide name="settings" class="w-6 h-6 mr-0 lg:mr-3"></i-lucide>
            <span class="hidden lg:inline">Settings</span>
          </a>
        </nav>

        <div
          class="mt-auto pt-6 w-full flex flex-col items-center lg:items-start"
        >
          <div class="flex justify-between items-center w-full px-2">
            <button
              (click)="signOut()"
              class="mt-2 text-red-500 font-medium hover:text-red-700 transition-colors flex items-center"
            >
              <i-lucide name="log-out" class="w-5 h-5 mr-0 lg:mr-2"></i-lucide>
              <span class="hidden lg:inline">Sign Out</span>
            </button>
            <color-scheme-switcher class="flex items-center" />
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 lg:p-10 overflow-y-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
    <main class="container" *ifNavHidden>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly appInitializerService = inject(AppInitializerService);
  private readonly errorHandler = inject(ErrorHandlerService);

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

  showError() {
    this.errorHandler.handleError(
      new Error('This feature is not available yet')
    );
  }
}
