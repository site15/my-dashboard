import { inject, Injectable } from '@angular/core';
import { concatMap, from, Observable, switchMap } from 'rxjs';

import { ErrorHandlerService } from './error-handler.service';
import { TelegramUserDataType } from '../../server/types/TelegramUserDataSchema';
import { User } from '../generated/prisma/browser';
import { injectTrpcClient } from '../trpc-client';
import { ProfileService } from './profile.service';
import { SessionService } from './session.service';
import { TelegramSettingsService } from './telegram-settings.service';
import { WINDOW } from '../utils/window';

@Injectable({
  providedIn: 'root',
})
export class TelegramService {
  private trpc = injectTrpcClient();
  private sessionService = inject(SessionService);
  private profileService = inject(ProfileService);
  private telegramSettingsService = inject(TelegramSettingsService);
  private errorHandler = inject(ErrorHandlerService);

  getSettings() {
    return this.trpc.telegram.settings.query().pipe(
      concatMap(async settings => {
        await this.telegramSettingsService.set(settings);
        return settings;
      })
    );
  }

  signInWithTelegramSdk() {
    return from(this.telegramSettingsService.get()).pipe(
      switchMap(
        settings =>
          new Observable(s => {
            try {
              WINDOW?.Telegram?.Login.auth(
                {
                  bot_id: settings?.authBotId,
                  request_access: true,
                },
                (telegramUser: unknown) => {
                  s.next(telegramUser);
                  s.complete();
                }
              );
            } catch (error) {
              s.error(error);
              s.complete();
            }
          })
      ),
      switchMap(telegramUser => this.signInWithTelegram(telegramUser))
    );
  }

  signInWithTelegram(telegramUser: unknown) {
    return this.trpc.telegram.signIn
      .mutate(telegramUser as TelegramUserDataType)
      .pipe(
        concatMap(async ({ sessionId, user }) => {
          try {
            await this.sessionService.set(sessionId);
            await this.profileService.set(user as unknown as User);
            return { sessionId, user };
          } catch (error) {
            await this.errorHandler.handleError(
              error,
              'Failed to sign in with Telegram'
            );
            throw error;
          }
        })
      );
  }
}
