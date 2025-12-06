import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { X_SESSION_ID } from '../../server/constants';
import { TrpcHeaders } from '../trpc-client';
import {
  LocalStorageService,
  StorageChangeType,
} from './local-storage.service';
import { TrpcPureHeaders } from '../trpc-pure-client';

@Injectable({
  providedIn: 'root',
})
export class SessionService extends LocalStorageService<string> {
  override key = 'sessionId';

  stream$ = this.storageChanges.pipe(map(e => e.newValue));

  override storageChangeCallbacks: ((
    options: StorageChangeType<string>
  ) => Promise<unknown>)[] = [
    async e => {
      const sessionId = e.newValue;
      if (sessionId) {
        TrpcHeaders.set({ [X_SESSION_ID]: sessionId });
        TrpcPureHeaders.set({ [X_SESSION_ID]: sessionId });
      } else {
        TrpcHeaders.set({});
        TrpcPureHeaders.set({});
      }
    },
  ];
}
