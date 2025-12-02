import { Injectable } from '@angular/core';
import { CanActivate, GuardResult, MaybeAsync } from '@angular/router';

import { LayoutService } from '../services/layout.service';

@Injectable({ providedIn: 'root' })
export class HideNavGuard implements CanActivate {
  constructor(private readonly layoutService: LayoutService) {}

  canActivate(): MaybeAsync<GuardResult> {
    this.layoutService.hideNav();
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class ShowNavGuard implements CanActivate {
  constructor(private readonly layoutService: LayoutService) {}

  canActivate(): MaybeAsync<GuardResult> {
    this.layoutService.showNav();
    return true;
  }
}
