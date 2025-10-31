import { EnvSchema } from './types/EnvSchema';

export const ENVIRONMENTS = process.env ? EnvSchema.parse(process.env) : {};
