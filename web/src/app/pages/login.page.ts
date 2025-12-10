import { RouteMeta } from '@analogjs/router';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';

import { NgxTelegramWidgetComponent } from '../components/telegram/ngx-telegram-widget.component';
import { HideNavGuard } from '../guards/nav.guard';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TelegramSettingsService } from '../services/telegram-settings.service';
import { TelegramService } from '../services/telegram.service';

export const routeMeta: RouteMeta = {
  canActivate: [HideNavGuard],
};

@Component({
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTelegramWidgetComponent, AsyncPipe],
  template: ` <div
    id="login-register"
    data-view="login-register"
    class="min-h-screen flex items-center justify-center p-4"
  >
    <div
      class="max-w-4xl w-full bg-white rounded-3xl long-shadow overflow-hidden shadow-xl lg:flex"
    >
      <div
        class="lg:w-1/2 p-8 lg:p-12 bg-pastel-accent bg-opacity-20 flex flex-col justify-center items-center text-center"
      >
        <svg
          class="w-2/3 h-auto text-pastel-blue mb-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 16v-4"></path>
          <path d="M9 12l3 3 3-3"></path>
        </svg>
        <h2 class="text-3xl font-extrabold text-gray-800 mb-2">Welcome</h2>
        <p class="text-gray-600 text-lg">
          Create your perfect dashboard. Simple. Beautiful. Fast.
        </p>
      </div>

      <div class="lg:w-1/2 p-6 sm:p-10 lg:p-12">
        <h1 class="text-4xl font-black text-gray-800 mb-8">Sign In</h1>

        <form class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-lg font-medium text-gray-700 mb-2"
              >Email</label
            >
            <input
              type="email"
              id="email"
              class="flat-input"
              placeholder="you@saas.com"
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-lg font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              type="password"
              id="password"
              class="flat-input"
              placeholder="••••••••"
            />
          </div>
          <ngx-telegram-widget
            ngSkipHydration
            [botName]="(telegramSettings$ | async)?.authBotName!"
            (onAuth)="signInWithTelegram($event)"
            hidden
          ></ngx-telegram-widget>

          <button
            type="button"
            (click)="signIn()"
            class="w-full text-xl font-bold py-4 rounded-2xl text-white bg-pastel-blue transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow 
                        bg-gradient-to-tr from-[#8A89F0] to-[#A2C0F5] tracking-wide"
          >
            Sign In
          </button>
        </form>

        <div class="mt-8 text-center">
          <button
            (click)="signInWithTelegramSdk()"
            class="text-pastel-blue font-semibold hover:text-pastel-blue/80 transition-colors"
          >
            Login via Telegram
          </button>
          <span class="text-gray-400 mx-2">|</span>
          <button
            (click)="signInAsAnonymous()"
            class="text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export default class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly telegramService = inject(TelegramService);
  private readonly telegramSettingsService = inject(TelegramSettingsService);
  private readonly errorHandlerService = inject(ErrorHandlerService);

  telegramSettings$ = this.telegramSettingsService.stream$;

  signIn() {
    this.errorHandlerService
      .handleError(new Error('Method not implemented.'), 'Failed to sign in')
      .then();
  }

  signInAsAnonymous() {
    this.authService
      .signInAsAnonymous()
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }

  signInWithTelegram(telegramUser: unknown) {
    this.telegramService
      .signInWithTelegram(telegramUser)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }

  signInWithTelegramSdk() {
    this.telegramService
      .signInWithTelegramSdk()
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }
}