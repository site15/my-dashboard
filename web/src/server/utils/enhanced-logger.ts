/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * enhanced-logger.ts
 *
 * One-file ready-to-use logger for:
 *  - tRPC v10.45.2
 *  - adapter: @trpc/server/adapters/next (Next/Nitro)
 *  - Prisma SQL auto-logging (optional)
 *  - Zod error pretty logging (including when wrapped in TRPCError.cause)
 *  - request-scoped child loggers (traceId, userId, sessionId, deviceId injection)
 *  - automatic logging of req.body / req.query / req.params (masked)
 *  - correlation-id propagation (x-trace-id)
 *  - pino-pretty in non-production
 *
 * Usage:
 * 1) Place this file, e.g. src/utils/enhanced-logger.ts
 *
 * 2) In your createContext (existing), at the end:
 *    import { attachLoggerToContext } from 'src/utils/enhanced-logger';
 *
 *    export async function createContext({ req, res }) {
 *      const base = { req, res, user: req.user, session: req.session, /* ... * / };
 *      return attachLoggerToContext(base);
 *    }
 *
 * 3) In your custom handler (createCustomTrpcNitroHandler), pass onError:
 *    import { createTrpcOnErrorHandler } from 'src/utils/enhanced-logger';
 *    const onError = createTrpcOnErrorHandler();
 *    // pass `onError` into resolveHTTPResponse options (or into createCustomTrpcNitroHandler)
 *
 * 4) In procedures you can:
 *    ctx.logger.info("something");
 *    ctx.logger.debug({ foo: "bar" });
 *    ctx.logger.zodError(zErr, { extra: 'info' });
 *
 * Notes:
 * - This file doesn't import your prisma instance by default. If you want automatic Prisma logging,
 *   import your prisma client here and call `attachPrismaLogger(prisma)`.
 */

import { randomUUID } from 'crypto';

import type { TRPCError } from '@trpc/server';
import pino, { Logger as PinoLogger } from 'pino';
import { z } from 'zod';

//
// CONFIG
//
const DEFAULT_MASK_REGEX: RegExp[] = [
  /password/i,
  /token/i,
  /secret/i,
  /authorization/i,
  /card/i,
  /api[_-]?key/i,
  /\b(?:\d[ -]*?){13,19}\b/, // card numbers-ish
  /bearer\s+[A-Za-z0-9\._\-]+/i,
];

const IS_PRETTY = process.env['NODE_ENV'] !== 'production'; // use pino-pretty in dev

/* ======================================================================================
 * Helpers: masking, stack parsing
 * ==================================================================================== */

export function maskSensitiveData(
  obj: any,
  patterns: RegExp[] = DEFAULT_MASK_REGEX
): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      let s = obj;
      for (const r of patterns) s = s.replace(r, '***MASKED***');
      return s;
    }
    return obj;
  }

  if (Array.isArray(obj))
    return obj.map(item => maskSensitiveData(item, patterns));

  const out: any = {};
  for (const k of Object.keys(obj)) {
    try {
      const v = obj[k];
      if (v === null || v === undefined) {
        out[k] = v;
        continue;
      }
      if (typeof v === 'object') out[k] = maskSensitiveData(v, patterns);
      else {
        const keyMatches = patterns.some(r => r.test(k));
        const valMatches =
          typeof v === 'string' && patterns.some(r => r.test(v));
        if (keyMatches || valMatches) out[k] = '***MASKED***';
        else out[k] = v;
      }
    } catch {
      out[k] = obj[k];
    }
  }
  return out;
}

const captureStack = (): string | undefined => {
  const o: any = {};
  Error.captureStackTrace(o, captureStack);
  return o.stack;
};

const parseFirstFrame = (stack?: string) => {
  if (!stack) return undefined;
  const lines = stack
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  // skip first line (error message)
  for (let i = 1; i < lines.length; i++) {
    const ln = lines[i];
    // try (path:line:col) and at path:line:col
    const m =
      ln.match(/\((.+?):(\d+):(\d+)\)$/) || ln.match(/at (.+?):(\d+):(\d+)$/);
    if (m) {
      return { file: m[1], line: Number(m[2]), column: Number(m[3]) };
    }
  }
  return undefined;
};

/* ======================================================================================
 * Base Pino logger
 * ==================================================================================== */

export const baseLogger: PinoLogger = pino({
  level: process.env['LOG_LEVEL'] ?? 'debug',
  transport: IS_PRETTY
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: false,
        },
      }
    : undefined,
  formatters: {
    log(obj) {
      return obj; // keep structured
    },
  },
});

/* ======================================================================================
 * Request-bound logger factory
 * ==================================================================================== */

