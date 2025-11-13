import { injectRequest } from '@analogjs/router/tokens';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { getCookie } from '../../server/utils/cookie-utils';
import { injectTrpcClient } from '../trpc-client';
import { isSSR } from '../utils/is-ssr';
import { LOCAL_STORAGE } from '../utils/local-storage';

export type StorageChangeType<T> = {
  key: string | null;
  newValue: T | null;
  oldValue: T | null;
  url: string | null;
  storageArea: Storage | null;
};

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService<T = unknown> {
  private trpc = injectTrpcClient();
  private request = injectRequest();

  key?: string;
  autoReloadAfterCreate?: boolean = true;

  storageChangeCallbacks: ((
    options: StorageChangeType<T>
  ) => Promise<unknown>)[] = [];

  private storageChangeSubject = new BehaviorSubject<StorageChangeType<T>>({
    key: null,
    newValue: null,
    oldValue: null,
    url: null,
    storageArea: null,
  });

  storageChanges = this.storageChangeSubject.asObservable();

  constructor() {
    if (this.autoReloadAfterCreate && this.key) {
      this.reload().then();
    }
  }

  async reload() {
    const current = await this.get();
    if (current) {
      await this.set(current);
    }
  }

  async set(value: T) {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    await this.setItem(this.key, value);
  }

  async get(): Promise<T | null> {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    const result = await this.getItem(this.key);
    return result;
  }

  async remove() {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    await this.removeItem(this.key);
  }

  private async setItem(key: string, value: T) {
    const newValue = JSON.stringify(value);
    //const oldValueRaw = LOCAL_STORAGE?.getItem(key);
    const oldValueRaw = JSON.stringify(await this.getItem(key));
    const oldValue =
      oldValueRaw && oldValueRaw !== 'undefined'
        ? JSON.parse(oldValueRaw)
        : oldValueRaw;
    // LOCAL_STORAGE?.setItem(key, newValue);
    if (newValue !== oldValueRaw) {
      if (isSSR && this.key) {
        //
      } else {
        await firstValueFrom(
          this.trpc.userStorage.set.mutate({ name: key, value: newValue })
        );
      }
    }

    for (const storageChangeCallback of this.storageChangeCallbacks) {
      await storageChangeCallback({
        key,
        newValue: value,
        oldValue,
        url: null,
        storageArea: LOCAL_STORAGE,
      });
    }

    this.storageChangeSubject.next({
      key,
      newValue: value,
      oldValue,
      url: null,
      storageArea: LOCAL_STORAGE,
    });
  }

  private async getItem(key: string): Promise<T | null> {
    if (isSSR && this.key) {
      // const value = LOCAL_STORAGE?.getItem(key);
      const value = getCookie(this.request, this.key);
      if (value && value !== 'undefined' && value !== 'empty') {
        return JSON.parse(value);
      }
      return null;
    } else {
      // const value = LOCAL_STORAGE?.getItem(key);
      const value = (
        await firstValueFrom(this.trpc.userStorage.get.query({ name: key }))
      ).value;
      if (value && value !== 'undefined' && value !== 'empty') {
        return JSON.parse(value);
      }
      return null;
    }
  }

  private async removeItem(key: string) {
    const oldValue = await this.getItem(key);
    // LOCAL_STORAGE?.removeItem(key);
    if (isSSR && this.key) {
      //
    } else {
      try {
        await firstValueFrom(this.trpc.userStorage.del.mutate({ name: key }));
      } catch (error) {
        // todo: skip only our error
      }
    }

    for (const storageChangeSubject of this.storageChangeCallbacks) {
      await storageChangeSubject({
        key,
        newValue: null,
        oldValue,
        url: null,
        storageArea: LOCAL_STORAGE,
      });
    }

    this.storageChangeSubject.next({
      key,
      newValue: null,
      oldValue,
      url: null,
      storageArea: LOCAL_STORAGE,
    });
  }
}
