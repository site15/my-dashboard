/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * ALl credit goes to the awesome trpc-nuxt plugin https://github.com/wobsoriano/trpc-nuxt
 * Since Analog currently uses Nitro as the underlying server we can
 * simply reuse the hard work done by Robert Soriano and friends
 * **/

import type {
  AnyRouter,
  inferRouterContext,
  inferRouterError,
  ProcedureType,
} from '@trpc/server';
import { TRPCError } from '@trpc/server';
import type { ResponseMeta } from '@trpc/server/http';
import { resolveHTTPResponse } from '@trpc/server/http';
import type { TRPCResponse } from '@trpc/server/rpc';
import type { H3Event } from 'h3';
import { createError, defineEventHandler, isMethod, readBody } from 'h3';
import { createURL } from 'ufo';

import { ENVIRONMENTS } from '../env';

type MaybePromise<T> = T | Promise<T>;

export type CreateContextFn<TRouter extends AnyRouter> = (
  event: H3Event
) => MaybePromise<inferRouterContext<TRouter>>;

export interface ResponseMetaFnPayload<TRouter extends AnyRouter> {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[];
  ctx?: inferRouterContext<TRouter>;
  paths?: string[];
  type: ProcedureType | 'unknown';
  errors: TRPCError[];
}

export type ResponseMetaFn<TRouter extends AnyRouter> = (
  opts: ResponseMetaFnPayload<TRouter>
) => ResponseMeta;

export interface OnErrorPayload<TRouter extends AnyRouter> {
  error: TRPCError;
  type: ProcedureType | 'unknown';
  path: string | undefined;
  req: H3Event['node']['req'];
  input: unknown;
  ctx: undefined | inferRouterContext<TRouter>;
}

export type OnErrorFn<TRouter extends AnyRouter> = (
  opts: OnErrorPayload<TRouter>
) => void;

export interface ResolveHTTPRequestOptions<TRouter extends AnyRouter> {
  router: TRouter;
  createContext?: CreateContextFn<TRouter>;
  responseMeta?: ResponseMetaFn<TRouter>;
  onError?: OnErrorFn<TRouter>;
  batching?: {
    enabled: boolean;
  };
}

function getPath(event: H3Event): string | null {
  const { params } = event.context;

  if (typeof params?.['trpc'] === 'string') {
    return params['trpc'];
  }

  if (params?.['trpc'] && Array.isArray(params['trpc'])) {
    return (params['trpc'] as string[]).join('/');
  }

  return null;
}

function getCorsOrigin(req: any): string | null {
  const origin = req.headers.origin;

  const allowed = [
    // http
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://localhost:8100',
    'http://127.0.0.1:8100',
    'http://localhost',
    // https
    'https://127.0.0.1:5173',
    'https://localhost:5173',
    'https://localhost:8100',
    'https://127.0.0.1:8100',
    'https://localhost',
    // magic
    'capacitor://localhost',
    'ionic://localhost',
    ENVIRONMENTS.MY_DASHBOARD_API_URL,
  ];

  const result = origin && allowed.includes(origin) ? origin : null;
  return result;
}

export function createCustomTrpcNitroHandler<TRouter extends AnyRouter>({
  router,
  createContext,
  onError,
  batching,
}: ResolveHTTPRequestOptions<TRouter>) {
  return defineEventHandler(async event => {
    const { req, res } = event.node;
    const corsOrigin = getCorsOrigin(req);
    const $url = createURL(req.url!);

    // -------------------
    // 1️⃣ Preflight OPTIONS
    // -------------------
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      if (corsOrigin) {
        res.setHeader('Access-Control-Allow-Origin', corsOrigin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
          'Access-Control-Allow-Headers',
          req.headers['access-control-request-headers'] ?? 'content-type'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      }
      return null;
    }

    // -------------------
    // 2️⃣ Основной tRPC запрос
    // -------------------
    const path = getPath(event);
    if (path === null) {
      const error = router.getErrorShape({
        error: new TRPCError({
          message:
            'Param "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
          code: 'INTERNAL_SERVER_ERROR',
        }),
        type: 'unknown',
        ctx: undefined,
        path: undefined,
        input: undefined,
      });
      throw createError({
        statusCode: 500,
        statusMessage: JSON.stringify(error),
      });
    }

    const httpResponse = await resolveHTTPResponse({
      batching,
      router,
      req: {
        method: req.method!,
        headers: req.headers,
        body: isMethod(event, 'GET') ? null : await readBody(event),
        query: $url.searchParams,
      },
      path,
      createContext: async () => await createContext?.(event),
      responseMeta: ({ errors }) => {
        const headers: Record<string, string> = {};
        if (corsOrigin) {
          headers['Access-Control-Allow-Origin'] = corsOrigin;
          headers['Access-Control-Allow-Credentials'] = 'true';
        }
        if (errors.length) headers['X-TRPC-Error'] = 'true';
        return { headers };
      },
      onError: o => {
        const ctx = o.ctx; // TRPC контекст с logger
        if (ctx?.logger) {
          ctx.logger.errorWithStack(o.error, {
            event: 'trpc_error',
            path: o.path,
            type: o.type,
            input: o.input,
          });
        } else {
          // fallback, если ctx ещё нет
          console.error('[tRPC Error]', o.error, {
            path: o.path,
            type: o.type,
            input: o.input,
          });
        }

        // Вызов внешнего onError, если есть
        onError?.({
          ...o,
          req,
        });
      },
    });

    const { status, headers, body } = httpResponse;
    res.statusCode = status;

    headers &&
      Object.keys(headers).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        res.setHeader(key, headers[key]!);
      });

    // 🔥 Принудительно ставим CORS после tRPC
    if (corsOrigin) {
      res.setHeader('Access-Control-Allow-Origin', corsOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return body;
  });
}
