/* eslint-disable @typescript-eslint/no-explicit-any */
// if-logged.directive.ts
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ProfileService } from '../services/profile.service';

@Directive({
  selector: '[ifLogged]',
})
export class IfLoggedDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.subscription = this.profileService
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else {
          if (!isLoggedIn && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Предотвращаем утечку памяти
    }
  }

  @Input() set ifLogged(condition: any) {
    // null
  }
}

@Directive({
  selector: '[ifNotLogged]',
})
export class IfNotLoggedDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.subscription = this.profileService
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (!isLoggedIn && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else {
          if (isLoggedIn && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Предотвращаем утечку памяти
    }
  }

  @Input() set ifNotLogged(condition: any) {
    // null
  }
}
