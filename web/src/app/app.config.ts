import {
  provideFileRouter,
  requestContextInterceptor,
  withDebugRoutes,
} from '@analogjs/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  DestroyRef,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { withComponentInputBinding } from '@angular/router';
import { withFormlyBootstrap } from '@ngx-formly/bootstrap';
import { provideFormlyCore } from '@ngx-formly/core';
import { icons, LucideAngularModule } from 'lucide-angular';
import { provideToastr } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { TelegramService } from './services/telegram.service';
import { ThemeService } from './services/theme.service';
import { provideTrpcClient } from './trpc-client';
import { provideTrpcPureClient } from './trpc-pure-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFormlyCore(...withFormlyBootstrap()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(withComponentInputBinding(), withDebugRoutes()),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    provideTrpcClient(),
    provideTrpcPureClient(),
    provideNoopAnimations(),
    provideToastr(),
    importProvidersFrom(LucideAngularModule.pick(icons)),
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