export function createRequestLogger(opts: {
  traceId: string;
  userId?: string | null;
  sessionId?: string | null;
  deviceId?: string | null;
  enabled?: boolean;
  maskRegexList?: RegExp[];
}) {
  const traceId = String(opts.traceId ?? randomUUID());
  const userId = opts.userId ?? null;
  const sessionId = opts.sessionId ?? null;
  const deviceId = opts.deviceId ?? null;
  const enabled = opts.enabled ?? true;
  const maskRegexList = opts.maskRegexList ?? DEFAULT_MASK_REGEX;

  const child = baseLogger.child({ traceId, userId, sessionId, deviceId });

  const emit = (
    level: 'info' | 'debug' | 'warn' | 'error',
    payload?: any,
    meta?: any
  ) => {
    if (!enabled) return;

    // If this is an object with cause that's a ZodError (TRPC wraps zod)
    const maybeCause = payload?.cause ?? payload?.error?.cause ?? payload;
    if (
      maybeCause &&
      typeof maybeCause === 'object' &&
      'issues' in maybeCause &&
      Array.isArray(maybeCause.issues)
    ) {
      // It's a ZodError-like
      const zErr = maybeCause as z.ZodError;
      const issues = zErr.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
        // some issues have "received" and "options" fields — include if present
        received: (i as any).received,
        options: (i as any).options,
      }));
      const zpayload = {
        event: 'zod_error',
        issues,
        message: zErr.message,
        context: meta ?? null,
      };
      const masked = maskSensitiveData(zpayload, maskRegexList);
      child.error(masked);
      return;
    }

    // If payload is TRPCError-like with .cause being ZodError
    if (
      payload &&
      typeof payload === 'object' &&
      'cause' in payload &&
      payload.cause &&
      typeof payload.cause === 'object' &&
      'issues' in payload.cause
    ) {
      const zErr = payload.cause as z.ZodError;
      const issues = zErr.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
        received: (i as any).received,
        options: (i as any).options,
      }));
      const zpayload = {
        event: 'zod_error',
        issues,
        trpcMessage: payload.message ?? payload?.stack ?? null,
        context: meta ?? payload?.context ?? null,
      };
      const masked = maskSensitiveData(zpayload, maskRegexList);
      child.error(masked);
      return;
    }

    // Standard error object handling (Error instances or TRPCError)
    if (
      payload instanceof Error ||
      (payload && typeof payload === 'object' && 'stack' in payload)
    ) {
      const errObj: any = payload instanceof Error ? payload : (payload as any);
      const stack = errObj.stack ?? captureStack();
      const frame = parseFirstFrame(stack);
      const out: any = {
        event: 'error',
        name: errObj.name ?? 'Error',
        message: errObj.message ?? String(errObj),
        stack,
        stackFrame: frame,
        meta: meta ?? null,
      };
      // if it's TRPCError, include code/context/input/path if present
      if (payload && typeof payload === 'object') {
        if ((payload as any).code) out.trpcCode = (payload as any).code;
        if ((payload as any).input) out.trpcInput = (payload as any).input;
        if ((payload as any).path) out.trpcPath = (payload as any).path;
        if ((payload as any).type) out.trpcType = (payload as any).type;
        if ((payload as any).cause)
          out.cause = (payload as any).cause?.message ?? (payload as any).cause;
      }
      const masked = maskSensitiveData(out, maskRegexList);
      child.error(masked);
      return;
    }

    // Normal structured or string payloads
    const structured =
      typeof payload === 'string' ? { message: payload } : (payload ?? {});
    if (meta && typeof meta === 'object') structured._meta = meta;
    const masked = maskSensitiveData(structured, maskRegexList);
    (child as any)[level](masked);
  };

  return {
    traceId,
    info: (p?: any, meta?: any) => emit('info', p, meta),
    debug: (p?: any, meta?: any) => emit('debug', p, meta),
    warn: (p?: any, meta?: any) => emit('warn', p, meta),
    error: (p?: any, meta?: any) => emit('error', p, meta),
    log: (p?: any, meta?: any) => emit('info', p, meta),

    // Pretty Zod helper
    zodError: (err: z.ZodError, contextInfo?: any) => {
      const issues = err.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
        received: (i as any).received,
        options: (i as any).options,
      }));
      const payload = {
        event: 'zod_error',
        issues,
        message: err.message,
        context: contextInfo ?? null,
      };
      child.error(maskSensitiveData(payload, maskRegexList));
    },

    // full error with stack
    errorWithStack: (err: Error, contextInfo?: any) => {
      const stack = err.stack ?? captureStack();
      const frame = parseFirstFrame(stack);
      const payload: any = {
        event: 'error',
        name: err.name,
        message: err.message,
        stack,
        stackFrame: frame,
        context: contextInfo ?? null,
      };
      child.error(maskSensitiveData(payload, maskRegexList));
    },

    child: (meta?: Record<string, any>) =>
      createRequestLogger({
        traceId,
        userId,
        sessionId,
        deviceId,
        enabled,
        maskRegexList: maskRegexList.concat(meta ? [] : []),
      }),
  };
}

/* ======================================================================================
 * attachLoggerToContext(ctx)
 * - injects ctx.logger and ctx.traceId into existing context object
 * - auto logs req.body/query/params (masked)
 * ==================================================================================== */

