import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { injectTrpcClient } from '../trpc-client';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private trpc = injectTrpcClient();

  getMobileApkDownloadUrl(): Observable<string | null> {
    return this.trpc.releases.getMobileApkUrl
      .query()
      .pipe(map(result => result));
  }
}
