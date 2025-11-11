import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TelegramUserDataType } from '../../server/types/TelegramUserDataSchema';
import { User } from '../generated/prisma/browser';
import { injectTrpcClient } from '../trpc-client';
import { ProfileService } from './profile.service';
import { SessionService } from './session.service';
import { TelegramSettingsService } from './telegram-settings.service';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private trpc = injectTrpcClient();
  private sessionService = inject(SessionService);
  private profileService = inject(ProfileService);
  private telegramSettingsService = inject(TelegramSettingsService);

  getSettings() {
    return this.trpc.telegram.settings.query().pipe(
      tap((settings) => {
        this.telegramSettingsService.set(settings);
      })
    );
  }

  signInWithTelegram(telegramUser: unknown) {
    return this.trpc.telegram.signIn
      .mutate(telegramUser as TelegramUserDataType)
      .pipe(
        tap(({ sessionId, user }) => {
          this.sessionService.set(sessionId);
          this.profileService.set(user as unknown as User);
        })
      );
  }
}
