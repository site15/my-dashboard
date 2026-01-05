import { RouteMeta } from '@analogjs/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';

import { NgxTelegramWidgetComponent } from '../components/telegram/ngx-telegram-widget.component';
import { HideNavGuard } from '../guards/nav.guard';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ReleaseService } from '../services/release.service';
import { TelegramSettingsService } from '../services/telegram-settings.service';
import { TelegramService } from '../services/telegram.service';

export const routeMeta: RouteMeta = {
  canActivate: [HideNavGuard],
};

@Component({
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTelegramWidgetComponent, AsyncPipe, NgIf],
  template: ` <div
    id="login-register"
    data-view="login-register"
    class="min-h-screen flex items-center justify-center p-4"
  >
    <div
      class="max-w-6xl w-full bg-white rounded-3xl long-shadow overflow-hidden shadow-xl lg:flex"
    >
      <div
        class="lg:w-2/5 p-8 lg:p-12 bg-pastel-accent bg-opacity-20 flex flex-col justify-center items-center text-center"
      >
        <img
          class="w-2/3 h-auto text-pastel-blue mb-6"
          src="/my-dashboard.png"
        />
        <h2 class="text-3xl font-extrabold text-gray-800 mb-2">Welcome</h2>
        <p class="text-gray-600 text-lg">
          Create your perfect dashboard. Simple. Beautiful. Fast.
        </p>
      </div>

      <div class="lg:w-3/5 p-6 sm:p-10 lg:p-12">
        <!-- Sign In Tab Content -->
        <div *ngIf="activeTab === 'signin'">
          <div class="flex items-center flex-start mb-8">
            <h1 class="text-4xl font-black text-gray-800">Sign In</h1>
            <span class="text-gray-300 mx-4">|</span>
            <button
              (click)="switchTab('signup')"
              class="text-pastel-blue font-semibold hover:text-pastel-blue/80 transition-colors"
            >
              Sign Up
            </button>
          </div>
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  for="signin-email"
                  class="block text-lg font-medium text-gray-700 mb-2"
                  >Email</label
                >
                <input
                  type="email"
                  id="signin-email"
                  class="flat-input w-full"
                  placeholder="you@saas.com"
                />
              </div>
              <div>
                <label
                  for="signin-password"
                  class="block text-lg font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  type="password"
                  id="signin-password"
                  class="flat-input w-full"
                  placeholder="••••••••"
                />
              </div>
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

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500"
                  >Or continue with</span
                >
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                (click)="signInWithGoogle()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Google</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  />
                </svg>
              </button>

              <button
                type="button"
                (click)="signInWithGitHub()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.602-3.369-1.34-3.369-1.34-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                (click)="signInWithFacebook()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Facebook</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Sign Up Tab Content -->
        <div *ngIf="activeTab === 'signup'">
          <div class="flex items-center flex-start mb-8">
            <h1 class="text-4xl font-black text-gray-800">Create Account</h1>
            <span class="text-gray-300 mx-4">|</span>
            <button
              (click)="switchTab('signin')"
              class="text-pastel-blue font-semibold hover:text-pastel-blue/80 transition-colors"
            >
              Sign In
            </button>
          </div>
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!--div>
              <label
                for="signup-name"
                class="block text-lg font-medium text-gray-700 mb-2"
                >Full Name</label
              >
              <input
                type="text"
                id="signup-name"
                class="flat-input"
                placeholder="Your Full Name"
              />
            </div-->
              <div>
                <label
                  for="signup-email"
                  class="block text-lg font-medium text-gray-700 mb-2"
                  >Email</label
                >
                <input
                  type="email"
                  id="signup-email"
                  class="flat-input"
                  placeholder="you@saas.com"
                />
              </div>
              <div>
                <label
                  for="signup-password"
                  class="block text-lg font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  type="password"
                  id="signup-password"
                  class="flat-input"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <ngx-telegram-widget
              ngSkipHydration
              [botName]="(telegramSettings$ | async)?.authBotName!"
              (onAuth)="signInWithTelegram($event)"
              hidden
            ></ngx-telegram-widget>

            <button
              type="button"
              (click)="signUp()"
              class="w-full text-xl font-bold py-4 rounded-2xl text-white bg-green-500 transition-all duration-300 transform hover:scale-[1.02] flat-btn-shadow 
                          bg-gradient-to-tr from-[#10B981] to-[#34D399] tracking-wide"
            >
              Sign Up
            </button>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                (click)="signInWithGoogle()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign up with Google</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  />
                </svg>
              </button>

              <button
                type="button"
                (click)="signInWithGitHub()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign up with GitHub</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.602-3.369-1.34-3.369-1.34-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                (click)="signInWithFacebook()"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign up with Facebook</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

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
          <span class="text-gray-400 mx-2">|</span>
          <button
            (click)="downloadMobileApk()"
            class="text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            Download Mobile App
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
  private readonly releaseService = inject(ReleaseService);

  activeTab: 'signin' | 'signup' = 'signin'; // Default to sign in tab

  telegramSettings$ = this.telegramSettingsService.stream$;

  switchTab(tab: 'signin' | 'signup') {
    this.activeTab = tab;
  }
  signIn() {
    // Get email and password from the form
    const emailInput = document.getElementById(
      'signin-email'
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      'signin-password'
    ) as HTMLInputElement;

    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!email || !password) {
      this.errorHandlerService
        .handleError(
          new Error('Email and password are required'),
          'Invalid credentials'
        )
        .then();
      return;
    }

    this.authService
      .supabaseSignIn(email, password)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }

  signUp() {
    // Get email, password and name from the form
    // const nameInput = document.getElementById('signup-name') as HTMLInputElement;
    const emailInput = document.getElementById(
      'signup-email'
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      'signup-password'
    ) as HTMLInputElement;

    // const name = nameInput?.value;
    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!email || !password) {
      this.errorHandlerService
        .handleError(
          new Error('Email and password are required'),
          'Invalid credentials'
        )
        .then();
      return;
    }

    if (password.length < 6) {
      this.errorHandlerService
        .handleError(
          new Error('Password must be at least 6 characters'),
          'Invalid password'
        )
        .then();
      return;
    }

    this.authService
      .supabaseSignUp(email, password)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }

  signInWithGoogle() {
    this.authService.supabaseSignInWithOAuth('google');
  }

  signInWithGitHub() {
    this.authService.supabaseSignInWithOAuth('github');
  }

  signInWithFacebook() {
    this.authService.supabaseSignInWithOAuth('facebook');
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

  downloadMobileApk() {
    this.releaseService.getMobileApkDownloadUrl().subscribe({
      next: downloadUrl => {
        if (downloadUrl) {
          // Open the download URL in a new tab
          window.open(downloadUrl, '_blank');
        } else {
          this.errorHandlerService
            .handleError(
              new Error('Mobile APK download URL not found'),
              'Download Unavailable'
            )
            .then();
        }
      },
      error: error => {
        this.errorHandlerService.handleError(error, 'Download Error').then();
      },
    });
  }
}
