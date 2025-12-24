import { Injectable } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { injectTrpcClient } from '../trpc-client';

/**
 * Global error handler service for the mobile app
 * Intercepts backend errors and shows them in Ionic toasts
 */
@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly trpc = injectTrpcClient();

  info() {
    return firstValueFrom(
      this.trpc.device.info.query().pipe(
        tap((info) => {
          this.setDarkTheme(!!info.isBlackTheme);
        })
      )
    );
  }

  setDarkTheme(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    document.documentElement.classList.toggle('ion-palette-light', !shouldAdd);
    if (shouldAdd) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  link(input: { deviceId: string; code: string }) {
    return firstValueFrom(this.trpc.device.link.mutate(input));
  }

  unlink() {
    return firstValueFrom(this.trpc.device.unlink.mutate());
  }

  saveSettings(input: { isBlackTheme: boolean }) {
    return firstValueFrom(
      this.trpc.device.saveSettings
        .mutate({ isBlackTheme: input.isBlackTheme })
        .pipe(tap((info) => this.setDarkTheme(!!info.isBlackTheme)))
    );
  }
}
