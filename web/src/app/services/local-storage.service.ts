import { injectRequest } from '@analogjs/router/tokens';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { getCookie } from '../../server/utils/cookie-utils';
import { isSSR } from '../../server/utils/is-ssr';
import { injectTrpcClient } from '../trpc-client';
import { LOCAL_STORAGE } from '../utils/local-storage';
import { Concurrency } from '../utils/p-concurrency';

export type StorageChangeType<T> = {
  key: string | null;
  newValue: T | null;
  oldValue: T | null;
  url: string | null;
  storageArea: Storage | null;
};

export enum LocalStorageEnum {
  client = 'client',
  server = 'server',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService<T = unknown> {
  private trpc = injectTrpcClient();
  private request = injectRequest();

  type?: LocalStorageEnum = LocalStorageEnum.server;
  key?: string;

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
    if (this.key) {
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

  /**
   * since the version of the trpc client in analogjs is old, batches cannot be selectively disabled,
   * so we manually prevent two cookie modification methods from running concurrently,
   * because if they are launched in parallel, they will overwrite each other
   * https://github.com/trpc/trpc/blob/d6bb04dafc4f0a887ff1ab3002758ff424a8df17/packages/client/src/links/HTTPBatchLinkOptions.ts#L23
   */
  @Concurrency({ global: true, concurrency: 1 })
  private async setItem(key: string, value: T) {
    const newValue = JSON.stringify(value);
    const oldValueRaw = JSON.stringify(await this.getItem(key));
    const oldValue =
      oldValueRaw && oldValueRaw !== 'undefined'
        ? JSON.parse(oldValueRaw)
        : oldValueRaw;
    if (newValue !== oldValueRaw) {
      if (isSSR && this.key) {
        //
      } else {
        LOCAL_STORAGE?.setItem(key, newValue);
        if (this.type === 'server') {
          await firstValueFrom(
            this.trpc.userStorage.set.mutate({ name: key, value: newValue }, {})
          );
        }
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
      const value = getCookie(this.request, this.key);
      if (value && value !== 'undefined' && value !== 'empty') {
        return JSON.parse(value);
      }
      return null;
    } else {
      let value = LOCAL_STORAGE?.getItem(key);
      if (!value && this.type === 'server') {
        value =
          (await firstValueFrom(this.trpc.userStorage.get.query({ name: key })))
            ?.value || undefined;
      }
      if (value && value !== 'undefined' && value !== 'empty') {
        return JSON.parse(value);
      }
      return null;
    }
  }

  /**
   * since the version of the trpc client in analogjs is old, batches cannot be selectively disabled,
   * so we manually prevent two cookie modification methods from running concurrently,
   * because if they are launched in parallel, they will overwrite each other
   * https://github.com/trpc/trpc/blob/d6bb04dafc4f0a887ff1ab3002758ff424a8df17/packages/client/src/links/HTTPBatchLinkOptions.ts#L23
   */
  @Concurrency({ global: true, concurrency: 1 })
  private async removeItem(key: string) {
    const oldValue = await this.getItem(key);
    if (isSSR && this.key) {
      //
    } else {
      try {
        LOCAL_STORAGE?.removeItem(key);
        if (this.type === 'server') {
          await firstValueFrom(this.trpc.userStorage.del.mutate({ name: key }));
        }
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
