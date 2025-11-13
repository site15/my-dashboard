import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  DestroyRef,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { withComponentInputBinding } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TelegramService } from './services/telegram.service';
import { ThemeService } from './services/theme.service';
import { provideTrpcClient } from './trpc-client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionService } from './services/session.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    provideTrpcClient(),
    provideAppInitializer(async () => {
      const destroyRef = inject(DestroyRef);

      const sessionService = inject(SessionService);
      const authService = inject(AuthService);
      const telegramService = inject(TelegramService);
      const themeService = inject(ThemeService);

      sessionService.stream$.pipe(takeUntilDestroyed(destroyRef)).subscribe();
      themeService.stream$.pipe(takeUntilDestroyed(destroyRef)).subscribe();

      await themeService.init();
      await firstValueFrom(telegramService.getSettings());
      await firstValueFrom(authService.profile());
    }),
  ],
};
