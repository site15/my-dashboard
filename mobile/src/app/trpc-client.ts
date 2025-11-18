/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';

import { AppRouter } from '../../../web/src/server/trpc/routers/index';
import { environment } from '../environments/environment';

function customFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: 'include', // важно для CORS с куки
    headers: {
      ...(init?.headers || {}),
    },
  });
}

export const { provideTrpcClient, TrpcClient, TrpcHeaders } =
  createTrpcClient<AppRouter>({
    url: `${environment.apiUrl}/api/trpc`,
    batchLinkOptions: { fetch: customFetch } as any, // используем кастомный fetch
  });

export function injectTrpcClient() {
  return inject(TrpcClient);
}
