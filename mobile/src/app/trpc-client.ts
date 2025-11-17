import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import { AppRouter } from '../../../web/src/server/trpc/routers/index';
import { environment } from '../environments/environment';

export const { provideTrpcClient, TrpcClient, TrpcHeaders } =
  createTrpcClient<AppRouter>({
    url: `${environment.apiUrl}/api/trpc`,
  });

export function injectTrpcClient() {
  return inject(TrpcClient);
}
