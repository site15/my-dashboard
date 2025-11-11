import { Injectable, OnDestroy } from '@angular/core';
import { distinctUntilChanged, map, tap } from 'rxjs';
import { isSSR } from '../utils/is-ssr';
import { WINDOW } from '../utils/window';
import { LocalStorageService } from './local-storage.service';

export type ColorScheme = 'light' | 'dark';

const htmlTag = !isSSR && document.querySelector('html');

const defaultTheme: ColorScheme = WINDOW?.matchMedia?.(
  '(prefers-color-scheme: dark)'
).matches
  ? 'dark'
  : 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService
  extends LocalStorageService<ColorScheme>
  implements OnDestroy
{
  override key = 'picoColorScheme';

  stream$ = this.storageChanges.pipe(
    map((e) => e.newValue),
    tap((theme) => {
      if (!theme) {
        this.set('light');
      } else {
        if (htmlTag) {
          htmlTag.setAttribute('data-theme', theme);
        }
      }
    })
  );

  switchTheme(): void {
    const currentTheme = this.get();
    const newTheme = !currentTheme
      ? defaultTheme
      : currentTheme === 'light'
      ? 'dark'
      : 'light';

    this.set(newTheme);
  }

  private streamRef = this.stream$.subscribe();

  ngOnDestroy(): void {
    this.streamRef.unsubscribe();
  }
}
