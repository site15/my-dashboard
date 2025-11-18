/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import 'isomorphic-fetch';
import { AppRouter } from '../../../web/src/server/trpc/routers/index';
import { environment } from '../environments/environment';

function customFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { method: 'GET' }
) {
  if ((globalThis as any).$fetch) {
    return (globalThis as any).$fetch
      .raw(input.toString(), {
        ...init,
        credentials: 'include', // важно для CORS с куки
        headers: {
          ...(init?.headers || {}),
        },
      })
      .catch((e: any) => {
        throw e;
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
