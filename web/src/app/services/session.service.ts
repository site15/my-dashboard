import { Injectable, OnDestroy } from '@angular/core';
import { map, tap } from 'rxjs';
import { X_SESSION_ID } from '../../server/constants';
import { TrpcHeaders } from '../trpc-client';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService
  extends LocalStorageService<string>
  implements OnDestroy
{
  override key = 'sessionId';

  stream$ = this.storageChanges.pipe(
    map((e) => e.newValue),
    tap((sessionId) => {
      if (sessionId) {
        TrpcHeaders.set({ [X_SESSION_ID]: sessionId });
      } else {
        TrpcHeaders.set({});
      }
    })
  );

  private streamRef = this.stream$.subscribe();

  ngOnDestroy(): void {
    this.streamRef.unsubscribe();
  }
}
