import { AppRouter } from '../server/trpc/routers/index';
import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';

export const { provideTrpcClient, TrpcClient, TrpcHeaders } =
  createTrpcClient<AppRouter>({
    url: '/api/trpc',
  });

export function injectTrpcClient() {
  return inject(TrpcClient);
}
