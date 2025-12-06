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
  message: null;
  meta: null;
  cause?: {
    originalCode: string;
    originalMessage: string;
    kind: string;
    constraint: {
      fields: string[];
    };
  };
};

export type ErrorType = ZodErrorType | PrismaErrorType;
