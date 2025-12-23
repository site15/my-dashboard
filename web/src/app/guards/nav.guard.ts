import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync } from '@angular/router';

import { LayoutService } from '../services/layout.service';
import { LocalStorageEnum } from '../services/local-storage.service';
import { ThemeService } from '../services/theme.service';

@Injectable({ providedIn: 'root' })
export class HideNavGuard implements CanActivate {
  constructor(
    private readonly themeService: ThemeService,
    private readonly layoutService: LayoutService
  ) {}

  canActivate(): MaybeAsync<GuardResult> {
    this.layoutService.hideNav();
    this.themeService.type = LocalStorageEnum.server;
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class ShowNavGuard implements CanActivate {
  constructor(
    private readonly themeService: ThemeService,
    private readonly layoutService: LayoutService
  ) {}

  canActivate(): MaybeAsync<GuardResult> {
    this.layoutService.showNav();
    this.themeService.type = LocalStorageEnum.server;
    return true;
  }
}
