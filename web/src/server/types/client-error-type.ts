/* eslint-disable @typescript-eslint/no-explicit-any */

export type ClientValidationErrorType = {
  event: 'validation_error';
  fields: {
    code: string;
    path: string;
    message?: (string | null | undefined)[];
    metadata?: any;
  }[];
};

export type ClientStandardErrorType = {
  event: 'error';
  code: string;
  message?: string | null;
  metadata?: any;
};

export type ClientErrorType =
  | ClientValidationErrorType
  | ClientStandardErrorType;
