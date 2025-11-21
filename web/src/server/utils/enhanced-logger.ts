/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*****************************************************************************************
 * 🔥 ENHANCED LOGGER — TRPC + Zod + Auto-Masking + Correlation-id
 *
 * Как использовать:
 * -----------------
 * 1) Положить этот файл, например: src/lib/enhancedLogger.ts
 *
 * 2) Подключить в createContext:
 *    import { attachLoggerToContext } from "./enhancedLogger";
 *
 *    export async function createContext({ req, res }) {
 *      const baseCtx = { req, res, user: req.user, session: req.session };
 *      return attachLoggerToContext(baseCtx);
 *
 * 3) В TRPC процедурах:
 *    ctx.logger.info("Hello world");
 *    ctx.logger.debug({ body: ctx.req.body });
 *    ctx.logger.zodError(err, { extra: "context info" });
 *
 *****************************************************************************************/

import { randomUUID } from 'crypto';

import pino, { Logger as PinoLogger } from 'pino';
import { z } from 'zod';

import 'pino-pretty';
import { ENVIRONMENTS } from '../env';

/* ======================================================================================
 * SENSITIVE DATA MASKING
 * ==================================================================================== */
export const maskSensitiveData = (obj: any, patterns: RegExp[]): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const out = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key of Object.keys(out)) {
    const val = out[key];
    if (typeof val === 'object' && val !== null) {
      out[key] = maskSensitiveData(val, patterns);
      continue;
    }
    if (patterns.some(r => r.test(key) || r.test(String(val)))) {
      out[key] = '***MASKED***';
    }
  }
  return out;
};

/* ======================================================================================
 * STACK TRACE CAPTURE AND SOURCE MAPPING
 * ==================================================================================== */
const captureStackTrace = (): string | undefined => {
  const obj: any = {};
  Error.captureStackTrace(obj, captureStackTrace);
  return obj.stack;
};

const mapCompiledPathToSource = (compiledPath: string): string => {
  return compiledPath;
};

const parseStackTrace = (
  stack: string | undefined,
  error?: any
): { file: string; line: number; column: number; stack: any } | null => {
  if (!stack) return null;

  // Parse the stack trace to extract file path, line and column
  const lines = stack.split('\n');
  // Skip the first line (Error message) and get the first stack frame
  const stackLine = lines[2] || lines[1]; // Sometimes the first real frame is at index 2

  if (stackLine) {
    // Match pattern like: at functionName (/path/to/file.ts:123:45)
    const match =
      stackLine.match(/at .*?\((.+?):(\d+):(\d+)\)/) ||
      stackLine.match(/at (.+?):(\d+):(\d+)/);

    if (match) {
      const filePath = mapCompiledPathToSource(match[1]);

      return {
        file: filePath,
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        stack: String(error),
      };
    }
  }

  return null;
};

/* ======================================================================================
 * BASE LOGGER
 * ==================================================================================== */
export const baseLogger: PinoLogger = pino({
  level: process.env['LOG_LEVEL'] || 'debug',
  transport: ENVIRONMENTS.MY_DASHBOARD_PRETTY_LOGS
    ? {
        target: 'pino-pretty',
        options: { colorize: true, singleLine: false },
      }
    : undefined,
  formatters: {
    log(obj) {
      return obj;
    },
  },
});

/* ======================================================================================
 * REQUEST-BOUND LOGGER FACTORY
 * ==================================================================================== */
