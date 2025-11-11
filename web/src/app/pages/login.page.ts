import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';
import { NgxTelegramWidgetComponent } from '../components/telegram/ngx-telegram-widget.component';
import { AuthService } from '../services/auth.service';
import { TelegramSettingsService } from '../services/telegram-settings.service';
import { TelegramService } from '../services/telegram.service';
import { WINDOW } from '../utils/window';

@Component({
  selector: 'login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxTelegramWidgetComponent, AsyncPipe],
  template: `<section>
    <h3>Authorization</h3>
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
          (onAuth)="signInWithTelegramWidget($event)"
          hidden
        ></ngx-telegram-widget>
        <button type="button" (click)="signInWithTelegram()" class="secondary">
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private telegramService = inject(TelegramService);
  private telegramSettingsService = inject(TelegramSettingsService);

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

  signInWithTelegramWidget(telegramUser: unknown) {
    this.telegramService
      .signInWithTelegram(telegramUser)
      .pipe(
        first(),
        tap(() => this.router.navigate(['/dashboards']))
      )
      .subscribe();
  }

  signInWithTelegram() {
    WINDOW?.Telegram?.Login.auth(
      {
        bot_id: this.telegramSettingsService.get()?.authBotId,
        request_access: true,
      },
      (telegramUser: unknown) => {
        this.telegramService
          .signInWithTelegram(telegramUser)
          .pipe(
            first(),
            tap(() => this.router.navigate(['/dashboards']))
          )
          .subscribe();
      }
    );
  }
}
