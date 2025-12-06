/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import 'isomorphic-fetch';
import superjson from 'superjson';

import { AppRouter } from '../server/trpc/routers/index';

function customPureFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { method: 'GET' }
) {
  if ((globalThis as any).$fetch) {
    return (globalThis as any).$fetch
      .raw(input.toString(), {
        ...init,
        credentials: 'include', // important for CORS with cookies
        headers: {
          ...(init?.headers || {}),
        },
      })
      .then((response: any) => ({
        ...response,
        headers: response.headers,
        json: () => Promise.resolve(response._data),
      }));
  }

  // dev server trpc for analog & nitro
  if (typeof window === 'undefined') {
    const host =
      process.env['NITRO_HOST'] ?? process.env['ANALOG_HOST'] ?? 'localhost';
    const port =
      process.env['NITRO_PORT'] ?? process.env['ANALOG_PORT'] ?? 4205;
    const base = `http://${host}:${port}`;
    if (input instanceof Request) {
      input = new Request(base, input);
    } else {
      input = new URL(input, base);
    }
  }

  return fetch(input, {
    ...init,
    credentials: 'include', // important for CORS with cookies
    headers: {
      ...(init?.headers || {}),
    },
  });
}

export const {
  provideTrpcClient: provideTrpcPureClient,
  TrpcClient: TrpcPureClient,
  TrpcHeaders: TrpcPureHeaders,
} = createTrpcClient<AppRouter>({
  url: '/api/trpc',
  options: { transformer: superjson },
  batchLinkOptions: { fetch: customPureFetch, transformer: superjson } as any, // use custom fetch
});

export function injectTrpcPureClient() {
  return inject(TrpcPureClient);
}
