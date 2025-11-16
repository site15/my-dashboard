import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';

import { NgxTelegramWidgetComponent } from '../components/telegram/ngx-telegram-widget.component';
import { AuthService } from '../services/auth.service';
import { TelegramSettingsService } from '../services/telegram-settings.service';
import { TelegramService } from '../services/telegram.service';

@Component({
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTelegramWidgetComponent, AsyncPipe],
  template: `<section>
    <h3>
      <nav aria-label="breadcrumb">
        <ul>
          <li>Authorization</li>
        </ul>
      </nav>
    </h3>
    <hr />
    <form>
      <input
        type="text"
        name="username"
        placeholder="Username"
        aria-label="Username"
        autocomplete="username"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        aria-label="Password"
        required
      />
      <div class="grid">
        <ngx-telegram-widget
          ngSkipHydration
          [botName]="(telegramSettings$ | async)?.authBotName!"
          (onAuth)="signInWithTelegram($event)"
          hidden
        ></ngx-telegram-widget>
        <button
          type="button"
          (click)="signInWithTelegramSdk()"
          class="secondary"
        >
          Login with Telegram
        </button>
        <button type="button" (click)="signInAsAnonymous()" class="contrast">
          Login as Anonymous
        </button>
        <button type="submit">Login</button>
      </div>
      <a href="#" style="padding-right: 1rem;">Register</a>
      <a href="#">Password recovery</a>
    </form>
  </section>`,
})
export default class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly telegramService = inject(TelegramService);
  private readonly telegramSettingsService = inject(TelegramSettingsService);

  telegramSettings$ = this.telegramSettingsService.stream$;

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
