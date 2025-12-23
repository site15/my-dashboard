import { DOCUMENT, inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import {
  LocalStorageService,
  StorageChangeType,
} from './local-storage.service';

export type ColorScheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService extends LocalStorageService<ColorScheme> {
  override key = 'theme';

  stream$ = this.storageChanges.pipe(map(e => e.newValue));

  private readonly document = inject(DOCUMENT);

  override storageChangeCallbacks: ((
    e: StorageChangeType<string>
  ) => Promise<unknown>)[] = [
    async e => {
      const htmlTag = this.document.documentElement;
      const theme = e.newValue;

      if (!theme) {
        await this.setLight();
      } else {
        // Set the data-theme attribute for any components that might use it
        if (htmlTag) {
          htmlTag.setAttribute('data-theme', theme);
        }
      }
    },
  ];

  async switchTheme() {
    const defaultTheme = 'light';

    const currentTheme = await this.get();
    const newTheme = !currentTheme
      ? defaultTheme
      : currentTheme === 'light'
        ? 'dark'
        : 'light';

    if (newTheme === 'light') {
      this.setLight();
    } else {
      this.setDark();
    }
  }

  async init() {
    const current = await this.get();
    if (current) {
      await this.set(current);
    } else {
      await this.setLight(); // Default to light theme
    }
  }

  setLight() {
    return this.set('light');
  }

  setDark() {
    return this.set('dark');
  }
}
