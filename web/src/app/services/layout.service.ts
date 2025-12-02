import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly showNav$ = new BehaviorSubject<boolean | undefined>(
    undefined
  );

  isNavShown = this.showNav$.asObservable();

  refresh() {
    this.showNav$.next(
      this.showNav$.value === undefined ? true : this.showNav$.value
    );
  }

  showNav() {
    this.showNav$.next(true);
  }

  hideNav() {
    this.showNav$.next(false);
  }
}
