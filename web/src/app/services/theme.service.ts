import { DOCUMENT, inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { WINDOW } from '../utils/window';
import {
  LocalStorageService,
  StorageChangeType,
} from './local-storage.service';

export type ColorScheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService extends LocalStorageService<ColorScheme> {
  override key = 'picoColorScheme';
  private readonly document = inject(DOCUMENT);

  stream$ = this.storageChanges.pipe(map((e) => e.newValue));

  override storageChangeCallbacks: ((
    e: StorageChangeType<string>
  ) => Promise<unknown>)[] = [
    async (e) => {
      const htmlTag = this.document.querySelector('html');

      const theme = e.newValue;
      if (!theme) {
        await this.set('light');
      } else {
        if (htmlTag) {
          htmlTag.setAttribute('data-theme', theme);
        }
      }
    },
  ];

  async switchTheme() {
    const defaultTheme: ColorScheme = WINDOW?.matchMedia?.(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light';

    const currentTheme = await this.get();
    const newTheme = !currentTheme
      ? defaultTheme
      : currentTheme === 'light'
      ? 'dark'
      : 'light';

    await this.set(newTheme);
  }

  async init() {
    const current = await this.get();
    if (current) {
      await this.set(current);
    } else {
      await this.switchTheme();
    }
  }
}
