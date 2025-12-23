import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync } from '@angular/router';

import { LocalStorageEnum } from '../services/local-storage.service';
import { ThemeService } from '../services/theme.service';

@Injectable({ providedIn: 'root' })
export class StoreThemeInClientGuard implements CanActivate {
  constructor(private readonly themeService: ThemeService) {}

  canActivate(): MaybeAsync<GuardResult> {
    this.themeService.type = LocalStorageEnum.client;
    return true;
  }
}