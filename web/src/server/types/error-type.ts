/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export type ZodErrorType = {
  event: 'zod_error';
  issues: {
    path: string;
    message: string | null;
    code: string;
    received: string;
    options: null;
  }[];
  message: string | null;
  context: null;
};

export type PrismaErrorType = {
  event: 'prisma_error';
  name: string;
  code: string;
  message: string | null;
  meta: any | null;
  cause?: {
    originalCode: string;
    originalMessage: string;
    kind: string;
    constraint: {
      fields: string[];
    };
  };
};

export type StandardErrorType = {
  event: 'standard_error';
  name: any;
  message: any;
  data: any;
  stack: any;
  stackFrame:
    | {
        file: string;
        line: number;
        column: number;
      }
    | undefined;
  meta: any;
  trpcCode: (params?: z.RawCreateParams) => z.ZodAny;
  trpcInput: (params?: z.RawCreateParams) => z.ZodAny;
  trpcPath: (params?: z.RawCreateParams) => z.ZodAny;
  trpcType: (params?: z.RawCreateParams) => z.ZodAny;
  cause: (params?: z.RawCreateParams) => z.ZodAny;
};

export type ErrorType = ZodErrorType | PrismaErrorType | StandardErrorType;