export function createRequestLogger(opts: {
  traceId: string;
  userId?: string | null;
  sessionId?: string | null;
  deviceId?: string | null;
  enabled: boolean;
  maskRegexList: RegExp[];
}) {
  const { traceId, userId, sessionId, deviceId, enabled, maskRegexList } = opts;
  const instance = baseLogger.child({ traceId, userId, sessionId, deviceId });

  const emit = (
    level: 'info' | 'debug' | 'warn' | 'error',
    payload?: any,
    ...args: any
  ) => {
    if (!enabled) return;

    // Capture stack trace for error logs
    let stackTraceInfo = payload.stackTrace || null;
    if (level === 'error' && !stackTraceInfo) {
      try {
        const stack = payload?.stack || captureStackTrace();
        stackTraceInfo = parseStackTrace(stack, payload);
      } catch (err) {
        const stack = captureStackTrace();
        stackTraceInfo = parseStackTrace(stack);
      }
    }

    const structured =
      typeof payload === 'string' ? { message: payload } : payload || {};

    // Add stack trace info for errors
    if (stackTraceInfo && level === 'error') {
      structured.stackTrace = {
        file: stackTraceInfo.file,
        line: stackTraceInfo.line,
        column: stackTraceInfo.column,
      };
    }

    try {
      structured.errorClass = payload?.stack?.split(':')?.[0];
    } catch (error) {
      structured.errorClass = payload.name;
    }
    const masked = maskSensitiveData(structured, maskRegexList);
    instance[level](masked);
  };

  return {
    traceId,
    info: (...msg: any) => emit('info', ...msg),
    debug: (...msg: any) => emit('debug', ...msg),
    warn: (...msg: any) => emit('warn', ...msg),
    error: (...msg: any) => emit('error', ...msg),
    log: (...msg: any) => emit('info', ...msg),

    child() {
      return createRequestLogger({
        traceId,
        userId,
        sessionId,
        deviceId,
        enabled,
        maskRegexList,
      });
    },

    // Красивое логирование Zod ошибок
    zodError: (err: z.ZodError, contextInfo?: any) => {
      const issues = err.issues.map(i => ({
        name: err.name,
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
      }));

      // Include the original error stack trace
      const stackTraceInfo = parseStackTrace(err.stack, err);

      emit('error', {
        event: 'zod_error',
        issues,
        context: contextInfo,
        originalError: {
          name: err.name,
          message: err.message,
          stack: err.stack,
          stackTrace: stackTraceInfo
            ? {
                file: stackTraceInfo.file,
                line: stackTraceInfo.line,
                column: stackTraceInfo.column,
              }
            : undefined,
        },
      });
    },

    // Enhanced error logging with full stack trace information
    errorWithStack: (err: Error, contextInfo?: any) => {
      const stackTraceInfo = parseStackTrace(err.stack, err);

      emit('error', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        stackTrace: stackTraceInfo
          ? {
              file: stackTraceInfo.file,
              line: stackTraceInfo.line,
              column: stackTraceInfo.column,
            }
          : undefined,
        context: contextInfo,
      });
    },
  };
}

/* ======================================================================================
 * CONTEXT MODIFIER
 * ==================================================================================== */
export function attachLoggerToContext(ctx: any) {
  const req = ctx.req;

  // correlation-id / trace-id
  const traceId =
    req?.headers?.['x-trace-id'] || req?.headers?.['trace-id'] || randomUUID();

  // Handle the case where headers might be arrays
  const getHeaderAsString = (
    header: string | string[] | undefined
  ): string | undefined => {
    if (Array.isArray(header)) {
      return header[0]; // Take the first value if it's an array
    }
    return header;
  };

  const deviceIdHeader = getHeaderAsString(req?.headers?.['x-device-id']);
  const enabled = true; // всегда логируем

  const logger = createRequestLogger({
    traceId: traceId.toString(), // Ensure it's a string
    enabled,
    userId: ctx.user?.id ?? null,
    sessionId: ctx.session?.id ?? null,
    deviceId: deviceIdHeader ?? null,
    maskRegexList: [
      /password/i,
      /token/i,
      /secret/i,
      /authorization/i,
      /card/i,
    ],
  });

  // Авто-логирование входящих данных
  if (req?.body) logger.info({ event: 'request_body', body: req.body });
  if (req?.query) logger.info({ event: 'request_query', query: req.query });
  if (req?.params) logger.info({ event: 'request_params', params: req.params });

  return { ...ctx, logger, traceId: traceId.toString() };
}
