/* eslint-disable @typescript-eslint/no-unused-vars */
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
 * 3) In procedures you can:
 *    ctx.logger.info("something");
 *    ctx.logger.debug({ foo: "bar" });
 *    ctx.logger.zodError(zErr, { extra: 'info' });
 *
 * Notes:
 * - This file doesn't import your prisma instance by default. If you want automatic Prisma logging,
 *   import your prisma client here and call `attachPrismaLogger(prisma)`.
 */

import { randomUUID } from 'crypto';

import pino, { Logger as PinoLogger } from 'pino';
import { any, z } from 'zod';

import { SerializeOptions } from './cookie';
import {
  ClientStandardErrorType,
  ClientValidationErrorType,
} from '../types/client-error-type';
import {
  PrismaErrorType,
  StandardErrorType,
  ZodErrorType,
} from '../types/error-type';

// Define the Logger interface
export interface CustomLoggerType {
  traceId: string;
  info: (payload?: any, meta?: any) => void;
  debug: (payload?: any, meta?: any) => void;
  warn: (payload?: any, meta?: any) => void;
  error: (payload?: any, meta?: any) => void;
  log: (payload?: any, meta?: any) => void;
  zodError: (err: z.ZodError, contextInfo?: any) => void;
  errorWithStack: (err: Error, contextInfo?: any) => void;
  child: (meta?: Record<string, any>) => CustomLoggerType;
}

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

export function ifThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod({
  payload,
  meta,
  callback,
}: {
  payload: any;
  meta?: any;
  callback?: ({
    serverError,
    clientError,
  }: {
    serverError: ZodErrorType;
    clientError: ClientValidationErrorType;
  }) => void;
}) {
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
    const serverError: ZodErrorType = {
      event: 'zod_error',
      issues,
      message: zErr.message,
      context: meta ?? null,
    };
    const clientError: ClientValidationErrorType = {
      event: 'validation_error',
      fields: issues.map(i => ({
        path: i.path,
        code: i.code,
        message: [i.message],
      })),
    };
    if (callback) {
      callback({ serverError, clientError });
    }
    return { serverError, clientError };
  }
  return null;
}

