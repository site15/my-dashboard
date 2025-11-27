/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Enhanced tRPC → Nitro handler
 * ✔ Beautiful Zod logging (ctx.logger.zodError)
 * ✔ errorWithStack for other errors
 * ✔ Full compatibility with tRPC v10.45.2
 */

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
import { z } from 'zod';

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

/** ------------------------------------------------------------------
 * Utils
 * ------------------------------------------------------------------ */

function getPath(event: H3Event): string | null {
  const { params } = event.context;
  if (typeof params?.['trpc'] === 'string') return params['trpc'];
  if (Array.isArray(params?.['trpc']))
    return ((params['trpc'] as Array<string>) || []).join('/');
  return null;
}

function getCorsOrigin(req: any): string | null {
  const origin = req.headers.origin;
  const allowed = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'http://localhost:8100',
    'http://127.0.0.1:8100',
    'http://localhost',
    'https://127.0.0.1:5173',
    'https://localhost:5173',
    'https://localhost:8100',
    'https://127.0.0.1:8100',
    'https://localhost',
    'capacitor://localhost',
    'ionic://localhost',
    ENVIRONMENTS.MY_DASHBOARD_API_URL,
  ];
  return origin && allowed.includes(origin) ? origin : null;
}

/** ------------------------------------------------------------------
 * Handler
 * ------------------------------------------------------------------ */

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

    /** --------------------------
     * 1) OPTIONS — CORS preflight
     * ------------------------ */
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

    /** --------------------------
     * 2) Main tRPC request
     * -------------------------- */
    const path = getPath(event);
    if (path === null) {
      const error = router.getErrorShape({
        error: new TRPCError({
          message:
            'Param "trpc" not found — file must be `[trpc].ts` or `[...trpc].ts`.',
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

    /** --------------------------
     * 3) resolveHTTPResponse
     * -------------------------- */
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

      /** ------------------------------------------------------------------
       * 🔥 CUSTOM ERROR HANDLING
       * ------------------------------------------------------------------ */
      onError: o => {
        const ctx = o.ctx;

        /**
         * 🌈 Beautiful Zod error logging
         * If TRPCError.cause is ZodError → use ctx.logger.zodError(...)
         */
        const maybeOriginalCause = (o.error as any)?.cause;

        if (maybeOriginalCause instanceof z.ZodError) {
          ctx?.logger?.zodError(maybeOriginalCause, {
            event: 'zod_error',
            path: o.path,
            type: o.type,
            input: o.input,
          });
        } else {
          /** fallback: full stack trace */
          ctx?.logger?.errorWithStack?.(o.error, {
            event: 'trpc_error',
            path: o.path,
            type: o.type,
            input: o.input,
          });
        }

        /** also call external handler */
        onError?.({
          ...o,
          req,
        });
      },
    });

    /** --------------------------
     * 4) Write HTTP response
     * -------------------------- */
    const { status, headers, body } = httpResponse;

    res.statusCode = status;

    if (headers) {
      for (const key of Object.keys(headers)) {
        res.setHeader(key, headers[key]!);
      }
    }

    if (corsOrigin) {
      res.setHeader('Access-Control-Allow-Origin', corsOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    return body;
  });
}