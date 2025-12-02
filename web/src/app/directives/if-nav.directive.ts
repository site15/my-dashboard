/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { LayoutService } from '../services/layout.service';

@Directive({
  selector: '[ifNavShown]',
})
export class IfNavShownDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.subscription = this.layoutService.isNavShown.subscribe(isNavShown => {
      if (isNavShown && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        if (!isNavShown && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Prevent memory leak
    }
  }

  @Input() set ifNavShown(condition: any) {
    // null
  }
}

@Directive({
  selector: '[ifNavHidden]',
})
export class IfNavHiddenDirective implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private hasView = false;

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.subscription = this.layoutService.isNavShown.subscribe(isNavShown => {
      console.log({ isNavShown });
      if (!isNavShown && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else {
        if (isNavShown && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Prevent memory leak
    }
  }

  @Input() set ifNavHidden(condition: any) {
    // null
  }
}
