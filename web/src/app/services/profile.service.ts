import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { LocalStorageEnum, LocalStorageService } from './local-storage.service';
import { User } from '../generated/prisma/browser';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends LocalStorageService<User> {
  override key = 'profile';
  override type = LocalStorageEnum.client;

  stream$ = this.storageChanges.pipe(map(e => e.newValue));

  isLoggedIn() {
    return this.storageChanges.pipe(
      map(({ newValue }) => !!newValue && !!newValue.id)
    );
  }
}