// standardErrorObjectHandlingErrorInstancesOrTRPCError
export function standardErrorObjectHandlingErrorInstancesOrTRPCError(
  payload: any,
  meta?: any,
  callback?: ({
    serverError,
    clientError,
  }: {
    serverError: StandardErrorType;
    clientError: ClientStandardErrorType;
  }) => void
) {
  if (
    payload instanceof Error ||
    (payload && typeof payload === 'object' && 'stack' in payload)
  ) {
    const errObj: any = payload instanceof Error ? payload : (payload as any);
    const stack = errObj.stack ?? captureStack();
    const frame = parseFirstFrame(stack);
    const out: StandardErrorType = {
      event: 'standard_error',
      name: errObj.name ?? 'Error',
      message:
        errObj.message || typeof errObj === 'object'
          ? errObj.stack
          : String(errObj),
      data: { ...errObj },
      stack,
      stackFrame: frame,
      meta: meta ?? null,
      trpcCode: any,
      trpcInput: any,
      trpcPath: any,
      trpcType: any,
      cause: any,
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
    if (callback) {
      callback({
        serverError: out,
        clientError: {
          code: errObj.code,
          event: 'error',
          message: out.message,
          metadata: errObj.metadata,
        },
      });
    }
    return {
      serverError: out,
      clientError: {
        code: errObj.code,
        event: 'error',
        message: out.message,
        metadata: errObj.metadata,
      },
    };
  }
  return null;
}

// catchPrismaErrors
export function catchPrismaErrors(
  payload: any,
  meta?: any,
  callback?: ({
    serverError,
    clientError,
  }: {
    serverError: PrismaErrorType;
    clientError: ClientValidationErrorType | ClientStandardErrorType;
  }) => void
) {
  if (
    payload &&
    typeof payload === 'object' &&
    'name' in payload &&
    payload['name'].startsWith('Prisma')
  ) {
    const serverError: PrismaErrorType = {
      event: 'prisma_error',
      name: payload.name,
      code: payload.code,
      message: payload.message,
      meta: meta ?? null,
    };
    try {
      serverError.cause =
        (payload as any).meta.driverAdapterError.cause ||
        (payload as any).meta.driverAdapterError.message;

      if (serverError.cause?.originalCode) {
        serverError.code = serverError.cause.originalCode;
      }
      if (serverError.cause?.originalMessage) {
        serverError.message = serverError.cause.originalMessage;
      }
    } catch (err) {
      //
    }

    const clientError: ClientValidationErrorType | ClientStandardErrorType =
      serverError.cause?.constraint
        ? {
            event: 'validation_error',
            fields: serverError.cause
              ? serverError.cause.constraint.fields
                  .map(f => f.split('"').join(''))
                  .map(f => ({
                    code: serverError.code,
                    path: f,
                    message: [
                      serverError.message?.toLowerCase().includes('unique')
                        ? 'Unique constraint violation'
                        : serverError.message,
                    ],
                  }))
              : [],
          }
        : {
            event: 'error',
            code: serverError.code,
            message: serverError.message,
          };

    if (callback) {
      callback({
        serverError,
        clientError,
      });
    }

    return {
      serverError,
      clientError,
    };
  }
  return null;
}

// normalStructuredOrStringPayloads
export function normalStructuredOrStringPayloads(
  payload: any,
  meta?: any,
  callback?: (payload: any, original: any) => void
) {
  const structured =
    typeof payload === 'string' ? { message: payload } : (payload ?? {});
  if (meta && typeof meta === 'object') structured._meta = meta;
  if (callback) {
    callback(structured, payload);
  }
}

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
    if (!enabled) {
      return;
    }

    // catchPrismaErrors
    if (
      catchPrismaErrors(payload, meta, ({ serverError }) => {
        const masked = maskSensitiveData(serverError, maskRegexList);
        child.error(masked);
      })
    ) {
      return;
    }

    // IfThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod
    // If this is an object with cause that's a ZodError (TRPC wraps zod)
    if (
      ifThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod({
        payload,
        meta,
        callback: ({ serverError }) => {
          const masked = maskSensitiveData(serverError, maskRegexList);
          child.error(masked);
        },
      })
    ) {
      return;
    }

    // standardErrorObjectHandlingErrorInstancesOrTRPCError
    // Standard error object handling (Error instances or TRPCError)
    if (
      standardErrorObjectHandlingErrorInstancesOrTRPCError(
        payload,
        meta,
        ({ serverError }) => {
          const masked = maskSensitiveData(serverError, maskRegexList);
          child.error(masked);
        }
      )
    ) {
      return;
    }

    // normalStructuredOrStringPayloads
    // Normal structured or string payloads
    normalStructuredOrStringPayloads(payload, meta, (result, original) => {
      const masked = maskSensitiveData(
        result.serverError || result,
        maskRegexList
      );
      (child as any)[level](masked);
    });
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

    child: (meta?: Record<string, any>): CustomLoggerType =>
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

export function attachLoggerToContext(ctx: {
  deviceId?: any;
  setCookie?:
    | ((
        name: string,
        value?: string | null,
        options?: SerializeOptions
      ) => void)
    | ((
        name: string,
        value?: string | null,
        options?: SerializeOptions
      ) => void);
  getCookie?:
    | ((name: string) => string | undefined)
    | ((name: string) => string | undefined);
  clearCookies?:
    | ((options?: SerializeOptions) => void)
    | ((options?: SerializeOptions) => void);
  req?: any;
  user?: any;
  session?: any;
  event?: any;
}) {
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
      baseLogger.warn({
        event: 'sql_warn',
        message: e.message,
      });
    });
    prismaClient.$on('error', (e: any) => {
      baseLogger.error({
        event: 'sql_error',
        message: e.message,
      });
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
  attachPrismaLogger,
  maskSensitiveData,
};