export function attachLoggerToContext(ctx: any) {
  const req = ctx?.req ?? ctx?.event?.node?.req ?? undefined; // adapt to variety of shapes
  const traceIdHeader = (() => {
    const h = req?.headers?.['x-trace-id'] ?? req?.headers?.['trace-id'];
    if (!h) return undefined;
    return Array.isArray(h) ? String(h[0]) : String(h);
  })();
  const traceId = traceIdHeader ?? randomUUID();

  const deviceIdHeader = (() => {
    const h = req?.headers?.['x-device-id'];
    if (!h) return undefined;
    return Array.isArray(h) ? String(h[0]) : String(h);
  })();

  const logger = createRequestLogger({
    traceId,
    userId: ctx?.user?.id ?? null,
    sessionId: ctx?.session?.id ?? null,
    deviceId: deviceIdHeader ?? null,
    enabled: true,
    maskRegexList: DEFAULT_MASK_REGEX,
  });

  // Auto log incoming data (safe: masked)
  try {
    if (req) {
      if (req.body)
        logger.info({
          event: 'request_body',
          body: maskSensitiveData(req.body),
        });
      if (req.query)
        logger.info({
          event: 'request_query',
          query: maskSensitiveData(req.query),
        });
      if (req.params)
        logger.info({
          event: 'request_params',
          params: maskSensitiveData(req.params),
        });
    }
  } catch (e) {
    // non-fatal
    logger.debug({ event: 'auto_log_failed', reason: String(e) });
  }

  return { ...ctx, logger, traceId };
}

/* ======================================================================================
 * Helper: createTrpcOnErrorHandler
 * - returns a function suitable to pass as `onError` to resolveHTTPResponse
 * - ensures TRPC/Zod errors are logged prettily via ctx.logger if available,
 *   otherwise falls back to console.error
 * ==================================================================================== */

export function createTrpcOnErrorHandler(options?: {
  fallbackToConsole?: boolean;
}) {
  const fallbackToConsole = options?.fallbackToConsole ?? true;

  return (o: {
    error: TRPCError;
    type: any;
    path: string | undefined;
    input: unknown;
    ctx?: any;
    // note: TRPC onError payload also contains other fields; we handle main ones
  }) => {
    try {
      const ctx = (o as any).ctx;
      const payload = o.error as any;

      // If ctx exists and has logger -> use it
      if (ctx?.logger) {
        // If error.cause is ZodError (or payload itself is ZodError)
        if (
          payload?.cause &&
          typeof payload.cause === 'object' &&
          'issues' in payload.cause
        ) {
          ctx.logger.error({
            event: 'zod_error',
            path: o.path,
            type: o.type,
            input: maskSensitiveData(o.input),
            issues: (payload.cause as z.ZodError).issues.map(i => ({
              path: i.path.join('.'),
              message: i.message,
              code: i.code,
              received: (i as any).received,
              options: (i as any).options,
            })),
            message: payload.message ?? payload.cause?.message ?? null,
          });
          return;
        }

        // General TRPCError or Error: include code, path, input, stack
        ctx.logger.error({
          event: 'trpc_error',
          path: o.path,
          type: o.type,
          input: maskSensitiveData(o.input),
          trpcCode: payload?.code ?? null,
          message: payload?.message ?? null,
          stack: payload?.stack ?? undefined,
          cause: payload?.cause
            ? typeof payload.cause === 'object'
              ? ((payload.cause as any).message ?? payload.cause)
              : String(payload.cause)
            : undefined,
        });
        return;
      }

      // No ctx.logger — fallback
      if (fallbackToConsole) {
        if (
          payload?.cause &&
          typeof payload.cause === 'object' &&
          'issues' in payload.cause
        ) {
          console.error('[tRPC][ZOD ERROR]', {
            path: o.path,
            type: o.type,
            input: o.input,
            issues: (payload.cause as z.ZodError).issues,
            message: payload.message ?? payload.cause?.message ?? null,
          });
        } else {
          console.error('[tRPC][ERROR]', {
            path: o.path,
            type: o.type,
            input: o.input,
            code: payload?.code ?? null,
            message: payload?.message ?? null,
            stack: payload?.stack,
            cause: payload?.cause,
          });
        }
      }
    } catch (err) {
      // last-resort fallback
      if (fallbackToConsole)
        console.error('[tRPC][onError handler failed]', String(err));
    }
  };
}

/* ======================================================================================
 * Optional: Prisma integration helper
 * ==================================================================================== */

/**
 * attachPrismaLogger(prismaClient)
 * Usage:
 *   import { attachPrismaLogger } from 'src/utils/enhanced-logger';
 *   attachPrismaLogger(prisma);
 */
export function attachPrismaLogger(prismaClient: any) {
  try {
    prismaClient.$on('query', (e: any) => {
      baseLogger.debug({
        event: 'sql_query',
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });
    prismaClient.$on('warn', (e: any) => {
      baseLogger.warn({ event: 'sql_warn', message: e.message });
    });
    prismaClient.$on('error', (e: any) => {
      baseLogger.error({ event: 'sql_error', message: e.message });
    });
  } catch (err) {
    baseLogger.warn({
      event: 'attachPrismaLogger_failed',
      reason: String(err),
    });
  }
}

export default {
  baseLogger,
  createRequestLogger,
  attachLoggerToContext,
  createTrpcOnErrorHandler,
  attachPrismaLogger,
  maskSensitiveData,
};
