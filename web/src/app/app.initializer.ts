import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from './services/auth.service';
import { TelegramService } from './services/telegram.service';
import { ThemeService } from './services/theme.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly authService = inject(AuthService);
  private readonly telegramService = inject(TelegramService);
  private readonly themeService = inject(ThemeService);

  async init() {
    await this.themeService.init();
    await firstValueFrom(this.telegramService.getSettings());
    await firstValueFrom(this.authService.profile());
  }
}
