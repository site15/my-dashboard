import { EnvSchema, EnvType } from './types/EnvSchema';

export const ENVIRONMENTS = process.env
  ? EnvSchema.parse(process.env)
  : ({} as EnvType);
