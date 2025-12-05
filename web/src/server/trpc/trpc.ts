/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import { Context } from './context';
import {
    catchPrismaErrors,
    ifPayloadIsTRPCErrorLikeWithCauseBeingZodError,
    ifThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod,
    maskSensitiveData,
    normalStructuredOrStringPayloads,
    standardErrorObjectHandlingErrorInstancesOrTRPCError,
} from '../utils/enhanced-logger';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, ...data }) => {
    const payload = maskSensitiveData(
      (typeof data === 'object' &&
        'error' in data &&
        typeof data['error'] === 'object' &&
        'cause' in data['error'] &&
        data?.error?.cause) ||
        shape.data
    );

    // catchPrismaErrors
    if (
      catchPrismaErrors(
        payload,
        null,
        payload => ((shape.data as any).error = payload)
      )
    ) {
      return shape;
    }

    // IfThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod
    // If this is an object with cause that's a ZodError (TRPC wraps zod)
    if (
      ifThisIsAnObjectWithCauseThatsAZodErrorTRPCWrapsZod(
        payload,
        null,
        payload => ((shape.data as any).error = payload)
      )
    ) {
      return shape;
    }

    // ifPayloadIsTRPCErrorLikeWithCauseBeingZodError
    // If payload is TRPCError-like with .cause being ZodError
    if (
      ifPayloadIsTRPCErrorLikeWithCauseBeingZodError(
        payload,
        null,
        payload => ((shape.data as any).error = payload)
      )
    ) {
      return shape;
    }

    // standardErrorObjectHandlingErrorInstancesOrTRPCError
    // Standard error object handling (Error instances or TRPCError)
    if (
      standardErrorObjectHandlingErrorInstancesOrTRPCError(
        payload,
        null,
        payload => ((shape.data as any).error = payload)
      )
    ) {
      return shape;
    }

    // normalStructuredOrStringPayloads
    // Normal structured or string payloads
    normalStructuredOrStringPayloads(
      payload,
      null,
      payload => ((shape.data as any).error = payload)
    );
    /*
{
    "issues": [
        {
            "code": "invalid_type",
            "expected": "object",
            "received": "undefined",
            "path": [
                "options",
                "items",
                1
            ],
            "message": "Required"
        }
    ],
    "name": "ZodError"
}
{
    "issues": [
        {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
                "options",
                "items",
                1,
                "icon"
            ],
            "message": "Required"
        },
        {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
                "options",
                "items",
                1,
                "color"
            ],
            "message": "Required"
        },
        {
            "code": "invalid_type",
            "expected": "number",
            "received": "undefined",
            "path": [
                "options",
                "items",
                1,
                "minValue"
            ],
            "message": "Required"
        },
        {
            "code": "invalid_type",
            "expected": "number",
            "received": "undefined",
            "path": [
                "options",
                "items",
                1,
                "maxValue"
            ],
            "message": "Required"
        }
    ],
    "name": "ZodError"
}

{
    "code": "P2002",
    "meta": {
        "modelName": "Dashboard",
        "driverAdapterError": {
            "name": "DriverAdapterError",
            "message": "UniqueConstraintViolation",
            "cause": {
                "originalCode": "23505",
                "originalMessage": "duplicate key value violates unique constraint \"UQ_DASHBOARD__USER_ID_NAME\"",
                "kind": "UniqueConstraintViolation",
                "constraint": {
                    "fields": [
                        "\"userId\"",
                        "name"
                    ]
                }
            }
        }
    },
    "clientVersion": "6.19.0",
    "name": "PrismaClientKnownRequestError"
}
*/
    return shape;
  },
});
/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
