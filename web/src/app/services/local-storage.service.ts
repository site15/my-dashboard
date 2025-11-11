import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOCAL_STORAGE } from '../utils/local-storage';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService<T = unknown> {
  key?: string;
  private storageChangeSubject = new BehaviorSubject<{
    key: string | null;
    newValue: T | null;
    oldValue: T | null;
    url: string | null;
    storageArea: Storage | null;
  }>({
    key: null,
    newValue: null,
    oldValue: null,
    url: null,
    storageArea: null,
  });

  storageChanges = this.storageChangeSubject.asObservable();

  constructor() {
    if (this.key) {
      this.reload();
    }
  }

  reload() {
    const current = this.get();
    if (current) {
      this.set(current);
    }
  }

  set(value: T): void {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    this.setItem(this.key, value);
  }

  get(): T | null {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    return this.getItem(this.key);
  }

  remove() {
    if (!this.key) {
      throw new Error('this.key not set');
    }
    this.removeItem(this.key);
  }

  setItem(key: string, value: T): void {
    const newValue = JSON.stringify(value);
    const oldValueRaw = LOCAL_STORAGE?.getItem(key);
    const oldValue =
      oldValueRaw && oldValueRaw !== 'undefined'
        ? JSON.parse(oldValueRaw)
        : oldValueRaw;
    LOCAL_STORAGE?.setItem(key, newValue);
    this.storageChangeSubject.next({
      key,
      newValue: value,
      oldValue,
      url: null,
      storageArea: LOCAL_STORAGE,
    });
  }

  getItem(key: string): T | null {
    try {
      const value = LOCAL_STORAGE?.getItem(key);
      if (value && value !== 'undefined') {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  removeItem(key: string): void {
    const oldValue = this.getItem(key);
    LOCAL_STORAGE?.removeItem(key);
    this.storageChangeSubject.next({
      key,
      newValue: null,
      oldValue,
      url: null,
      storageArea: LOCAL_STORAGE,
    });
  }
}
