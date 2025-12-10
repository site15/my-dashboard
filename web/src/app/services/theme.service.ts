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
        await this.set('light');
      } else {
        // Set the data-theme attribute for any components that might use it
        if (htmlTag) {
          htmlTag.setAttribute('data-theme', theme);
        }

        // Apply the appropriate class for Tailwind dark mode
        if (theme === 'dark') {
          this.document.documentElement.classList.add('dark');
        } else {
          this.document.documentElement.classList.remove('dark');
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

    await this.set(newTheme);
  }

  async init() {
    const current = await this.get();
    if (current) {
      await this.set(current);
    } else {
      await this.set('light'); // Default to light theme
    }
  }
}